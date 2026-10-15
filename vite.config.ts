import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { contactApi } from './server/vite-contact';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, '.', ''), ...process.env };

  return {
    plugins: [react(), tailwindcss(), contactApi(env)],
    // Only the public widget key is exposed; server secrets stay private.
    define: {
      'import.meta.env.TURNSTILE_SITE_KEY': JSON.stringify(env.TURNSTILE_SITE_KEY ?? ''),
    },
  };
});
