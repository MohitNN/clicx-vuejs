<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Rotator Group" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Rotator Group that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('rotator-group')" size="small" label="Add Rotator Group" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Rotator Group</label>
                    <Dropdown v-model="selectedRotatorGroup" :options="rotatorGroupList" optionLabel="name" placeholder="Select Rotator Group" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('rotator-group')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('rotator-group')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="rotatorGroupModel" modal :draggable="false" header="Add Rotator Group" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="rotator_group_name">Rotator Group</label>
                    <InputText id="rotator_group_name" v-model="vv.rotator_group.name.$model" :class="vv?.rotator_group.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.rotator_group.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="rotatorGroupModel = false" text />
                    <Button label="Add Rotator Group" icon="pi pi-check" @click="submitForm('rotator-group')" autofocus />
                </template>
            </Dialog>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import store from '@/store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const confirm = useConfirm();
const rotator_group = ref({
    name: ''
});
const rules = {
    rotator_group: {
        name: { required: helpers.withMessage('The Rotator Group Name field is required', required) }
    }
};
const vv = useVuelidate(rules, { rotator_group });
const selectedRotatorGroup = ref();
const rotatorGroupModel = ref(false);
const rotatorGroupList = computed(() => store.state.GroupStore.rotatorGroupList);

const openModel = (modelType) => {
    if (modelType == 'rotator-group') {
        vv.value.rotator_group.$reset();
        rotator_group.value.name = '';
        rotator_group.value.rotator_group_id = '';
        rotatorGroupModel.value = true;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'rotator-group') {
        vv.value.rotator_group.$touch();
        if (vv.value.rotator_group.$invalid) return;
        let data = rotator_group.value;
        store
            .dispatch('GroupStore/saveRotatorGroup', data)
            .then((response) => {
                if (response.data.status) {
                    rotatorGroupModel.value = false;
                    selectedRotatorGroup.value = null;
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Rotator Group Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    }
};

const editItems = (modelType) => {
    if (modelType == 'rotator-group') {
        if (selectedRotatorGroup.value) {
            rotator_group.value.name = selectedRotatorGroup.value.name;
            rotator_group.value.rotator_group_id = selectedRotatorGroup.value.id;
            rotatorGroupModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Rotator Group!', life: 3000 });
        }
    }
};
const deleteItems = (modelType) => {
    if (modelType == 'rotator-group') {
        if (selectedRotatorGroup.value) {
            let data = { rotator_group_id: selectedRotatorGroup.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Rotator Group?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteRotatorGroup', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedRotatorGroup.value = null;
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Rotator Group Deleted Successfully!', life: 3000 });
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
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Rotator Group!', life: 3000 });
        }
    }
};

const init = async () => {
    await store
        .dispatch('GroupStore/getRotatorGroup')
        .then((response) => {})
        .catch((error) => {});
};

onMounted(async () => {
    await init();
});
</script>
