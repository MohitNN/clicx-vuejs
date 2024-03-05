<script setup>
import { ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import store from '@/store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const confirm = useConfirm();
const retargeting_pixel = ref({
    name: '',
    code: '',
});
const rules = {
    retargeting_pixel: {
        name: { required: helpers.withMessage('The Rotator Pixel Name field is required', required) },
        code: { required: helpers.withMessage('The Rotator Pixel Code field is required', required) }
    }
};

const vv = useVuelidate(rules, { retargeting_pixel });
const selectedRetargetingPixel = ref();
const retargetingPixelModel = ref(false);
const retargetingPixelList = computed(() => store.state.GroupStore.retargetingPixelList);


const openModel = (modelType) => {
    if (modelType == 'retargeting-pixel') {
        vv.value.retargeting_pixel.$reset();
        retargeting_pixel.value.name = '';
        retargeting_pixel.value.code = '';
        retargeting_pixel.value.retargeting_pixel_id = '';
        retargetingPixelModel.value = true;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'retargeting-pixel') {
        vv.value.retargeting_pixel.$touch();
        if (vv.value.retargeting_pixel.$invalid) return;
        let data = retargeting_pixel.value;
        store
            .dispatch('GroupStore/saveRetargetingPixel', data)
            .then((response) => {
                if (response.data.status) {
                    retargetingPixelModel.value = false;
                    selectedRetargetingPixel.value = null;
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Retargeting Pixel Successfully!', life: 3000 });
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
    if (modelType == 'retargeting-pixel') {
        if (selectedRetargetingPixel.value) {
            retargeting_pixel.value.name = selectedRetargetingPixel.value.name;
            retargeting_pixel.value.code = selectedRetargetingPixel.value.code;
            retargeting_pixel.value.retargeting_pixel_id = selectedRetargetingPixel.value.id;
            retargetingPixelModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Retargeting Pixel!', life: 3000 });
        }
    }
};
const deleteItems = (modelType) => {
    if (modelType == 'retargeting-pixel') {
        if (selectedRetargetingPixel.value) {
            let data = { retargeting_pixel_id: selectedRetargetingPixel.value.id };
            confirm.require({
                message: 'Are you sure you want to delete Retargeting Pixel?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteRetargetingPixel', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedRetargetingPixel.value = null;
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Retargeting Pixel Deleted Successfully!', life: 3000 });
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
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Retargeting Pixel!', life: 3000 });
        }
    }
};


const init = async () => {
    await store
        .dispatch('GroupStore/getRetargetingPixel')
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
             
            <Panel header="Retargeting Pixel" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of Retargeting Pixel that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('retargeting-pixel')" size="small" label="Add Retargeting Pixel" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Retargeting Pixel</label>
                    <Dropdown v-model="selectedRetargetingPixel" :options="retargetingPixelList" optionLabel="name" placeholder="Select Retargeting Pixel" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('retargeting-pixel')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('retargeting-pixel')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="retargetingPixelModel" modal :draggable="false" header="Add Retargeting Pixel" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="retargeting_pixel_name">Retargeting Pixel Name</label>
                    <InputText id="retargeting_pixel_name" v-model="vv.retargeting_pixel.name.$model" :class="vv?.retargeting_pixel.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.retargeting_pixel.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>         
                <div class="field p-fluid">
                    <label for="retargeting_pixel_name">Retargeting Pixel Code</label>
                    <Textarea id="retargeting_pixel_name" v-model="vv.retargeting_pixel.code.$model" :class="vv?.retargeting_pixel.code?.$errors[0] ? 'p-invalid' : ''" rows="5" />

                    <small class="p-error" id="text-error">{{ vv?.retargeting_pixel.code?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="retargetingPixelModel = false" text />
                    <Button label="Add Retargeting Pixel" icon="pi pi-check" @click="submitForm('retargeting-pixel')" autofocus />
                </template>
            </Dialog>
        </div>
    </div>
</template>