// Pure number helpers for the dose/drink tiles. DOM-free so node:test can import it.

// One -/+ step, rounded so 16.4 - 1 is 15.4, not 15.399999999999999. Hundredths,
// or the step's own precision when it is finer (the grind tile steps by 0.025).
// An optional `min` keeps a large step from going below the tile's floor.
export function stepValue(value, step, direction, min = -Infinity) {
    const places = Math.max(2, (String(step).split('.')[1] || '').length);
    const scale = 10 ** places;
    return Math.max(min, Math.round((value + direction * step) * scale) / scale);
}

// Two decimals when they carry information (1:2.52), one otherwise (1:2.0, 1:2.5).
export function formatRatio(ratio) {
    const two = ratio.toFixed(2);
    return two.endsWith('0') ? ratio.toFixed(1) : two;
}
