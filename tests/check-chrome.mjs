import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const errors = [],
  remote = [],
  apiRequests = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
  const url = new URL(request.url());
  if (url.protocol.startsWith("http") && url.hostname !== "127.0.0.1")
    remote.push(request.url());
  if (url.pathname.startsWith("/api/")) apiRequests.push(url.pathname);
});
try {
  fs.mkdirSync("reference/comparison", { recursive: true });
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:5173/");
    await page.evaluate(() => document.fonts.ready);
    const values = await page.evaluate(() => ({
      header: getComputedStyle(document.querySelector(".dna-header"))
        .backgroundColor,
      bar: getComputedStyle(document.querySelector(".dna-announcement"))
        .backgroundColor,
      footer: getComputedStyle(document.querySelector(".dna-footer"))
        .backgroundColor,
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [
        ...document.querySelectorAll(".dna-header img,.dna-footer-region img"),
      ].filter((img) => !img.complete || !img.naturalWidth).length,
    }));
    assert.equal(values.header, "rgb(250, 247, 242)");
    assert.equal(values.bar, "rgb(11, 77, 60)");
    assert.equal(values.footer, "rgb(0, 0, 0)");
    assert.equal(values.overflow, false);
    assert.equal(values.broken, 0);
    await page
      .locator(".dna-header-shell")
      .screenshot({ path: `reference/comparison/header-${width}.png` });
    await page
      .locator(".dna-footer")
      .screenshot({ path: `reference/comparison/footer-${width}.png` });
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width < 992)
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
    if (width >= 992) await page.locator(".dna-shop-trigger").hover();
    else
      await page
        .getByRole("button", { name: "Shop All Seeds", exact: false })
        .click();
    await page.locator(".dna-mega").waitFor({ state: "visible" });
    await page.screenshot({ path: `reference/comparison/menu-${width}.png` });
    await page
      .locator(".dna-mega")
      .getByRole("link", { name: "Feminized Seeds (42)", exact: true })
      .click();
    assert.ok(page.url().includes("category=Feminized"));
    assert.equal(await page.locator(".dna-mega").count(), 0);
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page
      .getByLabel("Search catalogue", { exact: true })
      .fill("Chocolope");
    await page.getByLabel("Search catalogue", { exact: true }).press("Enter");
    await page.waitForURL("**/shop?q=Chocolope");
    assert.equal(await page.locator(".product-card").count(), 2);
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".dna-search").count(), 0);
    console.log(
      `${width}px: colours, assets, layout, menu navigation, search and Escape passed.`,
    );
  }
  await page
    .locator(".dna-footer")
    .getByRole("link", { name: "FAQ’s", exact: true })
    .click();
  await page.getByRole("heading", { name: "FAQ’s", exact: true }).waitFor();
  assert.deepEqual(errors, []);
  assert.deepEqual(remote, []);
  assert.deepEqual(apiRequests, []);
  console.log(
    "No JavaScript errors, external asset requests or backend requests.",
  );
} finally {
  await browser.close();
}
