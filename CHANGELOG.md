# Changelog

All notable changes to this project are documented in this file.

## [1.3.2] - 2026-07-23

### Fixed

- Background script used `chrome.*` APIs directly, which aren't reliably defined in Firefox's background context, crashing on load and silently breaking the popup for Firefox users. Switched to the cross-browser `browser.*` API.

## [1.3.1] - 2026-07-19

### Fixed

- Firefox manifest missing required `browser_specific_settings.gecko.data_collection_permissions` key, blocking submission.

## [1.3.0] - 2026-07-19

### Added

- Firefox support: extension now builds for both Chrome and Firefox from the same codebase.

### Changed

- Rewrote the extension build on [WXT](https://wxt.dev), replacing the hand-rolled Bun build scripts.
- Popup rebuilt with React (previously vanilla JS/HTML).

## [1.2.3] - 2026-07-18

### Changed

- Popup copy for analytics toggle updated ("Send ping analytics") and "Why?" link now points to the privacy policy page instead of the docs data-collection anchor.

## [1.2.2] - 2026-07-04

### Fixed

- Duration always showing "after 0s" on the leave screen after confirming "Leave call".

## [1.2.1] - 2026-07-04

### Changed

- Analytics now routed through a Cloudflare Worker proxy instead of calling Google Analytics directly, GA measurement ID and API secret no longer shipped in the extension bundle.

## [1.2.0] - 2026-07-03

### Added

- Anonymous daily usage ping to Google Analytics (Measurement Protocol) so we can tell if the extension is actually used, no personal data or meeting content sent. **Enabled by default, disable it anytime from the extension popup if you don't want it.**
- Extension popup with a toggle to opt out of anonymous usage pings.
- Custom timer label setting in the popup, replacing the default "MK" text on the Meet timer widget.

## [1.1.2]

### Added

- Leave-title pattern for "you've ended the meeting for everyone" (EN and ID).

### Removed

- Inline ternary for the "after"/"setelah" label, replaced by `AFTER_LABELS` constant.

## [1.1.1] - 2026-07-02

### Fixed

- Duration no longer missing from the leave screen title when Google Meet shows "You've left the meeting" (previously only matched "You left the meeting" without the apostrophe).

## [1.1.0] - 2026-07-02

### Added

- Meeting duration now appended to the "You left the meeting" title (e.g. "You left the meeting after 5m 32s").
- Duration format adapts to elapsed time: seconds only, minutes + seconds, or hours + minutes + seconds.
- Indonesian language support: shows "... setelah 5m 32s" using j/mnt/dtk units when Meet UI is in Bahasa Indonesia.
- Falls back to (hh:mm:ss) format for languages other than English/Indonesian.

## [1.0.2] - 2026-06-16

### Added

- Timer now displays full hh:mm:ss format (previously mm:ss).
- Separator line appears between timer and toolbar elements when additional items are present.
- Hover "MK" label to preview "RESET" text with yellow highlight, click to reset timer to 00:00:00.

### Removed

- Removed static separator that was always visible.
