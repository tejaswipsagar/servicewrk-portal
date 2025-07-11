<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="AddressFromGmapDialog" persistent :width="800">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Search Address From GMAP</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="AddressFromGmapDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pl-5">
          <div style="height: 350px; width: 100%; overflow: hidden">
            <GoogleMaps @clicked="GoogleMapsEmit" />
          </div>
          <v-form ref="form">
            <div class="d-flex justify-center mt-3 mb-3">
              <v-textarea
                v-model="addressName"
                label="Selected Address"
                dense
                outlined
                class="FontSize"
                :rules="[(v) => !!v || 'Required']"
              ></v-textarea>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <div class="ml-2">
            <v-btn
              small
              color="blue"
              class="white--text"
              @click="saveGmapDataMethod()"
              >Save<v-icon small class="pl-1">mdi-bookmark</v-icon></v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: { AddressFromGmapDialog: Boolean, GmapStoreObj: Object },
  components: {
    GoogleMaps,
    Snackbar,
  },

  data: () => ({
    center: { lat: 45.508, lng: -73.587 },
    markers: [],
    addressName: "",
    SnackBarComponent: {},
    renderComp: true,
  }),

  watch: {
    AddressFromGmapDialog(val) {
      if (val) {
        this.addressName = this.GmapStoreObj.first_text_field;
      }
    },
  },

  methods: {
    GoogleMapsEmit(place) {
      this.addressName = place.formatted_address;
    },

    saveGmapDataMethod() {
      if (this.$refs.form.validate()) {
        this.GmapStoreObj.address = this.addressName;
        this.AddressFromGmapDialogEmit(2, this.GmapStoreObj);
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly provide address!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    AddressFromGmapDialogEmit(Toggle, obj) {
      this.$emit("clicked", Toggle, obj);
      this.$refs.form.reset();
    },
  },
};
</script>
