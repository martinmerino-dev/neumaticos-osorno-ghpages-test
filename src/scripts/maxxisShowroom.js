// ============================================================================
// MAXXIS SHOWROOM: MODEL SELECTOR
// ============================================================================
// Enhances the model list in MaxxisShowroom.astro. Exactly one model is
// open at a time (aria-expanded on its button, the others' panels hidden).
//
// How a model gets selected:
//   - click / tap / Enter / Space on its row (native <button>)
//   - desktop only: keyboard focus, or resting the mouse on a row for a
//     moment (hover intent - brushing across rows doesn't flicker)
//   - Arrow Up/Down, Home/End move focus between rows (and so select on
//     desktop; on touch layouts Enter/Space confirms)
// Nothing depends on hover alone.
//
// The switch itself (motion allowed):
//   - a clip-path wipe in the direction of travel through the list (down
//     the list = revealed from below). On desktop the whole incoming panel
//     wipes over the outgoing one; inline (mobile) only the image stage
//     wipes
//   - the tire settles from a small offset and scale, the outgoing tire
//     drifts the other way underneath
//   - the giant ghost name rises letter by letter out of its mask
//   - specs, features and CTA follow with a short stagger
// Reduced motion: the new model is simply shown.
//
// Below 1024px panels open inline under their row, so opening one can move
// the row the visitor just tapped. The script compensates with an instant
// scroll so the tapped row stays exactly under their thumb.
// ============================================================================
import { gsap, ScrollTrigger } from "./gsapSetup.js";
import { MOTION_OK, DESKTOP, EASE_OUT, EASE_IN_OUT } from "./motion.js";

const HOVER_INTENT_MS = 120;

export function initMaxxisShowroom() {
  const root = document.querySelector("[data-showroom]");
  if (!root) return;

  const motionQuery = window.matchMedia(MOTION_OK);
  const desktopQuery = window.matchMedia(DESKTOP);
  const indicator = root.querySelector("[data-model-indicator]");

  const models = Array.from(root.querySelectorAll("[data-model]")).map((item, index) => ({
    index,
    item,
    button: item.querySelector("[data-model-button]"),
    panel: item.querySelector("[data-model-panel]"),
  }));
  if (!models.length) return;

  let current = models.find((model) => model.item.hasAttribute("data-default")) ?? models[0];
  let switchTimeline = null;
  const list = root.querySelector("[data-models]");
  const wrap = list?.parentElement;

  // Desktop panels all share one photo-stage height; a panel with longer
  // text grows downward past the list. Reserve room for the tallest one
  // below the showroom, once, so switching models never shifts the page.
  // Hidden panels are measured by un-hiding them for one synchronous
  // read (no paint happens in between).
  function reservePanelSpace() {
    if (!wrap || !list) return;
    let overflow = 0;
    if (desktopQuery.matches) {
      const hiddenPanels = models.filter(({ panel }) => panel.hidden).map(({ panel }) => panel);
      hiddenPanels.forEach((panel) => (panel.hidden = false));
      const tallest = Math.max(...models.map(({ panel }) => panel.offsetHeight));
      hiddenPanels.forEach((panel) => (panel.hidden = true));
      overflow = Math.max(0, Math.ceil(tallest - list.offsetHeight));
    }
    const value = `${overflow}px`;
    if (wrap.style.getPropertyValue("--panel-overflow") !== value) {
      wrap.style.setProperty("--panel-overflow", value);
      ScrollTrigger.refresh();
    }
  }

  models.forEach((model) => setOpen(model, model === current));
  moveIndicator();
  reservePanelSpace();

  function setOpen(model, isOpen) {
    model.button.setAttribute("aria-expanded", String(isOpen));
    model.panel.hidden = !isOpen;
  }

  function moveIndicator() {
    if (!indicator) return;
    const { offsetTop, offsetHeight } = current.button;
    indicator.style.transform = `translateY(${offsetTop}px) scaleY(${offsetHeight})`;
  }

  function select(next, { keepRowInPlace = false } = {}) {
    if (next === current) return;

    // Finish any switch still running so panels never pile up.
    switchTimeline?.progress(1);

    const previous = current;
    const direction = next.index > previous.index ? 1 : -1;
    const isStage = desktopQuery.matches;
    const rowTopBefore = keepRowInPlace ? next.button.getBoundingClientRect().top : null;

    current = next;
    setOpen(next, true);
    previous.button.setAttribute("aria-expanded", "false");

    if (isStage && motionQuery.matches) {
      // Keep the outgoing panel visible under the incoming one until the
      // wipe has covered it.
      next.panel.style.zIndex = "2";
      previous.panel.style.zIndex = "1";
    } else {
      previous.panel.hidden = true;
    }

    moveIndicator();

    if (rowTopBefore !== null && !isStage) {
      const shift = next.button.getBoundingClientRect().top - rowTopBefore;
      if (shift) window.scrollBy({ top: shift, behavior: "instant" });
    }

    // Inline panels change the page height; later scroll triggers must
    // re-measure.
    if (!isStage) ScrollTrigger.refresh();

    if (motionQuery.matches) {
      switchTimeline = reveal(next.panel, direction, isStage ? previous.panel : null);
    }
  }

  // Desktop: the whole panel (it sits over the outgoing one). Inline
  // layouts: just the image stage.
  const clipTargetFor = (panel) =>
    desktopQuery.matches ? panel : panel.querySelector("[data-panel-stage]");

  function reveal(panel, direction, outgoingPanel) {
    const q = gsap.utils.selector(panel);
    const fromClip = direction > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
    const clipTarget = clipTargetFor(panel);
    const animated = [clipTarget, q("[data-panel-media] img"), q("[data-ghost-char]"), q("[data-panel-detail]")];
    const outgoingImage = outgoingPanel?.querySelector("[data-panel-media] img");

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      onComplete: () => {
        gsap.set(animated, { clearProps: "all" });
        if (outgoingPanel) {
          outgoingPanel.hidden = true;
          outgoingPanel.style.zIndex = "";
          if (outgoingImage) gsap.set(outgoingImage, { clearProps: "all" });
        }
        panel.style.zIndex = "";
      },
    });

    tl.fromTo(
      clipTarget,
      { clipPath: fromClip },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: EASE_IN_OUT },
      0,
    )
      .fromTo(
        q("[data-panel-media] img"),
        { yPercent: 10 * direction, scale: 1.06 },
        { yPercent: 0, scale: 1, duration: 1.1 },
        0.1,
      )
      .fromTo(
        q("[data-ghost-char]"),
        { yPercent: 100 * direction },
        { yPercent: 0, duration: 0.8, stagger: 0.02 },
        0.2,
      )
      .fromTo(
        q("[data-panel-detail]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
        0.35,
      );

    if (outgoingImage) {
      tl.to(outgoingImage, { yPercent: -8 * direction, duration: 0.85, ease: EASE_IN_OUT }, 0);
    }

    return tl;
  }

  // ---- Input ---------------------------------------------------------------

  const buttons = models.map((model) => model.button);

  models.forEach((model) => {
    const { button } = model;
    let hoverTimer = 0;

    button.addEventListener("click", () => {
      select(model, { keepRowInPlace: true });
      // Analytics hook (src/scripts/analytics.js): explicit choices only -
      // hover/focus browsing is not reported.
      document.dispatchEvent(
        new CustomEvent("nos:model-select", {
          detail: { brand: "Maxxis", model: button.dataset.trackModel, location: "maxxis" },
        }),
      );
    });

    // Desktop: focusing a row shows it (the stage sits beside the list, so
    // nothing moves). Touch layouts wait for an explicit tap/Enter.
    button.addEventListener("focus", () => {
      if (desktopQuery.matches) select(model);
    });

    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse" || !desktopQuery.matches) return;
      hoverTimer = window.setTimeout(() => select(model), HOVER_INTENT_MS);
    });
    button.addEventListener("pointerleave", () => window.clearTimeout(hoverTimer));

    button.addEventListener("keydown", (event) => {
      const i = buttons.indexOf(button);
      const target = {
        ArrowDown: buttons[(i + 1) % buttons.length],
        ArrowUp: buttons[(i - 1 + buttons.length) % buttons.length],
        Home: buttons[0],
        End: buttons[buttons.length - 1],
      }[event.key];
      if (!target) return;
      event.preventDefault();
      target.focus();
    });
  });

  window.addEventListener("resize", () => {
    moveIndicator();
    reservePanelSpace();
  });
  document.fonts?.ready.then(() => {
    moveIndicator();
    reservePanelSpace();
  });
  desktopQuery.addEventListener("change", () => {
    switchTimeline?.progress(1);
    // The wipe clips a different element per layout; never leave a stale
    // clip behind when the layout flips.
    models.forEach(({ panel }) =>
      gsap.set([panel, panel.querySelector("[data-panel-stage]")], { clearProps: "clipPath" }),
    );
    moveIndicator();
    reservePanelSpace();
  });

  // ---- Entrance (once, on scroll) -------------------------------------------
  // The list names rise out of their masks with a stagger and the open
  // model's stage wipes in - one orchestrated moment, not a fade on every
  // element.
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    const names = root.querySelectorAll("[data-model-name]");
    const types = root.querySelectorAll("[data-model-type]");
    gsap.set(names, { yPercent: 110 });
    gsap.set(types, { opacity: 0 });
    gsap.set(clipTargetFor(current.panel), { clipPath: "inset(100% 0% 0% 0%)" });

    ScrollTrigger.create({
      trigger: root,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(names, { yPercent: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.06, clearProps: "transform" });
        gsap.to(types, { opacity: 1, duration: 0.6, stagger: 0.06, delay: 0.3, clearProps: "opacity" });
        switchTimeline = reveal(current.panel, 1, null);
      },
    });
  });
}
