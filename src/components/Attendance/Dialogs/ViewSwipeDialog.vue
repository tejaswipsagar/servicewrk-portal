<template>
  <div>
    <v-dialog :value="swipeDialog" max-width="900px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <v-icon small>{{
            StoreObj.action == "VIEW" ? " mdi-map-marker" : " mdi-map-marker"
          }}</v-icon>
          <div
            class="ml-2 white--text"
            v-text="StoreObj.action == 'VIEW' ? 'View Swipe Details' : ''"
          ></div>
          <v-spacer></v-spacer>
          <v-btn icon @click="DialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row no-gutters>
            <v-col cols="12" xs="12" sm="12" md="6">
              <v-card class="elevation-0 pa-3">
                <GmapMap
                  :center="
                    attendanceData[0] != undefined
                      ? attendanceData[0].position
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
                    v-for="(m, index) in attendanceData"
                    :position="m.position"
                    @click="center = m.position"
                    :icon="
                      m.SwipeStatus == 'JOURNEY_START'
                        ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        : m.SwipeStatus == 'JOURNEY_END'
                        ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        : m.SwipeStatus == 'START'
                        ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                        : m.SwipeStatus == 'IN'
                        ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        : m.SwipeStatus == 'END'
                        ? 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
                        : 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                    "
                    :clickable="true"
                    :draggable="true"
                  />
                </GmapMap>
              </v-card>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6">
              <div class="FontSize black--text mt-3 mb-n3 ml-3">
                Total Distance Travelled in KM's :
                <span
                  v-if="currentAttendanceData[0]?.total_distance_travelled"
                  >{{
                    currentAttendanceData[0]?.total_distance_travelled
                  }}</span
                >
                <span v-else>N/A</span>
              </div>
              <v-data-table
                class="mt-3"
                dense
                :headers="headers"
                :items="markers"
                :items-per-page="10"
              >
                <template v-slot:[`item.swipe_status`]="{ item }">
                  <div v-if="item.swipe_status == 'START'" class="yellow--text">
                    WORK START
                  </div>
                  <div
                    v-else-if="item.swipe_status == 'END'"
                    class="pink--text"
                  >
                    WORK END
                  </div>
                  <div
                    v-else-if="item.swipe_status == 'JOURNEY_START'"
                    class="green--text"
                  >
                    JOURNEY START
                  </div>
                  <div
                    v-else-if="item.swipe_status == 'JOURNEY_END'"
                    class="red--text"
                  >
                    JOURNEY END
                  </div>
                  <div v-else-if="item.swipe_status == 'IN'" class="blue--text">
                    IN
                  </div>
                  <div v-else class="orange--text">
                    {{ item.swipe_status }}
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
import { API, graphqlOperation } from "aws-amplify";
import { GetParticularAttendanceDetails } from "@/graphql/queries.js";
export default {
  props: {
    StoreObj: Object,
    swipeDialog: Boolean,
  },
  components: {},
  data: () => ({
    defaultLat: {
      lat: 0,
      lng: 0,
    },
    path: [],
    swipe_location: [],
    attendanceData: [],
    headers: [
      { text: "Swipe Status", value: "swipe_status" },
      { text: "Swipe Time", value: "swipe_time" },
    ],
    markers: [],
    currentAttendanceData: [],
  }),
  watch: {
    async swipeDialog(val) {
      if (val == true) {
        this.attendanceData = [];
        await this.callApiMethod();

        for (let i = 0; i < this.markers.length; i++) {
          this.attendanceData.push({
            position: {
              lat: this.markers[i].swipe_location.lat,
              lng: this.markers[i].swipe_location.lng,
            },
            SwipeStatus: this.markers[i].swipe_status,
          });
          this.path.push(this.attendanceData[i].position);
        }
        this.$forceUpdate();
      }
    },
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
        this.markers = response[0].work_details;
        console.log("RESPONSE_NOW", response);
      } catch (error) {
        //
      }
    },
    DialogEmit(Toggle) {
      this.path = [];
      this.attendanceData = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
