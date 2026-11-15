<template>
    <span v-if="text" class="option-subtitle" :title="text">{{ text }}</span>
</template>

<script setup lang="ts">
defineProps<{
    text?: string;
}>();
</script>

<style scoped>
.option-subtitle {
    display: block;
    font-size: 0.75rem;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
