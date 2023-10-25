<script setup>
import { ref } from "vue";
const items = ref([
    {
        label: 'Link Bank',
        icon: 'pi pi-fw pi-home',
        to: 'manage-groups'
    },
    {
        label: 'Manage Domain',
        icon: 'pi pi-fw pi-database',
        to: 'manage-domain'
    },
    {
        label: 'Paid Traffic',
        icon: 'pi pi-fw pi-dollar',
        to: 'paid-traffic'
    },
    {
        label: 'Rotator Group',
        icon: 'pi pi-fw pi-sitemap',
        to: 'rotator-group'
    },
    {
        label: 'Link Sequence',
        icon: 'pi pi-fw pi-link',
        to: 'link-sequence'
    },
    {
        label: 'Retargeting Pixels',
        icon: 'pi pi-fw pi-server',
        to: 'retargeting-pixels'
    },
    {
        label: 'Holding Pages',
        icon: 'pi pi-fw pi-book',
        to: 'holding-pages'
    },
]);

</script>
<template>
    <div className="card">
        <TabMenu :model="items" />
    </div>
    <router-view />
</template>