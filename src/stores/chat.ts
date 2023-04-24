import { defineStore } from 'pinia'

// 设置
const useChatStore = defineStore('chat', {
    state: (): ChatOption => ({
        lang: 'zh',
        theme: 'light',
        modal: false,
        setting: 'global',
        layout: 0,
        timeout: 5000,
        host: 'https://api.openai.com',
        api_key: '',
        code: '',
        markdown: true,
        enter: true,
        model: 'gpt-3.5-turbo',
        context_count: 9,
        max_tokens: 1024,
        temperature: 0,
        presence_penalty: 0
    }),
    getters: {
        getHost: state => {
            if (state.host.trim().length === 0) {
                state.host = 'https://api.openai.com'
            }
            if (state.code.trim().length) {
                return 'https://yu-openai.deno.dev'
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
        },
        changeLayout() {
            if (this.layout === 2) {
                this.layout = 0
                return
            }
            this.layout += 1
        }
    },
    // 启用持久化
    persist: true
})

export default useChatStore
