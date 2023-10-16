import axios from '@/plugins/apiService.js';

const state = {
    groupList: [],
    vendorList:[],
};

const mutations = {
    SET_GROUP_LIST(state, value) {
        state.groupList = value;
    },
    SET_VENDOR_LIST(state, value) {
        state.vendorList = value;
    }
};

const getters = {};

const actions = {
    async getGroupList({ commit }, data) {
        let resp = await axios.get('api/user/groups/get-group-list');
        if (resp.data.status == true) {
            commit('SET_GROUP_LIST' , resp.data.data);
        }
        return resp;
    },
    async getVendorList({ commit }, data) {
        let resp = await axios.get('api/user/groups/get-vendor-list');
        if (resp.data.status == true) {
            commit('SET_VENDOR_LIST' , resp.data.data);
        }
        return resp;
    },
    async saveGroup({ dispatch }, data) {
        let resp = await axios.post('api/user/groups/save-group', data);
        if (resp.data.status == true) {
            dispatch('getGroupList');
        }
        return resp;
    },
    async saveVendor({ dispatch }, data) {
        let resp = await axios.post('api/user/groups/save-vendor', data);
        if (resp.data.status == true) {
            dispatch('getVendorList');
        }
        return resp;
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
