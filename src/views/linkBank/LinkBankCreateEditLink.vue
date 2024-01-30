<script setup>
import { onMounted, ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, url, alphaNum } from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';
import debounce from 'lodash.debounce';
import store from '@/store';
import dayjs from 'dayjs';
import moment from 'moment';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

const alphaNumWithHyphen = helpers.regex(/^[a-z0-9-]*$/i);

const router = useRouter();

const toast = useToast();
const props = defineProps({
    id: {
        default: null,
        required: false
    }
});

onBeforeRouteLeave((to, from, next) => {
    if (from.name == 'LinkBankEditLink') {
        if (to.name == 'LinkBankNewLink') {
            linkBank_reset();
            next();
        }
        next();
    }
    next();
});

const isErrorSlug = ref(false);
const isSlugLoad = ref(false);
const isErrorVisibleLink = ref(false);
const isVisibleLink = ref(false);
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
    is_advance_option: false
});

const minDate = ref(new Date());

const selectedStartDate = ref(null);
const selectedEndDate = ref(null);

const linkBank_reset = () => {
    link_bank.value = {
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
        is_advance_option: false
    };
    link_vv.value.link_bank.$reset();
};

const mustBeUniquVisibleLink = (value) => {
    if (!isErrorVisibleLink.value) {
        return true;
    }
    return false;
};
const links_rules = {
    link_bank: {
        name: { required: helpers.withMessage('Link Name field is required', required) },
        visible_link: {
            required: helpers.withMessage('Visible Link field is required', required),
            mustBeUniquVisibleLink: helpers.withMessage('This Visible link already has been taken', mustBeUniquVisibleLink),
            alphaNumWithHyphen: helpers.withMessage('The field only allows letters, numbers, and hyphens.', alphaNumWithHyphen)
        },
        destination_link: { required: helpers.withMessage('Destination Link field is required', required) },
        domain_user_id: { required: helpers.withMessage('Domain field is required', required) },
        vendor_id: { required: helpers.withMessage('Vendor is required', required) },
        group_id: { required: helpers.withMessage('Group is required', required) }
    }
};
const ModelShow = ref(false);
const text_area_name = ref();
const user_domain = ref({
    domain_url: '',
    redirect_url: '',
    slug: '',
    pixel_code: '',
    cname_url: ''
});
const dialog = ref({
    name: '',
    label: ''
});
const model_value = ref({
    name: ''
});
const rule = ref({
    one: ''
});
const rules = {
    model_value: {
        name: { required: helpers.withMessage(rule.value.one, required) }
    }
};
const mustBeUniquSlug = (value) => {
    if (!isErrorSlug.value) {
        return true;
    }
    return false;
};

const rules1 = {
    user_domain: {
        domain_url: {
            required: helpers.withMessage('The Domain URL field is required', required),
            url: helpers.withMessage(`The Domain URL must be URL and URL must start with 'http://' or 'https:// `, url)
        },
        slug: {
            required: helpers.withMessage('The slug field is required', required),
            alphaNum: helpers.withMessage('The slug field Only alpha numeric character are allowed', alphaNum),
            mustBeUniquSlug: helpers.withMessage('This slug already has been taken', mustBeUniquSlug)
        }

        // redirect_url: {
        //     required: helpers.withMessage('The Redirect URL field is required', required),
        //     url: helpers.withMessage(`The Redirect URL must be URL and URL must start with 'http://' or 'https:// `, url)
        // }
    }
};
const userDomainList = computed(() => store.state.GroupStore.userDomainList);

const vv1 = useVuelidate(rules1, { user_domain });
const vv = useVuelidate(rules, { model_value });
const link_vv = useVuelidate(links_rules, { link_bank });
const getVendorList = ref([]);
const getGroupList = ref([]);
const getDomain = ref([]);
const getRetargetingPixel = ref([]);
const getLinkPlatformList = ref([]);
onMounted(async () => {
    if (props.id) {
        await editLinkData();
    }
    await init();
});

const init = async () => {
    await store
        .dispatch('GroupStore/getVendorList')
        .then((response) => {
            getVendorList.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getGroupList')
        .then((response) => {
            getGroupList.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getDomain')
        .then((response) => {
            getDomain.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getRetargetingPixel')
        .then((response) => {
            getRetargetingPixel.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
        });
    await store
        .dispatch('GroupStore/getLinkPlatformList')
        .then((response) => {
            getLinkPlatformList.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const editLinkData = async () => {
    let data = { link_bank_id: props.id };
    store.dispatch('globleStore/setcounter');
    await store
        .dispatch('LinkbankStore/getSingleLinkBank', data)
        .then((response) => {
            if (response.data.status) {
                let resData = response.data.data;
                link_bank.value = {
                    link_bank_id: resData.id ? resData.id : '',
                    name: resData.name ? resData.name : '',
                    destination_link: resData.destination_link ? resData.destination_link : '',
                    status: resData.status ? resData.status : 'Active',
                    is_domain_setting: resData.is_domain_setting ? resData.is_domain_setting : 'user-domain',
                    visible_link: resData.visible_link ? resData.visible_link : '',
                    additional_notes: resData.additional_notes ? resData.additional_notes : '',
                    domain_user_id: resData.domain_user_id ? resData.domain_user_id : '',
                    user_id: resData.user_id ? resData.user_id : '',
                    vendor_id: resData.vendor_id ? resData.vendor_id : '',
                    group_id: resData.group_id ? resData.group_id : '',
                    link_platform_id: resData.link_platform_id ? resData.link_platform_id : '',
                    retargeting_pixel_id: resData.retargeting_pixel_id ? resData.retargeting_pixel_id : '',
                    start_date: resData.start_date ? moment(resData.start_date).format('MM/DD/YYYY hh:mm a') : null,
                    end_date: resData.end_date ? moment(resData.end_date).format('MM/DD/YYYY hh:mm a') : null,
                    is_advance_option: resData.is_advance_option == 1 ? true : false
                };
                store.dispatch('globleStore/setcounter');
            }
        })
        .catch((error) => {
            store.dispatch('globleStore/setcounter');
            console.log(error);
        });
};

const modalOpen = (name, label, textareaname) => {
    dialog.value.name = name;
    dialog.value.label = label;
    ModelShow.value = true;
    rule.value.one = `The ${name} field is required`;
    text_area_name.value = textareaname;
    isErrorSlug.value = false;
    isSlugLoad.value = false;
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
const submitForm = () => {
    if (dialog.value.name == 'Vendor Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveVendor', { name: model_value.value.name }).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset();
                init();
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Vendor Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        });
    } else if (dialog.value.name == 'Group Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveGroup', { name: model_value.value.name }).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset();
                init();
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Group Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        });
    } else if (dialog.value.name == 'User Domain Name') {
        vv1.value.user_domain.$touch();
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        if (vv1.value.user_domain.$invalid) return;
        const data = {
            name: model_value.value.name,
            domain_url: user_domain.value.domain_url,
            redirect_url: user_domain.value.redirect_url,
            slug: user_domain.value.slug,
            pixel_code: user_domain.value.pixel_code,
            cname_url: user_domain.value.cname_url
        };
        store.dispatch('GroupStore/saveDomain', data).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset();
                init();
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'User Domain Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        });
    } else if (dialog.value.name == 'Retargeting Pixel Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveRetargetingPixel', { name: model_value.value.name, code: user_domain.value.pixel_code }).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset();
                init();
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Retargeting Pixel Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        });
    } else if (dialog.value.name == 'Link Platform Name') {
        vv.value.model_value.$touch();
        if (vv.value.model_value.$invalid) return;
        store.dispatch('GroupStore/saveLinkPlatform', { name: model_value.value.name }).then((response) => {
            if (response.data.status) {
                ModelShow.value = false;
                reset();
                init();
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Platform Added Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        });
    }
};

const saveLinkBank = () => {
    link_vv.value.link_bank.$touch();
    if (link_vv.value.link_bank.$invalid) return;
    let data = link_bank.value;
    store.dispatch('globleStore/setcounter');
    store
        .dispatch('LinkbankStore/saveLinkBank', data)
        .then((response) => {
            if (response.data.status) {
                store.dispatch('globleStore/setcounter');
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Bank Successfully!', life: 3000 });
                router.push({ name: 'LinkBankMyLinks' });
            } else {
                store.dispatch('globleStore/setcounter');
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
        .catch((error) => {
            store.dispatch('globleStore/setcounter');
        });
};

const checkSlugDebounced = debounce(async (event) => {
    let slug = event.target.value;
    let data = { slug: slug, user_domain_id: user_domain.value.user_domain_id };
    isSlugLoad.value = true;
    if (slug) {
        await store
            .dispatch('GroupStore/checkSlugForUserDomain', data)
            .then((response) => {
                if (response.data.status) {
                    isSlugLoad.value = false;
                    isErrorSlug.value = false;
                    user_domain.value.cname_url = `${slug}.${import.meta.env.VITE_MAIN_DOMAIN}`;
                } else {
                    isSlugLoad.value = false;
                    isErrorSlug.value = true;
                    user_domain.value.cname_url = ``;
                }
            })
            .catch((error) => {});
    } else {
        isSlugLoad.value = false;
        user_domain.value.cname_url = ``;
    }
}, 500);

const checkVisibleLink = debounce(async (event) => {
    let visible_link = event.target.value;
    let data = { visible_link: visible_link, link_bank_id: link_bank.value.link_bank_id };
    isVisibleLink.value = true;
    if (visible_link) {
        await store
            .dispatch('LinkbankStore/checkVisibleLink', data)
            .then((response) => {
                if (response.data.status) {
                    isVisibleLink.value = false;
                    isErrorVisibleLink.value = false;
                } else {
                    isVisibleLink.value = false;
                    isErrorVisibleLink.value = true;
                }
            })
            .catch((error) => {});
    } else {
        isVisibleLink.value = false;
    }
}, 500);

const reset = () => {
    model_value.value.name = '';
    user_domain.value = {
        domain_url: '',
        redirect_url: '',
        slug: '',
        pixel_code: '',
        cname_url: ''
    };
};

const getDomainURL = (domain_id) => {
    let domain = getDomain.value.find((val) => val.id == domain_id)
    if(domain) {
        return domain.domain_url
    }
    return ''
    
};
</script>
<template>
    <Dialog @hide="vv.$reset(), vv1.$reset(), reset()" v-model:visible="ModelShow" modal :draggable="false" :header="dialog.label" :style="{ width: '30vw' }">
        <div class="field p-fluid">
            <label for="vendor">{{ dialog.name }}</label>
            <InputText id="vendor" v-model="vv.model_value.name.$model" :class="vv?.model_value.name?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error" v-if="vv?.model_value.name?.$errors[0]">{{ rule.one }}</small>
        </div>
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain'">
            <label for="user_domain_name">Slug</label>
            <span class="p-input-icon-right">
                <div class="p-inputgroup">
                    <InputText v-lowercase v-model.trim="vv1.user_domain.slug.$model" @input="checkSlugDebounced($event)" :class="vv1?.user_domain.slug?.$errors[0] ? 'p-invalid' : ''" />
                    <span v-if="isErrorSlug" class="p-inputgroup-addon text-red-500 bg-red-100"><i class="pi pi-times"></i></span>
                    <span v-else class="p-inputgroup-addon text-green-500 bg-green-100"><i class="pi pi-check"></i></span>
                    <span v-if="isSlugLoad" class="p-inputgroup-addon"><i class="pi pi-spin pi-spinner"></i></span>
                </div>
                <small class="" v-if="isSlugLoad" id="">checking...</small>
                <small class="p-error" id="text-error">{{ vv1?.user_domain.slug?.$errors[0]?.$message || '&nbsp;' }}</small>
            </span>
        </div>
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain'">
            <label for="user_domain_url">Domain URL</label>
            <InputText id="user_domain_url" v-model="vv1.user_domain.domain_url.$model" :class="vv1?.user_domain.domain_url?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv1?.user_domain.domain_url?.$errors[0]?.$message || '&nbsp;' }}</small>
        </div>
        <!-- <div class="field p-fluid" v-if="dialog.label == 'Add User Domain'">
            <label for="redirect_url">Redirect URL</label>
            <InputText id="redirect_url" v-model="vv1.user_domain.redirect_url.$model" :class="vv1?.user_domain.redirect_url?.$errors[0] ? 'p-invalid' : ''" type="text" />
            <small class="p-error" id="text-error">{{ vv1?.user_domain.redirect_url?.$errors[0]?.$message || '&nbsp;' }}</small>
        </div> -->
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain' || dialog.label == 'Add Retargeting Pixel'">
            <label for="user_domain_pixel_code">{{ text_area_name }}</label>
            <Textarea id="user_domain_pixel_code" v-model="user_domain.pixel_code" rows="5" />
            <!-- <small class="p-error" id="text-error">{{ vv?.user_domain.pixel_code?.$errors[0]?.$message || '&nbsp;' }}</small> -->
        </div>
        <div class="field p-fluid" v-if="dialog.label == 'Add User Domain'">
            <label for="user_domain_pixel_code">Cname URL</label>
            <div class="flex-1 p-inputgroup">
                <InputText placeholder="Keyword" readonly disabled v-model="user_domain.cname_url" />
                <Button :disabled="user_domain.cname_url ? false : true" icon="pi pi-copy" severity="primary" @click="copyValue(user_domain.cname_url)" />
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
                <h5 v-if="$route.name == 'LinkBankNewLink'">Create New Link</h5>
                <h5 v-if="$route.name == 'LinkBankEditLink'">Edit Link</h5>
                <Divider />
                <div class="field grid p-fluid">
                    <label class="col-4" for="link_name">Link Name</label>
                    <div class="col-8">
                        <InputText id="link_name" v-model="link_vv.link_bank.name.$model" size="small" :class="link_vv?.link_bank.name?.$errors[0] ? 'p-invalid' : ''" class="" type="text" />
                        <small class="p-error" v-if="link_vv?.link_bank.name?.$errors[0]" id="text-error">{{ link_vv?.link_bank.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="destination_link">Destination Link</label>
                    <div class="col-8">
                        <InputText id="destination_link" v-model="link_vv.link_bank.destination_link.$model" :class="link_vv?.link_bank.destination_link?.$errors[0] ? 'p-invalid' : ''" size="small" class="" type="text" />
                        <small class="p-error" v-if="link_vv?.link_bank.destination_link?.$errors[0]" id="text-error">{{ link_vv?.link_bank.destination_link?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Link Status</label>
                    <div class="col-8">
                        <Dropdown :options="statusList" v-model="link_bank.status" id="link_status" size="small" placeholder="Select Status"></Dropdown>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Vendor</label>
                    <div class="col-8">
                        <div class="p-inputgroup flex-1">
                            <Dropdown
                                :options="getVendorList"
                                optionValue="id"
                                optionLabel="name"
                                v-model="link_vv.link_bank.vendor_id.$model"
                                :class="link_vv?.link_bank.vendor_id?.$errors[0] ? 'p-invalid' : ''"
                                id="link_status"
                                size="small"
                                placeholder="Select Status"
                            ></Dropdown>
                            <Button icon="pi pi-plus" @click="modalOpen('Vendor Name', 'Add Vendor')" />
                        </div>
                        <small class="p-error" v-if="link_vv?.link_bank.vendor_id?.$errors[0]" id="text-error">{{ link_vv?.link_bank.vendor_id?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Group</label>
                    <div class="col-8">
                        <div class="p-inputgroup flex-1">
                            <Dropdown
                                :options="getGroupList"
                                optionValue="id"
                                optionLabel="name"
                                v-model="link_vv.link_bank.group_id.$model"
                                :class="link_vv?.link_bank.group_id?.$errors[0] ? 'p-invalid' : ''"
                                id="link_status"
                                size="small"
                                placeholder="Select Group"
                            ></Dropdown>
                            <Button icon="pi pi-plus" @click="modalOpen('Group Name', 'Add Group')" />
                        </div>
                        <small class="p-error" v-if="link_vv?.link_bank.group_id?.$errors[0]" id="text-error">{{ link_vv?.link_bank.group_id?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Domain Setting</label>
                    <div class="col-8">
                        <div class="flex flex-wrap gap-3">
                            <div class="flex align-items-center">
                                <RadioButton v-model="link_bank.is_domain_setting" inputId="ingredient1" name="system-domain" value="system-domain" />
                                <label for="ingredient1" class="ml-2">System Domain</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="link_bank.is_domain_setting" inputId="ingredient2" name="user-domain" value="user-domain" />
                                <label for="ingredient2" class="ml-2">User Domain</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status"></label>
                    <div class="col-8">
                        <div class="p-inputgroup flex-1">
                            <Dropdown
                                :options="getDomain"
                                v-model="link_vv.link_bank.domain_user_id.$model"
                                :class="link_vv?.link_bank.domain_user_id?.$errors[0] ? 'p-invalid' : ''"
                                id="link_status"
                                optionValue="id"
                                optionLabel="name"
                                size="small"
                                placeholder="Select User Domain"
                            ></Dropdown>
                            <Button v-if="link_bank.is_domain_setting == 'user-domain'" icon="pi pi-plus" @click="modalOpen('User Domain Name', 'Add User Domain', 'Pixel Code')" />
                        </div>
                        <small class="p-error" v-if="link_vv?.link_bank.domain_user_id?.$errors[0]" id="text-error">{{ link_vv?.link_bank.domain_user_id?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_name">Visible Link</label>
                    <div class="col-8">
                        <InputText
                            v-lowercase
                            id="link_name"
                            v-model="link_vv.link_bank.visible_link.$model"
                            @input="checkVisibleLink($event)"
                            size="small"
                            :class="link_vv?.link_bank.visible_link?.$errors[0] ? 'p-invalid' : ''"
                            class=""
                            type="text"
                        />
                        <small class="" v-if="isVisibleLink" id="">checking...</small>
                        <small class="p-error" v-if="link_vv?.link_bank.visible_link?.$errors[0]" id="text-error">{{ link_vv?.link_bank.visible_link?.$errors[0]?.$message || '&nbsp;' }}</small>
                        <div class="text-blue-600 mt-1" v-if="link_bank.domain_user_id && link_bank.visible_link" >{{ getDomainURL(link_bank.domain_user_id) + link_bank.visible_link }}</div>
                    </div>
                </div>
                <div class="field grid align-items-center p-fluid mt-5">
                    <InputSwitch v-model="link_bank.is_advance_option" />
                    <span class="ml-5">
                        <label for="link_name">Advance option</label>
                    </span>
                </div>
                <div class="text-right mt-5">
                    <Button type="button" label="Save" icon="pi pi-save" size="small" @click="saveLinkBank" />
                    <Button type="button" label="Clear" class="ml-2" severity="danger" @click="linkBank_reset" outlined icon="pi pi-refresh" size="small" />
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
                        <Dropdown :options="getRetargetingPixel" optionValue="id" optionLabel="name" v-model="link_bank.retargeting_pixel_id" id="link_status" size="small" placeholder="Select Retargeting Pixel"></Dropdown>
                        <Button icon="pi pi-plus" @click="modalOpen('Retargeting Pixel Name', 'Add Retargeting Pixel', 'Retargeting Pixel Code')" />
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <div class="col-12 flex align-items-center">
                        <div class="col-4 pl-0">Start Date</div>
                        <div class="col-8 pl-2 pr-0">
                            <Calendar id="calendar-12h" v-model="link_bank.start_date" showButtonBar showTime hourFormat="12" />
                        </div>
                    </div>
                    <div class="col-12 mt-5 flex align-items-center">
                        <div class="col-4 pl-0">End Date</div>
                        <div class="col-8 pl-2 pr-0">
                            <Calendar id="calendar-12h" v-model="link_bank.end_date" showButtonBar showTime hourFormat="12" />
                        </div>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Any Additional Notes</label>
                    <div class="col-8">
                        <span class="p-float-label">
                            <Textarea rows="5" cols="30" v-model="link_bank.additional_notes" placeholder="Any Additional Notes" />
                        </span>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Platform</label>
                    <div class="col-8 p-inputgroup flex-1">
                        <Dropdown optionValue="id" optionLabel="name" :options="getLinkPlatformList" v-model="link_bank.link_platform_id" id="link_status" size="small" placeholder="Select Platform"></Dropdown>
                        <Button icon="pi pi-plus" @click="modalOpen('Link Platform Name', 'Add Link Platform')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
