<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog persistent width="95%" :value="dialogTaggedList">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">Ticket Details</div>
        <v-spacer></v-spacer>
        <!-- <v-select
          outlined
          dense
          class="WidthVariation2 FontSize mt-3 mb-n4 mr-2"
          label="Select Type"
          v-model="Charts"
          :items="select_type_items"
        ></v-select> -->
        <v-select
          v-if="Charts == 'Table'"
          dense
          outlined
          class="WidthVariation2 FontSize mt-3 mb-n4 mr-2"
          label="Ticket Type"
          v-model="ticket_creation_type"
          :items="ticket_creation_type_items"
        >
        </v-select>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              text
              class="white--text primary"
              v-on="on"
              v-bind="attrs"
              @click="exporttoexcel"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span>Download</span>
        </v-tooltip>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogemit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-row no-gutters class="px-4" v-if="this.Charts == 'Graph'">
          <v-col cols="12" sm="12" md="6" xs="12">
            <div>Total Tickets : {{ ticketDetails.length }}</div>
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
        <v-card-text class="mt-4 pb-0" v-if="this.Charts == 'Table'">
          <v-data-table
            dense
            :headers="headers"
            :loading="loading"
            :items="ticketDetails"
            :no-data-text="noDataText"
            :height="tableHeight"
            fixed-header
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
            :items-per-page="100"
          >
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
              <div class="FontSize" v-if="item.customer_unique_id != undefined">
                {{ item.customer_unique_id }}
              </div>
              <div v-else>-</div>
            </template>
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
                v-if="item.ticket_creation_type != undefined"
              >
                {{ item.ticket_creation_type.replaceAll("_", " ") }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.service_type_name != undefined">
                {{ item.service_type_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.log_created_on`]="{ item }">
              <div class="FontSize">
                {{
                  new Date(item.log_created_on * 1000).toLocaleString("en-GB")
                }}
              </div>
              <div class="FontSize" v-if="item.service_name != undefined">
                {{ item.service_name }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.ticket_status != undefined">
                {{ item.ticket_status.replaceAll("_", " ") }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.category_name`]="{ item }">
              <div v-if="item.category_name != undefined" class="FontSize">
                {{ item.category_name }}
              </div>
              <div v-else>-</div>
              <div v-if="item.service_name != undefined" class="FontSize">
                {{ item.service_name }}
              </div>
              <div v-else>-</div>
              <div
                v-if="item.service_serial_number != undefined"
                class="FontSize"
              >
                {{ item.service_serial_number }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.ticket_productivity`]="{ item }">
              <div class="FontSize">
                {{ GetTotalTime(item.ticket_productivity) }}
              </div>
              <div
                class="FontSize"
                v-if="item.representative_name != undefined"
              >
                {{ item.representative_name }}
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
var xlsx = require("json-as-xlsx");
export default {
  props: {
    StoreObj: Object,
    ticketDetails: Array,
    dialogTaggedList: Boolean,
    ticketDetailsFilter: Array,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    tableHeight: 0,
    mounted: false,
    loading: false,
    noDataText: "",
    Charts: "Table",
    ticket_creation_type: "ALL",
    GetUserMonthlyProductivityReport: [],
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
    series: [
      {
        name: "Schedule Service",
        data: [],
      },
      {
        name: "Breakdown",
        data: [],
      },
      {
        name: "Installation",
        data: [],
      },
      {
        name: "Core Service Job",
        data: [],
      },
      {
        name: "Non-Core Service Job",
        data: [],
      },
      {
        name: "Sundary Job",
        data: [],
      },
    ],
    chartOptions: {
      charts: {
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
    series1: [
      {
        name: "Total Ticket Count",
        data: [],
      },
    ],
    chartOptions1: {
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
    SnackBarComponent: {},
    headers: [
      { text: "Ticket Id", value: "ticket_id", width: "25%" },
      {
        text: "Customer",
        value: "customer_company_name",
        width: "25%",
      },
      { text: "Product", value: "category_name", width: "20%" },
      { text: "Created On", value: "log_created_on", width: "15%" },
      { text: "Productivity", value: "ticket_productivity", width: "15%" },
    ],
    columnName: [
      { label: "Ticket Id", value: "ticket_id" },
      { label: "Date", value: "date" },
      { label: "Productivity", value: "result" },
      { label: "Status", value: "ticket_status" },
      {
        label: "Customer Name",
        value: "customer_company_name",
      },
      {
        label: "Contact Person Name",
        value: "customer_name",
      },
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
        label: "Service Type",
        value: "service_type_name",
      },
      {
        label: "Ticket Created On",
        value: "updated_ticket_created_on",
      },
      {
        label: "Ticket Type",
        value: "updated_ticket_creation_type",
      },
      {
        label: "Technician",
        value: "representative_name",
      },
    ],
  }),
  watch: {
    Charts(val) {
      if (val == "Graph") {
        this.GraphData();
      }
    },
    ticket_creation_type(val) {
      if (val == "ALL") {
        this.ticketDetails = this.ticketDetailsFilter;
      } else {
        this.ticketDetails = this.ticketDetailsFilter.filter(
          (item) => item.ticket_creation_type == val
        );
      }
      if (this.ticketDetails.length == 0) {
        this.noDataText = `No data found on ${val.replaceAll("_", " ")}`;
      }
    },
  },
  mounted() {
    this.GraphData();
    this.tableHeight = window.innerHeight - 250;
  },
  methods: {
    GraphData() {
      this.series = [];
      this.chartOptions.labels = [];
      this.mounted = false;
      this.$nextTick(() => {
        this.chartOptions.labels = [
          "Schedule Service",
          "Breakdown",
          "Installation",
          "Core Service Job",
          "Non-Core Service Job",
          "Sundary Job",
        ];

        this.series = [];
        for (let i = 0; i < this.chartOptions.labels.length; i++) {
          let initialCounter = 0;
          this.series.push(initialCounter);
        }
        this.series = [
          this.ScheduleService(),
          this.Breakdown(),
          this.Installation(),
          this.CoreServiceJob(),
          this.NonCoreServiceJob(),
          this.SundaryJob(),
        ];
        this.mounted = true;
        this.GraphData1();
      });
    },
    SundaryJob() {
      let SundaryJobTickets = 0;
      for (let i = 0; i < this.ticketDetails.length; i++) {
        if (
          this.ticketDetails[i].ticket_creation_type != undefined &&
          this.ticketDetails[i].ticket_creation_type != "" &&
          this.ticketDetails[i].ticket_creation_type != "-" &&
          this.ticketDetails[i].ticket_creation_type != null
        ) {
          if (this.ticketDetails[i].ticket_creation_type == "SUNDARY_JOB") {
            SundaryJobTickets += 1;
          }
        }
      }
      return SundaryJobTickets;
    },
    NonCoreServiceJob() {
      let NonCoreServiceJobTickets = 0;
      for (let i = 0; i < this.ticketDetails.length; i++) {
        if (
          this.ticketDetails[i].ticket_creation_type != undefined &&
          this.ticketDetails[i].ticket_creation_type != "" &&
          this.ticketDetails[i].ticket_creation_type != "-" &&
          this.ticketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.ticketDetails[i].ticket_creation_type == "NON_CORE_SERVICE_JOB"
          ) {
            NonCoreServiceJobTickets += 1;
          }
        }
      }
      return NonCoreServiceJobTickets;
    },
    CoreServiceJob() {
      let CoreServiceJobTickets = 0;
      for (let i = 0; i < this.ticketDetails.length; i++) {
        if (
          this.ticketDetails[i].ticket_creation_type != undefined &&
          this.ticketDetails[i].ticket_creation_type != "" &&
          this.ticketDetails[i].ticket_creation_type != "-" &&
          this.ticketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.ticketDetails[i].ticket_creation_type == "CORE_SERVICE_JOB"
          ) {
            CoreServiceJobTickets += 1;
          }
        }
      }
      return CoreServiceJobTickets;
    },
    ScheduleService() {
      let scheduleServiceTickets = 0;
      for (let i = 0; i < this.ticketDetails.length; i++) {
        if (
          this.ticketDetails[i].ticket_creation_type != undefined &&
          this.ticketDetails[i].ticket_creation_type != "" &&
          this.ticketDetails[i].ticket_creation_type != "-" &&
          this.ticketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.ticketDetails[i].ticket_creation_type == "SCHEDULE_SERVICE"
          ) {
            scheduleServiceTickets += 1;
          }
        }
      }
      return scheduleServiceTickets;
    },
    Breakdown() {
      let breakdownTickets = 0;
      for (let i = 0; i < this.ticketDetails.length; i++) {
        if (
          this.ticketDetails[i].ticket_creation_type != undefined &&
          this.ticketDetails[i].ticket_creation_type != "" &&
          this.ticketDetails[i].ticket_creation_type != "-" &&
          this.ticketDetails[i].ticket_creation_type != null
        ) {
          if (this.ticketDetails[i].ticket_creation_type == "BREAKDOWN") {
            breakdownTickets += 1;
          }
        }
      }
      return breakdownTickets;
    },
    Installation() {
      let installationTickets = 0;
      for (let i = 0; i < this.ticketDetails.length; i++) {
        if (
          this.ticketDetails[i].ticket_creation_type != undefined &&
          this.ticketDetails[i].ticket_creation_type != "" &&
          this.ticketDetails[i].ticket_creation_type != "-" &&
          this.ticketDetails[i].ticket_creation_type != null
        ) {
          if (this.ticketDetails[i].ticket_creation_type == "INSTALLATION") {
            installationTickets += 1;
          }
        }
      }
      return installationTickets;
    },
    GraphData1() {
      this.mounted = false;
      this.$nextTick(() => {
        (this.chartOptions1.xaxis.categories = [
          "Schedule Service",
          "Breakdown",
          "Installation",
          "Core Service Job",
          "Non-Core Service Job",
          "Sundary Job",
        ]),
          (this.series1[0].data = [
            this.ScheduleService(),
            this.Breakdown(),
            this.Installation(),
            this.CoreServiceJob(),
            this.NonCoreServiceJob(),
            this.SundaryJob(),
          ]);
        this.mounted = true;
      });
    },
    exporttoexcel() {
      this.ticketDetails.map((item) => {
        item.result = this.GetTotalTime(item.ticket_productivity);
        item.date = new Date(item.log_created_on * 1000).toLocaleString(
          "en-GB"
        );
        item.updated_ticket_created_on = new Date(
          item.ticket_created_on * 1000
        ).toLocaleDateString("en-GB");
        item.updated_ticket_creation_type =
          item.ticket_creation_type != undefined
            ? item.ticket_creation_type.replaceAll("_", " ")
            : "";
        this.$forceUpdate();
      });
      let data = [
        {
          sheet: this.StoreObj.user_name,
          columns: this.columnName,
          content: this.ticketDetails,
        },
      ];
      let settings = {
        fileName: this.StoreObj.user_name + " Productivity Report",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    GetTotalTime(seconds) {
      if (seconds > 60) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor((seconds % (3600 * 24)) / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
        // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
        return dDisplay + hDisplay + mDisplay;
      } else if (seconds <= 60 && seconds > 0) {
        return seconds + " Seconds";
      } else {
        return "Work not Started";
      }
    },
    dialogemit(Toggle) {
      (this.Charts = "Table"), this.$emit("clicked", Toggle);
    },
  },
};
</script>
