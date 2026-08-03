// Bounded aggregate statistics for BannerBanner.
//
// Data contract (docs/MVP_CONTRACT.md): the extension may keep aggregate
// success/failure counts, but never a full URL, path, query string, page title,
// page content, or a chronological browsing/dismissal history. This module
// enforces that: the stats object is a small, fixed set of integer counters
// keyed by CMP + mode. There is nothing here from which browsing history could
// be reconstructed.

import { CONSENT_MODES } from './settings-schema.js';

/** The only outcome buckets we count. */
export const OUTCOMES = Object.freeze(['success', 'unverified', 'unsupported', 'skipped']);

/** Fresh, empty stats. */
export function emptyStats() {
  return {
    totals: { success: 0, unverified: 0, unsupported: 0, skipped: 0 },
    // Per-CMP success counts, e.g. { OneTrust: { necessary: 3, all: 1 } }.
    byCmp: {},
  };
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toCount(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

/**
 * Coerce arbitrary stored data into valid, bounded stats. Never throws.
 * Any unrecognized or out-of-contract field is dropped, so even a store that
 * was polluted by an older build cannot leak prohibited data forward.
 *
 * @param {unknown} raw
 * @returns {object}
 */
export function normalizeStats(raw) {
  const out = emptyStats();
  if (!isPlainObject(raw)) return out;

  if (isPlainObject(raw.totals)) {
    for (const key of OUTCOMES) {
      out.totals[key] = toCount(raw.totals[key]);
    }
  }

  if (isPlainObject(raw.byCmp)) {
    for (const [cmp, modes] of Object.entries(raw.byCmp)) {
      if (typeof cmp !== 'string' || cmp.length > 40 || !isPlainObject(modes)) continue;
      const bucket = {};
      for (const mode of CONSENT_MODES) {
        const count = toCount(modes[mode]);
        if (count > 0) bucket[mode] = count;
      }
      if (Object.keys(bucket).length) out.byCmp[cmp] = bucket;
    }
  }

  return out;
}

/**
 * Return a new stats object with one outcome recorded. Pure — does not mutate
 * the input. `cmp` and `mode` are only used for the "success" bucket.
 *
 * @param {object} stats
 * @param {string} outcome one of OUTCOMES
 * @param {{cmp?: string, mode?: string}} [ctx]
 * @returns {object}
 */
export function recordOutcome(stats, outcome, ctx = {}) {
  const next = normalizeStats(stats);
  if (!OUTCOMES.includes(outcome)) return next;

  next.totals[outcome] += 1;

  if (outcome === 'success' && typeof ctx.cmp === 'string' && CONSENT_MODES.includes(ctx.mode)) {
    const cmp = ctx.cmp.slice(0, 40);
    next.byCmp[cmp] = next.byCmp[cmp] || {};
    next.byCmp[cmp][ctx.mode] = (next.byCmp[cmp][ctx.mode] || 0) + 1;
  }

  return next;
}
