// ============================================================================
// MEDIA REGISTRY
// ============================================================================
// Every image the site uses goes through Astro's image pipeline
// (astro:assets), which emits resized AVIF/WebP files with explicit
// dimensions at build time. Source files live in src/assets/ - they are
// never served raw.
//
// Each entry records whether the image is CONFIRMED real business
// material. Anything with `verified: false` must not be presented as
// authentic photography of the shop, and should be replaced as soon as
// the owner supplies real material (see AGENTS.md section 17).
// ============================================================================
// The live site's logo file (assets/img/Logo 1.jpg), as a byte-identical
// copy so the redesign doesn't depend on the legacy folder that goes away
// at the production cutover. Untouched: its natural white margins are what
// keep the globe and the final "o" from touching the image edges.
import logoWordmark from "../assets/brand/logo.jpg";
import workshop from "../assets/images/workshop.png";
import emblem from "../assets/brand/emblem.png";

export const media = {
  // The live site's logo (copy of assets/img/Logo 1.jpg), as-is. Opaque white
  // background - it needs a light surface behind it (the navbar plate).
  logo: {
    src: logoWordmark,
    verified: true,
  },

  // Copy of assets/img/taller.png, the live site's workshop photo.
  // TODO(content): UNVERIFIED IMAGE. The lettering on the lift column is
  // garbled, which usually means the image is AI-generated rather than a
  // photograph of the actual shop. Used as an atmospheric backdrop only,
  // with an empty alt, until the owner supplies real workshop photography.
  workshop: {
    src: workshop,
    verified: false,
  },

  // The globe-in-a-tire emblem from the business's own logo files
  // (assets/img/N.O fav.png, trimmed). A brand mark, not a photograph -
  // it's never presented as photography of the shop. Opaque white
  // background, so it's shown on light surfaces with multiply blending.
  emblem: {
    src: emblem,
    verified: true,
  },
};

// Agricultural brand logos (copied from public/images/brands/ so they go
// through the image pipeline), keyed by the `image` filename in
// products.js. Several have opaque white/yellow backgrounds, so they're
// always shown on white plates.
const brandFiles = import.meta.glob("../assets/brands/*", {
  eager: true,
  import: "default",
});

export function brandLogo(file) {
  const image = brandFiles[`../assets/brands/${file}`];
  if (!image) {
    throw new Error(`Missing brand logo: src/assets/brands/${file}`);
  }
  return image;
}

// Product photos, keyed by the `image` filename used in products.js.
// Resolved at build time; a missing file fails the build instead of
// shipping a broken <img>.
const productFiles = import.meta.glob("../assets/products/*", {
  eager: true,
  import: "default",
});

// Known quality issues, so they're not mistaken for final assets.
// TODO(content): higher-resolution originals needed for these.
export const lowResolutionProductImages = ["hilo-xt1.png"];

// Per-photo framing, so every tire is drawn at the same visual size even
// though the files are cut differently. Reference: the 800x800 Maxxis
// PNGs, where the tire spans the full height of a square file. `scale`
// multiplies the photo's rendered width so its tire ends up the same
// height as a reference tire. Proportions are never changed and the
// files themselves are untouched. Measured tire bounding boxes:
//   - AT 781: square 800x800 file (assets/img/new at781.webp, supplied
//     to replace the old 224px photo), tire = 91% of the height
//       -> 1 / 0.91 ~= 1.10
//   - MT 764 BIGHORN: portrait 634x900 file, tire = 96.6% of the height;
//     at the reference width the tire would be 1.46x too tall
//       -> (634 / 900) / 0.966 ~= 0.73
export const productImageFraming = {
  "maxxis-at-781.webp": { scale: 1.1 },
  "maxxis-mt-764-bighorn.jpg": { scale: 0.73 },
};

// Pixel dimensions of an imported image WITHOUT marking its original file
// as used. Astro wraps imports in a proxy: reading any property directly
// (even .width) tells the build to also ship the full-size original,
// which no page links to. The proxy's `clone` property returns a plain
// copy of the same metadata without triggering that.
export function imageSize(image) {
  const { width, height } = image.clone ?? image;
  return { width, height };
}

export function productImage(file) {
  const image = productFiles[`../assets/products/${file}`];
  if (!image) {
    throw new Error(`Missing product image: src/assets/products/${file}`);
  }
  return image;
}
