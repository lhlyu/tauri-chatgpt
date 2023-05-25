<template>
    <aside class="openai-side" v-if="!app.collapse_left" oncontextmenu="return false;">
        <header data-tauri-drag-region>
            <div class="left">{{ app.ai }}</div>
            <div class="right">
                <div class="icon" @click="openai.changeSettingOpen">
                    <IconSettings></IconSettings>
                </div>
                <div class="icon" @click="addSession">
                    <IconAdd></IconAdd>
                </div>
            </div>
        </header>

        <div class="sessions">
            <Session v-for="s in sessions" :key="s.id" v-bind="s" :active="s.id === openai.session_id" @delete="delSession" @click="() => activeSession(s.id)"></Session>
        </div>
    </aside>
</template>

<script setup lang="ts">
import bus, { EventChangeSessionInfo } from '../../bus'
import { message } from '@tauri-apps/api/dialog'
import { useRouter } from 'vue-router'
import IconSettings from '../../assets/icons/settings.svg?component'
import IconAdd from '../../assets/icons/add.svg?component'
import Session from '../../components/session/index.vue'
import useAppStore from '../../stores/app'
import useOpenaiStore from '../../stores/openai'
import { getSessionAll, createSession, deleteSession } from '../../db'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const app = useAppStore()
const openai = useOpenaiStore()

const { t, locale } = useI18n()

const sessions = ref<SessionModel[]>([])

onBeforeMount(async () => {
    sessions.value = await getSessionAll(app.ai)
    let has = false
    for (let i = sessions.value.length - 1; i >= 0; i--) {
        if (sessions.value[i].id === openai.session_id) {
            has = true
            break
        }
    }
    if (!has) {
        openai.session_id = ''
    }
})

// 创建会话
const addSession = async () => {
    const session = await createSession(app.ai, t('new_session'))
    if (!session) {
        await message(t('create_session_failed'), 'Error')
        return
    }
    session.desc = t('empty_message')
    const list = [session, ...sessions.value]
    sessions.value = list
    openai.session_id = session.id
    await router.push('/openai/' + session.id)
}

// 删除会话
const delSession = async (id: string) => {
    await deleteSession(id)
    const list: SessionModel[] = []
    sessions.value.forEach(val => {
        if (val.id === id) {
            if (val.id === openai.session_id) {
                openai.session_id = ''
            }
            return
        }
        list.push(val)
    })
    sessions.value = list
}

// 激活会话
const activeSession = async (id: string) => {
    openai.session_id = id
    router.push('/openai/' + id)
}

onMounted(() => {
    // 监听修改名字
    bus.on(EventChangeSessionInfo, (param: any) => {
        for (let i = 0; i < sessions.value.length; i++) {
            if (sessions.value[i].id === param.id) {
                if (param.name) {
                    sessions.value[i].name = param.name
                }
                if (param.desc) {
                    sessions.value[i].desc = param.desc
                }
                break
            }
        }
    })
})
</script>
