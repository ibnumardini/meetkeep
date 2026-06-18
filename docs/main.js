const REPO = 'ibnumardini/meetkeep';

async function fetchLatestRelease() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
    if (!res.ok) return;
    const data = await res.json();
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
    const btn = document.getElementById('btn-' + t);
    if (t === theme) {
      btn.classList.add('bg-neutral-200', 'dark:bg-stone-600', 'text-neutral-900', 'dark:text-neutral-100');
    } else {
      btn.classList.remove('bg-neutral-200', 'dark:bg-stone-600', 'text-neutral-900', 'dark:text-neutral-100');
    }
  });
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
updateToggle(localStorage.getItem('theme') || 'system');
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('theme') || 'system') === 'system') setTheme('system');
});
