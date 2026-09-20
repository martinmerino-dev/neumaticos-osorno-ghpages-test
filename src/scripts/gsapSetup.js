// ============================================================================
// GSAP SETUP
// ============================================================================
// Registers the ScrollTrigger plugin exactly once and re-exports `gsap` so
// every other animation script imports from this one file instead of
// importing "gsap"/"gsap/ScrollTrigger" directly and re-registering the
// plugin repeatedly.
// ============================================================================
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
