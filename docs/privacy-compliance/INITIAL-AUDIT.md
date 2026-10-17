# Neumáticos Osorno — Initial Privacy/Data-Processing Audit

**Status:** Phase 1 (audit only). No policy text, consent banner, or production
change has been implemented from this audit yet.
**Scope:** Technical audit of the repository and the live site. This is not a
legal opinion and does not establish compliance with Law 21.719 by itself.
**Date:** 2026-10-17
**Audited by:** Claude (AI assistant), from repository inspection and a
read-only check of the live site's HTTP response headers. Nothing outside the
repository/public HTTP responses was accessed (no hosting dashboards, no DNS
registrar, no Web3Forms/Google account access).

Every fact below is labelled **VERIFIED** (directly observed in the repo or
in the live site's public HTTP response) or **UNKNOWN** (cannot be
determined from the repository; needs the business owner or a GitHub/DNS
account holder to confirm). Nothing in this document should be read as
"confirmed compliant."

---

## 0. Two codebases exist, in two very different states

| | **Live production site** | **`redesign/2027` branch** |
|---|---|---|
| Served at `neumaticososorno.cl`? | **Yes**, right now | No — not deployed |
| Branch | `main` | `redesign/2027` (pushed to `origin`, not merged) |
| Stack | Static HTML/CSS/vanilla JS (root of repo) | Astro 7, static output |
| Contact form | **Active** — collects name/email/message, posts to Web3Forms | **Removed** (owner's explicit decision, this session) |
| Privacy policy | None | None |

This matters because **the most exposed data-processing activity found in
this audit (the active contact form) is on the branch that is currently
live**, not on the one being redesigned. The redesign already fixes it, but
that fix isn't in production yet.

---

## 1. Live production site (`main`, served at neumaticososorno.cl)

**VERIFIED** (grepped every root HTML file and `assets/js/script.js`):

- 5 static pages: `index.html`, `maxxis.html`, `neumaticos.html`,
  `neumaticos_agricolas.html`, `contacto.html`.
- `contacto.html` has an active `<form>`:
  - Fields: `name` (text), `email` (email), `message` (textarea) — all
    `required`.
  - `action="https://api.web3forms.com/submit"`, `method="POST"`.
  - Hidden field `access_key` with a plaintext value
    (`22d01891-4d79-4f86-9516-802ce4d272a3`) committed in the HTML.
    Web3Forms access keys are *designed* to be public/client-side (this is
    documented in `AGENTS.md`), so this is not a credential leak in the
    usual sense — but it does mean anyone can read the key from page
    source, and the form currently has no CAPTCHA/rate-limit indication
    visible in the markup.
  - **No privacy notice, consent checkbox, or link to any policy anywhere
    near this form.**
- Floating WhatsApp link: `https://wa.me/56981898985`, no prefilled text,
  no personal data in the URL.
- Footer (every page): two phone numbers as plain text
  (`+56 9 7837 9233`, `+56 9 8189 8985`) and `contacto@neumaticososorno.cl`
  as plain text (not even a `mailto:` link on the legacy site).
- `assets/js/script.js`: 38 lines, hamburger menu + accordion toggles only.
  No `fetch`, no `XMLHttpRequest`, no cookies, no `localStorage`.
- No Google Analytics, Google Tag Manager, Meta/Facebook Pixel, or any
  other analytics/advertising script in any of the 5 pages (grepped for
  `gtag`, `googletagmanager`, `google-analytics`, `fbq`, `pixel`, `cookie`,
  `localStorage` across all legacy HTML + JS — zero matches outside the
  Web3Forms form itself).
- Google Fonts loaded from `fonts.googleapis.com` / an implicit
  `fonts.gstatic.com` font-file request (every page's `<head>`).
- `robots.txt`: `Allow: /` (everything crawlable). `sitemap.xml`: lists all
  5 URLs, last modified 2025-06-23.

**Data categories actually collected by the live site today:** name, email
address, and free-text message content, submitted voluntarily through the
contact form to Web3Forms (a third party). Everything else on the site
(phone numbers, email, address context) is the business's own published
contact information, not data collected *from* visitors.

---

## 2. `redesign/2027` branch (not deployed)

**VERIFIED** (full `src/` tree read; grepped for `localStorage`,
`sessionStorage`, `document.cookie`, `fetch(`, `XMLHttpRequest` across every
`.js`/`.astro` file):

- **No contact form anywhere.** Confirmed removed in this session
  (commit `a47d19f`); re-confirmed now by grep — no `<form>`, no
  `action=`, no Web3Forms reference left in `src/`.
- **The only file in the entire `src/` tree that touches browser storage
  or makes network requests is `src/scripts/analytics.js`.** Nothing else
  does.
- Contact surfaces: WhatsApp (floating button, hero CTA, nav panel,
  Contacto channel list — all static `wa.me` links, a few with a static,
  business-authored prefilled message, e.g. *"Hola, quiero consultar por
  el neumático Maxxis AT811 RAZR."* — product names only, **never**
  visitor-entered data), two `tel:` phone links, one `mailto:` email link
  (footer only, by design — see the previous turn's change).
- **Google Analytics 4 (GA4):** scaffolding exists in
  `src/scripts/analytics.js` + `BaseLayout.astro`, but:
  - It only activates if `PUBLIC_GA_MEASUREMENT_ID` is set at build time.
  - **Verified**: no `.env` file exists in the working tree (only the
    template `.env.example`, with the value left blank) and no CI/Actions
    workflow exists either — so **in the current build, GA4 is
    completely inactive**: no `gtag.js` request, no `dataLayer` sent
    anywhere, `<html data-ga-id>` attribute is omitted entirely.
  - Even if the ID were set, GA4 defaults Consent Mode to `denied` and
    stays denied, because **no consent-banner UI exists yet** — the code
    exposes `window.nosConsent.grantAnalytics()`/`denyAnalytics()` for a
    future banner to call, but nothing currently calls them. Verified by
    grepping the whole `src/` tree for every call site: only the
    (currently dead) self-check inside `analytics.js` itself.
  - Ad-related consent signals (`ad_storage`, `ad_user_data`,
    `ad_personalization`) are hard-coded to `denied`, always. The site
    runs no advertising/remarketing of any kind.
  - Event tracking, if ever active, is designed to send fixed labels only
    (`whatsapp_click`, `phone_click`, `directions_click`, etc.) — the code
    explicitly never sends link URLs, names, emails, phone numbers, or
    message text, because `tel:`/`mailto:`/`wa.me` hrefs *contain*
    personal data and are deliberately excluded from any event payload.
- **Google Maps embed** (`ContactSection.astro`, `#contacto`): a lazy-loaded
  `<iframe>` showing the business address. Uses Google's keyless embed URL
  by default (`PUBLIC_GOOGLE_MAPS_EMBED_KEY` unset, verified), or the
  official Maps Embed API if that key is ever set. Loading it causes the
  visitor's browser to make a direct request to Google (IP address
  disclosed to Google) once the Contacto section scrolls into view.
- **Google Fonts** (Archivo), loaded the same way as the legacy site.
- **Structured data** (JSON-LD, `BaseLayout.astro`): embeds business name,
  first phone number, email, address, and hours as machine-readable
  metadata for search engines. This duplicates information already
  visibly printed on the page — it is not additional data collection.
- No cookies are set anywhere in the codebase (grepped `document.cookie` —
  zero matches). The only browser storage write in the whole site is the
  (currently never-triggered) `localStorage` key `nos-consent-analytics`
  in `analytics.js`.
- No backend, no database, no API routes, no server functions, no GitHub
  Actions workflow exist in the repository (`astro.config.mjs` has no
  adapter/integration; `find .github` returns nothing).
- `package.json` direct dependencies: `astro`, `gsap` only. `sharp` is
  used by Astro's image pipeline at **build time only** (never shipped to
  the browser). `playwright` is used ad hoc (not a dependency) to generate
  the social-share image and for this session's own QA screenshots.

**Data categories collected by `redesign/2027` today:** none, by default.
If `PUBLIC_GA_MEASUREMENT_ID` is ever set *and* a consent banner is built
and the visitor opts in, GA4 would then collect standard web-analytics
data (page views, device/browser info, approximate location from IP) under
Google's own processing terms — but none of that is active in the current
build.

---

## 3. Hosting, DNS, HTTPS, security headers

**VERIFIED** (via `curl -I` against the live domain, read-only, no changes
made):

- `https://neumaticososorno.cl/` → `200 OK`, served by `Server: GitHub.com`
  via a Fastly-backed CDN (`Via: varnish`, edge node observed:
  `cache-syd10166-SYD`, i.e. Sydney — illustrating that GitHub Pages'
  global CDN does not keep traffic within Chile or Latin America; the
  actual edge node a given visitor hits depends on their own location and
  GitHub's routing, not something this repo controls).
- **`http://neumaticososorno.cl/` (no `s`) also returns `200 OK` directly —
  it does not redirect to HTTPS.** This means "Enforce HTTPS" is
  currently **off** in the GitHub Pages settings for this custom domain.
  Anyone who types `http://` or follows an old `http://` link gets an
  unencrypted connection. This is a one-checkbox setting in the repo's
  GitHub Pages configuration — outside what this audit can change (see
  `AGENTS.md`: agents never touch GitHub Pages settings).
- No `Strict-Transport-Security`, `Content-Security-Policy`,
  `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy` header
  is present on either the HTTP or HTTPS response. This is consistent with
  a known GitHub Pages limitation: it does not support custom response
  headers without adding a layer in front (e.g. Cloudflare), which is a
  hosting-architecture decision, not a quick fix.
- `CNAME` file: `neumaticososorno.cl` (just states the custom domain to
  Pages). Actual DNS records, registrar, and WHOIS/registrant details are
  **UNKNOWN** — not visible from the repository.
- GitHub Pages' own access-log retention/availability to the site owner is
  a GitHub account-level matter, **UNKNOWN** from this repo.

---

## 4. Dependency/build security (not visitor-facing)

**VERIFIED** (`npm audit --omit=dev`): 4 known advisories (1 moderate, 3
high) — `http-cache-semantics`, `sharp <0.35.5`, `smol-toml`,
`source-map-js`. All four are **transitive build-tooling dependencies**
(Vite/Astro internals and the build-time image processor); none of them
ship code to the visitor's browser, so this is a build-environment hygiene
item, not a visitor data-protection risk. Fixable with `npm audit fix` —
not run yet (left as a Phase 6 recommendation, see below, since it's
tangential to this audit's core scope and should be tested separately).

No `.env` file (or any file containing a real secret) has ever been
committed to git history (checked `git log --all -p -- '*.env*'` — only
the blank `.env.example` template was ever committed). `.gitignore`
correctly excludes `.env`/`.env.*`.

---

## 5. Categories of personal data, by source

| Data | Where | Currently active? |
|---|---|---|
| Name, email, free-text message | Live site's Web3Forms contact form | **Yes, on production, right now** |
| IP address (implicit in any HTTP request) | Every visit, to GitHub Pages/Fastly | Yes, always (any website) |
| IP address | To Google, when Google Fonts load | Yes, on both the live site and `redesign/2027` |
| IP address | To Google, when the Maps iframe loads | Only on `redesign/2027` (not live yet), and only if the visitor scrolls to Contacto |
| Standard web-analytics data (page views, device, approximate location) | Google Analytics 4 | **No** — inactive on both, see §2 |
| Anything typed into a contact form | `redesign/2027` | **No** — form removed |

No employee data, no payment data, no account/login data, and no data
beyond the above was found anywhere in either codebase.

---

## 6. Processing purposes and proposed legal bases (FOR LEGAL VALIDATION — not a legal conclusion)

These are starting points for a Chilean privacy lawyer to confirm against
Law 21.719, not a determination:

| Processing | Proposed purpose | Proposed basis (to validate) |
|---|---|---|
| Live contact form submission | Respond to a customer inquiry | Consent / pre-contractual steps at the data subject's own initiative (Art. 12–13 candidates) |
| WhatsApp conversations initiated by a visitor | Respond to a customer inquiry | Same as above — but WhatsApp's own processing/retention is **Meta's**, not something this site controls |
| Google Fonts / Maps IP disclosure | Render the page / show a map | Legitimate interest in providing the requested page — but whether that's an adequate basis, and whether it needs disclosure, is a legal question |
| GA4 (if ever enabled) | Understand site usage | Consent (already built as consent-gated; the open question is whether the *mechanism* meets the law's transparency/granularity requirements once a banner exists) |

---

## 7. Unknown business information

This audit can only see the website. It cannot determine:

- The legal business name, RUT, and legal representative.
- Whether the business is a constituted company or an individual
  ("persona natural con giro").
- Whether the public shop address (Av. Juan Mackenna 1917, used in the
  footer/Contacto/structured data) is also the legal/fiscal address for
  data-controller identification purposes.
- Whether `contacto@neumaticososorno.cl` is actively monitored and
  suitable as the privacy-request contact point, or whether a different
  address should be used for that specific purpose.
- Whether customer data is kept **outside** the website at all — e.g.
  WhatsApp Business chat history/contacts, an invoicing or POS system, a
  supplier/customer ledger, SII records, or similar. The audit found
  nothing website-side, but the business almost certainly processes
  customer data through these other channels, and Law 21.719 would apply
  to those too — that's entirely outside this repository's visibility.
- Who has administrative access to the GitHub repository/Pages settings,
  the domain registrar/DNS, and the Web3Forms account.
- Web3Forms' own data handling: which plan/account, their retention
  period, their hosting jurisdiction, and whether any data-processing
  agreement exists or is needed.
- Whether GA4 is actually intended to go live at some point, which
  changes what (if anything) the eventual privacy policy needs to say
  about analytics.

A consolidated, fillable checklist of everything above is in
`OWNER-INPUT-REQUIRED.md`.

---

## 8. Risks, prioritised

1. **HIGH** — The live production site has an active form collecting
   name/email/message, sent to a third party, with zero privacy
   disclosure anywhere on the site, ahead of a law taking effect
   2026-12-01. (Already fixed on `redesign/2027`, but that branch isn't
   deployed.)
2. **HIGH** — `http://` does not redirect to `https://` on the live
   domain: plaintext transport is possible. One GitHub Pages setting,
   owner-actionable, outside this repo's reach.
3. **MEDIUM** — No privacy policy exists anywhere (live or redesign),
   despite real data flows (contact form today; Google Fonts/Maps on
   both).
4. **MEDIUM** — Three distinct third-party data flows (Google Fonts,
   Google Maps embed, Web3Forms) and the hosting CDN itself each need
   their legal basis / international-transfer treatment confirmed once
   the law is in force.
5. **LOW** — No security response headers; structurally limited by
   GitHub Pages without adding another layer in front.
6. **LOW** — Build-time dependency vulnerabilities; not visitor-facing,
   routine hygiene.
7. **LOW** — GA4/consent scaffolding is unused and provably inert right
   now, but must not be switched on without first building the actual
   consent-banner UI the code already expects.

---

## 9. Recommendations, prioritised

1. Confirm the business-identity facts in `OWNER-INPUT-REQUIRED.md` —
   this blocks writing any real privacy policy text (Phase 3).
2. Owner: check/enable "Enforce HTTPS" in the repository's GitHub Pages
   settings.
3. Decide the cutover timeline for `redesign/2027` relative to
   2026-12-01 — the live form is the most exposed item found, and it's
   already fixed on the branch that isn't deployed yet.
4. Once facts are confirmed, draft the privacy policy (Phase 3) and the
   data-subject-request procedure (Phase 7), then publish together with
   deployment of `redesign/2027`.
5. If GA4 is genuinely planned, build the consent-banner UI *before* ever
   setting `PUBLIC_GA_MEASUREMENT_ID` in any environment.
6. Routine hygiene: `npm audit fix`, tested on a branch, before the next
   deploy (unrelated to visitor privacy, just dependency upkeep).
7. While the legacy form is still live: check Web3Forms' own privacy
   policy/DPA for their retention period and jurisdiction, to describe
   accurately once documented.

---

*This document reflects only what could be verified from the repository
and a read-only check of the live site's public HTTP responses. It is not
a substitute for review by a qualified Chilean privacy lawyer, and it does
not itself make the site compliant with Law 21.719 or Law 19.628.*
