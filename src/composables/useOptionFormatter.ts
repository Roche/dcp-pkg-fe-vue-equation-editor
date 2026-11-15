import { TokenType, Operator } from '@open-dcp/equation-editor';

export type DescriptionVisibility = {
    variables?: boolean;
    operators?: boolean;
    functions?: boolean;
};

export type FormattedOption = {
    id: string;
    label: string;
    value: string;
    type: string;
    subtitle?: string;
    data?: Record<string, any>;
};

type FunctionMetadata = {
    description?: string;
    data?: Record<string, any>;
};

function extractDescription(item: { description?: string; data?: Record<string, any> }): string | undefined {
    return item.description ?? item.data?.description;
}

function withOptionalDescription(subtitle?: string) {
    return subtitle ? { subtitle } : {};
}

function withOptionalData(data?: Record<string, any>) {
    return data ? { data } : {};
}

export function formatNextOptions(nextOptions: {
    variables?: Array<{ label: string; value: string; description?: string; data?: Record<string, any> }>,
    operators?: (string | Operator)[],
    brackets?: string[],
    argumentSeparators?: string[],
    parentheses?: string[],
    functions?: string[]
}, options?: {
    functionMetadataByLabel?: Record<string, FunctionMetadata>;
    ignoreDescription?: DescriptionVisibility;
}) {
    const result: FormattedOption[] = [];
    const ignoreDescription = options?.ignoreDescription ?? {};

    if (nextOptions.variables?.length) {
        result.push(
            { id: 'divider_variables', label: 'Variables', value: 'divider_variables', type: 'divider' },
            ...nextOptions.variables.map((v, index: number) => ({
                id: `variable_${v.value}_${index}`,
                label: v.label,
                value: v.value,
                type: TokenType.Variable,
                ...withOptionalDescription(ignoreDescription.variables ? undefined : extractDescription(v)),
                ...withOptionalData(v.data)
            }))
        );
    }
    if (nextOptions.operators?.length) {
        result.push(
            { id: 'divider_operators', label: 'Operators', value: 'divider_operators', type: 'divider' },
            ...nextOptions.operators.map((op, index: number) => {
                if (typeof op === 'string') {
                    return {
                        id: `math_symbol_${op}_${index}`,
                        label: op,
                        value: op,
                        type: TokenType.MathSymbol
                    };
                } else {
                    // Operator object
                    return {
                        id: `operator_${op.value}_${index}`,
                        label: op.label,
                        value: op.value,
                        type: TokenType.Operator,
                        ...withOptionalDescription(ignoreDescription.operators ? undefined : extractDescription(op)),
                        ...withOptionalData(op.data)
                    };
                }
            })
        );
    }
    const brackets = (nextOptions.brackets ?? []).filter(
        (b: string) => !(nextOptions.argumentSeparators ?? []).includes(b)
    );
    if (brackets.length) {
        result.push(
            { id: 'divider_brackets', label: 'Brackets', value: 'divider_brackets', type: 'divider' },
            ...brackets.map((b: string, index: number) => ({
                id: `bracket_${b}_${index}`,
                label: b,
                value: b,
                type: b === ']' ? TokenType.RightBracket : TokenType.LeftBracket
            }))
        );
    }
    if (nextOptions.argumentSeparators?.length) {
        result.push(
            { id: 'divider_argument_separators', label: 'Separator', value: 'divider_argument_separators', type: 'divider' },
            ...nextOptions.argumentSeparators.map((s: string, index: number) => ({
                id: `argument_separator_${s}_${index}`,
                label: s,
                value: s,
                type: TokenType.ArgumentSeparator
            }))
        );
    }
    if (nextOptions.parentheses?.length) {
        result.push(
            { id: 'divider_parentheses', label: 'Parentheses', value: 'divider_parentheses', type: 'divider' },
            ...nextOptions.parentheses.map((p: string, index: number) => ({
                id: `parenthesis_${p}_${index}`,
                label: p,
                value: p,
                type: TokenType.Parenthesis
            }))
        );
    }
    if (nextOptions.functions?.length) {
        result.push(
            { id: 'divider_functions', label: 'Functions', value: 'divider_functions', type: 'divider' },
            ...nextOptions.functions.map((f: string, index: number) => {
                const metadata = options?.functionMetadataByLabel?.[f];

                return {
                    id: `function_${f}_${index}`,
                    label: f,
                    value: f,
                    type: TokenType.Function,
                    ...withOptionalDescription(ignoreDescription.functions ? undefined : metadata?.description),
                    ...withOptionalData(metadata?.data)
                };
            })
        );
    }
    return result;
}