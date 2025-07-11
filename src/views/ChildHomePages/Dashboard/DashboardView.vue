<template>
  <div>
    <Overlay :overlay="overlay" />
    <RechargeDialog
      :rechargecreditDialog="rechargecreditDialog"
      @clicked="CloseDialogDashboard"
    />
    <RepProductFleet
      v-if="current_view == 'RepProductFleets'"
      @clicked="repProductFleetsDialogEmit"
    />
    <v-card class="elevation-0" v-if="current_view == 'Dashboard'">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar dense class="elevation-0 mb-3">
            <div class="largeFontSizeNew">Dashboard</div>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-row class="mx-5 mt-n2">
        <v-col
          cols="12"
          :md="
            this.$store.getters.get_current_user_details.user_type == 'OWNER' ||
            this.$store.getters.get_current_user_details.user_type == 'ADMIN'
              ? 3
              : 4
          "
          xs="12"
          sm="12"
          v-if="
            this.$store.getters.get_current_user_details.user_type !=
              'DEALER_OWNER' &&
            this.$store.getters.get_current_user_details.user_type !=
              'SERVICE_PARTNER'
          "
        >
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-card
              @click="$router.push('AttendenceReport')"
              :elevation="hover ? 16 : 2"
              class="{ 'on-hover': hover } pa-3"
              max-height="170px"
            >
              <v-row justify="end" class="mt-n16 ml-8">
                <v-col class="" cols="12" md="4" lg="3" xl="4" xs="12" sm="12">
                  <div>
                    <v-card-text class="">
                      <v-btn
                        @click="$router.push('AttendenceReport')"
                        class="ml-n12"
                        fab
                        dark
                        medium
                        color="primary"
                      >
                        <v-icon dark>mdi-account-hard-hat</v-icon>
                      </v-btn>
                    </v-card-text>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="mt-8"
                  cols="12"
                  md="12"
                  lg="12"
                  xl="6"
                  xs="12"
                  sm="12"
                >
                  <v-card-text
                    class="mt-n12 largeFontSizeNew--text"
                    align="left"
                  >
                    <div class="mt-n12">
                      <h3 class="mt-n8 mb-2">Attendance</h3>
                      <h5
                        class="blue-grey--text darken-3"
                        v-if="AttendenceDetailsObject.daily_swipe_counts"
                      >
                        Total User Present :
                        {{
                          AttendenceDetailsObject.daily_swipe_counts
                            .total_logged_user_count
                        }}
                      </h5>
                      <h5
                        class="blue-grey--text darken-3"
                        v-if="AttendenceDetailsObject.daily_swipe_counts"
                      >
                        Total User Absent :
                        {{
                          AttendenceDetailsObject.daily_swipe_counts
                            .total_absent_user_count
                        }}
                      </h5>
                      <div
                        @mouseover="upHere = true"
                        @mouseleave="upHere = false"
                        v-if="
                          $store.getters.get_current_user_details.user_type !==
                            'DEALER_OWNER' &&
                          $store.getters.get_current_user_details.user_type !==
                            'DEALER_AGENT'
                        "
                      >
                        <h5>All User Swipes :</h5>
                        <v-row cols="12" xs="12" sm="12" md="16" no-gutters>
                          <v-col cols="12" md="4">
                            <h5
                              class="blue-grey--text darken-3"
                              v-show="upHere"
                              v-if="AttendenceDetailsObject.daily_swipe_counts"
                            >
                              Users :
                              <br />{{
                                AttendenceDetailsObject.daily_swipe_counts
                                  .enterprise_attendance_count
                              }}
                            </h5></v-col
                          >
                          <v-col cols="12" md="4">
                            <h5
                              class="blue-grey--text darken-3"
                              v-show="upHere"
                              v-if="AttendenceDetailsObject.daily_swipe_counts"
                            >
                              Partners :
                              <br />{{
                                AttendenceDetailsObject.daily_swipe_counts
                                  .partner_attendance_count
                              }}
                            </h5></v-col
                          >
                          <v-col cols="12" md="4">
                            <h5
                              class="blue-grey--text darken-3"
                              v-show="upHere"
                              v-if="AttendenceDetailsObject.daily_swipe_counts"
                            >
                              Dealers :
                              <br />{{
                                AttendenceDetailsObject.daily_swipe_counts
                                  .dealer_attendance_count
                              }}
                            </h5></v-col
                          >
                        </v-row>
                      </div>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="12" md="4" lg="4" xl="4" xs="12" sm="12" v-else>
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-card
              :elevation="hover ? 16 : 2"
              class="{ 'on-hover': hover } pa-3"
              max-height="170px"
            >
              <v-row justify="end" class="mt-n16 ml-8">
                <v-col class="" cols="12" md="4" lg="3" xl="4" xs="12" sm="12">
                  <div>
                    <v-card-text class="">
                      <v-btn
                        @click="$router.push('AttendenceReport')"
                        class="ml-n12"
                        fab
                        dark
                        medium
                        color="primary"
                      >
                        <v-icon dark>mdi-account-hard-hat</v-icon>
                      </v-btn>
                    </v-card-text>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="mt-8"
                  cols="12"
                  md="12"
                  lg="12"
                  xl="6"
                  xs="12"
                  sm="12"
                >
                  <v-card-text
                    class="mt-n12 largeFontSizeNew--text"
                    align="left"
                  >
                    <div class="mt-n12">
                      <h3 class="mt-n8 mb-2">Attendance</h3>
                      <h5
                        class="blue-grey--text darken-3"
                        v-if="AttendenceDetailsObject.daily_swipe_counts"
                      >
                        Total User Present :
                        {{
                          AttendenceDetailsObject.daily_swipe_counts
                            .total_logged_user_count
                        }}
                      </h5>
                      <h5
                        class="blue-grey--text darken-3"
                        v-if="AttendenceDetailsObject.daily_swipe_counts"
                      >
                        Total User Absent :
                        {{
                          AttendenceDetailsObject.daily_swipe_counts
                            .total_absent_user_count
                        }}
                      </h5>
                      <v-row class="mb-9"></v-row>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </v-col>
        <v-col
          cols="12"
          :md="
            this.$store.getters.get_current_user_details.user_type == 'OWNER' ||
            this.$store.getters.get_current_user_details.user_type == 'ADMIN'
              ? 3
              : 4
          "
          xs="12"
          sm="12"
        >
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-card
              @click="$router.push('ActiveTickets')"
              :elevation="hover ? 16 : 2"
              class="{ 'on-hover': hover } pa-3"
            >
              <v-row justify="end" class="mt-n16 ml-8">
                <v-col class="" cols="12" md="4" lg="3" xl="4" xs="12" sm="12">
                  <div>
                    <v-card-text class="">
                      <v-btn
                        @click="$router.push('ActiveTickets')"
                        class="ml-n12"
                        fab
                        dark
                        medium
                        color="primary"
                      >
                        <v-icon dark>mdi-ticket</v-icon>
                      </v-btn>
                    </v-card-text>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="mt-8 mb-n4"
                  cols="12"
                  md="8"
                  lg="9"
                  xl="6"
                  xs="12"
                  sm="12"
                >
                  <v-card-text
                    class="mt-n12 largeFontSizeNew--text"
                    align="left"
                  >
                    <div class="mt-n12">
                      <h3 class="mt-n8 mb-2">Tickets</h3>
                      <h5
                        class="blue-grey--text darken-3"
                        v-if="TicketDetailsObject.monthly_and_daily_tickets"
                      >
                        Today :
                        {{
                          TicketDetailsObject.monthly_and_daily_tickets
                            .daily_ticket_count
                        }}
                      </h5>
                      <h5
                        class="blue-grey--text darken-3"
                        v-if="TicketDetailsObject.monthly_and_daily_tickets"
                      >
                        This Month :
                        {{
                          TicketDetailsObject.monthly_and_daily_tickets
                            .monthly_ticket_count
                        }}
                      </h5>
                      <div
                        @mouseover="upHeree = true"
                        @mouseleave="upHeree = false"
                      >
                        <h5
                          class="mb-3"
                          v-if="TicketDetailsObject.monthly_and_daily_tickets"
                        >
                          Overall Tickets :
                          {{
                            TicketDetailsObject.monthly_and_daily_tickets
                              .overall_tickets
                          }}
                        </h5>
                        <v-row>
                          <v-col cols="12" md="6">
                            <h5
                              v-show="upHeree"
                              class="blue-grey--text darken-3"
                              v-if="
                                TicketDetailsObject.monthly_and_daily_tickets
                              "
                            >
                              Active :
                              {{
                                TicketDetailsObject.monthly_and_daily_tickets
                                  .active_tickets
                              }}
                            </h5>
                          </v-col>
                          <v-col cols="12" md="6">
                            <h5
                              v-show="upHeree"
                              class="blue-grey--text darken-3"
                              v-if="
                                TicketDetailsObject.monthly_and_daily_tickets
                              "
                            >
                              Closed :
                              {{
                                TicketDetailsObject.monthly_and_daily_tickets
                                  .closed_tickets
                              }}
                            </h5>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </v-col>
        <v-col
          cols="12"
          :md="
            this.$store.getters.get_current_user_details.user_type == 'ADMIN' ||
            this.$store.getters.get_current_user_details.user_type == 'OWNER'
              ? 3
              : 4
          "
          xs="12"
          sm="12"
          v-if="creditCardDisplayHandle"
        >
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-card
              :elevation="hover ? 16 : 2"
              class="{ 'on-hover': hover } pa-3"
            >
              <v-row justify="end" class="mt-n16 ml-8">
                <v-col class="" cols="12" md="5" lg="3" xl="4" xs="12" sm="12">
                  <div>
                    <v-card-text class="">
                      <v-btn class="ml-n12" fab dark medium color="primary">
                        <v-icon dark>mdi-cash-100</v-icon>
                      </v-btn>
                    </v-card-text>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="mt-8"
                  cols="12"
                  md="6"
                  lg="9"
                  xl="6"
                  xs="12"
                  sm="12"
                >
                  <v-card-text
                    class="mt-n12 largeFontSizeNew--text"
                    align="left"
                  >
                    <div class="mt-n12">
                      <h3 class="mt-n8 mb-2">Credits</h3>
                      <h5 class="blue-grey--text darken-3">
                        Procured :
                        {{ creditsObject.produred_credits }}
                      </h5>
                      <h5 class="blue-grey--text darken-3">
                        Consumed :
                        {{ creditsObject.consumed_credits }}
                      </h5>
                      <h5 class="blue-grey--text darken-3">
                        Balance :
                        {{ creditsObject.remaining_credits }}
                      </h5>
                    </div>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="2">
                  <v-card-actions class="ml-n12 mt-4">
                    <v-btn
                      v-if="
                        $store.getters.get_current_user_details
                          .organization_details.enable_credits_recharge == true
                      "
                      @click.stop="rechargecreditDialog = true"
                      x-small
                      color="primary"
                      >Recharge</v-btn
                    >
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </v-col>
        <v-col
          v-if="
            $store.getters.get_current_user_details.user_type == 'OWNER' ||
            $store.getters.get_current_user_details.user_type == 'ADMIN'
          "
          cols="12"
          :md="
            $store.getters.get_current_user_details.user_type == 'OWNER' ||
            $store.getters.get_current_user_details.user_type == 'ADMIN'
              ? 3
              : 4
          "
          xs="12"
          sm="12"
        >
          <v-hover v-slot="{ hover }" open-delay="200">
            <v-card
              @click="current_view = 'RepProductFleets'"
              :elevation="hover ? 16 : 2"
              class="{ 'on-hover': hover } pa-3"
            >
              <v-row justify="end" class="mt-n16 ml-8">
                <v-col class="" cols="12" md="4" lg="3" xl="4" xs="12" sm="12">
                  <div>
                    <v-card-text class="">
                      <v-btn
                        @click="current_view = 'RepProductFleets'"
                        class="ml-n12"
                        fab
                        dark
                        medium
                        color="primary"
                      >
                        <v-icon dark>mdi-pandora</v-icon>
                      </v-btn>
                    </v-card-text>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="mt-8 mb-n4"
                  cols="12"
                  md="8"
                  lg="9"
                  xl="6"
                  xs="12"
                  sm="12"
                >
                  <v-card-text
                    class="mt-n12 largeFontSizeNew--text"
                    align="left"
                  >
                    <div class="mt-n12">
                      <h3 class="mt-n8 mb-2">Product Fleet</h3>
                      <h5 class="blue-grey--text darken-3">
                        Tagged :
                        {{ tagged_serial_numbers }}
                      </h5>
                      <h5 class="blue-grey--text darken-3 mb-9">
                        Untagged :
                        {{ un_tagged_serial_numbers }}
                      </h5>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" xs="12" class="mt-6">
          <v-card-actions dense class="elevation-0 ml-5">
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
                  class="FontSize field_label_size field_height pl-2 maxWidthSmall"
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
                  class="ml-2 FontSize field_label_size field_height maxWidthSmall"
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
          </v-card-actions>
        </v-col>
      </v-row>
      <v-row no-gutters class="px-8 mt-n4">
        <v-col cols="12" xs="12" sm="12" md="12">
          <v-card>
            <div id="chart" class="" v-if="mounted == true">
              <apexchartView
                type="bar"
                height="260"
                :options="chartOptions"
                :series="series"
              ></apexchartView>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import RechargeDialog from "@/components/Recharge/RechargeDialog.vue";
import RepProductFleet from "@/components/Dashboard/RepProductFleet.vue";
import { ListSerialNumber } from "@/mixins/ScheduleServices/ListSerialNumber.js";
import { GetAllDashboardData } from "@/mixins/Dashboard/GetAllDashboardData.js";
import { GetOrganizationReport } from "@/mixins/Dashboard/GetOrganizationReport.js";
var moment = require("moment");
export default {
  components: {
    Overlay,
    RechargeDialog,
    RepProductFleet,
  },
  mixins: [ListSerialNumber, GetAllDashboardData, GetOrganizationReport],
  data: () => ({
    moment: "",
    report_type: "DAILY",
    current_view: "Dashboard",
    tagged_serial_numbers: "",
    un_tagged_serial_numbers: "",
    menu: false,
    menu1: false,
    upHere: false,
    upHeree: false,
    overlay: false,
    mounted: false,
    loading: false,
    rechargecreditDialog: false,
    enddate: new Date().toISOString().substr(0, 10),
    date: Date.now(new Date().toISOString().substr(0, 10)),
    chartOptions: {
      chart: {
        type: "bar",
        height: 260,
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          verticle: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
      fill: {
        colors: ["#8e24aa"],
      },
    },
    series: [
      {
        name: "Ticket Raised",
        data: [],
      },
    ],
    finalFromDate: undefined,
  }),
  computed: {
    creditCardDisplayHandle() {
      if (
        this.$store.getters.get_current_user_details.user_type ===
          "DEALER_OWNER" ||
        this.$store.getters.get_current_user_details.user_type ===
          "DEALER_AGENT" ||
        this.$store.getters.get_current_user_details.user_type ===
          "SERVICE_PARTNER"
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    //FROM DATE
    // console.log("FROM_DATE", this.date);
    // const convFromDate = new Date(`${this.date}T00:00:00`);
    // this.finalFromDate = convFromDate.getTime();
    //TO DATE
    const convEndDate = new Date(`${this.enddate}T23:59:00`);
    const finalEndDate = convEndDate.getTime();
    var endDateMs = new Date(this.enddate).getTime();
    var oneMonthAgoMs = endDateMs - 2629743 * 1000;
    var dateAtMidnight = moment(oneMonthAgoMs).startOf("day");
    var epochAtMidnight = dateAtMidnight.valueOf();
    this.date = dateAtMidnight.format("YYYY-MM-DD");
    this.GetOrganizationReportMethod(
      epochAtMidnight,
      finalEndDate,
      this.report_type
    );
    this.GetAllDashboardDataMethod();
    setTimeout(() => {
      this.GraphDatas();
    }, 2000);

    if (
      this.$store.getters.get_current_user_details.user_type !==
        "DEALER_OWNER" &&
      this.$store.getters.get_current_user_details.user_type !== "DEALER_AGENT"
    ) {
      this.GetAllListSerialNumberMethod(
        "ACTIVE",
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  },
  watch: {
    enddate(val) {
      console.log("END_DTAE", val);
      const dateStr = val;
      const date = new Date(`${dateStr}T23:59:00`);
      const epochMillis = date.getTime();
      var adjustedEndDateMs = new Date(this.enddate).getTime() + 130859999;
      var targetDateMs = adjustedEndDateMs - 2716143 * 1000;
      var dateAtMidnight = moment(targetDateMs).startOf("day");
      var epochAtMidnight = dateAtMidnight.valueOf();
      this.date = dateAtMidnight.format("YYYY-MM-DD");
      this.GetOrganizationReportMethod(
        epochAtMidnight,
        epochMillis,
        this.report_type
      );
      setTimeout(() => {
        this.GraphDatas();
      }, 2000);
    },
  },
  methods: {
    repProductFleetsDialogEmit() {
      this.current_view = "Dashboard";
    },
    GraphDatas() {
      this.mounted = false;
      this.$nextTick(() => {
        this.chartOptions.xaxis.categories = this.GetOrganizationReport.map(
          (item) => {
            return item.report_date;
          }
        );
        this.series[0].data = this.GetOrganizationReport.map((item) => {
          if (
            this.$store.getters.get_user_type === "DEALER_OWNER" ||
            this.$store.getters.get_user_type === "DEALER_AGENT"
          ) {
            return item.active_ticket_Count;
          } else {
            return item.ticket_raised;
          }
        });
        this.mounted = true;
      });
    },
    CloseDialogDashboard() {
      this.rechargecreditDialog = false;
    },
  },
};
</script>
