// Authorized-origin registry reconciliation for BannerBanner.
//
// There is exactly one canonical registry of authorized origins, stored in
// chrome.storage.local (docs/MVP_CONTRACT.md permission contract). The service
// worker registers a dynamic content script for each authorized origin with
// chrome.scripting.registerContentScripts() and must keep those registrations in
// sync on install, startup, update, and settings changes.
//
// This module contains the pure planning logic: given the desired origins, the
// origins that actually hold host permission, and the currently registered
// script IDs, it computes exactly what to register and unregister. No chrome.*
// calls live here, so the reconciliation is unit tested directly.

import { normalizeOrigin, normalizeOriginList, originToMatchPattern } from './origins.js';

/** Files a per-origin content script runs, in order. */
export const CONTENT_SCRIPT_JS = ['content.js'];

/** Deterministic registration id for an origin. */
export function registrationId(origin) {
  const normalized = normalizeOrigin(origin);
  if (!normalized) throw new Error(`Cannot build registration id for: ${String(origin)}`);
  // Stable, filesystem/id-safe: strip scheme punctuation.
  return `bb-cs-${normalized.replace(/[^a-z0-9]+/gi, '_')}`;
}

/**
 * Build the chrome.scripting content-script registration for an origin.
 * @param {string} origin
 * @returns {object}
 */
export function buildRegistration(origin) {
  return {
    id: registrationId(origin),
    matches: [originToMatchPattern(origin)],
    js: [...CONTENT_SCRIPT_JS],
    runAt: 'document_idle',
    allFrames: false,
    persistAcrossSessions: true,
  };
}

/**
 * Compute a reconciliation plan.
 *
 * The effective desired set is the intersection of (authorized origins in the
 * registry) and (origins we actually hold host permission for). This guarantees
 * that losing a permission, or a stale registry entry, never leaves a script
 * registered without permission — and that an extension update cannot broaden
 * access, because the plan is derived only from current grants.
 *
 * @param {object} input
 * @param {string[]} input.desiredOrigins origins from the stored registry
 * @param {string[]} input.grantedOrigins origins Chrome currently grants
 * @param {string[]} input.registeredIds currently registered script ids
 * @returns {{toRegister: object[], toUnregisterIds: string[], effectiveOrigins: string[]}}
 */
export function planReconciliation({ desiredOrigins, grantedOrigins, registeredIds }) {
  const desired = new Set(normalizeOriginList(desiredOrigins));
  const granted = new Set(normalizeOriginList(grantedOrigins));

  // Only keep origins that are both authorized AND currently permitted.
  const effective = [...desired].filter((o) => granted.has(o)).sort();

  const desiredIdToOrigin = new Map(effective.map((o) => [registrationId(o), o]));
  const currentIds = new Set(Array.isArray(registeredIds) ? registeredIds : []);

  const toRegister = [];
  for (const [id, origin] of desiredIdToOrigin) {
    if (!currentIds.has(id)) toRegister.push(buildRegistration(origin));
  }

  const toUnregisterIds = [];
  for (const id of currentIds) {
    // Only manage ids that belong to us; leave anything else alone.
    if (id.startsWith('bb-cs-') && !desiredIdToOrigin.has(id)) {
      toUnregisterIds.push(id);
    }
  }

  return { toRegister, toUnregisterIds, effectiveOrigins: effective };
}

/**
 * Add an origin to a registry list (returns a new normalized list).
 * @param {string[]} origins
 * @param {string} origin
 * @returns {string[]}
 */
export function addOrigin(origins, origin) {
  return normalizeOriginList([...(Array.isArray(origins) ? origins : []), origin]);
}

/**
 * Remove an origin from a registry list (returns a new normalized list).
 * @param {string[]} origins
 * @param {string} origin
 * @returns {string[]}
 */
export function removeOrigin(origins, origin) {
  const target = normalizeOrigin(origin);
  return normalizeOriginList((Array.isArray(origins) ? origins : []).filter((o) => normalizeOrigin(o) !== target));
}
