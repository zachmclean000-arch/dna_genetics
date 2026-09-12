import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
const blank = {
  name: "",
  slug: "",
  sku: "",
  price: 0,
  salePrice: null,
  category: "",
  strainType: "",
  description: "",
  shortDescription: "",
  genetics: "",
  thc: "",
  floweringTime: "",
  yield: "",
  stock: 0,
  status: "draft",
  images: [],
  featured: false,
  bestSeller: false,
  newArrival: false,
};
export default function ProductEditor() {
  const { id } = useParams(),
    navigate = useNavigate(),
    [product, setProduct] = useState(blank),
    [categories, setCategories] = useState([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api("/categories"),
      id ? api(`/products/${id}`) : Promise.resolve({ ...blank }),
    ])
      .then(([c, p]) => {
        setCategories(c);
        setProduct({ ...p, category: p.category || c[0] || "" });
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  const set = (key, value) => setProduct((p) => ({ ...p, [key]: value }));
  const field = (key, label, type = "text") => (
    <label key={key}>
      {label}
      <input
        type={type}
        value={product[key] ?? ""}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? (key === "stock" ? "1" : "0.01") : undefined}
        required={["name", "slug", "sku", "price", "stock"].includes(key)}
        onChange={(e) =>
          set(
            key,
            type === "number"
              ? e.target.value === "" && key === "salePrice"
                ? null
                : Number(e.target.value)
              : e.target.value,
          )
        }
      />
    </label>
  );
  if (loading) return <p>Loading editor…</p>;
  return (
    <>
      <Link to="/admin/products">← Products</Link>
      <h1>{id ? "Edit product" : "Create product"}</h1>
      <p role="alert" className="error">
        {message}
      </p>
      <form
        className="form editor"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMessage("");
          try {
            await api(id ? `/products/${id}` : "/products", {
              method: id ? "PUT" : "POST",
              body: product,
            });
            navigate("/admin/products");
          } catch (e) {
            setMessage(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset>
          <legend>Basic information</legend>
          <div className="form-grid">
            {field("name", "Product name")}
            {field("slug", "Slug (lowercase-with-hyphens)")}
            {field("sku", "SKU")}
            {field("shortDescription", "Short description")}
          </div>
          <label>
            Description
            <textarea
              rows="5"
              value={product.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Pricing & inventory</legend>
          <div className="form-grid">
            {field("price", "Regular price", "number")}
            {field("salePrice", "Sale price (optional)", "number")}
            {field("stock", "Stock", "number")}
            <label>
              Status
              <select
                value={product.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {["active", "draft", "archived"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Classification & attributes</legend>
          <div className="form-grid">
            <label>
              Category
              <select
                required
                value={product.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            {field("strainType", "Strain type")}
            {field("genetics", "Genetics (sample text)")}
            {field("thc", "Characteristics (sample text)")}
            {field("floweringTime", "Flowering time (sample text)")}
            {field("yield", "Yield (sample text)")}
          </div>
        </fieldset>
        <fieldset>
          <legend>Local images</legend>
          <p>
            PNG, JPEG or WebP · up to 5 MB each · first image is the main image.
          </p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy || product.images.length >= 12}
            aria-label="Upload product image"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              setBusy(true);
              try {
                const body = new FormData();
                body.append("image", file);
                const result = await api("/uploads", { method: "POST", body });
                setProduct((p) => ({
                  ...p,
                  images: [...p.images, result.path],
                }));
                setMessage(
                  "Image uploaded. Save the product to keep the change.",
                );
              } catch (e) {
                setMessage(e.message);
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
          <div className="editor-images">
            {product.images.map((src, i) => (
              <div key={src}>
                <img src={src} alt={`Product image ${i + 1}`} />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "images",
                      product.images.filter((_, j) => i !== j),
                    )
                  }
                >
                  Remove
                </button>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      set("images", [
                        src,
                        ...product.images.filter((_, j) => j !== i),
                      ])
                    }
                  >
                    Make main
                  </button>
                )}
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Homepage collections</legend>
          {[
            ["featured", "Featured"],
            ["bestSeller", "Bestseller"],
            ["newArrival", "New arrival"],
          ].map(([k, label]) => (
            <label className="check" key={k}>
              <input
                type="checkbox"
                checked={product[k]}
                onChange={(e) => set(k, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <button className="button gold" disabled={busy}>
          {busy ? "Saving…" : "Save product"}
        </button>
      </form>
    </>
  );
}
