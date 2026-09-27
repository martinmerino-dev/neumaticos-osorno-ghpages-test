// ============================================================================
// ANALYTICS (Google Analytics 4) + CONSENT ARCHITECTURE
// ============================================================================
// Configuration: set PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX in the build
// environment (see .env.example). BaseLayout validates it and exposes it as
// <html data-ga-id>. Without a valid ID this module never loads anything and
// every track() call is a no-op.
//
// Consent (Google Consent Mode, BASIC implementation):
//   - on every page load all consent types default to "denied"
//   - gtag.js is NOT requested at all until analytics consent is granted,
//     so nothing reaches Google before that (no cookieless pings either)
//   - window.nosConsent is the hook for the privacy phase's consent UI:
//       nosConsent.grantAnalytics()  -> stores the choice, updates consent,
//                                       loads GA4
//       nosConsent.denyAnalytics()   -> stores the choice, updates consent
//       nosConsent.getAnalytics()    -> "granted" | "denied" | null
//   - the choice is remembered in localStorage (key below)
//   - ad_storage / ad_user_data / ad_personalization stay denied: the site
//     runs no advertising
// This is technical plumbing only. It does not by itself make the site
// compliant with any privacy law - the consent UX, texts and policy are
// the privacy phase's job.
//
// Events: only meaningful business interactions, with fixed labels as
// parameters. NEVER personal data: no names, emails, phone numbers, form
// contents or WhatsApp message text are ever sent (link URLs are not sent
// either, because tel:/mailto:/wa.me links contain them).
//   whatsapp_click      {link_location, product_model?}
//   phone_click         {link_location}
//   email_click         {link_location}
//   directions_click    {link_location, map_action: "directions"|"view_map"}
//   contact_form_submit {form_name}
//   select_model        {product_brand, product_model, link_location}
//   select_brand        {product_brand, link_location}
//   cta_click           {cta_name, link_location}
// ============================================================================

const STORAGE_KEY = "nos-consent-analytics";

let measurementId;
let gaLoaded = false;

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

function readChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeChoice(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable (private mode etc.): the choice lasts this page view.
  }
}

function loadGa() {
  if (gaLoaded || !measurementId) return;
  gaLoaded = true;
  gtag("js", new Date());
  gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

const consent = {
  grantAnalytics() {
    storeChoice("granted");
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGa();
  },
  denyAnalytics() {
    storeChoice("denied");
    gtag("consent", "update", { analytics_storage: "denied" });
  },
  getAnalytics() {
    return readChoice();
  },
};

/** Send an event - only if GA is configured, consented and loaded. */
export function track(name, params = {}) {
  if (!measurementId || !gaLoaded || readChoice() !== "granted") return;
  gtag("event", name, params);
}

// Where on the page a click happened, as a fixed label.
function locationOf(el) {
  const explicit = el.closest("[data-track-location]");
  if (explicit) return explicit.dataset.trackLocation;
  if (el.closest(".whatsapp-button")) return "floating_button";
  if (el.closest("header")) return "navbar";
  if (el.closest("footer")) return "footer";
  return el.closest("section[id]")?.id ?? "page";
}

function onClick(event) {
  const link = event.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  const link_location = locationOf(link);
  const explicit = link.dataset.track;

  if (explicit === "directions_click") {
    track("directions_click", { link_location, map_action: link.dataset.trackMapAction || "directions" });
  } else if (explicit === "cta_click") {
    track("cta_click", { cta_name: link.dataset.trackCta || "cta", link_location });
  } else if (href.startsWith("https://wa.me/")) {
    const params = { link_location };
    if (link.dataset.trackModel) params.product_model = link.dataset.trackModel;
    track("whatsapp_click", params);
  } else if (href.startsWith("tel:")) {
    track("phone_click", { link_location });
  } else if (href.startsWith("mailto:")) {
    track("email_click", { link_location });
  }
}

export function initAnalytics() {
  // The consent API exists even without an ID, so the privacy UI can be
  // built and tested independently.
  window.nosConsent = consent;

  measurementId = document.documentElement.dataset.gaId;
  if (!measurementId) return;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  if (readChoice() === "granted") consent.grantAnalytics();

  document.addEventListener("click", onClick, { capture: true });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-track-form]");
    if (form) track("contact_form_submit", { form_name: form.dataset.trackForm });
  });

  // Product interactions, announced by the showroom / rail scripts.
  document.addEventListener("nos:model-select", (event) => {
    const { brand, model, location } = event.detail;
    track("select_model", { product_brand: brand, product_model: model, link_location: location });
  });
  document.addEventListener("nos:brand-select", (event) => {
    const { brand, location } = event.detail;
    track("select_brand", { product_brand: brand, link_location: location });
  });
}
