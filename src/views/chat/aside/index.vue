<template>
    <div class="aside">
        <header>
            <div class="left">ChatGPT</div>
            <div class="right">
                <i>
                    <IconTranslate></IconTranslate>
                </i>
                <i>
                    <IconSun></IconSun>
                </i>
                <i @click="showModalSetting">
                    <IconSetting></IconSetting>
                </i>
                <i @click="createSession">
                    <IconAdd></IconAdd>
                </i>
            </div>
        </header>
        <div ref="scroll" class="sessions" v-if="store.sessions.length">
            <Session v-for="v in store.sessions" :key="v.id" v-bind="v"></Session>
        </div>
        <div class="empty" v-else>请创建一个会话</div>
    </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { IconSetting, IconSun, IconMoon, IconTranslate, IconAdd } from '../../../components/icons'
import { Session } from '../components'
import useSessionsStrore from '../../../stores/sessions'
import useChatStore from '../../../stores/chat'

const store = useSessionsStrore()
const chat = useChatStore()

const showModalSetting = () => {
    chat.modal = true
}

const scroll = ref<HTMLDivElement>()

const scrollToActive = () => {
    const t = setTimeout(() => {
        if (store.id.length) {
            scroll.value.querySelector(`#${store.id}`).scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }
        clearTimeout(t)
    }, 200)
}

const createSession = () => {
    const session: SessionOption = {
        id: nanoid(),
        active: true,
        title: '新建会话',
        desc: '暂无消息',
        ts: +new Date(),
        messages: []
    }
    store.add(session)
    if (scroll.value) {
        scrollToActive()
    }
}

onMounted(() => {
    if (scroll.value) {
        scrollToActive()
    }
})
</script>

<style scoped lang="scss">
.aside {
    user-select: none;

    header {
        display: flex;
        justify-content: space-between;
        padding: 40px 15px 20px;
        height: 90px;

        .left {
            flex: 1;
            display: flex;
            align-items: center;
            font-size: 26px;
        }

        .right {
            flex: 1;
            display: flex;
            justify-content: space-between;

            i {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                padding: 5px;
                border-radius: 4px;
                cursor: pointer;
                background-color: rgb(243, 244, 246);
                transition: background-color 0.2s ease-in-out;

                &:hover {
                    background-color: rgb(229, 231, 235);
                }
            }
        }
    }

    .sessions {
        height: calc(100vh - 90px);
        overflow-y: overlay;
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
    }

    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 90px);
        width: 100%;
        font-size: 18px;
        letter-spacing: 1px;
        color: rgb(156, 163, 175);
    }
}
</style>
