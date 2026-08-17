# Real-site test protocol (v0.1)

Step-by-step instructions for producing the evidence rows in
`docs/REAL_SITE_TEST_MATRIX.md`. Follow this exactly so runs are comparable
and reproducible. Everything here is manual by design: Chrome's permission
prompt and live CMP deployments cannot be automated from CI.

Time estimate: ~5 minutes per site row after the one-time setup.

## Candidate freeze and automated preflight

The release steward completes this section before handing the artifact to the
human tester. Do not change extension runtime files after recording the
candidate commit.

1. Start from a clean tree and record the exact candidate:

   ```bash
   git status --short                    # expect no output
   git rev-parse HEAD
   ```

2. Run the same checks required in CI:

   ```bash
   npm ci
   npm ci --prefix extension/test/browser
   npm run lint
   npm run test:extension
   npm run build:extension
   npm run validate:extension
   npm run test:extension:browser
   ```

3. Require successful **Extension CI** and **Lint** workflow runs whose
   `head_sha` is exactly the candidate commit. If path filters did not start
   them, use the workflows' `workflow_dispatch` trigger at that ref. Record both
   run URLs in the matrix.
4. Record the candidate commit, archive SHA-256, and inventory in the Run R2
   block. A later runtime change invalidates the candidate and requires a new
   preflight, hash, and Run R2 block.

## One-time setup (per test run)

1. Confirm the package matches the frozen candidate:

   ```bash
   git rev-parse HEAD
   cat bannerbanner-v0.1.0.zip.sha256
   sha256sum -c bannerbanner-v0.1.0.zip.sha256
   cat dist-extension-inventory.txt
   ```

   Extract that exact archive into a new, stable working directory and load the
   extracted directory. Do not rebuild between rows. Keep the archive unchanged;
   the permission walkthrough may alter only the working copy's manifest
   version to exercise a real extension update.

2. Create a **fresh Chrome profile** (`chrome://version` shows the profile
   path; use *Add profile* or launch with `--user-data-dir` pointing at an
   empty directory). Do not reuse a profile between runs.

3. Load the extension: `chrome://extensions` → Developer mode → *Load
   unpacked* → select the extracted working directory.

4. Confirm the clean-install baseline before touching any site:
   - `chrome://extensions` → BannerBanner → *Details* → "Site access" shows
     **On click** / no sites.
   - Service worker console (`chrome://extensions` → *Inspect views:
     service worker*):

     ```js
     chrome.storage.local.get(null, console.log)
     // expect: bb:settings {version:1, mode:'necessary', ...},
     //         bb:authorizedOrigins [], bb:stats all zeros
     chrome.storage.sync.get(null, console.log)   // expect: {}
     await chrome.scripting.getRegisteredContentScripts()  // expect: []
     ```

5. Confirm the extension card has no errors, the service-worker console has no
   startup errors, and popup/options pages both open.
6. Fill in the *Test environment* block in the matrix (commit, zip hash,
   workflow URLs, Chrome version, OS, date, tester, and evidence folder).

## Per-site procedure (one matrix row)

For the site's assigned CMP and mode (`Necessary only` or `Accept all`):

1. **Confirm the CMP is really there.** Open the site in a regular tab
   (before enabling anything) and check DevTools for the CMP container:
   - OneTrust: `#onetrust-banner-sdk`
   - Cookiebot: `#CybotCookiebotDialog`
   - CookieYes: `.cky-consent-container`
   - Quantcast Choice: `#qc-cmp2-ui`
   - Usercentrics: `#usercentrics-root` / `[data-testid="uc-container"]`

   If the expected CMP is absent (sites change vendors), record the row as
   `Blocked` with a note and pick a replacement site from the candidate pool.

2. **Verify no pre-grant execution.** With the banner visible, run in the
   page console: `window.__bannerBannerActive` → must be `undefined`.

3. **Set the mode.** Toolbar popup → consent preference → select the mode for
   this row.

4. **Enable the site.** Popup → *Enable on this site* → accept Chrome's
   prompt. (First site of the run: also do one **denial**: click *Enable*,
   dismiss the prompt, confirm the popup reports it and nothing changed —
   that covers the permission-boundary "denial" row.)

5. **Reload the page** and observe. Expected within a few seconds:
   - the CMP's own banner disappears (torn down by the CMP, not hidden);
   - no layout damage; page remains scrollable and usable.

6. **Verify the postcondition** in DevTools (this is what makes it a `Pass`,
   not the banner disappearing):
   - OneTrust: `document.cookie` contains `OptanonConsent` (and typically
     `OptanonAlertBoxClosed`); for *Necessary only* the groups string shows
     non-essential categories as `:0`.
   - Cookiebot: `CookieConsent` cookie present; for *Necessary only* its
     `preferences/statistics/marketing` flags are `false`.
   - CookieYes: `cookieyes-consent` cookie present with the matching action.
   - Quantcast: `euconsent-v2` cookie present (TCF string).
   - Usercentrics: `localStorage.getItem('uc_settings')` non-null.

7. **Check the recorded outcome.** Popup stats (or the service-worker console
   `chrome.storage.local.get('bb:stats', console.log)`) shows the success
   counter incremented for that CMP and mode — and nothing else appeared in
   storage (no URLs; `chrome.storage.sync` still `{}`).

8. **Capture evidence**: save both the settled page and the DevTools
   cookie/storage postcondition as
   `evidence/<matrix-id>-<origin-host>-<mode>-settled.png` and
   `evidence/<matrix-id>-<origin-host>-<mode>-postcondition.png`. No URLs beyond
   the origin and no personal data may appear. Commit sanitized captures with
   the matrix or link them to a durable external artifact. A capture that cannot
   be safely sanitized must be excluded and cannot support a `Pass`.

9. **Fill the matrix row**: `Pass` / `Fail` / `Unsupported` / `Blocked`, page
   usable yes/no, destructive false positive yes/no, evidence path, date,
   notes. Any `Fail` also gets a Failure record per the matrix template.

10. **Between rows on the same site** (switching modes): disable the site in
    the popup, clear the site's cookies/storage (DevTools → Application →
    *Clear site data*), reload to confirm the banner returns and BannerBanner
    is inert again, then start the next row at step 3.

## Permission-boundary walkthrough (once per run)

Complete the permission matrix in `REAL_SITE_TEST_MATRIX.md` in this order,
using one of the test sites:

1. **Clean install / never-authorized** — covered by setup step 4 plus
   per-site step 2 on the first site.
2. **Explicit grant** — per-site step 4; additionally confirm in the SW
   console that `getRegisteredContentScripts()` now lists exactly
   `bb-cs-<origin>` with that single origin match.
3. **Reload after grant** — per-site step 5.
4. **Browser restart after grant** — quit Chrome fully, reopen, revisit the
   site: behavior persists without re-prompting.
5. **Extension update after grant** — in the extracted working directory,
   increment only `manifest.json`'s patch version (for example `0.1.0` →
   `0.1.1`), then press *Reload* (🗘) on the extension card. Confirm
   `chrome.runtime.getManifest().version` shows the new version, revisit the
   site, and verify it still works. `getRegisteredContentScripts()` must list
   only granted origins. Record a diff proving that only the working copy's
   version changed; never alter the hashed archive.
6. **Permission denial** — the denial sub-step in per-site step 4.
7. **Revoke origin** — with the site open in a tab, popup → *Disable on this
   site*. Confirm: registration gone from `getRegisteredContentScripts()`,
   origin gone from `bb:authorizedOrigins`, and interacting with the open tab
   causes no further BannerBanner activity; after reload the banner returns
   and `window.__bannerBannerActive` is `undefined`.
8. **Browser restart after revoke** — quit Chrome fully, reopen the same
   profile, and revisit the origin. The origin and registration must remain
   absent and BannerBanner must remain inert.
9. **Extension update after revoke** — increment only the working copy's
   manifest patch version again, reload the extension, and revisit the origin.
   The update must not restore the origin, permission-derived activity, or a
   content-script registration.
10. **Similar origin** — after granting `https://www.example-site.com`, visit
   the apex or another subdomain (or the `http://` variant if it resolves):
   no execution.

## Sensitive-dialog spot checks (once per run)

The fixture regressions run in CI; Run R2 must also spot-check two real flows:

- a real **login dialog** (any site with a modal sign-in) on an *enabled*
  origin: BannerBanner must not touch it (`window.__bannerBannerActive` may be
  `true`; the dialog stays intact and stats show `skipped`/nothing, never
  `success`);
- a real **newsletter popup** on an enabled origin: untouched, recorded as
  unsupported at most.

## Run-level package and storage audit

After the site rows and permission walkthrough:

1. Confirm the extension card, service worker, popup, and options page have no
   errors.
2. Capture `chrome.storage.local.get(null)` and verify that the only top-level
   keys are `bb:settings`, `bb:authorizedOrigins`, and `bb:stats`, with the
   bounded shapes described in `extension/PRIVACY_POLICY.md`.
3. Capture `chrome.storage.sync.get(null)` returning `{}`.
4. Capture `chrome.scripting.getRegisteredContentScripts()` and verify every
   registration maps one-to-one to a currently authorized origin.
5. Re-run the archive checksum and compare the package inventory with the
   preflight record. Record these results in the matrix's package/storage audit.

## Recording the run

- Append rows to `REAL_SITE_TEST_MATRIX.md` (never overwrite past runs).
- Update the candidate CMP support ledger counts.
- Complete the candidate-validation, permission-boundary, sensitive-dialog,
  and package/storage tables. Blank cells or unlinked evidence keep their
  affected gate open.
- If every claimed CMP passed both its claimed modes with zero destructive
  false positives across 20–30 **distinct site origins**, update `PB-11` in
  `docs/RELEASE_GATES.md` with a link to the matrix section and the evidence
  artifact, and update `docs/STATUS.md`. Count unique origins before closing the
  gate; multiple mode rows for one origin count as one site.
- Any destructive false positive: stop the run, file an issue, record the
  failure, leave `PB-05`/`PB-11` open.

## Gate reconciliation after Run R2

James checks a gate only after the listed evidence is complete:

| Gate | Required Run R2 evidence |
|---|---|
| PB-01 | Clean install, denial, explicit grant, and similar-origin rows pass. |
| PB-02 | Immediate revoke, restart-after-revoke, and update-after-revoke rows pass. |
| PB-03 | Every claimed CMP-mode combination has a live passing row and verified postcondition. |
| PB-04 | Candidate CI unknown-dialog regressions pass. |
| PB-05 | Candidate CI safety fixtures and both real-flow spot checks pass with zero destructive false positives. |
| PB-06 | Candidate CI awaited-settings and duplicate-action regressions pass. |
| PB-07 | Both settings modes and authorization persist through reload, restart, and update. |
| PB-08 | Run-level local/sync storage inspection matches the privacy contract. |
| PB-09 | Exact candidate archive loads in a fresh profile without errors and matches its inventory. |
| PB-10 | Extension CI and Lint are green at the exact candidate SHA. |
| PB-11 | 20–30 distinct origins pass, all claimed combinations pass, and failures are resolved or claims narrowed. |
| PB-12 | Already closed; rerun the claims audit only if live results narrow support or change public copy. |
