<template>
  <div>
    <v-dialog
      :value="ViewTicketAgingInChart"
      scrollable
      persistent
      :overlay="false"
      width="95%"
    >
      <v-card>
        <v-toolbar elevation="0" dense color="primary" dark>
          <div>Ticket Details</div>
          <v-spacer />
          <!-- <v-select
            outlined
            dense
            class="WidthVariation2 FontSize mt-3 mb-n4"
            label="Select Type"
            v-model="Charts"
            :items="select_type_items"
          ></v-select> -->
          <v-tooltip color="primary" bottom v-if="Charts == 'Table'">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                class="white--text ml-2"
                @click="exporttoexcel"
                v-on="on"
                v-bind="attrs"
                icon
              >
                <v-icon>mdi-file-excel-outline</v-icon>
              </v-btn>
            </template>
            <span class="white--text">Download Excel</span>
          </v-tooltip>
          <v-btn icon @click="ViewTicketAgingInChartEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row v-if="Charts == 'Graph'">
            <v-col cols="12" md="6">
              <div>Total Tickets : {{ StoreObj.total_tickets_count }}</div>
              <div id="chart" v-if="mounted == true">
                <apexchartView
                  type="pie"
                  width="600"
                  :options="chartOptions"
                  :series="series"
                ></apexchartView>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div id="chart" v-if="mounted == true">
                <apexchartView
                  type="bar"
                  height="400"
                  :options="chartOptions1"
                  :series="series1"
                ></apexchartView>
              </div>
            </v-col>
          </v-row>
          <div v-if="Charts == 'Table'">
            <v-data-table
              dense
              :no-data-text="noDataText"
              :items="totalTicketDetails"
              :headers="Headers"
              :height="TableHeight"
              fixed-header
              :footer-props="{
                'items-per-page-options': [100, 200, 500],
              }"
              :items-per-page="100"
            >
              <template v-slot:[`item.ticket_id`]="{ item }">
                <div class="FontSize" v-if="item.custom_ticket_id != undefined">
                  {{ item.custom_ticket_id }}
                </div>
                <div class="FontSize" v-else-if="item.ticket_id != undefined">
                  {{ item.ticket_id }}
                </div>
                <div v-else>-</div>
                <div
                  class="FontSize"
                  v-if="item.representative_name != undefined"
                >
                  {{ item.representative_name }}
                </div>
                <div v-else>-</div>
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
                <div
                  class="FontSize"
                  v-if="item.customer_unique_id != undefined"
                >
                  {{ item.customer_unique_id }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.category_name`]="{ item }">
                <div class="FontSize" v-if="item.category_name != undefined">
                  {{ item.category_name }}
                </div>
                <div v-else>-</div>
                <div class="FontSize" v-if="item.service_name != undefined">
                  {{ item.service_name }}
                </div>
                <div v-else>-</div>
                <div
                  class="FontSize"
                  v-if="item.service_serial_number != undefined"
                >
                  {{ item.service_serial_number }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ticket_creation_type`]="{ item }">
                <div
                  class="FontSize"
                  v-if="item.ticket_creation_type != undefined"
                >
                  {{ item.ticket_creation_type.replaceAll("_", " ") }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ticket_status`]="{ item }">
                <div class="FontSize" v-if="item.ticket_status != undefined">
                  {{ item.ticket_status.replaceAll('_', ' ') }}
                </div>
                <div v-else>-</div>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
export default {
  props: {
    StoreObj: Object,
    ViewTicketAgingInChart: Boolean,
    GetAllServiceRepresentativeList: Array,
  },
  data: () => ({
    mounted: false,
    TableHeight: 0,
    noDataText: "",
    Charts: "Table",
    representative_name: "ALL",
    ticket_creation_type: "ALL",
    series: [],
    totalTicketDetails: [],
    ChartItems: ["Pie", "Bar"],
    totalTicketDetailsWithFilter: [],
    select_type_items: ["Table", "Graph"],
    ticket_creation_type_items: [
      { text: "ALL", value: "ALL" },
      { text: "Scheduled Ticket", value: "SCHEDULED_TICKET" },
      { text: "Breakdown", value: "BREAKDOWN" },
      { text: "Installation", value: "INSTALLATION" },
      { text: "Core Service Job", value: "CORE_SERVICE_JOB" },
      { text: "Non Core Service Job", value: "NON_CORE_SERVICE_JOB" },
      { text: "Sundary Job", value: "SUNDARY_JOB" },
      { text: "Schedule Service", value: "SCHEDULE_SERVICE" },
    ],
    Headers: [
      { text: "Ticket ID", value: "ticket_id" },
      {
        text: "Customer",
        value: "customer_company_name",
      },
      { text: "Product", value: "category_name" },
      { text: "Ticket Type", value: "ticket_creation_type" },
      { text: "Ticket Status", value: "ticket_status" },
    ],
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
    chartOptions1: {
      chart: {
        type: "bar",
        height: 950,
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          columnWidth: "80%",
          verticle: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        width: 1,
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: [],
        tickPlacement: "on",
      },
    },
    columnName: [
      { label: "Ticket ID", value: "ticket_id" },
      { label: "Status", value: "ticket_status" },
      { label: "Customer Name", value: "customer_company_name" },
      { label: "Customer Name", value: "customer_name" },
      {
        label: "Customer Phone Number",
        value: "customer_phone_number",
      },
      {
        label: "Customer ID",
        value: "customer_unique_id",
      },
      {
        label: "Customer Mail ID",
        value: "customer_email_id",
      },
      { label: "Category Name", value: "category_name" },
      { label: "Product Name", value: "service_name" },
      { label: "Serial Number", value: "service_serial_number" },
      {
        label: "Ticket Created On",
        value: "updated_ticket_created_on",
      },
      { label: "Ticket Type", value: "updated_ticket_creation_type" },
      { label: "Ticket Priority", value: "ticket_priority" },
      { label: "Technician", value: "representative_name" },
      { label: "Preferred Visit Date", value: "prefered_visit_date" },
      { label: "Preferred Visit Time", value: "prefered_visit_time" },
    ],
    series1: [
      {
        name: "0 - 1 Days",
        data: [],
      },
      {
        name: "1 - 2 Days ",
        data: [],
      },
      {
        name: "3 - 5 Days ",
        data: [],
      },
      {
        name: "5 - 7 Days ",
        data: [],
      },
      {
        name: "7 - 15 Days ",
        data: [],
      },
      {
        name: " > 15 Days ",
        data: [],
      },
    ],
  }),
  watch: {
    representative_name(val) {
      if (val == "ALL") {
        this.totalTicketDetails = this.totalTicketDetailsWithFilter;
      } else {
        this.totalTicketDetails = this.totalTicketDetailsWithFilter.filter(
          (item) => item.representative_name == val
        );
      }
      if (this.totalTicketDetails.length == 0) {
        this.noDataText = `No data found on ${val.replaceAll("_", " ")}`;
      }
    },
    ticket_creation_type(val) {
      if (val == "ALL") {
        this.totalTicketDetails = this.totalTicketDetailsWithFilter;
      } else {
        this.totalTicketDetails = this.totalTicketDetailsWithFilter.filter(
          (item) => item.ticket_creation_type == val
        );
      }
      if (this.totalTicketDetails.length == 0) {
        this.noDataText = `No data found on ${val.replaceAll("_", " ")}`;
      }
    },
    ViewTicketAgingInChart(val) {
      if (val == true) {
        this.GraphData();
        this.GraphData1();
        this.GetTotalTicketDetials();
      }
    },
    Charts(val) {
      if (val == "Graph") {
        this.GraphData();
        this.GraphData1();
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 300;
  },
  methods: {
    exporttoexcel() {
      this.totalTicketDetails.map((item) => {
        item.updated_ticket_created_on = new Date(
          item.ticket_created_on * 1000
        ).toLocaleDateString("en-GB");
        item.updated_ticket_creation_type =
          item.ticket_creation_type != undefined
            ? item.ticket_creation_type.replaceAll("_", " ")
            : "";
      });
      let data = [
        {
          sheet: "Ticket Aging Report",
          columns: this.columnName,
          content: this.totalTicketDetails,
        },
      ];
      let settings = {
        fileName: "Ticket Aging Report",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    GetTotalTicketDetials() {
      this.totalTicketDetails = [];
      if (this.StoreObj.between_0_to_1_ticket_details.length != 0) {
        for (
          let i = 0;
          i <= this.StoreObj.between_0_to_1_ticket_details.length;
          i++
        ) {
          if (this.StoreObj.between_0_to_1_ticket_details[i] != undefined) {
            this.totalTicketDetails.push(
              this.StoreObj.between_0_to_1_ticket_details[i]
            );
          }
        }
      }
      if (this.StoreObj.between_1_to_2_ticket_details.length != 0) {
        for (
          let i = 0;
          i <= this.StoreObj.between_1_to_2_ticket_details.length;
          i++
        ) {
          if (this.StoreObj.between_1_to_2_ticket_details[i] != undefined) {
            this.totalTicketDetails.push(
              this.StoreObj.between_1_to_2_ticket_details[i]
            );
          }
        }
      }
      if (this.StoreObj.between_3_to_5_ticket_details.length != 0) {
        for (
          let i = 0;
          i <= this.StoreObj.between_3_to_5_ticket_details.length;
          i++
        ) {
          if (this.StoreObj.between_3_to_5_ticket_details[i] != undefined) {
            this.totalTicketDetails.push(
              this.StoreObj.between_3_to_5_ticket_details[i]
            );
          }
        }
      }
      if (this.StoreObj.between_5_to_7_ticket_details.length != 0) {
        for (
          let i = 0;
          i <= this.StoreObj.between_5_to_7_ticket_details.length;
          i++
        ) {
          if (this.StoreObj.between_5_to_7_ticket_details[i] != undefined) {
            this.totalTicketDetails.push(
              this.StoreObj.between_5_to_7_ticket_details[i]
            );
          }
        }
      }
      if (this.StoreObj.between_7_to_15_ticket_details.length != 0) {
        for (
          let i = 0;
          i <= this.StoreObj.between_7_to_15_ticket_details.length;
          i++
        ) {
          if (this.StoreObj.between_7_to_15_ticket_details[i] != undefined) {
            this.totalTicketDetails.push(
              this.StoreObj.between_7_to_15_ticket_details[i]
            );
          }
        }
      }
      if (this.StoreObj.greater_than_15_ticket_details.length != 0) {
        for (
          let i = 0;
          i <= this.StoreObj.greater_than_15_ticket_details.length;
          i++
        ) {
          if (this.StoreObj.greater_than_15_ticket_details[i] != undefined) {
            this.totalTicketDetails.push(
              this.StoreObj.greater_than_15_ticket_details[i]
            );
          }
        }
      }
      this.totalTicketDetailsWithFilter = this.totalTicketDetails;
    },
    GraphData1() {
      this.mounted = false;
      this.$nextTick(() => {});
      this.series1[0].data = [this.StoreObj.between_0_to_1];
      this.series1[1].data = [this.StoreObj.between_1_to_2];
      this.series1[2].data = [this.StoreObj.between_3_to_5];
      this.series1[3].data = [this.StoreObj.between_5_to_7];
      this.series1[4].data = [this.StoreObj.between_7_to_15];
      this.series1[5].data = [this.StoreObj.greater_than_15];
      this.mounted = true;
    },
    GraphData() {
      this.series = [];
      this.chartOptions.labels = [
        "between_0_to_1",
        "between_1_to_2",
        "between_3_to_5",
        "between_5_to_7",
        "between_7_to_15",
        "greater_than_15",
      ];
      this.mounted = false;
      this.$nextTick(() => {
        this.series = [
          this.StoreObj.between_0_to_1,
          this.StoreObj.between_1_to_2,
          this.StoreObj.between_3_to_5,
          this.StoreObj.between_5_to_7,
          this.StoreObj.between_7_to_15,
          this.StoreObj.greater_than_15,
        ];
        this.mounted = true;
      });
    },
    ViewTicketAgingInChartEmit(Toggle) {
      this.Charts = "Table";
      this.representative_name = "ALL";
      this.ticket_creation_type = "ALL";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
