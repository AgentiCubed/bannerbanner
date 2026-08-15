# BannerBanner documentation index

## Canonical (read these first)

| Doc | Role |
|---|---|
| [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md) | v0.1 product + safety + data contract |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Durable decision log |
| [`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md) | Private-beta and Web Store gates + evidence |
| [`docs/STATUS.md`](docs/STATUS.md) | Current truth, blockers, handoff |
| [`docs/REAL_SITE_TEST_MATRIX.md`](docs/REAL_SITE_TEST_MATRIX.md) | Real-site / permission / sensitive evidence |
| [`docs/REAL_SITE_TEST_PROTOCOL.md`](docs/REAL_SITE_TEST_PROTOCOL.md) | How to produce matrix rows |
| [`docs/CLAIMS_AUDIT.md`](docs/CLAIMS_AUDIT.md) | PB-12 claim-to-code audit |
| [`docs/RELEASE_PROVENANCE.md`](docs/RELEASE_PROVENANCE.md) | WS-04 package hash records |
| [`docs/RELEASE_NOTES_v0.1.md`](docs/RELEASE_NOTES_v0.1.md) | v0.1 release notes / Store “what's new” |
| [`PRD.md`](PRD.md) | v0.1 product requirements (aligned to contract) |
| [`README.md`](README.md) | Project overview |
| [`extension/README.md`](extension/README.md) | Extension architecture and commands |
| [`extension/PRIVACY_POLICY.md`](extension/PRIVACY_POLICY.md) | Privacy policy matching storage schema |
| [`AGENTS.md`](AGENTS.md) | Agent operating rules |

## User and developer entry points

- [`USER_GUIDE.md`](USER_GUIDE.md) — end-user guide (v0.1)
- [`QUICK_START.md`](QUICK_START.md) — build/load/test
- [`extension/CHROME_WEB_STORE_SUBMISSION.md`](extension/CHROME_WEB_STORE_SUBMISSION.md) — Store copy + permissions
- [`extension/SUBMISSION_CHECKLIST.md`](extension/SUBMISSION_CHECKLIST.md)
- [`SECURITY.md`](SECURITY.md) — private BannerBanner vulnerability reporting

## Superseded alpha-era documents

These retain historical planning text but are **not** authority for shipped
behavior. Each file starts with a supersession banner:

- `PROJECT_STATUS.md`, `EXTENSION_MVP.md`, `TESTING_GUIDE.md`
- `COMPLETE_PICTURE.md`, `ITERATION_6_SUMMARY.md`, `LAUNCH_CHECKLIST.md`
- `MVP_ASSESSMENT.md`, `NEXT_STEPS_MVP.md`
- `BANANA_TOWN_DOCS.md`, `BRAND_IMAGE_DESCRIPTION.md`

## Spark playground

`src/` is the GitHub Spark web app. It is not part of the extension runtime and
must not be described as shipped BannerBanner functionality.
