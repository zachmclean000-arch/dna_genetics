import assert from "node:assert/strict";
import test from "node:test";
import { contactMessageSchema } from "../validation.js";

const validContact = {
  firstName: "Test",
  lastName: "Customer",
  email: "customer@example.com",
  subject: "Product question",
  message: "Please send me more information.",
};

test("accepts a complete contact message", () => {
  assert.deepEqual(contactMessageSchema.parse(validContact), validContact);
});

test("rejects missing fields and invalid email addresses", () => {
  assert.equal(
    contactMessageSchema.safeParse({ ...validContact, email: "invalid" })
      .success,
    false,
  );
  assert.equal(
    contactMessageSchema.safeParse({ ...validContact, message: "" }).success,
    false,
  );
});
