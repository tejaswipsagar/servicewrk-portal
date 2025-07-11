<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="AddressDialog" persistent width="70%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-plus</v-icon> Add Delivery Address
          </div>
          <v-spacer />
          <v-btn icon @click="AddressDialogEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="black--text pb-0">
          <v-form ref="form">
            <v-row align="center" justify="center">
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <GoogleMaps @clicked="GoogleMapsEmit" />
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <div class="mb-5">
                    <span style="font-weight: 600">Shipping Address</span>
                  </div>
                </div>
                <v-row>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Person*"
                      v-model="shippingContactPerson"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Name*"
                      v-model="shippingContactName"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pb-0 pt-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Number*"
                      v-model="shippingContactNumber"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pb-0 pt-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Email ID"
                      v-model="shippingContactEmailId"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="12"
                    md="12"
                    sm="12"
                    xs="12"
                    class="pb-0 pt-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Shipping Address*"
                      v-model="shippingAddress"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="4"
                    md="4"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="City*"
                      v-model="shippingCity"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="4"
                    md="4"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="State*"
                      v-model="shippingState"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="4"
                    md="4"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Pincode*"
                      v-model="shippingPincode"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="GST Number"
                      v-model="shippingGST"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="PAN Number"
                      v-model="shippingPAN"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <div>
                  <div>
                    <span style="font-weight: 600">Billing Address</span>
                  </div>
                </div>
                <v-checkbox
                  dense
                  label="Same as Shipping Address"
                  v-model="same_as_shipping_address"
                ></v-checkbox>
                <v-row>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Person*"
                      v-model="billingContactPerson"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Name*"
                      v-model="billingContactName"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pb-0 pt-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Number*"
                      v-model="billingContactNumber"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pb-0 pt-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Contact Email ID"
                      v-model="billingContactEmailId"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="12"
                    md="12"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Billing Address*"
                      class="mt-2"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="billingAddress"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="4"
                    md="4"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="City*"
                      v-model="billingCity"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="4"
                    md="4"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="State*"
                      v-model="billingState"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="4"
                    md="4"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Pincode*"
                      v-model="billingPincode"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="GST Number"
                      v-model="billingGST"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="PAN Number"
                      v-model="billingPAN"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="mt-5">
          <v-spacer></v-spacer>
          <div class="red--text mr-8 mt-n7 mb-4">
            Click on save to add address details *
          </div>
          <v-btn
            small
            class="primary white--text mt-n7 mb-4 mr-4"
            @click="saveAddressMethod()"
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
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  mixins: [GetAllOrganizationSettingsTypesInMS],
  props: {
    AddressDialog: Boolean,
    AddressObj: Object,
  },
  components: {
    GoogleMaps,
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    customer_longitude: "",
    customer_latitude: "",
    billingContactPerson: "",
    billingContactName: "",
    billingContactNumber: "",
    billingContactEmailId: "",
    billingPAN: "",
    billingGST: "",
    billingPincode: "",
    billingState: "",
    billingCity: "",
    billingAddress: "",
    shippingContactPerson: "",
    shippingContactName: "",
    shippingContactNumber: "",
    shippingContactEmailId: "",
    shippingGST: "",
    shippingPAN: "",
    shippingPincode: "",
    shippingState: "",
    shippingCity: "",
    shippingAddress: "",
    customer_gst_number: "",
    customer_pan_number: "",
    same_as_shipping_address: false,
    AddDeliveryDetailsDialog: false,
    billingSwitch: undefined,
    shippingSwitch: undefined,
    SnackBarComponent: {},
    center: { lat: 45.508, lng: -73.587 },
    markers: [],
    search: "",
    storeobjModified: false,
  }),

  watch: {
    async AddressDialog(val) {
      if (val) {
        if (this.storeobjModified === false) {
          await this.GetAllOrganizationSettingsTypesMethod();
          this.shippingContactPerson = this.AddressObj.customer_company_name;
          this.shippingContactName = this.AddressObj.customer_name;
          this.shippingContactNumber = this.AddressObj.customer_phone_number;
          this.shippingContactEmailId =
            this.AddressObj.customer_email_id || undefined;
          this.billingContactPerson =
            this.$store.getters.get_current_user_details.organization_details.bank_details.account_holder;
          this.billingContactEmailId =
            this.$store.getters.get_current_user_details.organization_details.organization_email_id;
          this.billingContactNumber =
            this.$store.getters.get_current_user_details.organization_details.organization_contact_numbers;
          this.billingGST =
            this.$store.getters.get_current_user_details.organization_details.bank_details.tax_id;
          this.billingPAN =
            this.$store.getters.get_current_user_details.organization_details.bank_details.pan_no;
          if (this.AddressObj.object_type === "EXISTING_TICKET") {
            this.shippingAddress = this.AddressObj.ticket_address || "";
            this.shippingCity = this.AddressObj.ticket_city || "";
            this.shippingState = this.AddressObj.ticket_state || "";
            this.shippingPincode = this.AddressObj.ticket_pincode || "";
          } else if (this.AddressObj.object_type === "EXISTING_QUOTATION") {
            this.shippingAddress = this.AddressObj.customer_address || "";
            this.shippingCity = this.AddressObj.customer_city || "";
            this.shippingState = this.AddressObj.customer_state || "";
            this.shippingPincode = this.AddressObj.customer_pincode || "";
          }
        } else {
          this.billingAddress =
            this.AddressObj.billingAddressObj.billing_address;
          this.billingCity = this.AddressObj.billingAddressObj.billing_city;
          this.billingState = this.AddressObj.billingAddressObj.billing_state;
          this.billingPincode =
            this.AddressObj.billingAddressObj.billing_pincode;
          this.billingContactPerson =
            this.AddressObj.billingAddressObj.contact_person;
          this.billingContactName =
            this.AddressObj.billingAddressObj.contact_name;
          this.billingContactNumber =
            this.AddressObj.billingAddressObj.contact_number;
          this.billingContactEmailId = this.AddressObj.billingAddressObj.gst_no;
          this.billingGST = this.AddressObj.billingAddressObj.billing_address;
          this.billingPAN = this.AddressObj.billingAddressObj.pan_no;
          this.shippingAddress =
            this.AddressObj.shippingAddressObj.shipping_address;
          this.shippingCity = this.AddressObj.shippingAddressObj.shipping_city;
          this.shippingState =
            this.AddressObj.shippingAddressObj.shipping_state;
          this.shippingPincode =
            this.AddressObj.shippingAddressObj.shipping_pincode;
          this.shippingContactPerson =
            this.AddressObj.shippingAddressObj.contact_person;
          this.shippingContactName =
            this.AddressObj.shippingAddressObj.contact_name;
          this.shippingContactNumber =
            this.AddressObj.shippingAddressObj.contact_number;
          this.shippingContactEmailId =
            this.AddressObj.shippingAddressObj.contact_email_id;
          this.shippingGST = this.AddressObj.shippingAddressObj.gst_no;
          this.shippingPAN = this.AddressObj.shippingAddressObj.pan_no;
        }
      }
    },
    same_as_shipping_address(val) {
      if (val) {
        this.billingAddress = this.shippingAddress;
        this.billingCity = this.shippingCity;
        this.billingState = this.shippingState;
        this.billingPincode = this.shippingPincode;
        this.billingContactPerson = this.shippingContactPerson;
        this.billingContactName = this.shippingContactName;
        this.billingContactNumber = this.shippingContactNumber;
        this.billingContactEmailId = this.shippingContactEmailId;
        this.billingPAN = this.shippingPAN;
        this.billingGST = this.shippingGST;
      } else {
        this.billingAddress = "";
        this.billingCity = "";
        this.billingState = "";
        this.billingPincode = "";
        this.billingContactPerson = "";
        this.billingContactName = "";
        this.billingContactNumber = "";
        this.billingContactEmailId = "";
        this.billingPAN = "";
        this.billingGST = "";
      }
    },
  },

  methods: {
    GoogleMapsEmit(place) {
      console.log("GTE_PLACE", place);
      this.customer_latitude = place.geometry.location.lat();
      this.customer_longitude = place.geometry.location.lng();
      this.shippingAddress = place.formatted_address;
      this.getPincode(this.customer_latitude, this.customer_longitude);
      if (this.same_as_shipping_address == true) {
        this.billingAddress = place.formatted_address;
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
        this.shippingPincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.shippingCity = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.shippingState = stateComponent
          ? stateComponent.long_name
          : "State not found";
        if (this.same_as_shipping_address) {
          this.billingPincode = this.shippingPincode;
          this.billingCity = this.shippingCity;
          this.billingState = this.shippingState;
        }
      } else {
        this.shippingPincode = "Pincode not found";
        this.shippingCity = "City not found";
        this.shippingState = "State not found";
      }
    },

    saveAddressMethod() {
      if (this.$refs.form.validate()) {
        this.storeobjModified = true;
        const shippingAddressObj = {
          shipping_address: this.shippingAddress,
          shipping_city: this.shippingCity,
          shipping_state: this.shippingState,
          shipping_pincode: this.shippingPincode,
          contact_person: this.shippingContactPerson,
          contact_name: this.shippingContactName,
          contact_number: this.shippingContactNumber,
          contact_email_id: this.shippingContactEmailId,
          gst_no: this.shippingGST || "",
          pan_no: this.shippingPAN || "",
        };
        const billingAddressObj = {
          billing_address: this.billingAddress,
          billing_city: this.billingCity,
          billing_state: this.billingState,
          billing_pincode: this.billingPincode,
          contact_person: this.billingContactPerson,
          contact_name: this.billingContactName,
          contact_number: this.billingContactNumber,
          contact_email_id: this.billingContactEmailId,
          gst_no: this.billingGST || "",
          pan_no: this.billingPAN || "",
        };
        this.AddressObj = { ...shippingAddressObj, ...billingAddressObj };
        this.AddressDialogEmit(2, shippingAddressObj, billingAddressObj);
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please fill required fields",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    AddressDialogEmit(Toggle, shippingAddressObj, billingAddressObj) {
      this.$emit("clicked", Toggle, shippingAddressObj, billingAddressObj);
    },
  },
};
</script>

<style></style>
