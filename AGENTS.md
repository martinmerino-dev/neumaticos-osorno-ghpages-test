# AGENTS.md — Neumáticos Osorno

Engineering and design instructions for anyone (human or AI agent) working on this repository. Read this before changing anything.

## 1. Project purpose

Marketing website for **Neumáticos Osorno**, a family tire shop in Osorno, Chile (sales and installation of tires, including Maxxis and agricultural tires). The site's job is to show what the shop sells and get visitors to make contact (mainly WhatsApp, also phone, email and the contact form). The 2027 redesign turns it into a premium, automotive-feeling single-page experience.

## 2. Current stack

- Astro 7 (static output, no SSR, no UI framework integrations)
- Plain HTML, CSS (custom properties + component-scoped `<style>`) and vanilla JavaScript modules
- GSAP 3 + ScrollTrigger (GSAP 3.13+ ships SplitText, Flip and ScrollToPlugin for free inside the `gsap` package; no extra install is needed for them)
- Build: `npm run build` → `dist/`. Dev: `npm run dev`. Preview the build: `npm run preview`.

## 3. Production safety rules

**The live site is the legacy static HTML at the repository root**, served by GitHub Pages from `main` with the custom domain in `CNAME`:

`index.html`, `maxxis.html`, `neumaticos.html`, `neumaticos_agricolas.html`, `contacto.html`, `assets/`, `CNAME`, `robots.txt`, `sitemap.xml`

- Do not edit, move, rename or delete any of those files on any branch unless the owner explicitly asks.
- The Astro project (`src/`, `public/`, `astro.config.mjs`) is **not deployed yet**. Nothing in `dist/` is live.
- Never change GitHub Pages settings, the `CNAME`, DNS or repository settings.
- The Contacto section has no email-submit form (owner's decision, 2026-10-17): no Web3Forms, no "send us a message" input anywhere on the site. The email address is shown only in the footer, as a `mailto:` link, not as a form. Don't reintroduce a contact form without being asked.

## 4. Git workflow

- Redesign work happens on `redesign/2027` (or a branch off it). **Never commit to or merge into `main`** without explicit approval.
- Never push, force-push, deploy or open PRs unless the owner asks in that session.
- Small, focused commits with descriptive messages. Keep the working tree buildable at every commit.
- Do not commit `dist/`, `.astro/` or `node_modules/` (already in `.gitignore`).

## 5. Astro architecture rules

- `src/pages/index.astro` **composes** sections; it holds no large markup or styles of its own.
- Each major homepage section is its own component in `src/components/sections/` and owns its markup, scoped styles and (if any) its animation hook.
- Shared building blocks (cards, grids, buttons, brand chips) live in `src/components/` (or `src/components/ui/` once there are enough of them).
- `src/layouts/BaseLayout.astro` owns `<head>`, SEO tags, structured data, navbar, footer and the global WhatsApp button.
- Prefer Astro props and build-time logic over client-side JavaScript. Ship JS only for behavior (navigation, motion, accordions, form UX).
- Keep components small. If one passes ~200 lines of markup + style, split it.
- Don't add abstractions until there are at least two real uses for them.

## 6. Component organization

```
src/
  components/
    sections/      HeroSection, MaxxisSection (+ MaxxisShowroom), BrandsSection,
                   TiresSection, AgriculturalSection, AboutSection, ContactSection
    (shared)       Navbar, Footer (closing chapter), WhatsAppButton, SplitWords,
                   LegacyRedirect
  data/            site.js (business facts, nav, contact form), products.js
                   (catalog), media.js (image registry + authenticity flags)
  layouts/         BaseLayout.astro
  pages/           index.astro (+ legacy-URL redirect stubs)
  scripts/         gsapSetup.js + one module per behavior/animation
  styles/          tokens.css, base.css, buttons.css, global.css
```

Section IDs are the public navigation contract: `#inicio`, `#maxxis`, `#neumaticos`, `#agricolas`, `#nosotros`, `#contacto`. Don't rename them.

## 7. Data / content separation

- All business facts (name, phones, email, WhatsApp link, about copy, shipping message, nav) come from `src/data/site.js`.
- All products and brands come from `src/data/products.js`.
- Components receive data through props or import it from `src/data/`. **No phone numbers, product names, specs or brand lists hardcoded in components.**
- Derived facts (e.g. "6 modelos") must be computed from the data, never hand-typed.

## 8. Styling / design-system rules

- Every color, font, size, space, radius, shadow, easing and duration comes from `src/styles/tokens.css`. If a value is missing, add a token; don't hardcode one-off values in a component.
- Brand foundation (current direction, under evaluation): the logo's **red `#d42828` and black** are the primary identity, on dark industrial neutrals (ink, charcoal, steel). The legacy orange `#f2610d` stays available as a secondary accent token. Don't remove either color, and don't introduce new accent colors without approval.
- Direction: premium, bold, automotive, editorial. Large type, strong grids, full-bleed imagery, confident whitespace.
- Avoid generic SaaS/AI-template patterns: rounded cards everywhere, pastel gradients, glassmorphism, emoji icons, "01/02/03" numbering on content that isn't a sequence, stat blocks with invented numbers, floating decorative blobs.
- Use rounded corners sparingly and on purpose; prefer hard edges, rules and masks for an automotive feel.
- Global styles only in `src/styles/`; everything else is component-scoped.
- Calls to action use the global `.button` classes in `src/styles/buttons.css` (`--red`, `--black`, `--outline-light`, `--outline-dark`, `--block`). The hero, navbar and Maxxis showroom still carry older scoped copies of the same look; migrate them rather than adding more copies.
- Product/brand images: always `productImage()` / `brandLogo()` / `media` from `src/data/media.js`. Never enlarge a photo past 1.5x its pixel size unless `productImageFraming` documents why.

## 9. Animation rules

- Every animation must serve hierarchy, storytelling, navigation, product discovery or visual quality. If you can't name which one, remove it.
- One orchestrated moment per section is better than many scattered effects.
- **Forbidden:** scroll hijacking, smooth-scroll libraries (Lenis, Locomotive, etc.), autoplay video backgrounds, particles, random floating elements, heavy multi-layer parallax, Three.js/WebGL (for now).
- Allowed tools: CSS transitions, `@keyframes`, GSAP, ScrollTrigger, and the free GSAP plugins (SplitText, Flip) when they clearly beat the CSS alternative.
- Animate only `transform`, `opacity`, `clip-path` and filters. Never animate layout properties (`width`, `height`, `top`, `margin`) in scroll-linked motion.
- Content must be visible and readable with no JS. Motion enhances; it never gates content.
- **`prefers-reduced-motion: reduce` is mandatory:** show final states, no scroll-linked motion, no marquees, no pinning.

## 10. GSAP / ScrollTrigger rules

- Import `gsap` / `ScrollTrigger` only from `src/scripts/gsapSetup.js` (it registers plugins once). Register any new plugin there.
- Wrap every animation in `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` condition, and use breakpoint conditions for desktop-only effects.
- Use `data-*` attribute hooks to target elements, never styling classes. Prefer the shared primitives in `src/scripts/scrollReveal.js` before writing a new ScrollTrigger: `data-reveal`, `data-reveal-group`, `data-reveal-mask` (clip-path wipe), `data-reveal-words` (with `SplitWords.astro`), `data-drift="x|y"` (scrubbed drift).
- An element with `mix-blend-mode` inside a transformed/clipped wrapper only blends with that wrapper: give the wrapper the page background.
- **Pinning:** at most one or two pinned sequences on the whole page, only where they clearly improve storytelling. Desktop only (≥ 1024px), never on touch/mobile. Always keep the scroll distance short (≤ 150vh).
- Prefer `once: true` for reveals. Use `scrub` only for motion that's directly linked to scroll position (image masks, progress indicators).
- Don't use `markers: true` in committed code. Call `ScrollTrigger.refresh()` after late layout changes such as fonts or images loading.
- Anchor navigation must work with pinned sections: verify that every nav link lands on its section heading, not inside or past a pin spacer.

## 11. Accessibility requirements (WCAG 2.2 AA)

- Semantic landmarks: one `<h1>`, then a logical heading order. Each section is a `<section>` labelled with `aria-labelledby` pointing to its heading.
- Keep the skip link. Keyboard navigation must work everywhere, with visible `:focus-visible` styles on the brand accent.
- Mobile menu: `aria-expanded` and `aria-controls`, Escape closes it, and focus returns to the toggle.
- The nav link for the section currently in view gets `aria-current="true"`. Only use `aria-current="page"` for real page matches.
- Text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI). Orange text on white fails at body size, so use orange for fills and large text only.
- Meaningful `alt` text on product images; `alt=""` on decorative images. Duplicated marquee content gets `aria-hidden="true"`.
- Form fields have `<label>`s, errors are announced, and inputs have the correct `type` and `autocomplete`.

## 12. Responsive design requirements

- Mobile-first. Test at 360, 390, 768, 1024, 1280 and 1440+ px widths.
- No horizontal page scroll at any width. Horizontal-motion sections degrade to a vertical stack or a native swipe row (`scroll-snap`) on touch devices.
- Touch targets ≥ 44×44px. The floating WhatsApp button must never cover primary content or CTAs.
- Use fluid type (`clamp`) from tokens. Hero compositions must fit short landscape phones.

## 13. Performance requirements

- Targets (mobile, Lighthouse): Performance ≥ 90, LCP < 2.5s, CLS < 0.05, INP < 200ms.
- Images: use Astro's built-in `astro:assets` (`<Image>` / `<Picture>`, sharp is already installed) for AVIF/WebP, responsive `srcset` and explicit dimensions. Several source images are 2–8 MB and must never ship raw.
- The hero image is the LCP element: `loading="eager"`, `fetchpriority="high"`, no fade-from-0 opacity on the LCP image itself.
- Lazy-load everything below the fold. Don't use JS for things CSS can do.
- Keep client JS small. GSAP is the only animation dependency.
- Fonts: `font-display: swap`. Self-hosting is planned (`public/fonts/` exists); preload only the critical weight.

## 14. SEO requirements

- One page: a unique `<title>`, a meta description, canonical `https://neumaticososorno.cl/`, Open Graph and Twitter tags, and `lang="es"`.
- JSON-LD (`AutoPartsStore` / `TireShop`) contains **only verified fields**. Don't add an address, opening hours, geo coordinates or ratings until the owner provides them.
- Legacy URLs (`/index.html`, `/maxxis.html`, `/neumaticos.html`, `/neumaticos_agricolas.html`, `/contacto.html`) must keep resolving. Each builds to a small redirect page pointing to the matching `/#section`, with `<link rel="canonical">` to the home page, `<meta name="robots" content="noindex">`, a meta refresh, and a visible fallback link.
- When the Astro site is eventually deployed, update `sitemap.xml` to list only the canonical URL(s).
- Keep the `google-site-verification` meta tag from the live `index.html` when the site goes live.

### 14b. Business data, analytics and maps (Phase 3B)

- Confirmed business data lives only in `src/data/site.js` (`contact`, `address`, `hours`, `seo`) and feeds the visible Contacto/footer AND the `TireShop` JSON-LD in `BaseLayout.astro`. Change it there, never in markup. Keep structured data limited to what is visible on the page (no ratings, reviews, price range, geo, or `sameAs` until confirmed).
- Social image `public/og/neumaticos-osorno.jpg` and the favicon set are generated by `scripts/brand/` from approved assets. The workshop backdrop (`taller.png` / `src/data/media.js` `workshop`) is AI-generated, not a photograph of the real shop - the owner reviewed this and explicitly approved using it anyway, including as brand/social imagery (confirmed 2026-10-16, see `ownerApproved` on that entry). `verified` stays `false` there because it still isn't authentic photography; that's a factual flag, not a usage restriction. Don't reintroduce a block on using it without the owner's direction.
- Google Analytics 4: set `PUBLIC_GA_MEASUREMENT_ID` (see `.env.example`). Without it nothing loads. `src/scripts/analytics.js` implements basic Consent Mode: gtag.js is not requested until `window.nosConsent.grantAnalytics()` is called (the privacy-phase consent UI must call it). Events carry fixed labels only - never names, emails, phone numbers, form contents or message text.
- Contacto map: keyless Google embed by default; set `PUBLIC_GOOGLE_MAPS_EMBED_KEY` (restricted to the domain + Maps Embed API) to use the official Embed API. Queries use the address only.

## 15. GitHub Pages / static hosting requirements

- Output must be 100% static files. No server routes, SSR adapters, middleware, or runtime environment variables.
- `build.format: "file"` in `astro.config.mjs` keeps the `*.html` URLs. Don't change it.
- There are no server-side redirects on GitHub Pages; redirects are HTML files.
- Root-relative asset paths (`/images/...`) assume the site is served at the domain root (custom domain). Don't add a `base` path.
- Deploying the Astro build (GitHub Actions or a build branch, with `CNAME` moved into `public/`) is a **separate, owner-approved task**.

## 16. Dependencies

- Current dependencies: `astro`, `gsap`. That's intentional.
- Don't install React, Vue, Svelte, Tailwind, UI kits, Lenis/Locomotive, Three.js, animation libraries other than GSAP, icon packs, or CSS frameworks.
- Before adding any dependency, explain what it does that the current stack can't, and what it costs in bundle size. Then get approval.

## 17. Never invent business information

Don't invent products, prices, stock, services, reviews, testimonials, statistics ("+20 años", "5.000 clientes"), awards, addresses, opening hours, guarantees, or promises such as "sin costo" or "el mejor precio".

- All copy must be traceable to the legacy HTML pages or be supplied by the owner.
- Neutral UI microcopy ("Ver modelos", "Escríbenos") is fine as long as it doesn't make a claim.
- If a design needs content that doesn't exist, use a clearly labelled `TODO(content):` comment and list it as a content requirement. Don't write filler that makes a claim.

## 18. Development workflow

1. Read this file and the relevant components/data first.
2. Change incrementally, one section or system at a time.
3. Run `npm run dev` and check desktop, mobile and reduced motion in the browser.
4. Run `npm run build` and fix all errors and warnings.
5. Summarize what changed, what was verified, and any open content requirements.

## 19. Testing / build requirements

Before any commit:

- `npm run build` succeeds with no errors.
- Manual checks: every nav link scrolls to its section and updates the active state, the URL hash is correct, and back/forward work. Legacy URLs redirect. The mobile menu works with keyboard and touch. Reduced motion shows all content. There's no horizontal scroll at 360px.
- Console is free of errors and ScrollTrigger warnings.
- For visual changes, take screenshots at mobile and desktop widths when a browser tool is available.

## 20. Deployment safety

- Agents never deploy. Deployment means changing what `neumaticososorno.cl` serves, and only the owner triggers it.
- Before any future cutover: the full test checklist passes, the legacy URL redirects are verified against the built `dist/`, the sitemap and robots are updated, the `CNAME` is present in the build output, and there's a documented rollback (revert to the legacy root HTML on `main`).
