<template>
  <div>
    <LookUpCustomerDialog
      :dialogLookUpCustomer="dialogLookUpCustomer"
      :customer_type="customer_type"
      @clicked="dialogLookUpCustomerEmit"
    />
    <ChangeExistingPincodeConfirmationDialog
      :dialogConfirmToChangeCustomerPincode="
        dialogConfirmToChangeCustomerPincode
      "
      :StoreObjPincode="StoreObjPincode"
      @clicked="dialogConfirmToChangeCustomerPincodeEmit"
    />
    <v-row>
      <v-col cols="12" md="6" sm="12" xs="12">
        <v-card class="elevation-0 mt-4" height="450px">
          <gmap-map
            :center="center"
            :zoom="20"
            style="width: 100%; height: 100%"
          >
            <GmapMarker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :clickable="true"
              :draggable="true"
              @click="center = m.position"
            />
          </gmap-map>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="12" xs="12" class="mt-3">
        <v-row>
          <v-col cols="12" md="12" sm="12" xs="12">
            <v-toolbar
              flat
              outlined
              height="30px"
              width="600px"
              class="BorderOutline"
            >
              <gmap-autocomplete
                placeholder="Search Service Location"
                style="
                  height: 30px;
                  width: 500px;
                  border-bottom: 0px solid grey;
                  outline: none;
                  font-size: 15px;
                "
                :value="search"
                @place_changed="setPlace"
              >
              </gmap-autocomplete>
              <v-spacer />
              <v-icon small>mdi-magnify</v-icon>
            </v-toolbar>
            <div class="FontSize10px">Service location to get lat and long</div>
          </v-col>
          <v-col cols="12" md="4" sm="12" xs="12">
            <v-select
              dense
              outlined
              label="Customer Type *"
              :items="customerTypeItems"
              class="FontSize rounded-0"
              v-model="ServiceLocation.customer_type"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12" v-show="false">
            <v-text-field
              dense
              outlined
              label="Cust ID"
              class="FontSize rounted-0"
              v-model="ServiceLocation.customer_id"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              label="Customer ID"
              class="FontSize rounded-0"
              v-model="ServiceLocation.customer_unique_id"
              :readonly="CreateFrom === 'RFS'"
            >
              <template v-slot:append>
                <v-btn
                  v-if="CreateFrom !== 'RFS'"
                  small
                  icon
                  color="primary"
                  class="py-0 mt-n2"
                  @click="dialogLookUpCustomer = true"
                  ><v-icon small>mdi-magnify</v-icon></v-btn
                >
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" xs="12" sm="12">
            <v-autocomplete
              dense
              outlined
              item-value="setting_id"
              :rules="isRulesRequered()"
              item-text="setting_name"
              label="Customer Category"
              class="FontSize rounded-0"
              :items="GetAllCustomerCategoryList"
              v-model="ServiceLocation.customer_category_id"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="my-n4">
          <v-col
            cols="12"
            md="6"
            sm="12"
            xs="12"
            v-if="ServiceLocation.customer_type == 'BUSINESS'"
          >
            <v-text-field
              outlined
              dense
              height="30px"
              label="Customer Name"
              class="FontSize rounded-0"
              v-model="ServiceLocation.customer_company_name"
              :readonly="CreateFrom === 'RFS'"
            >
              <template v-slot:append>
                <v-btn
                  v-if="CreateFrom !== 'RFS'"
                  small
                  icon
                  color="primary"
                  class="py-0 mt-n2"
                  @click="dialogLookUpCustomer = true"
                  ><v-icon small>mdi-magnify</v-icon></v-btn
                >
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="12"
            :md="ServiceLocation.customer_type == 'BUSINESS' ? 6 : 12"
            sm="12"
            xs="12"
          >
            <v-text-field
              dense
              outlined
              height="30px"
              class="FontSize rounded-0"
              label="Contact Person Name *"
              :rules="[(v) => !!v || 'Required']"
              v-model="ServiceLocation.customer_name"
              :readonly="CreateFrom === 'RFS'"
            >
              <template v-slot:append>
                <v-btn
                  v-if="CreateFrom !== 'RFS'"
                  small
                  icon
                  color="primary"
                  class="py-0 mt-n2"
                  @click="dialogLookUpCustomer = true"
                  ><v-icon small>mdi-magnify</v-icon></v-btn
                >
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" sm="12" xs="12" class="py-0 pa-0">
            <v-select
              dense
              outlined
              height="30px"
              item-text="name"
              label="Country Code"
              :items="CountryList"
              item-value="dial_code"
              class="rounded-0 ml-3 FontSize"
              v-model="ServiceLocation.country_code"
              :readonly="CreateFrom === 'RFS'"
            >
              <template slot="selection" slot-scope="{ item }">
                {{ item.dial_code }}
              </template>
              <template slot="item" slot-scope="{ item }">
                {{ item.name }}({{ item.dial_code }})
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="8" sm="12" xs="12" class="py-0">
            <v-text-field
              dense
              outlined
              height="30px"
              class="rounded-0 FontSize"
              :rules="customerContactNumberRules"
              label="Customer Primary Contact Number *"
              hint="Enter Valid Customer Contact Number"
              v-model="ServiceLocation.customer_contact_number"
              :readonly="CreateFrom === 'RFS'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-3">
          <v-col cols="12" md="4" sm="12" xs="12" class="py-0 pa-0">
            <v-select
              dense
              outlined
              height="30px"
              item-text="name"
              :items="CountryList"
              item-value="dial_code"
              class="rounded-0 ml-3 FontSize"
              label="Secondary Contact Country Code"
              v-model="ServiceLocation.secondary_customer_contact_country_code"
              :readonly="CreateFrom === 'RFS'"
            >
              <template slot="selection" slot-scope="{ item }">
                {{ item.dial_code }}
              </template>
              <template slot="item" slot-scope="{ item }">
                {{ item.name }}({{ item.dial_code }})
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="8" sm="12" xs="12" class="py-0">
            <v-text-field
              dense
              outlined
              height="30px"
              class="rounded-0 FontSize"
              :rules="secondaryContactNumberRules"
              label="Customer Secondary Contact Number "
              v-model="ServiceLocation.secondary_customer_contact"
              :readonly="CreateFrom === 'RFS'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          dense
          outlined
          height="30px"
          label="Service Address *"
          class="rounded-0 mt-3 FontSize"
          :rules="[(v) => !!v || 'Required']"
          v-model="ServiceLocation.service_address"
          :readonly="CreateFrom === 'RFS'"
        ></v-text-field>
        <v-row>
          <v-col cols="12" md="4" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              label="City"
              class="rounded-0 FontSize mr-2"
              v-model="ServiceLocation.ticket_city"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              label="State"
              class="rounded-0 FontSize mr-2"
              v-model="ServiceLocation.ticket_state"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              type="number"
              label="Pincode"
              class="rounded-0 FontSize mr-2"
              v-model="ServiceLocation.ticket_pincode"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-n6">
          <v-col cols="12" md="6" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              readonly
              label="Latitude"
              class="FontSize rounded-0 mr-2"
              v-model="ServiceLocation.latitude"
              :rules="[(v) => !!v || 'Required']"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              readonly
              label="Longitude"
              class="FontSize rounded-0"
              v-model="ServiceLocation.longitude"
              :rules="[(v) => !!v || 'Required']"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-3">
          <v-col cols="12" md="6" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              height="30px"
              label="Email Id"
              class="rounded-0 FontSize"
              v-model="ServiceLocation.customer_email_id"
              :readonly="CreateFrom === 'RFS'"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
            xs="12"
            v-if="ServiceLocation.is_Enabled_checkbox != false"
          >
            <v-checkbox
              dense
              label="Add Customer To Database"
              v-model="ServiceLocation.Add_Customer_to_dB"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="6" sm="12" xs="12" v-show="false">
            <v-text-field
              dense
              outlined
              label="Tagged Territories"
              v-model="ServiceLocation.territory_ids"
              :readonly="CreateFrom === 'RFS'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="12" xs="12" v-show="false">
            <v-text-field
              dense
              outlined
              label="Primary Tech"
              v-model="ServiceLocation.primary_tech_id"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="12" xs="12" v-show="false">
            <v-text-field
              dense
              outlined
              label="Secondary Tech"
              v-model="ServiceLocation.secondary_tech_id"
              :readonly="CreateFrom === 'RFS'"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div
      v-if="GetAllNearestCustomersList.length != 0"
      style="border: solid 1px"
    >
      <h3
        class="mt-6 black--text ml-8"
        v-if="GetAllNearestCustomersList.length != 0"
      >
        Nearest Customers Based on Selected Address :
      </h3>
      <v-card-text>
        <v-data-table
          v-if="GetAllNearestCustomersList.length != 0"
          dense
          class="elevation-0"
          :items-per-page="5"
          hide-default-footer
          :headers="NearestCustomersHeaders"
          :items="GetAllNearestCustomersList"
        >
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div
              class="FontSize"
              v-if="item.customer_company_name != undefined"
            >
              {{ item.customer_company_name }}
            </div>
            <div v-else>-</div>
            <div v-if="item.customer_name != undefined">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_type`]="{ item }">
            <div class="FontSize" v-if="item.customer_type != undefined">
              {{ item.customer_type }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_unique_id`]="{ item }">
            <div class="FontSize" v-if="item.customer_unique_id != undefined">
              {{ item.customer_unique_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_primary_contact_number`]="{ item }">
            <div
              class="FontSize"
              v-if="item.customer_primary_contact_number != undefined"
            >
              {{ item.customer_primary_contact_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_address`]="{ item }">
            <div class="FontSize" v-if="item.customer_address != undefined">
              {{ item.customer_address }}
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-card-text>
    </div>
  </div>
</template>
<script>
import CountryList from "@/JsonFiles/CountryList.json";
import LookUpCustomerDialog from "@/components/Tickets/Dialogs/NewCustomerLookup.vue";
import ChangeExistingPincodeConfirmationDialog from "@/components/Tickets/Dialogs/ChangeExistingPincodeConfirmationDialog.vue";
import { GetAllNearestCustomers } from "@/mixins/Tickets/GetNearestCustomers.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  props: { StoreObj: Object, CreateFrom: String },
  components: {
    LookUpCustomerDialog,
    ChangeExistingPincodeConfirmationDialog,
  },
  mixins: [
    GetAllNearestCustomers,
    GetAllCustomerCategory,
    GetAllOrganizationSettingsTypesInMS,
  ],
  data: () => ({
    search: "",
    customer_type: "",
    existing_customer_pincode: "",
    dialogLookUpCustomer: false,
    dialogConfirmToChangeCustomerPincode: false,
    CountryList: [],
    pincodeRules: [],
    GetAllNearestCustomersList: [],
    GetAllCustomerCategoryList: [],
    secondaryContactNumberRules: [],
    customerTypeItems: ["INDIVIDUAL", "BUSINESS"],
    customerContactNumberRules: [
      (v) =>
        /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
      (v) => (v && v.length < 11) || "Invalid",
      (v) => (v && v.length > 9) || "Invalid",
    ],
    NearestCustomersHeaders: [
      { text: "Customer", value: "customer_company_name" },
      { text: "Customer Type", value: "customer_type" },
      { text: "Customer ID", value: "customer_unique_id" },
      { text: "Phone Number", value: "customer_primary_contact_number" },
      { text: "Address", value: "customer_address", width: "25%" },
      { text: "Distance", value: "distance" },
    ],
    markers: [
      {
        position: {},
      },
    ],
    StoreObjPincode: {},
    ServiceLocation: {
      latitude: 0,
      longitude: 0,
      is_tag_territory: false,
      Add_Customer_to_dB: false,
      territory_ids: [],
      customer_id: "",
      ticket_city: "",
      ticket_state: "",
      customer_name: "",
      customer_type: "",
      ticket_pincode: "",
      country_code: "+91",
      service_address: "",
      primary_tech_id: "",
      customer_email_id: "",
      secondary_tech_id: "",
      customer_unique_id: "",
      customer_category_id: "",
      customer_company_name: "",
      customer_contact_number: "",
      secondary_country_code: "+91",
      secondary_customer_contact: "",
      secondary_customer_contact_country_code: "+91",
    },
    center: { lat: 0, lng: 0 },
  }),
  watch: {
    "ServiceLocation.secondary_customer_contact"(val) {
      if (val != undefined && val != null && val != "") {
        this.secondaryContactNumberRules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 11) || "Invalid",
          (v) => (v && v.length > 9) || "Invalid",
        ];
      } else {
        this.secondaryContactNumberRules = [];
      }
    },
    "ServiceLocation.ticket_pincode"(val) {
      if (val != undefined && val != null && val != "") {
        this.pincodeRules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 7) || "Invalid",
          (v) => (v && v.length > 5) || "Invalid",
        ];
      } else {
        this.pincodeRules = [];
      }
      if (val != undefined && val != null && val != "") {
        if (
          this.existing_customer_pincode != undefined &&
          this.existing_customer_pincode != null &&
          this.existing_customer_pincode != ""
        ) {
          if (val.length == 6) {
            if (this.existing_customer_pincode != val) {
              this.StoreObjPincode.new_pincode = val;
              this.StoreObjPincode.existing_customer_pincode =
                this.existing_customer_pincode;
              this.dialogConfirmToChangeCustomerPincode = true;
            } else {
              this.ServiceLocation.is_tag_territory = false;
            }
          }
          this.ServiceLocation.is_tag_territory = false;
        }
      }
      if (val != undefined && val != null && val != "" && val.length == 6) {
        if (
          (this.existing_customer_pincode == "" ||
            this.existing_customer_pincode == null ||
            this.existing_customer_pincode == undefined) &&
          this.ServiceLocation.customer_id != undefined &&
          this.ServiceLocation.customer_id != ""
        ) {
          this.ServiceLocation.is_tag_territory = true;
        } else {
          this.ServiceLocation.is_tag_territory = false;
        }
      } else {
        this.ServiceLocation.is_tag_territory = false;
      }
    },
  },
  async mounted() {
    this.GetAllCustomerCategoryMethod("ACTIVE");
    this.GetCurrentLocation();
    this.CountryList = CountryList;
    await this.GetAllOrganizationSettingsTypesMethod();
    this.ServiceLocation.customer_type =
      this.GetAllOrganizationSettingsTypesObject.default_customer_type;

    this.getCustomerDetailsMethod();
  },
  methods: {
    windowPage1Emit(Toggle, serviceLocation) {
      this.$emit("clicked", Toggle, serviceLocation);
    },
    isRulesRequered() {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .is_customer_category_mandatory != undefined
      ) {
        if (
          this.$store.getters.get_current_user_details.organization_details
            .is_customer_category_mandatory == true
        ) {
          return [(v) => !!v || "Required"];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    GetCurrentLocation() {
      var self = this;
      navigator.geolocation.getCurrentPosition(function (pos) {
        self.center.lat = pos.coords.latitude;
        self.center.lng = pos.coords.longitude;
        self.markers = [];
        self.markers.push({
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        });
      });
    },

    getCustomerDetailsMethod() {
      this.ServiceLocation = {
        ticket_city: this.StoreObj.city,
        ticket_state: this.StoreObj.state,
        ticket_pincode: this.StoreObj.customer_pincode,
        customer_name: this.StoreObj.customer_name,
        customer_unique_id: this.StoreObj.customer_unique_id,
        customer_category_id: this.StoreObj.customer_category_id,
        customer_id: this.StoreObj.customer_id,
        customer_company_name: this.StoreObj.customer_company_name,
        customer_type: this.StoreObj.customer_type,
        country_code: this.StoreObj.customer_primary_country_code,
        customer_contact_number: this.StoreObj.customer_primary_contact_number,
        latitude: this.StoreObj.customer_latitude,
        longitude: this.StoreObj.customer_longitude,
        service_address: this.StoreObj.customer_address,
        customer_email_id: this.StoreObj.customer_email_id,
        territory_ids: this.StoreObj.territory_ids,
        primary_tech_id:
          this.StoreObj.primary_representative_details != undefined
            ? this.StoreObj.primary_representative_details
            : "",
        secondary_tech_id:
          this.StoreObj.secondary_representative_details != undefined
            ? this.StoreObj.secondary_representative_details
            : "",
        is_Enabled_checkbox: this.StoreObj.Is_enabled_checkBox,
      };
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
        this.ServiceLocation.ticket_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode Not Found";
        this.ServiceLocation.ticket_city = cityComponent
          ? cityComponent.long_name
          : "City Not Found";
        this.ServiceLocation.ticket_state = stateComponent
          ? stateComponent.long_name
          : "State not found";
      }
    },
    setPlace(place) {
      this.currentPlace = place;
      this.center.lat = this.currentPlace.geometry.location.lat();
      this.center.lng = this.currentPlace.geometry.location.lng();
      this.getPincode(this.center.lat, this.center.lng);
      this.GetAllNearestCustomersMethod(this.center.lat, this.center.lng);
      self.markers = [];
      self.markers.push({
        position: {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        },
      });

      this.ServiceLocation = {
        latitude: this.currentPlace.geometry.location.lat(),
        longitude: this.currentPlace.geometry.location.lng(),
        service_address: place.formatted_address,
        customer_type: this.ServiceLocation.customer_type,
        customer_name: this.ServiceLocation.customer_name,
        country_code: this.ServiceLocation.country_code,
        customer_contact_number: this.ServiceLocation.customer_contact_number,
        customer_email_id: this.ServiceLocation.customer_email_id,
        territory_ids: this.ServiceLocation.territory_ids,
      };
      setTimeout(() => {
        this.windowPage1Emit(3, this.ServiceLocation);
      }, 400);
    },
    dialogConfirmToChangeCustomerPincodeEmit(Toggle, StoreObjPincode) {
      this.dialogConfirmToChangeCustomerPincode = false;
      if (Toggle == 2) {
        this.ServiceLocation.is_tag_territory = true;
        this.ServiceLocation.ticket_pincode = StoreObjPincode.new_pincode;
      } else if (Toggle == 1) {
        this.ServiceLocation.is_tag_territory = false;
        this.ServiceLocation.ticket_pincode =
          StoreObjPincode.existing_customer_pincode;
      }
    },
    dialogLookUpCustomerEmit(Toggle, data) {
      console.log("EMITED_ITEM", data);
      let item;
      data ? (item = data[0]) : null;
      // const item = data[0];
      this.dialogLookUpCustomer = false;
      if (Toggle == 2) {
        this.markers = [];
        this.markers.push({
          position: {
            lat: item.customer_latitude,
            lng: item.customer_longitude,
          },
        });
        this.center.lat = item.customer_latitude;
        this.center.lng = item.customer_longitude;
        this.existing_customer_pincode = item.customer_pincode;
        this.GetAllNearestCustomersMethod(this.center.lat, this.center.lng);
        this.ServiceLocation = {
          ticket_city: item.city,
          ticket_state: item.state,
          ticket_pincode: item.customer_pincode,
          customer_name: item.customer_name,
          customer_unique_id: item.customer_unique_id,
          customer_category_id: item.customer_category_id,
          customer_id: item.customer_id,
          customer_company_name: item.customer_company_name,
          customer_type: item.customer_type,
          country_code: item.customer_primary_country_code,
          customer_contact_number: item.customer_primary_contact_number,
          latitude: item.customer_latitude,
          longitude: item.customer_longitude,
          service_address: item.customer_address,
          customer_email_id: item.customer_email_id,
          territory_ids: item.territory_ids,
          primary_tech_id:
            item.primary_representative_details != undefined
              ? item.primary_representative_details
              : "",
          secondary_tech_id:
            item.secondary_representative_details != undefined
              ? item.secondary_representative_details
              : "",
          is_Enabled_checkbox: item.Is_enabled_checkBox,
        };
        setTimeout(() => {
          this.windowPage1Emit(3, this.ServiceLocation);
        }, 400);
      }
    },
  },
};
</script>
