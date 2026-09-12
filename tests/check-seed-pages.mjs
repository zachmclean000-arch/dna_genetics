import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge'});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  await page.goto('http://127.0.0.1:5173/shop?category=Feminized%20Seeds');
  await page.getByText('Showing 1–16 of 42 results',{exact:true}).waitFor();
  assert.equal(await page.locator('.dna-seed-card').count(),16);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`reference/comparison/feminized-built-${width}.png`});
  await page.getByRole('navigation',{name:'Product pages'}).getByRole('button',{name:'3',exact:true}).click();
  await page.getByText('Showing 33\u201342 of 42 results',{exact:true}).waitFor();
  assert.equal(await page.locator('.dna-seed-card').count(),10);
  await page.getByRole('combobox',{name:'Sort products'}).selectOption('price-asc');
  await page.getByText('Showing 1–16 of 42 results',{exact:true}).waitFor();
  await page.locator('.dna-seed-card').first().getByRole('button',{name:'View Sizes'}).click();
  assert.ok(await page.locator('.dna-seed-size-list').isVisible());
  await page.goto('http://127.0.0.1:5173/product/blue-dream-feminized?size=10');
  await page.getByText('Selected: 10 seeds · $95.23',{exact:true}).waitFor();
  await page.locator('input[name="pack-size"][value="20"]').check();
  await page.getByText('Selected: 20 seeds · $170.76',{exact:true}).waitFor();
  assert.ok(await page.locator('.dna-seed-purchase').isDisabled());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('tab',{name:'Additional information'}).click();
  await page.getByRole('cell',{name:'5, 10, 15, 20',exact:true}).waitFor();
  await page.screenshot({path:`reference/comparison/blue-dream-built-${width}.png`});
 }
 assert.deepEqual(errors,[]);console.log('Category pagination/sorting, pack links and selection, stock state, product tabs and four viewport widths passed.');
}finally{await browser.close();}
