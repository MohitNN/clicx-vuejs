import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import globleStore from "@/store/modules/globleStore";
import auth from "@/store/modules/auth";
import GroupStore from "@/store/modules/groups/groups";
import LinkbankStore from "@/store/modules/linkbank";
let stores = "";
stores = {
    globleStore,
    auth,
    GroupStore,
    LinkbankStore,
}
const vuexLocal = new VuexPersistence({
    modules: ['auth']
})
export default createStore({
    modules: stores,
    plugins:[vuexLocal.plugin],
})