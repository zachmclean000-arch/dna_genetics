import { test, expect } from "@playwright/test";
test("admin catalogue lifecycle, atomic import and cancellation", async ({
  page,
}) => {
  await page.goto("/account");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page
    .getByLabel("Password", { exact: true })
    .fill("classroom-admin-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("link", { name: "Open dashboard" }).click();
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await page.getByRole("link", { name: "Products", exact: true }).click();
  await page.getByRole("link", { name: "Create product" }).click();
  await page.getByLabel("Product name", { exact: true }).fill("QA sample");
  await page.getByLabel("Slug (lowercase-with-hyphens)").fill("qa-sample");
  await page.getByLabel("SKU", { exact: true }).fill("QA-001");
  await page.getByLabel("Regular price").fill("12.25");
  await page.getByLabel("Stock").fill("3");
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("active");
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(
    page.getByRole("cell", { name: "QA sample", exact: false }),
  ).toBeVisible();
  const all = await (await page.request.get("/api/products?admin=1")).json(),
    p = all.find((p) => p.slug === "qa-sample");
  expect(p.stock).toBe(3);
  const valid = {
    ...p,
    name: "Import sample",
    slug: "import-sample",
    sku: "IMPORT-001",
  };
  let response = await page.request.post("/api/products/import", {
    data: [valid, { ...valid, slug: "broken", sku: "BROKEN", stock: -1 }],
  });
  expect(response.status()).toBe(400);
  let list = await (await page.request.get("/api/products?admin=1")).json();
  expect(list.some((p) => p.slug === "import-sample")).toBe(false);
  response = await page.request.post("/api/products/import", { data: [valid] });
  expect(response.status()).toBe(201);
  const image = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
    "base64",
  );
  response = await page.request.post("/api/uploads", {
    multipart: {
      image: { name: "pixel.png", mimeType: "image/png", buffer: image },
    },
  });
  expect(response.status()).toBe(201);
  const uploaded = (await response.json()).path;
  expect(uploaded).toMatch(/^\/uploads\//);
  expect((await page.request.get(uploaded)).status()).toBe(200);
  response = await page.request.post("/api/uploads", {
    multipart: {
      image: {
        name: "bad.svg",
        mimeType: "image/svg+xml",
        buffer: Buffer.from("<svg></svg>"),
      },
    },
  });
  expect(response.status()).toBe(400);
  await page.goto(`/admin/products/${p.id}/edit`);
  await page.getByLabel("Product name", { exact: true }).fill("QA updated");
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(
    page.getByRole("cell", { name: "QA updated", exact: false }),
  ).toBeVisible();
  response = await page.request.post("/api/orders", {
    data: { items: [{ id: p.id, quantity: 2 }] },
  });
  expect(response.status()).toBe(201);
  const o = await response.json();
  expect(o.total).toBe(24.5);
  await page.request.patch(`/api/orders/${o.id}`, {
    data: { status: "cancelled" },
  });
  await page.request.patch(`/api/orders/${o.id}`, {
    data: { status: "cancelled" },
  });
  expect(
    (await (await page.request.get(`/api/products/${p.id}`)).json()).stock,
  ).toBe(3);
  expect(
    (
      await page.request.post("/api/categories", {
        data: { name: "QA category" },
      })
    ).status(),
  ).toBe(201);
  expect(
    (await page.request.delete("/api/categories/QA%20category")).status(),
  ).toBe(200);
  expect(
    (await page.request.delete("/api/categories/Feminized%20Seeds")).status(),
  ).toBe(400);
  expect((await page.request.delete(`/api/products/${p.id}`)).status()).toBe(
    200,
  );
  expect((await page.request.get(`/api/products/${p.id}`)).status()).toBe(404);
  const imported = (
    await (await page.request.get("/api/products?admin=1")).json()
  ).find((x) => x.slug === "import-sample");
  await page.request.delete(`/api/products/${imported.id}`);
});
