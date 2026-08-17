# Release artifact provenance (v0.1)

Supports **WS-04**. A Web Store upload is valid only when this file records the
tagged commit, package inventory, and archive hash for the exact bits uploaded.

## How to produce the artifact

```bash
git checkout <release-tag-or-commit>
git rev-parse HEAD
npm run build:extension
cat dist-extension-inventory.txt
cat bannerbanner-v0.1.0.zip.sha256
```

`extension/build-extension.sh` copies only runtime files into `dist-extension/`,
runs `scripts/validate-package.mjs` with `--strict-inventory`, writes the
inventory, normalizes package timestamps and archive order, and emits
`bannerbanner-v<version>.zip` plus a portable sha256 file.

## Package inventory (runtime only)

Expected paths (21 files as of v0.1.0):

```
background.js
content.js
icons/icon-128.png
icons/icon-16.png
icons/icon-32.png
icons/icon-48.png
lib/celebrate.js
lib/classify.js
lib/cmp-adapters.js
lib/content-runtime.js
lib/dom-probe.js
lib/origins.js
lib/pipeline.js
lib/registry.js
lib/settings-schema.js
lib/stats.js
manifest.json
options.html
options.js
popup.html
popup.js
```

Any extra or missing path fails strict validation.

## Recorded builds

Append a row for every candidate upload. Do not reuse a hash across different
commits.

| Date (UTC) | git commit | tag | zip sha256 | Builder | Notes |
|---|---|---|---|---|---|
| 2026-08-03 | `c981cc8b1d758dcbe18e09ea7f8b5ddffd04f611` | — | `fc96dfa0c725e18475d635f68daefbdbac3b3ec3951965af4625b2b784273662` | copilot-agent (issue #32 branch) | Historical pre-deterministic build. Not a Web Store upload. |
| 2026-08-17 | `6f8255baf9efdd2e86f421a468e733dc189b3b92` | — | `7f74e24eff2ef4f7facf0398f5c7dcb3a7f571569512128190829c129aefe464` | copilot task agent | Run R2 preflight candidate. Two consecutive local builds produced this hash; strict inventory has 21 paths. Local lint (0 errors), 73 unit tests, and 33 browser tests passed. Exact-SHA GitHub workflow runs and all human evidence remain pending. Not a Web Store upload. |

## Hash discipline

Current builds use a fixed package timestamp, sorted file order, stripped ZIP
metadata, and store-only compression. The same runtime contents therefore
produce the same archive bytes; two consecutive builds at `6f8255b` verified
this. `SOURCE_DATE_EPOCH` may override the fixed timestamp, so a release build
must use the default or record the override. For WS-04, verify the sha256 file
against the exact uploaded bytes and record it alongside `git rev-parse HEAD`
and the inventory.

## Release rule

1. All `PB-*` gates checked with evidence.
2. Tag the commit (`v0.1.0` or agreed prerelease tag).
3. Build on a clean tree at that tag.
4. Run `sha256sum -c bannerbanner-v0.1.0.zip.sha256`.
5. Record tag + commit + sha256 + inventory in this file.
6. Confirm the tag's Extension CI and Lint runs passed.
7. Upload that zip only.
