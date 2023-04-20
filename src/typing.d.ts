declare interface ChatOption {
    // 语言
    lang: 'zh' | 'en'
    // 主题
    theme: 'light' | 'dark'
    // 设置的弹出框是否显示
    modal: boolean
    // 当前设置选中的菜单
    setting: string

    // 请求超时时间
    timeout: number
    // host
    host: string
    // 是否启用markdown解析
    markdown: boolean
    // 是否使用Enter发送消息
    enter: boolean
    // 附带的上下文条数
    context_count: number

    code: string

    // apiKey
    api_key: string
    // 模型
    model: string
    // 随机性 值越大回答越随机
    temperature: number
    // 最大tokens
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
    // 会话唯一id
    id: string
    // 会话头像
    avatar: string
    // 会话是否激活
    active: boolean
    // 会话标题
    title: string
    // 会话摘要、描述
    desc: string
    // 会话创建时间
    ts: number
    // 消息
    messages: MessageOption[]
}

declare interface SessionsOption {
    // 激活的id
    id: string
    sessions: SessionOption[]
}

declare interface PresetOption {
    label: string
    desc: string
}
