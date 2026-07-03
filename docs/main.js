const REPO = 'ibnumardini/meetkeep';
const CACHE_TTL_MS = 60 * 60 * 1000;

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

async function fetchLatestRelease() {
  try {
    const data = await fetchJsonCached(`https://api.github.com/repos/${REPO}/releases/latest`, 'mk_release_latest');
    const asset = data.assets.find(a => a.name.endsWith('.zip'));
    if (!asset) return;
    document.querySelectorAll('.download-btn').forEach(el => {
      el.href = asset.browser_download_url;
    });
    const badge = document.getElementById('version-badge');
    badge.textContent = data.tag_name;
    badge.classList.remove('hidden');
  } catch {}
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (theme === 'dark' || (theme === 'system' && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateToggle(theme);
}

function updateToggle(theme) {
  ['light', 'system', 'dark'].forEach(t => {
    ['btn-' + t, 'btn-' + t + '-mobile'].forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;
      if (t === theme) {
        btn.classList.add('bg-neutral-200', 'dark:bg-stone-600', 'text-neutral-900', 'dark:text-neutral-100');
      } else {
        btn.classList.remove('bg-neutral-200', 'dark:bg-stone-600', 'text-neutral-900', 'dark:text-neutral-100');
      }
    });
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('btn-mobile-menu');
  const isOpen = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden');
  btn.setAttribute('aria-expanded', String(!isOpen));
}

function renderReleaseBody(body) {
  return marked.parse(body || '');
}

async function fetchReleases() {
  const list = document.getElementById('releases-list');
  try {
    const releases = await fetchJsonCached(`https://api.github.com/repos/${REPO}/releases`, 'mk_releases_list');
    if (!releases.length) {
      list.innerHTML = '<p class="text-sm text-neutral-500">No releases yet.</p>';
      return;
    }
    list.innerHTML = releases.slice(0, 3).map(r => `
      <div class="border-b border-neutral-200 dark:border-stone-700 pb-6 last:border-0">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-lg font-bold tracking-tight">${r.tag_name}</h3>
          <span class="text-xs text-neutral-400">${new Date(r.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="text-sm text-neutral-700 dark:text-neutral-300 [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-4 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-4 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-4 [&_h1]:first:mt-0 [&_h2]:first:mt-0 [&_h3]:first:mt-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:mt-2 [&_a]:underline">${renderReleaseBody(r.body)}</div>
      </div>
    `).join('') + (releases.length > 3 ? `
      <p class="text-sm text-neutral-500">See all releases on <a href="https://github.com/${REPO}/releases" target="_blank" rel="noopener" class="underline">GitHub</a>.</p>
    ` : '');
  } catch {
    list.innerHTML = `<p class="text-sm text-neutral-500">Couldn't load releases. <a href="https://github.com/${REPO}/releases" target="_blank" rel="noopener" class="underline">View on GitHub</a>.</p>`;
  }
}

function playVideo() {
  var container = document.getElementById('video-container');
  var thumbnail = document.getElementById('video-thumbnail');
  var overlay = document.getElementById('play-overlay');
  var wrapper = document.getElementById('video-iframe-wrapper');
  var iframe = document.getElementById('yt-iframe');
  iframe.src = iframe.dataset.src;
  thumbnail.classList.add('hidden');
  overlay.classList.add('hidden');
  wrapper.classList.remove('hidden');
  wrapper.classList.add('block');
  container.style.aspectRatio = '16/9';
  container.onclick = null;
  container.classList.remove('cursor-pointer');
}

fetchLatestRelease();
fetchReleases();
updateToggle(localStorage.getItem('theme') || 'system');
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('theme') || 'system') === 'system') setTheme('system');
});
