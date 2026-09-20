// ============================================================================
// PRODUCT DATA
// ============================================================================
// This is the single source of truth for every tire the site displays.
// The old site repeated near-identical <div class="product-card">...</div>
// markup by hand inside maxxis.html and neumaticos.html. Here, each product
// is one plain object; the ProductCard/ProductGrid components (see
// src/components/) turn this data into markup. Adding, editing or removing
// a product is now a one-line change in this file instead of editing HTML.
//
// All names, types, uses and feature bullet points are copied as-is from
// the current live pages - no specs or products were invented.
//
// image paths are relative to /public/images/products/, matching whatever
// is copied into that folder. Not every image below has been copied into
// public/ yet - that happens when the page that uses it is built, and
// each product's real, optimized photo is added at that point.
// ============================================================================

/** @typedef {{
 *   slug: string,
 *   name: string,
 *   type: string,
 *   usage: string,
 *   features: string[],
 *   image: string,
 * }} Product
 */

/** @type {Product[]} */
export const maxxisProducts = [
  {
    slug: "at771-bravo",
    name: "Maxxis AT771 BRAVO",
    type: "All-Terrain",
    usage: "SUV y 4x4",
    features: [
      "Excelente tracción en barro y tierra",
      "Baja resistencia al rodado",
    ],
    image: "maxxis-at771-bravo.png",
  },
  {
    slug: "at811-razr",
    name: "Maxxis AT811 RAZR",
    type: "Off-Road extremo",
    usage: "Construcción reforzada con Kevlar",
    features: [
      "Diseñado para barro profundo",
      "Larga durabilidad y resistencia",
    ],
    image: "maxxis-at811-razr.png",
  },
  {
    slug: "trepador-m8060",
    name: "Maxxis TREPADOR M8060",
    type: "Competencia off-road",
    usage: "Tracción extrema en roca y tierra",
    features: [
      "Neumático radial de alto rendimiento",
      "Uso recomendado para rallies o trial",
    ],
    image: "maxxis-trepador-m8060.png",
  },
  {
    slug: "at-980",
    name: "Maxxis AT 980",
    type: "Todo Terreno (A/T)",
    usage: "Mixta (carretera y off-road moderado)",
    features: [
      "Neumático radial con diseño robusto",
      "Ideal para camionetas, SUVs y vehículos 4x4",
    ],
    image: "maxxis-at-980.png",
  },
  {
    slug: "at-781",
    name: "Maxxis AT 781",
    type: "Todo Terreno (A/T)",
    usage: "Mixta (carretera y off-road)",
    features: ["Rendimiento equilibrado", "Durabilidad superior"],
    image: "maxxis-at-781.jpeg",
  },
  {
    slug: "mt-764-bighorn",
    name: "Maxxis MT 764 BIGHORN",
    type: "Mud-Terrain (M/T)",
    usage:
      "Tracción extrema en barro, roca y terrenos blandos; buen rendimiento en carretera",
    features: [
      "Diseño de banda de rodadura agresivo con grandes tacos para máxima tracción fuera de carretera",
      "Ofrece un buen control y estabilidad en superficies mojadas y secas",
    ],
    image: "maxxis-mt-764-bighorn.jpg",
  },
];

/** @type {Product[]} */
export const neumaticosProducts = [
  {
    slug: "roadcruza-ra1100",
    name: "Roadcruza RA1100",
    type: "All-Terrain (A/T)",
    usage: "Conducción en ciudad y campo",
    features: [
      "Diseño mixto para tracción equilibrada",
      "Bajo nivel de ruido",
      "Buena resistencia al desgaste",
    ],
    image: "roadcruza-ra1100.jpg",
  },
  {
    slug: "roadcruza-ra7000",
    name: "Roadcruza RA7000",
    type: "M/T (Mud Terrain)",
    usage: "Barro y superficies difíciles",
    features: [
      "Diseño agresivo para mejor agarre",
      "Autolimpieza de barro",
      "Refuerzo lateral contra impactos",
    ],
    image: "roadcruza-ra7000.png",
  },
  {
    slug: "triangle-tr685",
    name: "Triangle TR685",
    type: "Comercial liviano",
    usage: "Vehículos de carga ligera",
    features: [
      "Diseño simétrico para mayor estabilidad",
      "Buena adherencia en mojado",
      "Alta capacidad de carga",
    ],
    image: "triangle-tr685.png",
  },
  {
    slug: "triangle-tr689a",
    name: "Triangle TR689A",
    type: "All-Terrain",
    usage: "Todo tipo de clima",
    features: [
      "Canales profundos para mejor drenaje",
      "Bajo ruido en carretera",
      "Construcción robusta y confiable",
    ],
    image: "triangle-tr689a.png",
  },
  {
    slug: "goodride-sl369",
    name: "Goodride SL369",
    type: "Todo Terreno (A/T)",
    usage: "Carretera y off-road moderado",
    features: [
      "Protección lateral: hombros robustos",
      "Agarre en mojado: ranuras en zigzag",
    ],
    image: "goodride-sl369.jpg",
  },
  {
    slug: "hilo-xt1",
    name: "Hilo XT1",
    type: "Todo Terreno (A/T)",
    usage: "50% carretera, 50% todo terreno",
    features: [
      "Durabilidad: carcasa reforzada",
      "Agarre superior: hombros abiertos",
    ],
    image: "hilo-xt1.png",
  },
];

// Agricultural tire brands: the current site only shows these as a logo
// grid (no product-level detail exists yet), so we keep the same shape.
export const agriculturalBrands = [
  { slug: "alliance", name: "Alliance", image: "alliance.jpg" },
  { slug: "bridgestone", name: "Bridgestone", image: "bridgestone.gif" },
  { slug: "forerunner", name: "Forerunner", image: "forerunner.png" },
  { slug: "ozka", name: "Ozka", image: "ozka.png" },
  { slug: "pirelli", name: "Pirelli", image: "pirelli.png" },
];

// Derived (not hand-typed) list of on-road tire brand names, taken from
// each product's own name - e.g. "Roadcruza RA7000" contributes
// "Roadcruza". We don't have separate logo artwork for these brands (only
// for the agricultural ones above), so pages display them as text badges
// instead of guessing at a logo. Computing this from the product data
// means it can never drift out of sync with what's actually for sale.
const brandFromProductName = (product) => product.name.split(" ")[0];

export const onRoadBrandNames = [
  ...new Set([...maxxisProducts, ...neumaticosProducts].map(brandFromProductName)),
];
