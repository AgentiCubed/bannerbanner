// Bananers — shared character roster definitions.
// Loaded as a content script (before bananer.js) and by the popup/Learn dashboard pages.

(function (global) {
  'use strict';

  const BANANER_CHARACTERS = [
    {
      id: 'peelock',
      name: 'Peelock Holmes',
      emoji: '🍌🔍',
      title: 'Consent Detective',
      specialty: 'cookie-consent',
      personality: 'Methodical sleuth who reads every cookie clause twice.',
      catchphrase: 'Elementary, my dear popup.',
    },
    {
      id: 'scoop',
      name: 'Scoop',
      emoji: '🍌📰',
      title: 'Newsletter Negotiator',
      specialty: 'newsletter',
      personality: 'Fast-talking reporter who politely declines every subscription pitch.',
      catchphrase: 'Thanks, but I already have a-peeling sources.',
    },
    {
      id: 'splat',
      name: 'Splat',
      emoji: '🍌🥋',
      title: 'Overlay Wrangler',
      specialty: 'ad-overlay',
      personality: 'Black-belt in banner-jitsu. Chops ad overlays clean off the page.',
      catchphrase: 'Hi-yah! Back to the DOM you go.',
    },
    {
      id: 'professor-nana',
      name: 'Professor Nana',
      emoji: '🍌🎓',
      title: 'Popup Scholar',
      specialty: 'unknown',
      personality: 'Curious academic who studies popups nobody has classified yet.',
      catchphrase: 'Fascinating specimen! Let us take it apart.',
    },
  ];

  const BANANER_LEVELS = [
    { level: 1, name: 'Green Sprout', minXp: 0 },
    { level: 2, name: 'Ripe Rookie', minXp: 50 },
    { level: 3, name: 'Golden Guardian', minXp: 150 },
    { level: 4, name: 'Legendary Peel', minXp: 400 },
  ];

  const BANNER_TYPE_LABELS = {
    'cookie-consent': { label: 'Cookie Consent', emoji: '🍪' },
    'newsletter': { label: 'Newsletter Interstitial', emoji: '📧' },
    'ad-overlay': { label: 'Ad Overlay', emoji: '📢' },
    'unknown': { label: 'Mystery Popup', emoji: '❓' },
  };

  function getBananerForType(bannerType) {
    return (
      BANANER_CHARACTERS.find((c) => c.specialty === bannerType) ||
      BANANER_CHARACTERS.find((c) => c.specialty === 'unknown')
    );
  }

  function getBananerById(id) {
    return BANANER_CHARACTERS.find((c) => c.id === id) || null;
  }

  function getLevelForXp(xp) {
    let current = BANANER_LEVELS[0];
    for (const lvl of BANANER_LEVELS) {
      if (xp >= lvl.minXp) current = lvl;
    }
    return current;
  }

  global.BannerBannerBananers = {
    BANANER_CHARACTERS,
    BANANER_LEVELS,
    BANNER_TYPE_LABELS,
    getBananerForType,
    getBananerById,
    getLevelForXp,
  };
})(typeof self !== 'undefined' ? self : globalThis);
