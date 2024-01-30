<script setup>
import { ref , computed} from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import store from '@/store';
const userInfo = computed(() => store.state.auth.user);
const is_admin_menu = 'admin';
const is_all_menu = 'all';
// const is_user_menu = 'user';
// const is_free_user_menu = 'free_user';
// const is_pro_user_menu = 'pro_user';

const model = ref([
    {
        is_menu: is_all_menu,
        label: '',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        ...(userInfo.value.role == "admin") 
        ? 
        {
            is_menu: is_admin_menu,
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Create New User',
                            icon: 'pi pi-fw pi-user-plus',
                            to: '/users/create-new-user',
                        },
                        {
                            label: 'User List',
                            icon: 'pi pi-fw pi-user',
                            to: '/users/manage-users',
                        }
                    ]
                }
            ]
        } 
        : 
        {

        }
    },
    {
        to: '/link-bank',
        is_menu: is_all_menu,
        groupMenu: true,
        items: [
            {
                label: 'Link Bank',
                icon: 'pi pi-fw pi-link',
                items: [
                    {
                        label: 'Create New Link',
                        icon: 'pi pi-fw pi-file-export',
                        to: '/link-bank/create-new-link-bank',
                    },
                    {
                        label: 'Link Bank',
                        icon: 'pi pi-fw pi-database ',
                        to: '/link-bank/my-links',
                    }
                ]
            }
        ]
    },
    {
        is_menu: is_all_menu,
        items: [{ label: 'Manage Settings', icon: 'pi pi-cog', to: '/groups/manage-groups', groupMenu: true }]
    },

    {
        is_menu: is_all_menu,
        items: [{ label: 'Master Campaigns', icon: 'pi pi-chart-bar', to: '/campaigns/master-campaigns' }]
    },
    {
        is_menu: is_all_menu,
        to: '/pages',
        items: [
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
            }
        ]
    },
    
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <AppMenuItem v-if="!item.separator" :item="item" :index="i"></AppMenuItem>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
