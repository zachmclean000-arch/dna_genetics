import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'msedge'});
try {
 const p=await b.newPage(); const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,768,390,320]) {
  await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:5173/promotions');await p.evaluate(()=>document.fonts.ready);
  assert.equal(await p.locator('.dna-promotions-active article').count(),2);
  assert.equal(await p.locator('.dna-promotions-closed article').count(),27);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.locator('.dna-promo-card img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
  await p.waitForFunction(()=>[...document.querySelectorAll('.dna-promo-card img')].every(i=>i.complete&&i.naturalWidth>0));
  await p.screenshot({path:`reference/comparison/promotions-${width}.png`});
 }
 await p.goto('http://127.0.0.1:5173/promos');assert.equal(await p.locator('h1').textContent(),'Store Promotions');
 await p.getByRole('navigation',{name:'Breadcrumb'}).getByRole('link',{name:'Home'}).click(); await p.waitForURL('http://127.0.0.1:5173/');assert.deepEqual(errors,[]);
 console.log('Promotions: 29 images, active/closed groups, four responsive widths, alias and breadcrumb passed.');
} finally {await b.close();}
