export default [
    {
        path: '/groups',
        name: 'Groups',
        component: () => import('@/views/Group/index.vue'),
        meta: {
            requiredAuth: true
        },
        children: [
            {
                path: 'manage-groups',
                name: 'ManageGroups',
                component: () => import('@/views/Group/ManageGroups.vue'),
                meta: { requiredAuth: true }
            },
            {
                path: 'manage-domain',
                name: 'ManageDomain',
                component: () => import('@/views/Group/ManageDomain.vue'),
                meta: { requiredAuth: true }
            },
            {
                path: 'paid-traffic',
                name: 'ManagePaidTraffic',
                component: () => import('@/views/Group/ManagePaidTraffic.vue'),
                meta: { requiredAuth: true }
            },
            {
                path: 'rotator-group',
                name: 'ManageRotatorGroup',
                component: () => import('@/views/Group/ManageRotatorGroup.vue'),
                meta: { requiredAuth: true }
            },
            {
                path: 'link-sequence',
                name: 'ManageLinkSequence',
                component: () => import('@/views/Group/ManageLinkSequence.vue'),
                meta: { requiredAuth: true }
            },
            {
                path: 'retargeting-pixels',
                name: 'ManageRetargetingPixels',
                component: () => import('@/views/Group/ManageRetargetingPixels.vue'),
                meta: { requiredAuth: true }
            },
            {
                path: 'holding-pages',
                name: 'ManageHoldingPages',
                component: () => import('@/views/Group/ManageHoldingPages.vue'),
                meta: { requiredAuth: true }
            },
            
        ]
    },
    {
        path: '/link-bank',
        name: 'LinkBank',
        component: () => import('@/views/linkBank/index.vue'),
        meta: {
            requiredAuth: true
        },
    },
    {
        path: '/link-bank/create-new-link-bank',
        name: 'LinkBankNewLink',
        component: () => import('@/views/linkBank/LinkBankCreateEditLink.vue'),
        meta: {
            requiredAuth: true
        },
    },
    {
        path: '/link-bank/edit-link-bank/:id',
        name: 'LinkBankEditLink',
        component: () => import('@/views/linkBank/LinkBankCreateEditLink.vue'),
        meta: {
            requiredAuth: true
        },
        props: true
    },
    {
        path: '/link-bank/my-links',
        name: 'LinkBankMyLinks',
        component: () => import('@/views/linkBank/LinkBankMyLinks.vue'),
        meta: {
            requiredAuth: true
        },
    },
    {
        path: '/campaigns/master-campaigns',
        name: 'MasterCampaignIndex',
        component: () => import('@/views/MasterCampaign/masterCampaignIndex.vue'),
        meta: {
            requiredAuth: true
        },
    },

]