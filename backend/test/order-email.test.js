import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContactEmail,
  buildOrderEmail,
  buildOrderStatusEmail,
} from "../order-email.js";

function fixture() {
  return {
    id: "d6944990-9338-403e-8044-befbd2566543",
    items: [
      {
        name: "Snack Pack Fem Cannabis Seeds",
        size: 20,
        quantity: 1,
        price: 170.67,
        image: "/assets/images/logo/site-logo.webp",
      },
    ],
    subtotal: 170.67,
    shipping: 0,
    total: 170.67,
    contact: {
      firstName: "Test",
      lastName: "Customer",
      email: "student@example.com",
      phone: "+44 0000 000000",
      address: "1 Example Street",
      address2: "",
      city: "London",
      region: "",
      postalCode: "AB1 2CD",
      country: "GB",
      paymentMethod: "zelle",
      orderNote: "Order test",
    },
  };
}

test("builds a styled HTML order email with embedded product images", () => {
  const email = buildOrderEmail(fixture());
  assert.match(email.subject, /D6944990/);
  assert.match(email.html, /ORDER RECEIVED/);
  assert.match(email.html, /cid:product-0@dna-genetics/);
  assert.match(email.html, /Snack Pack Fem Cannabis Seeds/);
  assert.match(email.html, /FREE/);
  assert.ok(
    email.attachments.some((item) => item.cid === "product-0@dna-genetics"),
  );
  assert.match(email.text, /Selected payment method: Zelle/);
});

test("escapes customer content and ignores unsafe image paths", () => {
  const order = fixture();
  order.contact.orderNote = '<script>alert("x")</script>';
  order.items[0].image = "/assets/../../backend/.env";
  const email = buildOrderEmail(order);
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /&lt;script&gt;/);
  assert.doesNotMatch(email.html, /cid:product-0@dna-genetics/);
  assert.ok(
    !email.attachments.some((item) => item.cid === "product-0@dna-genetics"),
  );
});

test("builds matching in-progress and completed status emails", () => {
  const inProgress = buildOrderStatusEmail(fixture(), "in_progress");
  assert.match(inProgress.subject, /currently in progress/i);
  assert.match(inProgress.html, /ORDER IN PROGRESS/);
  const completed = buildOrderStatusEmail(fixture(), "completed");
  assert.match(completed.subject, /completed/i);
  assert.match(completed.html, /ORDER COMPLETED/);
});

test("builds a styled and escaped contact notification", () => {
  const email = buildContactEmail({
    firstName: "Test",
    lastName: "Customer",
    email: "customer@example.com",
    subject: "Product question\r\nInjected header",
    message: '<script>alert("x")</script> Please contact me.',
  });
  assert.equal(
    email.subject,
    "DNA GENETICS contact: Product question Injected header",
  );
  assert.match(email.text, /customer@example\.com/);
  assert.match(email.html, /New contact message/);
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /&lt;script&gt;/);
});
