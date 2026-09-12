import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const b=await chromium.launch({channel:'msedge'});
try {
 const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const source=JSON.parse(fs.readFileSync('reference/autoflower-product-records.json','utf8'));
 const all=await(await fetch('http://127.0.0.1:3001/api/products')).json();
 const auto=all.filter(x=>x.category==='Autoflower Seeds');assert.equal(auto.length,17);assert.equal(all.filter(x=>x.category==='Feminized Seeds').length,42);
 for(const r of source){const stored=auto.find(x=>x.slug===r.slug);assert.ok(stored);assert.equal(stored.variants.length,r.variants.length);for(const v of r.variants){const actual=stored.variants.find(x=>x.size===v.size);assert.equal(actual.price,v.price);assert.equal(actual.salePrice,v.salePrice);}assert.ok(stored.images.every(path=>fs.existsSync('frontend/public'+path)));}
 for(const width of [1440,768,390,320]){
  await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:5173/shop?category=Autoflower%20Seeds');
  await p.getByText('Showing 1\u201316 of 17 results',{exact:true}).waitFor();assert.equal(await p.locator('.dna-seed-card').count(),16);
  assert.equal(await p.locator('h1').textContent(),'Autoflower Seeds');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.screenshot({path:`reference/comparison/autoflower-built-${width}.png`});
  await p.getByRole('navigation',{name:'Product pages'}).getByRole('button',{name:'2',exact:true}).click();await p.getByText('Showing 17\u201317 of 17 results',{exact:true}).waitFor();assert.equal(await p.locator('.dna-seed-card').count(),1);
  await p.locator('.dna-seed-card').getByRole('button',{name:'View Sizes'}).click();await p.locator('.dna-seed-size-list a').first().click();await p.locator('.dna-seed-packs').waitFor();
  await p.getByRole('navigation',{name:'Breadcrumb'}).getByRole('link',{name:'Autoflower Seeds',exact:true}).click();await p.getByRole('combobox',{name:'Product category'}).selectOption('Feminized Seeds');await p.getByText('Showing 1\u201316 of 42 results',{exact:true}).waitFor();
 }
 assert.deepEqual(errors,[]);console.log('Autoflower: 17 products, 73 verified pack variants, images, pagination, product links, category switching and four widths passed.');
}finally{await b.close();}
