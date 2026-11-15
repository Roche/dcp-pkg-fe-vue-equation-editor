<template>
    <button type="button" class="dcp-equation-editor-function-button" :aria-label="accessibleLabel" :title="tooltipText"
        @click="$emit('click', $event)">
        <i v-if="normalizedIcon" class="mdi" :class="`mdi-${normalizedIcon}`" aria-hidden="true"></i>
        <span v-else class="dcp-equation-editor-function-button__label">{{ label }}</span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    label: string;
    icon?: string;
    ariaLabel?: string;
    tooltip?: string;
}>();

defineEmits<{
    click: [event: MouseEvent];
}>();

const normalizedIcon = computed(() => props.icon?.replace(/^mdi-/, ''));
const accessibleLabel = computed(() => props.ariaLabel || props.label);
const tooltipText = computed(() => props.tooltip || props.label);
</script>

<style>
.dcp-equation-editor-function-button {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 100%;
    background-color: transparent;
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

.dcp-equation-editor-function-button:hover {
    background-color: color-mix(in srgb, currentColor 8%, transparent);
    border-color: color-mix(in srgb, currentColor 28%, transparent);
}

.dcp-equation-editor-function-button:active {
    transform: translateY(1px);
}

.dcp-equation-editor-function-button:focus-visible {
    outline: 2px solid color-mix(in srgb, currentColor 55%, transparent);
    outline-offset: 1px;
}

.dcp-equation-editor-function-button>.mdi,
.dcp-equation-editor-function-button__label {
    font-size: 0.95rem;
    line-height: 1;
}
</style>