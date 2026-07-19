# Rewrite `src/extension/` to WXT

## Motivation

Ship the extension to Firefox in addition to Chrome. Hand-maintaining a second manifest/build path is not worth it — WXT owns the cross-browser build (MV3→MV2 conversion for Firefox, per-browser zips) so we don't build that ourselves.

## Scope

**In scope**: `src/extension/` (manifest, background, content script, popup) and the extension-related build/watch/zip scripts.

**Out of scope**: `src/worker/` (Cloudflare Workers analytics backend) and `src/docs/` (static landing page, built by `scripts/build-docs.js`). Both stay exactly as they are — different runtime targets, no shared code with the extension, and WXT's `entrypoints/` model has no natural home for a static site. Migrating them would be scope creep with no upside.

**Not doing**: TypeScript migration (files may be `.ts`/`.tsx` per WXT convention, but no type-safety effort — logic ports over as-is), no Safari target (Safari needs an Xcode wrapper WXT doesn't automate), no popup redesign beyond the React port.

## Target structure

```
meetkeep/
├── wxt.config.ts
├── entrypoints/
│   ├── background.ts
│   ├── content.ts
│   ├── content.css
│   └── popup/
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       └── style.css
├── src/
│   ├── worker/          # unchanged
│   └── docs/             # unchanged
├── scripts/
│   ├── build-docs.js     # unchanged
│   └── watch-docs.js     # extracted from old watch.js, docs-only
└── assets/                # unchanged, wxt.config.ts icon field points here
```

## Component mapping

- **`background.js` → `entrypoints/background.ts`**: wrapped in `defineBackground(() => { ... })`. Logic (client-id generation, daily ping gate, message listener) ports verbatim.
- **`content.js` → `entrypoints/content.ts`**: wrapped in `defineContentScript({ matches: ["https://meet.google.com/*"], main() { ... } })`. The 272-line IIFE body ports nearly verbatim; the outer `(() => {...})()` wrapper is dropped since WXT already isolates the entrypoint. `style.css` becomes `entrypoints/content.css`, registered via the `cssInjectionMode` default (or explicit `css` array — same effect as the old `content_scripts[0].css`).
- **`popup.html/js/css` → `entrypoints/popup/`**: rebuilt as a small React app (`App.tsx`) holding `analyticsEnabled` and `customLabel` as state, reading/writing `chrome.storage.local` in effects. No new behavior — same two controls (label input, analytics toggle) with the same storage keys.
- **`manifest.json` → `wxt.config.ts`**: `permissions`, `host_permissions`, `description`, `homepage_url`, `author`, icon sizes move into the `manifest` key of `defineConfig`. `name`/`version` continue to come from `package.json` (WXT default behavior).

## Build targets

- `wxt build` → Chrome (default).
- `wxt build -b firefox` → Firefox, WXT handles MV3 background→scripts conversion automatically.
- `wxt zip` / `wxt zip -b firefox` replace the custom `scripts/zip.js` (same job: version-named zip of the build output).
- `wxt dev` replaces `scripts/build.js` + the extension-watching half of `scripts/watch.js`, adding HMR for content/popup as a side benefit.

`package.json` scripts become: `dev` (wxt dev), `build` (wxt build), `build:firefox` (wxt build -b firefox), `zip`, `zip:firefox`, plus the retained `build:docs` / `watch:docs`.

## Deletions (dead code once WXT lands)

- `src/extension/manifest.json`, `background.js`, `content.js`, `popup.html`, `popup.js`, `popup.css`, `style.css` — replaced by `entrypoints/`.
- `scripts/build.js` — replaced by `wxt build`.
- `scripts/zip.js` — replaced by `wxt zip`.
- Extension-watching portion of `scripts/watch.js` — replaced by `wxt dev`. The docs-watching portion is extracted into `scripts/watch-docs.js` (same chokidar logic, scoped to `src/docs`).
- `build/extension/` build artifact directory (regenerated fresh by WXT under `.output/` — WXT's default output dir, so `build/extension` stops being produced).
- devDependencies no longer used by anything: `terser`, `clean-css` (still needed by `build-docs.js` — **kept**, only dropped if nothing references them; verify at implementation time), `archiver` (only used by old `zip.js` — dropped).

## Added dependencies

`wxt`, `react`, `react-dom`, `@types/react`, `@types/react-dom` (WXT's React module/template brings these in).

## Testing

- Manual: load unpacked build in Chrome, join a Meet call, verify timer injects, ticks, survives SPA navigation (pushState/replaceState/popstate), resets on label click, shows leave-title duration, respects hover state — this is the same manual check the current extension needs since there's no existing automated test for content-script DOM behavior.
- Manual: load the Firefox build (`about:debugging` → load temporary add-on) and repeat the same checklist, confirming the MV2 conversion didn't break storage/messaging APIs.
- Popup: verify label input and analytics toggle read/write `chrome.storage.local` correctly in both browsers.
