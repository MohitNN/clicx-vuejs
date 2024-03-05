<script setup>
import { ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import store from '@/store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const confirm = useConfirm();

const group = ref({
    name: ''
});
const vendor = ref({
    name: ''
});
const split_partner = ref({
    name: ''
});
const link_platform = ref({
    name: ''
});
const selectedGroup = ref();
const selectedVendor = ref();
const selectedSplitPartner = ref();
const selectedLinkPlatform = ref();

const rules = {
    group: {
        name: { required: helpers.withMessage('The Group Name field is required', required) }
    },
    vendor: {
        name: { required: helpers.withMessage('The Vendor Name field is required', required) }
    },
    split_partner: {
        name: { required: helpers.withMessage('The Split Partner Name field is required', required) }
    },
    link_platform: {
        name: { required: helpers.withMessage('The Link Platform Name field is required', required) }
    }
};
const vv = useVuelidate(rules, { group, vendor, split_partner, link_platform });

const groupList = computed(() => store.state.GroupStore.groupList);
const vendorList = computed(() => store.state.GroupStore.vendorList);
const split_partnerList = computed(() => store.state.GroupStore.split_partnerList);
const link_platformList = computed(() => store.state.GroupStore.link_platformList);

const vendorModelShow = ref(false);
const groupModelShow = ref(false);
const split_partnerModelShow = ref(false);
const link_platformModelShow = ref(false);

const openModel = (modelType) => {
    if (modelType == 'vendor') {
        vv.value.vendor.$reset();
        vendor.value.name = '';
        vendor.value.vendor_id = '';
        vendorModelShow.value = true;
    } else if (modelType == 'group') {
        vv.value.group.$reset();
        group.value.name = '';
        group.value.group_id = '';
        groupModelShow.value = true;
    } else if (modelType == 'link-platform') {
        vv.value.link_platform.$reset();
        link_platform.value.name = '';
        link_platform.value.link_platform_id = '';
        link_platformModelShow.value = true;
    } else if (modelType == 'split-partner') {
        vv.value.split_partner.$reset();
        split_partner.value.name = '';
        split_partner.value.split_partner_id = '';
        split_partnerModelShow.value = true;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'vendor') {
        vv.value.vendor.$touch();
        if (vv.value.vendor.$invalid) return;
        let data = vendor.value;
        store
            .dispatch('GroupStore/saveVendor', data)
            .then((response) => {
                if (response.data.status) {
                    vendorModelShow.value = false;
                    selectedVendor.value=null
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Vendor Added Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    } else if (modelType == 'group') {
        vv.value.group.$touch();
        if (vv.value.group.$invalid) return;
        let data = group.value;
        store
            .dispatch('GroupStore/saveGroup', data)
            .then((response) => {
                if (response.data.status) {
                    groupModelShow.value = false;
                    selectedGroup.value=null
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Group Added Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    } else if (modelType == 'split-partner') {
        vv.value.split_partner.$touch();
        if (vv.value.split_partner.$invalid) return;
        let data = split_partner.value;
        store
            .dispatch('GroupStore/saveSplitPartner', data)
            .then((response) => {
                if (response.data.status) {
                    split_partnerModelShow.value = false;
                    selectedSplitPartner.value=null
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Split Partner Added Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    } else if (modelType == 'link-platform') {
        vv.value.link_platform.$touch();
        if (vv.value.link_platform.$invalid) return;
        let data = link_platform.value;
        store
            .dispatch('GroupStore/saveLinkPlatform', data)
            .then((response) => {
                if (response.data.status) {
                    link_platformModelShow.value = false;
                    selectedLinkPlatform.value=null
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Platform Added Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    }
};

const deleteItems = (modelType) => {
    if (modelType == 'vendor') {
        if (selectedVendor.value) {
            let data = { vendor_id: selectedVendor.value.id };
            confirm.require({
                message: 'Are you sure you want to delete selected vendor?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteVendor', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedVendor.value = null
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Vendor Deleted Successfully!', life: 3000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                            }
                        })
                        .catch((error) => {});
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Vendor!', life: 3000 });
        }
    } else if (modelType == 'group') {
        if (selectedGroup.value) {
            let data = { group_id: selectedGroup.value.id };
            confirm.require({
                message: 'Are you sure you want to delete selected group?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteGroup', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedGroup.value = null
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Group Deleted Successfully!', life: 3000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                            }
                        })
                        .catch((error) => {});
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Group!', life: 3000 });
        }
    } else if (modelType == 'split-partner') {
        if (selectedSplitPartner.value) {
            let data = { split_partner_id: selectedSplitPartner.value.id };
            confirm.require({
                message: 'Are you sure you want to delete selected Split Partner?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteSplitPartner', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedSplitPartner.value = null
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Split Partner Deleted Successfully!', life: 3000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                            }
                        })
                        .catch((error) => {});
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Split Partner!', life: 3000 });
        }
    } else if (modelType == 'link-platform') {
        if (selectedLinkPlatform.value) {
            let data = { link_platform_id: selectedLinkPlatform.value.id };
            confirm.require({
                message: 'Are you sure you want to delete selected Link Platform?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteLinkPlatform', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedLinkPlatform.value = null
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Platform Deleted Successfully!', life: 3000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                            }
                        })
                        .catch((error) => {});
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Link Platform!', life: 3000 });
        }
    }
};

const editItems = (modelType) => {
    if (modelType == 'vendor') {
        if (selectedVendor.value) {
            vendor.value.name = selectedVendor.value.name;
            vendor.value.vendor_id = selectedVendor.value.id;
            vendorModelShow.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Vendor!', life: 3000 });
        }
    } else if (modelType == 'group') {
        if (selectedGroup.value) {
            group.value.name = selectedGroup.value.name;
            group.value.group_id = selectedGroup.value.id;
            groupModelShow.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Group!', life: 3000 });
        }
    } else if (modelType == 'link-platform') {
        if (selectedLinkPlatform.value) {
            link_platform.value.name = selectedLinkPlatform.value.name;
            link_platform.value.link_platform_id = selectedLinkPlatform.value.id;
            link_platformModelShow.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Link Platform!', life: 3000 });
        }
    } else if (modelType == 'split-partner') {
        if (selectedSplitPartner.value) {
            split_partner.value.name = selectedSplitPartner.value.name;
            split_partner.value.split_partner_id = selectedSplitPartner.value.id;
            split_partnerModelShow.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Split Partner!', life: 3000 });
        }
    }
};

const init = async () => {
    await store
        .dispatch('GroupStore/getGroupList')
        .then((response) => {})
        .catch((error) => {});
    await store
        .dispatch('GroupStore/getVendorList')
        .then((response) => {})
        .catch((error) => {});
    await store
        .dispatch('GroupStore/getSplitPartnerList')
        .then((response) => {})
        .catch((error) => {});
    await store
        .dispatch('GroupStore/getLinkPlatformList')
        .then((response) => {})
        .catch((error) => {});
};

const closeDialog = (event) => {
    console.log(1);
};

// const dropdownFuncallback = (event) => {
//     console.log(event)
// };

onMounted(async () => {
    await init();
});
</script>
<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Vendors" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of vendors that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('vendor')" size="small" label="Add Vendor" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Vendor</label>
                    <Dropdown  v-model="selectedVendor" :options="vendorList"  optionLabel="name" placeholder="Select A Vendor" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('vendor')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('vendor')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Groups" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of Groups that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('group')" size="small" label="Add Group" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Group</label>
                    <Dropdown v-model="selectedGroup" :options="groupList"  optionLabel="name" placeholder="Select Group" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('group')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('group')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
        </div>

        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Split Partner" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of Split Partner that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('split-partner')" size="small" label="Add Split Partner" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Split Partner</label>
                    <Dropdown v-model="selectedSplitPartner" :options="split_partnerList"  optionLabel="name" placeholder="Select Split Partner" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('split-partner')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('split-partner')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
        </div>

        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Link Platform" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of Link Platform that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('link-platform')" size="small" label="Add Link Platform" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Link Platform</label>
                    <Dropdown v-model="selectedLinkPlatform" :options="link_platformList"  optionLabel="name" placeholder="Select Link Platform" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('link-platform')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('link-platform')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
        </div>
        <!-- <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Default Domain" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of Groups that you want to associate to your individual Link</p>
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Domain</label>
                    <Dropdown v-model="selectedCountry" :options="countries"  optionLabel="name" placeholder="Select A Vendor" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
            </Panel>
        </div> -->
    </div>
    <Dialog v-model:visible="vendorModelShow" modal :draggable="false" header="Add Vendor" :style="{ width: '30vw' }">
        <div class="field p-fluid">
            <label for="vendor">Vendor Name</label>
            <InputText id="vendor" v-model="vv.vendor.name.$model" :class="vv?.vendor.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv?.vendor.name?.$errors[0]?.$message || '&nbsp;' }}</small>
        </div>
        <template #footer>
            <Button label="Cancle" severity="danger" icon="pi pi-times" @click="vendorModelShow = false" text />
            <Button label="Add Vendor" icon="pi pi-check" @click="submitForm('vendor')" autofocus />
        </template>
    </Dialog>

    <Dialog v-model:visible="groupModelShow" @update:visible="closeDialog($event)" modal :draggable="false" header="Add Group" :style="{ width: '30vw' }">
        <div class="field p-fluid">
            <label for="group_name">Group Name</label>
            <InputText id="group_name" v-model="vv.group.name.$model" :class="vv?.group.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv?.group.name?.$errors[0]?.$message || '&nbsp;' }}</small>
        </div>
        <template #footer>
            <Button label="Cancle" severity="danger" icon="pi pi-times" @click="groupModelShow = false" text />
            <Button label="Add Group" icon="pi pi-check" @click="submitForm('group')" autofocus />
        </template>
    </Dialog>

    <Dialog v-model:visible="split_partnerModelShow" @update:visible="closeDialog($event)" modal :draggable="false" header="Add Split Partner" :style="{ width: '30vw' }">
        <div class="field p-fluid">
            <label for="split_partner_name">Split Partner Name</label>
            <InputText id="split_partner_name" v-model="vv.split_partner.name.$model" :class="vv?.split_partner.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv?.split_partner.name?.$errors[0]?.$message || '&nbsp;' }}</small>
        </div>
        <template #footer>
            <Button label="Cancle" severity="danger" icon="pi pi-times" @click="split_partnerModelShow = false" text />
            <Button label="Add Split Partner" icon="pi pi-check" @click="submitForm('split-partner')" autofocus />
        </template>
    </Dialog>

    <Dialog v-model:visible="link_platformModelShow" @update:visible="closeDialog($event)" modal :draggable="false" header="Add Link Platform" :style="{ width: '30vw' }">
        <div class="field p-fluid">
            <label for="link_platform_name">Link Platform Name</label>
            <InputText id="link_platform_name" v-model="vv.link_platform.name.$model" :class="vv?.link_platform.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv?.link_platform.name?.$errors[0]?.$message || '&nbsp;' }}</small>
        </div>
        <template #footer>
            <Button label="Cancle" severity="danger" icon="pi pi-times" @click="link_platformModelShow = false" text />
            <Button label="Add Link Platform" icon="pi pi-check" @click="submitForm('link-platform')" autofocus />
        </template>
    </Dialog>
</template>
