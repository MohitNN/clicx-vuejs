<template>
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
                        <Dropdown :options="statusList" v-model="link_bank.status" id="link_status" size="small" placeholder="Select Status"></Dropdown>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Vendor</label>
                    <div class="col-8">
                        <Dropdown :options="statusList" v-model="link_bank.status" id="link_status" size="small" placeholder="Select Status"></Dropdown>
                    </div>
                </div>
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Choose Group</label>
                    <div class="col-8">
                        <Dropdown :options="statusList" v-model="link_bank.status" id="link_status" size="small" placeholder="Select Status"></Dropdown>
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
                        <Dropdown :options="statusList" v-model="link_bank.status" id="link_status" size="small" placeholder="Select System Domain"></Dropdown>
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

        <div class="col-12 lg:col-6 xl:col-6">
            <div className="card">
                <h5>Advance Option</h5>
                <Divider />
                <div class="field grid p-fluid mt-5">
                    <label class="col-4" for="link_status">Retargeting Pixel</label>
                    <div class="col-8">
                        <Dropdown :options="statusList" v-model="link_bank.status" id="link_status" size="small" placeholder="Select System Domain"></Dropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
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
</script>
