<script setup>
import { onMounted, ref, computed, inject } from 'vue';
import UserTable from "./UserTable.vue"
import store from '@/store';
import { useRouter } from 'vue-router';
const router = useRouter();
const page = ref(1);
const goToCreatePage = () => {
    router.push({ name: 'AdminUserCreate' });
};
const userList = computed(() => store.state.AdminUserStore.userList);
const init = async () => {
    await store
        .dispatch('AdminUserStore/getUsersList')
        .then((response) => {})
        .catch((error) => {});
};
onMounted(async () => {
    await init();
});
</script>
<template>
    <h3>Users</h3>
    <div className="card flex justify-content-between align-items-center">
        <h5 class="mb-0">Manage Users</h5>
        <Button @click="goToCreatePage()" label="Add New User" icon="pi pi-user-plus" outlined />
    </div>

    <div className="card">
        <UserTable :userList="userList"/>
    </div>
</template>
