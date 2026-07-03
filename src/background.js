const ANALYTICS_ENDPOINT = "https://meetkeep-analytics.mardini.workers.dev";

function todayString() {
  return new Date().toDateString();
}

async function getClientId() {
  const { clientId } = await chrome.storage.local.get("clientId");
  if (clientId) return clientId;
  const newId = crypto.randomUUID();
  await chrome.storage.local.set({ clientId: newId });
  return newId;
}

async function shouldPing() {
  const { analyticsEnabled, lastPingDate } = await chrome.storage.local.get([
    "analyticsEnabled",
    "lastPingDate",
  ]);
  if (analyticsEnabled === false) return false;
  return lastPingDate !== todayString();
}

async function pingUsage() {
  if (!(await shouldPing())) return;

  const clientId = await getClientId();
  await chrome.storage.local.set({ lastPingDate: todayString() });

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      client_id: clientId,
      events: [{ name: "extension_used" }],
    }),
  }).catch(() => {});
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "meetkeep_ping") pingUsage();
});
