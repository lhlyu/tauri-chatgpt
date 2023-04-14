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
import ChatAside from './aside/index.vue'
import ChatContainer from './container/index.vue'
import ModalSetting from './setting.vue'
import useChatStore from "../../stores/chat";

const chat = useChatStore()

const showModalSetting = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
        chat.modal = !chat.modal
    }
}

onMounted(() => {
    document.addEventListener('keyup', showModalSetting)
})

onUnmounted(() => {
    document.removeEventListener('keyup', showModalSetting)
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
    }

    article {
        flex: 1;
        height: 100%;
        background-color: rgb(242, 242, 242);
    }
}
</style>