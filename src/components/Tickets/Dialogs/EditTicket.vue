<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogEditTicket" persistent max-width="80%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-ticket</v-icon>Edit Ticket
            <span
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id == undefined"
            >
              ({{ this.StoreObj.ticket_id }})
            </span>
            <span
              class="xsmallFontSize"
              v-else-if="this.StoreObj.custom_ticket_id != undefined"
            >
              ({{ this.StoreObj.custom_ticket_id }})
            </span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogEditTicketEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-row no-gutters class="mt-n4">
              <v-col cols="12" md="6" xs="12" sm="12">
                <GoogleMaps :StoreObj="StoreObj" @clicked="GoogleMapsEmit" />
              </v-col>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-row no-gutters class="mt-4">
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Ticket ID"
                      readonly
                      v-model="ticket_id"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Contact Person"
                      v-model="customer_name"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Country Code"
                      v-model="customer_country_code"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize ml-1 mr-2"
                      label="Customer Phone Number"
                      v-model="customer_phone_number"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Secondary Country Code"
                      v-model="secondary_customer_country_code"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize ml-1"
                      label="Secondary Phone Number"
                      v-model="secondary_customer_contact"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Customer ID"
                      v-model="customer_unique_id"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="8" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Customer Address"
                      v-model="ticket_address"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="City"
                      v-model="ticket_city"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="State"
                      v-model="ticket_state"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Pincode"
                      type="number"
                      v-model="ticket_pincode"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      class="FontSize mr-2"
                      label="Latitude"
                      v-model="ticket_latitude"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      class="FontSize mr-2"
                      label="Longitude"
                      v-model="ticket_longitude"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Customer Email ID"
                      v-model="customer_email_id"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-select
                      dense
                      outlined
                      v-model="categories"
                      class="mr-2 FontSize"
                      :items="category_lists"
                      item-value="category_id"
                      label="Category *"
                      item-text="category_name"
                      :rules="[(v) => !!v || 'Required']"
                      @change="
                        GetServicesByCategoriesMethod(categories.category_id)
                      "
                      return-object
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-select
                      dense
                      outlined
                      class="FontSize mr-2"
                      v-model="products"
                      :items="GetServiceByCategoriesList"
                      item-value="service_id"
                      item-text="service_name"
                      :rules="[(v) => !!v || 'Required']"
                      label="Product"
                      return-object
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Serial Number"
                      v-model="service_serial_number"
                      :disabled="StoreObj.action === 'EDIT_TICKET_PC'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-autocomplete
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Support"
                      :items="ticket_warranty_type_items"
                      v-model="ticket_warranty_type"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-autocomplete
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Support Type"
                      item-text="setting_name"
                      return-object
                      :items="GetAllAMCTypeList"
                      v-model="support_type"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Invoice Number"
                      v-model="ticket_invoice_number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-menu
                      offset-y
                      min-width="auto"
                      :nudge-right="40"
                      v-model="ticket_invoice_date_dialog"
                      transition="scale-transition"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          outlined
                          v-on="on"
                          v-bind="attrs"
                          class="FontSize mr-2"
                          label="Invoice Date"
                          v-model="ticket_invoice_date"
                          prepend-inner-icon="mdi-calendar"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="ticket_invoice_date"
                        @input="ticket_invoice_date_dialog = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-menu
                      offset-y
                      min-width="auto"
                      :nudge-right="40"
                      v-model="installation_date_dialog"
                      transition="scale-transition"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          outlined
                          v-on="on"
                          v-bind="attrs"
                          class="FontSize"
                          label="Installation Date"
                          v-model="installation_date"
                          prepend-inner-icon="mdi-calendar"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="installation_date"
                        @input="installation_date_dialog = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <b class="primary--text"
                  >NOTE: If you edit the details, the details in database also
                  will be updated, still do you want to edit ?</b
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            @click="dialogEditTicketEmit(1)"
            outlined
            class="red--text mb-2"
            >Cancel</v-btn
          >
          <v-btn
            small
            :loading="loading"
            color="primary"
            @click="validateMethod()"
            class="white--text mb-2"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { UpdateCustomerDetailsInTicket } from "@/graphql/mutations.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  props: {
    StoreObj: Object,
    dialogEditTicket: Boolean,
  },
  components: {
    Snackbar,
    GoogleMaps,
  },
  mixins: [
    GetAllOrganizationSetting,
    GetServicesByCategory,
    GetAllOrganizationSettingsTypesInMS,
    GetTicketDetails,
  ],
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    installation_date_dialog: false,
    ticket_invoice_date_dialog: false,
    ticket_id: "",
    ticket_city: "",
    ticket_state: "",
    support_type: "",
    customer_name: "",
    ticket_pincode: "",
    ticket_address: "",
    ticket_latitude: "",
    ticket_longitude: "",
    customer_email_id: "",
    installation_date: "",
    customer_unique_id: "",
    ticket_invoice_date: "",
    ticket_invoice_number: "",
    ticket_invoice_number_from_store: "",
    ticket_warranty_type: "",
    category_name: "",
    products: "",
    categories: "",
    service_serial_number: "",
    customer_phone_number: "",
    secondary_customer_contact: "",
    secondary_customer_country_code: "+91",
    customer_country_code: "+91",
    SnackBarComponent: {},
    GetServiceByCategoriesList: [],
    category_lists: [],
    GetAllAMCTypeList: [],
    ticket_warranty_type_items: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "AMC" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
  }),
  watch: {
    async dialogEditTicket(val) {
      if (val == true) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.GetAllOrganizationSettingsTypesMethod();
        this.GetServicesByCategoriesMethod(this.StoreObj.category_id);
        this.ticket_id =
          this.StoreObj.custom_ticket_id != undefined
            ? this.StoreObj.custom_ticket_id
            : this.StoreObj.ticket_id;
        this.customer_name = this.StoreObj.customer_name;
        this.customer_country_code = this.StoreObj.customer_country_code;
        this.customer_phone_number = this.StoreObj.customer_phone_number;
        this.secondary_customer_contact =
          this.StoreObj.secondary_customer_contact;
        this.customer_unique_id = this.StoreObj.customer_unique_id;
        this.ticket_address = this.StoreObj.ticket_address;
        this.customer_email_id = this.StoreObj.customer_email_id;
        this.service_serial_number = this.StoreObj.service_serial_number;
        this.categories = this.StoreObj.category_id;
        this.ticket_warranty_type = this.StoreObj.ticket_warranty_type;
        this.installation_date =
          this.StoreObj.installation_date != "-"
            ? this.StoreObj.installation_date
            : "";
        this.ticket_city = this.StoreObj.ticket_city;
        this.ticket_state = this.StoreObj.ticket_state;
        this.ticket_pincode = this.StoreObj.ticket_pincode;
        this.ticket_latitude = this.StoreObj.ticket_latitude;
        this.ticket_longitude = this.StoreObj.ticket_longitude;
        this.secondary_customer_country_code = "+91";
        setTimeout(() => {
          this.support_type = this.StoreObj.support_type;
          this.products = this.StoreObj.service_id;
        }, 1000);
        this.ticket_invoice_number =
          this.StoreObj.ticket_warranty_details != undefined
            ? this.StoreObj.ticket_warranty_details.ticket_invoice_number
            : "";
        this.ticket_invoice_number_from_store =
          this.StoreObj.ticket_warranty_details != undefined
            ? this.StoreObj.ticket_warranty_details.ticket_invoice_number !=
              undefined
              ? this.StoreObj.ticket_warranty_details.ticket_invoice_number
              : undefined
            : undefined;
        this.ticket_invoice_date_from_store =
          this.StoreObj.ticket_warranty_details != undefined
            ? this.StoreObj.ticket_warranty_details.ticket_invoice_date !=
              undefined
              ? this.StoreObj.ticket_warranty_details.ticket_invoice_date
              : undefined
            : undefined;
        this.ticket_invoice_date =
          this.StoreObj.ticket_warranty_details != undefined
            ? this.StoreObj.ticket_warranty_details.ticket_invoice_date != "-"
              ? this.StoreObj.ticket_warranty_details.ticket_invoice_date
              : ""
            : "";
      }
    },
    GetAllOrganizationSettingsTypesObject(val) {
      this.category_lists = val.categories_list;
    },
    ticket_warranty_type(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
  },
  methods: {
    GoogleMapsEmit(place) {
      this.ticket_latitude = place.geometry.location.lat();
      this.ticket_longitude = place.geometry.location.lng();
      this.ticket_address = place.formatted_address;
      this.getPincode(this.ticket_latitude, this.ticket_longitude);
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
        this.ticket_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.ticket_city = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.ticket_state = stateComponent
          ? stateComponent.long_name
          : "State not found";
      }
      return {
        pincode: "Pincode not found",
        city: "City not found",
        state: "State not found",
      };
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        this.editTicketMethod();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please Fill Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },
    async editTicketMethod() {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          ticket_id: this.StoreObj.ticket_id,
          service_name:
            this.products.service_id != this.StoreObj.service_id
              ? this.products.service_name
              : undefined,
          service_id:
            this.products.service_id != this.StoreObj.service_id
              ? this.products.service_id
              : undefined,
          category_name:
            this.categories.category_id != this.StoreObj.category_id
              ? this.categories.category_name
              : undefined,
          category_id:
            this.categories.category_id != this.StoreObj.category_id
              ? this.categories.category_id
              : undefined,
          ticket_address:
            this.StoreObj.ticket_address != this.ticket_address
              ? this.ticket_address
              : undefined,
          ticket_latitude:
            this.StoreObj.ticket_latitude != this.ticket_latitude
              ? this.ticket_latitude
              : undefined,
          ticket_longitude:
            this.StoreObj.ticket_longitude != this.ticket_longitude
              ? this.ticket_longitude
              : undefined,
          customer_id:
            this.StoreObj.customer_id != undefined &&
            this.StoreObj.customer_id != null &&
            this.StoreObj.customer_id != ""
              ? this.StoreObj.customer_id
              : undefined,
          ticket_city:
            this.ticket_city != undefined &&
            this.ticket_city != null &&
            this.ticket_city != ""
              ? this.StoreObj.ticket_city != this.ticket_city
                ? this.ticket_city
                : undefined
              : undefined,
          ticket_state:
            this.ticket_state != undefined &&
            this.ticket_state != null &&
            this.ticket_state != ""
              ? this.StoreObj.ticket_state != this.ticket_state
                ? this.ticket_state
                : undefined
              : undefined,
          ticket_pincode:
            this.ticket_pincode != undefined &&
            this.ticket_pincode != null &&
            this.ticket_pincode != ""
              ? this.StoreObj.ticket_pincode != this.ticket_pincode
                ? this.ticket_pincode
                : undefined
              : undefined,
          customer_unique_id:
            this.customer_unique_id != undefined &&
            this.customer_unique_id != null &&
            this.customer_unique_id != ""
              ? this.StoreObj.customer_unique_id != this.customer_unique_id
                ? this.customer_unique_id
                : undefined
              : undefined,
          secondary_customer_contact:
            this.secondary_customer_contact != undefined &&
            this.secondary_customer_contact != null &&
            this.secondary_customer_contact != ""
              ? this.StoreObj.secondary_customer_contact !=
                this.secondary_customer_contact
                ? this.secondary_customer_contact
                : undefined
              : undefined,
          customer_phone_number:
            this.customer_phone_number != undefined &&
            this.customer_phone_number != null &&
            this.customer_phone_number != ""
              ? this.StoreObj.customer_phone_number !=
                this.customer_phone_number
                ? this.customer_phone_number
                : undefined
              : undefined,
          customer_country_code:
            this.customer_country_code != undefined &&
            this.customer_country_code != null &&
            this.customer_country_code != ""
              ? this.StoreObj.customer_country_code !=
                this.customer_country_code
                ? this.customer_country_code
                : undefined
              : undefined,
          customer_name:
            this.customer_name != undefined &&
            this.customer_name != null &&
            this.customer_name != ""
              ? this.StoreObj.customer_name != this.customer_name
                ? this.customer_name
                : undefined
              : undefined,
          customer_email_id:
            this.customer_email_id != undefined &&
            this.customer_email_id != null &&
            this.customer_email_id != ""
              ? this.StoreObj.customer_email_id != this.customer_email_id
                ? this.customer_email_id
                : undefined
              : undefined,
          service_serial_number:
            this.service_serial_number != undefined &&
            this.service_serial_number != null &&
            this.service_serial_number != ""
              ? this.StoreObj.service_serial_number !=
                this.service_serial_number
                ? this.service_serial_number
                : undefined
              : undefined,
          ticket_warranty_type:
            this.ticket_warranty_type != undefined &&
            this.ticket_warranty_type != null &&
            this.ticket_warranty_type != ""
              ? this.StoreObj.ticket_warranty_type != this.ticket_warranty_type
                ? this.ticket_warranty_type
                : undefined
              : undefined,
          support_type:
            this.support_type != undefined &&
            this.support_type != null &&
            this.support_type != ""
              ? this.StoreObj.support_type != this.support_type.setting_name
                ? this.support_type.setting_name
                : undefined
              : undefined,
          installation_date:
            this.installation_date != undefined &&
            this.installation_date != null &&
            this.installation_date != ""
              ? this.StoreObj.installation_date != this.installation_date
                ? this.installation_date
                : undefined
              : undefined,
          ticket_warranty_details: {
            ticket_invoice_number:
              this.ticket_invoice_date_from_store !== this.ticket_invoice_number
                ? this.ticket_invoice_number
                : undefined,
            ticket_invoice_date:
              this.ticket_invoice_date_from_store !== this.ticket_invoice_number
                ? this.ticket_invoice_date
                : undefined,
          },
          // (this.ticket_invoice_number != undefined &&
          //   this.ticket_invoice_number != null &&
          //   this.ticket_invoice_number != "" &&
          //   this.ticket_invoice_number_from_store !=
          //     this.ticket_invoice_number) ||
          // (this.ticket_invoice_date != undefined &&
          //   this.ticket_invoice_date != null &&
          //   this.ticket_invoice_date != "" &&
          //   this.ticket_invoice_date_from_store != this.ticket_invoice_date)
          //   ? {
          //       ticket_invoice_number:
          //         this.ticket_invoice_number != undefined &&
          //         this.ticket_invoice_number != null &&
          //         this.ticket_invoice_number != ""
          //           ? this.ticket_invoice_number_from_store !=
          //             this.ticket_invoice_number
          //             ? this.ticket_invoice_number
          //             : undefined
          //           : undefined,
          //       ticket_invoice_date:
          //         this.ticket_invoice_date != undefined &&
          //         this.ticket_invoice_date != null &&
          //         this.ticket_invoice_date != ""
          //           ? this.ticket_invoice_date_from_store !=
          //             this.ticket_invoice_date
          //             ? this.ticket_invoice_date
          //             : undefined
          //           : undefined,
          //     }
          //   : undefined,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(UpdateCustomerDetailsInTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.UpdateCustomerDetailsInTicket
        );
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.dialogEditTicketEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
      }
    },
    dialogEditTicketEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
