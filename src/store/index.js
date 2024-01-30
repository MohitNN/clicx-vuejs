import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import globleStore from "@/store/modules/globleStore";
import auth from "@/store/modules/auth";
import GroupStore from "@/store/modules/groups/groups";
import MasterCampaignStore from "@/store/modules/groups/masterCampaign";
import LinkbankStore from "@/store/modules/linkbank";
import AdminUserStore from "@/store/modules/admin/userStore";

let stores = "";
stores = {
    globleStore,
    auth,
    GroupStore,
    LinkbankStore,
    MasterCampaignStore,
    AdminUserStore,
}
const vuexLocal = new VuexPersistence({
    modules: ['auth','globleStore']
})
export default createStore({
    modules: stores,
    plugins:[vuexLocal.plugin],
})