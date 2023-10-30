<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';
import logoFileDark from "@/assets/images/logo-dark.svg";
import logoFileWhite from "@/assets/images/logo-white.svg";

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    // return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    return layoutConfig.darkTheme.value;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl ? logoFileWhite : logoFileDark" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">PrimeVue</span>
    </div>
</template>
<style lang="scss" scoped></style>
