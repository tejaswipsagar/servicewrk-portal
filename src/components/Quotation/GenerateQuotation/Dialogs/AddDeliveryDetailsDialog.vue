<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="AddDeliveryDetailsDialog" persistent width="70%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-plus</v-icon> Add Delivery Address
          </div>
          <v-spacer />
          <v-btn icon @click="AddDeliveryDetailsDialogEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="black--text pb-0">
          <v-row align="center" justify="center">
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <GoogleMaps @clicked="GoogleMapsEmit" />
              <!-- <GmapMap
                :center="center"
                :zoom="12"
                style="width: 100%; height: 500px"
              >
                <GmapMarker
                  :key="index"
                  v-for="(m, index) in markers"
                  :position="m.position"
                  @click="center = m.position"
                />
              </GmapMap> -->
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div>
                <div>
                  <span style="font-weight: 600">Billing Address</span>
                </div>
                <!-- <div>
                  <v-switch
                    v-model="billingSwitch"
                    label="Enable to search map for billing address"
                  ></v-switch>
                </div> -->
              </div>
              <!-- <v-toolbar outlined class="elevation-2 mb-3" dense>
                <GmapAutocomplete
                  :value="billingAddress"
                  placeholder="Search Location"
                  @place_changed="setPlace"
                  style="width: 100%"
                />
              </v-toolbar> -->
              <v-text-field
                dense
                outlined
                label="Area and Street *"
                class="mt-2"
                :rules="[(v) => !!v || 'Required']"
                v-model="billingAddress"
              ></v-text-field>
              <v-row>
                <v-col cols="12" lg="4" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="City *"
                    v-model="billingCity"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="State *"
                    v-model="billingState"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4">
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    label="Pincode *"
                    v-model="billingPincode"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div>
                  <span style="font-weight: 600" class="mb-2"
                    >Shipping Address</span
                  >
                </div>
                <!-- <div>
                  <v-switch
                    v-model="shippingSwitch"
                    label="Enable to search map for shipping address"
                  ></v-switch>
                </div> -->
              </div>
              <v-checkbox
                dense
                label="Same as Billing Address"
                v-model="same_as_billing_address"
              ></v-checkbox>
              <v-text-field
                dense
                outlined
                label="Customer Address (Area and Street)"
                v-model="shippingAddress"
              ></v-text-field>
              <v-row>
                <v-col cols="12" lg="4" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="City"
                    v-model="shippingCity"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="State"
                    v-model="shippingState"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4">
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    label="Pincode"
                    v-model="shippingPincode"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6" md="6">
                  <v-text-field
                    dense
                    outlined
                    label="Customer GST Number"
                    v-model="customer_gst_number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <v-text-field
                    dense
                    outlined
                    label="Customer PAN Number"
                    v-model="customer_pan_number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="red--text mr-8 mt-n7 mb-4">
            Click on save to add address details *
          </div>
          <v-btn
            small
            class="primary white--text mt-n7 mb-4 mr-4"
            @click="AddDeliveryDetailsDialogEmit(2)"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    AddDeliveryDetailsDialog: Boolean,
    DeliveryDialogStoreObj: Object,
  },
  components: {
    GoogleMaps,
    Snackbar,
  },
  data: () => ({
    customer_longitude: "",
    customer_latitude: "",
    billingPincode: "",
    billingState: "",
    billingCity: "",
    billingAddress: "",
    shippingPincode: "",
    shippingState: "",
    shippingCity: "",
    shippingAddress: "",
    customer_gst_number: "",
    customer_pan_number: "",
    same_as_billing_address: false,
    AddDeliveryDetailsDialog: false,
    billingSwitch: undefined,
    shippingSwitch: undefined,
    SnackBarComponent: {},
    center: { lat: 45.508, lng: -73.587 },
    markers: [],
    search: "",
  }),
  watch: {
    AddDeliveryDetailsDialog(val) {
      if (val) {
        console.log("NOW_CHECK", this.DeliveryDialogStoreObj);
        if (Object.keys(this.DeliveryDialogStoreObj).length !== 0) {
          this.customer_pan_number =
            this.DeliveryDialogStoreObj.customer_pan_number || "";
          this.customer_gst_number =
            this.DeliveryDialogStoreObj.customer_gst_number || "";

          if ("changed" in this.DeliveryDialogStoreObj) {
            if (this.DeliveryDialogStoreObj.changed === true) {
              if ("billing_address_details" in this.DeliveryDialogStoreObj) {
                this.billingAddress =
                  this.DeliveryDialogStoreObj.billing_address_details.billing_address;
                this.billingCity =
                  this.DeliveryDialogStoreObj.billing_address_details.billing_city;
                this.billingState =
                  this.DeliveryDialogStoreObj.billing_address_details.billing_state;
                this.billingPincode =
                  this.DeliveryDialogStoreObj.billing_address_details.billing_pincode;
              }
              if ("shipping_address_details" in this.DeliveryDialogStoreObj) {
                this.shippingAddress =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_address;
                this.shippingCity =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_city;
                this.shippingState =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_state;
                this.shippingPincode =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_pincode;
              }
            }
          } else {
            if (this.DeliveryDialogStoreObj.action === "GENERATE_QUOTATION") {
              if (
                this.DeliveryDialogStoreObj.quotation_for === "EXISTING_TICKET"
              ) {
                this.billingAddress =
                  this.DeliveryDialogStoreObj.ticket_address;
                this.billingCity = this.DeliveryDialogStoreObj.ticket_city;
                this.billingState = this.DeliveryDialogStoreObj.ticket_state;
                this.billingPincode =
                  this.DeliveryDialogStoreObj.ticket_pincode;
              } else {
                this.billingAddress =
                  this.DeliveryDialogStoreObj.customer_address;
                this.billingCity = this.DeliveryDialogStoreObj.city;
                this.billingState = this.DeliveryDialogStoreObj.state;
                this.billingPincode =
                  this.DeliveryDialogStoreObj.customer_pincode;
                if (
                  this.DeliveryDialogStoreObj.customer_type === "NEW_CUSTOMER"
                ) {
                  this.billingAddress =
                    this.DeliveryDialogStoreObj.customer_billing_address || "";
                  this.billingCity =
                    this.DeliveryDialogStoreObj.customer_billing_city || "";
                  this.billingState =
                    this.DeliveryDialogStoreObj.customer_billing_state || "";
                  this.billingPincode =
                    this.DeliveryDialogStoreObj.customer_billing_pincode || "";
                  this.shippingAddress =
                    this.DeliveryDialogStoreObj.customer_address || "";
                  this.shippingCity = this.DeliveryDialogStoreObj.city || "";
                  this.shippingState = this.DeliveryDialogStoreObj.state || "";
                  this.shippingPincode =
                    this.DeliveryDialogStoreObj.customer_pincode || "";
                }
              }
            } else {
              console.log(
                "CHECK_FOR",
                this.DeliveryDialogStoreObj.customer_city
              );
              if ("shipping_address_details" in this.DeliveryDialogStoreObj) {
                this.shippingAddress =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_address;
                this.shippingCity =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_city;
                this.shippingState =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_state;
                this.shippingPincode =
                  this.DeliveryDialogStoreObj.shipping_address_details.shipping_pincode;
              }

              // if ("customer_all_details" in this.DeliveryDialogStoreObj) {
              //   this.billingAddress =
              //     this.DeliveryDialogStoreObj.customer_all_details.customer_address;
              //   this.billingCity =
              //     this.DeliveryDialogStoreObj.customer_all_details.city;
              //   this.billingState =
              //     this.DeliveryDialogStoreObj.customer_all_details.state;
              //   this.billingPincode =
              //     this.DeliveryDialogStoreObj.customer_all_details.customer_pincode;
              // } else
              if ("customer_address" in this.DeliveryDialogStoreObj) {
                this.billingAddress =
                  this.DeliveryDialogStoreObj.customer_address;
                this.billingCity =
                  this.DeliveryDialogStoreObj.customer_city ||
                  this.DeliveryDialogStoreObj.city ||
                  this.DeliveryDialogStoreObj.customer_all_details.city;
                this.billingState =
                  this.DeliveryDialogStoreObj.customer_state ||
                  this.DeliveryDialogStoreObj.state ||
                  this.DeliveryDialogStoreObj.customer_all_details.state;
                this.billingPincode =
                  this.DeliveryDialogStoreObj.customer_pincode;
              } else if ("ticket_address" in this.DeliveryDialogStoreObj) {
                this.billingAddress =
                  this.DeliveryDialogStoreObj.ticket_address;
                this.billingCity = this.DeliveryDialogStoreObj.ticket_city;
                this.billingState = this.DeliveryDialogStoreObj.ticket_state;
                this.billingPincode =
                  this.DeliveryDialogStoreObj.ticket_pincode;
              }
            }
          }
        }
      }
    },

    // billingSwitch(val) {
    //   if (val) {
    //     this.shippingSwitch = false;
    //   }
    // },
    // shippingSwitch(val) {
    //   if (val) {
    //     this.billingSwitch = false;
    //   }
    // },
    same_as_billing_address(val) {
      if (val === false) {
        this.shippingPincode = "";
        this.shippingState = "";
        this.shippingCity = "";
        this.shippingAddress = "";
      } else {
        this.shippingPincode = this.billingPincode;
        this.shippingState = this.billingState;
        this.shippingCity = this.billingCity;
        this.shippingAddress = this.billingAddress;
      }
    },
  },
  methods: {
    async geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    async setPlace(place) {
      this.currentPlace = { ...place };
      this.center = {
        lat: this.currentPlace.geometry.location.lat(),
        lng: this.currentPlace.geometry.location.lng(),
      };
      this.billingAddress = place.formatted_address;
      // this.search = null;
      // this.$emit("clicked", this.currentPlace);
    },
    async GoogleMapsEmit(place) {
      console.log("GTE_PLACE", place);
      this.customer_latitude = place.geometry.location.lat();
      this.customer_longitude = place.geometry.location.lng();
      this.billingAddress = place.formatted_address;
      this.getPincode(this.customer_latitude, this.customer_longitude);
      if (this.same_as_billing_address == true) {
        this.shippingAddress = place.formatted_address;
      }
    },
    async getPincode(lat, lng) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAuHcsssNtWZhnt0op_n5nm9s8raGeNHGk`
      );
      const data = await response.json();
      if (data.results.length) {
        const addressComponents = data.results[0].address_components;
        const pincodeComponent = addressComponents.find((item) =>
          item.types.includes("postal_code")
        );
        const cityComponent = addressComponents.find((item) =>
          item.types.includes("locality")
        );
        const stateComponent = addressComponents.find((item) =>
          item.types.includes("administrative_area_level_1")
        );
        this.billingPincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.billingCity = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.billingState = stateComponent
          ? stateComponent.long_name
          : "State not found";
        if (this.same_as_billing_address) {
          this.shippingPincode = this.billingPincode;
          this.shippingCity = this.billingCity;
          this.shippingState = this.billingState;
        }
      } else {
        this.billingPincode = "Pincode not found";
        this.billingCity = "City not found";
        this.billingState = "State not found";
      }
    },

    AddDeliveryDetailsDialogEmit(Toggle) {
      if (Toggle === 2) {
        if (
          this.billingAddress !== "" &&
          this.billingCity !== "" &&
          this.billingState !== "" &&
          this.billingPincode !== ""
        ) {
          const billingDeliveryDetailsObj = {
            billing_address: this.billingAddress,
            billing_city: this.billingCity,
            billing_state: this.billingState,
            billing_pincode: this.billingPincode,
          };
          const shippingDeliveryDetailsObj = {
            shipping_address: this.shippingAddress,
            shipping_city: this.shippingCity,
            shipping_state: this.shippingState,
            shipping_pincode: this.shippingPincode,
          };

          const Customer_GST_Number = this.customer_gst_number;
          const Customer_PAN_Number = this.customer_pan_number;
          this.$emit(
            "clicked",
            Toggle,
            billingDeliveryDetailsObj,
            shippingDeliveryDetailsObj,
            Customer_GST_Number,
            Customer_PAN_Number,
            this.same_as_billing_address
          );
          this.billingAddress = "";
          this.billingCity = "";
          this.billingState = "";
          this.billingPincode = "";
          this.shippingAddress = "";
          this.shippingCity = "";
          this.shippingState = "";
          this.shippingPincode = "";
          this.same_as_billing_address = undefined;
          // this.StorageObj = {};
        } else {
          console.log("COMING_TO_ELSE");
          this.StorageObj = {};
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly fill all necessary fields!",
          };
        }
      } else {
        this.$emit("clicked", Toggle);
        this.billingAddress = "";
        this.billingCity = "";
        this.billingState = "";
        this.billingPincode = "";
        this.shippingAddress = "";
        this.shippingCity = "";
        this.shippingState = "";
        this.shippingPincode = "";
        this.same_as_billing_address = undefined;
      }
    },
  },
};
</script>

<style></style>
