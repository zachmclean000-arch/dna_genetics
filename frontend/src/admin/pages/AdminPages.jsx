import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api, money } from "../../services/api";

const orderStatus = (status) => (status === "simulated" ? "pending" : status);

function DashboardOverview({ products, orders, customers, categories }) {
  const active = products.filter((product) => product.status === "active");
  const lowStock = products.filter((product) => product.stock < 5);
  const customerCount = customers.filter(
    (user) => user.role === "customer",
  ).length;
  const orderValue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const categoryTotals = categories
    .map((category) => ({
      category,
      count: products.filter((product) => product.category === category).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const largestCategory = Math.max(
    1,
    ...categoryTotals.map((item) => item.count),
  );
  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-welcome">
        <div>
          <span>STORE OVERVIEW</span>
          <h2>Welcome back</h2>
          <p>Here is what is happening across the catalogue today.</p>
        </div>
        <Link className="button gold" to="/admin/products/create">
          + Add product
        </Link>
      </header>
      <div className="stats admin-dashboard-stats">
        {[
          [
            "Order value",
            money(orderValue),
            `${orders.length} total orders`,
            "gold",
          ],
          ["Products", products.length, `${active.length} active`, "green"],
          [
            "Customers",
            customerCount,
            `${customers.length} registered users`,
            "purple",
          ],
          ["Low stock", lowStock.length, "Below 5 units", "red"],
        ].map(([label, value, note, tone]) => (
          <article className={`admin-stat-card ${tone}`} key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
            <span>{note}</span>
          </article>
        ))}
      </div>
      <div className="admin-dashboard-grid">
        <section className="panel admin-dashboard-panel admin-recent-orders">
          <div className="admin-panel-heading">
            <div>
              <small>ACTIVITY</small>
              <h2>Recent orders</h2>
            </div>
            <Link to="/admin/orders">View all</Link>
          </div>
          {!orders.length ? (
            <p className="admin-empty">No orders have been submitted yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
                        <small>
                          {order.items.length} item
                          {order.items.length === 1 ? "" : "s"}
                        </small>
                      </td>
                      <td>
                        {order.contact?.email ||
                          customers.find((user) => user.id === order.userId)
                            ?.email ||
                          "Guest"}
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <span
                          className={`admin-order-status ${orderStatus(order.status)}`}
                        >
                          {orderStatus(order.status).replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <strong>{money(order.total)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="panel admin-dashboard-panel">
          <div className="admin-panel-heading">
            <div>
              <small>CATALOGUE</small>
              <h2>Products by category</h2>
            </div>
            <Link to="/admin/categories">Manage</Link>
          </div>
          <div className="admin-category-chart">
            {categoryTotals.map((item) => (
              <div key={item.category}>
                <div>
                  <span>{item.category}</span>
                  <strong>{item.count}</strong>
                </div>
                <i>
                  <b
                    style={{
                      width: `${(item.count / largestCategory) * 100}%`,
                    }}
                  />
                </i>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="admin-dashboard-grid admin-dashboard-lower">
        <section className="panel admin-dashboard-panel">
          <div className="admin-panel-heading">
            <div>
              <small>INVENTORY</small>
              <h2>Stock alerts</h2>
            </div>
            <Link to="/admin/inventory">View inventory</Link>
          </div>
          <div className="admin-stock-list">
            {lowStock.slice(0, 5).map((product) => (
              <div key={product.id}>
                <img
                  src={
                    product.images?.[0] ||
                    "/assets/images/products/seed-pack.svg"
                  }
                  alt=""
                />
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.sku}</small>
                </span>
                <b>{product.stock} left</b>
              </div>
            ))}
            {!lowStock.length && (
              <p className="admin-empty">
                All products have healthy stock levels.
              </p>
            )}
          </div>
        </section>
        <section className="panel admin-dashboard-panel">
          <div className="admin-panel-heading">
            <div>
              <small>QUICK LINKS</small>
              <h2>Store management</h2>
            </div>
          </div>
          <div className="admin-quick-links">
            <Link to="/admin/products">
              Manage products <span>→</span>
            </Link>
            <Link to="/admin/orders">
              Review orders <span>→</span>
            </Link>
            <Link to="/admin/reviews">
              Publish reviews <span>→</span>
            </Link>
            <Link to="/admin/customers">
              View customers <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
export default function AdminPages() {
  const kind = useLocation().pathname.split("/")[2] || "overview",
    [products, setProducts] = useState([]),
    [categories, setCategories] = useState([]),
    [orders, setOrders] = useState([]),
    [customers, setCustomers] = useState([]),
    [productQuery, setProductQuery] = useState(""),
    [productCategory, setProductCategory] = useState("all"),
    [productStatus, setProductStatus] = useState("all"),
    [productPage, setProductPage] = useState(1),
    [productPageSize, setProductPageSize] = useState(25),
    [orderQuery, setOrderQuery] = useState(""),
    [orderFilter, setOrderFilter] = useState("all"),
    [orderPage, setOrderPage] = useState(1),
    [orderPageSize, setOrderPageSize] = useState(10),
    [orderToDelete, setOrderToDelete] = useState(null),
    [message, setMessage] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  const normalizedProductQuery = productQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const searchable = [
      product.name,
      product.sku,
      product.category,
      product.slug,
      ...(product.variants || []).map((variant) => variant.sku),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      (productCategory === "all" || product.category === productCategory) &&
      (productStatus === "all" || product.status === productStatus) &&
      (!normalizedProductQuery || searchable.includes(normalizedProductQuery))
    );
  });
  const productPageCount = Math.max(
    1,
    Math.ceil(filteredProducts.length / productPageSize),
  );
  const currentProductPage = Math.min(productPage, productPageCount);
  const visibleProducts = filteredProducts.slice(
    (currentProductPage - 1) * productPageSize,
    currentProductPage * productPageSize,
  );
  const normalizedOrderQuery = orderQuery.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const status = orderStatus(order.status);
    const matchesStatus = orderFilter === "all" || status === orderFilter;
    const searchable = [
      order.id,
      order.contact?.firstName,
      order.contact?.lastName,
      order.contact?.email,
      order.contact?.phone,
      ...order.items.map((item) => item.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      matchesStatus &&
      (!normalizedOrderQuery || searchable.includes(normalizedOrderQuery))
    );
  });
  const orderPageCount = Math.max(
    1,
    Math.ceil(filteredOrders.length / orderPageSize),
  );
  const currentOrderPage = Math.min(orderPage, orderPageCount);
  const visibleOrders = filteredOrders.slice(
    (currentOrderPage - 1) * orderPageSize,
    currentOrderPage * orderPageSize,
  );
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
  useEffect(() => {
    setOrderPage(1);
  }, [orderQuery, orderFilter, orderPageSize]);
  useEffect(() => {
    setProductPage(1);
  }, [productQuery, productCategory, productStatus, productPageSize]);
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
            <DashboardOverview
              products={products}
              orders={orders}
              customers={customers}
              categories={categories}
            />
          )}
          {["products", "inventory", "promotions"].includes(kind) && (
            <>
              <div className="admin-orders-toolbar admin-products-toolbar">
                <label className="admin-orders-search">
                  <span>Search products</span>
                  <input
                    type="search"
                    value={productQuery}
                    placeholder="Name, SKU, slug or category"
                    onChange={(event) => setProductQuery(event.target.value)}
                  />
                </label>
                <label>
                  <span>Category</span>
                  <select
                    value={productCategory}
                    onChange={(event) => setProductCategory(event.target.value)}
                  >
                    <option value="all">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select
                    value={productStatus}
                    onChange={(event) => setProductStatus(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label>
                  <span>Per page</span>
                  <select
                    value={productPageSize}
                    onChange={(event) =>
                      setProductPageSize(Number(event.target.value))
                    }
                  >
                    {[25, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="admin-orders-results" aria-live="polite">
                Showing {visibleProducts.length} of {filteredProducts.length}{" "}
                matching products
              </div>
              <div className="table-wrap admin-products-table">
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
                    {visibleProducts.map((p) => {
                      const prices = p.variants?.length
                        ? p.variants.map((variant) =>
                            Number(variant.salePrice ?? variant.price),
                          )
                        : [Number(p.salePrice ?? p.price)];
                      const stock = p.variants?.length
                        ? p.variants.reduce(
                            (total, variant) => total + Number(variant.stock),
                            0,
                          )
                        : p.stock;
                      const minimumPrice = Math.min(...prices);
                      const maximumPrice = Math.max(...prices);
                      return (
                        <tr key={p.id}>
                          <td>
                            {p.name}
                            <small>{p.category}</small>
                          </td>
                          <td>{p.sku}</td>
                          <td>
                            {money(minimumPrice)}
                            {maximumPrice !== minimumPrice && (
                              <> – {money(maximumPrice)}</>
                            )}
                          </td>
                          <td>{stock}</td>
                          <td>
                            <span className="pill">{p.status}</span>
                          </td>
                          <td>
                            <Link to={`/admin/products/${p.id}/edit`}>
                              Edit
                            </Link>{" "}
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
                      );
                    })}
                    {!visibleProducts.length && (
                      <tr>
                        <td colSpan="6" className="admin-empty-table">
                          {products.length
                            ? "No products match your search or filters."
                            : "No products yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {productPageCount > 1 && (
                <nav
                  className="admin-orders-pagination"
                  aria-label="Product pages"
                >
                  <button
                    disabled={currentProductPage === 1}
                    onClick={() =>
                      setProductPage((page) => Math.max(1, page - 1))
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentProductPage} of {productPageCount}
                  </span>
                  <button
                    disabled={currentProductPage === productPageCount}
                    onClick={() =>
                      setProductPage((page) =>
                        Math.min(productPageCount, page + 1),
                      )
                    }
                  >
                    Next
                  </button>
                </nav>
              )}
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
            <div className="admin-orders-manager">
              <div className="admin-orders-toolbar">
                <label className="admin-orders-search">
                  <span>Search orders</span>
                  <input
                    type="search"
                    value={orderQuery}
                    placeholder="Order, customer, email or product"
                    onChange={(event) => setOrderQuery(event.target.value)}
                  />
                </label>
                <label>
                  <span>Status</span>
                  <select
                    value={orderFilter}
                    onChange={(event) => setOrderFilter(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
                <label>
                  <span>Per page</span>
                  <select
                    value={orderPageSize}
                    onChange={(event) =>
                      setOrderPageSize(Number(event.target.value))
                    }
                  >
                    {[10, 25, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="admin-orders-results" aria-live="polite">
                Showing {visibleOrders.length} of {filteredOrders.length}{" "}
                matching orders
              </div>
              <div className="table-wrap admin-orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((o) => {
                      const displayedStatus = orderStatus(o.status);
                      return (
                        <tr key={o.id}>
                          <td data-label="Order">
                            <strong>#{o.id.slice(0, 8).toUpperCase()}</strong>
                          </td>
                          <td data-label="Customer">
                            <strong>
                              {o.contact
                                ? `${o.contact.firstName} ${o.contact.lastName}`
                                : "Customer"}
                            </strong>
                            <small>
                              {o.contact?.email ||
                                customers.find((u) => u.id === o.userId)
                                  ?.email ||
                                "Guest"}
                            </small>
                          </td>
                          <td data-label="Products">
                            <div className="admin-order-products">
                              <span>
                                {o.items[0]
                                  ? `${o.items[0].quantity} × ${o.items[0].name}`
                                  : "No products"}
                              </span>
                              {o.items.length > 1 && (
                                <details className="admin-order-items">
                                  <summary>+{o.items.length - 1} more</summary>
                                  <ul>
                                    {o.items.slice(1).map((item, index) => (
                                      <li
                                        key={`${item.productId || item.name}-${index}`}
                                      >
                                        {item.quantity} × {item.name}
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              )}
                            </div>
                          </td>
                          <td data-label="Date">
                            {new Date(o.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td data-label="Total">
                            <strong>{money(o.total)}</strong>
                          </td>
                          <td data-label="Status">
                            <select
                              className={`admin-status-select ${displayedStatus}`}
                              aria-label={`Status for order ${o.id.slice(0, 8)}`}
                              value={displayedStatus}
                              disabled={busy || displayedStatus === "cancelled"}
                              onChange={(e) =>
                                action(async () => {
                                  const updated = await api(`/orders/${o.id}`, {
                                    method: "PATCH",
                                    body: { status: e.target.value },
                                  });
                                  if (updated.notification?.sent)
                                    setMessage(
                                      `Order #${o.id.slice(0, 8)} updated and status email sent.`,
                                    );
                                  else if (updated.notification?.reason)
                                    setMessage(
                                      `Order updated. Email was not sent (${updated.notification.reason}).`,
                                    );
                                })
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td data-label="Details">
                            <div className="admin-order-actions">
                              <details className="admin-order-details">
                                <summary>View</summary>
                                {o.contact && (
                                  <div>
                                    <strong>
                                      {o.contact.firstName} {o.contact.lastName}
                                    </strong>
                                    <p>
                                      {o.contact.email}
                                      <br />
                                      {o.contact.phone}
                                    </p>
                                    <p>
                                      {[
                                        o.contact.address,
                                        o.contact.address2,
                                        o.contact.city,
                                        o.contact.region,
                                        o.contact.postalCode,
                                        o.contact.country,
                                      ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </p>
                                    <small>
                                      Payment choice: {o.contact.paymentMethod}
                                    </small>
                                  </div>
                                )}
                              </details>
                              <button
                                type="button"
                                className="admin-order-delete"
                                disabled={busy}
                                onClick={() => setOrderToDelete(o)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {!visibleOrders.length && (
                      <tr>
                        <td colSpan="7" className="admin-empty-table">
                          {orders.length
                            ? "No orders match your search or filter."
                            : "No orders yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {orderPageCount > 1 && (
                <nav
                  className="admin-orders-pagination"
                  aria-label="Order pages"
                >
                  <button
                    disabled={currentOrderPage === 1}
                    onClick={() =>
                      setOrderPage((page) => Math.max(1, page - 1))
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentOrderPage} of {orderPageCount}
                  </span>
                  <button
                    disabled={currentOrderPage === orderPageCount}
                    onClick={() =>
                      setOrderPage((page) => Math.min(orderPageCount, page + 1))
                    }
                  >
                    Next
                  </button>
                </nav>
              )}
              {orderToDelete && (
                <div
                  className="admin-confirm-backdrop"
                  role="presentation"
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !busy)
                      setOrderToDelete(null);
                  }}
                >
                  <section
                    className="admin-confirm-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-order-title"
                  >
                    <span className="admin-confirm-icon" aria-hidden="true">
                      !
                    </span>
                    <h2 id="delete-order-title">Delete order?</h2>
                    <p>
                      Order <strong>#{orderToDelete.id.slice(0, 8).toUpperCase()}</strong>{" "}
                      will be permanently deleted. This cannot be undone.
                    </p>
                    <div className="admin-confirm-actions">
                      <button
                        type="button"
                        className="admin-confirm-cancel"
                        disabled={busy}
                        onClick={() => setOrderToDelete(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="admin-confirm-delete"
                        disabled={busy}
                        autoFocus
                        onClick={() => {
                          const order = orderToDelete;
                          action(async () => {
                            await api(`/orders/${order.id}`, {
                              method: "DELETE",
                            });
                            setMessage(
                              `Order #${order.id.slice(0, 8).toUpperCase()} deleted.`,
                            );
                            setOrderToDelete(null);
                          });
                        }}
                      >
                        {busy ? "Deleting…" : "Delete order"}
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </div>
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
            <div className="admin-settings-grid">
              <section className="panel">
                <p className="eyebrow">STORE CONFIGURATION</p>
                <h2>General settings</h2>
                <dl className="admin-settings-list">
                  <div>
                    <dt>Storefront</dt>
                    <dd>Active</dd>
                  </div>
                  <div>
                    <dt>Database</dt>
                    <dd>PostgreSQL via Prisma</dd>
                  </div>
                  <div>
                    <dt>Currency</dt>
                    <dd>USD ($)</dd>
                  </div>
                  <div>
                    <dt>Shipping</dt>
                    <dd>5% · Free over $120</dd>
                  </div>
                </dl>
              </section>
              <section className="panel">
                <p className="eyebrow">CATALOGUE</p>
                <h2>Current records</h2>
                <dl className="admin-settings-list">
                  <div>
                    <dt>Products</dt>
                    <dd>{products.length}</dd>
                  </div>
                  <div>
                    <dt>Active products</dt>
                    <dd>
                      {
                        products.filter(
                          (product) => product.status === "active",
                        ).length
                      }
                    </dd>
                  </div>
                  <div>
                    <dt>Categories</dt>
                    <dd>{categories.length}</dd>
                  </div>
                  <div>
                    <dt>Orders</dt>
                    <dd>{orders.length}</dd>
                  </div>
                </dl>
              </section>
              <section className="panel admin-settings-wide">
                <p className="eyebrow">NOTIFICATIONS</p>
                <h2>Order email</h2>
                <p>
                  Order notifications use the SMTP account configured on the
                  server. Update the SMTP variables in the backend environment
                  file, then restart the server to apply changes.
                </p>
              </section>
            </div>
          )}
        </>
      )}
    </>
  );
}
