import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { Amplify } from "aws-amplify";
import "@/plugins/apexchartsView";
import * as VueGoogleMaps from "vue2-google-maps";
import "material-design-icons-iconfont/dist/material-design-icons.css";
Vue.use(VueGoogleMaps, {
  load: {
    key: "",
    libraries: "places",
  },
});

Vue.config.productionTip = false;
Amplify.configure({
  Auth: {
    userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
    region: process.env.VUE_APP_AWS_REGION,
    userPoolWebClientId: process.env.VUE_APP_AWS_USER_POOL_WEB_CLIENT_ID,
  },
  API: {
    aws_project_region: process.env.VUE_APP_AWS_PROJECT_REGION,
    aws_appsync_graphqlEndpoint: process.env.VUE_APP_AWS_GRAPHQL_ENDPOINT,
    aws_appsync_region: process.env.VUE_APP_AWS_PROJECT_REGION,
    aws_appsync_authenticationType: process.env.VUE_APP_AWS_AUTH_TYPE,
  },
  endpoints: [
    {
      name: "razorpaypayment",
      endpoint: process.env.VUE_APP_RAZORPAY_ENDPOINT,
    },
    {
      name: "SERVICEWRK",
      endpoint: process.env.VUE_APP_SERVICEWRK_ENDPOINT,
    },
    {
      name: "SERVICEWRKQ",
      endpoint: process.env.VUE_APP_SERVICEWRQ_ENDPOINT,
    },
    {
      name: "listquerybaseditemsfortabulardata",
      endpoint: process.env.VUE_APP_TABULAR_ENDPOINT,
    },
    {
      name: "BUGTRAKR",
      endpoint: process.env.VUE_APP_BUGTRACKER_ENDPOINT,
    },
  ],
});
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
