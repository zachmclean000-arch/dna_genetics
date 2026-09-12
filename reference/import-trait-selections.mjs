import fs from 'node:fs';import {transaction} from '../backend/store.js';import {prisma} from '../backend/prisma-client.js';
const groups=JSON.parse(fs.readFileSync('reference/curated-trait-selections.json','utf8'));
try{
 const backup=await transaction(s=>structuredClone({products:s.products,categories:s.categories}));
 fs.writeFileSync(`backend/data/catalogue-before-trait-selection-${Date.now()}.json`,JSON.stringify(backup,null,2),{flag:'wx'});
 await transaction(s=>{for(const group of groups){if(group.products.length!==group.limit||new Set(group.products.map(p=>p.id)).size!==group.limit)throw Error('Invalid selection');if(!s.categories.includes(group.name))s.categories.push(group.name);const ids=new Set(group.products.map(p=>p.id));for(const p of s.products){const existing=(p.additionalCategories||[]).filter(name=>name!==group.name);p.additionalCategories=ids.has(p.id)?[...existing,group.name]:existing;}if(s.products.filter(p=>p.additionalCategories.includes(group.name)).length!==group.limit)throw Error('Selection contains a missing product');}});
 for(const g of groups){const count=await prisma.product.count({where:{additionalCategories:{some:{name:g.name}}}});if(count!==g.limit)throw Error('Saved count mismatch');console.log(`${g.name}: ${count} selected products saved.`);}
}finally{await prisma.$disconnect();}
