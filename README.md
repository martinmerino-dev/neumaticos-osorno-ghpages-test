# Neumáticos Osorno — Website Redesign (GitHub Pages Test Copy)

This repository is an **isolated GitHub Pages compatibility test** for the
redesigned Neumáticos Osorno website (a family-owned tire shop in Osorno,
Chile). It is **not the production repository** and does not serve the
real `neumaticososorno.cl` domain. It exists to verify that the Astro
rebuild of the site deploys and works correctly on GitHub Pages before
any production cutover decision is made.

## Stack

- **[Astro](https://astro.build)** — static site generator, no server-side
  rendering.
- Plain **JavaScript** and **CSS** (custom properties, component-scoped
  styles) — no UI framework.
- **[GSAP](https://gsap.com)** — scroll-driven and entrance animations.
- **Archivo**, a variable font (weight 400–900, width 62–125%),
  self-hosted under `public/fonts/` (see `public/fonts/OFL.txt` for its
  SIL Open Font License).

## Project structure

```
src/
  assets/       Source images (brand, products, agricultural brand logos)
                processed through Astro's image pipeline
  components/   Shared UI (Navbar, Footer, WhatsAppButton, SplitWords...)
    sections/   One component per homepage section (Hero, Maxxis, Tires,
                Agricultural, Brands, About, Contact)
  data/         Business facts (site.js), product catalog (products.js),
                and the image registry with authenticity flags (media.js)
  layouts/      BaseLayout.astro — the shared <head>, SEO/meta tags,
                structured data, and page shell
  pages/        index.astro (the real page) plus legacy-URL redirect
                stubs (maxxis.astro, neumaticos.astro, etc.)
  scripts/      Vanilla JS modules (one per behavior/animation), imported
                by the components that use them
  styles/       Design tokens, base element styles, buttons, global imports

public/         Files served as-is: favicons, web manifest, social share
                image, the self-hosted font, and this test deployment's
                robots.txt / sitemap.xml

scripts/brand/  Standalone tooling (not run by the build) used to
                regenerate the favicons and social share image from
                approved brand assets

docs/privacy-compliance/
                Chilean Law 21.719 privacy audit documents: the verified
                technical audit and the checklist of business facts
                still needed from the owner before a privacy policy can
                be published
```

## Prerequisites

- Node.js (the deployment workflow below runs on Node 22)
- npm

## Install

```bash
npm install
```

## Develop

```bash
npm run dev
```

Starts the Astro dev server.

## Build

```bash
npm run build
```

Produces a fully static build in `dist/`.

## Preview the build locally

```bash
npm run preview
```

Serves the contents of `dist/` the same way a static host would.

## Deployment

On every push to the `redesign/2027` branch, `.github/workflows/deploy.yml`
runs: it installs dependencies with `npm ci`, builds the site with
`npm run build`, and publishes the `dist/` output to GitHub Pages via
`actions/upload-pages-artifact` + `actions/deploy-pages`.

The site is served at a **GitHub Pages project subpath**, not a custom
domain root:

```
https://martinmerino-dev.github.io/neumaticos-osorno-ghpages-test/
```

`astro.config.mjs` sets `site`/`base` accordingly for this test copy.
Production (a separate repository) instead serves the site at the
`neumaticososorno.cl` domain root, with no `base` configured.

## This is a test deployment — intentionally not indexable

Because this is a throwaway technical test, not a real public destination,
it's deliberately configured so search engines stay away from it:

- Every page has `<meta name="robots" content="noindex, nofollow">`.
- `public/robots.txt` sends `Disallow: /` (note: this only asks
  well-behaved crawlers not to crawl — it's not a privacy or security
  control).
- `public/sitemap.xml` is intentionally empty (no URLs listed).

## Privacy compliance documentation

See [`docs/privacy-compliance/`](docs/privacy-compliance/) for the
Chilean Law 21.719 audit: `INITIAL-AUDIT.md` (verified findings) and
`OWNER-INPUT-REQUIRED.md` (business facts still needed from the owner).
