import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { placeOrder } from "../validation.js";

function fixture() {
  const product = { id: randomUUID(), status: "active", name: "Test seeds", price: 99, stock: 0, variants: [
    { id: randomUUID(), size: 3, price: 30, salePrice: 25, stock: 5 },
    { id: randomUUID(), size: 6, price: 50, salePrice: null, stock: 4 },
  ] };
  return { product, state: { products: [product], orders: [] } };
}
test("orders price separate packs on the server and decrement only their stock", () => {
  const { product: p, state } = fixture();
  const order = placeOrder(state, randomUUID(), { items: [
    { id: p.id, variantId: p.variants[0].id, quantity: 2, price: 1 },
    { id: p.id, variantId: p.variants[1].id, quantity: 1 },
  ] });
  assert.equal(order.subtotal, 100);
  assert.equal(order.shipping, 5);
  assert.equal(order.total, 105);
  assert.deepEqual(order.items.map((i) => i.size), [3, 6]);
  assert.deepEqual(p.variants.map((v) => v.stock), [3, 3]);
  assert.equal(p.stock, 0);
});
test("missing, foreign, duplicate, or out-of-stock packs cannot be ordered", () => {
  for (const kind of ["missing", "foreign", "duplicate", "stock"]) {
    const { product: p, state } = fixture();
    const item = { id: p.id, quantity: kind === "stock" ? 6 : 1 };
    if (kind !== "missing") item.variantId = kind === "foreign" ? randomUUID() : p.variants[0].id;
    assert.throws(() => placeOrder(state, randomUUID(), { items: kind === "duplicate" ? [item, item] : [item] }));
    assert.deepEqual(p.variants.map((v) => v.stock), [5, 4]);
    assert.equal(state.orders.length, 0);
  }
});
test("shipping is free when the subtotal reaches 120", () => {
  const { product: p, state } = fixture();
  const order = placeOrder(state, randomUUID(), {
    items: [{ id: p.id, variantId: p.variants[1].id, quantity: 3 }],
  });
  assert.equal(order.subtotal, 150);
  assert.equal(order.shipping, 0);
  assert.equal(order.total, 150);
});
