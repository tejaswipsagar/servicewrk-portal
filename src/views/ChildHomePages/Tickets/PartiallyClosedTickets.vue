<template>
  <div>
    <Overlay :overlay="overlay" />
    <ReopenTicketsDialog
      :StoreObj="StoreObj"
      :dialogReopenTicket="dialogReopenTicket"
      @clicked="dialogReopenTicketEmit"
    />
    <CloseTicket
      :StoreObj="StoreObj"
      :closeDilaog="closeDilaog"
      @clicked="dialogCloseEmit"
    />
    <EditTicket
      :StoreObj="StoreObj"
      :dialogEditTicket="dialogEditTicket"
      @clicked="dialogEditTicketEmit"
    />
    <AddPaymentDetails
      :AddPaymentDetailsDialog="addPaymentDetailsDialog"
      :StoreObj="StoreObj"
      @clicked="AddPaymentDetailsDialogEmit"
    />
    <EditFOC
      :EditFOCDialog="editFOCDialog"
      :StoreObj="StoreObj"
      @clicked="EditFOCDialogEmit"
    />
    <v-card class="elevation-0" v-if="current_view == 'LIST'">
      <div class="d-flex pa-5">
        <div class="mr-2" v-for="(ticketBtn, index) in ticketBtns" :key="index">
          <v-btn
            dense
            small
            class="text-capitalize mr-2"
            :color="$route.path === ticketBtn.path ? 'primary' : null"
            @click="$router.push(ticketBtn.path)"
            >{{ ticketBtn.name }}</v-btn
          >
        </div>
      </div>
      <v-toolbar dense class="elevation-0 mx-3">
        <div class="largeFontSizeNew">
          Partially Closed Tickets :
          <span v-if="isSearching == false">
            <span v-if="partially_closed_by == 'ALL'">
              {{ this.partiallyClosedTicketsCount }}
            </span>
            <span v-else class="FontSize"
              ><v-icon small color="green">mdi-filter</v-icon>Filters
              Applied</span
            >
          </span>
          <span v-else class="FontSize green--text">
            <v-icon small color="green">mdi-magnify</v-icon>
            Results
            <span
              ><v-btn
                x-small
                class="primary white--text"
                @click="ClearMethod((isSearching = false))"
                ><v-icon small>mdi-close</v-icon></v-btn
              ></span
            >
          </span>
        </div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          label="Partially Closed By"
          v-model="partially_closed_by"
          class="FontSize WidthVariation1 mt-7"
          :items="
            $store.getters.get_current_user_details.user_type ==
            'SERVICE_PARTNER'
              ? partially_closed_by_items_service_partner
              : $store.getters.get_current_user_details.user_type ==
                'DEALER_OWNER'
              ? partially_closed_by_items_dealer_owner
              : partially_closed_by_items
          "
        >
        </v-select>
        <v-select
          dense
          outlined
          label="Search By"
          v-model="SearchBy"
          :items="SearchByItems"
          class="FontSize mt-7 WidthVariation2 ml-2"
        >
        </v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          class="FontSize mt-7 WidthVariation1 mr-2 ml-2"
          :rules="[
            (v) => !!v || 'Required',
            (v) => (v && v.length >= 3) || 'Minimum 3 characters',
          ]"
        >
          <template v-slot:append>
            <v-btn
              :disabled="search.length <= 2"
              icon
              small
              color="primary"
              v-if="isSearching == false"
              @click="GetTicketsByFilterMethod((isSearching = true))"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="primary"
              v-if="isSearching == true"
              @click="ClearMethod((isSearching = false))"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="$router.push('TicketReports')"
              class="primary white--text mt-0 ml-1"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Tickets in Excel</span>
        </v-tooltip>
      </v-toolbar>
      <v-col cols="12" xs="12" sm="12" md="12">
        <v-card-text class="py-0">
          <v-data-table
            dense
            fixed-header
            :page.sync="page"
            :loading="loading"
            :items-per-page="50"
            :height="TableHeight"
            :item-class="closedBy"
            style="cursor: pointer"
            :no-data-text="noDataText"
            @click:row="handleRowClick"
            @page-count="pageCount = $event"
            :headers="partiallyClosedTicketHeaders"
            :items="
              Current_Filter === 'WITHOUT_SEARCH'
                ? GetAllPartiallyClosedTicketList
                : GetAllSearchedTickets
            "
            :footer-props="{
              'disable-items-per-page': true,
            }"
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize" v-if="Current_Filter == 'WITHOUT_SEARCH'">
                {{ GetAllPartiallyClosedTicketList.indexOf(item) + 1 }}
              </div>
              <div class="FontSize" v-else>
                {{ GetAllSearchedTickets.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.custom_ticket_id`]="{ item }">
              <div class="FontSize" v-if="item.custom_ticket_id != undefined">
                {{ item.custom_ticket_id }}
              </div>
              <div class="FontSize" v-else-if="item.ticket_id != undefined">
                {{
                  `${item.ticket_id.split("-")[1]}-${
                    item.ticket_id.split("-")[2]
                  }-${item.ticket_id.split("-")[3]}-${
                    item.ticket_id.split("-")[4]
                  }`
                }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.representative_name">
                <span class="FontSize">{{ item.representative_name }}</span>
              </div>
              <div v-else>-</div>
              <div class="FontSize">
                <div
                  v-if="
                    item.captured_otp != undefined &&
                    item.satisfied_otp != undefined
                  "
                >
                  <span
                    v-if="item.captured_otp == item.satisfied_otp"
                    class="green--text"
                    >By Customer</span
                  >
                  <span v-else-if="item.not_satisfied_otp">
                    <span
                      class="red--text"
                      v-if="item.captured_otp == item.not_satisfied_otp"
                    >
                      By Technician
                    </span>
                  </span>
                </div>
                <div
                  v-else-if="item.closed_otp_type == 'PORTAL'"
                  class="blue--text FontSize"
                >
                  From Portal
                </div>
              </div>
            </template>
            <template v-slot:[`item.customer_company_name`]="{ item }">
              <div class="FontSize" v-if="item.customer_company_name">
                {{ item.customer_company_name }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.customer_name">
                {{ item.customer_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.category_name`]="{ item }">
              <div class="FontSize" v-if="item.category_name">
                {{ item.category_name }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.service_name">
                {{ item.service_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.ticket_status`]="{ item }">
              <div
                class="FontSize primary--text"
                v-if="item.ticket_status != undefined"
              >
                {{ item.ticket_status.replaceAll("_", " ") }}
              </div>
              <div class="FontSize" v-if="item.ticket_closed_time">
                {{
                  new Date(item.ticket_closed_time * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </div>
            </template>
            <template v-slot:[`item.Actions`]="{ item }">
              <!-- <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    color="green"
                    v-on="on"
                    @click.stop="checkItem(item, 'REOPEN')"
                  >
                    mdi-lock-open
                  </v-icon>
                </template>
                <span>Re-Open Ticket</span>
              </v-tooltip>
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-icon
                    color="red"
                    v-on="on"
                    small
                    class="ml-2"
                    @click.stop="checkItem(item, 'CLOSE')"
                    >mdi-close-thick</v-icon
                  >
                </template>
                <span>Close Ticket</span>
              </v-tooltip> -->
              <v-menu right bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="primary">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense nav v-if="handleCloseTicketOption(item)">
                  <v-list-item-group color="primary">
                    <v-list-item @click.stop="checkItem(item, 'REOPEN')">
                      <v-list-item-icon>
                        <v-icon small color="green"> mdi-lock-open </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Re-Open Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click.stop="checkItem(item, 'CLOSE')">
                      <v-list-item-icon>
                        <v-icon color="red" small>mdi-close-thick</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Close Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'EDIT_TICKET_PC')"
                    >
                      <v-list-item-icon>
                        <v-icon color="blue" small>mdi-ticket</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Edit Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      v-if="
                        (item.ticket_warranty_type === 'NO_WARRANTY' ||
                          item.ticket_warranty_type === 'EXTENDED_WARRANTY') &&
                        $store.getters.get_current_user_details
                          .organization_details
                          .enable_payment_details_for_tickets === true
                      "
                      @click.stop="checkItem(item, 'ADD_PAYMENT_INFO')"
                    >
                      <v-list-item-icon>
                        <v-icon color="pink" small>mdi-cash</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title
                          >Add Payment Details</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click.stop="checkItem(item, 'EDIT_FOC')">
                      <v-list-item-icon>
                        <v-icon small color="orange"
                          >mdi-all-inclusive-box</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Edit FOC</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-list v-else>
                  <div class="FontSize pa-2">
                    <strong style="color: red"
                      >This ticket has been closed, hence you can't access this
                      ticket action</strong
                    >
                  </div>
                </v-list>
              </v-menu>
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
      </v-col>
    </v-card>
    <TicketTabCard
      v-if="current_view == 'TABVIEW'"
      :StoreObj="StoreObj"
      @clicked="EmitTab"
    />
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import Overlay from "@/components/Extras/OverlayView.vue";
import CloseTicket from "@/components/Tickets/Dialogs/CloseTicket.vue";
import TicketTabCard from "@/components/Tickets/Cards/TicketTabCard.vue";
import ReopenTicketsDialog from "@/components/Tickets/Dialogs/ReopenTicketsDialog.vue";
import { GetAllTicketsBySearch } from "@/mixins/Tickets/GetTicketsBySearch.js";
import { GetAllPartiallyClosedTicket } from "@/mixins/Tickets/GetAllPartiallyClosedTickets.js";
import EditTicket from "@/components/Tickets/Dialogs/EditTicket.vue";
import AddPaymentDetails from "@/components/Tickets/Dialogs/AddPaymentInfoDialog.vue";
import EditFOC from "@/components/Tickets/Dialogs/EditFOCDialog.vue";
export default {
  mixins: [GetAllTicketsBySearch, GetAllPartiallyClosedTicket],
  components: {
    Overlay,
    CloseTicket,
    TicketTabCard,
    ReopenTicketsDialog,
    EditTicket,
    AddPaymentDetails,
    EditFOC,
  },
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    search: "",
    noDataText: "No data found..!",
    current_view: "LIST",
    SearchBy: "ticket_id",
    partially_closed_by: "ALL",
    partiallyClosedTicketsCount: "",
    Current_Filter: "WITHOUT_SEARCH",
    loading: false,
    overlay: false,
    closeDilaog: false,
    isSearching: false,
    dialogReopenTicket: false,
    dialogEditTicket: false,
    addPaymentDetailsDialog: false,
    editFOCDialog: false,
    GetAllPartiallyClosedTicketList: [],
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
    partially_closed_by_items_service_partner: [
      { text: "ALL", value: "ALL" },
      {
        text: "SERVICE REPRESENTATIVE",
        value: "SERVICE_REPRESENTATIVE_PARTIALLY_CLOSED",
      },
    ],
    partially_closed_by_items_dealer_owner: [
      { text: "ALL", value: "ALL" },
      {
        text: "DELAER REPRESENTATIVE",
        value: "DELAER_REPRESENTATIVE_PARTIALLY_CLOSED",
      },
    ],
    partially_closed_by_items: [
      {
        text: "All",
        value: "ALL",
      },
      {
        text: "REPRESENTATIVE",
        value: "REPRESENTATIVE_PARTIALLY_CLOSED",
      },
      {
        text: "SERVICE PARTNER",
        value: "SERVICE_PARTNER_PARTIALLY_CLOSED",
      },
      {
        text: "DEALER",
        value: "DEALER_PARTIALLY_CLOSED",
      },
      {
        text: "RSM",
        value: "RSM_PARTIALLY_CLOSED",
      },
      {
        text: "NSM",
        value: "NSM_PARTIALLY_CLOSED",
      },
      {
        text: "Serivce Co-Ordinator",
        value: "AGENT_PARTIALLY_CLOSED",
      },
    ],
    partiallyClosedTicketHeaders: [
      { text: "#", value: "sl_no", width: "6%" },
      {
        text: "Ticket ID",
        value: "custom_ticket_id",
        width: "25%",
      },
      {
        text: "Customer",
        value: "customer_company_name",
        width: "25%",
      },
      {
        text: "Product",
        value: "category_name",
        width: "13%",
      },
      {
        text: "Closed By",
        value: "ticket_status",
        width: "15%",
      },
      {
        text: "Actions",
        value: "Actions",
        width: "8%",
      },
    ],
    columnName: [
      {
        label: "Representative",
        value: "representative_name",
      },
      { label: "Ticket ID", value: "custom_ticket_id_or_ticket_id" },
      {
        label: "Customer Type",
        value: "customer_type",
      },
      {
        label: "Customer ID",
        value: "customer_unique_id",
      },
      {
        label: "Customer Name",
        value: "customer_company_name",
      },
      {
        label: "Contact Person Name",
        value: "customer_name",
      },
      {
        label: "Customer Category",
        value: "customer_category_name",
      },
      {
        label: "Customer Address",
        value: "ticket_address",
      },
      {
        label: "City",
        value: "ticket_city",
      },
      {
        label: "State",
        value: "ticket_state",
      },
      {
        label: "pincode",
        value: "ticket_pincode",
      },
      {
        label: "Additional Comments",
        value: "additional_comments",
      },
      {
        label: "Service Type",
        value: "service_type_name",
      },
      { label: "Problem Description", value: "service_ticket_description" },
      {
        label: "Ticket Type",
        value: "ticket_creation_type",
      },
      {
        label: "Ticket Territory",
        value: "territory_names",
      },
      {
        label: "Service Partner Name",
        value: "reporting_manager_name",
      },
      {
        label: "Reporting Manager",
        value: "ticket_reporting_manager_name",
      },
      {
        label: "Closure Remarks",
        value: "closure_remarks",
      },
      {
        label: "Created On",
        value: "new_ticket_created_on",
      },
      {
        label: "Closed On",
        value: "new_ticket_closed_on",
      },
      {
        label: "Closed Location",
        value: "ticket_closed_location",
      },
      {
        label: "Training Provided To",
        value: "training_provided_to",
      },
      {
        label: "Closure Type",
        value: "closure_type",
      },
      { label: "Product", value: "service_name" },
      {
        label: "Category",
        value: "category_name",
      },
      {
        label: "Closure Comments",
        value: "comments",
      },
      {
        label: "Created By",
        value: "created_by",
      },
      {
        label: "Free Of Cost",
        value: "is_foc",
      },
      {
        label: "Customer Phone Number",
        value: "customer_phone_number",
      },
      {
        label: "Customer Mail ID",
        value: "customer_email_id",
      },
      {
        label: "Ticket Status",
        value: "ticket_status",
      },
      {
        label: "Ticket Priority",
        value: "ticket_priority",
      },
      { label: "Serial Number", value: "service_serial_number" },
      {
        label: "Support",
        value: "ticket_warranty_type",
      },
      {
        label: "Support Type",
        value: "support_type",
      },
      {
        label: "WIP Sub Stage",
        value: "wip_sub_stage_name",
      },
      {
        label: "Ticket Invoice Date",
        value: "ticket_warranty_details.ticket_invoice_date",
      },
      {
        label: "Ticket Invoice Number",
        value: "ticket_warranty_details.ticket_invoice_number",
      },
      {
        label: "Secondary Phone Number",
        value: "secondary_customer_contact",
      },
      {
        label: "Secondary Representative",
        value: "secondary_technician_name",
      },
      {
        label: "Installation Date",
        value: "installation_date",
      },
      {
        label: "Preferred Visit Date",
        value: "prefered_visit_date",
      },
      {
        label: "Preferred Visit Time",
        value: "prefered_visit_time",
      },
      {
        label: "Customer Call Date",
        value: "customer_call_date",
      },
      {
        label: "Customer Call Time",
        value: "customer_call_time",
      },
      {
        label: "Ticket Source",
        value: "ticket_call_source",
      },
      {
        label: "Source Remarks",
        value: "source_remark",
      },
    ],
    StoreObj: {},
    SnackBarComponent: {},
    ticketBtns: [
      {
        name: "Active",
        path: "/ActiveTickets",
      },
      {
        name: "Partially Closed",
        path: "/PartiallyClosedTickets",
      },
      {
        name: "Closed",
        path: "/ClosedTickets",
      },
      {
        name: "Inactive",
        path: "/InactiveTickets",
      },
    ],
  }),
  watch: {
    partially_closed_by(val) {
      this.GetAllPartiallyClosedTicketList = [];
      this.GetAllPartiallyClosedTicketMethod(val, undefined);
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllPartiallyClosedTicketMethod("ALL", this.next_token);
      }
    },
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },
  },
  // computed: {
  //   restrictBtn() {
  //     if (
  //       this.$store.getters.get_current_user_details.user_type ===
  //         "SERVICE_PARTNER" ||
  //       this.$store.getters.get_current_user_details.user_type ===
  //         "DEALER_OWNER"
  //     ) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   },
  // },
  mounted() {
    this.partiallyClosedTicketsCount =
      this.$store.getters.get_current_user_details.organization_details
        .partially_closed_tickets_count != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .partially_closed_tickets_count
        : 0;
    this.TableHeight = window.innerHeight - 280;
    if (this.$store.getters.get_current_user_details.user_type === "RSM") {
      this.partially_closed_by_items = [
        {
          text: "REPRESENTATIVE",
          value: "REPRESENTATIVE_PARTIALLY_CLOSED",
        },
        {
          text: "SERVICE PARTNER",
          value: "SERVICE_PARTNER_PARTIALLY_CLOSED",
        },
      ];
      this.partially_closed_by = "REPRESENTATIVE_PARTIALLY_CLOSED";
    }
    this.GetAllPartiallyClosedTicketMethod(this.partially_closed_by, undefined);
  },
  methods: {
    handleCloseTicketOption(item) {
      const userType = this.$store.getters.get_current_user_details.user_type;
      const conditionMap = {
        AGENT: "agent_partially_closed",
        SERVICE_PARTNER: "service_partner_partially_closed",
        NSM: "nsm_partially_closed",
        RSM: "rsm_partially_closed",
        DEALER_OWNER: "dealer_partially_closed",
        PARTNER_AGENT: "service_partner_agent_partially_closed",
        DEALER_AGENT: "dealer_agent_partially_closed",
      };
      if (conditionMap[userType] && item[conditionMap[userType]]) {
        console.log("FALSE");
        return false;
      } else {
        return true;
      }
    },
    GetTicketsByFilterMethod(isSearching = true) {
      if (this.search != "") {
        this.Current_Filter = "WITH_SEARCH";
        this.GetAllTicketsBySearchMethod(
          this.search,
          this.SearchBy,
          undefined,
          "PARTIALLY_CLOSED"
        );
      } else {
        this.renderComp = false;
        this.isSearching = false;
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
    closedBy(item) {
      if (item.captured_otp != undefined && item.satisfied_otp != undefined) {
        if (item.captured_otp == item.satisfied_otp) {
          return "purple lighten-3";
        }
      }
    },
    ClearMethod() {
      this.Current_Filter = "WITHOUT_SEARCH";
      this.GetAllPartiallyClosedTicketList = [];
      this.GetAllPartiallyClosedTicketMethod(
        this.partially_closed_by,
        undefined
      );
      this.search = "";
    },
    // exporttoexcel() {
    //   this.GetAllPartiallyClosedTicketList.map((item) => {
    //     if (item.custom_ticket_id != undefined) {
    //       item.custom_ticket_id_or_ticket_id = item.custom_ticket_id;
    //     } else {
    //       item.custom_ticket_id_or_ticket_id = item.ticket_id;
    //     }
    //     if (item.ticket_created_on != undefined) {
    //       item.new_ticket_created_on = new Date(
    //         item.ticket_created_on * 1000
    //       ).toLocaleString("en-GB");
    //     } else {
    //       return "";
    //     }
    //     if (item.ticket_closed_time != undefined) {
    //       item.new_ticket_closed_on = new Date(
    //         item.ticket_closed_time * 1000
    //       ).toLocaleString("en-GB");
    //     } else {
    //       return "";
    //     }
    //     if (item.ticket_created_on != undefined) {
    //       item.new_ticket_created_on = new Date(
    //         item.ticket_created_on * 1000
    //       ).toLocaleString("en-GB");
    //     } else {
    //       return "";
    //     }
    //     item.territory_names =
    //       item.territory_names != undefined
    //         ? item.territory_names.toString()
    //         : undefined;
    //     item.is_foc = item.is_free_of_cost == true ? "Yes" : "No";
    //     this.$forceUpdate();
    //   });
    //   let data = [
    //     {
    //       sheet: "Partially Closed Tickets",
    //       columns: this.columnName,
    //       content: this.GetAllPartiallyClosedTicketList,
    //     },
    //   ];
    //   let settings = {
    //     fileName: "Partially Closed Tickets",
    //     extraLength: 3,
    //     writeOptions: {},
    //   };
    //   xlsx(data, settings);
    // },
    dialogCloseEmit(Toggle) {
      this.closeDilaog = false;
      if (Toggle == 2) {
        this.GetAllPartiallyClosedTicketList = [];
        this.GetAllPartiallyClosedTicketMethod(
          this.partially_closed_by,
          undefined
        );
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "REOPEN") {
        this.dialogReopenTicket = true;
      } else if (action == "CLOSE") {
        this.closeDilaog = true;
      } else if (action == "EDIT_TICKET_PC") {
        this.dialogEditTicket = true;
      } else if (action == "ADD_PAYMENT_INFO") {
        this.StoreObj.from = "ticket";
        this.addPaymentDetailsDialog = true;
      } else if (action === "EDIT_FOC") {
        this.editFOCDialog = true;
      }
    },
    handleRowClick(item) {
      this.StoreObj = item;
      this.current_view = "TABVIEW";
      this.StoreObj.action = "MOREACTION";
      this.count = 1;
    },
    dialogReopenTicketEmit(Toggle) {
      this.dialogReopenTicket = false;
      if (Toggle == 2) {
        this.GetAllPartiallyClosedTicketList = [];
        this.GetAllPartiallyClosedTicketMethod(
          this.partially_closed_by,
          undefined
        );
      }
    },
    EmitTab() {
      this.current_view = "LIST";
    },

    dialogEditTicketEmit(Toggle) {
      this.dialogEditTicket = false;
      if (Toggle === 2) {
        this.GetAllPartiallyClosedTicketList = [];
        this.GetAllPartiallyClosedTicketMethod(
          this.partially_closed_by,
          undefined
        );
      }
    },

    async AddPaymentDetailsDialogEmit(Toggle) {
      this.addPaymentDetailsDialog = false;
      if (Toggle === 2) {
        this.GetAllPartiallyClosedTicketList = [];
        this.GetAllPartiallyClosedTicketMethod(
          this.partially_closed_by,
          undefined
        );
      }
    },

    async EditFOCDialogEmit(Toggle) {
      this.editFOCDialog = false;
      if (Toggle === 2) {
        this.GetAllPartiallyClosedTicketList = [];
        this.GetAllPartiallyClosedTicketMethod(
          this.partially_closed_by,
          undefined
        );
      }
    },
  },
};
</script>
