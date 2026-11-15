function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export type OperatorAlias = {
    label: string;
    value: string;
};

export function normalizeLocalizedOperators(input: string, aliases: OperatorAlias[]): string {
    if (!input || aliases.length === 0) {
        return input;
    }

    const uniqueAliases = new Map<string, OperatorAlias>();

    for (const alias of aliases) {
        const label = alias.label?.trim();
        const value = alias.value?.trim();

        if (!label || !value) {
            continue;
        }

        const key = label.toLocaleLowerCase();
        if (!uniqueAliases.has(key)) {
            uniqueAliases.set(key, { label, value });
        }
    }

    const aliasesSorted = [...uniqueAliases.values()].sort((a, b) => b.label.length - a.label.length);

    let normalized = input;
    for (const alias of aliasesSorted) {
        const pattern = new RegExp(
            `(^|[^\\p{L}\\p{N}_])(${escapeRegExp(alias.label)})(?=$|[^\\p{L}\\p{N}_])`,
            'giu'
        );
        normalized = normalized.replace(pattern, (_, prefix: string) => `${prefix}${alias.value}`);
    }

    return normalized;
}
