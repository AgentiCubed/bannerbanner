# v0.1 claims-to-code audit

Date: 2026-08-03  
Supports: **PB-12**, **WS-01**  
Baseline: extension runtime on `main` hardening rewrite + this branch's doc alignment.

## Method

For each public surface, compare stated purpose, permissions, data, features,
and exclusions against `extension/manifest.json`, `extension/lib/*`, popup/options
UI, and automated tests. Alpha-era root markdown is superseded (bannered) or
rewritten.

## Surface → verdict

| Surface | Verdict | Notes |
|---|---|---|
| `README.md` | Pass | Matches opt-in, two modes, five CMP candidates, exclusions |
| `PRD.md` | Pass (rewritten) | Now mirrors MVP contract; alpha features removed |
| `extension/manifest.json` | Pass | storage/activeTab/scripting + optional hosts; no static content_scripts |
| `extension/popup.html` + `options.html` | Pass | Enable/disable site, two modes, local stats only |
| `extension/PRIVACY_POLICY.md` | Pass | Exact `bb:*` schema; empty sync; no remote I/O |
| `extension/README.md` | Pass | Architecture + candidate CMP table with Quantcast caveat |
| `extension/CHROME_WEB_STORE_SUBMISSION.md` | Pass (rewritten) | Single-purpose copy; no 30+/training/themes claims |
| `extension/QUICK_START_SUBMISSION.md` | Pass (rewritten) | Build path `dist-extension/`; gate dependency stated |
| `USER_GUIDE.md` / `QUICK_START.md` | Pass (rewritten) | Per-site enable; correct load path |
| `docs/MVP_CONTRACT.md` | Pass | Canonical |
| `docs/RELEASE_NOTES_v0.1.md` | Pass (added) | Matches inclusions/exclusions |
| Legacy alpha docs (`PROJECT_STATUS.md`, `EXTENSION_MVP.md`, `TESTING_GUIDE.md`, `COMPLETE_PICTURE.md`, `ITERATION_6_SUMMARY.md`, `LAUNCH_CHECKLIST.md`, `MVP_ASSESSMENT.md`, `NEXT_STEPS_MVP.md`, `BANANA_TOWN_DOCS.md`, `BRAND_IMAGE_DESCRIPTION.md`) | Superseded | Banner points to operating pack; historical text retained |
| Spark `src/` UI | N/A (not shipped) | README states playground only |

## Claim checklist

| Claim | Code / test evidence |
|---|---|
| Per-origin opt-in, no static matches | `manifest.json`; `lib/registry.js`; `boundary.spec.mjs` |
| Two modes only | `lib/settings-schema.js`; popup/options `<select>` |
| Five CMP adapters; Quantcast accept-all only | `lib/cmp-adapters.js`; BB-013; `pipeline.spec.mjs` |
| Verified postcondition required | `lib/pipeline.js` + adapter `verify`; unresponsive fixture test |
| Unknown/sensitive untouched | `lib/classify.js`; protected fixtures in `pipeline.spec.mjs` |
| No URL history / no sync | `lib/stats.js`; `stats.test.mjs`; empty-sync boundary test |
| Celebration after success only | `lib/celebrate.js`; pipeline ordering |
| No training/sharing in package | Absent from `dist-extension` inventory |

## Residual gaps

- Real-site public “supported” wording stays **candidate** until PB-11 matrix
  rows are filled by a human browser run (`docs/REAL_SITE_TEST_PROTOCOL.md`).
- WS-03 screenshots not yet captured.
- WS-04 final upload row needs a git tag on a gates-green commit.
