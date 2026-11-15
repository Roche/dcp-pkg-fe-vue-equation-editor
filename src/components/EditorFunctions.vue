<template>
    <slot name="copy-button" :on-click="emitCopy">
        <EditorFunctionButton v-if="!noCopyButton" icon="mdi-content-copy" :label="t(`${prefix}editor-functions.copy`)"
            @click.stop="emitCopy" />
    </slot>

    <slot name="raw-toggle-button" :on-click="emitToggleRaw" :show-raw="showRaw" :icon="rawToggleIcon">
        <EditorFunctionButton v-if="!noRawToggle" :icon="rawToggleIcon"
            :label="showRaw ? t(`${prefix}editor-functions.switch-to-chip`) : t(`${prefix}editor-functions.switch-to-raw`)"
            @click.stop="emitToggleRaw" />
    </slot>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import EditorFunctionButton from '@/components/EditorFunctionButton.vue';

const props = defineProps<{
    noCopyButton?: boolean;
    noRawToggle?: boolean;
    showRaw: boolean;
}>();

const t = inject('t') as (key: string) => string;
const prefix = inject('translationPrefix') as string;

const emit = defineEmits<{
    copy: [];
    toggleRaw: [];
}>();

const rawToggleIcon = computed(() => (props.showRaw ? 'mdi-tag-multiple-outline' : 'mdi-text-recognition'));

const emitCopy = () => emit('copy');
const emitToggleRaw = () => emit('toggleRaw');
</script>