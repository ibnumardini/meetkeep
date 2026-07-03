const toggle = document.getElementById("analytics-toggle");

chrome.storage.local.get("analyticsEnabled").then(({ analyticsEnabled }) => {
  toggle.checked = analyticsEnabled !== false;
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ analyticsEnabled: toggle.checked });
});
