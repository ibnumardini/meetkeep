const REPO = 'ibnumardini/meetkeep';
const REPO_URL = `https://github.com/${REPO}`;
const GITHUB_API_BASE = `https://api.github.com/repos/${REPO}`;
const CACHE_TTL_MS = 60 * 60 * 1000;
const ANALYTICS_ENDPOINT = 'https://meetkeep-analytics.mardini.workers.dev';

async function fetchJsonCached(url, cacheKey) {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, ts } = JSON.parse(cached);
    if (Date.now() - ts < CACHE_TTL_MS) return data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('bad response');
  const data = await res.json();
  localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
  return data;
}

function fetchLatestReleaseData() {
  return fetchJsonCached(`${GITHUB_API_BASE}/releases/latest`, 'mk_release_latest');
}

function fetchReleasesData() {
  return fetchJsonCached(`${GITHUB_API_BASE}/releases`, 'mk_releases_list');
}

function fetchActiveUsersTodayData() {
  return fetchJsonCached(`${ANALYTICS_ENDPOINT}/active-users-today`, 'mk_active_users_today');
}
