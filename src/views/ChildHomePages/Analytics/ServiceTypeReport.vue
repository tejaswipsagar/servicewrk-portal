<template>
  <div>
    <Overlay :overlay="overlay" />
    <ClosedTicketsDialog
      :taggedTerritoriesDialog1="taggedTerritoriesDialog1"
      :StoreObj="StoreObj"
      @clicked="closeEmmit2"
    />
    <OpenTicketDialog
      :taggedTerritoriesDialog="taggedTerritoriesDialog"
      :StoreObj="StoreObj"
      @clicked="closeEmmit1"
    />
    <v-toolbar dense class="elevation-0">
      <div class="mr-1 mt-3 largeFontSizeNew">Service Type Report</div>
      <v-spacer />
      <v-text-field
        dense
        v-if="Charts == 'Table'"
        outlined
        label="Search"
        class="mr-1 ml-1 mt-8 FontSize WidthVariation2 field_label_size field_height"
        v-model="search"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
      <v-select
        dense
        outlined
        class="mr-2 mt-8 WidthVariation2 FontSize field_label_size field_height XSmall"
        label="Select Type"
        v-model="Charts"
        :items="chartItems"
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
            label="Starting Date"
            outlined
            dense
            class="mr-1 mt-8 widthSmall FontSize field_label_size field_height"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        :return-value.sync="enddate"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="enddate"
            label="Ending Date"
            outlined
            dense
            class="ml-1 mr-1 widthSmall mt-8 FontSize field_label_size field_height"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker :min="date + 1" v-model="enddate" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="$refs.menu1.save(enddate)">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
      <v-tooltip color="primary" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            small
            class="primary white--text mt-2 ml-2"
            color="primary"
            @click="SortByDateMethod"
          >
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </template>
        <span class="white--text">Filter</span>
      </v-tooltip>
      <!-- <v-tooltip color="primary" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            small
            class="primary white--text ml-2 mt-2"
            @click="DownloadExcel"
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
          <apexchart
            type="pie"
            width="600"
            :series="series"
            :options="chartOptions"
          ></apexchart>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-4 mt-8" v-if="Charts == 'Bar'">
      <v-col cols="12" xs="12" sm="12" md="12">
        <v-card>
          <div id="chart" class="" v-if="mounted == true">
            <apexchartView
              type="bar"
              height="500"
              :series="series1"
              :options="chartOptions1"
            ></apexchartView>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="Charts == 'Table'">
      <v-card-text class="py-0">
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="headers"
          :height="TableHeight"
          :items-per-page="100"
          :items="GetOrganizationReport"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <span class="FontSize">{{
              GetOrganizationReport.indexOf(item) + 1
            }}</span>
          </template>
          <template v-slot:[`item.service_type_name`]="{ item }">
            <div class="FontSize">{{ item.service_type_name }}</div>
          </template>
          <template v-slot:[`item.total_ticket_count`]="{ item }">
            <div class="FontSize">{{ item.total_ticket_count }}</div>
          </template>
          <template v-slot:[`item.active_ticket_count`]="{ item }">
            <div class="FontSize">
              {{ item.active_ticket_count }}
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    fab
                    small
                    color="primary"
                    @click.stop="checkItem(item, 'OPEN')"
                    ><v-icon small>mdi-eye</v-icon></v-btn
                  >
                </template>
                <span>View Active Tickets</span>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:[`item.closed_ticket_count`]="{ item }">
            <div class="FontSize">
              {{ item.closed_ticket_count }}
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    icon
                    fab
                    small
                    color="primary"
                    @click.stop="checkItem(item, 'CLOSED')"
                    ><v-icon small>mdi-eye</v-icon></v-btn
                  >
                </template>
                <span>View Closed Tickets</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-row>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
var xlsx = require("json-as-xlsx");
import VueApexCharts from "vue-apexcharts";
import Overlay from "@/components/Extras/OverlayView.vue";
import OpenTicketDialog from "@/components/Analytics/Dialogs/OpenTicketsDialog.vue";
import ClosedTicketsDialog from "@/components/Analytics/Dialogs/ClosedTicketsDialog.vue";
import { GetOrganizationReport } from "@/mixins/Analytics/ListOrganizationsServiceTypeReport.js";
export default {
  mixins: [GetOrganizationReport],
  components: {
    Overlay,
    OpenTicketDialog,
    ClosedTicketsDialog,
    apexchart: VueApexCharts,
  },
  data: () => ({
    TableHeight: 0,
    search: "",
    menu: false,
    menu1: false,
    mounted: false,
    isLoading: false,
    taggedTerritoriesDialog: false,
    taggedTerritoriesDialog1: false,
    series: [],
    tableItemArray: [],
    GetOrganizationReport: [],
    chartItems: ["Table", "Pie", "Bar"],
    headers: [
      {
        text: "#",
        align: "start",
        value: "sl_no",
      },
      { text: "Service Type Name", value: "service_type_name" },
      { text: "Active Ticket", value: "active_ticket_count" },
      { text: "Closed Ticket", value: "closed_ticket_count" },
      { text: "Total Ticket Count", value: "total_ticket_count" },
    ],
    StoreObj: {},
    Charts: "Table",
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
    series1: [
      {
        name: "Total Ticket Count",
        data: [],
      },
    ],
    enddate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date: new Date(new Date().getTime() - 30 * 86400000)
      .toISOString()
      .substr(0, 10),
  }),
  watch: {
    Charts(val) {
      if (val == "Pie") {
        this.GraphData();
      }
    },
  },
  mounted() {
    (this.TableHeight = window.innerHeight - 200),
      this.GetOrganizationReportMethod(
        new Date(this.date).getTime(),
        new Date(this.enddate).getTime(),
        this.$store.getters.get_current_user_details.user_type ==
          "DEALER_OWNER" ||
          this.$store.getters.get_current_user_details.user_type ==
            "SERVICE_PARTNER"
          ? this.$store.getters.get_current_user_details.user_id
          : undefined,
        setTimeout(() => {
          this.GraphData();
        }, 1000)
      );
  },
  methods: {
    DownloadExcel() {
      let data = [
        {
          sheet: "test",
          columns: [
            {
              label: "Service Type",
              value: "service_type_name",
            },
            {
              label: "Active Tickets",
              value: "active_ticket_count",
            },
            {
              label: "Closed Tickets",
              value: "closed_ticket_count",
            },
            {
              label: "Total Tickets",
              value: "total_ticket_count",
            },
          ],
          content: this.GetOrganizationReport,
        },
      ];
      let settings = {
        fileName: "Service Type Report",
        extraLength: 3,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    SortByDateMethod() {
      this.series = [];
      this.chartOptions.labels = [];
      this.GetOrganizationReportMethod(
        new Date(this.date).getTime(),
        new Date(this.enddate).getTime() + 86400000
      );
      setTimeout(() => {
        this.GraphData();
      }, 1000);
    },
    GraphData() {
      this.series = [];
      this.chartOptions.labels = [];
      this.mounted = false;
      this.$nextTick(() => {
        this.GetOrganizationReport.map((item) => {
          this.chartOptions.labels.push(item.service_type_name);
        });
        this.series = [];
        for (let i = 0; i < this.chartOptions.labels.length; i++) {
          let initialCounter = 0;
          this.series.push(initialCounter);
        }
        this.series = this.GetOrganizationReport.map((item) => {
          return item.total_ticket_count;
        });
        this.mounted = true;
        this.GraphData1();
      });
    },
    GraphData1() {
      this.mounted = false;
      this.$nextTick(() => {
        this.chartOptions1.xaxis.categories = this.GetOrganizationReport.map(
          (item) => {
            return item.service_type_name;
          }
        );
        this.series1[0].data = this.GetOrganizationReport.map((item) => {
          return item.total_ticket_count;
        });
        this.mounted = true;
      });
    },
    closeEmmit1() {
      this.taggedTerritoriesDialog = false;
    },
    closeEmmit2() {
      this.taggedTerritoriesDialog1 = false;
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "OPEN") {
        this.taggedTerritoriesDialog = true;
      } else if (action == "CLOSED") {
        this.taggedTerritoriesDialog1 = true;
      }
    },
  },
};
</script>
