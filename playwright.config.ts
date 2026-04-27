import { defineConfig } from '@playwright/test';

const visualViewports = [
  { name: 'visual-320', width: 320, height: 568 },
  { name: 'visual-375', width: 375, height: 667 },
  { name: 'visual-390', width: 390, height: 844 },
  { name: 'visual-430', width: 430, height: 932 },
  { name: 'visual-768', width: 768, height: 900 },
] as const;

export default defineConfig({
  testDir: './tests/visual',
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  fullyParallel: false,
  reporter: [['list']],
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: true,
    timeout: 120_000,
    url: 'http://127.0.0.1:5173/',
  },
  use: {
    baseURL: 'http://127.0.0.1:5173/',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: visualViewports.map((viewport) => ({
    name: viewport.name,
    use: {
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
    },
  })),
});
