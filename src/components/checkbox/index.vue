<template>
    <div class="checkbox">
        <input type="checkbox" :id="name" class="input" :checked="modelValue" @change="change" />
        <label :for="name" class="label">
            <span>
                <svg height="10px" width="12px"></svg>
            </span>
            <span>
                <slot></slot>
            </span>
        </label>
        <svg class="inline-svg">
            <symbol viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </symbol>
        </svg>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    name: string
    modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>
