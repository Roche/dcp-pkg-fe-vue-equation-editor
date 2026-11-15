<template>
    <v-chip color="primary" label>
        {{ item.label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    item: { label: string }
}>();
</script>