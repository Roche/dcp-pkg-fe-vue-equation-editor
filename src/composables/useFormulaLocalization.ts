import { FormulaDetails, joinTokensNormalized, TokenType, Variable } from '@open-dcp/equation-editor';

type FenceConfig = {
    variableOpen?: string;
    variableClose?: string;
    numberOpen?: string | null;
    numberClose?: string | null;
};

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getLocalizedDisplay(details: FormulaDetails, fence?: FenceConfig): string {
    if (!details.tokens || details.tokens.length === 0) {
        return details.display;
    }

    const localizedTokens = details.tokens.map(token => {
        if (token.type === TokenType.Operator || token.type === TokenType.MathSymbol) {
            return {
                ...token,
                value: token.label ?? token.value
            };
        }

        return token;
    });

    return joinTokensNormalized(
        localizedTokens,
        fence?.variableOpen ?? '{',
        fence?.variableClose ?? '}',
        fence?.numberOpen ?? null,
        fence?.numberClose ?? null
    );
}

export function getLocalizedUnfancedDisplay(
    localizedDisplay: string,
    variables: Variable[],
    fence?: FenceConfig
): string {
    let localizedUnfancedDisplay = localizedDisplay;

    variables.forEach(variable => {
        const fencedLabel = `${fence?.variableOpen ?? '{'}${variable.label}${fence?.variableClose ?? '}'}`;
        localizedUnfancedDisplay = localizedUnfancedDisplay.replace(
            new RegExp(escapeRegExp(fencedLabel), 'g'),
            // Function replacer: a label like "Cost $&" must be inserted literally, not as a replacement pattern.
            () => variable.label
        );
    });

    return localizedUnfancedDisplay;
}