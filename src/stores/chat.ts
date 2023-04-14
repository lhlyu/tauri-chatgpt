import { defineStore } from 'pinia'

// 设置
const useChatStore = defineStore('chat', {
    state: (): ChatOption => ({
        modal: false,
        setting: 'global',
        avatar: '/avatar.jpg',
        host: 'https://api.openai.com',
        api_key: '',
        markdown: true,
        model: 'gpt-3.5-turbo',
        context_count: 5,
        max_tokens: 512,
        temperature: 0,
        presence_penalty: 0
    }),
    getters: {},
    actions: {},
    // 启用持久化
    persist: true
})

export default useChatStore
