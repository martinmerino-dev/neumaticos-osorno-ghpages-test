// ============================================================================
// MAXXIS INTRO: THE HERO -> MAXXIS TRANSITION
// ============================================================================
// The red Maxxis band is the "curtain" that rises over the pinned hero.
// Three layers move at different rates, all scrubbed to native scroll:
//   - the band's top edge starts as a raked, speed-line diagonal and
//     straightens as it reaches the top of the screen (clip-path mask)
//   - the giant MAXXIS wordmark travels right-to-left
//   - the tire drives in from the right, against the wordmark, and comes
//     to rest - so the product arrives exactly as the brand name does
//
// Only transform and clip-path are animated. Reduced motion: nothing
// runs; the band, wordmark and tire are simply in their final positions.
// ============================================================================
import { gsap } from "./gsapSetup.js";
import { MOTION_OK, DESKTOP } from "./motion.js";

export function initMaxxisIntro() {
  const band = document.querySelector("[data-maxxis-band]");
  if (!band) return;

  const q = gsap.utils.selector(band);
  const mm = gsap.matchMedia();

  mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (context) => {
    const { motion, desktop } = context.conditions;
    if (!motion) return;

    gsap.fromTo(
      band,
      { clipPath: "polygon(0% 18%, 100% 0%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "none",
        scrollTrigger: { trigger: band, start: "top bottom", end: "top top", scrub: true },
      },
    );

    gsap.fromTo(
      q("[data-maxxis-wordmark]"),
      { xPercent: desktop ? 16 : 10 },
      {
        xPercent: desktop ? -10 : -6,
        ease: "none",
        scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
      },
    );

    gsap.fromTo(
      q("[data-maxxis-tire]"),
      { xPercent: desktop ? 70 : 45, rotation: -14, scale: 0.86 },
      {
        xPercent: 0,
        rotation: 0,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: band, start: "top bottom", end: "top 15%", scrub: 0.6 },
      },
    );
  });
}
