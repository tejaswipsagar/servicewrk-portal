<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <FgrInfo
      :FgrInfoDialog="FgrInfoDialog"
      :StoreObj="StoreObj"
      @clicked="FgrInfoDialogEmit"
    />
    <FgrGenerateReopen
      :GenerateOrReopenFgrDialog="GenerateOrReopenFgrDialog"
      :StoreObj="StoreObj"
      @clicked="GenerateOrReopenFgrDialogEmit"
    />
    <ClaimedStatusDialog
      :ClaimedStatusDialog="ClaimedStatusDialog"
      :StoreObj="StoreObj"
      @clicked="ClaimedStatusDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Product Replacement List</div>

        <v-spacer />
        <v-select
          dense
          outlined
          :items="statusItems"
          label="Status"
          v-model="fgrStatus"
          class="mt-7 FontSize WidthVariation2"
        ></v-select>
        <v-select
          v-if="fgrStatus == 'APPROVED'"
          dense
          outlined
          label="Select Type"
          v-model="ClaimedTypeValue"
          :items="ClaimedStatusItems"
          item-text="text"
          item-value="value"
          class="FontSize WidthVariation2 mt-7 ml-2"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          class="mt-7 ml-2 FontSize mediumWidth"
          append-icon="mdi-magnify"
        >
          <!-- <template v-slot:append>
            <v-btn
              icon
              small
              v-if="isSearching == false"
              @click="searchvalue((isSearching = true))"
              color="primary"
            >
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">mdi-magnify</v-icon>
                </template>
                <span>Click to Search</span>
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              small
              v-if="isSearching == true"
              @click="clearSearch((isSearching = false), (search = ''))"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on">mdi-close</v-icon>
                </template>
                <span aria-label="clear">Clear</span>
              </v-tooltip>
            </v-btn>
          </template> -->
        </v-text-field>
        <v-btn small color="primary" class="ml-2" @click="fgrGenerateMethod()"
          >Generate<v-icon small class="pl-1">mdi-plus</v-icon></v-btn
        >
        <!-- <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              depressed
              v-on="on"
              v-bind="attrs"
              @click.stop="exporttoexcel()"
              color="primary"
              class="primary white--text mt-0 ml-2"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Product Replacement Excel</span>
        </v-tooltip> -->
      </v-toolbar>
      <v-card-text class="pt-2">
        <v-data-table
          style="cursor: pointer"
          :headers="fgrTableHeader"
          :items="fgrDataItems"
          dense
          fixed-header
          :search="search"
          :items-per-page="50"
          :height="TableHeight"
          :no-data-text="
            fgrDataItems && fgrDataItems.length === 0
              ? 'No data found'
              : undefined
          "
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.display_value`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="fgrStatus == 'APPROVED' && item.fgr_claim_status"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-on="on"
                  v-bind="attrs"
                  x-small
                  :color="
                    !item.fgr_claim_status
                      ? 'white'
                      : item.fgr_claim_status == 'CLAIMED'
                      ? 'green'
                      : 'red'
                  "
                  >mdi-circle</v-icon
                >
              </template>
              <span>{{ item.fgr_claim_status }}</span>
            </v-tooltip>

            <v-tooltip v-if="item.is_re_opened_fgr" color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  style="cursor: pointer"
                  v-on="on"
                  v-bind="attrs"
                  color="primary"
                  class="ml-n2"
                  x-small
                  >mdi-lock-open</v-icon
                >
              </template>
              <span class="white--text">Re-opened Product Replacement</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.fgr_display_id`]="{ item }">
            <div class="FontSize ml-n6">
              <!-- <div v-if="item.is_re_opened_fgr">
               
                <v-tooltip color="primary" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      style="cursor: pointer"
                      v-on="on"
                      v-bind="attrs"
                      color="primary"
                      small
                      >mdi-lock-open</v-icon
                    >
                  </template>
                  <span class="white--text">Re-opened Product Replacement</span>
                </v-tooltip>
              </div> -->
              <div class="ml-n4">
                {{ item.fgr_display_id }}
              </div>
            </div>
          </template>
          <template v-slot:[`item.custom_ticket_id`]="{ item }">
            <div class="FontSize">
              {{ item.custom_ticket_id || item.ticket_id }}
            </div>
          </template>
          <template v-slot:[`item.fgr_initiated_on`]="{ item }">
            <div class="FontSize">
              {{ FormatedDateTime(item.fgr_initiated_on) }}
            </div>
          </template>
          <template v-slot:[`item.fgr_admin_stages`]="{ item }">
            <div class="FontSize">
              {{ adminApprovalStageMethod(item) || "-" }}
            </div>
          </template>
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize">
              {{ item.user_name }}
            </div>
          </template>
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div class="FontSize" style="display: flex; flex-direction: column">
              <div>
                {{ item.customer_company_name || "-" }}
              </div>
              <div>
                {{ item.customer_name || "-" }}
              </div>
            </div>
          </template>
          <template v-slot:[`item.customer_contact_number`]="{ item }">
            <div class="FontSize" style="display: flex; flex-direction: column">
              <div>
                {{ item.customer_contact_number || "-" }}
              </div>
              <div>
                {{ item.customer_email_id || "-" }}
              </div>
            </div>
            <!-- <div class="FontSize">
              {{ item.customer_contact_number }}
            </div> -->
          </template>
          <!-- <template v-slot:[item.user_contact_number]="{ item }">
            <div class="FontSize" style="display: flex; flex-direction: column">
              <div>
                {{ item.user_contact_number || "-" }}
              </div>
              <div>
                {{ item.user_email_id || "-" }}
              </div>
            </div>
          </template> -->
          <template v-slot:[`item.pending_at`]="{ item }">
            <div class="FontSize" v-if="item.pending_at">
              {{ formatedPending(item.pending_at) }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-menu right bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense nav>
                <v-list-item-group color="primary">
                  <v-list-item @click="viewDocMethod(item)">
                    <v-list-item-icon>
                      <v-icon color="primary" small>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>View</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.fgr_status === 'REJECTED'"
                    @click="reOpenFgrMethod(item)"
                  >
                    <v-list-item-icon>
                      <v-icon color="blue" small>mdi-lock-open</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Re-Open</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      fgrStatus == 'APPROVED' &&
                      item.fgr_claim_status != 'CLAIMED'
                    "
                    @click.stop="checkItem(item, 'CLAIMED')"
                  >
                    <v-list-item-icon>
                      <v-icon color="green" small>mdi-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Claimed</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      fgrStatus == 'APPROVED' &&
                      item.fgr_claim_status != 'NOT_CLAIMED'
                    "
                    @click.stop="checkItem(item, 'NOT_CLAIMED')"
                  >
                    <v-list-item-icon>
                      <v-icon color="red" small>mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Not Claimed</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
            <!-- <v-btn color="primary" small
              >View<v-icon small class="pl-1">mdi-eye</v-icon></v-btn
            > -->
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");

import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import FgrInfo from "@/components/FGR/Dialogs/FgrInfoDialog.vue";
import FgrGenerateReopen from "@/components/FGR/Dialogs/GenerateOrReopenFgr.vue";
import ClaimedStatusDialog from "@/components/FGR/Dialogs/ClaimedStatus.vue";

import { listFgrData } from "@/mixins/Approvals/GetAllFGRData.js";

export default {
  mixins: [listFgrData],
  components: {
    Overlay,
    Snackbar,
    FgrInfo,
    FgrGenerateReopen,
    ClaimedStatusDialog,
  },
  data: () => ({
    renderComp: true,
    ClaimedStatusDialog: false,
    SnackBarComponent: {},
    overlay: true,
    statusItems: [
      { text: "ALL", value: "ALL" },
      { text: "PENDING", value: "PENDING" },
      { text: "IN PROGRESS", value: "IN_PROGRESS" },
      { text: "APPROVED", value: "APPROVED" },
      { text: "REJECTED", value: "REJECTED" },
    ],
    ClaimedStatusItems: [
      { text: "ALL", value: "ALL" },
      { text: "CLAIMED", value: "CLAIMED" },
      { text: "NOT CLAIMED", value: "NOT_CLAIMED" },
    ],
    fgrStatus: "PENDING",
    search: "",
    isSearching: false,
    TableHeight: 0,
    fgrTableHeader: [
      { text: "", value: "display_value" },
      { text: "FGR Display ID", value: "fgr_display_id" },
      { text: "Ticket ID", value: "custom_ticket_id" },
      { text: "Customer Name/Contact Name", value: "customer_company_name" },
      { text: "Customer Contact Details", value: "customer_contact_number" },
      { text: "Initiator Name", value: "user_name" },
      // { text: "Initiator Contact Details", value: "user_contact_number" },
      { text: "Initiated On", value: "fgr_initiated_on" },
      { text: "FGR Admin Approval Stage", value: "fgr_admin_stages" },
      { text: "Pending At", value: "pending_at" },
      { text: "View", value: "action" },
      //   { text: "Customer Name", value: "customer_name" },
    ],
    fgrExcelHeader: [
      { label: "FGR Display ID", value: "fgr_display_id" },
      { label: "FGR Generated On", value: "fgr_initiated_on" },
      { label: "FGR Admin Approval (Stage)", value: "fgr_approval_stage" },
      { label: "Ticket ID", value: "custom_ticket_id" },
      { label: "Customer", value: "customer_company_name" },
      { label: "Customer Contact Details", value: "customer_contact_number" },
      { label: "Customer EmailId", value: "customer_email_id" },
      { label: "Customer Address", value: "customer_address" },
      { label: "Customer City", value: "customer_city" },
      { label: "Customer State", value: "customer_state" },
      { label: "Customer Pincode", value: "customer_pincode" },
      { label: "Category Name", value: "replacement_category" },
      { label: "Component Name", value: "component_name" },
      { label: "Product Name", value: "machine_model" },
      { label: "Machine Serial Number", value: "machine_serial_number" },
      { label: "Service Type Name", value: "service_type_name" },
      { label: "Support Name", value: "support_name" },
      { label: "Support Type Name", value: "support_type_name" },
      { label: "Service Partner Name", value: "service_partner_name" },
      { label: "Reporter Manager", value: "reporter_name" },
      { label: "Initiator Name", value: "user_name" },
      { label: "Initiated On", value: "fgr_initiated_on" },
      {
        label: "Address of the party from where machine was purchased",
        value: "purchased_party_address",
      },
      { label: "Dealer Name", value: "dealer_name" },
      { label: "Dealer Address", value: "dealer_address" },
      { label: "Name Of The ECP", value: "technician_name" },
      { label: "Address Of The ECP", value: "technician_address" },
      {
        label: "Name Of The Component Failure Diagnosed By ASP",
        value: "component_name",
      },
      { label: "Reason For Replacement", value: "reason_for_replacement" },
      { label: "Action To Be Taken", value: "action_to_be_take" },

      {
        label: "Sub Action To be Taken Against Defective Machine",
        value: "sub_action_to_be_take",
      },
      {
        label: "Scrap Value of The Defective Unit As Per Policy",
        value: "scrap_value",
      },
      {
        label: "Defective Machine To Be Sold To",
        value: "defective_machine_to_be_sold_to",
      },
      {
        label: "Scrap Value To Be Debited",
        value: "scrap_value_to_be_debited",
      },
      {
        label: "New Machine To Be Dispatched To",
        value: "new_machine_dispathed_to",
      },
      { label: "Technically Approved By", value: "approvered_by" },
      { label: "Technically Approved Date", value: "approvered_on" },
      { label: "Evaluation of Case", value: "primary_approved_component_name" },
      { label: "Failure Component Name", value: "component_name" },
      {
        label: "Reason For Failure If Any",
        value: "primary_approved_reason_for_replacement",
      },
      {
        label: "Condition Of Machine",
        value: "primary_approved_condition_of_machine",
      },
      { label: "Recomondation", value: "primary_approved_decision" },
      {
        label: "Primary Rejected On",
        value: "primary_rejected_on",
      },
      { label: "FGR Reopened On", value: "fgr_re_opened_on" },
      {
        label: "Commercial Computation Date",
        value: "first_section_saved_on",
      },
      {
        label: "Commercial Computation By",
        value: "first_section_saved_by",
      },
      {
        label: "Total % Age of Dep Applicable",
        value: "total_percentage_of_age_of_dep_applicable",
      },
      { label: "Invoice Value", value: "invoice_value" },
      { label: "Machine used (Days)", value: "machine_used_days" },
      { label: "Machine used (Month)", value: "machine_used_months" },

      {
        label: "Depreciation amount payable on Invoice Value",
        value: "deprecation_amount_payable_on_invoice_value",
      },
      {
        label: "Machine Purchased From",
        value: "purchased_party_name",
      },
      { label: "Freight Charges", value: "freight_charges" },
      { label: "Dispatch Of New Machine", value: "dispatch_of_new_machine" },
      {
        label: "Collection Of Defective Machine",
        value: "collection_of_defective_machine",
      },
      {
        label: "Total Amount To Be Collected From Customer",
        value: "total_amount_to_be_collected_from_customer",
      },
      {
        label: "Total Amount To Be Brone By Company",
        value: "total_amount_to_be_brone_by_company",
      },
      { label: "Total Loss", value: "total_loss" },
      { label: "Payment Details", value: "payment_details" },
      { label: "Approval Details", value: "approval_details" },
      {
        label: "Advised to Bill Unit Date",
        value: "second_section_saved_on",
      },
      {
        label: "Unit To Be Replaced From",
        value: "unit_to_be_replaced_from_dealer_or_distributor_or_company",
      },
      { label: "Machine Model To Be Billed", value: "machine_model" },
      {
        label: "Machine To be Sent at Customer or Dealer or Distributor",
        value: "machine_to_be_sent_at_customer_or_dealer_or_distributor",
      },
      {
        label: "Action To be Taken Against Defective Machine",
        value:
          "secondary_approved_action_to_be_taken_against_defective_machine",
      },
      {
        label: "Comment",
        value: "comments",
      },
      {
        label: "Primary Rejected Comments",
        value: "primary_rejected_comments",
      },

      {
        label: "Secondary Rejected Comments",
        value: "secondary_rejected_comments",
      },
      {
        label: "Secondary Rejected On",
        value: "secondary_rejected_on",
      },
      {
        label: "First Section Comment",
        value: "first_section_comments",
      },
      { label: "Second Section Comment", value: "second_section_comments" },
      { label: "Third Section Comment", value: "third_section_comments" },
      { label: "Fourth Section Comment", value: "fourth_section_comments" },
      { label: "Fifth Section Comment", value: "fifth_section_comments" },
      {
        label: "S/O Generated Date",
        value: "so_challan_generated_date",
      },
      {
        label: "SO/Challan Generated (Reference No)",
        value: "so_challan_generated",
      },
      {
        label: "Dispatched Date",
        value: "dispatched_date",
      },
      { label: "Customer Invoice Number", value: "customer_invoice_number" },
      { label: "Invoice Date", value: "customer_invoice_date" },
      { label: "Material Dispatched", value: "material_dispatched" },
      { label: "Courier/Transport Name", value: "courier_tranport_name" },
      { label: "Docket/LR Number", value: "docket_number" },
      {
        label: "Machine MRN or CN Issued (MRN No)",
        value: "machine_mrn_or_cn_issued",
      },
      {
        label: "MRN/CN Issued Date",
        value: "mrn_or_cn_issued_date",
      },
      {
        label: "Scrap Biiling Reference Number",
        value: "scrap_billing_reference_number",
      },
      {
        label: "Scrap Biiling Date",
        value: "scrap_billing_date",
      },
      { label: "Attachments", value: "share_to_customer_attachments" },
    ],
    fgrDataItems: [],
    FgrInfoDialog: false,
    StoreObj: {},
    GenerateOrReopenFgrDialog: false,
    ClaimedTypeValue: "ALL",
  }),

  watch: {
    async fgrStatus(val) {
      if (val === "APPROVED") {
        this.fgrTableHeader = [
          { text: "", value: "display_value" },
          { text: "FGR Display ID", value: "fgr_display_id" },
          { text: "Ticket ID", value: "custom_ticket_id" },
          { text: "Customer", value: "customer_company_name" },
          {
            text: "Customer Contact Details",
            value: "customer_contact_number",
          },
          { text: "Initiator Name", value: "user_name" },
          // { text: "Initiator Contact Details", value: "user_contact_number" },
          { text: "Initiated On", value: "fgr_initiated_on" },
          { text: "Action", value: "action" },
        ];
        this.fgrDataItems = await this.listFgrDataMethod(val);
      } else {
        [
          { text: "FGR Display ID", value: "fgr_display_id" },
          { text: "Ticket ID", value: "custom_ticket_id" },
          { text: "Customer", value: "customer_company_name" },
          {
            text: "Customer Contact Details",
            value: "customer_contact_number",
          },
          { text: "Initiator Name", value: "user_name" },
          // { text: "Initiator Contact Details", value: "user_contact_number" },
          { text: "Initiated On", value: "fgr_initiated_on" },
          { text: "Pending At", value: "pending_at" },
          { text: "Action", value: "action" },
        ];
        this.fgrDataItems = await this.listFgrDataMethod(val);
      }
    },
    async ClaimedTypeValue(val) {
      if (val != "") {
        this.fgrDataItems = await this.listFgrDataMethod(this.fgrStatus, val);
      }
    },
  },

  async mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.fgrDataItems = await this.listFgrDataMethod(
      this.fgrStatus,
      this.ClaimedTypeValue
    );
  },

  methods: {
    fgrGenerateMethod() {
      this.StoreObj.action = "GENERATE";
      this.GenerateOrReopenFgrDialog = true;
    },
    adminApprovalStageMethod(item) {
      let result = "-";
      if (item.fgr_last_action === "FGR - Need to Collect Depreciation Amount")
        result = "Commercial Computation";
      if (item.fgr_last_action === "FGR - Advised to Bill Unit")
        result = "Advised to Bill Unit";
      if (item.fgr_last_action === "FGR - Unit Billed") result = "Unit Billed";
      if (item.fgr_last_action === "FGR - Unit Dispatched")
        result = "Unit Dispatched";
      return result;
    },
    reOpenFgrMethod(item) {
      this.StoreObj = item;
      this.StoreObj.action = "REOPEN";
      this.GenerateOrReopenFgrDialog = true;
    },

    formatedPending(input) {
      return input
        .toLowerCase()
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },

    FormatedDateTime(item) {
      const date = new Date(item * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      hours = String(hours).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    },

    handleRowClick(item) {
      this.StoreObj = item;
      this.FgrInfoDialog = true;
      console.log("FGR_ROW", item);
    },

    viewDocMethod(item) {
      window.open(item.frg_pdf_s3_url);
    },

    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.ClaimedStatusDialog = true;
    },

    FgrInfoDialogEmit(Toggle) {
      this.FgrInfoDialog = false;
    },

    async GenerateOrReopenFgrDialogEmit(Toggle) {
      this.GenerateOrReopenFgrDialog = false;
      if (Toggle === 2) {
        this.fgrDataItems = await this.listFgrDataMethod(
          this.fgrStatus,
          this.ClaimedTypeValue
        );
      }
    },

    async ClaimedStatusDialogEmit(Toggle) {
      this.ClaimedStatusDialog = false;
      if (Toggle == 2) {
        this.fgrDataItems = await this.listFgrDataMethod(
          this.fgrStatus,
          this.ClaimedTypeValue
        );
      }
    },

    callAdminApprovalStage(
      first_step,
      second_step,
      third_step,
      fourth_step,
      fifth_step
    ) {
      let result = "-";
      if (first_step) result = "Commercial Computation";
      if (second_step) result = "Advised to Bill Unit";
      if (third_step) result = "Unit Billed";
      if (fourth_step) result = "Unit Dispatched";
      if (fifth_step) result = "Closed";

      return result;
    },

    exporttoexcel() {
      let InputArray = this.fgrDataItems.map((item) => {
        let Objects = { ...item };
        Objects.fgr_approval_stage = this.callAdminApprovalStage(
          item.first_section_saved,
          item.second_section_saved,
          item.third_section_saved,
          item.fourth_section_saved,
          item.fifth_section_saved
        );
        Objects.fgr_initiated_on = item.fgr_initiated_on
          ? this.FormatedDateTime(item.fgr_initiated_on)
          : "-";
        Objects.fgr_re_opened_on = item.fgr_re_opened_on
          ? this.FormatedDateTime(item.fgr_re_opened_on)
          : "-";
        Objects.fgr_display_id = item.fgr_display_id || "-";
        Objects.custom_ticket_id = item.custom_ticket_id || "-";
        Objects.customer_company_name = item.customer_company_name || "-";
        Objects.customer_contact_number = item.customer_contact_number || "-";
        Objects.customer_city = item.customer_city || "-";
        Objects.customer_state = item.customer_state || "-";
        Objects.customer_pincode = item.customer_pincode || "-";
        Objects.technician_name = item.technician_name || "-";
        Objects.purchased_party_name = item.purchased_party_name || "-";
        Objects.purchased_party_address = item.purchased_party_address || "-";
        Objects.component_name = item.component_name || "-";
        Objects.machine_serial_number = item.machine_serial_number || "-";
        Objects.reporter_name = item.reporter_name || "-";
        Objects.technician_address = item.technician_address || "-";
        Objects.dealer_name = item.dealer_name || "-";
        Objects.dealer_address = item.dealer_address || "-";
        Objects.reason_for_replacement = item.reason_for_replacement || "-";
        Objects.action_to_be_take = item.action_to_be_take || "-";
        Objects.scrap_value = item.scrap_value || "-";
        Objects.defective_machine_to_be_sold_to =
          item.defective_machine_to_be_sold_to || "-";
        Objects.scrap_value_to_be_debited =
          item.scrap_value_to_be_debited || "-";
        Objects.new_machine_dispathed_to = item.new_machine_dispathed_to || "-";
        Objects.approvered_by = item.approvered_by || "-";
        Objects.approvered_on = item.approvered_on
          ? this.FormatedDateTime(item.approvered_on)
          : "-";
        Objects.primary_approved_component_name =
          item.primary_approved_component_name || "-";
        Objects.primary_approved_reason_for_replacement =
          item.primary_approved_reason_for_replacement || "-";
        Objects.invoice_value = item.invoice_value || "-";
        Objects.machine_used_days = item.machine_used_days || "-";
        Objects.machine_used_months = item.machine_used_months || "-";
        Objects.total_percentage_of_age_of_dep_applicable =
          item.total_percentage_of_age_of_dep_applicable || "-";
        Objects.deprecation_amount_payable_on_invoice_value =
          item.deprecation_amount_payable_on_invoice_value || "-";
        Objects.freight_charges = item.freight_charges || "-";
        Objects.dispatch_of_new_machine = item.dispatch_of_new_machine || "-";
        Objects.collection_of_defective_machine =
          item.collection_of_defective_machine || "-";
        Objects.total_amount_to_be_collected_from_customer =
          item.total_amount_to_be_collected_from_customer || "-";
        Objects.total_amount_to_be_brone_by_company =
          item.total_amount_to_be_brone_by_company || "-";
        Objects.total_loss = item.total_loss || "-";
        Objects.unit_to_be_replaced_from_dealer_or_distributor_or_company =
          item.unit_to_be_replaced_from_dealer_or_distributor_or_company || "-";
        Objects.machine_model = item.machine_model || "-";
        Objects.machine_to_be_sent_at_customer_or_dealer_or_distributor =
          item.machine_to_be_sent_at_customer_or_dealer_or_distributor || "-";
        Objects.secondary_approved_action_to_be_taken_against_defective_machine =
          item.secondary_approved_action_to_be_taken_against_defective_machine ||
          "-";
        Objects.so_challan_generated = item.so_challan_generated || "-";
        Objects.customer_invoice_number = item.customer_invoice_number || "-";
        Objects.courier_tranport_name = item.courier_tranport_name || "-";
        Objects.docket_number = item.docket_number || "-";
        Objects.machine_mrn_or_cn_issued = item.machine_mrn_or_cn_issued || "-";
        Objects.primary_rejected_on = item.primary_rejected_on
          ? this.FormatedDateTime(item.primary_rejected_on)
          : "-";
        Objects.secondary_rejected_on = item.secondary_rejected_on
          ? this.FormatedDateTime(item.secondary_rejected_on)
          : "-";
        Objects.comments = item.comments || "-";
        Objects.primary_rejected_comments =
          item.primary_rejected_comments || "-";
        Objects.secondary_rejected_comments =
          item.secondary_rejected_comments || "-";
        Objects.first_section_comments = item.first_section_comments || "-";
        Objects.second_section_comments = item.second_section_comments || "-";
        Objects.third_section_comments = item.third_section_comments || "-";
        Objects.fourth_section_comments = item.fourth_section_comments || "-";
        Objects.fifth_section_comments = item.fifth_section_comments || "-";
        Objects.replacement_category = item.replacement_category || "-";
        Objects.service_type_name = item.service_type_name || "-";
        Objects.support_name = item.support_name || "-";
        Objects.support_type_name = item.support_type_name || "-";
        Objects.service_partner_name = item.service_partner_name || "-";
        Objects.sub_action_to_be_take = item.sub_action_to_be_take || "-";
        Objects.customer_invoice_date = item.customer_invoice_date || "-";
        Objects.first_section_saved_by = item.first_section_saved_by || "-";
        Objects.scrap_billing_date = item.scrap_billing_date
          ? this.FormatedDateTime(item.scrap_billing_date)
          : "-";
        Objects.dispatched_date = item.dispatched_date
          ? this.FormatedDateTime(item.dispatched_date)
          : "-";
        Objects.so_challan_generated_date = item.so_challan_generated_date
          ? this.FormatedDateTime(item.so_challan_generated_date)
          : "-";
        Objects.mrn_or_cn_issued_date = item.mrn_or_cn_issued_date
          ? this.FormatedDateTime(item.mrn_or_cn_issued_date)
          : "-";
        Objects.first_section_saved_on = item.first_section_saved_on
          ? this.FormatedDateTime(item.first_section_saved_on)
          : "-";
        Objects.second_section_saved_on = item.second_section_saved_on
          ? this.FormatedDateTime(item.second_section_saved_on)
          : "-";
        Objects.scrap_billing_reference_number =
          item.scrap_billing_reference_number || "-";
        Objects.primary_approved_decision =
          item.primary_approved_decision || "-";

        Objects.share_to_customer_attachments =
          item.share_to_customer_attachments
            ? item.share_to_customer_attachments.join(", ")
            : undefined;

        this.$forceUpdate();
        return Objects;
      });
      console.log("InputArray", InputArray);
      let data = [
        {
          sheet: "Product Replacement",
          columns: this.fgrExcelHeader,
          content: InputArray,
        },
      ];
      let settings = {
        fileName: `${this.fgrStatus} Product Replacement`,
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
  },
};
</script>
