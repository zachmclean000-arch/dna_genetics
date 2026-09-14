import { test, expect } from "@playwright/test";

test("guest checkout records a campaign order and opens confirmation", async ({ page, request }) => {
  const products = await (await request.get("/api/products")).json();
  const product = products.find((item) => item.stock > 1);
  await page.goto("/shop");
  await page.evaluate((id) => localStorage.setItem("dna_genetics_cart", JSON.stringify([{ id, quantity: 1 }])), product.id);
  await page.goto("/checkout");
  await expect(page.getByRole("link", { name: "Sign in to continue" })).toHaveCount(0);
  await page.getByLabel("Email address", { exact: false }).fill(`checkout-${Date.now()}@example.test`);
  await page.getByLabel("First name", { exact: false }).fill("Test");
  await page.getByLabel("Last name", { exact: false }).fill("Student");
  await page.getByLabel("Street address", { exact: false }).fill("1 Example Street");
  await page.getByLabel("City / Town", { exact: false }).fill("Example Town");
  await page.getByLabel("Postcode / ZIP code", { exact: false }).fill("TE1 1ST");
  await page.getByLabel("Phone", { exact: false }).fill("07700900000");
  await page.getByLabel("Country / Region", { exact: false }).selectOption("GB");
  await expect(page.getByRole("radio", { name: /Zelle/ })).toBeChecked();
  await page.getByRole("radio", { name: /Bitcoin/ }).check();
  await expect(page.getByText("Cryptocurrency payment requests require extra care.", { exact: false })).toBeVisible();
  await page.getByLabel("Add a note to your order").fill("Please use this for the campaign demonstration.");
  await page.getByLabel("By proceeding with your purchase", { exact: false }).check();
  await page.getByLabel("I agree to share these contact details", { exact: false }).check();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const responsePromise = page.waitForResponse((response) => response.url().endsWith("/api/campaign-orders") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Continue" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(201);
  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible();
  await expect(page.getByText("A member of the team will be in touch shortly.")).toBeVisible();
  const saved = await response.json();
  expect(saved.contact.address).toBe("1 Example Street");
  expect(saved.contact.consent).toBe(true);
  expect(saved.contact.paymentMethod).toBe("bitcoin");
  expect(saved.contact.orderNote).toBe("Please use this for the campaign demonstration.");
  expect(saved.contact.termsAccepted).toBe(true);
  expect(saved.contact.noticeVersion).toBe("school-campaign-v1");
  expect(saved.contact.consentRecordedAt).toBeTruthy();
  expect((await request.get("/api/orders")).status()).toBe(401);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("dna_genetics_cart")))).toEqual([]);
});

test("checkout blocks unavailable items and shows an empty state", async ({ page }) => {
  await page.goto("/shop");
  await page.evaluate(() => localStorage.setItem("dna_genetics_cart", JSON.stringify([{ id: "missing-product", quantity: 1 }])));
  await page.goto("/cart");
  await expect(page.getByText("Unavailable product", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Checkout" })).toBeVisible();
  await page.getByRole("link", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText("Unavailable for checkout.", { exact: false })).toBeVisible();
  await page.goto("/cart");
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await page.goto("/checkout");
  await expect(page.getByText("Your bag is empty.", { exact: false })).toBeVisible();
});

test("backend checkout errors are readable and contain no schema paths", async ({ page, request }) => {
  const products = await (await request.get("/api/products")).json();
  const product = products.find((item) => item.status === "active");
  const cartItem = { id: product.id, quantity: 1, ...(product.variants?.[0] ? { variantId: product.variants[0].id } : {}) };
  await page.goto("/shop");
  await page.evaluate((item) => localStorage.setItem("dna_genetics_cart", JSON.stringify([item])), cartItem);
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Continue" }).click();
  const alert = page.getByRole("alert");
  await expect(alert).toContainText("Please complete: First name");
  await expect(alert).not.toContainText("contact.firstName");
  await expect(alert).not.toContainText("expected string");
});
