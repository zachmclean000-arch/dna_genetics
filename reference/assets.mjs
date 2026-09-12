import {chromium} from '@playwright/test';
import fs from 'node:fs';
const b=await chromium.launch({channel:'msedge',headless:true});const c=await b.newContext({viewport:{width:1440,height:1000}});const p=await c.newPage();
try{
 await p.goto('https://dnagenetics.com/',{waitUntil:'domcontentloaded'});
 await p.addStyleTag({content:'#landing-age-popup,.landing_bg,.modal-backdrop{display:none!important}'});
 await p.evaluate(()=>{document.querySelector('.landing_bg')?.remove();document.querySelectorAll('.modal-backdrop').forEach(e=>e.remove());document.body.style.overflow='auto';});
 const assets={
 'images/logo/site-logo.webp':'https://dnagenetics.com/wp-content/uploads/2025/12/site-logo.webp',
 'images/logo/footer-logo.webp':'https://dnagenetics.com/wp-content/uploads/2025/01/ft_logo.webp',
 'images/footer/forest.webp':'https://dnagenetics.com/wp-content/themes/dnagenetics/images/order_pic-min.webp',
 'images/header/megaicon1.webp':'https://dnagenetics.com/wp-content/uploads/2025/01/megaicon1-min.webp',
 'images/header/megaicon2.webp':'https://dnagenetics.com/wp-content/uploads/2025/01/megaicon2-min.webp',
 'fonts/knockout.woff2':'https://dnagenetics.com/wp-content/themes/dnagenetics/fonts/knockut-regular1.woff2',
 'fonts/fontawesome.woff2':'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
 };
 for(const [file,url]of Object.entries(assets)){const r=await c.request.get(url);if(!r.ok())throw Error(`${file}: ${r.status()}`);const target='frontend/public/assets/'+file;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,await r.body());console.log(file);}
 const cssResponse=await c.request.get('https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Roboto:wght@400;500;700&display=swap',{headers:{'User-Agent':'Mozilla/5.0'}});
 const fontCss=await cssResponse.text();fs.writeFileSync('reference/google-fonts.css',fontCss);
 let fontIndex=0;for(const url of [...new Set([...fontCss.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1]))]){const r=await c.request.get(url);const file=`fonts/google-${fontIndex++}.woff2`;fs.writeFileSync('frontend/public/assets/'+file,await r.body());console.log(file,url);}
 await p.evaluate(()=>document.querySelector('main')?.remove());
 await p.locator('.site-footer').scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.locator('.site-footer').screenshot({path:'reference/footer-desktop.png'});
 await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(300);
 const nav=p.locator('header .mega-menu-link').filter({hasText:'Shop All Seeds'}).first();await nav.hover();await p.waitForTimeout(500);await p.screenshot({path:'reference/menu-desktop.png'});
 console.log(await p.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name).filter(n=>/woff|ttf|googleapis|typekit/.test(n))));
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(300);await p.screenshot({path:'reference/top-mobile.png'});await p.locator('.navbar-toggler').click();await p.waitForTimeout(300);await p.screenshot({path:'reference/menu-mobile.png'});
 fs.writeFileSync('reference/menu-mobile.html',await p.locator('header').evaluate(el=>el.outerHTML));
}finally{await b.close();}
