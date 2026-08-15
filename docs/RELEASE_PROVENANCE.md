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
inventory, and emits `bannerbanner-v<version>.zip` plus its sha256.

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
| 2026-08-03 | `c981cc8b1d758dcbe18e09ea7f8b5ddffd04f611` | — | see builder log | copilot-agent (issue #32 branch) | Pre-tag package checks on branch `copilot/pb-11-complete-real-site-acceptance`. Zip sha256 is **not bit-stable across runs** (zip metadata timestamps); always record the hash from the exact `npm run build:extension` invocation used for upload. Not a Web Store upload. Rebuild and re-hash after the release tag is cut on a gates-green commit. |

## Hash discipline

`bannerbanner-v*.zip` contents are validated by path inventory; the zip
container hash can change when the same files are re-zipped. For WS-04, store
the sha256 printed by the single build command that produced the uploaded
bytes, alongside `git rev-parse HEAD` and the inventory file from that run.

## Release rule

1. All `PB-*` gates checked with evidence.
2. Tag the commit (`v0.1.0` or agreed prerelease tag).
3. Build on a clean tree at that tag.
4. Record tag + commit + sha256 + inventory in this file.
5. Upload that zip only.
