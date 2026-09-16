import app from "../backend/server.js";

export default function handler(request, response) {
  const url = new URL(request.url, "http://localhost");
  const route = url.searchParams.get("__path") || "";
  url.searchParams.delete("__path");
  const query = url.searchParams.toString();
  request.url = `/api/${route}${query ? `?${query}` : ""}`;
  return app(request, response);
}
