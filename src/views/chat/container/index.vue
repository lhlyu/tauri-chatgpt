<template>
    <div class="container" v-if="store.id.length">
        <header>
            <div class="left">
                <input type="text" :value="store.getActiveSession.title ?? ''" maxlength="16" :placeholder="$t('sessionTitlePlaceholder')" @blur="changeTitle" autocomplete="off" />
            </div>
            <div class="right">
                <i @click="closeSession" v-tippy="$t('iconCloseSession')">
                    <IconClose></IconClose>
                </i>
                <i @click="clearMessages" v-tippy="$t('iconClearMessages')">
                    <IconClear></IconClear>
                </i>
                <i @click="showModalSetting" v-tippy="$t('iconSetting')">
                    <IconSetting></IconSetting>
                </i>
            </div>
        </header>
        <section ref="dom" v-if="chat.api_key.length || chat.code.length">
            <Preset :show="showPreset as boolean" @pick="pickPreset"></Preset>
            <Bubble v-for="(v, i) in store.getActiveSession.messages" :key="v.id" v-bind="v"></Bubble>
        </section>
        <section class="empty" v-else>
            <p>{{ $t('noSetApiKey') }}</p>
            <br />
            <p>{{ $t('openSetting') }}</p>
        </section>
        <footer>
            <div class="actions">
                <template v-if="!loading && store.getActiveSession.messages.length > 1">
                    <button @click="keepon">{{ $t('continue') }}</button>
                </template>
                <template v-if="loading">
                    <button @click="cancelRecv">{{ $t('cancel') }}</button>
                </template>
            </div>
            <textarea
                ref="textarea"
                :disabled="loading || (chat.api_key.length === 0 && chat.code.length == 0)"
                :placeholder="t('textareaPlaceholder', chat.enter ? { wrap: 'Shift+Enter', send: 'Enter' } : { wrap: 'Enter', send: 'Shift+Enter' })"
                autocomplete="off"
                v-model="msg"
                @keydown="send"
            ></textarea>
        </footer>
    </div>
    <div class="empty" v-else>{{ $t('openSession') }}</div>
</template>

<script setup lang="ts">
import { IconSetting, IconClose, IconClear } from '../../../components/icons'
import { Bubble } from '../components'
import { useI18n } from 'vue-i18n'
import Preset from './preset.vue'
import useSessionsStrore from '../../../stores/sessions'
import useOpenai from './openai'
import useChatStore from '../../../stores/chat'

const { t } = useI18n()
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
    if (store.getActiveSession.id.length) {
        store.updateSession(store.id, {
            ...store.getActiveSession,
            title: value
        })
    }
}

const { dom, textarea, loading, showPreset, msg, send, keepon, cancelRecv, pickPreset } = useOpenai()
</script>

<style scoped lang="scss">
.empty {
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-size: 18px;
    letter-spacing: 1px;
    color: rgb(var(--empty-font-color));
}

$header-height: 60px;
$footer-height: 275px;

.container {
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: $header-height;
        padding: 0 25px;
        border-bottom: 1px solid rgb(var(--border-color));

        .left {
            flex: 1;

            input {
                outline: none;
                border: 0;
                font-weight: bold;
                font-size: 16px;
                color: var(--font-color);
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
                    background-color: rgb(var(--icon-hover-bg-color));
                }
            }
        }
    }

    section {
        position: relative;
        height: calc(100vh - $header-height - $footer-height);
        overflow: auto;
        scroll-behavior: smooth;
    }

    footer {
        display: flex;
        flex-direction: column;
        height: $footer-height;
        border-top: 1px solid rgb(var(--border-color));
        padding: 20px 25px;

        .actions {
            padding-bottom: 10px;
            display: flex;
            button {
                outline: none;
                border: 0;
                background-color: rgb(var(--bubble-hover-bg-color));
                padding: 6px 14px;
                margin-right: 10px;
                border-radius: 4px;
                color: inherit;
                cursor: pointer;
                transition: background-color 0.2s linear;

                &:hover {
                    background-color: rgb(var(--code-bg-color));
                }
            }

        }

        textarea {
            border: 0;
            outline: 0;
            resize: none;
            width: 100%;
            height: 100%;
            background-color: transparent;
            color: var(--font-color);
            line-height: 1.8;
            letter-spacing: 1px;
        }
    }
}
</style>
