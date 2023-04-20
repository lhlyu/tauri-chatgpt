import { defineStore } from 'pinia'

const useSessionsStrore = defineStore('sessions', {
    state: (): SessionsOption => ({
        id: '',
        sessions: []
    }),
    getters: {
        getActiveSession: state => {
            for (let i = 0; i < state.sessions.length; i++) {
                if (state.sessions[i].active) {
                    return state.sessions[i]
                }
            }
            return {
                id: '',
                avatar: '',
                active: false,
                title: '',
                desc: '',
                ts: 0,
                messages: []
            }
        },
        getActiveSessionMessages: state => (count: number) => {
            for (let i = 0; i < state.sessions.length; i++) {
                if (state.sessions[i].active) {
                    const msgs = state.sessions[i].messages

                    const ms: Omit<MessageOption, 'id' | 'ts'>[] = []

                    msgs.slice(-1 * count).map(value => {
                        ms.push({
                            role: value.role,
                            content: value.content
                        })
                    })
                    return ms
                }
            }
            return []
        }
    },
    actions: {
        active(id: string) {
            this.id = id
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === id) {
                    this.sessions[i].active = true
                    continue
                }
                this.sessions[i].active = false
            }
        },
        add(session: SessionOption) {
            this.sessions.unshift(session)
            this.active(session.id)
        },
        remove(id: string) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === id) {
                    if (this.sessions[i].active) {
                        this.id = ''
                    }
                    this.sessions.splice(i, 1)
                    break
                }
            }
            if (this.sessions.length === 0) {
                this.id = ''
            }
        },
        updateSession(id: string, session: SessionOption) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === id) {
                    this.sessions[i] = session
                    break
                }
            }
        },
        closeSession() {
            this.active('')
        },
        addMessage(id: string, msg: MessageOption) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === id) {
                    this.sessions[i].messages.push(msg)
                    if (msg.content === '') {
                        break
                    }
                    this.sessions[i].desc = msg.content.slice(0, 30)
                    break
                }
            }
        },
        appendMessage(content: string, overwrite: boolean = false) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === this.id) {
                    if (overwrite) {
                        this.sessions[i].messages[this.sessions[i].messages.length - 1].content = content
                        break
                    }
                    this.sessions[i].messages[this.sessions[i].messages.length - 1].content += content
                    break
                }
            }
        },
        removeMessage(id: string, msgId: string) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === id) {
                    for (let j = 0; j < this.sessions[i].messages.length; j++) {
                        if (this.sessions[i].messages[j].id === msgId) {
                            if (j === this.sessions[i].messages.length - 1 && j > 0) {
                                this.sessions[i].desc = this.sessions[i].messages[j - 1].content.slice(0, 30)
                            }
                            this.sessions[i].messages.splice(j, 1)
                            break
                        }
                    }
                    break
                }
            }
        },
        clearMessages(id: string) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === id) {
                    this.sessions[i].messages = []
                    this.sessions[i].desc = '暂无消息'
                    break
                }
            }
        }
    },
    // 启用持久化
    persist: true
})

export default useSessionsStrore
