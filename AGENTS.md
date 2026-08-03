# BannerBanner agent operating instructions

These instructions apply to the entire repository.

## Authority and source of truth

Use this order when instructions conflict:

1. James Richmond's explicit request in the current session.
2. `docs/MVP_CONTRACT.md`.
3. `docs/DECISIONS.md`.
4. `docs/RELEASE_GATES.md`.
5. `docs/STATUS.md` and `docs/IMPLEMENTATION_PLAN.md`.
6. Existing product documents and code comments.

The repository is the project's durable memory. Chat summaries, generated completion claims, screenshots, and old planning documents are context, not proof.

## Required startup sequence

Before proposing or changing implementation:

1. Read `docs/MVP_CONTRACT.md`, `docs/DECISIONS.md`, `docs/RELEASE_GATES.md`, and `docs/STATUS.md`.
2. Inspect the current code, manifest, storage behavior, tests, and build scripts relevant to the requested work.
3. Identify the first unmet release gate affected by the request.
4. Report:
   - Current Project
   - Current Mode
   - Next Shippable Artifact
   - Blocking Release Gate
5. Work on that artifact unless James explicitly changes priority.

## v0.1 non-negotiables

- v0.1 handles cookie-consent banners only.
- Site access is opt-in per origin and must be enforced technically.
- Unknown dialogs are never acted on automatically.
- Login, checkout, payment, security, age-verification, session-expiration, and unsaved-work dialogs must remain untouched.
- Removing or hiding a banner is not a consent decision.
- A consent action counts as successful only after the selected control is activated and the result is verified.
- There is one detection, decision, execution, verification, and reporting pipeline.
- Settings are loaded before automatic scanning or action.
- `chrome.storage` is the extension's sole runtime source of truth.
- Full URLs and browsing history do not enter `chrome.storage.sync`.
- Celebration UI runs only after verified utility and must never delay the consent action.
- Training, community sharing, newsletter removal, advertisement removal, generic popup removal, and the Spark dashboard are outside v0.1.

## Evidence and completion

Never mark work complete solely because code was generated or a screen advanced.

A work item is complete only when:

- its acceptance criteria are met;
- relevant automated checks pass;
- required manual verification is recorded;
- the affected release-gate evidence is linked or committed; and
- no safety invariant was weakened.

If evidence is missing, report the item as unverified or blocked.

## Change discipline

- Prefer the smallest change that closes one release gate.
- Preserve unrelated user changes.
- Do not expand v0.1 scope while fixing a blocker.
- Add regression coverage for every corrected destructive or privacy-sensitive behavior.
- Treat permission expansion, new data collection, remote services, and automated action on a new dialog class as architecture decisions. Record them in `docs/DECISIONS.md` before implementation.
- Put worthwhile but non-MVP ideas in the Parking Lot in `docs/STATUS.md`.

## End-of-session handoff

After meaningful work, update:

- `docs/STATUS.md`;
- the relevant row in `docs/RELEASE_GATES.md`;
- `docs/REAL_SITE_TEST_MATRIX.md` when browser testing occurred; and
- `docs/DECISIONS.md` when a durable decision changed.

The handoff must state what changed, what was verified, what remains uncertain, and the next shippable artifact.
