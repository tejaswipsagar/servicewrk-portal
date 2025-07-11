<template>
  <v-dialog :value="viewWorkDialog" persistent max-width="850px">
    <v-toolbar dark dense class="elevation-0" color="primary">
      <v-icon small>mdi-eye</v-icon>
      <div class="ml-2 white--text">View Work Logs</div>
      <v-spacer></v-spacer>
      <v-btn icon @click="dialogCloseEmit((Toggle = 1))"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-toolbar>
    <v-card class="elevation-0 overflow-hidden">
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-card class="elevation-0 pa-3">
            <GmapMap
              :center="logsData[0] != undefined ? logsData[0].position : center"
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
                v-for="(m, index) in logsData"
                :position="m.position"
                @click="center = m.position"
                :clickable="true"
                :draggable="true"
                :icon="
                  m.SwipeStatus == 'JOURNEY_START'
                    ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    : m.SwipeStatus == 'JOURNEY_END'
                    ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    : m.SwipeStatus == 'START'
                    ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                    : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                "
              />
            </GmapMap>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-data-table
            dense
            :headers="headers"
            :items="StoreObj.user_work_logs"
          >
            <template v-slot:[`item.work_log_time`]="{ item }">
              <span class="FontSize">{{
                new Date(item.work_log_time * 1000).toLocaleString()
              }}</span>
            </template>
            <template v-slot:[`item.work_log_status`]="{ item }">
              <div
                class="FontSize yellow--text"
                v-if="item.work_log_status == 'START'"
              >
                WORK START
              </div>
              <div
                class="FontSize blue--text"
                v-else-if="item.work_log_status == 'END'"
              >
                WORK END
              </div>
              <div
                class="FontSize green--text"
                v-else-if="item.work_log_status == 'JOURNEY_START'"
              >
                JOURNEY START
              </div>
              <div
                class="FontSize red--text"
                v-else-if="item.work_log_status == 'JOURNEY_END'"
              >
                JOURNEY END
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    StoreObj: Object,
    viewWorkDialog: Boolean,
    work_location_array: Array,
  },
  data: () => ({
    center: {
      lat: 0,
      lng: 0,
    },
    headers: [
      { text: "Work Log Time", value: "work_log_time" },
      { text: "Work Log Status", value: "work_log_status" },
    ],
    // table_items: [],
    path: [],
    logsData: [],
  }),
  watch: {
    viewWorkDialog(val) {
      if (val == true) {
        this.logsData = [];
        if (
          this.StoreObj.user_work_logs != undefined &&
          this.StoreObj.user_work_logs.length != 0
        ) {
          for (let i = 0; i < this.StoreObj.user_work_logs.length; i++) {
            this.logsData.push({
              position: {
                lat: this.StoreObj.user_work_logs[i].work_log_latitude,
                lng: this.StoreObj.user_work_logs[i].work_log_longitude,
              },
              SwipeStatus: this.StoreObj.user_work_logs[i].work_log_status,
            });
            this.path.push(this.logsData[i].position);
          }
        }
      }
      // if (val == true) {
      //   for (let i = 0; i < this.work_location_array.length; i++) {
      //     this.center = {
      //       lat: this.work_location_array[i].position.lat,
      //       lng: this.work_location_array[i].position.lng,
      //     };
      //   }
      // }
    },
  },
  methods: {
    dialogCloseEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
