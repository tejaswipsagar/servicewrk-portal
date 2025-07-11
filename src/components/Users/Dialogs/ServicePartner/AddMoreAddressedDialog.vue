<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="50%" :value="AddMoreAddressDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dark dense>
          <v-icon small class="mr-2"> mdi-map-marker-plus-outline </v-icon>
          <div>Add Address</div>
          <v-spacer />
          <v-btn
            small
            class="mr-n4"
            dark
            icon
            @click="AddMoreAddressesDialogEmit(1)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" xs="12" sm="12">
              <GoogleMaps
                style="width: 100%; height: 60%"
                @clicked="GoogleMapsEmit"
              />
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12">
              <v-form ref="form">
                <v-text-field
                  outlined
                  dense
                  label="Address Type"
                  class="FontSize mt-4"
                  v-model="address_name"
                  placeholder="Home / Office"
                >
                </v-text-field>
                <v-textarea
                  dense
                  outlined
                  rows="3"
                  auto-grow
                  v-model="area"
                  label="Address *"
                  class="FontSize"
                  :rules="[(v) => !!v || 'Required']"
                  placeholder="D.No., Street, Area, Landmark... "
                ></v-textarea>
                <v-row no-gutters>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Latitude *"
                      class="FontSize"
                      v-model="latitude"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Longitude *"
                      v-model="longitude"
                      class="FontSize ml-2"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  dense
                  outlined
                  label="City"
                  v-model="city"
                  class="FontSize"
                  placeholder="City"
                >
                </v-text-field>
                <v-text-field
                  dense
                  outlined
                  type="number"
                  label="Pincode"
                  class="FontSize"
                  v-model="pincode"
                  placeholder="000000"
                ></v-text-field>
              </v-form>
              <v-toolbar elevation="0">
                <v-spacer />
                <v-btn
                  class="primary white--text mt-n10 mr-n4"
                  small
                  @click.stop="saveAddress()"
                  >Add</v-btn
                >
              </v-toolbar>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
export default {
  props: {
    AddMoreAddressDialog: Boolean,
  },
  components: {
    Snackbar,
    GoogleMaps,
  },
  data: () => ({
    city: "",
    area: "",
    pincode: "",
    latitude: "",
    longitude: "",
    address_name: "",
    Toggle: 0,
    renderComp: true,
    SnackBarComponent: {},
  }),
  methods: {
    AddMoreAddressesDialogEmit(item, Toggle) {
      this.$refs.form.reset();
      this.$emit("clicked", item, Toggle);
    },
    GoogleMapsEmit(place) {
      this.area = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    },
    saveAddress() {
      if (this.$refs.form.validate()) {
        let item = {
          city: this.city,
          area: this.area,
          pincode: this.pincode,
          latitude: this.latitude,
          longitude: this.longitude,
          address_name: this.address_name,
        };
        this.AddMoreAddressesDialogEmit(item, 2);
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill Address..!",
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>

<style></style>
