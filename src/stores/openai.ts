import { defineStore } from 'pinia'

interface OpenaiOption {
    session_id: string
    host: string
    timeout: number
    key: string
    code: string
    model: string
    context_count: number
    max_tokens: number
    temperature: number
    presence_penalty: number

    // 是否打开设置栏
    setting_open: boolean
}

// Openai设置
const useOpenaiStore = defineStore('openai', {
    state: (): OpenaiOption => ({
        session_id: '',
        host: 'https://api.openai.com',
        timeout: 5000,
        key: '',
        code: '',
        model: 'gpt-3.5-turbo',
        context_count: 5,
        max_tokens: 1024,
        temperature: 0,
        presence_penalty: 0,
        setting_open: false
    }),
    getters: {},
    actions: {
        async init() {
            this.setting_open = false
        },
        changeSettingOpen() {
            this.setting_open = !this.setting_open
        }
    },
    // 启用持久化
    persist: true
})

export default useOpenaiStore
