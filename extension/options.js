// BannerBanner options page.
//
// Reads and writes the versioned settings in chrome.storage via the service
// worker so there is exactly one write path (PB-07). Shows only shipped v0.1
// capabilities: the two consent modes, per-site list, bounded local stats, and
// reset. No training, sharing, or other deferred features appear here.

const els = {
  mode: document.getElementById('mode'),
  enabled: document.getElementById('enabled'),
  celebrate: document.getElementById('celebrate'),
  saved: document.getElementById('saved'),
  origins: document.getElementById('origins'),
  originsEmpty: document.getElementById('origins-empty'),
  statSuccess: document.getElementById('stat-success'),
  statUnsupported: document.getElementById('stat-unsupported'),
  statUnverified: document.getElementById('stat-unverified'),
  reset: document.getElementById('reset'),
};

function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      void chrome.runtime.lastError;
      resolve(response);
    });
  });
}

let savedTimer = null;
function flashSaved() {
  els.saved.textContent = 'Saved';
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => (els.saved.textContent = ''), 1500);
}

function renderOrigins(origins) {
  els.origins.textContent = '';
  els.originsEmpty.style.display = origins.length ? 'none' : 'block';
  for (const origin of origins) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = origin;
    const btn = document.createElement('button');
    btn.textContent = 'Disable';
    btn.addEventListener('click', async () => {
      await sendMessage({ type: 'BB_REVOKE_ORIGIN', origin });
      refresh();
    });
    li.append(span, btn);
    els.origins.appendChild(li);
  }
}

async function refresh() {
  const state = await sendMessage({ type: 'BB_GET_STATE' });
  if (!state) return;
  els.mode.value = state.settings.mode;
  els.enabled.checked = state.settings.enabled;
  els.celebrate.checked = state.settings.celebrate;
  renderOrigins(state.origins);
  els.statSuccess.textContent = state.stats.totals.success;
  els.statUnsupported.textContent = state.stats.totals.unsupported;
  els.statUnverified.textContent = state.stats.totals.unverified;
}

async function patch(fields) {
  await sendMessage({ type: 'BB_SET_SETTINGS', patch: fields });
  flashSaved();
}

els.mode.addEventListener('change', () => patch({ mode: els.mode.value }));
els.enabled.addEventListener('change', () => patch({ enabled: els.enabled.checked }));
els.celebrate.addEventListener('change', () => patch({ celebrate: els.celebrate.checked }));
els.reset.addEventListener('click', async () => {
  await sendMessage({ type: 'BB_RESET_SETTINGS' });
  flashSaved();
  refresh();
});

refresh();
