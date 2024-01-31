<script setup>
import { onMounted, ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, email } from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';
import debounce from 'lodash.debounce';
import store from '@/store';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

const router = useRouter();
const toast = useToast();
const props = defineProps({
    id: {
        default: null,
        required: false
    }
});

const profilePicRef = ref();
const user = ref({
    name: '',
    user_id: '',
    password: '',
    email: '',
    profile_pic: ''
});

onBeforeRouteLeave((to, from, next) => {
    if (from.name == 'AdminUserEdit') {
        if (to.name == 'AdminUserCreate') {
            resetUserForm();
            next();
        }
        next();
    }
    next();
});

const rules = {
    user: {
        name: { required: helpers.withMessage('User Name field is required', required) },
        password: { required: helpers.withMessage('Password field is required', required) },
        email: { required: helpers.withMessage('Email field is required', required), email: helpers.withMessage('Please enter a valid email', email) }
    }
};
const vv = useVuelidate(rules, { user });
const saveUser = () => {
    vv.value.user.$touch();
    if (vv.value.user.$invalid) return;
    let formData = new FormData();
    formData.append('user_id', user.value.user_id);
    formData.append('name', user.value.name);
    formData.append('password', user.value.password);
    formData.append('email', user.value.email);
    formData.append('profile_pic', user.value.profile_pic);
    store
        .dispatch('AdminUserStore/saveUser', formData)
        .then((response) => {
            if (response.data.status) {
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'New User Added Succesfully!', life: 3000 });
                router.push({ name: 'AdminUserIndex' });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
        .catch((error) => {});
};
const resetUserForm = () => {
    user.value = {
        name: '',
        password: '',
        email: '',
        profile_pic: '',
        preview_image: '',
        user_id: '',
    };
    vv.value.user.$reset();
    profilePicRef.value.clear();
};
const uploadProfilePicFile = (data) => {
    let file = data.files[0];
    user.value.profile_pic = file;
};
const editUserData = async () => {
    let data = { user_id: props.id };
    await store
        .dispatch('AdminUserStore/getSingleUserData', data)
        .then((response) => {
            if (response.data.status) {
                let resData = response.data.data;
                user.value = {
                    name : resData.name ? resData.name : '', 
                    user_id : resData.id ? resData.id : '', 
                    password : resData.visible_password ? resData.visible_password : '',
                    email : resData.email ? resData.email : '',
                    preview_image : resData.preview_image_url ? resData.preview_image_url : '',
                    profile_pic : ''
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

onMounted(async () => {
    if (props.id) {
        await editUserData();
    }
});
</script>
<template>
    <h3>Users</h3>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <div className="card">
                <h5 v-if="$route.name == 'AdminUserCreate'">Create New User</h5>
                <h5 v-if="$route.name == 'AdminUserEdit'">Edit User</h5>
                <Divider />
                <div class="field grid p-fluid">
                    <label class="col-4" for="link_name">User Name</label>
                    <div class="col-8">
                        <InputText id="user_name" v-model="vv.user.name.$model" size="small" :class="vv?.user.name?.$errors[0] ? 'p-invalid' : ''" class="" type="text" />
                        <small class="p-error" v-if="vv?.user.name?.$errors[0]" id="text-error">{{ vv?.user.name?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid">
                    <label class="col-4" for="link_name">Email ID</label>
                    <div class="col-8">
                        <InputText id="email_id" v-model="vv.user.email.$model" size="small" :class="vv?.user.email?.$errors[0] ? 'p-invalid' : ''" class="" type="text" />
                        <small class="p-error" v-if="vv?.user.email?.$errors[0]" id="text-error">{{ vv?.user.email?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid">
                    <label class="col-4" for="link_name">Password</label>
                    <div class="col-8">
                        <Password
                            id="password1"
                            :feedback="false"
                            :class="vv?.user.password?.$errors[0] ? 'p-invalid' : ''"
                            v-model="vv.user.password.$model"
                            placeholder="Password"
                            :toggleMask="true"
                            class="w-full mb-2"
                            inputClass="w-full"
                            aria-describedby="password-help"
                        ></Password>
                        <small class="p-error" v-if="vv?.user.password?.$errors[0]" id="text-error">{{ vv?.user.password?.$errors[0]?.$message || '&nbsp;' }}</small>
                    </div>
                </div>
                <div class="field grid p-fluid">
                    <label class="col-4" for="link_name">Profile Picture</label>
                    <div class="col-8">
                        <FileUpload name="profile_pic" ref="profilePicRef" @select="uploadProfilePicFile" :showUploadButton="false" :showCancelButton="true" :multiple="false" accept="image/*" :maxFileSize="1000000">
                            <template #header> </template>
                            <template #empty>
                                <p>Drag and drop files to here to upload.</p>
                            </template>
                        </FileUpload>
                    </div>
                </div>
                <div class="field grid p-fluid" v-if="user.preview_image">
                    <label class="col-4" for="link_name">Profile Picture</label>
                    <div class="col-8">  
                        <!-- <Image :src="user.preview_image" alt="Upload Profile Picture" width="200" preview /> -->
                        <Avatar class="mr-2" size="xlarge" :image="user.preview_image"/>
                    </div>
                </div>
                <div class="field grid p-fluid" v-else>
                    <label class="col-4" for="link_name">Profile Picture</label>
                    <div class="col-8">  
                        <Avatar icon="pi pi-user" class="mr-2" size="xlarge" />
                    </div>
                </div>
                <div class="text-right mt-5">
                    <Button type="button" label="Save" icon="pi pi-save" size="small" @click="saveUser" />
                    <Button type="button" label="Clear" class="ml-2" severity="danger" @click="resetUserForm" outlined icon="pi pi-refresh" size="small" />
                </div>
            </div>
        </div>
    </div>
</template>
