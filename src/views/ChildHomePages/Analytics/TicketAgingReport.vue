<template>
  <div>
    <Overlay :overlay="overlay" />
    <ViewTicketAgingInChart
      :StoreObj="StoreObj"
      :ViewTicketAgingInChart="ViewTicketAgingInChart"
      :GetAllServiceRepresentativeList="GetAllServiceRepresentativeList"
      @clicked="ViewTicketAgingInChartEmit"
    />
    <DialogTicketDetails
      :StoreObjTicketDetails="StoreObjTicketDetails"
      :StoreObjTicketDetailsWithFilter="StoreObjTicketDetailsWithFilter"
      :GetAllServiceRepresentativeList="GetAllServiceRepresentativeList"
      :DialogTicketDetails="DialogTicketDetails"
      @clicked="DialogTicketDetailsEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0 mt-4">
        <div class="mr-1 ml-1 largeFontSizeNew">Ticket Aging Report</div>
        <v-spacer />
        <v-select
          dense
          outlined
          class="mr-1 ml-1 mt-6 FontSize WidthVariation2"
          :items="list_aging_action_type_items"
          v-model="list_aging_action_type"
          label="Select Type"
        >
        </v-select>
        <v-select
          dense
          outlined
          class="mr-1 ml-1 mt-6 FontSize widthSmall field_label_size field_height"
          label="View Type"
          v-model="Charts"
          :items="chartItems"
        ></v-select>
        <v-text-field
          dense
          v-if="Charts == 'Table'"
          outlined
          label="Search"
          class="mr-1 ml-1 mt-6 FontSize WidthVariation2 field_label_size field_height"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <!-- <v-tooltip color="primary" bottom v-if="Charts == 'Table'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              class="gradient-bg white--text"
              color="primary"
              @click="exporttoexcel"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip> -->
      </v-toolbar>
    </v-card>
    <v-row no-gutter v-if="Charts == 'Bar'">
      <v-col cols="12" md="12">
        <v-card>
          <div id="chart" class="" v-if="mounted == true">
            <apexchartView
              type="bar"
              height="500"
              :options="
                this.list_aging_action_type == 'USER'
                  ? chartOptionsUserBar
                  : this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                  ? chartOptionsTicketTypeBar
                  : chartOptionsBar
              "
              :series="
                this.list_aging_action_type == 'USER'
                  ? seriesUserBar
                  : this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                  ? seriesTicketTypeBar
                  : seriesBar
              "
            ></apexchartView>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="Charts == 'Pie'">
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="10">
        <div id="chart" v-if="mounted == true">
          <apexchartView
            type="pie"
            width="600"
            :options="
              this.list_aging_action_type == 'USER'
                ? chartOptionsUserPie
                : this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                ? chartOptionsTicketTypePie
                : chartOptions
            "
            :series="
              this.list_aging_action_type == 'USER'
                ? seriesUserPie
                : this.list_aging_action_type == 'TICKET_CREATION_TYPE'
                ? seriesTicketTypePie
                : series
            "
          ></apexchartView>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="Charts == 'Table'">
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          :headers="
            this.list_aging_action_type == 'USER'
              ? headersForUsers
              : this.list_aging_action_type == 'TICKET_CREATION_TYPE'
              ? headersForTicketCreationType
              : headers
          "
          :loading="loading"
          :height="TableHeight"
          fixed-header
          :items="
            this.list_aging_action_type == 'USER'
              ? GetOrganizationReportUser
              : this.list_aging_action_type == 'TICKET_CREATION_TYPE'
              ? GetOrganizationReportTicketType
              : GetOrganizationReport
          "
          :no-data-text="noDataText"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <span class="FontSize">{{
              GetOrganizationReport.indexOf(item) + 1
            }}</span>
          </template>
          <template v-slot:[`item.service_type_name`]="{ item }">
            <div class="FontSize" v-if="item.service_type_name != undefined">
              {{ item.service_type_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.between_0_to_1`]="{ item }">
            <div class="FontSize" v-if="item.between_0_to_1 != undefined">
              {{ item.between_0_to_1 }}
              <v-icon
                color="primary"
                v-if="item.between_0_to_1 != 0"
                small
                @click.stop="
                  openTicketDetails(item.between_0_to_1_ticket_details)
                "
                >mdi-information</v-icon
              >
            </div>
          </template>
          <template v-slot:[`item.between_1_to_2`]="{ item }">
            <div class="FontSize" v-if="item.between_1_to_2 != undefined">
              {{ item.between_1_to_2 }}
              <v-icon
                color="primary"
                v-if="item.between_1_to_2 != 0"
                small
                @click.stop="
                  openTicketDetails(item.between_1_to_2_ticket_details)
                "
                >mdi-information</v-icon
              >
            </div>
          </template>
          <template v-slot:[`item.between_3_to_5`]="{ item }">
            <div class="FontSize" v-if="item.between_3_to_5 != undefined">
              {{ item.between_3_to_5 }}
              <v-icon
                color="primary"
                v-if="item.between_3_to_5 != 0"
                small
                @click.stop="
                  openTicketDetails(item.between_3_to_5_ticket_details)
                "
                >mdi-information</v-icon
              >
            </div>
          </template>
          <template v-slot:[`item.between_5_to_7`]="{ item }">
            <div class="FontSize" v-if="item.between_5_to_7 != undefined">
              {{ item.between_5_to_7 }}
              <v-icon
                color="primary"
                v-if="item.between_5_to_7 != 0"
                small
                @click.stop="
                  openTicketDetails(item.between_5_to_7_ticket_details)
                "
                >mdi-information</v-icon
              >
            </div>
          </template>
          <template v-slot:[`item.between_7_to_15`]="{ item }">
            <div class="FontSize" v-if="item.between_7_to_15 != undefined">
              {{ item.between_7_to_15 }}
              <v-icon
                color="primary"
                v-if="item.between_7_to_15 != 0"
                small
                @click.stop="
                  openTicketDetails(item.between_7_to_15_ticket_details)
                "
                >mdi-information</v-icon
              >
            </div>
          </template>
          <template v-slot:[`item.greater_than_15`]="{ item }">
            <div class="FontSize" v-if="item.greater_than_15 != undefined">
              {{ item.greater_than_15 }}
              <v-icon
                color="primary"
                v-if="item.greater_than_15 != 0"
                small
                @click.stop="
                  openTicketDetails(item.greater_than_15_ticket_details)
                "
                >mdi-information</v-icon
              >
            </div>
          </template>
          <template v-slot:[`item.ticket_creation_type`]="{ item }">
            <div class="FontSize" v-if="item.ticket_creation_type != undefined">
              {{ item.ticket_creation_type.replaceAll("_", " ") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.representative_name`]="{ item }">
            <div class="FontSize" v-if="item.representative_name != undefined">
              {{ item.representative_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.total_tickets_count`]="{ item }">
            <div class="FontSize" v-if="item.total_tickets_count != undefined">
              {{ item.total_tickets_count }}
              <v-icon
                color="primary"
                v-if="item.total_tickets_count != 0"
                small
                @click.stop="total_tickets_count_details(item)"
                >mdi-information</v-icon
              >
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-row>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
import { GetOrganizationReport } from "@/mixins/Analytics/ListOrganizationsTicketAgingReport.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import ViewTicketAgingInChart from "@/components/Analytics/Dialogs/TicketAgingReportInGraph.vue";
import DialogTicketDetails from "@/components/Analytics/Dialogs/ViewTicketDetailsInTicketAgingReport.vue";
export default {
  mixins: [GetOrganizationReport, GetAllServiceRepresentative],
  components: {
    Overlay,
    DialogTicketDetails,
    ViewTicketAgingInChart,
  },
  data: () => ({
    TableHeight: 0,
    search: "",
    noDataText: "",
    Charts: "Table",
    list_aging_action_type: "SERVICE_TYPE",
    loading: false,
    mounted: false,
    DialogTicketDetails: false,
    ViewTicketAgingInChart: false,
    StoreObj: {},
    series: [],
    seriesUserPie: [],
    seriesTicketTypePie: [],
    StoreObjTicketDetails: [],
    GetOrganizationReport: [],
    GetOrganizationReportUser: [],
    GetAllServiceRepresentativeList: [],
    StoreObjTicketDetailsWithFilter: [],
    GetOrganizationReportTicketType: [],
    chartItems: ["Table", "Pie", "Bar"],
    headersForUsers: [
      { text: "User Name", value: "representative_name" },
      { text: "0 - 1 day", value: "between_0_to_1" },
      { text: "1 - 2 days ", value: "between_1_to_2" },
      { text: " 3 - 5 days", value: "between_3_to_5" },
      { text: " 5 - 7 days", value: "between_5_to_7" },
      { text: " 7 - 15 days", value: "between_7_to_15" },
      { text: " > 15 days", value: "greater_than_15" },
      { text: "Total Ticket", value: "total_tickets_count" },
    ],
    headers: [
      { text: "Service Type", value: "service_type_name" },
      { text: "0 - 1 day", value: "between_0_to_1" },
      { text: "1 - 2 days ", value: "between_1_to_2" },
      { text: " 3 - 5 days", value: "between_3_to_5" },
      { text: " 5 - 7 days", value: "between_5_to_7" },
      { text: " 7 - 15 days", value: "between_7_to_15" },
      { text: " > 15 days", value: "greater_than_15" },
      { text: "Total Ticket", value: "total_tickets_count" },
    ],
    columnName: [
      { label: "Service Type", value: "service_type_name" },
      { label: "0 - 1 day", value: "between_0_to_1" },
      {
        label: "0 - 1 day Ticket Id's",
        value: "between_0_to_1_ticket_details_ticket_ids",
      },
      { label: "1 - 2 days", value: "between_1_to_2" },
      {
        label: "1 - 2 days Ticket IDs",
        value: "between_1_to_2_ticket_details_ticket_ids",
      },
      { label: "3 - 5 days", value: "between_3_to_5" },
      {
        label: "3 - 5 days Ticket IDs",
        value: "between_3_to_5_ticket_details_ticket_ids",
      },
      { label: "5 - 7 days", value: "between_5_to_7" },
      {
        label: "5 - 7 days Ticket IDs",
        value: "between_5_to_7_ticket_details_ticket_ids",
      },
      { label: "7 - 15 days", value: "between_7_to_15" },
      {
        label: "7 - 15 days Ticket IDs",
        value: "between_7_to_15_ticket_details_ticket_ids",
      },
      { label: "> 15 days", value: "greater_than_15" },
      {
        label: "> 15 days Ticket Ids",
        value: "greater_than_15_ticket_details_ticket_ids",
      },
      { label: "Total Ticket Count", value: "total_tickets_count" },
    ],
    columnNameUser: [
      { label: "Representative Type", value: "representative_name" },
      { label: "0 - 1 day", value: "between_0_to_1" },
      {
        label: "0 - 1 day Ticket Id's",
        value: "between_0_to_1_ticket_details_ticket_ids",
      },
      { label: "1 - 2 days", value: "between_1_to_2" },
      {
        label: "1 - 2 days Ticket IDs",
        value: "between_1_to_2_ticket_details_ticket_ids",
      },
      { label: "3 - 5 days", value: "between_3_to_5" },
      {
        label: "3 - 5 days Ticket IDs",
        value: "between_3_to_5_ticket_details_ticket_ids",
      },
      { label: "5 - 7 days", value: "between_5_to_7" },
      {
        label: "5 - 7 days Ticket IDs",
        value: "between_5_to_7_ticket_details_ticket_ids",
      },
      { label: "7 - 15 days", value: "between_7_to_15" },
      {
        label: "7 - 15 days Ticket IDs",
        value: "between_7_to_15_ticket_details_ticket_ids",
      },
      { label: "> 15 days", value: "greater_than_15" },
      {
        label: "> 15 days Ticket Ids",
        value: "greater_than_15_ticket_details_ticket_ids",
      },
      { label: "Total Ticket Count", value: "total_tickets_count" },
    ],
    columnNameTicketType: [
      { label: "Ticket Type", value: "ticket_creation_type" },
      { label: "0 - 1 day", value: "between_0_to_1" },
      {
        label: "0 - 1 day Ticket Id's",
        value: "between_0_to_1_ticket_details_ticket_ids",
      },
      { label: "1 - 2 days", value: "between_1_to_2" },
      {
        label: "1 - 2 days Ticket IDs",
        value: "between_1_to_2_ticket_details_ticket_ids",
      },
      { label: "3 - 5 days", value: "between_3_to_5" },
      {
        label: "3 - 5 days Ticket IDs",
        value: "between_3_to_5_ticket_details_ticket_ids",
      },
      { label: "5 - 7 days", value: "between_5_to_7" },
      {
        label: "5 - 7 days Ticket IDs",
        value: "between_5_to_7_ticket_details_ticket_ids",
      },
      { label: "7 - 15 days", value: "between_7_to_15" },
      {
        label: "7 - 15 days Ticket IDs",
        value: "between_7_to_15_ticket_details_ticket_ids",
      },
      { label: "> 15 days", value: "greater_than_15" },
      {
        label: "> 15 days Ticket Ids",
        value: "greater_than_15_ticket_details_ticket_ids",
      },
      { label: "Total Ticket Count", value: "total_tickets_count" },
    ],
    list_aging_action_type_items: [
      { text: "Service Type", value: "SERVICE_TYPE" },
      { text: "Users", value: "USER" },
      { text: "Ticket Type", value: "TICKET_CREATION_TYPE" },
    ],
    headersForTicketCreationType: [
      { text: "Ticket Type", value: "ticket_creation_type" },
      { text: "0 - 1 day", value: "between_0_to_1" },
      { text: "1 - 2 days ", value: "between_1_to_2" },
      { text: " 3 - 5 days", value: "between_3_to_5" },
      { text: " 5 - 7 days", value: "between_5_to_7" },
      { text: " 7 - 15 days", value: "between_7_to_15" },
      { text: " > 15 days", value: "greater_than_15" },
      { text: "Total Ticket", value: "total_tickets_count" },
    ],
    seriesUserBar: [
      {
        name: "Total Ticket Count",
        data: [],
      },
    ],
    seriesTicketTypeBar: [
      {
        name: "Total Ticket Count",
        data: [],
      },
    ],
    seriesBar: [
      {
        name: "Total Ticket Count",
        data: [],
      },
    ],
    chartOptionsBar: {
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
    chartOptionsUserBar: {
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
    chartOptionsUserPie: {
      chart: {
        width: 800,
        type: "pie",
        toolbar: {
          show: true,
          seriesUserPie: true,
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
  }),
  watch: {
    list_aging_action_type(val) {
      this.Charts = "Table";
      this.search = "";
      this.GetOrganizationReportMethod(
        "TICKET_AGING",
        undefined,
        undefined,
        undefined,
        val,
        this.$store.getters.get_current_user_details.user_type ==
          "DEALER_OWNER" ||
          this.$store.getters.get_current_user_details.user_type ==
            "SERVICE_PARTNER"
          ? this.$store.getters.get_current_user_details.user_id
          : undefined,
        setTimeout(() => {
          this.GraphData();
          this.GraphData1();
        }, 1500)
      );
    },
    Charts(val) {
      if (val == "Pie") {
        this.GraphData();
      } else if (val == "Bar") {
        this.GraphData1();
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetOrganizationReportMethod(
      "TICKET_AGING",
      undefined,
      undefined,
      undefined,
      this.list_aging_action_type,
      this.$store.getters.get_current_user_details.user_type ==
        "DEALER_OWNER" ||
        this.$store.getters.get_current_user_details.user_type ==
          "SERVICE_PARTNER"
        ? this.$store.getters.get_current_user_details.user_id
        : undefined,
      setTimeout(() => {
        this.GraphData();
        this.GraphData1();
      }, 1500)
    );
  },
  methods: {
    GraphData1() {
      if (this.list_aging_action_type == "USER") {
        this.mounted = false;
        this.$nextTick(() => {
          this.GetOrganizationReportUser.map((item) => {
            if (item.representative_name != undefined) {
              this.chartOptionsUserBar.xaxis.categories.push(
                item.representative_name
              );
            }
          });
          this.seriesUserBar[0].data = this.GetOrganizationReportUser.map(
            (item) => {
              return item.total_tickets_count;
            }
          );
          this.mounted = true;
        });
      } else if (this.list_aging_action_type == "TICKET_CREATION_TYPE") {
        this.mounted = false;
        this.$nextTick(() => {
          this.GetOrganizationReportTicketType.map((item) => {
            if (item.ticket_creation_type != undefined) {
              this.chartOptionsTicketTypeBar.xaxis.categories.push(
                item.ticket_creation_type
              );
            }
          });
          this.seriesTicketTypeBar[0].data =
            this.GetOrganizationReportTicketType.map((item) => {
              return item.total_tickets_count;
            });
          this.mounted = true;
        });
      } else if (this.list_aging_action_type == "SERVICE_TYPE") {
        this.mounted = false;
        this.$nextTick(() => {
          this.GetOrganizationReport.map((item) => {
            if (item.service_type_name != undefined) {
              this.chartOptionsBar.xaxis.categories.push(
                item.service_type_name
              );
            }
          });
          this.seriesBar[0].data = this.GetOrganizationReport.map((item) => {
            return item.total_tickets_count;
          });
          this.mounted = true;
        });
      }
    },
    GraphData() {
      if (this.list_aging_action_type == "SERVICE_TYPE") {
        this.series = [];
        this.chartOptions.labels = [];
        this.mounted = false;
        this.$nextTick(() => {
          this.GetOrganizationReport.map((item) => {
            if (item.service_type_name != undefined) {
              this.chartOptions.labels.push(item.service_type_name);
            }
          });
          this.series = [];
          for (let i = 0; i < this.chartOptions.labels.length; i++) {
            let initialCounter = 0;
            this.series.push(initialCounter);
          }
          this.series = this.GetOrganizationReport.map((item) => {
            return item.total_tickets_count;
          });
          this.mounted = true;
          this.GraphData1();
        });
      } else if (this.list_aging_action_type == "USER") {
        this.seriesUserPie = [];
        this.chartOptionsUserPie.labels = [];
        this.mounted = false;
        this.$nextTick(() => {
          this.GetOrganizationReportUser.map((item) => {
            if (item.representative_name != undefined) {
              this.chartOptionsUserPie.labels.push(item.representative_name);
            }
          });
          this.seriesUserPie = [];
          for (let i = 0; i < this.chartOptionsUserPie.labels.length; i++) {
            let initialCounter = 0;
            this.seriesUserPie.push(initialCounter);
          }
          this.seriesUserPie = this.GetOrganizationReportUser.map((item) => {
            return item.total_tickets_count;
          });
          this.mounted = true;
          this.GraphData1();
        });
      } else if (this.list_aging_action_type == "TICKET_CREATION_TYPE") {
        this.seriesTicketTypePie = [];
        this.chartOptionsTicketTypePie.labels = [];
        this.mounted = false;
        this.$nextTick(() => {
          this.GetOrganizationReportTicketType.map((item) => {
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
          this.seriesTicketTypePie = this.GetOrganizationReportTicketType.map(
            (item) => {
              return item.total_tickets_count;
            }
          );
          this.mounted = true;
          this.GraphData1();
        });
      }
    },
    openTicketDetails(item) {
      this.StoreObjTicketDetails = item;
      this.StoreObjTicketDetailsWithFilter = this.StoreObjTicketDetails;
      this.DialogTicketDetails = true;
    },
    total_tickets_count_details(item) {
      this.StoreObj = item;
      this.ViewTicketAgingInChart = true;
    },
    DialogTicketDetailsEmit(Toggle) {
      this.DialogTicketDetails = false;
      this.GetOrganizationReportMethod(
        "TICKET_AGING",
        this.representative_id == "ALL" ? undefined : this.representative_id,
        this.service_name == "ALL" ? undefined : this.service_name,
        this.ticket_creation_type == "ALL"
          ? undefined
          : this.ticket_creation_type,
        this.list_aging_action_type,
        this.$store.getters.get_current_user_details.user_type ==
          "DEALER_OWNER" ||
          this.$store.getters.get_current_user_details.user_type ==
            "SERVICE_PARTNER"
          ? this.$store.getters.get_current_user_details.user_id
          : undefined
      );
    },
    ViewTicketAgingInChartEmit(Toggle) {
      this.ViewTicketAgingInChart = false;
      this.GetOrganizationReportMethod(
        "TICKET_AGING",
        this.representative_id == "ALL" ? undefined : this.representative_id,
        this.service_name == "ALL" ? undefined : this.service_name,
        this.ticket_creation_type == "ALL"
          ? undefined
          : this.ticket_creation_type,
        this.list_aging_action_type,
        this.$store.getters.get_current_user_details.user_type ==
          "DEALER_OWNER" ||
          this.$store.getters.get_current_user_details.user_type ==
            "SERVICE_PARTNER"
          ? this.$store.getters.get_current_user_details.user_id
          : undefined
      );
    },
    exporttoexcel() {
      let data = [
        {
          sheet:
            this.list_aging_action_type == "USER"
              ? "Ticket Aging By Users"
              : this.list_aging_action_type == "TICKET_CREATION_TYPE"
              ? "Ticket Aging By Ticket Type"
              : "Ticket Aging By Service Type",
          columns:
            this.list_aging_action_type == "USER"
              ? this.columnNameUser
              : this.list_aging_action_type == "TICKET_CREATION_TYPE"
              ? this.columnNameTicketType
              : this.columnName,
          content:
            this.list_aging_action_type == "USER"
              ? this.GetOrganizationReportUser
              : this.list_aging_action_type == "TICKET_CREATION_TYPE"
              ? this.GetOrganizationReportTicketType
              : this.GetOrganizationReport,
        },
      ];
      let settings = {
        fileName: "Ticket Aging Report",
        extraLength: 6,
        wirteOptions: {},
      };
      xlsx(data, settings);
    },
  },
};
</script>
