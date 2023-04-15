<template>
    <div class="list-item">
        <div class="left">
            <h4>{{ label }}</h4>
            <small v-if="desc?.length">{{ desc }}</small>
        </div>
        <div class="right">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    desc: {
        type: String,
        default: ''
    }
})
</script>

<style scoped lang="scss">
.list-item {
    display: flex;
    justify-content: space-between;
    min-height: 60px;
    padding: 10px 20px;
    cursor: default;

    &:not(:last-child) {
        border-bottom: 1px solid rgb(var(--border-color));
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: center;

        small {
            font-size: 0.75rem;
            color: rgb(var(--list-item-desc-color));
            line-height: 1.4;
        }
    }

    .right {
        display: flex;
        align-items: center;
    }
}
</style>
