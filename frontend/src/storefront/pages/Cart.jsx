import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../hooks/context";
import { api, money } from "../../services/api";
export default function Cart({ checkout = false }) {
  const { cart, setCart, user } = useApp(),
    [products, setProducts] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [order, setOrder] = useState(null);
  useEffect(() => {
    api("/products")
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const lines = cart.map((i) => ({
      ...i,
      product: products.find((p) => p.id === i.id),
    })),
    invalid = lines.some((i) => !i.product || i.quantity > i.product.stock),
    total =
      lines.reduce(
        (sum, i) =>
          sum +
          (i.product
            ? Math.round((i.product.salePrice ?? i.product.price) * 100) *
              i.quantity
            : 0),
        0,
      ) / 100;
  if (order)
    return (
      <section className="section">
        <p className="eyebrow">ORDER SIMULATION COMPLETE</p>
        <h1>Simulated order recorded.</h1>
        <p>
          Reference #{order.id.slice(0, 8)} · {money(order.total)}
        </p>
        <p>No payment was taken. Nothing will be shipped.</p>
        <Link className="button gold" to="/account">
          View your simulated orders
        </Link>
      </section>
    );
  return (
    <section className="section">
      <p className="eyebrow">YOUR DNA GENETICS BAG</p>
      <h1>{checkout ? "Simulated checkout." : "Your bag."}</h1>
      {loading ? (
        <p>Loading bag…</p>
      ) : !cart.length ? (
        <p>
          Your bag is empty. <Link to="/shop">Explore the collection →</Link>
        </p>
      ) : (
        <div className="cart-layout">
          <div>
            {lines.map((i) => (
              <article className="cart-line" key={i.id}>
                {i.product && (
                  <img
                    src={
                      i.product.images[0] ||
                      "/assets/images/products/seed-pack.svg"
                    }
                    alt=""
                  />
                )}
                <div>
                  <h3>{i.product?.name || "Unavailable product"}</h3>
                  <p>
                    {i.product
                      ? money(i.product.salePrice ?? i.product.price)
                      : "Remove this item to continue."}
                  </p>
                  {i.product && i.quantity > i.product.stock && (
                    <p className="error">Only {i.product.stock} available.</p>
                  )}
                  <label>
                    Quantity
                    <input
                      aria-label={`Quantity for ${i.product?.name || "unavailable product"}`}
                      type="number"
                      min="1"
                      max="99"
                      value={i.quantity}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isInteger(n) && n > 0 && n <= 99)
                          setCart(
                            cart.map((x) =>
                              x.id === i.id ? { ...x, quantity: n } : x,
                            ),
                          );
                      }}
                    />
                  </label>
                </div>
                <button
                  onClick={() => setCart(cart.filter((x) => x.id !== i.id))}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Order summary</h2>
            <p>
              Subtotal <b>{money(total)}</b>
            </p>
            <p>
              Payment <b>Not collected</b>
            </p>
            <p>
              Delivery <b>Not available</b>
            </p>
            <hr />
            <p className="notice">
              This exercise only records a simulated order and updates
              inventory. Do not enter payment or delivery details.
            </p>
            {checkout ? (
              user ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    setError("");
                    try {
                      const result = await api("/orders", {
                        method: "POST",
                        body: { items: cart },
                      });
                      setOrder(result);
                      setCart([]);
                    } catch (e) {
                      setError(e.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <label className="check">
                    <input type="checkbox" required /> I understand this is a
                    simulation.
                  </label>
                  <button className="button gold" disabled={busy || invalid}>
                    {busy ? "Recording…" : "Place simulated order"}
                  </button>
                </form>
              ) : (
                <Link className="button gold" to="/account">
                  Sign in to continue
                </Link>
              )
            ) : (
              <Link className="button gold" to="/checkout">
                Continue to checkout ↗
              </Link>
            )}
          </aside>
        </div>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
