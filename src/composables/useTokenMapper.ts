import { TokenType } from '@open-dcp/equation-editor';

function resolveTokenValue(token: any): string {
    const type = token.type as TokenType;

    // Variables are rendered by label in the editor and converted to raw values later.
    if (type === TokenType.Variable) {
        return token.label ?? token.value;
    }

    // Operators/functions/math symbols should use their parser value to support custom label/value pairs.
    return token.value ?? token.label;
}

export function mapTokensForFormula(tokens: Array<any>) {
    const mapped: Array<any> = [];
    for (let i = 0; i < tokens.length; i++) {
        const current = tokens[i].raw ?? tokens[i];
        const mappedToken: any = { 
            type: current.type as TokenType, 
            value: resolveTokenValue(current) 
        };
        
        // Preserve data property if it exists
        if (current.data) {
            mappedToken.data = current.data;
        }
        
        mapped.push(mappedToken);

        // If this is a function and it's the last token, add '('
        if (current.type === TokenType.Function && i === tokens.length - 1) {
            mapped.push({ type: TokenType.Parenthesis, value: '(' });
        }
    }
    return mapped;
}