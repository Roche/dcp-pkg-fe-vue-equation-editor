<template>
    <v-combobox :label="label" :model-value="chipTokens" :items="filteredOptions" autocomplete="off" multiple clearable
        menu-icon="" item-title="label" item-value="id" @keydown.enter.prevent="onEnter" @click:clear="$emit('clear')"
        @update:modelValue="$emit('input', $event)" variant="underlined" hide-details>

        <template #selection="{ item }">
            <component :is="getChipType(item.raw)" :item="item.raw" :key="item.value" />
        </template>

        <template v-slot:divider="{ props }">
            <Divider :item="{ label: props.label }" />
        </template>

        <template v-slot:item="{ props, item }">
            <CompleteOptions :item="item" :onClick="props.onClick" :key="item.raw.id" />
        </template>
    </v-combobox>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { EquationEditor, TokenType, FormulaDetails } from '@open-dcp/equation-editor';
import type { FormattedOption } from '@/composables/useOptionFormatter';
import VariableChip from '@/components/chips/VariableChip.vue';
import MathSymbolChip from '@/components/chips/MathSymbolChip.vue';
import NumericChip from '@/components/chips/NumericChip.vue';
import ParenthesesChip from '@/components/chips/ParenthesesChip.vue';
import FunctionChip from '@/components/chips/FunctionChip.vue';
import ArgumentSeparatorChip from '@/components/chips/ArgumentSeparatorChip.vue';
import StringChip from '@/components/chips/StringChip.vue';
import UnknownChip from '@/components/chips/UnknownChip.vue';
import CompleteOptions from '@/components/CompleteOptions.vue';
import OperatorChip from '@/components/chips/OperatorChip.vue';
import Divider from '@/components/options/Divider.vue';

defineModel<FormulaDetails>();

const props = defineProps({
    editor: {
        type: Object as () => EquationEditor,
        required: true
    },
    chipTokens: {
        type: Array as () => Array<{ label: string; value: string; type: string; raw: any }>,
        required: true
    },
    filteredOptions: {
        type: Array as () => FormattedOption[],
        required: true
    },
    label: {
        type: String,
        required: false
    }
});

const emit = defineEmits<{
    input: [value: Array<any>];
    enter: [input: string];
    clear: [];
}>();

function getChipType(item: { type: string }) {
    if (item.type === TokenType.MathSymbol) return MathSymbolChip;
    if (item.type === TokenType.Parenthesis) return ParenthesesChip;
    if (item.type === TokenType.LeftBracket) return ParenthesesChip;
    if (item.type === TokenType.RightBracket) return ParenthesesChip;
    if (item.type === TokenType.Number) return NumericChip;
    if (item.type === TokenType.Function) return FunctionChip;
    if (item.type === TokenType.ArgumentSeparator) return ArgumentSeparatorChip;
    if (item.type === TokenType.String) return StringChip;
    if (item.type === TokenType.Variable) return VariableChip;
    if (item.type === TokenType.Operator) return OperatorChip;
    return UnknownChip;
}

async function onEnter(e: KeyboardEvent) {
    e.preventDefault();
    const input = (e.target as HTMLInputElement).value.trim();
    await nextTick();
    if (input) {
        emit('enter', input);
    }
}
</script>