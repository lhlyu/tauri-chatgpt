<template>
    <div class="select">
        <select :value="modelValue" @change="change">
            <slot></slot>
        </select>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.select {
    border: 1px solid rgba(0, 154, 255, 0.4);
    padding: 10px;
    border-radius: 6px;
    min-width: 260px;

    select {
        appearance: none;
        outline: none;
        border: 0;
        width: 100%;
        background: transparent;
    }
}
</style>
