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

export const site = {
  name: "Neumáticos Osorno",
  domain: "https://neumaticososorno.cl",

  // Used as the default <title>/description suffix and for meta tags.
  tagline: "Tu tienda de confianza para neumáticos en Osorno",

  contact: {
    phones: ["+56 9 7837 9233", "+56 9 8189 8985"],
    email: "contacto@neumaticososorno.cl",
    // wa.me link used by the floating WhatsApp button on every page.
    whatsappUrl: "https://wa.me/56981898985",
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
  },

  // Drives the Navbar links and (later) each page's active-link state.
  // `href` intentionally matches the CURRENT live URLs so nothing breaks.
  nav: [
    { label: "Quiénes Somos", href: "/" },
    { label: "Maxxis", href: "/maxxis.html" },
    { label: "Neumáticos Agrícolas", href: "/neumaticos_agricolas.html" },
    { label: "Neumáticos", href: "/neumaticos.html" },
    { label: "Contacto", href: "/contacto.html" },
  ],

  footer: {
    copyright: "Neumáticos Osorno — Todos los derechos reservados © 2025",
  },
};
