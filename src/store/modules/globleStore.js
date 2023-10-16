const state = {
    counter: 0,
};


const mutations = {
    ADD_COUNTER(state) {
        state.counter++;
    },
}

const getters = {

}

const actions = {
    async setcounter({ commit }, data) {
        commit("ADD_COUNTER");
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};