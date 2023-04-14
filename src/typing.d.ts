declare interface ChatOption {
    lang: 'zh' | 'en'
    theme: 'light' | 'dark'
    modal: boolean
    setting: string
    // 请求超时时间
    timeout: number
    // host
    host: string
    // 是否启用markdown解析
    markdown: boolean
    // 附带的上下文条数
    context_count: number
    // apiKey
    api_key: string
    model: string
    // 随机性 值越大回答越随机
    temperature: number
    max_tokens: number
    // 话题新鲜度
    presence_penalty: number
}

declare type Role = 'system' | 'user' | 'assistant'

declare interface MessageOption {
    id: string
    role: Role
    content: string
    ts: number
}

declare interface SessionOption {
    id: string
    avatar: string
    active: boolean
    title: string
    desc: string
    ts: number
    messages: MessageOption[]
}

declare interface SessionsOption {
    // 激活的id
    id: string
    sessions: SessionOption[]
}
