# BannerBanner decisions

This is the durable decision log for product scope, safety, permissions, data handling, and release policy. Append new decisions; do not silently rewrite settled history.

| ID | Date | Status | Decision | Reason |
|---|---|---|---|---|
| BB-001 | 2026-08-02 | Accepted | v0.1 is a cookie-consent manager only. | A narrow single purpose is safer, testable, and easier to explain. |
| BB-002 | 2026-08-02 | Accepted | Unknown dialogs never receive automatic action. | A generic heuristic can damage login, checkout, payment, security, and other critical workflows. |
| BB-003 | 2026-08-02 | Accepted | DOM removal or hiding never counts as consent. | Visual disappearance does not prove that a consent preference was recorded. |
| BB-004 | 2026-08-02 | Accepted | BannerBanner uses one detection-to-reporting pipeline. | The current independent engines can race, double-act, and record false outcomes. |
| BB-005 | 2026-08-02 | Accepted | Site access is opt-in per origin and enforced with dynamic content-script registration. | Static all-site matches contradict the promised permission model. |
| BB-006 | 2026-08-02 | Accepted | Settings are awaited before scanning; `chrome.storage` is the sole runtime source of truth. | Spark KV and asynchronous defaults currently produce disconnected or incorrect behavior. |
| BB-007 | 2026-08-02 | Accepted | v0.1 stores aggregate local statistics, not URL-bearing history. | Browsing-derived URLs create privacy-policy conflicts and exceed sync-storage limits. |
| BB-008 | 2026-08-02 | Accepted | Training and community pattern sharing are deferred. | The current training flow does not capture a usable pattern and sharing has no production backend or abuse model. |
| BB-009 | 2026-08-02 | Accepted | Bananer celebration occurs only after verified success. | Delight cannot delay utility or conceal a failed consent action. |
| BB-010 | 2026-08-02 | Accepted | Completion requires evidence. | Generated documentation and UI state are not proof of working behavior. |
| BB-011 | 2026-08-02 | Accepted | Release proceeds through private beta before Web Store submission. | Real-browser safety evidence is required before broad distribution. |
| BB-012 | 2026-08-02 | Accepted | The repository operating files are the project memory. | Future agents and contributors need a current, inspectable source of truth. |
| BB-013 | 2026-08-03 | Accepted | Quantcast Choice claims only the Accept all mode in v0.1; Necessary only is explicitly unsupported for it. | Quantcast's summary UI has no stable reject-all control without opening its settings panel; guessing would violate the exact-intended-control rule, so the claim is narrowed instead. |
| BB-014 | 2026-08-03 | Accepted | TrustArc, Osano, and Cookie Notice are removed from the claimed CMP set for v0.1. | Their alpha selectors had no verifiable postcondition defined; the launch allowlist keeps only the five CMPs with adapter-specific consent signals and fixture coverage, within the contract's three-to-five target. |
| BB-015 | 2026-08-22 | Accepted | Until upstream `@github/spark` publishes official Vite 8 peer support, BannerBanner carries a local patched `@github/spark` 0.46.15 tarball that widens only the Vite peer range. | The published Spark runtime used by this repo still caps its peer range at Vite 7, but the runtime and Vite plugins build cleanly here on Vite 8. Keeping the patch local unblocks the upgrade while making the removal condition explicit for future cleanup. |

## Superseding a decision

A new decision must include:

- a new ID and date;
- the decision being superseded;
- concrete evidence or a changed requirement;
- impact on permissions, safety, privacy, tests, and release gates; and
- James Richmond's explicit approval when it expands v0.1 scope or weakens an invariant.

Deprecated ideas remain in the log with status `Superseded`; they are not deleted.
