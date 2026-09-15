import test from "node:test";
import assert from "node:assert/strict";
import { placeOrder, productSchema } from "../validation.js";
import { hashPassword, checkPassword } from "../auth.js";
const id = "00000000-0000-4000-8000-000000000001";
const state = () => ({
  products: [
    {
      id,
      name: "Sample",
      status: "active",
      stock: 2,
      price: 10.01,
      salePrice: null,
    },
  ],
  orders: [],
});
test("orders use server prices and reduce inventory", () => {
  const s = state(),
    o = placeOrder(s, "user", { items: [{ id, quantity: 2, price: 0 }] });
  assert.equal(o.subtotal, 20.02);
  assert.equal(o.shipping, 1);
  assert.equal(o.total, 21.02);
  assert.equal(s.products[0].stock, 0);
  assert.equal(o.simulated, true);
  assert.equal(o.status, "pending");
});
test("insufficient stock does not create an order or change inventory", () => {
  const s = state();
  assert.throws(() => placeOrder(s, "user", { items: [{ id, quantity: 3 }] }));
  assert.equal(s.orders.length, 0);
  assert.equal(s.products[0].stock, 2);
});
test("duplicate items cannot bypass inventory limits", () => {
  const s = state();
  assert.throws(() =>
    placeOrder(s, "user", {
      items: [
        { id, quantity: 2 },
        { id, quantity: 2 },
      ],
    }),
  );
  assert.equal(s.products[0].stock, 2);
});
test("invalid quantities and unpublished products are rejected", () => {
  for (const quantity of [0, -1, 1.5, 100])
    assert.throws(() =>
      placeOrder(state(), "user", { items: [{ id, quantity }] }),
    );
  const s = state();
  s.products[0].status = "draft";
  assert.throws(() => placeOrder(s, "user", { items: [{ id, quantity: 1 }] }));
});
test("product validation rejects hotlinks and invalid sale prices", () => {
  const p = {
    name: "Sample",
    slug: "sample",
    sku: "S-1",
    price: 10,
    category: "Sample",
    stock: 1,
    status: "draft",
  };
  assert.equal(
    productSchema.safeParse({
      ...p,
      images: ["https://dnagenetics.com/image.jpg"],
    }).success,
    false,
  );
  assert.equal(
    productSchema.safeParse({ ...p, images: ["/uploads/../secret"] }).success,
    false,
  );
  assert.equal(productSchema.safeParse({ ...p, salePrice: 20 }).success, false);
  assert.equal(productSchema.safeParse(p).success, true);
  assert.equal(
    productSchema.safeParse({
      ...p,
      variants: [
        { size: 1, sku: "S-1-A", price: 15, salePrice: 12, stock: 5 },
        { size: 2, sku: "S-1-B", price: 25, salePrice: null, stock: 3 },
      ],
    }).success,
    true,
  );
  assert.equal(
    productSchema.safeParse({
      ...p,
      variants: [{ size: 1, sku: "S-1-A", price: 15, salePrice: 20, stock: 5 }],
    }).success,
    false,
  );
  assert.equal(
    productSchema.safeParse({
      ...p,
      variants: [
        { size: 1, sku: "S-1-A", price: 15, salePrice: null, stock: 5 },
        { size: 1, sku: "S-1-B", price: 25, salePrice: null, stock: 3 },
      ],
    }).success,
    false,
  );
});
test("passwords are salted and checked correctly", () => {
  const a = hashPassword("account-password"),
    b = hashPassword("account-password");
  assert.notEqual(a, b);
  assert.equal(checkPassword("account-password", a), true);
  assert.equal(checkPassword("incorrect-password", a), false);
});
