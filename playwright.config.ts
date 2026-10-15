import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
const CI = !!process.env.CI;

// End-to-end tests run against the static export, served like GitHub Pages serves it (`npm run build` first).
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // Playwright defaults to half the CPU cores; the CI runner's 4 cores are free for the tests alone.
  workers: CI ? "100%" : undefined,
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
    command: `node scripts/serve-static.mjs out ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
