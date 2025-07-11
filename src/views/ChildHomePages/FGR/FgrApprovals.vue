<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <FgrInfo
      :FgrInfoDialog="FgrInfoDialog"
      :StoreObj="StoreObj"
      @clicked="FgrInfoDialogEmit"
    />
    <FgrApprove
      :ApproveFgrDialog="ApproveFgrDialog"
      :StoreObj="StoreObj"
      @clicked="ApproveFgrDialogEmit"
    />
    <RejectApprove
      :RejectFgrDialog="RejectFgrDialog"
      :StoreObj="StoreObj"
      @clicked="RejectFgrDialogEmit"
    />
    <FgrGenerateReopen
      :GenerateOrReopenFgrDialog="GenerateOrReopenFgrDialog"
      :StoreObj="StoreObj"
      @clicked="GenerateOrReopenFgrDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Product Replacement Approvals</div>
        <v-spacer />
        <v-select
          dense
          outlined
          :items="statusItems"
          label="Status"
          v-model="fgrStatus"
          class="mt-7 FontSize WidthVariation2"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          class="mt-7 ml-2 FontSize mediumWidth"
          append-icon="mdi-magnify"
        >
        </v-text-field>
        <!-- <v-btn small color="primary" class="ml-2" @click="fgrGenerateMethod()"
          >Generate<v-icon small class="pl-1">mdi-plus</v-icon></v-btn
        > -->
      </v-toolbar>
      <v-card-text class="pt-2">
        <v-data-table
          :headers="fgrTableHeader"
          :items="fgrDataItems"
          dense
          fixed-header
          :search="search"
          :items-per-page="50"
          :height="TableHeight"
          :no-data-text="
            fgrDataItems.length === 0 ? 'No data found' : undefined
          "
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.frg_value`]="{ item }">
            <div v-if="item.is_re_opened_fgr">
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <!-- <v-card
                    v-on="on"
                    v-bind="attrs"
                    color="primary"
                    class="white--text cardRotate"
                    >Reopen</v-card
                  > -->
                  <v-btn icon class="ml-n5" v-on="on" v-bind="attrs"
                    ><v-icon small color="green">mdi-lock</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Re-opened Product Replacement</span>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:[`item.fgr_display_id`]="{ item }">
            <div class="FontSize ml-n8">
              <div>
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
          </template>
          <!-- <template v-slot:[`item.user_contact_number`]="{ item }">
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
                  <!-- <v-list-item
                    @click="approveFgrMethod(item)"
                    v-if="
                      item.fgr_status === 'PENDING' ||
                      item.fgr_status === 'IN_PROGRESS'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon color="green" small>mdi-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Approve</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item> -->
                  <v-list-item
                    @click="approveFgrMethod(item)"
                    v-if="fgrStatus === 'PENDING'"
                  >
                    <v-list-item-icon>
                      <v-icon color="green" small>mdi-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Approve</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click="rejectFgrMethod(item)"
                    v-if="fgrStatus === 'PENDING'"
                  >
                    <v-list-item-icon>
                      <v-icon color="red" small>mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Reject</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <!-- <v-list-item
                    @click="rejectFgrMethod(item)"
                    v-if="
                      item.fgr_status === 'PENDING' ||
                      item.fgr_status === 'IN_PROGRESS'
                    "
                  >
                    <v-list-item-icon>
                      <v-icon color="red" small>mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Reject</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item> -->
                  <!-- <v-list-item
                    @click="reOpenFgrMethod(item)"
                    v-if="item.fgr_status === 'REJECTED'"
                  >
                    <v-list-item-icon>
                      <v-icon color="blue" small>mdi-lock</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Re-Open</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item> -->
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
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import FgrInfo from "@/components/FGR/Dialogs/FgrInfoDialog.vue";
import FgrApprove from "@/components/FGR/Dialogs/ApproveFgr.vue";
import RejectApprove from "@/components/FGR/Dialogs/RejectFgr.vue";
import FgrGenerateReopen from "@/components/FGR/Dialogs/GenerateOrReopenFgr.vue";

import { listFgrData } from "@/mixins/Approvals/GetAllFGRData.js";

export default {
  mixins: [listFgrData],
  components: {
    Overlay,
    Snackbar,
    FgrInfo,
    FgrApprove,
    RejectApprove,
    FgrGenerateReopen,
  },
  data: () => ({
    overlay: true,
    statusItems: [
      { text: "ALL", value: "ALL" },
      { text: "PENDING", value: "PENDING" },
      { text: "IN PROGRESS", value: "IN_PROGRESS" },
      { text: "APPROVED", value: "APPROVED" },
      { text: "REJECTED", value: "REJECTED" },
    ],
    fgrStatus: "PENDING",
    search: "",
    isSearching: false,
    TableHeight: 0,
    fgrTableHeader: [
      { text: "", value: "frg_value" },
      { text: "FGR Display ID", value: "fgr_display_id", width: "180px" },
      { text: "Ticket ID", value: "custom_ticket_id", width: "180px" },
      { text: "Customer", value: "customer_company_name" },
      { text: "Customer Contact Details", value: "customer_contact_number" },
      { text: "Initiator Name", value: "user_name" },
      // { text: "Initiator Contact Details", value: "user_contact_number" },
      { text: "Initiated On", value: "fgr_initiated_on" },
      { text: "FGR Admin Approval Stage", value: "fgr_admin_stages" },
      { text: "Pending At", value: "pending_at" },
      { text: "Action", value: "action" },
      //   { text: "Customer Name", value: "customer_name" },
    ],
    fgrDataItems: [],
    renderComp: true,
    SnackBarComponent: {},
    StoreObj: {},
    FgrInfoDialog: false,
    ApproveFgrDialog: false,
    RejectFgrDialog: false,
    GenerateOrReopenFgrDialog: false,
  }),

  watch: {
    async fgrStatus(val) {
      if (val === "APPROVED") {
        this.fgrTableHeader = [
          { text: "", value: "frg_value" },
          { text: "FGR Display ID", value: "fgr_display_id", width: "180px" },
          { text: "Ticket ID", value: "custom_ticket_id", width: "180px" },
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
      } else if (val === "ALL") {
        this.fgrTableHeader = [
          { text: "", value: "frg_value" },
          { text: "FGR Display ID", value: "fgr_display_id", width: "180px" },
          { text: "Ticket ID", value: "custom_ticket_id", width: "180px" },
          { text: "Customer", value: "customer_company_name" },
          {
            text: "Customer Contact Details",
            value: "customer_contact_number",
          },
          { text: "Initiator Name", value: "user_name" },
          // { text: "Initiator Contact Details", value: "user_contact_number" },
          { text: "Initiated On", value: "fgr_initiated_on" },
        ];
        this.fgrDataItems = await this.listFgrDataMethod(val);
      } else {
        [
          { text: "FGR Display ID", value: "fgr_display_id", width: "180px" },
          { text: "Ticket ID", value: "custom_ticket_id", width: "180px" },
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
  },

  async mounted() {
    this.TableHeight = window.innerHeight - 170;
    this.fgrDataItems = await this.listFgrDataMethod(this.fgrStatus);
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
      console.log("ITEM", item);
      this.StoreObj = item;
      this.FgrInfoDialog = true;
    },

    approveFgrMethod(item) {
      this.StoreObj = {};
      this.StoreObj = item;
      this.ApproveFgrDialog = true;
    },

    rejectFgrMethod(item) {
      this.StoreObj = item;
      this.RejectFgrDialog = true;
    },

    viewDocMethod(item) {
      window.open(item.frg_pdf_s3_url);
    },

    async FgrInfoDialogEmit(Toggle) {
      this.FgrInfoDialog = false;
      if (Toggle === 2) {
        this.fgrDataItems = await this.listFgrDataMethod(this.fgrStatus);
      }
    },

    reOpenFgrMethod(item) {
      this.StoreObj = item;
      this.StoreObj.action = "REOPEN";
      this.GenerateOrReopenFgrDialog = true;
    },

    async ApproveFgrDialogEmit(Toggle) {
      this.ApproveFgrDialog = false;
      this.fgrDataItems = await this.listFgrDataMethod(this.fgrStatus);
      this.StoreObj = {};
      // if (Toggle === 2) {

      // }
    },

    async RejectFgrDialogEmit(Toggle) {
      this.RejectFgrDialog = false;
      if (Toggle === 2) {
        this.fgrDataItems = await this.listFgrDataMethod(this.fgrStatus);
      }
    },

    async GenerateOrReopenFgrDialogEmit(Toggle) {
      this.GenerateOrReopenFgrDialog = false;
      if (Toggle === 2) {
        this.fgrDataItems = await this.listFgrDataMethod(this.fgrStatus);
      }
    },
  },
};
</script>

<style>
.cardRotate {
  transform: rotate(-90deg) !important;
  font-size: 8px !important;
}
</style>
