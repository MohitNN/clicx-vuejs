export default [
    {
        path: '/groups',
        name: 'Groups',
        component: () => import('@/views/Group/ManageGroupIndex.vue'),
        meta: {
            requiredAuth: true
        },
        children: [
            {
                path: 'manage-groups',
                name: 'ManageGroups',
                component: () => import('@/views/Group/manageGroup.vue'),
                meta: { requiredAuth: true }
            },
            {
                path: 'manage-domain',
                name: 'ManageDomain',
                component: () => import('@/views/Group/manageDomain.vue'),
                meta: { requiredAuth: true }
            },
        ]
    },

]