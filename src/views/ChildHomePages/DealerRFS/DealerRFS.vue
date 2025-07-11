<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-card class="elevation-0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Request For Service</div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          label="Email Type"
          v-model="list_email_type"
          :items="list_email_typeItems"
          class="mt-9 FontSize maxWidthXSmall mr-2"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          @input="searchMethod()"
          prepend-inner-icon="mdi-magnify"
          class="mt-9 ml-2 FontSize WidthVariation1"
        ></v-text-field>
        <!-- <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="exporttoexcel"
              class="primary white--text ml-2 mt-2"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip> -->
      </v-toolbar>
      <v-card-text class="mt-3">
        <v-data-table
          dense
          fixed-header
          :height="TableHeight"
          :items-per-page="100"
          :items="filteredItems"
          :no-data-text="noDataText"
          @click:row="handleRowClick"
          style="cursor: pointer"
          :headers="CustomerInitiated"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          class="TableValFontsize"
        >
          <!-- list_email_type !== 'OPEN'
                ? headers.filter((item) => item.text != 'Actions')
                :  -->
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
          <template v-slot:[`item.email_subject`]="{ item }">
            <v-tooltip v-if="item.email_subject" bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                  class="FontSize text-capitalize"
                  v-bind="attrs"
                  v-on="on"
                  >{{
                    item.email_subject.length > 15
                      ? `${item.email_subject.slice(0, 15)}...`
                      : item.email_subject
                  }}</span
                >
              </template>
              <span>{{ item.email_subject }}</span>
            </v-tooltip>
            <span v-else>-</span>
            <div class="FontSize" v-if="item.email_received_on != undefined">
              {{
                new Date(item.email_received_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
          <template v-slot:[`item.email_body`]="{ item }">
            <v-tooltip v-if="item.email_body" bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                  class="FontSize text-capitalize"
                  v-bind="attrs"
                  v-on="on"
                  >{{
                    item.email_body.length > 15
                      ? `${item.email_body.slice(0, 15)}...`
                      : item.email_body
                  }}</span
                >
              </template>
              <span>{{ item.email_body }}</span>
            </v-tooltip>
            <span v-else>-</span>
          </template>
          <template v-slot:[`item.source`]="{ item }">
            <div v-if="item.source != undefined" class="FontSize">
              {{ item.source.replaceAll("_", " ") }}
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
          <template v-slot:[`item.initiater_email_id`]="{ item }">
            <div class="FontSize" v-if="item.initiater_email_id != undefined">
              {{ item.initiater_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.support_type`]="{ item }">
            <div class="FontSize" v-if="item.support_type != undefined">
              {{ item.support_type }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_warranty_type`]="{ item }">
            <div class="FontSize" v-if="item.ticket_warranty_type != undefined">
              {{ String(item.ticket_warranty_type).replaceAll(",", "") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_id`]="{ item }">
            <div class="FontSize">
              {{ item.custom_ticket_id || item.ticket_id }}
            </div>
          </template>

          <template v-slot:[`item.rft_initiated_on`]="{ item }">
            <div v-if="item.rft_initiated_on" class="">
              {{ new Date(item.rft_initiated_on * 1000).toLocaleString() }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ViewRfsDetails
      v-if="current_view == 'VIEW_RFS_DETAILS'"
      :StoreObj="StoreObj"
      @clicked="ViewRfsDetailsEmit"
    />
  </div>
</template>
<script>
import Vue from "vue";
var xlsx = require("json-as-xlsx");
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewRfsDetails from "@/components/RequestForService/Cards/ViewRFSdetails.vue";
import { GetDealerInitiatedTicketList } from "@/mixins/RequestForService/GetDealerTicketData.js";
export default {
  mixins: [GetDealerInitiatedTicketList],
  components: {
    Overlay,
    Snackbar,
    ViewRfsDetails,
  },
  data: () => ({
    ChangeBtn: 0,
    TableHeight: 0,
    selectedTab: "",
    search: "",
    current_view: "LIST",
    list_email_type: "REQUESTED",
    noDataText: "No Data Available..!",
    btnStatus: "",
    overlay: false,
    renderComp: true,
    Connection: null,
    showEditButton: false,
    dialogDeleteRFS: false,
    rejectRFSDialog: false,
    showActivateDeactivateButton: false,
    filteredItems: [],
    GetAllRFTsList: [],
    list_email_typeItems: ["REQUESTED", "CONVERTED", "REJECTED"],

    StoreObj: {},
    SnackBarComponent: {},
    columnName: [
      { label: "Received On", value: "updated_email_received_on" },
      { label: "Source", value: "source" },
      { label: "Customer Type", value: "customer_type" },
      { label: "Customer", value: "customer_company_name" },
      { label: "Contact Person", value: "customer_name" },
      { label: "Customer ID", value: "customer_unique_id" },
      { label: "Phone Number", value: "customer_contact_number" },
      { label: "Secondary Phone Number", value: "secondary_customer_contact" },
      { label: "Customer Category", value: "customer_category_name" },
      { label: "Address", value: "ticket_address" },
      { label: "Scheduled Ticket ID", value: "scheduled_ticket_id" },
      { label: "Category", value: "category_name" },
      { label: "Product", value: "service_name" },
      { label: "Serial Number", value: "service_serial_number" },
      { label: "Ticket Type", value: "ticket_creation_type" },
      { label: "Support", value: "ticket_warranty_type" },
      { label: "Support Type", value: "warranty_type" },
      { label: "Installation Date", value: "installation_date" },
      { label: "Invoice Date", value: "invoice_date" },
      { label: "Invoice Number", value: "ticket_invoice_number" },
      { label: "Free of Cost", value: "updated_is_free_of_cost" },
      { label: "Additional Comments", value: "additional_comments" },
      { label: "Preferred Visit Date", value: "prefered_visit_date" },
      { label: "Preferred Visit Time", value: "prefered_visit_time" },
      { label: "Ticket Priority", value: "ticket_priority" },
    ],
    CustomerInitiated: [
      { text: "Complaint ID", value: "complaint_id", width: "20%" },
      { text: "Ticket ID", value: "ticket_id", width: "20%" },
      {
        text: "Customer",
        value: "customer_company_name",
        width: "10%",
      },
      { text: "Product", value: "category_name", width: "13%" },
      { text: "Requested On", value: "rft_initiated_on" },
      { text: "service_serial_number", value: "service_serial_number" },
      { text: "Service", value: "support_type" },
      { text: "Warranty Type", value: "ticket_warranty_type" },
    ],
    ListingsArray: [
      { value: "Scheduled_Service", label: "Scheduled Service" },
      { value: "Customer_Initiated", label: "Customer Initiated" },
      { value: "Dealer_Initiated", label: "Dealer Initiated" },
    ],
    Listing_Type: "",
  }),
  watch: {
    async list_email_type(val) {
      if (val) {
        this.filteredItems = await this.GetDealerInitiatedTicketListMethod(val);
      }
    },
  },
  async mounted() {
    this.TableHeight = window.innerHeight - 190;
    await this.callMainApiMethod();
  },
  // created() {
  //   this.WebSocketConnection();
  // },
  methods: {
    async callMainApiMethod() {
      this.filteredItems = await this.GetDealerInitiatedTicketListMethod(
        this.list_email_type
      );
    },

    searchMethod() {
      const lowerSearchedText = this.search.toLowerCase();
      this.filteredItems = this.GetAllRFTsList.filter((item) => {
        const itemString = JSON.stringify(item).toLowerCase();
        return itemString.includes(lowerSearchedText);
      });
    },
    exporttoexcel() {
      this.GetAllRFTsList.map((item) => {
        item.updated_is_free_of_cost =
          item.is_free_of_cost == true ? "Yes" : "No";
        item.ticket_invoice_number =
          item.ticket_warranty_details != undefined
            ? item.ticket_warranty_details.ticket_invoice_number
            : "-";
        item.invoice_date =
          item.ticket_warranty_details != undefined
            ? item.ticket_warranty_details.ticket_invoice_date
            : "-";
        item.updated_email_received_on = new Date(
          item.email_received_on * 1000
        ).toLocaleString("en-IN");
      });
      let data = [
        {
          sheet: "Requests for Service",
          columns: this.columnName,
          content: this.GetAllRFTsList,
        },
      ];
      let settings = {
        fileName: "Requests for Service",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    handleRowClick(item) {
      this.StoreObj = item;
      this.StoreObj.action = "VIEW_RFS_DETAILS";
      this.current_view = "VIEW_RFS_DETAILS";
    },
    async dialogDeleteRFSEmit(Toggle) {
      this.dialogDeleteRFS = false;
      if (Toggle == 2) {
        this.filteredItems = await this.GetAllRFTsMethod(this.list_email_type);
      }
    },
    GetAccessModuleMethod() {
      let ModuleDetails = this.$store.getters.get_access_module_details;
      if (
        this.$store.getters.get_user_type != "ADMIN" &&
        this.$store.getters.get_user_type != "OWNER" &&
        this.$store.getters.get_user_type != "DEALER_OWNER" &&
        this.$store.getters.get_current_user_details.organization_details
          .is_access_control_enable == true
      ) {
        ModuleDetails.map((item) => {
          if (item.module_name == "Request For Service") {
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
    // WebSocketConnection() {
    //   this.Connection = new WebSocket(
    //     `wss://7njmrheb49.execute-api.ap-south-1.amazonaws.com/production?organization_id=${this.$store.getters.get_current_user_details.organization_id}`
    //   );
    //   var self = this;
    //   self.Connection.onopen = function () {};
    //   self.Connection.onclose = function () {};
    //   self.Connection.onmessage = function (event) {
    //     self.GetAllRFTsList.unshift(JSON.parse(event.data));
    //     var audio = new Audio(require("@/assets/RingTone.ogg"));
    //     audio.play();
    //   };
    // },
    ViewRfsDetailsEmit() {
      this.current_view = "LIST";
    },
  },
};
</script>

<style></style>
