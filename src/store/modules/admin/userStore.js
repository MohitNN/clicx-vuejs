import axios from '@/plugins/apiService.js';

const state = {};

const mutations = {};

const getters = {};

const actions = {
    async saveUser({ dispatch }, data) {
        console.log(data, 'user-store');
        let resp = await axios.post('admin/manage-users/save-update-user', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (resp.data.status == true) {
            // dispatch('getUserList');
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
