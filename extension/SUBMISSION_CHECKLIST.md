# Chrome Web Store submission checklist (v0.1)

Do not submit until every private-beta gate (`PB-*`) in
`docs/RELEASE_GATES.md` is checked with evidence.

## Package

- [ ] `npm run build:extension` passes on the release commit
- [ ] `dist-extension/` inventory matches `dist-extension-inventory.txt`
- [ ] `bannerbanner-v0.1.0.zip` sha256 recorded in `docs/RELEASE_PROVENANCE.md`
- [ ] Fresh Chrome profile: Load unpacked → no errors
- [ ] Clean install: Site access = on click / none; no content scripts registered

## Listing copy

- [ ] Name, summary, description from `CHROME_WEB_STORE_SUBMISSION.md` (v0.1)
- [ ] No claims of training, community sharing, 30+ CMPs, granular categories,
      all-site automation, or newsletter/ad blocking
- [ ] Supported CMP list matches adapters + matrix (Quantcast Accept all only)
- [ ] Category and language set
- [ ] Support URL opens while signed out
- [ ] Privacy policy URL opens while signed out and points at current
      `PRIVACY_POLICY.md` text

## Permissions

- [ ] Dashboard justifications match `CHROME_WEB_STORE_SUBMISSION.md`
- [ ] Optional host permissions explained as per-origin opt-in
- [ ] No undeclared permission in the zip

## Privacy

- [ ] Privacy practices answers match `PRIVACY_POLICY.md` and storage tests
- [ ] No remote services claimed or present

## Assets (WS-03)

- [ ] Icons 16/32/48/128 present in package
- [ ] Required 440×280 promo tile reviewed at full size
- [ ] ≥1 screenshot at 1280×800 or 640×400 of the real popup/options UI
      (not Spark UI)
- [ ] Images contain no personal data, full URLs, or unverified support claims
- [ ] Promo tiles (if any) do not over-claim

## Dashboard evidence

- [ ] Listing-copy confirmation captured with date and owner
- [ ] Permission-justification confirmation captured with date and owner
- [ ] Privacy-practices confirmation captured with date and owner
- [ ] Uploaded asset filenames recorded in `SUBMISSION_TRACKER.md`

## Gates

- [ ] All `PB-*` closed with evidence
- [ ] `WS-01`…`WS-04` evidence linked in `docs/RELEASE_GATES.md`
