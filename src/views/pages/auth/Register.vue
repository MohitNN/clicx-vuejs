<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import store from '@/store';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers, sameAs } from '@vuelidate/validators';
import logoFileDark from '@/assets/images/clickx.png';

const { layoutConfig } = useLayout();
const logoUrl = computed(() => {
    // return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    return logoFileDark;
});

const user = ref({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
});
const rules = {
    user: {
        name: { required: helpers.withMessage('Please fill out this Name field.', required) },
        email: {
            required: helpers.withMessage('Please fill out this Email field.', required),
            email: helpers.withMessage('Please enter a valid email', email)
        },
        password: { required: helpers.withMessage('Please fill out this Password field.', required) },
        confirm_password: {
            required: helpers.withMessage('Please fill out this Confirm Password field.', required),
            sameAs: helpers.withMessage('Your password and confirmation password do not match.', sameAs(computed(() => user.value.password)))
        }
    }
};
const vv = useVuelidate(rules, { user });
const toast = useToast();
const router = useRouter();
const registerSubmit = () => {
    vv.value.user.$touch();
    console.log(vv.value.user)
    if (vv.value.user.$invalid) return;
    let data = user.value;
    store.dispatch('globleStore/setcounter');
    store
        .dispatch('auth/register', data)
        .then((response) => {
            if (response.data.status) {
                store.dispatch('globleStore/setcounter');
                router.push({ path: '/login' });
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Register Successfully!', life: 3000 });
            }
        })
        .catch((error) => {
            store.dispatch('globleStore/setcounter');
            toast.add({ severity: 'error', summary: 'Error Message', detail: error.response.data.message, life: 3000 });
        });
};
</script>
<template>
    <div class="flex align-items-center justify-content-center loginPage">
        <div class="surface-ground h-auto">
            <div class="flex flex-column align-items-center justify-content-center">
                <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                        <div class="text-center mb-5">
                            <div class="text-900 text-3xl font-medium mb-3">Sign Up</div>
                            <span class="text-600 font-medium">Create an account</span>
                        </div>

                        <div>
                            <form @submit.prevent="registerSubmit()">
                                <label for="name1" class="block text-900 text-xl font-medium mb-2">Full Name</label>
                                <InputText
                                    id="name1"
                                    type="text"
                                    placeholder="Email Address"
                                    :class="vv?.user.name?.$errors[0] ? 'p-invalid' : ''"
                                    class="w-full md:w-30rem mb-2"
                                    style="padding: 1rem"
                                    v-model="vv.user.name.$model"
                                    aria-describedby="name-help"
                                />
                                <p class="p-error" id="text-error">{{ vv?.user.name?.$errors[0]?.$message || '&nbsp;' }}</p>

                                <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                                <InputText
                                    id="email1"
                                    type="text"
                                    placeholder="Email Address"
                                    :class="vv?.user.email?.$errors[0] ? 'p-invalid' : ''"
                                    class="w-full md:w-30rem mb-2"
                                    style="padding: 1rem"
                                    v-model="vv.user.email.$model"
                                    aria-describedby="email-help"
                                />
                                <p class="p-error" id="text-error">{{ vv?.user.email?.$errors[0]?.$message || '&nbsp;' }}</p>

                                <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                                <Password
                                    id="password1"
                                    :feedback="false"
                                    :class="vv?.user.password?.$errors[0] ? 'p-invalid' : ''"
                                    v-model="vv.user.password.$model"
                                    placeholder="Password"
                                    :toggleMask="true"
                                    class="w-full mb-2"
                                    inputClass="w-full"
                                    :inputStyle="{ padding: '1rem' }"
                                    aria-describedby="password-help"
                                ></Password>
                                <p class="p-error" id="text-error">{{ vv?.user.password?.$errors[0]?.$message || '&nbsp;' }}</p>

                                <label for="cfpassword1" class="block text-900 font-medium text-xl mb-2">Confirm Password</label>
                                <Password
                                    id="cfpassword1"
                                    :feedback="false"
                                    :class="vv?.user.confirm_password?.$errors[0] ? 'p-invalid' : ''"
                                    v-model="vv.user.confirm_password.$model"
                                    placeholder="Confirm Password"
                                    :toggleMask="true"
                                    class="w-full mb-2"
                                    inputClass="w-full"
                                    :inputStyle="{ padding: '1rem' }"
                                    aria-describedby="confirm-password-help"
                                ></Password>
                                <p class="p-error" id="text-error">{{ vv?.user.confirm_password?.$errors[0]?.$message || '&nbsp;' }}</p>
                                <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div class="flex align-items-center">
                                        <!-- Remeber me code -->
                                    </div>
                                    <router-link :to="{ path: '/login' }" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Already have the account? Login now</router-link>
                                </div>
                                <Button label="Sign Up" type="submit" class="w-full p-3 text-xl"></Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.loginPage {
    height: 97vh;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
