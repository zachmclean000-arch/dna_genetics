import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const context=await browser.newContext();const page=await context.newPage();
 await page.goto('https://dnagenetics.com/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.addStyleTag({content:'.landing_bg,#landing-age-popup,.modal-backdrop{display:none!important}html,body,*{scroll-behavior:auto!important}'});
 const urls=await page.locator('#carouselBannerFade .carousel-item img').evaluateAll(imgs=>[...new Set(imgs.map(img=>img.src))]);
 fs.mkdirSync('frontend/public/assets/images/homepage',{recursive:true});
 for(const [index,url] of urls.entries()){const response=await context.request.get(url);if(!response.ok())throw Error(`Asset download failed: ${response.status()}`);fs.writeFileSync(`frontend/public/assets/images/homepage/banner-${index+1}.jpg`,await response.body());}
 const measurements=[];
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});await page.evaluate(()=>window.scrollTo(0,0));
  await page.locator('#carouselBannerFade').screenshot({path:`reference/banner-${width}.png`});
  measurements.push(await page.locator('#carouselBannerFade').evaluate((el,width)=>({width,rect:el.getBoundingClientRect().toJSON(),images:[...el.querySelectorAll('.active img')].map(img=>({natural:[img.naturalWidth,img.naturalHeight],rect:img.getBoundingClientRect().toJSON(),display:getComputedStyle(img.parentElement).display,fit:getComputedStyle(img).objectFit,margin:getComputedStyle(img).margin})),controls:[...el.querySelectorAll('button')].map(button=>({rect:button.getBoundingClientRect().toJSON(),opacity:getComputedStyle(button).opacity,display:getComputedStyle(button).display}))}),width));
 }
 fs.writeFileSync('reference/banner-measurements.json',JSON.stringify({urls,measurements},null,2));console.log(JSON.stringify({urls,measurements}));
}finally{await browser.close();}
