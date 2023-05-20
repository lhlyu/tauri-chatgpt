<template>
    <section class="openai-main" v-if="openai.session_id.length">
        <header data-tauri-drag-region oncontextmenu="return false;">
            <div class="left">
                <input type="text" :value="session?.name" maxlength="12" @blur="changeSessionName" />
            </div>
            <div class="right">
                <div class="icon" @click.stop="cleanMessages">
                    <IconCleaningServices></IconCleaningServices>
                </div>
                <div class="icon" @click.stop="closeSession">
                    <IconClose></IconClose>
                </div>
                <div class="icon" @click.stop="openai.changeSettingOpen">
                    <IconTune></IconTune>
                </div>
            </div>
        </header>
        <div class="container" ref="dom">
            <Bubble v-for="v in items" :key="v.id" v-bind="v" :markdown="app.markdown" @delete="cleanMessage" @copy="copyMessage"></Bubble>
        </div>
        <footer oncontextmenu="return false;">
            <div class="toolbar">
                <div class="left">
                    <Btn v-if="loading" @click.stop="stop">{{ $t('stop') }}</Btn>
                    <Btn v-else @click.stop="keepon">{{ $t('keepon') }}</Btn>
                </div>
                <div class="right">
                    <Checkbox name="auto_scroll" v-model="app.auto_scroll">{{ $t('auto_scroll') }}</Checkbox>
                    <Checkbox name="enter" v-model="app.enter">Enter</Checkbox>
                    <Checkbox name="markdown" v-model="app.markdown">Markdown</Checkbox>
                    <div class="icon" @click="app.changeCollapseBottom">
                        <IconBottomPanelClose v-if="!app.collapse_bottom"></IconBottomPanelClose>
                        <IconBottomPanelOpen v-else></IconBottomPanelOpen>
                    </div>
                </div>
            </div>
            <div class="send-box" v-if="!app.collapse_bottom">
                <textarea :placeholder="$t('placeholder')" v-model="question" @keydown="send"></textarea>
                <div class="tip" v-if="!question.length">
                    <br />
                    Enter - {{ app.enter ? $t('send') : $t('wrap') }}
                    <br />
                    Shift+Enter - {{ app.enter ? $t('wrap') : $t('send') }}
                    <br />
                    Markdown - {{ $t('enable') }}
                </div>
            </div>
        </footer>
    </section>
    <section class="openai-empty-main" v-else>
        <p>{{ $t('current_version') }}：{{ pkg.version }}</p>
        <p>{{ $t('create_session') }}</p>
        <p>{{ $t('select_session') }}</p>
        <p>Esc{{ $t('open_setting') }}</p>
    </section>
</template>

<script setup lang="ts">
import IconCleaningServices from '../../assets/icons/cleaning_services.svg?component'
import IconClose from '../../assets/icons/close.svg?component'
import IconTune from '../../assets/icons/tune.svg?component'
import IconBottomPanelOpen from '../../assets/icons/bottom_panel_open.svg?component'
import IconBottomPanelClose from '../../assets/icons/bottom_panel_close.svg?component'
import Checkbox from '../../components/checkbox/index.vue'
import Btn from '../../components/btn/index.vue'
import Bubble from './bubble.vue'
import pkg from '../../../package.json'
import useAppStore from '../../stores/app'
import useOpenaiStore from '../../stores/openai'
import useOpenai from './openai'
import { onMounted } from 'vue'

const app = useAppStore()
const openai = useOpenaiStore()

const { dom, loading, question, session, items, changeSessionInfo, send, stop, keepon, cleanMessages, cleanMessage, copyMessage, closeSession } = useOpenai()

// 修改会话名字
const changeSessionName = async (event: Event) => {
    // 修改会话的名字
    const name = (event.target as HTMLInputElement).value
    await changeSessionInfo(name)
}

onMounted(() => {})
</script>
