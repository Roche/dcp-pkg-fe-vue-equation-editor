<template>
    <v-chip color="primary" label :prepend-icon="item.raw?.unknown ? 'mdi-progress-question' : undefined">
        {{ item.label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    item: {
        label: string;
        raw?: {
            unknown?: boolean;
            data?: Record<string, any>;
        }
    }
}>();
</script>