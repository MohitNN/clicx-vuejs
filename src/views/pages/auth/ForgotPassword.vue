<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import store from '@/store';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import logoFileDark from '@/assets/images/clickx.png';

const { layoutConfig } = useLayout();
const toast = useToast();
const router = useRouter();
const email_ = ref('');

const logoUrl = computed(() => {
    // return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    return logoFileDark;
});

const rules = {
    email_: { required: helpers.withMessage('The Email field is required', required), email: helpers.withMessage('Please enter a valid email', email) },
};
const vv = useVuelidate(rules, { email_ });

const forgotSubmit = () => {
    alert(1)
}
</script>
<template>
    <div class="flex align-items-center justify-content-center loginPage">
        <div class="surface-ground h-auto">
            <div class="flex flex-column align-items-center justify-content-center">
                <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                        <div class="text-center mb-5">
                            <div class="text-900 text-3xl font-medium mb-3">Login</div>
                            <span class="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <form @submit.prevent="forgotSubmit()">
                                <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                                <InputText
                                    id="email1"
                                    type="text"
                                    placeholder="Email Address"
                                    :class="vv?.email_?.$errors[0] ? 'p-invalid' : ''"
                                    class="w-full md:w-30rem mb-2"
                                    style="padding: 1rem"
                                    v-model="vv.email_.$model"
                                    aria-describedby="email-help"
                                />
                                <p class="p-error" id="text-error">{{ vv?.email_?.$errors[0]?.$message || '&nbsp;' }}</p>
                                <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div class="flex align-items-center">
                                    </div>
                                    <router-link :to="{ path: '/login' }" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Back to Login?</router-link>
                                </div>
                                <Button label="Forgot Password" type="submit" class="w-full p-3 text-xl"></Button>
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
