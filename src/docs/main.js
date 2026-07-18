async function fetchLatestRelease() {
  try {
    const data = await fetchLatestReleaseData();
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
        btn.setAttribute('data-active', '');
      } else {
        btn.classList.remove('bg-neutral-200', 'dark:bg-stone-600', 'text-neutral-900', 'dark:text-neutral-100');
        btn.removeAttribute('data-active');
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
    const releases = await fetchReleasesData();
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
      <p class="text-sm text-neutral-500">See all releases on <a href="${REPO_URL}/releases" target="_blank" rel="noopener" class="underline">GitHub</a>.</p>
    ` : '');
  } catch {
    list.innerHTML = `<p class="text-sm text-neutral-500">Couldn't load releases. <a href="${REPO_URL}/releases" target="_blank" rel="noopener" class="underline">View on GitHub</a>.</p>`;
  }
}

async function fetchActiveUsersToday() {
  const el = document.getElementById('active-users-today');
  const dot = document.getElementById('active-users-today-dot');
  const text = document.getElementById('active-users-today-text');
  try {
    const data = await fetchActiveUsersTodayData();
    text.textContent = `${data.activeUsers} active user${data.activeUsers === 1 ? '' : 's'} today`;
    dot.classList.toggle('bg-emerald-500', data.activeUsers > 0);
    dot.classList.toggle('bg-neutral-400', data.activeUsers === 0);
    el.classList.remove('hidden');
  } catch {}
}

function initBannerSlider() {
  var slides = document.querySelectorAll('#banner-slider .slider-slide');
  if (!slides.length) return;
  var dotsWrap = document.getElementById('slider-dots');
  var current = 0;

  slides.forEach((_, i) => {
    var dot = document.createElement('button');
    dot.className = 'w-1.5 h-1.5 rounded-full bg-white/60 transition-colors';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.onclick = () => show(i);
    dotsWrap.appendChild(dot);
  });

  function show(i) {
    slides[current].classList.add('hidden');
    dotsWrap.children[current].classList.remove('bg-white');
    dotsWrap.children[current].classList.add('bg-white/60');
    current = i;
    slides[current].classList.remove('hidden');
    dotsWrap.children[current].classList.remove('bg-white/60');
    dotsWrap.children[current].classList.add('bg-white');
  }

  show(0);
  if (slides.length > 1) {
    setInterval(() => show((current + 1) % slides.length), 4000);
  }
}

fetchLatestRelease();
fetchReleases();
fetchActiveUsersToday();
initBannerSlider();
updateToggle(localStorage.getItem('theme') || 'system');
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('theme') || 'system') === 'system') setTheme('system');
});
