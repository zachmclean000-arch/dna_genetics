import assert from 'node:assert/strict';
import { transaction } from '../backend/store.js';
import { prisma } from '../backend/prisma-client.js';
const id=crypto.randomUUID();
try {
 const original=await transaction(s=>structuredClone(s.products));
 assert.equal(await prisma.product.count(),original.length);
 assert.ok(await prisma.category.findUnique({where:{name:'Feminized Seeds'}}));
 const template=original[0];assert.ok(template);
 await transaction(s=>s.products.push({...template,id,sku:`CHECK-${id}`,slug:`check-${id}`,name:'Database verification',variants:[],category:'Feminized Seeds',price:12.34,salePrice:10.25,stock:7}));
 assert.equal(Number((await prisma.product.findUnique({where:{id}})).price),12.34);
 await transaction(s=>{s.products.find(p=>p.id===id).stock=5;});
 assert.equal((await prisma.product.findUnique({where:{id}})).stock,5);
 await assert.rejects(transaction(s=>{s.products.find(p=>p.id===id).stock=0;throw Error('rollback check');}),/rollback check/);
 assert.equal((await prisma.product.findUnique({where:{id}})).stock,5);
 await assert.rejects(prisma.category.delete({where:{name:'Feminized Seeds'}}));
 console.log('PostgreSQL catalogue: transferred records, decimal prices, create/update, rollback and category restriction passed.');
} finally {
 await transaction(s=>{s.products=s.products.filter(p=>p.id!==id);});
 await prisma.$disconnect();
}
