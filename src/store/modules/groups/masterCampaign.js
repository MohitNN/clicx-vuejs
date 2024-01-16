import axios from '@/plugins/apiService.js';

const state = {
    masterCampaignList : [],
};

const mutations = {
    SET_MASTER_CAMPAIGN_LIST(state, value) {
        state.masterCampaignList = value;
    },
};

const getters = {};

const actions = {
    async createMasterCampaign({ dispatch }, data) {
        let resp = await axios.post('user/master-campaign/create-new-master-campaign', data);
        if (resp.data.status == true) {
            dispatch('getListMasterCampaign');
        }
        return resp;
    },

    async deleteMasterCampaign({ dispatch }, data) {
        let resp = await axios.post('user/master-campaign/delete-master-campaign', data);
        if (resp.data.status == true) {
            dispatch('getListMasterCampaign');
        }
        return resp;
    },

    async getListMasterCampaign({ commit }, data) {
        let resp = await axios.get('user/master-campaign/get-list-master-campaign');
        if (resp.data.status == true) {
            commit('SET_MASTER_CAMPAIGN_LIST', resp.data.data);
        }
        return resp;
    },
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
