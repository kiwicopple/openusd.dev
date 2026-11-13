/* Basic consent-gated GA4: no Google request is made before an opt-in. */
(() => {
  const measurementId = document.currentScript?.dataset.measurementId || '';
  if (location.hostname !== 'openusd.dev' || !/^G-[A-Z0-9]+$/.test(measurementId)) return;

  const banner = document.getElementById('analytics-consent');
  const settings = document.getElementById('analytics-settings');
  const accept = document.getElementById('analytics-accept');
  const decline = document.getElementById('analytics-decline');
  const close = document.getElementById('analytics-close');
  const status = document.getElementById('analytics-consent-status');
  if (!banner || !settings || !accept || !decline || !close || !status) return;

  const storageKey = 'openusd-analytics-consent-v1';
  const consentLifetime = 180 * 24 * 60 * 60 * 1000;
  const disableKey = `ga-disable-${measurementId}`;
  let started = false;
  let rememberedChoice = null;
  let fromSettings = false;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      return saved && ['granted', 'denied'].includes(saved.choice) &&
        Number.isFinite(saved.expires) && saved.expires > Date.now() ? saved.choice : null;
    } catch { return null; }
  }

  function writeChoice(choice) {
    rememberedChoice = choice;
    try { localStorage.setItem(storageKey, JSON.stringify({ choice, expires: Date.now() + consentLifetime })); }
    catch { /* With unavailable storage, consent applies only to this page. */ }
  }

  function showBanner(show, focus = false) {
    banner.hidden = !show;
    settings.setAttribute('aria-expanded', String(show));
    close.hidden = !rememberedChoice;
    status.textContent = rememberedChoice === 'granted' ? 'Analytics is currently on.' :
      rememberedChoice === 'denied' ? 'Analytics is currently off.' : '';
    if (show && focus) decline.focus();
  }

  function clearAnalyticsCookies() {
    for (const entry of document.cookie.split(';')) {
      const name = entry.trim().split('=')[0];
      if (name !== '_ga' && !name.startsWith('_ga_')) continue;
      for (const domain of ['', '; domain=openusd.dev', '; domain=.openusd.dev']) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax; Secure`;
      }
    }
  }

  function startAnalytics() {
    if (started) return;
    started = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    let referrer = '';
    try { if (document.referrer) referrer = new URL(document.referrer).origin + '/'; } catch {}
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: referrer,
      cookie_domain: 'openusd.dev',
      cookie_expires: consentLifetime / 1000,
      cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    const tag = document.createElement('script');
    tag.id = 'openusd-google-tag';
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }

  function stopAnalytics() {
    window[disableKey] = true;
    clearAnalyticsCookies();
    // A reload removes the already-loaded library and any queued activity.
    if (started) location.reload();
  }

  accept.addEventListener('click', () => {
    writeChoice('granted');
    startAnalytics();
    showBanner(false);
    if (fromSettings) settings.focus();
  });
  decline.addEventListener('click', () => {
    writeChoice('denied');
    showBanner(false);
    stopAnalytics();
    if (fromSettings && !started) settings.focus();
  });
  settings.addEventListener('click', () => { fromSettings = true; showBanner(true, true); });
  close.addEventListener('click', () => { showBanner(false); settings.focus(); });
  banner.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && rememberedChoice) { showBanner(false); settings.focus(); }
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    rememberedChoice = readChoice();
    if (rememberedChoice === 'granted') startAnalytics();
    else stopAnalytics();
    showBanner(!rememberedChoice);
  });

  settings.hidden = false;
  rememberedChoice = readChoice();
  showBanner(!rememberedChoice);
  if (rememberedChoice === 'granted') startAnalytics();
  else { window[disableKey] = true; clearAnalyticsCookies(); }
})();
