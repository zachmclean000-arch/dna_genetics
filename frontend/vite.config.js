import { defineConfig } from "vite";
const backend = process.env.API_TARGET || "http://127.0.0.1:3001";
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": backend, "/uploads": backend },
  },
});
