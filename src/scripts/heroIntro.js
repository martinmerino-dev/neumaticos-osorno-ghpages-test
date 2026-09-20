// ============================================================================
// HERO ENTRANCE ANIMATION
// ============================================================================
// A one-time timeline that plays when the homepage loads: the eyebrow
// label fades up, the headline reveals word-by-word (each word is masked
// inside an overflow:hidden span in Hero.astro and slides up into view),
// then the subtitle, buttons and hero photo follow.
//
// This does NOT use ScrollTrigger - it's a load-in animation, not a
// scroll-linked one, so it runs immediately and only once.
//
// Respects prefers-reduced-motion: reduced-motion visitors see the
// finished hero immediately, with no animation.
// ============================================================================
import { gsap } from "./gsapSetup.js";

export function initHeroIntro() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(hero.querySelectorAll(".hero-eyebrow"), { opacity: 0, y: 12, duration: 0.5 })
      .from(
        hero.querySelectorAll(".word-inner"),
        { yPercent: 110, duration: 0.7, stagger: 0.05 },
        "-=0.2",
      )
      .from(hero.querySelectorAll(".hero-subtitle"), { opacity: 0, y: 16, duration: 0.5 }, "-=0.35")
      .from(hero.querySelectorAll(".hero-actions"), { opacity: 0, y: 16, duration: 0.5 }, "-=0.3")
      .from(
        hero.querySelectorAll(".hero-media img"),
        { opacity: 0, scale: 1.06, duration: 0.9 },
        "-=0.6",
      );
  });
}
