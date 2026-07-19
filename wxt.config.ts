import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    description: 'Automatically injects a meeting timer into Google Meet.',
    homepage_url: 'https://ibnumardini.github.io/meetkeep',
    author: 'Muhammad Fatkurozi' as any,
    permissions: ['activeTab', 'storage'],
    host_permissions: ['https://meetkeep-analytics.mardini.workers.dev/*'],
    icons: {
      16: 'icon/16.png',
      48: 'icon/48.png',
      128: 'icon/128.png',
    },
  },
});
