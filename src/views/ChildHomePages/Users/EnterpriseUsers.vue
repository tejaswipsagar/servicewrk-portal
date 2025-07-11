<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <ActivateInactivateUserDialog
      :dialogActivateInactivateUser="dialogActivateInactivateUser"
      :StoreObj="StoreObj"
      @clicked="dialogActivateInactivateUserEmit"
    />
    <AddUsersDialog
      :GetAllTerritoriesList="GetAllTerritoriesList"
      :GetAllDesignationsList="GetAllDesignationsList"
      :GetAllUsersList="GetAllUsersList"
      :dialogAddUser="dialogAddUser"
      :StoreObj="StoreObj"
      @clicked="dialogAddUserEmit"
    />
    <ChangeOwnershipDialog
      :dialogChangeOwnership="dialogChangeOwnership"
      :StoreObj="StoreObj"
      @clicked="dialogChangeOwnershipEmit"
    />
    <v-card elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="5" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Enterprise Users</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="7" xs="12">
          <v-toolbar dense class="elevation-0">
            <v-select
              dense
              outlined
              item-text="text"
              label="User Type"
              item-value="value"
              v-model="user_type"
              :items="user_typeItems"
              class="mt-9 FontSize maxWidthXSmall"
            ></v-select>
            <v-select
              dense
              outlined
              label="User Status"
              v-model="user_status"
              :items="user_statusItems"
              class="mt-9 FontSize maxWidthXSmall ml-2"
            ></v-select>
            <v-text-field
              dense
              outlined
              label="Search"
              v-model="search"
              @input="searchMethod()"
              prepend-inner-icon="mdi-magnify"
              class="mt-9 ml-2 maxWidthSmall FontSize"
            ></v-text-field>
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  <v-btn
                    small
                    @click="checkExcelPresent()"
                    class="primary white--text ml-2 mt-3"
                    :disabled="
                      $store.getters.get_current_user_details
                        .organization_details.approved_bulk_upload ==
                        undefined ||
                      $store.getters.get_current_user_details
                        .organization_details.approved_bulk_upload == [] ||
                      !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                        'USER_BULK_UPLOAD'
                      )
                    "
                  >
                    <input
                      type="file"
                      id="uploadExcel"
                      v-if="renderCompNew"
                      @change="handleClick"
                      ref="excel-upload-input"
                      class="excel-upload-input"
                      accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <v-icon>mdi-cloud-upload</v-icon>
                  </v-btn>
                </span>
              </template>
              <span
                v-if="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'USER_BULK_UPLOAD'
                  )
                "
                >You're not eligible to upload, Please contact WRKTOP
                Team..!</span
              >
              <span v-else>Upload Users</span>
            </v-tooltip>
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs">
                  <v-btn
                    small
                    @click="downloadMethod()"
                    class="primary white--text ml-2 mt-3 text-capitalize"
                    :disabled="
                      $store.getters.get_current_user_details
                        .organization_details.approved_bulk_upload ==
                        undefined ||
                      $store.getters.get_current_user_details
                        .organization_details.approved_bulk_upload == [] ||
                      !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                        'USER_BULK_UPLOAD'
                      )
                    "
                  >
                    <v-icon>mdi-cloud-download</v-icon>
                  </v-btn>
                </span>
              </template>
              <span
                v-if="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'USER_BULK_UPLOAD'
                  )
                "
                >You're not eligible to upload, Please contact WRKTOP
                Team..!</span
              >
              <span v-else>Download Excel Template</span>
            </v-tooltip>
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-on="on"
                  v-bind="attrs"
                  v-show="showCreateButton"
                  class="mt-3 primary white--text ml-2"
                  @click="(dialogAddUser = true), (StoreObj.action = 'CREATE')"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
              <span class="white--text">Add User</span>
            </v-tooltip>
            <!-- <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-on="on"
                  v-bind="attrs"
                  color="primary"
                  @click="exporttoexcel"
                  class="primary white--text ml-2 mt-3"
                >
                  <v-icon>mdi-file-excel-outline</v-icon>
                </v-btn>
              </template>
              <span class="white--text">Download Excel</span>
            </v-tooltip> -->
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :headers="headers"
          :loading="loading"
          :items-per-page="100"
          :height="TableHeight"
          :sort-by.sync="sortBy"
          :items="filteredItems"
          :no-data-text="noDataText"
          :sort-desc.sync="sortDesc"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize" v-if="item.user_name != undefined">
              {{ item.user_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.designation_name != undefined">
              {{ item.designation_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_email_id`]="{ item }">
            <div class="FontSize" v-if="item.user_email_id != undefined">
              {{ item.user_email_id }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.user_phone_number != undefined">
              {{ item.user_phone_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_address`]="{ item }">
            <div class="FontSize" v-if="item.user_address != undefined">
              {{ item.user_address }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <div class="FontSize" v-if="item.user_created_on != undefined">
              {{
                new Date(item.user_created_on * 1000).toLocaleDateString(
                  "en-GB"
                )
              }}
            </div>
            <div class="FontSize" v-if="item.user_type != undefined">
              <div v-if="item.user_type == 'AGENT'">Service Co-Ordinator</div>
              <div v-else>{{ item.user_type.replaceAll("_", " ") }}</div>
            </div>
          </template>
          <template v-slot:[`item.representatives_count`]="{ item }">
            <div class="FontSize">
              {{
                item.representatives_count == undefined || null
                  ? "0"
                  : item.representatives_count
              }}
            </div>
            <div class="FontSize" v-if="item.app_version">
              App Ver : {{ item.app_version }}
            </div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-menu right bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense nav>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-if="item.user_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'EDIT')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pencil-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Edit {{ item.user_name }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      item.user_id !=
                      $store.getters.get_current_user_details.user_id
                    "
                    @click="checkItem(item, 'ACTION')"
                  >
                    <v-list-item-icon>
                      <v-icon
                        small
                        :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                      >
                        {{
                          item.user_status == "ACTIVE"
                            ? "mdi-account-cancel"
                            : "mdi-account-plus"
                        }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        item.user_status == "ACTIVE" ? "Deactivate" : "Activate"
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      $store.getters.get_current_user_details.user_type ==
                        'OWNER' && item.user_status == 'ACTIVE'
                    "
                    @click="checkItem(item, 'OWNERSHIP')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary"> mdi-account-star </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Transfer Ownership</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetAllDesignations } from "@/mixins/MastersSetting/GetAllDesignations.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import AddUsersDialog from "@/components/Users/Dialogs/EnterpriseUsers/AddUsersDialog.vue";
import ChangeOwnershipDialog from "@/components/Users/Dialogs/EnterpriseUsers/ChangeOwnershipDialog.vue";
import ActivateInactivateUserDialog from "@/components/Users/Dialogs/EnterpriseUsers/ActivateInactivateUserDialog.vue";
export default {
  mixins: [
    GetAllUsers,
    GenerateS3URL,
    GetCurrentUser,
    GetAllTerritories,
    GetAllDesignations,
  ],
  components: {
    Overlay,
    Snackbar,
    AddUsersDialog,
    ChangeOwnershipDialog,
    ActivateInactivateUserDialog,
  },
  data: () => ({
    search: "",
    sortBy: "logged_on",
    user_status: "ACTIVE",
    noDataText: "No Data Available..!",
    TableHeight: 0,
    sortDesc: true,
    overlay: false,
    loading: false,
    user_type: null,
    renderComp: true,
    renderCompNew: true,
    dialogAddUser: false,
    showEditButton: false,
    showCreateButton: false,
    dialogChangeOwnership: false,
    dialogActivateInactivateUser: false,
    showActivateDeactivateButton: false,
    StoreObj: {},
    SnackBarComponent: {},
    LogsList: [],
    filteredItems: [],
    GetAllUsersList: [],
    GetAllTerritoriesList: [],
    GetAllDesignationsList: [],
    user_statusItems: ["ACTIVE", "INACTIVE"],
    user_typeItems: [
      { text: "ALL", value: null },
      { text: "OWNER", value: "OWNER" },
      { text: "ADMIN", value: "ADMIN" },
      { text: "MANAGER", value: "MANAGER" },
      { text: "Store Manager", value: "STORE_MANAGER" },
      { text: "Service Co-Ordinator", value: "AGENT" },
      { text: "MANAGEMENT", value: "MANAGEMENT" },
      { text: "NSM", value: "NSM" },
      { text: "RSM", value: "RSM" },
    ],
    headers: [
      { text: "User Name", value: "user_name", width: "15%" },
      { text: "Email ID", value: "user_email_id", width: "15%" },
      { text: "Address", value: "user_address", width: "15%" },
      { text: "Created On", value: "user_created_on", width: "12%" },
      { text: "Rep Count", value: "representatives_count", width: "10%" },
      { text: "Actions", value: "Actions", width: "12%" },
    ],
    columnName: [
      { label: "User Name", value: "user_name" },
      { label: "User Type", value: "user_type" },
      { label: "Designation", value: "designation_name" },
      { label: "Email ID", value: "user_email_id" },
      { label: "Phone Number", value: "user_phone_number" },
      { label: "Address", value: "user_address" },
      { label: "Created On", value: "updated_user_created_on" },
      { label: "Qualification", value: "user_qualification" },
      { label: "Experience", value: "user_experience" },
      { label: "Rep Count", value: "representatives_count" },
    ],
  }),
  watch: {
    user_status(val) {
      this.filteredItems = [];
      this.search = "";
      this.GetAllUsersMethod(this.user_type, val);
    },
    user_type() {
      this.filteredItems = [];
      this.GetAllUsersMethod(this.user_type, this.user_status);
    },
  },
  mounted() {
    this.GetAccessModuleMethod();
    this.user_status = "ACTIVE";
    this.GetAllTerritoriesMethod(
      "ACTIVE",
      undefined,
      undefined,
      "TERRITORY",
      undefined
    );
    this.GetAllDesignationsMethod("ACTIVE");
    this.TableHeight = window.innerHeight - 200;
    this.GetAllUsersMethod(undefined, this.user_status);
  },
  methods: {
    searchMethod() {
      const lowerSearchedText = this.search.toLowerCase();
      this.filteredItems = this.GetAllUsersList.filter((item) => {
        const itemString = JSON.stringify(item).toLowerCase();
        return itemString.includes(lowerSearchedText);
      });
    },
    exporttoexcel() {
      this.filteredItems.map((item) => {
        if (item.user_created_on) {
          item.updated_user_created_on = new Date(
            item.user_created_on * 1000
          ).toLocaleString("en-GB");
        }
      });
      let data = [
        {
          sheet: "Enterprise Users",
          columns: this.columnName,
          content: this.filteredItems,
        },
      ];
      let settings = {
        fileName: "Enterprise Users",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    refreshComponentMethod() {
      this.renderCompNew = false;
      this.$nextTick(() => {
        this.renderCompNew = true;
      });
      this.renderComp = false;
      this.$nextTick(() => {
        this.renderComp = true;
      });
    },
    async handleClick(e) {
      console.log("e", e);
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `USER_BULK_UPLOAD/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText:
              "Users Uploaded Successfully, Please get back in some time !!",
          };
          this.renderComp = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Something Went Wrong!! Please Try Again!!",
          };
          this.renderComp = true;
        });
      }
      this.overlay = false;
    },
    checkExcelPresent() {
      document.getElementById("uploadExcel").click();
    },
    downloadMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Name *",
        "Email ID *",
        "Country Code",
        "Phone Number",
        "Address",
        "Latitude",
        "Longitude",
        "Pincode",
        "User Type *",
        "Reporter Mail ID",
        "Designation",
        "Qualification",
        "Experience",
        "Territory Name",
        "Enable Component Request Notification (Yes/No)",
        "Enable Component Transaction (Yes/No)",
      ];
      async function generateExcel() {
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Bulk Upload Deal Fields");
          sheet.addRow(fieldNamesArray);
          for (let num = 2; num < 5000; num++) {
            for (let i = 0; i < sheet._columns.length; i++) {
              sheet.getColumn(sheet._columns[i].number).width = 30;
            }
          }
          const buffer = await workbook.xlsx.writeBuffer();
          return buffer;
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
      setTimeout(() => {
        generateExcel()
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `Enterprise-Users-Bulk-Upload-${new Date().toLocaleString(
              "en-GB"
            )}.xlsx`;
            downloadLink.click();
          })
          .catch((err) => {
            console.error("Error:", err);
          });
        this.overlay = false;
      }, 1000);
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
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.dialogAddUser = true;
      } else if (action == "OWNERSHIP") {
        this.dialogChangeOwnership = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateUser = true;
      }
    },
    dialogAddUserEmit(Toggle) {
      this.dialogAddUser = false;
      if (Toggle == 2) {
        this.GetAllUsersMethod(this.user_type, this.user_status);
      }
    },
    dialogChangeOwnershipEmit(Toggle) {
      this.dialogChangeOwnership = false;
      if (Toggle == 2) {
        this.GetCurrentUser();
        this.GetAllUsersMethod(this.user_type, this.user_status);
      }
    },
    dialogActivateInactivateUserEmit(Toggle) {
      this.dialogActivateInactivateUser = false;
      if (Toggle == 2) {
        this.GetAllUsersMethod(this.user_type, this.user_status);
      }
    },
  },
};
</script>
