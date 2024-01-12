<script setup>
import { onMounted, ref, computed , inject} from 'vue';
import LinkBankMyLinksTable from './LinkBankMyLinksTable.vue';
import store from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref(0)

const page = ref(1)
const activeTabTitle = ref('All')
const linkBankLinkList = computed(() => store.state.LinkbankStore.linkBankList);

const changTabEvent = ((data) => {
    activeTabTitle.value = data.originalEvent.target.innerText;
})
const goToCreateLinkBank = (() => {
    router.push({ name: 'LinkBankNewLink' })
})
const init = async () => {
    await store
        .dispatch('LinkbankStore/getLinkBank',{page : page.value , status : activeTabTitle.value})
        .then((response) => {})
        .catch((error) => {
            console.log(error);
        });

};
onMounted(async () => {
    await init();
});
</script>
<template>
    <h3>Link Bank Stats</h3>
    <div className="card flex justify-content-between align-items-center">
        <h5 class="mb-0">Link Banks List</h5>
        <Button label="Add New Link" @click="goToCreateLinkBank" icon="pi pi-plus" outlined />
    </div>
    <div className="card">
        <TabView @tab-change="changTabEvent" v-model:activeIndex="activeTab">
            <TabPanel header="All">
                <LinkBankMyLinksTable :linkBanklList="linkBankLinkList" :activeTabIndex="activeTab" :activeTabTitle="activeTabTitle" />
            </TabPanel>
            <TabPanel header="Active">
                <LinkBankMyLinksTable :linkBanklList="linkBankLinkList" :activeTabIndex="activeTab" :activeTabTitle="activeTabTitle" />
            </TabPanel>
            <TabPanel header="Pending">
                <LinkBankMyLinksTable :linkBanklList="linkBankLinkList" :activeTabIndex="activeTab" :activeTabTitle="activeTabTitle" />
            </TabPanel>
            <TabPanel header="Completed">
                <LinkBankMyLinksTable :linkBanklList="linkBankLinkList" :activeTabIndex="activeTab" :activeTabTitle="activeTabTitle" />
            </TabPanel>
            <TabPanel header="Evergreen">
                <LinkBankMyLinksTable :linkBanklList="linkBankLinkList" :activeTabIndex="activeTab" :activeTabTitle="activeTabTitle" />
            </TabPanel>
            <TabPanel header="My Links">
                <LinkBankMyLinksTable :linkBanklList="linkBankLinkList" :activeTabIndex="activeTab" :activeTabTitle="activeTabTitle" />
            </TabPanel>
        </TabView>
    </div>
</template>
