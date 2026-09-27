// ============================================================================
// Favicon generator (run manually: `node scripts/brand/generate-favicons.mjs`)
// ============================================================================
// Builds the site's favicon set from the OFFICIAL logo
// (src/assets/brand/logo.jpg = the live site's assets/img/Logo 1.jpg):
// the globe-on-a-tire icon at the left of the wordmark is cropped to a
// square and resized. The legacy 3.2MB "N.O fav.png" is not used or shipped.
//
// Output (public/, served as-is):
//   favicon.ico            16 + 32 + 48 px (PNG-in-ICO)
//   favicon-32x32.png      modern browsers
//   apple-touch-icon.png   180 px, white background (iOS home screen)
//   icon-192.png / icon-512.png   web app manifest
//
// Uses sharp, which Astro already installs for image optimization - no
// new dependency. Re-run only if the logo changes.
// ============================================================================
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const LOGO = "src/assets/brand/logo.jpg";
const OUT = "public";

// Square around the icon in the 11821x1663 logo file (measured: the
// icon's artwork spans x 620-2040, y 141-1494, plus its drop shadow).
const ICON_CROP = { left: 590, top: 90, width: 1480, height: 1480 };

const icon = (size, padding = 0) =>
  sharp(LOGO)
    .extract(ICON_CROP)
    .resize(size - padding * 2, size - padding * 2, { fit: "contain", background: "#ffffff" })
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toBuffer();

// Minimal ICO writer: an ICONDIR header plus one entry per embedded PNG
// (PNG-compressed ICO entries are supported by every current browser).
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const ico = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await icon(size) })));
await writeFile(`${OUT}/favicon.ico`, toIco(ico));
await writeFile(`${OUT}/favicon-32x32.png`, await icon(32));
await writeFile(`${OUT}/apple-touch-icon.png`, await icon(180, 14));
await writeFile(`${OUT}/icon-192.png`, await icon(192, 12));
await writeFile(`${OUT}/icon-512.png`, await icon(512, 32));
console.log("Favicons written to public/");
