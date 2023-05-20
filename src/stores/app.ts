import { defineStore } from 'pinia'
// import { getAiModel } from "../db";

interface AppOption {
    theme: 'light' | 'dark'
    lang: 'zh' | 'en'
    enter: boolean
    markdown: boolean
    auto_scroll: boolean
    collapse_left: boolean
    collapse_bottom: boolean
    ai: 'Openai'
}

// 设置
const useAppStore = defineStore('app', {
    state: (): AppOption => ({
        theme: 'light',
        lang: 'zh',
        enter: true,
        markdown: true,
        auto_scroll: true,
        collapse_left: false,
        collapse_bottom: false,
        ai: 'Openai'
    }),
    getters: {},
    actions: {
        async init() {
            this.collapse_left = false
            document.documentElement.setAttribute('lang', this.lang)
            document.documentElement.setAttribute('theme', this.theme)
        },
        changeLang() {
            this.lang = this.lang === 'zh' ? 'en' : 'zh'
            document.documentElement.setAttribute('lang', this.lang)
        },
        changeTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light'
            document.documentElement.setAttribute('theme', this.theme)
        },
        changeCollapseLeft() {
            this.collapse_left = !this.collapse_left
        },
        changeCollapseBottom() {
            this.collapse_bottom = !this.collapse_bottom
        }
    },
    // 启用持久化
    persist: true
})

export default useAppStore
