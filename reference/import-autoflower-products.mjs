import fs from 'node:fs';
import {transaction} from '../backend/store.js';
import {prisma} from '../backend/prisma-client.js';
import {productSchema} from '../backend/validation.js';
const records=JSON.parse(fs.readFileSync('reference/autoflower-product-records.json','utf8'));
if(records.length!==17)throw Error(`Expected 17 inspected products, received ${records.length}`);
const skus=records.flatMap(r=>r.variants.map(v=>v.sku));
if(skus.some(s=>!s)||new Set(skus).size!==skus.length)throw Error('Missing or duplicate pack SKUs must be reviewed.');
try {
 const backup=await transaction(s=>structuredClone({products:s.products,categories:s.categories}));
 fs.mkdirSync('backend/data',{recursive:true});
 fs.writeFileSync(`backend/data/catalogue-before-reference-import-${Date.now()}.json`,JSON.stringify(backup,null,2),{flag:'wx'});
 await transaction(s=>{
  for(const record of records){
   const short=record.name.replace(/\s+(?:Fem(?:inized)?\s+)?Cannabis Seeds$/i,'').trim().toLowerCase();
   const existing=s.products.find(p=>p.sourceUrl===record.sourceUrl||p.slug===record.slug)||s.products.find(p=>p.description.startsWith('Sample catalogue entry')&&p.name.toLowerCase()===short);
   if(existing&&!existing.sourceUrl&&!existing.description.startsWith('Sample catalogue entry'))throw Error(`Manual product conflicts with ${record.slug}`);
   const variants=record.variants.map(v=>({...v}));
   const cheapest=variants.reduce((a,b)=>(a.salePrice??a.price)<=(b.salePrice??b.price)?a:b);
   const genotype=record.facts.Genotype||'';
   const data=productSchema.parse({name:record.name,slug:record.slug,sku:`DNA-REF-${record.sourceId}`,price:cheapest.price,salePrice:cheapest.salePrice,category:'Autoflower Seeds',strainType:/sativa/i.test(genotype)?'Sativa':/indica/i.test(genotype)?'Indica':/hybrid/i.test(genotype)?'Hybrid':'',genetics:record.facts.Genetics||'',floweringTime:record.facts['Flowering Time']||'',yield:record.facts.Yield||'',shortDescription:`${genotype || 'DNA Genetics seed variety'}. Available pack sizes: ${variants.map(v=>v.size).join(', ')} seeds.`,description:`${record.name} is listed by DNA Genetics as ${genotype||'a seed variety'}. Its listed parentage is ${record.facts.Genetics||'not specified'}. Pack options and reference prices were checked on the individual product page.`,stock:0,status:'active',images:record.localImages,featured:existing?.featured||false,bestSeller:existing?.bestSeller||false,newArrival:existing?.newArrival||false});
   const p={...data,id:existing?.id||crypto.randomUUID(),createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),sourceUrl:record.sourceUrl,sourceCheckedAt:record.sourceCheckedAt,variants};
   if(existing)s.products[s.products.indexOf(existing)]=p;else s.products.push(p);
  }
 });
 const products=await prisma.product.findMany({where:{sourceUrl:{not:null},category:{name:"Autoflower Seeds"}},include:{variants:true}});
 console.log(`Saved ${products.length} source-checked products and ${products.reduce((n,p)=>n+p.variants.length,0)} pack variants.`);
} finally {await prisma.$disconnect();}
