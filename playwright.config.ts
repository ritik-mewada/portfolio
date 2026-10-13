import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
const CI = !!process.env.CI;

// End-to-end tests run against a production build (`npm run build` first, or `npm test`).
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // Lets a machine with its own Chromium build (no `playwright install`) run the suite.
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
  },
  projects: [
    { name: "unit", testDir: "tests/unit" },
    { name: "desktop", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", testDir: "tests/e2e", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 120_000,
    // Never send real email or analytics from tests, even if .env.local has keys.
    env: { RESEND_API_KEY: "", NEXT_PUBLIC_UMAMI_WEBSITE_ID: "" },
  },
});
