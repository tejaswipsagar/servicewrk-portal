<template>
  <div>
    <v-card elevation="0">
      <Overlay :overlay="overlay" />
      <GenerateExcelDialog
        :ticket_tabs="ticket_tabs"
        :select_type="select_type"
        :mrf_tabs="mrf_tabs"
        :StoreObj="StoreObj"
        :dialogGenerateExcel="dialogGenerateExcel"
        @clicked="dialogGenerateExcelEmit"
      />
      <GenerateNewReqReports
        :GenerateNewReqReportsDialog="generateNewReqReportsDialog"
        @clicked="GenerateNewReqReportsDialogEmit"
      />
      <v-toolbar dense class="elevation-0">
        <div class="mr-1 ml-1 largeFontSizeNew">
          <span>
            {{
              select_type === "TICKETS"
                ? "Ticket Reports"
                : select_type === "MRF"
                ? "MRF Reports"
                : "Customer Reports"
            }}</span
          >
          <!-- <span v-else-if="this.select_type == 'MRF'">MRF Reports</span> -->
        </div>
        <v-spacer />
        <v-btn
          v-if="select_type === 'CUSTOMERS'"
          small
          color="primary"
          class="mt-4"
          @click="generateNewReqReportsDialogMethod()"
        >
          Generate
          <v-icon small>mdi-microsoft-excel</v-icon>
        </v-btn>
        <v-select
          dense
          outlined
          label="Select Type"
          v-model="select_type"
          :items="select_type_items"
          class="FontSize WidthVariation2 mt-11 ml-2"
        >
        </v-select>
      </v-toolbar>
      <div v-if="select_type !== 'CUSTOMERS'">
        <v-card>
          <v-tabs
            v-if="select_type == 'TICKETS'"
            class="ma-2"
            v-model="ticket_tabs"
            background-color="transparent"
            color="primary"
          >
            <v-tab>Active</v-tab>
            <v-tab>Closed</v-tab>
            <v-tab>C1 Closed</v-tab>
            <v-tab
              v-if="
                $store.getters.get_current_user_details.user_type !=
                'SERVICE_PARTNER'
              "
              >C2 Closed</v-tab
            >
            <v-tab
              v-if="
                $store.getters.get_current_user_details.user_type !=
                'SERVICE_PARTNER'
              "
              >Both C1 & C2 Closed</v-tab
            >
          </v-tabs>
          <v-tabs
            v-else-if="select_type == 'MRF'"
            class="ma-2"
            v-model="mrf_tabs"
            background-color="transparent"
            color="primary"
          >
            <v-tab>Pending</v-tab>
            <v-tab>Approved</v-tab>
            <v-tab>Inprogress</v-tab>
            <v-tab>Rejected</v-tab>
          </v-tabs>
        </v-card>
        <div style="border: solid 1px black">
          <v-radio-group v-model="excel_type">
            <v-card class="pa-3 mx-7">
              <v-row no-gutters class="ml-6">
                <v-col cols="12" md="10" xs="12" sm="12">
                  <v-row>
                    <v-col cols="12" md="1" xs="12" sm="12">
                      <div class="font-weight-bold FontSize">Period :</div>
                    </v-col>
                    <v-col cols="12" md="1" sm="12" xs="12">
                      <v-radio label="Today" value="CURRENT_DAY"></v-radio>
                    </v-col>
                    <v-col cols="12" md="1" xs="12" sm="12">
                      <v-radio label="Month" value="MONTHLY"></v-radio>
                    </v-col>
                    <v-col cols="12" md="1" xs="12" sm="12">
                      <v-radio label="Custom" value="CUSTOM"></v-radio>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      sm="12"
                      xs="12"
                      v-if="excel_type == 'MONTHLY'"
                    >
                      <v-menu
                        offset-y
                        ref="menum"
                        v-model="menum"
                        :return-value.sync="month"
                        transition="scale-transition"
                        :close-on-content-click="false"
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
                            class="FontSize mb-n8 pl-2 smallwidth"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          no-title
                          scrollable
                          type="month"
                          v-model="month"
                          :max="maxMonth"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menum.save(month)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      xs="12"
                      sm="12"
                      v-if="excel_type == 'CUSTOM'"
                    >
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="start_date"
                        transition="scale-transition"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            width="290px"
                            v-bind="attrs"
                            label="From Date"
                            v-model="start_date"
                            class="mx-6 mb-n8 FontSize"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="start_date" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(start_date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      xs="12"
                      sm="12"
                      class="ml-1"
                      v-if="excel_type == 'CUSTOM'"
                    >
                      <v-menu
                        ref="menu1"
                        v-model="menu1"
                        :return-value.sync="end_date"
                        transition="scale-transition"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            v-on="on"
                            width="290px"
                            v-bind="attrs"
                            label="To Date"
                            v-model="end_date"
                            class="mx-6 mb-n8 FontSize"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          no-title
                          scrollable
                          v-model="end_date"
                          :min="start_date + 1"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu1 = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu1.save(end_date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="2" sm="12" xs="12">
                  <v-btn
                    small
                    color="primary"
                    class="primary white--text"
                    @click="openGenerateDialog()"
                  >
                    <v-icon>mdi-microsoft-excel</v-icon>Generate
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-radio-group>
          <v-card>
            <v-card-text>
              <div v-if="excel_type == 'CUSTOM'">
                <v-expansion-panels
                  class="mb-4 ml-3 mr-3"
                  v-for="(item, i) in select_type == 'TICKETS'
                    ? GetAllCustomTicketReport
                    : select_type == 'MRF'
                    ? GetAllCustomMRFReport
                    : []"
                  :key="i"
                >
                  <v-card outlined>
                    <div>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="FontSize font-weight-bold black--text"
                          expand-icon="mdi-menu-down"
                        >
                          {{
                            getCurrentDayTitle(
                              select_type == "TICKETS"
                                ? GetAllCustomTicketReport[i][0].Key
                                : GetAllCustomMRFReport[i][0].Key,
                              select_type == "TICKETS"
                                ? GetAllCustomTicketReport
                                : GetAllCustomMRFReport
                            )
                          }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div style="border: solid 1px black">
                            <v-data-table
                              :headers="table_headers"
                              :items="
                                select_type == 'TICKETS'
                                  ? GetAllCustomTicketReport[i]
                                  : select_type == 'MRF'
                                  ? GetAllCustomMRFReport[i]
                                  : []
                              "
                              dense
                              hide-default-footer
                              class="FontSize elevation-0 ma-1"
                            >
                              <template v-slot:[`item.LastModified`]="{ item }">
                                <div class="FontSize">
                                  {{ modifyDateTime(item) }}
                                </div>
                              </template>
                              <template v-slot:[`item.Key`]="{ item }">
                                <div class="FontSize">
                                  <div class="FontSize">
                                    <v-btn
                                      @click="downloadMethod(item)"
                                      small
                                      color="green"
                                      ><v-icon small>mdi-download</v-icon>
                                      Download</v-btn
                                    >
                                  </div>
                                </div>
                              </template>
                            </v-data-table>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </div>
                  </v-card>
                </v-expansion-panels>
              </div>
              <div v-else-if="excel_type == 'CURRENT_DAY'">
                <v-expansion-panels
                  class="mb-4 ml-3 mr-3"
                  v-for="(item, i) in select_type == 'TICKETS'
                    ? GetAllCurrentDayTicketReport
                    : select_type == 'MRF'
                    ? GetAllCurrentDayReport
                    : []"
                  :key="i"
                >
                  <v-card outlined>
                    <div>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="FontSize font-weight-bold black--text"
                          expand-icon="mdi-menu-down"
                        >
                          {{
                            getCurrentDayTitle(
                              select_type == "TICKETS"
                                ? GetAllCurrentDayTicketReport[i][0].Key
                                : GetAllCurrentDayReport[i][0].Key,
                              select_type == "TICKETS"
                                ? GetAllCurrentDayTicketReport
                                : GetAllCurrentDayReport
                            )
                          }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div style="border: solid 1px black">
                            <v-data-table
                              :headers="table_headers"
                              :items="
                                select_type == 'TICKETS'
                                  ? GetAllCurrentDayTicketReport[i]
                                  : select_type == 'MRF'
                                  ? GetAllCurrentDayReport[i]
                                  : []
                              "
                              dense
                              hide-default-footer
                              class="FontSize elevation-0 ma-1"
                            >
                              <template v-slot:[`item.LastModified`]="{ item }">
                                <div class="FontSize">
                                  {{ modifyDateTime(item) }}
                                </div>
                              </template>
                              <template v-slot:[`item.Key`]="{ item }">
                                <div class="FontSize">
                                  <div class="FontSize">
                                    <v-btn
                                      @click="downloadMethod(item)"
                                      small
                                      color="green"
                                      ><v-icon small>mdi-download</v-icon>
                                      Download</v-btn
                                    >
                                  </div>
                                </div>
                              </template>
                            </v-data-table>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </div>
                  </v-card>
                </v-expansion-panels>
              </div>
              <div v-else-if="excel_type == 'MONTHLY'">
                <v-expansion-panels
                  class="mb-4 ml-3 mr-3"
                  v-for="(item, i) in select_type == 'TICKETS'
                    ? GetAllMonthlyTicketsReport
                    : select_type == 'MRF'
                    ? GetAllMonthlyMRFReport
                    : []"
                  :key="i"
                >
                  <v-card outlined>
                    <div>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="FontSize font-weight-bold black--text"
                          expand-icon="mdi-menu-down"
                        >
                          {{
                            getCurrentDayTitle(
                              select_type == "TICKETS"
                                ? GetAllMonthlyTicketsReport[i][0].Key
                                : GetAllMonthlyMRFReport[i][0].Key,
                              select_type == "TICKETS"
                                ? GetAllMonthlyTicketsReport
                                : GetAllMonthlyMRFReport
                            )
                          }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div style="border: solid 1px black">
                            <v-data-table
                              :headers="table_headers"
                              :items="
                                select_type == 'TICKETS'
                                  ? GetAllMonthlyTicketsReport[i]
                                  : select_type == 'MRF'
                                  ? GetAllMonthlyMRFReport[i]
                                  : []
                              "
                              dense
                              hide-default-footer
                              class="FontSize elevation-0 ma-1"
                            >
                              <template v-slot:[`item.LastModified`]="{ item }">
                                <div class="FontSize">
                                  {{ modifyDateTime(item) }}
                                </div>
                              </template>
                              <template v-slot:[`item.Key`]="{ item }">
                                <div class="FontSize">
                                  <div class="FontSize">
                                    <v-btn
                                      @click="downloadMethod(item)"
                                      small
                                      color="green"
                                      ><v-icon small>mdi-download</v-icon>
                                      Download</v-btn
                                    >
                                  </div>
                                </div>
                              </template>
                            </v-data-table>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </div>
                  </v-card>
                </v-expansion-panels>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <div v-else style="border: 1px solid black" class="pa-5 ma-5">
        <v-data-table
          dense
          class="TableValFontsize"
          :headers="customerReportHeader"
          :items="customerReportItems"
          hide-default-footer
        >
          <template v-slot:[`item.sl_no`]="{ item, index }">
            <div>
              {{ index + 1 }}
            </div>
          </template>
          <template v-slot:[`item.LastModified`]="{ item }">
            <div>
              {{ modifyDateTime(item) }}
            </div>
          </template>
          <template v-slot:[`item.download_report`]="{ item }">
            <div>
              <v-btn
                small
                color="green"
                class="white--text"
                @click="downloadCustomerReports(item.Key)"
                >Download
                <v-icon small color="white">mdi-download</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import GenerateExcelDialog from "@/components/Analytics/Dialogs/GenerateExcelDialog.vue";
import { GetAllMonthlyTickets } from "@/mixins/Analytics/GetMontlyTicketReport.js";
import { GetAllMRFTickets } from "@/mixins/Analytics/GetMRFTicketReportDownloads.js";
import { getAllCustomerReportData } from "@/mixins/Analytics/GetAllCustomerReports.js";
import GenerateNewReqReports from "@/components/Analytics/Dialogs/GenerateNewReqReports.vue";
export default {
  mixins: [GetAllMRFTickets, GetAllMonthlyTickets, getAllCustomerReportData],
  components: {
    Overlay,
    GenerateExcelDialog,
    GenerateNewReqReports,
  },
  data: () => ({
    mrf_tabs: 0,
    ticket_tabs: 0,
    maxMonth: "",
    select_type: "TICKETS",
    excel_type: "MONTHLY",
    menu: false,
    menu1: false,
    menum: false,
    overlay: false,
    dialogGenerateExcel: false,
    StoreObj: {},
    GetAllCustomTicketReport: {},
    GetAllMonthlyMRFList: [],
    GetAllCustomMRFReport: [],
    GetAllRejectedMRFReport: [],
    GetAllPendingMRFReport: [],
    GetAllMonthlyTicketsList: [],
    GetAllApprovedMRFReport: [],
    GetAllMonthlyTicketsReport: [],
    GetAllCurrentDayTicketReport: [],
    GetAllMonthlyClosedTicketsList: [],
    table_headers: [
      { text: "Generated On", value: "LastModified" },
      { text: "Download", value: "Key" },
    ],
    select_type_items: [
      { text: "Tickets", value: "TICKETS" },
      { text: "MRF", value: "MRF" },
      { text: "Customers", value: "CUSTOMERS" },
    ],
    headers: [
      { text: "Month", value: "url" },
      { text: "Generated On", value: "LastModified" },
      { text: "Actions", value: "Last_Modified" },
    ],
    customerReportHeader: [
      { text: "Sl.No", value: "sl_no" },
      { text: "Generated On", value: "LastModified" },
      { text: "Download Report", value: "download_report" },
    ],
    customerReportItems: [],
    month: new Date().toISOString().substr(0, 7),
    end_date: new Date(new Date().getTime() - 0 * 86400000)
      .toISOString()
      .substr(0, 10),
    start_date: new Date(new Date().getTime() - 60 * 86400000)
      .toISOString()
      .substr(0, 10),
    generateNewReqReportsDialog: false,
  }),
  watch: {
    ticket_tabs(val) {
      this.GetAllCustomMRFReport = [];
      this.GetAllMonthlyMRFList = [];
      this.GetAllRejectedMRFReport = [];
      this.GetAllApprovedMRFReport = [];
      this.GetAllMonthlyTicketsList = [];
      this.GetAllCustomTicketReport = [];
      this.GetAllMonthlyTicketsReport = [];
      this.GetAllCurrentDayTicketReport = [];
      if (this.select_type == "TICKETS") {
        this.GetAllMonthlyTicketsMethod(
          val == 0
            ? "OPEN"
            : val == 1
            ? "CLOSED"
            : val == 2 || val == 3 || val == 4
            ? "PARTIALLY_CLOSED"
            : undefined,
          this.ticket_tabs == 2 ? true : undefined,
          this.ticket_tabs == 3 ? true : undefined,
          this.ticket_tabs == 4 ? true : undefined
        );
      } else if (this.select_type == "MRF") {
        this.GetAllMRFDetailsMethod(
          val == 0
            ? "PENDING"
            : val == 1
            ? "APPROVED"
            : val == 2
            ? "IN_PROGRESS"
            : val == 3
            ? "REJECTED"
            : undefined
        );
      }
    },
    mrf_tabs(val) {
      if (val != undefined) {
        this.GetAllMRFDetailsMethod(
          val == 0
            ? "PENDING"
            : val == 1
            ? "APPROVED"
            : val == 2
            ? "IN_PROGRESS"
            : val == 3
            ? "REJECTED"
            : undefined
        );
      }
    },
    async select_type(val) {
      if (val != undefined && val != null && val != "") {
        if (val == "TICKETS") {
          this.ticket_tabs = 0;
          this.excel_type = "MONTHLY";
          this.GetAllCustomMRFReport = [];
          this.GetAllMonthlyMRFList = [];
          this.GetAllRejectedMRFReport = [];
          this.GetAllApprovedMRFReport = [];
          this.GetAllMonthlyTicketsList = [];
          this.GetAllCustomTicketReport = [];
          this.GetAllMonthlyTicketsReport = [];
          this.GetAllCurrentDayTicketReport = [];
          this.GetAllMonthlyTicketsMethod("OPEN");
        } else if (val == "MRF") {
          this.mrf_tabs = 0;
          this.GetAllCustomMRFReport = [];
          this.GetAllMonthlyMRFList = [];
          this.GetAllRejectedMRFReport = [];
          this.GetAllApprovedMRFReport = [];
          this.GetAllMonthlyTicketsList = [];
          this.GetAllCustomTicketReport = [];
          this.GetAllMonthlyTicketsReport = [];
          this.GetAllCurrentDayTicketReport = [];
          this.GetAllMRFDetailsMethod("PENDING");
        } else {
          await this.callToGetCustomerReportMethod();
        }
      }
    },
  },
  async mounted() {
    this.GetAllMonthlyTicketsMethod(
      this.select_type == "TICKETS" ? "OPEN" : undefined
    );
    this.maxMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    if (this.$route.params != {} && this.$route.params.length != 0) {
      if (this.$route.params.page == "MRF") {
        this.select_type = "MRF";
      } else if (this.$route.params.page == "CUSTOMERS") {
        this.select_type = "CUSTOMERS";
        await this.callToGetCustomerReportMethod();
      }
    }
  },
  methods: {
    async callToGetCustomerReportMethod() {
      const response = await this.getAllCustomerReportDataMethod();
      this.customerReportItems = Object.values(response[0].customer_data)[0];
    },

    downloadCustomerReports(url) {
      window.open(url, "__blank");
    },
    dialogGenerateExcelEmit(Toggle) {
      this.dialogGenerateExcel = false;
      if (Toggle == 2) {
        if (this.select_type == "TICKETS") {
          this.GetAllMonthlyTicketsMethod(
            this.ticket_tabs == 0
              ? "OPEN"
              : this.ticket_tabs == 1
              ? "CLOSED"
              : this.ticket_tabs == 2 ||
                this.ticket_tabs == 3 ||
                this.ticket_tabs == 4
              ? "PARTIALLY_CLOSED"
              : undefined,
            this.ticket_tabs == 2 ? true : undefined,
            this.ticket_tabs == 3 ? true : undefined,
            this.ticket_tabs == 4 ? true : undefined
          );
        } else {
          this.GetAllMRFDetailsMethod(
            this.mrf_tabs == 0
              ? "PENDING"
              : this.mrf_tabs == 1
              ? "APPROVED"
              : this.mrf_tabs == 2
              ? "IN_PROGRESS"
              : this.mrf_tabs == 3
              ? "REJECTED"
              : undefined
          );
        }
      }
    },
    getCurrentDayTitle(item, obj) {
      if (item != undefined) {
        let splittedItem = item.split("/");
        let lengthOfSplittedItem = splittedItem.length;
        return splittedItem[lengthOfSplittedItem - 1].replace(".xlsx", "");
      }
    },

    modifyDateTime(item) {
      let dateFromServer = item.LastModified;
      let date = new Date(dateFromServer);
      let epochTime = date.getTime();
      let humanDateTime = new Date(epochTime);
      let stringifiedDate = String(humanDateTime);
      let finalWord = stringifiedDate.replace(
        "GMT+0530 (India Standard Time)",
        ""
      );
      return finalWord;
    },
    downloadMethod(item) {
      window.open(item.Key);
    },
    openGenerateDialog() {
      this.StoreObj.excel_type = this.excel_type;
      this.StoreObj.month = this.month;
      this.StoreObj.start_date = this.start_date;
      this.StoreObj.end_date = this.end_date;
      this.dialogGenerateExcel = true;
      this.StoreObj.generate_from = this.select_type;
    },

    generateNewReqReportsDialogMethod() {
      this.generateNewReqReportsDialog = true;
    },

    async GenerateNewReqReportsDialogEmit(Toggle) {
      this.generateNewReqReportsDialog = false;
      if (Toggle === 2) {
        await this.callToGetCustomerReportMethod();
      }
    },
  },
};
</script>
