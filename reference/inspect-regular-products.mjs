import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge'});
const context=await browser.newContext({javaScriptEnabled:false});
const page=await context.newPage();
fs.mkdirSync('reference/product-details',{recursive:true});
fs.mkdirSync('frontend/public/assets/images/catalogue',{recursive:true});
try {
 const urls=new Set();
 for(let number=1;number<=1;number++){
  const url='https://dnagenetics.com/product-category/regular-seeds/'+(number===1?'':`page/${number}/`)+'?orderby=date';
  const response=await context.request.get(url);if(!response.ok())throw Error(`Category HTTP ${response.status()}`);
  await page.setContent(await response.text());
  for(const href of await page.locator('ul.products > li a[href*="/product/"]').evaluateAll(ns=>ns.map(n=>n.href)))urls.add(href);
 }
 
 const records=[];
 for(const url of urls){
  if(records.some(r=>r.sourceUrl===url))continue;
  const response=await context.request.get(url);if(!response.ok())throw Error(`Product HTTP ${response.status()}: ${url}`);
  const html=await response.text();const slug=new URL(url).pathname.split('/').filter(Boolean).at(-1);
  fs.writeFileSync(`reference/product-details/${slug}.html`,html);
  await page.setContent(html);
  const record=await page.evaluate(()=>{
   const form=document.querySelector('form.variations_form');
   const variations=JSON.parse(form?.getAttribute('data-product_variations')||'[]');
   const facts={};document.querySelectorAll('.shrt-info p').forEach(p=>{const key=p.querySelector('strong')?.textContent.replace(':','').trim();if(key)facts[key]=p.textContent.replace(p.querySelector('strong').textContent,'').trim().replace(/\s+/g,' ');});
   const schemas=[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(n=>{try{const j=JSON.parse(n.textContent);return j['@graph']||[j];}catch{return [];}});
   const schema=schemas.find(n=>n['@type']==='Product');
   const images=[...document.querySelectorAll('.woocommerce-product-gallery img[data-large_image]')].map(n=>n.getAttribute('data-large_image'));
   const fallback=variations[0]?.image?.full_src||variations[0]?.image?.url;
   return {name:(schema?.name||document.querySelector('h1')?.textContent||'').replace(/\s+/g,' ').trim(),sourceId:form?.getAttribute('data-product_id'),facts,images:[...new Set(images.length?images:[fallback].filter(Boolean))],variants:Array.isArray(variations)?variations.map(v=>({size:Number(v.attributes.attribute_pa_size),sku:v.sku,price:v.display_regular_price,salePrice:v.display_price<v.display_regular_price?v.display_price:null,stock:0,sourceAvailable:v.is_in_stock})):[]};
  });
  if(!record.name||!record.variants.length||record.variants.some(v=>!Number.isInteger(v.size)||v.size<=0||!Number.isFinite(v.price)))throw Error(`Incomplete product details: ${slug}`);
  record.slug=slug;record.sourceUrl=url;record.sourceCheckedAt=new Date().toISOString();record.localImages=[];
  for(let i=0;i<record.images.length;i++){
   const image=await context.request.get(record.images[i]);if(!image.ok())throw Error(`Image failed: ${slug}`);
   const extension=new URL(record.images[i]).pathname.split('.').pop().toLowerCase();
   if(!['jpg','jpeg','png','webp'].includes(extension))throw Error('Unexpected image type');
   const local=`/assets/images/catalogue/${slug}-${i}.${extension}`;fs.writeFileSync(`frontend/public${local}`,await image.body());record.localImages.push(local);
  }
  records.push(record);fs.writeFileSync('reference/regular-product-records.json',JSON.stringify(records,null,2));
  console.log(`${records.length}/${urls.size}: ${record.name} | ${record.variants.map(v=>`${v.size}x $${v.salePrice??v.price}`).join(', ')} | ${JSON.stringify(record.facts)}`);
 }
fs.writeFileSync("reference/regular-product-records.json",JSON.stringify(records,null,2));
 console.log(`Completed ${records.length} distinct product detail records.`);
}finally{await browser.close();}
