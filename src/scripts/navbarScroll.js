// ============================================================================
// NAVBAR SCROLL TRANSFORMATION
// ============================================================================
// Toggles a class on the navbar once the page has scrolled past the hero
// area, so CSS can shrink its padding/logo and deepen its shadow - a
// subtle "the interface is aware of where you are" cue rather than a
// decorative effect. All the actual visual change lives in Navbar.astro's
// `.navbar.is-scrolled` CSS; this script only flips the class.
// ============================================================================
import { ScrollTrigger } from "./gsapSetup.js";

export function initNavbarScroll() {
  const navbar = document.querySelector("[data-navbar]");
  if (!navbar) return;

  ScrollTrigger.create({
    start: "80px top",
    onEnter: () => navbar.classList.add("is-scrolled"),
    onLeaveBack: () => navbar.classList.remove("is-scrolled"),
  });
}
