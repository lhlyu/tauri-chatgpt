<template>
    <input type="checkbox" id="switch" :checked="props.modelValue" @change="change" />
    <label for="switch">
        <slot></slot>
    </label>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped lang="scss">
input[type=checkbox]{
    height: 0;
    width: 0;
    visibility: hidden;
}

label {
    cursor: pointer;
    text-indent: -9999px;
    width: 40px;
    height: 20px;
    background: gray;
    display: block;
    border-radius: 100px;
    position: relative;
}

label:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 90px;
}

input:checked + label {
    background: rgb(0, 154, 255);
}

input:checked + label:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
}

label:active:after {
    width: 130px;
}
</style>