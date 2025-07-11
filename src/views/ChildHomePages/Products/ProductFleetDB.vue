<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <CreateUpdateProductFleet
      v-if="SettingStatus !== 'INVALID'"
      :StoreObj="StoreObj"
      :CreateUpdateProductFleetDialog="CreateUpdateProductFleetDialog"
      @clicked="CreateUpdateProductFleetDialogEmit"
    />
    <CreateUpdateProductFleet2
      v-else
      :StoreObj="StoreObj"
      :CreateUpdateProductFleetDialog="CreateUpdateProductFleetDialog"
      @clicked="CreateUpdateProductFleetDialogEmit"
    />
    <ActivateDeactivateProductFleet
      :StoreObj="StoreObj"
      :dialogActivateInactivateComp="dialogActivateInactivateComp"
      @clicked="dialogActivateInactivateCompEmit"
    />
    <DeleteInvalidSerialNumbers
      :StoreObj="StoreObj"
      :dialogDeleteInvalidSerialNumber="dialogDeleteInvalidSerialNumber"
      @clicked="dialogDeleteInvalidSerailNumberEmit"
    />
    <TransferProductFleet
      :StoreObj="StoreObj"
      :TransferProductFleetDialog="TransferProductFleetDialog"
      @clicked="TransferProductFleetDialogEmit"
    />
    <ProductFleetTransferredHistory
      :StoreObj="StoreObj"
      :dialogProductFleetTransferredHistory="
        dialogProductFleetTransferredHistory
      "
      @clicked="dialogProductFleetTransferredHistoryEmit"
    />
    <CreateTicketCard
      v-if="current_view == 'CREATE_TICKET'"
      :StoreObj="StoreObj"
      @clicked="CreateTicketCardEmit"
    />
    <ViewTicketDetails
      v-if="current_view == 'VIEW_TICKET_DETAILS'"
      :StoreObj="StoreObj"
      @clicked="ViewTicketDetailsEmit"
    />
    <UpdateTaggedProductFleet
      :StoreObjForTaggedProductFleet="StoreObj"
      :AddUpdateProductFleetDialog="AddUpdateProductFleetDialog"
      @clicked="AddUpdateProductFleetDialogEmit"
    />
    <v-card-text v-if="current_view == 'LIST' && contentFullyLoaded === true">
      <v-toolbar flat dense>
        <div class="largeFontSizeNew mt-n4 ml-0">
          Product Fleet:
          {{
            search.length > 2
              ? filteredProductFleetData.length
              : SettingStatus === "INVALID"
              ? GetAllInvalidSerialNumberList.length
              : overallProductFleetData.length
          }}
          <v-btn
            small
            depressed
            class="ml-2"
            color="primary"
            v-show="showCreateButton"
            @click="
              (CreateUpdateProductFleetDialog = true),
                (StoreObj.action = 'CREATE')
            "
            >Create Product Fleet<v-icon>mdi-plus</v-icon></v-btn
          >
        </div>
        <v-spacer />
        <!-- <v-autocomplete
          dense
          outlined
          label="Product"
          v-model="Product_id"
          item-value="service_id"
          item-text="service_name"
          :items="GetAllServicesList"
          class="mr-1 mt-n1 widthSmall FontSize"
        ></v-autocomplete> -->
        <v-select
          dense
          outlined
          item-text="text"
          item-value="value"
          :items="StatusItem"
          v-model="SettingStatus"
          label="Product Fleet Status"
          class="ml-1 mr-1 mt-n1 widthSmall FontSize"
        >
        </v-select>

        <v-form ref="form">
          <v-row no-gutters>
            <v-select
              dense
              outlined
              label="Search By"
              item-text="text"
              item-value="value"
              v-model="SearchBy"
              :items="SearchByItems"
              v-if="SettingStatus != 'ACTIVE'"
              class="ml-1 mr-1 widthSmall FontSize"
            >
            </v-select>
            <v-text-field
              dense
              outlined
              label="Search"
              v-model="search"
              append-icon="mdi-magnify"
              class="mt-0 ml-1 mr-1 FontSize"
              :rules="[
                (v) => !!v || 'Required',
                (v) => (v && v.length >= 3) || 'Minimum 3 characters',
              ]"
            >
            </v-text-field>
          </v-row>
        </v-form>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-n6" icon v-on="on" v-bind="attrs">
              <v-icon color="primary">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-actions>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      class="primary white--text text-capitalize ml-2"
                      small
                      v-show="showCreateButton"
                      @click="checkExcelPresent()"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'PRODUCT_FLEET'
                        )
                      "
                    >
                      <input
                        type="file"
                        id="uploadExcel"
                        v-if="renderComp"
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
                      'PRODUCT_FLEET'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Upload Product Fleet</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      class="primary white--text text-capitalize ml-2"
                      small
                      v-show="showCreateButton"
                      @click="downloadExcelBaseMethod()"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'PRODUCT_FLEET'
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
                      'PRODUCT_FLEET'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Download Bulk Upload Template</span>
              </v-tooltip>
              <!-- <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    depressed
                    v-on="on"
                    class="ml-2"
                    v-bind="attrs"
                    color="primary"
                    v-show="showCreateButton"
                    @click="
                      (CreateUpdateProductFleetDialog = true),
                        (StoreObj.action = 'CREATE')
                    "
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </template>
                <span>Create Product Fleet</span>
              </v-tooltip> -->
              <!-- <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    color="primary"
                    @click="exporttoexcel"
                    class="primary white--text ml-2"
                  >
                    <v-icon>mdi-file-excel-outline</v-icon>
                  </v-btn>
                </template>
                <span class="white--text">Download Excel</span>
              </v-tooltip> -->
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-card flat>
        <v-data-table
          dense
          class="TableValFontsize"
          fixed-header
          :page.sync="page"
          :loading="loading"
          :items-per-page="100"
          :height="TableHeight"
          :no-data-text="noDataText"
          @page-count="pageCount = $event"
          :headers="
            SettingStatus != 'TAGGED'
              ? ProductsHeaders.filter((item) => item.text != 'Tagged To')
              : ProductsHeaders
          "
          :items="
            search !== '' && search.length > 2
              ? filteredProductFleetData
              : SettingStatus != 'INVALID'
              ? productFleetData
              : GetAllInvalidSerialNumberList
          "
          hide-default-footer
        >
          <template v-slot:[`item.sl_no`]="{ item, index }">
            <div>
              {{ index + 1 }}
            </div>
          </template>
          <template v-slot:[`item.c`]="{ item }">
            <div class="FontSize" v-if="item.c != undefined">
              {{ item.c }}
            </div>
            <div v-else>-</div>
            <!-- <div v-if="SettingStatus == 'ACTIVE'">
              <div
                v-if="item.is_replaced_product_fleet"
                class="green--text FontSize"
              >
                <v-icon small color="green">mdi-swap-horizontal</v-icon>
                REPLACED
              </div>
            </div> -->
          </template>
          <template v-slot:[`item.b`]="{ item }">
            <div class="FontSize">
              {{ item.b || "-" }}
            </div>
          </template>
          <template v-slot:[`item.a`]="{ item }">
            <div class="FontSize">
              {{ item.a || "-" }}
            </div>
          </template>
          <template v-slot:[`item.category_name`]="{ item }">
            <div class="FontSize">
              {{ item.category_name || "-" }}
            </div>

            <div class="FontSize">
              {{ item.product_name || "-" }}
            </div>

            <div class="FontSize">
              {{ item.customer_name || "-" }}
            </div>
          </template>
          <template v-slot:[`item.setting_price`]="{ item }">
            <div class="FontSize" v-if="item.setting_price != undefined">
              {{ item.setting_price }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.setting_description != undefined">
              {{ item.setting_description }}
            </div>
            <div v-else>-</div>
            <div
              class="FontSize red--text"
              v-if="item.invalid_reason != undefined"
            >
              {{ item.invalid_reason }}
            </div>
          </template>
          <template
            v-slot:[`item.organization_products_fleet_status`]="{ item }"
          >
            <div
              class="FontSize"
              v-if="item.organization_products_fleet_status != undefined"
            >
              {{ item.organization_products_fleet_status }}
            </div>
            <div v-else>-</div>
            <div
              v-if="item.representative_name != undefined && item.e == 'ACTIVE'"
              class="FontSize primary--text"
            >
              <v-tooltip v-if="item.request_status == 'TRANSFERED'" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    v-on="on"
                    color="blue"
                    v-bind="attrs"
                    v-if="item.request_status == 'TRANSFERED'"
                    >mdi-pin</v-icon
                  >
                </template>
                <span>Transferred to {{ item.representative_name }}</span>
              </v-tooltip>
              <v-tooltip v-if="item.request_status == 'REQUESTED'" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    v-on="on"
                    v-bind="attrs"
                    class="orange--text"
                    v-if="item.request_status == 'REQUESTED'"
                    >mdi-alpha-r-circle-outline</v-icon
                  >
                </template>
                <span>Requested by {{ item.representative_name }}</span>
              </v-tooltip>
              <v-tooltip v-if="item.request_status == 'APPROVED'" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    v-on="on"
                    v-bind="attrs"
                    class="green--text"
                    v-if="item.request_status == 'APPROVED'"
                    >mdi-check-decagram-outline</v-icon
                  >
                </template>
                <span>Approved to {{ item.representative_name }}</span>
              </v-tooltip>
              {{ item.representative_name }}
            </div>
            <div
              v-else-if="
                item.service_center_name != undefined && item.e == 'ACTIVE'
              "
              class="FontSize primary--text"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="blue--text" v-bind="attrs" v-on="on"
                    >mdi-pin</v-icon
                  >
                </template>
                <span>Transferred to {{ item.service_center_name }}</span>
              </v-tooltip>
              {{ item.service_center_name }}
            </div>
          </template>
          <template
            v-slot:[`item.Actions`]="{ item }"
            v-if="SettingStatus != 'INVALID'"
          >
            <div>
              <v-menu right bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="primary">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense nav>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-if="SettingStatus == 'TAGGED'"
                      @click="checkItem(item, 'UPDATE_TAGGED_PRODUCT_FLEET')"
                    >
                      <v-list-item-icon>
                        <v-icon small color="primary">mdi-pencil-plus</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          >Update Product Fleet</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="SettingStatus == 'ACTIVE'"
                      @click="checkItem(item, 'EDIT')"
                    >
                      <v-list-item-icon>
                        <v-icon small color="primary">mdi-pencil-plus</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          >Update Product Fleet</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="SettingStatus == 'TAGGED'"
                      @click="checkItem(item, 'VIEW_TICKET_DETAILS')"
                    >
                      <v-list-item-icon>
                        <v-icon small color="primary">mdi-ticket</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Ticket Details</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="SettingStatus == 'TAGGED'"
                      @click="checkItem(item, 'CREATE_TICKET')"
                    >
                      <v-list-item-icon>
                        <v-icon small color="primary"
                          >mdi-plus-box-outline</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Create Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="SettingStatus != 'TAGGED'"
                      @click="checkItem(item, 'ACTION')"
                    >
                      <v-list-item-icon>
                        <v-icon
                          small
                          :color="item.e == 'ACTIVE' ? 'red' : 'green'"
                          >{{
                            item.e == "ACTIVE" ? "mdi-close-thick" : "mdi-check"
                          }}</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.e == "ACTIVE" ? "Deactivate" : "Activate"
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="
                        SettingStatus == 'ACTIVE' &&
                        item.request_status != 'APPROVED' &&
                        item.request_status != 'REQUESTED'
                      "
                      @click="checkItem(item, 'TRANSFER_PRODUCT_FLEET')"
                    >
                      <v-list-item-icon>
                        <v-icon small color="green">mdi-share</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          >Transfer Product Fleet</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </div>
          </template>
          <template
            v-slot:[`item.Actions`]="{ item }"
            v-else-if="SettingStatus == 'INVALID'"
          >
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                  @click="checkItem(item, 'EDIT_TO_MAKE_VALID')"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span>Edit to Make Valid</span>
            </v-tooltip>
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  color="red"
                  small
                  v-on="on"
                  @click="checkItem(item, 'DELETE')"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span class="white--text">Delete Invalid Serial Number</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            total-visible="4"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
          <div class="text-center mt-2">(100 items per page)</div>
        </div>
      </v-card>
    </v-card-text>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewTicketDetails from "@/components/Product/Cards/ViewTicketDetails.vue";
import CreateTicketCard from "@/components/Product/Cards/CreateTicketProductFleetNewer.vue";
import CreateUpdateProductFleet from "@/components/Product/Dialogs/CreateUpdateProductFleetNewer.vue";
import CreateUpdateProductFleet2 from "@/components/Product/Dialogs/CreateUpdateProductFleet.vue";
import TransferProductFleet from "@/components/Product/Dialogs/ProductsFleet/TransferProductFleet.vue";
import UpdateTaggedProductFleet from "@/components/Product/Dialogs/ProductsFleet/UpdateTaggedProductFleetNewer.vue";
import DeleteInvalidSerialNumbers from "@/components/Product/Dialogs/ProductsFleet/DeleteInvalidSerialNumbers.vue";
import ActivateDeactivateProductFleet from "@/components/Product/Dialogs/ProductsFleet/ActivateDeactivateProductFleet.vue";
import ProductFleetTransferredHistory from "@/components/Product/Dialogs/ProductsFleet/ProductFleetTransferredHistory.vue";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { ListSerialNumber } from "@/mixins/ScheduleServices/ListSerialNumber.js";
// import { GetAllSearchedSerialNumber } from "@/mixins/Product/ProductFleetSearch.js";
import { GetAllInvalidSerialNumbers } from "@/mixins/Product/ListAllInvalidSerialNumber.js";
// import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
import { GetUserProductFleetDetails } from "@/mixins/Product/GetUserProductFleet.js";
import { getAllProductFleetUsingS3URL } from "@/mixins/Product/GetAllS3ProductFleet.js";
import { getOrgS3DataMethod } from "@/IndexedDB/IndexedDBGetter.js";
export default {
  components: {
    Overlay,
    Snackbar,
    CreateTicketCard,
    ViewTicketDetails,
    TransferProductFleet,
    UpdateTaggedProductFleet,
    CreateUpdateProductFleet,
    CreateUpdateProductFleet2,
    DeleteInvalidSerialNumbers,
    ActivateDeactivateProductFleet,
    ProductFleetTransferredHistory,
  },
  mixins: [
    GenerateS3URL,
    GetAllServices,
    ListSerialNumber,
    // GetAllSearchedSerialNumber,
    GetAllInvalidSerialNumbers,
    // GetAllServiceRepresentative,
    GetUserProductFleetDetails,
    getAllProductFleetUsingS3URL,
  ],
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    search: "",
    Product_id: "ALL",
    current_view: "LIST",
    request_status: "ALL",
    SettingStatus: "ALL",
    representative_id: "ALL",
    SearchBy: "all",
    tagged_serial_numbers: "",
    inactive_serial_numbers: "",
    un_tagged_serial_numbers: "",
    Current_Filter: "WITHOUT_SEARCH",
    loading: false,
    overlay: false,
    renderComp: true,
    isSearching: false,
    showEditButton: false,
    showCreateButton: false,
    TransferProductFleetDialog: false,
    AddUpdateProductFleetDialog: false,
    showActivateDeactivateButton: false,
    dialogActivateInactivateComp: false,
    CreateUpdateProductFleetDialog: false,
    dialogDeleteInvalidSerialNumber: false,
    dialogProductFleetTransferredHistory: false,
    StoreObj: {},
    SnackBarComponent: {},
    StoreObjForTaggedProductFleet: {},
    GetAllServicesList: [],
    GetAllListSerialNumbers: [],
    GetAllInvalidSerialNumberList: [],
    GetAllServiceRepresentativeList: [],
    FilteringArray: [],
    request_status_items: ["ALL", "TRANSFERED", "REQUESTED", "APPROVED"],
    SearchByItems: [
      { text: "All", value: "all" },
      { text: "Serial Number", value: "setting_name" },
      { text: "Contact Person", value: "customer_name" },
      { text: "Customer", value: "customer_company_name" },
    ],
    ProductsHeaders: [
      { text: "#", value: "sl_no" },
      { text: "Serial No", value: "c" },
      { text: "Customer Name", value: "b" },
      { text: "Contact Person Name", value: "a" },
      { text: "Status", value: "e" },
      // { text: "Tagged To", value: "customer_name", width: "20%" },
      // { text: "Price & Desc.", value: "setting_price", width: "13%" },

      { text: "Actions", value: "Actions", width: "10%" },
    ],
    StatusItem: [
      { text: "ALL", value: "ALL" },
      { text: "TAGGED", value: "TAGGED" },
      { text: "UNTAGGED", value: "ACTIVE" },
      { text: "INACTIVE", value: "INACTIVE" },
      { text: "INVALID", value: "INVALID" },
    ],
    columnName: [
      { label: "Cateogory", value: "category_name" },
      { label: "Product", value: "product_name" },
      { label: "Serial Number", value: "setting_name" },
      { label: "Contact Person", value: "customer_name" },
      { label: "Customer", value: "customer_company_name" },
      { label: "Customer Id", value: "customer_unique_id" },
      { label: "Customer contact No.", value: "customer_number" },
      { label: "Customer Address", value: "customer_address" },
      { label: "Customer Id", value: "customer_unique_id" },
      { label: "Price", value: "setting_price" },
      { label: "Description", value: "setting_description" },
      { label: "Invoice Number", value: "invoice_number" },
      { label: "Invoice Date", value: "invoice_date" },
      { label: "Installation Date", value: "product_purchased_on" },
      { label: "Support", value: "support_type" },
      { label: "Support Type", value: "warranty_type" },
      { label: "Support Starts", value: "warranty_start_date" },
      { label: "Support Ends", value: "warranty_end_date" },
    ],
    columnNameInvalidData: [
      { label: "Select Category", value: "category_name" },
      { label: "Select Product", value: "product_name" },
      { label: "Serial Number", value: "setting_name" },
      { label: "Price", value: "setting_price" },
      { label: "Software Version", value: "software_version" },
      { label: "Description", value: "description" },
      { label: "Manufactured Date", value: "product_manufactured_date" },
      {
        label: "Product Fleet Status",
        value: "organization_products_fleet_status",
      },
      { label: "Contact Person Name", value: "customer_name" },
      {
        label: "Customer Country Code",
        value: "customer_primary_country_code",
      },
      {
        label: "Customer Mobile Number",
        value: "customer_primary_contact_number",
      },
      { label: "Invoice Date", value: "invoice_date" },
      { label: "Invoice Number", value: "invoice_number" },
      { label: "Installation Date", value: "product_purchased_on" },
      { label: "Support", value: "support_type" },
      { label: "Support Type", value: "warranty_type" },
      { label: "Support Start Date", value: "warranty_start_date" },
      { label: "Support End Date", value: "warranty_end_date" },
      { label: "Is Schedule Service ?", value: "updated_is_scheduled_service" },
      { label: "Frequency", value: "frequency" },
      {
        label: "Enable Extended Warranty (yes/no)",
        value: "updated_is_extended_warranty",
      },
      { label: "Extended Support", value: "extended_ticket_warranty_type" },
      { label: "Extended Support Type", value: "extended_warranty_type" },
      {
        label: "Extended Support Start Date",
        value: "extended_warranty_start_date",
      },
      {
        label: "Extended Support End Date",
        value: "extended_warranty_end_date",
      },
      { label: "Extended Frequency", value: "extended_warranty_frequency" },
      { label: "Invalid Reason", value: "invalid_reason" },
    ],
    productFleetData: [],
    overallProductFleetData: [],
    filteredProductFleetData: [],
    visitedPages: [],
    productFleetFilteredStatus: [],
    contentFullyLoaded: false,
    overallFilteredProductFleetData: [],
  }),
  watch: {
    search(val) {
      this.page = 1;
      this.visitedPages = [];
      this.overallFilteredProductFleetData = [];
      this.filteredProductFleetData = [];
      if (val.length > 2) {
        const formattedVal = val.toLowerCase().trim();
        if (this.SearchBy !== "all") {
          const keyMap = {
            setting_name: "c",
            customer_name: "a",
            customer_company_name: "b",
          };
          const key = keyMap[this.SearchBy];
          this.overallFilteredProductFleetData =
            this.overallProductFleetData.filter((prod_fleet) => {
              if (key === "all") {
                return Object.values(prod_fleet)
                  .join(" ")
                  .toLowerCase()
                  .includes(formattedVal);
              }

              return String(prod_fleet[key] || "")
                .toLowerCase()
                .includes(formattedVal);
            });
        } else {
          const searchableKeys = ["a", "b", "c"];
          this.overallFilteredProductFleetData =
            this.overallProductFleetData.filter((obj) =>
              searchableKeys.some((key) =>
                String(obj[key] || "")
                  .toLowerCase()
                  .includes(formattedVal)
              )
            );
        }

        this.filteredProductFleetData =
          this.overallFilteredProductFleetData.slice(0, 200);
      }
    },

    page(val) {
      if (
        val % 2 === 0 &&
        !this.visitedPages.includes(val) &&
        this.SettingStatus !== "INVALID"
      ) {
        this.visitedPages.push(val);
        const fromIndex = Number(String(val) + "00");
        const toIndex = fromIndex + 200;
        let sourceArray;
        if (this.overallFilteredProductFleetData.length === 0) {
          if (this.SettingStatus === "INVALID") {
            return;
          } else if (this.SettingStatus === "ALL") {
            sourceArray = this.overallProductFleetData;
          } else {
            sourceArray = this.productFleetFilteredStatus;
          }
          this.productFleetData.push(
            ...[...sourceArray].slice(fromIndex, toIndex)
          );
        } else {
          sourceArray = this.overallFilteredProductFleetData;
          this.filteredProductFleetData.push(
            ...[...sourceArray].slice(fromIndex, toIndex)
          );
        }
      } else {
        if (
          this.next_token != undefined &&
          this.next_token != null &&
          this.next_token != ""
        ) {
          if (this.SettingStatus != "INVALID") {
            this.GetAllListSerialNumberMethod(
              this.SettingStatus,
              this.Product_id == "ALL" ? undefined : this.Product_id,
              this.representative_id == "ALL"
                ? undefined
                : this.representative_id,
              this.next_token,
              this.request_status == "ALL" ? undefined : this.request_status
            );
          } else {
            this.GetAllInvalidSerialNumbersMethod(
              this.next_token,
              "SERIAL_NUMBERS"
            );
          }
        }
      }
    },

    SearchBy(val) {
      if (val) {
        this.search = "";
      }
    },
    request_status(val) {
      if (val != "ALL") {
        this.GetAllListSerialNumbers = [];
        this.GetAllListSerialNumberMethod(
          "ACTIVE",
          undefined,
          this.representative_id == "ALL" ? undefined : this.representative_id,
          undefined,
          val
        );
      } else {
        this.GetAllListSerialNumbers = [];
        this.GetAllListSerialNumberMethod(
          "ACTIVE",
          undefined,
          this.representative_id == "ALL" ? undefined : this.representative_id,
          undefined,
          undefined
        );
      }
    },
    representative_id(val) {
      if (val != "ALL") {
        this.GetAllListSerialNumbers = [];
        this.next_token = "";
        this.GetAllListSerialNumberMethod(
          "ACTIVE",
          undefined,
          val,
          undefined,
          this.request_status == "ALL" ? undefined : this.request_status
        );
      } else {
        this.GetAllListSerialNumbers = [];
        this.GetAllListSerialNumberMethod(
          "ACTIVE",
          undefined,
          undefined,
          undefined,
          this.request_status === "ALL" ? undefined : this.request_status
        );
      }
    },
    async SettingStatus(val) {
      this.visitedPages = [];
      this.page = 1;
      this.search = "";
      this.productFleetData = [];
      this.productFleetFilteredStatus = [];
      this.overallFilteredProductFleetData = [];
      this.filteredProductFleetData = [];

      if (val != "INVALID" && val !== "ALL") {
        this.ProductsHeaders = [
          { text: "#", value: "sl_no" },
          { text: "Serial No", value: "c" },
          { text: "Customer Name", value: "b" },
          { text: "Contact Person Name", value: "a" },
          { text: "Status", value: "e" },
          { text: "Actions", value: "Actions" },
        ];

        this.productFleetFilteredStatus = this.overallProductFleetData.filter(
          (item) => item.e === val
        );
        this.productFleetData = [...this.productFleetFilteredStatus].slice(
          0,
          200
        );
      } else if (val === "ALL") {
        this.ProductsHeaders = [
          { text: "#", value: "sl_no" },
          { text: "Serial No", value: "c" },
          { text: "Customer Name", value: "b" },
          { text: "Contact Person Name", value: "a" },
          { text: "Status", value: "e" },
        ];
        this.productFleetData = [...this.overallProductFleetData].slice(0, 200);
      } else {
        this.ProductsHeaders = [
          { text: "#", value: "sl_no", width: "6%" },
          { text: "Category & Product", value: "category_name", width: "15%" },
          { text: "Serial No. & Age", value: "setting_name", width: "14%" },
          { text: "Tagged To", value: "customer_name", width: "20%" },
          { text: "Price & Desc.", value: "setting_price", width: "13%" },
          {
            text: "Fleet Status",
            value: "organization_products_fleet_status",
            width: "11%",
          },
          { text: "Actions", value: "Actions", width: "10%" },
        ];
        this.GetAllInvalidSerialNumberList = [];
        this.GetAllInvalidSerialNumbersMethod(
          undefined,
          "SERIAL_NUMBERS",
          undefined,
          undefined
        );
      }
    },
    Product_id(val) {
      this.GetAllListSerialNumbers = [];
      this.search = "";
      this.isSearching = false;
      this.GetAllListSerialNumberMethod(
        this.SettingStatus,
        val === "ALL" ? undefined : val,
        undefined,
        undefined,
        this.request_status == "ALL" ? undefined : this.request_status
      );
    },
  },
  async mounted() {
    this.GetAccessModuleMethod();
    this.TableHeight = window.innerHeight - 200;
    this.overallProductFleetData = await this.getIndexedDbDataMethod();

    this.productFleetData = [...this.overallProductFleetData].slice(0, 200);
    if (this.SettingStatus === "ALL") {
      this.ProductsHeaders = [
        { text: "#", value: "sl_no" },
        { text: "Serial No", value: "c" },
        { text: "Customer Name", value: "b" },
        { text: "Contact Person Name", value: "a" },
        { text: "Status", value: "e" },
      ];
    }
    this.GetAllServicesMethod("PRODUCT", "ACTIVE");
  },
  methods: {
    async getIndexedDbDataMethod() {
      this.overlay = true;
      let indexedDbDataObj = await getOrgS3DataMethod();
      const maxRetries = 60; // 60 retries × 1000ms = 60 seconds
      let retries = 0;
      while (
        (!indexedDbDataObj || !indexedDbDataObj.product_fleet_data) &&
        retries < maxRetries
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        indexedDbDataObj = await getOrgS3DataMethod();
        retries++;
      }
      if (indexedDbDataObj && indexedDbDataObj.product_fleet_data) {
        return this.callPromiseWithDelayMethod(
          indexedDbDataObj.product_fleet_data
        );
      } else {
        this.overlay = false;
        return [];
      }
    },
    async callPromiseWithDelayMethod(productFleetData) {
      this.overlay = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(productFleetData);
          this.overlay = false;
          this.contentFullyLoaded = true;
        }, 500);
      }).then((response) => response);
    },

    exporttoexcel() {
      if (this.SettingStatus == "INVALID") {
        this.GetAllInvalidSerialNumberList.map((item) => {
          if (item.is_scheduled_service != undefined) {
            item.is_scheduled_service == 1
              ? (item.updated_is_scheduled_service = "yes")
              : "";
          }
          if (item.is_extended_warranty != undefined) {
            item.is_extended_warranty == 1
              ? (item.updated_is_extended_warranty = "yes")
              : "";
          }
          if (item.invalid_reason != undefined) {
            item.invalid_reason = item.invalid_reason[0];
          }
          if (item.customer_primary_country_code != undefined) {
            item.customer_primary_country_code == "+91"
              ? (item.customer_primary_country_code = "91")
              : "";
          }
          if (
            item.warranty_start_date != undefined &&
            item.warranty_start_date != "-"
          ) {
            let old_warranty_start_date = item.warranty_start_date;
            var parts = old_warranty_start_date.split("-");
            var new_warranty_start_date =
              parts[2] + "-" + parts[1] + "-" + parts[0];
            item.warranty_start_date = new_warranty_start_date;
          } else {
            item.warranty_start_date = "";
          }
          if (
            item.warranty_end_date != undefined &&
            item.warranty_end_date != "-"
          ) {
            let old_warranty_end_date = item.warranty_end_date;
            var parts = old_warranty_end_date.split("-");
            var new_warranty_end_date =
              parts[2] + "-" + parts[1] + "-" + parts[0];
            item.warranty_end_date = new_warranty_end_date;
          } else {
            item.warranty_end_date = "";
          }
          if (item.invoice_date != undefined && item.invoice_date != "-") {
            let old_invoice_date = item.invoice_date;
            var parts = old_invoice_date.split("-");
            var new_invoice_date = parts[2] + "-" + parts[1] + "-" + parts[0];
            item.invoice_date = new_invoice_date;
          } else {
            item.invoice_date = "";
          }
          if (
            item.product_purchased_on != undefined &&
            item.product_purchased_on != "-"
          ) {
            let old_product_purchased_on = item.product_purchased_on;
            var parts = old_product_purchased_on.split("-");
            var new_product_purchased_on =
              parts[2] + "-" + parts[1] + "-" + parts[0];
            item.product_purchased_on = new_product_purchased_on;
          } else {
            item.product_purchased_on = "";
          }
          if (
            item.product_manufactured_date != undefined &&
            item.product_manufactured_date != "-"
          ) {
            let old_product_manufactured_date = item.product_manufactured_date;
            var parts = old_product_manufactured_date.split("-");
            var new_product_manufactured_date =
              parts[2] + "-" + parts[1] + "-" + parts[0];
            item.product_manufactured_date = new_product_manufactured_date;
          } else {
            item.product_manufactured_date = "";
          }
          if (
            item.extended_warranty_start_date != undefined &&
            item.extended_warranty_start_date != "-"
          ) {
            let old_extended_warranty_start_date =
              item.extended_warranty_start_date;
            var parts = old_extended_warranty_start_date.split("-");
            var new_extended_warranty_start_date =
              parts[2] + "-" + parts[1] + "-" + parts[0];
            item.extended_warranty_start_date =
              new_extended_warranty_start_date;
          } else {
            item.extended_warranty_start_date = "";
          }
          if (
            item.extended_warranty_end_date != undefined &&
            item.extended_warranty_end_date != "-"
          ) {
            let old_extended_warranty_end_date =
              item.extended_warranty_end_date;
            var parts = old_extended_warranty_end_date.split("-");
            var new_extended_warranty_end_date =
              parts[2] + "-" + parts[1] + "-" + parts[0];
            item.extended_warranty_end_date = new_extended_warranty_end_date;
          } else {
            item.extended_warranty_end_date = "";
          }
        });
      } else {
        const customerDetailsMapped = new Map(this.FilteringArray);

        this.GetAllListSerialNumbers.map((item) => {
          let newCustomerArray = customerDetailsMapped.get(item.customer_id);

          if (newCustomerArray) {
            item.customer_number = newCustomerArray.customer_number;
            item.customer_address = newCustomerArray.customer_address;
          } else {
            item.customer_number = "N/A";
            item.customer_address = "N/A";
          }
        });
      }
      let data = [
        {
          sheet: "Product Fleets",
          columns:
            this.SettingStatus != "INVALID"
              ? this.columnName
              : this.columnNameInvalidData,
          content:
            this.SettingStatus != "INVALID"
              ? this.GetAllListSerialNumbers
              : this.GetAllInvalidSerialNumberList,
        },
      ];
      let settings = {
        fileName: "Product Fleets",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    getAge(days) {
      var years = Math.floor(days / 365);
      var remainingDaysFromYear = days % 365;
      var months = Math.floor(remainingDaysFromYear / 30);
      var remainingDaysFromMonth = remainingDaysFromYear % 30;
      var yearDisplay =
        years > 0 ? years + (years == 1 ? "Year " : " Years ") : "";
      var monthDisplay =
        months > 0 ? months + (months == 1 ? " Month " : " Month ") : "";
      var daysDisplay =
        remainingDaysFromMonth > 0
          ? remainingDaysFromMonth +
            (remainingDaysFromMonth == 1 ? " Day" : " Days ")
          : "";
      return yearDisplay + monthDisplay + daysDisplay;
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
          if (item.module_name == "Products") {
            if (item.sub_modules[1].module_name == "Product Fleet") {
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
    async AddUpdateProductFleetDialogEmit(Toggle) {
      this.AddUpdateProductFleetDialog = false;
      if (Toggle == 2) {
        this.overlay = true;
        setTimeout(async () => {
          this.overallProductFleetData =
            await this.getAllProductFleetUsingS3URLMethod();
          this.SettingStatus = "ALL";
        }, 5000);
      }
    },
    checkExcelPresent() {
      document.getElementById("uploadExcel").click();
      // if (this.$refs["excel-upload-input"]) {
      //   this.$refs["excel-upload-input"].click();
      // }
    },
    async handleClick(e) {
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `PRODUCT_FLEET/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "File Uploaded Successfully!!",
        };
        this.refreshComponentMethod();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Something Went Wrong!! Please Try Again!!",
        };
      }
      this.overlay = false;
    },
    refreshComponentMethod() {
      this.renderComp = false;
      this.$nextTick(() => {
        this.renderComp = true;
      });
    },
    downloadExcelBaseMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Select Category",
        "Select Product",
        "Serial Number",
        "Price",
        "Software Version",
        "Description",
        "Manufactured Date",
        "Product Fleet Status",
        "Contact Person Name",
        "Customer Country Code",
        "Customer Mobile Number",
        "Customer ID",
        "Invoice Date",
        "Invoice Number",
        "Installation Date",
        "Support",
        "Support Type",
        "Support Start Date",
        "Support End Date",
        "Is Schedule Service ?",
        "Frequency",
        "Enable Extended Warranty (yes/no)",
        "Extended From And to Date_1",
        "Extended From And to Date_2",
        "Extended From And to Date_3",
        "Extended Support_1",
        "Extended Support_2",
        "Extended Support_3",
        "Extended Support Type_1",
        "Extended Support Type_2",
        "Extended Support Type_3",
        "Extended Frequency_1",
        "Extended Frequency_2",
        "Extended Frequency_3",
        "Total Extended Entry Count",
      ];
      // let customerList = ["ABC", "DEF", "GHI"];
      async function generateExcel() {
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Bulk Upload Deal Fields");
          sheet.addRow(fieldNamesArray);
          for (let num = 2; num < 5000; num++) {
            for (let i = 0; i < sheet._columns.length; i++) {
              sheet.getColumn(sheet._columns[i].number).width = 32;
              // switch (sheet.getCell(1, sheet._columns[i].number).value) {
              //   case "Customer Name":
              //     sheet.getCell(num, sheet._columns[i].number).dataValidation =
              //       {
              //         type: "list",
              //         formulae: [`"${customerList}"`],
              //       };
              //     break;
              // }
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
            downloadLink.download = `BulkTagging-Product-${new Date().toLocaleString(
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
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.StoreObjForTaggedProductFleet = item;
      this.StoreObjForTaggedProductFleet.action = action;
      if (action == "EDIT") {
        this.CreateUpdateProductFleetDialog = true;
      } else if (action === "ACTION") {
        this.dialogActivateInactivateComp = true;
      } else if (action == "CREATE_TICKET") {
        this.current_view = "CREATE_TICKET";
        this.StoreObj.create_ticket_from = "MAIN_PORTAL";
      } else if (action == "VIEW_TICKET_DETAILS") {
        this.current_view = "VIEW_TICKET_DETAILS";
      } else if (action == "UPDATE_TAGGED_PRODUCT_FLEET") {
        this.AddUpdateProductFleetDialog = true;
      } else if (action == "TRANSFER_PRODUCT_FLEET") {
        this.TransferProductFleetDialog = true;
      } else if (action == "DELETE") {
        this.dialogDeleteInvalidSerialNumber = true;
      } else if (action == "PRODUCT_FLEET_TRANSFERRED_HISTORY") {
        this.dialogProductFleetTransferredHistory = true;
      } else if (action == "EDIT_TO_MAKE_VALID") {
        this.CreateUpdateProductFleetDialog = true;
      }
    },
    CreateTicketCardEmit(Toggle, Status_Message) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: Status_Message,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    ViewTicketDetailsEmit() {
      this.current_view = "LIST";
    },
    async CreateUpdateProductFleetDialogEmit(Toggle) {
      this.CreateUpdateProductFleetDialog = false;
      this.GetAllInvalidSerialNumberList = [];
      this.GetAllInvalidSerialNumbersMethod(undefined, "SERIAL_NUMBERS");
      this.overlay = true;
      if (Toggle == 2) {
        setTimeout(async () => {
          this.overallProductFleetData =
            await this.getAllProductFleetUsingS3URLMethod();
          this.SettingStatus = "ALL";
        }, 5000);
      }
    },
    async TransferProductFleetDialogEmit(Toggle) {
      this.TransferProductFleetDialog = false;
      if (Toggle == 2) {
        this.overlay = true;
        setTimeout(async () => {
          this.overallProductFleetData =
            await this.getAllProductFleetUsingS3URLMethod();
          this.SettingStatus = "ALL";
        }, 5000);
      }
    },
    dialogProductFleetTransferredHistoryEmit() {
      this.dialogProductFleetTransferredHistory = false;
    },
    dialogDeleteInvalidSerailNumberEmit(Toggle) {
      this.dialogDeleteInvalidSerialNumber = false;
      this.GetAllInvalidSerialNumbersMethod(undefined, "SERIAL_NUMBERS");
    },
    async dialogActivateInactivateCompEmit(Toggle) {
      this.dialogActivateInactivateComp = false;
      if (Toggle == 2) {
        this.dialogActivateInactivateComp = false;
        this.overlay = true;
        setTimeout(async () => {
          this.overallProductFleetData =
            await this.getAllProductFleetUsingS3URLMethod();
          this.SettingStatus = "ALL";
        }, 5000);
      }
    },
    UploadExcelCardEmit(Toggle, Status_Message) {
      this.current_view = "LIST";
      this.GetSerialNumbersMethod(this.status, undefined);
      if (Toggle == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: Status_Message,
        };
      }
    },
    searchvalue(isSearching = true) {
      if (
        this.search != "" &&
        this.search != null &&
        this.search != undefined
      ) {
        (this.GetAllListSerialNumbers = []),
          (this.next_token = undefined),
          setTimeout(() => {
            this.searchcustomerandserialNoMethod(
              this.SettingStatus,
              this.search,
              this.SearchBy
            );
          }, 200);
      } else {
        this.isSearching = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Type Something to Search..!",
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    abcsearch() {
      if (this.isSearching == true) {
        this.GetAllListSerialNumbers = [];
      }
      this.GetAllListSerialNumbers = [];
      this.GetAllListSerialNumberMethod(
        this.SettingStatus,
        undefined,
        undefined,
        undefined,
        undefined
      );
    },
  },
};
</script>
