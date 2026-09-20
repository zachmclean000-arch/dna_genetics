import "./config.js";
import express from "express";
import multer from "multer";
import { put } from "@vercel/blob";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { z } from "zod";
import { transaction } from "./store.js";
import { mountReviews } from "./reviews.js";
import { hashPassword, checkPassword, tokenHash, publicUser } from "./auth.js";
import {
  credentials,
  contactMessageSchema,
  loginCredentials,
  productSchema,
  placeOrder,
} from "./validation.js";
import {
  sendOrderNotification,
  sendOrderStatusNotification,
  sendContactNotification,
} from "./order-email.js";
const app = express(),
  root = fileURLToPath(new URL(".", import.meta.url));
mkdirSync(path.join(root, "uploads"), { recursive: true });
app.disable("x-powered-by");
const allowedOrigins = new Set(
  (process.env.APP_ORIGINS || "http://127.0.0.1:5173,http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  if (req.path.startsWith("/api")) res.setHeader("Cache-Control", "no-store");
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    req.headers.origin &&
    new URL(req.headers.origin).host !== req.headers.host &&
    !allowedOrigins.has(new URL(req.headers.origin).origin)
  )
    return res.status(403).json({ error: "Cross-origin request rejected." });
  next();
});
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(root, "uploads")));
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res)).catch(next);
app.use("/api", async (req, res, next) => {
  try {
    const token = (req.headers.cookie || "")
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.slice(8);
    req.user = token
      ? await transaction((s) => {
          const session = s.sessions.find(
            (x) => x.hash === tokenHash(token) && x.expires > Date.now(),
          );
          return session ? s.users.find((u) => u.id === session.userId) : null;
        })
      : null;
    next();
  } catch (e) {
    next(e);
  }
});
const auth = (req, res, next) =>
  req.user ? next() : res.status(401).json({ error: "Please sign in." });
const admin = (req, res, next) =>
  req.user?.role === "admin"
    ? next()
    : res.status(403).json({ error: "Administrator access required." });
const attempts = new Map();
const campaignAttempts = new Map();
mountReviews(app, { transaction, admin, wrap });
app.use("/api/auth", (req, res, next) => {
  const now = Date.now();
  for (const [key, v] of attempts) if (v.until < now) attempts.delete(key);
  const v = attempts.get(req.ip) || { count: 0, until: now + 60000 };
  v.count++;
  attempts.set(req.ip, v);
  if (v.count > 30)
    return res
      .status(429)
      .json({ error: "Too many requests. Try again in a minute." });
  next();
});
app.get("/api/auth/me", (req, res) =>
  res.json(req.user ? publicUser(req.user) : null),
);
for (const mode of ["register", "login"])
  app.post(
    `/api/auth/${mode}`,
    wrap(async (req, res) => {
      const input = (mode === "login" ? loginCredentials : credentials).parse(
          req.body,
        ),
        token = randomBytes(32).toString("hex");
      const user = await transaction((s) => {
        let u = s.users.find((u) => u.email === input.email);
        if (mode === "register") {
          if (u) throw Error("Account already exists.");
          u = {
            id: crypto.randomUUID(),
            ...input,
            password: hashPassword(input.password),
            role: "customer",
          };
          s.users.push(u);
        } else if (!u || !checkPassword(input.password, u.password))
          throw Error("Invalid email or password.");
        s.sessions = s.sessions.filter((x) => x.expires > Date.now());
        s.sessions.push({
          hash: tokenHash(token),
          userId: u.id,
          expires: Date.now() + 86400000,
        });
        return publicUser(u);
      });
      res.cookie("session", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      res.json(user);
    }),
  );
app.post(
  "/api/auth/logout",
  wrap(async (req, res) => {
    const token = (req.headers.cookie || "")
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.slice(8);
    if (token)
      await transaction((s) => {
        s.sessions = s.sessions.filter((x) => x.hash !== tokenHash(token));
      });
    res.clearCookie("session");
    res.json({ ok: true });
  }),
);
app.get(
  "/api/products",
  wrap(async (req, res) =>
    res.json(
      await transaction((s) =>
        s.products.filter(
          (p) =>
            (req.user?.role === "admin" && req.query.admin === "1") ||
            p.status === "active",
        ),
      ),
    ),
  ),
);
app.get(
  "/api/products/:slug",
  wrap(async (req, res) => {
    const product = await transaction((s) =>
      s.products.find(
        (p) =>
          (p.slug === req.params.slug || p.id === req.params.slug) &&
          (p.status === "active" || req.user?.role === "admin"),
      ),
    );
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  }),
);
const storefrontProductCategories = [
  "THCA Flower",
  "Live Rosin",
  "Vape",
  "Concentrate",
];
function validateProduct(s, input, id) {
  const p = productSchema.parse(input);
  if (
    storefrontProductCategories.includes(p.category) &&
    !s.categories.includes(p.category)
  )
    s.categories.push(p.category);
  if (!s.categories.includes(p.category))
    throw Error("Choose an existing category.");
  if (
    s.products.some(
      (x) => x.id !== id && (x.slug === p.slug || x.sku === p.sku),
    )
  )
    throw Error("Slug and SKU must be unique.");
  if (
    p.variants.some((variant) =>
      s.products.some(
        (product) =>
          product.id !== id &&
          product.variants?.some((existing) => existing.sku === variant.sku),
      ),
    )
  )
    throw Error("Variant SKUs must be unique across the catalogue.");
  return {
    ...p,
    variants: p.variants.map((variant) => ({
      ...variant,
      id: variant.id || randomUUID(),
    })),
  };
}
app.post(
  "/api/products/import",
  admin,
  wrap(async (req, res) => {
    if (!Array.isArray(req.body) || !req.body.length || req.body.length > 500)
      throw Error("Import 1–500 products as a JSON array.");
    const count = await transaction((s) => {
      for (const input of req.body) {
        const p = validateProduct(s, input);
        s.products.push({
          ...p,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return req.body.length;
    });
    res.status(201).json({ count });
  }),
);
app.post(
  "/api/products",
  admin,
  wrap(async (req, res) =>
    res.status(201).json(
      await transaction((s) => {
        const p = {
          ...validateProduct(s, req.body),
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        s.products.push(p);
        return p;
      }),
    ),
  ),
);
app.put(
  "/api/products/:id",
  admin,
  wrap(async (req, res) =>
    res.json(
      await transaction((s) => {
        const i = s.products.findIndex((p) => p.id === req.params.id);
        if (i < 0) throw Error("Product not found.");
        s.products[i] = {
          ...s.products[i],
          ...validateProduct(s, req.body, req.params.id),
          updatedAt: new Date().toISOString(),
        };
        return s.products[i];
      }),
    ),
  ),
);
app.delete(
  "/api/products/:id",
  admin,
  wrap(async (req, res) => {
    await transaction((s) => {
      s.products = s.products.filter((p) => p.id !== req.params.id);
    });
    res.json({ ok: true });
  }),
);
app.get(
  "/api/categories",
  wrap(async (req, res) => res.json(await transaction((s) => s.categories))),
);
app.post(
  "/api/categories",
  admin,
  wrap(async (req, res) => {
    const name = z.string().trim().min(1).max(80).parse(req.body.name);
    await transaction((s) => {
      if (s.categories.includes(name)) throw Error("Category already exists.");
      s.categories.push(name);
    });
    res.status(201).json({ name });
  }),
);
app.delete(
  "/api/categories/:name",
  admin,
  wrap(async (req, res) => {
    await transaction((s) => {
      if (s.products.some((p) => p.category === req.params.name))
        throw Error("Move products out of this category first.");
      s.categories = s.categories.filter((c) => c !== req.params.name);
    });
    res.json({ ok: true });
  }),
);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
});
app.post(
  "/api/uploads",
  admin,
  upload.single("image"),
  wrap(async (req, res) => {
    const b = req.file?.buffer;
    if (!b) throw Error("Choose an image.");
    let ext;
    if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
      ext = "png";
    else if (b[0] === 255 && b[1] === 216 && b[2] === 255) ext = "jpg";
    else if (
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP"
    )
      ext = "webp";
    else throw Error("Only PNG, JPEG and WebP images are supported.");
    const name = `${crypto.randomUUID()}.${ext}`;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${name}`, b, {
        access: "public",
        addRandomSuffix: true,
        contentType: req.file.mimetype,
      });
      return res.status(201).json({ path: blob.url });
    }
    writeFileSync(path.join(root, "uploads", name), b);
    res.status(201).json({ path: `/uploads/${name}` });
  }),
);
app.post(
  "/api/orders",
  auth,
  wrap(async (req, res) =>
    res
      .status(201)
      .json(await transaction((s) => placeOrder(s, req.user.id, req.body))),
  ),
);
app.post(
  "/api/campaign-orders",
  (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const entry = campaignAttempts.get(key) || { count: 0, until: now + 60000 };
    if (entry.until < now) {
      entry.count = 0;
      entry.until = now + 60000;
    }
    entry.count += 1;
    campaignAttempts.set(key, entry);
    if (entry.count > 10)
      return res
        .status(429)
        .json({ error: "Too many submissions. Try again in a minute." });
    next();
  },
  wrap(async (req, res) => {
    if (!req.body?.contact)
      return res
        .status(400)
        .json({ error: "Checkout contact details are required." });
    const order = await transaction((s) =>
      placeOrder(s, req.user?.id ?? null, req.body, { manageInventory: false }),
    );
    let notification;
    try {
      notification = await sendOrderNotification(order);
    } catch {
      notification = { sent: false, reason: "delivery-failed" };
    }
    res.status(201).json({ ...order, notification });
  }),
);
app.get(
  "/api/orders",
  auth,
  wrap(async (req, res) =>
    res.json(
      await transaction((s) =>
        s.orders.filter(
          (o) => req.user.role === "admin" || o.userId === req.user.id,
        ),
      ),
    ),
  ),
);
app.patch(
  "/api/orders/:id",
  admin,
  wrap(async (req, res) => {
    const status = z
      .enum(["pending", "in_progress", "completed", "cancelled"])
      .parse(req.body.status);
    const result = await transaction((s) => {
      const o = s.orders.find((o) => o.id === req.params.id);
      if (!o) throw Error("Order not found.");
      const previousStatus = o.status === "simulated" ? "pending" : o.status;
      if (o.status === "cancelled" && status !== "cancelled")
        throw Error("Cancelled orders cannot be reopened.");
      if (status === "cancelled" && o.status !== "cancelled")
        o.items.forEach((i) => {
          const p = s.products.find((p) => p.id === i.id);
          const inventory = i.variantId
            ? p?.variants?.find((v) => v.id === i.variantId)
            : p;
          if (inventory) inventory.stock += i.quantity;
        });
      o.status = status;
      return { order: o, changed: previousStatus !== status };
    });
    let notification = null;
    if (
      result.changed &&
      ["in_progress", "completed"].includes(status) &&
      result.order.contact
    ) {
      try {
        notification = await sendOrderStatusNotification(result.order, status);
      } catch {
        notification = { sent: false, reason: "delivery-failed" };
      }
    }
    res.json({ ...result.order, notification });
  }),
);
app.get(
  "/api/customers",
  admin,
  wrap(async (req, res) =>
    res.json(await transaction((s) => s.users.map(publicUser))),
  ),
);
app.post(
  "/api/contact",
  wrap(async (req, res) => {
    const now = Date.now();
    const key = `contact:${req.ip}`;
    const entry = campaignAttempts.get(key) || {
      count: 0,
      until: now + 60000,
    };
    if (entry.until < now) {
      entry.count = 0;
      entry.until = now + 60000;
    }
    entry.count += 1;
    campaignAttempts.set(key, entry);
    if (entry.count > 5)
      return res
        .status(429)
        .json({ error: "Too many messages. Try again in a minute." });
    const contact = contactMessageSchema.parse(req.body);
    const notification = await sendContactNotification(contact);
    if (!notification.sent)
      return res.status(503).json({
        error: "Email delivery is not configured. Please try again later.",
      });
    res.status(201).json({ message: "Thank you for contacting us." });
  }),
);
app.post(
  "/api/newsletter",
  wrap(async (req, res) => {
    const email = z.email().parse(req.body.email);
    await transaction((s) => {
      if (!s.subscribers.includes(email)) s.subscribers.push(email);
    });
    res.json({
      message: "Saved locally for DNA Genetics. No emails will be sent.",
    });
  }),
);
app.use("/api", (req, res) =>
  res.status(404).json({ error: "API route not found." }),
);
app.use(express.static(path.join(root, "../frontend/dist")));
app.get("/{*path}", (req, res) =>
  res.sendFile(path.join(root, "../frontend/dist/index.html")),
);
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError) {
    const labels = {
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      phone: "Phone number",
      country: "Country or region",
      address: "Street address",
      city: "City or town",
      postalCode: "Postcode or ZIP code",
      paymentMethod: "Payment option",
      termsAccepted: "Terms and Conditions agreement",
      consent: "Contact consent",
      name: "Product name",
      slug: "Product slug",
      sku: "SKU",
      price: "Price",
      salePrice: "Sale price",
      category: "Storefront page or category",
      stock: "Stock",
      status: "Product status",
      size: "Variant size",
      variants: "Variable price options",
    };
    const fields = [
      ...new Set(
        err.issues.map((issue) => labels[issue.path.at(-1)]).filter(Boolean),
      ),
    ];
    return res.status(400).json({
      error: fields.length
        ? `Please complete: ${fields.join(", ")}.`
        : "Please check the information entered and try again.",
      fields,
    });
  }
  res.status(400).json({ error: err.message || "Request failed." });
});
export default app;

if (!process.env.VERCEL)
  app.listen(process.env.PORT || 3001, "127.0.0.1", () =>
    console.log(
      `DNA Genetics API: http://127.0.0.1:${process.env.PORT || 3001}`,
    ),
  );
