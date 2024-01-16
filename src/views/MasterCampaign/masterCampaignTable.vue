<script setup>
import { ref, onMounted, inject , defineEmits } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import store from '@/store';

const moment = inject('moment');
const toast = useToast();
const confirm = useConfirm();
const menu = ref();
const page = ref(1);
const selected_campaign_id = ref(null);
const selected_campaign_data = ref(null);
const props = defineProps({
    masterCampaignList: {
        default: []
    }
});
const emit = defineEmits(['edit-campaign']);
const items = [
    {
        label: 'Edit Campaign',
        action_type: 'edit-campaign',
        icon: 'pi pi-pencil',
        command: () => {
            emit('edit-campaign', selected_campaign_data.value)
        }
    },
    {
        label: 'Delete Campaign',
        action_type: 'delete-campaign',
        icon: 'pi pi-trash',
        command: () => {
            confirm.require({
                message: 'Are you sure you want to delete this Master Campaign?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                position: 'center',
                accept: () => {
                    let data = { master_campaign_id: selected_campaign_id.value, page: page.value };
                    store
                        .dispatch('MasterCampaignStore/deleteMasterCampaign', data)
                        .then((response) => {
                            if (response.data.status) {
                                selected_campaign_id.value = null;
                                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Master Campaign Deleted Successfully!', life: 3000 });
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
const toggle = (event, selectedCampaignData, type) => {
    if (type == 'action') {
        menu.value.toggle(event);
        selected_campaign_id.value = selectedCampaignData.id;
        selected_campaign_data.value = selectedCampaignData;
    } else {
        lableMenu.value.toggle(event);
    }
};
</script>
<template>
    <DataTable :value="masterCampaignList.data" paginator :rows="20" dataKey="id" filterDisplay="row" removableSort tableStyle="min-width: 50rem">
        <template #empty>
            <center>No Links Found.</center>
        </template>
        <Column field="work_status" header="#" style="width: 2%"></Column>
        <Column field="name" header="Master Campaign Name" filterField="representative" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem" sortable>
            <template #body="{ data }">
                {{ data.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column field="created_at" header="Date Created" sortable>
            <template #body="{ data }">
                {{ moment(data.created_at).format('MM/DD/YYYY hh:mm a') }}
            </template>
        </Column>
        <Column field="status" header="Status" sortable>
            <!-- <template #body="{ data }">
                <Tag type="button" @click="toggle($event, data, 'lable')" aria-haspopup="true" :severity="statusLable(data.status)" class="cursor-pointer" aria-controls="overlay_menu" :value="data.status" />
                <Menu ref="lableMenu" id="overlay_menu" :model="lableItems" :popup="true">
                    <template #item="{ item, label, props }">
                        <div class="p-2">
                            <Tag class="ml-2 cursor-pointer" :severity="statusLable(item.label)"  :value="item.label" />
                        </div>
                    </template>
                </Menu>
            </template> -->
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

        <Column field="action" header="Action" sortable>
            <template #body="{ data, rowIndex }">
                <Button type="button" size="small" text icon="pi pi-cog" @click="toggle($event, data, 'action')" aria-haspopup="true" aria-controls="overlay_menu" rounded outlined />
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"> </Menu>
            </template>
        </Column>
    </DataTable>
</template>
