<template>
    <v-chip color="secondary">
        <v-icon v-if="icon" :size="10">{{ icon }}</v-icon>
        <span v-else>{{ item.label }}</span>
    </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    item: { label: string }
}>();

const iconMap: Record<string, string> = {
    '+': 'mdi-plus',
    '-': 'mdi-minus',
    '*': 'mdi-multiplication',
    '/': 'mdi-division'
};

const icon = computed(() => iconMap[props.item.label] || '');
</script>