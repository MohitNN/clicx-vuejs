import axios from '@/plugins/apiService.js';

const state = {
    //Manage Group Page
    groupList: [],
    vendorList: [],
    split_partnerList: [],
    link_platformList: [],

    //Paid Traffic Page
    paidTrafficGroupList: [],
    paidTrafficProviderList: [],

    //rotator page
    rotatorGroupList:[],

    //Link Sequence
    link_sequenceList:[],
    
    //Retargeting Pixel
    retargetingPixelList:[],

    //Domain
    userDomainList:[],

    //Pages
    userPageList:[],
};

const mutations = {
    //Manage Group Page
    SET_GROUP_LIST(state, value) {
        state.groupList = value;
    },
    SET_VENDOR_LIST(state, value) {
        state.vendorList = value;
    },
    SET_SPLIT_PARTNER_LIST(state, value) {
        state.split_partnerList = value;
    },
    SET_LINK_PLATFORM_LIST(state, value) {
        state.link_platformList = value;
    },

    //Paid Traffic Page
    SET_PAID_TRAFFIC_GROUP(state, value) {
        state.paidTrafficGroupList = value;
    },
    SET_PAID_TRAFFIC_PROVIDER(state, value) {
        state.paidTrafficProviderList = value;
    },

    //rotator page
    SET_ROTATOR_GROUP(state, value) {
        state.rotatorGroupList = value;
    }, 

    //Link Sequnce
    SET_Link_Sequnce_GROUP(state, value) {
        state.link_sequenceList = value;
    },

     //Retargeting Pixel
    SET_RETARGETING_PIXEL(state, value) {
        state.retargetingPixelList = value;
    },

    //Domain
    SET_DOMAIN_LIST(state, value) {
        state.userDomainList = value;
    },

    //Pages
    SET_PAGES(state, value) {
        state.userPageList = value;
    },
};

const getters = {};

const actions = {
    // Groups
    async getGroupList({ commit }, data) {
        let resp = await axios.get('user/groups/get-group-list');
        if (resp.data.status == true) {
            commit('SET_GROUP_LIST', resp.data.data);
        }
        return resp;
    },
    async saveGroup({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-group', data);
        if (resp.data.status == true) {
            dispatch('getGroupList');
        }
        return resp;
    },

    async checkSlugForUserDomain({ dispatch }, data) {
        let resp = await axios.post('user/groups/check-slug-domain', data);
        if (resp.data.status == true) {
            
        }
        return resp;
    },

    async deleteGroup({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-group', data);
        if (resp.data.status == true) {
            dispatch('getGroupList');
        }
        return resp;
    },

    // Vendor
    async getVendorList({ commit }, data) {
        let resp = await axios.get('user/groups/get-vendor-list');
        if (resp.data.status == true) {
            commit('SET_VENDOR_LIST', resp.data.data);
        }
        return resp;
    },
    async saveVendor({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-vendor', data);
        if (resp.data.status == true) {
            dispatch('getVendorList');
        }
        return resp;
    },
    async deleteVendor({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-vendor', data);
        if (resp.data.status == true) {
            dispatch('getVendorList');
        }
        return resp;
    },

    // Split Partner
    async saveSplitPartner({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-split-partner', data);
        if (resp.data.status == true) {
            dispatch('getSplitPartnerList');
        }
        return resp;
    },
    async getSplitPartnerList({ commit }, data) {
        let resp = await axios.get('user/groups/get-split-partner-list');
        if (resp.data.status == true) {
            commit('SET_SPLIT_PARTNER_LIST', resp.data.data);
        }
        return resp;
    },
    async deleteSplitPartner({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-split-partner', data);
        if (resp.data.status == true) {
            dispatch('getSplitPartnerList');
        }
        return resp;
    },

    // Link Platform
    async saveLinkPlatform({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-link-platform', data);
        if (resp.data.status == true) {
            dispatch('getLinkPlatformList');
        }
        return resp;
    },
    async getLinkPlatformList({ commit }, data) {
        let resp = await axios.get('user/groups/get-link-platform-list');
        if (resp.data.status == true) {
            commit('SET_LINK_PLATFORM_LIST', resp.data.data);
        }
        return resp;
    },
    async deleteLinkPlatform({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-link-platform', data);
        if (resp.data.status == true) {
            dispatch('getLinkPlatformList');
        }
        return resp;
    },

    // Paid Traffic Group
    async savePaidTrafficGroup({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-paid-traffic-group', data);
        if (resp.data.status == true) {
            dispatch('getPaidTrafficGroup');
        }
        return resp;
    },
    async getPaidTrafficGroup({ commit }, data) {
        let resp = await axios.get('user/groups/get-paid-traffic-group-list');
        if (resp.data.status == true) {
            commit('SET_PAID_TRAFFIC_GROUP', resp.data.data);
        }
        return resp;
    },
    async deletePaidTrafficGroup({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-paid-traffic-group', data);
        if (resp.data.status == true) {
            dispatch('getPaidTrafficGroup');
        }
        return resp;
    },

    // Paid Traffic Provider
    async savePaidTrafficProvider({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-paid-traffic-provider', data);
        if (resp.data.status == true) {
            dispatch('getPaidTrafficProvider');
        }
        return resp;
    },
    async getPaidTrafficProvider({ commit }, data) {
        let resp = await axios.get('user/groups/get-paid-traffic-provider-list');
        if (resp.data.status == true) {
            commit('SET_PAID_TRAFFIC_PROVIDER', resp.data.data);
        }
        return resp;
    },
    async deletePaidTrafficProvider({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-paid-traffic-provider', data);
        if (resp.data.status == true) {
            dispatch('getPaidTrafficProvider');
        }
        return resp;
    },

    //rotator page
    async saveRotatorGroup({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-rotator-group', data);
        if (resp.data.status == true) {
            dispatch('getRotatorGroup');
        }
        return resp;
    },
    async getRotatorGroup({ commit }, data) {
        let resp = await axios.get('user/groups/get-rotator-group-list');
        if (resp.data.status == true) {
            commit('SET_ROTATOR_GROUP', resp.data.data);
        }
        return resp;
    },
    async deleteRotatorGroup({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-rotator-group', data);
        if (resp.data.status == true) {
            dispatch('getRotatorGroup');
        }
        return resp;
    },

    //Link Sequnce
    async saveLinkSequence({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-link-sequence', data);
        if (resp.data.status == true) {
            dispatch('getLinkSequence');
        }
        return resp;
    },
    async getLinkSequence({ commit }, data) {
        let resp = await axios.get('user/groups/get-link-sequence-list');
        if (resp.data.status == true) {
            commit('SET_Link_Sequnce_GROUP', resp.data.data);
        }
        return resp;
    },
    async deleteLinkSequence({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-link-sequence', data);
        if (resp.data.status == true) {
            dispatch('getLinkSequence');
        }
        return resp;
    },
    //Retargeting Pixel Store
    async saveRetargetingPixel({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-retargeting-pixel', data);
        if (resp.data.status == true) {
            dispatch('getRetargetingPixel');
        }
        return resp;
    },
    async getRetargetingPixel({ commit }, data) {
        let resp = await axios.get('user/groups/get-retargeting-pixel-list');
        if (resp.data.status == true) { 
            commit('SET_RETARGETING_PIXEL', resp.data.data);
        }
        return resp;
    },
    async deleteRetargetingPixel({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-retargeting-pixel', data);
        if (resp.data.status == true) {
            dispatch('getRetargetingPixel');
        }
        return resp;
    },

    //Domain
    async saveDomain({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-domain', data);
        if (resp.data.status == true) {
            dispatch('getDomain');
        }
        return resp;
    },
    async getDomain({ commit }, data) {
        let resp = await axios.get('user/groups/get-domain-list');
        if (resp.data.status == true) { 
            commit('SET_DOMAIN_LIST', resp.data.data);
        }
        return resp;
    },
    async deleteDomain({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-domain', data);
        if (resp.data.status == true) {
            dispatch('getDomain');
        }
        return resp;
    },
    //Domain
    async savePage({ dispatch }, data) {
        let resp = await axios.post('user/groups/save-pages', data);
        if (resp.data.status == true) {
            dispatch('getPage');
        }
        return resp;
    },
    async getPage({ commit }, page_type) {
        console.log("page_type",page_type);
        let resp = await axios.get(`user/groups/${page_type}/get-pages-list`);
        if (resp.data.status == true) { 
            commit('SET_PAGES', resp.data.data);
        }
        return resp;
    },
    async deletePage({ dispatch }, data) {
        let resp = await axios.post('user/groups/delete-page', data);
        if (resp.data.status == true) {
            dispatch('getPage');
        }
        return resp;
    },
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
