import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { menuGroups } from "../../data/navigation";
import Icon from "./Icon";
import { api } from "../../services/api";
import { collectionKey, seedCollections } from "../../data/seedCollections";
export default function MegaMenu({ onBack, onNavigate }) {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    let active = true;
    api("/products")
      .then((rows) => {
        if (active) setProducts(rows);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const menuLabel = (label, to) => {
    const params = new URLSearchParams(to.split("?")[1] || "");
    const genetics = params.get("attribute");
    const category = params.get("category");
    const curated = collectionKey(params);
    if (curated) {
      const title = label.replace(/\s*\(\d+\)$/, "");
      return products
        ? `${title} (${products.filter((p) => p.additionalCategories?.includes(seedCollections[curated])).length})`
        : title;
    }
    const trait = [
      "Indoor",
      "High Yield",
      "High THC",
      "Beginner-Friendly",
      "Fast-Flowering",
      "Medicinal",
      "Outdoor",
      "High CBD",
    ].includes(genetics)
      ? genetics
      : "";
    if (
      !["Indica", "Sativa", "Hybrid"].includes(genetics) &&
      !trait &&
      !["Feminized Seeds", "Autoflower Seeds", "Regular Seeds"].includes(
        category,
      )
    )
      return label;
    const title = label.replace(/\s*\(\d+\)$/, "");
    if (!products) return title;
    const count = products.filter((p) =>
      trait
        ? p.additionalCategories?.includes(`${trait} Seeds`)
        : genetics
          ? p.strainType === genetics
          : p.category === category ||
            p.additionalCategories?.includes(category),
    ).length;
    return `${title} (${count})`;
  };
  return (
    <div id="dna-mega-menu" className="dna-mega">
      <div className="dna-mega-inner">
        <button className="dna-menu-back" onClick={onBack}>
          <Icon name="angleLeft" /> Back
        </button>
        <div className="dna-menu-groups">
          {menuGroups.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} onClick={onNavigate}>
                      {menuLabel(label, to)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="dna-menu-feature">
          <img src="/assets/images/header/megaicon1.webp" alt="" />
          <div>
            <p>Strain of the Month</p>
            <p>Discover our latest award-winner.</p>
            <Link to="/shop" onClick={onNavigate}>
              SHOP SEEDS
            </Link>
          </div>
          <img src="/assets/images/header/megaicon2.webp" alt="" />
        </div>
      </div>
    </div>
  );
}
