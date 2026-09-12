-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "sku" VARCHAR(80) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "salePrice" DECIMAL(12,2),
    "categoryId" UUID NOT NULL,
    "strainType" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "genetics" TEXT NOT NULL DEFAULT '',
    "thc" TEXT NOT NULL DEFAULT '',
    "floweringTime" TEXT NOT NULL DEFAULT '',
    "yield" TEXT NOT NULL DEFAULT '',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "images" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "bestSeller" BOOLEAN NOT NULL DEFAULT false,
    "newArrival" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_categoryId_status_idx" ON "Product"("categoryId", "status");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
