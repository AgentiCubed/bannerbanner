# Real-site test protocol (v0.1)

Step-by-step instructions for producing the evidence rows in
`docs/REAL_SITE_TEST_MATRIX.md`. Follow this exactly so runs are comparable
and reproducible. Everything here is manual by design: Chrome's permission
prompt and live CMP deployments cannot be automated from CI.

Time estimate: ~5 minutes per site row after the one-time setup.

## One-time setup (per test run)

1. Build the package from the commit under test and record provenance:

   ```bash
   git rev-parse HEAD                    # extension commit → matrix header
   npm run build:extension               # builds dist-extension/, prints zip sha256
   cat dist-extension-inventory.txt      # attach to the run record
   ```

2. Create a **fresh Chrome profile** (`chrome://version` shows the profile
   path; use *Add profile* or launch with `--user-data-dir` pointing at an
   empty directory). Do not reuse a profile between runs.

3. Load the extension: `chrome://extensions` → Developer mode → *Load
   unpacked* → select `dist-extension/`.

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

5. Fill in the *Test environment* block in the matrix (commit, zip hash,
   Chrome version, OS, date, tester, evidence folder).

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

8. **Capture evidence**: screenshot of the settled page + a DevTools shot of
   the cookie/storage value, saved as
   `evidence/<matrix-id>-<origin-host>-<mode>.png`. No URLs beyond the origin,
   no personal data in shots.

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
5. **Extension update after grant** — bump nothing; simply press *Reload*
   (🗘) on the extension card (this re-runs `onInstalled`), revisit the site:
   still works, and `getRegisteredContentScripts()` still lists only the
   granted origins.
6. **Permission denial** — the denial sub-step in per-site step 4.
7. **Revoke origin** — with the site open in a tab, popup → *Disable on this
   site*. Confirm: registration gone from `getRegisteredContentScripts()`,
   origin gone from `bb:authorizedOrigins`, and interacting with the open tab
   causes no further BannerBanner activity; after reload the banner returns
   and `window.__bannerBannerActive` is `undefined`.
8. **Similar origin** — after granting `https://www.example-site.com`, visit
   the apex or another subdomain (or the `http://` variant if it resolves):
   no execution.

## Sensitive-dialog spot checks (once per run)

The fixture regressions run in CI; here, spot-check two real flows to close
the matrix's real-flow column:

- a real **login dialog** (any site with a modal sign-in) on an *enabled*
  origin: BannerBanner must not touch it (`window.__bannerBannerActive` may be
  `true`; the dialog stays intact and stats show `skipped`/nothing, never
  `success`);
- a real **newsletter popup** on an enabled origin: untouched, recorded as
  unsupported at most.

## Recording the run

- Append rows to `REAL_SITE_TEST_MATRIX.md` (never overwrite past runs).
- Update the candidate CMP support ledger counts.
- If every claimed CMP passed both its claimed modes with zero destructive
  false positives across 20–30 rows, update `PB-11` in
  `docs/RELEASE_GATES.md` with a link to the matrix section and the evidence
  folder, and update `docs/STATUS.md`.
- Any destructive false positive: stop the run, file an issue, record the
  failure, leave `PB-05`/`PB-11` open.
