import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser = await chromium.launch({channel:'msedge',headless:true});
const context = await browser.newContext({viewport:{width:1440,height:1000}});
const page = await context.newPage();
try {
 await page.goto('https://dnagenetics.com/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForTimeout(1500);
 const styles = await page.locator('link[rel=stylesheet]').evaluateAll(nodes=>nodes.map(n=>n.href).filter(u=>u.includes('/themes/dnagenetics/')));
 for(const url of styles){const r=await context.request.get(url);if(r.ok())fs.writeFileSync('reference/'+new URL(url).pathname.split('/').pop(),await r.body());}
 const inspection = await page.evaluate(()=>{
  const selectors=['.header_area','.site-footer'];
  const properties=['display','position','width','height','padding','margin','gap','backgroundColor','backgroundImage','color','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textTransform','gridTemplateColumns','flexDirection'];
  return selectors.map(selector=>({selector,html:document.querySelector(selector).outerHTML,nodes:[document.querySelector(selector),...document.querySelector(selector).querySelectorAll('*')].map(el=>({tag:el.tagName,classes:el.className,text:el.childElementCount?null:el.textContent.trim().slice(0,150),src:el.getAttribute('src'),rect:{x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height},css:Object.fromEntries(properties.map(k=>[k,getComputedStyle(el)[k]]))}))}));
 });
 fs.writeFileSync('reference/inspection.json',JSON.stringify(inspection,null,2));
 console.log(await page.locator('body').evaluate(el=>[...el.querySelectorAll('[class]')].filter(n=>/age|modal|popup/i.test(n.className)&&getComputedStyle(n).position==='fixed').map(n=>({tag:n.tagName,class:n.className})))) ;
 await page.evaluate(()=>{document.querySelector('.landing_bg')?.remove();document.querySelectorAll('.modal-backdrop').forEach(el=>el.remove());document.body.style.overflow='auto';for(const el of document.querySelectorAll('body *')){if(/age|modal|popup|overlay/i.test(el.className)&&getComputedStyle(el).position==='fixed')el.style.display='none';}});
 await page.waitForTimeout(500);
 await page.screenshot({path:'reference/top-desktop.png'});
 await page.locator('.header_area').screenshot({path:'reference/header-desktop.png'});
 await page.locator('.site-footer').scrollIntoViewIfNeeded();
 await page.waitForTimeout(800);
 await page.locator('.site-footer').screenshot({path:'reference/footer-desktop.png'});
 console.log('Captured desktop styles, header and footer.');
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'reference/header-mobile.png'});
 await page.locator('.site-footer').screenshot({path:'reference/footer-mobile.png'});
 fs.writeFileSync('reference/mobile-header.html',await page.locator('.header_area').evaluate(el=>el.outerHTML));
} finally {await browser.close();}
