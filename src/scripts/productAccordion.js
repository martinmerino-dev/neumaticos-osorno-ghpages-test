// ============================================================================
// PRODUCT CARD "VER MÁS" ACCORDION
// ============================================================================
// Expands/collapses the extra spec details inside a ProductCard.
// Progressive enhancement: without JS, all the details are simply always
// visible (see ProductCard.astro), so nothing important is ever hidden
// from a visitor whose JS fails to load.
// ============================================================================

export function initProductAccordions() {
  const buttons = document.querySelectorAll("[data-toggle-info]");

  buttons.forEach((button) => {
    const panel = button.nextElementSibling;
    if (!panel) return;

    button.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.textContent = isOpen ? "Ocultar info" : "Ver más";
    });
  });
}
