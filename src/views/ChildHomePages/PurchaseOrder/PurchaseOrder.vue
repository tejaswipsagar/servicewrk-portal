<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <ShareToCustomer
      :shareToCustomerDialog="shareToCustomerDialog"
      :StoreObj="StoreObj"
      @clicked="shareToCustomerDialogEmit"
    />
    <ActivatedeactivatePurchaseOrder
      :ActivatedeactivatePurchaseOrderDialog="
        ActivatedeactivatePurchaseOrderDialog
      "
      :StoreObj="StoreObj"
      @clicked="ActivatedeactivatePurchaseOrderDialogEmit"
    />
    <GeneratePurchaseOrder
      v-if="currentView === 'GENERATE_PO'"
      @clicked="GeneratePOEmit"
    />
    <PurchaseOrderDetails
      :PurchaseOrderDetailsDialog="PurchaseOrderDetailsDialog"
      :StoreObj="StoreObj"
      @clicked="PurchaseOrderDetailsDialogEmit"
    />
    <UpdatePaymentDetails
      :UpdatePaymentDetailsDialog="updatePaymentDetailsDialog"
      :StoreObj="StoreObj"
      @clicked="UpdatePaymentDetailsDialogEmit"
    />
    <ClosePO
      :ClosePoDialog="closePoDialog"
      :StoreObj="StoreObj"
      @clicked="ClosePoDialogEmit"
    />
    <v-card elevation="0" v-if="currentView === 'MAIN_PO'">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4" xs="12" class="ml-n4">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Purchase Order</div>
            <div class="ml-1">
              <v-icon small color="#f469a9">mdi-circle</v-icon>
              <span class="ml-1">MRF</span>
            </div>
            <div class="ml-3">
              <v-icon small color="#5bb55e">mdi-circle</v-icon>
              <span class="ml-1">Direct Quotation</span>
            </div>
          </v-toolbar>
        </v-col>
        <!-- <v-col cols="12" md="1" xs="12" sm="12">
          <v-select
            dense
            outlined
            class="mt-3 maxWidthXSmall"
            label="Search By"
            v-model="Type_Select"
            :items="Search_By_Items"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2" xs="12" sm="12">
          <v-text-field
            class="mt-3 maxWidthSmall"
            dense
            outlined
            label="Search"
            v-model="search"
          >
            <template v-slot:append>
              <v-btn icon dark small>
                <v-icon small color="black">mdi-magnify</v-icon>
              </v-btn>
            </template></v-text-field
          >
        </v-col> -->
        <v-col cols="12" sm="12" md="8" xs="12" class="d-flex justify-end">
          <div>
            <v-toolbar dense class="elevation-0">
              <v-select
                dense
                outlined
                class="mt-9 maxWidthXSmall"
                label="Search By"
                v-model="Type_Select"
                :items="Search_By_Items"
              ></v-select>
              <v-text-field
                class="mt-9 ml-1 maxWidthSmall"
                dense
                outlined
                label="Search"
                v-model="search"
              >
                <template v-slot:append>
                  <v-btn
                    v-if="SearchBoolean == false"
                    @click.stop="validateSearchMethod()"
                    color="primary"
                    icon
                    dark
                    x-small
                  >
                    <v-icon small color="black">mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="SearchBoolean == true"
                    @click.stop="undoSearchMethod()"
                    icon
                    dark
                    x-small
                  >
                    <v-icon small color="black">mdi-close</v-icon>
                  </v-btn>
                </template></v-text-field
              >
              <v-select
                dense
                outlined
                label="Purchase Order Status"
                v-model="purchaseOrderStatus"
                :items="purchaseOrderStatusItems"
                item-text="text"
                item-value="value"
                class="mt-9 FontSize maxWidthXSmall ml-2"
              ></v-select>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="From Date"
                    outlined
                    dense
                    class="ml-1 mr-1 mt-8 maxWidth80px FontSize field_label_size field_height"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                :return-value.sync="toDate"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="toDate"
                    label="To Date"
                    outlined
                    dense
                    class="ml-1 mr-1 maxWidth80px mt-8 FontSize field_label_size field_height"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="date + 1"
                  v-model="toDate"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu1 = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu1.save(toDate)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <!-- <v-tooltip color="primary" bottom class="mr-2">
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
              <v-btn
                small
                class="ml-2 primary"
                color="primary"
                @click="GeneratePOMethod()"
              >
                Generate<v-icon small>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="headers"
          :loading="loading"
          :height="TableHeight"
          :items="purchaseOrderList"
          :items-per-page="50"
          :footer-props="{
            'disable-items-per-page': true,
          }"
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="purchaseOrderDetailsMethod"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              <v-icon
                v-if="item.po_generated_from"
                x-small
                :color="item.po_generated_from == 'MRF' ? '#f469a9' : '#5bb55e'"
                >mdi-circle</v-icon
              >
              {{ purchaseOrderList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.purchase_order_display_id`]="{ item }">
            <div class="FontSize">
              {{ item.purchase_order_display_id }}
            </div>
          </template>
          <template v-slot:[`item.customer_name`]="{ item }">
            <div class="FontSize">
              {{ item.customer_name }}
            </div>
          </template>
          <template v-slot:[`item.customer_email_id`]="{ item }">
            <div class="FontSize">
              {{ item.customer_email_id }}
            </div>
          </template>
          <template v-slot:[`item.purchase_order_created_on`]="{ item }">
            <div class="FontSize">
              {{ item.purchase_order_created_on }}
            </div>
          </template>
          <template v-slot:[`item.total_amount`]="{ item }">
            <div class="FontSize">
              {{ item.total_amount }}
            </div>
          </template>
          <template v-slot:[`item.custom_ticket_id`]="{ item }">
            <div class="FontSize">
              {{ item.custom_ticket_id }}
            </div>
          </template>
          <template v-slot:[`item.purchase_order_created_on`]="{ item }">
            <div class="FontSize">
              {{ FormatedDateTime(item.purchase_order_created_on) }}
            </div>
          </template>
          <template v-slot:[`item.share_customer`]="{ item }">
            <v-menu right bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense nav>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-if="item.purchase_order_status !== 'INACTIVE'"
                    @click.stop="CheckItemMethod(item, 'PREVIEW')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Preview</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.purchase_order_status === 'PAYMENT_DONE'"
                    @click.stop="CheckItemMethod(item, 'CLOSE_PO')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title
                        >Close Purchase Order</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.purchase_order_status === 'SENT'"
                    @click.stop="
                      CheckItemMethod(item, 'UPDATE_PAYMENT_DETAILS')
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title
                        >Update Payment Details</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.purchase_order_status === 'ACTIVE'"
                    @click.stop="CheckItemMethod(item, 'SHARE_CUSTOMER')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-share</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Share To Vendor</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.purchase_order_status === 'ACTIVE'"
                    @click.stop="CheckItemMethod(item, 'UPDATE_SEND_DETAILS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="yellow">mdi-bookmark</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title
                        >Update Share Details</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="CheckItemMethod(item, 'ACTIVATE')"
                    v-if="item.purchase_order_status === 'INACTIVE'"
                  >
                    <v-list-item-icon>
                      <v-icon small color="green">mdi-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Activate</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    @click.stop="CheckItemMethod(item, 'DEACTIVATE')"
                    v-if="item.purchase_order_status === 'ACTIVE'"
                  >
                    <v-list-item-icon>
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Deactivate</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
        <v-pagination
          v-model="page"
          :length="pageCount"
          total-visible="4"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import { ListAllPurchaseOrderData } from "@/mixins/PurchaseOrder/GetPurchaseOrderList.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import GeneratePurchaseOrder from "@/components/PurchaseOrder/Cards/GeneratePurchaseOrder.vue";
import ShareToCustomer from "@/components/PurchaseOrder/Dialogs/ShareCustomerDialog.vue";
import ActivatedeactivatePurchaseOrder from "@/components/PurchaseOrder/Dialogs/ActivateDeactivatePurchaseOrderDialog.vue";
// import TicketQuotationDisplay from "@/components/Approvals/TicketQuotationDetailsDialog.vue";
import PurchaseOrderDetails from "@/components/PurchaseOrder/Dialogs/PurchaseOrderDetailsDialog.vue";
import UpdatePaymentDetails from "@/components/PurchaseOrder/Dialogs/UpdatePaymentDetailsDialog.vue";
import ClosePO from "@/components/PurchaseOrder/Dialogs/ClosePO.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { SearchPurchasedOrder } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  mixins: [ListAllPurchaseOrderData],
  components: {
    Snackbar,
    Overlay,
    GeneratePurchaseOrder,
    ShareToCustomer,
    ActivatedeactivatePurchaseOrder,
    PurchaseOrderDetails,
    UpdatePaymentDetails,
    ClosePO,
  },
  data: () => ({
    page: 1,
    pageCount: 1,
    renderComp: true,
    search: "",
    purchaseOrderList: [],
    purchaseOrderStatus: "ACTIVE",
    purchaseOrderStatusItems: [
      { text: "ACTIVE", value: "ACTIVE" },
      { text: "INACTIVE", value: "INACTIVE" },
      { text: "SENT", value: "SENT" },
      { text: "CONFIRMED", value: "PAYMENT_DONE" },
      { text: "CLOSED", value: "CLOSED" },
    ],
    headers: [
      { text: "Sl.no", value: "sl_no" },
      { text: "Purchase Order ID", value: "purchase_order_display_id" },
      { text: "Ticket ID", value: "custom_ticket_id" },
      { text: "Customer Name", value: "customer_name" },
      { text: "Customer Email", value: "customer_email_id" },
      { text: "Generated On", value: "purchase_order_created_on" },
      { text: "Action", value: "share_customer" },
    ],
    ColumnHeaders: [
      {
        label: "Purchase Order ID",
        value: "purchase_order_display_id",
      },
      { label: "Ticket ID", value: "custom_ticket_id" },
      { label: "Quotation ID", value: "quotation_display_id" },
      { label: "Customer Name", value: "customer_name" },
      { label: "Customer Contact Number", value: "customer_phone_number" },
      { label: "Customer Email", value: "customer_email_id" },
      { label: "Customer Address (Shipping)", value: "customer_address" },
      { label: "Customer City (Shipping)", value: "customer_city" },
      { label: "Customer State (Shipping)", value: "customer_state" },
      { label: "Customer Pincode (Shipping)", value: "customer_pincode" },
      { label: "Customer Pan No", value: "customer_pan_no" },
      { label: "Customer GST No", value: "customer_gst_no" },
      { label: "Billing Address", value: "billing_address" },
      { label: "Billing City", value: "billing_city" },
      { label: "Billing State", value: "billing_state" },
      { label: "Billing Pincode", value: "billing_pincode" },
      { label: "Billing Pan No", value: "billing_pan_no" },
      { label: "Billing GST No", value: "billing_gst_no" },
      { label: "Vendor Name", value: "vendor_name" },
      { label: "Vendor Contact No", value: "vendor_contact_number" },
      { label: "Vendor Email ID", value: "vendor_email_id" },
      { label: "Vendor Address", value: "vendor_address" },
      {
        label: "Reporting Manager Name",
        value: "ticket_reporting_manager_name",
      },
      {
        label: "Reporting Manager Email ID",
        value: "ticket_reporting_manager_email_id",
      },
      { label: "Generated On", value: "purchase_order_created_on" },
      { label: "Generated By", value: "initiater_user_name" },
      { label: "Generated On", value: "purchase_order_created_on" },
      { label: "Sent On", value: "purchase_order_sent_on" },
      { label: "Payment Confirmed On", value: "payment_done_on" },
      {
        label: "Payment Confirmed By",
        value: "purchase_order_confirmed_by_name",
      },
      { label: "Component Name", value: "component_name" },
      { label: "Component Code", value: "component_code" },
      { label: "Product Name", value: "product_name" },
      { label: "Quantity", value: "quantity" },
      { label: "Price", value: "price" },
      { label: "GST%", value: "gst" },
      { label: "Discount%", value: "discont_percentage" },
      { label: "Sub Total", value: "sub_total" },
      { label: "Total Price", value: "total_price" },
    ],
    menu: false,
    menu1: false,
    toDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date: new Date(new Date().getTime() - 30 * 86400000)
      .toISOString()
      .substr(0, 10),
    epochToDate: null,
    epochFromDate: null,
    overlay: false,
    TableHeight: 0,
    loading: true,
    currentView: "MAIN_PO",
    StoreObj: {},
    shareToCustomerDialog: false,
    ActivatedeactivatePurchaseOrderDialog: false,
    PurchaseOrderDetailsDialog: false,
    updatePaymentDetailsDialog: false,
    closePoDialog: false,
    SnackBarComponent: {},
    Type_Select: "",
    Search_By_Items: [
      {
        text: "Purchase Order ID",
        value: "purchase_order_display_id",
      },
      {
        text: "Ticket Id",
        value: "ticket_id",
      },
      {
        text: "Customer Phone Number",
        value: "customer_phone_number",
      },
      {
        text: "Customer Email ID",
        value: "customer_email_id",
      },
    ],
    SearchBoolean: false,
    loadedPages: [],
  }),

  watch: {
    async purchaseOrderStatus(val) {
      if (val) {
        await this.CallListApiMethod();
      }
    },
    async toDate(val) {
      if (val) {
        this.convertEndDateToEpoch();
        await this.CallListApiMethod();
      }
    },

    async date(val) {
      if (val) {
        this.convertFromDateToEpoch();
        await this.CallListApiMethod();
      }
    },

    async page(val) {
      if (
        val % 2 === 0 &&
        !this.loadedPages.includes(val) &&
        this.nextToken !== undefined
      ) {
        this.loadedPages.push(val);
        const currentPage = val;
        let copiedPurchaseOrderList = [...this.purchaseOrderList];
        this.convertFromDateToEpoch();
        this.convertEndDateToEpoch();
        this.purchaseOrderList = await this.ListAllPurchaseOrderDataMethod(
          this.purchaseOrderStatus,
          this.epochFromDate,
          this.epochToDate,
          this.nextToken
        );
        this.page = currentPage;
        this.purchaseOrderList.push(...copiedPurchaseOrderList);
      }
    },
  },

  async mounted() {
    this.TableHeight = window.innerHeight - 220;
    this.convertFromDateToEpoch();
    this.convertEndDateToEpoch();
    await this.CallListApiMethod();
    this.loading = false;
  },

  methods: {
    validateSearchMethod() {
      if (this.Type_Select !== "" && this.search != "") {
        this.search_PurchaseOrder_Method();
      } else if (this.Type_Select == "") {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Select Type of Search",
            Top: true,
          };
          this.renderComp = true;
        });
      } else if (this.search == "") {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Type Something ...",
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    async search_PurchaseOrder_Method() {
      try {
        this.overlay = true;
        let inputParams = {
          user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          purchase_order_status: this.purchaseOrderStatus,
          field_name: this.Type_Select,
          field_value: this.search,
        };
        let result = await API.graphql(
          graphqlOperation(SearchPurchasedOrder, {
            input: inputParams,
          })
        );
        let ResultObj = JSON.parse(result.data.SearchPurchasedOrder).data.items;
        this.purchaseOrderList = ResultObj;
        this.SearchBoolean = true;
        this.overlay = false;
        console.log("niru", result);
      } catch (error) {
        this.overlay = false;
        this.purchaseOrderList = [];
        console.log("error", error);
      }
    },
    async undoSearchMethod() {
      this.SearchBoolean = false;
      this.search = "";
      this.Type_Select = "";
      this.purchaseOrderList = await this.ListAllPurchaseOrderDataMethod(
        this.purchaseOrderStatus,
        this.epochFromDate,
        this.epochToDate
      );
    },
    async CallListApiMethod() {
      this.purchaseOrderList = await this.ListAllPurchaseOrderDataMethod(
        this.purchaseOrderStatus,
        this.epochFromDate,
        this.epochToDate
      );
    },

    GeneratePOMethod() {
      this.currentView = "GENERATE_PO";
    },

    FormatedDateTime(item) {
      const date = new Date(item * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      hours = String(hours).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    },
    convertEndDateToEpoch() {
      const dateStr = this.toDate;
      const date = new Date(dateStr);
      date.setHours(23, 59, 59, 999);
      const epochTime = date.getTime();
      this.epochToDate = Math.floor(epochTime / 1000);
    },

    convertFromDateToEpoch() {
      const dateStr = this.date;
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      const epochTime = date.getTime();
      this.epochFromDate = Math.floor(epochTime / 1000);
    },

    exporttoexcel() {
      let InputArray = this.purchaseOrderList.map((item) => {
        let Objects = { ...item };

        // Convert epoch timestamps to readable date format
        Objects.purchase_order_created_on = item.purchase_order_created_on
          ? new Date(item.purchase_order_created_on * 1000).toLocaleString(
              "en-GB"
            )
          : "N/A";

        Objects.purchase_order_sent_on = item.purchase_order_sent_on
          ? new Date(item.purchase_order_sent_on * 1000).toLocaleString("en-GB")
          : "N/A";

        Objects.payment_done_on = item.payment_done_on
          ? new Date(item.payment_done_on * 1000).toLocaleString("en-GB")
          : "N/A";

        // Ensure required values are not missing, otherwise set to "N/A"
        Objects.purchase_order_display_id =
          item.purchase_order_display_id || "N/A";
        Objects.quotation_display_id = item.quotation_display_id || "N/A";
        Objects.customer_name = item.customer_name || "N/A";
        Objects.customer_city = item.customer_city || "N/A";
        Objects.customer_state = item.customer_state || "N/A";

        // Shipping & Billing details
        Objects.customer_address = item.customer_address || "N/A";
        Objects.customer_pincode = item.customer_pincode || "N/A";
        Objects.customer_gst_no = item.customer_gst_no || "N/A";
        Objects.customer_pan_no = item.customer_pan_no || "N/A";

        Objects.billing_address = item.billing_address || "N/A";
        Objects.billing_city = item.billing_city || "N/A";
        Objects.billing_state = item.billing_state || "N/A";
        Objects.billing_pincode = item.billing_pincode || "N/A";
        Objects.billing_pan_no = item.billing_pan_no || "N/A";
        Objects.billing_gst_no = item.billing_gst_no || "N/A";

        // Vendor Details
        Objects.vendor_name = item.vendor_name || "N/A";
        Objects.vendor_contact_number = item.vendor_contact_number || "N/A";
        Objects.vendor_email_id = item.vendor_email_id || "N/A";
        Objects.vendor_address = item.vendor_address || "N/A";

        Objects.ticket_reporting_manager_name =
          item.ticket_reporting_manager_name || "N/A";
        Objects.ticket_reporting_manager_email_id =
          item.ticket_reporting_manager_email_id || "N/A";

        Objects.initiater_user_name = item.initiater_user_name || "N/A";
        Objects.purchase_order_confirmed_by_name =
          item.purchase_order_confirmed_by_name || "N/A";

        // Handling components_list
        if (
          Array.isArray(item.components_list) &&
          item.components_list.length > 0
        ) {
          Objects.component_name = item.components_list
            .map((component) => component.component_name || "N/A")
            .join(", ");
          Objects.component_code = item.components_list
            .map((component) => component.component_code || "N/A")
            .join(", ");
          Objects.product_name = item.components_list
            .map((component) => component.product_name || "N/A")
            .join(", ");
          Objects.price = item.components_list
            .map((component) => component.price || "N/A")
            .join(", ");
          Objects.quantity = item.components_list
            .map((component) => component.quantity || "N/A")
            .join(", ");
          Objects.sub_total = item.components_list
            .map((component) => component.sub_total || "N/A")
            .join(", ");
          Objects.discont_percentage = item.components_list
            .map((component) => component.discont_percentage || "N/A")
            .join(", ");
          Objects.gst = item.components_list
            .map((component) => component.gst || "N/A")
            .join(", ");
          Objects.total_price = item.components_list
            .map((component) => component.total_price || "N/A")
            .join(", ");
        } else {
          Objects.component_name = "N/A";
          Objects.component_code = "N/A";
          Objects.product_name = "N/A";
          Objects.price = "N/A";
          Objects.quantity = "N/A";
          Objects.sub_total = "N/A";
          Objects.discont_percentage = "N/A";
          Objects.gst = "N/A";
          Objects.total_price = "N/A";
        }

        return Objects;
      });

      let data = [
        {
          sheet: "Purchase Order",
          columns: this.ColumnHeaders,
          content: InputArray,
        },
      ];

      let settings = {
        fileName: "Purchase_Order",
      };

      xlsx(data, settings);
    },

    CheckItemMethod(item, ACTION) {
      this.StoreObj = item;
      if (ACTION === "SHARE_CUSTOMER" || ACTION === "UPDATE_SEND_DETAILS") {
        this.StoreObj.action_type = ACTION;
        this.shareToCustomerDialog = true;
      } else if (ACTION === "PREVIEW") {
        window.open(item.purchase_order_s3_url);
      } else if (ACTION === "UPDATE_PAYMENT_DETAILS") {
        this.updatePaymentDetailsDialog = true;
      } else if (ACTION === "CLOSE_PO") {
        this.closePoDialog = true;
      } else {
        this.ActivatedeactivatePurchaseOrderDialog = true;
      }
    },
    purchaseOrderDetailsMethod(item) {
      this.StoreObj = item;
      this.StoreObj.po_status = this.purchaseOrderStatus;
      console.log("this.StoreObj", this.StoreObj);
      this.PurchaseOrderDetailsDialog = true;
    },
    PurchaseOrderDetailsDialogEmit(Toggle) {
      this.PurchaseOrderDetailsDialog = false;
    },

    async shareToCustomerDialogEmit(Toggle) {
      this.shareToCustomerDialog = false;
      if (Toggle === 2) {
        await this.CallListApiMethod();
      }
    },

    async ActivatedeactivatePurchaseOrderDialogEmit(Toggle) {
      this.ActivatedeactivatePurchaseOrderDialog = false;
      if (Toggle === 2) {
        await this.CallListApiMethod();
      }
    },

    GeneratePOEmit(Toggle) {
      this.currentView = "MAIN_PO";
      if (Toggle === 2) {
        this.CallListApiMethod();
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Successfully Created!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    UpdatePaymentDetailsDialogEmit(Toggle) {
      this.updatePaymentDetailsDialog = false;
    },

    async ClosePoDialogEmit(Toggle) {
      this.closePoDialog = false;
      if (Toggle === 2) {
        this.convertFromDateToEpoch();
        this.convertEndDateToEpoch();
        await this.CallListApiMethod();
      }
    },
  },
};
</script>
