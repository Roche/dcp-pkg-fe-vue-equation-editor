<template>
    <div class="dcp-equation-editor-option-divider" @click.stop>
        <span class="dcp-equation-editor-option-divider__label">{{ item.label }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    item: { label: string }
}>();
</script>

<style scoped>
.dcp-equation-editor-option-divider {
    position: relative;
    display: flex;
    justify-content: center;
    margin: 0.5rem 0;
}

.dcp-equation-editor-option-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    transform: translateY(-50%);
}

.dcp-equation-editor-option-divider__label {
    position: relative;
    z-index: 1;
    padding: 0 0.5rem;
    background-color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
}
</style>