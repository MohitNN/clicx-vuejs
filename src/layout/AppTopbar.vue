

<script setup>
import { ref, computed, onMounted, onBeforeUnmount , watch  } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import store from '@/store'
import { useToast } from "primevue/usetoast";
const confirm = useConfirm();
const toast = useToast();

const { layoutConfig, onMenuToggle , changeThemeSettings } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const darkMode = computed(() => store.state.globleStore.darkMode);
onMounted(() => {
    bindOutsideClickListener();
});
// const home = ref({
//     icon: 'pi pi-home',
//     to: '/',
// });
// const items = ref([
//     {label: 'Computer'},
//     {label: 'Notebook'},
//     {label: 'Accessories'},
//     {label: 'Backpacks'},
//     {label: 'Item'}
// ]);

const onChangeTheme = (theme, mode) => {
    const elementId = 'theme-css';
    const linkElement = document.getElementById(elementId);
    const cloneLinkElement = linkElement.cloneNode(true);
    const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme);
    cloneLinkElement.setAttribute('id', elementId + '-clone');
    cloneLinkElement.setAttribute('href', newThemeUrl);
    cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', elementId);
        changeThemeSettings(theme, mode === 'dark');
    });
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
};

onMounted(() => {
    if(darkMode.value){
        onChangeTheme('vela-blue', 'dark')
    }else{
        onChangeTheme('lara-light-indigo', 'light')
    }
})

const setMode = () => {
    if(darkMode.value){
        store.dispatch('globleStore/setDarkMode',false)
        onChangeTheme('lara-light-indigo', 'light')
    }else{
        store.dispatch('globleStore/setDarkMode',true) 
        onChangeTheme('vela-blue', 'dark')
    }
}



onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
const menu = ref(null);
const logout = (() => {
    store.dispatch('globleStore/setcounter')
    store.dispatch('auth/logout').then((response) => {
        if(response.data.status) {

            router.push({ path : '/login' })
            store.dispatch('globleStore/setcounter')
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Logout Successfully!', life: 3000 });

        }
    }).catch((error) => {
        console.log(error);
        store.dispatch('globleStore/setcounter')
    })
})
const overlayMenuItems = ref([
    {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        command: () => {
            alert('profile')
        }
    },
    {
        separator: true
    },
    {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
            confirm.require({
                message: 'Are you sure you want to logout?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'top',
                accept: () => {
                    logout()
                    // toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Logout Successfully!', life: 3000 });
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        }
    }
]);
const toggleMenu = (event) => {
    menu.value.toggle(event);
};

</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>SAKAI</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>
        <!-- <Breadcrumb :home="home" :model="items"  class="ml-3"/> -->
        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button> -->
            
                <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
                <div class="flex align-items-center">
                    <ToggleButton @change="setMode()" onLabel="" offLabel="" onIcon="pi pi-sun" offIcon="pi pi-moon" class="w-2rem h-2rem p-button-rounded p-2" />
                    <button @click="toggleMenu" type="button" class="p-link layout-topbar-button">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>

            <!-- <button @click="onSettingsClick()" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button> -->
            <!-- <Menubar :model="nestedMenuitems">
                    
            </Menubar> -->
        </div>
    </div>
</template>

<style>
.pi-sun{
    color: white !important;
}
.pi-moon{
    color: #6366F1 !important;
}
</style>
