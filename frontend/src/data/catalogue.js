// Temporary local data for frontend development. Replace through the API when
// backend integration begins; IDs stay stable across browser reloads.
export const categories = [
  "Feminized Seeds",
  "Autoflower Seeds",
  "Regular Seeds",
];

export const products = [
  "Purple Chocolope",
  "Chocolope",
  "Strawberry Banana",
  "Bruised Bananas",
  "Blue Dream",
  "White Widow",
  "GG4",
  "Skywalker Kush",
].map((name, index) => ({
  id: `local-${index + 1}`,
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  sku: `DNA-${index + 1}`,
  price: 79.95 + index,
  salePrice: null,
  category: index % 3 === 0 ? "Regular Seeds" : "Feminized Seeds",
  strainType: index % 2 ? "Sativa" : "Hybrid",
  description:
    "Explore this DNA Genetics catalogue entry, product details, and current availability.",
  shortDescription: "DNA Genetics catalogue",
  genetics: "Sample data",
  stock: 20,
  status: "active",
  images: ["/assets/images/products/seed-pack.svg"],
  featured: index < 4,
  bestSeller: index > 3,
  newArrival: index < 4,
}));
