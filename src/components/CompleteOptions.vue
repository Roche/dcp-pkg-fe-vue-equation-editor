<template>
    <component :is="getOptionType(item.raw)" v-bind="getBinding(item.raw, props)" :item="item.raw" />
</template>

<script setup lang="ts">
import { TokenType } from '@open-dcp/equation-editor';
import Variable from '@/components/options/Variable.vue';
import Divider from '@/components/options/Divider.vue';
import MathSymbol from '@/components/options/MathSymbol.vue';
import Parentheses from '@/components/options/Parentheses.vue';
import FunctionOption from '@/components/options/Function.vue';
import OperatorOption from '@/components/options/Operator.vue';
const props = defineProps<{
    item: { raw: { type: string, label: string, subtitle?: string, data?: Record<string, any> }, props: any },
    onClick: () => void
}>();

function getOptionType(item: { type: string }) {
    if (item.type === 'divider') return Divider;
    if (item.type === TokenType.MathSymbol) return MathSymbol;
    if (item.type === TokenType.Parenthesis) return Parentheses;
    if (item.type === TokenType.LeftBracket) return Parentheses;
    if (item.type === TokenType.RightBracket) return Parentheses;
    if (item.type === TokenType.ArgumentSeparator) return MathSymbol;
    if (item.type === TokenType.Function) return FunctionOption;
    if (item.type === TokenType.Operator) return OperatorOption;
    return Variable;
}

function getBinding(item: { type: string }, props: { onClick: () => void }) {
    if (item.type === 'divider') return {};
    return { onClick: props.onClick };
}
</script>