const toggle = document.getElementById("analytics-toggle");
const labelInput = document.getElementById("label-input");

chrome.storage.local.get("analyticsEnabled").then(({ analyticsEnabled }) => {
  toggle.checked = analyticsEnabled !== false;
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ analyticsEnabled: toggle.checked });
});

chrome.storage.local.get("customLabel").then(({ customLabel }) => {
  labelInput.value = customLabel || "MK";
});

labelInput.addEventListener("change", () => {
  const value = labelInput.value.trim().toUpperCase() || "MK";
  labelInput.value = value;
  chrome.storage.local.set({ customLabel: value });
});
