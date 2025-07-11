<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog persistent width="1000px" :value="dialogWorkDetails">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">Work Details</div>
        <v-spacer></v-spacer>
        <v-btn large class="mr-n4" dark text @click="dialogEmit((Toggle = 1))">
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
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in swipedLocations"
                    :position="m.position"
                    @click="center = m.position"
                  />
                </GmapMap>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
              <v-data-table
                dense
                :items="StoreObj.work_details"
                :headers="headers"
              >
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
export default {
  props: {
    markers: Array,
    StoreObj: Object,
    dialogWorkDetails: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    swipedLocations: [],
    swipe_location: [],
    headers: [
      { text: "Swipe Status", value: "swipe_status" },
      { text: "Swipe Time", value: "swipe_time" },
    ],
    SnackBarComponent: {},
    defaultLat: {
      lat: 0,
      lng: 0,
    },
  }),
  watch: {
    dialogWorkDetails(val) {
      if (val == true) {
        this.swipedLocations = [];
        for (let i = 0; i < this.markers.length; i++) {
          this.swipedLocations.push({
            position: {
              lat: this.markers[i].swipe_location.lat,
              lng: this.markers[i].swipe_location.lng,
            },
          });
        }
      }
    },
  },
  methods: {
    dialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
