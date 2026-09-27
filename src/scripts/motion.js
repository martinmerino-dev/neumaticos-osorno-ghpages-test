// ============================================================================
// MOTION CONSTANTS
// ============================================================================
// Shared media queries and easing names for every GSAP script, so all
// motion on the site shares one vocabulary (JS mirror of the MOTION
// tokens in src/styles/tokens.css).
// ============================================================================

// Full motion is only ever enabled inside this query (AGENTS.md section 9).
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// Pinned / heavier scroll sequences are desktop-only (AGENTS.md section 10).
export const DESKTOP = "(min-width: 1024px)";

export const EASE_OUT = "expo.out";
export const EASE_IN_OUT = "expo.inOut";

// Called when the load-in choreography starts. The inline fail-safe in
// BaseLayout.astro checks for this class and reveals everything if the
// animation never got going (e.g. the JS bundle failed to load).
export function markIntroStarted() {
  document.documentElement.classList.add("intro-started");
}
