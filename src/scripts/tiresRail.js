// ============================================================================
// NEUMÁTICOS RAIL
// ============================================================================
// TiresSection.astro has two layouts from the same markup:
//   - below 1024px: a native horizontal scroller (swipe / trackpad / arrow
//     keys when focused) - the approved mobile & tablet experience
//   - 1024px and up: a vertical editorial list inside the page width, so
//     laptop/desktop visitors discover every model just by scrolling down
//
// This script only enhances whichever layout is active:
//   - brand chips jump to that brand's first model (sideways in the rail,
//     or down the page in the list) and mark the brand of the model in
//     view (aria-current)
//   - rail only: prev/next buttons (one slide, disabled at the ends), the
//     "01 / 06" counter and progress line, and keyboard focusability
//   - entrance: rail = the plates wipe in left to right once; list = each
//     row's photo wipes in and its text follows as that row scrolls in
// Scrolling is smooth only when motion is allowed. Never hijacks scroll.
// ============================================================================
import { gsap } from "./gsapSetup.js";
import { MOTION_OK, DESKTOP, EASE_IN_OUT, EASE_OUT } from "./motion.js";

export function initTiresRail() {
  const root = document.querySelector("[data-rail]");
  const track = root?.querySelector("[data-rail-track]");
  if (!root || !track) return;

  const slides = Array.from(track.querySelectorAll("[data-rail-slide]"));
  const prev = root.querySelector("[data-rail-prev]");
  const next = root.querySelector("[data-rail-next]");
  const counter = root.querySelector("[data-rail-current]");
  const progress = root.querySelector("[data-rail-progress]");
  const chips = Array.from(root.querySelectorAll("[data-rail-brand]"));
  const motionQuery = window.matchMedia(MOTION_OK);
  const listQuery = window.matchMedia(DESKTOP);
  const railLabel = track.getAttribute("aria-label");

  const isList = () => listQuery.matches;
  const behavior = () => (motionQuery.matches ? "smooth" : "auto");
  const maxScroll = () => track.scrollWidth - track.clientWidth;
  const padStart = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
  // Slides are laid out in the track, so offsetLeft is relative to it.
  const slideLeft = (slide) => slide.offsetLeft - padStart();

  function currentIndex() {
    if (isList()) {
      // The row crossing a reading line 40% down the viewport.
      const line = window.innerHeight * 0.4;
      let index = 0;
      slides.forEach((slide, i) => {
        if (slide.getBoundingClientRect().top <= line) index = i;
      });
      return index;
    }
    if (track.scrollLeft >= maxScroll() - 2) return slides.length - 1;
    let best = 0;
    slides.forEach((slide, index) => {
      if (Math.abs(slideLeft(slide) - track.scrollLeft) < Math.abs(slideLeft(slides[best]) - track.scrollLeft)) {
        best = index;
      }
    });
    return best;
  }

  function goTo(index) {
    const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
    if (isList()) {
      // scroll-padding-top (the navbar height) keeps it clear of the bar.
      target.scrollIntoView({ behavior: behavior(), block: "start" });
    } else {
      track.scrollTo({ left: slideLeft(target), behavior: behavior() });
    }
  }

  let ticking = false;
  function update() {
    ticking = false;
    const index = currentIndex();

    if (!isList()) {
      const max = maxScroll();
      if (counter) counter.textContent = String(index + 1).padStart(2, "0");
      if (progress) progress.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 1})`;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }

    const brand = slides[index]?.dataset.brand;
    chips.forEach((chip) => {
      if (chip.dataset.railBrand === brand) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
  }

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  // Only the horizontal rail is a scroll region worth a tab stop.
  function applyMode() {
    if (isList()) {
      track.removeAttribute("tabindex");
      track.removeAttribute("role");
      track.removeAttribute("aria-label");
    } else {
      track.setAttribute("tabindex", "0");
      track.setAttribute("role", "region");
      if (railLabel) track.setAttribute("aria-label", railLabel);
    }
    requestUpdate();
  }

  track.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  listQuery.addEventListener("change", applyMode);
  prev?.addEventListener("click", () => goTo(currentIndex() - 1));
  next?.addEventListener("click", () => goTo(currentIndex() + 1));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const first = slides.findIndex((slide) => slide.dataset.brand === chip.dataset.railBrand);
      if (first >= 0) goTo(first);
      document.dispatchEvent(
        new CustomEvent("nos:brand-select", { detail: { brand: chip.dataset.railBrand, location: "neumaticos" } }),
      );
    });
  });
  applyMode();

  // ---- Entrances -------------------------------------------------------------
  const plateOf = (slide) => slide.querySelector("[data-rail-plate]");
  const bodyOf = (slide) => slide.querySelector(".slide-body");

  const mm = gsap.matchMedia();
  mm.add({ motion: MOTION_OK, list: DESKTOP }, (context) => {
    const { motion, list } = context.conditions;
    if (!motion) return;

    if (list) {
      slides.forEach((slide) => {
        gsap
          .timeline({ scrollTrigger: { trigger: slide, start: "top 80%", once: true } })
          .from(plateOf(slide), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.1, ease: EASE_IN_OUT })
          .from(plateOf(slide).querySelector("img"), { scale: 1.1, duration: 1.4, ease: EASE_OUT, clearProps: "transform" }, 0)
          .from(bodyOf(slide).children, { opacity: 0, y: 20, duration: 0.8, ease: EASE_OUT, stagger: 0.07 }, 0.3);
      });
      return;
    }

    gsap
      .timeline({ scrollTrigger: { trigger: track, start: "top 80%", once: true } })
      .from(slides.map(plateOf), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.1, ease: EASE_IN_OUT, stagger: 0.09 })
      .from(slides.map(bodyOf), { opacity: 0, y: 20, duration: 0.8, ease: EASE_OUT, stagger: 0.09 }, 0.35);
  });
}
