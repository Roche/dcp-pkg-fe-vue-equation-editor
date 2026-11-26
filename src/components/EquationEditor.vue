<template>
    <div class="dcp-equation-editor-instance">
        <div class="flex items-center gap-2">
            <EditorCombobox ref="comboboxRef" :label="label" v-if="!showRaw" @clear="editor.clear()" @enter="onEnter" @input="onInput"
                :editor="editor" :filtered-options="filteredOptions" :chip-tokens="chipTokens" />

            <EditorDisplayText :filtered-options="filteredOptions" @clear="editor.clear()" :label="label"
                @update:model-value="onTextUpdate" :model-value="modelValue?.display || ''" v-else />

            <EditorFunctions v-if="showEditorFunctions" :no-copy-button="noCopyButton" :no-raw-toggle="noRawToggle"
                @copy="handleCopy" :show-raw="showRaw" @toggleRaw="handleToggleRaw">
                <template #copy-button="slotProps">
                    <slot name="copy-button" v-bind="slotProps" />
                </template>

                <template #raw-toggle-button="slotProps">
                    <slot name="raw-toggle-button" v-bind="slotProps" />
                </template>
            </EditorFunctions>
        </div>

        <div v-if="hasErrors" class="grid gap-2" role="alert">
            <div v-for="error in errorsToShow" :key="error" class="dcp-equation-editor-error w-full">{{ error }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, PropType, watch, useSlots, provide } from 'vue';
import { formatNextOptions, FormattedOption, DescriptionVisibility } from '@/composables/useOptionFormatter';
import { mapTokensForFormula } from '@/composables/useTokenMapper';
import { normalizeLocalizedOperators } from '@/composables/useInputNormalizer';
import { getLocalizedDisplay, getLocalizedUnfancedDisplay } from '@/composables/useFormulaLocalization';
import {
    EquationEditor,
    joinTokensNormalized,
    TokenType,
    FormulaDetails,
    Parenthesis,
    CustomValidatorFunction,
    getBuiltInOperatorsForMode,
    Operator,
    Variable
} from '@open-dcp/equation-editor';
import EditorCombobox from '@/components/EditorCombobox.vue';
import EditorDisplayText from '@/components/EditorDisplayText.vue';
import EditorFunctions from '@/components/EditorFunctions.vue';
import { logger } from '@open-dcp/utilities';
import type { LocalizedFormulaDetails } from '@/types';

type FunctionInput = string | {
    label: string;
    value?: string;
    description?: string;
    data?: Record<string, any>;
};

const modelValue = defineModel<LocalizedFormulaDetails>();
const comboboxRef = ref();

const props = defineProps({
    variables: {
        type: Array as () => Variable[],
        required: true
    },
    functions: {
        type: Array as PropType<FunctionInput[]>,
        default: () => []
    },
    operators: {
        type: Array as () => Operator[],
        default: () => []
    },
    customValidator: {
        type: Function as PropType<CustomValidatorFunction>,
        required: false
    },
    ignoreInternalErrors: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        required: false
    },
    fence: {
        type: Object as PropType<{
            variableOpen?: string;
            variableClose?: string;
            numberOpen?: string | null;
            numberClose?: string | null;
        }>,
        default: () => ({
            variableOpen: '{',
            variableClose: '}',
            numberOpen: null,
            numberClose: null
        })
    },
    failOnUnknown: {
        type: Boolean,
        default: false
    },
    noRawToggle: {
        type: Boolean,
        default: false
    },
    noCopyButton: {
        type: Boolean,
        default: false
    },
    translation: {
        type: Object,
        required: false,
    },
    nbrOfErrorsToShow: {
        type: [Number, null],
        default: 1
    },
    startInRawMode: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String as PropType<'formula' | 'equation'>,
        default: 'formula'
    },
    ignoreDescription: {
        type: Object as PropType<DescriptionVisibility>,
        default: () => ({
            variables: false,
            operators: false,
            functions: false
        })
    }
});

const emit = defineEmits<{
    errors: [errors: string[]];
    copy: [];
    toggleRaw: [showRaw: boolean];
}>();

provide('t', props.translation?.translator ?? ((key: string) => key));
provide('translationPrefix',
    `${props.translation?.translationPrefix ? props.translation?.translationPrefix + '.' : ''}equation-editor.`
);

const slots = useSlots();

const showRaw = ref(props.startInRawMode);
const showEditorFunctions = computed(
    () => !props.noCopyButton || !props.noRawToggle || !!slots['copy-button'] || !!slots['raw-toggle-button']
);

const chipTokens = ref<Array<{ label: string; value: string; type: string; raw: any }>>([]);

const normalizedFunctions = computed(() => props.functions.map((fn: FunctionInput) =>
    typeof fn === 'string' ? fn : (fn.value ?? fn.label)
));

const functionMetadataByLabel = computed(() => {
    const map: Record<string, { description?: string; data?: Record<string, any> }> = {};

    props.functions.forEach((fn: FunctionInput) => {
        if (typeof fn === 'string') return;

        const key = fn.value ?? fn.label;
        map[key] = {
            description: fn.description ?? fn.data?.description,
            data: fn.data
        };
    });

    return map;
});

function createEditor(initialFormula: string) {
    return new EquationEditor(
        initialFormula,
        props.variables,
        normalizedFunctions.value,
        props.operators,
        {
            variableFenceOpen: props.fence.variableOpen ?? '{',
            variableFenceClose: props.fence.variableClose ?? '}',
            numberFenceOpen: props.fence.numberOpen ?? undefined,
            numberFenceClose: props.fence.numberClose ?? undefined,
            failOnUnknown: props.failOnUnknown,
            translator: props.translation?.translator ?? undefined,
            translationPrefix: props.translation?.translationPrefix ?? undefined,
            mode: props.mode,
            customValidator: props.customValidator,
            ignoreInternalErrors: props.ignoreInternalErrors
        }
    );
}

const editor = createEditor(modelValue.value?.display || '');
const errors = ref<string[]>([]);
const errorsToShow = computed(() => {
    if (props.nbrOfErrorsToShow === null) return errors.value;
    return errors.value.slice(0, props.nbrOfErrorsToShow);
});
const filteredOptions = ref<FormattedOption[]>([]);
const hasErrors = computed(() => errors.value && errors.value.length > 0);

watch(errors, (newErrors) => {
    emit('errors', newErrors);
});

// `display` last emitted by the editor itself; used to tell parent-driven v-model changes apart from echoes.
let lastEmittedDisplay: string | undefined;

let validSubscription: any;
let tokenSubscription: any;
let formulaDetailsSubscription: any;

function getOperatorAliases(): Array<{ label: string; value: string }> {
    const aliases: Array<{ label: string; value: string }> = [];
    const operatorValues = new Set<string>();

    getBuiltInOperatorsForMode(props.mode).forEach(operator => {
        operatorValues.add(operator.value);
    });

    props.operators.forEach(operator => {
        if (operator.label && operator.value) {
            aliases.push({ label: operator.label, value: operator.value });
            operatorValues.add(operator.value);
        }
    });

    filteredOptions.value.forEach(option => {
        if (option.type === TokenType.Operator && option.label && option.value) {
            aliases.push({ label: option.label, value: option.value });
            operatorValues.add(option.value);
        }
    });

    const translator = props.translation?.translator;
    const translationPrefix = props.translation?.translationPrefix;

    if (translator && translationPrefix) {
        operatorValues.forEach(operatorValue => {
            // Symbolic operators are not translated in the upstream editor.
            if (!/^[\p{L}\p{N}_]+$/u.test(operatorValue)) {
                return;
            }

            const key = `${translationPrefix}.filter.operator.${operatorValue}`;
            const translated = translator(key, {
                value: operatorValue,
                key: operatorValue,
                label: operatorValue,
                category: 'comparison'
            });

            if (translated && translated !== key) {
                aliases.push({ label: translated, value: operatorValue });
            }
        });
    }

    return aliases;
}

function normalizeInputOperators(input: string): string {
    return normalizeLocalizedOperators(input, getOperatorAliases());
}

function bindSubscriptions() {
    validSubscription = editor.valid$.subscribe(valid => {
        errors.value = valid;
    });

    tokenSubscription = editor.getTokens$().subscribe(tokens => {
        chipTokens.value = tokens.map((t, i) => ({
            label: t.type === TokenType.Variable ? t.value : t.label ?? t.value,
            value: `${t.value}_${i}`,
            type: t.type,
            raw: t
        }));

        const nextOptions = editor.getNextOptions();
        filteredOptions.value = formatNextOptions(nextOptions, {
            functionMetadataByLabel: functionMetadataByLabel.value,
            ignoreDescription: props.ignoreDescription
        });
    });

    formulaDetailsSubscription = editor.formulaDetails$.subscribe((details: FormulaDetails) => {
        lastEmittedDisplay = details.display ?? '';
        const localizedDisplay = getLocalizedDisplay(details, props.fence);
        modelValue.value = {
            ...details,
            localizedDisplay,
            localizedUnfancedDisplay: getLocalizedUnfancedDisplay(localizedDisplay, props.variables, props.fence)
        };
    });
}

function unbindSubscriptions() {
    if (validSubscription) validSubscription.unsubscribe();
    if (tokenSubscription) tokenSubscription.unsubscribe();
    if (formulaDetailsSubscription) formulaDetailsSubscription.unsubscribe();
}

onMounted(() => {
    bindSubscriptions();
    editor.updateFormula(modelValue.value?.display || '');
});

// Apply v-model changes made by the parent after mount (formula loaded asynchronously, form reset,
// switching records). Changes that are just the editor's own emission coming back are ignored.
watch(() => modelValue.value?.display, (display) => {
    const next = display ?? '';
    if (next === lastEmittedDisplay) {
        return;
    }

    editor.updateFormula(normalizeInputOperators(next));
});

onUnmounted(() => {
    unbindSubscriptions();
});

watch(
    [
        () => props.variables,
        () => props.functions,
        () => props.operators,
        () => props.fence,
        () => props.failOnUnknown,
        () => props.translation,
        () => props.mode,
        () => props.ignoreDescription,
        () => props.customValidator,
        () => props.ignoreInternalErrors
    ],
    () => {
        editor.updateOptions({
            variables: props.variables,
            functions: normalizedFunctions.value,
            operators: props.operators,
            config: {
                variableFenceOpen: props.fence.variableOpen ?? '{',
                variableFenceClose: props.fence.variableClose ?? '}',
                numberFenceOpen: props.fence.numberOpen ?? undefined,
                numberFenceClose: props.fence.numberClose ?? undefined,
                failOnUnknown: props.failOnUnknown,
                translator: props.translation?.translator ?? undefined,
                translationPrefix: props.translation?.translationPrefix ?? undefined,
                mode: props.mode,
                customValidator: props.customValidator,
                ignoreInternalErrors: props.ignoreInternalErrors
            }
        });
    },
    { deep: true }
);

function onInput(newTokens: Array<any>) {
    if (!newTokens) return;

    // Filter out raw string tokens (input field value)
    const filteredTokens = newTokens.filter(t => typeof t === 'object' && t.type);

    // Remove function token if immediately before '('
    const deletedToken = chipTokens.value.length ? chipTokens.value.at(-1)?.raw : null;
    if (
        deletedToken &&
        deletedToken.type === TokenType.Parenthesis &&
        deletedToken.value === Parenthesis.Open
    ) {
        const nextToken = filteredTokens.at(-1);
        if (nextToken && nextToken.type === TokenType.Function) {
            filteredTokens.pop();

            nextTick(() => {
                comboboxRef.value?.focus();
            });
        }
    }

    // If all tokens are removed, clear the formula
    if (filteredTokens.length === 0) {
        editor.clear();
        return;
    }

    // Map tokens and handle functions
    const mappedTokens = mapTokensForFormula(filteredTokens);

    const formulaString = joinTokensNormalized(
        mappedTokens,
        props.fence.variableOpen ?? '{',
        props.fence.variableClose ?? '}',
        props.fence.numberOpen ?? null,
        props.fence.numberClose ?? null
    );
    editor.updateFormula(formulaString);
}

function onEnter(input: string, append: boolean = true) {
    if (input) {
        const currentDisplay = append ? modelValue.value?.display || '' : '';
        const normalizedInput = normalizeInputOperators(input);
        editor.updateFormula(currentDisplay + ' ' + normalizedInput);
    }
}

function onTextUpdate(newText: string | null) {
    if (newText === null) return;

    editor.updateFormula(normalizeInputOperators(newText));
}

function reset(newText: string = '') {
    if (!newText) {
        editor.clear();
        return;
    }

    editor.updateFormula(newText);
}

const isValid = computed(() => errors.value.length === 0);

defineExpose({
    reset,
    isValid,
    errors
});

const handleCopy = () => {
    emit('copy');

    const formula = modelValue.value?.display || '';
    navigator.clipboard.writeText(formula).catch(err => {
        logger.error('Failed to copy formula to clipboard:', err);
    });
};

const handleToggleRaw = () => {
    showRaw.value = !showRaw.value;
    emit('toggleRaw', showRaw.value);
};
</script>

<style>
.dcp-equation-editor-error {
    color: #dc3545;
    font-size: 0.875rem;
}
</style>
