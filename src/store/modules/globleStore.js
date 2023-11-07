const state = {
    counter: 0,
    darkMode: false
};


const mutations = {
    ADD_COUNTER(state) {
        state.counter++;
    },
    DARK_MODE(state,data) {
        state.darkMode = data;
    },
}

const getters = {

}

const actions = {
    async setcounter({ commit }, data) {
        commit("ADD_COUNTER");
    },
    async setDarkMode({ commit }, data) {
        commit("DARK_MODE",data);
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};