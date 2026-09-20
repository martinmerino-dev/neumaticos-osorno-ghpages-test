// ============================================================================
// NAVBAR SCROLL TRANSFORMATION
// ============================================================================
// Toggles a class on the navbar once the page has scrolled past the hero
// area, so CSS can shrink its padding/logo and deepen its shadow - a
// subtle "the interface is aware of where you are" cue rather than a
// decorative effect. All the actual visual change lives in Navbar.astro's
// `.navbar.is-scrolled` CSS; this script only flips the class.
//
// Uses two different thresholds (ENTER_AT / LEAVE_AT) instead of one, on
// purpose: a single shared threshold (e.g. "toggle exactly at 80px") means
// completely normal, tiny scroll jitter right around that pixel - which
// happens constantly with trackpads and mouse wheels - flips the class
// on and off dozens of times a second, which visibly makes the logo
// "vibrate" as its CSS transition keeps restarting. Having a gap between
// the on-threshold and the off-threshold (hysteresis) means a few pixels
// of jitter can no longer cause that loop.
// ============================================================================
import { ScrollTrigger } from "./gsapSetup.js";

const ENTER_AT = 80;
const LEAVE_AT = 40;

export function initNavbarScroll() {
  const navbar = document.querySelector("[data-navbar]");
  if (!navbar) return;

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    onUpdate: (self) => {
      const y = self.scroll();
      const isScrolled = navbar.classList.contains("is-scrolled");

      if (!isScrolled && y > ENTER_AT) {
        navbar.classList.add("is-scrolled");
      } else if (isScrolled && y < LEAVE_AT) {
        navbar.classList.remove("is-scrolled");
      }
    },
  });
}
