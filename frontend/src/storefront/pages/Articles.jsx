import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./Articles.css";

function useSeo({ title, description, path, schema }) {
  React.useEffect(() => {
    document.title = title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.append(descriptionTag);
    }
    descriptionTag.content = description;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = new URL(path, window.location.origin).href;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.pageSchema = "locations";
    script.textContent = JSON.stringify(schema);
    document.head
      .querySelector('script[data-page-schema="locations"]')
      ?.remove();
    document.head.append(script);
    return () => script.remove();
  }, [title, description, path, schema]);
}

const articles = {
  "best-indica-autoflower-seeds": [
    "7 Best Indica Autoflower Seeds from DNA Genetics",
    "13-7-2024",
    "/assets/images/catalogue/purple-people-eater-auto-seeds-0.webp",
    "Indica autoflower varieties combine compact, quick-flowering characteristics with profiles associated with indica-dominant genetics.",
    [
      [
        "1. Purple People Eater Auto",
        "Sweet & Sour Purple crossed with OG Kush Auto, presented with fruit-led notes and an 8–9 week flowering reference.",
      ],
      [
        "2. Return of the Mac Auto",
        "An OG Kush Auto and MAC cross with apricot, cherry, citrus, and creamy flavor notes.",
      ],
      [
        "3. Canelo Auto",
        "Strawberry Banana and OG Kush Auto genetics with strawberry, banana, lemon, pine, and earthy notes.",
      ],
      [
        "4. HG23 aka Michael Jordan Auto",
        "An HG23 and OG Kush Auto cross with citrus, floral, sweet, and woody characteristics.",
      ],
      [
        "5. Watermelon Man Auto",
        "Watermelon and OG Kush Auto genetics presented with sweet fruit and deep earthy notes.",
      ],
      [
        "6. DNA Cake Auto",
        "A quick-flowering DNA Cake variety with sweet, vanilla, nutty, and lightly spiced notes.",
      ],
      [
        "7. The Big Mac Auto",
        "MAC crossed with OG Kush Auto, bringing together earth, citrus, spice, and tropical notes.",
      ],
    ],
  ],
  "best-feminized-seeds": [
    "Top 17 Most Popular Feminized Weed Strains from DNA Genetics",
    "7-6-2024",
    "/assets/images/catalogue/blue-dream-feminized-0.webp",
    "This editorial overview groups seventeen popular feminized catalogue choices by their genetics, flavor profiles, and product characteristics.",
    [
      [
        "Popular classics",
        "Blue Dream, Chocolope, GG4, Green Crack, White Widow, and Kosher Kush represent recognizable catalogue classics.",
      ],
      [
        "Fruit-led profiles",
        "Strawberry Banana S1, Banana Sorbet, Gelato Sorbet, and Purple Chocolope feature sweet, fruit, dessert, or citrus-led descriptions.",
      ],
      [
        "Modern crosses",
        "DNA Cake, Four Prophets, HG23, RP43, Snack Pack, Swiss Miss, and You Whoo complete the list with newer combinations.",
      ],
      [
        "Comparing entries",
        "Compare genetics, flowering reference, strain type, pack size, and catalogue availability on each local product page.",
      ],
    ],
  ],
  "best-autoflower-seeds": [
    "Top 10 Best Autoflower Seeds from Our Seed Bank for 2024",
    "10-5-2024",
    "/assets/images/catalogue/hg23-aka-michael-jordan-auto-0.webp",
    "Autoflower varieties are known for flowering independently of seasonal daylight changes. This list highlights ten catalogue examples.",
    [
      [
        "The featured ten",
        "Purple People Eater, Return of the Mac, Canelo, HG23, Watermelon Man, DNA Cake, The Big Mac, Macnana, Kosher Dawg, and Skywalker Kush Auto.",
      ],
      [
        "Why the type stands out",
        "Compact form, a shorter lifecycle, and straightforward flowering behavior make autoflowers a common subject in seed-type comparisons.",
      ],
      [
        "Compare products",
        "Use the local Autoflower Seeds page to compare pack sizes, prices, genetics, and available descriptions.",
      ],
    ],
  ],
  "feminized-seeds-vs-regular-seeds": [
    "Feminized Seeds vs Regular: Ultimate Guide for Growers",
    "3-5-2024",
    "/assets/images/catalogue/chocolope-fem-0.webp",
    "Regular and feminized seeds differ in expected sex expression, breeding use, predictability, and collection planning.",
    [
      [
        "What are feminized seeds?",
        "Feminized seeds are produced to greatly increase the likelihood of female plants and are often selected for flower-focused collections.",
      ],
      [
        "What are regular seeds?",
        "Regular seeds can produce male or female plants and retain variation often sought for breeding and preservation work.",
      ],
      [
        "Main differences",
        "Feminized lines offer a predictable sex ratio. Regular lines provide both sexes and broader selection possibilities.",
      ],
      [
        "Choosing a type",
        "The choice depends on whether the priority is predictable female plants or access to both sexes for genetic selection.",
      ],
    ],
  ],
  "autoflower-vs-feminized": [
    "Autoflower vs Feminized Seeds: Everything You Need to Know",
    "29-4-2024",
    "/assets/images/catalogue/dna-auto-mystery-pack-cannabis-seeds-0.webp",
    "Autoflower and feminized describe different traits: flowering behavior and the expected sex of the resulting plants.",
    [
      [
        "Understanding flowering types",
        "Regular, autoflower, and feminized labels describe different biological or breeding characteristics and may overlap in a product.",
      ],
      [
        "Autoflower characteristics",
        "Autoflower genetics are commonly associated with compact plants and a shorter, age-triggered flowering cycle.",
      ],
      [
        "Feminized characteristics",
        "Feminized lines are selected for a very high likelihood of female plants and appear across many strain types.",
      ],
      [
        "The comparison",
        "Compare space, time, desired plant characteristics, and local law when studying the differences between seed types.",
      ],
    ],
  ],
  "seeds-vs-clones": [
    "Cannabis Seeds vs Clones: Which are Better?",
    "26-4-2024",
    "/assets/images/about/abt_bulkpic-sized.webp",
    "Seeds carry a new genetic combination, while a clone is a cutting with the same genotype as its source plant.",
    [
      [
        "Understanding genetics",
        "A genotype is a plant’s genetic profile, while phenotype describes observable traits shaped by genetics and environment.",
      ],
      [
        "Characteristics of seeds",
        "Seeds provide genetic diversity and a fresh biological starting point, though individuals can show variation.",
      ],
      [
        "Characteristics of clones",
        "Clones preserve the source genotype and provide consistency, but can also carry weaknesses from the source plant.",
      ],
      [
        "The comparison",
        "Neither method is universally better. The choice depends on whether diversity, preservation, consistency, or living material matters most.",
      ],
    ],
  ],
};

export function ArticlePage() {
  const { slug: routeSlug } = useParams();
  const { pathname } = useLocation();
  const slug = routeSlug || pathname.split("/").filter(Boolean).at(-1);
  const article = articles[slug];
  if (!article)
    return (
      <section className="dna-article-page dna-container">
        <h1>Article not found</h1>
      </section>
    );
  const [title, date, image, intro, sections] = article;
  return (
    <article className="dna-article-page dna-container">
      <p className="dna-article-kicker">CANNABIS ARTICLES</p>
      <h1>{title}</h1>
      <p className="dna-article-meta">
        Author: <strong>Adam</strong>
        <span>|</span>Posted on {date}
      </p>
      <img className="dna-article-hero" src={image} alt="" />
      <p className="dna-article-lead">{intro}</p>
      <div className="dna-article-copy">
        {sections.map(([heading, body]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <div className="dna-article-actions">
        <Link className="button gold" to="/shop">
          EXPLORE SHOP
        </Link>
        <Link to="/about">ABOUT DNA</Link>
      </div>
    </article>
  );
}

const regions = [
  [
    "California",
    [
      "Los Angeles",
      "San Diego",
      "San Francisco",
      "Sacramento",
      "Oakland",
      "Anaheim",
    ],
  ],
  [
    "Michigan",
    ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint", "Kalamazoo"],
  ],
  [
    "Texas",
    ["Houston", "Dallas", "Austin", "Fort Worth", "Arlington", "Irving"],
  ],
  [
    "Other featured areas",
    ["New York", "Chicago", "Phoenix", "Philadelphia", "Denver", "Seattle"],
  ],
];
export function LocationsPage() {
  const { city: citySlug } = useParams();
  const cities = regions.flatMap(([region, names]) =>
    names.map((name) => ({
      name,
      region,
      slug: name.toLowerCase().replaceAll(" ", "-"),
    })),
  );
  const city = cities.find((entry) => entry.slug === citySlug);
  const title = city
    ? `DNA Genetics Catalogue Information for ${city.name}`
    : "DNA Genetics Locations Directory";
  const description = city
    ? `Explore DNA Genetics seed catalogue categories and educational product information for ${city.name}, ${city.region}. No local store or delivery is offered by this project.`
    : "Browse the educational DNA Genetics location directory with regional catalogue information for featured cities in California, Michigan, Texas, and other areas.";
  const pagePath = city ? `/locations/${city.slug}` : "/locations";
  const schema = React.useMemo(
    () =>
      city
        ? {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url: new URL(pagePath, window.location.origin).href,
            isPartOf: {
              "@type": "CollectionPage",
              name: "DNA Genetics Locations Directory",
              url: new URL("/locations", window.location.origin).href,
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: new URL("/locations", window.location.origin).href,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: cities.map((entry, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: entry.name,
                url: new URL(`/locations/${entry.slug}`, window.location.origin)
                  .href,
              })),
            },
          },
    [city, cities, description, pagePath, title],
  );
  useSeo({ title, description, path: pagePath, schema });

  if (city)
    return (
      <article className="dna-city-page">
        <div className="dna-locations-hero">
          <div className="dna-container">
            <p>{city.region.toUpperCase()} LOCATION GUIDE</p>
            <h1>DNA Genetics in {city.name}</h1>
            <span>
              Educational catalogue and seed-type information for {city.name}.
            </span>
          </div>
        </div>
        <div className="dna-container dna-city-content">
          <nav aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span>/</span>{" "}
            <Link to="/locations">Locations</Link> <span>/</span> {city.name}
          </nav>
          <h2>Explore the catalogue from {city.name}</h2>
          <p>
            This page helps visitors in {city.name}, {city.region}, find the
            educational seed catalogue, product categories, strain information,
            and project policies in one place. The project demonstrates an
            ecommerce browsing experience and does not claim to operate a shop
            or delivery service in {city.name}.
          </p>
          <div className="dna-city-sections">
            <section>
              <h3>Browse seed categories</h3>
              <p>
                Compare feminized, autoflower, regular, indica, sativa, and
                hybrid catalogue groupings with product images, descriptions,
                pack sizes, and simulated pricing.
              </p>
              <Link to="/shop">Explore the shop →</Link>
            </section>
            <section>
              <h3>Shipping and returns information</h3>
              <p>
                Review how the demonstration checkout models shipping totals and
                learn why no physical fulfilment or refund is available.
              </p>
              <Link to="/shipping-information">
                Read shipping information →
              </Link>
            </section>
          </div>
          <section className="dna-location-faq">
            <h2>Frequently asked questions</h2>
            <details>
              <summary>Is there a project store in {city.name}?</summary>
              <p>
                No. This is an educational website and has no physical retail
                location.
              </p>
            </details>
            <details>
              <summary>Does this project deliver to {city.name}?</summary>
              <p>
                No. Cart, checkout, shipping, and order emails demonstrate
                software behavior only.
              </p>
            </details>
            <details>
              <summary>Where can I compare catalogue categories?</summary>
              <p>
                Use the Shop All Seeds menu or the local shop page to browse all
                active educational product records.
              </p>
            </details>
          </section>
          <Link className="button gold" to="/locations">
            VIEW ALL LOCATIONS
          </Link>
        </div>
      </article>
    );
  return (
    <section className="dna-locations-page">
      <div className="dna-locations-hero">
        <div className="dna-container">
          <p>DNA GENETICS NEAR YOU</p>
          <h1>Locations</h1>
          <span>
            Explore the location directory represented in this educational
            storefront.
          </span>
        </div>
      </div>
      <div className="dna-container dna-locations-content">
        <h2>Find information by location</h2>
        <p>
          The original directory groups regional information across many cities.
          These names reproduce that browsing structure; this project does not
          operate stores or ship to them.
        </p>
        <div className="dna-location-grid">
          {regions.map(([region, cities]) => (
            <section key={region}>
              <h3>{region}</h3>
              <ul>
                {cities.map((city) => (
                  <li key={city}>
                    <Link
                      to={`/locations/${city
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <Link className="button gold" to="/shop">
          BROWSE THE CATALOGUE
        </Link>
      </div>
    </section>
  );
}
