// Shared helpers for the BannerBanner browser integration tests.

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const EXT_SRC = join(ROOT, 'extension');
export const DIST = join(ROOT, 'dist-extension');
const FIXTURES = join(EXT_SRC, 'test', 'browser', 'fixtures');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css',
  '.png': 'image/png',
  '.json': 'application/json',
};

/**
 * Serve /fixtures/* from the fixture directory and /ext/* from the extension
 * source (so lib modules can be imported over HTTP with their relative paths).
 * Returns { server, origin }.
 */
export function startFixtureServer() {
  const roots = { '/fixtures/': FIXTURES, '/ext/': EXT_SRC };
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let filePath = null;
    for (const [prefix, root] of Object.entries(roots)) {
      if (url.pathname.startsWith(prefix)) {
        const rel = normalize(url.pathname.slice(prefix.length));
        if (rel.startsWith('..') || rel.includes(`..${sep}`)) break;
        filePath = join(root, rel);
        break;
      }
    }
    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
  });
  return new Promise((resolvePromise) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolvePromise({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

export function chromiumExecutable() {
  if (process.env.BB_CHROMIUM && existsSync(process.env.BB_CHROMIUM)) return process.env.BB_CHROMIUM;
  if (existsSync('/opt/pw-browsers/chromium')) return '/opt/pw-browsers/chromium';
  return chromium.executablePath();
}

/** Launch a plain browser (no extension) for pipeline tests. */
export async function launchBrowser() {
  return chromium.launch({ executablePath: chromiumExecutable(), headless: true });
}

/** Launch a persistent context with the built extension loaded. */
export async function launchWithExtension(userDataDir) {
  return chromium.launchPersistentContext(userDataDir, {
    executablePath: chromiumExecutable(),
    headless: true,
    args: [`--disable-extensions-except=${DIST}`, `--load-extension=${DIST}`],
  });
}

/** Wait for the extension service worker to be fully initialized. */
export async function getServiceWorker(context) {
  let [sw] = context.serviceWorkers();
  if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 15000 });
  // The worker can be observable before the extension APIs are wired up;
  // poll until the surface we rely on is actually present.
  for (let i = 0; i < 40; i++) {
    const ready = await sw
      .evaluate(() => Boolean(chrome?.runtime?.id && chrome?.scripting && chrome?.storage?.local))
      .catch(() => false);
    if (ready) return sw;
    await sleep(250);
    [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 15000 });
  }
  throw new Error('extension service worker never became ready');
}

/**
 * Install the chrome.* stub and start the real content runtime on the current
 * page (pipeline tests run the true module code without the extension host).
 *
 * @param {import('playwright-core').Page} page
 * @param {string} serverOrigin
 * @param {object} settings settings object the stubbed storage returns
 * @param {object} [opts] { settingsDelayMs }
 */
export async function startRuntimeOnPage(page, serverOrigin, settings, opts = {}) {
  await page.evaluate(
    ([settingsJson, delayMs]) => {
      const settingsValue = JSON.parse(settingsJson);
      const listeners = [];
      window.__bbOutcomes = [];
      window.__bbDispatch = (message) => listeners.forEach((fn) => fn(message, {}, () => {}));
      window.chrome = {
        runtime: {
          lastError: undefined,
          onMessage: { addListener: (fn) => listeners.push(fn) },
          sendMessage: (message, cb) => {
            window.__bbOutcomes.push(message);
            if (cb) cb({ ok: true });
          },
          getURL: (p) => p,
        },
        storage: {
          local: {
            get: (_key, cb) => {
              const respond = () => cb({ 'bb:settings': settingsValue });
              if (delayMs > 0) setTimeout(respond, delayMs);
              else respond();
            },
          },
        },
      };
    },
    [JSON.stringify(settings), opts.settingsDelayMs || 0]
  );
  await page.evaluate(async (origin) => {
    const mod = await import(`${origin}/ext/lib/content-runtime.js`);
    await mod.startContentRuntime(window, document);
  }, serverOrigin);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
