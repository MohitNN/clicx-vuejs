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
