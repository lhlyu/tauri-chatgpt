<template>
    <div class="bubble" :id="id">
        <div class="top">
            <div class="avatar">
                <img :src="role === 'user' ? store.getActiveSession?.avatar : '/logo.svg'" alt="avatar" />
                <time>{{ dayjs(ts).format('YYYY-MM-DD HH:mm:ss') }}</time>
            </div>
            <div class="action">
                <i @click.stop="deleteMessage" v-tippy="$t('iconDeleteMessage')">
                    <IconTrash></IconTrash>
                </i>
                <i @click.stop="copyMessageContent" v-tippy="{ content: $t('iconCopy'), trigger: 'click' }">
                    <IconCopy></IconCopy>
                </i>
            </div>
        </div>
        <div class="bottom">
            <div class="content markdown-body" v-if="content?.length && chat.markdown" v-html="md(content as string)"></div>
            <div class="content plain-body" v-else-if="content?.length && !chat.markdown">
                <pre>{{ content }}</pre>
            </div>
            <div class="content" v-else>{{ $t('waitMessage') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { writeText } from '@tauri-apps/api/clipboard'
import dayjs from 'dayjs'
import md from './md'
import useChatStore from '../../../../stores/chat'
import useSessionsStrore from '../../../../stores/sessions'
import { IconTrash, IconCopy } from '../../../../components/icons'

const chat = useChatStore()
const store = useSessionsStrore()

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

const deleteMessage = () => {
    store.removeMessage(store.id, props.id as string)
}

const copyMessageContent = async () => {
    try {
        await writeText(props.content as string)
    } catch (e) {
        await navigator.clipboard.writeText(props.content as string)
    }
}
</script>

<style scoped lang="scss">
.bubble {
    position: relative;
    width: 100%;
    padding: 25px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: rgb(var(--bubble-hover-bg-color));
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;

        .avatar {
            display: flex;
            align-items: center;
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

        .action {
            display: flex;
            flex-shrink: 0;
            justify-content: flex-end;
            align-items: flex-end;
            width: 80px;

            i {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 36px;
                border-radius: 4px;
                cursor: pointer;
                background-color: transparent;
                transition: background-color 0.2s ease-in-out;

                &:hover {
                    background-color: rgb(var(--bubble-icon-hover-bg-color));
                }
            }
        }
    }

    .bottom {
        padding-top: 10px;

        .content {
            line-height: 1.6;
            color: var(--font-color);
        }

        .plain-body {
            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
        }
    }
}
</style>
