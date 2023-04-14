import useSessionsStrore from '../../../stores/sessions'
import useChatStore from '../../../stores/chat'
import sessions from "../../../stores/sessions";


function isJsonString(str: string): boolean {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch(e) {
    }
    return false;
}


const useOpenai = () => {
    const store = useSessionsStrore()
    const chat = useChatStore()

    const dom = ref<HTMLElement>()
    const loading = ref<boolean>(false)
    const msg = ref<string>('')

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

    const getStream = async (reader: ReadableStreamDefaultReader) => {
        let prefix = ''
        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                break
            }
            try {
                const lines = (prefix + value).trim().split('\n')
                if (lines.length === 8 && isJsonString(value)) {
                    const msg = '请求发生了异常: \n\n```json\n' + value + '\n```'
                    store.appendMessage(msg, true)
                    await scrollBottom()
                    break
                }
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim()
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
                            store.appendMessage(json.choices[0].delta.content)
                            await scrollBottom()
                        }
                    }
                }
            } catch (e) {
                console.error(e)
                console.log('value:', value)
                const msg = '解析数据异常: \n\n```json\n' + (e as any).message.toString() + '\n```\n\n数据: `' + value + '`'
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
                Authorization: `Bearer ${chat.api_key}`
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

            if (response.body) {
                await getStream(response.body.pipeThrough(new TextDecoderStream()).getReader())
            }
        } catch (e) {
            console.error(e)
            const msg = (e as any).message.toString()
            store.appendMessage(msg, true)
            await scrollBottom()
        }
    }

    // 发送消息
    const send = async (ev: KeyboardEvent) => {
        loading.value = true
        if (ev.shiftKey && ev.key === 'Enter') {
            msg.value = msg.value.trim()
            if (!msg.value.length) {
                ev.preventDefault()
                loading.value = false
                return
            }
            loading.value = false
            return
        }
        if (ev.key === 'Enter') {
            msg.value = msg.value.trim()
            if (!msg.value.length) {
                ev.preventDefault()
                loading.value = false
                return
            }
            // 添加消息
            addMessage('user', msg.value)
            msg.value = ''

            await scrollBottom()
            // 请求
            await request()
        }
        loading.value = false
    }

    onMounted(async () => {
        await scrollBottom()
    })

    return {
        dom,
        loading,
        msg,
        send
    }
}

export default useOpenai
