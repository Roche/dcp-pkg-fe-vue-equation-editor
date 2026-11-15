<template>
    <v-menu v-model="showSuggestions" open-on-focus :close-on-content-click="false" offset-y>
        <template #activator="{ props: menuProps }">
            <v-text-field v-bind="menuProps" ref="inputRef" clearable @click:clear="$emit('clear')"
                :model-value="modelValue" :label="label" hide-details @update:modelValue="onInput"
                variant="underlined" @keydown.esc="onEsc" autocomplete="off" style="min-width: 200px;" />
        </template>
        <v-list elevation="2" rounded style="min-width: 200px;">
            <CompleteOptions v-for="option in filteredOptions"
                :item="{ raw: { type: option.type, label: option.label, subtitle: option.subtitle, data: option.data }, props: option }"
                :onClick="() => onSuggestionClick(option)" :key="option.id" />
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import CompleteOptions from '@/components/CompleteOptions.vue';
import type { FormattedOption } from '@/composables/useOptionFormatter';
import { ref } from 'vue';
import { debounce } from 'lodash-es';

const inputRef = ref();
const showSuggestions = ref(false);

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: false
    },
    filteredOptions: {
        type: Array as () => FormattedOption[],
        required: false
    }
});

const emit = defineEmits(['enter', 'update:modelValue', 'clear']);

function onEsc() {
    showSuggestions.value = false;
}

const emitDebounced = debounce((val: string) => {
    emit('update:modelValue', val);
}, 350);

function onInput(val: string) {
    emitDebounced(val);
}

function onSuggestionClick(option: any) {
    const updated = props.modelValue + option.label;
    emit('update:modelValue', updated);
    inputRef.value.focus();
}
</script>