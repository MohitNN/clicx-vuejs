<script setup>
import { ref, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers , url } from '@vuelidate/validators';
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
        url: {
            required: helpers.withMessage('The Domain URL field is required', required),
            url: helpers.withMessage(`The Domain URL must be URL and URL must start with 'http://' or 'https:// `, url)
        },
    },
    completed_page: {
        name: { required: helpers.withMessage('The Completed Page Name field is required', required) },
        url: {
            required: helpers.withMessage('The Domain URL field is required', required),
            url: helpers.withMessage(`The Domain URL must be URL and URL must start with 'http://' or 'https:// `, url)
        },
    },
    error_page: {
        name: { required: helpers.withMessage('The Error Page Name field is required', required) },
        url: {
            required: helpers.withMessage('The Domain URL field is required', required),
            url: helpers.withMessage(`The Domain URL must be URL and URL must start with 'http://' or 'https:// `, url)
        },
    },
};
const vv = useVuelidate(rules, { pending_page, completed_page , error_page });
const selectedPendingPage = ref();
const selectedCompletedPage = ref();
const selectedErrorPage = ref();
const PendingPageList = ref([]);
const CompletedPageList = ref([]);
const ErrorPageList = ref([]);

const PendingPageModel = ref(false);
const CompletedPageModel = ref(false);
const ErrorPageModel = ref(false);

const openModel = (modelType) => {
    if (modelType == 'pending_page') {
        vv.value.pending_page.$reset();
        pending_page.value.name = '';
        pending_page.value.url = '';
        pending_page.value.page_id = '';
        PendingPageModel.value = true;
    } else if (modelType == 'completed_page') {
        vv.value.completed_page.$reset();
        completed_page.value.name = '';
        completed_page.value.url = '';
        completed_page.value.page_id = '';
        CompletedPageModel.value = true;
    }else if (modelType == 'error_page') {
        vv.value.error_page.$reset();
        error_page.value.name = '';
        error_page.value.url = '';
        error_page.value.page_id = '';
        ErrorPageModel.value = true;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'pending_page') {
        vv.value.pending_page.$touch();
        if (vv.value.pending_page.$invalid) return;
        let data = { ...pending_page.value , page_type: 'PendingPage'}
        store
            .dispatch('GroupStore/savePage', data)
            .then((response) => {
                if (response.data.status) {
                    PendingPageModel.value = false;
                    selectedPendingPage.value = null;
                    init()
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
        let data = { ...completed_page.value, page_type: 'CompletedPage'
        }
        store
            .dispatch('GroupStore/savePage', data)
            .then((response) => {
                if (response.data.status) {
                    CompletedPageModel.value = false;
                    selectedCompletedPage.value = null;
                    init()
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Paid Traffic Provider Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }else if (modelType == 'error_page') {
        vv.value.error_page.$touch();
        if (vv.value.error_page.$invalid) return;
        let data = { ...error_page.value, page_type: 'ErrorPage'}
        store
            .dispatch('GroupStore/savePage', data)
            .then((response) => {
                if (response.data.status) {
                    ErrorPageModel.value = false;
                    selectedErrorPage.value = null;
                    init()
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
    if (modelType == 'pending_page') {
        if (selectedPendingPage.value) {
            pending_page.value.name = selectedPendingPage.value.name;
            pending_page.value.url = selectedPendingPage.value.url;
            pending_page.value.page_id = selectedPendingPage.value.id;
            PendingPageModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Paid Traffic Group!', life: 3000 });
        }
    } else if (modelType == 'completed_page') {
        if (selectedCompletedPage.value) {
            completed_page.value.name = selectedCompletedPage.value.name;
            completed_page.value.url = selectedCompletedPage.value.url;
            completed_page.value.page_id = selectedCompletedPage.value.id;
            CompletedPageModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Paid Traffic Provider!', life: 3000 });
        }
    } else if (modelType == 'error_page') {
        if (selectedErrorPage.value) {
            error_page.value.name = selectedErrorPage.value.name;
            error_page.value.url = selectedErrorPage.value.url;
            error_page.value.   page_id = selectedErrorPage.value.id;
            ErrorPageModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Paid Traffic Provider!', life: 3000 });
        }
    }
};

const deleteItems = (modelType) => { 
    if (modelType == 'pending_page') {
        if (selectedPendingPage.value) {
            let data = { page_id: selectedPendingPage.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Paid Traffic Group?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deletePage', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedPendingPage.value = null
                                init()
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
    } else if (modelType == 'completed_page') {
        if (selectedCompletedPage.value) {
            let data = { page_id: selectedCompletedPage.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Paid Traffic Provider?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deletePage', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedCompletedPage.value = null
                                init()
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
    else if (modelType == 'error_page') {
        if (selectedErrorPage.value) {
            let data = { page_id: selectedErrorPage.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Paid Traffic Provider?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deletePage', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedErrorPage.value = null
                                init()
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
        .dispatch('GroupStore/getPage','PendingPage')
        .then((response) => {
            if(response.data.data){
                PendingPageList.value = response.data.data
            }
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getPage','CompletedPage')
        .then((response) => {
            if(response.data.data){
                CompletedPageList.value = response.data.data
            }
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getPage','ErrorPage')
        .then((response) => {
            if(response.data.data){
                ErrorPageList.value = response.data.data
            }
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
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Pending Page that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('pending_page')" size="small" label="Add Pending Page" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Pending Page</label>
                    <Dropdown v-model="selectedPendingPage" :options="PendingPageList" optionLabel="name" placeholder="Select Pending Page" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('pending_page')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('pending_page')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="PendingPageModel" modal :draggable="false" header="Add Pending Page" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="pending_page_name">Pending Page Name</label>
                    <InputText id="pending_page_name" v-model="vv.pending_page.name.$model" :class="vv?.pending_page.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.pending_page.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <div class="field p-fluid">
                    <label for="pending_page_url">Pending Page URl</label>
                    <InputText id="pending_page_url" v-model="vv.pending_page.url.$model" :class="vv?.pending_page.url?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.pending_page.url?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="PendingPageModel = false" text />
                    <Button label="Add Pending Page" icon="pi pi-check" @click="submitForm('pending_page')" autofocus />
                </template>
            </Dialog>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Completed Page" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Completed Page that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('completed_page')" size="small" label="Add Completed Page" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Completed Page</label>
                    <Dropdown v-model="selectedCompletedPage" :options="CompletedPageList" optionLabel="name" placeholder="Select Completed Page" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('completed_page')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('completed_page')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="CompletedPageModel" modal :draggable="false" header="Add Completed Page" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="completed_page_name">Paid Completed Page</label>
                    <InputText id="completed_page_name" v-model="vv.completed_page.name.$model" :class="vv?.completed_page.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.completed_page.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <div class="field p-fluid">
                    <label for="completed_page_url">Completed Page URl</label>
                    <InputText id="completed_page_url" v-model="vv.completed_page.url.$model" :class="vv?.completed_page.url?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.completed_page.url?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="CompletedPageModel = false" text />
                    <Button label="Add Paid Traffic Provider" icon="pi pi-check" @click="submitForm('completed_page')" autofocus />
                </template>
            </Dialog>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="404 Page" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of 404 Page that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('error_page')" size="small" label="Add 404 Page" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select 404 Page</label>
                    <Dropdown v-model="selectedErrorPage" :options="ErrorPageList" optionLabel="name" placeholder="Select 404 Page" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('error_page')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('error_page')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="ErrorPageModel" modal :draggable="false" header="Add 404 Page" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="error_page_name">404 Page Name</label>
                    <InputText id="error_page_name" v-model="vv.error_page.name.$model" :class="vv?.error_page.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.error_page.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <div class="field p-fluid">
                    <label for="error_page_url">404 Page URL</label>
                    <InputText id="error_page_url" v-model="vv.error_page.url.$model" :class="vv?.error_page.url?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.error_page.url?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="ErrorPageModel = false" text />
                    <Button label="Add 404 Page" icon="pi pi-check" @click="submitForm('error_page')" autofocus />
                </template>
            </Dialog>
        </div>
    </div>
</template>
