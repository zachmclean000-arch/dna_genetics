import React, { createContext, useContext, useEffect, useState } from "react";
import { api, frontendOnly } from "../services/api";
const cartKey = frontendOnly
  ? "dna_genetics_frontend_cart"
  : "dna_genetics_cart";
const Context = createContext();
export const useApp = () => useContext(Context);
export function Provider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true),
    [cart, setCart] = useState(() => {
      try {
        const c = JSON.parse(localStorage.getItem(cartKey) || "[]");
        return Array.isArray(c)
          ? c.filter(
              (i) =>
                typeof i.id === "string" &&
                Number.isInteger(i.quantity) &&
                i.quantity > 0 &&
                i.quantity <= 99,
            )
          : [];
      } catch {
        return [];
      }
    });
  useEffect(() => {
    api("/auth/me")
      .then(setUser)
      .finally(() => setLoading(false))
      .catch(() => {});
  }, []);
  useEffect(() => localStorage.setItem(cartKey, JSON.stringify(cart)), [cart]);
  function add(product, quantity = 1) {
    setCart((items) => {
      const old = items.find((i) => i.id === product.id);
      return old
        ? items.map((i) =>
            i.id === product.id
              ? {
                  ...i,
                  quantity: Math.min(99, product.stock, i.quantity + quantity),
                }
              : i,
          )
        : [...items, { id: product.id, quantity }];
    });
  }
  return (
    <Context.Provider value={{ user, setUser, loading, cart, setCart, add }}>
      {children}
    </Context.Provider>
  );
}
