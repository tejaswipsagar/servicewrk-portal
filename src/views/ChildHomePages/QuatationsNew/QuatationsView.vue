<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <SharePdf
      :StoreObj="StoreObj"
      :dialogSharePdf="dialogSharePdf"
      @clicked="dialogSharePdfEmit"
    />
    <UpdateSendDetailsInQuotation
      :StoreObj="StoreObj"
      :dialogUpdateSendDetails="dialogUpdateSendDetails"
      @clicked="dialogUpdateSendDetailsEmit"
    />
    <CloseQuotation
      :StoreObj="StoreObj"
      :dialogCloseQuotation="dialogCloseQuotation"
      @clicked="dialogCloseQuotationEmit"
    />
    <UpdatePaymentDetails
      :StoreObj="StoreObj"
      :dialogUpdatePaymentDetails="dialogUpdatePaymentDetails"
      @clicked="dialogUpdatePaymentDetailsEmit"
    />
    <SendForApprovals
      :StoreObj="StoreObj"
      :dialogSendForApprovals="dialogSendForApprovals"
      @clicked="dialogSendForApprovalsEmit"
    />
    <GenerateQuotationCard
      :StoreObj="StoreObj"
      v-if="current_view == 'GENERATE_QUOTATION'"
      @clicked="GenerateQuatationEmit"
    />
    <DisplayPaymentDetails
      :DisplayPaymentDetailsDialog="DisplayPaymentDetailsDialog"
      :StoreObj="StoreObj"
      :Status_Type="Status_Type"
      @clicked="DisplayPaymentDetailsDialogEmit"
    />
    <v-card
      elevation="0"
      v-if="
        current_view == 'TABLE_VIEW' &&
        $store.getters.get_current_user_details.organization_details
          .enable_quotation_generation === true
      "
    >
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Quotations</div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          label="Search By"
          v-model="searchBy"
          :items="searchByItems"
          item-text="text"
          item-value="value"
          class="FontSize widthSmall mt-7 mr-2"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          class="FontSize WidthVariation1 mt-7 mr-2"
        >
          <template v-slot:append>
            <v-btn
              v-if="SearchBoolean == false"
              icon
              x-small
              @click.stop="searchfieldMethod()"
              ><v-icon>mdi-magnify</v-icon></v-btn
            >
            <v-btn
              v-if="SearchBoolean == true"
              icon
              x-small
              @click.stop="searchingFalseMethod()"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </template>
        </v-text-field>
        <v-select
          dense
          outlined
          label="Status"
          v-model="quotation_status"
          :items="quotation_status_items"
          class="FontSize widthSmall mt-7 mr-2"
        ></v-select>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="from_date"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="from_date"
              label="Start Date"
              outlined
              desne
              class="FontSize mt-8 widthSmall"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="from_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(from_date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :return-value.sync="to_date"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="to_date"
              label="End Date"
              outlined
              dense
              class="ml-2 mt-7 FontSize widthSmall"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            :min="from_date + 1"
            v-model="to_date"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
            <v-btn
              text
              color="primary"
              @click="
                $refs.menu1.save(to_date);
                callListMethod();
              "
            >
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
          color="primary"
          @click="generateQuotation()"
          class="primary white--text mt-0 ml-2"
        >
          <v-icon small>mdi-plus</v-icon> Generate
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :headers="
            quotation_status == 'ACTIVE'
              ? headers.filter((item) => item.value != 'sent_to_email_id')
              : headers
          "
          :height="TableHeight"
          :items="GetAllQuotationList"
          :footer-props="{
            'disable-items-per-page': true,
          }"
          :items-per-page="50"
          :no-data-text="
            GetAllQuotationList.length === 0 ? 'No data available' : null
          "
          @click:row="DisplayPaymentMethod"
          :page.sync="page"
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.customer_name`]="{ item }">
            <div class="FontSize" v-if="item.customer_company_name">
              {{ item.customer_company_name }}
            </div>
            <div class="FontSize" v-if="item.customer_name">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_phone_number`]="{ item }">
            <div class="FontSize" v-if="item.customer_phone_number">
              {{ item.customer_phone_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_email_id`]="{ item }">
            <div class="FontSize" v-if="item.customer_email_id">
              {{ item.customer_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.quotation_created_on`]="{ item }">
            <div class="FontSize" v-if="item.quotation_created_on">
              {{
                new Date(item.quotation_created_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.total_amount`]="{ item }">
            <div class="FontSize" v-if="item.total_amount">
              <div class="">
                <div>
                  <span>{{ item.total_amount }}</span>
                </div>
                <!-- <div v-if="quotation_status === 'PAYMENT_DONE'">
                  <v-btn icon @click="DisplayPaymentMethod(item)"
                    ><v-icon size="17" color="primary"
                      >mdi-information</v-icon
                    ></v-btn
                  >
                </div> -->
              </div>
            </div>
            <!-- <div class="FontSize" v-if="quotation_status === 'PAYMENT_DONE'">
              <span
                >{{ item.total_amount
                }}<v-icon size="20" color="blue">mdi-information</v-icon></span
              >
            </div> -->
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.sent_to_email_id`]="{ item }">
            <div class="FontSize" v-if="item.sent_to_email_id">
              {{ item.sent_to_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.quotation_display_id`]="{ item }">
            <div class="FontSize" v-if="item.quotation_display_id">
              {{ item.quotation_display_id }}
              <span v-if="item.is_quotation_edited">
                <v-tooltip bottom color="green">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      small
                      v-on="on"
                      v-bind="attrs"
                      color="green"
                      v-if="item.is_quotation_edited"
                      >mdi-pencil-plus</v-icon
                    >
                  </template>
                  <span>Edited Quotation</span>
                </v-tooltip>
              </span>
              <span v-if="item.labour_quotation">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small v-on="on" v-bind="attrs" color="primary"
                      >mdi-account-wrench</v-icon
                    >
                  </template>
                  <span>Only Labour</span>
                </v-tooltip>
              </span>
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.custom_ticket_id`]="{ item }">
            <div v-if="item.custom_ticket_id" class="FontSize">
              {{ item.custom_ticket_id }}
            </div>
            <div v-else-if="item.ticket_id" class="FontSize">
              {{ item.ticket_id }}
            </div>
            <div v-else class="FontSize">Direct Quotation</div>
          </template>
          <template v-slot:[`item.quotation_status`]="{ item }">
            <div class="FontSize">
              {{ item.quotation_status }}
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
                  <v-list-item @click.stop="downloadPdf(item)">
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-eye-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-if="quotation_status == 'ACTIVE'"
                        >Preview</v-list-item-title
                      >
                      <v-list-item-title v-if="quotation_status != 'ACTIVE'"
                        >View</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="quotation_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'UPDATE_SEND_DETAILS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-update</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Update Send Details</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="quotation_status == 'PAYMENT_DONE'"
                    @click.stop="checkItem(item, 'CLOSE_QUOTATION')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Close Quotation</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="quotation_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'SEND_FOR_APPROVALS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary"
                        >mdi-check-decagram-outline</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Send for Approvals</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      quotation_status === 'ACTIVE' ||
                      quotation_status === 'APPROVED'
                    "
                    @click.stop="checkItem(item, 'SHARE_PDF')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="green">mdi-share</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Share to Customer</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      quotation_status == 'ACTIVE' || quotation_status == 'SENT'
                    "
                    @click.stop="checkItem(item, 'EDIT')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pencil-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Edit Quotation</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="quotation_status == 'SENT'"
                    @click.stop="checkItem(item, 'UPDATE_PAYMENT_DETAILS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="indigo">mdi-cash-clock</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Update Confirmation</v-list-item-title>
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
    <v-container
      v-if="
        $store.getters.get_current_user_details.organization_details
          .enable_quotation_generation === false
      "
      fill-height
      class="d-flex justify-center align-center mt-16"
    >
      <v-card class="elevation-0 text-center mt-16">
        <v-row justify="center" class="mt-16">
          <div class="ContactStyle font-weight-bold mt-16">
            Please Contact ServiceWRK team to enable this feature
          </div>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import Overlay from "@/components/Extras/OverlayView.vue";
import SharePdf from "@/components/Quotation/SharePdf.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import SendForApprovals from "@/components/Quotation/SendForApprovals.vue";
import GenerateQuotationCard from "@/components/Quotation/GenerateQuotationCard.vue";
import UpdatePaymentDetails from "@/components/Quotation/UpdatePaymentDetails.vue";
import UpdateSendDetailsInQuotation from "@/components/Quotation/UpdateSendDetailsInQuotation.vue";
import { GetAllQuotations } from "@/mixins/Quotations/GetAllQuotations.js";
import CloseQuotation from "@/components/Quotation/CloseQuotation.vue";
import DisplayPaymentDetails from "@/components/Quotation/DisplayPaymentDetailsDialog.vue";
import { SearchQuotationPdf } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  components: {
    Overlay,
    Snackbar,
    SharePdf,
    CloseQuotation,
    SendForApprovals,
    UpdatePaymentDetails,
    GenerateQuotationCard,
    UpdateSendDetailsInQuotation,
    DisplayPaymentDetails,
  },
  mixins: [GetAllQuotations],
  data() {
    return {
      page: 1,
      pageCount: 1,
      TableHeight: 0,
      menu: false,
      menu1: false,
      overlay: false,
      renderComp: true,
      dialogSharePdf: false,
      dialogCloseQuotation: false,
      dialogSendForApprovals: false,
      dialogUpdateSendDetails: false,
      dialogUpdatePaymentDetails: false,
      from_date: new Date(new Date().getTime() - 30 * 86400000)
        .toISOString()
        .substr(0, 10),
      to_date: new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10),
      noDataText: "",
      search: "",
      Status_Type: "",
      current_view: "TABLE_VIEW",
      quotation_status: "ACTIVE",
      quotation_status_items: [
        { text: "ALL", value: "ALL" },
        { text: "ACTIVE", value: "ACTIVE" },
        { text: "SENT", value: "SENT" },
        { text: "CONFIRMED", value: "PAYMENT_DONE" },
        { text: "PENDING", value: "PENDING" },
        { text: "APPROVED", value: "APPROVED" },
        { text: "CLOSED", value: "CLOSED" },
        { text: "REJECTED", value: "QUOTATION_CANCELLED" },
      ],
      headers: [
        {
          text: "Quotation No.",
          value: "quotation_display_id",
        },
        { text: "Ticket ID", value: "custom_ticket_id" },
        {
          text: "Customer",
          value: "customer_name",
        },
        {
          text: "Phone",
          value: "customer_phone_number",
        },
        {
          text: "Mail ID",
          value: "customer_email_id",
        },
        {
          text: "Generated On",
          value: "quotation_created_on",
        },
        {
          text: "Total Amount",
          value: "total_amount",
        },
        { text: "Sent to", value: "sent_to_email_id" },
        { text: "Actions", value: "Actions" },
      ],
      ExcelHeaders: [
        {
          label: "Quotation ID",
          value: "quotation_display_id",
        },
        {
          label: "Quotation Date",
          value: "quotation_created_on",
        },
        { label: "Ticket ID", value: "custom_ticket_id" },
        {
          label: "Quotation Created By",
          value: "initiater_user_name",
        },
        { label: "Customer Name", value: "customer_name" },
        { label: "City", value: "customer_city" },
        { label: "State", value: "customer_state" },
        { label: "Phone", value: "customer_phone_number" },
        {
          label: "Email ID",
          value: "customer_email_id",
        },
        {
          label: "Category",
          value: "category_name",
        },
        {
          label: "Product",
          value: "product_name",
        },
        {
          label: "Component",
          value: "component_name",
        },
        {
          label: "Quantity",
          value: "quantity",
        },

        {
          label: "Quotation Status",
          value: "quotation_status",
        },
        {
          label: "Quotation Value",
          value: "total_amount",
        },
        {
          label: "Remarks",
          value: "sent_comments",
        },
        {
          label: "Quotation Sent Date",
          value: "quotation_sent_on",
        },
        // {
        //   label: "Payment Confirmed Date",
        //   value: "quotation_status",
        // },
        { label: "Generated By", value: "initiater_user_name" },
        {
          label: "Payment Confirmed By",
          value: "purchase_order_confirmed_by_name",
        },
        {
          label: "Payment Type",
          value: "payment_type",
        },
        {
          label: "Mode of Payment",
          value: "mode_of_payment",
        },
        {
          label: "Payment Ref Number",
          value: "payment_reference_number",
        },
        {
          label: "Date of Payment Order",
          value: "date_of_payment",
        },
        {
          label: "Payment Done On",
          value: "payment_done_on",
        },
        {
          label: "Value of Payment",
          value: "payment_value",
        },
      ],
      GetAllQuotationList: [],
      StoreObj: {},
      SnackBarComponent: {},
      DisplayPaymentDetailsDialog: false,
      SearchBoolean: false,
      searchBy: "",
      searchByItems: [
        { text: "TICKET ID", value: "ticket_id" },
        { text: "CUSTOMER ID", value: "customer_unique_id" },
        { text: "QUOTATION ID", value: "quotation_display_id" },
        { text: "CUSTOMER PHONE NUMBER", value: "customer_phone_number" },
      ],
      loadedPages: [],
    };
  },
  watch: {
    //MAIN
    async quotation_status(val) {
      this.loadedPages = [];
      this.page = 1;
      this.pageCount = 1;
      if (val === "ALL") {
        this.headers = [
          {
            text: "Quotation No.",
            value: "quotation_display_id",
          },
          { text: "Ticket ID", value: "custom_ticket_id" },
          {
            text: "Customer",
            value: "customer_name",
          },
          {
            text: "Phone",
            value: "customer_phone_number",
          },
          {
            text: "Mail ID",
            value: "customer_email_id",
          },
          {
            text: "Generated On",
            value: "quotation_created_on",
          },
          {
            text: "Total Amount",
            value: "total_amount",
          },
          { text: "Sent to", value: "sent_to_email_id" },
          { text: "Quotation Status", value: "quotation_status" },
          { text: "Actions", value: "Actions" },
        ];
        await this.GetAllQuotationsMethod(
          val,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      } else {
        this.headers = [
          {
            text: "Quotation No.",
            value: "quotation_display_id",
          },
          { text: "Ticket ID", value: "custom_ticket_id" },
          {
            text: "Customer",
            value: "customer_name",
          },
          {
            text: "Phone",
            value: "customer_phone_number",
          },
          {
            text: "Mail ID",
            value: "customer_email_id",
          },
          {
            text: "Generated On",
            value: "quotation_created_on",
          },
          {
            text: "Total Amount",
            value: "total_amount",
          },
          { text: "Sent to", value: "sent_to_email_id" },
          { text: "Actions", value: "Actions" },
        ];
        await this.GetAllQuotationsMethod(
          val,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
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
        let copiedQuotationDataList = [...this.GetAllQuotationList];
        await this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399,
          this.nextToken
        );
        this.page = currentPage;
        this.GetAllQuotationList.push(...copiedQuotationDataList);
      }
    },

    // async search(val) {
    //   if (val !== "") {
    //     if (this.searchBy !== "") {
    //       this.CallSearchApiMethod();
    //     } else {
    //       this.SnackBarComponent = {
    //         SnackbarVmodel: true,
    //         SnackbarColor: "red",
    //         Top: true,
    //         SnackbarText: "Kindly select 'SEARCH BY' item before searching!",
    //       };
    //     }
    //   }
    //   else {
    //     this.searchBy = "";
    //     await this.GetAllQuotationsMethod(
    //       this.quotation_status,
    //       Date.parse(this.from_date) / 1000,
    //       Date.parse(this.to_date) / 1000 + 86399
    //     );
    //   }
    // },
    searchBy(val) {
      if (val && this.search !== "") {
        this.CallSearchApiMethod();
      }
    },
  },
  async mounted() {
    this.TableHeight = window.innerHeight - 200;
    await this.GetAllQuotationsMethod(
      this.quotation_status,
      Date.parse(this.from_date) / 1000,
      Date.parse(this.to_date) / 1000 + 86399
    );
  },
  methods: {
    searchfieldMethod() {
      if (this.search !== "" && this.search.length >= 3) {
        if (this.searchBy !== "") {
          this.CallSearchApiMethod();
        } else {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly select 'SEARCH BY' item before searching!",
          };
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Enter atleast 3 characters to Search",
        };
      }
    },
    async searchingFalseMethod() {
      this.SearchBoolean = false;
      this.search = "";
      await this.GetAllQuotationsMethod(
        this.quotation_status,
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399
      );
    },
    async CallSearchApiMethod() {
      try {
        this.SearchBoolean = true;
        const result = await API.graphql(
          graphqlOperation(SearchQuotationPdf, {
            input: {
              user_id: this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              quotation_status: this.quotation_status,
              field_name: this.searchBy,
              field_value: this.search,
            },
          })
        );
        const response = JSON.parse(result.data.SearchQuotationPdf).data.items;
        this.GetAllQuotationList = response;
      } catch (error) {
        console.log("Error", error);
        this.GetAllQuotationList = [];
      }
    },
    downloadPdf(item) {
      window.open(item.quotation_s3_url);
    },
    generateQuotation() {
      this.StoreObj.action = "GENERATE_QUOTATION";
      this.current_view = "GENERATE_QUOTATION";
    },
    callListMethod() {
      this.GetAllQuotationsMethod(
        this.quotation_status,
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399
      );
    },
    dialogSharePdfEmit(Toggle) {
      this.dialogSharePdf = false;
      if (Toggle == 2) {
        this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "SHARE_PDF") {
        this.dialogSharePdf = true;
      } else if (action == "UPDATE_SEND_DETAILS") {
        this.dialogUpdateSendDetails = true;
      } else if (action == "UPDATE_PAYMENT_DETAILS") {
        this.dialogUpdatePaymentDetails = true;
      } else if (action == "SEND_FOR_APPROVALS") {
        this.dialogSendForApprovals = true;
      } else if (action == "EDIT") {
        this.current_view = "GENERATE_QUOTATION";
      } else if (action == "CLOSE_QUOTATION") {
        this.dialogCloseQuotation = true;
      }
    },
    DisplayPaymentMethod(item) {
      console.log("iiiitem", item);
      this.DisplayPaymentDetailsDialog = true;
      this.StoreObj = item;
      this.Status_Type = this.quotation_status;
    },
    dialogUpdateSendDetailsEmit(Toggle) {
      this.dialogUpdateSendDetails = false;
      if (Toggle == 2) {
        this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      }
    },
    dialogCloseQuotationEmit(Toggle) {
      this.dialogCloseQuotation = false;
      if (Toggle == 2) {
        this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      }
    },
    dialogUpdatePaymentDetailsEmit(Toggle) {
      this.dialogUpdatePaymentDetails = false;
      if (Toggle == 2) {
        this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      }
    },
    dialogSendForApprovalsEmit(Toggle) {
      this.dialogSendForApprovals = false;
      if (Toggle == 2) {
        this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      }
    },
    GenerateQuatationEmit(Toggle) {
      this.current_view = "TABLE_VIEW";
      if (Toggle == 2) {
        this.renderComp = false;
        if (this.quotation_status != "SENT") {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Quotation Generated Successfully..!",
            };
            this.renderComp = true;
          });
        } else {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Quotation Updated Successfully..!",
            };
            this.renderComp = true;
          });
        }
        this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      }
    },
    DisplayPaymentDetailsDialogEmit(Toggle) {
      this.DisplayPaymentDetailsDialog = false;
    },

    exporttoexcel() {
      let InputArray = this.GetAllQuotationList.map((item) => {
        let Objects = { ...item };

        if (item.quotation_created_on) {
          const timestamp =
            item.quotation_created_on.toString().length === 10
              ? item.quotation_created_on * 1000
              : item.quotation_created_on;
          const date = new Date(timestamp);
          Objects.quotation_created_on = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        } else {
          Objects.quotation_created_on = "";
        }

        if (item.quotation_sent_on) {
          const timestamp =
            item.quotation_sent_on.toString().length === 10
              ? item.quotation_sent_on * 1000
              : item.quotation_sent_on;
          const date = new Date(timestamp);
          Objects.quotation_sent_on = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        } else {
          Objects.quotation_sent_on = "";
        }

        // Formatting payment_done_on if it exists
        if (item.payment_done_on) {
          const timestamp =
            item.payment_done_on.toString().length === 10
              ? item.payment_done_on * 1000
              : item.payment_done_on;
          const date = new Date(timestamp);
          Objects.payment_done_on = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        } else {
          Objects.payment_done_on = "";
        }

        Objects.ticket_id = item.custom_ticket_id || item.ticket_id || "";
        Objects.initiater_user_name = item.initiater_user_name || "";
        Objects.purchase_order_confirmed_by_name =
          item.purchase_order_confirmed_by_name || "";

        if (item.components_list && Array.isArray(item.components_list)) {
          Objects.category_name = item.components_list
            .map((component) => component.category_name)
            .join(", ");

          Objects.product_name = item.components_list
            .map((component) => component.product_name)
            .join(", ");

          Objects.component_name = item.components_list
            .map((component) => component.component_name)
            .join(", ");

          Objects.quantity = item.components_list
            .map((component) => component.quantity)
            .join(", ");
        } else {
          Objects.category_name = "";
          Objects.product_name = "";
          Objects.component_name = "";
          Objects.quantity = "";
        }

        if (item.payment_details) {
          if (item.payment_details.date_of_payment) {
            Objects.date_of_payment = formatDate(
              item.payment_details.date_of_payment
            );
          } else {
            Objects.date_of_payment = "";
          }

          Objects.payment_reference_number =
            item.payment_details.payment_reference_number || "";
          Objects.mode_of_payment = item.payment_details.mode_of_payment || "";
          Objects.payment_type = item.payment_details.payment_type || "";
          Objects.payment_value = item.payment_details.payment_value || "";
        } else {
          Objects.date_of_payment = "";
          Objects.payment_reference_number = "";
          Objects.mode_of_payment = "";
          Objects.payment_type = "";
          Objects.payment_value = "";
        }

        function formatDate(date) {
          if (!date) return "";
          let parts;
          if (date.includes("-")) {
            parts = date.split("-");
          } else if (date.includes("/")) {
            parts = date.split("/");
          } else {
            return date;
          }
          if (parts[0].length === 4) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          } else {
            return `${parts[0]}/${parts[1]}/${parts[2]}`;
          }
        }

        this.$forceUpdate();
        return Objects;
      });

      let data = [
        {
          sheet: "Quotation",
          columns: this.ExcelHeaders,
          content: InputArray,
        },
      ];

      let settings = {
        fileName: "Quotation",
        extraLength: 6,
        writeOptions: {},
      };

      xlsx(data, settings);
    },
  },
};
</script>
