<template>
    <div class="bubble" :id="id">
        <div class="top">
            <div class="avatar">
                <img :src="role === 'user' ? '/avatar.jpg' : '/logo.svg'" alt="avatar" />
                <time>{{ dayjs(ts).format('YYYY-MM-DD HH:mm:ss') }}</time>
            </div>
            <div class="action"></div>
        </div>
        <div class="bottom">
            <div class="content markdown-body" v-if="content?.length" v-html="md(content)"></div>
            <div class="content" v-else>思考中...</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import md from './md'

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: ''
    },
    ts: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: ''
    }
})
</script>

<style scoped lang="scss">
.bubble {
    width: 100%;
    padding: 25px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: rgb(229, 231, 235);
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;

        .avatar {
            display: flex;
            align-items: flex-end;
            height: 30px;

            img {
                width: 30px;
                height: 100%;
            }

            time {
                margin-left: 10px;
                font-size: 12px;
            }
        }
    }

    .bottom {
        padding-top: 10px;

        .content {
            line-height: 1.8;
        }
    }
}
</style>
