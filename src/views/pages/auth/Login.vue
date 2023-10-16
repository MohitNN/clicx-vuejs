<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Login</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <form @submit.prevent="loginSubmit">
                            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText id="email1" type="text" placeholder="Email Address" :class="vv?.email_?.$errors[0] ? 'p-invalid' : ''" class="w-full md:w-30rem mb-2"
                                style="padding: 1rem" v-model="vv.email_.$model" aria-describedby="email-help"/>
                                <p class="p-error" id="text-error">{{ vv?.email_?.$errors[0]?.$message || '&nbsp;' }}</p>

                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                            
                            <Password id="password1" :feedback="false" :class="vv?.password?.$errors[0] ? 'p-invalid' : ''" v-model="vv.password.$model" placeholder="Password" :toggleMask="true"
                                class="w-full mb-2 " inputClass="w-full" :inputStyle="{ padding: '1rem' }" aria-describedby="password-help"></Password>
                                <p class="p-error" id="text-error">{{ vv?.password?.$errors[0]?.$message || '&nbsp;' }}</p>
                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <div class="flex align-items-center">
                                    <!-- Remeber me code -->
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style="color: var(--primary-color)">Forgot password?</a>
                            </div>
                            <Button label="Sign In" type="submit" class="w-full p-3 text-xl"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import store from '@/store'
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from "@vuelidate/validators";


const { layoutConfig } = useLayout();
const email_ = ref('');
const password = ref('');
const toast = useToast();
const router = useRouter();

const rules = {
    email_: { required: helpers.withMessage('The Email field is required', required), email : helpers.withMessage('Please enter a valid email' , email) },
    password: { required: helpers.withMessage('The Password field is required', required)},
};
const vv = useVuelidate(rules, { email_, password })

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const loginSubmit = (() => {
    vv.value.$touch();
    if (vv.value.$invalid) return;
    let data = { email: email_.value, password: password.value };
    store.dispatch('auth/login', data).then((response) => {
        if (response.data.status) {
            router.push({ path: '/' });
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Login Successfully!', life: 3000 });
        }
    }).catch((error) => {
        toast.add({ severity: 'error', summary: 'Error Message', detail: error.response.data.message, life: 3000 });

    })
})

</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
