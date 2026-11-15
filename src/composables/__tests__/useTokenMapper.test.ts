import { describe, it, expect } from 'vitest';
import { mapTokensForFormula } from '../useTokenMapper';
import { TokenType } from '@open-dcp/equation-editor';

describe('mapTokensForFormula', () => {
  it('should map tokens correctly', () => {
    const tokens = [
      { type: TokenType.Variable, label: 'x' },
      { type: TokenType.MathSymbol, label: '+' },
      { type: TokenType.Variable, label: 'y' }
    ];

    const result = mapTokensForFormula(tokens);

    expect(result).toEqual([
      { type: TokenType.Variable, value: 'x' },
      { type: TokenType.MathSymbol, value: '+' },
      { type: TokenType.Variable, value: 'y' }
    ]);
  });

  it('should add opening parenthesis after function if it is the last token', () => {
    const tokens = [
      { type: TokenType.Variable, label: 'x' },
      { type: TokenType.Function, label: 'sqrt' }
    ];

    const result = mapTokensForFormula(tokens);

    expect(result).toEqual([
      { type: TokenType.Variable, value: 'x' },
      { type: TokenType.Function, value: 'sqrt' },
      { type: TokenType.Parenthesis, value: '(' }
    ]);
  });

  it('should map custom operators using value instead of label', () => {
    const tokens = [
      { type: TokenType.Variable, label: 'x', value: 'var_x' },
      { type: TokenType.Operator, label: 'AND', value: '&&' },
      { type: TokenType.Variable, label: 'y', value: 'var_y' }
    ];

    const result = mapTokensForFormula(tokens);

    expect(result).toEqual([
      { type: TokenType.Variable, value: 'x' },
      { type: TokenType.Operator, value: '&&' },
      { type: TokenType.Variable, value: 'y' }
    ]);
  });

  it('should preserve data property when mapping tokens', () => {
    const tokens = [
      { 
        type: TokenType.Variable, 
        label: 'temperature', 
        value: 'sensor_temp',
        data: { unit: 'celsius', sensorId: 'TEMP001' }
      },
      { type: TokenType.MathSymbol, label: '+' },
      { 
        type: TokenType.Variable, 
        label: 'pressure', 
        value: 'sensor_pressure',
        data: { unit: 'pascal', sensorId: 'PRES001' }
      }
    ];

    const result = mapTokensForFormula(tokens);

    expect(result).toEqual([
      { 
        type: TokenType.Variable, 
        value: 'temperature',
        data: { unit: 'celsius', sensorId: 'TEMP001' }
      },
      { type: TokenType.MathSymbol, value: '+' },
      { 
        type: TokenType.Variable, 
        value: 'pressure',
        data: { unit: 'pascal', sensorId: 'PRES001' }
      }
    ]);
  });
});