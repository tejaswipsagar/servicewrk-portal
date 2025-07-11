<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-card elevation="0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Attendance Report
          <span class="ml-3 FontSize" v-if="filters_applied == true"
            ><v-icon small color="green">mdi-filter</v-icon>Filters Applied
            <v-btn
              class="ml-2 primary white--text"
              x-small
              @click="ClearFilterMethod"
              ><v-icon small>mdi-filter-off</v-icon>Clear</v-btn
            >
          </span>
        </div>
        <v-spacer />
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          @input="searchMethod()"
          class="mt-7 FontSize maxWidth"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              small
              class="primary white--text ml-2"
              color="primary"
              @click="DownloadExcel"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip>
        <v-menu right bottom :close-on-content-click="CloseValue" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              class="primary white--text ml-2"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-card width="220px">
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
                  disabled
                  label="Starting Date"
                  outlined
                  dense
                  class="mt-6 mx-6 FontSize field_label_size field_height"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              :return-value.sync="enddate"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="enddate"
                  label="Ending Date"
                  outlined
                  dense
                  width="290px"
                  class="mx-6 FontSize field_label_size field_height"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="enddate" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu1 = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu1.save(enddate)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-select
              dense
              outlined
              class="FontSize field_label_size field_height mx-6"
              label="Attendance Status"
              item-text="text"
              item-value="value"
              v-model="AttendanceStatus"
              :items="usertypestatus"
            >
            </v-select>
            <v-select
              dense
              outlined
              class="FontSize field_label_size field_height mx-6"
              item-text="text"
              item-value="value"
              label="Select User Type"
              v-model="SelectUser"
              :items="user_typeItems"
              v-if="
                this.$store.getters.get_current_user_details.user_type !=
                'SERVICE_PARTNER'
              "
            ></v-select>
            <v-autocomplete
              dense
              outlined
              class="FontSize field_label_size field_height mx-6"
              item-text="user_name"
              item-value="user_id"
              :items="
                SelectUser == 'AGENT'
                  ? GetAllUsersList
                  : SelectUser == 'ENTERPRISE_REPRESENTATIVE'
                  ? GetAllServiceRepresentativeList
                  : SelectUser == 'DEALER_OWNER' ||
                    SelectUser == 'DEALER_TECHNICIAN' ||
                    SelectUser == 'DEALER_AGENT'
                  ? GetDealersList
                  : SelectUser == 'SERVICE_PARTNER'
                  ? GetAllPartnerAndPartnerUserList
                  : GetAllUsersList
              "
              :no-data-text="noDataText"
              label="Select User"
              v-model="SelectUserType"
              v-if="
                this.$store.getters.get_current_user_details.user_type !=
                'SERVICE_PARTNER'
              "
            ></v-autocomplete>
            <div class="text-center">
              <v-btn
                color="primary"
                small
                class="mb-8 mt-n1"
                :close-on-content-click="false"
                @click="SortByDateMethod"
              >
                <v-icon class="white--text" small>mdi-filter</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                small
                class="ml-2 mb-8 mt-n1"
                :close-on-content-click="false"
                @click="ClearFilterMethod"
              >
                <v-icon class="white-text" small>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :loading="loading"
          :headers="headers"
          :height="TableHeight"
          :items-per-page="100"
          style="cursor: pointer"
          :items="filteredItems_attendance"
          :no-data-text="noDataText"
          @click:row="handleRowClick"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template
            v-for="(h, i) in headers"
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
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAttendanceList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize" v-if="item.user_name != undefined">
              {{ item.user_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.user_full_number != undefined">
              {{ item.user_full_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.attendance`]="{ item }">
            <span
              class="red--text FontSize"
              :class="
                item.attendance_status == 'IN' ||
                item.attendance_status == 'OUT'
                  ? 'green--text'
                  : 'red--text'
              "
              >{{
                item.attendance_status == "IN" ||
                item.attendance_status == "OUT"
                  ? "PRESENT"
                  : "ABSENT"
              }}</span
            >
            <div
              class="FontSize"
              v-if="item.attendance_activity_time != undefined"
            >
              {{
                new Date(
                  item.attendance_activity_time * 1000
                ).toLocaleDateString("en-GB")
              }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.attendance_status`]="{ item }">
            <div>
              <span
                class="red--text FontSize"
                :class="
                  item.attendance_status == 'IN' ? 'green--text' : 'red--text'
                "
                >{{
                  item.attendance_status ? item.attendance_status : "-"
                }}</span
              >
            </div>
            <div class="FontSize" v-if="item.work_status != undefined">
              <div v-if="item.work_status == 'START'" class="green--text">
                WORK STARTED
              </div>
              <div v-else-if="item.work_status == 'END'" class="red--text">
                WORK ENDED
              </div>
              <div
                v-else-if="item.work_status == 'JOURNEY_START'"
                class="yellow--text"
              >
                JOURNEY STARTED
              </div>
              <div
                v-else-if="item.work_status == 'JOURNEY_END'"
                class="orange--text"
              >
                JOURNEY ENDED
              </div>
            </div>
            <div
              v-else-if="
                (item.attendance_status == 'IN' ||
                  item.attendance_status == 'OUT') &&
                item.work_status == undefined
              "
              class="primary--text FontSize"
            >
              IDLE
            </div>
          </template>
          <template v-slot:[`item.login_time`]="{ item }">
            <span class="FontSize"
              >Login :<span v-if="item.login_time != undefined">
                {{ GetLoginTImeMethod(item) }}
              </span>
              <span v-else>--</span>
            </span>
            <div></div>
            <span class="FontSize"
              >Logout :<span v-if="item.logout_time != undefined">
                {{ GetLogOutmethod(item) }}
              </span>
              <span v-else>--</span>
            </span>
          </template>
          <template v-slot:[`item.is_wfh`]="{ item }">
            <div
              class="red--text FontSize"
              :class="item.is_wfh ? 'red--text' : 'green--text'"
            >
              {{ item.is_wfh ? "YES" : "NO" }}
              <v-tooltip
                bottom
                color="primary"
                v-if="item.log_attendance_comment != undefined"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small v-on="on" v-bind="attrs" color="primary"
                    >mdi-chat-question-outline</v-icon
                  >
                </template>
                <span>{{ item.log_attendance_comment }}</span>
              </v-tooltip>
            </div>
            <div>
              <span class="FontSize"
                >Duration :<span v-if="item.login_duration != undefined">
                  {{ item.login_duration }}
                </span>
                <span v-else>00:00</span>
              </span>
            </div>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  :disabled="item.attendance_status == 'ABSENT'"
                  @click.stop="checkItem(item, 'VIEW')"
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                >
                  mdi-map-marker
                </v-icon>
              </template>
              <span>Swipe Details</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <ViewSwipeDialog
      :swipeDialog="swipeDialog"
      :StoreObj="StoreObj"
      @clicked="DialogEmit"
    />
    <AttendenceDetails
      v-if="current_view == 'EDIT'"
      :StoreObj="StoreObj"
      @clicked="AttendanceDeatilsEmit"
    />
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
var xlsx = require("json-as-xlsx");
import Overlay from "@/components/Extras/OverlayView.vue";
import ViewSwipeDialog from "@/components/Attendance/Dialogs/ViewSwipeDialog.vue";
import AttendenceDetails from "@/components/Attendance/Cards/AttendenceDetails.vue";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import { GetAllAttendance } from "@/mixins/Analytics/GetAllAttendance.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
var moment = require("moment");

export default {
  mixins: [
    GetAllUsers,
    GetAllDealers,
    GetAllAttendance,
    GetAllPartnerUser,
    GetAllServiceRepresentative,
  ],
  components: {
    Overlay,
    ViewSwipeDialog,
    AttendenceDetails,
  },
  data: () => ({
    menu: false,
    menu1: false,
    overlay: true,
    loading: false,
    disabled: false,
    CloseValue: false,
    swipeDialog: false,
    filters_applied: false,
    TableHeight: 0,
    search: "",
    current_view: "LIST",
    SelectUserType: "ALL",
    AttendanceStatus: "ALL",
    noDataText: "No Data Available..!",
    SelectUser: "ENTERPRISE_REPRESENTATIVE",
    enddate: new Date().toISOString().substr(0, 10),
    date: Date.now(new Date().toISOString().substr(0, 10)),
    StoreObj: {},
    markers: [],
    LogsList: [],
    filteredItems_attendance: [],
    GetDealersList: [],
    GetFilterByUserArray: [],
    GetAllServiceRepresentativeList: [],
    headers: [
      { text: "#", value: "sl_no", tooltip_text: "Serial Number", width: "5%" },
      {
        text: "Name",
        value: "user_name",
        tooltip_text: "User Name",
        width: "20%",
      },
      {
        text: "Attendance",
        value: "attendance",
        tooltip_text: "Attendence Status",
        width: "20%",
        align: "center",
      },
      {
        text: "Current Status",
        value: "attendance_status",
        tooltip_text: "Current Status",
        align: "center",
        width: "20%",
      },
      {
        text: "Login",
        value: "login_time",
        tooltip_text: "Login Time",
        width: "15%",
      },
      {
        text: "WFH",
        value: "is_wfh",
        tooltip_text: "Is Work From Home ?",
        align: "center",
        width: "15%",
      },
      {
        text: "Swipe",
        value: "action",
        align: "center",
        tooltip_text: "Swipe Details",
        width: "5%",
      },
    ],
    user_typeItems: [
      { text: "REPRESENTATIVE", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "AGENT", value: "AGENT" },
      { text: "DEALER", value: "DEALER_OWNER" },
      { text: "PARTNERS", value: "SERVICE_PARTNER" },
    ],
    usertypestatus: [
      { text: "ALL", value: "ALL" },
      { text: "PRESENT", value: "PRESENT" },
      { text: "ABSENT ", value: "ABSENT" },
      { text: "IN", value: "IN" },
      { text: "OUT", value: "OUT" },
    ],
  }),
  watch: {
    enddate(val) {
      const endDate = new Date(`${val}T23:59:59`);
      const epochEndMillis = endDate.getTime();
      const momentEndDate = moment(endDate);
      const momentStartDate = momentEndDate
        .clone()
        .subtract(2, "months")
        .startOf("day");
      const epochStartMillis = momentStartDate.valueOf();
      this.date = momentStartDate.format("YYYY-MM-DD");
    },
    async SelectUser(val) {
      console.log("CHECK_VAL", val);
      if (val == "DEALER_OWNER") {
        console.log("ONE");
        await this.GetDealersMethod("DEALER_OWNER", "ACTIVE", undefined);
      } else if (val == "SERVICE_PARTNER") {
        console.log("TWO");
        await this.GetAllPartnerUserMethod(
          "SERVICE_PARTNER",
          "ACTIVE",
          undefined
        );
      } else if (val === "AGENT") {
        console.log("THREE");
        console.log("HRE_AGENT");
        this.GetAllUsersMethod(val, "ACTIVE", undefined);
      } else if (val === "DEALER_TECHNICIAN") {
        console.log("FOUR");
        await this.GetDealersMethod(
          "DEALER_TECHNICIAN",
          "ACTIVE",
          this.$store.getters.get_current_user_details.partner_id
        );
      } else if (val === "DEALER_AGENT") {
        console.log("FIVE");
        await this.GetDealersMethod(
          "DEALER_AGENT",
          "ACTIVE",
          this.$store.getters.get_current_user_details.partner_id
        );
      } else if (val === "ENTERPRISE_REPRESENTATIVE") {
        await this.GetAllServiceRepresentativeMethod("ACTIVE");
      }
    },

    SelectUserType(val) {
      console.log("USER_ID", val);
    },
  },

  async mounted() {
    const convEndDate = new Date(`${this.enddate}T23:59:00`);
    const finalEndDate = convEndDate.getTime();
    const endDateMs = new Date(this.enddate).getTime();
    const twoMonthsAgoMs = endDateMs - 2629743 * 2 * 1000;
    const dateAtMidnight = moment(twoMonthsAgoMs).startOf("day");
    const epochAtMidnight = dateAtMidnight.valueOf();
    this.date = dateAtMidnight.format("YYYY-MM-DD");
    this.TableHeight = window.innerHeight - 200;
    const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const endOfDay = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);
    await this.GetAttendanceMethod(
      this.AttendanceStatus == "ALL" ? undefined : this.attendance_status,
      startOfDay,
      endOfDay,
      this.$store.getters.get_current_user_details.user_type ==
        "DEALER_OWNER" ||
        this.$store.getters.get_current_user_details.user_type ==
          "SERVICE_PARTNER" ||
        this.$store.getters.get_current_user_details.user_type == "DEALER_AGENT"
        ? this.$store.getters.get_current_user_details.user_id
        : undefined
    );
    this.$store.getters.get_current_user_details.user_type == "DEALER_AGENT" ||
    this.$store.getters.get_current_user_details.user_type == "DEALER_OWNER"
      ? (this.SelectUser = "DEALER_TECHNICIAN")
      : (this.SelectUser = "ALL");
    this.$store.getters.get_current_user_details.user_type == "DEALER_AGENT" ||
    this.$store.getters.get_current_user_details.user_type == "DEALER_OWNER"
      ? (this.user_typeItems = [
          { text: "REPRESENTATIVE", value: "DEALER_TECHNICIAN" },
          { text: "SERVICE CO-ORDINATORS", value: "DEALER_AGENT" },
        ])
      : (this.user_typeItems = [
          { text: "REPRESENTATIVE", value: "ENTERPRISE_REPRESENTATIVE" },
          { text: "AGENT", value: "AGENT" },
          { text: "DEALER", value: "DEALER_OWNER" },
          { text: "PARTNERS", value: "SERVICE_PARTNER" },
        ]);
    // if (this.GetAttendanceList.length > 0) {
    //   this.overlay = false;
    //   this.loading = false;
    // } else {
    //   this.overlay = true;
    //   this.loading = true;
    // }
    this.overlay = false;
  },
  methods: {
    searchMethod() {
      const lowerSearchedText = this.search.toLowerCase();
      this.filteredItems_attendance = this.GetAttendanceList.filter((item) => {
        const itemString = JSON.stringify(item).toLowerCase();
        return itemString.includes(lowerSearchedText);
      });
    },
    handleRowClick(item) {
      console.log("ATTEND", item);
      this.StoreObj = item;
      this.StoreObj.action = "EDIT";
      this.current_view = "EDIT";
    },
    DownloadExcel() {
      this.GetAttendanceList.map((item) => {
        let object;
        object = item;
        object.date1 =
          item.login_time != undefined
            ? new Date(item.login_time * 1000).toLocaleTimeString("en-IN")
            : "-";
        object.date2 =
          item.logout_time != undefined
            ? new Date(item.logout_time * 1000).toLocaleTimeString("en-IN")
            : "-";
        object.date3 =
          item.login_time != undefined
            ? new Date(item.login_time * 1000).toDateString("en-IN")
            : "--";
        object.attendenceStatus =
          item.attendance_status == "IN" || item.attendance_status == "OUT"
            ? "PRESENT"
            : "ABSENT";
        object.is_work_from_home = item.is_wfh
          ? "Work From Home"
          : "Work From Office";
        return object;
      });
      let data = [
        {
          sheet: "test",
          columns: [
            {
              label: "User Name",
              value: "user_name",
            },
            {
              label: "Contact Number",
              value: "user_full_number",
            },
            {
              label: "Attendance Status",
              value: "attendenceStatus",
            },
            {
              label: "Current Status",
              value: "attendance_status",
            },
            {
              label: "Place of Work",
              value: "is_work_from_home",
            },
            {
              label: "Date",
              value: "date3",
            },
            {
              label: "Login Time",
              value: "date1",
            },
            {
              label: "logout Time",
              value: "date2",
            },
            {
              label: "Login Duration",
              value: "login_duration",
            },
          ],
          content: this.GetAttendanceList,
        },
      ];
      let settings = {
        fileName: "Attendence Report",
        extraLength: 3,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    GetLoginTImeMethod(item) {
      let LOGINTIME = new Date(item.login_time * 1000).toString().slice(15, 21);
      return LOGINTIME;
    },
    GetLogOutmethod(item) {
      let LOGOUTTIME = new Date(item.logout_time * 1000)
        .toString()
        .slice(15, 21);
      return LOGOUTTIME;
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.markers = [];
      // this.markers = this.StoreObj.work_details;
      this.StoreObj.action = action;
      if (action == "VIEW") {
        this.swipeDialog = true;
      }
    },
    AttendanceDeatilsEmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 1) {
        this.current_view = "LIST";
      }
    },
    DialogEmit(Toggle) {
      if (Toggle == 1) {
        this.swipeDialog = false;
      }
    },
    ClearFilterMethod() {
      this.CloseValue = true;
      this.filters_applied = false;
      this.AttendanceStatus = "ALL";
      this.SelectUserType = "ALL";
      this.SelectUser = "ENTERPRISE_REPRESENTATIVE";
      this.enddate = new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.date = new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.filteredItems_attendance = [];
      const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
      const endOfDay = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);
      this.GetAttendanceMethod(
        undefined,
        startOfDay,
        endOfDay,
        this.$store.getters.get_current_user_details.user_type ==
          "DEALER_OWNER" ||
          this.$store.getters.get_current_user_details.user_type ==
            "SERVICE_PARTNER"
          ? this.$store.getters.get_current_user_details.user_id
          : undefined
      );
      setTimeout(() => {
        this.CloseValue = false;
      }, 1000);
    },
    SortByDateMethod() {
      this.CloseValue = true;
      this.filters_applied = true;
      this.filteredItems_attendance = [];
      this.GetAttendanceMethod(
        this.AttendanceStatus == "ALL" ? undefined : this.AttendanceStatus,
        Date.parse(this.date) / 1000,
        Date.parse(this.enddate) / 1000 + 86399,
        // this.$store.getters.get_current_user_details.user_type ==
        //   "DEALER_OWNER" ||
        this.$store.getters.get_current_user_details.user_type ==
          "SERVICE_PARTNER"
          ? this.$store.getters.get_current_user_details.user_id
          : this.SelectUserType == "ALL"
          ? undefined
          : this.SelectUserType,
        this.SelectUser,
        this.SelectUserType
      );
      setTimeout(() => {
        this.CloseValue = false;
      }, 1000);
    },
  },
};
</script>
