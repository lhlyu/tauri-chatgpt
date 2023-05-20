<template>
    <div class="inputz">
        <label for="input">{{ label }}</label>
        <input @input="change" :value="modelValue" :type="type" :placeholder="placeholder" name="input" :max="max" :min="min" :maxlength="maxlength" />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        label: string
        placeholder: string
        type: string
        modelValue: string | number
        maxlength?: number
        max?: number
        min?: number
    }>(),
    {
        label: 'label',
        placeholder: '',
        type: 'text',
        modelValue: '',
        maxlength: 100,
    }
)

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    if (props.type === 'number') {
        let value = Number.parseInt((e.target as HTMLInputElement).value)
        const max = props.max ?? 10
        const min = props.min ?? 0
        if (value > max) {
            value = max
        }
        if (value < min) {
            value = min
        }
        emit('update:modelValue', value)
        return
    }
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>
