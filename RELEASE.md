# Release Process

## 1. Version bump + changelog + zip + push

1. Update `CHANGELOG.md`: add a new `## [x.y.z] - YYYY-MM-DD` section at the top with the changes.
2. Bump `version` in `package.json` to match.
3. Commit: `chore: release version x.y.z`
4. Build the zips:

   ```bash
   bun scripts/zip.js
   bun scripts/zip.js -b firefox
   ```

5. Commit the generated `dist/meetkeep-x.y.z-chrome.zip` and `dist/meetkeep-x.y.z-firefox.zip`.
6. Push: `git push`

## 2. GitHub release

1. Go to [github.com/ibnumardini/meetkeep/releases/new](https://github.com/ibnumardini/meetkeep/releases/new)
2. Tag: `vx.y.z` (create on publish), target: `master`.
3. Title: `x.y.z`
4. Release notes: paste the matching section from `CHANGELOG.md`.
5. Attach both zips from `dist/`: `meetkeep-x.y.z-chrome.zip` and `meetkeep-x.y.z-firefox.zip`.
6. Publish release.

## 3. Chrome Web Store

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Select MeetKeep, then the Package tab, then Upload new package.
3. Upload `dist/meetkeep-x.y.z-chrome.zip` (version number must be higher than the current one, already true since `package.json` was bumped).
4. Update any changed listing metadata (description, screenshots) if applicable.
5. Click Submit for Review, then confirm in the dialog.
6. Leave "Publish automatically" checked to go live right after approval, or uncheck it to publish manually later.

## 4. Firefox Add-ons (AMO)

1. Go to the add-on's page on AMO (must be the existing listing, not "Submit a New Add-on", so it's recognized as an update).
2. Click Upload New Version and select `dist/meetkeep-x.y.z-firefox.zip`.
3. Wait for the automatic validator to pass (fix any blocking errors it reports).
4. Select compatible platforms.
5. Source code declaration: the built zip is not minified/obfuscated, so answer "no" when asked if a separate source package is required.
6. Enter release notes for this version (paste the changelog entry).
7. Submit for review.
