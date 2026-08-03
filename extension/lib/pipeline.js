// The single BannerBanner consent pipeline.
//
// One engine owns detection, classification, decision, execution, verification,
// and reporting (docs/DECISIONS.md BB-004). It is awaited: the caller must load
// settings before invoking it. The pipeline is pure with respect to its inputs
// (a `probe`, the resolved `settings`, and a `session` guard object) so its
// state transitions and — critically — its refusals are unit tested directly.
//
// Hard rules enforced here:
//   * A banner receives at most ONE planned action per session.
//   * Unknown or sensitive dialogs receive NO action.
//   * Success is recorded only after a supported control is clicked AND the
//     adapter postcondition verifies. There is no DOM-removal success path.

import { detectAdapter, ADAPTERS } from './cmp-adapters.js';
import { classifyDialog, CLASS } from './classify.js';

export const OUTCOME = Object.freeze({
  DISABLED: 'disabled',
  DUPLICATE: 'duplicate',
  NO_DIALOG: 'no-dialog',
  SENSITIVE: 'sensitive',
  UNKNOWN: 'unknown',
  UNSUPPORTED_MODE: 'unsupported-mode',
  NO_CONTROL: 'no-control',
  UNVERIFIED: 'unverified',
  SUCCESS: 'success',
});

/** Outcomes that count as a completed action for stats purposes. */
export function outcomeToStat(outcome) {
  switch (outcome) {
    case OUTCOME.SUCCESS:
      return 'success';
    case OUTCOME.UNVERIFIED:
      return 'unverified';
    case OUTCOME.NO_CONTROL:
    case OUTCOME.UNSUPPORTED_MODE:
    case OUTCOME.UNKNOWN:
      return 'unsupported';
    case OUTCOME.SENSITIVE:
      return 'skipped';
    default:
      return null; // disabled / duplicate / no-dialog are not counted
  }
}

/** Create a fresh per-frame session guard. */
export function createSession() {
  return { handled: new Set(), inFlight: false };
}

async function pollVerify(adapter, probe, mode, { attempts, intervalMs }) {
  for (let i = 0; i < attempts; i++) {
    if (adapter.verify(probe, mode)) return true;
    if (i < attempts - 1 && typeof probe.delay === 'function') {
      await probe.delay(intervalMs);
    }
  }
  return false;
}

function inspectNonCmpDialogs(probe) {
  if (typeof probe.describeCandidates !== 'function') {
    return { class: CLASS.UNKNOWN, reason: null, found: false };
  }
  const candidates = probe.describeCandidates() || [];
  let sawUnknown = false;
  for (const descriptor of candidates) {
    const result = classifyDialog(descriptor);
    if (result.class === CLASS.SENSITIVE) {
      return { ...result, found: true };
    }
    if (result.class === CLASS.UNKNOWN) sawUnknown = true;
  }
  if (sawUnknown) return { class: CLASS.UNKNOWN, reason: null, found: true };
  return { class: CLASS.NO_DIALOG, reason: null, found: candidates.length > 0 };
}

/**
 * Run the pipeline once.
 *
 * @param {object} probe DOM/browser abstraction (see cmp-adapters.js)
 * @param {object} settings resolved settings ({ enabled, mode, ... })
 * @param {object} [options]
 * @param {object} [options.session] session guard from createSession()
 * @param {CmpAdapter[]} [options.adapters]
 * @param {number} [options.verifyAttempts]
 * @param {number} [options.verifyIntervalMs]
 * @returns {Promise<{outcome: string, cmp: string|null, mode: string|null,
 *   clicked: boolean, verified: boolean, reason: string|null}>}
 */
export async function runPipeline(probe, settings, options = {}) {
  const session = options.session || createSession();
  const adapters = options.adapters || ADAPTERS;
  const verifyAttempts = options.verifyAttempts ?? 8;
  const verifyIntervalMs = options.verifyIntervalMs ?? 250;

  const result = (outcome, extra = {}) => ({
    outcome,
    cmp: null,
    mode: null,
    clicked: false,
    verified: false,
    reason: null,
    ...extra,
  });

  if (!settings || settings.enabled === false) {
    return result(OUTCOME.DISABLED);
  }

  // Prevent competing/duplicate actions within this frame + session.
  if (session.inFlight) {
    return result(OUTCOME.DUPLICATE);
  }

  // ---- detect -----------------------------------------------------------
  const adapter = detectAdapter(probe, adapters);

  if (!adapter) {
    // No supported CMP. Never act; classify only for an honest local status.
    const inspection = inspectNonCmpDialogs(probe);
    if (inspection.class === CLASS.SENSITIVE) {
      return result(OUTCOME.SENSITIVE, { reason: inspection.reason });
    }
    if (inspection.class === CLASS.UNKNOWN && inspection.found) {
      return result(OUTCOME.UNKNOWN);
    }
    return result(OUTCOME.NO_DIALOG);
  }

  // A supported CMP was found. Guard against re-processing it this session.
  if (session.handled.has(adapter.id)) {
    return result(OUTCOME.DUPLICATE, { cmp: adapter.name });
  }

  const mode = settings.mode;

  // ---- decide -----------------------------------------------------------
  if (!adapter.supportsMode(mode)) {
    session.handled.add(adapter.id);
    return result(OUTCOME.UNSUPPORTED_MODE, { cmp: adapter.name, mode });
  }

  const control = adapter.control(mode, probe);
  if (!control) {
    // Fail closed: the intended control is missing. No generic fallback.
    session.handled.add(adapter.id);
    return result(OUTCOME.NO_CONTROL, { cmp: adapter.name, mode });
  }

  // ---- execute ----------------------------------------------------------
  session.inFlight = true;
  session.handled.add(adapter.id);
  try {
    probe.click(control);

    // ---- verify ---------------------------------------------------------
    const verified = await pollVerify(adapter, probe, mode, {
      attempts: verifyAttempts,
      intervalMs: verifyIntervalMs,
    });

    // ---- report ---------------------------------------------------------
    if (verified) {
      return result(OUTCOME.SUCCESS, { cmp: adapter.name, mode, clicked: true, verified: true });
    }
    return result(OUTCOME.UNVERIFIED, { cmp: adapter.name, mode, clicked: true, verified: false });
  } finally {
    session.inFlight = false;
  }
}
