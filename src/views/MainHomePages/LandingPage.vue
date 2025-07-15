<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-app-bar dense app clipped-left color="#464646" elevation="0">
      <v-app-bar-nav-icon
        class="ml-n5"
        style="color: white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-img class="ml-n1" src="@/assets/logo1.png" max-width="130px"></v-img>
      <v-divider class="mx-3 ml-16" vertical></v-divider>
      <v-img
        v-if="
          $store.getters.get_current_user_details.organization_details
            .organization_logo_url != undefined
        "
        :src="
          $store.getters.get_current_user_details.organization_details
            ? $store.getters.get_current_user_details.organization_details
                .organization_logo_url
              ? $store.getters.get_current_user_details.organization_details
                  .organization_logo_url
              : ''
            : ''
        "
        max-width="100px"
        max-height="30"
      ></v-img>
      <div class="ml-2" style="color: white" align="center">
        {{
          $store.getters.get_current_user_details.organization_details
            .organization_name
        }}
      </div>
      <v-spacer></v-spacer>
      <v-btn
        outlined
        color="white"
        v-if="
          $store.getters.get_current_user_details.user_type == 'DEALER_OWNER' ||
          $store.getters.get_current_user_details.user_type == 'DEALER_AGENT'
        "
        >Dealer Portal</v-btn
      >
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            :disabled="overlay == true ? true : false"
            @click="htmlToImageMethod()"
            class="mr-5 white--text"
          >
            <v-icon class="white--text">mdi-information</v-icon>
          </v-btn>
        </template>
        <span>Facing Issues Using ServiceWrk ? Click To Report</span>
      </v-tooltip>
      <span>
        <div style="color: white" align="center">
          {{ user_name }} -
          <span v-if="$store.getters.get_user_type == 'AGENT'"
            >Service Co-Ordinator</span
          >
          <span v-else>{{
            $store.getters.get_user_type.replace("_", " ")
          }}</span>
        </div>
        <div style="color: white; font-size: 12px">
          {{ $store.getters.get_user_email }}
        </div>
      </span>
      <v-menu class="mr-8" bottom offset-y :close-on-content-click="CloseValue">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="white">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense nav>
          <v-list-item-group color="primary">
            <v-list-item to="/">
              <v-list-item-icon>
                <v-icon small color="blue">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="ml-n5">
                <v-list-item-title>SignOut</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon small color="primary lighten-2"
                  >mdi-account-multiple-plus</v-icon
                >
              </v-list-item-icon>
              <v-select
                item-value="organization_id"
                item-text="organization_name"
                :items="GetAllMyOrganization"
                label="Switch Organization"
                v-model="switch_organization"
                class="FontSize"
                dense
              ></v-select>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      width="270px"
      color="primary"
      dark
      dense
    >
      <!-- <div class="d-flex justify-center mt-2">
        <strong class="white--text" style="font-size: 14px"
          >( Version: 1.0.0 )</strong
        >
      </div> -->
      <v-list dark dense rounded class="heading3 overflow-y-auto">
        <v-list-group
          color="primary"
          link
          active-class="black"
          v-for="(item, idx) in RouterList"
          :key="idx"
          :append-icon="item.has_child_routes ? 'mdi-chevron-down' : ''"
          no-action
          @click="checkRouteItem(item)"
        >
          <template v-slot:activator>
            <v-list-item-action class="mr-0">
              <v-icon small color="white">
                {{ item.MenuICon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content class="px-0 mx-0">
              <v-list-item-title class="white--text">{{
                item.MenuName
              }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <!-- Submenu -->
          <v-list-item-group
            v-for="(sitem, i) in item.SubMenu"
            :key="i"
            color="primary"
            link
          >
            <v-list-item
              active-class="grey darken-3"
              link
              :to="sitem.MenuRoute"
              @click="toggleSubMenu(item.MenuName, sitem.MenuName)"
              class="ml-4"
            >
              <v-icon color="white" class="mx-2" small>{{
                sitem.MenuICon
              }}</v-icon>
              <v-list-item-title class="white--text">{{
                sitem.MenuName
              }}</v-list-item-title>
              <!-- Toggle icon for submenu -->
              <v-icon
                v-if="sitem.SubMenu && sitem.SubMenu.length"
                right
                color="white"
              >
                {{
                  openSubMenu === sitem.MenuName
                    ? "mdi-chevron-up"
                    : "mdi-chevron-down"
                }}
              </v-icon>
            </v-list-item>

            <!-- Nested Submenu -->
            <div v-if="openSubMenu === sitem.MenuName">
              <v-list-item-group
                v-for="(ssitem, j) in sitem.SubMenu"
                :key="j"
                color="primary"
                link
              >
                <v-list-item
                  active-class="grey darken-1"
                  link
                  :to="ssitem.MenuRoute"
                  @click="master_setting_type = ssitem.MenuName"
                  class="ml-8"
                >
                  <v-icon color="white" class="mx-2" small>{{
                    ssitem.MenuICon
                  }}</v-icon>
                  <v-list-item-title class="white--text">{{
                    ssitem.MenuName
                  }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </div>
          </v-list-item-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <div ref="home">
      <router-view
        :master_setting_type="master_setting_type"
        :dataObject="dataObject"
        :dataReceived="dataReceived"
        @receivedData="dataReceived = false"
      />
    </div>
  </div>
</template>
<script>
import * as htmlToImage from "html-to-image";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { UpdateUserDetails } from "@/graphql/mutations.js";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
import { GetAllMyOrganizationsNew } from "@/mixins/GetAllMyOrganizations.js";
import { fetchAndStoreOrgS3DataMethod } from "@/IndexedDB/IndexedDBSetter.js";
import { getOrgS3DataMethod } from "@/IndexedDB/IndexedDBGetter.js";
export default {
  mixins: [GetCurrentUser, GetAllMyOrganizationsNew],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    subMenus: 0,
    subMenus2: 0,
    subMenuVmodel: 0,
    Connection: null,
    user_name: "",
    noDataText: "",
    Organizations: "",
    switch_organization: "",
    organization_logo_url: "",
    master_setting_type: "Service Types",
    drawer: true,
    CloseValue: false,
    renderComp: true,
    overlay: false,
    dataReceived: false,
    dialogCreateIssue: false,
    StoreObj: {},
    dataObject: {},
    SnackBarComponent: {},
    RouterList: [],
    RouterListEnterprise: [],
    selectedFilesFromDrop: [],
    openSubMenu: null,
  }),
  watch: {
    "$route.name"() {
      this.overlay = false;
    },
    "$store.getters.get_current_user_details"(val) {
      this.user_name = val.user_name;
      this.organization_name = val.organization_name;
    },
    switch_organization() {
      this.updateUserDetailsMethod();
      this.GetAllMyOrganization.filter((item) => {
        this.Organizations = item.organization_name;
      });
    },
  },
  async created() {
    await this.GetCurrentUser();
    if (
      this.$store.getters.get_current_user_details.organization_details
        .enable_credits_recharge == false
    ) {
      for (let i = 0; i < this.RouterList.length; i++) {
        if (this.RouterList[i].MenuRoute == "Transactions") {
          this.RouterList.splice(i, 1);
        }
      }
    }
  },
  async mounted() {
    console.log("COMING_TO_LANDING_PAGE");
    // await this.GetCurrentUser();
    this.Router;
    this.updateNavigationValueMethod();
    this.GetAllMyOrganizationMethod();
    if (this.switch_organization == true) {
      this.GetAllMyOrganization.filter((item) => {
        this.Organizations = item.organization_name;
        this.updateUserDetailsMethod();
      });
    }
    // if (navigator.storage && navigator.storage.estimate) {
    //   const { usage, quota } = await navigator.storage.estimate();

    //   console.log(`Used: ${(usage / 1024 / 1024).toFixed(2)} MB`);
    //   console.log(`Quota: ${(quota / 1024 / 1024).toFixed(2)} MB`);
    //   console.log(
    //     `Remaining: ${((quota - usage) / 1024 / 1024).toFixed(2)} MB`
    //   );
    // } else {
    //   console.warn("StorageManager API not supported in this browser.");
    // }

    // Uncomment After this
    setTimeout(async () => {
      const indexedDbDataObj = await getOrgS3DataMethod();
      const orgDetails = this.$store.getters.get_current_user_details;
      const currentOrgId = orgDetails.organization_id;
      const customerVersionId = orgDetails.organization_details.version_id;
      console.log("VERSION_ID", orgDetails.organization_details.version_id);
      if (
        !indexedDbDataObj ||
        Object.keys(indexedDbDataObj).length === 0 ||
        indexedDbDataObj.current_org_id !== currentOrgId ||
        indexedDbDataObj.customer_data?.customer_version_id !==
          customerVersionId
      ) {
        await fetchAndStoreOrgS3DataMethod(orgDetails);
      } else {
        console.log("HERE_ELSE");
      }
    }, 2000);
  },
  methods: {
    toggleSubMenu(parentMenuName, subMenuName) {
      this.openSubMenu = this.openSubMenu === subMenuName ? null : subMenuName;
    },
    checkRouteItem(item) {
      if (
        (this.$route.name != item.MenuRoute && item.has_child_routes == true) ||
        item.has_child_routes == false
      ) {
        if (item.MenuRoute === "Tickets") {
          this.$router.push("/ActiveTickets");
        } else {
          this.$router.push(item.MenuRoute);
        }
        switch (item.MenuRoute) {
          case "ActiveTickets":
            this.master_setting_type = "Active Tickets";
            break;
        }
      }
    },
    Method() {
      this.overlay = true;
      this.$forceUpdate();
      this.selectedFilesFromDrop = [];
      var self = this;
      setTimeout(() => {
        htmlToImage.toBlob(this.$refs.home).then(function (blob) {
          blob.name = `ScreenShot${new Date().getTime()}.png`;
          self.selhtmlToImageectedFilesFromDrop.push(blob);
          let object = {
            selectedFilesFromDrop: self.selectedFilesFromDrop,
            routeName: self.$route.name,
          };
          self.$store.commit("SET_ISSUE_DETAILS", object);
          self.$store.commit("SET_PREVIOUS_ROUTE", self.$route.name);
          self.$router.push("ReportIssue");
        });
      }, 2000);
    },

    htmlToImageMethod() {
      this.overlay = true;
      this.$forceUpdate();
      this.selectedFilesFromDrop = [];
      var self = this;
      setTimeout(() => {
        htmlToImage.toBlob(this.$refs.home).then(function (blob) {
          blob.name = `ScreenShot${new Date().getTime()}.png`;
          self.selectedFilesFromDrop.push(blob);
          let object = {
            selectedFilesFromDrop: self.selectedFilesFromDrop,
            routeName: self.$route.name,
          };
          self.$store.commit("SET_ISSUE_DETAILS", object);
          self.$store.commit("SET_PREVIOUS_ROUTE", self.$route.name);
          self.$router.push("ReportIssue");
        });
      }, 2000);
    },
    updateNavigationValueMethod() {
      let previous_route = this.$store.getters.get_previous_route;
      if (previous_route && previous_route != "") {
        switch (previous_route) {
          case "Dashboard":
            this.selectedItem = 0;
            break;
          case "Attendance":
            this.selectedItem = 1;
            break;
          case "ComponentTransactionHistory":
            this.selectedItem = 2;
            break;
          case "TransactionLogs":
            this.selectedItem = 3;
            break;
          case "Logs":
            this.selectedItem = 4;
            break;
          case "Tickets":
            this.selectedItem = 5;
            break;
          case "RFTs":
            this.selectedItem = 6;
            break;
          case "ScheduledMaintainance":
            this.selectedItem = 7;
            break;
          case "Customers":
            this.selectedItem = 8;
            break;
          case "ServiceCatalog":
            this.selectedItem = 9;
            break;
          case "Territory":
            this.selectedItem = 10;
            break;
          case "ListComponents":
            this.selectedItem = 11;
            break;
          case "ListInventory":
            this.selectedItem = 12;
            break;
          case "ServiceCenter":
            this.selectedItem = 13;
            break;
          case "quotation":
            this.selectedItem = 14;
            break;
          case "Templates":
            this.selectedItem = 15;
            break;
          case "Contract":
            this.selectedItem = 16;
            break;
          case "Contract Templates":
            this.selectedItem = 17;
            break;
          case "Transactions":
            this.selectedItem = 18;
            break;
          case "Users":
            this.selectedItem = 19;
            break;
          case "ServiceRepresentatives":
            this.selectedItem = 20;
            break;
          case "Partner":
            this.selectedItem = 21;
            break;
          case "Dealers":
            this.selectedItem = 22;
            break;
          case "MasterSetting":
            this.selectedItem = 23;
            break;
        }
      }
      this.$forceUpdate();
    },
    async switchOrganization() {
      await this.GetCurrentUser();
      if (
        this.$store.getters.get_current_user_details.organization_details
          .enable_credits_recharge == false
      ) {
        for (let i = 0; i < this.RouterList.length; i++) {
          if (this.RouterList[i].MenuRoute == "Transactions") {
            this.RouterList.splice(i, 1);
          }
        }
      }
    },
    async updateUserDetailsMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(UpdateUserDetails, {
            input: {
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              is_switch_between_organization: "true",
              new_organization_id: this.switch_organization,
            },
          })
        );
        this.switchOrganization();
        var ResultObject = JSON.parse(result.data.UpdateUserDetails);
        if (ResultObject.status == "SUCCESS") {
          setTimeout(() => this.$router.push("/Dashboard"), 500);
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
            this.renderComp = true;
          });
        }
        this.overlay = false;
      } catch (error) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
        this.overlay = false;
        this.noDataText = error.errors[0].message;
      }
    },
    dialogCreateIssueEmit() {
      this.dialogCreateIssue = false;
      this.selectedFilesFromDrop = [];
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 10px;
}
</style>
