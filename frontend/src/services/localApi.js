import { categories, products } from "../data/catalogue";

export async function localApi(url, options = {}) {
  const path = url.split("?")[0];
  const method = options.method || "GET";
  if (method === "GET") {
    if (path === "/auth/me") return null;
    if (path === "/reviews") return [];
    if (path === "/categories") return structuredClone(categories);
    if (path === "/products") return structuredClone(products);
    if (path.startsWith("/products/")) {
      const slug = decodeURIComponent(path.slice("/products/".length));
      const product = products.find((p) => p.slug === slug || p.id === slug);
      if (!product) throw Error("Product not found.");
      return structuredClone(product);
    }
  }
  if (method === "POST" && path === "/contact")
    return { message: "Thank you for contacting us." };
  throw Error(
    "This feature will be connected when we work on the backend. Nothing has been submitted.",
  );
}
