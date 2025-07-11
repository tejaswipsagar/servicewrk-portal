<template>
  <v-card class="elevation-0">
    <v-card-text>
      <v-toolbar
        outlined
        class="elevation-2 mb-3"
        dense
        v-if="
          StoreObj.action == 'CREATE' ||
          StoreObj.action == 'UPDATE_INVALID_CUSTOMER' ||
          StoreObj.action == 'CREATEREP' ||
          StoreObj.action == 'EDIT' ||
          StoreObj.action == 'MOREACTION' ||
          (StoreObj.action == 'ADDLOCATION' &&
            $store.getters.get_user_type != 'AGENT' &&
            $store.getters.get_user_type != 'MANAGER')
        "
      >
        <GmapAutocomplete
          :value="search"
          placeholder="Search Location"
          @place_changed="setPlace"
          style="width: 100%"
        />
      </v-toolbar>
      <GmapMap :center="center" :zoom="12" style="width: 100%; height: 240px">
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          @click="center = m.position"
        />
      </GmapMap>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    StoreObj: Object,
    dialogCreateServiceCenter: Boolean,
    GetAllPrimaryCustomersLocationList: Array,
  },
  data: () => ({
    center: { lat: 45.508, lng: -73.587 },
    markers: [],
    search: "",
  }),
  watch: {
    GetAllPrimaryCustomersLocationList(val) {
      for (let i = 0; i < val.length; i++) {
        this.markers.push({
          position: {
            lat: val[i].customer_latitude,
            lng: val[i].customer_longitude,
          },
        });
      }
    },
  },
  mounted() {
    this.geolocate();
  },
  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    setPlace(place) {
      this.currentPlace = { ...place };
      this.center = {
        lat: this.currentPlace.geometry.location.lat(),
        lng: this.currentPlace.geometry.location.lng(),
      };
      this.search = null;
      this.$emit("clicked", this.currentPlace);
    },
  },
};
</script>
