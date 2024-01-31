<script setup>
import { ref, onMounted, inject, defineEmits } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import store from '@/store';
const moment = inject('moment');
const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const menu = ref();
const page = ref(1);
const selected_user_id = ref(null);
const selected_user_data = ref(null);
const toggle = (event, selectedUserData, type) => {
    if (type == 'action') {
        menu.value.toggle(event);
        selected_user_id.value = selectedUserData.id;
        selected_user_data.value = selectedUserData;
    } else {
        lableMenu.value.toggle(event);
    }
};

const statusChange = (data) => {
    let payload = { user_id: data.id, status: data.user_status, page: page.value };
    store
        .dispatch('AdminUserStore/updateUserStatus', payload)
        .then((response) => {
            if (response.data.status) {
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'User Status Updated', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
        });
};
const copyText = (text) => {
    let listener = function (ev) {
        ev.clipboardData.setData('text/plain', text);
        ev.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Value Copy', position: 'bottom-right', life: 3000 });
};
const props = defineProps({
    userList: {
        default: []
    }
});
const items = [
    {
        label: 'Edit User',
        action_type: 'edit-campaign',
        icon: 'pi pi-user-edit',
        command: () => {
            router.push({ name: 'AdminUserEdit', params: { id: selected_user_id.value } });
        }
    },
    {
        label: 'Delete User',
        action_type: 'delete-campaign',
        icon: 'pi pi-trash',
        command: () => {
            confirm.require({
                message: 'Are you sure you want to delete this User',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    let data = { user_id: selected_user_id.value, page: page.value };
                    store
                        .dispatch('AdminUserStore/userDelete', data)
                        .then((response) => {
                            if (response.data.status) {
                                selected_user_id.value = null;
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'User Deleted Successfully!', life: 3000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                            }
                        })
                        .catch((error) => {
                            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
                        });
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });
        }
    }
];
</script>
<template>
    <DataTable :value="userList.data" paginator :rows="20" dataKey="id" filterDisplay="row" removableSort tableStyle="min-width: 50rem">
        <template #empty>
            <center>No Users Found.</center>
        </template>
        <Column field="profile_pic" header="#" filterField="representative" :showFilterMenu="false" style="min-width: auto" >
            <template #body="{ data }">
                <Avatar v-if="data.preview_image_url" :image="data.preview_image_url" size="large" shape="circle" />
                <Avatar v-else icon="pi pi-user" size="large" shape="circle" />
            </template>
        </Column>
        <Column field="name" header="User Name" filterField="representative" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem" sortable>
            <template #body="{ data }">
                {{ data.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column field="email" header="Email ID" filterField="representative" :showFilterMenu="false" :filterMenuStyle="{ width: '10rem' }" style="min-width: 14rem" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <span>{{ data.email }}</span> 
                    <i @click="copyText(data.email)" class="pi pi-copy text-xl cursor-pointer text-primary ml-2"></i>
                </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by Email ID" />
            </template>
        </Column>
        <Column field="visible_password" header="Password" filterField="representative" :showFilterMenu="false" :filterMenuStyle="{ width: '10rem' }" style="min-width: 14rem" >
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <span>{{ data.visible_password }}</span> 
                    <i @click="copyText(data.visible_password)" class="pi pi-copy text-xl cursor-pointer text-primary ml-2"></i>
                </div>

            </template>
        </Column>
        <Column field="user_type" header="User Type" filterField="representative" :showFilterMenu="false" :filterMenuStyle="{ width: '10rem' }" style="min-width: 14rem" sortable>
            <template #body="{ data }">
                {{ data.user_type ? data.user_type : 'Free' }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by User Type" />
            </template>
        </Column>
        <Column field="user_status" header="User Status" filterField="representative" :showFilterMenu="false" :filterMenuStyle="{ width: '10rem' }" style="min-width: 14rem" sortable>
            <template #body="{ data }">
                <InputSwitch v-model="data.user_status" @update:modelValue="statusChange(data)" :trueValue="1" :falseValue="0" />
            </template>
        </Column>
        <Column field="created_at" header="Date Created" sortable>
            <template #body="{ data }">
                {{ moment(data.created_at).format('MM/DD/YYYY hh:mm a') }}
            </template>
        </Column>
        <Column field="action" header="Action" sortable>
            <template #body="{ data, rowIndex }">
                <Button type="button" size="small" text icon="pi pi-cog" @click="toggle($event, data, 'action')" aria-haspopup="true" aria-controls="overlay_menu" rounded outlined />
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"> </Menu>
            </template>
        </Column>
    </DataTable>
</template>
