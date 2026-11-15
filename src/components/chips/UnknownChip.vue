<template>
    <v-chip color="error" prepend-icon="mdi-alert-circle-outline" label>
        {{ item.label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    item: { label: string }
}>();
</script>