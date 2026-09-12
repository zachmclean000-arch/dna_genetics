// Preserve the API shape while storing catalogue records in relational tables.
export async function readCatalogue(client) {
  const categories = await client.category.findMany({
    orderBy: { name: "asc" },
  });
  const records = await client.product.findMany({
    include: {
      category: true,
      additionalCategories: true,
      variants: { orderBy: { size: "asc" } },
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  return {
    categories: categories.map((c) => c.name),
    products: records.map(
      ({
        categoryId,
        category,
        additionalCategories,
        price,
        salePrice,
        createdAt,
        updatedAt,
        sourceCheckedAt,
        variants,
        ...p
      }) => ({
        ...p,
        category: category.name,
        additionalCategories: additionalCategories.map((c) => c.name),
        price: Number(price),
        salePrice: salePrice === null ? null : Number(salePrice),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        sourceCheckedAt: sourceCheckedAt?.toISOString() ?? null,
        variants: variants.map(({ productId, price, salePrice, ...v }) => ({
          ...v,
          price: Number(price),
          salePrice: salePrice === null ? null : Number(salePrice),
        })),
      }),
    ),
  };
}

export async function saveCatalogue(client, before, after) {
  for (const name of after.categories) {
    if (!before.categories.includes(name))
      await client.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
  }
  const existing = new Map(before.products.map((p) => [p.id, p]));
  const removed = before.products
    .filter((p) => !after.products.some((next) => next.id === p.id))
    .map((p) => p.id);
  if (removed.length)
    await client.product.deleteMany({ where: { id: { in: removed } } });
  for (const product of after.products) {
    if (JSON.stringify(existing.get(product.id)) === JSON.stringify(product))
      continue;
    const { id, category, variants, additionalCategories, ...fields } = product;
    const data = { ...fields, category: { connect: { name: category } } };
    await client.product.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
    if (additionalCategories)
      await client.product.update({
        where: { id },
        data: {
          additionalCategories: {
            set: additionalCategories.map((name) => ({ name })),
          },
        },
      });
    if (
      variants &&
      JSON.stringify(existing.get(id)?.variants) !== JSON.stringify(variants)
    ) {
      const old = await client.productVariant.findMany({
        where: { productId: id },
      });
      const removed = old.filter(
        (v) => !variants.some((next) => next.size === v.size),
      );
      if (removed.length)
        await client.productVariant.deleteMany({
          where: { id: { in: removed.map((v) => v.id) } },
        });
      for (const { id: variantId, ...variant } of variants) {
        await client.productVariant.upsert({
          where: { productId_size: { productId: id, size: variant.size } },
          create: { ...variant, productId: id },
          update: variant,
        });
      }
    }
  }
  const removedCategories = before.categories.filter(
    (name) => !after.categories.includes(name),
  );
  if (removedCategories.length)
    await client.category.deleteMany({
      where: { name: { in: removedCategories } },
    });
}
