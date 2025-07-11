<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <AddExtendedWarranty
      :StoreObjExtendedWarranty="StoreObjExtendedWarranty"
      :AddExtendedWarrantyDialog="AddExtendedWarrantyDialog"
      @clicked="AddExtendedWarrantyDialogEmit"
    />
    <DealerCustomerLookup
      :DealerCustomerLookupDialog="dealerCustomerLookupDialog"
      :DealerId="StoreObj1.dealer_id"
      @clicked="DealerCustomerLookupDialogEmit"
    />
    <ViewScheduleVisitDate
      :StoreObjNew="StoreObjNew"
      :DialogViewScheduleVisitDates="DialogViewScheduleVisitDates"
      @clicked="DialogViewScheduleVisitDatesEmit"
    />
    <v-dialog persistent :value="CreateProductDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <div>
            {{
              StoreObj1.action === "CUSTOMER_TAGGING"
                ? "Tag to customer"
                : "Create Product Fleet"
            }}
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="CreateProductDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-form ref="form">
            <v-row>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-autocomplete
                  dense
                  outlined
                  v-model="categories"
                  class="mt-4 FontSize"
                  :items="category_lists"
                  item-value="category_id"
                  label="Select Category *"
                  item-text="category_name"
                  :rules="[(v) => !!v || 'Required']"
                  @change="GetServicesByCategoriesMethod(categories)"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                >
                </v-autocomplete>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3" class="mt-4">
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  v-model="products"
                  :items="productsList"
                  :disabled="
                    !categories || StoreObj1.action === 'CUSTOMER_TAGGING'
                  "
                  item-value="service_id"
                  item-text="service_name"
                  :rules="[(v) => !!v || 'Required']"
                  :label="
                    !categories ? 'Select Category first' : 'Select Product *'
                  "
                >
                </v-autocomplete>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3" class="mt-4">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  v-model="serialNumber"
                  label="Enter Serial Number *"
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3" class="mt-4">
                <v-text-field
                  dense
                  outlined
                  v-model="price"
                  class="FontSize"
                  label="Enter Price"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Description"
                  v-model="description"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-text-field
                  dense
                  outlined
                  label="Version"
                  class="FontSize"
                  v-model="software_version"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Asset Number"
                  v-model="asset_number"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  item-text="setting_name"
                  label="Product Fleet Status"
                  :items="GetAllProductFleetStatusList"
                  v-model="organization_products_fleet_status"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                ></v-autocomplete>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3" class="mt-n5">
                <v-autocomplete
                  dense
                  outlined
                  return-object
                  class="FontSize mt-6"
                  v-model="service_center_id"
                  label="Select Service Center"
                  item-text="service_center_name"
                  :items="GetAllServiceCentersList"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                >
                </v-autocomplete>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3" class="mt-n5">
                <v-menu
                  offset-y
                  min-width="auto"
                  :nudge-right="40"
                  v-model="manufacture_date"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      v-on="on"
                      v-bind="attrs"
                      class="FontSize mt-5"
                      label="Manufacture Date"
                      prepend-inner-icon="mdi-calendar"
                      v-model="product_manufactured_date"
                      text-value="product_manufactured_date"
                      :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    @input="manufacture_date = false"
                    v-model="product_manufactured_date"
                    :readonly="StoreObj1.action === 'CUSTOMER_TAGGING'"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="3">
                <v-file-input
                  dense
                  outlined
                  multiple
                  v-model="files"
                  class="FontSize"
                  label="File Input"
                  :prepend-icon="null"
                ></v-file-input>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3" class="mt-n3">
                <v-checkbox
                  v-model="is_customer_tagged"
                  label="Tag this product to Customer"
                >
                </v-checkbox>
              </v-col>
            </v-row>
            <div>
              <v-row>
                <v-col cols="12" md="3" xs="12" sm="12">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    label="Customer"
                    class="FontSize"
                    v-model="customer_company_name"
                    :disabled="!is_customer_tagged"
                  >
                    <template v-slot:append>
                      <v-btn
                        icon
                        small
                        color="primary"
                        :disabled="!is_customer_tagged"
                        @click.stop="dealerCustomerLookupDialog = true"
                      >
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3" xs="12" sm="12">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    class="FontSize"
                    v-model="customer_name"
                    label="Contact Person *"
                    :disabled="!is_customer_tagged"
                  >
                    <template v-slot:append>
                      <v-btn
                        icon
                        small
                        color="primary"
                        :disabled="!is_customer_tagged"
                        @click.stop="dealerCustomerLookupDialog = true"
                      >
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="3">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    v-model="Invoice_date"
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
                        label="Invoice Date"
                        v-model="invoice_date"
                        text-value="invoice_date"
                        :disabled="!is_customer_tagged"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="invoice_date"
                      @input="Invoice_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="3">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Invoice Number"
                    v-model="invoice_number"
                    :disabled="!is_customer_tagged"
                  ></v-text-field>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="3">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="product_purchased_on_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize"
                        label="Installation Date"
                        v-model="product_purchased_on"
                        :disabled="!is_customer_tagged"
                        prepend-inner-icon="mdi-calendar"
                        text-value="product_purchased_on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="product_purchased_on"
                      @input="product_purchased_on_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="3">
                  <v-autocomplete
                    dense
                    outlined
                    label="Support"
                    class="FontSize"
                    :items="supportItems"
                    v-model="support_type"
                    item-text="text"
                    item-value="value"
                    :disabled="!is_customer_tagged"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="3">
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize"
                    label="Support Type"
                    v-model="warranty_type"
                    item-text="setting_name"
                    item-value="setting_name"
                    :items="GetAllAMCTypeList"
                    :disabled="!is_customer_tagged"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="3">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="warranty_start_date_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize"
                        label="Support Start Date"
                        v-model="warranty_start_date"
                        :disabled="!is_customer_tagged"
                        text-value="warranty_start_date"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="warranty_start_date"
                      @input="warranty_start_date_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="3">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="warranty_end_date_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize"
                        label="Support End Date"
                        v-model="warranty_end_date"
                        text-value="warranty_end_date"
                        :disabled="!is_customer_tagged"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="warranty_end_date"
                      :min="warranty_start_date + 1"
                      @input="warranty_end_date_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3" xs="12" sm="12">
                  <v-checkbox
                    class="mt-n2"
                    label="Is Schedule Service ?"
                    v-model="is_schedule_service"
                    :disabled="!is_customer_tagged"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="3" xs="12" sm="12">
                  <v-autocomplete
                    dense
                    outlined
                    item-text="text"
                    class="FontSize"
                    item-value="value"
                    v-model="frequency"
                    label="Frequency *"
                    :items="frequency_items"
                    :disabled="!is_customer_tagged"
                    :rules="
                      is_schedule_service == true
                        ? [(v) => !!v || 'Required']
                        : []
                    "
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" xs="12" sx="12">
                  <v-btn
                    small
                    color="primary"
                    :disabled="!is_customer_tagged"
                    @click="
                      (AddExtendedWarrantyDialog = true),
                        (StoreObjExtendedWarranty.action = 'ADD')
                    "
                  >
                    Add Extended Warranty
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-form>
          <v-row>
            <v-col cols="12" md="9" sm="12" xs="12">
              <div
                class="font-weight-bold"
                v-if="extended_warranty_details.length != 0"
              >
                Extended Warranties
              </div>
              <v-data-table
                dense
                class="elevation-0"
                :headers="extendedSupportHeaders"
                :items="extended_warranty_details"
                v-if="extended_warranty_details.length != 0"
              >
                <template v-slot:[`item.extendedWarrantyDatesList`]="{ item }">
                  <div>
                    {{ item.extendedWarrantyDatesList.length }}
                    <v-icon
                      small
                      color="primary"
                      @click="viewScheduleVisitDates(item)"
                      >mdi-calendar-question-outline</v-icon
                    >
                  </div>
                </template>
                <template v-slot:[`item.Actions`]="{ item }">
                  <v-btn
                    icon
                    small
                    @click="
                      extended_warranty_details.splice(
                        extended_warranty_details.indexOf(item),
                        1
                      )
                    "
                    ><v-icon color="red" small>mdi-delete</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" md="8">
              <div class="font-weight-bold" v-if="s3_files.length != 0">
                Files Added
              </div>
              <v-data-table
                dense
                :items="s3_files"
                class="elevation-0"
                :headers="s3_files_header"
                v-if="s3_files.length != 0"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ s3_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.file_name`]="{ item }">
                  <div class="FontSize">
                    {{ item.file_name }}
                  </div>
                </template>
                <template v-slot:[`item.file_type`]="{ item }">
                  <div class="FontSize">
                    {{ item.file_type }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn icon color="primary" @click="checkItem(item)">
                    <v-icon small>mdi-paperclip</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="red"
                    @click="s3_files.splice(s3_files.indexOf(item), 1)"
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
              <div
                v-if="selected_files.length != 0"
                class="font-weight-bold mt-n3"
              >
                Selected Files
              </div>
              <v-data-table
                dense
                class="elevation-0"
                :items="selected_files"
                :headers="selected_files_header"
                v-if="selected_files.length != 0"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ selected_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <div class="FontSize" v-if="item.name">
                    {{ item.name }}
                  </div>
                  <div class="FontSize" v-else>
                    {{ item.file_name }}
                  </div>
                </template>
                <template v-slot:[`item.type`]="{ item }">
                  <div class="FontSize" v-if="item.type">
                    {{ item.type }}
                  </div>
                  <div v-else class="FontSize">{{ item.file_type }}</div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn
                    icon
                    color="red"
                    @click="
                      selected_files.splice(selected_files.indexOf(item), 1)
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            @click="callAPI()"
            :loading="isLoading"
            class="white--text mb-2 mr-2"
            >{{
              StoreObj1.action === "CUSTOMER_TAGGING" ? "Tag" : "Confirm"
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddExtendedWarranty from "@/components/Product/Dialogs/AddExtendedWarranty.vue";
import DealerCustomerLookup from "@/components/Users/Dialogs/Dealer/DisplayDealerCustomer.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
import {
  CreateDealerProducts,
  TagProductToDealerOrPartnerCustomer,
} from "@/graphql/mutations.js";

import { API, graphqlOperation } from "aws-amplify";

import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllProductFleetStatus } from "@/mixins/MastersSetting/GetAllProductFleetStatus.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  props: {
    StoreObj1: Object,
    CreateProductDialog: Boolean,
  },
  components: {
    Snackbar,
    DealerCustomerLookup,
    AddExtendedWarranty,
    ViewScheduleVisitDate,
  },
  mixins: [
    GenerateS3URL,
    GetAllServices,
    GetAllServiceCenter,
    GetServicesByCategory,
    GetAllProductFleetStatus,
    GetAllOrganizationSetting,
    GetAllOrganizationSettingsTypesInMS,
  ],
  data: () => ({
    count: 0,
    price: 0,
    Toggle: 0,
    search: "",
    category: "",
    products: "",
    frequency: "",
    categories: "",
    product_id: "",
    service_id: "",
    customer_id: "",
    description: "",
    asset_number: "",
    invoice_date: "",
    support_type: "",
    serialNumber: "",
    customer_name: "",
    warranty_type: "",
    invoice_number: "",
    software_version: "",
    service_center_id: "",
    warranty_end_date: "",
    warranty_start_date: "",
    product_purchased_on: "",
    customer_company_name: "",
    product_manufactured_date: "",
    service_center_status: "ACTIVE",
    organization_products_fleet_status: "",
    menu2: false,
    loading: false,
    overlay: false,
    renderComp: true,
    isLoading: false,
    Invoice_date: false,
    singleSelect: false,
    manufacture_date: false,
    is_customer_tagged: false,
    is_schedule_service: false,
    dealerCustomerLookupDialog: false,
    warranty_end_date_date: false,
    warranty_start_date_date: false,
    AddExtendedWarrantyDialog: false,
    product_purchased_on_date: false,
    DialogViewScheduleVisitDates: false,
    files: [],
    files: [],
    s3_files: [],
    selected: [],
    s3_files: [],
    productsList: [],
    categoryItems: [],
    selected_files: [],
    category_lists: [],
    GetAllAMCTypeList: [],
    GetAllServicesList: [],
    GetServiceCentersList: [],
    GetAllServiceCentersList: [],
    extended_warranty_details: [],
    GetServiceByCategoriesList: [],
    GetAllProductFleetStatusList: [],
    extendedSupportHeaders: [
      { text: "Support", value: "extended_ticket_warranty_type" },
      { text: "Support Type", value: "extended_warranty_type" },
      { text: "Starts", value: "extendedWarrantyStartDate" },
      { text: "Ends", value: "extendedWarrantyEndEate" },
      { text: "Frequency", value: "extendedWarrantyFrequency" },
      { text: "No. of Visits", value: "extendedWarrantyDatesList" },
      { text: "Delete", value: "Actions" },
    ],
    supportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    customer_type_items: [
      { text: "INDIVIDUAL", value: "INDIVIDUAL" },
      { text: "BUSINESS", value: "BUSINESS" },
    ],
    frequency_items: [
      { text: "15 days", value: 15 },
      { text: "30 days", value: 30 },
      { text: "45 days", value: 45 },
      { text: "60 days", value: 60 },
      { text: "90 days", value: 90 },
      { text: "120 days", value: 120 },
      { text: "180 days", value: 180 },
      { text: "1 Year", value: 365 },
      { text: "1 Year 3 Months", value: 485 },
      { text: "1 Year 6 Months", value: 545 },
      { text: "2 Years", value: 730 },
      { text: "2 Years 6 Months", value: 910 },
      { text: "3 Years", value: 1095 },
      { text: "3 Years 6 Months", value: 1275 },
      { text: "4 Years", value: 1460 },
      { text: "4 Years 6 Months", value: 1640 },
      { text: "5 Years", value: 1825 },
    ],
    s3_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    StoreObjNew: {},
    SnackBarComponent: {},
    StoreObjExtendedWarranty: {},
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
  }),

  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    support_type() {
      this.GetAllAMCTypeMethod("ACTIVE", this.support_type);
    },
    GetServiceByCategoriesList(val) {
      this.productsList = val;
      if (this.StoreObj1.action == "EDIT") {
        this.products = [...this.productsList]
          .filter((item) => item.service_id == this.StoreObj1.product_id)
          .map((ppp) => {
            return ppp.service_id;
          })[0];
      }
    },
    CreateProductDialog(val) {
      if (val == true) {
        console.log("CHECK", this.StoreObj1);
        this.GetAllProductFleetStatusMethod((this.setting_status = "ACTIVE"));
        this.GetAllServiceCentersMethod(this.service_center_status);
        this.GetAllOrganizationSettingsTypesMethod();
        if (this.StoreObj1.action == "CUSTOMER_TAGGING") {
          console.log("UPDATE_PROD", this.StoreObj1);
          this.categories = this.StoreObj1.category_id || "";
          this.products = this.StoreObj1.product_id || "";
          this.GetServicesByCategoriesMethod(this.StoreObj1.category_id);
          this.description = this.StoreObj1.setting_description || "";
          this.asset_number = this.StoreObj1.asset_number || "";
          this.software_version = this.StoreObj1.software_version || "";
          this.organization_products_fleet_status =
            this.StoreObj1.organization_products_fleet_status || "";
          this.serialNumber = this.StoreObj1.setting_name || "";
          this.price = this.StoreObj1.setting_price || "";
          this.service_center_id = this.StoreObj1.service_center_name || "";
          this.s3_files =
            this.StoreObj1.product_attachments != undefined &&
            this.StoreObj1.product_attachments != null &&
            this.StoreObj1.product_attachments.length != 0
              ? this.StoreObj1.product_attachments
              : [];
          this.extended_warranty_details =
            this.StoreObj1.extended_warranty_details != undefined &&
            this.StoreObj1.extended_warranty_details != null &&
            this.StoreObj1.extended_warranty_details.length != 0
              ? this.StoreObj1.extended_warranty_details
              : [];
          this.is_customer_tagged = this.StoreObj1.customer_name ? true : false;
          this.product_manufactured_date =
            this.StoreObj1.product_manufactured_date != "-"
              ? this.StoreObj1.product_manufactured_date
              : "";

          this.invoice_number = this.StoreObj1.invoice_number || "";
          this.product_purchased_on =
            this.StoreObj1.product_purchased_on != "-"
              ? this.StoreObj1.product_purchased_on
              : "";
          this.invoice_date =
            this.StoreObj1.invoice_date != "-"
              ? this.StoreObj1.invoice_date
              : "";
          this.asset_number = this.StoreObj1.asset_number || "";
          this.software_version = this.StoreObj1.software_version || "";
          this.category_name = this.StoreObj1.category_name || "";
          this.customer_id = this.StoreObj1.customer_id || "";
          this.customer_name = this.StoreObj1.customer_name || "";
          this.description = this.StoreObj1.setting_description || "";
          this.frequency = this.StoreObj1.frequency || "";
          this.support_type = this.StoreObj1.support_type || "";
          this.warranty_type = this.StoreObj1.warranty_type || "";
          this.is_schedule_service = this.StoreObj1.frequency ? true : false;
          this.organization_products_fleet_status =
            this.StoreObj1.organization_products_fleet_status || "";
          this.selected_files = this.StoreObj1.product_attachment_file || [];
        }
        this.GetAllOrganizationSettingsTypesMethod();
      }
    },
    GetAllOrganizationSettingsTypesObject(val) {
      this.category_lists = val.categories_list;
    },
  },

  methods: {
    viewScheduleVisitDates(item) {
      this.StoreObjNew = item;
      this.DialogViewScheduleVisitDates = true;
    },

    async callAPI() {
      if (this.StoreObj1.action !== "CUSTOMER_TAGGING") {
        if (this.$refs.form.validate()) {
          if (this.selected_files.length > 0) {
            this.count = 0;
            this.uploadMediaToS3();
            this.createProductFleetApiMethod();
          } else {
            this.createProductFleetApiMethod();
          }
        } else if (!this.$refs.form.validate()) {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Fill all the required details",
            };
            this.renderComp = true;
          });
        }
      } else {
        await this.callCustomerTagApiMethod();
      }
    },

    async createProductFleetApiMethod() {
      try {
        this.isLoading = true;
        const result = await API.graphql(
          graphqlOperation(CreateDealerProducts, {
            input: {
              creator_user_id:
                this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              product_id: this.products,
              category_id: this.categories,
              setting_name: this.serialNumber,
              setting_description: this.description || undefined,
              setting_price: this.price || undefined,
              service_center_id:
                this.service_center_id.service_center_id || undefined,
              service_center_name:
                this.service_center_id.service_center_name || undefined,
              software_version: this.software_version || undefined,
              products_fleet_status: undefined,
              product_manufactured_date:
                this.product_manufactured_date || undefined,
              product_attachments:
                this.s3_files.length > 0 ? this.s3_files : undefined,
              organization_products_fleet_status:
                this.organization_products_fleet_status || undefined,
              is_customer_tagged: this.is_customer_tagged || undefined,
              customer_id: this.customer_id || undefined,
              product_purchased_on: this.product_purchased_on || undefined,
              warranty_start_date: this.warranty_start_date || undefined,
              warranty_end_date: this.warranty_end_date || undefined,
              support_type: this.support_type || undefined,
              warranty_type: this.warranty_type || undefined,
              invoice_number: this.invoice_number || undefined,
              invoice_date: this.invoice_date || undefined,
              is_schedule_service: this.is_schedule_service || undefined,
              frequency: this.frequency || undefined,
              asset_number: this.asset_number || undefined,
              dealer_partner_rep_id:
                this.StoreObj1.user_id || this.StoreObj1.dealer_id,
              extended_warranty_details:
                this.extended_warranty_details.length > 0
                  ? this.extended_warranty_details
                  : undefined,
            },
          })
        );
        const response = JSON.parse(result.data.CreateDealerProducts);
        if (response.status === "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = true;
          });
          this.CreateProductDialogEmit(2);
          this.isLoading = false;
        }
        console.log("CREATE_PROD_FLEET", result);
      } catch (error) {
        this.isLoading = false;
        //
      }
    },

    async callCustomerTagApiMethod() {
      try {
        this.isLoading = true;
        const customerTaggedResult = await API.graphql(
          graphqlOperation(TagProductToDealerOrPartnerCustomer, {
            input: {
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              dealer_partner_rep_id: this.StoreObj1.dealer_id,
              setting_id: this.StoreObj1.setting_id,
              customer_id: this.customer_id || undefined,
              product_purchased_on: this.product_purchased_on || undefined,
              warranty_start_date: this.warranty_start_date || undefined,
              warranty_end_date: this.warranty_end_date || undefined,
              support_type: this.support_type || undefined,
              warranty_type: this.warranty_type || undefined,
              invoice_number: this.invoice_number || undefined,
              invoice_date: this.invoice_date || undefined,
              is_schedule_service: this.is_schedule_service,
              frequency: this.frequency || undefined,
              extended_warranty_details:
                this.extended_warranty_details.length > 0
                  ? this.extended_warranty_details
                  : undefined,
              asset_number: this.asset_number || undefined,
              setting_description: this.description || undefined,
              setting_price: this.price || undefined,
            },
          })
        );
        console.log("CUSTOMER_TAGGED", customerTaggedResult);
        const response = JSON.parse(
          customerTaggedResult.data.TagProductToDealerOrPartnerCustomer
        );
        if (response.status === "SUCCESS") {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = true;
          });
          this.CreateProductDialogEmit(2);
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
        console.log("Error", error);
      }
    },

    async uploadMediaToS3() {
      this.isLoading = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}`,
          this.selected_files[i]
        );
        let Obj = {
          file_name:
            this.selected_files[i].name != undefined
              ? this.selected_files[i].name
              : this.selected_files[i].file_name,
          file_type:
            this.selected_files[i].type != undefined
              ? this.selected_files[i].type
              : this.selected_files[i].file_type,
          file_url: result.profile_pic_url,
        };
        this.s3_files.push(Obj);
        // if (i == this.selected_files.length - 1) {
        //   this.createProductFleetApiMethod();
        // }
      }
    },

    DealerCustomerLookupDialogEmit(Toggle, item) {
      this.dealerCustomerLookupDialog = false;
      if (Toggle == 2) {
        this.customer_name = item.customer_name;
        this.customer_company_name = item.customer_company_name;
        this.customer_id = item.customer_id;
      }
    },

    CreateProductDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.files = [];
      this.selected_files = [];
      this.extended_warranty_details = [];
      this.$refs.form.reset();
    },

    AddExtendedWarrantyDialogEmit(item) {
      if (item != undefined) {
        this.extended_warranty_details.push(item);
      }
      this.AddExtendedWarrantyDialog = false;
    },

    DialogViewScheduleVisitDatesEmit() {
      this.DialogViewScheduleVisitDates = false;
    },
  },
};
</script>
