# BannerBanner quick start (v0.1)

## Build and load

```bash
npm run build:extension
```

1. `chrome://extensions` → Developer mode → **Load unpacked**
2. Select `dist-extension/` (not `dist/`, not the repo root)
3. Pin the toolbar icon

## Use

1. Open a site → toolbar popup → **Enable on this site** → accept the prompt
2. Mode: **Necessary only** or **Accept all**
3. Supported CMPs only (OneTrust, Cookiebot, CookieYes, Usercentrics;
   Quantcast Choice Accept-all only)

## Develop

```bash
npm run test:extension            # unit tests
npm run validate:extension        # manifest/package
npm run build:extension           # package + inventory + zip sha256
cd extension/test/browser && npm install && npm test
npm run lint
```

## Authority

- Contract: `docs/MVP_CONTRACT.md`
- Gates: `docs/RELEASE_GATES.md`
- Status: `docs/STATUS.md`
- Extension readme: `extension/README.md`

The Spark app under `src/` is not the extension runtime.
