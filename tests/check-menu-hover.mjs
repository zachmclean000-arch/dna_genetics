import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge'});
try {
 const page=await browser.newPage();
 for (const width of [1440,1024]) {
  await page.setViewportSize({width,height:1000});
  await page.goto('http://127.0.0.1:5173/promotions');
  await page.evaluate(()=>window.scrollTo(0,1000));
  const button=page.getByRole('button',{name:'Shop All Seeds'});
  await button.hover();
  const bounds=await button.boundingBox();
  const menu=page.locator('.dna-mega');
  const panel=await menu.boundingBox();
  for(let y=bounds.y+bounds.height/2;y<=panel.y+12;y+=2){
   await page.mouse.move(bounds.x+bounds.width/2,y);
   await page.waitForTimeout(30);
   assert.ok(await menu.isVisible(),`Menu closed crossing header at ${width}px`);
  }
  const link=menu.getByRole('link',{name:'Feminized Seeds (42)',exact:true});
  await link.hover(); await page.waitForTimeout(500);assert.ok(await menu.isVisible());
  await link.click();await page.waitForURL('**/shop?category=Feminized%20Seeds');
  assert.equal(await menu.count(),0);
  await button.hover();await page.mouse.move(5,950);assert.equal(await menu.count(),0);
 }
 console.log('Dropdown stays open across header gap, category clicks work, and leaving closes it at both desktop widths.');
} finally {await browser.close();}
