import axios from '@/plugins/apiService.js';

const state = {
    userList: [],
};

const mutations = {
    SET_USERS_LIST(state, value) {
        state.userList = value;
    },
};

const getters = {};

const actions = {
    async saveUser({ dispatch }, data) {
        let resp = await axios.post('admin/manage-users/save-update-user', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (resp.data.status == true) {
            dispatch('getUsersList')
        }
        return resp;
    },

    async getUsersList({ commit }, data) {
        let resp = await axios.get('admin/manage-users/get-user-list');
        if (resp.data.status == true) {
            commit('SET_USERS_LIST' , resp.data.data)
        }
        return resp;
    },

    async userDelete({ dispatch }, data) {
        let resp = await axios.post('admin/manage-users/delete-user',data);
        if (resp.data.status == true) {
            dispatch('getUsersList')
        }
        return resp;
    },

    async updateUserStatus({ dispatch }, data) {
        let resp = await axios.post('admin/manage-users/update-user-status',data);
        if (resp.data.status == true) {
            dispatch('getUsersList')
        }
        return resp;
    },

    async getSingleUserData({ commit }, data) {
        let resp = await axios.get('admin/manage-users/get-single-user-data/'+data.user_id);
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
