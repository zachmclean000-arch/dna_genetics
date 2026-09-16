import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { cataloguePaths } from "../src/data/catalogueRoutes.js";

const fallbackHost = "dnna-genetics-two.vercel.app";
const configuredUrl = process.env.PUBLIC_SITE_URL?.trim();
const baseUrl = (
  configuredUrl ||
  `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || fallbackHost}`
).replace(/\/$/, "");
const catalogue = JSON.parse(
  readFileSync(new URL("../../backend/catalogue-seed.json", import.meta.url)),
);
const staticPaths = [
  "/",
  "/shop",
  "/about",
  "/promotions",
  "/faqs",
  "/shipping-information",
  "/returns-refund-policy",
  "/privacy",
  "/terms-conditions",
  "/loyalty-dna-points",
  "/contact",
  "/cannabis-seed-brochure",
  "/locations",
  "/best-indica-autoflower-seeds",
  "/best-feminized-seeds",
  "/best-autoflower-seeds",
  "/feminized-seeds-vs-regular-seeds",
  "/autoflower-vs-feminized",
  "/seeds-vs-clones",
  ...Object.values(cataloguePaths),
];
const productPaths = catalogue.products
  .filter(({ status }) => status === "active")
  .map(({ slug }) => `/product/${encodeURIComponent(slug)}`);
const paths = [...new Set([...staticPaths, ...productPaths])];
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
const publicDirectory = new URL("../public/", import.meta.url);
mkdirSync(publicDirectory, { recursive: true });
writeFileSync(new URL("sitemap.xml", publicDirectory), xml);
writeFileSync(
  new URL("robots.txt", publicDirectory),
  `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account
Disallow: /cart
Disallow: /checkout

Sitemap: ${baseUrl}/sitemap.xml
`,
);
console.log(`Generated SEO files for ${baseUrl} with ${paths.length} URLs.`);
