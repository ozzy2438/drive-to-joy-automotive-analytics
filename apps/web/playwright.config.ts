import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3113",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --port 3113",
    url: "http://localhost:3113",
    reuseExistingServer: !process.env.CI,
    env: {
      ENABLE_LOCAL_DEMO_EXPORT: "true",
      DTJ_LOCAL_DATA_DIR: path.resolve(".local-data/e2e"),
      NEXT_PUBLIC_EXP_CTA_001_ENABLED: "true",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
