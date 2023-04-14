<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="modelValue" class="modal" @click.self="closeModal">
                <slot></slot>
            </div>
        </transition>
    </teleport>
</template>

<script setup lang="ts">
const props = defineProps({
    parent: {
        type: String,
        default: 'body'
    },
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
    emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(99, 99, 99, 0.1);
    z-index: 99;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s;
}
</style>
