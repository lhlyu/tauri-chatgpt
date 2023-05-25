<template>
    <div class="input-box">
        <input :type="type" :value="modelValue" :maxlength="maxlength" :placeholder="placeholder" @input="change" />
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
    modelValue: {
        type: (String || Number) as PropType<string | number>,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    maxlength: {
        type: Number,
        default: 200
    }
})

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.input-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    font-size: 14px;
    border: 1px solid var($line-color);
    border-radius: 4px;

    input {
        width: 100%;
        margin: 0;
        color: inherit;
        letter-spacing: 1px;
        background-color: transparent;
        border: 0;
        outline: none;
    }
}
</style>
