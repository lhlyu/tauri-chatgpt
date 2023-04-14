<template>
    <div class="container" v-if="store.id.length">
        <header>
            <div class="left">
                <input type="text" :value="store.getActiveSession.title" maxlength="16" placeholder="会话标题" @blur="changeTitle" />
            </div>
            <div class="right">
                <i @click="closeSession">
                    <IconClose></IconClose>
                </i>
                <i @click="clearMessages">
                    <IconClear></IconClear>
                </i>
                <i @click="showModalSetting">
                    <IconSetting></IconSetting>
                </i>
            </div>
        </header>
        <section ref="dom">
            <Bubble v-for="v in store.getActiveSession.messages" v-bind="v"></Bubble>
        </section>
        <footer>
            <textarea :disabled="loading" placeholder="Shift-Enter换行，Enter发送" v-model="msg" autofocus @keydown="send"></textarea>
        </footer>
    </div>
    <div class="empty" v-else>请在左侧选择一个会话</div>
</template>

<script setup lang="ts">
import { IconSetting, IconClose, IconClear } from '../../../components/icons'
import { Bubble } from '../components'
import useSessionsStrore from '../../../stores/sessions'
import useOpenai from './openai'
import useChatStore from '../../../stores/chat'

const store = useSessionsStrore()
const chat = useChatStore()

const showModalSetting = () => {
    chat.modal = true
}

const closeSession = () => {
    store.closeSession()
}

const clearMessages = () => {
    store.clearMessages(store.id)
}

const changeTitle = (ev: FocusEvent) => {
    const value = (ev.target as HTMLInputElement).value
    store.updateSession({
        ...store.getActiveSession,
        title: value
    })
}

const { dom, loading, msg, send } = useOpenai()
</script>

<style scoped lang="scss">
.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-size: 18px;
    letter-spacing: 1px;
    color: rgb(156, 163, 175);
}

$header-height: 60px;
$footer-height: 160px;

.container {
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: $header-height;
        padding: 0 25px;
        border-bottom: 1px solid rgb(229, 231, 235);

        .left {
            flex: 1;

            input {
                outline: none;
                border: 0;
                font-weight: bold;
                font-size: 16px;
                background-color: transparent;
            }
        }

        .right {
            display: flex;
            flex-shrink: 0;
            justify-content: space-between;
            width: 120px;

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
                    background-color: rgb(229, 231, 235);
                }
            }
        }
    }

    section {
        height: calc(100vh - $header-height - $footer-height);
        overflow: auto;
        scroll-behavior: smooth;
    }

    footer {
        height: $footer-height;
        border-top: 1px solid rgb(229, 231, 235);
        padding: 20px 25px;

        textarea {
            border: 0;
            outline: 0;
            resize: none;
            width: 100%;
            height: 100%;
            background-color: transparent;
            line-height: 1.8;
            letter-spacing: 1px;
        }
    }
}
</style>
