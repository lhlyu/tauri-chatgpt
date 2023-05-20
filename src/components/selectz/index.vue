<template>
    <div class="selectz">
        <label for="select" class="text">{{ label }}</label>
        <select :value="modelValue" @change="change" name="select">
            <option v-for="o in options" :key="o">
                {{ o }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import Select from '../inputx/select.vue'

const props = withDefaults(
    defineProps<{
        label: string
        placeholder: string
        modelValue: string
        options: string[]
    }>(),
    {
        label: 'label',
        placeholder: '',
        modelValue: '',
        options: () => []
    }
)

const emit = defineEmits(['update:modelValue'])

const change = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss"></style>
