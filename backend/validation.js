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
  })
  .refine((p) => p.salePrice === null || p.salePrice <= p.price, {
    message: "Sale price must not exceed regular price.",
  });
export const credentials = z.object({
  email: z
    .email()
    .max(254)
    .transform((s) => s.toLowerCase()),
  password: z.string().min(12).max(128),
});
export const orderSchema = z.object({
  items: z
    .array(
      z.object({ id: z.uuid(), quantity: z.number().int().min(1).max(99) }),
    )
    .min(1)
    .max(50),
});
export function placeOrder(state, userId, input) {
  const { items } = orderSchema.parse(input);
  if (new Set(items.map((i) => i.id)).size !== items.length)
    throw Error("Duplicate products are not allowed.");
  const lines = items.map((item) => {
    const p = state.products.find(
      (p) => p.id === item.id && p.status === "active",
    );
    if (!p || p.stock < item.quantity)
      throw Error("An item is unavailable or has insufficient stock.");
    return { ...item, name: p.name, price: p.salePrice ?? p.price };
  });
  const total =
    lines.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0) /
    100;
  lines.forEach(
    (i) => (state.products.find((p) => p.id === i.id).stock -= i.quantity),
  );
  const order = {
    id: crypto.randomUUID(),
    userId,
    items: lines,
    total,
    status: "simulated",
    createdAt: new Date().toISOString(),
    simulated: true,
  };
  state.orders.unshift(order);
  return order;
}
