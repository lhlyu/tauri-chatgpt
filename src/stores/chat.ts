import { defineStore } from 'pinia'

// 设置
const useChatStore = defineStore('chat', {
    state: (): ChatOption => ({
        lang: 'zh',
        theme: 'light',
        modal: false,
        setting: 'global',
        timeout: 5000,
        host: 'https://api.openai.com',
        api_key: '',
        markdown: true,
        model: 'gpt-3.5-turbo',
        context_count: 5,
        max_tokens: 512,
        temperature: 0,
        presence_penalty: 0
    }),
    getters: {
        getHost: state => {
            if (state.host.trim().length === 0) {
                state.host = 'https://api.openai.com'
            }
            return state.host
        }
    },
    actions: {
        changeLang() {
            this.lang = this.lang === 'zh' ? 'en' : 'zh'
        },
        changeTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light'
        }
    },
    // 启用持久化
    persist: true
})

export default useChatStore
