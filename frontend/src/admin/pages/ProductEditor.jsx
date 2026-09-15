import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
const storefrontDestinations = [
  ["THCA Flower", "/shop/thca-flower"],
  ["Live Rosin", "/shop/live-rosin"],
  ["Vape", "/shop/vape"],
  ["Concentrate", "/shop/concentrate"],
];
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
  status: "active",
  images: [],
  featured: false,
  bestSeller: false,
  newArrival: false,
  variants: [],
};
export default function ProductEditor() {
  const { id } = useParams(),
    navigate = useNavigate(),
    [product, setProduct] = useState(blank),
    [categories, setCategories] = useState([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  const messageRef = useRef(null);
  const destinationNames = storefrontDestinations.map(([name]) => name);
  const otherCategories = categories.filter(
    (category) => !destinationNames.includes(category),
  );
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api("/categories"),
      id ? api(`/products/${id}`) : Promise.resolve({ ...blank }),
    ])
      .then(([c, p]) => {
        setCategories(c);
        setProduct({
          ...p,
          category: p.category || (id ? c[0] || "" : ""),
        });
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (message !== "Image uploaded. Save the product to keep the change.")
      return;
    const timeout = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);
  const set = (key, value) => setProduct((p) => ({ ...p, [key]: value }));
  const updateVariant = (index, key, value) =>
    setProduct((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant,
      ),
    }));
  const addVariant = () =>
    setProduct((current) => ({
      ...current,
      variants: [
        ...(current.variants || []),
        {
          size: (current.variants?.at(-1)?.size || 0) + 1,
          sku: `${current.sku || "PRODUCT"}-${(current.variants?.length || 0) + 1}`,
          price: current.price || 0,
          salePrice: null,
          stock: 0,
        },
      ],
    }));
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
      {message && (
        <p
          ref={messageRef}
          id="product-editor-message"
          role="alert"
          className="error admin-editor-message"
          tabIndex="-1"
        >
          {message}
        </p>
      )}
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
            requestAnimationFrame(() => {
              messageRef.current?.focus();
              messageRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            });
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
          <div className="admin-variant-heading">
            <div>
              <h2>Variable prices</h2>
              <p>
                Add one row for every available size or pack. These prices and
                stock levels replace the single product price on the storefront.
              </p>
            </div>
            <button className="button" type="button" onClick={addVariant}>
              + Add price option
            </button>
          </div>
          {!!product.variants?.length && (
            <div className="admin-variants">
              {product.variants.map((variant, index) => (
                <div className="admin-variant-row" key={variant.id || index}>
                  <label>
                    Size / quantity
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={variant.size}
                      onChange={(event) =>
                        updateVariant(index, "size", Number(event.target.value))
                      }
                    />
                  </label>
                  <label>
                    Variant SKU
                    <input
                      value={variant.sku}
                      onChange={(event) =>
                        updateVariant(index, "sku", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Regular price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "price",
                          Number(event.target.value),
                        )
                      }
                    />
                  </label>
                  <label>
                    Sale price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.salePrice ?? ""}
                      placeholder="Optional"
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "salePrice",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                        )
                      }
                    />
                  </label>
                  <label>
                    Stock
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={variant.stock}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "stock",
                          Number(event.target.value),
                        )
                      }
                    />
                  </label>
                  <button
                    className="admin-remove-variant"
                    type="button"
                    onClick={() =>
                      setProduct((current) => ({
                        ...current,
                        variants: current.variants.filter(
                          (_, variantIndex) => variantIndex !== index,
                        ),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>
        <fieldset>
          <legend>Classification & attributes</legend>
          <div className="form-grid">
            <label>
              Storefront page / category
              <select
                required
                value={product.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {!product.category && <option value="">Choose a page</option>}
                <optgroup label="Storefront navigation pages">
                  {storefrontDestinations.map(([name, path]) => (
                    <option key={name} value={name}>
                      {name} — {path}
                    </option>
                  ))}
                </optgroup>
                {!!otherCategories.length && (
                  <optgroup label="Other shop categories">
                    {otherCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <small>
                The product appears on the selected page when its status is
                active.
              </small>
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
        <button
          className="button gold"
          disabled={busy}
          aria-describedby={message ? "product-editor-message" : undefined}
        >
          {busy ? "Saving…" : "Save product"}
        </button>
      </form>
    </>
  );
}
