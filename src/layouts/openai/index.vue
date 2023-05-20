<template>
    <div class="openai">
        <OpenaiSide></OpenaiSide>
        <router-view v-slot="{ Component, route }">
            <keep-alive>
                <component :is="Component" :key="route.fullPath" />
            </keep-alive>
        </router-view>
        <OpenaiSetting></OpenaiSetting>
    </div>
</template>

<script setup lang="ts">
import OpenaiSide from './OpenaiSide.vue'
import OpenaiSetting from './OpenaiSetting.vue'
import useOpenaiStore from '../../stores/openai'

const openai = useOpenaiStore()

const openSettingSide = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
        openai.changeSettingOpen()
        ev.preventDefault()
    }
}

onMounted(() => {
    openai.init()
    document.addEventListener('keyup', openSettingSide)
})

onUnmounted(() => {
    document.removeEventListener('keyup', openSettingSide)
})
</script>
