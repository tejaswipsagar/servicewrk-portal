<template>
  <div>
    <ViewTicketVisitsDialog
      :ticketVisitsDialog="ticketVisitsDialog"
      :StoreObjTicketVisits="StoreObjTicketVisits"
      :StoreObj="StoreObj"
      @clicked="ticketVisitsDialogEmit"
    />
    <v-card-text>
      <v-toolbar dense class="elevation-0 mt-n3">
        <h2>Work Details of {{ StoreObj.user_name }}</h2>
        <v-spacer></v-spacer>
        <v-btn small color="primary" @click="AttendanceDeatilsEmit()">
          <v-icon>mdi-chevron-double-left</v-icon>Back
        </v-btn>
      </v-toolbar>
      <v-card class="elevation-0"> </v-card>
      <v-row>
        <v-col cols="12" md="12">
          <div class="font-weight-bold ml-4">
            Total Distance Travelled in KM's :
            <span
              v-if="
                this.GetUserDailyReportList != undefined &&
                this.GetUserDailyReportList != ''
              "
              >{{
                this.GetUserDailyReportList[0].total_distance_travelled
              }}</span
            ><span v-else>0</span>
          </div>
          <v-data-table
            dense
            class="elevation-0"
            :headers="attendenceDeatailsHeaders"
            :items="currentAttendanceData?.visit_details"
          >
            <template v-slot:[`item.ticket_id`]="{ item }">
              <div
                v-if="
                  item.custom_ticket_id != undefined &&
                  item.custom_ticket_id != '-'
                "
              >
                {{ item.custom_ticket_id }}
              </div>
              <div v-else class="FontSize">
                {{
                  `${item.ticket_id.split("-")[1]}-${
                    item.ticket_id.split("-")[2]
                  }-${item.ticket_id.split("-")[3]}-${
                    item.ticket_id.split("-")[4]
                  }`
                }}
              </div>
            </template>
            <template v-slot:[`item.customer_company_name`]="{ item }">
              <div
                v-if="item.customer_company_name != undefined"
                class="FontSize"
              >
                {{ item.customer_company_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.customer_name`]="{ item }">
              <div v-if="item.customer_name != undefined" class="FontSize">
                {{ item.customer_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.ticket_visits`]="{ item }">
              <div
                v-if="
                  item.ticket_visits != undefined &&
                  item.ticket_visits.length != 0
                "
              >
                {{ item.ticket_visits.length }}
                <v-icon
                  small
                  color="primary"
                  @click="openTicketVisitsDailog(item)"
                  >mdi-information</v-icon
                >
              </div>
              <div v-else>0</div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import { GetUserDailyReport } from "@/mixins/Analytics/GetDailyUserReport.js";
import ViewTicketVisitsDialog from "@/components/Attendance/Dialogs/ViewTicketVisitsDialog.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetParticularAttendanceDetails } from "@/graphql/queries.js";
export default {
  mixins: [GetUserDailyReport],
  props: {
    StoreObj: Object,
  },
  components: {
    ViewTicketVisitsDialog,
  },
  data: () => ({
    ticketVisitsDialog: false,
    GetUserDailyReportList: "",
    path: [],
    attendanceData: [],
    attendenceDeatailsHeaders: [
      { text: "Ticket ID", value: "ticket_id", width: "30%" },
      { text: "Customer", value: "customer_company_name" },
      { text: "Contact Person", value: "customer_name" },
      { text: "Swipe Details", value: "ticket_visits" },
    ],
    StoreObjTicketVisits: {},
    center: { lat: 0, lng: 0 },
    currentAttendanceData: [],
  }),
  async mounted() {
    await this.callApiMethod();
    await this.GetUserDailyReportMethod(
      this.StoreObj.user_id,
      this.StoreObj.attendance_date
    );
  },
  methods: {
    async callApiMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(GetParticularAttendanceDetails, {
            input: {
              attendance_id: this.StoreObj.attendance_id,
              attendance_activity_time: this.StoreObj.attendance_activity_time,
            },
          })
        );
        const response = JSON.parse(result.data.GetParticularAttendanceDetails)
          .data.Items;
        this.currentAttendanceData = response[0];
      } catch (error) {
        //
      }
    },
    ticketVisitsDialogEmit() {
      this.ticketVisitsDialog = false;
    },
    openTicketVisitsDailog(item) {
      this.StoreObjTicketVisits = item;
      this.ticketVisitsDialog = true;
    },
    AttendanceDeatilsEmit() {
      this.$emit("clicked");
    },
  },
};
</script>
