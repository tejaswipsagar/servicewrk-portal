<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-card class="elevation-0" v-if="current_view == 'LIST'">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">
              AMC Renewal Report :
              <span>{{ active_scheduled_service }}</span>
            </div>
          </v-toolbar>
        </v-col>
        <v-toolbar dense class="elevation-0">
          <v-spacer></v-spacer>
          <v-menu
            ref="menum"
            v-model="menum"
            :close-on-content-click="false"
            :return-value.sync="reportmonth"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-13 mr-3 FontSize field_label_size field_height pl-2 smallwidth"
                outlined
                denses
                v-model="reportmonth"
                label="Select Month"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="reportmonth"
              type="month"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menum = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="getDate(reportmonth)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-select
            dense
            outlined
            v-model="SearchBy"
            label="Search By"
            :items="SearchByItems"
            class="mt-12 FontSize widthSmall"
          >
          </v-select>
          <v-text-field
            dense
            outlined
            label="Search"
            class="FontSize ml-2 mr-2 WidthVariation1 mt-12"
            v-model="search"
            ><template v-slot:append>
              <v-btn
                v-if="isSearching == false"
                @click="GetScheduledServicesSearchMethod((isSearching = true))"
                icon
                small
                color="primary"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="primary"
                v-if="isSearching == true"
                @click="ClearMethod((isSearching = false))"
                ><v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <!-- <v-tooltip color="primary" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-on="on"
                v-bind="attrs"
                class="primary white--text mt-5"
                @click="exporttoexcel"
              >
                <v-icon>mdi-file-excel-outline</v-icon>
              </v-btn>
            </template>
            <span class="white--text">Donwload Data in Excel</span>
          </v-tooltip> -->
        </v-toolbar>
        <v-card-text class="py-0 mt-6">
          <v-data-table
            dense
            fixed-header
            :page.sync="page"
            :headers="headers"
            hide-default-footer
            :items-per-page="50"
            :height="TableHeight"
            style="cursor: pointer"
            @click:row="handleRowClick"
            @page-count="pageCount = $event"
            :items="
              Current_Filter == 'WITHOUT_SEARCH'
                ? GetAllScheduledTicketList
                : GetAllSearchedScheduledServices
            "
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <span class="FontSize">{{
                GetAllScheduledTicketList.indexOf(item) + 1
              }}</span>
            </template>
            <template v-slot:[`item.customer_company_name`]="{ item }">
              <div
                class="FontSize"
                v-if="item.customer_company_name != undefined"
              >
                {{ item.customer_company_name }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.customer_name != undefined">
                {{ item.customer_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.service_name`]="{ item }">
              <div v-if="item.category_name != undefined" class="FontSize">
                {{ item.category_name }}
              </div>
              <div v-else>-</div>
              <div v-if="item.service_name != undefined" class="FontSize">
                {{ item.service_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.service_serial_number`]="{ item }">
              <div
                class="FontSize"
                v-if="item.service_serial_number != undefined"
              >
                {{ item.service_serial_number }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.ticket_warranty_type`]="{ item }">
              <div
                class="FontSize"
                v-if="item.ticket_warranty_type != undefined"
              >
                {{ item.ticket_warranty_type }}
              </div>
              <div v-else>-</div>
              <span class="FontSize"
                >Starts :<span v-if="item.amc_start_date != undefined">
                  {{ item.amc_start_date }}
                </span>
                <span v-else>-</span>
              </span>
              <div></div>
              <span class="FontSize"
                >Ends :<span v-if="item.amc_end_date != undefined">
                  {{ item.amc_end_date }}
                </span>
                <span v-else>-</span></span
              >
            </template>
            <template v-slot:[`item.ticket_created_on`]="{ item }">
              <div class="FontSize">
                {{
                  new Date(item.ticket_created_on * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </div>
            </template>
            <template v-slot:[`item.amc_start_date`]="{ item }">
              <div class="FontSize" v-bind="attrs" v-on="on">
                {{ item.amc_start_date ? item.amc_start_date : "-" }}
              </div>
            </template>
            <template v-slot:[`item.amc_end_date`]="{ item }">
              <div class="FontSize" v-bind="attrs" v-on="on">
                {{ item.amc_end_date ? item.amc_end_date : "-" }}
              </div>
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
      </v-row>
    </v-card>
    <ViewScheduledService
      v-if="current_view == 'EDIT'"
      :StoreObj="StoreObj"
      @clicked="EmitView"
    />
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewScheduledService from "@/components/ScheduledService/Cards/ViewScheduledService.vue";
import { GetAllScheduledTicket } from "@/mixins/ScheduleServices/GetAllScheduledTicket.js";
import { GetAllScheduledServicesBySearch } from "@/mixins/ScheduleServices/GetSearchScheduledTickets.js";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Vue from "vue";
export default {
  components: {
    Overlay,
    Snackbar,
    ViewScheduledService,
  },
  mixins: [GetAllScheduledTicket, GetAllScheduledServicesBySearch],
  data: () => ({
    menum: false,
    overlay: false,
    renderComp: true,
    isSearching: false,
    page: 1,
    count: 0,
    pageCount: 1,
    TableHeight: 0,
    search: "",
    current_view: "LIST",
    SearchBy: "ticket_id",
    active_scheduled_service: "",
    Current_Filter: "WITHOUT_SEARCH",
    reportmonth: new Date().toISOString().substr(0, 7),
    SnackBarComponent: {},
    filtereduser: [],
    GetAllSearchedScheduledServices: [],
    headers: [
      {
        text: "#",
        align: "start",
        value: "sl_no",
      },
      { text: "Customer", value: "customer_company_name", width: "20%" },
      { text: "Product Name", value: "service_name", width: "20%" },
      { text: "Serial Number", value: "service_serial_number", width: "16%" },
      { text: "Created On", value: "ticket_created_on" },
      { text: "Support", value: "ticket_warranty_type" },
    ],
    SearchByItems: [
      {
        text: "Ticket ID",
        value: "ticket_id",
      },
      {
        text: "Customer",
        value: "customer_company_name",
      },
      {
        text: "Contact Person",
        value: "customer_name",
      },
      {
        text: "Customer ID",
        value: "customer_unique_id",
      },
      {
        text: "Phone Number",
        value: "customer_full_number",
      },
      {
        text: "Serial Number",
        value: "service_serial_number",
      },
    ],
    columnName: [
      {
        label: "Ticket ID",
        value: "ticket_id",
      },
      {
        label: "Customer",
        value: "customer_company_name",
      },
      {
        label: "Contact Person",
        value: "customer_name",
      },
      {
        label: "Phone Number",
        value: "customer_phone_number",
      },
      {
        label: "Email",
        value: "customer_email_id",
      },
      {
        label: "Address",
        value: "ticket_address",
      },
      {
        label: "Category",
        value: "category_name",
      },
      {
        label: "Product",
        value: "service_name",
      },
      {
        label: "Serial Number",
        value: "service_serial_number",
      },
      {
        label: "Service Type",
        value: "service_type_name",
      },
      {
        label: "Support",
        value: "ticket_warranty_type",
      },
      {
        label: "Support Type",
        value: "warranty_type",
      },
      {
        label: "Support Starts",
        value: "amc_start_date",
      },
      {
        label: "Support Ends",
        value: "amc_end_date",
      },
      {
        label: "Payment Received",
        value: "updated_payment_received",
      },
      {
        label: "Payment Details",
        value: "payment_details",
      },
      {
        label: "Payment Amount",
        value: "payment_amount",
      },
      {
        label: "Payment Method",
        value: "payment_method",
      },
      {
        label: "Status",
        value: "ticket_status",
      },
      {
        label: "Scheduled Visit Dates",
        value: "updated_rft_date_list",
      },
      // {
      //   label: "Converted to RFS Ticket",
      //   value: "updated_converted_to_rft_ticket",
      // },
      // {
      //   label: "Converted to Original Ticket",
      //   value: "updated_converted_to_original_ticket",
      // },
    ],
  }),
  mounted() {
    this.TableHeight = window.innerHeight - 190;
    this.GetAllScheduledTicketMethod("SCHEDULED", undefined, undefined);
  },
  watch: {
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllScheduledTicketMethod(
          "SCHEDULED",
          undefined,
          this.next_token
        );
      }
    },
  },
  methods: {
    ClearMethod() {
      this.GetAllScheduledTicketList = [];
      this.Current_Filter = "WITHOUT_SEARCH";
      setTimeout(() => {
        this.GetAllScheduledTicketMethod("SCHEDULED", undefined, undefined);
      }, 300);
      this.search = "";
    },
    GetScheduledServicesSearchMethod(isSearching = true) {
      if (this.search != "") {
        this.Current_Filter = "WITH_SEARCH";
        this.GetAllSceduledTicketsBySearchMethod(this.search, this.SearchBy);
      } else {
        this.isSearching = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Type Something...",
          };
          this.renderComp = true;
        });
      }
    },
    EmitView() {
      this.current_view = "LIST";
    },
    handleRowClick(item) {
      this.StoreObj = item;
      this.StoreObj.action = "EDIT";
      this.current_view = "EDIT";
    },
    exporttoexcel() {
      this.GetAllScheduledTicketList.map((item) => {
        item.updated_payment_received =
          item.payment_received == false
            ? "No"
            : item.payment_received == true
            ? "Yes"
            : "";
      });
      let data = [
        {
          sheet: "AMC Renewal Report",
          columns: this.columnName,
          content: this.GetAllScheduledTicketList,
        },
      ];
      let settings = {
        fileName: "AMC Renewal Report",
        extraLength: 3,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    downloadMethod1() {
      this.GetAllScheduledTicketList.map((item) => {
        item.resultDate = new Date(
          item.ticket_created_on * 1000
        ).toLocaleString("en-GB");
        this.$forceUpdate();
      });
    },
    getDate(reportmonth) {
      if (this.reportmonth != "" && this.reportmonth != null) {
        let date_format = `${this.reportmonth.split("-")[1]}-${
          this.reportmonth.split("-")[0]
        }`;
        this.GetAllScheduledTicketList = [];
        this.GetAllScheduledTicketMethod("SCHEDULED", date_format, undefined);
        // if (
        //   this.next_token != undefined &&
        //   this.next_token != null &&
        //   this.next_token != ""
        // ) {
        //   this.GetAllScheduledTicketMethod(
        //     "SCHEDULED",
        //     date_format,
        //     this.next_token
        //   );
        // } else {
        //   this.GetAllScheduledTicketMethod("SCHEDULED", date_format, undefined);
        // }
        this.$refs.menum.save(reportmonth);
        this.menum = false;
      } else {
        this.menum = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "No data available for selected month",
          timeout: 2000,
        };
      }
    },
  },
};
</script>
