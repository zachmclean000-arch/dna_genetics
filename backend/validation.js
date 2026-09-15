import { z } from "zod";
export const productSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(180),
    sku: z.string().trim().min(1).max(80),
    price: z.number().min(0).max(100000),
    salePrice: z.number().min(0).nullable().default(null),
    category: z.string().min(1).max(80),
    strainType: z.string().max(80).default(""),
    description: z.string().max(10000).default(""),
    shortDescription: z.string().max(500).default(""),
    genetics: z.string().max(300).default(""),
    thc: z.string().max(80).default(""),
    floweringTime: z.string().max(80).default(""),
    yield: z.string().max(80).default(""),
    stock: z.number().int().min(0).max(100000),
    status: z.enum(["active", "draft", "archived"]),
    images: z
      .array(
        z
          .string()
          .regex(/^\/(?:assets|uploads)\/[a-zA-Z0-9_./-]+$/)
          .refine((p) => !p.includes("..")),
      )
      .max(12)
      .default([]),
    featured: z.boolean().default(false),
    bestSeller: z.boolean().default(false),
    newArrival: z.boolean().default(false),
    variants: z
      .array(
        z.object({
          id: z.uuid().optional(),
          size: z.number().int().min(1).max(100000),
          sku: z.string().trim().min(1).max(80),
          price: z.number().min(0).max(100000),
          salePrice: z.number().min(0).nullable().default(null),
          stock: z.number().int().min(0).max(100000),
        }),
      )
      .max(30)
      .default([]),
  })
  .refine((p) => p.salePrice === null || p.salePrice <= p.price, {
    message: "Sale price must not exceed regular price.",
  })
  .superRefine((product, context) => {
    const sizes = new Set();
    const skus = new Set();
    product.variants.forEach((variant, index) => {
      if (variant.salePrice !== null && variant.salePrice > variant.price)
        context.addIssue({
          code: "custom",
          path: ["variants", index, "salePrice"],
          message: "Sale price must not exceed regular price.",
        });
      if (sizes.has(variant.size))
        context.addIssue({
          code: "custom",
          path: ["variants", index, "size"],
          message: "Each variant size must be unique.",
        });
      if (skus.has(variant.sku))
        context.addIssue({
          code: "custom",
          path: ["variants", index, "sku"],
          message: "Each variant SKU must be unique.",
        });
      sizes.add(variant.size);
      skus.add(variant.sku);
    });
  });
const emailCredential = z
  .email()
  .max(254)
  .transform((s) => s.toLowerCase());
export const loginCredentials = z.object({
  email: emailCredential,
  password: z.string().min(8).max(128),
});
export const credentials = z.object({
  email: emailCredential,
  password: z.string().min(12).max(128),
});
export const campaignContactSchema = z.object({
  firstName: z.string().trim().min(1).max(150),
  lastName: z.string().trim().min(1).max(150),
  email: z.email().max(254),
  phone: z
    .string()
    .trim()
    .min(5)
    .max(150)
    .regex(/^[+\d\s().-]+$/),
  country: z.enum(["GB", "US", "CA", "OTHER"]),
  address: z.string().trim().min(1).max(150),
  address2: z.string().trim().max(150).default(""),
  city: z.string().trim().min(1).max(150),
  region: z.string().trim().max(150).default(""),
  postalCode: z.string().trim().min(1).max(150),
  paymentMethod: z.enum(["zelle", "chime", "bitcoin", "apple-pay-gift-card"]),
  orderNote: z.string().trim().max(1000).default(""),
  termsAccepted: z.literal(true),
  consent: z.boolean().optional().default(false),
});
export const orderSchema = z.object({
  contact: campaignContactSchema.optional(),
  items: z
    .array(
      z.object({
        id: z.uuid(),
        variantId: z.uuid().optional(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
});
export function placeOrder(
  state,
  userId,
  input,
  { manageInventory = true } = {},
) {
  const { items, contact } = orderSchema.parse(input);
  if (
    new Set(items.map((i) => `${i.id}:${i.variantId || ""}`)).size !==
    items.length
  )
    throw Error("Duplicate products are not allowed.");
  const lines = items.map((item) => {
    const p = state.products.find(
      (p) => p.id === item.id && p.status === "active",
    );
    const variant = p?.variants?.find((v) => v.id === item.variantId);
    if (
      !p ||
      (p.variants?.length && !variant) ||
      (item.variantId && !variant) ||
      (manageInventory && (variant || p).stock < item.quantity)
    )
      throw Error("An item is unavailable or has insufficient stock.");
    const priced = variant || p;
    return {
      ...item,
      name: p.name,
      image: p.images?.[0] || "",
      ...(variant ? { size: variant.size } : {}),
      price: priced.salePrice ?? priced.price,
    };
  });
  const subtotalCents = lines.reduce(
    (sum, i) => sum + Math.round(i.price * 100) * i.quantity,
    0,
  );
  const shippingCents =
    subtotalCents >= 12000 ? 0 : Math.round(subtotalCents * 0.05);
  const subtotal = subtotalCents / 100;
  const shipping = shippingCents / 100;
  const total = (subtotalCents + shippingCents) / 100;
  if (manageInventory)
    lines.forEach((i) => {
      const p = state.products.find((p) => p.id === i.id);
      const inventory = i.variantId
        ? p.variants.find((v) => v.id === i.variantId)
        : p;
      inventory.stock -= i.quantity;
    });
  const order = {
    id: crypto.randomUUID(),
    userId,
    items: lines,
    subtotal,
    shipping,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
    simulated: true,
    ...(!manageInventory ? { campaign: true } : {}),
    ...(contact
      ? {
          contact: {
            ...contact,
            ...(contact.consent
              ? { consentRecordedAt: new Date().toISOString() }
              : {}),
            noticeVersion: "checkout-v2",
          },
        }
      : {}),
  };
  state.orders.unshift(order);
  return order;
}
