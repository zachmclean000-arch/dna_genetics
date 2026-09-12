-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sourceCheckedAt" TIMESTAMP(3),
ADD COLUMN     "sourceUrl" TEXT;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "size" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "salePrice" DECIMAL(12,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sourceAvailable" BOOLEAN,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_size_key" ON "ProductVariant"("productId", "size");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
