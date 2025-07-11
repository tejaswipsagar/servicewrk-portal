<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <!-- <v-dialog v-model="CreateVendorDialog" persistent :width="1200"> -->
    <v-card class="elevation-0">
      <v-toolbar dark dense class="elevation-0 mb-5" color="white" tile>
        <div class="black--text font-weight-bold ml-4">
          {{ StoreObj.action === "edit" ? "Update" : "Create" }} Vendor Details
        </div>
        <v-spacer></v-spacer>
        <v-btn
          small
          @click="CreateEditVendorDialogEmit((Toggle = 1))"
          color="primary"
          ><v-icon color="white">mdi-arrow-left</v-icon>Back</v-btn
        >
      </v-toolbar>
      <v-card-text class="px-5 mt-4">
        <v-row class="pa-0">
          <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="mt-n10">
            <GoogleMaps style="width: 100%" @clicked="GoogleMapsEmit" />
          </v-col>
          <v-col cols="12" lg="6" md="6" sm="12" xs="12">
            <v-form ref="form">
              <v-row class="pa-0 mt-n13">
                <v-col cols="12" lg="4" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorEmpId"
                    dense
                    outlined
                    label="Vendor ID*"
                    class=""
                    :rules="[(v) => !!v || 'Required']"
                  />
                </v-col>
                <v-col cols="12" lg="4" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorName"
                    dense
                    outlined
                    label="Vendor Contact Person Name"
                    :rules="[(v) => !!v || 'Required']"
                  />
                </v-col>
                <v-col cols="12" lg="4" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorWebsite"
                    dense
                    outlined
                    label="Vendor Website"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorCompanyName"
                    dense
                    outlined
                    label="Vendor Company Name*"
                    :rules="[(v) => !!v || 'Required']"
                  />
                </v-col>

                <v-col cols="12" lg="" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorEmailId"
                    dense
                    outlined
                    label="Email ID*"
                    :rules="emailRules"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorQualifications"
                    dense
                    outlined
                    label="Qualifications"
                  />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorExp"
                    dense
                    outlined
                    label="Experience"
                  />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                  <v-select
                    v-model="vendorCategory"
                    dense
                    multiple
                    outlined
                    label="Vendor Category"
                    item-value="setting_id"
                    item-text="setting_name"
                    :items="GetAllCustomerCategoryList"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip x-small v-if="index === 0">
                        <span>{{ item.setting_name }}</span>
                      </v-chip>
                      <span
                        v-if="index === 0 && vendorCategory.length > 1"
                        class="grey--text text-caption"
                      >
                        (+{{ vendorCategory.length - 1 }}
                        others)
                      </span>
                    </template></v-select
                  >
                </v-col>
              </v-row>
              <v-row no-gutters class="mt-n4">
                <v-col cols="12" md="12">
                  <div class="font-weight-bold">Primary Contact Number :</div>
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
                    v-model="vendorPrimaryCountryCode"
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
                    v-model="vendorPrimaryContNum"
                    maxlength="10"
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
              <v-row no-gutters class="mt-n2">
                <v-col cols="12" md="12">
                  <div class="font-weight-bold">Secondary Contact Number :</div>
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
                    v-model="secondaryCountryCode"
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
                    v-model="secondaryContactNumber"
                    maxlength="10"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- <v-row class="mt-n4">
                <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorAddress"
                    dense
                    outlined
                    label="Address"
                    :rules="[(v) => !!v || 'Required']"
                  />
                </v-col> 
              </v-row> -->

              <v-row style="line-height: 0px">
                <v-col cols="12" md="12">
                  <div class="font-weight-bold">Shipping Address:</div>
                </v-col>
                <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                  <v-text-field
                    dense
                    outlined
                    v-model="shippingAddress"
                    label="Shipping Address*"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-text-field>
                  <v-row>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        label=" City"
                        v-model="shippingCity"
                      ></v-text-field
                    ></v-col>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        label="State"
                        v-model="shippingState"
                      ></v-text-field
                    ></v-col>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-text-field
                        type="number"
                        dense
                        outlined
                        label="Pincode"
                        v-model="shippingPincode"
                      ></v-text-field
                    ></v-col>
                  </v-row>
                  <v-row class="mt-n6 mb-3">
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <!-- <v-text-field
                      v-model="vendorLatitude"
                      dense
                      outlined
                      label="Lat"
                      :rules="[(v) => !!v || 'Required']"
                    /> -->
                      <div>
                        Lat :
                        <span class="font-weight-bold ml-3">{{
                          vendorLatitude
                        }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <!-- <v-text-field
                      v-model="vendorLongitude"
                      dense
                      outlined
                      label="Longitude"
                      :rules="[(v) => !!v || 'Required']"
                    /> -->
                      <div>
                        Lng :
                        <span
                          v-if="vendorLongitude"
                          class="font-weight-bold ml-3"
                          >{{ vendorLongitude.toFixed(5) }}</span
                        >
                      </div>
                    </v-col>
                    <!-- <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorPincode"
                    dense
                    outlined
                    label="Pincode"
                    :rules="[(v) => !!v || 'Required']"
                  />
                </v-col> -->
                  </v-row>
                </v-col>
              </v-row>
              <div class="font-weight-bold d-flex mt-3">
                Billing Address:
                <v-checkbox
                  v-model="sameAsShipping"
                  label="Same as shipping address"
                  class="mt-n1 ml-3"
                ></v-checkbox>
              </div>
              <v-row style="line-height: 0px">
                <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                  <v-text-field
                    dense
                    outlined
                    v-model="billingAddress"
                    label="Vendor Billing Address"
                  ></v-text-field>
                  <v-row>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        label="City"
                        v-model="billingCity"
                      ></v-text-field
                    ></v-col>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        label="State"
                        v-model="billingState"
                      ></v-text-field
                    ></v-col>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-text-field
                        type="number"
                        dense
                        outlined
                        label="Pincode"
                        v-model="billingPincode"
                      ></v-text-field
                    ></v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row class="mt-5">
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorGstNum"
                    dense
                    outlined
                    label="GST Number"
                  />
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-text-field
                    v-model="vendorPanNum"
                    dense
                    outlined
                    label="PAN Number"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col cols="12" lg="12">
                  <v-select
                    multiple
                    v-model="vendorTerritories"
                    dense
                    outlined
                    label="Territories"
                    :items="
                      searchTerritories === ''
                        ? allTerritoriesNameList
                        : searchedTerritoryList
                    "
                    item-text="territory_name"
                    item-value="territory_id"
                  >
                    <template v-slot:prepend-item>
                      <v-text-field
                        class="pl-2 pr-2 pt-2"
                        v-model="searchTerritories"
                        dense
                        outlined
                        label="Search Territories"
                      >
                        <template v-slot:append>
                          <v-btn
                            v-if="searchTerritories !== ''"
                            icon
                            @click="searchTerritories = ''"
                            ><v-icon small color="primary"
                              >mdi-close</v-icon
                            ></v-btn
                          >
                        </template></v-text-field
                      >
                    </template>
                    <template v-slot:selection="{ item, index }">
                      <v-chip x-small v-if="index === 0">
                        <span>{{ item.territory_name }}</span>
                      </v-chip>
                      <span
                        v-if="index === 0 && vendorTerritories.length > 1"
                        class="grey--text text-caption"
                      >
                        (+{{ vendorTerritories.length - 1 }}
                        others)
                      </span>
                    </template></v-select
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-n12">
        <v-spacer />
        <v-btn
          :loading="btnLoading"
          dense
          small
          color="primary"
          class="mr-3 mt-2"
          @click="CreateEditVendorMethod()"
          >{{ StoreObj.action === "CREATE" ? "Create" : "Update" }}</v-btn
        >
      </v-card-actions>
    </v-card>
    <!-- </v-dialog> -->
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { CreateVendor } from "@/graphql/mutations.js";
import { UpdateVendorDetails } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import CountryList from "@/JsonFiles/CountryList.json";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import { ListTerritoriesAndPincodes } from "@/graphql/queries.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";

export default {
  mixins: [GetAllCustomerCategory],
  props: { StoreObj: Object },
  components: {
    Snackbar,
    GoogleMaps,
    CountryList,
  },
  data: () => ({
    renderComp: true,
    btnLoading: false,
    CountryList: [],
    SnackBarComponent: {},
    vendorEmpId: "",
    vendorPrimaryCountryCode: "",
    vendorName: "",
    vendorQualifications: "",
    vendorExp: "",
    vendorPanNum: "",
    vendorPincode: "",
    vendorAddress: "",
    vendorGstNum: "",
    vendorLongitude: "",
    vendorLatitude: "",
    vendorPrimaryContNum: "",
    vendorTerritories: "",
    allTerritoriesNameList: [],
    searchedTerritoryList: [],
    vendorEmailId: "",
    emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
    customer_primary_contact_number: "",
    customer_primary_country_code: "+91",
    secondaryCountryCode: "+91",
    secondaryContactNumber: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    sameAsShipping: null,
    vendorWebsite: "",
    vendorCompanyName: "",
    vendorCategory: "",
    searchTerritories: "",
  }),
  watch: {
    // async shippingPincode(PINCODE) {
    //   if (PINCODE) {
    //     console.log("PINCODE_FORM", typeof PINCODE);
    //     await this.FetchTerritoriesBasedOnPincodes(PINCODE);
    //   }
    //   if (PINCODE.length === 0) {
    //     this.allTerritoriesNameList = [];
    //     this.vendorTerritories = "";
    //   }
    // },

    // async billingPincode(PINCODE) {
    //   if (this.shippingPincode === "") {
    //     await this.FetchTerritoriesBasedOnPincodes(PINCODE);
    //   }
    //   if (PINCODE.length === 0) {
    //     this.allTerritoriesNameList = [];
    //     this.vendorTerritories = "";
    //   }
    // },

    sameAsShipping(val) {
      if (val === true) {
        this.billingAddress = this.shippingAddress;
        this.billingCity = this.shippingCity;
        this.billingState = this.shippingState;
        this.billingPincode = this.shippingPincode;
      } else {
        this.billingAddress = "";
        this.billingCity = "";
        this.billingState = "";
        this.billingPincode = "";
      }
    },

    searchTerritories(val) {
      if (val) {
        this.searchedTerritoryList = [...this.allTerritoriesNameList];
        const modifiedVal = val.toLowerCase().trim(" ");
        this.searchedTerritoryList = this.allTerritoriesNameList.filter(
          (item) => {
            if (
              item.territory_name.toLowerCase().trim(" ").includes(modifiedVal)
            ) {
              return item;
            }
          }
        );
        console.log("ALL_TERR", this.searchedTerritoryList);
      }
    },
  },

  // computed: {
  //   secondaryContactNumberRules() {
  //     if (this.secondaryCountryCode) {
  //       return [(v) => !!v || "Contact number is required"];
  //     }
  //     return [];
  //   },
  // },

  async mounted() {
    // console.log("GET_EDIT_DATA", this.StoreObj);
    await this.FetchTerritoriesBasedOnPincodes();
    this.vendorPrimaryCountryCode = "+91";
    if (this.StoreObj.action === "edit") {
      console.log("CATEGORIES", this.StoreObj);
      this.vendorEmpId = this.StoreObj.vendor_employee_id || "";
      this.vendorName = this.StoreObj.vendor_name || "";
      this.vendorWebsite = this.StoreObj.vendor_website || "";
      this.vendorCompanyName = this.StoreObj.vendor_company_name || "";
      this.vendorEmailId = this.StoreObj.vendor_email_id || "";
      this.vendorQualifications = this.StoreObj.vendor_qualification || "";
      this.vendorExp = this.StoreObj.vendor_experience;
      this.vendorPrimaryCountryCode =
        this.StoreObj.vendor_primary_country_code || "";
      this.vendorPrimaryContNum =
        this.StoreObj.vendor_primary_contact_number || "";
      this.secondaryCountryCode =
        this.StoreObj.vendor_secondary_country_code || "";
      this.secondaryContactNumber =
        this.StoreObj.vendor_secondary_cotact_number || "";
      this.shippingAddress = this.StoreObj.vendor_address || "";
      this.shippingCity = this.StoreObj.vendor_city || "";
      this.shippingState = this.StoreObj.vendor_state || "";
      this.shippingPincode = this.StoreObj.vendor_pincode || "";
      this.billingAddress = this.StoreObj.vendor_billing_address || "";
      this.billingCity = this.StoreObj.vendor_billing_city || "";
      this.billingState = this.StoreObj.vendor_billing_state || "";
      this.billingPincode = this.StoreObj.vendor_billing_pincode || "";
      this.vendorGstNum = this.StoreObj.vendor_gst_no || "";
      this.vendorPanNum = this.StoreObj.vendor_pan_no || "";
      this.vendorTerritories = this.StoreObj.territory_ids || "";
      this.vendorCategory = this.StoreObj.vendor_categories || "";
      this.vendorLatitude = this.StoreObj.vendor_location.vendor_latitude;
      this.vendorLongitude = this.StoreObj.vendor_location.vendor_longitude;
    }
    await this.GetAllCustomerCategoryMethod("ACTIVE");
    this.CountryList = CountryList;
  },

  methods: {
    async FetchTerritoriesBasedOnPincodes() {
      console.log("INSIDE_A_TER_FUNC");
      try {
        const result = await API.graphql(
          graphqlOperation(ListTerritoriesAndPincodes, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              territory_status: "ACTIVE",
              required_type: "TERRITORY_BY_PINCODE",
              territory_type: "NON_GEO_BASED",
              // territory_pincode: PINCODE,
            },
          })
        );
        const response = JSON.parse(result.data.ListTerritoriesAndPincodes);
        this.allTerritoriesNameList = response.data.Items;
        // if (response.overAllTerritoryDetails) {
        //   this.SnackBarComponent = {
        //     SnackbarVmodel: true,
        //     SnackbarColor: "red",
        //     Top: true,
        //     SnackbarText: "No territories are tagged for the given pincode",
        //   };
        // }
        console.log("CHECK_THE_RESPONSE", response);
      } catch (error) {
        console.log("Error", error);
      }
    },
    GoogleMapsEmit(place) {
      this.shippingAddress = place.formatted_address;
      this.vendorLatitude = place.geometry.location.lat();
      this.vendorLongitude = place.geometry.location.lng();
      this.getPincode(this.vendorLatitude, this.vendorLongitude);
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
        this.shippingPincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode Not Found";
        this.shippingCity = cityComponent
          ? cityComponent.long_name
          : "City Not Found";
        this.shippingState = stateComponent
          ? stateComponent.long_name
          : "State not found";
      }
    },
    async CreateEditVendorMethod() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        const mutation_name =
          this.StoreObj.action === "CREATE"
            ? CreateVendor
            : UpdateVendorDetails;
        const mutation_name_string =
          this.StoreObj.action === "CREATE"
            ? "CreateVendor"
            : "UpdateVendorDetails";
        try {
          let Location = {
            vendor_longitude: this.vendorLongitude,
            vendor_latitude: this.vendorLatitude,
          };
          const result = await API.graphql(
            graphqlOperation(mutation_name, {
              input: {
                vendor_id:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_id
                    : undefined,
                updater_user_id:
                  this.StoreObj.action === "edit"
                    ? this.$store.getters.get_current_user_details.user_id
                    : undefined,
                creator_user_id:
                  this.StoreObj.action === "CREATE"
                    ? this.$store.getters.get_current_user_details.user_id
                    : undefined,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                // vendor_primary_country_code: this.vendorPrimaryCountryCode,
                vendor_primary_country_code:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_primary_country_code !==
                      this.vendorPrimaryCountryCode
                      ? this.vendorPrimaryCountryCode || undefined
                      : undefined
                    : this.vendorPrimaryCountryCode || undefined,
                // vendor_primary_contact_number: this.vendorPrimaryContNum,
                vendor_primary_contact_number:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_primary_contact_number !==
                      this.vendorPrimaryContNum
                      ? this.vendorPrimaryContNum || undefined
                      : undefined
                    : this.vendorPrimaryContNum || undefined,
                // territory_ids: this.vendorTerritories || undefined,
                territory_ids:
                  this.StoreObj.action === "edit"
                    ? JSON.stringify(this.StoreObj.territory_ids) ===
                      JSON.stringify(this.vendorTerritories)
                      ? undefined
                      : this.vendorTerritories
                    : this.vendorTerritories || undefined,
                // vendor_name: this.vendorName,
                vendor_name:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_name !== this.vendorName
                      ? this.vendorName || undefined
                      : undefined
                    : this.vendorName || undefined,
                // vendor_qualification: this.vendorQualifications || undefined,
                vendor_qualification:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_qualification !==
                      this.vendorQualifications
                      ? this.vendorQualifications || undefined
                      : undefined
                    : this.vendorQualifications || undefined,
                // vendor_experience: this.vendorExp || undefined,
                vendor_experience:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_experience !== this.vendorExp
                      ? this.vendorExp || undefined
                      : undefined
                    : this.vendorExp || undefined,
                // vendor_pan_no: this.vendorPanNum || undefined,
                vendor_pan_no:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_pan_no !== this.vendorPanNum
                      ? this.vendorPanNum || undefined
                      : undefined
                    : this.vendorPanNum || undefined,
                // vendor_pincode: this.shippingPincode,
                vendor_pincode:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_pincode !== this.shippingPincode
                      ? this.shippingPincode || undefined
                      : undefined
                    : this.shippingPincode || undefined,
                // vendor_state: this.shippingState,
                vendor_state:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_state !== this.shippingState
                      ? this.shippingState || undefined
                      : undefined
                    : this.shippingState || undefined,
                // vendor_address: this.shippingAddress,
                vendor_address:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_address !== this.shippingAddress
                      ? this.shippingAddress || undefined
                      : undefined
                    : this.shippingAddress || undefined,
                // vendor_gst_no: this.vendorGstNum || undefined,
                vendor_gst_no:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_gst_no !== this.vendorGstNum
                      ? this.vendorGstNum || undefined
                      : undefined
                    : this.vendorGstNum || undefined,
                // vendor_location: Location,
                vendor_location:
                  this.StoreObj.action === "edit"
                    ? JSON.stringify(this.StoreObj.vendor_location) ===
                      JSON.stringify(Location)
                      ? undefined
                      : Location
                    : Location || undefined,
                vendor_employee_id:
                  this.StoreObj.action === "CREATE"
                    ? this.vendorEmpId
                    : undefined,
                // vendor_email_id: this.vendorEmailId || undefined,
                vendor_email_id:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_email_id !== this.vendorEmailId
                      ? this.vendorEmailId || undefined
                      : undefined
                    : this.vendorEmailId || undefined,
                // vendor_billing_address: this.billingAddress || undefined,
                vendor_billing_address:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_billing_address !==
                      this.billingAddress
                      ? this.billingAddress || undefined
                      : undefined
                    : this.billingAddress || undefined,
                // vendor_billing_city: this.billingCity || undefined,
                vendor_billing_city:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_billing_city !== this.billingCity
                      ? this.billingCity || undefined
                      : undefined
                    : this.billingCity || undefined,
                // vendor_billing_pincode: this.billingPincode || undefined,
                vendor_billing_pincode:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_billing_pincode !==
                      this.billingPincode
                      ? this.billingPincode || undefined
                      : undefined
                    : this.billingPincode || undefined,
                // vendor_billing_state: this.billingState || undefined,
                vendor_billing_state:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_billing_state !== this.billingState
                      ? this.billingState || undefined
                      : undefined
                    : this.billingState || undefined,
                // vendor_website: this.vendorWebsite || undefined,
                vendor_website:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_website !== this.vendorWebsite
                      ? this.vendorWebsite || undefined
                      : undefined
                    : this.vendorWebsite || undefined,
                // vendor_company_name: this.vendorCompanyName,
                vendor_company_name:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_company_name !==
                      this.vendorCompanyName
                      ? this.vendorCompanyName || undefined
                      : undefined
                    : this.vendorCompanyName || undefined,
                // vendor_categories: this.vendorCategory || undefined,
                vendor_categories:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_categories !== this.vendorCategory
                      ? this.vendorCategory || undefined
                      : undefined
                    : this.vendorCategory || undefined,
                // vendor_secondary_country_code:
                //   this.secondaryCountryCode || undefined,
                vendor_secondary_country_code:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_secondary_country_code !==
                      this.secondaryCountryCode
                      ? this.secondaryCountryCode || undefined
                      : undefined
                    : this.secondaryCountryCode || undefined,
                // vendor_secondary_contact_number:
                //   this.secondaryContactNumber || undefined,
                vendor_secondary_contact_number:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_secondary_contact_number !==
                      this.secondaryContactNumber
                      ? this.secondaryContactNumber || undefined
                      : undefined
                    : this.secondaryContactNumber || undefined,
                action: this.StoreObj.action === "edit" ? "EDIT" : undefined,
                vendor_city:
                  this.StoreObj.action === "edit"
                    ? this.StoreObj.vendor_city !== this.shippingCity
                      ? this.shippingCity || undefined
                      : undefined
                    : this.shippingCity || undefined,
                // vendor_profile_pic_url:
                // this.finalImgURL !== "" ? this.finalImgURL : undefined,
              },
            })
          );
          console.log("CHECK_CREATE_RESPONSE", result);
          const response = JSON.parse(result.data[mutation_name_string]);
          console.log("CHECK_RES", response);
          if (response.status === "SUCCESS") {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: `${
                this.StoreObj.action === "CREATE" ? "Created" : "Updated"
              } Successfully`,
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
            this.btnLoading = false;
            this.CreateEditVendorDialogEmit(2);
          }
        } catch (error) {
          this.btnLoading = false;
          console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please fill the form!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    CreateEditVendorDialogEmit(Toggle) {
      this.vendorEmpId = "";
      this.vendorName = "";
      this.vendorWebsite = "";
      this.vendorCompanyName = "";
      this.vendorEmailId = "";
      this.vendorQualifications = "";
      this.vendorExp = "";
      this.vendorPrimaryCountryCode = "";
      this.vendorPrimaryContNum = "";
      this.secondaryCountryCode = "";
      this.secondaryContactNumber = "";
      this.shippingAddress = "";
      this.shippingCity = "";
      this.shippingState = "";
      this.shippingPincode = "";
      this.billingAddress = "";
      this.billingCity = "";
      this.billingState = "";
      this.billingPincode = "";
      this.vendorGstNum = "";
      this.vendorPanNum = "";
      this.vendorTerritories = "";
      this.vendorCategory = "";
      this.StoreObj = {};
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
