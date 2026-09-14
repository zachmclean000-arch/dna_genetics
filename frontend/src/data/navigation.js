export const navigation = [
  ["About DNA", "/about"],
  ["Deals & Promos", "/promotions"],
];
const category = (name) => `/shop?category=${encodeURIComponent(name)}`;
const attribute = (name) => `/shop?attribute=${encodeURIComponent(name)}`;
export const menuGroups = [
  {
    title: "Shop by Seed Type",
    items: [
      ["Feminized Seeds (42)", category("Feminized Seeds")],
      ["Autoflower Seeds (17)", category("Autoflower Seeds")],
      ["Regular Seeds (14)", category("Regular Seeds")],
    ],
  },
  {
    title: "Shop by Strain Genetics",
    items: [
      ["Indica Seeds (49)", attribute("Indica")],
      ["Sativa Seeds (8)", attribute("Sativa")],
      ["Hybrid Seeds (9)", attribute("Hybrid")],
    ],
  },
  {
    title: "Shop by Grower Trait",
    items: [
      ["Indoor Seeds (15)", "Indoor"],
      ["High Yield Seeds (10)", "High Yield"],
      ["High THC Seeds (19)", "High THC"],
      ["Beginner-Friendly Seeds (10)", "Beginner-Friendly"],
      ["Fast-Flowering Seeds (12)", "Fast-Flowering"],
      ["Medicinal Seeds (14)", "Medicinal"],
      ["Outdoor Seeds (3)", "Outdoor"],
      ["High CBD Seeds (1)", "High CBD"],
    ].map(([label, value]) => [label, attribute(value)]),
  },
  {
    title: "Featured & New",
    items: [
      ["Best Cannabis Seeds (16)", "/shop?collection=bestSeller"],
      ["Classic Strains (4)", "/shop?collection=featured"],
      ["New Strains (2)", "/shop?collection=newArrival"],
      ["Mix Packs (2)", attribute("Mix Packs")],
      ["Cheap Weed Seeds (23)", "/shop?collection=cheapSeeds&sort=price-asc"],
    ],
  },
];
export const usefulLinks = [
  ["FAQ’s", "/faqs"],
  ["Shipping Info", "/shipping-information"],
  ["Returns & Refund Policy", "/returns-refund-policy"],
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms-conditions"],
  ["Loyalty DNA Points", "/loyalty-dna-points"],
  ["Contact", "/contact"],
  ["Cannabis Articles", "/articles"],
  ["Blog", "/blog"],
  ["About Us", "/about"],
  ["Cannabis Seed Brochure", "/cannabis-seed-brochure"],
];
export const shopLinks = [
  ["Feminized Seeds", category("Feminized Seeds")],
  [
    "Regular Cannabis Seeds: Grow Your Own High-Quality Cannabis",
    category("Regular Seeds"),
  ],
  ["Promotions", "/promotions"],
  ["Best Cannabis Seeds", "/shop?collection=bestSeller"],
];
export const articleLinks = [
  [
    "7 Best Indica Autoflower Seeds from DNA Genetics",
    "/articles/best-indica-autoflower-seeds",
  ],
  [
    "Top 17 Most Popular Feminized Weed Strains from DNA Genetics",
    "/articles/best-feminized-seeds",
  ],
  [
    "Top 10 Best Autoflower Seeds from Our Seed Bank for 2024",
    "/articles/best-autoflower-seeds",
  ],
  [
    "Feminized Seeds vs Regular: Ultimate Guide for Growers",
    "/articles/feminized-seeds-vs-regular-seeds",
  ],
  [
    "Autoflower vs Feminized Seeds: Everything You Need to Know",
    "/articles/autoflower-vs-feminized",
  ],
  ["Cannabis Seeds vs Clones: Which are Better?", "/articles/seeds-vs-clones"],
  ["Locations", "/locations"],
];
