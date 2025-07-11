<template>
  <div>
    <!--THIS IS DEV BRANCH-->
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="snackbarRenderComp"
    />
    <Overlay :overlay="overlay" />
    <ActivateInactivateCustomerDialog
      :StoreObj="StoreObj"
      :dialogActivateInactivateCustomer="dialogActivateInactivateCustomer"
      @clicked="dialogActivateInactivateCustomerEmit"
    />
    <DeleteInvalidCustomer
      :StoreObj="StoreObj"
      :dialogDeleteInvalidCustomer="dialogDeleteInvalidCustomer"
      @clicked="dialogDeleteInvalidCustomerEmit"
    />
    <CustomerTabCard
      v-if="current_view == 'TABVIEW'"
      :StoreObj="StoreObj"
      @clicked="EmitTab"
    />
    <v-card-text v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew py-0 ml-n1 mt-1">
          Customers
          <span v-if="isSearching == false">
            <span
              v-if="
                this.customer_type == 'INDIVIDUAL' &&
                this.customer_status != 'INVALID'
              "
              >{{ individual_customers }}</span
            >
            <span
              v-else-if="
                this.customer_type == 'BUSINESS' &&
                this.customer_status != 'INVALID'
              "
              >{{ business_customers }}</span
            >
            <span
              v-else-if="
                this.customer_type == 'ALL' && this.customer_status != 'INVALID'
              "
              >{{ active_customers + inactive_customers }}</span
            >
          </span>
          <span v-else class="FontSize green--text">
            <v-icon small color="green">mdi-magnify</v-icon>
            Search Results
            <span
              ><v-btn icon @click="ClearMethod(isSearching == true)"
                ><v-icon color="red" small>mdi-close</v-icon></v-btn
              ></span
            >
          </span>
        </div>
        <v-spacer />
        <v-form ref="form">
          <v-row class="space-arrounf mr-2 mt-3">
            <v-select
              dense
              outlined
              label="Customer Type *"
              v-model="customer_type"
              :items="customer_type_items"
              :rules="[(v) => !!v || 'Required']"
              class="FontSize maxWidthXSmall ml-2"
            ></v-select>
            <v-select
              dense
              outlined
              label="Customer Status *"
              v-model="customer_status"
              :items="customer_status_items"
              :rules="[(v) => !!v || 'Required']"
              class="FontSize maxWidthXSmall ml-2"
            ></v-select>
            <!-- <v-select
              dense
              outlined
              item-text="text"
              item-value="value"
              v-model="SearchBy"
              label="Search By *"
              :items="SearchByItems"
              :rules="[(v) => !!v || 'Required']"
              class="mr-2 ml-2 WidthVariation2 FontSize"
            ></v-select> -->
            <v-text-field
              dense
              outlined
              label="Search anything from the table"
              v-model="search"
              :rules="[(v) => !!v || 'Required']"
              class="ml-2 FontSize WidthVariation1"
            >
              <!-- <template v-slot:append>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == false"
                  @click="GetCustomersByFilterMethod((isSearching = true))"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  v-if="isSearching == true"
                  @click="ClearMethod(isSearching == true)"
                >
                  <v-icon color="primary" small>mdi-close</v-icon>
                </v-btn>
              </template> -->
            </v-text-field>
          </v-row>
        </v-form>
        <!-- <v-btn
          v-if="customer_status === 'ACTIVE'"
          color="primary"
          small
          @click="
            $router.push({
              name: 'TicketReports',
              params: { page: 'CUSTOMERS' },
            })
          "
        >
          <v-icon>mdi-file-excel-outline</v-icon>
        </v-btn> -->
        <!-- <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs"
              ><v-icon color="primary">mdi-dots-vertical</v-icon></v-btn
            >
          </template>
          <v-card>
            <v-card-actions>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      @click="checkExcelPresent()"
                      class="primary white--text text-capitalize ml-2"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'CUSTOMER'
                        )
                      "
                    >
                      <input
                        type="file"
                        id="uploadExcel"
                        @change="handleClick"
                        ref="excel-upload-input"
                        class="excel-upload-input"
                        v-if="renderCompBulkUpload"
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
                      'CUSTOMER'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Upload Customers</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      v-show="showCreateButton"
                      @click="downloadExcelBaseMethod()"
                      class="primary white--text text-capitalize ml-2"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'CUSTOMER'
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
                      'CUSTOMER'
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
                    class="primary white--text ml-2"
                    @click="
                      (current_view = 'CREATE'), (StoreObj.action = 'CREATE')
                    "
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Add Customer</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-menu> -->
      </v-toolbar>
      <v-data-table
        :search="search"
        dense
        class="mt-2"
        fixed-header
        :page.sync="page"
        :headers="headers"
        hide-default-footer
        :items-per-page="50"
        :height="TableHeight"
        style="cursor: pointer"
        :no-data-text="noDataText"
        @click:row="handleRowClick"
        @page-count="pageCount = $event"
        :items="
          Current_Filter === 'WITHOUT_SEARCH' &&
          this.customer_status != 'INVALID'
            ? GetAllCustomersData
            : Current_Filter != 'WITHOUT_SEARCH' &&
              this.customer_status != 'INVALID'
            ? GetAllSearchCustomerList
            : GetAllCustomerInvalidList
        "
      >
        <template
          v-slot:[`item.sl_no`]="{ item }"
          v-if="
            Current_Filter == 'WITHOUT_SEARCH' &&
            this.customer_status != 'INVALID'
          "
        >
          <div>
            {{ GetAllCustomersData.indexOf(item) + 1 }}
            <v-tooltip color="primary" right v-if="item.is_secondary_customer">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  v-on="on"
                  class="ml-2"
                  v-bind="attrs"
                  color="primary"
                  v-if="item.is_secondary_customer"
                  >mdi-alpha-s-box</v-icon
                >
              </template>
              <span>Secondary Customer</span>
            </v-tooltip>
          </div>
        </template>
        <template
          v-slot:[`item.sl_no`]="{ item }"
          v-else-if="
            Current_Filter != 'WITHOUT_SEARCH' &&
            this.customer_status != 'INVALID'
          "
        >
          <div>
            {{ GetAllSearchCustomerList.indexOf(item) + 1 }}
            <v-tooltip color="primary" right v-if="item.is_secondary_customer">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  v-on="on"
                  class="ml-2"
                  v-bind="attrs"
                  color="primary"
                  v-if="item.is_secondary_customer"
                  >mdi-alpha-s-box</v-icon
                >
              </template>
              <span>Secondary Customer</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:[`item.sl_no`]="{ item }" v-else>
          <div>
            {{ GetAllCustomerInvalidList.indexOf(item) + 1 }}
          </div>
        </template>
        <template v-slot:[`item.customer_company_name`]="{ item }">
          <div class="FontSize">
            {{ item.customer_company_name }}
          </div>
          <div class="FontSize">
            {{ item.customer_name }}
          </div>
          <div
            class="FontSize red--text"
            v-if="
              item.invalid_reason != undefined && customer_status == 'INVALID'
            "
          >
            {{ item.invalid_reason }}
          </div>
        </template>
        <template v-slot:[`item.customer_category_name`]="{ item }">
          <div
            class="FontSize"
            v-if="
              item.customer_category_name != undefined &&
              item.customer_category_name != ''
            "
          >
            {{ item.customer_category_name }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.customer_created_on != undefined">
            {{
              new Date(item.customer_created_on * 1000).toLocaleDateString(
                "en-GB"
              )
            }}
          </div>
          <div v-else>-</div>
        </template>
        <template
          v-slot:[`item.primary_representative_details.user_name`]="{ item }"
        >
          <div
            class="FontSize"
            v-if="item.primary_representative_details != undefined"
          >
            <span
              v-if="
                item.primary_representative_details.user_name != undefined &&
                item.primary_representative_details.user_name != ''
              "
            >
              <span v-if="item.enable_auto_assign">
                {{ item.primary_representative_details.user_name }}
              </span>
              <span v-else>-</span>
            </span>
            <span v-else>-</span>
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.products_fleet_list`]="{ item }">
          <div v-if="item.products_fleet_list != undefined" class="FontSize">
            {{ item.products_fleet_list.length }}
          </div>
          <div v-else>0</div>
        </template>
        <template v-slot:[`item.customer_primary_contact_number`]="{ item }">
          <div
            class="FontSize"
            v-if="item.customer_primary_contact_number != undefined"
          >
            <span v-if="item.customer_primary_country_code != undefined">
              {{ item.customer_primary_country_code }}</span
            >-{{ item.customer_primary_contact_number }}
          </div>
          <div
            class="FontSize font-weight-bold"
            v-if="item.customer_unique_id != undefined"
          >
            Cust ID :
            <span class="font-weight-regular">
              {{ item.customer_unique_id }}
            </span>
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.Actions`]="{ item }">
          <v-tooltip
            color="primary"
            bottom
            v-if="!item.invalid_reason && customer_status != 'INVALID'"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-on="on"
                v-bind="attrs"
                v-show="showActivateDeactivateButton"
                @click.stop="checkItem(item, 'ACTION')"
                :color="item.customer_status == 'ACTIVE' ? 'red' : 'green'"
                ><v-icon small>{{
                  item.customer_status == "ACTIVE"
                    ? "mdi-close-thick"
                    : "mdi-check"
                }}</v-icon></v-btn
              >
            </template>
            <span
              v-text="
                item.customer_status == 'ACTIVE'
                  ? `Deactivate ${item.customer_name}`
                  : `Activate ${item.customer_name}`
              "
            ></span>
          </v-tooltip>
          <v-tooltip
            bottom
            v-if="item.invalid_reason && customer_status == 'INVALID'"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                v-on="on"
                v-bind="attrs"
                color="primary"
                @click.stop="checkItem(item, 'UPDATE_INVALID_CUSTOMER')"
                >mdi-pencil-plus</v-icon
              >
            </template>
            <span>Update {{ item.customer_name }}</span>
          </v-tooltip>
          <v-tooltip
            bottom
            v-if="item.invalid_reason && customer_status == 'INVALID'"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                v-on="on"
                color="red"
                class="ml-2"
                v-bind="attrs"
                @click.stop="checkItem(item, 'DELETE_INVALID_CUSTOMER')"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Delete {{ item.customer_name }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-pagination
        v-model="page"
        total-visible="4"
        :length="pageCount"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </v-card-text>
  </div>
</template>
<script>
import Vue from "vue";
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import CustomerTabCard from "@/components/Customers/Cards/CustomerTagCard.vue";
import DeleteInvalidCustomer from "@/components/Customers/Dialogs/DeleteInvalidCustomer.vue";
import ActivateInactivateCustomerDialog from "@/components/Customers/Dialogs/ActivateInactivateCustomerDialog.vue";
import { GetAllCustomerBySearch } from "@/mixins/Terretories/GetCustomerListBySearch.js";
import { GetAllInvalidCustomers } from "@/mixins/Customers/GetAllCustomerInvalidDatas.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import { getServicePartnerCustomerData } from "@/mixins/Customers/GetServicePartnerCustomerData.js";
export default {
  mixins: [
    GetAllCustomerBySearch,
    GetAllInvalidCustomers,
    GetAllOrganizationSettingsTypesInMS,
    getServicePartnerCustomerData,
  ],
  components: {
    Overlay,
    Snackbar,
    CustomerTabCard,

    DeleteInvalidCustomer,
    ActivateInactivateCustomerDialog,
  },
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    search: "",
    customer_type: "",
    active_customers: "",
    current_view: "LIST",
    business_customers: "",
    individual_customers: "",
    noDataText: "No tagged customers found..!",
    SearchBy: "customer_name",
    customer_status: "ACTIVE",
    Current_Filter: "WITHOUT_SEARCH",
    overlay: false,
    isSearching: false,
    showCreateButton: false,
    snackbarRenderComp: true,
    renderCompBulkUpload: true,
    dialogDeleteInvalidCustomer: false,
    showActivateDeactivateButton: false,
    dialogActivateInactivateCustomer: false,
    StoreObj: {},
    SnackBarComponent: {},
    GetAllOrganizationSettingsTypesObject: {},
    GetAllCustomersData: [],
    GetAllCustomerInvalidList: [],
    customer_type_items: ["INDIVIDUAL", "BUSINESS", "ALL"],
    customer_status_items: ["ACTIVE", "INACTIVE", "INVALID"],
    columnName: [
      { label: "Contact Person", value: "customer_name" },
      { label: "Customer", value: "customer_company_name" },
      { label: "Contact Number", value: "customer_primary_contact_number" },
      {
        label: "Secondary Contact Number",
        value: "customer_secondary_contact_number",
      },
      { label: "Mail Id", value: "customer_email_id" },
      { label: "Address", value: "customer_address" },
      { label: "Customer ID", value: "customer_unique_id" },
      { label: "Customer Type", value: "customer_type" },
      { label: "Category", value: "customer_category_name" },
      { label: "Created On", value: "new_customer_created_on" },
      { label: "Products Count", value: "products_fleet_list.length" },
      {
        label: "Primary Tagged Technician",
        value: "new_primary_technician_details",
      },
      {
        label: "Secondary Tagged Technician",
        value: "new_secondary_representative_details",
      },
    ],
    columnNameInvalidCustomers: [
      { label: "Contact Person Name", value: "customer_name" },
      { label: "Email Id", value: "customer_email_id" },
      { label: "Customer Name", value: "customer_company_name" },
      { label: "Customer ID", value: "customer_unique_id" },
      { label: "Latitude", value: "customer_latitude" },
      { label: "Longitude", value: "customer_longitude" },
      { label: "Shipping Address", value: "customer_address" },
      { label: "Shipping City", value: "city" },
      { label: "Shipping State", value: "state" },
      { label: "Shipping Pincode", value: "customer_pincode" },
      { label: "Billing Address", value: "customer_billing_address" },
      { label: "Billing City", value: "customer_billing_city" },
      { label: "Billing State", value: "customer_billing_state" },
      { label: "Billing Pincode", value: "customer_billing_pincode" },
      {
        label: "Primary Contact Country Code",
        value: "customer_primary_country_code",
      },
      {
        label: "Primary Contact Number",
        value: "customer_primary_contact_number",
      },
      {
        label: "Secondary Contact Country Code",
        value: "customer_secondary_country_code",
      },
      {
        label: "Secondary Contact Number",
        value: "customer_secondary_contact_number",
      },
      { label: "Customer Type", value: "customer_type" },
      { label: "Category", value: "category_name" },
      {
        label: "Primary Tagged Technician Contact Number",
        value: "primary_representative_contact_number",
      },
      {
        label: "Secondary Tagged Technician Contact Number",
        value: "secondary_representative_contact_number",
      },
      {
        label: "Invalid Reason",
        value: "updated_invalid_reason",
      },
    ],
    headers: [
      { text: "#", value: "sl_no", width: "7%" },
      { text: "Customer", value: "customer_company_name", width: "25%" },
      { text: "Category", value: "customer_category_name", width: "13%" },
      {
        text: "Technicians",
        value: "primary_representative_details.user_name",
        width: "15%",
      },
      { text: "Products", value: "products_fleet_list", width: "10%" },
      {
        text: "Phone",
        value: "customer_primary_contact_number",
        width: "12%",
      },
      { text: "Actions", value: "Actions", width: "8%" },
    ],
    SearchByItems: [
      {
        text: "Contact Person",
        value: "customer_name",
      },
      {
        text: "Customer",
        value: "customer_company_name",
      },
      {
        text: "Phone Number",
        value: "customer_primary_phone_number",
      },
      {
        text: "Customer ID",
        value: "customer_unique_id",
      },
    ],
  }),
  watch: {
    // search(val) {
    //   if (val != "") {
    //     this.isSearching = false;
    //   }
    // },

    async customer_status(val) {
      if (val != "INVALID") {
        console.log("CUSTOMER_STATUS");
        this.GetAllCustomersData = [];
        // this.GetAllCustomersListMethod(val, this.customer_type, undefined);
        this.GetAllCustomersData =
          await this.getServicePartnerCustomerDataMethod(
            val,
            this.customer_type
          );
        this.page = 1;
      } else {
        this.GetAllCustomerInvalidList = [];
        this.GetAllInvalidCustomersMethod(undefined);
      }
    },
    async customer_type(val) {
      console.log("CUSTOMER_TYPE");
      this.GetAllCustomersData = [];
      //   this.GetAllCustomersListMethod(this.customer_status, val, undefined);
      this.GetAllCustomersData = await this.getServicePartnerCustomerDataMethod(
        this.customer_status,
        val
      );
      this.page = 1;
    },
  },
  async mounted() {
    this.GetAccessModuleMethod();
    this.TableHeight = window.innerHeight - 180;
    // this.GetAllCustomersData = await this.getServicePartnerCustomerDataMethod();
    this.GetAllCustomersData = await this.getServicePartnerCustomerDataMethod(
      this.customer_status,
      this.customer_type
    );
    console.log("CUSTOMER_DATA", this.GetAllCustomersData);
    await this.GetAllOrganizationSettingsTypesMethod();
    this.customer_type = await this.GetAllOrganizationSettingsTypesObject
      .default_customer_type;
    if (
      this.$route.params.call_rfs_data &&
      this.$route.params.call_rfs_data.rfs_id
    ) {
      this.current_view = "CREATE";
      this.StoreObj.action = "CREATE";
      this.StoreObj.call_rfs_data = this.$route.params.call_rfs_data;
    }
  },
  methods: {
    exporttoexcel() {
      this.GetAllCustomersData.map((item) => {
        item.new_customer_created_on = new Date(
          item.customer_created_on * 1000
        ).toLocaleString("en-GB");
        item.new_primary_technician_details =
          item.primary_representative_details != undefined
            ? item.primary_representative_details.user_name
            : "";
        item.new_secondary_representative_details =
          item.secondary_representative_details != undefined
            ? item.secondary_representative_details.user_name
            : "";
        this.$forceUpdate();
      });
      this.GetAllCustomerInvalidList.map((item) => {
        item.updated_invalid_reason =
          item.invalid_reason != undefined
            ? typeof item.invalid_reason == "string"
              ? item.invalid_reason
              : item.invalid_reason.length == 1
              ? item.invalid_reason[0]
              : item.invalid_reason.length == 2
              ? `${item.invalid_reason[0]}, ${item.invalid_reason[1]}`
              : "Multiple Invalid Reasons"
            : "";
        this.$forceUpdate();
      });
      let data = [
        {
          sheet:
            this.customer_status != "INVALID"
              ? "Customers"
              : "Invalid Customers",
          columns:
            this.customer_status != "INVALID"
              ? this.columnName
              : this.columnNameInvalidCustomers,
          content:
            this.customer_status != "INVALID"
              ? this.GetAllCustomersData
              : this.GetAllCustomerInvalidList,
        },
      ];
      let settings = {
        fileName:
          this.customer_status != "INVALID" ? "Customers" : "Invalid Customers",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    refreshComponentMethod() {
      this.renderCompBulkUpload = false;
      this.$nextTick(() => {
        this.renderCompBulkUpload = true;
      });
    },
    async handleClick(e) {
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `customer_bulk_upload/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.snackbarRenderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText:
              "Uploaded Successfully, Please get back in some time !!",
          };
          this.snackbarRenderComp = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
      } else {
        this.snackbarRenderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Something Went Wrong!! Please Try Again!!",
          };
          this.snackbarRenderComp = true;
        });
      }
      this.overlay = false;
    },
    checkExcelPresent() {
      document.getElementById("uploadExcel").click();
    },
    downloadExcelBaseMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Customer Type",
        "Customer Name",
        "Contact Person Name",
        "Primary Contact Country Code",
        "Primary Contact Number",
        "Secondary Contact Country Code",
        "Secondary Contact Number",
        "Customer Category",
        "Customer Website",
        "Email Id",
        "Customer ID",
        "Latitude",
        "Longitude",
        "Shipping Address",
        "Shipping City",
        "Shipping State",
        "Shipping Pincode",
        "Billing Address",
        "Billing City",
        "Billing State",
        "Billing Pincode",
        "Territory Name",
        "Primary Technician Ph Number",
        "Secondary Technician Ph Number",
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
            downloadLink.download = `Bulk-Upload-Customers-${new Date().toLocaleString(
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
          if (item.module_name == "Customers") {
            item.module_rights.map((moduleRights) => {
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
        });
      } else {
        this.showCreateButton = true;
        this.showEditButton = true;
        this.showActivateDeactivateButton = true;
      }
    },
    async ClearMethod() {
      this.isSearching = false;
      this.Current_Filter = "WITHOUT_SEARCHING";
      this.Current_Filter = "WITHOUT_SEARCH";
      this.search = "";
      this.GetAllCustomersData = [];
      setTimeout(async () => {
        this.GetAllCustomersData =
          await this.getServicePartnerCustomerDataMethod(
            this.customer_status,
            this.customer_type
          );
        // this.GetAllCustomersListMethod(
        //   this.customer_status,
        //   this.customer_type,
        //   undefined
        // );
      }, 300);
    },
    GetCustomersByFilterMethod(isSearching = true) {
      if (this.$refs.form.validate()) {
        this.Current_Filter = "WITH_SEARCH";
        this.GetAllCustomerBySearchMethod(
          this.customer_status,
          this.search,
          this.SearchBy,
          this.customer_type
        );
      } else {
        this.isSearching = false;
      }
    },
    async EmitTab() {
      this.page = 1;
      this.current_view = "LIST";
      this.GetAllCustomersData = [];
      this.GetAllCustomersData = await this.getServicePartnerCustomerDataMethod(
        this.customer_status,
        this.customer_type
      );
      //   this.GetAllCustomersListMethod(
      //     this.customer_status,
      //     this.customer_type,
      //     undefined
      //   );
    },
    handleRowClick(item) {
      this.StoreObj = item;
      this.current_view = "TABVIEW";
      this.StoreObj.action = "MOREACTION";
      this.count = 1;
      console.log("CUSTOMER_ROW_CLICK", this.StoreObj);
    },
    dialogDeleteInvalidCustomerEmit(Toggle) {
      this.dialogDeleteInvalidCustomer = false;
      if (Toggle == 2) {
        this.GetAllCustomerInvalidList = [];
        this.GetAllInvalidCustomersMethod(undefined);
      }
    },
    async dialogActivateInactivateCustomerEmit(Toggle) {
      this.dialogActivateInactivateCustomer = false;
      if (Toggle == 2) {
        this.GetAllCustomersData = [];
        this.GetAllSearchCustomerList = [];
        this.GetAllCustomersData =
          await this.getServicePartnerCustomerDataMethod(
            this.customer_status,
            this.customer_type
          );
        // this.GetAllCustomersListMethod(
        //   this.customer_status,
        //   this.customer_type,
        //   undefined
        // );
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.current_view = "CREATE";
      } else if (action == "ACTION") {
        this.dialogActivateInactivateCustomer = true;
      } else if (action == "DELETE_INVALID_CUSTOMER") {
        this.dialogDeleteInvalidCustomer = true;
      } else if (action == "UPDATE_INVALID_CUSTOMER")
        [(this.current_view = "CREATE")];
    },
    async CreateCustomerCardEmit(Toggle, Status) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.snackbarRenderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: Status,
          };
          this.snackbarRenderComp = true;
        });
      }
      await this.GetAllOrganizationSettingsTypesMethod();
      this.customer_type = await this.GetAllOrganizationSettingsTypesObject
        .default_customer_type;
      this.GetAllCustomersData = [];
      setTimeout(async () => {
        this.GetAllCustomersData =
          await this.getServicePartnerCustomerDataMethod(
            this.customer_status,
            this.customer_type
          );
        // this.GetAllCustomersListMethod(
        //   this.customer_status,
        //   this.customer_type,
        //   undefined
        // );
      }, 300);
    },
  },
};
</script>
