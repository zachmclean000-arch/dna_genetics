import { test, expect } from "@playwright/test";
test("customer journey, permissions and responsive layout", async ({
  page,
  request,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "DNA Genetics highlights" }),
  ).toBeVisible();
  await page.locator(".dna-hero-slide.is-active a").click();
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Chocolope");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.locator(".product-card h3 a").first().click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("link", { name: "View bag" }).click();
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await page.getByRole("link", { name: "Sign in to continue" }).click();
  await page
    .getByRole("button", { name: "New here? Create an account" })
    .click();
  await page
    .getByLabel("Email", { exact: true })
    .fill(`student-${Date.now()}@example.test`);
  await page
    .getByLabel("Password", { exact: true })
    .fill("classroom-test-password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  const forbidden = await page.request.post("/api/products", { data: {} });
  expect(forbidden.status()).toBe(403);
  await page.goto("/checkout");
  await page.getByLabel("I understand this is a simulation.").check();
  await page.getByRole("button", { name: "Place simulated order" }).click();
  await expect(
    page.getByRole("heading", { name: "Simulated order recorded." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View your simulated orders" }).click();
  await expect(page.locator(".order")).toHaveCount(1);
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Administrator access required." }),
  ).toBeVisible();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("button", { name: "Shop All Seeds" }).click();
  await page
    .locator(".dna-mega")
    .getByRole("link", { name: "Feminized Seeds" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Shop the archive." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  const denied = await request.get("/api/customers");
  expect(denied.status()).toBe(403);
});
