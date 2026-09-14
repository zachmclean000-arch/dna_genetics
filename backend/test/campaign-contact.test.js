import test from "node:test";
import assert from "node:assert/strict";
import { campaignContactSchema } from "../validation.js";
const contact = {
  firstName: "Test",
  lastName: "Student",
  email: "test@example.test",
  phone: "07700900000",
  country: "GB",
  address: "1 Example Street",
  city: "Example Town",
  postalCode: "TE1 1ST",
  paymentMethod: "zelle",
  orderNote: "Campaign test",
  termsAccepted: true,
  consent: true,
};
test("campaign contact accepts optional campaign consent and validates required order fields", () => {
  assert.equal(campaignContactSchema.parse(contact).consent, true);
  assert.equal(
    campaignContactSchema.parse({ ...contact, consent: false }).consent,
    false,
  );
  assert.equal(
    campaignContactSchema.parse(
      Object.fromEntries(
        Object.entries(contact).filter(([key]) => key !== "consent"),
      ),
    ).consent,
    false,
  );
  for (const patch of [
    { termsAccepted: false },
    { email: "invalid" },
    { firstName: " " },
    { address: "" },
    { phone: "invalid" },
    { country: "INVALID" },
    { paymentMethod: "cash-app" },
    { orderNote: "x".repeat(1001) },
  ]) {
    assert.equal(
      campaignContactSchema.safeParse({ ...contact, ...patch }).success,
      false,
    );
  }
});
