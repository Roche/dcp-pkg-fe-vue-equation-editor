<template>
    <v-list-item>
        <ParenthesesChip :item="item" />
    </v-list-item>
</template>

<script setup lang="ts">
import ParenthesesChip from '@/components/chips/ParenthesesChip.vue';

defineProps<{
    item: { label: string }
}>();
</script>