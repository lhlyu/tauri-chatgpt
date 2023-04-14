declare interface ChatOption {
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
    // avatar
    avatar: string
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

declare type ChatMessage = Omit<MessageOption, 'id' | 'ts'>

declare interface ChatSessionOption {
    // 会话ID
    id: number
    // 会话状态: 0 - 等待提问; 1 - 正在请求; 3 - 配置问题; 4 - 网络问题
    status: number
    // 消息
    messages: MessageOption[]
}

declare interface SessionOption {
    id: string
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
