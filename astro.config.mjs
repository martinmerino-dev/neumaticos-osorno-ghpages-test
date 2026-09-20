import { defineConfig } from "astro/config";

// Minimal config on purpose: this project stays a plain static build
// (no framework integrations, no server rendering) so it keeps deploying
// to GitHub Pages exactly like the current site does.
export default defineConfig({
  site: "https://neumaticososorno.cl",

  build: {
    // Astro's default output turns src/pages/maxxis.astro into
    // /maxxis/index.html (served at /maxxis/). We need it to build to
    // /maxxis.html instead, so every existing URL (bookmarks, the
    // current sitemap.xml, any external links) keeps working exactly
    // as it does on the live site today.
    format: "file",
  },
});
