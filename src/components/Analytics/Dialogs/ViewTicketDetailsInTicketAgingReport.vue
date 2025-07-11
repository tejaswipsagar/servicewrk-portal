<template>
  <div>
    <v-dialog persistent width="90%" :value="DialogTicketDetails">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">Ticket Details</div>
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
              icon
              class="primary white--text ml-2"
              @click="exporttoexcel"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip>
        <v-btn
          class="mr-n4"
          dark
          text
          @click="DialogTicketDetailsEmit((Toggle = 1))"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card>
        <v-row no-gutters class="px-4" v-if="this.Charts == 'Graph'">
          <v-col cols="12" md="6" sm="12" xs="12">
            <div id="chart" v-if="mounted == true">
              <apexchartView
                type="pie"
                width="600"
                :options="chartOptions"
                :series="series"
              ></apexchartView>
            </div>
          </v-col>
          <v-col cols="12" md="6" xs="12" sm="12">
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
        <v-card-text class="pb-0" v-if="this.Charts == 'Table'">
          <v-data-table
            dense
            :headers="headers"
            :items="StoreObjTicketDetails"
            :no-data-text="noDataText"
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
              <div class="FontSize" v-if="item.ticket_id != undefined">
                {{ item.ticket_id }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.ticket_status != undefined">
                {{ item.ticket_status.replaceAll("_", " ") }}
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
            </template>
            <template v-slot:[`item.ticket_creation_type`]="{ item }">
              <div
                class="FontSize"
                v-if="item.ticket_creation_type != undefined"
              >
                {{ item.ticket_creation_type.replaceAll("_", " ") }}
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
            <template v-slot:[`item.service_serial_number`]="{ item }">
              <div
                class="FontSize"
                v-if="item.service_serial_number != undefined"
              >
                {{ item.service_serial_number }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.customer_unique_id != undefined">
                {{ item.customer_unique_id }}
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
var xlsx = require("json-as-xlsx");
export default {
  props: {
    DialogTicketDetails: Boolean,
    StoreObjTicketDetails: Array,
    StoreObjTicketDetailsWithFilter: Array,
    GetAllServiceRepresentativeList: Array,
  },
  data: () => ({
    mounted: false,
    TableHeight: 0,
    noDataText: "",
    Charts: "Table",
    representative_name: "ALL",
    ticket_creation_type: "ALL",
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
    ],
    select_type_items: ["Table", "Graph"],
    headers: [
      { text: "Ticket Id & Status", value: "ticket_id" },
      {
        text: "Customer",
        value: "customer_company_name",
      },
      { text: "Category & Product", value: "category_name" },
      { text: "Serial No & Customer ID", value: "service_serial_number" },
      { text: "Ticket Type & Rep", value: "ticket_creation_type" },
    ],
  }),
  watch: {
    representative_name(val) {
      if (val == "ALL") {
        this.StoreObjTicketDetails = this.StoreObjTicketDetailsWithFilter;
      } else {
        this.StoreObjTicketDetails =
          this.StoreObjTicketDetailsWithFilter.filter(
            (item) => item.representative_name == val
          );
      }
      if (this.StoreObjTicketDetails.length == 0) {
        this.noDataText = `No date found on ${val.replaceAll("_", " ")}`;
      }
    },
    ticket_creation_type(val) {
      if (val == "ALL") {
        this.StoreObjTicketDetails = this.StoreObjTicketDetailsWithFilter;
      } else {
        this.StoreObjTicketDetails =
          this.StoreObjTicketDetailsWithFilter.filter(
            (item) => item.ticket_creation_type == val
          );
      }
      if (this.StoreObjTicketDetails.length == 0) {
        this.noDataText = `No data found ${val.replaceAll("_", " ")}`;
      }
    },
    Charts(val) {
      if (val == "Graph") {
        this.GraphData();
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 300;
    this.GraphData();
  },
  methods: {
    exporttoexcel() {
      this.StoreObjTicketDetails.map((item) => {
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
          content: this.StoreObjTicketDetails,
        },
      ];
      let settings = {
        fileName:
          this.StoreObjTicketDetails[0].service_type_name +
          " Ticket Aging Report",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
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
    SundaryJob() {
      let SundaryJobTickets = 0;
      for (let i = 0; i < this.StoreObjTicketDetails.length; i++) {
        if (
          this.StoreObjTicketDetails[i].ticket_creation_type != undefined &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "-" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.StoreObjTicketDetails[i].ticket_creation_type == "SUNDARY_JOB"
          ) {
            SundaryJobTickets += 1;
          }
        }
      }
      return SundaryJobTickets;
    },
    NonCoreServiceJob() {
      let NonCoreServiceJobTickets = 0;
      for (let i = 0; i < this.StoreObjTicketDetails.length; i++) {
        if (
          this.StoreObjTicketDetails[i].ticket_creation_type != undefined &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "-" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.StoreObjTicketDetails[i].ticket_creation_type ==
            "NON_CORE_SERVICE_JOB"
          ) {
            NonCoreServiceJobTickets += 1;
          }
        }
      }
      return NonCoreServiceJobTickets;
    },
    CoreServiceJob() {
      let CoreServiceJobTickets = 0;
      for (let i = 0; i < this.StoreObjTicketDetails.length; i++) {
        if (
          this.StoreObjTicketDetails[i].ticket_creation_type != undefined &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "-" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.StoreObjTicketDetails[i].ticket_creation_type ==
            "CORE_SERVICE_JOB"
          ) {
            CoreServiceJobTickets += 1;
          }
        }
      }
      return CoreServiceJobTickets;
    },
    Installation() {
      let installationTickets = 0;
      for (let i = 0; i < this.StoreObjTicketDetails.length; i++) {
        if (
          this.StoreObjTicketDetails[i].ticket_creation_type != undefined &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "-" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.StoreObjTicketDetails[i].ticket_creation_type == "INSTALLATION"
          ) {
            installationTickets += 1;
          }
        }
      }
      return installationTickets;
    },
    Breakdown() {
      let breakdownTickets = 0;
      for (let i = 0; i < this.StoreObjTicketDetails.length; i++) {
        if (
          this.StoreObjTicketDetails[i].ticket_creation_type != undefined &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "-" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.StoreObjTicketDetails[i].ticket_creation_type == "BREAKDOWN"
          ) {
            breakdownTickets += 1;
          }
        }
      }
      return breakdownTickets;
    },
    ScheduleService() {
      let scheduleServiceTickets = 0;
      for (let i = 0; i < this.StoreObjTicketDetails.length; i++) {
        if (
          this.StoreObjTicketDetails[i].ticket_creation_type != undefined &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != "-" &&
          this.StoreObjTicketDetails[i].ticket_creation_type != null
        ) {
          if (
            this.StoreObjTicketDetails[i].ticket_creation_type ==
            "SCHEDULE_SERVICE"
          ) {
            scheduleServiceTickets += 1;
          }
        }
      }
      return scheduleServiceTickets;
    },
    DialogTicketDetailsEmit(Toggle) {
      this.Charts = "Table";
      this.representative_name = "ALL";
      this.ticket_creation_type = "ALL";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
