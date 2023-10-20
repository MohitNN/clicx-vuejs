<script setup></script>

<template>
    <div>
        <router-view />
    <Toast />
    <ConfirmDialog :draggable="false"></ConfirmDialog>
    <VueElementLoading :active="is_Loading" spinner="bar-fade-scale" :is-full-screen="false" background-color="rgb(34 35 41 / 90%)" size="100" color="#6366f1" style="font-size:22px;"></VueElementLoading>
    </div>
</template>
<script setup>
import { ref,computed ,watch } from 'vue';
import store from '@/store';

const is_Loading = ref(false)

const counter = computed(() => store.state.globleStore.counter)

watch(counter, (newVal) => {
    if (newVal) {
        is_Loading.value = !is_Loading.value
    } else {
        is_Loading.value = false
    }
});

</script>
<style scoped></style>
