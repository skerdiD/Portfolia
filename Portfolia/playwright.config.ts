import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      E2E_TEST_MODE: "1",
      DATABASE_URL: "postgresql://test:test@localhost:5432/portfolia_test",
      ARCJET_KEY: "ajkey_test_dummy",
    },
  },
});
