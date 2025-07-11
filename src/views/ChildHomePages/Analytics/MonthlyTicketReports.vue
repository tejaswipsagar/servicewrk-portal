<template>
  <div>
    <Overlay :overlay="overlay" />
    <TaggedCompDialog
      :StoreObj="StoreObj"
      :ticketDetails="ticketDetails"
      :ticketDetailsFilter="ticketDetailsFilter"
      :dialogTaggedList="dialogTaggedList"
      @clicked="dialogemit"
    />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Monthly Ticket Report</div>
        <v-spacer />
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          v-if="Charts == 'Table'"
          prepend-inner-icon="mdi-magnify"
          class="WidthVariation1 mt-11 FontSize"
        >
        </v-text-field>
        <v-menu
          ref="menum"
          v-model="menum"
          :close-on-content-click="false"
          :return-value.sync="month"
          left
          bottom
          transition="scale-transition"
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              outlined
              readonly
              v-on="on"
              v-bind="attrs"
              v-model="month"
              label="Select Month"
              class="mt-12 mr-3 FontSize pl-2 smallwidth"
            ></v-text-field>
          </template>
          <v-date-picker v-model="month" type="month" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menum = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="getDate(month)"> OK </v-btn>
          </v-date-picker>
        </v-menu>
        <v-select
          dense
          outlined
          label="Select Type"
          :items="select_type_items"
          v-model="list_aging_action_type"
          class="FontSize WidthVariation2 mt-11 mr-2"
        >
        </v-select>
        <v-select
          dense
          outlined
          v-model="Charts"
          label="View Type"
          :items="chartItems"
          class="FontSize widthSmall mt-11 mr-2"
        >
        </v-select>
        <!-- <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="exporttoexcel"
              class="gradient-bg white--text mt-4"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip> -->
      </v-toolbar>
      <v-row no-gutters v-if="Charts == 'Pie'">
        <v-col cols="12" sm="12" md="2" xs="12"></v-col>
        <v-col cols="12" sm="12" md="10" xs="12">
          <div id="chart" v-if="mounted == true">
            <apexchartView
              type="pie"
              width="600"
              :options="
                this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                  ? chartOptionsTicketTypePie
                  : this.list_aging_action_type == 'SERVICE_TYPE'
                  ? chartOptionsServiceTypePie
                  : chartOptions
              "
              :series="
                this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                  ? seriesTicketTypePie
                  : this.list_aging_action_type == 'SERVICE_TYPE'
                  ? seriesServiceTypePie
                  : series
              "
            ></apexchartView>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="px-4 mt-8" v-if="Charts == 'Bar'">
        <v-col cols="12" xs="12" sm="12" md="12">
          <v-card>
            <div id="chart" v-if="mounted == true">
              <apexchartView
                type="bar"
                height="500"
                :options="
                  this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                    ? chartOptionsTicketTypeBar
                    : this.list_aging_action_type == 'SERVICE_TYPE'
                    ? chartOptionsServiceTypeBar
                    : chartOptions1
                "
                :series="
                  this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                    ? seriesTicketTypeBar
                    : this.list_aging_action_type == 'SERVICE_TYPE'
                    ? seriesServiceTypeBar
                    : series1
                "
              ></apexchartView>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card-text class="py-0 mt-6" v-if="this.Charts == 'Table'">
      <v-data-table
        dense
        :headers="
          this.list_aging_action_type == 'USER'
            ? headers
            : this.list_aging_action_type == 'SERVICE_TYPE'
            ? headersForServiceType
            : headersForTicketType
        "
        :loading="isDataTableLoading"
        fixed-header
        :search="search"
        :height="TableHeight"
        :items="GetUserMonthlyProductivityReportList"
        :footer-props="{ 'items-per-page-options': [100, 200, 500] }"
        :items-per-page="100"
      >
        <template v-slot:[`item.user_name`]="{ item }">
          <div class="FontSize">{{ item.user_name }}</div>
        </template>
        <template v-slot:[`item.ticket_creation_type`]="{ item }">
          <div class="FontSize" v-if="item.ticket_creation_type != undefined">
            {{ item.ticket_creation_type.replaceAll("_", " ") }}
          </div>
        </template>
        <template v-slot:[`item.user_full_number`]="{ item }">
          <div class="FontSize">{{ item.user_full_number }}</div>
        </template>
        <template v-slot:[`item.ticket_details.length`]="{ item }">
          <div class="FontSize">
            {{ item.ticket_details.length }}
            <v-icon
              v-if="item.ticket_details.length != 0"
              @click="openList(item)"
              small
              color="primary"
              >mdi-information</v-icon
            >
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import { GetUserMonthlyProductivityReport } from "@/mixins/Analytics/ListUsersMonthlyProductivity.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import TaggedCompDialog from "@/components/Analytics/Dialogs/ViewTicketDetailsInProductivityReport.vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Vue from "vue";
export default {
  components: {
    Overlay,
    TaggedCompDialog,
  },
  mixins: [GetUserMonthlyProductivityReport],
  data: () => ({
    TableHeight: 0,
    search: "",
    Charts: "Table",
    list_aging_action_type: "USER",
    menu: false,
    menum: false,
    menu1: false,
    mounted: false,
    overlay: false,
    CloseValue: false,
    dialogTaggedList: false,
    isDataTableLoading: false,
    StoreObj: {},
    series: [],
    ticketDetails: [],
    ticketDetailsFilter: [],
    seriesTicketTypePie: [],
    newArrayForExcelData: [],
    seriesServiceTypePie: [],
    chartItems: ["Table", "Bar", "Pie"],
    GetUserMonthlyProductivityReportList: [],
    chartOptionsServiceTypePie: {
      chart: {
        width: 800,
        type: "pie",
        toolbar: {
          show: true,
          seriesServiceTypePie: true,
        },
        events: {
          dataPointSelection: () => {},
        },
      },
      servicename: [],
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 700,
            },
            legend: {
              position: "bottom",
              catagories: [],
            },
          },
        },
      ],
    },
    chartOptionsTicketTypePie: {
      chart: {
        width: 800,
        type: "pie",
        toolbar: {
          show: true,
          seriesTicketTypePie: true,
        },
        events: {
          dataPointSelection: () => {},
        },
      },
      servicename: [],
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 700,
            },
            legend: {
              position: "bottom",
              catagories: [],
            },
          },
        },
      ],
    },
    chartOptions: {
      chart: {
        width: 800,
        type: "pie",
        toolbar: {
          show: true,
          series: true,
        },
        events: {
          dataPointSelection: () => {},
        },
      },
      servicename: [],
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 700,
            },
            legend: {
              position: "bottom",
              catagories: [],
            },
          },
        },
      ],
    },
    chartOptionsServiceTypeBar: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          verticle: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
      fill: {
        colors: ["#7b046c"],
      },
    },
    chartOptionsTicketTypeBar: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          verticle: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
      fill: {
        colors: ["#7b046c"],
      },
    },
    chartOptions1: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          varticle: true,
        },
      },
      dataLabals: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
      fill: {
        colors: ["#7b046c"],
      },
    },
    seriesServiceTypeBar: [
      {
        name: "Total Tickets",
        data: [],
      },
    ],
    seriesTicketTypeBar: [
      {
        name: "Total Tickets",
        data: [],
      },
    ],
    select_type_items: [
      { text: "Users", value: "USER" },
      { text: "Service Type", value: "SERVICE_TYPE" },
      { text: "Ticket Type", value: "TICKET_CREATION_TYPE" },
    ],
    series1: [
      {
        name: "Total Tickets",
        data: [],
      },
    ],
    month: new Date().toISOString().substr(0, 7),
    headers: [
      { text: "User Name", value: "user_name" },
      { text: "Mobile Number", value: "user_full_number" },
      { text: "Tickets Count", value: "ticket_details.length" },
    ],
    headersForServiceType: [
      { text: "Service Name", value: "service_type_name" },
      { text: "Tickets Count", value: "ticket_details.length" },
    ],
    headersForTicketType: [
      { text: "Ticket Type", value: "ticket_creation_type" },
      { text: "Tickets Count", value: "ticket_details.length" },
    ],
    columnNameTicketType: [
      { label: "Ticket Type", value: "ticket_creation_type" },
      { label: "Ticket Count", value: "ticket_count" },
      {
        label: "Ticket ID",
        value: "ticket_id",
      },
      {
        label: "Customer Name",
        value: "customer_company_name",
      },
      {
        label: "Contact Person Name",
        value: "customer_name",
      },
      {
        label: "Contact Number",
        value: "customer_phone_number",
      },
      {
        label: "Customer ID",
        value: "customer_unique_id",
      },
      {
        label: "Customer Email ID",
        value: "customer_email_id",
      },
      {
        label: "Category Name",
        value: "category_name",
      },
      {
        label: "Product Name",
        value: "service_name",
      },
      {
        label: "Serial Number",
        value: "service_serial_number",
      },
      {
        label: "Ticket Status",
        value: "ticket_status",
      },
    ],
    columnNameServiceType: [
      { label: "Service Type", value: "service_type_name" },
      { label: "Tickets Count", value: "ticket_count" },
      {
        label: "Ticket ID",
        value: "ticket_id",
      },
      {
        label: "Customer Name",
        value: "customer_company_name",
      },
      {
        label: "Contact Person Name",
        value: "customer_name",
      },
      {
        label: "Contact Number",
        value: "customer_phone_number",
      },
      {
        label: "Customer ID",
        value: "customer_unique_id",
      },
      {
        label: "Customer Email ID",
        value: "customer_email_id",
      },
      {
        label: "Category Name",
        value: "category_name",
      },
      {
        label: "Product Name",
        value: "service_name",
      },
      {
        label: "Serial Number",
        value: "service_serial_number",
      },
      {
        label: "Ticket Type",
        value: "ticket_creation_type",
      },
      {
        label: "Ticket Status",
        value: "ticket_status",
      },
    ],
    columnName: [
      { label: "Name", value: "user_name" },
      {
        label: "Mobile Number",
        value: "user_full_number",
      },
      {
        label: "Tickets Count",
        value: "ticket_count",
      },
      {
        label: "Ticket ID",
        value: "ticket_id",
      },
      {
        label: "Customer Name",
        value: "customer_company_name",
      },
      {
        label: "Contact Person Name",
        value: "customer_name",
      },
      {
        label: "Contact Number",
        value: "customer_phone_number",
      },
      {
        label: "Customer ID",
        value: "customer_unique_id",
      },
      {
        label: "Customer Email ID",
        value: "customer_email_id",
      },
      {
        label: "Category Name",
        value: "category_name",
      },
      {
        label: "Product Name",
        value: "service_name",
      },
      {
        label: "Serial Number",
        value: "service_serial_number",
      },
      {
        label: "Ticket Type",
        value: "ticket_creation_type",
      },
      {
        label: "Ticket Status",
        value: "ticket_status",
      },
    ],
  }),
  watch: {
    Charts(val) {
      if (val == "Pie") {
        this.GraphData();
      } else if (val == "Bar") {
        this.GraphData1();
      }
    },
    list_aging_action_type(val) {
      this.search = "";
      this.Charts = "Table";
      this.GetUserMonthlyProductivityReportList = [];
      this.GetUserMonthlyProductivityReportMethod(
        this.month,
        undefined,
        undefined,
        undefined,
        val,
        setTimeout(() => {
          this.GraphData();
          this.GraphData1();
        }, 1000)
      );
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetUserMonthlyProductivityReportMethod(
      this.month,
      undefined,
      undefined,
      undefined,
      this.list_aging_action_type,
      setTimeout(() => {
        this.GraphData();
        this.GraphData1();
      }, 1500)
    );
  },
  methods: {
    GraphData() {
      if (this.list_aging_action_type == "USER") {
        this.series = [];
        this.chartOptions.labels = [];
        this.mounted = false;
        this.$nextTick(() => {
          this.GetUserMonthlyProductivityReportList.map((item) => {
            this.chartOptions.labels.push(item.user_name);
          });
          this.series = [];
          for (let i = 0; i < this.chartOptions.labels.length; i++) {
            let initialCounter = 0;
            this.series.push(initialCounter);
          }
          this.series = this.GetUserMonthlyProductivityReportList.map(
            (item) => {
              return item.ticket_details.length;
            }
          );
          this.mounted = true;
          this.GraphData1();
        });
      } else if (this.list_aging_action_type == "TICKET_CREATION_TYPE") {
        this.seriesTicketTypePie = [];
        this.chartOptionsTicketTypePie.labels = [];
        this.mounted = false;
        this.$nextTick(() => {
          this.GetUserMonthlyProductivityReportList.map((item) => {
            if (item.ticket_creation_type != undefined) {
              this.chartOptionsTicketTypePie.labels.push(
                item.ticket_creation_type
              );
            }
          });
          this.seriesTicketTypePie = [];
          for (
            let i = 0;
            i < this.chartOptionsTicketTypePie.labels.length;
            i++
          ) {
            let initialCounter = 0;
            this.seriesTicketTypePie.push(initialCounter);
          }
          this.seriesTicketTypePie =
            this.GetUserMonthlyProductivityReportList.map((item) => {
              return item.ticket_details.length;
            });
          this.mounted = true;
          this.GraphData1();
        });
      } else if (this.list_aging_action_type == "SERVICE_TYPE") {
        this.seriesServiceTypePie = [];
        this.chartOptionsServiceTypePie.labels = [];
        this.mounted = false;
        this.$nextTick(() => {
          this.GetUserMonthlyProductivityReportList.map((item) => {
            if (item.service_type_name != undefined) {
              this.chartOptionsServiceTypePie.labels.push(
                item.service_type_name
              );
            }
          });
          this.seriesServiceTypePie = [];
          for (
            let i = 0;
            i < this.chartOptionsServiceTypePie.labels.length;
            i++
          ) {
            let initialCounter = 0;
            this.seriesServiceTypePie.push(initialCounter);
          }
          this.seriesServiceTypePie =
            this.GetUserMonthlyProductivityReportList.map((item) => {
              return item.ticket_details.length;
            });
          this.mounted = true;
          this.GraphData1();
        });
      }
    },
    GraphData1() {
      if (this.list_aging_action_type == "USER") {
        this.mounted = false;
        this.$nextTick(() => {
          this.chartOptions1.xaxis.categories =
            this.GetUserMonthlyProductivityReportList.map((item) => {
              return item.user_name;
            });
          this.series1[0].data = this.GetUserMonthlyProductivityReportList.map(
            (item) => {
              return item.ticket_details.length;
            }
          );
          this.mounted = true;
        });
      } else if (this.list_aging_action_type == "TICKET_CREATION_TYPE") {
        this.mounted = false;
        this.$nextTick(() => {
          this.chartOptionsTicketTypeBar.xaxis.categories =
            this.GetUserMonthlyProductivityReportList.map((item) => {
              return item.ticket_creation_type;
            });
          this.seriesTicketTypeBar[0].data =
            this.GetUserMonthlyProductivityReportList.map((item) => {
              return item.ticket_details.length;
            });
          this.mounted = true;
        });
      } else if (this.list_aging_action_type == "SERVICE_TYPE") {
        this.mounted = false;
        this.$nextTick(() => {
          this.chartOptionsServiceTypeBar.xaxis.categories =
            this.GetUserMonthlyProductivityReportList.map((item) => {
              return item.service_type_name;
            });
          this.seriesServiceTypeBar[0].data =
            this.GetUserMonthlyProductivityReportList.map((item) => {
              return item.ticket_details.length;
            });
          this.mounted = true;
        });
      }
    },
    exporttoexcel() {
      let data = [
        {
          sheet:
            this.list_aging_action_type == "SERVICE_TYPE"
              ? `Tickets_Service_Type_${this.month}`
              : this.list_aging_action_type == "TICKET_CREATION_TYPE"
              ? `Tickets_Ticket_Type_${this.month}`
              : `Tickets_Users_${this.month}`,
          columns:
            this.list_aging_action_type == "SERVICE_TYPE"
              ? this.columnNameServiceType
              : this.list_aging_action_type == "TICKET_CREATION_TYPE"
              ? this.columnNameTicketType
              : this.columnName,
          content: this.newArrayForExcelData,
        },
      ];
      let settings = {
        fileName:
          this.list_aging_action_type == "SERVICE_TYPE"
            ? `Tickets_Service_Type_${this.month}`
            : this.list_aging_action_type == "TICKET_CREATION_TYPE"
            ? `Tickets_Ticket_Type_${this.month}`
            : `Tickets_Users_${this.month}`,
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    openList(item) {
      this.StoreObj = item;
      this.ticketDetails = this.StoreObj.ticket_details;
      this.ticketDetailsFilter = this.ticketDetails;
      this.dialogTaggedList = true;
    },
    dialogemit(Toggle) {
      this.GetUserMonthlyProductivityReportMethod(
        this.month,
        undefined,
        undefined,
        undefined,
        this.list_aging_action_type
      );
      if (Toggle == 1) {
        this.dialogTaggedList = false;
      }
    },
    GetSecondsFromTicketDetails() {
      return "started";
    },
    GetTotalTime(seconds) {
      seconds = Number(seconds);
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);
      var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    },
    getDate(month) {
      if (this.month != "" && this.month != null) {
        this.Charts = "Table";
        this.GetUserMonthlyProductivityReportMethod(
          this.month,
          undefined,
          undefined,
          undefined,
          this.list_aging_action_type
        );
        this.$refs.menum.save(month);
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

<style></style>
