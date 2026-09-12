import { localApi } from "./localApi";

// Frontend development works independently. Production builds use the backend.
export const frontendOnly =
  import.meta.env.DEV && import.meta.env.VITE_USE_BACKEND !== "true";

export async function api(url, options = {}) {
  if (frontendOnly) return localApi(url, options);
  const response = await fetch(`/api${url}`, {
    credentials: "same-origin",
    ...options,
    headers:
      options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json", ...options.headers },
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw Error(data.error || "Request failed");
  return data;
}
export const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );
