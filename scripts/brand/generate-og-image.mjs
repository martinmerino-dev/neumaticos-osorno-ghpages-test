// ============================================================================
// Social share image generator
// ============================================================================
// Renders scripts/brand/og-image.html (1200x630) to
// public/og/neumaticos-osorno.jpg with a headless browser, so the image
// uses the site's real typography (Archivo) and brand assets.
//
// Playwright is NOT a project dependency (on purpose). To regenerate:
//   npx -y -p playwright node scripts/brand/generate-og-image.mjs
// (or run it from any folder where `playwright` is installed, with
//  NODE_PATH pointing there). Re-run only if the logo, address or
// template changes.
// ============================================================================
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const template = pathToFileURL(path.resolve("scripts/brand/og-image.html")).href;
const out = "public/og/neumaticos-osorno.jpg";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(template, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();

await mkdir(path.dirname(out), { recursive: true });
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
console.log(`Share image written to ${out}`);
