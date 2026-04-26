import { describe, expect, it } from 'vitest';

import { clamp, minutesToHours, parseCurrencyToCents } from './format';

describe('format utils', () => {
  it('parses Brazilian currency strings to cents', () => {
    expect(parseCurrencyToCents('1.234,56')).toBe(123456);
    expect(parseCurrencyToCents('')).toBe(0);
  });

  it('formats minutes into compact hour labels', () => {
    expect(minutesToHours(45)).toBe('45min');
    expect(minutesToHours(125)).toBe('2h 05min');
  });

  it('clamps a number inside a range', () => {
    expect(clamp(8, 1, 5)).toBe(5);
    expect(clamp(-2, 1, 5)).toBe(1);
    expect(clamp(3, 1, 5)).toBe(3);
  });
});
