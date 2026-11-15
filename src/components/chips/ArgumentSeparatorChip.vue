<template>
    <v-chip color="success" label>
        {{ item.label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    item: { label: string }
}>();
</script>