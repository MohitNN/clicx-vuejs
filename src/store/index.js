import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import globleStore from "@/store/modules/globleStore";
import auth from "@/store/modules/auth";
import GroupStore from "@/store/modules/groups/groups";
let stores = "";
stores = {
    globleStore,
    auth,
    GroupStore,
}
const vuexLocal = new VuexPersistence({
    modules: ['auth']
})
export default createStore({
    modules: stores,
    plugins:[vuexLocal.plugin],
})