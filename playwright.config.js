import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  globalTeardown: "./tests/teardown.js",
  use: { baseURL: "http://127.0.0.1:3011", headless: true, channel: "msedge" },
  webServer: {
    command: "node tests/start-server.js",
    url: "http://127.0.0.1:3011/api/products",
    env: { PORT: "3011", DNA_GENETICS_DB_PATH: ":memory:", DATABASE_URL: "" },
    reuseExistingServer: false,
  },
});
