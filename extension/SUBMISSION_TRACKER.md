# Submission tracker (v0.1)

| Item | Status | Notes |
|---|---|---|
| Pre-R2 candidate | Local validation passed | `6f8255b`; deterministic zip `7f74e24…e464`; 73 unit + 33 browser tests |
| Exact-SHA CI | Pending | No Extension CI/Lint run exists yet for `6f8255b`; use PR, manual dispatch, or candidate tag |
| Package build | Reproducible; final build blocked | Final archive must be built from the gates-green release tag |
| Listing copy | Draft ready | `CHROME_WEB_STORE_SUBMISSION.md` |
| Public support URL | Owner action | Private repository URL returned 404 signed out |
| Privacy policy | Code-aligned; public URL pending | `PRIVACY_POLICY.md`; private repository URL returned 404 signed out |
| Permission justifications | Draft ready | same file |
| Real-site matrix (PB-11) | Open | Needs human browser evidence |
| Claim audit (PB-12) | Closed | Re-run only if live evidence narrows support claims |
| Promo tile (WS-03) | Helper aligned; export pending | Full-size visual review required |
| Screenshots (WS-03) | Not started | Capture real popup/options during human Run R2 |
| Provenance record (WS-04) | Pre-R2 row recorded | Final tag/CI/upload row blocked on all PB gates |
| Developer account / fee | Owner action | James |
| Dashboard confirmations | Owner action; blocked | Listing, permissions, privacy, and asset confirmations require account access |
| Upload + review | Blocked on PB gates | Upload only the hash recorded for the final tag |

Update this table when a gate closes; do not mark "submitted" without a
recorded zip hash and tag.
