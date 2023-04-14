<template>
    <div class="list">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.list {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    border: 1px solid rgb(var(--border-color));
    overflow: hidden;

    &:not(:last-child) {
        margin-bottom: 20px;
    }
}
</style>
