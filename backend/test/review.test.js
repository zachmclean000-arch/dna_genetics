import test from "node:test";
import assert from "node:assert/strict";
import { reviewSchema } from "../reviews.js";

test("reviews can be assigned to a product", () => {
  const productId = "d6944990-9338-403e-8044-befbd2566543";
  const review = reviewSchema.parse({
    productId,
    author: "A customer",
    text: "A product-specific review.",
    rating: 5,
    published: true,
  });
  assert.equal(review.productId, productId);
});

test("legacy unassigned reviews remain valid", () => {
  const review = reviewSchema.parse({
    author: "A customer",
    text: "A general review.",
    rating: 4,
    published: false,
  });
  assert.equal(review.productId, null);
});
