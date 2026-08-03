// Shared fixture sentinel: records ANY interaction or mutation so specs can
// prove BannerBanner performed no click, removal, hiding, style mutation, or
// synthetic event on protected dialogs.
window.__clicked = [];
window.__mutations = 0;

for (const el of document.querySelectorAll('button, a, input')) {
  el.addEventListener('click', () => {
    window.__clicked.push(el.id || el.textContent || el.tagName);
  });
}

const dialog = document.querySelector('[role="dialog"], [aria-modal="true"], #promo-overlay');
if (dialog) {
  window.__dialogHTML = dialog.outerHTML;
  new MutationObserver((records) => {
    window.__mutations += records.length;
  }).observe(dialog, { attributes: true, childList: true, subtree: true, characterData: true });
}
