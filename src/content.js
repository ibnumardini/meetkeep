(() => {
  const TIMER_ID = "meetkeep-timer";
  const SEPARATOR_ID = "meetkeep-separator";
  const TARGET_ID = "browser-extension-start-buttons";
  const POLL_INTERVAL_MS = 500;
  const TICK_INTERVAL_MS = 1000;

  let startTime = null;
  let tickInterval = null;
  let pollInterval = null;
  let observer = null;

  function formatElapsed(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  function hasExtraChildren() {
    const target = document.getElementById(TARGET_ID);
    if (!target) return false;
    const parent = target.parentElement;
    if (!parent) return false;
    return parent.childElementCount > 2;
  }

  function buildSeparator() {
    const sep = document.createElement("div");
    sep.id = SEPARATOR_ID;
    sep.setAttribute("role", "separator");
    sep.className = "meetkeep-separator";
    return sep;
  }

  function updateSeparator() {
    const timer = document.getElementById(TIMER_ID);
    if (!timer) return;

    const existing = document.getElementById(SEPARATOR_ID);
    if (hasExtraChildren()) {
      if (!existing) {
        timer.after(buildSeparator());
      }
    } else {
      if (existing) existing.remove();
    }
  }

  function tick() {
    const el = document.getElementById(TIMER_ID);
    if (!el) return;
    const display = el.querySelector(".meetkeep-display");
    if (display) {
      display.textContent = formatElapsed(Date.now() - startTime);
    }
    updateSeparator();
  }

  function buildTimerElement() {
    const wrapper = document.createElement("div");
    wrapper.id = TIMER_ID;
    wrapper.setAttribute("role", "timer");
    wrapper.setAttribute("aria-live", "off");

    const label = document.createElement("span");
    label.className = "meetkeep-label";
    label.textContent = "MK";
    label.style.cursor = "pointer";
    label.addEventListener("mouseenter", () => { label.textContent = "RESET"; label.classList.add("meetkeep-label--hover"); });
    label.addEventListener("mouseleave", () => { label.textContent = "MK"; label.classList.remove("meetkeep-label--hover"); });
    label.addEventListener("click", () => {
      startTime = Date.now();
    });

    const display = document.createElement("span");
    display.className = "meetkeep-display";
    display.textContent = "00:00:00";

    wrapper.appendChild(label);
    wrapper.appendChild(display);
    return wrapper;
  }

  function injectTimer(target) {
    if (document.getElementById(TIMER_ID)) return;

    if (!startTime) {
      startTime = Date.now();
    }

    const timer = buildTimerElement();
    target.prepend(timer);

    if (!tickInterval) {
      tick();
      tickInterval = setInterval(tick, TICK_INTERVAL_MS);
    }
  }

  function removeTimer() {
    const el = document.getElementById(TIMER_ID);
    if (el) el.remove();
    const sep = document.getElementById(SEPARATOR_ID);
    if (sep) sep.remove();

    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  }

  function tryInject() {
    const target = document.getElementById(TARGET_ID);
    if (target) {
      injectTimer(target);
      return true;
    }
    return false;
  }

  function startObserver() {
    if (observer) return;

    observer = new MutationObserver(() => {
      const target = document.getElementById(TARGET_ID);
      if (target && !document.getElementById(TIMER_ID)) {
        injectTimer(target);
      }
      updateSeparator();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function startPolling() {
    if (pollInterval) return;

    pollInterval = setInterval(() => {
      if (tryInject()) {
        clearInterval(pollInterval);
        pollInterval = null;
        startObserver();
      }
    }, POLL_INTERVAL_MS);
  }

  function handleNavigation() {
    removeTimer();
    startTime = null;
    startPolling();
  }

  // Handle Google Meet SPA navigation via pushState/replaceState/popstate
  const _pushState = history.pushState.bind(history);
  history.pushState = (...args) => {
    _pushState(...args);
    handleNavigation();
  };

  const _replaceState = history.replaceState.bind(history);
  history.replaceState = (...args) => {
    _replaceState(...args);
    handleNavigation();
  };

  window.addEventListener("popstate", handleNavigation);

  // Initial boot
  if (!tryInject()) {
    startPolling();
  } else {
    startObserver();
  }
})();
