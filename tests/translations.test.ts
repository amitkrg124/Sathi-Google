import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../src/data/translations';

describe('Bilingual Translation Coverage & Integrity', () => {
  it('should have both Hindi and English translation sets fully defined', () => {
    expect(TRANSLATIONS.hi).toBeDefined();
    expect(TRANSLATIONS.en).toBeDefined();
  });

  it('should contain matching keys across both Hindi and English dictionaries', () => {
    const hindiKeys = Object.keys(TRANSLATIONS.hi);
    const englishKeys = Object.keys(TRANSLATIONS.en);

    expect(hindiKeys.length).toBeGreaterThan(50);
    expect(hindiKeys.sort()).toEqual(englishKeys.sort());
  });

  it('should have non-empty emergency SOS and safety strings', () => {
    expect(TRANSLATIONS.hi.emergencySosTitle.length).toBeGreaterThan(0);
    expect(TRANSLATIONS.en.emergencySosTitle.length).toBeGreaterThan(0);
    expect(TRANSLATIONS.hi.cardExplainTitle).toBeDefined();
  });
});
