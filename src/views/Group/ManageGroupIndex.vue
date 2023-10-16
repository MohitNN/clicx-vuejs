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
        icon: 'pi pi-fw pi-calendar',
        to: 'manage-domain'
    },
    {
        label: 'Holding Pages',
        icon: 'pi pi-fw pi-server',
        to: 'manage-domain'
    },
]);

</script>