// BannerBanner — Learn dashboard: character roster, memory browser, replays, preferences.

(function () {
  'use strict';

  const Bananers = self.BannerBannerBananers;
  let appState = { settings: {}, sites: [], kb: {}, roster: {} };

  // ------------------------------------------------------------------ helpers

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function relativeTime(ts) {
    if (!ts) return 'never';
    const diff = Date.now() - ts;
    const mins = Math.round(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  }

  function sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        void chrome.runtime.lastError;
        resolve(response);
      });
    });
  }

  // ------------------------------------------------------------------- tabs

  document.querySelectorAll('nav.tabs button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('nav.tabs button').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  if (new URLSearchParams(location.search).get('welcome') === 'true') {
    document.getElementById('welcome-banner').hidden = false;
  }

  // ------------------------------------------------------------------ roster

  function renderRoster() {
    const container = document.getElementById('roster');
    container.textContent = '';
    for (const character of Bananers.BANANER_CHARACTERS) {
      const stats = appState.roster[character.id] || { xp: 0, dismissals: 0, recalls: 0, fingerprints: 0 };
      const level = Bananers.getLevelForXp(stats.xp);
      const next = Bananers.BANANER_LEVELS.find((l) => l.minXp > stats.xp);
      const typeInfo = Bananers.BANNER_TYPE_LABELS[character.specialty];

      const card = el('div', 'character');
      card.appendChild(el('div', 'emoji', character.emoji));
      card.appendChild(el('div', 'name', character.name));
      card.appendChild(el('div', 'title', `${character.title} · ${typeInfo.emoji} ${typeInfo.label}`));
      card.appendChild(el('div', 'persona', character.personality));
      card.appendChild(el('div', 'catchphrase', `“${character.catchphrase}”`));
      card.appendChild(el('div', 'level', `Lv ${level.level} — ${level.name} (${stats.xp} XP)`));

      const bar = el('div', 'xp-bar');
      const fill = el('div');
      const span = next ? next.minXp - level.minXp : 1;
      const progress = next ? Math.min(100, Math.round(((stats.xp - level.minXp) / span) * 100)) : 100;
      fill.style.width = `${progress}%`;
      bar.appendChild(fill);
      card.appendChild(bar);

      const row = el('div', 'stats-row');
      const d = el('span');
      d.append('Dismissals: ');
      d.appendChild(el('b', null, String(stats.dismissals)));
      const f = el('span');
      f.append('Learned: ');
      f.appendChild(el('b', null, String(stats.fingerprints)));
      const r = el('span');
      r.append('Recalls: ');
      r.appendChild(el('b', null, String(stats.recalls)));
      row.append(d, f, r);
      card.appendChild(row);

      container.appendChild(card);
    }
  }

  // ---------------------------------------------------------- memory browser

  function renderMemories() {
    const container = document.getElementById('memories');
    container.textContent = '';
    const typeFilter = document.getElementById('filter-type').value;
    const hostFilter = document.getElementById('filter-host').value.trim().toLowerCase();

    const records = Object.values(appState.kb)
      .filter((r) => typeFilter === 'all' || r.bannerType === typeFilter)
      .filter((r) => !hostFilter || (r.hostname || '').toLowerCase().includes(hostFilter))
      .sort((a, b) => (b.stats?.lastSeenAt || 0) - (a.stats?.lastSeenAt || 0));

    if (!records.length) {
      container.appendChild(
        el('div', 'empty', 'No memories yet. Deploy a bananer on a popup-infested site and watch it learn! 🍌')
      );
      return;
    }

    const byType = new Map();
    for (const record of records) {
      const key = record.bannerType || 'unknown';
      if (!byType.has(key)) byType.set(key, []);
      byType.get(key).push(record);
    }

    for (const [type, group] of byType) {
      const typeInfo = Bananers.BANNER_TYPE_LABELS[type] || Bananers.BANNER_TYPE_LABELS.unknown;
      const groupEl = el('div', 'memory-group');
      groupEl.appendChild(el('h3', null, `${typeInfo.emoji} ${typeInfo.label} (${group.length})`));

      for (const record of group) {
        const character = Bananers.getBananerById(record.characterId) || Bananers.getBananerForType(type);
        const row = el('div', 'memory');
        row.appendChild(el('span', 'type-emoji', character.emoji));

        const info = el('div', 'info');
        info.appendChild(el('div', 'host', record.hostname || 'unknown site'));
        const strategy = record.dismissal?.buttonText
          ? `clicks “${record.dismissal.buttonText}”`
          : record.dismissal?.strategy === 'remove'
            ? 'peels it off the DOM'
            : record.dismissal?.strategy || 'unknown strategy';
        const stats = record.stats || {};
        info.appendChild(
          el(
            'div',
            'meta',
            `${strategy} · dismissed ${stats.timesDismissed || 0}× · fastest ${stats.fastestMs || '—'}ms · last seen ${relativeTime(stats.lastSeenAt)}`
          )
        );
        row.appendChild(info);

        const replayBtn = el('button', null, '▶ Replay');
        replayBtn.addEventListener('click', () => openReplay(record));
        row.appendChild(replayBtn);

        const forgetBtn = el('button', 'forget', '🗑 Forget');
        forgetBtn.addEventListener('click', async () => {
          await sendMessage({ type: 'BANANER_FORGET', id: record.id });
          delete appState.kb[record.id];
          renderMemories();
        });
        row.appendChild(forgetBtn);

        groupEl.appendChild(row);
      }
      container.appendChild(groupEl);
    }
  }

  document.getElementById('filter-type').addEventListener('change', renderMemories);
  document.getElementById('filter-host').addEventListener('input', renderMemories);
  document.getElementById('forget-all').addEventListener('click', async () => {
    await sendMessage({ type: 'BANANER_FORGET_ALL' });
    appState.kb = {};
    renderMemories();
  });

  // ----------------------------------------------------------------- replays

  let replayTimers = [];

  function clearReplay() {
    replayTimers.forEach(clearTimeout);
    replayTimers = [];
    document.getElementById('replay-backdrop').classList.remove('open');
  }

  function openReplay(record) {
    replayTimers.forEach(clearTimeout);
    replayTimers = [];

    const character = Bananers.getBananerById(record.characterId) || Bananers.getBananerForType(record.bannerType);
    const typeInfo = Bananers.BANNER_TYPE_LABELS[record.bannerType] || Bananers.BANNER_TYPE_LABELS.unknown;

    document.getElementById('replay-title').textContent = `${character.emoji} ${character.name} vs. ${record.hostname}`;
    document.getElementById('replay-sub').textContent =
      `${typeInfo.emoji} ${typeInfo.label} · strategy: ${record.dismissal?.strategy || 'unknown'} · reenactment of the recorded takedown`;

    const arena = document.getElementById('replay-arena');
    arena.textContent = '';
    const log = document.getElementById('replay-log');
    log.textContent = '';

    // Mock popup reconstruction.
    const popup = el('div', 'mock-popup');
    popup.appendChild(el('div', 'mock-title', `${typeInfo.emoji} ${typeInfo.label}`));
    popup.appendChild(
      el('div', 'mock-body', `A stand-in for the real popup (${record.selector || 'no selector recorded'}).`)
    );
    const buttonRow = el('div');
    if (record.dismissal?.buttonText) {
      buttonRow.appendChild(el('span', 'mock-btn target', record.dismissal.buttonText));
      buttonRow.appendChild(el('span', 'mock-btn', 'Some other button'));
    } else {
      buttonRow.appendChild(el('span', 'mock-btn', 'No usable button — peeled off instead'));
    }
    popup.appendChild(buttonRow);
    arena.appendChild(popup);

    const bananer = el('div', 'replay-bananer', character.emoji);
    arena.appendChild(bananer);

    document.getElementById('replay-backdrop').classList.add('open');

    // Walk in, then act out each recorded step with readable pacing.
    replayTimers.push(setTimeout(() => {
      bananer.style.left = 'calc(100% - 320px)';
      bananer.style.bottom = '40px';
    }, 150));

    const steps = record.steps && record.steps.length ? record.steps : [{ at: 0, action: 'dismissed', detail: 'No steps recorded for this memory.' }];
    let t = 700;
    for (const step of steps) {
      replayTimers.push(
        setTimeout(() => {
          const line = el('div', 'step');
          const time = el('span', 't', `${String(step.at).padStart(4, ' ')}ms`);
          line.appendChild(time);
          line.append(step.detail);
          log.appendChild(line);
          log.scrollTop = log.scrollHeight;
          if (step.action === 'dismissed' || step.action === 'done' || step.action === 'suppressed') {
            popup.classList.add('dismissed');
          }
        }, t)
      );
      t += 900;
    }
  }

  document.getElementById('replay-close').addEventListener('click', clearReplay);
  document.getElementById('replay-backdrop').addEventListener('click', (e) => {
    if (e.target === document.getElementById('replay-backdrop')) clearReplay();
  });

  // ---------------------------------------------------------------- settings

  const SETTING_DEFS = [
    { key: 'enabled', label: 'Bananers enabled', desc: 'Master switch for the whole crew.' },
    { key: 'autoDismiss', label: 'Auto-deploy on opted-in sites', desc: 'Dismiss popups automatically. Off = only when you deploy from the toolbar.' },
    { key: 'showCharacter', label: 'Show the bananer character', desc: 'Watch the investigation on-page. Off = silent, instant dismissals.' },
    { key: 'showCaptions', label: 'Educational captions', desc: 'Speech bubbles explaining each investigation step.' },
    { key: 'preemptiveSuppression', label: 'Pre-paint suppression', desc: 'Hide popups the bananers already know before they can even render.' },
  ];

  function renderSettings() {
    const container = document.getElementById('settings');
    container.textContent = '';
    for (const def of SETTING_DEFS) {
      const row = el('div', 'setting');
      const text = el('div');
      text.appendChild(el('div', 'label', def.label));
      text.appendChild(el('div', 'desc', def.desc));
      row.appendChild(text);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = appState.settings[def.key] !== false;
      checkbox.addEventListener('change', async () => {
        appState.settings[def.key] = checkbox.checked;
        await sendMessage({ type: 'BANANER_SET_SETTINGS', settings: { [def.key]: checkbox.checked } });
      });
      row.appendChild(checkbox);
      container.appendChild(row);
    }
  }

  function renderSites() {
    const container = document.getElementById('sites');
    container.textContent = '';
    if (!appState.sites.length) {
      container.appendChild(el('div', 'empty', 'No sites yet — open the toolbar popup on a site and deploy a bananer.'));
      return;
    }
    for (const origin of appState.sites) {
      const row = el('div', 'site-row');
      row.appendChild(el('span', null, origin));
      const btn = el('button', null, 'Recall bananers');
      btn.addEventListener('click', async () => {
        const response = await sendMessage({ type: 'BANANER_SITE_REMOVED', origin });
        appState.sites = response?.sites || appState.sites.filter((s) => s !== origin);
        renderSites();
      });
      row.appendChild(btn);
      container.appendChild(row);
    }
  }

  // ------------------------------------------------------------------- boot

  async function load() {
    const state = await sendMessage({ type: 'BANANER_GET_STATE' });
    if (state) appState = state;
    renderRoster();
    renderMemories();
    renderSettings();
    renderSites();
  }

  load();
})();
