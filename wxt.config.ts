import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    description: 'Automatically injects a meeting timer into Google Meet.',
    homepage_url: 'https://ibnumardini.github.io/meetkeep',
    author: 'Muhammad Fatkurozi',
    permissions: ['activeTab', 'storage'],
    host_permissions: ['https://meetkeep-analytics.mardini.workers.dev/*'],
  },
});
