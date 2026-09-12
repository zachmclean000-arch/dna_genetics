import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const all=await(await fetch('http://127.0.0.1:3001/api/products')).json();
const browser=await chromium.launch({channel:'msedge'});
try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const type of ['Indica','Sativa','Hybrid']){
 const expected=all.filter(p=>p.strainType===type);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto(`http://127.0.0.1:5173/shop?attribute=${type}`);
  await page.getByRole('heading',{name:`${type} Seeds`,level:1}).waitFor();
  await page.waitForFunction(count=>document.querySelectorAll('.dna-seed-card').length===Math.min(16,count),expected.length);
  const names=await page.locator('.dna-seed-card h2').allTextContents();assert.ok(names.every(name=>expected.some(p=>p.name===name)));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`reference/comparison/${type.toLowerCase()}-built-${width}.png`});
 }
 await page.getByRole('combobox',{name:'Product category'}).selectOption('Autoflower Seeds');
 const narrowed=expected.filter(p=>p.category==='Autoflower Seeds');
 await page.waitForFunction(count=>document.querySelectorAll('.dna-seed-card').length===count,narrowed.length);
 assert.ok(page.url().includes(`attribute=${type}`));
 await page.getByRole('combobox',{name:'Product category'}).selectOption('');
 await page.waitForFunction(count=>document.querySelectorAll('.dna-seed-card').length===Math.min(16,count),expected.length);
}
await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'Shop All Seeds'}).hover();
for(const type of ['Indica','Sativa','Hybrid'])await page.locator('.dna-mega').getByRole('link',{name:`${type} Seeds (${all.filter(p=>p.strainType===type).length})`,exact:true}).waitFor();
await page.locator('.dna-mega').getByRole('link',{name:/Sativa Seeds/}).click();await page.getByRole('heading',{name:'Sativa Seeds',level:1}).waitFor();assert.deepEqual(errors,[]);
console.log('Indica/Sativa/Hybrid: correct database membership, seed-type filtering, reset, live menu counts, navigation and responsive widths passed.');
}finally{await browser.close();}
