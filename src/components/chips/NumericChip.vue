<template>
    <v-chip color="warning" label>
        {{ item.label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    item: { label: string }
}>();
</script>