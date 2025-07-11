<template>
  <div>
    <Overlay :overlay="overlay" />
    <CreatePartnerUserDialog
      :GetAllPartnerAndPartnerUserList="GetAllPartnerAndPartnerUserList"
      :StoreObj="StoreObj"
      :CreateServicePartnerUserDialog="CreateServicePartnerUserDialog"
      @clicked="ServicePartnerUserEmit"
    />
    <DeleateServicePartner
      :DeletePartnerdialog="DeletePartnerdialog"
      :StoreObj="StoreObj"
      @clicked="dialogDeletePartnerEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Service Co-Ordinators</div>
        <v-spacer />
        <v-select
          dense
          outlined
          class="mt-9 FontSize field_label_size field_height maxWidthSmall ml-2"
          label="User Status"
          v-model="user_status"
          :items="user_statusItems"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-9 ml-2 FontSize field_label_size field_height maxWidthSmall"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click.stop="CreateUpdateServiceCoOrdinatorMethod()"
              small
              v-on="on"
              v-bind="attrs"
              class="primary mt-3 ml-2 white--text"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add Service Co-Ordinator</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          :headers="Headers"
          :items="GetAllPartnerAndPartnerUserList"
          :no-data-text="noDataText"
          :height="tableHeight"
          fixed-header
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize">{{ item.user_name }}</div>
          </template>
          <template v-slot:[`item.user_email_id`]="{ item }">
            <div class="FontSize">{{ item.user_email_id }}</div>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <span class="FontSize">{{
              new Date(item.user_created_on * 1000).toLocaleString("en-GB")
            }}</span>
          </template>
          <template v-slot:[`item.reporter_email_id`]="{ item }">
            <div class="FontSize" v-if="item.reporter_email_id != undefined">
              {{ item.reporter_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="item.user_status == 'ACTIVE'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="checkItem(item, 'EDIT'), (StoreObj.action2 = 'CREATEPARTNERUSERFROMPARTNERPORTAL')"
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span>Update {{ item.user_name }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                >
                  <v-icon>
                    {{
                      item.user_status == "ACTIVE"
                        ? "mdi-account-cancel"
                        : "mdi-account-plus"
                    }}
                  </v-icon>
                </v-btn>
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
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import DeleateServicePartner from "@/components/Users/Dialogs/ServicePartner/DeleateServicePartner.vue";
import CreatePartnerUserDialog from "@/components/Users/Dialogs/ServicePartner/CreatePartnerUserDialog.vue";
export default {
  components: {
    Overlay,
    DeleateServicePartner,
    CreatePartnerUserDialog,
  },
  mixins: [GetAllPartnerUser],
  data: () => ({
    overlay: false,
    DeletePartnerdialog: false,
    CreateServicePartnerUserDialog: false,
    tableHeight: 0,
    search: "",
    noDataText: "",
    user_status: "ACTIVE",
    GetAllPartnerAndPartnerUserList: [],
    user_statusItems: ["ACTIVE", "INACTIVE"],
    Headers: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Email-Id", value: "user_email_id" },
      { text: "Created On", value: "user_created_on" },
      { text: "Reporting To", value: "reporter_email_id" },
      { text: "Actions", value: "Actions" },
    ],
    StoreObj: {},
  }),
  watch: {
    user_status(val) {
      this.GetAllPartnerUserMethod(
        "PARTNER_AGENT",
        val,
        this.$store.getters.get_current_user_details.partner_id
      );
    },
  },
  mounted() {
    this.tableHeight = window.innerHeight - 200;
    this.GetAllPartnerUserMethod(
      "PARTNER_AGENT",
      this.user_status,
      this.$store.getters.get_current_user_details.partner_id
    );
  },
  methods: {
    CreateUpdateServiceCoOrdinatorMethod() {
      this.StoreObj.action = "CREATEREP";
      this.StoreObj.action2 = 'CREATEPARTNERUSERFROMPARTNERPORTAL';
      this.CreateServicePartnerUserDialog = true;
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.CreateServicePartnerUserDialog = true;
      } else if (action == "ACTION") {
        this.DeletePartnerdialog = true;
      }
    },
    dialogDeletePartnerEmit(Toggle) {
      this.DeletePartnerdialog = false;
      if (Toggle == 2) {
        this.DeletePartnerdialog = false;
        this.GetAllPartnerUserMethod(
          "PARTNER_AGENT",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id
        );
      }
    },
    ServicePartnerUserEmit(Toggle) {
      this.CreateServicePartnerUserDialog = false;
      if (Toggle == 2) {
        this.GetAllPartnerUserMethod(
          "PARTNER_AGENT",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id
        );
      }
    },
  },
};
</script>
