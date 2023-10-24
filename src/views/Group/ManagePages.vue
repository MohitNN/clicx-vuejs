<script setup>
import { ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import store from '@/store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const confirm = useConfirm();
const pending_page = ref({
    name: '',
    url: ''
});
const error_page = ref({
    name: '',
    url: ''
});
const completed_page = ref({
    name: '',
    url: ''
});
const rules = {
    pending_page: {
        name: { required: helpers.withMessage('The Pending Page Name field is required', required) },
        url: { required: helpers.withMessage('The Pending Page URl field is required', required) }
    },
    completed_page: {
        name: { required: helpers.withMessage('The Completed Page Name field is required', required) },
        url: { required: helpers.withMessage('The Completed Page URl field is required', required) }
    },
    error_page: {
        name: { required: helpers.withMessage('The Error Page Name field is required', required) },
        url: { required: helpers.withMessage('The Error Page URl field is required', required) }
    },
};
const vv = useVuelidate(rules, { pending_page, completed_page , error_page });
const selectedPaidTrafficGroup = ref();
const selectedPaidTrafficProvider = ref();
const paidTrafficGroupList = computed(() => store.state.GroupStore.paidTrafficGroupList);
const paidTrafficProviderList = computed(() => store.state.GroupStore.paidTrafficProviderList);

const paidTrafficGroupModel = ref(false);
const paidTrafficProviderModel = ref(false);

const openModel = (modelType) => {
    if (modelType == 'pending_page') {
        vv.value.pending_page.$reset();
        pending_page.value.name = '';
        pending_page.value.url = '';
        pending_page.value.pending_page_id = '';
        paidTrafficGroupModel.value = true;
    } else if (modelType == 'completed_page') {
        vv.value.completed_page.$reset();
        completed_page.value.name = '';
        completed_page.value.url = '';
        completed_page.value.completed_page_id = '';
        paidTrafficProviderModel.value = true;
    }else if (modelType == 'error_page') {
        vv.value.completed_page.$reset();
        error_page.value.name = '';
        error_page.value.url = '';
        error_page.value.completed_page_id = '';
        paidTrafficProviderModel.value = true;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'pending_page') {
        vv.value.pending_page.$touch();
        if (vv.value.pending_page.$invalid) return;
        let data = pending_page.value;
        store
            .dispatch('GroupStore/savePaidTrafficGroup', data)
            .then((response) => {
                if (response.data.status) {
                    paidTrafficGroupModel.value = false;
                    selectedPaidTrafficGroup.value = null;
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Paid Traffic Group Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else if (modelType == 'completed_page') {
        vv.value.completed_page.$touch();
        if (vv.value.completed_page.$invalid) return;
        let data = completed_page.value;
        store
            .dispatch('GroupStore/savePaidTrafficProvider', data)
            .then((response) => {
                if (response.data.status) {
                    paidTrafficProviderModel.value = false;
                    selectedPaidTrafficProvider.value = null;
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Paid Traffic Provider Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
};

const editItems = (modelType) => {
    if (modelType == 'error_page') {
        if (selectedPaidTrafficGroup.value) {
            pending_page.value.name = selectedPaidTrafficGroup.value.name;
            pending_page.value.pending_page_id = selectedPaidTrafficGroup.value.id;
            paidTrafficGroupModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Paid Traffic Group!', life: 3000 });
        }
    } else if (modelType == 'paid-traffic-provider') {
        if (selectedPaidTrafficProvider.value) {
            completed_page.value.name = selectedPaidTrafficProvider.value.name;
            completed_page.value.completed_page_id = selectedPaidTrafficProvider.value.id;
            paidTrafficProviderModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Paid Traffic Provider!', life: 3000 });
        }
    }
};

const deleteItems = (modelType) => { 
    if (modelType == 'paid-traffic-group') {
        if (selectedPaidTrafficGroup.value) {
            let data = { pending_page_id: selectedPaidTrafficGroup.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Paid Traffic Group?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deletePaidTrafficGroup', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedPaidTrafficGroup.value = null
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Paid Traffic Group Deleted Successfully!', life: 3000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Group!', life: 3000 });
        }
    } else if (modelType == 'paid-traffic-provider') {
        if (selectedPaidTrafficProvider.value) {
            let data = { completed_page_id: selectedPaidTrafficProvider.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Paid Traffic Provider?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deletePaidTrafficProvider', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedPaidTrafficProvider.value = null
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Paid Traffic Provider Deleted Successfully!', life: 3000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Group!', life: 3000 });
        }
    }
}

const init = async () => {
    await store
        .dispatch('GroupStore/getPaidTrafficGroup')
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getPaidTrafficProvider')
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
};

onMounted(async () => {
    await init();
});
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Pending Page" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Link Platform that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('paid-traffic-group')" size="small" label="Add Paid Traffic Group" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Pending Page</label>
                    <Dropdown v-model="selectedPaidTrafficGroup" :options="paidTrafficGroupList" optionLabel="name" placeholder="Select Pending Page" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('paid-traffic-group')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('paid-traffic-group')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="paidTrafficGroupModel" modal :draggable="false" header="Add Pending Page" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="pending_page_name">Pending Page Name</label>
                    <InputText id="pending_page_name" v-model="vv.pending_page.name.$model" :class="vv?.pending_page.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.pending_page.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <div class="field p-fluid">
                    <label for="pending_page_name">Pending Page URl</label>
                    <InputText id="pending_page_name" v-model="vv.pending_page.url.$model" :class="vv?.pending_page.url?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.pending_page.url?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="paidTrafficGroupModel = false" text />
                    <Button label="Add Pending Page" icon="pi pi-check" @click="submitForm('paid-traffic-group')" autofocus />
                </template>
            </Dialog>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Completed Page" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Link Platform that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('paid-traffic-provider')" size="small" label="Add Paid Traffic Provider" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Paid Traffic Provider</label>
                    <Dropdown v-model="selectedPaidTrafficProvider" :options="paidTrafficProviderList" optionLabel="name" placeholder="Select Paid Traffic Provider" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('paid-traffic-provider')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('paid-traffic-provider')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="paidTrafficProviderModel" modal :draggable="false" header="Add Paid Traffic Provider" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="completed_page_name">Paid Traffic Provider Name</label>
                    <InputText id="completed_page_name" v-model="vv.completed_page.name.$model" :class="vv?.completed_page.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.completed_page.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="paidTrafficProviderModel = false" text />
                    <Button label="Add Paid Traffic Provider" icon="pi pi-check" @click="submitForm('paid-traffic-provider')" autofocus />
                </template>
            </Dialog>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="404 Page" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Link Platform that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('paid-traffic-group')" size="small" label="Add Paid Traffic Group" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Paid Traffic Group</label>
                    <Dropdown v-model="selectedPaidTrafficGroup" :options="paidTrafficGroupList" optionLabel="name" placeholder="Select Paid Traffic Group" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('paid-traffic-group')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('paid-traffic-group')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="paidTrafficGroupModel" modal :draggable="false" header="Add Paid Traffic Group" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="pending_page_name">Paid Traffic Group Name</label>
                    <InputText id="pending_page_name" v-model="vv.pending_page.name.$model" :class="vv?.pending_page.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.pending_page.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="paidTrafficGroupModel = false" text />
                    <Button label="Add Paid Traffic Group" icon="pi pi-check" @click="submitForm('paid-traffic-group')" autofocus />
                </template>
            </Dialog>
        </div>
    </div>
</template>
