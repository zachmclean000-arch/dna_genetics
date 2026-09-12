import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import reference from "../../data/aboutReference.json";
import awardCovers from "../../data/aboutAwardCovers.json";
import AwardLogoCarousel from "../components/AwardLogoCarousel";
import "./About.css";

const root = "/assets/images/about/";
const history = [
  [
    "2003",
    "A move to Amsterdam",
    "Don and Aaron leave California for the Netherlands.",
  ],
  ["2004", "Opening the shop", "DNA Genetics establishes its Amsterdam home."],
  [
    "2004",
    "First recognition",
    "L.A. Confidential earns a Cannabis Cup placing.",
  ],
  [
    "2005",
    "Building momentum",
    "Martian Mean Green and L.A. Confidential receive awards.",
  ],
  ["2006", "Magazine honours", "High Times recognizes two DNA varieties."],
  [
    "2007",
    "Chocolope emerges",
    "Chocolope receives international recognition.",
  ],
  [
    "2008",
    "Across Europe",
    "Awards arrive from Slovakia, Barcelona and Amsterdam.",
  ],
  [
    "2009",
    "An expanding collection",
    "Lemon Skunk and other varieties gain recognition.",
  ],
  ["2010", "International milestones", "Cannalope Haze wins in Buenos Aires."],
  ["2011", "Kosher Kush", "Kosher Kush joins the award-winning collection."],
  [
    "2012",
    "Continued recognition",
    "Kosher Kush and Sleestack receive further honours.",
  ],
  [
    "2013",
    "Introducing Tangie",
    "Tangie attracts attention at American competitions.",
  ],
  ["2014", "A memorable year", "The brand records twenty awards."],
  ["2015", "Canadian partnership", "DNA Genetics partners with Canopy Growth."],
  [
    "2016 / 2017",
    "Growing relationships",
    "The Canadian partnership is extended.",
  ],
  [
    "2018",
    "A Canadian milestone",
    "DNA participates in Canada’s legal market launch.",
  ],
  [
    "2019",
    "Licensing partnerships",
    "New agreements expand the brand’s American presence.",
  ],
  [
    "2020",
    "New Year New Launch for DNA",
    "The long-awaited launch means that DNA Genetics products will officially be sold to the American public in the chosen selected states. We hope that with changes in legislation this will eventually allow the full release of all DNA products including cannabis seeds. This year focuses on partnering up with carefully selected different companies/brands helping to release DNA Genetics products and accessories to every state across America.",
  ],
  [
    "2021",
    "Products Hitting the Market",
    "DNA Genetics products and accessories are hitting various dispensaries with more locations added every month. DNA Genetics has partnered with various producers and extractions for example, Errl Hill for the launch of the DNA Genetics ZtrawberrieZ liquid live vape pen and Fidels for the DNA Genetics Hash Hole pre rolls with Natura.",
  ],
];
const colors = [
  "#0b4d3c",
  "#faa004",
  "#07a47b",
  "#aa803e",
  "#d2531b",
  "#d2ad1b",
];
const assets = Object.values(reference.images);
const trophies = awardCovers.map((cover) => cover.image);
const products = assets.filter((p) => p.includes("150x150"));
const productNames = [
  "GG4 Fem Cannabis Seeds",
  "Green Crack Fem Cannabis Seeds",
  "White Widow Feminized Cannabis Seeds",
  "Double Stuffed Sorbet Fem Cannabis Seeds",
  "Gelato Sorbet Fem Cannabis Seeds",
  "GMO Kosher Fem Cannabis Seeds",
];
const productPrices = [79.96, 80.12, 79.05, 80.12, 45, 45];
// Preserve the row order and repetitions in the supplied reference archive.
const awards = reference.awards.filter((row) => row.length === 4);

export default function About() {
  const timeline = useRef(null);
  const sidebar = useRef(null);
  useEffect(() => {
    const list = timeline.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      sidebar.current.style.setProperty(
        "--sidebar-height",
        `${sidebar.current.offsetHeight}px`,
      );
      const midpoint = window.innerHeight / 2 + 20;
      for (const item of list.children) {
        const bounds = item.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(bounds.height, midpoint - bounds.top),
        );
        item.style.setProperty("--line-progress", `${progress}px`);
        item.classList.toggle("is-reached", progress > 0);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(list);
    resize.observe(sidebar.current);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="dna-about-page">
      <section className="dna-about-hero">
        <picture>
          <source
            media="(max-width:600px)"
            srcSet={root + "mob-abt_bnnr-1.webp"}
          />
          <img
            src={root + "about_bnner-sized.webp"}
            alt="DNA Genetics founders"
          />
        </picture>
        <h1>
          How It All <span>Began</span>
        </h1>
      </section>
      <nav
        className="dna-about-container dna-about-breadcrumb"
        aria-label="Breadcrumb"
      >
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">About</span>
      </nav>
      <div className="dna-about-container dna-about-main">
        <section
          className="dna-about-history"
          aria-labelledby="dna-about-timeline-title"
        >
          <div className="dna-about-section-heading">
            <img src={root + "abticon.svg"} alt="" />
            <div>
              <p>History in the Making</p>
              <h2 id="dna-about-timeline-title">Timeline</h2>
            </div>
          </div>
          <ol className="dna-about-timeline" ref={timeline}>
            {history.map(([year, title, text], i) => (
              <li
                key={`${year}-${title}`}
                style={{
                  "--milestone":
                    year === "2020"
                      ? "#543bb6"
                      : year === "2021"
                        ? "#58a487"
                        : colors[i % colors.length],
                }}
              >
                <span className="dna-about-year">{year}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <aside className="dna-about-sidebar" aria-label="Explore DNA Genetics">
          <div className="dna-about-sidebar-stack" ref={sidebar}>
            <div className="dna-about-sidebar-card dna-about-bulk-sticky">
              <h2>Bulk Clones</h2>
              <img
                src={root + "abt_bulkpic-sized.webp"}
                alt="DNA Genetics collection artwork"
                loading="lazy"
              />
              <p>
                Explore more of the brand through our local information pages.
              </p>
              <Link className="dna-about-button" to="/contact">
                Contact Us
              </Link>
            </div>
            <div className="dna-about-sidebar-card dna-about-after-timeline">
              <h2>Cheap Weed Seeds In</h2>
              {products.map((image, i) => (
                <Link className="dna-about-product" key={image} to="/shop">
                  <img src={image} alt={productNames[i]} loading="lazy" />
                  <span className="dna-about-product-info">
                    <strong>{productNames[i]}</strong>
                    <span className="dna-about-product-price">
                      ${productPrices[i].toFixed(2)}
                    </span>
                    <span className="dna-about-shop-button">
                      Shop Now <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <section
        className="dna-about-container dna-about-awards"
        aria-labelledby="dna-about-awards-title"
      >
        <div className="dna-about-section-heading">
          <img src={root + "abticon.svg"} alt="" />
          <div>
            <p>World-Renowned</p>
            <h2 id="dna-about-awards-title">Cup Winners</h2>
          </div>
        </div>
        <div className="dna-about-awards-intro">
          <p>
            DNA Genetics describes an awards history spanning more than 200
            honours across international competitions and industry publications.
          </p>
          <p>
            That history includes recognition in High Times, a place in its
            Seedbank Hall of Fame in 2009, and a Trailblazers award
            acknowledging contributions to the wider industry. The magazine
            covers below present some of those milestones.
          </p>
          <p>
            Although the company says it no longer enters competitions directly,
            its varieties continue to appear in award-winning entries. This
            gallery brings together a selection of the publications and events
            associated with that history.
          </p>
        </div>
        <div className="dna-about-trophies">
          {trophies.map((image) => (
            <img
              key={image}
              src={image}
              alt="Magazine cover featuring DNA Genetics awards"
              loading="lazy"
            />
          ))}
        </div>
        <AwardLogoCarousel />
      </section>
      <section className="dna-about-award-records" aria-label="Award records">
        <div className="dna-about-container">
          <div
            className="dna-about-table-wrap"
            tabIndex="0"
            role="region"
            aria-label="Award records, scroll horizontally on small screens"
          >
            <table aria-label="DNA Genetics award archive">
              <thead>
                <tr>
                  {["Year", "Place", "Strain", "Cup"].map((title) => (
                    <th scope="col" key={title}>
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {awards.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
