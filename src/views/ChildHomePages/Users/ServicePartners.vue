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
    <CreateServicePartner
      :GetAllUsersList="GetAllUsersList"
      :CreateServicePartnerDialog="CreateServicePartnerDialog"
      :StoreObj="StoreObj"
      @clicked="ServicePartnerEmit"
    />
    <CreatePartnerUserDialog
      :GetAllPartnerAndPartnerUserList="GetAllPartnerAndPartnerUserList"
      :StoreObj="StoreObj"
      :CreateServicePartnerUserDialog="CreateServicePartnerUserDialog"
      :partner_id="partner_id"
      @clicked="ServicePartnerUserEmit"
    />
    <DeleateServicePartner
      :DeletePartnerdialog="DeletePartnerdialog"
      :StoreObj="StoreObj"
      @clicked="dialogDeletePartnerEmit"
    />
    <DeleteInvitedServicePartner
      :dialogDeleteReps="dialogDeleteReps"
      :StoreObj="StoreObj"
      @clicked="dialogDeleteRepsEmit"
    />
    <ComponentsDialog
      :dialogComponentsAvailable="dialogComponentsAvailable"
      :StoreObj="StoreObj"
      @clicked="dialogComponentsAvailableEmit"
    />
    <CustmerTag
      :StoreObj="StoreObj"
      v-if="current_view == 'TAG_CUSTOMERS'"
      @clicked="opencustmeremmit"
    />
    <v-card elevation="0" v-if="current_view == 'MAIN_PAGE'">
      <v-toolbar dense class="elevation-0">
        <div v-if="user_type == 'SERVICE_PARTNER'" class="largeFontSizeNew">
          Service Partners
        </div>
        <div v-if="user_type == 'PARTNER_AGENT'" class="largeFontSizeNew">
          Service Co-Ordinator
          <span class="FontSize field_label_size"
            >/{{ this.servicePartnerName }}</span
          >
        </div>
        <div
          v-if="user_type == 'PARTNER_REPRESENTATIVE'"
          class="largeFontSizeNew"
        >
          Representatives
          <span class="FontSize field_label_size"
            >/{{ this.servicePartnerName }}</span
          >
        </div>
        <v-spacer />
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-9 mr-2 WidthVariation2 FontSize field_label_size field_height"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-select
          dense
          outlined
          class="mt-9 FontSize field_label_size field_height maxWidthXSmall mr-2"
          label="User Status"
          v-model="user_status"
          :items="
            user_type == 'SERVICE_PARTNER'
              ? user_statusItems
              : user_partenerItems
          "
        ></v-select>
        <v-select
          dense
          outlined
          class="mt-9 FontSize field_label_size field_height maxWidthXSmall mr-2"
          label="Bulk Upload For"
          v-model="bulfUpFor"
          item-text="text"
          item-value="value"
          :items="[
            {
              text: 'Bulk Upload/Download Template For Partner',
              value: 'PARTNER',
            },
            {
              text: 'Bulk Upload/Download Template For Partner Inventory',
              value: 'PARTNER_INV',
            },
          ]"
        ></v-select>
        <!-- <div v-if="bulfUpFor === 'PARTNER'"> -->
        <v-tooltip color="primary" bottom v-if="user_type == 'SERVICE_PARTNER'">
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              <v-btn
                @click="checkExcelPresent()"
                small
                class="primary white--text ml-2 mt-3"
                :disabled="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'SERVICE_PARTNERS_BULK_UPLOAD'
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
                'SERVICE_PARTNERS_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>{{
            bulfUpFor === "PARTNER"
              ? "Upload Excel Template For Partner"
              : "Upload Excel Template For Partner Inventory"
          }}</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom v-if="user_type == 'SERVICE_PARTNER'">
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              <v-btn
                class="primary white--text ml-1 text-capitalize mt-3"
                small
                @click="downloadMethod()"
                :disabled="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'SERVICE_PARTNERS_BULK_UPLOAD'
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
                'SERVICE_PARTNERS_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>{{
            bulfUpFor === "PARTNER"
              ? "Download Excel Template For Partner"
              : "Download Excel Template For Partner Inventory"
          }}</span>
        </v-tooltip>
        <!-- </div> -->
        <!-- <div v-else></div> -->
        <v-tooltip
          color="primary"
          bottom
          v-if="
            ($store.getters.get_current_user_details.user_type == 'ADMIN' ||
              $store.getters.get_current_user_details.user_type == 'MANAGER' ||
              $store.getters.get_current_user_details.user_type == 'OWNER') &&
            user_type == 'SERVICE_PARTNER'
          "
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              @click="
                CreateServicePartnerDialog = true;
                StoreObj.action = 'CREATE';
              "
              v-on="on"
              v-bind="attrs"
              v-show="showCreateButton"
              class="primary mt-3 ml-1 white--text"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add Service Partner</span>
        </v-tooltip>
        <v-select
          dense
          outlined
          class="mt-9 FontSize field_label_size field_height WidthVariation2 mr-2"
          v-if="user_type != 'SERVICE_PARTNER'"
          label="User Type"
          v-model="user_type"
          item-text="text"
          item-value="value"
          :items="user_typeItems"
        ></v-select>
        <v-btn
          @click.stop="callDialogMethod()"
          small
          v-if="user_type != 'SERVICE_PARTNER'"
          class="primary mt-3 ml-2 white--text"
          ><v-icon small>mdi-plus</v-icon>User</v-btn
        >
        <v-btn
          small
          v-if="user_type != 'SERVICE_PARTNER'"
          class="primary white--text mr-2 ml-2 mt-3"
          @click="goBackMethod()"
          ><v-icon>mdi-chevron-double-left</v-icon></v-btn
        >
        <!-- <v-btn
          small
          color="primary"
          @click="exporttoexcel"
          class="primary white--text ml-1 mt-3"
        >
          <v-icon>mdi-file-excel-outline</v-icon>
        </v-btn> -->
      </v-toolbar>
      <v-card-text>
        <v-data-table
          v-if="user_status !== 'INVALID'"
          dense
          fixed-header
          :style="this.user_type == 'SERVICE_PARTNER' ? 'cursor: pointer' : ''"
          :height="TableHeight"
          :search="search"
          :loading="loading_service_partners"
          :headers="
            user_type == 'SERVICE_PARTNER'
              ? ServicePartnerHeaders
              : this.user_type == 'PARTNER_AGENT'
              ? PartnerAgentAndRepresentativeHeaders
              : user_type == 'PARTNER_REPRESENTATIVE'
              ? PartnerRepresentativeheaders
              : ''
          "
          @click:row="handleRowClick"
          :items="GetAllPartnerAndPartnerUserList"
          :no-data-text="noDataText"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.user_email_id`]="{ item }">
            <div class="FontSize" v-if="item.user_email_id != undefined">
              {{ item.user_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.designation_name`]="{ item }">
            <div class="FontSize" v-if="item.designation_name != undefined">
              {{ item.designation_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.reporting_to_manager_name`]="{ item }">
            <div
              class="FontSize"
              v-if="item.reporting_to_manager_name != undefined"
            >
              {{ item.reporting_to_manager_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize">{{ item.user_name }}</div>
          </template>
          <template v-slot:[`item.user_full_number`]="{ item }">
            <div class="FontSize">{{ item.user_full_number }}</div>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.user_created_on * 1000).toLocaleDateString(
                  "en-GB"
                )
              }}
            </div>
          </template>
          <template v-slot:[`item.app_version`]="{ item }">
            <div class="ml-3 FontSize" v-if="item.app_version">
              {{ item.app_version }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.reporter_email_id`]="{ item }">
            <div v-if="item.reporter_email_id != undefined" class="FontSize">
              {{ item.reporter_email_id }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.reporter_user_name != undefined">
              ({{ item.reporter_user_name }})
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
                      <v-list-item-title>
                        Update {{ item.user_name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click.stop="checkItem(item, 'TAG_CUSTOMERS')">
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-tag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title> Tag Customers </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      item.user_id !=
                        $store.getters.get_current_user_details.user_id &&
                      item.user_status != 'INVITED'
                    "
                    @click.stop="checkItem(item, 'ACTION')"
                  >
                    <v-list-item-icon>
                      <v-icon
                        small
                        :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                        >{{
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
                    @click.stop="checkItem(item, 'DELETE')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="red">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Delete Service Partner
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
          <template v-slot:[`item.ActionsA`]="{ item }">
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
                    @click.stop="checkItemA(item, 'EDIT')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pencil-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Update {{ item.user_name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      item.user_status == 'ACTIVE' &&
                      item.user_type == 'PARTNER_REPRESENTATIVE'
                    "
                    @click.stop="checkItemA(item, 'VIEW_COMPONENTS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-lumx</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Available Components
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    v-if="
                      item.user_id !=
                        $store.getters.get_current_user_details.user_id &&
                      item.user_status != 'INVITED'
                    "
                    @click.stop="checkItem(item, 'ACTION')"
                  >
                    <v-list-item-icon>
                      <v-icon
                        :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                        >{{
                          item.user_status == "ACTIVE"
                            ? "mdi-account-cancel"
                            : "mdi-account-plus"
                        }}</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span
                          v-text="
                            item.user_status == 'ACTIVE'
                              ? `Deactivate ${item.user_name}`
                              : `Activate ${item.user_name}`
                          "
                        ></span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      ($store.getters.get_current_user_details.user_type ==
                        'ADMIN' ||
                        $store.getters.get_current_user_details.user_type ==
                          'OWNER') &&
                      item.user_status == 'ACTIVE' &&
                      item.user_type == 'PARTNER_REPRESENTATIVE'
                    "
                    @click.stop="checkItemA(item, 'TRANSFER')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="green">mdi-transfer-right</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Transfer {{ item.user_name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.user_status == 'INVITED'"
                    @click.stop="checkItem(item, 'DELETE')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="red">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Update {{ item.user_name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
        <v-data-table
          v-else
          class="TableValFontsize"
          dense
          fixed-header
          :height="TableHeight"
          :search="search"
          :headers="invalidHeader"
          :items="invalidItemsList"
          :no-data-text="
            invalidItemsList && invalidItemsList.length === 0
              ? 'No data found'
              : null
          "
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.invalid_data_s3_url`]="{ item }">
            <div v-if="item.invalid_data_s3_url">
              <v-btn
                icon
                @click.stop="excelDownloadMethod(item.invalid_data_s3_url)"
                ><v-icon small color="green darken-3"
                  >mdi-file-excel</v-icon
                ></v-btn
              >
            </div>
            <div v-else class="FontSize">
              <span>-</span>
            </div>
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
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import { GetAllPartnerAndReps } from "@/mixins/Users/GetAllPartnersAndReps.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import TransferRep from "@/components/Users/Dialogs/ServicePartner/TransferRep.vue";
import CreateServicePartner from "@/components/Users/Dialogs/ServicePartner/CreateServicePartner.vue";
import DeleateServicePartner from "@/components/Users/Dialogs/ServicePartner/DeleateServicePartner.vue";
import ProductFleetsDialog from "@/components/Users/Dialogs/EnterpriseTechnicians/ProductFleetsDialog.vue";
import CreatePartnerUserDialog from "@/components/Users/Dialogs/ServicePartner/CreatePartnerUserDialog.vue";
import DeleteInvitedServicePartner from "@/components/Users/Dialogs/ServicePartner/DeleteInvitedServicePartner.vue";
import ComponentsDialog from "@/components/Users/Dialogs/EnterpriseTechnicians/ComponentsDialog.vue";
import { GetAllInvalidSerialNumbers } from "@/mixins/Product/ListAllInvalidSerialNumber.js";
import CustmerTag from "@/components/Territories/CustmerTag.vue";
export default {
  mixins: [
    GetAllUsers,
    GenerateS3URL,
    GetAllPartnerUser,
    GetAllPartnerAndReps,
    GetAllInvalidSerialNumbers,
  ],
  components: {
    Overlay,
    Snackbar,
    TransferRep,
    ProductFleetsDialog,
    CreateServicePartner,
    DeleateServicePartner,
    CreatePartnerUserDialog,
    DeleteInvitedServicePartner,
    ComponentsDialog,
    CustmerTag,
  },

  data: () => ({
    current_view: "MAIN_PAGE",
    TableHeight: 0,
    overlay: false,
    renderComp: true,
    renderCompNew: true,
    showEditButton: false,
    showCreateButton: false,
    dialogDeleteReps: false,
    dialogTransferRep: false,
    DeletePartnerdialog: false,
    loading_service_partners: false,
    CreateServicePartnerDialog: false,
    showActivateDeactivateButton: false,
    CreateServicePartnerUserDialog: false,
    bulfUpFor: "PARTNER",
    search: "",
    partner_id: "",
    user_status: "ACTIVE",
    servicePartnerName: "",
    user_type: "SERVICE_PARTNER",
    noDataText: "No Data Available..!",
    StoreObj: {},
    SnackBarComponent: {},
    GetAllUsersList: [],
    newArrayForExcelData: [],
    invalidItemsList: [],
    user_statusItems: ["ACTIVE", "INACTIVE", "INVALID"],
    user_partenerItems: ["ACTIVE", "INACTIVE", "INVITED", "INVALID"],
    ServicePartnerHeaders: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
        width: "16%",
      },
      { text: "Email-Id", value: "user_email_id", width: "18%" },
      {
        text: "App Version",
        value: "app_version",
        align: "center",
        width: "14%",
      },
      { text: "Designation", value: "designation_name", width: "12%" },
      {
        text: "Reporting To",
        value: "reporting_to_manager_name",
        width: "14%",
      },
      { text: "Created On", value: "user_created_on", width: "12%" },
      { text: "Actions", value: "Actions", width: "80%" },
    ],
    PartnerAgentAndRepresentativeHeaders: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Email-Id", value: "user_email_id" },
      {
        text: "App Version",
        value: "app_version",
        align: "center",
        width: "14%",
      },
      { text: "Created On", value: "user_created_on" },
      { text: "Reporting To", value: "reporter_email_id" },
      { text: "Actions", value: "ActionsA" },
    ],
    PartnerRepresentativeheaders: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Created On", value: "user_created_on" },
      { text: "App Version", value: "app_version" },
      { text: "Reporting To", value: "reporter_email_id" },
      { text: "Contact Number", value: "user_full_number" },
      { text: "Actions", value: "ActionsA" },
    ],
    user_typeItems: [
      { text: "Service Co-Ordinator", value: "PARTNER_AGENT" },
      { text: "Representative", value: "PARTNER_REPRESENTATIVE" },
    ],
    allPartnerDetails: [
      { label: "Service Partner", value: "user_name" },
      { label: "Email ID", value: "user_email_id" },
      { label: "Contact Number", value: "user_phone" },
      { label: "Address", value: "address" },
      { label: "City", value: "city" },
      { label: "State", value: "state" },
      { label: "Pincode", value: "pincode" },
      { label: "GST Number", value: "gst_no" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Qualification", value: "user_qualification" },
      { label: "Experience", value: "user_experience" },
      { label: "Designation", value: "designation_name" },
      { label: "Reporting To", value: "reporting_to_manager_name" },
      { label: "Territory Names", value: "territory_names" },
      { label: "Created On", value: "user_created_on" },
      { label: "Users", value: "technician_name" },
      { label: "User Type", value: "tech_type" },
      { label: "User Phone", value: "tech_phone_number" },
    ],
    invalidHeader: [
      { text: "Created On", value: "created_on" },
      { text: "Download Excel", value: "invalid_data_s3_url" },
    ],
    dialogComponentsAvailable: false,
  }),
  watch: {
    user_type(val) {
      if (val != "SERVICE_PARTNER") {
        this.GetAllPartnerUserMethod(
          this.user_type,
          this.user_status,
          this.StoreObj.partner_id
        );
      }
    },
    async user_status(val) {
      if (val === "INVALID") {
        await this.GetAllInvalidSerialNumbersMethod(
          undefined,
          "PARTNER_INVENTORY_BULK_UPLOAD"
        );
        this.invalidItemsList = this.GetAllInvalidSerialNumberList;
      } else {
        if (this.user_type == "SERVICE_PARTNER") {
          this.search = "";
          this.GetAllPartnerUserMethod(this.user_type, this.user_status);
        } else if (this.user_type == "PARTNER_AGENT") {
          this.search = "";
          this.GetAllPartnerUserMethod(
            this.user_type,
            this.user_status,
            this.StoreObj.partner_id
          );
        } else if (this.user_type == "PARTNER_REPRESENTATIVE") {
          this.GetAllPartnerUserMethod(
            this.user_type,
            this.user_status,
            this.StoreObj.partner_id
          );
        }
      }
    },
  },
  async mounted() {
    this.TableHeight = window.innerHeight - 200;
    await this.GetAccessModuleMethod();
    await this.GetAllUsersMethod(undefined, "ACTIVE");
    await this.GetAllPartnerUserMethod(this.user_type, this.user_status);
    console.log("LENGHT_PARTBER", this.GetAllPartnerAndPartnerUserList.length);
  },
  methods: {
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

    excelDownloadMethod(item) {
      window.open(item);
    },
    async exporttoexcel() {
      this.renderComp = false;
      this.$nextTick(() => {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Please wait.., It May take few Seconds..!",
        };
        this.renderComp = true;
      });
      if (this.GetAllPartnerAndPartnerUserList.length != 0) {
        for (let i = 0; i < this.GetAllPartnerAndPartnerUserList.length; i++) {
          this.GetAllPartnerAndPartnerUserList[i].rep_list =
            await this.GetAllPartnerAndRepsMethod(
              "PARTNER_REPRESENTATIVE",
              "ACTIVE",
              this.GetAllPartnerAndPartnerUserList[i].partner_id
            );
        }
        if (
          this.GetAllPartnerAndPartnerUserList.length != 0 &&
          this.GetAllPartnerAndPartnerUserList != undefined
        ) {
          this.newArrayForExcelData = [];
          for (
            let i = 0;
            i < this.GetAllPartnerAndPartnerUserList.length;
            i++
          ) {
            let repDetails = this.GetAllPartnerAndPartnerUserList[i].rep_list;
            if (repDetails != undefined && repDetails.length != 0) {
              for (let k = 0; k < repDetails.length; k++) {
                let repObj = {
                  user_name:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].user_name
                      : "",
                  user_email_id:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].user_email_id
                      : "",
                  user_phone:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i]
                          .user_contact_number
                      : "",
                  address:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].user_address
                      : "",
                  city:
                    k == 0 ? this.GetAllPartnerAndPartnerUserList[i].city : "",
                  state:
                    k == 0 ? this.GetAllPartnerAndPartnerUserList[i].state : "",
                  pincode:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].user_pincode
                      : "",
                  gst_no:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].gst_no
                      : "",
                  user_pan_no:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].user_pan_no
                      : "",
                  user_qualification:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i]
                          .user_qualification
                      : "",
                  user_experience:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].user_experience
                      : "",
                  designation_name:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i].designation_name
                      : "",
                  territory_names:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i]
                          .territory_names != undefined &&
                        this.GetAllPartnerAndPartnerUserList[i].territory_names
                          .length != 0
                        ? this.GetAllPartnerAndPartnerUserList[
                            i
                          ].territory_names.join()
                        : ""
                      : "",
                  reporting_to_manager_name:
                    k == 0
                      ? this.GetAllPartnerAndPartnerUserList[i]
                          .reporting_to_manager_name
                      : "",
                  user_created_on:
                    k == 0
                      ? new Date(
                          this.GetAllPartnerAndPartnerUserList[i]
                            .user_created_on * 1000
                        ).toLocaleDateString("en-GB")
                      : "",
                  technician_name: repDetails[k].user_name,
                  tech_phone_number: repDetails[k].user_contact_number,
                  tech_type: repDetails[k].user_type,
                };
                this.newArrayForExcelData.push(repObj);
              }
            } else {
              let repObj2 = {
                user_name: this.GetAllPartnerAndPartnerUserList[i].user_name,
                user_email_id:
                  this.GetAllPartnerAndPartnerUserList[i].user_email_id,
                user_phone:
                  this.GetAllPartnerAndPartnerUserList[i].user_contact_number,
                address: this.GetAllPartnerAndPartnerUserList[i].user_address,
                city: this.GetAllPartnerAndPartnerUserList[i].city,
                state: this.GetAllPartnerAndPartnerUserList[i].state,
                pincode: this.GetAllPartnerAndPartnerUserList[i].user_pincode,
                gst_no: this.GetAllPartnerAndPartnerUserList[i].gst_no,
                user_pan_no:
                  this.GetAllPartnerAndPartnerUserList[i].user_pan_no,
                user_qualification:
                  this.GetAllPartnerAndPartnerUserList[i].user_qualification,
                user_experience:
                  this.GetAllPartnerAndPartnerUserList[i].user_experience,
                designation_name:
                  this.GetAllPartnerAndPartnerUserList[i].designation_name,
                reporting_to_manager_name:
                  this.GetAllPartnerAndPartnerUserList[i]
                    .reporting_to_manager_name,
                territory_names:
                  this.GetAllPartnerAndPartnerUserList[i].territory_names !=
                    undefined &&
                  this.GetAllPartnerAndPartnerUserList[i].territory_names
                    .length != 0
                    ? this.GetAllPartnerAndPartnerUserList[
                        i
                      ].territory_names.join()
                    : "",
                user_created_on: new Date(
                  this.GetAllPartnerAndPartnerUserList[i].user_created_on * 1000
                ).toLocaleDateString("en-GB"),
              };
              this.newArrayForExcelData.push(repObj2);
            }
          }

          this.$forceUpdate();
        }
        let data = [
          {
            sheet: "Service Partners",
            columns: this.allPartnerDetails,
            content: this.newArrayForExcelData,
          },
        ];
        let settings = {
          fileName: "Service Partners",
          extraLength: 6,
          writeOptions: {},
        };
        xlsx(data, settings);
      }
    },
    async handleClick(e) {
      this.overlay = true;
      let filePath;
      let msgName;
      let result;
      if (this.bulfUpFor === "PARTNER") {
        filePath = "SERVICE_PARTNERS_BULK_UPLOAD";
        msgName =
          "Service Partners Uploaded Successfully, Please get back in some time !!";
        result = await this.GenerateS3URLMethods(
          `${filePath}/${
            this.$store.getters.get_current_user_details.organization_id
          }_${new Date().getTime()}.xlsx`,
          e.target.files[0]
        );
      } else {
        filePath = "TECHNICIAN_INVENTORY_BULK_UPLOAD";
        msgName =
          "Service Partners Inventory Uploaded Successfully, Please get back in some time !!";
        result = await this.GenerateS3URLMethods(
          `${filePath}/${
            this.$store.getters.get_current_user_details.organization_id
          }_${new Date().getTime()}.xlsx`,
          e.target.files[0],
          undefined,
          "PARTNER_INVENTORY_BULK_UPLOAD"
        );
      }
      if (result.status == "SUCCESS") {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: msgName,
          };
          this.renderComp = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
        setTimeout(() => {
          this.GetAllPartnerUserMethod(this.user_type, this.user_status);
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
    checkExcelPresent() {
      document.getElementById("uploadExcel").click();
    },
    checkExcelPresentForUsers() {
      document.getElementById("uploadExcelForUsers").click();
    },
    downloadMethod() {
      this.overlay = true;
      let fieldNamesArray;
      if (this.bulfUpFor === "PARTNER") {
        fieldNamesArray = [
          "Name *",
          "User Type *",
          "Email ID",
          "Country Code",
          "Phone Number",
          "Address",
          "Latitude",
          "Longitude",
          "Pincode",
          "GST No",
          "PAN Number",
          "Qualification",
          "Experience",
          "Designation",
          "Reporter Mail ID",
          "Territory Names",
          "Product Names",
          "Enable Partners to Create Ticket (yes/no)",
          "Enable Partners to Create Service Reps and Agents (yes/no)",
        ];
      } else {
        fieldNamesArray = [
          "Component Name*",
          "Component Code",
          "Patner E-Mail*",
          "Component Count",
          "Component Cost*",
          "Component Cost Gst",
        ];
      }
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
            let fileName;
            if (this.bulfUpFor === "PARTNER") {
              fileName = "Service-Partners-Bulk-Upload";
            } else {
              fileName = "Service-Partners-Inventory-Bulk-Upload";
            }
            downloadLink.download = `${fileName}-${new Date().toLocaleString(
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
            if (item.sub_modules[1].module_name == "Service Partners") {
              item.sub_modules[1].module_rights.map((moduleRights) => {
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
    callDialogMethod() {
      this.CreateServicePartnerUserDialog = true;
      this.StoreObj.action = "CREATEREP";
    },
    dialogDeleteRepsEmit(Toggle) {
      this.dialogDeleteReps = false;
      if (Toggle == 2) {
        this.GetAllPartnerUserMethod(this.user_type, this.user_status);
      }
    },
    dialogDeletePartnerEmit(Toggle) {
      this.DeletePartnerdialog = false;
      if (Toggle == 2) {
        if (this.user_type == "SERVICE_PARTNER") {
          this.GetAllPartnerUserMethod(this.user_type, this.user_status);
        } else {
          this.GetAllPartnerUserMethod(
            this.user_type,
            this.user_status,
            this.partner_id
          );
        }
      }
    },
    ServicePartnerUserEmit(Toggle) {
      this.CreateServicePartnerUserDialog = false;
      if (Toggle == 2) {
        this.GetAllPartnerUserMethod(
          this.user_type,
          this.user_status,
          this.partner_id
        );
        // this.user_type = "PARTNER_AGENT";
      }
    },
    goBackMethod() {
      this.user_type = "SERVICE_PARTNER";
      this.user_status = "ACTIVE";
      this.GetAllPartnerUserMethod(this.user_type, this.user_status);
    },
    handleRowClick(item) {
      console.log("PART", item);
      if (this.user_type == "SERVICE_PARTNER") {
        this.search = "";
        this.StoreObj = item;
        this.partner_id = this.StoreObj.partner_id;
        this.servicePartnerName = this.StoreObj.user_name;
        this.user_type = "PARTNER_AGENT";
      }
    },
    checkItemA(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.CreateServicePartnerUserDialog = true;
      } else if (action == "ACTION") {
        this.DeletePartnerdialog = true;
      } else if (action == "DELETE") {
        this.dialogDeleteReps = true;
      } else if (action == "TRANSFER") {
        this.dialogTransferRep = true;
      } else if (action === "VIEW_COMPONENTS") {
        this.dialogComponentsAvailable = true;
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      // this.StoreObj.tag_from = "SERVICE_PARTNER";
      if (action == "EDIT") {
        this.CreateServicePartnerDialog = true;
      } else if (action == "ACTION") {
        this.DeletePartnerdialog = true;
      } else if (action == "DELETE") {
        this.dialogDeleteReps = true;
      } else if (action == "TAG_CUSTOMERS") {
        this.StoreObj.action = "SERVICE_PARTNER";
        this.current_view = action;
      }
    },
    dialogTransferRepEmit(Toggle) {
      this.dialogTransferRep = false;
      if (Toggle == 2) {
        this.GetAllPartnerUserMethod(this.user_type, this.user_status);
      }
    },
    ServicePartnerEmit(Toggle) {
      this.CreateServicePartnerDialog = false;
      if (Toggle == 2) {
        this.GetAllPartnerUserMethod(this.user_type, this.user_status);
      }
    },

    dialogComponentsAvailableEmit() {
      this.dialogComponentsAvailable = false;
      // this.GetAllServiceRepresentativeMethod(this.user_status);
    },
    async opencustmeremmit(Toggle) {
      this.current_view = "MAIN_PAGE";
      if (Toggle == 2) {
        await this.GetAccessModuleMethod();
        await this.GetAllUsersMethod(undefined, "ACTIVE");
        await this.GetAllPartnerUserMethod(this.user_type, this.user_status);
      }
    },
  },
};
</script>

<style></style>
