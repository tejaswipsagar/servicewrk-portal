<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <RejectRFS
      :RejectRFSDialog="rejectRFSDialog"
      :StoreObj="StoreObj"
      @clicked="RejectRFSDialogEmit"
    />
    <CustomerLookup
      :CustomerLookupDialog="customerLookupDialog"
      :StoreObj="customerLookupStoreObj"
      @clicked="CustomerLookupDialogEmit"
    />
    <v-card class="elevation-0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <!-- <div class="largeFontSizeNew">Request For Service</div> -->
        <!-- <v-select
          dense
          outlined
          label="Service Type"
          v-model="Listing_Type"
          :items="ListingsArray"
          item-text="label"
          item-value="value"
          class="mt-9 ml-3 maxWidth"
        ></v-select> -->
        <v-tabs v-model="ChangeBtn" class="ml-5 mt-10 pb-5">
          <v-btn
            depressed
            rounded
            v-for="(item, index) in ListingsArray"
            :key="index"
            class="ml-2 mt-2"
            :color="selectedTab === item.label ? 'primary' : 'dark'"
            @click.stop="changeListingMethod(item.label)"
            >{{
              item.label === "RFS"
                ? "Call Initiated"
                : item.label === "Customer Initiated"
                ? "Web Initiated"
                : item.label
            }}</v-btn
          >
        </v-tabs>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          label="Email Type"
          v-model="list_email_type"
          :items="
            Listing_Type == 'Scheduled Service'
              ? list_email_typeItems.filter((item) => item != 'REQUESTED')
              : list_email_typeItems.filter((item) => item != 'OPEN')
          "
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
          v-if="Listing_Type !== 'RFS'"
          dense
          fixed-header
          :height="TableHeight"
          :items-per-page="100"
          :items="filteredItems"
          :no-data-text="noDataText"
          @click:row="handleRowClick"
          style="cursor: pointer"
          :headers="
            Listing_Type === 'Scheduled Service'
              ? headers
              : Listing_Type === 'RFS'
              ? rfsHeader
              : CustomerInitiated
          "
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
          <!-- <template v-slot[`item.custom_ticket_id`]="{ item }">
            <div class="FontSize">
              {{ item.custom_ticket_id || item.ticket_id }}
            </div>
          </template> -->
          <template v-slot:[`item.custom_ticket_id`]="{ item }">
            <div v-if="Listing_Type == 'Dealer Initiated'">
              <v-tooltip
                color="primary"
                bottom
                v-if="item.is_new_customer || item.is_new_serial_number"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="pink" size="10" v-on="on" v-bind="attrs">
                    mdi-circle
                  </v-icon>
                </template>
                <span class="white--text">New Customer</span>
              </v-tooltip>
              {{ item.custom_ticket_id }}
            </div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="
                item.type == 'OPEN' &&
                $store.getters.get_user_type != 'DEALER_OWNER'
              "
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  v-show="showEditButton"
                  @click="checkItem(item, 'CONVERTTOTICKET')"
                >
                  mdi-sync
                </v-icon>
              </template>
              <span
                v-if="$store.getters.get_user_type != 'DEALER_OWNER'"
                class="white--text"
                >Convert To Ticket</span
              >
            </v-tooltip>
            <v-tooltip
              bottom
              color="primary"
              v-if="$store.getters.get_user_type == 'DEALER_OWNER'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  @click="checkItem(item, 'CONVERTTOTICKET')"
                >
                  mdi-eye
                </v-icon>
              </template>
              <span
                v-if="$store.getters.get_user_type == 'DEALER_OWNER'"
                class="white--text"
                >View</span
              >
            </v-tooltip>
            <v-tooltip bottom color="primary" v-if="item.type == 'OPEN'">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  color="red"
                  class="mr-2"
                  v-show="showActivateDeactivateButton"
                  @click.stop="checkItem(item, 'MOVETOTRASH')"
                  v-if="$store.getters.get_user_type != 'DEALER_OWNER'"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span class="white--text">Move To Trash</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.customer_initiated_action`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="list_email_type == 'REQUESTED'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  @click="
                    checkItem(item, 'CONVERTTOTICKET', 'customer_initiated')
                  "
                >
                  mdi-sync
                </v-icon>
              </template>
              <span class="white--text">Convert To Ticket</span>
            </v-tooltip>
            <v-tooltip
              bottom
              color="primary"
              v-if="list_email_type == 'REQUESTED'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="ml-2"
                  color="red"
                  @click.stop="checkItem(item, 'REJECT')"
                >
                  mdi-close
                </v-icon>
              </template>
              <span class="white--text">Reject</span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.rft_initiated_on`]="{ item }">
            <div v-if="item.rft_initiated_on" class="FontSize">
              {{ new Date(item.rft_initiated_on * 1000).toLocaleString() }}
            </div>
          </template>
          <template v-slot:[`item.ticket_created_on`]="{ item }">
            <div v-if="item.ticket_created_on" class="FontSize">
              {{
                new Date(item.ticket_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
        </v-data-table>
        <v-data-table
          v-else
          :search="search"
          dense
          fixed-header
          :height="TableHeight"
          :items-per-page="100"
          :items="rfsDataItems"
          :no-data-text="noDataText"
          style="cursor: pointer"
          :headers="rfsHeader"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          class="TableValFontsize"
          @click:row="checkCallInitiatedDetails"
        >
          <template v-slot:[`item.sl_no`]="{ item, index }">
            <div class="d-flex">
              <div>
                {{ index + 1 }}
              </div>
              <div v-if="item.is_customer_verified" class="ml-2">
                <v-tooltip color="primary" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" small color="green"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                  <span class="white--text">Verified Customer</span>
                </v-tooltip>
              </div>
              <div v-else class="ml-2">
                <v-tooltip color="primary" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" small color="red"
                      >mdi-close-circle</v-icon
                    >
                  </template>
                  <span class="white--text">Customer not verified</span>
                </v-tooltip>
              </div>
            </div>
          </template>
          <template v-slot:[`item.customer_contact_number`]="{ item }">
            <div>
              {{ item.customer_contact_number || "-" }}
            </div>
          </template>

          <template v-slot:[`item.s3_wav_url`]="{ item }">
            <div class="d-flex">
              <div class="mr-1">
                <v-btn icon @click.stop="listenAudioMethod(item)">
                  <v-icon small color="blue">{{
                    item.playPauseIcon || "mdi-play"
                  }}</v-icon>
                </v-btn>
              </div>
              <div class="mt-2">
                {{ formatTime(item.currentTime || 0) }} /
                {{ formatTime(item.duration || 0) }}
              </div>
            </div>
          </template>
          <template v-slot:[`item.rfs_initiated_on`]="{ item }">
            <div class="FontSize" v-if="item.rfs_initiated_on != undefined">
              {{
                new Date(item.rfs_initiated_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
          <template v-slot:[`item.speech_text`]="{ item }">
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on" v-bind="attrs">
                  {{ formateSpeechText(item.speech_text) || "-" }}
                </div>
              </template>
              <span class="white--text">{{ item.speech_text }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="item.is_customer_verified === true"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  @click.stop="raiseTicketMethod(item)"
                >
                  mdi-plus-box
                </v-icon>
              </template>
              <span class="white--text">Raise a Ticket</span>
            </v-tooltip>
            <v-tooltip bottom color="primary" v-else>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  @click.stop="addCustomerToDatabaseMethod(item)"
                >
                  mdi-database-plus
                </v-icon>
              </template>
              <span class="white--text">Add to database</span>
            </v-tooltip>
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="ml-2"
                  color="red"
                  @click.stop="rejectCallRFSMethod(item)"
                >
                  mdi-close
                </v-icon>
              </template>
              <span class="white--text">Reject RFS</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <CreateTicketCard
      v-if="current_view == 'CONVERTTOTICKET'"
      :StoreObj="StoreObj"
      @clicked="CreateTicketCardEmit"
    />
    <ConvertTicketNewCustomer
      v-if="current_view == 'CONVERT_TICKET_NEW_CUSTOMER'"
      :StoreObj="StoreObj"
      @clicked="ConvertTicketNewCustomerEmit"
    />
    <ViewRfsDetails
      v-if="current_view == 'VIEW_RFS_DETAILS'"
      :StoreObj="StoreObj"
      @clicked="ViewRfsDetailsEmit"
    />
    <DeleteRFSDialog
      :StoreObj="StoreObj"
      :dialogDeleteRFS="dialogDeleteRFS"
      @clicked="dialogDeleteRFSEmit"
    />
    <CreateTicketCard2
      v-if="current_view == 'CREATE'"
      :StoreObj="StoreObj"
      :CreateFrom="'RFS'"
      :RFSObj="customerLookupStoreObj"
      @clicked="CreateTicketCardEmit"
    />
    <CallInitiatedDetails
      v-if="current_view == 'CALL_INITIATED_DETAILS'"
      :StoreObj="StoreObj"
      @clicked="CallInitiatedDetailsEmit"
    />
    <RejectCallRFS
      :RejectCallRFSDialog="rejectCallRFSDialog"
      :StoreObj="StoreObj"
      @clicked="RejectCallRFSDialogEmit"
    />
    <!-- <RaiseTicket
      v-if="current_view === 'RAISE_TICKET_PAGE'"
      :StoreObj="raiseTicketObj"
    /> -->
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
import DeleteRFSDialog from "@/components/RequestForService/Cards/DeleteRFSDialog.vue";
import CreateTicketCard from "@/components/Product/Cards/CreateTicketFromProductFleet.vue";
import { API, graphqlOperation } from "aws-amplify";
import { UpdateEmailType } from "@/graphql/mutations.js";
import { GetAllRFTs } from "@/mixins/RequestForService/GetAllRFTs.js";
import { ListCustomerRFS } from "@/mixins/RequestForService/ListCustomerInitiated.js";
import RejectRFS from "@/components/RequestForService/Dialogs/RejectRFSDialog.vue";
import { GetDealerInitiatedTicketList } from "@/mixins/RequestForService/GetDealerTicketData.js";
import { ListHelloWRKRFS } from "@/graphql/queries.js";
import CustomerLookup from "@/components/RequestForService/Dialogs/CustomerLookupDialog.vue";
// import RaiseTicket from "@/components/RequestForService/Cards/RaiseTicket.vue";
import CallInitiatedDetails from "@/components/RequestForService/Cards/CallInitiatedDetails.vue";
import CreateTicketCard2 from "@/components/Tickets/Cards/CreateTicketCard.vue";
import RejectCallRFS from "@/components/RequestForService/Dialogs/RejectCallRFSDialog.vue";
import ConvertTicketNewCustomer from "@/components/RequestForService/Cards/ConvertTicketNewCustomer.vue";
export default {
  mixins: [GetAllRFTs, ListCustomerRFS, GetDealerInitiatedTicketList],
  components: {
    Overlay,
    Snackbar,
    ViewRfsDetails,
    DeleteRFSDialog,
    CreateTicketCard,
    RejectRFS,
    CustomerLookup,
    // RaiseTicket,
    CreateTicketCard2,
    CallInitiatedDetails,
    RejectCallRFS,
    ConvertTicketNewCustomer,
  },
  data: () => ({
    ChangeBtn: 0,
    TableHeight: 0,
    selectedTab: "",
    search: "",
    current_view: "LIST",
    list_email_type: "",
    noDataText: "No Data Available..!",
    btnStatus: "",
    overlay: false,
    renderComp: true,
    Connection: null,
    showEditButton: false,
    dialogDeleteRFS: false,
    rejectRFSDialog: false,
    showActivateDeactivateButton: false,
    customerLookupDialog: false,
    rejectCallRFSDialog: false,
    customerLookupStoreObj: {},
    filteredItems: [],
    GetAllRFTsList: [],
    list_email_typeItems: ["OPEN", "REQUESTED", "CONVERTED", "REJECTED"],
    headers: [
      { text: "Customer", value: "customer_company_name", width: "20%" },
      { text: "Source", value: "source", width: "13%" },
      { text: "Email Subject", value: "email_subject" },
      { text: "Email Body", value: "email_body" },
      { text: "Initiator Email ", value: "initiater_email_id" },
      { text: "Actions", value: "Actions", width: "10%" },
    ],
    StoreObj: {},
    SnackBarComponent: {},
    playPauseIcon: "mdi-play",
    audio: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
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
      { text: "Customer", value: "customer_company_name", width: "10%" },
      { text: "Product", value: "category_name", width: "13%" },
      { text: "Requested On", value: "rft_initiated_on" },
      { text: "service_serial_number", value: "service_serial_number" },
      { text: "Service", value: "support_type" },
      { text: "Warranty Type", value: "ticket_warranty_type" },
      { text: "Actions", value: "customer_initiated_action", width: "10%" },
    ],
    rfsHeader: [
      {
        text: "Sl No",
        value: "sl_no",
      },
      {
        text: "RFS Display ID",
        value: "rfs_display_id",
      },
      {
        text: "Customer Contact Number",
        value: "customer_contact_number",
      },
      {
        text: "Call Initiated On",
        value: "rfs_initiated_on",
      },
      {
        text: "Complaint",
        value: "speech_text",
      },
      {
        text: "Voice Message",
        value: "s3_wav_url",
      },
      {
        text: "Action",
        value: "action",
      },
    ],
    ListingsArray: [
      { value: "Scheduled_Service", label: "Scheduled Service" },
      { value: "Customer_Initiated", label: "Customer Initiated" },
      { value: "Dealer_Initiated", label: "Dealer Initiated" },
      { value: "RFS", label: "RFS" },
    ],
    Listing_Type: "",
    rfsDataItems: [],
    raiseTicketObj: {},
  }),
  watch: {
    async list_email_type(val) {
      if (val) {
        // this.filteredItems = await this.GetAllRFTsMethod(val);

        if (this.Listing_Type == "Scheduled Service") {
          this.filteredItems = await this.GetAllRFTsMethod(val);
        } else if (this.Listing_Type == "Customer Initiated") {
          this.filteredItems = await this.ListCustomerRFSMethod(val);
          if (val === "CONVERTED") {
            this.CustomerInitiated = [
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
            ];
          } else {
            this.CustomerInitiated = [
              { text: "Complaint ID", value: "complaint_id", width: "20%" },
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
              {
                text: "Actions",
                value: "customer_initiated_action",
                width: "10%",
              },
            ];
          }
        } else if (this.Listing_Type == "Dealer Initiated") {
          this.filteredItems = await this.GetDealerInitiatedTicketListMethod(
            this.list_email_type
          );
          if (val === "CONVERTED") {
            this.CustomerInitiated = [
              { text: "Ticket ID", value: "custom_ticket_id", width: "20%" },
              {
                text: "Customer",
                value: "customer_company_name",
                width: "10%",
              },
              { text: "Product", value: "category_name", width: "13%" },
              { text: "Requested On", value: "ticket_created_on" },
              { text: "service_serial_number", value: "service_serial_number" },
              { text: "Service", value: "support_type" },
              { text: "Warranty Type", value: "ticket_warranty_type" },
            ];
          } else {
            this.CustomerInitiated = [
              { text: "Ticket ID", value: "custom_ticket_id", width: "20%" },
              ,
              {
                text: "Customer",
                value: "customer_company_name",
                width: "10%",
              },
              { text: "Product", value: "category_name", width: "13%" },
              { text: "Requested On", value: "ticket_created_on" },
              { text: "service_serial_number", value: "service_serial_number" },
              { text: "Service", value: "support_type" },
              { text: "Warranty Type", value: "ticket_warranty_type" },
              {
                text: "Actions",
                value: "customer_initiated_action",
                width: "10%",
              },
            ];
          }
        } else {
          this.rfsDataItems = [];
          this.callRFSDataApi(val);
          if (val === "CONVERTED" || val === "REJECTED") {
            this.rfsHeader = [
              {
                text: "Sl No",
                value: "sl_no",
              },
              {
                text: "RFS Display ID",
                value: "rfs_display_id",
              },
              {
                text: "Customer Contact Number",
                value: "customer_contact_number",
              },
              {
                text: "Call Initiated On",
                value: "rfs_initiated_on",
              },
              {
                text: "Complaint",
                value: "speech_text",
              },
              {
                text: "Voice Message",
                value: "s3_wav_url",
              },
            ];
          } else {
            this.rfsHeader = [
              {
                text: "Sl No",
                value: "sl_no",
              },
              {
                text: "RFS Display ID",
                value: "rfs_display_id",
              },
              {
                text: "Customer Contact Number",
                value: "customer_contact_number",
              },
              {
                text: "Call Initiated On",
                value: "rfs_initiated_on",
              },
              {
                text: "Complaint",
                value: "speech_text",
              },
              {
                text: "Voice Message",
                value: "s3_wav_url",
              },
              {
                text: "Action",
                value: "action",
              },
            ];
          }
        }
      }
    },

    selectedTab(val) {
      if (val === "Customer Initiated") {
        this.CustomerInitiated = [
          { text: "Complaint ID", value: "complaint_id", width: "20%" },
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
          {
            text: "Actions",
            value: "customer_initiated_action",
            width: "10%",
          },
        ];
      } else if (val === "Dealer Initiated") {
        this.CustomerInitiated = [
          { text: "Ticket ID", value: "custom_ticket_id", width: "20%" },
          {
            text: "Customer",
            value: "customer_company_name",
            width: "10%",
          },
          { text: "Product", value: "category_name", width: "13%" },
          { text: "Requested On", value: "ticket_created_on" },
          { text: "service_serial_number", value: "service_serial_number" },
          { text: "Service", value: "support_type" },
          { text: "Warranty Type", value: "ticket_warranty_type" },
          {
            text: "Actions",
            value: "customer_initiated_action",
            width: "10%",
          },
        ];
      } else if (val === "RFS") {
        this.rfsDataItems = [];
        this.list_email_type = "REQUESTED";
        this.callRFSDataApi(this.list_email_type);
      }
    },
  },
  async mounted() {
    this.TableHeight = window.innerHeight - 190;
    this.Listing_Type = "Scheduled Service";
    if (this.ListingsArray.length > 0) {
      this.selectedTab = this.ListingsArray[0].label;
    }
    this.list_email_type = "OPEN";
    this.filteredItems = await this.GetAllRFTsMethod("OPEN");
    await this.GetAccessModuleMethod();
  },
  // created() {
  //   this.WebSocketConnection();
  //   console.log("WEB_SOCK");
  // },
  methods: {
    async changeListingMethod(val) {
      this.Listing_Type = val;
      this.selectedTab = val;
      if (val == "Scheduled Service") {
        this.btnStatus = val;
        this.list_email_type = "OPEN";
        this.filteredItems = await this.GetAllRFTsMethod(this.list_email_type);
      } else if (val == "Customer Initiated") {
        this.btnStatus = val;
        this.list_email_type = "REQUESTED";
        this.filteredItems = await this.ListCustomerRFSMethod(
          this.list_email_type
        );
      } else if (val === "Dealer Initiated") {
        this.list_email_type = "REQUESTED";
        this.filteredItems = await this.GetDealerInitiatedTicketListMethod(
          this.list_email_type
        );
      }
    },

    formateSpeechText(item) {
      if (item.length > 50) {
        return item.slice(0, 50) + "...";
      } else {
        return item;
      }
    },

    raiseTicketMethod(item) {
      this.customerLookupStoreObj = item;
      this.customerLookupDialog = true;
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, "0")}`; // Ensures two-digit seconds
    },

    listenAudioMethod(item) {
      if (!item.audio) {
        item.audio = new Audio(item.s3_wav_url);

        item.audio.addEventListener("loadedmetadata", () => {
          this.$set(item, "duration", item.audio.duration);
        });

        item.audio.addEventListener("timeupdate", () => {
          this.$set(item, "currentTime", item.audio.currentTime);
        });

        item.audio.addEventListener("play", () => {
          this.$set(item, "isPlaying", true);
          this.$set(item, "playPauseIcon", "mdi-pause");
        });

        item.audio.addEventListener("ended", () => {
          this.$set(item, "isPlaying", false);
          this.$set(item, "playPauseIcon", "mdi-play");
          this.$set(item, "currentTime", 0);
        });

        // Set initial values for UI
        this.$set(item, "isPlaying", false);
        this.$set(item, "playPauseIcon", "mdi-play");
        this.$set(item, "currentTime", 0);
        this.$set(item, "duration", 0);
      }

      if (item.isPlaying) {
        item.audio.pause();
        item.isPlaying = false;
        item.playPauseIcon = "mdi-play";
      } else {
        item.audio
          .play()
          .catch((error) => console.error("Error playing audio:", error));
      }
    },

    async callRFSDataApi(rfs_status) {
      try {
        const result = await API.graphql(
          graphqlOperation(ListHelloWRKRFS, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              rfs_status: rfs_status,
            },
          })
        );
        const response = JSON.parse(result.data.ListHelloWRKRFS).data.Items;
        this.rfsDataItems = response;
      } catch (error) {
        //
      }
    },

    rejectCallRFSMethod(item) {
      this.StoreObj = item;
      this.rejectCallRFSDialog = true;
    },

    addCustomerToDatabaseMethod(item) {
      console.log("CHECK_ITEM", item);
      this.$router.push({
        name: "CustomersView",
        params: {
          call_rfs_data: {
            is_call_initiated_customer: true,
            rfs_id: item.rfs_id,
            customer_contact_number: item.customer_contact_number,
          },
        },
      });
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
    checkCallInitiatedDetails(item) {
      this.StoreObj = item;
      this.StoreObj.email_type = this.list_email_type;
      this.current_view = "CALL_INITIATED_DETAILS";
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
    async CreateTicketCardEmit(Toggle, Status_Message) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: Status_Message,
            Top: true,
          };
          this.renderComp = true;
        });
        if (this.btnStatus === "Customer Initiated") {
          this.list_email_type = "REQUESTED";
          this.filteredItems = await this.ListCustomerRFSMethod(
            this.list_email_type
          );
        } else if (this.btnStatus === "Dealer Initiated") {
          this.list_email_type = "REQUESTED";
          this.filteredItems = await this.GetDealerInitiatedTicketListMethod(
            this.list_email_type
          );
        }

        this.updateEmailMethod("CONVERTED");
      }
    },
    async ConvertTicketNewCustomerEmit(Toggle, Status_Message) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: Status_Message,
            Top: true,
          };
          this.renderComp = true;
        });
        if (this.btnStatus === "Customer Initiated") {
          this.list_email_type = "REQUESTED";
          this.filteredItems = await this.ListCustomerRFSMethod(
            this.list_email_type
          );
        } else if (this.btnStatus === "Dealer Initiated") {
          this.list_email_type = "REQUESTED";
          this.filteredItems = await this.GetDealerInitiatedTicketListMethod(
            this.list_email_type
          );
        }

        this.updateEmailMethod("CONVERTED");
      }
    },
    checkItem(item, action, from) {
      console.log("CONVER", item);
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.StoreObj.from = from;
      this.StoreObj.selected_tab = this.selectedTab;
      if (action == "CONVERTTOTICKET") {
        if (item.is_new_customer) {
          this.current_view = "CONVERT_TICKET_NEW_CUSTOMER";
        } else {
          this.current_view = "CONVERTTOTICKET";
        }
      } else if (action == "MOVETOTRASH") {
        this.dialogDeleteRFS = true;
      } else if (action == "REJECT") {
        this.rejectRFSDialog = true;
      }
    },
    async updateEmailMethod(email_status) {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          email_id: this.StoreObj.email_id,
          type: email_status,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
        };
        let result = await API.graphql(
          graphqlOperation(UpdateEmailType, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.UpdateEmailType);
        if (ResultObject.status == "SUCCESS") {
          this.filteredItems = await this.GetAllRFTsMethod(
            this.list_email_type
          );
          if (email_status == "REJECTED") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                SnackbarText: ResultObject.Status_Message,
                Top: true,
              };
              this.renderComp = true;
            });
          }
        }
      } catch (error) {
        console.warn("Error", error);
      }
    },

    async RejectRFSDialogEmit(Toggle) {
      this.rejectRFSDialog = false;
      if (Toggle == 2) {
        if (this.btnStatus === "Customer Initiated") {
          this.list_email_type = "REQUESTED";
          this.filteredItems = await this.GetAllRFTsMethod(
            this.list_email_type
          );
        } else if (this.btnStatus === "Dealer Initiated") {
          this.list_email_type = "REQUESTED";
          this.filteredItems = await this.GetDealerInitiatedTicketListMethod(
            this.list_email_type
          );
        }
      }
    },

    CustomerLookupDialogEmit(Toggle, row_item) {
      this.customerLookupDialog = false;
      if (Toggle === 2) {
        this.raiseTicketObj = row_item;
        this.current_view = "CREATE";
        this.StoreObj = row_item;
        this.StoreObj.action = "CREATE";
      }
    },

    CallInitiatedDetailsEmit() {
      this.current_view = "LIST";
    },

    RejectCallRFSDialogEmit(Toggle) {
      this.rejectCallRFSDialog = false;
      if (Toggle == 2) {
        this.rfsDataItems = [];
        this.list_email_type = "REQUESTED";
        this.callRFSDataApi(this.list_email_type);
      }
    },
  },
};
</script>

<style></style>
