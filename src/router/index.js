import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import superadminroutes from './roles/superadminroutes';
import adminroutes from './roles/adminroutes';
import userroutes from './roles/userroutes';
import store from '@/store'

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: {
                    requiredAuth: true
                }
            },
            ...userroutes,
            // ...adminroutes,
            // ...superadminroutes,
            {
                path: '/pages/empty',
                name: 'empty',
                component: () => import('@/views/pages/Empty.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login.vue'),
        meta: {
            requiredAuth: false
        }
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        redirect: '/page-not-found'
    },
    {
        path: '/page-not-found',
        name: 'pageNotFound',
        component: () => import('@/views/pages/NotFound.vue'),
        meta: {
            requiredAuth: false
        }
    },

]

const router = createRouter({
    history: createWebHistory(),
    base: '/',
    routes,
});

router.beforeEach(async (to, from, next) => {
    const isLoggedIn = store.state.auth.authenticated
    const requiredAuth = to.matched.some((record) => record.meta.requiredAuth)
    const isAdmin = to.matched.some((record) => record.meta.isAdmin)
    const isUser = to.matched.some((record) => record.meta.isUser)
    let user = store.state.auth.user;
    const { path, name, params } = to
    if (isLoggedIn && ['login', 'forgotPassword', 'forgotView'].includes(name)) {
        return next('/')
    } else if (requiredAuth && isLoggedIn && isAdmin && user.role != 'admin') {
        return next('/login')
    } else if (requiredAuth && isLoggedIn && isUser && user.role != 'user') {
        return next('/login')
    } else if (requiredAuth && !isLoggedIn) {
        return next('/login')
    }
    return next()
})

export default router;
