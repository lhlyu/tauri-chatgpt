export interface MessageOption {
    role: string
    content: string
}

export interface ChatOption {
    timeout: number
    key: string
    code: string
    model: string
    max_tokens: number
    messages: MessageOption[]
    temperature: number
    presence_penalty: number
}

const proxy_url: string = 'https://yu-openai.deno.dev/v1/chat/completions'
const openai_url: string = 'https://api.openai.com/v1/chat/completions'

let reader: ReadableStreamDefaultReader<Uint8Array> | undefined

export const cancel = async () => {
    if (reader) {
        await reader.cancel()
    }
}

const chat = async (opt: ChatOption, callback: (text: string, end: boolean, error?: string) => Promise<void>) => {
    try {
        let url = openai_url
        if (opt.code.length) {
            url = proxy_url
        }

        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), opt.timeout)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${opt.key}`,
                AUTH_CODE: opt.code
            },
            body: JSON.stringify({
                model: opt.model,
                max_tokens: opt.max_tokens,
                messages: opt.messages,
                temperature: opt.temperature,
                presence_penalty: opt.presence_penalty,
                stream: true
            }),
            signal: controller.signal
        })

        clearTimeout(id)

        if (!response.ok) {
            const result = await response.json()
            const error = '```json\n' + JSON.stringify(result, null, '    ') + '\n```'
            await callback('', true, error)
            return
        }

        reader = response.body?.getReader()
        if (!reader) {
            await callback('', true, 'Error: fail to read data from response')
            return
        }
        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                await callback('', true)
                return
            }

            const textDecoder = new TextDecoder('utf-8')
            const chunk = textDecoder.decode(value)

            for (const line of chunk.split('\n')) {
                const trimmedLine = line.trim()
                if (!trimmedLine || trimmedLine === 'data: [DONE]') {
                    continue
                }
                const json = trimmedLine.replace('data: ', '')
                const obj = JSON.parse(json)
                if (obj?.choices?.[0]?.delta?.content) {
                    const text = obj.choices[0].delta.content
                    await callback(text, false)
                }
            }
        }
    } catch (e) {
        await callback('', true, `${e}`)
    } finally {
        reader = undefined
    }
}

export default chat
