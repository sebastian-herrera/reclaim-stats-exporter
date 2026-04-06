import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  }),
  manifest: {
    permissions: ['storage', 'scripting'],
    host_permissions: ['https://app.reclaim.ai/*'],
  },
  webExt: {
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
    disabled: true,
  },
});
