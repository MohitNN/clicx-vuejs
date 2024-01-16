<script setup>
import { ref, onMounted , computed  } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, url } from '@vuelidate/validators';
import MasterCampaignTable from './masterCampaignTable.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import store from '@/store';
const toast = useToast();
const confirm = useConfirm();
const master_campaign = ref({
    name: '',
    status: 'Active'
});
const MasterCampaignModel = ref(false);
const statusList = ref(['Active', 'Completed']);
const rules = {
    master_campaign: {
        name: { required: helpers.withMessage('The Master Campaign Name field is required', required) }
    }
};
const masterCampaignList = computed(() => store.state.MasterCampaignStore.masterCampaignList);

const vv = useVuelidate(rules, { master_campaign });

const openMasterCampaign = () => {
    vv.value.master_campaign.$reset();
    master_campaign.value.name = '';
    master_campaign.value.status = 'Active';
    master_campaign.value.master_campaign_id = null;
    MasterCampaignModel.value = true;

};
const submitForm = () => {
    vv.value.master_campaign.$touch();
    if (vv.value.master_campaign.$invalid) return;
    let data = { ...master_campaign.value };
    store
        .dispatch('MasterCampaignStore/createMasterCampaign', data)
        .then((response) => {
            if (response.data.status) {
                MasterCampaignModel.value = false;
                selectedPendingPage.value = 'Active';
                init();
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Master Campaign Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

const init = async () => {
    await store
        .dispatch('MasterCampaignStore/getListMasterCampaign')
        .then((response) => {})
        .catch((error) => {});
};
const onEditCampaign = async (data) => {
    MasterCampaignModel.value = true;
    master_campaign.value.name = data.name;
    master_campaign.value.status = data.status;
    master_campaign.value.master_campaign_id = data.id;
};
onMounted(async () => {
    await init();
});
</script>
<template>
    <h3>Master Campaign</h3>
    <div className="card flex justify-content-between align-items-center">
        <h5 class="mb-0">Master Campaigns List</h5>
        <Button label="Add New Master Campaign" icon="pi pi-plus" @click="openMasterCampaign()" outlined />
    </div>
    <div className="card">
        <MasterCampaignTable @edit-campaign="onEditCampaign" :masterCampaignList="masterCampaignList"/>
        <Dialog v-model:visible="MasterCampaignModel" modal :draggable="false" header="Add 404 Page" :style="{ width: '30vw' }">
            <div class="field p-fluid">
                <label for="master_campaign_name">Master Campaign Name</label>
                <InputText id="master_campaign_name" v-model="vv.master_campaign.name.$model" :class="vv?.master_campaign.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                <small class="p-error" id="text-error">{{ vv?.master_campaign.name?.$errors[0]?.$message || '&nbsp;' }}</small>
            </div>
            <div class="field p-fluid">
                <label for="master_campaign_status">Status</label>
                <Dropdown v-model="master_campaign.status" :options="statusList" placeholder="Select status" class="w-full"> </Dropdown>
            </div>
            <template #footer>
                <Button label="Cancle" severity="danger" icon="pi pi-times" @click="MasterCampaignModel = false" text />
                <Button label="Add Master Campaign" icon="pi pi-check" @click="submitForm()" autofocus />
            </template>
        </Dialog>
    </div>
</template>
