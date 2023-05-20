<template>
    <nav data-tauri-drag-region oncontextmenu="return false;">
        <div class="top">
            <div class="icon icon-active">
                <IconChatGPT></IconChatGPT>
            </div>
        </div>
        <div class="bottom">
            <div class="icon" @click="changeLang">
                <IconTranslate></IconTranslate>
            </div>
            <div class="icon" @click="app.changeTheme">
                <IconDarkMode v-if="app.theme === 'light'"></IconDarkMode>
                <IconLightMode v-else></IconLightMode>
            </div>
            <div class="icon" @click="app.changeCollapseLeft">
                <IconLeftPanelClose v-if="!app.collapse_left"></IconLeftPanelClose>
                <IconLeftPanelOpen v-else></IconLeftPanelOpen>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import IconChatGPT from '../assets/icons/chatgpt.svg?component'
import IconTranslate from '../assets/icons/translate.svg?component'
import IconDarkMode from '../assets/icons/dark_mode.svg?component'
import IconLightMode from '../assets/icons/light_mode.svg?component'
import IconLeftPanelClose from '../assets/icons/left_panel_close.svg?component'
import IconLeftPanelOpen from '../assets/icons/left_panel_open.svg?component'
import useAppStore from '../stores/app'
import { useI18n } from 'vue-i18n'

const app = useAppStore()

const { t, locale } = useI18n()

const changeLang = () => {
    app.changeLang()
    locale.value = app.lang
}
</script>
