export default [
    {
        path: '/users/manage-users',
        name: 'AdminUserIndex',
        component: () => import('@/views/users/UserIndex.vue'),
        meta: {
            requiredAuth: true,
            isAdmin: true
        }
    },
    {
        path: '/users/create-new-user',
        name: 'AdminUserCreate',
        component: () => import('@/views/users/UserCreateEditPage.vue'),
        meta: {
            requiredAuth: true,
            isAdmin: true
        },
    },
    {
        path: '/users/edit-user/:id',
        name: 'AdminUserEdit',
        component: () => import('@/views/users/UserCreateEditPage.vue'),
        meta: {
            requiredAuth: true,
            isAdmin: true
        },
        props: true
    },
];
