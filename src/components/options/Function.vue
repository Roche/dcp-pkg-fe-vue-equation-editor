<template>
    <v-list-item>
        <template #title>
            <FunctionChip show-parentheses :item="item" />
        </template>

        <template v-if="item.subtitle" #subtitle>
            <OptionSubtitle :text="item.subtitle" />
        </template>
    </v-list-item>
</template>

<script setup lang="ts">
import FunctionChip from '@/components/chips/FunctionChip.vue';
import OptionSubtitle from '@/components/options/OptionSubtitle.vue';

defineProps<{
    item: { label: string; subtitle?: string }
}>();
</script>