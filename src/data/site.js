// ============================================================================
// SITE / BUSINESS DATA
// ============================================================================
// General business facts (name, contact info, navigation, footer copy) used
// across multiple components (Navbar, Footer, WhatsAppButton, page <head>
// tags, etc). Kept in one file so contact details only ever need updating
// in one place.
//
// Every value below is copied as-is from the current live site's HTML -
// nothing here is invented.
// ============================================================================

// One-line postal address, e.g. for display and map queries.
export const fullAddress = (a = site.address) =>
  `${a.street}, ${a.postalCode} ${a.locality}, ${a.region}, ${a.country}`;

// Google Maps links, built with Google's documented "Maps URLs" format
// (https://developers.google.com/maps/documentation/urls/get-started).
// No API key and no coordinates needed - Google resolves the address.
// The query is the ADDRESS only: tested, a "name + address" query can
// resolve to a different business at city zoom, while the address gives an
// exact pin at Av. Juan Mackenna 1917. When the business shares its
// official Google Maps listing, add `&query_place_id=...` to `view`.
export const mapsLinks = () => {
  const query = encodeURIComponent(fullAddress());
  return {
    // Opens the place in Google Maps (app on phones).
    view: `https://www.google.com/maps/search/?api=1&query=${query}`,
    // Opens turn-by-turn directions to the shop.
    directions: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
    // Keyless map embed for the Contacto iframe (see ContactSection).
    embed: `https://www.google.com/maps?q=${query}&z=16&output=embed&hl=es`,
  };
};

// wa.me link with a starter message the visitor can edit before sending.
// The text is the visitor's own message template, never a business claim.
export const whatsappMessageUrl = (text) =>
  `${site.contact.whatsappUrl}?text=${encodeURIComponent(text)}`;

export const site = {
  name: "Neumáticos Osorno",
  domain: "https://neumaticososorno.cl",

  // Kept from the live site's meta description (used in the footer copy
  // and as fallback text). The page <title>/description live in `seo`.
  tagline: "Tu tienda de confianza para neumáticos en Osorno",

  // Homepage search/social metadata. Natural Spanish; every statement is
  // backed by visible content (products, brands, about text, address).
  seo: {
    title: "Neumáticos Osorno | Venta e instalación de neumáticos en Osorno",
    description:
      "Venta e instalación de neumáticos en Osorno: Maxxis, 4x4, todo terreno y agrícolas. Asesoría técnica en Av. Juan Mackenna 1917. Escríbenos por WhatsApp.",
    ogImage: "/og/neumaticos-osorno.jpg",
    ogImageAlt:
      "Neumáticos Osorno: venta e instalación de neumáticos Maxxis, 4x4 y agrícolas en Av. Juan Mackenna 1917, Osorno.",
    locale: "es_CL",
  },

  // Contact details CONFIRMED by the business (Phase 3B). These replace the
  // two mobile numbers the legacy site listed; do not reintroduce those or
  // any number from third-party directories.
  contact: {
    phones: ["+56 64 226 3370"],
    email: "contacto@neumaticososorno.cl",
    // wa.me link used by the floating WhatsApp button on every page.
    whatsappUrl: "https://wa.me/56981898985",
    whatsappPhone: "+56 9 8189 8985",
  },

  // Confirmed address. Shown in Contacto and the footer, and used by the
  // LocalBusiness structured data - keep all three in sync through here.
  address: {
    street: "Av. Juan Mackenna 1917",
    postalCode: "5310650",
    locality: "Osorno",
    region: "Los Lagos",
    country: "Chile",
    countryCode: "CL",
  },

  // Confirmed opening hours (they also match the public listing). Sunday
  // is closed. `schemaDays` feed the structured data; `label` is visible.
  hours: [
    { label: "Lunes a viernes", schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { label: "Sábado", schemaDays: ["Saturday"], opens: "09:30", closes: "13:30" },
  ],
  closedLabel: "Domingo: cerrado",

  // The live contacto.html form, carried over unchanged: it posts to
  // Web3Forms with this access key (a public, client-side key by design -
  // see AGENTS.md section 3; never replace it without being asked).
  contactForm: {
    action: "https://api.web3forms.com/submit",
    accessKey: "22d01891-4d79-4f86-9516-802ce4d272a3",
  },

  shipping: {
    message: "Despacho gratuito",
  },

  // Paragraphs from the current "Quiénes Somos" (index.html) page, verbatim.
  about: {
    heading: "Quiénes Somos",
    paragraphs: [
      "Somos una empresa familiar ubicada en el corazón de Osorno, especializada en la venta e instalación de neumáticos. Nos diferenciamos por nuestra asesoría técnica y una atención cercana a cada cliente.",
      "Trabajamos con marcas reconocidas como Maxxis, Roadcruza, Triangle, Forerunner, Pirelli y más, ofreciendo calidad y confianza en cada producto.",
      "Nos comprometemos con un servicio responsable, incluyendo reciclaje de neumáticos y soluciones pensadas para cada cliente.",
      "En Neumáticos Osorno, no solo vendemos neumáticos, te acompañamos en cada kilómetro.",
    ],
    // Short labels pulled directly from the paragraphs above (technical
    // advice, close customer attention, tire recycling) - used to give
    // the same facts stronger visual hierarchy without adding new claims.
    highlights: ["Asesoría técnica", "Atención cercana", "Reciclaje de neumáticos"],
  },

  // Hero copy. Every line is traceable to the live site - nothing new is
  // claimed here.
  hero: {
    // Visual headline lines of the <h1> (the business name, split in two
    // so each line can be set and animated on its own).
    titleLines: ["Neumáticos", "Osorno"],
    // Verbatim fragment of the last "Quiénes Somos" paragraph.
    lead: "No solo vendemos neumáticos, te acompañamos en cada kilómetro.",
  },

  // Single-page navigation. Each href is an in-page anchor; the ids are
  // the public navigation contract (AGENTS.md section 6) - don't rename
  // them. "#inicio" is reached through the logo, not a text link.
  nav: [
    { label: "Maxxis", href: "#maxxis" },
    { label: "Neumáticos", href: "#neumaticos" },
    { label: "Agrícolas", href: "#agricolas" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ],

  // Legacy page URLs -> the section that replaced them. Each one builds to
  // a small redirect page (src/pages/*.astro) so old links keep working.
  legacyRedirects: {
    maxxis: "/#maxxis",
    neumaticos: "/#neumaticos",
    neumaticos_agricolas: "/#agricolas",
    contacto: "/#contacto",
  },

  footer: {
    copyright: "Neumáticos Osorno — Todos los derechos reservados © 2025",
  },
};
