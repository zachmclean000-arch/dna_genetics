import {chromium} from '@playwright/test';import assert from 'node:assert/strict';import fs from 'node:fs';
const groups=[...JSON.parse(fs.readFileSync('reference/curated-trait-selections.json','utf8')),...JSON.parse(fs.readFileSync('reference/curated-more-trait-selections.json','utf8'))];
const all=await(await fetch('http://127.0.0.1:3001/api/products')).json();
const b=await chromium.launch({channel:'msedge'});
try{const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const g of groups){const selected=all.filter(p=>p.additionalCategories?.includes(g.name));assert.equal(selected.length,g.limit);assert.deepEqual(selected.map(p=>p.id).sort(),g.products.map(p=>p.id).sort());
for(const width of [1440,390,320]){await p.setViewportSize({width,height:1000});await p.goto(`http://127.0.0.1:5173/shop?attribute=${encodeURIComponent(g.attribute)}`);await p.getByRole('heading',{name:g.name,level:1}).waitFor();await p.waitForFunction(n=>document.querySelectorAll('.dna-seed-card').length===Math.min(16,n),g.limit);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`reference/comparison/${g.slug}-built-${width}.png`});}
await p.getByRole('combobox',{name:'Sort products'}).selectOption('price-asc');
const price = product => Math.min(...product.variants.map(v=>v.salePrice??v.price));
const expectedFirst=[...selected].sort((a,b)=>price(a)-price(b)).slice(0,16).map(x=>x.name);
await p.waitForFunction(names=>JSON.stringify([...document.querySelectorAll('.dna-seed-card h2')].map(n=>n.textContent))===JSON.stringify(names),expectedFirst);
const rendered=await p.locator('.dna-seed-card h2').allTextContents();if(g.limit>16){await p.getByRole('navigation',{name:'Product pages'}).getByRole('button',{name:'2',exact:true}).click();await p.getByText('Showing 17\u201319 of 19 results',{exact:true}).waitFor();rendered.push(...await p.locator('.dna-seed-card h2').allTextContents());}
assert.deepEqual(rendered.sort(),selected.map(x=>x.name).sort());
await p.locator('.dna-seed-card').first().getByRole('button',{name:'View Sizes'}).click();await p.locator('.dna-seed-size-list a').first().click();await p.locator('.dna-seed-packs').waitFor();
}
await p.setViewportSize({width:1440,height:1000});await p.getByRole('button',{name:'Shop All Seeds'}).hover();for(const g of groups)await p.locator('.dna-mega').getByRole('link',{name:`${g.name} (${g.limit})`,exact:true}).waitFor();assert.deepEqual(errors,[]);
console.log('All eight exact category memberships, sorting/pagination, pack links, menu counts and responsive layouts passed.');
}finally{await b.close();}
