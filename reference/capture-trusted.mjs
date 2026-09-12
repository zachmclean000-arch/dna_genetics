import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const context=await browser.newContext(); const page=await context.newPage();
 await page.goto('https://dnagenetics.com/',{waitUntil:'domcontentloaded'});
 await page.addStyleTag({content:'#landing-age-popup,.landing_bg,.modal-backdrop,.about_area>.container>.resp-view{display:none!important}*{scroll-behavior:auto!important}'});
 const section=page.locator('.about_area.hme-abt');
 const sources=await section.locator('img').evaluateAll(ns=>ns.map(n=>n.src));
 fs.mkdirSync('frontend/public/assets/images/trusted',{recursive:true});
 for(const url of [...new Set(sources)].filter(u=>!u.includes('THCa')&&!u.includes('crowh'))){const r=await context.request.get(url);if(r.ok()) fs.writeFileSync('frontend/public/assets/images/trusted/'+new URL(url).pathname.split('/').pop(),await r.body());}
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:1000}); await page.evaluate(()=>document.fonts.ready); await section.screenshot({path:`reference/trusted-${width}.png`});
  const data=await section.evaluate(el=>[el,...el.querySelectorAll('#targetDiv,h2,p,.aron_pic,.newProBlogSec,button')].map(n=>({tag:n.tagName,cl:n.className,text:n.textContent.trim().slice(0,50),w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,css:Object.fromEntries(['fontFamily','fontSize','lineHeight','padding','margin','display'].map(k=>[k,getComputedStyle(n)[k]]))})));
  fs.writeFileSync(`reference/trusted-${width}.json`,JSON.stringify(data,null,2));
 }
} finally {await browser.close();}
