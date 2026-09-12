import {chromium} from '@playwright/test';
import fs from 'node:fs';
const b=await chromium.launch({channel:'msedge'});try{const c=await b.newContext();const r=await c.request.get('https://dnagenetics.com/wp-content/themes/dnagenetics/images/award-bg-min.webp');if(!r.ok())throw Error(r.status());fs.mkdirSync('frontend/public/assets/images/awards',{recursive:true});fs.writeFileSync('frontend/public/assets/images/awards/background.webp',await r.body());console.log('Saved reference image');}finally{await b.close();}

