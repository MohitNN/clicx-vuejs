<script setup>
import { integer } from '@vuelidate/validators';
import { ref, onMounted, inject } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import config from '@/configService.js';
import store from '@/store';
const router = useRouter();
const moment = inject('moment');
const toast = useToast();
const confirm = useConfirm();
const props = defineProps({
    activeTabIndex: {
        default: null
    },
    activeTabTitle: {
        default: ''
    },
    linkBanklList: {
        default: []
    }
});

const menu = ref();
const lableMenu = ref();
const page = ref(1);
const selected_link_bank_id = ref(null);
const selected_link_bank = ref(null);
const selected_label = ref(null);
const splitbutton = ref();
const toggle = (event, selected_link_bank_data, type) => {
    if (type == 'action') {
        menu.value.toggle(event);
        selected_link_bank.value = selected_link_bank_data;
        selected_link_bank_id.value = selected_link_bank_data.id;
    } else {
        lableMenu.value.toggle(event);
        selected_link_bank_id.value = selected_link_bank_data.id;
    }
};

const statusLable = (statusLable) => {
    let status = config.link_status.find((item) => item.status === statusLable);
    if (status) {
        return status.color;
    }
    return '';
};

const changeLabel = (status) => {
    let data = { link_bank_id: selected_link_bank_id.value, status: status , page : page.value };
    store
        .dispatch('LinkbankStore/changeStatus', data)
        .then((response) => {
            if (response.data.status) {
                selected_link_bank_id.value = null;
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Bank Status Updated Successfully!', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
            }
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Server Error!', life: 3000 });
        });
};

const linkAction = (link_bank_id, link_action_type) => {
    alert(link_bank_id, link_action_type);
};

const lableItems = [
    {
        label: 'Pending',
        command: () => {
            changeLabel('Pending')
        }
    },
    {
        label: 'Active',
        command: () => {
            changeLabel('Active')
        }
    },
    {
        label: 'Completed',
        command: () => {
            changeLabel('Completed')
        }
    },
    {
        label: 'Evergreen',
        command: () => {
            changeLabel('Evergreen')
        }
    },
    {
        label: 'My Links',
        command: () => {
            changeLabel('My Links')
        }
    }
];

const items = [
    {
        label: 'Delete Link',
        action_type: 'delete-link',
        icon: 'pi pi-trash',
        command: () => {
            confirm.require({
                message: 'Are you sure you want to delete this Link Bank?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    let data = { link_bank_id: selected_link_bank_id.value, page: page.value };
                    store
                        .dispatch('LinkbankStore/deleteLinkBank', data)
                        .then((response) => {
                            if (response.data.status) {
                                selected_link_bank_id.value = null;
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Link Bank Deleted Successfully!', life: 3000 });
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
    },
    {
        label: 'Edit Link',
        action_type: 'edit-link',
        icon: 'pi pi-pencil',
        command: () => {
            router.push({ name: 'LinkBankEditLink', params: { id: selected_link_bank_id.value } });
        }
    },
    {
        label: 'Clone Link',
        action_type: 'clone-link',
        icon: 'pi pi-clone',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: 'Copy Link',
        action_type: 'copy-link',
        icon: 'pi pi-copy',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: 'Statistics',
        action_type: 'statistics',
        icon: 'pi pi-chart-pie',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: 'Reset Statistics',
        action_type: 'reset-statistics',
        icon: 'pi pi-ban',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: 'Direct Link',
        action_type: 'redirect-link',
        icon: 'pi pi-external-link',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    }
];
</script>
<template>
    <DataTable :value="linkBanklList.data" paginator :rows="20" dataKey="id" filterDisplay="row" removableSort tableStyle="min-width: 50rem">
        <template #empty>
            <center>No Links Found.</center>
        </template>
        <Column field="work_status" header="#" style="width: 2%"></Column>
        <Column field="name" header="Link Name" filterField="representative" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem" sortable>
            <template #body="{ data }">
                {{ data.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column field="vendor_id" header="Vendor" style="width: 15%" filterField="representative" :showFilterMenu="false" sortable>
            <template #body="{ data }">
                {{ data.vendor?.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column field="group_id" header="Group" style="width: 15%" filterField="representative" :showFilterMenu="false" sortable>
            <template #body="{ data }">
                {{ data.group?.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <!-- <Tag :severity="statusLable(data.status)" :value="data.status" /> -->
                <Tag type="button" @click="toggle($event, data, 'lable')" aria-haspopup="true" :severity="statusLable(data.status)" class="cursor-pointer" aria-controls="overlay_menu" :value="data.status" />
                <Menu ref="lableMenu" id="overlay_menu" :model="lableItems" :popup="true">
                    <template #item="{ item, label, props }">
                        <div class="p-2">
                            <Tag class="ml-2 cursor-pointer" :severity="statusLable(item.label)"  :value="item.label" />
                        </div>
                    </template>
                </Menu>
            </template>
        </Column>
        <Column field="raw" header="Raw" style="width: 2%" sortable>
            <template #body="{ data }">
                {{ Math.floor(Math.random() * 100 + 1) }}
            </template>
        </Column>
        <Column field="unique" header="Unique" style="width: 2%" sortable>
            <template #body="{ data }">
                {{ Math.floor(Math.random() * 100 + 1) }}
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
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
                    <!-- <template #item="{ item, label, props }">
                        <div class="p-2">
                            <i :class="`${item.icon}`"></i>
                            <span class="ml-2">{{ item.label }}</span>
                        </div>
                    </template> -->
                </Menu>
            </template>
        </Column>
    </DataTable>
</template>
