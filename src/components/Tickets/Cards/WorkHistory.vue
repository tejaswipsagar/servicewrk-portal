<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-card class="elevation-0">
      <v-data-table
        dense
        :headers="headers"
        class="elevation-0 ma-2"
        :items="WorkHistoryList"
        :no-data-text="noDataText"
      >
        <template v-slot:[`item.ticket_id`]="{ item }">
          <div
            class="FontSize"
            v-if="
              item.custom_ticket_id != undefined && item.custom_ticket_id != '-'
            "
          >
            {{ item.custom_ticket_id }}
          </div>
          <div class="FontSize" v-else>{{ item.ticket_id }}</div>
        </template>
        <template v-slot:[`item.user_name`]="{ item }">
          <div class="FontSize" v-if="item.user_name">{{ item.user_name }}</div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.user_full_number`]="{ item }">
          <div class="FontSize" v-if="item.user_full_number">
            {{ item.user_full_number }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.current_work_status`]="{ item }">
          <div class="FontSize" v-if="item.current_work_status">
            {{ getCurrentWorkStatus(item) }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.worklog`]="{ item }">
          <v-tooltip bottom color="primary" v-if="item.user_work_logs">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                v-on="on"
                class="mr-2"
                color="primary"
                @click="checkItem(item, 'VIEW')"
              >
                mdi-eye
              </v-icon>
            </template>
            <span class="white--text">View Work Logs</span>
          </v-tooltip>
          <div v-else>0</div>
        </template>
      </v-data-table>
      <ViewWorkLogDialog
        :StoreObj="StoreObject"
        :viewWorkDialog="viewWorkDialog"
        @clicked="dialogCloseEmit"
        :work_location_array="work_location_array"
      />
    </v-card>
  </div>
</template>
<script>
import { GetAllWorkHistory } from "@/mixins/Tickets/GetAllWorkHistory.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import ViewWorkLogDialog from "@/components/Tickets/Dialogs/ViewWorkLogDialog.vue";
export default {
  mixins: [GetAllWorkHistory],
  components: { ViewWorkLogDialog, Overlay },
  props: {
    StoreObj: Object,
  },
  data: () => ({
    noDataText: "",
    overlay: false,
    viewWorkDialog: false,
    StoreObject: {},
    WorkHistoryList: [],
    work_location_array: [],
    headers: [
      { text: "Ticket Id", value: "ticket_id" },
      { text: "User Name", value: "user_name" },
      { text: "Contact Number", value: "user_full_number" },
      { text: "Status", value: "current_work_status" },
      { text: "Work Logs", value: "worklog" },
    ],
  }),
  mounted() {
    this.GetAllWorkHistoryMethod(this.StoreObj.ticket_id);
  },
  methods: {
    checkItem(item, action) {
      this.StoreObject = item;
      this.StoreObject.action = action;
      var position = {};
      this.work_location_array = [];
      for (let i = 0; i < this.StoreObject.user_work_logs.length; i++) {
        position = {
          lat: Number(this.StoreObject.user_work_logs[i].work_log_latitude),
          lng: Number(this.StoreObject.user_work_logs[i].work_log_longitude),
        };
        this.work_location_array.push({ position });
      }
      if (action == "VIEW") {
        this.viewWorkDialog = true;
      }
    },
    getCurrentWorkStatus(item) {
      if (item.user_work_logs) {
        let workLogs = item.user_work_logs;
        let lengthOfWorkLogs = workLogs.length;
        let latest_work_status =
          item.user_work_logs[lengthOfWorkLogs - 1].work_log_status;
        let removingUnderScrore = latest_work_status.replaceAll("_", " ");
        if (removingUnderScrore == "START") {
          return "WORK START";
        } else if (removingUnderScrore == "END") {
          return "WORK END";
        } else {
          return removingUnderScrore;
        }
      } else if (item.current_work_status) {
        return item.current_work_status;
      } else {
        return "NA";
      }
    },
    dialogCloseEmit(Toggle) {
      if (Toggle == 1 || Toggle == 2) {
        this.viewWorkDialog = false;
        this.GetAllWorkHistoryMethod(this.StoreObject.ticket_id);
      }
    },
  },
};
</script>
