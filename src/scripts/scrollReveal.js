// ============================================================================
// SCROLL REVEAL
// ============================================================================
// A single, generic "fade + rise into view on scroll" behaviour that every
// section on the site can opt into declaratively, instead of each
// component writing its own ScrollTrigger. Add one of these attributes to
// any element in a component's markup:
//
//   data-reveal          - animates that one element in when it scrolls
//                           into view.
//   data-reveal-group     - animates that element's direct children in
//                           with a small stagger (used for grids/rows of
//                           cards, brand logos, etc).
//
// Accessibility: if the visitor's OS has "reduce motion" turned on, this
// script does nothing at all and every element is simply shown at full
// opacity immediately - `prefers-reduced-motion` users always get the
// complete page with no animation, per the project brief.
// ============================================================================
import { gsap } from "./gsapSetup.js";

export function initScrollReveal() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      fullMotion: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      const { fullMotion } = context.conditions;

      document.querySelectorAll("[data-reveal], [data-reveal-group]").forEach((el) => {
        const isGroup = el.hasAttribute("data-reveal-group");
        const targets = isGroup ? Array.from(el.children) : [el];

        if (!fullMotion) {
          // Reduced motion: skip the animation, just make sure everything
          // is visible (it already is by default - this is a no-op
          // safety net in case a future change adds inline hidden styles).
          gsap.set(targets, { opacity: 1, clearProps: "transform" });
          return;
        }

        gsap.from(targets, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: "power2.out",
          stagger: isGroup ? 0.08 : 0,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
  );
}
