import { useThrottleFn } from '@vueuse/core'
import { getSession, getMessagePage, addMessage, getMessageId, deleteMessages, updateSession } from '../../db'
import useAppStore from '../../stores/app'
import useOpenaiStore from '../../stores/openai'
import chat, { ChatOption, MessageOption, cancel } from './chat'
import { copyContent } from '../../utils'
import bus, { EventChangeSessionInfo } from '../../bus'

interface BubbleOption {
    id: string
    content: string
    ts: number
    role: string
    avatar?: string
}

const useOpenai = () => {
    const app = useAppStore()
    const openai = useOpenaiStore()
    const session = ref<SessionModel>({
        id: '',
        ai: '',
        name: '',
        avatar: '',
        desc: '',
        ts: 0,
        option: ''
    })

    const dom = ref<any>()
    const loading = ref<boolean>(false)
    const question = ref<string>('')
    // 展示的消息
    const items = ref<BubbleOption[]>([])

    const messageModelToBubbleOption = (value: MessageModel): BubbleOption => {
        return {
            id: value.id,
            content: value.content,
            ts: value.ts,
            role: value.role,
            avatar: value.role === 'user' ? session.value.avatar : undefined
        }
    }

    const scrollBottom = () => {
        if (dom.value && app.auto_scroll) {
            dom.value.scrollTo({
                left: 0,
                top: dom.value.scrollHeight,
                behavior: 'smooth'
            })
        }
    }

    onMounted(async () => {
        session.value = await getSession(openai.session_id)
        const list: BubbleOption[] = []
        const messages = await getMessagePage(session.value.id)
        messages.map(value => {
            list.unshift(messageModelToBubbleOption(value))
        })
        items.value = list
        await throttledFn()
    })

    onActivated(async () => {
        await throttledFn()
    })

    const throttledFn = useThrottleFn(() => {
        scrollBottom()
    }, 200)

    const changeSessionInfo = async (name?: string, desc?: string) => {
        // 修改会话的名字
        await updateSession(session.value.id, {
            name,
            desc
        })
        if (name) {
            session.value.name = name
        }
        if (desc) {
            session.value.desc = desc
        }

        bus.emit(EventChangeSessionInfo, {
            id: session.value.id,
            name,
            desc
        })
    }

    const getMessages = (): MessageOption[] => {
        const list: MessageOption[] = []
        items.value.slice(-1 * openai.context_count).map(value => {
            list.push({
                role: value.role,
                content: value.content
            })
        })
        return list
    }

    // 发送消息
    const doRequest = async (ques: string) => {
        if (loading.value) {
            return
        }

        loading.value = true

        const q: MessageModel = {
            id: getMessageId(),
            content: ques,
            role: 'user',
            session_id: session.value.id,
            ts: +new Date()
        }

        items.value.push(messageModelToBubbleOption(q))

        addMessage(q)
        changeSessionInfo(session.value.name, q.content.slice(0, 20))

        const t = setTimeout(() => {
            scrollBottom()
            clearTimeout(t)
        }, 50)

        let create = false

        const opt: ChatOption = {
            timeout: openai.timeout,
            code: openai.code,
            key: openai.key,
            max_tokens: openai.max_tokens,
            messages: getMessages(),
            model: openai.model,
            presence_penalty: openai.presence_penalty,
            temperature: openai.temperature
        }

        const lastIndex = items.value.length

        await chat(opt, async (text, end, error) => {
            if (!create) {
                create = true
                const a: MessageModel = {
                    id: getMessageId(),
                    content: '',
                    role: 'assistant',
                    session_id: session.value.id,
                    ts: +new Date()
                }
                items.value.push(messageModelToBubbleOption(a))
            }

            if (end) {
                if (error?.length) {
                    items.value[lastIndex].content = error
                }
                await addMessage({
                    id: items.value[lastIndex].id,
                    session_id: session.value.id,
                    ts: items.value[lastIndex].ts,
                    role: items.value[lastIndex].role,
                    content: items.value[lastIndex].content
                })
                await throttledFn()
                return
            }
            items.value[lastIndex].content += text
            await throttledFn()
        })
        loading.value = false
    }

    const wrap = (ev: KeyboardEvent) => {
        question.value = question.value.trim()
        if (!question.value.length) {
            ev.preventDefault()
            return
        }
    }

    const send = async (ev: KeyboardEvent) => {
        if (ev.shiftKey && ev.key === 'Enter') {
            if (app.enter) {
                wrap(ev)
            } else {
                ev.preventDefault()
                const ques = question.value.trim()
                if (ques.length) {
                    question.value = ''
                    await doRequest(ques)
                }
            }
            return
        }
        if (ev.key === 'Enter') {
            if (app.enter) {
                ev.preventDefault()
                const ques = question.value.trim()
                if (ques.length) {
                    question.value = ''
                    await doRequest(ques)
                }
            } else {
                wrap(ev)
            }
        }
    }

    // 停止
    const stop = async () => {
        await cancel()
    }

    // 继续
    const keepon = async () => {
        await doRequest('继续')
    }

    // 清理消息
    const cleanMessages = async () => {
        await deleteMessages(session.value.id)
        items.value = []
    }

    // 删除一条消息
    const cleanMessage = async (messageId: string) => {
        await deleteMessages(session.value.id, messageId)
        const list: BubbleOption[] = []
        for (let i = 0; i < items.value.length; i++) {
            if (items.value[i].id === messageId) {
                continue
            }
            list.push(items.value[i])
        }
        items.value = list
    }

    // 复制消息
    const copyMessage = async (content: string) => {
        await copyContent(content)
    }

    // 关闭会话
    const closeSession = () => {
        openai.session_id = ''
    }

    return {
        dom,
        loading,
        question,
        session,
        items,
        changeSessionInfo,
        send,
        stop,
        keepon,
        cleanMessages,
        cleanMessage,
        copyMessage,
        closeSession
    }
}

export default useOpenai
