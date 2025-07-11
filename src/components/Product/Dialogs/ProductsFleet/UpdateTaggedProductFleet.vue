<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <ViewScheduleVisitDate
      :StoreObjNew="StoreObjNew"
      :DialogViewScheduleVisitDates="DialogViewScheduleVisitDates"
      @clicked="DialogViewScheduleVisitDatesEmit"
    />
    <AddExtendedWarranty
      :StoreObjExtendedWarranty="StoreObjExtendedWarranty"
      :AddExtendedWarrantyDialog="AddExtendedWarrantyDialog"
      @clicked="AddExtendedWarrantyDialogEmit"
    />
    <AddSupportedWarrantyDialog
      :AddSupportedWarrantyDialog="AddSupportedWarrantyDialog"
      :StoreObjExtendedWarranty="StoreObjExtendedWarranty"
      @clicked="AddSupportWarrantyDialogEmit"
    />
    <DialogUpdateDateOnRFTDateList
      :DialogUpdateDateOnRFTDateList="DialogUpdateDateOnRFTDateList"
      :StoreObjNew="StoreObjNew"
      @clicked="DialogUpdateDateOnRFTDateListEmit"
    />
    <v-dialog
      :value="AddUpdateProductFleetDialog"
      persistent
      max-width="1200px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small>mdi-pencil-plus</v-icon>
            Update Tagged Product Fleet
            <span>{{ StoreObjForTaggedProductFleet.setting_name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="AddUpdateProductFleetDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-row class="mt-3">
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                disabled
                label="Customer"
                class="FontSize"
                v-model="customer_company_name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                disabled
                class="FontSize"
                v-model="customer_name"
                label="Contact Person *"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                readonly
                disabled
                class="FontSize"
                label="Category Name"
                v-model="category_name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                readonly
                disabled
                class="FontSize"
                label="Product Name"
                v-model="product_name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                readonly
                disabled
                class="FontSize"
                label="Serial Number"
                v-model="product_sl_no"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                label="Price"
                type="number"
                class="FontSize"
                v-model="product_price"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                class="FontSize"
                label="Asset Number"
                v-model="asset_number"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                class="FontSize"
                label="Version"
                v-model="software_version"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                class="FontSize"
                label="Description"
                v-model="product_description"
              >
              </v-text-field>
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
            <v-col cols="12" md="3">
              <v-text-field
                dense
                outlined
                class="FontSize"
                label="Invoice Number"
                v-model="invoice_number"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-menu
                offset-y
                min-width="auto"
                :nudge-right="40"
                v-model="invoiceDate"
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
                    prepend-inner-icon="mdi-calendar"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="invoice_date"
                  @input="invoiceDate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3">
              <v-menu
                offset-y
                min-width="auto"
                :nudge-right="40"
                v-model="installationDate"
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
                    v-model="product_purchased_on"
                    prepend-inner-icon="mdi-calendar"
                    text-value="product_purchased_on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="product_purchased_on"
                  @input="installationDate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
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
                    class="FontSize"
                    label="Manufacture Date"
                    prepend-inner-icon="mdi-calendar"
                    v-model="product_manufactured_date"
                    text-value="product_manufactured_date"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="product_manufactured_date"
                  @input="manufacture_date = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3" class="mt-n4">
              <v-autocomplete
                dense
                outlined
                label="Support"
                class="FontSize mt-4"
                :items="supportItems"
                v-model="support_type"
                @change="changeSupportType()"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" class="mt-n4">
              <v-autocomplete
                dense
                outlined
                label="Support Type"
                class="FontSize mt-4"
                v-model="warranty_type"
                item-text="setting_name"
                item-value="setting_name"
                :items="GetAllAMCTypeList"
                @change="changeWarrantyType()"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-menu
                offset-y
                min-width="auto"
                :nudge-right="40"
                v-model="support_start_date"
                transition="scale-transition"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Support Start Date"
                    v-model="warranty_start_date"
                    text-value="warranty_start_date"
                    prepend-inner-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="warranty_start_date"
                  :max="warranty_end_date"
                  @input="changeStartDate()"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3">
              <v-menu
                offset-y
                min-width="auto"
                :nudge-right="40"
                v-model="support_end_date"
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
                    label="Support End Date"
                    v-model="warranty_end_date"
                    text-value="warranty_end_date"
                    prepend-inner-icon="mdi-calendar"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="warranty_end_date"
                  :min="warranty_start_date + 1"
                  @input="changeEndDate()"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-autocomplete
                dense
                outlined
                class="FontSize"
                label="Frequency"
                :items="frequency_items"
                v-model="ticket_frequency"
                @change="changeFrequency()"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3" xs="12" sm="12">
              <v-btn
                small
                color="primary"
                @click="
                  (AddExtendedWarrantyDialog = true),
                    (StoreObjExtendedWarranty.action = 'ADD')
                "
              >
                Add Extended Warranty
              </v-btn>
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
          </v-row>
          <v-row
            v-if="this.supportTableItems.length != 0"
            style="border: 1px solid"
          >
            <v-col cols="12" md="10" xs="12" sm="12">
              <div class="font-weight-bold">Support Details</div>
              <v-data-table
                dense
                class="elevation-0"
                hide-default-footer
                :items="supportTableItems"
                :headers="normalSupportHeaders"
              >
                <template v-slot:[`item.ticket_frequency`]="{ item }">
                  <div
                    class="FontSize"
                    v-if="item.ticket_frequency != undefined"
                  >
                    {{ item.ticket_frequency }}
                  </div>
                  <div v-else>0</div>
                </template>
                <template v-slot:[`item.rft_date_list`]="{ item }">
                  <div
                    v-if="item.rft_date_list && item.rft_date_list.length > 0"
                  >
                    {{ item.rft_date_list.length }}
                    <v-icon
                      color="primary"
                      small
                      @click="viewScheduleVisitDates(item, 'RFT_Ticket')"
                      >mdi-calendar-question-outline</v-icon
                    >
                  </div>
                  <div v-else>0</div>
                </template>
                <template v-slot:[`item.Actions`]="{ item }">
                  <v-btn
                    icon
                    @click.stop="
                      editSupportwarrantyMethod(
                        item,
                        'UPDATE',
                        supportTableItems.indexOf(item)
                      )
                    "
                    ><v-icon color="primary" small
                      >mdi-pencil-plus</v-icon
                    ></v-btn
                  >
                  <v-btn icon
                    ><v-icon color="red" small>mdi-delete</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row
            v-if="extended_warranty_details.length != 0"
            style="border-style: none solid solid solid; border-width: 1px"
          >
            <v-col cols="12" md="10" sm="12" xs="12">
              <div
                class="font-weight-bold"
                v-if="extended_warranty_details.length != 0"
              >
                Extended Support Details
              </div>
              <v-data-table
                v-if="extended_warranty_details.length != 0"
                dense
                class="elevation-0"
                :headers="mantainanceDatesHeader"
                :items="extended_warranty_details"
                hide-default-footer
              >
                <template v-slot:[`item.extendedWarrantyDatesList`]="{ item }">
                  <div v-if="item.extendedWarrantyDatesList.length != 0">
                    {{ item.extendedWarrantyDatesList.length }}
                    <v-icon
                      color="primary"
                      small
                      @click="viewScheduleVisitDates(item, 'Extended_Warranty')"
                      >mdi-calendar-question-outline</v-icon
                    >
                  </div>
                </template>
                <template v-slot:[`item.Actions`]="{ item }">
                  <v-btn
                    icon
                    @click="
                      editExtendedWarranty(
                        item,
                        'UPDATE',
                        extended_warranty_details.indexOf(item)
                      )
                    "
                    ><v-icon color="primary" small
                      >mdi-pencil-plus</v-icon
                    ></v-btn
                  >
                  <v-btn
                    icon
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
          </v-row>
          <v-row>
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
                v-if="selected_files.length != 0"
                dense
                class="elevation-0"
                :headers="selected_files_header"
                :items="selected_files"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ selected_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <div class="FontSize">
                    {{ item.name }}
                  </div>
                </template>
                <template v-slot:[`item.type`]="{ item }">
                  <div class="FontSize">
                    {{ item.type }}
                  </div>
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
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="validateMethod()"
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
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddExtendedWarranty from "@/components/Product/Dialogs/AddExtendedWarranty.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
import AddSupportedWarrantyDialog from "@/components/Product/Dialogs/ProductsFleet/AddSupportWarranty.vue";
import DialogUpdateDateOnRFTDateList from "@/components/Product/Dialogs/ProductsFleet/UpdateDateOnRFTDateList.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { EditOrUntagCustomerTaggedProduct } from "@/graphql/mutations.js";
import { GetAllProductFleetStatus } from "@/mixins/MastersSetting/GetAllProductFleetStatus.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
export default {
  props: {
    AddUpdateProductFleetDialog: Boolean,
    StoreObjForTaggedProductFleet: Object,
  },
  components: {
    Snackbar,
    AddExtendedWarranty,
    ViewScheduleVisitDate,
    AddSupportedWarrantyDialog,
    DialogUpdateDateOnRFTDateList,
  },
  mixins: [GetAllOrganizationSetting, GetAllProductFleetStatus, GenerateS3URL],
  data: () => ({
    Toggle: 0,
    ticket_frequency: 0,
    invoice_date: "",
    product_sl_no: "",
    product_name: "",
    category_name: "",
    customer_name: "",
    product_price: "",
    support_type: "",
    asset_number: "",
    warranty_type: "",
    invoice_number: "",
    software_version: "",
    warranty_end_date: "",
    warranty_start_date: "",
    product_description: "",
    product_purchased_on: "",
    customer_company_name: "",
    product_manufactured_date: "",
    organization_products_fleet_status: "",
    loading: false,
    renderComp: true,
    invoiceDate: false,
    support_end_date: false,
    manufacture_date: false,
    installationDate: false,
    support_start_date: false,
    AddExtendedWarrantyDialog: false,
    DialogViewScheduleVisitDates: false,
    AddSupportedWarrantyDialog: false,
    DialogUpdateDateOnRFTDateList: false,
    forBool: false,
    files: [],
    s3_files: [],
    rft_date_list: [],
    selected_files: [],
    supportTableItems: [],
    GetAllAMCTypeList: [],
    extended_warranty_details: [],
    normal_warranty_date_list: [],
    GetAllProductFleetStatusList: [],
    frequency_items: [15, 30, 45, 60, 90, 120, 180, 240, 270, 365],
    normalSupportHeaders: [
      { text: "Support", value: "support_type" },
      { text: "Support Type", value: "warranty_type" },
      { text: "Starts", value: "warranty_start_date" },
      { text: "Ends", value: "warranty_end_date" },
      { text: "Frequency", value: "ticket_frequency" },
      { text: "No. of Visits", value: "rft_date_list" },
      { text: "Actions", value: "Actions" },
    ],
    mantainanceDatesHeader: [
      { text: "Support", value: "extended_ticket_warranty_type" },
      { text: "Support Type", value: "extended_warranty_type" },
      { text: "Starts", value: "extendedWarrantyStartDate" },
      { text: "Ends", value: "extendedWarrantyEndEate" },
      { text: "Frequency", value: "extendedWarrantyFrequency" },
      { text: "No. of Visits", value: "extendedWarrantyDatesList" },
      { text: "Actions", value: "Actions" },
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
    supportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    StoreObjNew: {},
    SnackBarComponent: {},
    StoreObjExtendedWarranty: {},
    EditedObject: {},
    EditedSupportObject: {},
  }),
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
          console.log("FILE_VAALLL88", val);
        }
      }
    },
    support_type(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    AddUpdateProductFleetDialog(val) {
      if (val == true) {
        console.log(
          "this.StoreObjForTaggedProductFleet",
          this.StoreObjForTaggedProductFleet
        );
        this.rft_date_list = this.StoreObjForTaggedProductFleet.rft_date_list;
        this.customer_name = this.StoreObjForTaggedProductFleet.customer_name;
        this.customer_company_name =
          this.StoreObjForTaggedProductFleet.customer_company_name;
        this.category_name = this.StoreObjForTaggedProductFleet.category_name;
        this.product_name = this.StoreObjForTaggedProductFleet.product_name;
        this.product_sl_no =
          this.StoreObjForTaggedProductFleet.setting_name != undefined
            ? this.StoreObjForTaggedProductFleet.setting_name
            : this.StoreObjForTaggedProductFleet.product_sl_no;
        this.invoice_number =
          this.StoreObjForTaggedProductFleet.invoice_number != undefined
            ? this.StoreObjForTaggedProductFleet.invoice_number
            : undefined;
        this.organization_products_fleet_status =
          this.StoreObjForTaggedProductFleet
            .organization_products_fleet_status != undefined
            ? this.StoreObjForTaggedProductFleet
                .organization_products_fleet_status
            : undefined;
        this.invoice_date =
          this.StoreObjForTaggedProductFleet.invoice_date != "-"
            ? this.StoreObjForTaggedProductFleet.invoice_date
            : "";
        this.product_purchased_on =
          this.StoreObjForTaggedProductFleet.product_purchased_on != "-"
            ? this.StoreObjForTaggedProductFleet.product_purchased_on
            : "";
        this.product_price = this.StoreObjForTaggedProductFleet.setting_price;
        this.product_description =
          this.StoreObjForTaggedProductFleet.setting_description;
        this.asset_number = this.StoreObjForTaggedProductFleet.asset_number;
        this.software_version =
          this.StoreObjForTaggedProductFleet.software_version;
        this.warranty_start_date =
          this.StoreObjForTaggedProductFleet.warranty_start_date != "-"
            ? this.StoreObjForTaggedProductFleet.warranty_start_date
            : "";
        this.product_manufactured_date =
          this.StoreObjForTaggedProductFleet.product_manufactured_date != "-"
            ? this.StoreObjForTaggedProductFleet.product_manufactured_date
            : "";
        this.warranty_end_date =
          this.StoreObjForTaggedProductFleet.warranty_end_date != "-"
            ? this.StoreObjForTaggedProductFleet.warranty_end_date
            : "";
        this.support_type =
          this.StoreObjForTaggedProductFleet.support_type != undefined
            ? this.StoreObjForTaggedProductFleet.support_type.includes(" ")
              ? this.StoreObjForTaggedProductFleet.support_type.replace(
                  " ",
                  "_"
                )
              : this.StoreObjForTaggedProductFleet.support_type
            : undefined;
        setTimeout(() => {
          this.warranty_type = this.StoreObjForTaggedProductFleet.warranty_type;
        }, 800);
        this.ticket_frequency =
          this.StoreObjForTaggedProductFleet.ticket_frequency != undefined
            ? this.StoreObjForTaggedProductFleet.ticket_frequency
            : this.StoreObjForTaggedProductFleet.frequency;
        this.s3_files =
          this.StoreObjForTaggedProductFleet.product_attachments != undefined &&
          this.StoreObjForTaggedProductFleet.product_attachments != null &&
          this.StoreObjForTaggedProductFleet.product_attachments.length != 0
            ? this.StoreObjForTaggedProductFleet.product_attachments
            : [];
        this.extended_warranty_details =
          this.StoreObjForTaggedProductFleet.extended_warranty_details !=
            undefined &&
          this.StoreObjForTaggedProductFleet.extended_warranty_details !=
            null &&
          this.StoreObjForTaggedProductFleet.extended_warranty_details.length !=
            0
            ? this.StoreObjForTaggedProductFleet.extended_warranty_details
            : [];
        if (
          this.warranty_end_date != undefined &&
          this.warranty_end_date != ""
        ) {
          setTimeout(() => {
            this.supportTableItems.push({
              support_type: this.support_type,
              warranty_type: this.warranty_type,
              warranty_start_date: this.warranty_start_date,
              warranty_end_date: this.warranty_end_date,
              ticket_frequency: this.ticket_frequency,
              rft_date_list: this.rft_date_list,
            });

            console.log("this.supportTableItems", this.supportTableItems);
            // this.changeFrequency();
          }, 1000);
        }
      }
    },
    // ticket_frequency(val) {
    //   console.log("val", val);
    //   console.log("this.warranty_start_date", this.warranty_start_date);
    //   console.log("this.warranty_start_date", this.warranty_start_date);
    //   if (
    //     val != 0 &&
    //     this.warranty_start_date != "" &&
    //     this.warranty_end_date != ""
    //   ) {
    //     this.changeFrequency();
    //   }
    // },
  },
  mounted() {
    this.GetAllProductFleetStatusMethod("ACTIVE");
  },
  methods: {
    changeStartDate() {
      this.supportTableItems[0].warranty_start_date = this.warranty_start_date;
      this.support_start_date = false;
      this.changeFrequency();
    },
    changeEndDate() {
      this.supportTableItems[0].warranty_end_date = this.warranty_end_date;
      this.support_end_date = false;
      this.changeFrequency();
    },
    changeSupportType() {
      this.supportTableItems[0].support_type = this.support_type;
      this.supportTableItems[0].warranty_type = "";
    },
    changeWarrantyType() {
      this.supportTableItems[0].warranty_type = this.warranty_type;
    },
    changeFrequency() {
      this.supportTableItems[0].ticket_frequency = this.ticket_frequency;

      let startDateParts = this.warranty_start_date.split("-");
      let endDateParts = this.warranty_end_date.split("-");

      if (startDateParts.length < 3 || endDateParts.length < 3) {
        console.error("Invalid date format");
        return;
      }

      let startDate =
        new Date(
          parseInt(startDateParts[0]),
          parseInt(startDateParts[1]) - 1,
          parseInt(startDateParts[2])
        ).getTime() / 1000; // Convert to epoch (seconds)

      let endDate =
        new Date(
          parseInt(endDateParts[0]),
          parseInt(endDateParts[1]) - 1,
          parseInt(endDateParts[2])
        ).getTime() / 1000; // Convert to epoch (seconds)

      if (startDate >= endDate) {
        console.error("Start date must be before end date.");
        return;
      }

      let generatedDates = [];
      let current = startDate;
      let counter = 0;
      let maxIterations = 1000;

      while (current <= endDate && counter < maxIterations) {
        generatedDates.push(current);
        current += this.ticket_frequency * 24 * 60 * 60;
        counter++;
      }

      if (counter >= maxIterations) {
        console.warn(
          "Loop stopped to prevent browser freeze. Check frequency value."
        );
      }

      this.supportTableItems[0].rft_date_list = generatedDates;
    },
    frequencyCalculate() {},
    editExtendedWarranty(item, action, index) {
      console.log("this.EditedObject", this.EditedObject);
      if (this.EditedObject && Object.keys(this.EditedObject).length > 0) {
        this.StoreObjExtendedWarranty = this.EditedObject;
        this.StoreObjExtendedWarranty.action = "EDITED";
      } else {
        this.StoreObjExtendedWarranty = item;
        this.StoreObjExtendedWarranty.action = action;
      }
      this.StoreObjExtendedWarranty.index = index;
      this.forBool = true;
      this.AddExtendedWarrantyDialog = true;
    },
    editSupportwarrantyMethod(item, action, index) {
      if (
        this.EditedSupportObject &&
        Object.keys(this.EditedSupportObject).length > 0
      ) {
        this.StoreObjExtendedWarranty = this.EditedSupportObject;
        this.StoreObjExtendedWarranty.action = "EDITED";
      } else {
        this.StoreObjExtendedWarranty = item;
        this.StoreObjExtendedWarranty.action = action;
      }
      this.StoreObjExtendedWarranty.index = index;
      this.AddSupportedWarrantyDialog = true;
    },
    // callMethod() {
    //   if (
    //     this.ticket_frequency != undefined &&
    //     this.ticket_frequency != 0 &&
    //     this.ticket_frequency != ""
    //   ) {
    //     let normal_warranty_start_date = new Date(
    //       parseInt(this.warranty_start_date.split("-")[0]),
    //       parseInt(this.warranty_start_date.split("-")[1]) - 1,
    //       parseInt(this.warranty_start_date.split("-")[2])
    //     ).getTime();
    //     let normal_warranty_end_date = new Date(
    //       parseInt(this.warranty_end_date.split("-")[0]),
    //       parseInt(this.warranty_end_date.split("-")[1]) - 1,
    //       parseInt(this.warranty_end_date.split("-")[2])
    //     ).getTime();
    //     this.normal_warranty_date_list = [];
    //     while (normal_warranty_start_date < normal_warranty_end_date) {
    //       this.normal_warranty_date_list.push(normal_warranty_start_date);
    //       normal_warranty_start_date +=
    //         this.ticket_frequency * 24 * 60 * 60 * 1000;
    //     }
    //     return this.normal_warranty_date_list;
    //   }
    // },
    AddExtendedWarrantyDialogEmit(item) {
      if (item != undefined) {
        this.EditedObject = item;
        if (
          item.action != undefined &&
          (item.action == "UPDATE" || item.action == "EDITED") &&
          item.index != undefined
        ) {
          this.extended_warranty_details[
            item.index
          ].extended_ticket_warranty_type = item.extended_ticket_warranty_type;
          this.extended_warranty_details[item.index].extended_warranty_type =
            item.extended_warranty_type;
          this.extended_warranty_details[item.index].extendedWarrantyStartDate =
            item.extendedWarrantyStartDate;
          this.extended_warranty_details[item.index].extendedWarrantyEndEate =
            item.extendedWarrantyEndEate;
          this.extended_warranty_details[item.index].extendedWarrantyFrequency =
            item.extendedWarrantyFrequency;
          this.extended_warranty_details[item.index].extendedWarrantyDatesList =
            item.extendedWarrantyDatesList;
          this.extended_warranty_details[item.index].index = undefined;
          this.extended_warranty_details[item.index].action = undefined;
        } else {
          this.extended_warranty_details.push(item);
        }
      }
      this.forBool = true;
      this.AddExtendedWarrantyDialog = false;
    },
    AddSupportWarrantyDialogEmit(item) {
      console.log("EditedSupportObject", item);
      if (item != undefined) {
        this.EditedSupportObject = item;
        if (
          item.action != undefined &&
          (item.action == "UPDATE" || item.action == "EDITED") &&
          item.index != undefined
        ) {
          this.supportTableItems[item.index].support_type = item.support_type;
          this.support_type = item.support_type;
          this.supportTableItems[item.index].warranty_type = item.warranty_type;
          this.warranty_type = item.warranty_type;
          this.supportTableItems[item.index].warranty_start_date =
            item.warranty_start_date;
          this.supportTableItems[item.index].warranty_end_date =
            item.warranty_end_date;
          this.supportTableItems[item.index].ticket_frequency =
            item.ticket_frequency;
          this.supportTableItems[item.index].rft_date_list =
            item.normal_warranty_date_list;
          this.supportTableItems[item.index].index = undefined;
          this.supportTableItems[item.index].action = undefined;
        } else {
          this.supportTableItems.push(item);
        }
      }
      this.AddSupportedWarrantyDialog = false;
    },
    checkItem(item) {
      window.open(item.file_url);
    },
    DialogViewScheduleVisitDatesEmit() {
      this.DialogViewScheduleVisitDates = false;
    },
    viewScheduleVisitDates(item, action) {
      console.log("CHECK_TEJJ", item);
      this.StoreObjNew = item;
      if (action == "Extended_Warranty") {
        this.DialogViewScheduleVisitDates = true;
      } else if (action == "RFT_Ticket") {
        this.DialogUpdateDateOnRFTDateList = true;
      }
    },
    async uploadMediaToS3() {
      this.loading = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
        };
        this.s3_files.push(Obj);
        if (i == this.selected_files.length - 1) {
          this.activateInactivateMethod();
        }
      }
    },
    validateMethod() {
      if (this.selected_files.length != 0) {
        this.count = 0;
        this.uploadMediaToS3();
      } else {
        this.activateInactivateMethod(this.s3_files);
      }
    },
    async activateInactivateMethod() {
      var mutationname = EditOrUntagCustomerTaggedProduct;
      var mutationresult = "EditOrUntagCustomerTaggedProduct";
      var inputParams = {
        user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        customer_id: this.StoreObjForTaggedProductFleet.customer_id,
        product_id: this.StoreObjForTaggedProductFleet.product_id,
        setting_id: this.StoreObjForTaggedProductFleet.setting_id,
        action: "SAVE",
      };
      if (
        this.extended_warranty_details != [] &&
        this.extended_warranty_details.length != 0 &&
        this.extended_warranty_details != undefined
      ) {
        inputParams.extended_warranty_details = this.extended_warranty_details;
        inputParams.is_extended_warranty_edited =
          this.forBool === true ? true : undefined;
      }
      if (
        this.product_description != "" &&
        this.product_description != null &&
        this.product_description != undefined
      ) {
        inputParams.product_description = this.product_description;
      }
      if (
        this.asset_number != "" &&
        this.asset_number != null &&
        this.asset_number != undefined
      ) {
        inputParams.asset_number = this.asset_number;
      }
      if (
        this.software_version != undefined &&
        this.software_version != null &&
        this.software_version != ""
      ) {
        inputParams.software_version = this.software_version;
      }
      if (this.s3_files.length != 0) {
        inputParams.product_attachments = this.s3_files;
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
        this.product_price != "" &&
        this.product_price != null &&
        this.product_price != undefined
      ) {
        inputParams.product_price = this.product_price;
      }
      if (
        this.product_purchased_on != "" &&
        this.product_purchased_on != null &&
        this.product_purchased_on != undefined
      ) {
        inputParams.product_purchased_on = this.product_purchased_on;
      }
      if (
        this.invoice_number != "" &&
        this.invoice_number != null &&
        this.invoice_number != undefined
      ) {
        inputParams.invoice_number = this.invoice_number;
      }
      if (
        this.invoice_date != "" &&
        this.invoice_date != null &&
        this.invoice_date != undefined
      ) {
        inputParams.invoice_date = this.invoice_date;
      }
      if (
        this.support_type != "" &&
        this.support_type != null &&
        this.support_type != undefined
      ) {
        inputParams.support_type = this.support_type;
      }
      if (
        this.warranty_start_date != "" &&
        this.warranty_start_date != null &&
        this.warranty_start_date != undefined
      ) {
        inputParams.warranty_start_date = this.warranty_start_date;
      }
      if (
        this.product_manufactured_date != undefined &&
        this.product_manufactured_date != null &&
        this.product_manufactured_date != ""
      ) {
        inputParams.product_manufactured_date = this.product_manufactured_date;
      }
      if (
        this.warranty_end_date != "" &&
        this.warranty_end_date != null &&
        this.warranty_end_date != undefined
      ) {
        inputParams.warranty_end_date = this.warranty_end_date;
      }
      if (
        this.warranty_type != "" &&
        this.warranty_type != null &&
        this.warranty_type != undefined
      ) {
        inputParams.warranty_type =
          typeof this.warranty_type == "string"
            ? this.warranty_type
            : this.warranty_type.setting_name;
      }
      if (
        this.ticket_frequency != undefined &&
        this.ticket_frequency != null &&
        this.ticket_frequency != ""
      ) {
        inputParams.ticket_frequency = this.ticket_frequency;
      }
      if (
        this.supportTableItems[0] &&
        this.supportTableItems[0].rft_date_list &&
        this.supportTableItems[0].rft_date_list.length > 0
      ) {
        inputParams.rft_date_list = this.supportTableItems[0].rft_date_list.map(
          (item) => item
        );
      }
      console.log("this.supportTableItems", this.supportTableItems);
      console.log("this.supportTableItems", inputParams);
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutationresult]);
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
          this.EditedObject = {};
          this.EditedSupportObject = {};
          this.AddUpdateProductFleetDialogEmit((this.Toggle = 2));
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
    AddUpdateProductFleetDialogEmit(Toggle) {
      this.s3_files = [];
      this.selected_files = [];
      this.supportTableItems = [];
      this.EditedObject = {};
      this.EditedSupportObject = {};
      this.extended_warranty_details = [];
      this.forBool = false;
      this.$emit("clicked", Toggle);
    },
    DialogUpdateDateOnRFTDateListEmit() {
      this.DialogUpdateDateOnRFTDateList = false;
    },
  },
};
</script>
