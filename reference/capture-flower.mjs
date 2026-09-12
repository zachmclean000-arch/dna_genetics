import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const context=await browser.newContext();const page=await context.newPage();await page.goto('https://dnagenetics.com/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.addStyleTag({content:'#landing-age-popup,.landing_bg,.modal-backdrop{display:none!important}html,body,*{scroll-behavior:auto!important}'});
 const assets={
  'choco-mintz.jpeg':'https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Choco-mintz-600x600.jpeg',
  'gaz-money.jpeg':'https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Gaz-Money-600x600.jpeg',
  'guavanade.jpeg':'https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Guavanade-600x600.jpeg',
  'honey-beez.jpeg':'https://dnagenetics.com/wp-content/uploads/2025/12/DNA-THCa-Honey-beez-600x600.jpeg',
  'crown.png':'https://dnagenetics.com/wp-content/uploads/2024/01/crowh-h.png',
  'divider.webp':'https://dnagenetics.com/wp-content/themes/dnagenetics/images/devider.webp'
 };
 fs.mkdirSync('frontend/public/assets/images/flower',{recursive:true});
 for(const [file,url]of Object.entries(assets)){const response=await context.request.get(url);if(!response.ok())throw Error(`${file}: ${response.status()}`);fs.writeFileSync('frontend/public/assets/images/flower/'+file,await response.body());}
 const result=[];
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{document.querySelector('#thcaSliderMob').style.display='none';document.querySelector('#thcaCardMob').style.display='flex';});
  const selector=width>600?'.product-seed-home':'.about_area .resp-view';
  const section=page.locator(selector).first();await section.scrollIntoViewIfNeeded();await section.screenshot({path:`reference/flower-${width}.png`});
  result.push(await section.evaluate((el,width)=>({width,rect:el.getBoundingClientRect().toJSON(),nodes:[el,...el.querySelectorAll('h1,h2,h5,p,img,.row,.col-lg-3,.col-6,.container,.title_area,button')].map(n=>({tag:n.tagName,class:n.className,text:n.children.length?'':n.textContent.trim().slice(0,100),src:n.getAttribute('src'),rect:n.getBoundingClientRect().toJSON(),style:Object.fromEntries(['backgroundColor','color','fontFamily','fontSize','fontWeight','lineHeight','padding','margin','border','borderRadius','display'].map(k=>[k,getComputedStyle(n)[k]]))}))}),width));
 }
 fs.writeFileSync('reference/flower-measurements.json',JSON.stringify(result,null,2));console.log('Saved flower assets and reference measurements.');
}finally{await browser.close();}
