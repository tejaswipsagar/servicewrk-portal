<template>
  <div>
    <Overlay :overlay="overlay" />
    <AddExtendedWarranty
      :StoreObjExtendedWarranty="StoreObjExtendedWarranty"
      :AddExtendedWarrantyDialog="AddExtendedWarrantyDialog"
      @clicked="AddExtendedWarrantyDialogEmit"
    />
    <LookUpCustomerDialog
      :dialogLookUpCustomer="dialogLookUpCustomer"
      @clicked="dialogLookUpCustomerEmit"
    />
    <ViewScheduleVisitDate
      :StoreObjNew="StoreObjNew"
      :DialogViewScheduleVisitDates="DialogViewScheduleVisitDates"
      @clicked="DialogViewScheduleVisitDatesEmit"
    />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent :value="CreateUpdateProductFleetDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2">
            {{
              StoreObj.action == "CREATE"
                ? "Add Product Fleet"
                : "Edit and Tag Product Fleet"
            }}
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.setting_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="CreateUpdateProductFleetDialogEmit((Toggle = 1))"
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
                  :readonly="StoreObj.action == 'EDIT'"
                  @change="GetServicesByCategoriesMethod(categories)"
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
                  :disabled="!categories"
                  item-value="service_id"
                  item-text="service_name"
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="StoreObj.action == 'EDIT'"
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
                  :readonly="StoreObj.action == 'ADD_PRODUCT_TO_DB'"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3" class="mt-4">
                <v-text-field
                  dense
                  outlined
                  v-model="price"
                  class="FontSize"
                  label="Enter Price"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Description"
                  v-model="description"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-text-field
                  dense
                  outlined
                  label="Version"
                  class="FontSize"
                  v-model="software_version"
                ></v-text-field>
              </v-col>
              <v-col col="12" xs="12" sm="12" md="3">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Asset Number"
                  v-model="asset_number"
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
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    @input="manufacture_date = false"
                    v-model="product_manufactured_date"
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
                        @click.stop="dialogLookUpCustomer = true"
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
                        @click.stop="dialogLookUpCustomer = true"
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
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
var aws = require("aws-sdk");
import { Buffer } from "buffer";
window.Buffer = Buffer;
const uuid = require("uuid");
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddExtendedWarranty from "@/components/Product/Dialogs/AddExtendedWarranty.vue";
import LookUpCustomerDialog from "@/components/Tickets/Dialogs/LookUpCustomerDialog.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
import {
  CreateProductBasedSerialNumbers,
  UpdateProductBasedSerialNumbers,
} from "@/graphql/mutations.js";
import { UpdateWorkFlowStatusToApproved } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import { DeleteInvalidSerialNumber } from "@/graphql/mutations.js";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllProductFleetStatus } from "@/mixins/MastersSetting/GetAllProductFleetStatus.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  props: {
    StoreObj: Object,
    CreateUpdateProductFleetDialog: Boolean,
  },
  components: {
    Overlay,
    Snackbar,
    AddExtendedWarranty,
    LookUpCustomerDialog,
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
    dialogLookUpCustomer: false,
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
      if (this.StoreObj.action == "EDIT") {
        this.products = [...this.productsList]
          .filter((item) => item.service_id == this.StoreObj.product_id)
          .map((ppp) => {
            return ppp.service_id;
          })[0];
      }
    },
    CreateUpdateProductFleetDialog(val) {
      if (val == true) {
        this.GetAllProductFleetStatusMethod((this.setting_status = "ACTIVE"));
        this.GetAllServiceCentersMethod(this.service_center_status);
        this.GetAllOrganizationSettingsTypesMethod();
        if (this.StoreObj.action == "EDIT") {
          this.categories = this.StoreObj.category_id;
          this.products = this.StoreObj.product_id;
          this.GetServicesByCategoriesMethod(this.StoreObj.category_id);
          this.description = this.StoreObj.setting_description;
          this.product_manufactured_date =
            this.StoreObj.product_manufactured_date;
          this.asset_number = this.StoreObj.asset_number;
          this.software_version = this.StoreObj.software_version;
          this.organization_products_fleet_status =
            this.StoreObj.organization_products_fleet_status;
          this.serialNumber = this.StoreObj.setting_name;
          this.price = this.StoreObj.setting_price;
          this.service_center_id = this.StoreObj.service_center_name;
          this.s3_files =
            this.StoreObj.product_attachments != undefined &&
            this.StoreObj.product_attachments != null &&
            this.StoreObj.product_attachments.length != 0
              ? this.StoreObj.product_attachments
              : [];
          this.extended_warranty_details =
            this.StoreObj.extended_warranty_details != undefined &&
            this.StoreObj.extended_warranty_details != null &&
            this.StoreObj.extended_warranty_details.length != 0
              ? this.StoreObj.extended_warranty_details
              : [];
        } else if (this.StoreObj.action == "EDIT_TO_MAKE_VALID") {
          this.is_customer_tagged = this.StoreObj.customer_name ? true : false;
          this.product_manufactured_date =
            this.StoreObj.product_manufactured_date != "-"
              ? this.StoreObj.product_manufactured_date
              : "";
          this.serialNumber = this.StoreObj.setting_name;
          this.invoice_number = this.StoreObj.invoice_number;
          this.product_purchased_on =
            this.StoreObj.product_purchased_on != "-"
              ? this.StoreObj.product_purchased_on
              : "";
          this.invoice_date =
            this.StoreObj.invoice_date != "-" ? this.StoreObj.invoice_date : "";
          this.price = this.StoreObj.price;
          this.asset_number = this.StoreObj.asset_number;
          this.software_version = this.StoreObj.software_version;
          this.category_name = this.StoreObj.category_name;
          // this.customer_id = this.StoreObj.customer_id;
          // this.customer_name = this.StoreObj.customer_name;
          this.description = this.StoreObj.description;
          this.frequency = this.StoreObj.frequency;
          this.warranty_start_date =
            this.StoreObj.warranty_start_date != "-"
              ? this.StoreObj.warranty_start_date
              : "";
          this.warranty_end_date =
            this.StoreObj.warranty_end_date != "-"
              ? this.StoreObj.warranty_end_date
              : "";
          this.support_type = this.StoreObj.support_type;
          this.warranty_type = this.StoreObj.warranty_type;
          this.is_schedule_service = this.StoreObj.frequency ? true : false;
          this.organization_products_fleet_status =
            this.StoreObj.organization_products_fleet_status;
        } else if (this.StoreObj.action == "ADD_PRODUCT_TO_DB") {
          this.is_customer_tagged = true;
          this.customer_company_name = this.StoreObj.customer_company_name;
          this.customer_name = this.StoreObj.customer_name;
          this.serialNumber = this.StoreObj.setting_name;
          this.customer_id = this.StoreObj.customer_id;
          this.selected_files = this.StoreObj.product_attachment_file;
        }
        this.GetAllOrganizationSettingsTypesMethod();
      }
    },
    GetAllOrganizationSettingsTypesObject(val) {
      this.category_lists = val.categories_list;
    },
  },
  mounted() {},
  methods: {
    dialogLookUpCustomerEmit(Toggle, item) {
      this.dialogLookUpCustomer = false;
      if (Toggle == 2) {
        this.customer_name = item.customer_name;
        this.customer_company_name = item.customer_company_name;
        this.customer_id = item.customer_id;
      }
    },
    viewScheduleVisitDates(item) {
      this.StoreObjNew = item;
      this.DialogViewScheduleVisitDates = true;
    },
    async uploadMediaToS3() {
      this.isLoading = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
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
        if (i == this.selected_files.length - 1) {
          this.createEditProductBasedSerialNumberMethod();
        }
      }
    },
    checkItem(item) {
      window.open(item.file_url);
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
    getFilterMethod() {
      this.selected = this.StoreObj.products_fleet_list;
    },
    callAPI() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length != 0) {
          this.count = 0;
          this.uploadMediaToS3();
        } else {
          this.createEditProductBasedSerialNumberMethod(this.s3_files);
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
    },
    async createEditProductBasedSerialNumberMethod(s3URL) {
      if (
        this.StoreObj.action == "CREATE" ||
        this.StoreObj.action == "EDIT_TO_MAKE_VALID" ||
        this.StoreObj.action == "ADD_PRODUCT_TO_DB"
      ) {
        var mutationname = CreateProductBasedSerialNumbers;
        var mutaionresult = "CreateProductBasedSerialNumbers";
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          product_id: this.products,
          category_id: this.categories,
          setting_name: this.serialNumber,
        };
        if (
          this.extended_warranty_details != [] &&
          this.extended_warranty_details.length != 0 &&
          this.extended_warranty_details != undefined
        ) {
          inputParams.extended_warranty_details =
            this.extended_warranty_details;
        }
        if (
          this.description != undefined &&
          this.description != null &&
          this.description != ""
        ) {
          inputParams.setting_description = this.description;
        }
        if (this.s3_files.length != 0) {
          inputParams.product_attachments = this.s3_files;
        }
        if (
          this.product_manufactured_date != undefined &&
          this.product_manufactured_date != null &&
          this.product_manufactured_date != ""
        ) {
          inputParams.product_manufactured_date =
            this.product_manufactured_date;
        }
        if (
          this.software_version != undefined &&
          this.software_version != null &&
          this.software_version != ""
        ) {
          inputParams.software_version = this.software_version;
        }
        if (
          this.asset_number != undefined &&
          this.asset_number != null &&
          this.asset_number != ""
        ) {
          inputParams.asset_number = this.asset_number;
        }
        if (
          this.organization_products_fleet_status != undefined &&
          this.organization_products_fleet_status != null &&
          this.organization_products_fleet_status != ""
        ) {
          inputParams.organization_products_fleet_status =
            this.organization_products_fleet_status;
        }
        if (this.price != undefined && this.price != null && this.price != "") {
          inputParams.setting_price = this.price;
        }
        if (
          this.service_center_id != undefined &&
          this.service_center_id != null &&
          this.service_center_id != ""
        ) {
          inputParams.service_center_id =
            this.service_center_id.service_center_id;
          inputParams.service_center_name =
            this.service_center_id.service_center_name;
        }
        if (
          this.is_customer_tagged != undefined &&
          this.is_customer_tagged != null &&
          this.is_customer_tagged != ""
        ) {
          inputParams.is_customer_tagged = this.is_customer_tagged;
        }
        if (
          this.customer_id != undefined &&
          this.customer_id != null &&
          this.customer_id != ""
        ) {
          inputParams.customer_id = this.customer_id;
        }
        if (
          this.product_purchased_on != undefined &&
          this.product_purchased_on != null &&
          this.product_purchased_on != ""
        ) {
          inputParams.product_purchased_on = this.product_purchased_on;
        }
        if (
          this.product_manufactured_date != undefined &&
          this.product_manufactured_date != null &&
          this.product_manufactured_date != ""
        ) {
          inputParams.product_manufactured_date =
            this.product_manufactured_date;
        }
        if (
          this.warranty_start_date != undefined &&
          this.warranty_start_date != null &&
          this.warranty_start_date != ""
        ) {
          inputParams.warranty_start_date = this.warranty_start_date;
        }
        if (
          this.warranty_end_date != undefined &&
          this.warranty_end_date != null &&
          this.warranty_end_date != ""
        ) {
          inputParams.warranty_end_date = this.warranty_end_date;
        }
        if (
          this.support_type != undefined &&
          this.support_type != null &&
          this.support_type != ""
        ) {
          inputParams.support_type = this.support_type;
        }
        if (
          this.warranty_type != undefined &&
          this.warranty_type != null &&
          this.warranty_type != ""
        ) {
          inputParams.warranty_type = this.warranty_type;
        }
        if (
          this.is_schedule_service != undefined &&
          this.is_schedule_service != null &&
          this.is_schedule_service != ""
        ) {
          inputParams.is_schedule_service = this.is_schedule_service;
        }
        if (this.is_schedule_service == true) {
          inputParams.frequency = this.frequency;
        } else {
          inputParams.frequency = undefined;
        }
        if (
          this.invoice_number != undefined &&
          this.invoice_number != null &&
          this.invoice_number != ""
        ) {
          inputParams.invoice_number = this.invoice_number;
        }
        if (
          this.invoice_date != undefined &&
          this.invoice_date != null &&
          this.invoice_date != ""
        ) {
          inputParams.invoice_date = this.invoice_date;
        }
      } else if (this.StoreObj.action == "EDIT") {
        mutationname = UpdateProductBasedSerialNumbers;
        mutaionresult = "UpdateProductBasedSerialNumbers";
        inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          setting_id: this.StoreObj.setting_id,
          setting_name: this.serialNumber,
        };
        if (this.price != undefined && this.price != null && this.price != "") {
          inputParams.setting_price = this.price;
        }
        if (this.s3_files.length != 0) {
          inputParams.product_attachments = this.s3_files;
        }
        if (
          this.extended_warranty_details != [] &&
          this.extended_warranty_details.length != 0 &&
          this.extended_warranty_details != undefined
        ) {
          inputParams.extended_warranty_details =
            this.extended_warranty_details;
        }
        if (
          this.service_center_id != undefined &&
          this.service_center_id != null &&
          this.service_center_id != ""
        ) {
          inputParams.service_center_id =
            this.service_center_id.service_center_id;
        }
        if (
          this.software_version != undefined &&
          this.software_version != null &&
          this.software_version != ""
        ) {
          inputParams.software_version = this.software_version;
        }
        if (
          this.asset_number != undefined &&
          this.asset_number != null &&
          this.asset_number != ""
        ) {
          inputParams.asset_number = this.asset_number;
        }
        if (
          this.organization_products_fleet_status != undefined &&
          this.organization_products_fleet_status != null &&
          this.organization_products_fleet_status != ""
        ) {
          inputParams.organization_products_fleet_status =
            this.organization_products_fleet_status;
        }
        if (
          this.description != undefined &&
          this.description != null &&
          this.description != ""
        ) {
          inputParams.setting_description = this.description;
        }
        if (
          this.is_customer_tagged != undefined &&
          this.is_customer_tagged != null &&
          this.is_customer_tagged != ""
        ) {
          inputParams.is_customer_tagged = this.is_customer_tagged;
        }
        if (
          this.customer_id != undefined &&
          this.customer_id != null &&
          this.customer_id != ""
        ) {
          inputParams.customer_id = this.customer_id;
        }
        if (
          this.product_purchased_on != undefined &&
          this.product_purchased_on != null &&
          this.product_purchased_on != ""
        ) {
          inputParams.product_purchased_on = this.product_purchased_on;
        }
        if (
          this.product_manufactured_date != undefined &&
          this.product_manufactured_date != null &&
          this.product_manufactured_date != ""
        ) {
          inputParams.product_manufactured_date =
            this.product_manufactured_date;
        }
        if (
          this.warranty_start_date != undefined &&
          this.warranty_start_date != null &&
          this.warranty_start_date != ""
        ) {
          inputParams.warranty_start_date = this.warranty_start_date;
        }
        if (
          this.warranty_end_date != undefined &&
          this.warranty_end_date != null &&
          this.warranty_end_date != ""
        ) {
          inputParams.warranty_end_date = this.warranty_end_date;
        }
        if (
          this.support_type != undefined &&
          this.support_type != null &&
          this.support_type != ""
        ) {
          inputParams.support_type = this.support_type;
        }
        if (
          this.warranty_type != undefined &&
          this.warranty_type != null &&
          this.warranty_type != ""
        ) {
          inputParams.warranty_type = this.warranty_type;
        }
        if (
          this.is_schedule_service != undefined &&
          this.is_schedule_service != null &&
          this.is_schedule_service != ""
        ) {
          inputParams.is_schedule_service = this.is_schedule_service;
        }
        if (this.is_schedule_service == true) {
          inputParams.frequency = this.frequency;
        } else {
          inputParams.frequency = undefined;
        }
        if (
          this.invoice_number != undefined &&
          this.invoice_number != null &&
          this.invoice_number != ""
        ) {
          inputParams.invoice_number = this.invoice_number;
        }
        if (
          this.invoice_date != undefined &&
          this.invoice_date != null &&
          this.invoice_date != ""
        ) {
          inputParams.invoice_date = this.invoice_date;
        }
      }
      try {
        this.isLoading = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutaionresult]);
        if (ResultObject.status == "SUCCESS") {
          if (this.StoreObj.action != "ADD_PRODUCT_TO_DB") {
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
            this.CreateUpdateProductFleetDialogEmit((this.Toggle = 2));
          } else {
            this.UpdateWorkFlowStatusToApprovedMethod();
          }
          if (this.StoreObj.action == "EDIT_TO_MAKE_VALID") {
            try {
              var inputParams = {
                invalid_serial_id: this.StoreObj.invalid_excel_id,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
              };
              let result = await API.graphql(
                graphqlOperation(DeleteInvalidSerialNumber, {
                  input: inputParams,
                })
              );
              var ResultObject = JSON.parse(
                result.data.DeleteInvalidSerialNumber
              );
              if (ResultObject.status == "SUCCESS") {
                this.renderComp = false;
                this.$nextTick(() => {
                  this.SnackBarComponent = {
                    SnackbarVmodel: true,
                    SnackbarColor: "green",
                    Top: true,
                    SnackbarText:
                      "Invalid Serial Number Deleted Successfully !!!",
                  };
                  this.renderComp = true;
                });
              }
            } catch (error) {
              this.renderComp = false;
              this.$$nextTick(() => {
                this.SnackBarComponent = {
                  SnackbarVmodel: true,
                  SnackbarColor: "red",
                  Top: true,
                  SnackbarText: error.errors[0].message,
                };
                this.renderComp = true;
              });
            }
            this.GetAllInvalidCustomersMethod(undefined);
          }
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
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
    async UpdateWorkFlowStatusToApprovedMethod() {
      var mutationname = UpdateWorkFlowStatusToApproved;
      var mutaionresult = "UpdateWorkFlowStatusToApproved";
      var inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        user_id: this.$store.getters.get_current_user_details.user_id,
        workflow_id: this.StoreObj.workflow_id,
        action_type: "APPROVED",
      };
      try {
        this.isLoading = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutaionresult]);
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
          this.CreateUpdateProductFleetDialogEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.log("comingnignig");
        this.renderComp = false;
        this.$$nextTick(() => {
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
    CreateUpdateProductFleetDialogEmit(Toggle) {
      this.s3_files = [];
      this.selected_files = [];
      this.extended_warranty_details = [];
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
