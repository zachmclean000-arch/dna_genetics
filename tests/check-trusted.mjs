import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const b = await chromium.launch({ channel: "msedge" });
try {
  const p = await b.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 768, 390, 320]) {
    await p.setViewportSize({ width, height: 1000 });
    await p.goto("http://127.0.0.1:5173/");
    await p.evaluate(() => document.fonts.ready);
    const s = p.locator(".dna-trusted");
    await s.scrollIntoViewIfNeeded();
    await p.waitForFunction(() => {
      const i = document.querySelector(".dna-trusted-anniversary");
      return i.complete && i.naturalWidth > 0;
    });
    assert.equal(
      await s.evaluate((e) => getComputedStyle(e).backgroundColor),
      "rgb(23, 30, 58)",
    );
    assert.equal(
      await p.locator(".dna-trusted-seeds").isVisible(),
      width <= 600,
    );
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await s.screenshot({ path: `reference/comparison/trusted-${width}.png` });
  }
  await p.locator(".dna-trusted-seeds .dna-trusted-button").click();
  await p.waitForURL("**/shop?category=Feminized%20Seeds");
  assert.deepEqual(errors, []);
  console.log(
    "Trusted section responsive layout, local images, navigation and browser checks passed.",
  );
} finally {
  await b.close();
}
