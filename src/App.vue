<template>
    <router-view></router-view>
</template>

<script setup lang="ts" async>
import { open } from '@tauri-apps/api/shell'
import { useI18n } from 'vue-i18n'
import useAppStore from './stores/app'
import {initDB, initSQL} from './db'

const { t, locale } = useI18n()
const app = useAppStore()

onBeforeMount(async () => {
    await initDB()
    await initSQL()
})

onMounted(() => {
    app.init()
    locale.value = app.lang
    document.addEventListener('click', click)
})

onUnmounted(() => {
    document.removeEventListener('click', click)
})

const click = async (event: MouseEvent) => {
    const dom = event.target as HTMLElement

    if (dom.tagName === 'A') {
        event.preventDefault()
        const url = (dom as HTMLLinkElement).href
        try {
            await open(url)
        } catch (e) {
            window.open(url, '_blank')
        }
    }
}
</script>
