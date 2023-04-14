<template>
    <input :type="type" :value="modelValue" @input="change">
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue?: string | number,
    type?: string
}>(), {
    modelValue: '',
    type: 'text'
})

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    if (props.type === 'number') {
        emit('update:modelValue', Number.parseInt((e.target as HTMLInputElement).value))
        return
    }
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
input {
    outline: none;
    border: 1px solid rgba(0, 154, 255, 0.4);
    padding: 10px;
    border-radius: 6px;
    min-width: 260px;
}
</style>