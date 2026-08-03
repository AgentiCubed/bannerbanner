#!/usr/bin/env node
// Validate the BannerBanner extension package.
//
// Usage: node scripts/validate-package.mjs [packageDir]
// Defaults to the source `extension/` directory so the same checks run against
// the tree and against a built package directory. Exits non-zero on ANY
// failure — a missing required file is fatal, never a warning (PB-09).

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const packageDir = resolve(process.argv[2] || 'extension');
const errors = [];
const notes = [];

function fail(msg) {
  errors.push(msg);
}

// --- load manifest -----------------------------------------------------------

const manifestPath = join(packageDir, 'manifest.json');
if (!existsSync(manifestPath)) {
  console.error(`FAIL: ${manifestPath} not found`);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (e) {
  console.error(`FAIL: manifest.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

// --- structural checks ---------------------------------------------------------

if (manifest.manifest_version !== 3) fail('manifest_version must be 3');
if (!/^\d+\.\d+\.\d+$/.test(manifest.version || '')) fail(`version "${manifest.version}" is not semver-like`);

// Permission contract (docs/MVP_CONTRACT.md): storage/activeTab/scripting only,
// no static host permissions, no static content scripts.
const ALLOWED_PERMISSIONS = new Set(['storage', 'activeTab', 'scripting']);
for (const perm of manifest.permissions || []) {
  if (!ALLOWED_PERMISSIONS.has(perm)) fail(`permission "${perm}" is outside the v0.1 permission contract`);
}
if (Array.isArray(manifest.host_permissions) && manifest.host_permissions.length > 0) {
  fail(`host_permissions must be empty; found: ${manifest.host_permissions.join(', ')}`);
}
if (manifest.content_scripts !== undefined) {
  fail('static content_scripts are prohibited; per-site opt-in requires dynamic registration only');
}

const optional = manifest.optional_host_permissions || [];
const allowedOptional = new Set(['http://*/*', 'https://*/*']);
for (const pattern of optional) {
  if (!allowedOptional.has(pattern)) fail(`unexpected optional_host_permissions entry: ${pattern}`);
}

// --- referenced files exist -----------------------------------------------------

function requireFile(path, why) {
  const full = join(packageDir, path);
  if (!existsSync(full) || !statSync(full).isFile()) {
    fail(`missing file "${path}" (${why})`);
    return false;
  }
  return true;
}

for (const [size, path] of Object.entries(manifest.icons || {})) {
  requireFile(path, `icons.${size}`);
}
for (const [size, path] of Object.entries(manifest.action?.default_icon || {})) {
  requireFile(path, `action.default_icon.${size}`);
}
if (manifest.action?.default_popup) requireFile(manifest.action.default_popup, 'action.default_popup');
if (manifest.background?.service_worker) requireFile(manifest.background.service_worker, 'background.service_worker');
if (manifest.options_ui?.page) requireFile(manifest.options_ui.page, 'options_ui.page');

// PNG signature sanity for icons (catches placeholder/corrupt files).
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
for (const path of Object.values(manifest.icons || {})) {
  const full = join(packageDir, path);
  if (existsSync(full)) {
    const head = readFileSync(full).subarray(0, 8);
    if (!head.equals(PNG_SIG)) fail(`icon "${path}" is not a valid PNG`);
  }
}

// Web-accessible resource globs must resolve to at least one real file.
for (const entry of manifest.web_accessible_resources || []) {
  for (const resource of entry.resources || []) {
    if (resource.includes('*')) {
      const dir = join(packageDir, resource.split('*')[0]);
      let matched = false;
      if (existsSync(dir) && statSync(dir).isDirectory()) {
        matched = readdirSync(dir).length > 0;
      }
      if (!matched) fail(`web_accessible_resources glob "${resource}" matches no files`);
    } else {
      requireFile(resource, 'web_accessible_resources');
    }
  }
}

// HTML pages must not reference missing local scripts/styles.
function checkHtmlRefs(htmlPath) {
  const full = join(packageDir, htmlPath);
  if (!existsSync(full)) return;
  const html = readFileSync(full, 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((r) => !/^(https?:|chrome|#|mailto:|data:)/.test(r));
  for (const ref of refs) {
    requireFile(ref.replace(/^\.\//, ''), `referenced by ${htmlPath}`);
  }
}
for (const page of [manifest.action?.default_popup, manifest.options_ui?.page].filter(Boolean)) {
  checkHtmlRefs(page);
}

// The dynamically registered content script and its module imports must ship.
requireFile('content.js', 'dynamically registered content script');
requireFile('lib/content-runtime.js', 'content runtime module');

// --- package minimalism -----------------------------------------------------------
// Only runtime-required files may ship. Anything else in a built package is an error.

const ALLOWED_PATTERNS = [
  /^manifest\.json$/,
  /^background\.js$/,
  /^content\.js$/,
  /^popup\.(html|js)$/,
  /^options\.(html|js)$/,
  /^lib\/[a-z0-9-]+\.js$/,
  /^icons\/icon-(16|32|48|128)\.png$/,
];

function walk(dir, base = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (statSync(full).isDirectory()) out.push(...walk(full, rel));
    else out.push(rel);
  }
  return out;
}

const strict = process.argv.includes('--strict-inventory');
const files = walk(packageDir).sort();
if (strict) {
  for (const file of files) {
    if (!ALLOWED_PATTERNS.some((re) => re.test(file))) {
      fail(`unexpected file in package: ${file}`);
    }
  }
}

notes.push(`package inventory (${files.length} files):`);
for (const file of files) notes.push(`  ${file}`);

// --- report -------------------------------------------------------------------------

for (const note of notes) console.log(note);
if (errors.length) {
  console.error('\nPackage validation FAILED:');
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\nPackage validation passed.');
