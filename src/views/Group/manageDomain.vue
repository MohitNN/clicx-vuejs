<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, url, alphaNum } from '@vuelidate/validators';
import store from '@/store';
import { useConfirm } from 'primevue/useconfirm';
import debounce from 'lodash.debounce';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const confirm = useConfirm();
const mustBeUniquSlug = (value) => {
    if(!isErrorSlug.value) {
        return true
    } return false
}
const user_domain = ref({
    name: '',
    slug: '',
    domain_url: '',
    redirect_url: '',
    pixel_code: '',
    cname_url: '',
    is_forward_domain: ''
});
const rules = {
    user_domain: {
        name: { required: helpers.withMessage('The Domain Name field is required', required) },
        slug: { 
            required: helpers.withMessage('The slug field is required', required),
            alphaNum: helpers.withMessage('The slug field Only alpha numeric character are allowed', alphaNum),
            mustBeUniquSlug: helpers.withMessage('This slug already has been taken', mustBeUniquSlug)
        },
        domain_url: {
            required: helpers.withMessage('The Domain URL field is required', required),
            url: helpers.withMessage(`The Domain URL must be URL and URL must start with 'http://' or 'https:// `, url)
        }
        // redirect_url: {
        //     required: helpers.withMessage('The Redirect URL field is required', required),
        //     url: helpers.withMessage(`The Redirect URL must be URL and URL must start with 'http://' or 'https:// `, url)
        // }
    }
};

const vv = useVuelidate(rules, { user_domain });
const selectedUserDomain = ref();
const isErrorSlug = ref(false);
const isSlugLoad = ref(false);
const UserDomainModel = ref(false);
const userDomainList = computed(() => store.state.GroupStore.userDomainList);

const openModel = (modelType) => {
    if (modelType == 'domain-setting') {
        vv.value.user_domain.$reset();
        user_domain.value.name = '';
        user_domain.value.redirect_url = '';
        user_domain.value.slug = '';
        user_domain.value.domain_url = '';
        user_domain.value.user_domain_id = '';
        user_domain.value.cname_url = '';
        user_domain.value.pixel_code = '';
        UserDomainModel.value = true;
        isErrorSlug.value = false;
        isSlugLoad.value = false;
    }
};

const submitForm = (modelType) => {
    if (modelType == 'domain-setting') {
        vv.value.user_domain.$touch();
        if (vv.value.user_domain.$invalid) return;
        let data = user_domain.value;
        store
            .dispatch('GroupStore/saveDomain', data)
            .then((response) => {
                if (response.data.status) {
                    UserDomainModel.value = false;
                    selectedUserDomain.value = null;
                    toast.add({ severity: 'success', summary: 'Success Message', detail: 'User Domain Added Successfully!', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                }
            })
            .catch((error) => {});
    }
};

const editItems = (modelType) => {
    if (modelType == 'domain-setting') {
        if (selectedUserDomain.value) {
            user_domain.value.name = selectedUserDomain.value.name;
            user_domain.value.redirect_url = selectedUserDomain.value.redirect_url;
            user_domain.value.domain_url = selectedUserDomain.value.domain_url;
            user_domain.value.slug = selectedUserDomain.value.slug;
            user_domain.value.user_domain_id = selectedUserDomain.value.id;
            user_domain.value.pixel_code = selectedUserDomain.value.pixel_code;
            user_domain.value.cname_url = selectedUserDomain.value.cname_url;
            UserDomainModel.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select User Domain!', life: 3000 });
        }
    }
};

const deleteItems = (modelType) => {
    if (modelType == 'domain-setting') {
        if (selectedUserDomain.value) {
            let data = { user_domain_id: selectedUserDomain.value.id };
            confirm.require({
                message: 'Are you sure you want to delete User Domain?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    store
                        .dispatch('GroupStore/deleteDomain', data)
                        .then((response) => {
                            if (response.data.status) {
                                selectedUserDomain.value = null;
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'User Domain Deleted Successfully!', life: 3000 });
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
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Select User Domain!', life: 3000 });
        }
    }
};

const init = async () => {
    await store
        .dispatch('GroupStore/getDomain')
        .then((response) => {})
        .catch((error) => {});
};

const copyValue = (text) => {
    let listener = function (ev) {
        ev.clipboardData.setData('text/plain', text);
        ev.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Copy Cname', position: 'bottom-right', life: 3000 });
};
const checkSlugDebounced = debounce(async(event) => {
    let slug = event.target.value;
    let data = { slug : slug , user_domain_id : user_domain.value.user_domain_id};
    isSlugLoad.value = true;
    if(slug) {
        await store
            .dispatch('GroupStore/checkSlugForUserDomain',data)
            .then((response) => {
                if(response.data.status) {
                    isSlugLoad.value = false;
                    isErrorSlug.value = false;
                    user_domain.value.cname_url = `${slug}.${import.meta.env.VITE_MAIN_DOMAIN}`
                } else {
                    isSlugLoad.value = false;
                    isErrorSlug.value = true;
                    user_domain.value.cname_url = ``
                }
            })
            .catch((error) => {
            });
    }else {
        isSlugLoad.value = false;
        user_domain.value.cname_url = ``
    }
}, 500);

onMounted(async () => {
    await init();
});
</script>
<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <Panel header="Domains" :toggleable="true">
                <div class="grid align-items-center">
                    <p class="col-8 mb-0 text-base">In this menu you will add your list of User Domain that you want to associate to your individual Link</p>
                    <Button class="text-base" @click="openModel('domain-setting')" size="small" label="Add User Domain" outlined icon="pi pi-plus" />
                </div>
                <div class="flex justify-content-between">
                    <label class="flex-initial flex align-items-center justify-content-center font-semibold"> Select User Domain</label>
                    <Dropdown v-model="selectedUserDomain" :options="userDomainList" optionLabel="name" placeholder="Select User Domain" class="w-full md:w-25rem mt-3"> </Dropdown>
                </div>
                <div class="flex justify-content-center mt-5">
                    <span class="p-buttonset">
                        <Button label="Delete" @click="deleteItems('domain-setting')" severity="danger" icon="pi pi-trash" size="small" />
                        <Button label="Edit Selected" @click="editItems('domain-setting')" severity="warning" icon="pi pi-pencil" size="small" />
                    </span>
                </div>
            </Panel>
            <Dialog v-model:visible="UserDomainModel" modal :draggable="false" header="Add User Domain" :style="{ width: '30vw' }">
                <div class="field p-fluid">
                    <label for="user_domain_name">User Domain Name</label>
                    <InputText id="user_domain_name" v-model="vv.user_domain.name.$model" :class="vv?.user_domain.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.user_domain.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <!-- <div class="field p-fluid">
                    <label for="user_domain_name">Slug</label>
                    <span class="p-input-icon-right">
                        <i class="pi pi-spin pi-spinner text-3xl validate-icon-check" />
                        <InputText v-model="vv.user_domain.slug.$model" @input="checkSlugDebounced($event)" :class="vv?.user_domain.slug?.$errors[0] ? 'p-invalid' : ''" />
                        <small class="p-error" id="text-error">{{ vv?.user_domain.slug?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </span>
                </div> -->
                <div class="field p-fluid">
                    <label for="user_domain_slug">Slug</label>
                    <div class="p-inputgroup">
                        <InputText v-lowercase v-model.trim="vv.user_domain.slug.$model" @input="checkSlugDebounced($event)" :class="vv?.user_domain.slug?.$errors[0] ? 'p-invalid' : ''" />
                        <span v-if="isErrorSlug" class="p-inputgroup-addon text-red-500 bg-red-100"><i class="pi pi-times"></i></span>
                        <span v-else class="p-inputgroup-addon text-green-500 bg-green-100"><i class="pi pi-check"></i></span>
                        <span v-if="isSlugLoad" class="p-inputgroup-addon"><i class="pi pi-spin pi-spinner"></i></span>
                    </div>
                    <small class="" v-if="isSlugLoad" id="">checking...</small>
                    <small class="p-error" id="text-error">{{ vv?.user_domain.slug?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <div class="field p-fluid">
                    <label for="user_domain_url">Domain URL</label>
                    <InputText id="user_domain_url" v-model="vv.user_domain.domain_url.$model" :class="vv?.user_domain.domain_url?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.user_domain.domain_url?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div>
                <!-- <div class="field p-fluid">
                    <label for="redirect_url">Redirect URL</label>
                    <InputText id="redirect_url" v-model="vv.user_domain.redirect_url.$model" :class="vv?.user_domain.redirect_url?.$errors[0] ? 'p-invalid' : ''" type="text" />
                    <small class="p-error" id="text-error">{{ vv?.user_domain.redirect_url?.$errors[0]?.$message || '&nbsp;' }}</small>
                </div> -->
                <div class="field p-fluid">
                    <label for="user_domain_pixel_code">Pixel Code</label>
                    <Textarea id="user_domain_pixel_code" v-model="user_domain.pixel_code" rows="5" />
                    <!-- <small class="p-error" id="text-error">{{ vv?.user_domain.pixel_code?.$errors[0]?.$message || '&nbsp;' }}</small> -->
                </div>
                <div class="field p-fluid">
                    <label for="user_domain_pixel_code">Cname URL</label>
                    <div class="flex-1 p-inputgroup">
                        <InputText placeholder="Keyword" readonly disabled v-model="user_domain.cname_url" />
                        <Button :disabled="user_domain.cname_url ? false : true" icon="pi pi-copy" severity="primary" @click="copyValue(user_domain.cname_url)" />
                    </div>
                </div>

                <template #footer>
                    <Button label="Cancle" severity="danger" icon="pi pi-times" @click="UserDomainModel = false" text />
                    <Button label="Add User Domain" icon="pi pi-check" @click="submitForm('domain-setting')" autofocus />
                </template>
            </Dialog>
        </div>
    </div>
</template>
<style scoped>
.validate-icon-check {
    top: 16px;
}
</style>
