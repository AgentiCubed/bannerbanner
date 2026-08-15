# Quick start: Chrome Web Store submission (v0.1)

Private beta gates in `docs/RELEASE_GATES.md` must pass before submission.

## Steps

1. **Build**
   ```bash
   npm run build:extension
   git rev-parse HEAD
   cat bannerbanner-v0.1.0.zip.sha256
   cat dist-extension-inventory.txt
   ```
2. **Load unpacked** — `chrome://extensions` → Developer mode → Load unpacked → `dist-extension/`
3. **Smoke test** — fresh profile: zero site access; enable one site; Necessary only / Accept all on a matrix site; revoke; confirm sync storage stays empty.
4. **Copy** — use the Summary/Description/permission text in `CHROME_WEB_STORE_SUBMISSION.md` (v0.1 only).
5. **Privacy policy** — host `extension/PRIVACY_POLICY.md` (or the repository path) and link it.
6. **Screenshots** — popup + options only; no training/theme/Spark UI.
7. **Upload** — zip from the build (`bannerbanner-v0.1.0.zip`), record hash in `docs/RELEASE_PROVENANCE.md`.

## Minimum requirements

- Icons 16/32/48/128 (committed, reproducible)
- 1+ accurate screenshot
- Privacy policy URL
- Single-purpose description and minimum permissions
- Provenance: tagged commit + zip sha256
