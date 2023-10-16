import axios from '@/plugins/apiService.js'
import router from '@/router'

const state = {
    authenticated: false,
    user: '',
    accessToken: '',
};


const mutations = {
    SET_AUTHENTICATED(state, value) {
        state.authenticated = value
    },
    SET_USER(state, value) {
        state.user = value
    },
    SET_ID_TOKEN(state, value) {
        state.accessToken = value
    }
}

const getters = {

}

const actions = {
    async login({ commit }, data) {
        let resp = await axios.post('/api/login', data)
        if (resp.data.status == true) {
            console.log(resp.data)
            commit('SET_USER', resp.data.data)
            commit('SET_ID_TOKEN', resp.data.data.access_token)
            commit('SET_AUTHENTICATED', true)
        }
        return resp;
    },

    async logout({ commit }){
        let resp = await axios.get('/api/user/logout')
          commit('SET_USER','')
          commit('SET_ID_TOKEN','')
          commit('SET_AUTHENTICATED',false)
        return resp;
      },

    async logoutIfToken({ commit }) {
        commit('SET_USER', '')
        commit('SET_ID_TOKEN', '')
        commit('SET_AUTHENTICATED', false)
        router.push("/login");
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};