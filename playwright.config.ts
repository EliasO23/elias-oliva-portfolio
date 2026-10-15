import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort',
    url: 'http://127.0.0.1:5174',
    env: { MAKE_WEBHOOK_URL: 'https://make-webhook.invalid/contact', TURNSTILE_SITE_KEY: '1x00000000000000000000AA' },
    reuseExistingServer: false,
  },
  testDir: './tests',
  timeout: 30000,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5174',
    channel: 'chrome',
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
  },
});


