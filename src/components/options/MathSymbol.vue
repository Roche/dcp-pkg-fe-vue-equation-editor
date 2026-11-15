<template>
    <v-list-item>
        <MathSymbolChip :item="item" />
    </v-list-item>
</template>

<script setup lang="ts">
import MathSymbolChip from '@/components/chips/MathSymbolChip.vue';

defineProps<{
    item: { label: string }
}>();
</script>