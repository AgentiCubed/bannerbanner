// Optional banana celebration — shown ONLY after a verified consent success.
//
// Safety invariant (docs/DECISIONS.md BB-009): the celebration is a post-result
// observer. It cannot delay or substitute for the consent operation, and it is
// only ever invoked by the content runtime once the pipeline has returned a
// verified SUCCESS outcome. It performs no page mutation beyond a self-removing
// overlay and respects prefers-reduced-motion.

const OVERLAY_ID = 'bannerbanner-celebration';

export function celebrate(win = window, doc = document) {
  try {
    if (win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (doc.getElementById(OVERLAY_ID) || !doc.body) return;

    const container = doc.createElement('div');
    container.id = OVERLAY_ID;
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;overflow:hidden;';

    const banana = doc.createElement('div');
    banana.textContent = '🍌';
    banana.style.cssText =
      'position:absolute;top:12%;left:-10%;font-size:44px;filter:drop-shadow(2px 2px 4px rgba(0,0,0,0.3));animation:bb-zip 2.6s ease-in-out forwards;';

    const style = doc.createElement('style');
    style.textContent =
      '@keyframes bb-zip{0%{left:-10%;transform:rotate(0)}100%{left:110%;transform:rotate(360deg)}}';

    container.appendChild(banana);
    doc.body.appendChild(container);
    doc.head.appendChild(style);

    win.setTimeout(() => {
      container.remove();
      style.remove();
    }, 3000);
  } catch {
    // Celebration is best-effort; a failure here must never affect consent.
  }
}
