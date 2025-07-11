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
    <AddDealersDialog
      :dialogAddUser="dialogAddUser"
      :StoreObj="StoreObj"
      :StoreServiceDealerObj="StoreServiceDealerObj"
      @clicked="dialogAddUserEmit"
    />
    <DealerUserDialog
      :CreateDealerUserDialog="CreateDealerUserDialog"
      :StoreObj="StoreObj"
      :partner_id="partner_id"
      @clicked="dealeremit"
    />
    <ActivateDeactiveDealers
      :dialogActivateInactivateDealers="dialogActivateInactivateDealers"
      :StoreObj="StoreObj"
      @clicked="dialogActivateInactivateUserEmit"
    />
    <CustmerTag
      :StoreObj="StoreObj"
      v-if="current_view == 'CUSTOMERTAGTODEALER'"
      @clicked="opencustmeremmit"
    />
    <TagPartners
      :tagparntersdialog="tagparntersdialog"
      :StoreObj="StoreObj"
      @clicked="closeEmmit"
    />
    <TaggedTerritories
      :taggedTerritoriesDialog="taggedTerritoriesDialog"
      :StoreObj="StoreObj"
      @clicked="closeEmmit1"
    />
    <TagProduct
      v-if="current_view == 'TAG_PRODUCT'"
      :TagProductDialog="tagProductDialog"
      :StoreObj="StoreObj"
      @clicked="TagProductDialogEmit"
    />
    <v-card elevation="0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div v-if="user_type == 'DEALER_OWNER'" class="largeFontSizeNew">
          Dealers
        </div>
        <div v-if="user_type == 'DEALER_AGENT'" class="largeFontSizeNew">
          Service Co-Ordinators
          <span class="FontSize">/{{ this.dealerOwnerName }}</span>
        </div>
        <div v-if="user_type == 'DEALER_TECHNICIAN'" class="largeFontSizeNew">
          Representatives
          <span class="FontSize">/{{ this.dealerOwnerName }}</span>
        </div>
        <v-spacer />
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-9 ml-2 maxWidthSmall FontSize"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-select
          dense
          outlined
          class="mt-9 FontSize smallwidth ml-2"
          label="User Status"
          v-model="user_status"
          :items="
            user_type == 'DEALER_OWNER' ? user_statusItems : user_status_List
          "
        ></v-select>
        <v-select
          dense
          outlined
          class="mt-9 FontSize maxWidthSmall ml-2"
          v-model="user_territory"
          v-if="user_type == 'DEALER_OWNER'"
          label="Territories"
          :items="GetAllTerritoriesList"
          item-text="territory_name"
          item-value="territory_id"
        ></v-select>
        <v-tooltip color="primary" bottom v-if="user_type == 'DEALER_OWNER'">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
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
                    'DEALERS_BULK_UPLOAD'
                  )
                "
              >
                <input
                  type="file"
                  v-if="renderCompNew"
                  @change="handleClick"
                  id="uploadDealersExcel"
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
                'DEALERS_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Upload Dealers</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom v-if="user_type == 'DEALER_OWNER'">
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              <v-btn
                small
                @click="downloadMethod()"
                class="primary white--text ml-1 text-capitalize mt-3"
                :disabled="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'DEALERS_BULK_UPLOAD'
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
                'DEALERS_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Download Excel Template</span>
        </v-tooltip>
        <v-tooltip
          color="primary"
          bottom
          v-if="
            user_type == 'DEALER_OWNER' &&
            $store.getters.get_user_type != 'DEALER_OWNER'
          "
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              @click="(dialogAddUser = true), (StoreObj.action = 'CREATE')"
              v-on="on"
              v-bind="attrs"
              v-show="showCreateButton"
              class="mt-3 primary white--text ml-2"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add Dealer</span>
        </v-tooltip>
        <v-select
          dense
          outlined
          class="mt-9 FontSize WidthVariation2 mr-2 ml-2"
          v-if="user_type != 'DEALER_OWNER'"
          label="User Type"
          v-model="user_type"
          item-text="text"
          item-value="value"
          :items="user_typeItems"
        ></v-select>
        <v-btn
          @click="callDialogMethod()"
          small
          v-if="user_type != 'DEALER_OWNER'"
          class="primary ml-2 mt-3 white--text"
          ><v-icon small>mdi-plus</v-icon> User</v-btn
        >
        <v-btn
          small
          v-if="user_type != 'DEALER_OWNER'"
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
          dense
          :search="search"
          :style="this.user_type == 'DEALER_OWNER' ? 'cursor: pointer' : ''"
          :loading="loading"
          fixed-header
          :height="TableHeight"
          :headers="
            this.user_type == 'DEALER_OWNER'
              ? headers
              : this.user_type == 'DEALER_AGENT'
              ? PartnerAgentAndRepresentativeHeaders
              : user_type == 'DEALER_TECHNICIAN'
              ? PartnerRepresentativeheaders
              : ''
          "
          :items="GetDealersList"
          :no-data-text="noDataText"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @click:row="rowClick"
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
            <div class="FontSize" v-if="item.user_email_id">
              {{ item.user_email_id }}
            </div>
            <div class="FontSize" v-if="item.user_full_number">
              {{ item.user_full_number }}
            </div>
          </template>
          <template v-slot:[`item.user_qualification`]="{ item }">
            <div class="FontSize" v-if="item.user_qualification">
              {{ item.user_qualification }}
            </div>
            <div v-else>N/A</div>
            <div class="FontSize font-weight-bold">
              Exp :
              <span v-if="item.user_experience" class="font-weight-regular">
                {{ item.user_experience }}
              </span>
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
            <span class="FontSize" v-if="item.app_version != undefined">
              {{ item.app_version }}
            </span>
            <span v-else>-</span>
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
          <template v-slot:[`item.territory_ids`]="{ item }">
            <div class="FontSize">
              {{ item.territory_ids.length }}
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    fab
                    small
                    color="primary"
                    @click.stop="checkItem(item, 'OPEN')"
                    ><v-icon small>mdi-eye</v-icon></v-btn
                  >
                </template>
                <span>View territory list</span>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:[`item.reporter_email_id`]="{ item }">
            <div class="FontSize" v-if="item.reporter_email_id != undefined">
              {{ item.reporter_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <span class="FontSize">{{
              new Date(item.user_created_on * 1000)
                .toLocaleString("en-GB")
                .split(",")[0]
            }}</span>
          </template>
          <template v-slot:[`item.user_status`]="{ item }">
            <div
              class="FontSize"
              :class="
                item.user_status == 'ACTIVE' ? 'GreenHeader' : 'RedHeader'
              "
            >
              {{ item.user_status }}
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
                    @click.stop="checkItem(item, 'EDIT')"
                    v-if="
                      item.user_status == 'ACTIVE' &&
                      $store.getters.get_user_type != 'DEALER_OWNER'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pencil-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Update {{ item.user_name }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'ACTION')"
                    v-if="
                      item.user_id !=
                      $store.getters.get_current_user_details.user_id
                    "
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
                      <v-list-item-title>{{
                        item.user_status == "ACTIVE"
                          ? `Deactivate ${item.user_name}`
                          : `Activate ${item.user_name}`
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'CUSTOMERTAGTODEALER')"
                    v-if="
                      item.user_status == 'ACTIVE' &&
                      $store.getters.get_user_type != 'DEALER_OWNER'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="teal">mdi-tag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Tag Customers</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'TAGPARTNER')"
                    v-if="
                      item.user_status == 'ACTIVE' &&
                      $store.getters.get_user_type != 'DEALER_OWNER'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-tag-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Tag Partners</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'TAGPRODUCT')"
                    v-if="
                      item.user_status == 'ACTIVE' &&
                      $store.getters.get_user_type != 'DEALER_OWNER'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="orange">mdi-ab-testing</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Tag Product Fleet</v-list-item-title>
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
                    @click.stop="checkItemDealer(item, 'EDITUSER')"
                    v-if="item.user_status == 'ACTIVE'"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pencil-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="FontSize">
                      Update
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'ACTION')"
                    v-if="
                      $store.getters.get_user_type != 'AGENT' &&
                      $store.getters.get_user_type != 'MANAGER' &&
                      item.user_status != 'INVITED'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon
                        :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                      >
                        {{
                          item.user_status == "ACTIVE"
                            ? "mdi-account-cancel"
                            : "mdi-account-plus"
                        }}</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content class="FontSize">
                      <span
                        v-text="
                          item.user_status == 'ACTIVE'
                            ? `Deactivate ${item.user_name}`
                            : `Activate ${item.user_name}`
                        "
                      ></span>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'TRANSFER')"
                    v-if="
                      ($store.getters.get_current_user_details.user_type ==
                        'ADMIN' ||
                        $store.getters.get_current_user_details.user_type ==
                          'OWNER') &&
                      user_status == 'ACTIVE' &&
                      user_type == 'DEALER_TECHNICIAN'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-transfer-right</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="FontSize">
                      Transfer
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    @click.stop="checkItem(item, 'DELETE')"
                    v-if="item.user_status == 'INVITED'"
                  >
                    <v-list-item-icon>
                      <v-icon small color="red">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="FontSize">
                      Delete
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
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetAllTaggedTerritories } from "@/mixins/Users/GetAllTaggedTerritories.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import CustmerTag from "@/components/Territories/CustmerTag.vue";
import TagPartners from "@/components/Users/Dialogs/Dealer/TagPartners.vue";
import TransferRep from "@/components/Users/Dialogs/ServicePartner/TransferRep.vue";
import DealerUserDialog from "@/components/Users/Dialogs/Dealer/DealerUserDialog.vue";
import AddDealersDialog from "@/components/Users/Dialogs/Dealer/AddDealersDialog.vue";
import TaggedTerritories from "@/components/Users/Dialogs/Dealer/TaggedTerritories.vue";
import ActivateDeactiveDealers from "@/components/Users/Dialogs/Dealer/ActivateDeactiveDealers.vue";
// import TagProduct from "@/components/Users/Dialogs/Dealer/TagProductDialog.vue";
import TagProduct from "@/components/Users/Card/TagProductCard.vue";
export default {
  mixins: [
    GetAllDealers,
    GenerateS3URL,
    GetAllTerritories,
    GetAllTaggedTerritories,
  ],
  components: {
    Overlay,
    Snackbar,
    CustmerTag,
    TagPartners,
    TransferRep,
    AddDealersDialog,
    DealerUserDialog,
    TaggedTerritories,
    ActivateDeactiveDealers,
    TagProduct,
  },
  data: () => ({
    TableHeight: 0,
    overlay: false,
    loading: false,
    sortDesc: true,
    renderComp: true,
    renderCompNew: true,
    dialogAddUser: false,
    showEditButton: false,
    showCreateButton: false,
    dialogTransferRep: false,
    tagCustomerDialog: false,
    tagparntersdialog: false,
    CreateDealerUserDialog: false,
    taggedTerritoriesDialog: false,
    showActivateDeactivateButton: false,
    dialogActivateInactivateDealers: false,
    tagProductDialog: false,
    user_type_view: null,
    StoreObj: {},
    SnackBarComponent: {},
    StoreServiceDealerObj: {},
    GetDealersList: [],
    GetAllTerritoriesList: [],
    search: "",
    partner_id: "",
    dealerOwnerName: "",
    sortBy: "logged_on",
    current_view: "LIST",
    user_territory: "ALL",
    user_status: "ACTIVE",
    user_type: "DEALER_OWNER",
    noDataText: "No Data Available..!",
    user_statusItems: ["ACTIVE", "INACTIVE"],
    user_status_List: ["ACTIVE", "INACTIVE", "INVITED"],
    headers: [
      { text: "Name", value: "user_name" },
      { text: "Qualification", value: "user_qualification" },
      { text: "App Version", value: "app_version" },
      { text: "Designation", value: "designation_name" },
      { text: "Created On", value: "user_created_on" },
      {
        text: "Reporting To",
        value: "reporting_to_manager_name",
        width: "13%",
      },
      {
        text: "Territories",
        value: "territory_ids",
        width: "10%",
        align: "center",
      },
      { text: "Actions", value: "Actions", width: "9%" },
    ],
    DealerOwnerColumns: [
      { label: "Name", value: "user_name" },
      { label: "Mail ID", value: "user_email_id" },
      { label: "Address", value: "user_address" },
      { label: "Pincode", value: "user_pincode" },
      { label: "Qualification", value: "user_qualification" },
      { label: "GST Number", value: "gst_no" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Created On", value: "updated_user_created_on" },
      { label: "App Version", value: "app_version" },
    ],
    DealerTechColumns: [
      { label: "Name", value: "user_name" },
      { label: "Phone Number", value: "user_contact_number" },
      { label: "Address", value: "user_address" },
      { label: "Pincode", value: "user_pincode" },
      { label: "Qualification", value: "user_qualification" },
      { label: "user_experience", value: "user_experience" },
      { label: "GST Number", value: "gst_no" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Created On", value: "updated_user_created_on" },
      { label: "App Version", value: "app_version" },
    ],
    PartnerAgentAndRepresentativeHeaders: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Qualification", value: "user_qualification" },
      { text: "App Version", value: "app_version", align: "center" },
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
      { text: "Qualification", value: "user_qualification" },
      { text: "Created On", value: "user_created_on" },
      { text: "Reporting To", value: "reporter_email_id" },
      { text: "App Version", value: "app_version", align: "center" },
      { text: "Actions", value: "ActionsA" },
    ],
    user_typeItems: [
      { text: "Dealer Service Co-Ordinator", value: "DEALER_AGENT" },
      { text: "Dealer Technician", value: "DEALER_TECHNICIAN" },
    ],
  }),
  watch: {
    user_territory(val) {
      if (val != "ALL") {
        this.GetDealersMethod("DEALER_OWNER", "ACTIVE", undefined, val);
      } else {
        this.GetDealersMethod("DEALER_OWNER", "ACTIVE", undefined, undefined);
      }
    },
    user_status(val) {
      this.search = "";
      this.GetDealersMethod(
        this.user_type,
        val,
        this.user_type != "DEALER_OWNER" ? this.StoreObj.partner_id : undefined,
        undefined
      );
    },
    user_type(val) {
      if (val != "DEALER_OWNER") {
        this.GetDealersMethod(
          this.user_type,
          this.user_status,
          this.partner_id
        );
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAccessModuleMethod();
    this.user_type_view = "";
    this.GetAllTerritoriesMethod(
      "ACTIVE",
      undefined,
      undefined,
      "TERRITORY",
      undefined
    );
    this.GetDealersMethod(
      (this.user_type = "DEALER_OWNER"),
      (this.user_status = "ACTIVE")
    );
  },
  methods: {
    opencustmeremmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.GetDealersMethod(
          (this.user_type = "DEALER_OWNER"),
          (this.user_status = "ACTIVE")
        );
      }
    },
    exporttoexcel() {
      this.GetDealersList.map((item) => {
        if (item.user_created_on) {
          item.updated_user_created_on = new Date(
            item.user_created_on * 1000
          ).toLocaleString("en-GB");
        }
      });
      let data = [
        {
          sheet:
            this.user_type == "DEALER_OWNER"
              ? "Dealers"
              : this.user_type == "DEALER_TECHNICIAN"
              ? `${this.StoreObj.user_name} Technicians`
              : `${this.StoreObj.user_name} Service Co-Ordinators`,
          columns:
            this.user_type == "DEALER_OWNER"
              ? this.DealerOwnerColumns
              : this.user_type == "DEALER_TECHNICIAN"
              ? this.DealerTechColumns
              : this.DealerOwnerColumns,
          content: this.GetDealersList,
        },
      ];
      let settings = {
        fileName:
          this.user_type == "DEALER_OWNER"
            ? "Dealers"
            : this.user_type == "DEALER_TECHNICIAN"
            ? `${this.StoreObj.user_name} Technicians`
            : `${this.StoreObj.user_name} Service Co-Ordinators`,
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
    checkExcelPresent() {
      document.getElementById("uploadDealersExcel").click();
    },
    async handleClick(e) {
      console.log("e", e);
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `DEALERS_BULK_UPLOAD/${
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
              "Dealers Uploaded Successfully, Please get back in some time !!",
          };
          this.renderComp = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
        this.GetDealersMethod(
          (this.user_type = "DEALER_OWNER"),
          (this.user_status = "ACTIVE")
        );
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
    downloadMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Name *",
        "User Type *",
        "Country Code",
        "Phone Number",
        "Email ID",
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
        "Enable Dealers to Create Ticket (yes/no)",
        "Enable Dealer to Create Service Reps & Agents (yes/no)",
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
            downloadLink.download = `Dealers-Bulk-Upload-${new Date().toLocaleString(
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
            if (item.sub_modules[2].module_name == "Dealers") {
              item.sub_modules[2].module_rights.map((moduleRights) => {
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
    closeEmmit(Toggle) {
      this.tagparntersdialog = false;
      if (Toggle == 1) {
        this.tagparntersdialog = false;
      } else if (Toggle == 2) {
        this.tagparntersdialog = false;
        this.GetDealersMethod(
          (this.user_type = "DEALER_OWNER"),
          (this.user_status = "ACTIVE")
        );
      }
    },
    dialogTagCustomerEmit(Toggle) {
      this.tagCustomerDialog = false;
      if (Toggle == 1) {
        this.tagCustomerDialog = false;
      } else if (Toggle == 2) {
        this.tagCustomerDialog = false;
        this.GetDealersMethod(
          (this.user_type = "DEALER_OWNER"),
          (this.user_status = "ACTIVE")
        );
      }
    },
    closeEmmit1(Toggle) {
      this.taggedTerritoriesDialog = false;
      if (Toggle == 1) {
        this.taggedTerritoriesDialog = false;
      } else if (Toggle == 2) {
        this.taggedTerritoriesDialog = false;
        this.GetDealersMethod(
          (this.user_type = "DEALER_OWNER"),
          (this.user_status = "ACTIVE")
        );
      }
    },
    dialogActivateInactivateUserEmit(Toggle) {
      this.dialogActivateInactivateDealers = false;
      if (Toggle == 2) {
        if (this.user_type == "DEALER_OWNER") {
          this.GetDealersMethod("DEALER_OWNER", "ACTIVE");
        } else {
          this.GetDealersMethod(
            this.user_type,
            this.user_status,
            this.StoreObj.partner_id
          );
        }
      }
    },
    callDialogMethod() {
      this.CreateDealerUserDialog = true;
      this.StoreObj.action = "CREATEREP";
    },
    rowClick(item) {
      if (this.user_type_view != "AGENT") {
        this.search = "";
        this.StoreObj = item;
        this.user_type_view = "AGENT";
        this.partner_id = this.StoreObj.partner_id;
        this.dealerOwnerName = this.StoreObj.user_name;
        this.$forceUpdate();
        this.GetDealersMethod(
          (this.user_type = "DEALER_TECHNICIAN"),
          (this.user_status = "ACTIVE"),
          this.partner_id
        );
        this.user_type = "DEALER_TECHNICIAN";
      }
    },
    goBackMethod() {
      this.StoreObj = {};
      this.user_type = "DEALER_OWNER";
      this.user_status = "ACTIVE";
      this.user_type_view = "";
      this.GetDealersMethod(this.user_type, this.user_status);
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.dialogAddUser = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateDealers = true;
      } else if (action == "DELETE") {
        this.dialogActivateInactivateDealers = true;
      } else if (action == "CUSTOMERTAGTODEALER") {
        this.current_view = "CUSTOMERTAGTODEALER";
      } else if (action == "TAGPARTNER") {
        this.tagparntersdialog = true;
      } else if (action == "OPEN") {
        this.taggedTerritoriesDialog = true;
      } else if (action == "TRANSFER") {
        this.dialogTransferRep = true;
      } else if (action === "TAGPRODUCT") {
        this.current_view = "TAG_PRODUCT";
        // this.tagProductDialog = true;
      }
    },
    dialogTransferRepEmit(Toggle) {
      this.dialogTransferRep = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          (this.user_type = "DEALER_OWNER"),
          (this.user_status = "ACTIVE")
        );
      }
    },
    checkItemDealer(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDITUSER") {
        this.CreateDealerUserDialog = true;
      }
    },
    dialogAddUserEmit(Toggle) {
      this.dialogAddUser = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          (this.user_type = "DEALER_OWNER"),
          this.user_status,
          this.partner_id != "" ? this.partner_id : undefined,
          this.user_territory
        );
      }
    },
    dealeremit(Toggle) {
      this.CreateDealerUserDialog = false;
      if (Toggle == 2) {
        this.user_type == "DEALER_AGENT";
        this.GetDealersMethod(
          this.user_type,
          (this.user_status = "ACTIVE"),
          this.partner_id
        );
      }
    },

    TagProductDialogEmit(Toggle) {
      this.current_view = "LIST";
    },
  },
};
</script>
