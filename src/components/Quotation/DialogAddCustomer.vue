<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="dialogAddCustomerToGenerateQuotation"
      persistent
      width="90%"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div><v-icon small class="mr-2">mdi-plus</v-icon> Add Customer</div>
          <v-spacer />
          <v-btn icon @click="dialogAddCustomerOnQuotationEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="black--text pb-0">
          <v-row>
            <v-col cols="12" md="6" sm="12" xs="12">
              <GoogleMaps :StoreObj="StoreObj" @clicked="GoogleMapsEmit" />
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
              <v-form ref="customer_form">
                <v-row no-gutters class="mt-5">
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-select
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Customer Type *"
                      :items="customer_type_items"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="customer_type"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="4"
                    v-if="customer_type == 'BUSINESS'"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Customer Name"
                      class="FontSize mx-2"
                      v-model="customer_company_name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="4"
                    v-if="customer_type == 'BUSINESS'"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mx-2"
                      label="Company Website"
                      v-model="customer_website"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      :rules="[(v) => !!v || 'Required']"
                      label="Customer ID *"
                      class="FontSize mr-2"
                      v-model="customer_unique_id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      class="mx-2 FontSize"
                      label="Contact Person Name *"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="customer_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      label="Email ID *"
                      :rules="[(v) => !!v || 'Required']"
                      class="FontSize ml-2"
                      v-model="customer_email_id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      label="Latitude *"
                      class="FontSize mx-1"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="customer_latitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      label="Longitude *"
                      class="FontSize mx-1"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="customer_longitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      class="FontSize mx-2"
                      item-value="setting_id"
                      item-text="setting_name"
                      label="Customer Category"
                      :items="GetAllCustomerCategoryList"
                      v-model="customer_category_id"
                    ></v-autocomplete>
                  </v-col>
                  <v-row no-gutters class="mx-2">
                    <v-col cols="12" md="12">
                      <div class="mb-2 font-weight-bold">
                        Primary Contact Number :
                      </div>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="4">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="name"
                        class="FontSize"
                        :items="CountryList"
                        label="Country Code *"
                        item-value="dial_code"
                        :rules="[(v) => !!v || 'Required']"
                        v-model="customer_primary_country_code"
                      >
                        <template slot="selection" slot-scope="{ item }">
                          {{ item.dial_code }}
                        </template>
                        <template slot="item" slot-scope="{ item }">
                          {{ item.name }}({{ item.dial_code }})
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="8">
                      <v-text-field
                        dense
                        outlined
                        class="FontSize ml-2"
                        label="Contact Number *"
                        v-model="customer_primary_contact_number"
                        :rules="[
                          (v) => !!v || 'Required',
                          (v) =>
                            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(
                              v
                            ) || 'Invalid',
                        ]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mx-2">
                    <v-col cols="12" md="12">
                      <div class="mb-2 font-weight-bold">
                        Secondary Contact Number :
                      </div>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="4">
                      <v-autocomplete
                        dense
                        outlined
                        item-text="name"
                        class="FontSize"
                        :items="CountryList"
                        label="Country Code"
                        item-value="dial_code"
                        v-model="customer_secondary_country_code"
                      >
                        <template slot="selection" slot-scope="{ item }">
                          {{ item.dial_code }}
                        </template>
                        <template slot="item" slot-scope="{ item }">
                          {{ item.name }}({{ item.dial_code }})
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="8">
                      <v-text-field
                        dense
                        outlined
                        class="FontSize ml-2"
                        label="Contact Number"
                        v-model="customer_secondary_contact_number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-col cols="12" md="12" class="mx-2 mb-2">
                    <b>Shipping Address :</b>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mx-2"
                      label="Customer Address *"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="customer_address"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      label="City"
                      class="FontSize mx-2"
                      v-model="city"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      label="State"
                      class="FontSize mx-2"
                      v-model="state"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Pincode"
                      class="FontSize mx-2"
                      v-model="customer_pincode"
                    ></v-text-field>
                  </v-col>
                  <b class="ml-2 mb-2">Billing Address:</b>
                  <v-checkbox
                    dense
                    class="ml-2 mt-n1"
                    label="Same as Shipping Address"
                    v-model="same_as_billing_address"
                  ></v-checkbox>
                  <v-col cols="12" xs="12" sm="12" md="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mx-2"
                      label="Billing Address"
                      v-model="customer_billing_address"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      label="City"
                      class="FontSize mx-2"
                      v-model="customer_billing_city"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      label="State"
                      class="FontSize mx-2"
                      v-model="customer_billing_state"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Pincode"
                      class="FontSize mx-2"
                      v-model="customer_billing_pincode"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" xs="12" sm="12" md="12">
                    <v-autocomplete
                      dense
                      outlined
                      multiple
                      class="FontSize mx-2"
                      label="Tag Territories"
                      item-value="territory_id"
                      item-text="territory_name"
                      :items="GetAllTerritoriesList"
                      v-model="nonGeoBasedterritory"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip x-small v-if="index === 0">
                          <span>{{ item.territory_name }}</span>
                        </v-chip>
                        <span
                          v-if="index === 0 && nonGeoBasedterritory.length > 1"
                          class="grey--text text-caption"
                        >
                          (+{{ nonGeoBasedterritory.length - 1 }}
                          others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      v-model="customerGSTNumber"
                      label="Customer GST Number"
                    />
                  </v-col>
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      v-model="customerPanNumber"
                      label="Customer PAN Number"
                    />
                  </v-col>
                </v-row>
                <div>
                  <v-checkbox
                    label="Add Customer to Database"
                    v-model="customer_add_to_data_base"
                    class="ml-2 mt-n2"
                  ></v-checkbox>
                </div>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="disableBtn === true"
            small
            class="primary white--text mb-4 mr-4"
            @click="addCustomerMethod()"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import CountryList from "@/JsonFiles/CountryList.json";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";
import { GetAllCustomerBySearch } from "@/mixins/Terretories/GetCustomerListBySearch.js";
export default {
  props: {
    StoreObj: Object,
    dialogAddCustomerToGenerateQuotation: Boolean,
  },
  mixins: [GetAllTerritories, GetAllCustomerCategory, GetAllCustomerBySearch],
  components: {
    Snackbar,
    GoogleMaps,
    CountryList,
  },
  data: () => ({
    Toggle: 0,
    customer_company_name: "",
    customer_unique_id: "",
    customer_website: "",
    customer_name: "",
    customer_pincode: "",
    customer_email_id: "",
    customer_address: "",
    city: "",
    state: "",
    customer_add_to_data_base: false,
    nonGeoBasedterritory: "",
    customer_billing_address: "",
    customer_billing_city: "",
    customer_billing_state: "",
    customer_billing_pincode: "",
    renderComp: true,
    same_as_billing_address: true,
    customer_secondary_country_code: "+91",
    customer_secondary_contact_number: "",
    customer_primary_country_code: "+91",
    customer_primary_contact_number: "",
    customer_category_id: "",
    customer_longitude: "",
    customer_latitude: "",
    customer_type: "BUSINESS",
    CountryList: [],
    customer_obj: {},
    SnackBarComponent: {},
    GetAllTerritoriesList: [],
    GetAllSearchCustomerList: [],
    GetAllCustomerCategoryList: [],
    customer_type_items: ["INDIVIDUAL", "BUSINESS"],
    disableBtn: false,
    customerGSTNumber: "",
    customerPanNumber: "",
  }),
  watch: {
    dialogAddCustomerToGenerateQuotation(val) {
      if (val == true) {
        this.CountryList = CountryList;
        this.GetAllCustomerCategoryMethod("ACTIVE");
        this.GetAllTerritoriesMethod(
          "ACTIVE",
          "NON_GEO_BASED",
          undefined,
          "TERRITORY",
          undefined
        );
      }
    },
    same_as_billing_address(val) {
      if (val == false) {
        this.customer_billing_address = "";
        this.customer_billing_city = "";
        this.customer_billing_state = "";
        this.customer_billing_pincode = "";
      } else {
        this.customer_billing_address = this.customer_address;
        this.customer_billing_city = this.city;
        this.customer_billing_state = this.state;
        this.customer_billing_pincode = this.customer_pincode;
      }
    },
    async customer_primary_contact_number(val) {
      this.disableBtn = false;
      if (val.length === 10) {
        const response = await this.GetAllCustomerBySearchMethod(
          "ACTIVE",
          val,
          "customer_primary_phone_number",
          this.customer_type
        );
        setTimeout(() => {
          if (this.GetAllSearchCustomerList.length != 0) {
            this.disableBtn = true;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText:
                "Entered phone number already exist, provide different number!",
            };
          }
        }, 1000);
      }
    },
  },
  methods: {
    addCustomerMethod() {
      if (this.$refs.customer_form.validate()) {
        this.customer_obj = {
          customer_type: this.customer_type,
          customer_unique_id: this.customer_unique_id,
          customer_name: this.customer_name,
          customer_email_id: this.customer_email_id,
          customer_latitude: this.customer_latitude,
          customer_longitude: this.customer_longitude,
          customer_primary_country_code: this.customer_primary_country_code,
          customer_primary_contact_number: this.customer_primary_contact_number,
          customer_address: this.customer_address,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          pan_number: this.customerPanNumber || "",
          gst_number: this.customerGSTNumber || "",
        };
        if (
          this.customer_company_name != undefined &&
          this.customer_company_name != null &&
          this.customer_company_name != ""
        ) {
          this.customer_obj.customer_company_name = this.customer_company_name;
        }
        if (
          this.customer_website != undefined &&
          this.customer_website != null &&
          this.customer_website != ""
        ) {
          this.customer_obj.customer_website = this.customer_website;
        }
        if (
          this.customer_category_id != undefined &&
          this.customer_category_id != null &&
          this.customer_category_id != ""
        ) {
          this.customer_obj.customer_category_id = this.customer_category_id;
        }
        if (
          this.customer_secondary_country_code != undefined &&
          this.customer_secondary_country_code != null &&
          this.customer_secondary_country_code != ""
        ) {
          this.customer_obj.customer_secondary_country_code =
            this.customer_secondary_country_code;
        }
        if (this.city != undefined && this.city != null && this.city != "") {
          this.customer_obj.city = this.city;
        }
        if (this.state != undefined && this.state != null && this.state != "") {
          this.customer_obj.state = this.state;
        }
        if (
          this.customer_pincode != undefined &&
          this.customer_pincode != null &&
          this.customer_pincode != ""
        ) {
          this.customer_obj.customer_pincode = this.customer_pincode;
        }
        if (
          this.customer_billing_address != undefined &&
          this.customer_billing_address != null &&
          this.customer_billing_address != ""
        ) {
          this.customer_obj.customer_billing_address =
            this.customer_billing_address;
        }
        if (
          this.customer_billing_city != undefined &&
          this.customer_billing_city != null &&
          this.customer_billing_city != ""
        ) {
          this.customer_obj.customer_billing_city = this.customer_billing_city;
        }
        if (
          this.customer_billing_state != undefined &&
          this.customer_billing_state != null &&
          this.customer_billing_state != ""
        ) {
          this.customer_obj.customer_billing_state =
            this.customer_billing_state;
        }
        if (
          this.customer_billing_pincode != undefined &&
          this.customer_billing_pincode != null &&
          this.customer_billing_pincode != ""
        ) {
          this.customer_obj.customer_billing_pincode =
            this.customer_billing_pincode;
        }
        if (
          this.nonGeoBasedterritory != undefined &&
          this.nonGeoBasedterritory != null &&
          this.nonGeoBasedterritory != [] &&
          this.nonGeoBasedterritory != ""
        ) {
          this.customer_obj.territory_ids = this.nonGeoBasedterritory;
        }
        setTimeout(() => {
          console.log(this.customer_obj, "customer_obj");
        }, 1000);
        this.dialogAddCustomerOnQuotationEmit(
          (this.Toggle = 2),
          this.customer_obj,
          this.customer_add_to_data_base
        );
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill Valid Mandatory Fields ..!",
          };
          this.renderComp = true;
        });
      }
    },
    dialogAddCustomerOnQuotationEmit(
      Toggle,
      customer_obj,
      customer_add_to_data_base
    ) {
      console.log("ADD_CUSTOMER_OBJ", customer_obj);
      this.$emit("clicked", Toggle, customer_obj, customer_add_to_data_base);
    },
    GoogleMapsEmit(place) {
      this.customer_latitude = place.geometry.location.lat();
      this.customer_longitude = place.geometry.location.lng();
      this.customer_address = place.formatted_address;
      this.getPincode(this.customer_latitude, this.customer_longitude);
      if (this.same_as_billing_address == true) {
        this.customer_billing_address = place.formatted_address;
      } else {
        this.customer_billing_address = "";
      }
    },
    async getPincode(lat, lng) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAuHcsssNtWZhnt0op_n5nm9s8raGeNHGk`
      );
      const data = await response.json();
      if (JSON.parse(data.results.length)) {
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
        this.customer_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.city = cityComponent ? cityComponent.long_name : "City not found";
        this.state = stateComponent
          ? stateComponent.long_name
          : "State not found";
        this.same_as_billing_address == true
          ? (this.customer_billing_city = cityComponent
              ? cityComponent.long_name
              : "City Not Found")
          : "";
        this.same_as_billing_address == true
          ? (this.customer_billing_state = stateComponent
              ? stateComponent.long_name
              : "State Not Found")
          : "";
        this.same_as_billing_address == true
          ? (this.customer_billing_pincode = pincodeComponent
              ? pincodeComponent.long_name
              : "Pincode Not Found")
          : "";
      }
      return {
        pincode: "Pincode not found",
        city: "City not found",
        state: "State not found",
      };
    },
  },
};
</script>

<style></style>
