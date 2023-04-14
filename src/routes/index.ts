import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ViewChat from '../views/chat/index.vue'

const routes: RouteRecordRaw[] = [
    {
        name: 'chat',
        path: '/',
        component: ViewChat,
        meta: {
            title: '聊天'
        }
    }
]

const base: string = import.meta.env.MODE == 'github' ? '/doc/' : '/'

const router = createRouter({
    history: createWebHistory(base),
    scrollBehavior() {
        // 始终滚动到顶部
        return { top: 0, behavior: 'smooth' }
    },
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title as string
    }
    next()
})

export default router
