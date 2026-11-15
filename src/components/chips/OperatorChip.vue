<template>
    <v-chip color="secondary">
        {{ item.label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    item: { label: string }
}>();
</script>