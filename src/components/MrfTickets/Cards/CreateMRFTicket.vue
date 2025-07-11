<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <LookUpCustomerDialog
      :dialogLookUpCustomer="dialogLookUpCustomer"
      :customer_type="customer_type"
      @clicked="dialogLookUpCustomerEmit"
    />
    <v-card flat>
      <v-row flat class="mx-4 mt-2" height="30" color="#ffffff" dark>
        <div class="black--text font-weight-bold">
          Create Material Request Ticket
        </div>
        <v-spacer />
        <v-btn
          tile
          small
          depressed
          color="primary"
          @click="CreateMRFTicketEmit(1)"
          ><v-icon small class="pr-2">mdi-chevron-double-left</v-icon
          >Back</v-btn
        >
      </v-row>
      <v-card-text>
        <v-form ref="form">
          <h4 class="black--text">Customer Information :</h4>
          <v-row no-gutters>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-select
                dense
                outlined
                :items="customer_type_items"
                class="FontSize mr-2"
                label="Customer Type *"
                v-model="customer_type"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                readonly
                class="FontSize mr-2"
                label="Customer"
                v-model="customer_company_name"
              >
                <template v-slot:append>
                  <v-btn
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
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                readonly
                class="FontSize mr-2"
                label="Contact Person *"
                v-model="customer_name"
                :rules="[(v) => !!v || 'Required']"
              >
                <template v-slot:append>
                  <v-btn
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
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Customer ID"
                v-model="customer_unique_id"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Email ID"
                v-model="customer_email_id"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-autocomplete
                dense
                outlined
                class="FontSize mr-2"
                item-value="setting_id"
                item-text="setting_name"
                label="Customer Cateogry"
                v-model="customer_category_id"
                :items="GetAllCustomerCategoryList"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="1" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Country Code *"
                v-model="customer_country_code"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Phone Number *"
                v-model="customer_phone_number"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="1" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Secondary Country Code"
                v-model="customer_secondary_country_code"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Secondary Phone Number"
                v-model="secondary_customer_contact"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Address *"
                v-model="ticket_address"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="City"
                v-model="ticket_city"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="State"
                v-model="ticket_state"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize mr-2"
                label="Pincode"
                v-model="ticket_pincode"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="1" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                readonly
                type="number"
                class="FontSize mr-2"
                label="Latitude"
                v-model="ticket_latitude"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="1" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                readonly
                type="number"
                class="FontSize mr-2"
                label="Longitude"
                v-model="ticket_longitude"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <h4 class="black--text">Service Information :</h4>
          <v-row no-gutters>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-select
                dense
                outlined
                label="Category *"
                v-model="category_id"
                class="FontSize mr-2"
                :items="categoryItems"
                item-text="category_name"
                item-value="category_id"
                :rules="[(v) => !!v || 'Required']"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-select
                dense
                outlined
                label="Product *"
                v-model="service_id"
                class="FontSize mr-2"
                :items="GetServiceByCategoriesList"
                item-text="service_name"
                item-value="service_id"
                :rules="[(v) => !!v || 'Required']"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                label="Serial Number"
                v-model="service_serial_number"
                class="FontSize mr-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-select
                dense
                outlined
                label="Service Type *"
                v-model="service_type_id"
                class="FontSize mr-2"
                :items="GetAllServiceTypeByServiceIDList"
                item-value="service_type_id"
                item-text="service_type_name"
                :rules="[(v) => !!v || 'Required']"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-autocomplete
                dense
                outlined
                label="Ticket Type"
                v-model="ticket_creation_type"
                class="FontSize mr-2"
                :items="ticket_creation_type_items"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-combobox
                dense
                outlined
                label="Problem Description"
                v-model="service_ticket_description"
                class="FontSize mr-2"
                :items="GetProblem"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-autocomplete
                dense
                outlined
                label="Support"
                v-model="ticket_warranty_type"
                class="FontSize mr-2"
                :items="ticket_warranty_type_items"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-autocomplete
                dense
                outlined
                label="Support Type"
                v-model="support_type"
                class="FontSize mr-2"
                item-text="setting_name"
                item-value="setting_name"
                :items="GetAllAMCTypeList"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                label="Invoice Number"
                v-model="ticket_invoice_number"
                class="FontSize mr-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-menu
                left
                offset-y
                min-width="auto"
                :nudge-right="40"
                transition="scale-transition"
                :close-on-content-click="false"
                v-model="invoice_date"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-on="on"
                    v-bind="attrs"
                    label="Invoice Date"
                    class="FontSize mr-2"
                    v-model="ticket_invoice_date"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="ticket_invoice_date"
                  @input="invoice_date = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-menu
                left
                offset-y
                min-width="auto"
                :nudge-right="40"
                transition="scale-transition"
                :close-on-content-click="false"
                v-model="installation_date_dialog"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-on="on"
                    v-bind="attrs"
                    label="Installation Date"
                    class="FontSize mr-2"
                    v-model="installation_date"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="installation_date"
                  @input="installation_date_dialog = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-text-field
                dense
                outlined
                class="FontSize"
                label="Additional Comments"
                v-model="additional_comments"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12">
              <v-autocomplete
                dense
                outlined
                multiple
                item-value="territory_id"
                item-text="territory_name"
                :items="GetAllTerritoriesList"
                label="Select territories *"
                v-model="tagged_territories"
                class="FontSize mr-2"
                :rules="[(v) => (v && v.length > 0) || 'Required']"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
              <v-checkbox
                label="Free of Cost"
                class="FontSize mt-n1"
                v-model="is_free_of_cost"
              ></v-checkbox>
            </v-col>
          </v-row>
          <h4 class="black--text">Components</h4>
          <v-row no-gutters>
            <v-col cols="12" md="3" sm="12" xs="12">
              <v-autocomplete
                dense
                outlined
                label="Component *"
                class="FontSize mr-2"
                return-object
                item-text="component_name"
                item-value="component_id"
                v-model="component_name"
                :items="GetAllComponentsByProductList"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
              <v-autocomplete
                dense
                outlined
                label="Requested From"
                class="FontSize mr-2"
                v-model="requested_from"
                :items="requested_from_items"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
              <v-text-field
                dense
                outlined
                label="Requested Qty *"
                class="FontSize mr-2"
                type="number"
                v-model="requested_component_quantity"
                :rules="[(v) => !!v || 'Required']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
              <v-autocomplete
                dense
                outlined
                label="Service Cetner"
                class="FontSize"
                item-text="service_center_name"
                items-value="service_center_id"
                v-model="service_center_name"
                return-object
                :items="GetAllServiceCentersList"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="py-0">
        <v-spacer />
        <v-btn
          class="primary white--text mr-2 mb-6"
          small
          :loading="loading_btn"
          @click="createMrfMethod()"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import LookUpCustomerDialog from "@/components/Tickets/Dialogs/LookUpCustomerDialog.vue";
import { API, graphqlOperation } from "aws-amplify";
import { CreateMRFTicket } from "@/graphql/mutations.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";
import { GetAllOrganizationSettings } from "@/mixins/Tickets/GetAllOrganizationSettings.js";
import { GetAllComponentsByProduct } from "@/mixins/MRFTickets/GetAllComponentsByProduct.js";
import { GetAllServiceTypeBasedOnServiceID } from "@/mixins/Tickets/GetAllListServiceTypeById.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  components: {
    Overlay,
    Snackbar,
    LookUpCustomerDialog,
  },
  mixins: [
    GetAllTerritories,
    GetAllServiceCenter,
    GetServicesByCategory,
    GetAllCustomerCategory,
    GetAllOrganizationSetting,
    GetAllComponentsByProduct,
    GetAllOrganizationSettings,
    GetAllServiceTypeBasedOnServiceID,
    GetAllOrganizationSettingsTypesInMS,
  ],
  data() {
    return {
      service_id: "",
      category_id: "",
      customer_id: "",
      ticket_city: "",
      ticket_state: "",
      customer_name: "",
      ticket_pincode: "",
      ticket_address: "",
      service_type_id: "",
      component_name: "",
      requested_from: "",
      ticket_invoice_date: "",
      installation_date: "",
      additional_comments: "",
      service_center_name: "",
      ticket_creation_type: "",
      requested_component_quantity: "",
      service_ticket_description: "",
      ticket_warranty_type: "",
      support_type: "",
      ticket_invoice_number: "",
      noDataText: "",
      ticket_latitude: "",
      ticket_longitude: "",
      customer_email_id: "",
      customer_unique_id: "",
      customer_category_id: "",
      service_serial_number: "",
      customer_company_name: "",
      customer_type: "BUSINESS",
      customer_phone_number: "",
      customer_country_code: "+91",
      secondary_customer_contact: "",
      customer_secondary_country_code: "+91",
      overlay: false,
      renderComp: true,
      loading_btn: false,
      invoice_date: false,
      is_free_of_cost: false,
      dialogLookUpCustomer: false,
      installation_date_dialog: false,
      StoredObject: {},
      SnackBarComponent: {},
      GetProblem: [],
      categoryItems: [],
      GetAllAMCTypeList: [],
      tagged_territories: [],
      GetAllTerritoriesList: [],
      GetAllServiceCentersList: [],
      requested_from_items: [
        { text: "Own Stock", value: "OWN_STOCK" },
        { text: "Organization Stock", value: "ORG_STOCK" },
      ],
      ticket_warranty_type_items: [
        { text: "GUARANTEE", value: "GUARANTEE" },
        { text: "WARRANTY", value: "WARRANTY" },
        { text: "CONTRACT", value: "CONTRACT" },
        { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
        { text: "NONE", value: "NO_WARRANTY" },
      ],
      GetServiceByCategoriesList: [],
      GetAllCustomerCategoryList: [],
      GetAllComponentsByProductList: [],
      GetAllServiceTypeByServiceIDList: [],
      ticket_creation_type_items: [
        { text: "Breakdown", value: "BREAKDOWN" },
        { text: "Installation", value: "INSTALLATION" },
        { text: "Schedule Service", value: "SCHEDULE_SERVICE" },
        { text: "Core Service Job", value: "CORE_SERVICE_JOB" },
        { text: "Non-Core Service Job", value: "NON_CORE_SERVICE_JOB" },
        { text: "Sundary Job", value: "SUNDARY_JOB" },
        { text: "Other", value: "OTHER" },
      ],
      customer_type_items: ["INDIVIDUAL", "BUSINESS"],
    };
  },
  watch: {
    category_id(val) {
      this.GetServicesByCategoriesMethod(val);
    },
    service_id(val) {
      this.GetAllServiceTypeByServiceIDMethod(val);
      this.GetAllComponentsByServiceIDMethod(val);
    },
    ticket_warranty_type(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
  },
  mounted() {
    this.GetAllCustomerCategoryMethod("ACTIVE");
    this.GetAllOrganizationSettingsTypesMethod();
    this.GetAllOrganizationSettingsMethod("ACTIVE", "PROBLEM_DESCRIPTION");
    this.GetAllServiceCentersMethod("ACTIVE", undefined);
  },
  methods: {
    CreateMRFTicketEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    dialogLookUpCustomerEmit(Toggle, item) {
      this.dialogLookUpCustomer = false;
      if (Toggle == 2) {
        this.customer_latitude = item.customer_latitude;
        this.customer_longitude = item.customer_longitude;
        this.ticket_state = item.state;
        this.ticket_pincode = item.customer_pincode;
        this.ticket_latitude = item.customer_latitude;
        this.ticket_longitude = item.customer_longitude;
        this.ticket_city = item.city;
        this.customer_company_name = item.customer_company_name;
        this.customer_name = item.customer_name;
        this.customer_unique_id = item.customer_unique_id;
        this.customer_category_id = item.customer_category_id;
        this.customer_country_code = item.customer_primary_country_code;
        this.customer_secondary_country_code =
          item.customer_secondary_country_code;
        this.customer_phone_number = item.customer_primary_contact_number;
        this.secondary_customer_contact =
          item.customer_secondary_contact_number;
        this.ticket_address = item.customer_address;
        this.customer_id = item.customer_id;
        this.customer_type = item.customer_type;
        this.customer_email_id = item.customer_email_id;
        this.GetAllTerritoriesMethod(
          "ACTIVE",
          "NON_GEO_BASED",
          this.ticket_pincode != undefined &&
            this.ticket_pincode != null &&
            this.ticket_pincode != ""
            ? this.ticket_pincode
            : undefined,
          "TERRITORY_BY_PINCODE",
          undefined
        );
      }
    },
    async createMrfMethod() {
      if (this.$refs.form.validate()) {
        this.loading_btn = true;
        try {
          let ticket_dependency_details = [];
          let object = {
            category_id: this.category_id,
            service_id: this.service_id,
            service_type_id: this.service_type_id,
            support_type:
              this.support_type != undefined &&
              this.support_type != null &&
              this.support_type != ""
                ? this.support_type
                : undefined,
            is_free_of_cost:
              this.is_free_of_cost != undefined
                ? this.is_free_of_cost
                : undefined,
            ticket_warranty_type:
              this.ticket_warranty_type != undefined &&
              this.ticket_warranty_type != null &&
              this.ticket_warranty_type != ""
                ? this.ticket_warranty_type
                : undefined,
            service_ticket_description:
              this.service_ticket_description != undefined &&
              this.service_ticket_description != null &&
              this.service_ticket_description != ""
                ? this.service_ticket_description
                : undefined,
            ticket_creation_type:
              this.ticket_creation_type != undefined &&
              this.ticket_creation_type != null &&
              this.ticket_creation_type != ""
                ? this.ticket_creation_type
                : undefined,
            service_serial_number:
              this.service_serial_number != undefined &&
              this.service_serial_number != null &&
              this.service_serial_number != ""
                ? this.service_serial_number
                : undefined,
            installation_date:
              this.installation_date != undefined &&
              this.installation_date != null &&
              this.installation_date != ""
                ? this.installation_date
                : undefined,
            additional_comments:
              this.additional_comments != undefined &&
              this.additional_comments != null &&
              this.additional_comments != ""
                ? this.additional_comments
                : undefined,
            ticket_warranty_details:
              (this.ticket_invoice_number != undefined &&
                this.ticket_invoice_number != null &&
                this.ticket_invoice_number != "") ||
              (this.ticket_invoice_date != undefined &&
                this.ticket_invoice_date != null &&
                this.ticket_invoice_date != "")
                ? {
                    ticket_invoice_number:
                      this.ticket_invoice_number != undefined &&
                      this.ticket_invoice_number != null &&
                      this.ticket_invoice_number != ""
                        ? this.ticket_invoice_number
                        : undefined,
                    ticket_invoice_date:
                      this.ticket_invoice_date != undefined &&
                      this.ticket_invoice_date != null &&
                      this.ticket_invoice_date != ""
                        ? this.ticket_invoice_date
                        : undefined,
                  }
                : undefined,
          };
          ticket_dependency_details.push(object);
          let requested_components_list = [];
          let component_list = {
            component_id: this.component_name.component_id,
            component_name: this.component_name.component_name,
            requested_component_quantity: this.requested_component_quantity,
            service_center_name:
              this.service_center_name != undefined &&
              this.service_center_name != null &&
              this.service_center_name != ""
                ? this.service_center_name.service_center_name
                : undefined,
            service_center_id:
              this.service_center_name != undefined &&
              this.service_center_name != null &&
              this.service_center_name != ""
                ? this.service_center_name.service_center_id
                : undefined,
            requested_from:
              this.requested_from != undefined &&
              this.requested_from != null &&
              this.requested_from != ""
                ? this.requested_from
                : undefined,
          };
          requested_components_list.push(component_list);
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            customer_name: this.customer_name,
            ticket_latitude: this.ticket_latitude,
            ticket_longitude: this.ticket_longitude,
            customer_country_code: this.customer_country_code,
            customer_phone_number: this.customer_phone_number,
            customer_type: this.customer_type,
            ticket_address: this.ticket_address,
            ticket_dependency_details: ticket_dependency_details,
            requested_components_list: requested_components_list,
            tagged_territories:
              this.tagged_territories != undefined &&
              this.tagged_territories != null &&
              this.tagged_territories != []
                ? this.tagged_territories
                : undefined,
            ticket_city:
              this.ticket_city != undefined &&
              this.ticket_city != null &&
              this.ticket_city != ""
                ? this.ticket_city
                : undefined,
            ticket_state:
              this.ticket_state != undefined &&
              this.ticket_state != null &&
              this.ticket_state != ""
                ? this.ticket_state
                : undefined,
            ticket_pincode:
              this.ticket_pincode != undefined &&
              this.ticket_pincode != null &&
              this.ticket_pincode != ""
                ? this.ticket_pincode
                : undefined,
            secondary_customer_contact:
              this.secondary_customer_contact != undefined &&
              this.secondary_customer_contact != null &&
              this.secondary_customer_contact != ""
                ? this.secondary_customer_contact
                : undefined,
            customer_category_id:
              this.customer_category_id != undefined &&
              this.customer_category_id != null &&
              this.customer_category_id != ""
                ? this.customer_category_id
                : undefined,
            customer_email_id:
              this.customer_email_id != undefined &&
              this.customer_email_id != null &&
              this.customer_email_id != ""
                ? this.customer_email_id
                : undefined,
            customer_unique_id:
              this.customer_unique_id != undefined &&
              this.customer_unique_id != null &&
              this.customer_unique_id != ""
                ? this.customer_unique_id
                : undefined,
            customer_id:
              this.customer_id != undefined &&
              this.customer_id != null &&
              this.customer_id != ""
                ? this.customer_id
                : undefined,
            customer_company_name:
              this.customer_company_name != undefined &&
              this.customer_company_name != null &&
              this.customer_company_name != ""
                ? this.customer_company_name
                : undefined,
            tagged_territories:
              this.tagged_territories != [] &&
              this.tagged_territories != undefined &&
              this.tagged_territories != null
                ? this.tagged_territories
                : undefined,
          };
          let result = await API.graphql(
            graphqlOperation(CreateMRFTicket, {
              input: inputParams,
            })
          );
          this.loading_btn = false;
          var ResultObject = JSON.parse(result.data.CreateMRFTicket);
          if (ResultObject.status == "SUCCESS") {
            this.loading_btn = false;
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                timeout: 50,
                SnackbarText: ResultObject.status_message,
                Top: true,
              };
              this.renderComp = true;
            });
            this.CreateMRFTicketEmit(2);
          }
        } catch (error) {
          this.loading_btn = false;
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              timeout: 50,
              SnackbarText: error.errors[0].message,
              Top: true,
            };
            this.renderComp = true;
          });
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            timeout: 50,
            SnackbarText: "Fill all Mandatory Fields..!",
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>

<style></style>
