<template>
    <v-chip color="info" label>
        {{ `${item.label}${showParentheses ? '()' : ''}` }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    item: { label: string },
    showParentheses?: boolean
}>();
</script>