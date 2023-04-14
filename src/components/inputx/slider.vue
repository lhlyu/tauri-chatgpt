<template>
    <div class="slider">
        <output>{{ modelValue }}</output>
        <input type="range" :min="min" :max="max" :step="step" :value="modelValue" @input="change"/>
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
    },
})

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.slider {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    input {
        appearance: none;
        height: 8px;
        border-radius: 10px;
        color: rgba(0, 154, 255, 1);
        background-color: rgba(0, 154, 255, 0.2);

        &::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: rgba(0, 154, 255, 1);
            cursor: pointer;
        }
    }

    output {
        margin-right: 8px;
        font-size: 0.875rem;
    }
}
</style>