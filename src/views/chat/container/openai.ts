import useSessionsStrore from "../../../stores/sessions";
import useChatStore from "../../../stores/chat";


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
        while(true) {
            const { done, value } = await reader.read()
            if (done) {
                break
            }
            const lines = (prefix + value).trim().split('\n')
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim()
                if (line.length === 0) {
                    continue
                }
                if (!line.endsWith("}]}")) {
                    prefix = line
                    continue
                }
                if (line.startsWith("data: ")) {
                    const json = JSON.parse(line.substring(6))
                    if (json?.choices?.[0]?.delta?.content) {
                        store.appendMessage(json.choices[0].delta.content)
                        await scrollBottom()
                    }
                }
            }
        }
    }

    const request = async () => {

        const opt = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${chat.api_key}`,
            },
            body: JSON.stringify({
                model: chat.model,
                max_tokens: chat.max_tokens,
                messages: store.getActiveSessionMessages(chat.context_count),
                temperature: chat.temperature,
                presence_penalty: chat.presence_penalty,
                stream: true,
            })
        }

        addMessage('assistant', '')

        await scrollBottom()

        const response = await fetch(chat.host + '/v1/chat/completions',  opt)

        if (!response.ok) {
            console.log(response)
            return
        }

        if (response.body) {
            await getStream(response.body.pipeThrough(new TextDecoderStream()).getReader())
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
