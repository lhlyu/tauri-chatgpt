import { useI18n } from 'vue-i18n'
import useSessionsStrore from '../../../stores/sessions'
import useChatStore from '../../../stores/chat'

const useOpenai = () => {
    const { t } = useI18n()
    const store = useSessionsStrore()
    const chat = useChatStore()

    const dom = ref<HTMLElement>()
    const textarea = ref<HTMLTextAreaElement>()
    const loading = ref<boolean>(false)
    const showPreset = ref<boolean>(false)
    const msg = ref<string>('')

    const reader = ref<ReadableStreamDefaultReader>()

    const focus = () => {
        const t = setTimeout(() => {
            if (textarea.value) {
                textarea.value.focus()
            }
            clearTimeout(t)
        }, 200)
    }

    // 滚动到底部
    const scrollBottom = async () => {
        await nextTick(() => {
            if (dom.value) {
                dom.value.scrollTo(0, dom.value.scrollHeight)
            }
        })
    }

    const addMessage = (role: Role, content: string): string => {
        const ts = +new Date()
        const message: MessageOption = {
            id: role.at(0) + '_' + ts,
            role: role,
            content: content,
            ts: ts
        }
        store.addMessage(store.id, message)
        return message.id
    }

    const getStream = async () => {
        if (!reader.value) {
            return
        }
        let prefix = ''
        while (true) {
            const { done, value } = await reader.value.read()
            if (done) {
                break
            }
            try {
                const lines = (prefix + value).split('\n')
                prefix = ''
                let buf = ''
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i]
                    if (line.length === 0) {
                        continue
                    }
                    if (!line.endsWith('}]}')) {
                        prefix = line
                        continue
                    }
                    if (line.startsWith('data: ')) {
                        const json = JSON.parse(line.substring(6))
                        if (json?.choices?.[0]?.delta?.content) {
                            // buf += json.choices[0].delta.content
                            store.appendMessage(json.choices[0].delta.content)
                            await scrollBottom()
                        }
                    }
                }
                // if (buf.length) {
                //     store.appendMessage(buf)
                //     await scrollBottom()
                // }
            } catch (e) {
                console.error(e)
                console.log('value:', value)
                const msg = t('err') + ': \n\n```json\n' + (e as any).message.toString() + '\n```\n\ndata: `' + value + '`'
                store.appendMessage(msg, true)
                await scrollBottom()
            }
        }
    }

    const request = async () => {
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), chat.timeout)

        const opt = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${chat.api_key}`,
                'AUTH_CODE': chat.code
            },
            body: JSON.stringify({
                model: chat.model,
                max_tokens: chat.max_tokens,
                messages: store.getActiveSessionMessages(chat.context_count),
                temperature: chat.temperature,
                presence_penalty: chat.presence_penalty,
                stream: true
            }),
            signal: controller.signal
        }

        addMessage('assistant', '')

        await scrollBottom()

        try {
            const response = await fetch(chat.getHost + '/v1/chat/completions', opt)
            clearTimeout(id)

            if (!response.ok) {
                const result = await response.json()
                store.appendMessage('```json\n' + JSON.stringify(result, null, '    ') + '\n```', true)
                return
            }

            if (response.body) {
                reader.value = response.body.pipeThrough(new TextDecoderStream()).getReader()
                await getStream()
                reader.value = undefined
            }
        } catch (e) {
            console.error(e)
            const msg = (e as any).message.toString()
            store.appendMessage(msg, true)
            await scrollBottom()
        }
    }

    // 换行
    const wrap = (ev: KeyboardEvent) => {
        msg.value = msg.value.trim()
        if (!msg.value.length) {
            ev.preventDefault()
            return
        }
    }

    // 请求
    const doRequest = async (ev: KeyboardEvent) => {
        msg.value = msg.value.trim()

        if (msg.value.startsWith('/')) {
            msg.value = msg.value.substring(1)
        }

        if (!msg.value.length) {
            ev.preventDefault()
            return
        }

        // 添加消息
        addMessage('user', msg.value)
        msg.value = ''

        await scrollBottom()
        // 请求
        await request()

        await scrollBottom()
    }

    // 发送消息
    const send = async (ev: KeyboardEvent) => {
        if (ev.shiftKey && ev.key === 'Enter') {
            loading.value = true
            if (chat.enter) {
                wrap(ev)
            } else {
                await doRequest(ev)
            }
            loading.value = false
            return
        }
        if (ev.key === 'Enter') {
            loading.value = true
            if (chat.enter) {
                await doRequest(ev)
            } else {
                wrap(ev)
            }
            loading.value = false
        }
        if (ev.key === '/') {
            msg.value = msg.value.trim()
            if (msg.value.length === 0 || msg.value === '、') {
                showPreset.value = true
                msg.value = '/'
                ev.preventDefault()
                return
            }
        }
    }

    // 取消接收消息
    const cancelRecv = async () => {
        if (reader.value) {
            reader.value.cancel()
        }
    }

    const pickPreset = (preset: string) => {
        msg.value = '/' + preset
        focus()
    }

    watch(msg, (newValue, oldValue) => {
        if (newValue.trim().length === 0) {
            showPreset.value = false
        }
    })

    store.$subscribe((mutation, state) => {
        if (state.id.length) {
            focus()
        }
    })

    onMounted(async () => {
        await scrollBottom()
    })

    return {
        dom,
        textarea,
        loading,
        showPreset,
        msg,
        send,
        cancelRecv,
        pickPreset
    }
}

export default useOpenai
