// ============================================================================
// MOBILE NAVIGATION TOGGLE
// ============================================================================
// Plain, dependency-free JavaScript that powers the hamburger menu in
// Navbar.astro. Kept as its own small module (instead of writing it inline
// in the component) so it's easy to find and easy to unit-test later if
// needed.
//
// Progressive enhancement: the nav links work as plain links with no JS at
// all. This script only adds the mobile show/hide behaviour on top.
// ============================================================================

export function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");

  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    // aria-expanded tells screen readers whether the menu is currently
    // open - the old site's hamburger button was missing this entirely.
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu automatically after a link is tapped, so users
  // don't have to open/close the menu manually between page visits.
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}
