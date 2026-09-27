// ============================================================================
// ACTIVE SECTION INDICATOR
// ============================================================================
// Keeps the navbar in sync with where the visitor is on the single page:
//   - marks the link for the section currently in view with
//     aria-current="true" (screen readers hear "current")
//   - slides one red indicator bar under that link
//   - fills a thin progress line along the bottom of the navbar
//
// This is navigation state, not decoration, so it also runs with reduced
// motion - the global reduced-motion CSS just removes the bar's easing.
// The indicator only moves with transform (translateX + scaleX of a 1px
// element), never width/left, so it never triggers layout.
// ============================================================================
import { ScrollTrigger } from "./gsapSetup.js";

export function initSectionNav() {
  const list = document.querySelector("[data-nav-links]");
  const indicator = document.querySelector("[data-nav-indicator]");
  const progress = document.querySelector("[data-nav-progress]");
  if (!list) return;

  const links = Array.from(list.querySelectorAll("a[href^='#']"));
  let activeLink = null;

  function moveIndicator() {
    if (!indicator) return;
    if (!activeLink || activeLink.offsetParent === null) {
      indicator.style.opacity = "0";
      return;
    }
    const x = activeLink.offsetLeft;
    const width = activeLink.offsetWidth;
    indicator.style.opacity = "1";
    indicator.style.transform = `translateX(${x}px) scaleX(${width})`;
  }

  function setActive(link) {
    if (link === activeLink) return;
    activeLink?.removeAttribute("aria-current");
    activeLink = link;
    activeLink?.setAttribute("aria-current", "true");
    moveIndicator();
  }

  const entries = links
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((entry) => entry.section);

  // One check instead of one trigger per section: the current section is
  // the one crossing a "reading line" 30% down the viewport. At the very
  // bottom of the page the last section wins, even if it's too short to
  // ever reach the line (Contacto sits above the footer). Short sections
  // like Agrícolas still register because only the line matters, not how
  // much of the screen a section fills.
  function update() {
    const line = window.innerHeight * 0.3;
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let current = null;

    if (atBottom) {
      current = entries[entries.length - 1];
    } else {
      current = entries.find(({ section }) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
    }
    setActive(current?.link ?? null);
  }

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      update();
      if (progress) progress.style.transform = `scaleX(${self.progress.toFixed(4)})`;
    },
  });
  ScrollTrigger.addEventListener("refresh", update);
  update();

  // Link widths change when the web font swaps in and on resize.
  window.addEventListener("resize", moveIndicator);
  document.fonts?.ready.then(moveIndicator);
}
