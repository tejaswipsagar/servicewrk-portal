<template>
  <div>
    <Overlay :overlay="overlay" />
    <DealerUserDialog
      :StoreObj="StoreObj"
      :CreateDealerUserDialog="CreateDealerUserDialog"
      @clicked="CreateDealerUserDialogEmit"
    />
    <ActivateDeactiveDealers
      :StoreObj="StoreObj"
      :dialogActivateInactivateDealers="dialogActivateInactivateDealers"
      @clicked="dialogActivateInactivateUserEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Dealer Service Co-Ordinators</div>
        <v-spacer />
        <v-select
          dense
          outlined
          label="User Status"
          v-model="user_status"
          :items="user_statusItems"
          class="mt-9 FontSize maxWidthSmall ml-2"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="mt-9 ml-2 FontSize maxWidthSmall"
        ></v-text-field>
        <v-tooltip
          color="primary"
          bottom
          v-if="
            $store.getters.get_current_user_details.enable_user_creation == true
          "
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="
                (CreateDealerUserDialog = true),
                  (StoreObj.action = 'CREATE_AGENT_FROM_DEALER_PORTAL')
              "
              small
              v-on="on"
              v-bind="attrs"
              class="primary ml-2 mt-3 white--text"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add Service Co-Ordinator</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :height="tableHeight"
          :items-per-page="100"
          :items="GetDealersList"
          :no-data-text="noDataText"
          :headers="PartnerAgentAndRepresentativeHeaders"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize">{{ item.user_name }}</div>
          </template>
          <template v-slot:[`item.user_email_id`]="{ item }">
            <div class="FontSize">{{ item.user_email_id }}</div>
          </template>
          <template v-slot:[`item.user_type`]="{ item }">
            <div class="FontSize">{{ item.user_type.replace("_", " ") }}</div>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <span class="FontSize">{{
              new Date(item.user_created_on * 1000).toLocaleString("en-GB")
            }}</span>
          </template>
          <template v-slot:[`item.ActionsA`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="item.user_status == 'ACTIVE'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  @click.stop="checkItem(item, 'EDIT_AGENT_FROM_DEALER_PORTAL')"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span class="white--text">Update {{ item.user_name }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  v-if="
                    item.user_id !=
                    $store.getters.get_current_user_details.user_id
                  "
                  icon
                  :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon>{{
                    item.user_status == "ACTIVE"
                      ? "mdi-account-cancel"
                      : "mdi-account-plus"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="
                  item.user_status == 'ACTIVE'
                    ? `Deactivate ${item.user_name}`
                    : `Activate ${item.user_name}`
                "
              ></span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import DealerUserDialog from "@/components/Users/Dialogs/Dealer/DealerUserDialog.vue";
import ActivateDeactiveDealers from "@/components/Users/Dialogs/Dealer/ActivateDeactiveDealers.vue";
export default {
  components: {
    Overlay,
    DealerUserDialog,
    ActivateDeactiveDealers,
  },
  mixins: [GetAllDealers],
  data: () => ({
    search: "",
    noDataText: "",
    user_status: "ACTIVE",
    overlay: false,
    CreateDealerUserDialog: false,
    dialogActivateInactivateDealers: false,
    tableHeight: 0,
    GetDealersList: [],
    user_statusItems: ["ACTIVE", "INACTIVE"],
    PartnerAgentAndRepresentativeHeaders: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Email-Id", value: "user_email_id" },
      { text: "User Type", value: "user_type" },
      { text: "Created On", value: "user_created_on" },
      { text: "Reporting To", value: "reporter_email_id" },
      { text: "Actions", value: "ActionsA" },
    ],
    StoreObj: {},
    StoreObjUser: {},
  }),
  watch: {
    user_status(val) {
      this.GetDealersMethod(
        "DEALER_AGENT",
        val,
        this.$store.getters.get_current_user_details.partner_id,
        undefined
      );
    },
  },
  mounted() {
    this.tableHeight = window.innerHeight - 200;
    this.GetDealersMethod(
      "DEALER_AGENT",
      this.user_status,
      this.$store.getters.get_current_user_details.partner_id,
      undefined
    );
  },
  methods: {
    dialogActivateInactivateUserEmit(Toggle) {
      this.dialogActivateInactivateDealers = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          "DEALER_AGENT",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id,
          undefined
        );
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT_AGENT_FROM_DEALER_PORTAL") {
        this.StoreObj.user_type = "DEALER_AGENT";
        this.CreateDealerUserDialog = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateDealers = true;
      }
    },
    CreateDealerUserDialogEmit(Toggle) {
      this.CreateDealerUserDialog = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          "DEALER_AGENT",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id,
          undefined
        );
      }
    },
  },
};
</script>
