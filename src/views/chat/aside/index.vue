<template>
    <div class="aside">
        <header data-tauri-drag-region>
            <div class="left">ChatGPT</div>
            <div class="right">
                <i @click="changeLang" v-tippy="$t('iconLanguage')">
                    <IconTranslate></IconTranslate>
                </i>
                <i @click="changeTheme" v-tippy="$t('iconTheme')">
                    <IconSun v-if="chat.theme === 'light'"></IconSun>
                    <IconMoon v-else></IconMoon>
                </i>
                <i @click="showModalSetting" v-tippy="$t('iconSetting')">
                    <IconSetting></IconSetting>
                </i>
                <i @click="createSession" v-tippy="$t('iconAddSession')">
                    <IconAdd></IconAdd>
                </i>
            </div>
        </header>
        <div ref="scroll" class="sessions" v-if="store.sessions.length">
            <Session v-for="v in store.sessions" :key="v.id" v-bind="v"></Session>
        </div>
        <div class="empty" v-else>{{ $t('createSession') }}</div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { customAlphabet } from 'nanoid'
import { IconSetting, IconSun, IconMoon, IconTranslate, IconAdd } from '../../../components/icons'
import { Session } from '../components'
import useSessionsStrore from '../../../stores/sessions'
import useChatStore from '../../../stores/chat'

const nanoid = customAlphabet('1234567890abcdefghijkmnprstuvwxyz', 10)

const { t, locale } = useI18n()
const store = useSessionsStrore()
const chat = useChatStore()

const showModalSetting = () => {
    chat.modal = true
}

const changeTheme = () => {
    chat.changeTheme()
    document.documentElement.setAttribute('theme', chat.theme)
}

const changeLang = () => {
    chat.changeLang()
    locale.value = chat.lang
    document.documentElement.setAttribute('lang', chat.lang)
}

const scroll = ref<HTMLDivElement>()

const scrollToActive = () => {
    const t = setTimeout(() => {
        if (store.id.length) {
            if (scroll.value) {
                scroll.value.querySelector(`#${store.id}`)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                })
            }
        }
        clearTimeout(t)
    }, 200)
}

const createSession = () => {
    const id = 's' + nanoid()
    console.log(`https://api.multiavatar.com/${id}.png`)
    const session: SessionOption = {
        id: id,
        // avatar: multiavatar(id),
        avatar: `https://api.multiavatar.com/${id}.png`,
        active: true,
        title: t('newSession'),
        desc: t('emptyMessage'),
        ts: +new Date(),
        messages: []
    }
    store.add(session)
    if (scroll.value) {
        scrollToActive()
    }
}

onMounted(() => {
    document.documentElement.setAttribute('theme', chat.theme)
    document.documentElement.setAttribute('lang', chat.lang)
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
                background-color: rgb(var(--icon-bg-color));
                transition: background-color 0.2s ease-in-out;

                &:hover {
                    background-color: rgb(var(--icon-hover-bg-color));
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
        color: rgb(var(--empty-font-color));
    }
}
</style>
