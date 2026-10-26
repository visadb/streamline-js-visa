// Grind tile policy, ported from the legacy Streamline skin (de1app ffdf75da):
// the -/+ step is 0.025 and the setting is carried and shown at three decimals.
// DOM-free so node tests can import it directly.

export const GRIND_STEP = 0.025;

// Three-decimal rounding of the setting's leading number, so free text such as
// "15 clicks" keeps its 15; a value with no leading number falls back to 0,
// matching the legacy labels' `[ifexists ::settings(grinder_setting) 0]`.
export function roundGrind(value) {
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 1000) / 1000;
}

// Display/storage spelling, always three decimals ("8.250"), like the legacy
// skin's `format "%.3f"`.
export function formatGrind(value) {
    return roundGrind(value).toFixed(3);
}
