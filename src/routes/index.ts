import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        name: 'chat',
        path: '/',
        component: () => import('../layouts/index.vue'),
        redirect: '/openai',
        children: [
            {
                name: 'openai',
                path: '/openai',
                component: () => import('../layouts/openai/index.vue'),
                children: [
                    {
                        name: 'session',
                        path: '/openai/:id?',
                        component: () => import('../views/openai/index.vue')
                    }
                ]
            }
        ]
    }
    // {
    //     name: 'demo',
    //     path: '/',
    //     component: () => import('../views/demo/index.vue'),
    // }
]

const router = createRouter({
    history: createWebHistory('/'),
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
