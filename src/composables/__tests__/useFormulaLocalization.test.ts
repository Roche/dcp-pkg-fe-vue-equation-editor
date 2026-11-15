import { describe, it, expect } from 'vitest';
import { TokenType } from '@open-dcp/equation-editor';
import { getLocalizedDisplay, getLocalizedUnfancedDisplay } from '../useFormulaLocalization';

describe('getLocalizedDisplay', () => {
  it('uses localized labels for operators and math symbols', () => {
    const details = {
      display: '{sensor_a} && {sensor_b} + 1',
      tokens: [
        { type: TokenType.Variable, value: 'sensor_a', label: 'sensor_a' },
        { type: TokenType.Operator, value: '&&', label: 'AND' },
        { type: TokenType.Variable, value: 'sensor_b', label: 'sensor_b' },
        { type: TokenType.MathSymbol, value: '+', label: 'plus' },
        { type: TokenType.Number, value: '1', label: '1' }
      ]
    } as any;

    const localized = getLocalizedDisplay(details, {
      variableOpen: '{',
      variableClose: '}',
      numberOpen: null,
      numberClose: null
    });

    expect(localized).toBe('{sensor_a} AND {sensor_b} plus 1');
  });

  it('falls back to formula display when no tokens are present', () => {
    const details = {
      display: 'x + y',
      tokens: []
    } as any;

    const localized = getLocalizedDisplay(details);

    expect(localized).toBe('x + y');
  });
});

describe('getLocalizedUnfancedDisplay', () => {
  it('removes variable fences from localized display', () => {
    const localizedDisplay = '{sensor_a} AND {sensor_b}';
    const variables = [
      { label: 'sensor_a', value: 'sensor_a' },
      { label: 'sensor_b', value: 'sensor_b' }
    ] as any;

    const unfanced = getLocalizedUnfancedDisplay(localizedDisplay, variables, {
      variableOpen: '{',
      variableClose: '}',
      numberOpen: null,
      numberClose: null
    });

    expect(unfanced).toBe('sensor_a AND sensor_b');
  });

  it('uses default fence when not provided', () => {
    const localizedDisplay = '{x} + {y}';
    const variables = [
      { label: 'x', value: 'x' },
      { label: 'y', value: 'y' }
    ] as any;

    const unfanced = getLocalizedUnfancedDisplay(localizedDisplay, variables);

    expect(unfanced).toBe('x + y');
  });
});