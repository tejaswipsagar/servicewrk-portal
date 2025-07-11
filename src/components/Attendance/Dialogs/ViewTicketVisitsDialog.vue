<template>
  <div>
    <v-dialog :value="ticketVisitsDialog" max-width="80%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <v-icon small>mdi-map-marker</v-icon>
          <div class="ml-2 white--text">Ticket Swipe Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ticketVisitsDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row no-gutters>
            <v-col cols="12" xs="12" sm="12" md="6">
              <v-card class="elevation-0 pa-3">
                <gmap-map
                  :center="
                    attendanceData[0] != undefined
                      ? attendanceData[0].position
                      : center
                  "
                  :zoom="20"
                  style="width: 100%; height: 400px"
                >
                  <gmap-polyline
                    :path="path"
                    :stroke-color="'#008000'"
                    :stroke-weight="5"
                  />
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in attendanceData"
                    :position="m.position"
                    :icon="
                      m.SwipeStatus == 'JOURNEY_START'
                        ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        : m.SwipeStatus == 'JOURNEY_END'
                        ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        : m.SwipeStatus == 'START'
                        ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                        : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    "
                    :clickable="true"
                    :draggable="true"
                    :click="(center = m.position)"
                  />
                </gmap-map>
              </v-card>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6">
              <div class="FontSize ma-2 font-weight-bold">
                Distance Travelled :
                {{ GetDistanceForIndividualTicketList }} KM's
              </div>
              <v-data-table
                class="mt-3"
                dense
                :headers="headers"
                :items="StoreObjTicketVisits.ticket_visits"
                :items-per-page="5"
              >
                <template v-slot:[`item.work_status`]="{ item }">
                  <div v-if="item.work_status == 'START'" class="yellow--text">
                    WORK START
                  </div>
                  <div v-else-if="item.work_status == 'END'" class="blue--text">
                    WORK END
                  </div>
                  <div
                    v-else-if="item.work_status == 'JOURNEY_START'"
                    class="green--text"
                  >
                    JOURNEY START
                  </div>
                  <div
                    v-else-if="item.work_status == 'JOURNEY_END'"
                    class="red--text"
                  >
                    JOURNEY END
                  </div>
                </template>
                <template v-slot:[`item.swipe_location`]="{ item }">
                  <div v-if="item.work_status == 'START'">
                    {{ item.work_start_time }}
                  </div>
                  <div v-else-if="item.work_status == 'END'">
                    {{ item.work_end_time }}
                  </div>
                  <div v-else-if="item.work_status == 'JOURNEY_START'">
                    {{ item.journey_start_time }}
                  </div>
                  <div v-else-if="item.work_status == 'JOURNEY_END'">
                    {{ item.journey_end_time }}
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { GetDistanceForIndividualTicket } from "@/mixins/Users/GetDistanceForIndividualTicket.js";

export default {
  props: {
    markers: Array,
    StoreObj: Object,
    ticketVisitsDialog: Boolean,
    StoreObjTicketVisits: Object,
  },
  mixins: [GetDistanceForIndividualTicket],
  components: {},
  data: () => ({
    updatedDate: "",
    updated_attendence_date: 0,
    GetDistanceForIndividualTicketList: 0,
    path: [],
    swipe_location: [],
    attendanceData: [],
    headers: [
      { text: "Swipe Status", value: "work_status" },
      { text: "Swipe Time", value: "swipe_location" },
    ],
    center: { lat: 0, lng: 0 },
  }),
  watch: {
    ticketVisitsDialog(val) {
      if (val == true) {
        this.attendanceData = [];
        if (
          this.StoreObjTicketVisits.ticket_visits != undefined &&
          this.StoreObjTicketVisits.ticket_visits.length != 0
        ) {
          for (
            let i = 0;
            i < this.StoreObjTicketVisits.ticket_visits.length;
            i++
          ) {
            this.attendanceData.push({
              position: {
                lat: this.StoreObjTicketVisits.ticket_visits[i].swipe_location
                  .lat,
                lng: this.StoreObjTicketVisits.ticket_visits[i].swipe_location
                  .lng,
              },
              SwipeStatus:
                this.StoreObjTicketVisits.ticket_visits[i].work_status,
            });
            this.path.push(this.attendanceData[i].position);
          }
        }
        this.GetDistanceForIndividualTicketMethod(
          this.StoreObjTicketVisits.ticket_id,
          this.updatedDate
        );
        this.$forceUpdate();
      }
    },
  },
  methods: {
    ticketVisitsDialogEmit(Toggle) {
      this.path = [];
      this.$emit("clicked", Toggle);
    },
    swipeIcons() {},
  },
  mounted() {
    let old_date = this.StoreObj.attendance_date;
    let parts = old_date.split("-");
    let y = parts[2];
    let m = parts[1];
    let mm = m.length == 1 ? "0" + m : m;
    let d = parts[0];
    let dd = d.length == 1 ? '0' + d : d;
    this.updatedDate = dd + "-" + mm + "-" + y;
  },
};
</script>
