<template>
    <div class="field">
        <div class="header" v-if="label.length || desc.length">
            <div class="label">{{ label }}</div>
            <div class="desc">{{ desc }}</div>
        </div>
        <div class="body">
            <slot></slot>
        </div>
        <div class="footer" v-if="left.length || right.length">
            <div class="left">{{ left }}</div>
            <div class="right">{{ right }}</div>
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
    },
    left: {
        type: String,
        default: ''
    },
    right: {
        type: String,
        default: ''
    }
})
</script>

<style scoped lang="scss">
.field {
    display: flex;
    flex-direction: column;
    width: 100%;

    &:not(:last-child) {
        margin-bottom: 20px;
    }

    .header,
    .footer {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 2px;
        font-size: 12px;

        .label {
            font-weight: bolder;
        }
        .desc,
        .left,
        .right {
            color: var($tip-color);
        }
    }

    .footer {
        margin-top: 5px;
    }

    .body {
        margin-top: 5px;
    }
}
</style>
