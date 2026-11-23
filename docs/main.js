async function fetchLatestRelease() {
  try {
    const data = await fetchLatestReleaseData();
    const badge = document.getElementById('version-badge');
    if (badge) {
      badge.textContent = data.tag_name;
      badge.classList.remove('hidden');
    }
    document.querySelectorAll('[data-version-badge]').forEach((el) => {
      el.textContent = data.tag_name;
      el.classList.remove('hidden');
    });
  } catch {}
}

const THEME_ORDER = ['light', 'dark', 'system'];
const THEME_META = {
  light: { label: 'Theme: Light', icon: "url('icons/sun.svg')" },
  dark: { label: 'Theme: Dark', icon: "url('icons/moon.svg')" },
  system: { label: 'Theme: System', icon: "url('icons/monitor.svg')" },
};

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

function cycleTheme() {
  const current = localStorage.getItem('theme') || 'system';
  const next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
  setTheme(next);
}

function updateToggle(theme) {
  const meta = THEME_META[theme] || THEME_META.system;
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.title = meta.label;
    btn.setAttribute('aria-label', `${meta.label} (click to switch)`);
    const icon = btn.querySelector('[data-theme-icon]');
    if (icon) icon.style.setProperty('--icon', meta.icon);
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('btn-mobile-menu');
  if (!menu || !btn) return;
  const isOpen = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden');
  btn.setAttribute('aria-expanded', String(!isOpen));
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('btn-mobile-menu');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  }
});

function renderReleaseBody(body) {
  const stripped = (body || '').replace(/^\s*#*\s*\[.+?\]\s*-\s*\d{4}-\d{2}-\d{2}\s*\n?/, '');
  return marked.parse(stripped);
}

function renderReleaseAssets(assets) {
  const zips = (assets || []).filter((a) => a.name && a.name.endsWith('.zip') && a.browser_download_url);
  if (!zips.length) return '';
  return `
    <div class="mt-4 pt-4 border-t border-[#E4E4E7] dark:border-[#2E2E36] flex flex-wrap items-center gap-2">
      ${zips
        .map(
          (a) => `
        <a href="${a.browser_download_url}" download class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-[#F7F7FA] dark:bg-[#141417] border border-[#E4E4E7] dark:border-[#2E2E36] text-[#18181B] dark:text-[#F4F4F5] hover:border-[#18181B] dark:hover:border-[#F4F4F5] transition-colors no-underline">
          <span class="icon w-3.5 h-3.5" style="--icon:url('icons/download.svg')" aria-hidden="true"></span>
          <span>${a.name}</span>
        </a>
      `
        )
        .join('')}
    </div>
  `;
}

async function fetchReleases() {
  const list = document.getElementById('releases-list');
  if (!list) return;
  try {
    const releases = await fetchReleasesData();
    if (!releases.length) {
      list.innerHTML = '<div class="surface-card rounded-2xl p-6 text-[15px] text-[#52525B] dark:text-[#A1A1AA]">No releases published yet. Check back after the next version ships.</div>';
      return;
    }
    list.innerHTML =
      releases
        .slice(0, 3)
        .map(
          (r) => `
      <article class="surface-card rounded-2xl p-6 sm:p-7">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 class="text-xl font-bold tracking-tight">${r.tag_name}</h3>
          <time class="text-[13px] font-medium text-[#52525B] dark:text-[#A1A1AA]">${new Date(r.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
        <div class="text-[15px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA] [&_h1]:text-[15px] [&_h1]:font-bold [&_h1]:text-[#18181B] dark:[&_h1]:text-[#F4F4F5] [&_h1]:mt-4 [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:text-[#18181B] dark:[&_h2]:text-[#F4F4F5] [&_h2]:mt-4 [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-[#18181B] dark:[&_h3]:text-[#F4F4F5] [&_h3]:mt-4 [&_h1]:first:mt-0 [&_h2]:first:mt-0 [&_h3]:first:mt-0 [&_strong]:font-semibold [&_strong]:text-[#18181B] dark:[&_strong]:text-[#F4F4F5] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mt-2 [&_a]:underline [&_code]:text-[13px] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-[#F7F7FA] dark:[&_code]:bg-[#141417]">${renderReleaseBody(r.body)}</div>
        ${renderReleaseAssets(r.assets)}
      </article>
    `
        )
        .join('') +
      (releases.length > 3
        ? `
      <p class="text-[15px] text-[#52525B] dark:text-[#A1A1AA] pt-1">See all releases on <a href="${REPO_URL}/releases" target="_blank" rel="noopener noreferrer" class="underline font-medium text-[#18181B] dark:text-[#F4F4F5]">GitHub</a>.</p>
    `
        : '');
  } catch {
    list.innerHTML = `<div class="surface-card rounded-2xl p-6 text-[15px] text-[#52525B] dark:text-[#A1A1AA]">Could not load releases from GitHub. <a href="${REPO_URL}/releases" target="_blank" rel="noopener noreferrer" class="underline font-medium text-[#18181B] dark:text-[#F4F4F5]">View releases on GitHub</a>.</div>`;
  }
}

async function fetchActiveUsersToday() {
  const el = document.getElementById('active-users-today');
  const dot = document.getElementById('active-users-today-dot');
  const text = document.getElementById('active-users-today-text');
  if (!el || !dot || !text) return;
  try {
    const data = await fetchActiveUsersTodayData();
    text.textContent = `${data.activeUsers} active user${data.activeUsers === 1 ? '' : 's'} today`;
    dot.classList.toggle('bg-[#4ADE80]', data.activeUsers > 0);
    dot.classList.toggle('bg-[#A1A1AA]', data.activeUsers === 0);
    el.classList.remove('hidden');
  } catch {}
}

let storeUserCount = null;
let primaryBrowser = null;

function updatePrimaryStoreLabel() {
  if (!primaryBrowser) return;
  let text = 'Add to ' + primaryBrowser.name;
  if (!primaryBrowser.gecko && Number.isInteger(storeUserCount) && storeUserCount > 0) {
    const unit = storeUserCount === 1 ? 'user' : 'users';
    text += ` (${storeUserCount.toLocaleString('en-US')} ${unit})`;
  }
  document.querySelectorAll('[data-store-label]').forEach((el) => {
    el.textContent = text;
  });
}

async function fetchStoreUsers() {
  try {
    const data = await fetchStoreUsersData();
    if (!Number.isInteger(data.users) || data.users <= 0) return;
    storeUserCount = data.users;
    updatePrimaryStoreLabel();
  } catch {}
}

const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/meetkeep-google-meet-time/alfmjoblaebokilgkgealdnlmmcdlped';
const AMO_URL = 'https://addons.mozilla.org/en-US/firefox/addon/meetkeep-google-meet-timer/';
const CHROME_ICON = 'https://www.gstatic.com/images/branding/product/2x/chrome_store_48dp.png';
const FIREFOX_ICON = 'https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg';

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/Zen\//.test(ua)) return { name: 'Zen', gecko: true };
  if (/LibreWolf/.test(ua)) return { name: 'LibreWolf', gecko: true };
  if (/Firefox\//.test(ua)) return { name: 'Firefox', gecko: true };
  if (/Edg\//.test(ua)) return { name: 'Edge', gecko: false };
  if (/OPR\//.test(ua)) return { name: 'Opera', gecko: false };
  if (/Brave/.test(ua) || (navigator.brave && navigator.brave.isBrave)) return { name: 'Brave', gecko: false };
  if (getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title')) return { name: 'Arc', gecko: false };
  if (/Chrome\//.test(ua)) return { name: 'Chrome', gecko: false };
  return { name: 'Chrome', gecko: false };
}

function initStoreButtons() {
  const browser = detectBrowser();
  const btns = document.querySelectorAll('[data-store-btn]');
  const icons = document.querySelectorAll('[data-store-icon]');
  const secondary = document.getElementById('secondary-store-link');
  if (!btns.length) return;
  primaryBrowser = browser;

  const targetHref = browser.gecko ? AMO_URL : CHROME_STORE_URL;
  const targetIcon = browser.gecko ? FIREFOX_ICON : CHROME_ICON;
  btns.forEach((btn) => { btn.href = targetHref; });
  icons.forEach((icon) => { icon.src = targetIcon; });

  if (secondary) {
    if (browser.gecko) {
      secondary.innerHTML =
        'Not using ' +
        browser.name +
        '? <a href="' +
        CHROME_STORE_URL +
        '" target="_blank" rel="noopener noreferrer" class="underline font-medium text-[#18181B] dark:text-[#F4F4F5]">Add to Chrome</a> instead.';
    } else {
      secondary.innerHTML =
        'On Firefox? <a href="' +
        AMO_URL +
        '" target="_blank" rel="noopener noreferrer" class="underline font-medium text-[#18181B] dark:text-[#F4F4F5]">Add to Firefox</a> instead.';
    }
  }

  updatePrimaryStoreLabel();
}

function initBannerSlider() {
  const slides = document.querySelectorAll('#banner-slider .slider-slide');
  if (!slides.length) return;
  const dotsWrap = document.getElementById('slider-dots');
  const pauseBtn = document.getElementById('slider-pause-btn');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let paused = reducedMotion;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'w-2.5 h-2.5 rounded-full bg-white/55 transition-colors';
    dot.setAttribute('aria-label', 'Show screenshot ' + (i + 1));
    dot.onclick = () => show(i);
    dotsWrap.appendChild(dot);
  });

  function show(i) {
    slides[current].classList.remove('slider-active');
    dotsWrap.children[current].classList.remove('bg-[#4ADE80]');
    dotsWrap.children[current].classList.add('bg-white/55');
    current = i;
    slides[current].classList.add('slider-active');
    dotsWrap.children[current].classList.remove('bg-white/55');
    dotsWrap.children[current].classList.add('bg-[#4ADE80]');
  }

  function syncPauseButton() {
    if (!pauseBtn) return;
    pauseBtn.textContent = paused ? 'Play' : 'Pause';
    pauseBtn.setAttribute('aria-pressed', String(paused));
  }

  function startAuto() {
    if (timer || paused || slides.length <= 1) return;
    timer = setInterval(() => show((current + 1) % slides.length), 4500);
  }

  function stopAuto() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  if (pauseBtn && slides.length > 1) {
    pauseBtn.onclick = () => {
      paused = !paused;
      syncPauseButton();
      if (paused) stopAuto();
      else startAuto();
    };
    syncPauseButton();
  }

  show(0);
  startAuto();
}

const TRAKTEER_URL = 'https://trakteer.id/ibnumardini/tip';
const KOFI_URL = 'https://ko-fi.com/ibnumardini';
const ID_TIMEZONES = new Set(['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'Asia/Pontianak']);

function isIndonesianUser() {
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  if (langs.some((l) => l.toLowerCase().startsWith('id'))) return true;
  try {
    return ID_TIMEZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return false;
  }
}

function initSupportLinks() {
  const isIndonesian = isIndonesianUser();
  const url = isIndonesian ? TRAKTEER_URL : KOFI_URL;
  const title = isIndonesian ? 'Traktir kopi di Trakteer' : 'Support on Ko-fi';
  const label = isIndonesian ? 'Trakteer' : 'Ko-fi';
  document.querySelectorAll('[data-support-link]').forEach((el) => {
    el.href = url;
    el.title = title;
    if (el.hasAttribute('data-support-label')) {
      el.textContent = label;
    }
  });
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}

fetchLatestRelease();
fetchReleases();
fetchActiveUsersToday();
fetchStoreUsers();
initBannerSlider();
initStoreButtons();
initSupportLinks();
updateToggle(localStorage.getItem('theme') || 'system');
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('theme') || 'system') === 'system') setTheme('system');
});
