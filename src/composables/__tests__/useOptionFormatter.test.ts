import { describe, it, expect } from 'vitest';
import { formatNextOptions } from '../useOptionFormatter';
import { TokenType } from '@open-dcp/equation-editor';

describe('formatNextOptions', () => {
  it('should format variables and operators with dividers', () => {
    const nextOptions = {
      variables: [{ label: 'x', value: 'x' }, { label: 'y', value: 'y' }],
      operators: [{ label: '+', value: '+' }, { label: '-', value: '-' }]
    };

    const result = formatNextOptions(nextOptions);

    expect(result).toEqual([
      { id: 'divider_variables', label: 'Variables', value: 'divider_variables', type: 'divider' },
      { id: 'variable_x_0', label: 'x', value: 'x', type: TokenType.Variable },
      { id: 'variable_y_1', label: 'y', value: 'y', type: TokenType.Variable },
      { id: 'divider_operators', label: 'Operators', value: 'divider_operators', type: 'divider' },
      { id: 'operator_+_0', label: '+', value: '+', type: TokenType.Operator },
      { id: 'operator_-_1', label: '-', value: '-', type: TokenType.Operator }
    ]);
  });

  it('should format functions and parentheses', () => {
    const nextOptions = {
      functions: ['sqrt', 'abs'],
      parentheses: ['(', ')']
    };

    const result = formatNextOptions(nextOptions);

    expect(result).toEqual([
      { id: 'divider_parentheses', label: 'Parentheses', value: 'divider_parentheses', type: 'divider' },
      { id: 'parenthesis_(_0', label: '(', value: '(', type: TokenType.Parenthesis },
      { id: 'parenthesis_)_1', label: ')', value: ')', type: TokenType.Parenthesis },
      { id: 'divider_functions', label: 'Functions', value: 'divider_functions', type: 'divider' },
      { id: 'function_sqrt_0', label: 'sqrt', value: 'sqrt', type: TokenType.Function },
      { id: 'function_abs_1', label: 'abs', value: 'abs', type: TokenType.Function }
    ]);
  });

  it('should include subtitles from variable/operator/function metadata', () => {
    const nextOptions = {
      variables: [{
        label: 'temperature',
        value: 'sensor_temp',
        data: { description: 'Main temperature sensor' }
      }],
      operators: [{
        label: 'is equal to',
        value: '=',
        data: { description: 'Exact match comparison' }
      }],
      functions: ['abs']
    };

    const result = formatNextOptions(nextOptions, {
      functionMetadataByLabel: {
        abs: { description: 'Absolute value' }
      }
    });

    expect(result).toContainEqual({
      id: 'variable_sensor_temp_0',
      label: 'temperature',
      value: 'sensor_temp',
      type: TokenType.Variable,
      subtitle: 'Main temperature sensor',
      data: { description: 'Main temperature sensor' }
    });

    expect(result).toContainEqual({
      id: 'operator_=_0',
      label: 'is equal to',
      value: '=',
      type: TokenType.Operator,
      subtitle: 'Exact match comparison',
      data: { description: 'Exact match comparison' }
    });

    expect(result).toContainEqual({
      id: 'function_abs_0',
      label: 'abs',
      value: 'abs',
      type: TokenType.Function,
      subtitle: 'Absolute value'
    });
  });

  it('should hide subtitles for configured token types', () => {
    const nextOptions = {
      variables: [{ label: 'x', value: 'x', data: { description: 'Variable x' } }],
      operators: [{ label: 'is equal to', value: '=', data: { description: 'Equals operator' } }],
      functions: ['abs']
    };

    const result = formatNextOptions(nextOptions, {
      functionMetadataByLabel: {
        abs: { description: 'Absolute value' }
      },
      ignoreDescription: {
        variables: true,
        operators: false,
        functions: true
      }
    });

    expect(result).toContainEqual({
      id: 'variable_x_0',
      label: 'x',
      value: 'x',
      type: TokenType.Variable,
      data: { description: 'Variable x' }
    });

    expect(result).toContainEqual({
      id: 'operator_=_0',
      label: 'is equal to',
      value: '=',
      type: TokenType.Operator,
      subtitle: 'Equals operator',
      data: { description: 'Equals operator' }
    });

    expect(result).toContainEqual({
      id: 'function_abs_0',
      label: 'abs',
      value: 'abs',
      type: TokenType.Function
    });
  });
});