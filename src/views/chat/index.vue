<template>
    <main>
        <aside>
            <ChatAside></ChatAside>
        </aside>
        <article>
            <ChatContainer></ChatContainer>
        </article>
    </main>
    <ModalSetting></ModalSetting>
</template>

<script setup lang="ts">
import { open } from '@tauri-apps/api/shell'
import { clipboard } from '@tauri-apps/api'
import tippy from "tippy.js";
import ChatAside from './aside/index.vue'
import ChatContainer from './container/index.vue'
import ModalSetting from './setting.vue'
import useChatStore from '../../stores/chat'

const chat = useChatStore()

const showModalSetting = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
        chat.modal = !chat.modal
        ev.preventDefault()
    }
}

const copyCode = async (content: string) => {
    try {
        await clipboard.writeText(content)
    } catch (e) {
        await navigator.clipboard.writeText(content)
    }
    console.log('复制成功')
}


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

    if (dom.matches('.copy-button') && !dom.getAttribute('tip')) {
        const content = decodeURIComponent(dom.getAttribute('data-copy-content') ?? '')
        const tip = tippy(dom, {
            content: 'copied~',
            trigger: 'click',
            onTrigger(instance, event) {
                copyCode(content)
            },
        })
        tip.show()
        dom.setAttribute('tip', tip.id.toString())
        await copyCode(content)
    }
}

onMounted(() => {
    document.addEventListener('keyup', showModalSetting)
    document.addEventListener('click', click)
})

onUnmounted(() => {
    document.removeEventListener('keyup', showModalSetting)
    document.removeEventListener('click', click)
})

</script>

<style scoped lang="scss">
main {
    display: flex;
    height: 100vh;
    width: 100vw;

    aside {
        height: 100%;
        width: 300px;
        flex-shrink: 0;
        background-color: rgba(var(--aside-bg-color));
    }

    article {
        width: calc(100vw - 300px);
        height: 100%;
        background-color: rgb(var(--article-bg-color));
    }
}
</style>
