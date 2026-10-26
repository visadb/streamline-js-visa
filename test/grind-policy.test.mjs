// Grind tile policy (src/modules/grind-policy.js), ported from the legacy
// Streamline skin (de1app ffdf75da): 0.025 steps, three-decimal display.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GRIND_STEP, roundGrind, formatGrind } from '../src/modules/grind-policy.js';

test('the grind step matches the legacy skin', () => {
    assert.equal(GRIND_STEP, 0.025);
});

test('roundGrind keeps three decimals and eats float noise', () => {
    assert.equal(roundGrind(1.4 - 0.025), 1.375);
    assert.equal(roundGrind(8.2 + 0.025), 8.225);
    assert.equal(roundGrind(1.2345), 1.235); // fourth decimal rounds, like Tcl round()
    assert.equal(roundGrind('8.250'), 8.25); // the workflow carries strings
});

test('roundGrind falls back to 0 for blank or non-numeric input', () => {
    assert.equal(roundGrind(''), 0);
    assert.equal(roundGrind(undefined), 0);
    assert.equal(roundGrind('n/a'), 0);
});

test('formatGrind always shows three decimals, like the legacy %.3f', () => {
    assert.equal(formatGrind(8.25), '8.250');
    assert.equal(formatGrind(8), '8.000');
    assert.equal(formatGrind('1.4'), '1.400');
    assert.equal(formatGrind(''), '0.000');
});
