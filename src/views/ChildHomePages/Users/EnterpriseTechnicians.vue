<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <TransferRep
      :StoreObj="StoreObj"
      :dialogTransferRep="dialogTransferRep"
      @clicked="dialogTransferRepEmit"
    />
    <CreateServiceReps
      :CreateServiceRepsDialog="CreateServiceRepsDialog"
      :StoreObj="StoreObj"
      @clicked="CreateServiceRepsDialogEmit"
    />
    <ActivateInactivateRepsDialog
      :dialogActivateInactivateReps="dialogActivateInactivateReps"
      :StoreObj="StoreObj"
      @clicked="dialogActivateInactivateRepsEmit"
    />
    <ProductFleetsDialog
      :dialogProductFleets="dialogProductFleets"
      :StoreObj="StoreObj"
      @clicked="dialogProductFleetsEmit"
    />
    <ComponentsDialog
      :dialogComponentsAvailable="dialogComponentsAvailable"
      :StoreObj="StoreObj"
      @clicked="dialogComponentsAvailableEmit"
    />
    <DeleteRepsDialog
      :dialogDeleteReps="dialogDeleteReps"
      :StoreObj="StoreObj"
      @clicked="dialogDeleteRepsEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Enterprise Technicians</div>
        <v-spacer />
        <v-select
          dense
          outlined
          label="User Status"
          v-model="user_status"
          :items="user_statusItems"
          class="mt-7 FontSize maxWidthXSmall mr-2"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          @input="searchMethod()"
          prepend-inner-icon="mdi-magnify"
          class="mt-7 FontSize WidthVariation1"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              <v-btn
                class="primary white-text ml-1"
                small
                @click="checkExcelPresent()"
                :disabled="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'ENTERPRISE_REPRESENTATIVE_BULK_UPLOAD'
                  )
                "
              >
                <input
                  v-if="renderCompNew"
                  id="uploadExcel"
                  ref="excel-upload-input"
                  accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  class="excel-upload-input"
                  type="file"
                  @change="handleClick"
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
                'ENTERPRISE_REPRESENTATIVE_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Upload Bulk Technicians</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              <v-btn
                class="primary white--text ml-1 text-capitalize"
                small
                @click="downloadMethod()"
                :disabled="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'ENTERPRISE_REPRESENTATIVE_BULK_UPLOAD'
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
                'ENTERPRISE_REPRESENTATIVE_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Download Excel Template</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              @click="
                (CreateServiceRepsDialog = true), (StoreObj.action = 'CREATE')
              "
              v-on="on"
              v-bind="attrs"
              v-show="showCreateButton"
              class="primary white--text ml-1"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add Technician</span>
        </v-tooltip>
        <!-- <v-tooltip color="primary" bottom v-if="user_status != 'INVALID'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="exporttoexcel"
              class="primary white--text ml-1"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip> -->
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :headers="headers"
          fixed-header
          :loading="loading"
          :height="TableHeight"
          :items="
            user_status != 'INVALID' ? filteredItems : GetAllInvalidUsersList
          "
          :no-data-text="noDataTextReps"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize">{{ item.user_name }}</div>
            <div class="FontSize">{{ item.user_full_number }}</div>
            <div v-if="user_status == 'INVALID'">
              <div v-if="item.invalid_reason" class="red--text FontSize">
                {{ item.invalid_reason }}
              </div>
            </div>
          </template>
          <template v-slot:[`item.user_qualification`]="{ item }">
            <div class="FontSize" v-if="item.user_qualification">
              {{ item.user_qualification }}
            </div>
            <div v-else>-</div>
            <div class="FontSize font-weight-bold">
              Exp :
              <span
                class="FontSize font-weight-regular"
                v-if="item.user_experience"
                >{{ item.user_experience }}</span
              >
              <span v-else class="font-weight-regular">N/A</span>
            </div>
          </template>
          <template v-slot:[`item.app_version`]="{ item }">
            <v-icon v-if="item.mobile_type == 'IOS'" size="20px"
              >mdi-apple</v-icon
            >
            <v-icon
              v-else-if="item.mobile_type == 'ANDROID'"
              size="20px"
              color="green"
              >mdi-android</v-icon
            >
            <span v-else color="black" class="ml-2 mr-2"> - </span>
            <span class="ml-3 caption">{{ item.app_version }}</span>
            <div class="FontSize font-weight-bold">
              Emp ID :
              <span v-if="item.employee_id" class="font-weight-regular">{{
                item.employee_id
              }}</span>
              <span v-else class="font-weight-regular">N/A</span>
            </div>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.user_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
            <div class="FontSize font-weight-bold">
              <div>
                PAN :
                <span v-if="item.user_pan_no" class="font-weight-regular">{{
                  item.user_pan_no
                }}</span>
                <span v-else class="font-weight-regular">N/A</span>
              </div>
            </div>
          </template>
          <template v-slot:[`item.success_percentage`]="{ item }">
            <div class="FontSize">{{ item.success_percentage }}</div>
          </template>
          <template v-slot:[`item.reporter_email_id`]="{ item }">
            <div class="FontSize" v-if="item.reporter_email_id != undefined">
              {{ item.reporter_email_id }}
            </div>
            <div v-else>-</div>
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
                      <v-list-item-title>
                        Edit {{ item.user_name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'ACTION')"
                    v-if="
                      item.user_id !=
                        $store.getters.get_current_user_details.user_id &&
                      item.user_status != 'INVITED' &&
                      $store.getters.get_user_type != 'AGENT' &&
                      $store.getters.get_user_type != 'MANAGER'
                    "
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
                        }}</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                          item.user_status == "ACTIVE"
                            ? `Deactivate ${item.user_name}`
                            : `Activate ${item.user_name}`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.user_status == 'INVITED'"
                    @click="checkItem(item, 'DELETE')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="red">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title> Delete Technician </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.user_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'VIEW_PRODUCT_FLEETS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pandora</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Available Product Fleets</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.user_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'VIEW_COMPONENTS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-lumx</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Available Components</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.user_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'TRANSFER')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-transfer-right</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Transfer {{ item.user_name }}</v-list-item-title
                      >
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
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllInvalidUsers } from "@/mixins/Users/GetAllInvalidUsers.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import TransferRep from "@/components/Users/Dialogs/ServicePartner/TransferRep.vue";
import DeleteRepsDialog from "@/components/Users/Dialogs/EnterpriseTechnicians/DeleteRepsDialog.vue";
import ComponentsDialog from "@/components/Users/Dialogs/EnterpriseTechnicians/ComponentsDialog.vue";
import CreateServiceReps from "@/components/Users/Dialogs/EnterpriseTechnicians/CreateServiceReps.vue";
import ProductFleetsDialog from "@/components/Users/Dialogs/EnterpriseTechnicians/ProductFleetsDialog.vue";
import ActivateInactivateRepsDialog from "@/components/Users/Dialogs/EnterpriseTechnicians/ActivateInactivateRepsDialog.vue";
export default {
  mixins: [GetAllInvalidUsers, GetAllServiceRepresentative, GenerateS3URL],
  components: {
    Overlay,
    Snackbar,
    TransferRep,
    ComponentsDialog,
    DeleteRepsDialog,
    CreateServiceReps,
    ProductFleetsDialog,
    ActivateInactivateRepsDialog,
  },
  data: () => ({
    search: "",
    user_status: "ACTIVE",
    noDataTextReps: "No Data Available..!",
    TableHeight: 0,
    loading: false,
    overlay: false,
    renderComp: true,
    renderCompNew: true,
    showEditButton: false,
    showCreateButton: false,
    dialogDeleteReps: false,
    dialogTransferRep: false,
    dialogProductFleets: false,
    CreateServiceRepsDialog: false,
    dialogComponentsAvailable: false,
    dialogActivateInactivateReps: false,
    showActivateDeactivateButton: false,
    StoreObj: {},
    SnackBarComponent: {},
    filteredItems: [],
    GetAllInvalidUsersList: [],
    GetAllServiceRepresentativeList: [],
    user_statusItems: ["ACTIVE", "INACTIVE", "INVITED", "INVALID"],
    headers: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Qualification", value: "user_qualification" },
      { text: "Device/App Version", value: "app_version" },
      { text: "Created On", value: "user_created_on" },
      { text: "Reporting To", value: "reporter_email_id" },
      { text: "Actions", value: "Actions" },
    ],
    columnName: [
      { label: "Rep Name", value: "user_name" },
      { label: "Rep ID", value: "employee_id" },
      { label: "Contact Number", value: "user_full_number" },
      { label: "Qualification", value: "user_qualification" },
      { label: "Experience", value: "user_experience" },
      { label: "Address", value: "user_address" },
      { label: "Pincode", value: "user_pincode" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Created on", value: "updated_user_created_on" },
      { label: "App Version", value: "app_version" },
      { label: "Reporting To", value: "reporter_email_id" },
    ],
  }),
  watch: {
    user_status(val) {
      if (val != "INVALID") {
        this.searach = "";
        this.filteredItems = [];
        this.GetAllServiceRepresentativeMethod(val);
      } else if (val == "INVALID") {
        this.search = "";
        this.GetAllInvalidUsersMethod(undefined);
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAccessModuleMethod();
    this.GetAllServiceRepresentativeMethod(this.user_status);
  },
  methods: {
    dialogTransferRepEmit(Toggle) {
      this.dialogTransferRep = false;
      if (Toggle == 2) {
        this.GetAllServiceRepresentativeMethod(this.user_status);
      }
    },
    searchMethod() {
      const lowerSearchedText = this.search.toLowerCase();
      this.filteredItems = this.GetAllServiceRepresentativeList.filter(
        (item) => {
          const itemString = JSON.stringify(item).toLowerCase();
          return itemString.includes(lowerSearchedText);
        }
      );
    },
    checkExcelPresent() {
      document.getElementById("uploadExcel").click();
    },
    exporttoexcel() {
      this.GetAllServiceRepresentativeList.map((item) => {
        if (item.user_created_on) {
          item.updated_user_created_on = new Date(
            item.user_created_on * 1000
          ).toLocaleString("en-GB");
        } else {
          return "-";
        }
      });
      // updated_user_created_on
      let data = [
        {
          sheet: "Enterprise Technicians",
          columns: this.columnName,
          content: this.GetAllServiceRepresentativeList,
        },
      ];
      let settings = {
        fileName: "Enterprise Technicians",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    async handleClick(e) {
      console.log("e", e);
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `ENTERPRISE_REPRESENTATIVE_BULK_UPLOAD/${
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
              "Uploaded Successfully, Please get back in some time !!",
          };
          this.renderComp = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
        setTimeout(() => {
          this.GetAllServiceRepresentativeMethod(this.user_status);
        }, 1000);
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
            if (item.sub_modules[0].module_name == "Enterprise Technicians") {
              item.sub_modules[0].module_rights.map((moduleRights) => {
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
    downloadMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Name *",
        "Employee Id",
        "Country Code",
        "Phone Number",
        "Address",
        "Latitude",
        "Longitude",
        "Pincode",
        "Qualification",
        "Experience",
        "PAN Number",
        "Reporter Mail ID",
        "Product Names",
        "Territory Names",
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
            downloadLink.download = `Technician-Bulk-Upload-${new Date().toLocaleString(
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
    dialogDeleteRepsEmit(Toggle) {
      this.dialogDeleteReps = false;
      if (Toggle == 2) {
        this.GetAllServiceRepresentativeMethod(this.user_status);
      }
    },
    CreateServiceRepsDialogEmit(Toggle) {
      this.CreateServiceRepsDialog = false;
      if (Toggle == 2) {
        this.GetAllServiceRepresentativeMethod(this.user_status);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.CreateServiceRepsDialog = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateReps = true;
      } else if (action == "DELETE") {
        this.dialogDeleteReps = true;
      } else if (action == "VIEW_PRODUCT_FLEETS") {
        this.dialogProductFleets = true;
      } else if (action == "VIEW_COMPONENTS") {
        this.dialogComponentsAvailable = true;
      } else if (action == "TRANSFER") {
        this.dialogTransferRep = true;
      }
    },
    dialogProductFleetsEmit() {
      this.dialogProductFleets = false;
      this.GetAllServiceRepresentativeMethod(this.user_status);
    },
    dialogComponentsAvailableEmit() {
      this.dialogComponentsAvailable = false;
      this.GetAllServiceRepresentativeMethod(this.user_status);
    },
    dialogActivateInactivateRepsEmit(Toggle) {
      this.dialogActivateInactivateReps = false;
      if (Toggle == 2) {
        this.GetAllServiceRepresentativeMethod(this.user_status);
      }
    },
  },
};
</script>
