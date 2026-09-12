import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  const requests = [],
    errors = [];
  page.on("request", (request) => {
    const u = new URL(request.url());
    if (u.hostname !== "127.0.0.1" && u.protocol.startsWith("http"))
      requests.push(u.href);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:5173/");
    await page.evaluate(() => document.fonts.ready);
    const banner = page.locator(".dna-hero-carousel");
    const box = await banner.boundingBox();
    assert.ok(
      Math.abs(box.height - (width <= 600 ? 90 : (width * 285) / 1280)) < 1,
    );
    assert.equal(
      await page
        .locator(".dna-hero-slide.is-active img")
        .evaluate((img) => img.complete && img.naturalWidth === 1280),
      true,
    );
    await banner.screenshot({
      path: `reference/comparison/banner-${width}.png`,
    });
    await page
      .getByRole("button", { name: "Next banner", exact: true })
      .click();
    assert.equal(
      await page
        .locator(".dna-hero-slide.is-active")
        .getAttribute("aria-label"),
      "2 of 2",
    );
    await page.keyboard.press("ArrowLeft");
    assert.equal(
      await page
        .locator(".dna-hero-slide.is-active")
        .getAttribute("aria-label"),
      "1 of 2",
    );
    await page
      .getByRole("button", { name: "Previous banner", exact: true })
      .click();
    assert.equal(
      await page
        .locator(".dna-hero-slide.is-active")
        .getAttribute("aria-label"),
      "2 of 2",
    );
    await page.locator(".dna-hero-slide.is-active a").click();
    await page.waitForURL("**/shop");
    console.log(
      `${width}px: reference dimensions, local image, arrow controls, keyboard and internal link passed.`,
    );
  }
  await page.goto("http://127.0.0.1:5173/");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(5200);
  assert.equal(
    await page.locator(".dna-hero-slide.is-active").getAttribute("aria-label"),
    "2 of 2",
  );
  await page.locator(".dna-hero-carousel").hover();
  await page.getByRole("button", { name: "Pause banner slideshow" }).click();
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement.blur());
  await page.waitForTimeout(5200);
  assert.equal(
    await page.locator(".dna-hero-slide.is-active").getAttribute("aria-label"),
    "2 of 2",
  );
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto("http://127.0.0.1:5173/");
  assert.equal(
    await reduced
      .getByRole("button", { name: "Pause banner slideshow" })
      .count(),
    0,
  );
  assert.equal(
    await reduced
      .locator(".dna-hero-slide")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  assert.deepEqual(requests, []);
  assert.deepEqual(errors, []);
  console.log(
    "Autoplay, pause, reduced motion and no external requests passed.",
  );
} finally {
  await browser.close();
}
