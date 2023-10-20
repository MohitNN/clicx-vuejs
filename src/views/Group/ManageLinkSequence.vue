<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Link Sequence Group" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Link Sequence Group that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('link-sequence')" size="small" label="Add Link Sequence Group" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Link Sequence Group</label>
                    <Dropdown v-model="selectedLinkSequence" :options="link_sequenceList" optionLabel="name" placeholder="Select Link Sequence Group" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('link-sequence')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('link-sequence')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="LinkSequenceModel" modal :draggable="false" header="Add Link Sequence Group" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="link_sequence_name">Link Sequence Group</label>
                    <InputText id="link_sequence_name" v-model="vv.link_sequence.name.$model" :class="vv?.link_sequence.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.link_sequence.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="LinkSequenceModel = false" text />
                    <Button label="Add Link Sequence Group" icon="pi pi-check" @click="submitForm('link-sequence')" autofocus />
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
const link_sequence = ref({
    name: ''
});
const rules = {
    link_sequence: {
        name: { required: helpers.withMessage('The Link Sequence Group Name field is required', required) }
    }
};
const vv = useVuelidate(rules, { link_sequence });
const selectedLinkSequence = ref();
const LinkSequenceModel = ref(false);
const link_sequenceList = computed(() => store.state.GroupStore.link_sequenceList);

const openModel = (modelType) => {
    if (modelType == 'link-sequence') {
        vv.value.link_sequence.$reset();
        link_sequence.value.name = '';
        link_sequence.value.link_sequence_id = '';
        LinkSequenceModel.value = true;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'link-sequence') {
        vv.value.link_sequence.$touch();
        if (vv.value.link_sequence.$invalid) return;
        let data = link_sequence.value;
        store
            .dispatch('GroupStore/saveLinkSequence', data)
            .then((response) => {
                if (response.data.status) {
                    LinkSequenceModel.value = false;
                    selectedLinkSequence.value = null;
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Sequence Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    }
};

const editItems = (modelType) => {
    if (modelType == 'link-sequence') {
        if (selectedLinkSequence.value) {
            link_sequence.value.name = selectedLinkSequence.value.name;
            link_sequence.value.link_sequence_id = selectedLinkSequence.value.id;
            LinkSequenceModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Link Sequence Group!', life: 3000 });
        }
    }
};

const deleteItems = (modelType) => {
    if (modelType == 'link-sequence') {
        if (selectedLinkSequence.value) {
            let data = { link_sequence_id: selectedLinkSequence.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Link Sequence Group?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteLinkSequence', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedLinkSequence.value = null;
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Sequence Group Deleted Successfully!', life: 3000 });
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
    }
};

const init = async () => {
    await store
        .dispatch('GroupStore/getLinkSequence')
        .then((response) => {})
        .catch((error) => {});
};

onMounted(async () => {
    await init();
});
</script>

