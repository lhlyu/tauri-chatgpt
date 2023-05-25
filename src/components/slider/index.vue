<template>
    <div class="slider">
        <input type="range" :value="modelValue" :min="min" :max="max" :step="step" @input="change" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 100
    },
    step: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    emit('update:modelValue', Number((e.target as HTMLInputElement).value))
}
</script>

<style lang="scss" scoped>
.slider {
    width: 100%;

    input {
        width: 100%;
        height: 6px;
        margin: 0;
        vertical-align: bottom;
        background: var($line-color);
        border: 0;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
        transition: all ease-in 0.25s;
        appearance: none;

        &::-webkit-slider-thumb {
            position: relative;
            width: 15px;
            height: 15px;
            background-color: var($slider-thumb-bg);
            border: 0;
            border-radius: 50%;
            appearance: none;
        }
    }
}
</style>
