import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import auth from "@/store/modules/auth";
let stores = "";
stores = {
    auth,
}
const vuexLocal = new VuexPersistence({
    modules: ['auth']
})
export default createStore({
    modules: stores,
    plugins:[vuexLocal.plugin],
})