<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <StopOrResetTicketDialog
      :StoreObj="StoreObj"
      :dialogStopOrResetTicket="dialogStopOrResetTicket"
      @clicked="dialogStopTicketEmit"
    />
    <ViewScheduledService
      v-if="current_view == 'EDIT'"
      :StoreObj="StoreObj"
      @clicked="EmitView"
    />
    <CreateScheduledTicket
      v-if="current_view == 'CREATE'"
      :StoreObj="StoreObj"
      @clicked="CreateScheduledTicketCardEmit"
    />
    <ExcelUploadScheduledService
      :UploadExcelDialog="UploadExcelDialog"
      ref="editupload"
      @close="get_relavent_data"
    />
    <v-card class="ma-1" elevation="0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Scheduled Service :
          <span v-if="isSearching == false">
            <span v-if="this.ticket_status == 'SCHEDULED'">{{
              active_scheduled_service
            }}</span>
            <span v-else-if="this.ticket_status == 'STOP'">{{
              stoped_scheduled_service
            }}</span>
          </span>
          <span v-else class="FontSize green--text"
            ><v-icon small color="green">mdi-magnify</v-icon> Search Results
            <v-btn icon x-small>
              <v-icon color="red" @click="ClearMethod((isSearching = false))"
                >mdi-close</v-icon
              >
            </v-btn>
          </span>
        </div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          v-model="SearchBy"
          label="Search By"
          :items="SearchByItems"
          class="mt-9 FontSize widthSmall"
        >
        </v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          class="FontSize ml-2 WidthVariation1 mt-9"
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
        <v-select
          dense
          outlined
          class="mt-9 ml-2 FontSize WidthVariation2"
          label="Ticket Status"
          v-model="ticket_status"
          :items="ticketstatusItems"
          item-text="text"
          item-value="value"
        ></v-select>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-3" icon v-on="on" v-bind="attrs"
              ><v-icon color="primary">mdi-dots-vertical</v-icon></v-btn
            >
          </template>
          <v-card>
            <v-card-actions>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    class="primary white--text text-capitalize ml-2 mt-2"
                    small
                    @click="downloadExcelBaseMethod()"
                  >
                    <v-icon>mdi-cloud-download</v-icon>
                  </v-btn>
                </template>
                <span>Download Bulk Upload Template</span>
              </v-tooltip>
              <UploadExcel
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
              />
              <!-- <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    class="primary white--text ml-2 mt-2"
                    small
                    @click="exporttoexcel"
                  >
                    <v-icon>mdi-file-excel-outline</v-icon>
                  </v-btn>
                </template>
                <span class="white--text">Download Excel</span>
              </v-tooltip> -->
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    @click="
                      (current_view = 'CREATE'), (StoreObj.action = 'CREATE')
                    "
                    v-on="on"
                    v-bind="attrs"
                    v-show="showCreateButton"
                    color="primary"
                    class="primary white--text mt-2 ml-2"
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Create Schedule Ticket</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          style="cursor: pointer"
          :height="TableHeight"
          @click:row="handleRowClick"
          :headers="scheduledTicketHeaders"
          :items="
            Current_Filter == 'WITHOUT_SEARCH'
              ? GetAllScheduledTicketList
              : GetAllSearchedScheduledServices
          "
          class="elevation-0"
          :no-data-text="noDataText"
          :items-per-page="50"
          @page-count="pageCount = $event"
          :page.sync="page"
          hide-default-footer
        >
          <template v-slot:[`item.num`]="{ item }">
            <span class="caption" v-if="Current_Filter == 'WITHOUT_SEARCH'">{{
              GetAllScheduledTicketList.indexOf(item) + 1
            }}</span>
            <span
              class="caption"
              v-else-if="Current_Filter != 'WITHOUT_SEARCH'"
            >
              {{ GetAllSearchedScheduledServices.indexOf(item) + 1 }}
            </span>
            <div
              v-if="
                item.extended_warranty_details != undefined &&
                item.extended_warranty_details.length != 0
              "
            >
              <v-tooltip right color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="ml-n2"
                    v-on="on"
                    v-bind="attrs"
                    icon
                    color="green"
                    >mdi-alpha-e</v-icon
                  >
                </template>
                <span>Extended Warranty</span>
              </v-tooltip>
            </div>
          </template>
          <template
            v-for="(h, i) in scheduledTicketHeaders"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <div :key="i">
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ header.text }}</span>
                </template>
                <span>{{ header.tooltip_text }}</span>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:[`item.ticket_id`]="{ item }">
            <div class="FontSize font-weight-bold">
              {{
                `${item.ticket_id.split("-")[1]}-${
                  item.ticket_id.split("-")[2]
                }-${item.ticket_id.split("-")[3]}-${
                  item.ticket_id.split("-")[4]
                }`
              }}
            </div>
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
            <div class="FontSize">
              {{ item.category_name }}
            </div>
            <div class="FontSize">
              {{ item.service_name }}
            </div>
            <div
              v-if="item.service_serial_number != undefined"
              class="FontSize"
            >
              {{ item.service_serial_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.ticket_created_on * 1000).toLocaleString("en-IN")
              }}
            </div>
            <div
              class="FontSize"
              :class="
                item.ticket_status == 'STOP' ? 'red--text' : 'green--text'
              "
            >
              {{ item.ticket_status }}
            </div>
          </template>
          <template v-slot:[`item.amc_start_date`]="{ item }">
            <div class="FontSize" v-if="item.amc_start_date != undefined">
              <span class="font-weight-bold">Starts :</span>
              {{ item.amc_start_date }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.amc_end_date != undefined">
              <span class="font-weight-bold">Ends :</span>
              {{ item.amc_end_date }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.converted_to_rft_ticket`]="{ item }">
            <div class="FontSize">
              {{
                item.converted_to_rft_ticket == undefined
                  ? "0"
                  : item.converted_to_rft_ticket.length
              }}
              /
              {{ countTotalVisitsMethod(item) }}
            </div>
          </template>
          <template v-slot:[`item.converted_to_original_ticket`]="{ item }">
            <div class="FontSize">
              {{
                item.manually_converted_ticket == undefined
                  ? "0"
                  : item.rft_convert_ticket_count != undefined
                  ? item.manually_converted_ticket.length +
                    item.rft_convert_ticket_count
                  : item.manually_converted_ticket.length
              }}
              /
              {{ countTotalVisitsMethod(item) }}
            </div>
          </template>
          <template v-slot:[`item.ActionsD`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="purple lighten-3"
                  v-bind="attrs"
                  v-on="on"
                  v-show="showEditButton"
                  icon
                  @click.stop="checkItem(item, 'STOP')"
                  ><v-icon small>{{ "mdi-lock-reset" }}</v-icon></v-btn
                >
              </template>
              <span>Reset/Stop scheduled Ticket</span>
            </v-tooltip>
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
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
import * as XLSX from "xlsx";
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import UploadExcel from "@/components/UploadExcel/IndexView.vue";
import ViewScheduledService from "@/components/ScheduledService/Cards/ViewScheduledService.vue";
import CreateScheduledTicket from "@/components/ScheduledService/Cards/CreateScheduledTicket.vue";
import ExcelUploadScheduledService from "@/components/UploadExcel/ExcelUploadScheduledService.vue";
import StopOrResetTicketDialog from "@/components/ScheduledService/Dialogs/StopOrResetTicketDialog.vue";
import { GetAllScheduledTicket } from "@/mixins/ScheduleServices/GetAllScheduledTicket.js";
import { GetAllScheduledServicesBySearch } from "@/mixins/ScheduleServices/GetSearchScheduledTickets.js";
export default {
  mixins: [GetAllScheduledTicket, GetAllScheduledServicesBySearch],
  components: {
    Overlay,
    Snackbar,
    UploadExcel,
    ViewScheduledService,
    CreateScheduledTicket,
    StopOrResetTicketDialog,
    ExcelUploadScheduledService,
  },
  data: () => ({
    page: 1,
    count: 0,
    pageCount: 1,
    TableHeight: 0,
    search: "",
    current_view: "LIST",
    SearchBy: "ticket_id",
    ticket_status: "SCHEDULED",
    active_scheduled_service: "",
    stoped_scheduled_service: "",
    Current_Filter: "WITHOUT_SEARCH",
    overlay: false,
    renderComp: true,
    isSearching: false,
    showEditButton: false,
    showCreateButton: false,
    UploadExcelDialog: false,
    dialogStopOrResetTicket: false,
    GetAllScheduledTicketList: [],
    GetAllSearchedScheduledServices: [],
    scheduledTicketHeaders: [
      { text: "#", value: "num", width: "5%", tooltip_text: "Serial Number" },
      {
        text: "ID",
        value: "ticket_id",
        tooltip_text: "Scheduled Service ID",
        width: "25%",
      },
      {
        text: "Product",
        value: "category_name",
        tooltip_text: "Product Details",
        width: "15%",
      },
      {
        text: "Created",
        value: "ticket_created_on",
        tooltip_text: "Created On",
        width: "10%",
      },
      {
        text: "RFSs",
        value: "converted_to_rft_ticket",
        tooltip_text: "Converted to RFT",
        width: "6%",
      },
      {
        text: "Tickets",
        value: "converted_to_original_ticket",
        tooltip_text: "Converted To Tickets",
        width: "6%",
      },
      {
        text: "Support",
        value: "amc_start_date",
        tooltip_text: "Support",
        width: "13%",
      },
      {
        text: "Actions",
        value: "ActionsD",
        tooltip_text: "Actions",
        width: "8%",
      },
    ],
    ticketstatusItems: [
      { text: "SCHEDULED", value: "SCHEDULED" },
      { text: "STOP", value: "STOP" },
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
      { label: "Ticket ID", value: "ticket_id" },
      { label: "Created On", value: "resultDate" },
      { label: "Customer", value: "customer_company_name" },
      { label: "Contact Person", value: "customer_name" },
      { label: "Phone Number", value: "customer_phone_number" },
      { label: "Email ID", value: "customer_email_id" },
      { label: "Customer Address", value: "ticket_address" },
      { label: "Category", value: "category_name" },
      { label: "Product", value: "service_name" },
      { label: "Serial Number", value: "service_serial_number" },
      { label: "Service Type", value: "service_type_name" },
      { label: "Support", value: "ticket_warranty_type" },
      { label: "Support Type", value: "amc_type_name" },
      { label: "Support Start Date", value: "amc_start_date" },
      { label: "Support End Date", value: "amc_end_date" },
      { label: "Payment Received", value: "payment_received" },
      { label: "Payment Details", value: "payment_details" },
      { label: "Payment Amount", value: "payment_amount" },
      { label: "Payment Method", value: "payment_method" },
      { label: "Ticket Status", value: "ticket_status" },
      { label: "Ticket Status", value: "ticket_status" },
    ],
    StoreObj: {},
    exceldata: {},
    SnackBarComponent: {},
  }),
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },
    ticket_status(val) {
      this.GetAllScheduledTicketList = [];
      this.GetAllScheduledTicketMethod(val, undefined, undefined);
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllScheduledTicketMethod(
          this.ticket_status,
          undefined,
          this.next_token
        );
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 190;
    this.GetAllScheduledTicketMethod(this.ticket_status, undefined, undefined);
    this.GetAccessModuleMethod();
    this.countTotalVisitsMethod();
  },
  methods: {
    countTotalVisitsMethod(item) {
      if (item != undefined) {
        let normalScheduleVisits =
          item.rft_date_list != undefined &&
          item.rft_date_list != [] &&
          item.rft_date_list.length != 0
            ? item.rft_date_list.length
            : 0;
        let totalExtendedVisits = 0;
        if (
          item.extended_warranty_details != undefined &&
          item.extended_warranty_details.length != 0 &&
          item.extended_warranty_details != []
        ) {
          for (let i = 0; i < item.extended_warranty_details.length; i++) {
            if (
              item.extended_warranty_details[i].extendedWarrantyDatesList !=
              undefined
            ) {
              totalExtendedVisits +=
                item.extended_warranty_details[i].extendedWarrantyDatesList
                  .length;
            }
          }
        }
        let totalVisits = normalScheduleVisits + totalExtendedVisits;
        return totalVisits;
      }
    },
    exporttoexcel() {
      this.GetAllScheduledTicketList.map((item) => {
        item.resultDate = new Date(
          item.ticket_created_on * 1000
        ).toLocaleString("en-GB");
        this.$forceUpdate();
      });
      let data = [
        {
          sheet: "Schedule Service",
          columns: this.columnName,
          content: this.GetAllScheduledTicketList,
        },
      ];
      let settings = {
        fileName: "Schedule Services",
        extraLength: 6,
        writeOption: {},
      };
      xlsx(data, settings);
    },
    ClearMethod() {
      this.GetAllScheduledTicketList = [];
      this.Current_Filter = "WITHOUT_SEARCH";
      setTimeout(() => {
        this.GetAllScheduledTicketMethod(
          this.ticket_status,
          undefined,
          undefined
        );
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
    downloadExcelBaseMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Customer Name",
        "Contact Person *",
        "Customer Country Code *",
        "Contact Number *",
        "Email ID",
        "Category Name *",
        "Product Name *",
        "Serial Number",
        "Service Type *",
        "Support",
        "Support Type",
        "Support Start Date",
        "Support End Date",
        "Frequency",
        "Invoice Date",
        "Invoice Number",
        "Payment Received",
        "Payment Date",
        "Payment Details",
        "Payment Method",
        "Amount",
      ];
      async function generateExcel() {
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Bulk Upload Deal Fields");
          sheet.addRow(fieldNamesArray);
          for (let num = 2; num < 5000; num++) {
            for (let i = 0; i < sheet._columns.length; i++) {
              sheet.getColumn(sheet._columns[i].number).width = 30;
            }
          }
          const buffer = await workbook.xlsx.writeBuffer();
          return buffer;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
      setTimeout(() => {
        generateExcel()
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `Scheduled Service Bulk Upload-${new Date().toLocaleString(
              "en-GB"
            )}.xlsx`;
            downloadLink.click();
          })
          .catch((err) => {
            console.error("Error:", err);
          });
        this.overlay = false;
      }, 1000);
    },
    GetAccessModuleMethod() {
      console.log(
        "Module Details",
        this.$store.getters.get_access_module_details
      );
      let ModuleDetails = this.$store.getters.get_access_module_details;
      if (
        this.$store.getters.get_user_type != "ADMIN" &&
        this.$store.getters.get_user_type != "OWNER" &&
        this.$store.getters.get_user_type != "DEALER_OWNER" &&
        this.$store.getters.get_current_user_details.organization_details
          .is_access_control_enable == true
      ) {
        ModuleDetails.map((item) => {
          if (item.module_name == "Scheduled Service") {
            item.module_rights.map((moduleRights) => {
              if (moduleRights.CREATE == true) {
                this.showCreateButton = true;
              }
              if (moduleRights.EDIT == true) {
                this.showEditButton = true;
              }
              if (moduleRights.DELETE == true) {
                this.showActivateDeactivateButton = true;
              }
            });
          }
        });
      } else {
        this.showCreateButton = true;
        this.showEditButton = true;
        this.showActivateDeactivateButton = true;
      }
    },
    get_relavent_data() {
      this.UploadExcelDialog = false;
      this.GetAllScheduledTicketMethod(
        this.ticket_status,
        undefined,
        undefined
      );
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.exceldata.tabledata = results;
      this.exceldata.tableheader = header;
      this.$refs.editupload.getexceldata(this.exceldata);
      this.UploadExcelDialog = true;
    },
    EmitView() {
      this.current_view = "LIST";
    },
    handleRowClick(item) {
      this.StoreObj = item;
      this.StoreObj.action = "EDIT";
      this.current_view = "EDIT";
    },
    dialogStopTicketEmit(Toggle) {
      this.dialogStopOrResetTicket = false;
      if (Toggle == 2) {
        this.search = "";
        this.Current_Filter = "WITHOUT_SEARCH";
        this.isSearching = false;
        this.GetAllScheduledTicketList = [];
        this.GetAllSearchedScheduledServices = [];
        this.GetAllScheduledTicketMethod(
          this.ticket_status,
          undefined,
          undefined
        );
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "STOP") {
        this.dialogStopOrResetTicket = true;
      }
    },
    CreateScheduledTicketCardEmit(Toggle, Status_Message) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: Status_Message,
        };
        this.GetAllScheduledTicketList = [];
        this.GetAllScheduledTicketMethod(
          this.ticket_status,
          undefined,
          undefined
        );
      }
    },
  },
};
</script>
