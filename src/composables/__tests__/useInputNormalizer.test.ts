import { describe, it, expect } from 'vitest';
import { normalizeLocalizedOperators } from '../useInputNormalizer';

describe('normalizeLocalizedOperators', () => {
  it('normalizes localized operator labels to canonical parser values', () => {
    const aliases = [
      { label: 'between', value: 'between' },
      { label: 'zwischen', value: 'between' }
    ];

    const english = normalizeLocalizedOperators('Druck_P1.U Between [ 10 , 100 ]', aliases);
    const german = normalizeLocalizedOperators('Druck_P1.U Zwischen [ 10 , 100 ]', aliases);

    expect(english).toBe('Druck_P1.U between [ 10 , 100 ]');
    expect(german).toBe('Druck_P1.U between [ 10 , 100 ]');
  });

  it('does not replace operator words inside identifiers', () => {
    const aliases = [{ label: 'zwischen', value: 'between' }];

    const normalized = normalizeLocalizedOperators('my_zwischen_sensor zwischen [ 10 , 100 ]', aliases);

    expect(normalized).toBe('my_zwischen_sensor between [ 10 , 100 ]');
  });
});
