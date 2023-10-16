<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Vendors" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of vendors that you want to associate to your individual poplinks</p>
                    <Button class="text-base" @click="openModel('vendor')" size="small" label="Add Vendor" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Vendor</label>
                    <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Select A Vendor" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Groups" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of Groups that you want to associate to your individual poplinks</p>
                    <Button class="text-base" @click="openModel('group')" size="small" label="Add Group" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Group</label>
                    <Dropdown v-model="selectedGroup" :options="groupList" filter optionLabel="name" placeholder="Select Group" class="w-full md:w-25rem mt-3"> </Dropdown>
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
            <Panel header="Default Domain" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-9 mb-0 text-base">In this menu you will add your list of Groups that you want to associate to your individual poplinks</p>
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select Domain</label>
                    <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Select A Vendor" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
            </Panel>
        </div>
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
</template>
<script setup>
import { ref, onMounted, computed  } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import store from '@/store';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const group = ref({
    name: ''
});
const selectedGroup = ref();
const vendor = ref({
    name: ''
});
const rules = {
    group: {
        name: { required: helpers.withMessage('The Group Name field is required', required) }
    },
    vendor: {
        name: { required: helpers.withMessage('The Vendor Name field is required', required) }
    }
};
const vv = useVuelidate(rules, { group , vendor });


const groupList = computed(() => store.state.GroupStore.groupList)

const selectedCountry = ref();
const vendorModelShow = ref(false);
const groupModelShow = ref(false);
const countries = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);

const openModel = (modelType) => {
    if (modelType == 'vendor') {
        vv.value.vendor.$reset();
        vendor.value.name = ""
        vendorModelShow.value = true;

    } else if (modelType == 'group') {
        vv.value.group.$reset();
        group.value.name = ""
        groupModelShow.value = true;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'vendor') {
        vv.value.vendor.$touch();
        if (vv.value.$invalid) return;
        let data = vendor.value;
    } else if (modelType == 'group') {
        vv.value.group.$touch();
        if (vv.value.group.$invalid) return;
        let data = group.value;
        store
            .dispatch('GroupStore/saveGroup', data)
            .then((response) => {
                if(response.data.status) {
                    groupModelShow.value = false;
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Group Added Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    }
};

const deleteItems = (modelType) => { 
    if(modelType == "vendor") {

    } else if(modelType == "group") {
        if(selectedGroup.value) {
           console.log(selectedGroup.value,"selectedGroup.value")
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Group!', life: 3000 });

        }
    }   
}

const editItems = (modelType) => { 
    if(modelType == "vendor") {

    } else if(modelType == "group") {
        if(selectedGroup.value) {

        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select Group!', life: 3000 });

        }
    }   
}

const init = () => {
    store
        .dispatch('GroupStore/getGroupList')
        .then((response) => {})
        .catch((error) => {});
};

const closeDialog = (event) => {
    console.log(1);
};


onMounted( async() => {
     await init();
});

</script>
