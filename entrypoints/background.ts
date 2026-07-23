export default defineBackground(() => {
  const ANALYTICS_ENDPOINT = 'https://meetkeep-analytics.mardini.workers.dev';

  function todayString() {
    return new Date().toDateString();
  }

  async function getClientId() {
    const { clientId } = await browser.storage.local.get('clientId');
    if (clientId) return clientId;
    const newId = crypto.randomUUID();
    await browser.storage.local.set({ clientId: newId });
    return newId;
  }

  async function shouldPing() {
    const { analyticsEnabled, lastPingDate } = await browser.storage.local.get([
      'analyticsEnabled',
      'lastPingDate',
    ]);
    if (analyticsEnabled === false) return false;
    return lastPingDate !== todayString();
  }

  async function pingUsage() {
    if (!(await shouldPing())) return;

    const clientId = await getClientId();
    await browser.storage.local.set({ lastPingDate: todayString() });

    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: 'extension_used' }],
      }),
    }).catch(() => {});
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === 'meetkeep_ping') pingUsage();
  });
});
