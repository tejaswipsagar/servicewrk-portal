import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    EmailID: "",
    user_type: "",
    GetCurrentUser: [],
    Route_Details: [],
    AccessModuleDetails: [],
    getIssueDetails: {},
    getPreviousRoute: "",
    s3URLData: {
      customer_data: {},
    },
  },

  plugins: [createPersistedState()],

  getters: {
    get_user_email: (state) => {
      return state.EmailID;
    },
    get_current_user_details: (state) => {
      return state.GetCurrentUser;
    },
    get_user_type: (state) => {
      return state.user_type;
    },
    get_issue_details: (state) => {
      return state.getIssueDetails;
    },

    get_previous_route: (state) => {
      return state.getPreviousRoute;
    },
    get_access_module_details: (state) => {
      return state.AccessModuleDetails;
    },
    get_router_details: (state) => {
      return state.Route_Details;
    },
    get_s3_url_data: (state) => {
      return state.s3URLData;
    },
  },
  mutations: {
    SET_ISSUE_DETAILS(state, getIssueDetails) {
      state.getIssueDetails = getIssueDetails;
    },
    SET_USEREMAIL(state, username) {
      state.EmailID = username;
    },
    SET_CURRENTUSER_DETAILS(state, GetCurrentUserDetails) {
      state.GetCurrentUser = GetCurrentUserDetails;
    },
    SET_USER_TYPE(state, user_type) {
      state.user_type = user_type;
    },
    SET_PREVIOUS_ROUTE(state, route) {
      state.getPreviousRoute = route;
    },
    SET_ROUTER_DETAILS(state, Route_Details) {
      state.Route_Details = Route_Details;
    },
    SET_ACCESS_MODULE(state, AccessModuleDetails) {
      state.AccessModuleDetails = AccessModuleDetails;
    },

    S3_URL_DATA(state, obj) {
      state.s3URLData.customer_data = obj;
    },
  },

  actions: {},
  modules: {},
});
