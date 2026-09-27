// ============================================================================
// HERO: LOAD-IN CHOREOGRAPHY + SCROLL RECEDE
// ============================================================================
// 1. Load-in (one timeline, plays once):
//    - "Garage door": the workshop image is revealed from the floor up
//      (clip-path), led by a thin red edge, while the photo settles from
//      a slight zoom - the shop literally opening for the day.
//    - The headline letters rise out of their line masks, line by line.
//    - Lead, facts and CTAs follow; the navbar arrives last so the eye
//      reads headline -> action -> navigation.
// 2. Scroll recede (scrubbed to scroll position):
//    - Desktop: the hero BACKDROP is pinned (no extra spacing) so the
//      Maxxis section slides up OVER it like a curtain, while the scene
//      scales back and darkens. The copy + bottom strip (foreground
//      layer) keep scrolling away at exactly native scroll speed, so the
//      rising Maxxis band - which also moves at scroll speed - stays the
//      same distance below them and can never cover the text, whatever
//      the viewport height. Depth, not hijack: the page scrolls at
//      native speed the whole time.
//    - Mobile: no pin; the photo just drifts and dims as it leaves.
//
// Reduced motion: none of this runs. The CSS hidden states are scoped to
// html.motion-ok (set only when motion is allowed), so the hero renders
// in its final state.
// ============================================================================
import { gsap } from "./gsapSetup.js";
import { MOTION_OK, DESKTOP, EASE_OUT, EASE_IN_OUT, markIntroStarted } from "./motion.js";

export function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const q = gsap.utils.selector(hero);
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    markIntroStarted();

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      onComplete: () => {
        document.documentElement.classList.add("intro-done");
        gsap.set([q("[data-hero-media]"), q("[data-hero-char]"), q("[data-hero-fade]"), "[data-nav-intro]"], {
          clearProps: "all",
        });
      },
    });

    tl.fromTo(
      q("[data-hero-media]"),
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: EASE_IN_OUT },
      0,
    )
      .fromTo(
        q("[data-hero-edge]"),
        { y: 0, opacity: 1 },
        { y: () => -hero.offsetHeight, duration: 1.25, ease: EASE_IN_OUT },
        0,
      )
      .to(q("[data-hero-edge]"), { opacity: 0, duration: 0.3 }, 1.1)
      .fromTo(q("[data-hero-img]"), { scale: 1.18 }, { scale: 1, duration: 2.2 }, 0)
      .fromTo(
        q("[data-hero-line='0'] [data-hero-char]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.035 },
        0.55,
      )
      .fromTo(
        q("[data-hero-line='1'] [data-hero-char]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.045 },
        0.75,
      )
      .fromTo(
        q("[data-hero-fade]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
        1.15,
      )
      .fromTo(
        "[data-nav-intro]",
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 },
        1.35,
      );
  });

  // Scroll recede. The pinned/curtain version is desktop-only.
  mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          // Pin the inner wrapper, not the section: a pinned element is
          // left translated once its pin ends, which would move the
          // #inicio anchor target away from the top of the page.
          pin: hero.querySelector("[data-hero-pin]"),
          pinSpacing: false,
        },
      })
      .to(q("[data-hero-stage]"), { scale: 0.88, duration: 1 }, 0)
      .to(q("[data-hero-dim]"), { opacity: 0.7, duration: 1 }, 0)
      // Travel = the scroll distance of the pin (the hero's height), over
      // the whole timeline: the foreground moves 1:1 with the scroll.
      .to(q("[data-hero-foreground]"), { y: () => -hero.offsetHeight, duration: 1 }, 0)
      // It fades only in the second half, once it's already up behind the
      // navbar - the copy is fully readable while it's in view.
      .to(q("[data-hero-foreground]"), { opacity: 0, duration: 0.4 }, 0.6);
  });

  mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      })
      .to(q("[data-hero-img]"), { yPercent: 12 }, 0)
      .to(q("[data-hero-dim]"), { opacity: 0.5 }, 0);
  });
}
