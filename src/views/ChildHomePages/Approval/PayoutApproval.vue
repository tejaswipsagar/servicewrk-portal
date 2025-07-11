<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <ApprovePayout
      :ApprovePayout="approvePayout"
      :StoreObj="StoreObj"
      @clicked="ApprovePayoutEmit"
    />
    <PayoutInfo
      :PayoutInfoDialog="payoutInfoDialog"
      :PayoutObj="payoutObj"
      @clicked="PayoutInfoDialogEmit"
    />
    <UpdatePayoutPayment
      :UpdatePayoutPaymentDialog="updatePayoutPaymentDialog"
      :StoreObj="StoreObj"
      @clicked="UpdatePayoutPaymentDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Payout Approvals</div>
        <v-spacer></v-spacer>
        <!-- <v-select
          dense
          outlined
          label="Approval Type"
          v-model="approval_type"
          :items="approval_type_items"
          class="mt-7 mr-2 FontSize maxWidthXSmall"
        >
        </v-select> -->
        <v-menu
          ref="menum"
          v-model="menum"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-7 mr-2 FontSize field_label_size field_height pl-2 smallwidth"
              outlined
              dense
              v-model="reportmonth"
              label="Select Month & year"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="reportmonth" type="month" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menum = false">Cancel</v-btn>
            <v-btn text color="primary" @click="menum = false">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <v-select
          dense
          outlined
          :items="statusItems"
          label="Work Flow Status"
          v-model="work_flow_status"
          class="mt-7 FontSize WidthVariation2"
        ></v-select>
        <!-- <v-select
          v-if="work_flow_status == 'APPROVED'"
          outlined
          dense
          label="Filter Status"
          class="mt-7 mx-2 FontSize WidthVariation2"
          :items="FilterStatusItems"
          v-model="FilteredValue"
        ></v-select> -->
        <!-- 
        <v-select
          v-if="approval_type === 'QUOTATION'"
          v-model="searchBy"
          :items="searchByItems"
          item-text="text"
          item-value="value"
          dense
          outlined
          label="Search By"
          class="mt-7 ml-2 FontSize mediumWidth"
        ></v-select> -->
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          class="mt-7 ml-2 FontSize mediumWidth"
          append-icon="mdi-magnify"
        >
        </v-text-field>
      </v-toolbar>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          class="TableValFontsize"
          fixed-header
          :search="search"
          :page.sync="page"
          :items-per-page="50"
          :height="TableHeight"
          :items="payoutApprovalItems"
          :no-data-text="noDataText"
          @page-count="pageCount = $event"
          :headers="header"
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.invoice_initiated_on`]="{ item }">
            <div>
              {{
                new Date(item.invoice_initiated_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div class="d-flex">
              <div class="mr-2">
                <v-btn
                  icon
                  @click.stop="approveRejectPayoutMethod(item, 'APPROVE')"
                  ><v-icon color="green" small>mdi-check-bold</v-icon></v-btn
                >
              </div>
              <div>
                <v-btn
                  icon
                  @click.stop="approveRejectPayoutMethod(item, 'REJECT')"
                  ><v-icon color="red" small>mdi-close-thick</v-icon></v-btn
                >
              </div>
            </div>
          </template>
          <template v-slot:[`item.update`]="{ item }">
            <div v-if="item.allow_to_update_payment_details">
              <v-btn
                icon
                @click.stop="
                  (updatePayoutPaymentDialog = true), (StoreObj = item)
                "
              >
                <v-icon small color="primary">mdi-update</v-icon>
              </v-btn>
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import { ListWorkFlowPayments } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import ApprovePayout from "@/components/Approvals/ApporvePayout.vue";
import PayoutInfo from "@/components/ServicePartnerPayout/Dialogs/PayoutInfoDialog.vue";
import UpdatePayoutPayment from "@/components/Approvals/UpdatePayoutPaymentDialog.vue";

export default {
  components: {
    Overlay,
    Snackbar,
    ApprovePayout,
    PayoutInfo,
    UpdatePayoutPayment,
  },

  data() {
    return {
      reportmonth: new Date().toISOString().substr(0, 7),
      menum: false,
      page: 1,
      pageCount: 1,
      TableHeight: 0,
      search: "",
      work_flow_status: "PENDING",
      noDataText: "No Data Available..!",
      menu: false,
      menu1: false,
      overlay: true,
      renderComp: true,
      isSearching: false,
      previewAttachments: false,
      viewTicketDetailsDialog: false,
      dailogWorkflowItemsList: false,
      UpdateApprovedComponentDialog: false,
      WorkFlowList: [],
      GetAllQuotationApprovalsList: [],
      from_date: new Date(new Date().getTime() - 30 * 86400000)
        .toISOString()
        .substr(0, 10),
      to_date: new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10),
      GetAllListMRF: [],
      statusItems: [
        { text: "PENDING", value: "PENDING" },
        // { text: "IN PROGRESS", value: "IN_PROGRESS" },
        { text: "APPROVED", value: "APPROVED" },
        { text: "REJECTED", value: "REJECTED" },
      ],
      StoreObj: {},
      StoreObjNew: {},
      SnackBarComponent: {},
      StoreObjTicketDetails: {},
      TicketQuotationDisplayDialog: false,
      approvePayout: false,
      FilteredValue: "ALL",
      searchBy: "quotation_id",
      payoutApprovalItems: [],
      header: [
        { text: "Payment Display ID", value: "invoice_display_id" },
        { text: "Initiator User Name", value: "initator_user_name" },
        // { text: "Invoice Generated Name", value: "invoice_generated_by_name" },
        // { text: "Invoice Generated By", value: "invoice_generated_by_email" },
        // { text: "Invoice Initiated On", value: "invoice_initiated_on" },
        { text: "Pending At", value: "pending_at" },
        { text: "Action", value: "action" },
      ],
      payoutObj: {},
      payoutInfoDialog: false,
      updatePayoutPaymentDialog: false,
    };
  },
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },

    async reportmonth(val) {
      if (val) {
        this.invoiceList = [];
        this.overlay = true;
        await this.callApiMethod();
      }
    },

    work_flow_status(val) {
      this.payoutApprovalItems = [];
      this.callApiMethod();
      if (val === "PENDING") {
        this.header = [
          { text: "Payment Display ID", value: "invoice_display_id" },
          { text: "Initiator User Name", value: "initator_user_name" },

          { text: "Pending At", value: "pending_at" },
          { text: "Action", value: "action" },
        ];
      } else if (val === "APPROVED") {
        this.header = [
          { text: "Payment Display ID", value: "invoice_display_id" },
          { text: "Initiator User Name", value: "initator_user_name" },
          { text: "Approved By", value: "final_approved_name" },
          { text: "Update Payment", value: "update" },
        ];
      } else if (val === "REJECTED") {
        this.header = [
          { text: "Payment Display ID", value: "invoice_display_id" },
          { text: "Initiator User Name", value: "initator_user_name" },
          { text: "Rejected By", value: "final_rejected_name" },
        ];
      }
    },
  },

  async mounted() {
    this.TableHeight = window.innerHeight - 200;
    await this.callApiMethod();
  },

  methods: {
    handleRowClick(item) {
      console.log("PAY_APP", item);
      this.payoutObj = item;
      this.payoutInfoDialog = true;
    },

    approveRejectPayoutMethod(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.approvePayout = true;
    },

    async callApiMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(ListWorkFlowPayments, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              payment_month: this.reportmonth,
              payment_workflow_status: this.work_flow_status,
            },
          })
        );
        const response = JSON.parse(result.data.ListWorkFlowPayments).data
          .Items;
        this.payoutApprovalItems = response;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
      }
    },

    async ApprovePayoutEmit(Toggle) {
      this.approvePayout = false;
      if (Toggle === 2) {
        this.payoutApprovalItems = [];
        await this.callApiMethod();
      }
    },

    PayoutInfoDialogEmit(Toggle) {
      this.payoutInfoDialog = false;
    },

    async UpdatePayoutPaymentDialogEmit(Toggle) {
      this.updatePayoutPaymentDialog = false;
      if (Toggle === 2) {
        this.payoutApprovalItems = [];
        await this.callApiMethod();
      }
    },
  },
};
</script>
