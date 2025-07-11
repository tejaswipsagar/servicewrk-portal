<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <DeleteInvalidUser
      :StoreObj="StoreObj"
      :dialogDeleteInvalidUser="dialogDeleteInvalidUser"
      @clicked="dialogInvalidUserEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Invalid Users</div>
        <v-spacer />
        <v-select
          dense
          outlined
          class="mt-9 FontSize field_label_size field_height WidthVariation1"
          label="User Type"
          v-model="user_type"
          :items="user_typeItems"
          item-text="text"
          item-value="value"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-9 ml-2 FontSize field_label_size field_height WidthVariation1"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          fixed-header
          :height="TableHeight"
          :headers="headers"
          :items="GetAllInvalidUsersList"
          :no-data-text="noDataText"
          :loading="loading"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize" v-if="item.user_name != undefined">
              {{ item.user_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.user_email_id != undefined">
              {{ item.user_email_id }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.designation_name != undefined">
              {{ item.designation_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.reporter_email_id`]="{ item }">
            <div v-if="item.reporter_email_id != undefined" class="FontSize">
              {{ item.reporter_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.invalid_reason`]="{ item }">
            <div class="FontSize red--text">
              {{ item.invalid_reason }}
            </div>
            <div class="FontSize" v-if="item.user_type != undefined">
              {{ item.user_type }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click.stop="deleteInvalidUser(item)"
                  color="red"
                  small
                  v-on="on"
                  v-bind="attrs"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllInvalidUsers } from "@/mixins/Users/GetAllInvalidUsers.js";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllDesignations } from "@/mixins/MastersSetting/GetAllDesignations.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import AddUsersDialog from "@/components/Users/Dialogs/EnterpriseUsers/AddUsersDialog.vue";
import DeleteInvalidUser from "@/components/Users/Dialogs/EnterpriseUsers/DeleteInvalidUser.vue";
export default {
  mixins: [
    GenerateS3URL,
    GetCurrentUser,
    GetAllInvalidUsers,
    GetAllDesignations,
  ],
  components: {
    Overlay,
    Snackbar,
    AddUsersDialog,
    DeleteInvalidUser,
  },
  data: () => ({
    search: "",
    noDataText: "",
    user_type: "ALL",
    TableHeight: 0,
    overlay: false,
    loading: false,
    renderComp: true,
    dialogDeleteInvalidUser: false,
    StoreObj: {},
    SnackBarComponent: {},
    GetAllInvalidUsersList: [],
    user_typeItems: [
      { text: "ALL", value: "ALL" },
      { text: "SERVICE PARTNER", value: "SERVICE PARTNER" },
      { text: "PARTNER REPRESENTATIVE", value: "PARTNER REPRESENTATIVE" },
      {
        text: "PARTNER SERVICE CO-ORDINATOR",
        value: "PARTNER SERVICE CO-ORDINATOR",
      },
      { text: "DEALER OWNER", value: "DEALER OWNER" },
      { text: "DEALER REPRESENTATIVE", value: "DEALER REPRESENTATIVE" },
      {
        text: "DEALER SERVICE CO-ORDINATOR",
        value: "DEALER SERVICE CO-ORDINATOR",
      },
    ],
    headers: [
      { text: "User Name", value: "user_name" },
      { text: "Reporter Email ID", value: "reporter_email_id" },
      { text: "Reason", value: "invalid_reason" },
      { text: "Actions", value: "Actions", width: "13%" },
    ],
  }),
  watch: {
    user_type(val) {
      this.GetAllInvalidUsersMethod(val == "ALL" ? undefined : val);
    },
  },
  mounted() {
    this.GetAccessModuleMethod();
    this.TableHeight = window.innerHeight - 200;
    this.GetAllInvalidUsersMethod(
      this.user_type == "ALL" ? undefined : this.user_type
    );
  },
  methods: {
    deleteInvalidUser(item) {
      this.StoreObj = item;
      this.dialogDeleteInvalidUser = true;
    },
    dialogInvalidUserEmit(Toggle) {
      this.dialogDeleteInvalidUser = false;
      if (Toggle == 2) {
        this.GetAllInvalidUsersMethod(
          this.user_type == "ALL" ? undefined : this.user_type
        );
      }
    },
    GetAccessModuleMethod() {
      console.log(
        "Module Details",
        this.$store.getters.get_access_module_details
      );
      let ModuleDetails = this.$store.getters.get_access_module_details;
      if (
        this.$store.getters.get_user_type != "ADMIN" &&
        this.$store.getters.get_user_type != "OWNER" &&
        this.$store.getters.get_user_type != "DEALER_OWNER" &&
        this.$store.getters.get_current_user_details.organization_details
          .is_access_control_enable == true
      ) {
        ModuleDetails.map((item) => {
          if (item.module_name == "Users") {
            if (item.sub_modules[3].module_name == "Enterprise Users") {
              item.sub_modules[3].module_rights.map((moduleRights) => {
                if (moduleRights.CREATE == true) {
                  this.showCreateButton = true;
                }
                if (moduleRights.EDIT == true) {
                  this.showEditButton = true;
                }
                if (moduleRights.DELETE == true) {
                  this.showActivateDeactivateButton = true;
                }
              });
            }
          }
        });
      } else {
        this.showCreateButton = true;
        this.showEditButton = true;
        this.showActivateDeactivateButton = true;
      }
    },
  },
};
</script>
