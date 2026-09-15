import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import SeedProduct from "./SeedProduct";
export default function ProductDetails() {
  const { slug, packSize } = useParams(),
    [p, setP] = useState(null),
    [related, setRelated] = useState([]),
    [error, setError] = useState("");
  useEffect(() => {
    setP(null);
    setError("");
    let active = true;
    Promise.all([api(`/products/${slug}`), api("/products")])
      .then(([p, all]) => {
        if (active) {
          setP(p);
          setRelated(
            all.filter((x) => x.id !== p.id && x.category === p.category),
          );
        }
      })
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [slug]);
  if (error) return <p className="section error">{error}</p>;
  if (!p) return <p className="section">Loading product…</p>;
  return (
    <SeedProduct
      key={`${p.id}-${packSize || "default"}`}
      product={p}
      related={related}
    />
  );
}
