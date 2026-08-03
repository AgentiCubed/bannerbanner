// BannerBanner content-script bootstrap.
//
// Registered dynamically (chrome.scripting.registerContentScripts) only for
// origins the user has explicitly authorized. This tiny classic script exists
// solely to load the ES-module runtime, which imports the shared, unit-tested
// lib modules. Keeping the shared logic in modules means the exact code that is
// tested is the code that ships.

(async () => {
  try {
    const url = chrome.runtime.getURL('lib/content-runtime.js');
    const { startContentRuntime } = await import(url);
    await startContentRuntime(window, document);
  } catch (error) {
    // Fail closed and quietly: if the runtime cannot load, do nothing to the
    // page rather than fall back to any generic behavior.
    console.debug('[BannerBanner] content runtime did not start:', error);
  }
})();
