<template>
    <div className="card">
        <TabMenu :model="items" />
    </div>
    <router-view />
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const active = ref(0);

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
]);

</script>