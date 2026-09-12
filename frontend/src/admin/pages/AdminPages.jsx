import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api, money } from "../../services/api";
export default function AdminPages() {
  const kind = useLocation().pathname.split("/")[2] || "overview",
    [products, setProducts] = useState([]),
    [categories, setCategories] = useState([]),
    [orders, setOrders] = useState([]),
    [customers, setCustomers] = useState([]),
    [message, setMessage] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  async function refresh() {
    try {
      const [p, c, o, u] = await Promise.all([
        api("/products?admin=1"),
        api("/categories"),
        api("/orders"),
        api("/customers"),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setCustomers(u);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  async function action(fn) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">DNA GENETICS OPERATIONS</p>
          <h1>{kind.charAt(0).toUpperCase() + kind.slice(1)}</h1>
        </div>
        {["products", "inventory", "promotions"].includes(kind) && (
          <Link className="button gold" to="/admin/products/create">
            + Create product
          </Link>
        )}
      </div>
      <p role="status">{message}</p>
      {loading ? (
        <p>Loading dashboard…</p>
      ) : (
        <>
          {kind === "overview" && (
            <>
              <div className="stats">
                {[
                  ["Products", products.length],
                  ["Orders", orders.length],
                  [
                    "Customers",
                    customers.filter((u) => u.role === "customer").length,
                  ],
                  ["Low stock", products.filter((p) => p.stock < 5).length],
                ].map(([k, v]) => (
                  <article key={k}>
                    <small>{k}</small>
                    <strong>{v}</strong>
                  </article>
                ))}
              </div>
              <div className="panel">
                <h2>Your classroom storefront</h2>
                <p>
                  Manage the sample catalogue, upload local product images,
                  import JSON data, and review simulated orders.
                </p>
                <Link className="button" to="/admin/products">
                  Manage products →
                </Link>
              </div>
            </>
          )}
          {["products", "inventory", "promotions"].includes(kind) && (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          {p.name}
                          <small>{p.category}</small>
                        </td>
                        <td>{p.sku}</td>
                        <td>{money(p.salePrice ?? p.price)}</td>
                        <td>{p.stock}</td>
                        <td>
                          <span className="pill">{p.status}</span>
                        </td>
                        <td>
                          <Link to={`/admin/products/${p.id}/edit`}>Edit</Link>{" "}
                          <button
                            disabled={busy}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete ${p.name}? Existing order records will be retained.`,
                                )
                              )
                                action(() =>
                                  api(`/products/${p.id}`, {
                                    method: "DELETE",
                                  }),
                                );
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="panel">
                <h2>Import products</h2>
                <p>
                  Upload a JSON array of products. The entire file is validated
                  before any products are saved. Maximum 500 products.
                </p>
                <a href="/examples/products.json" download>
                  Download example JSON
                </a>
                <label className="file-label">
                  Choose JSON file
                  <input
                    type="file"
                    accept=".json,application/json"
                    disabled={busy}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      await action(async () => {
                        if (file.size > 2 * 1024 * 1024)
                          throw Error("File must be smaller than 2 MB.");
                        const result = await api("/products/import", {
                          method: "POST",
                          body: JSON.parse(await file.text()),
                        });
                        setMessage(`Imported ${result.count} products.`);
                      });
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </>
          )}
          {kind === "categories" && (
            <div className="panel">
              <form
                className="inline-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget,
                    name = new FormData(form).get("name");
                  await action(() =>
                    api("/categories", { method: "POST", body: { name } }),
                  );
                  form.reset();
                }}
              >
                <label>
                  Category name
                  <input name="name" required maxLength="80" />
                </label>
                <button className="button gold" disabled={busy}>
                  Add category
                </button>
              </form>
              {categories.map((c) => (
                <div className="category-row" key={c}>
                  <span>{c}</span>
                  <button
                    disabled={busy}
                    onClick={() =>
                      action(() =>
                        api(`/categories/${encodeURIComponent(c)}`, {
                          method: "DELETE",
                        }),
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          {kind === "orders" && (
            <>
              {!orders.length && <p>No simulated orders yet.</p>}
              {orders.map((o) => (
                <article className="panel" key={o.id}>
                  <div className="section-heading">
                    <h3>Order #{o.id.slice(0, 8)}</h3>
                    <strong>{money(o.total)}</strong>
                  </div>
                  <p>
                    {new Date(o.createdAt).toLocaleString()} ·{" "}
                    {customers.find((u) => u.id === o.userId)?.email}
                  </p>
                  <p>
                    {o.items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}
                  </p>
                  <label>
                    Order status
                    <select
                      value={o.status}
                      disabled={busy || o.status === "cancelled"}
                      onChange={(e) =>
                        action(() =>
                          api(`/orders/${o.id}`, {
                            method: "PATCH",
                            body: { status: e.target.value },
                          }),
                        )
                      }
                    >
                      {["simulated", "reviewed", "cancelled"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </article>
              ))}
            </>
          )}
          {kind === "customers" && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{orders.filter((o) => o.userId === u.id).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {kind === "settings" && (
            <div className="panel">
              <h2>Educational mode</h2>
              <p>
                Payment processing, delivery, fulfilment and outgoing email are
                disabled by design.
              </p>
              <p>
                The server uses PostgreSQL by default. SQLite must be explicitly
                selected. Database setup and administrator provisioning are
                documented in the project README.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
