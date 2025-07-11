<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">FOC View</div>

        <v-spacer />
        <v-select
          dense
          outlined
          :items="focStatusItems"
          label="Status"
          v-model="focStatus"
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
              label="From Date"
              outlined
              dense
              class="ml-1 mr-1 mt-8 maxWidth80px FontSize field_label_size field_height"
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
          :return-value.sync="toDate"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="toDate"
              label="To Date"
              outlined
              dense
              class="ml-1 mr-1 maxWidth80px mt-8 FontSize field_label_size field_height"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker :min="date + 1" v-model="toDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu1.save(toDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              depressed
              v-on="on"
              v-bind="attrs"
              color="primary"
              class="primary white--text mt-0 ml-2"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Product Replacement Excel</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="pt-2">
        <v-data-table
          style="cursor: pointer"
          :headers="focTableHeader"
          :items="focDataItems"
          dense
          fixed-header
          :search="search"
          :items-per-page="50"
          :height="TableHeight"
          :no-data-text="
            focDataItems && focDataItems.length === 0
              ? 'No data found'
              : undefined
          "
          @click:row="handleRowClick"
        >
          <!-- <template v-slot:[`item.display_value`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="focStatus == 'APPROVED' && item.fgr_claim_status"
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
  
          </template> -->
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
          <!-- <template v-slot:[`item.pending_at`]="{ item }">
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
                      focStatus == 'APPROVED' &&
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
                      focStatus == 'APPROVED' &&
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

          </template> -->
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

import { GetAllFocDataList } from "@/mixins/FOC/GetFocDataList.js";
export default {
  mixins: [GetAllFocDataList],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    ClaimedStatusDialog: false,
    SnackBarComponent: {},
    overlay: true,
    focStatusItems: [
      // { text: "ALL", value: "ALL" },
      { text: "PENDING", value: "PENDING" },
      { text: "IN PROGRESS", value: "IN_PROGRESS" },
      { text: "APPROVED", value: "APPROVED" },
      { text: "REJECTED", value: "REJECTED" },
    ],

    focStatus: "PENDING",
    search: "",
    isSearching: false,
    TableHeight: 0,
    focTableHeader: [
      { text: "", value: "display_value" },
      { text: "FGR Display ID", value: "fgr_display_id" },
      { text: "Ticket ID", value: "custom_ticket_id" },
      { text: "Customer", value: "customer_company_name" },
      { text: "Customer Contact Details", value: "customer_contact_number" },
      { text: "Initiator Name", value: "user_name" },
      // { text: "Initiator Contact Details", value: "user_contact_number" },
      { text: "Initiated On", value: "fgr_initiated_on" },
      { text: "Pending At", value: "pending_at" },
      { text: "View", value: "action" },
      //   { text: "Customer Name", value: "customer_name" },
    ],
    fgrExcelHeader: [
      { label: "FGR Display ID", value: "fgr_display_id" },
      { label: "Ticket ID", value: "custom_ticket_id" },
      { label: "Customer", value: "customer_company_name" },
      { label: "Customer Contact Details", value: "customer_contact_number" },
      { label: "Customer EmailId", value: "customer_email_id" },
      { label: "Customer Address", value: "customer_address" },
      { label: "Initiator Name", value: "user_name" },
      { label: "Initiated On", value: "fgr_initiated_on" },
      { label: "Attachments", value: "share_to_customer_attachments" },
    ],
    focDataItems: [],
    StoreObj: {},
    toDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date: new Date(new Date().getTime() - 30 * 86400000)
      .toISOString()
      .substr(0, 10),
    epochToDate: null,
    epochFromDate: null,
  }),

  async mounted() {
    this.convertFromDateToEpoch();
    this.convertEndDateToEpoch();
    this.focDataItems = await this.GetAllFocDataListMethod(
      this.epochFromDate,
      this.epochToDate
    );
  },

  methods: {
    convertEndDateToEpoch() {
      const dateStr = this.toDate;
      const date = new Date(dateStr);
      date.setHours(23, 59, 59, 999);
      const epochTime = date.getTime();
      this.epochToDate = Math.floor(epochTime / 1000);
    },

    convertFromDateToEpoch() {
      const dateStr = this.date;
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      const epochTime = date.getTime();
      this.epochFromDate = Math.floor(epochTime / 1000);
    },
  },
};
</script>
