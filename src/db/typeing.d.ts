declare interface SessionModel {
    id: string
    ai: string
    name: string
    avatar: string
    desc: string
    ts: number
    option: string
}

declare interface MessageModel {
    id: string
    session_id: string
    ts: number
    role: string
    content: string
}
