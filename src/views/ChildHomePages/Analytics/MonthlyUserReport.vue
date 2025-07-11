<template>
  <div>
    <VisitDetails
      :StoreObj="StoreObj"
      v-if="current_view == 'EDIT'"
      @clicked="VisitDetailsEmit"
    />
    <v-card elevation="0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">User Daily Report</div>
        <v-spacer />
        <v-menu
          ref="menum"
          v-model="menu_month"
          :close-on-content-click="false"
          :return-value.sync="report_month"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-8 smallwidth FontSize mr-2"
              outlined
              denses
              v-model="report_month"
              label="Select Month"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="report_month"
            type="month"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu_month = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="save(report_month)"> OK </v-btn>
          </v-date-picker>
        </v-menu>
        <v-autocomplete
          label="Select User"
          outlined
          dense
          class="FontSize mediumWidth mt-6 mr-2"
          :items="GetAllServiceRepresentativeList"
          item-text="user_name"
          item-value="user_id"
          v-model="user_id"
        >
        </v-autocomplete>
        <!-- <v-tooltip color="primary" bottom>
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
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :headers="headers"
          :loading="loading"
          :height="TableHeight"
          :items="GetAllUserMonthlyReportList"
          :no-data-text="noDataText"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.total_distance_travelled`]="{ item }">
            <div v-if="item.total_distance_travelled != undefined">
              {{ item.total_distance_travelled }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.visit_details`]="{ item }">
            <div v-if="item.visit_details != undefined">
              {{ item.visit_details.length }}
              <v-icon small color="primary" @click="openListVisitDetails(item)"
                >mdi-information</v-icon
              >
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_type`]="{ item }">
            <div class="FontSize" v-if="item.user_type != undefined">
              {{ item.user_type }}
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import VisitDetails from "@/components/Analytics/Cards/VisitDetails.vue";
import { GetAllUserMonthlyReport } from "@/mixins/Analytics/GetAllUserMonthlyReport.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
export default {
  mixins: [GetAllUserMonthlyReport, GetAllServiceRepresentative],
  components: {
    VisitDetails,
  },
  data: () => ({
    TableHeight: 0,
    loading: false,
    menu_month: false,
    user_id: "ALL",
    noDataText: "",
    current_view: "LIST",
    StoreObj: {},
    markers: [],
    newArrayForExcelData: [],
    GetAllUserMonthlyReportList: [],
    GetAllServiceRepresentativeList: [],
    headers: [
      { text: "User Name", value: "user_name" },
      { text: "User Type", value: "user_type" },
      { text: "Report Date", value: "report_date" },
      { text: "Distance in KM's", value: "total_distance_travelled" },
      { text: "Details", value: "visit_details" },
    ],
    columnName: [
      { label: "User Name", value: "user_name" },
      { label: "User Type", value: "user_type" },
      { label: "Report Date", value: "report_date" },
      { label: "Distance Travelled", value: "total_distance_travelled" },
      { label: "Visited Tickets", value: "visit_details_length" },
      { label: "Ticket ID", value: "ticket_id" },
      { label: "Category", value: "category_name" },
      { label: "Product", value: "service_name" },
      { label: "Serial Number", value: "service_serial_number" },
      { label: "Customer", value: "customer_company_name" },
      { label: "Contact Person", value: "customer_name" },
    ],
    report_month: new Date().toISOString().substr(0, 7),
  }),
  watch: {
    user_id(val) {
      this.GetAllUserMonthlyReportMethod(
        val == "ALL" ? undefined : val,
        this.updatedMonth()
      );
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 190;
    this.GetAllUserMonthlyReportMethod(
      this.user_id == "ALL" ? undefined : this.user_id,
      this.updatedMonth()
    );
    this.GetAllServiceRepresentativeMethod("ACTIVE");
  },
  methods: {
    updatedMonth() {
      let month = this.report_month;
      if (month[5] == 0) {
        let updatedMonth = month.slice(0, 5) + month.slice(6, 7);
        return updatedMonth;
      } else {
        return month;
      }
    },
    exporttoexcel() {
      let data = [
        {
          sheet: "User Daily Report",
          columns: this.columnName,
          content: this.newArrayForExcelData,
        },
      ];
      let settings = {
        fileName: "User Daily Report",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    save(report_month) {
      if (this.report_month != "" && this.report_month != null) {
        this.GetAllUserMonthlyReportMethod(
          this.user_id == "ALL" ? undefined : this.user_id,
          this.updatedMonth()
        );
        this.$refs.menum.save(report_month);
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
    VisitDetailsEmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 1) {
        this.current_view = "LIST";
      }
    },
    openListVisitDetails(item) {
      this.StoreObj = item;
      this.current_view = "EDIT";
    },
  },
};
</script>
