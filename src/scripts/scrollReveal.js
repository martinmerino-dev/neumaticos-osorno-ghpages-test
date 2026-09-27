// ============================================================================
// SCROLL REVEALS
// ============================================================================
// The site's shared, declarative entrance vocabulary. Components opt in
// with data attributes instead of writing their own ScrollTriggers:
//
//   data-reveal         the element rises and fades in once
//   data-reveal-group   its direct children do, with a short stagger
//   data-reveal-mask    the element is uncovered by a clip-path wipe from
//                       below (images, panels); an <img> inside settles
//                       from a slight zoom at the same time
//   data-reveal-words   headline words rise out of their line masks, one
//                       after another (markup from SplitWords.astro)
//   data-drift="x|y"    scroll-linked drift while the element crosses the
//                       viewport; data-drift-amount is the travel in
//                       percent of the element's own size (default 8).
//                       Scrubbed to native scroll - never pinned.
//
// Every reveal plays once, when its element is ~80% up the viewport.
// Reduced motion: nothing here runs, so everything is simply visible - the
// hidden start states are only ever applied by these tweens, never by CSS.
// ============================================================================
import { gsap } from "./gsapSetup.js";
import { MOTION_OK, EASE_OUT, EASE_IN_OUT } from "./motion.js";

const START = "top 80%";

export function initScrollReveal() {
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    document.querySelectorAll("[data-reveal], [data-reveal-group]").forEach((el) => {
      const isGroup = el.hasAttribute("data-reveal-group");
      gsap.from(isGroup ? Array.from(el.children) : el, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: EASE_OUT,
        stagger: isGroup ? 0.08 : 0,
        scrollTrigger: { trigger: el, start: START, once: true },
      });
    });

    document.querySelectorAll("[data-reveal-mask]").forEach((el) => {
      const img = el.querySelector("img");
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: START, once: true } });
      tl.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: EASE_IN_OUT });
      if (img) tl.from(img, { scale: 1.12, duration: 1.6, ease: EASE_OUT }, 0);
    });

    document.querySelectorAll("[data-drift]").forEach((el) => {
      const axis = el.dataset.drift === "x" ? "xPercent" : "yPercent";
      const amount = Number(el.dataset.driftAmount || 8);
      gsap.fromTo(
        el,
        { [axis]: amount / 2 },
        {
          [axis]: -amount / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    document.querySelectorAll("[data-reveal-words]").forEach((el) => {
      gsap.from(el.querySelectorAll("[data-word]"), {
        yPercent: 110,
        duration: 1,
        ease: EASE_OUT,
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: START, once: true },
      });
    });
  });
}
