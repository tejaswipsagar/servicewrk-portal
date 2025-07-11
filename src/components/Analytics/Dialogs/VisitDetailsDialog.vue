<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog persistent width="1000px" :value="dialogVisitDetails">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">Work Details</div>
        <v-spacer></v-spacer>
        <v-btn
          large
          class="mr-n4"
          dark
          text
          @click="dialogEmitVisitDetails((Toggle = 1))"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" md="6" sm="12" xs="12">
              <v-card class="elevation-0 pa-3">
                <GmapMap
                  :center="
                    swipedLocations[0] != undefined
                      ? swipedLocations[0].position
                      : defaultLat
                  "
                  :zoom="15"
                  map-type-id="terrain"
                  style="width: 95%; height: 350px"
                >
                <gmap-polyline
                    :path="path"
                    :stroke-color="'#008000'"
                    :stroke-weight="5"
                  />
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in swipedLocations"
                    :position="m.position"
                    @click="center = m.position"
                    :draggable="true"
                    :icon="
                      m.SwipeStatus == 'IN'
                        ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        : m.SwipeStatus == 'START'
                        ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        : m.SwipeStatus == 'JOURNEY_END'
                        ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        : m.SwipeStatus == 'JOURNEY_START'
                        ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                        : m.SwipeStatus == 'END'
                        ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                        : ''
                    "
                  />
                </GmapMap>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
              <div class="FontSize ma-2 font-weight-bold">
                Distance Travelled :
                {{ GetDistanceForIndividualTicketList }} KM's
              </div>
              <v-data-table
                dense
                :items="StoreObjNew.ticket_visits"
                :headers="headers"
              >
                <template v-slot:[`item.work_status`]="{ item }">
                  <div v-if="item.work_status == 'IN'" class="green--text">
                    IN
                  </div>
                  <div
                    v-else-if="item.work_status == 'JOURNEY_END'"
                    class="red--text"
                  >
                    JOURNEY END
                  </div>
                  <div
                    v-else-if="item.work_status == 'JOURNEY_START'"
                    class="yellow--text"
                  >
                    JOURNEY START
                  </div>
                  <div
                    v-else-if="item.work_status == 'START'"
                    class="blue--text"
                  >
                    WORK START
                  </div>
                  <div
                    v-else-if="item.work_status == 'END'"
                    class="orange--text"
                  >
                    WORK END
                  </div>
                  <div v-else>{{ item.work_status }}</div>
                </template>
                <template v-slot:[`item.work_start_time`]="{ item }">
                  <div v-if="item.work_start_time != undefined">
                    {{ item.work_start_time }}
                  </div>
                  <div v-else-if="item.journey_start_time != undefined">
                    {{ item.journey_start_time }}
                  </div>
                  <div v-else-if="item.work_end_time != undefined">
                    {{ item.work_end_time }}
                  </div>
                  <div v-else-if="item.journey_end_time != undefined">
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
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetDistanceForIndividualTicket } from "@/mixins/Users/GetDistanceForIndividualTicket.js";
export default {
  props: {
    markers: Array,
    StoreObj: Object,
    StoreObjNew: Object,
    dialogVisitDetails: Boolean,
  },
  mixins: [GetDistanceForIndividualTicket],
  components: {
    Snackbar,
  },
  data: () => ({
    path: [],
    swipe_location: [],
    swipedLocations: [],
    GetDistanceForIndividualTicketList: [],
    headers: [
      { text: "Work Status", value: "work_status" },
      { text: "Work Start Time", value: "work_start_time" },
    ],
    SnackBarComponent: {},
    defaultLat: {
      lat: 0,
      lng: 0,
    },
  }),
  watch: {
    dialogVisitDetails(val) {
      if (val == true) {
        this.GetDistanceForIndividualTicketMethod(this.StoreObjNew.ticket_id);
        this.swipedLocations = [];
        for (let i = 0; i < this.markers.length; i++) {
          this.swipedLocations.push({
            position: {
              lat: this.markers[i].swipe_location.lat,
              lng: this.markers[i].swipe_location.lng,
            },
            SwipeStatus: this.markers[i].work_status,
          });
          this.path.push(this.swipedLocations[i].position);
        }
      }
    },
  },
  methods: {
    dialogEmitVisitDetails(Toggle) {
      this.path = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
