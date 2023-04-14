import { defineStore } from "pinia";


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
            return null
        },
        getActiveSessionMessages: state => (count: number) => {
            for (let i = 0; i < state.sessions.length; i++) {
                if (state.sessions[i].active) {
                    const msgs = state.sessions[i].messages as Partial<MessageOption>[]
                    return msgs.slice((-1) * count).map(value => {
                        delete value.id
                        delete value.ts
                        return value
                    })
                }
            }
            return []
        }
    },
    actions: {
        active(id: string) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === id) {
                    this.sessions[i].active = true
                    continue
                }
                this.sessions[i].active = false
            }
            this.id = id
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
        updateSession(session: SessionOption) {
            for (let i = 0; i < this.sessions.length; i++) {
                if (this.sessions[i].id === session.id) {
                    this.sessions[i] = session
                    break
                }
            }
        },
        closeSession(id: string) {
            this.id = ''
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
                            if (j === (this.sessions[i].messages.length - 1) && j > 0) {
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
                    break
                }
            }
        }
    },
    // 启用持久化
    persist: true
})


export default useSessionsStrore
