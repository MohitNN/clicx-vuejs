<script setup>
import { onMounted, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, url } from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';
import store from '@/store';

const toast = useToast();
const minDate = new Date();
const statusList = ['Pending', 'Active', 'Completed', 'Evergreen', 'My Links'];
const link_bank = ref({
    name: '',
    destination_link: '',
    status: 'Active',
    is_domain_setting: 'user-domain',
    visible_link: '',
    additional_notes: '',
    domain_user_id: null,
    user_id: null,
    vendor_id: null,
    group_id: null,
    link_platform_id: null,
    retargeting_pixel_id: null,
    start_date: null,
    end_date: null,
    is_advance_option: true
});
const ModelShow = ref(false);
const text_area_name = ref()
const user_domain = ref({
    domain_url: '',
    redirect_url: '',
    pixel_code: '',
    cname_url: 'https://www.goseemyproject.com/super/franchise-settings'
})
const dialog = ref({
    name: '',
    label: '',
})
const model_value = ref({
    name: ''
});
const rule = ref({
    one: ''
})
const rules = {
    model_value: {
        name: { required: helpers.withMessage(rule.value.one, required) }
    },
}
const rules1 = {
    user_domain: {
        domain_url: {
            required: helpers.withMessage('The Domain URL field is required', required),
            url: helpers.withMessage(`The Domain URL must be URL and URL must start with 'http://' or 'https:// `, url)
        },
        redirect_url: {
            required: helpers.withMessage('The Redirect URL field is required', required),
            url: helpers.withMessage(`The Redirect URL must be URL and URL must start with 'http://' or 'https:// `, url)
        }
    }
};
const vv1 = useVuelidate(rules1, { user_domain });
const vv = useVuelidate(rules, { model_value });
const getVendorList = ref([])
const getGroupList = ref([])
const getDomain = ref([])
const getRetargetingPixel = ref([])
const getLinkPlatformList = ref([])
onMounted(() => {
    init()
})

const init = async () => {
    await store
        .dispatch('GroupStore/getVendorList')
        .then((response) => {
            getVendorList.value = response.data.data.map((x) => {
                return x.name
            })
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getGroupList')
        .then((response) => {
            getGroupList.value = response.data.data.map((x) => {
                return x.name
            })
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getDomain')
        .then((response) => {
            getDomain.value = response.data.data.map((x) => {
                return x.name
            })
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getRetargetingPixel')
        .then((response) => {
            getRetargetingPixel.value = response.data.data.map((x) => {
                return x.name
            })
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getLinkPlatformList')
        .then((response) => {
            getLinkPlatformList.value = response.data.data.map((x) => {
                return x.name
            })
        })
        .catch((error) => {
            console.log(error);
        });
};
const modalOpen = (name, label, textareaname) => {
    dialog.value.name = name
    dialog.value.label = label
    ModelShow.value = true
    rule.value.one = `The ${name} field is required`
    text_area_name.value = textareaname
}
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
const submitForm = () => {
    if (dialog.value.name == 'Vendor Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveVendor', { name: model_value.value.name }).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset()
                init()
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Vendor Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
    } else if (dialog.value.name == 'Group Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveGroup', { name: model_value.value.name }).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset()
                init()
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Group Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
    } else if (dialog.value.name == 'User Domain Name') {
        vv1.value.user_domain.$touch();
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        if (vv1.value.user_domain.$invalid) return;
        const data = {
            name: model_value.value.name,
            domain_url: user_domain.value.domain_url,
            redirect_url: user_domain.value.redirect_url,
            pixel_code: user_domain.value.pixel_code,
            cname_url: "https://www.goseemyproject.com/super/franchise-settings"
        }
        store.dispatch('GroupStore/saveDomain', data).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset()
                init()
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'User Domain Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
    } else if (dialog.value.name == 'Retargeting Pixel Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveRetargetingPixel', {name: model_value.value.name,code: user_domain.value.pixel_code }).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset()
                init()
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Retargeting Pixel Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
    } else if (dialog.value.name == 'Link Platform Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveLinkPlatform', {name: model_value.value.name}).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset()
                init()
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Platform Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
    }
}
const reset = () => {
    model_value.value.name = ''
    user_domain.value = {
        domain_url: '',
        redirect_url: '',
        pixel_code: '',
    }
}
</script>
<template>
    <Dialog @hide="vv.$reset(),vv1.$reset(), reset()" v-model:visible="ModelShow" modal :draggable="false"
        :header="dialog.label" :style="{ width: '30vw' }">
        <div class="field p-fluid">
            <label for="vendor">{{ dialog.name }}</label>
            <InputText id="vendor" v-model="vv.model_value.name.$model"
                :class="vv?.model_value.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error" v-if="vv?.model_value.name?.$errors[0]">{{ rule.one }}</small>
        </div>
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain'">
            <label for="user_domain_url">Domain URL</label>
            <InputText id="user_domain_url" v-model="vv1.user_domain.domain_url.$model"
                :class="vv1?.user_domain.domain_url?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv1?.user_domain.domain_url?.$errors[0]?.$message || '&nbsp;'
            }}</small>
        </div>
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain'">
            <label for="redirect_url">Redirect URL</label>
            <InputText id="redirect_url" v-model="vv1.user_domain.redirect_url.$model"
                :class="vv1?.user_domain.redirect_url?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv1?.user_domain.redirect_url?.$errors[0]?.$message || '&nbsp;'
            }}</small>
        </div>
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain' || dialog.label == 'Add Retargeting Pixel'">
            <label for="user_domain_pixel_code">{{ text_area_name }}</label>
            <Textarea id="user_domain_pixel_code" v-model="user_domain.pixel_code" rows="5" />
            <!-- <small class="p-error" id="text-error">{{ vv?.user_domain.pixel_code?.$errors[0]?.$message || '&nbsp;' }}</small> -->
        </div>
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain'">
            <label for="user_domain_pixel_code">Cname URL</label>
            <div class="flex-1 p-inputgroup">
                <InputText placeholder="Keyword" readonly disabled v-model="user_domain.cname_url" />
                <Button :disabled="user_domain.cname_url ? false : true" icon="pi pi-copy" severity="primary"
                    @click="copyValue(user_domain.cname_url)" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancle" severity="danger" icon="pi pi-times" @click="ModelShow = false" text />
            <Button :label="dialog.label" icon="pi pi-check" @click="submitForm('vendor')" autofocus />
        </template>
    </Dialog>
    <h3>Link Bank</h3>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <div className="card">
                <h5>Create New Link</h5>
                <Divider />
                <div class="field grid p-fluid">
                    <label class="col-4" for="link_name">Link Name</label>
                    <div class="col-8">
                        <InputText id="link_name" size="small" class="" type="text" />
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="destination_link">Destination Link</label>
                    <div class="col-8">
                        <InputText id="destination_link" size="small" class="" type="text" />
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Link Status</label>
                    <div class="col-8">
                        <Dropdown :options="statusList" v-model="link_bank.status" id="link_status" size="small"
                            placeholder="Select Status"></Dropdown>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Vendor</label>
                    <div class="col-8 p-inputgroup flex-1">
                        <Dropdown :options="getVendorList" v-model="link_bank.status" id="link_status" size="small"
                            placeholder="Select Status"></Dropdown>
                        <Button icon="pi pi-plus" @click="modalOpen('Vendor Name', 'Add Vendor')" />
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Group</label>
                    <div class="col-8 p-inputgroup flex-1">
                        <Dropdown :options="getGroupList" v-model="link_bank.status" id="link_status" size="small"
                            placeholder="Select Status"></Dropdown>
                        <Button icon="pi pi-plus" @click="modalOpen('Group Name', 'Add Group')" />
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Domain Setting</label>
                    <div class="col-8">
                        <div class="flex flex-wrap gap-3">
                            <div class="flex align-items-center">
                                <RadioButton v-model="link_bank.is_domain_setting" inputId="ingredient1"
                                    name="system-domain" value="system-domain" />
                                <label for="ingredient1" class="ml-2">System Domain</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="link_bank.is_domain_setting" inputId="ingredient2" name="user-domain"
                                    value="user-domain" />
                                <label for="ingredient2" class="ml-2">User Domain</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status"></label>
                    <div class="col-8 p-inputgroup flex-1">
                        <Dropdown :options="getDomain" v-model="link_bank.status" id="link_status" size="small"
                            placeholder="Select System Domain"></Dropdown>
                        <Button v-if="link_bank.is_domain_setting == 'user-domain'" icon="pi pi-plus"
                            @click="modalOpen('User Domain Name', 'Add User Domain', 'Pixel Code')" />
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_name">Visible Link</label>
                    <div class="col-8">
                        <InputText id="link_name" size="small" class="" type="text" />
                    </div>
                </div>
                <div class="field grid align-items-center p-fluid mt-5">
                    <InputSwitch v-model="link_bank.is_advance_option" />
                    <span class="ml-5">
                        <label for="link_name">Advance option</label>
                    </span>
                </div>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-6" v-if="link_bank.is_advance_option">
            <div className="card">
                <h5>Advance Option</h5>
                <Divider />
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Retargeting Pixel</label>
                    <div class="col-8 p-inputgroup flex-1">
                        <Dropdown :options="getRetargetingPixel" v-model="link_bank.status" id="link_status" size="small"
                            placeholder="Select System Domain"></Dropdown>
                        <Button icon="pi pi-plus"
                            @click="modalOpen('Retargeting Pixel Name', 'Add Retargeting Pixel', 'Retargeting Pixel Code')" />
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <div class="col-12 flex align-items-center">
                        <div class="col-4 pl-0">Start Date</div>
                        <div class="col-8 pl-2 pr-0">
                            <Calendar id="calendar-12h" v-model="link_bank.start_date" :minDate="minDate" showTime
                                hourFormat="12" />
                        </div>
                    </div>
                    <div class="col-12 mt-5 flex align-items-center">
                        <div class="col-4 pl-0">End Date</div>
                        <div class="col-8 pl-2 pr-0">
                            <Calendar id="calendar-12h" v-model="link_bank.end_date" :minDate="minDate" showTime
                                hourFormat="12" />
                        </div>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Any Additional Notes</label>
                    <div class="col-8">
                        <span class="p-float-label">
                            <Textarea rows="5" cols="30" placeholder="Any Additional Notes" />
                        </span>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Platform</label>
                    <div class="col-8 p-inputgroup flex-1">
                        <Dropdown :options="getLinkPlatformList" v-model="link_bank.status" id="link_status" size="small"
                            placeholder="Select System Domain"></Dropdown>
                        <Button icon="pi pi-plus" @click="modalOpen('Link Platform Name', 'Add Link Platform')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
