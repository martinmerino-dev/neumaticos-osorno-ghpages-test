// ============================================================================
// MOBILE NAVIGATION MENU
// ============================================================================
// Powers the full-screen menu in Navbar.astro on small screens.
// Progressive enhancement: without JS the links are still plain anchors.
//
// Accessibility behaviour:
//   - aria-expanded on the toggle mirrors the menu state
//   - opening moves focus to the first link; Tab/Shift+Tab stay inside
//     the toggle + menu while it's open
//   - Escape closes and returns focus to the toggle
//   - choosing a link closes the menu, then the browser's native anchor
//     scroll takes over
// ============================================================================

const DESKTOP_QUERY = window.matchMedia("(min-width: 1024px)");

export function initNav() {
  const navbar = document.querySelector("[data-navbar]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!navbar || !toggle || !panel) return;

  const focusables = () => [toggle, ...panel.querySelectorAll("a[href]")];

  function setOpen(isOpen, { returnFocus = false } = {}) {
    navbar.toggleAttribute("data-menu-open", isOpen);
    document.documentElement.classList.toggle("nav-menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");

    if (isOpen) {
      panel.querySelector("a[href]")?.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  const isOpen = () => navbar.hasAttribute("data-menu-open");

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  panel.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen()) setOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;

    if (event.key === "Escape") {
      setOpen(false, { returnFocus: true });
      return;
    }

    if (event.key === "Tab") {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Rotating a phone/tablet into desktop width with the menu open would
  // otherwise leave the page scroll-locked.
  DESKTOP_QUERY.addEventListener("change", (event) => {
    if (event.matches && isOpen()) setOpen(false);
  });
}
