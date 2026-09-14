import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../hooks/context";
import { api, money } from "../../services/api";
import "./SeedCatalogue.css";
import "./Cart.css";
import CheckoutFields from "./CheckoutFields";
function CartFrame({ checkout, children }) {
  return (
    <div
      className={`dna-seed-page dna-cart-page ${checkout ? "dna-checkout-page" : ""}`}
    >
      <section className="dna-seed-banner">
        <h1>{checkout ? "Checkout" : "Your Cart"}</h1>
        <p>Review your selection and complete your simulated order.</p>
      </section>
      <section className="dna-seed-container dna-cart-content">
        <nav className="dna-seed-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link to="/shop">Shop</Link>
          <span aria-hidden="true">›</span>
          {checkout && (
            <>
              <Link to="/cart">Cart</Link>
              <span aria-hidden="true">›</span>
            </>
          )}
          <span aria-current="page">{checkout ? "Checkout" : "Cart"}</span>
        </nav>
        {children}
      </section>
    </div>
  );
}
export default function Cart({ checkout = false }) {
  const { cart, setCart, user } = useApp(),
    [products, setProducts] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [order, setOrder] = useState(null);
  const submitting = useRef(false);
  const contactForm = useRef(null);
  useEffect(() => {
    api("/products")
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!order) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event) => {
      if (event.key === "Escape") setOrder(null);
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
    };
  }, [order]);
  const lineKey = (item) => `${item.id}:${item.variantId || ""}`;
  const lines = cart.map((i) => {
      const product = products.find((p) => p.id === i.id);
      const variant = product?.variants?.find((v) => v.id === i.variantId);
      const unavailable =
        (i.variantId && !variant) || (product?.variants?.length && !variant);
      return {
        ...i,
        product: unavailable
          ? null
          : variant
            ? {
                ...product,
                price: variant.price,
                salePrice: variant.salePrice,
                stock: variant.stock,
                name: `${product.name} · ${variant.size}-seed pack`,
              }
            : product,
      };
    }),
    invalid = !cart.length || lines.some((i) => !i.product),
    subtotal =
      lines.reduce(
        (sum, i) =>
          sum +
          (i.product
            ? Math.round((i.product.salePrice ?? i.product.price) * 100) *
              i.quantity
            : 0),
        0,
      ) / 100,
    shipping = subtotal >= 120 ? 0 : Math.round(subtotal * 5) / 100,
    total = subtotal + shipping;
  return (
    <CartFrame checkout={checkout}>
      {loading ? (
        <p>Loading bag…</p>
      ) : !cart.length ? (
        <p>
          Your bag is empty. <Link to="/shop">Explore the collection →</Link>
        </p>
      ) : (
        <div className="cart-layout">
          <div className="dna-cart-items">
            {checkout ? (
              <form
                ref={contactForm}
                id="checkout-contact"
                onSubmit={(event) => event.preventDefault()}
              >
                <CheckoutFields user={user} busy={busy} />
              </form>
            ) : (
              <>
                <h2>{checkout ? "Review your items" : "Your selection"}</h2>
                {lines.map((i) => (
                  <article className="cart-line" key={lineKey(i)}>
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
                      <label>
                        Quantity
                        <input
                          aria-label={`Quantity for ${i.product?.name || "unavailable product"}`}
                          type="number"
                          disabled={busy}
                          min="1"
                          max="99"
                          value={i.quantity}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            if (Number.isInteger(n) && n > 0 && n <= 99)
                              setCart(
                                cart.map((x) =>
                                  lineKey(x) === lineKey(i)
                                    ? { ...x, quantity: n }
                                    : x,
                                ),
                              );
                          }}
                        />
                      </label>
                    </div>
                    <button
                      disabled={busy}
                      onClick={() =>
                        setCart(cart.filter((x) => lineKey(x) !== lineKey(i)))
                      }
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </>
            )}
          </div>
          <aside className="summary">
            <h2>Order summary</h2>
            {checkout && (
              <div className="dna-checkout-order-items">
                {lines.map((item) => (
                  <div className="dna-checkout-order-item" key={lineKey(item)}>
                    {item.product && (
                      <img
                        src={item.product.images[0]}
                        alt=""
                        width="56"
                        height="56"
                      />
                    )}
                    <div>
                      <strong>
                        {item.product?.name || "Unavailable product"}
                      </strong>
                      <p>Quantity: {item.quantity}</p>
                      {!item.product && (
                        <p className="error">
                          Unavailable for checkout.{" "}
                          <Link to="/cart">Edit cart</Link>
                        </p>
                      )}
                    </div>
                    <b>
                      {item.product
                        ? money(
                            (item.product.salePrice ?? item.product.price) *
                              item.quantity,
                          )
                        : "—"}
                    </b>
                  </div>
                ))}
                <Link to="/cart">Edit cart</Link>
              </div>
            )}
            <p>
              Subtotal <b>{money(subtotal)}</b>
            </p>
            <p>
              Shipping{" "}
              {subtotal >= 120 ? (
                <span className="dna-free-shipping">Free</span>
              ) : (
                <>
                  <span>(5%)</span> <b>{money(shipping)}</b>
                </>
              )}
            </p>
            <hr />
            <p className="dna-cart-total">
              Total <b>{money(total)}</b>
            </p>

            {checkout ? (
              <div>
                <button
                  type="button"
                  className="button gold dna-cart-checkout"
                  disabled={busy || invalid}
                  onClick={async () => {
                    if (submitting.current || invalid || loading) return;
                    const contact = Object.fromEntries(
                      new FormData(contactForm.current),
                    );
                    contact.consent = contact.contactConsent === "on";
                    contact.termsAccepted = contact.termsAccepted === "on";
                    delete contact.contactConsent;
                    submitting.current = true;
                    setBusy(true);
                    setError("");
                    try {
                      const result = await api("/campaign-orders", {
                        method: "POST",
                        body: { items: cart, contact },
                      });
                      setOrder(result);
                      setCart([]);
                    } catch (e) {
                      setError(e.message);
                    } finally {
                      submitting.current = false;
                      setBusy(false);
                    }
                  }}
                >
                  {busy ? "Continuing…" : "Continue"}
                </button>
              </div>
            ) : (
              <>
                <Link className="button gold dna-cart-checkout" to="/checkout">
                  Checkout <span aria-hidden="true">→</span>
                </Link>
                {invalid && (
                  <p className="dna-cart-checkout-note" role="status">
                    You can review checkout now.
                  </p>
                )}
              </>
            )}
          </aside>
        </div>
      )}
      {error && (
        <div className="dna-checkout-error" role="alert">
          <strong>We couldn’t continue with this order.</strong>
          <p>{error}</p>
        </div>
      )}
      {order && (
        <div className="dna-order-modal-backdrop" role="presentation">
          <section
            className="dna-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-received-title"
          >
            <span className="dna-order-modal-check" aria-hidden="true">
              ✓
            </span>
            <h2 id="order-received-title">Order received</h2>
            <p>A member of the team will be in touch shortly.</p>
            <p className="dna-order-reference">
              Reference #{order.id.slice(0, 8)}
            </p>
            {order.notification?.sent === false && (
              <p className="dna-order-email-status">
                Your order was saved. The email notification is awaiting mail
                configuration.
              </p>
            )}
            <button
              type="button"
              className="button gold"
              autoFocus
              onClick={() => setOrder(null)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </CartFrame>
  );
}
