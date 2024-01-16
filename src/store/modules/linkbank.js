import axios from '@/plugins/apiService.js';
const state = {
    linkBankList: []
};

const mutations = {
    SET_LINKBANK_LIST(state, value) {
        state.linkBankList = value;
    }
};

const getters = {};

const actions = {
    async saveLinkBank({ dispatch }, data) {
        let resp = await axios.post('user/link-bank/create-new-link', data);
        if (resp.data.status == true) {
            dispatch('getLinkBank');
        }
        return resp;
    },
    async getLinkBank({ commit }, data) {
        let resp = await axios.get('user/link-bank/get-links?page=' + data.page);
        if (resp.data.status == true) {
            commit('SET_LINKBANK_LIST', resp.data.data);
        }
        return resp;
    },

    async getSingleLinkBank({ commit }, data) {
        let resp = await axios.get('user/link-bank/get-links/'+data.link_bank_id);
        return resp;
    },

    async changeStatus({ dispatch }, data) {
        let resp = await axios.post('user/link-bank/update-status',data);
        if (resp.data.status == true) {
            dispatch('getLinkBank' , data);
        }
        return resp;
    },

    async deleteLinkBank({ dispatch }, data) {
        let resp = await axios.post('user/link-bank/delete-links',data);
        if (resp.data.status == true) {
            dispatch('getLinkBank' , data);
        }
        return resp;
    },

    async checkVisibleLink({ dispatch }, data) {
        let resp = await axios.post('user/link-bank/check-visible-link', data);
        if (resp.data.status == true) {
            
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
