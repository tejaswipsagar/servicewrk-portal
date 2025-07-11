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
        <div class="largeFontSizeNew">
          <span v-if="list_aging_action_type == 'USER'">
            Technician Productivity Report
          </span>
          <span v-if="list_aging_action_type == 'SERVICE_TYPE'">
            Service Type Productivity Report
          </span>
          <span v-if="list_aging_action_type == 'TICKET_CREATION_TYPE'">
            Ticket Type Productivity Report
          </span>
        </div>
        <v-spacer />
        <v-text-field
          label="Search"
          outlined
          dense
          v-if="Charts == 'Table'"
          class="WidthVariation1 mt-11 FontSize"
          prepend-inner-icon="mdi-magnify"
          v-model="search"
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
              class="mt-12 mr-3 FontSize field_label_size field_height pl-2 smallwidth"
              outlined
              dense
              v-model="month"
              label="Select Month"
              readonly
              v-bind="attrs"
              v-on="on"
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
          class="FontSize WidthVariation2 mt-11 mr-2"
          v-model="list_aging_action_type"
          :items="select_type_items"
        >
        </v-select>
        <v-select
          dense
          outlined
          label="View Type"
          class="FontSize smallwidth mt-11 mr-2"
          v-model="Charts"
          :items="chartItems"
        >
        </v-select>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              class="gradient-bg white--text mt-4"
              color="primary"
              @click="exporttoexcel"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip>
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
        <template v-slot:[`item.service_type_name`]="{ item }">
          <div class="FontSize" v-if="item.service_type_name != undefined">
            {{ item.service_type_name }}
          </div>
        </template>
        <template v-slot:[`item.ticket_creation_type`]="{ item }">
          <div class="FontSize">
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
        <template v-slot:[`item.user_productivity`]="{ item }">
          <div class="FontSize">
            <span>
              {{ GetTotalTimeInHours(item.user_productivity) }}
            </span>
            <span> {{ GetTotalTime(item.user_productivity) }} </span>
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
    user_status: "ACTIVE",
    list_aging_action_type: "USER",
    menu: false,
    menum: false,
    menu1: false,
    overlay: false,
    mounted: false,
    CloseValue: false,
    dialogTaggedList: false,
    isDataTableLoading: false,
    month: new Date().toISOString().substr(0, 7),
    series: [],
    filtereduser: [],
    ticketDetails: [],
    ticketDetailsFilter: [],
    seriesTicketTypePie: [],
    seriesServiceTypePie: [],
    chartItems: ["Table", "Bar", "Pie"],
    GetUserMonthlyProductivityReportList: [],
    select_type_items: [
      { text: "Users", value: "USER" },
      { text: "Service Type", value: "SERVICE_TYPE" },
      { text: "Ticket Type", value: "TICKET_CREATION_TYPE" },
    ],
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
    StoreObj: {},
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
    series1: [
      {
        name: "Total Tickets",
        data: [],
      },
    ],
    selected_type_items: [
      { text: "Month", value: "MONTH" },
      { text: "Day", value: "DAY" },
    ],
    headers: [
      { text: "User Name", value: "user_name" },
      { text: "Mobile Number", value: "user_full_number" },
      { text: "Tickets Count", value: "ticket_details.length" },
      { text: "Productivity", value: "user_productivity" },
    ],
    headersForServiceType: [
      { text: "Service Name", value: "service_type_name" },
      { text: "Tickets Count", value: "ticket_details.length" },
      { text: "Productivity", value: "user_productivity" },
    ],
    headersForTicketType: [
      { text: "Ticket Type", value: "ticket_creation_type" },
      { text: "Tickets Count", value: "ticket_details.length" },
      { text: "Productivity", value: "user_productivity" },
    ],
    columnNameServiceType: [
      { label: "Service Type", value: "service_type_name" },
      {
        label: "Total Productivity",
        value: "total_user_productivity",
      },
      {
        label: "Productivity in Hours",
        value: "total_user_productivity_in_hrs",
      },
      {
        label: "Tickets Count",
        value: "ticket_count",
      },
      {
        label: "Ticket ID",
        value: "ticket_id",
      },
      { label: "Ticket Productivity", value: "result" },
      { label: "Ticket Productivity in Hrs", value: "result_in_hrs" },
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
    columnNameTicketType: [
      { label: "Ticket Type", value: "ticket_creation_type" },
      {
        label: "Total Productivity",
        value: "total_user_productivity",
      },
      {
        label: "Productivity in Hours",
        value: "total_user_productivity_in_hrs",
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
        label: "Ticket Productivity",
        value: "result",
      },
      { label: "Ticket Productivity in Hrs", value: "result_in_hrs" },
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
    columnName: [
      { label: "Name", value: "user_name" },
      {
        label: "Mobile Number",
        value: "user_full_number",
      },
      {
        label: "Total Productivity",
        value: "total_user_productivity",
      },
      {
        label: "Productivity in Hours",
        value: "total_user_productivity_in_hrs",
      },
      {
        label: "Tickets Count",
        value: "ticket_count",
      },
      {
        label: "Ticket ID",
        value: "ticket_id",
      },
      { label: "Ticket Productivity", value: "result" },
      { label: "Ticket Productivity in Hrs", value: "result_in_hrs" },
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
      {
        label: "Ticket Type",
        value: "ticket_creation_type",
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
      this.Charts = "Table";
      this.search = "";
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
      this.newArrayForExcelData.map((item) => {
        item.result = this.GetTotalTimeToExcel(item.ticket_productivity);
        item.total_user_productivity = this.GetTotalTimeToExcel(
          item.user_productivity
        );
        item.result_in_hrs = this.GetTotalTimeInHoursForExcel(
          item.ticket_productivity
        );
        item.total_user_productivity_in_hrs = this.GetTotalTimeInHoursForExcel(
          item.user_productivity
        );
        this.$forceUpdate();
      });
      let data = [
        {
          sheet:
            this.list_aging_action_type == "SERVICE_TYPE"
              ? `ServiceType_Productivity${this.month}`
              : this.list_aging_action_type == "TICKET_CREATION_TYPE"
              ? `TicketType_Productivity${this.month}`
              : `Technician_Productivity${this.month}`,
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
            ? `ServiceType_Productivity_${this.month}`
            : this.list_aging_action_type == "TICKET_CREATION_TYPE"
            ? `TicketType_Productivity_${this.month}`
            : `Technician_Productivity_${this.month}`,
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
    GetTotalTimeInHours(seconds) {
      if (seconds != undefined && seconds != 0) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        // const remainingSeconds = seconds % 60;
        return `${hours} hr, ${minutes} mins`;
      }
    },
    GetTotalTimeInHoursForExcel(seconds) {
      if (seconds != undefined && seconds != 0) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        // const remainingSeconds = seconds % 60;
        return `${hours} hr, ${minutes} mins`;
      }
    },
    GetTotalTime(seconds) {
      if (seconds != undefined && seconds != 0) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor((seconds % (3600 * 24)) / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hr, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins ") : "";
        // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        if (d >= 1) {
          return `(OR) ${dDisplay + hDisplay + mDisplay}`;
        }
      }
    },
    GetTotalTimeToExcel(seconds) {
      if (seconds != undefined && seconds != 0) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor((seconds % (3600 * 24)) / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hr, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins ") : "";
        // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return `${dDisplay + hDisplay + mDisplay}`;
      }
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
