import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:5173/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator(".dna-flower");
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.dna-flower-photo img')].every(img => img.complete && img.naturalWidth > 0));
    assert.equal(await section.locator('.dna-flower-card').count(), 4);
    assert.equal(await section.evaluate(el => getComputedStyle(el).backgroundColor), width <= 600 ? 'rgb(23, 30, 58)' : 'rgb(255, 255, 255)');
    assert.equal(await section.locator('.dna-flower-shop').isVisible(), width <= 600);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const boxes = await section.locator('.dna-flower-photo').evaluateAll(nodes => nodes.map(n => { const b = n.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height}; }));
    assert.equal(boxes[0].y, boxes[1].y);
    assert.ok(width >= 992 ? boxes[0].y === boxes[3].y : boxes[2].y > boxes[0].y);
    assert.ok(boxes.every(b => Math.abs(b.w - b.h) < 1));
    await section.screenshot({ path: `reference/comparison/flower-${width}.png` });
  }
  await page.locator('.dna-flower-card').first().click();
  await page.waitForURL('**/thca-flower#choco-mintz');
  assert.equal(await page.getByText('Page not found', {exact:true}).count(), 0);
  assert.deepEqual(errors, []);
  console.log('Flower images, responsive layout, colors, overflow and local link passed.');
} finally { await browser.close(); }
