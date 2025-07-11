<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <AddExtendedWarranty
      :StoreObjExtendedWarranty="StoreObjExtendedWarranty"
      :AddExtendedWarrantyDialog="AddExtendedWarrantyDialog"
      @clicked="AddExtendedWarrantyDialogEmit"
    />
    <ViewScheduleVisitDate
      :StoreObjNew="StoreObjNew"
      :DialogViewScheduleVisitDates="DialogViewScheduleVisitDates"
      @clicked="DialogViewScheduleVisitDatesEmit"
    />
    <v-dialog
      transition="dialog-top-transition"
      :value="dialogStopOrResetTicket"
      persistent
      :max-width="
        scheduledMaintainanceDates.length == 0 &&
        s3_files.length == 0 &&
        selected_files.length == 0 &&
        extended_warranty_details.length == 0
          ? '550px'
          : '1000'
      "
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon class="mr-2">{{ "mdi-refresh" }}</v-icon
            ><span></span>Reset/Stop Scheduled Ticket
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogStopTicketEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-row no-gutters>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="
                scheduledMaintainanceDates.length == 0 &&
                s3_files.length == 0 &&
                selected_files.length == 0 &&
                extended_warranty_details.length == 0
                  ? 12
                  : 5
              "
            >
              <v-form ref="form">
                <v-row no-gutters>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      dense
                      readonly
                      outlined
                      label="Ticket-Id"
                      :rules="[(v) => !!v || 'Required']"
                      class="FontSize mr-3 mb-n6"
                      v-model="stopOrResetMaintainance.ticket_id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Serial Number"
                      class="FontSize ml-3 mb-n6"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="stopOrResetMaintainance.service_serial_number"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mb-n8">
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Customer"
                      class="FontSize"
                      v-model="stopOrResetMaintainance.customer_company_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" xs="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Contact Person"
                      :rules="[(v) => !!v || 'Required']"
                      class="FontSize"
                      v-model="stopOrResetMaintainance.customer_name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mb-n8">
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Category"
                      class="FontSize"
                      v-model="stopOrResetMaintainance.category_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Product"
                      :rules="[(v) => !!v || 'Required']"
                      class="FontSize"
                      v-model="stopOrResetMaintainance.service_name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mt-n5">
                  <v-radio-group
                    v-model="radios"
                    row
                    :rules="[(v) => !!v || 'Required']"
                  >
                    <template v-slot:label>
                      <strong>Payment Received *</strong>
                    </template>
                    <v-radio color="green" value="yes">
                      <template v-slot:label>
                        <div><strong class="success--text">Yes</strong></div>
                      </template>
                    </v-radio>
                    <v-radio color="red" value="no">
                      <template v-slot:label>
                        <div><strong class="red--text">No</strong></div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-row>
                <v-row no-gutters v-if="radios == 'yes'">
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Payment Method"
                      v-model="stopOrResetMaintainance.payment_method"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-dialog
                      ref="menu3"
                      v-model="modalticket_payment_date"
                      color="primary"
                      :return-value.sync="stopOrResetMaintainance.payment_date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="stopOrResetMaintainance.payment_date"
                          class="FontSize ml-2"
                          dense
                          outlined
                          persistent-hint
                          label="Invoice Date"
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="stopOrResetMaintainance.payment_date"
                        color="primary"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="payment_date = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.menu3.save(
                              stopOrResetMaintainance.payment_date
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-row no-gutters v-if="radios == 'yes'">
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Payment Details"
                      v-model="stopOrResetMaintainance.payment_details"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize ml-2"
                      label="Payment Amount"
                      v-model="stopOrResetMaintainance.payment_amount"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-select
                  dense
                  outlined
                  :items="actionItems"
                  v-model="stopOrResetMaintainance.action"
                  label="Action"
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize"
                  v-if="renderComp == true"
                ></v-select>
                <v-row
                  no-gutters
                  v-if="stopOrResetMaintainance.action == 'RESET'"
                >
                  <v-col cols="12" sm="12" xs="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      v-model="stopOrResetMaintainance.ticket_warranty_type"
                      label="Support"
                      class="FontSize mr-2"
                      :items="SupportItems"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      v-model="stopOrResetMaintainance.warranty_type"
                      label="Support Type"
                      class="FontSize mr-2"
                      :items="GetAllAMCTypeList"
                      item-value="setting_name"
                      item-text="setting_name"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-dialog
                      ref="dialogStartDate"
                      v-model="modalStartDate"
                      :return-value.sync="
                        stopOrResetMaintainance.amc_start_date
                      "
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          outlined
                          v-model="stopOrResetMaintainance.amc_start_date"
                          label="Support Start Date"
                          prepend-icon=""
                          :rules="[(v) => !!v || 'Required']"
                          class="FontSize"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :min="new Date().toISOString().substr(0, 10)"
                        v-model="stopOrResetMaintainance.amc_start_date"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="modalStartDate = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.dialogStartDate.save(
                              stopOrResetMaintainance.amc_start_date
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-dialog
                      ref="dialogEndDate"
                      v-model="modalEndDate"
                      :return-value.sync="stopOrResetMaintainance.amc_end_date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          outlined
                          v-model="stopOrResetMaintainance.amc_end_date"
                          label="Support End Date"
                          prepend-icon=""
                          :rules="[(v) => !!v || 'Required']"
                          class="FontSize mr-2"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :min="stopOrResetMaintainance.amc_start_date + 1"
                        v-model="stopOrResetMaintainance.amc_end_date"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="modalEndDate = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.dialogEndDate.save(
                              stopOrResetMaintainance.amc_end_date
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-select
                      dense
                      outlined
                      :items="ticket_frequency_Items"
                      v-model="stopOrResetMaintainance.ticket_frequency"
                      label="Frequency"
                      :rules="[(v) => !!v || 'Required']"
                      class="mr-2 FontSize"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-btn
                      class="primary white--text"
                      small
                      @click="
                        (AddExtendedWarrantyDialog = true),
                          (StoreObjExtendedWarranty.action = 'ADD')
                      "
                      >Extended</v-btn
                    >
                  </v-col>
                </v-row>
                <v-file-input
                  class="FontSize"
                  :prepend-icon="null"
                  append-icon="mdi-paperclip"
                  v-model="files"
                  label="Upload Files"
                  outlined
                  dense
                  multiple
                ></v-file-input>
              </v-form>
            </v-col>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="7"
              v-if="
                scheduledMaintainanceDates.length != 0 ||
                s3_files.length != 0 ||
                selected_files.length != 0 ||
                extended_warranty_details.length != 0
              "
              align="left"
            >
              <v-card-text class="py-0">
                <div
                  class="font-weight-bold mb-2 black--text"
                  v-if="scheduledMaintainanceDates.length != 0"
                >
                  Scheduled Maintainance Dates
                </div>
                <v-data-table
                  v-if="scheduledMaintainanceDates.length != 0"
                  dense
                  class="elevation-0"
                  style="border: solid 1px black; padding: 4px"
                  hide-default-footer
                  :headers="mantainanceDatesHeader"
                  :items="scheduledMaintainanceDates"
                >
                  <template v-slot:[`item.sl_no`]="{ item }">
                    <div class="FontSize">
                      {{ scheduledMaintainanceDates.indexOf(item) + 1 }}
                    </div>
                  </template>
                  <template v-slot:[`item.date`]="{ item }">
                    <div class="FontSize">
                      {{ new Date(item.date).toDateString() }}
                    </div>
                  </template>
                  <template v-slot:[`item.Action`]="{ item }">
                    <v-tooltip color="primary" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-if="scheduledMaintainanceDates.indexOf(item) == 0"
                          small
                          icon
                          v-on="on"
                          v-bind="attrs"
                          @click="
                            scheduledMaintainanceDates.splice(
                              scheduledMaintainanceDates.indexOf(item),
                              1
                            )
                          "
                          color="red"
                          ><v-icon small>mdi-delete</v-icon></v-btn
                        >
                      </template>
                      <span class="white--text">Exclude Start Date</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
                <div
                  class="font-weight-bold black--text my-2"
                  v-if="extended_warranty_details.length != 0"
                >
                  Extended Scheduled Maintainance Dates
                </div>
                <v-data-table
                  dense
                  style="border: solid 1px black; padding: 4px"
                  class="elevation-0"
                  hide-default-footer
                  :items="extended_warranty_details"
                  :headers="ExtendedMantainanceDatesHeader"
                  v-if="extended_warranty_details.length != 0"
                >
                  <template
                    v-slot:[`item.extended_ticket_warranty_type`]="{ item }"
                  >
                    <div class="FontSize">
                      {{ item.extended_ticket_warranty_type }}
                    </div>
                    <div class="FontSize">
                      {{ item.extended_warranty_type }}
                    </div>
                  </template>
                  <template
                    v-slot:[`item.extendedWarrantyStartDate`]="{ item }"
                  >
                    <div class="FontSize">
                      {{ item.extendedWarrantyStartDate }}
                    </div>
                    <div class="FontSize">
                      {{ item.extendedWarrantyEndEate }}
                    </div>
                  </template>
                  <template
                    v-slot:[`item.extendedWarrantyFrequency`]="{ item }"
                  >
                    <div class="FontSize">
                      {{ item.extendedWarrantyFrequency }}
                    </div>
                  </template>
                  <template
                    v-slot:[`item.extendedWarrantyDatesList`]="{ item }"
                  >
                    <div class="FontSize">
                      {{ item.extendedWarrantyDatesList.length }}
                      <v-icon
                        color="primary"
                        small
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
                <div
                  v-if="selected_files.length != 0"
                  class="font-weight-bold black--text my-2"
                >
                  Selected Files
                </div>
                <v-data-table
                  v-if="selected_files.length != 0"
                  dense
                  hide-default-footer
                  style="border: solid 1px black; padding: 4px"
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
              </v-card-text>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="loading"
            color="primary"
            @click="validateMethod()"
            class="white--text mr-2 mb-5"
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
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddExtendedWarranty from "@/components/Product/Dialogs/AddExtendedWarranty.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
import { API, graphqlOperation } from "aws-amplify";
import { Stop_Or_Reset_Scheduled_Ticket } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
export default {
  props: {
    StoreObj: Object,
    dialogStopOrResetTicket: Boolean,
  },
  components: {
    Snackbar,
    AddExtendedWarranty,
    ViewScheduleVisitDate,
  },
  mixins: [GenerateS3URL, GetAllOrganizationSetting],
  data: () => ({
    Toggle: 0,
    radios: "no",
    loading: false,
    renderComp: true,
    modalEndDate: false,
    modalStartDate: false,
    modalticket_payment_date: false,
    AddExtendedWarrantyDialog: false,
    DialogViewScheduleVisitDates: false,
    files: [],
    s3_files: [],
    selected_files: [],
    GetAllAMCTypeList: [],
    extended_warranty_details: [],
    scheduledMaintainanceDates: [],
    actionItems: ["STOP", "RESET"],
    ExtendedMantainanceDatesHeader: [
      { text: "Support", value: "extended_ticket_warranty_type" },
      { text: "Dates", value: "extendedWarrantyStartDate" },
      { text: "Frequency", value: "extendedWarrantyFrequency" },
      { text: "Visits", value: "extendedWarrantyDatesList" },
      { text: "Delete", value: "Actions" },
    ],
    SupportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
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
    ticket_frequency_Items: [
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
    mantainanceDatesHeader: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Dates", value: "date" },
      { text: "Action", value: "Action" },
    ],
    StoreObjNew: {},
    SnackBarComponent: {},
    StoreObjExtendedWarranty: {},
    stopOrResetMaintainance: {
      ticket_id: "",
      service_name: "",
      category_name: "",
      action: "",
      amc_start_date: "",
      amc_end_date: "",
      ticket_frequency: null,
      payment_date: "",
      payment_method: "",
      payment_amount: "",
      payment_details: "",
      warranty_type: "",
      ticket_warranty_type: "",
    },
  }),
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    "stopOrResetMaintainance.action"(val) {
      if (val == "RESET") {
        if (this.StoreObj.rft_date_list) {
          let firstVisitDate = this.StoreObj.rft_date_list[0] * 1000;
          let today = new Date().getTime();
          if (today > firstVisitDate) {
            this.renderComp = false;
            this.$nextTick(() => {
              this.stopOrResetMaintainance.action = "";
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText:
                  "One or More Visits are Completed, So Reset is not possible..!",
              };
              this.renderComp = true;
            });
          }
        }
      }
    },
    "stopOrResetMaintainance.ticket_warranty_type"(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
      setTimeout(() => {
        this.stopOrResetMaintainance.warranty_type =
          this.StoreObj.warranty_type;
      }, 1000);
    },
    "stopOrResetMaintainance.ticket_frequency"(val) {
      if (
        val != undefined &&
        val != null &&
        val != "" &&
        this.stopOrResetMaintainance.amc_start_date != undefined &&
        this.stopOrResetMaintainance.amc_end_date != undefined
      ) {
        let start_date = new Date(
          parseInt(this.stopOrResetMaintainance.amc_start_date.split("-")[0]),
          parseInt(this.stopOrResetMaintainance.amc_start_date.split("-")[1]) -
            1,
          parseInt(this.stopOrResetMaintainance.amc_start_date.split("-")[2])
        ).getTime();
        let end_date = new Date(
          parseInt(this.stopOrResetMaintainance.amc_end_date.split("-")[0]),
          parseInt(this.stopOrResetMaintainance.amc_end_date.split("-")[1]) - 1,
          parseInt(this.stopOrResetMaintainance.amc_end_date.split("-")[2])
        ).getTime();
        this.scheduledMaintainanceDates = [];
        while (start_date < end_date) {
          this.scheduledMaintainanceDates.push({ date: start_date });
          start_date +=
            this.stopOrResetMaintainance.ticket_frequency * 24 * 60 * 60 * 1000;
        }
      }
    },
    dialogStopOrResetTicket(val) {
      if (val == true) {
        this.stopOrResetMaintainance = {
          ticket_id: this.StoreObj.ticket_id,
          customer_name: this.StoreObj.customer_name,
          service_name: this.StoreObj.service_name,
          category_name: this.StoreObj.category_name,
          customer_company_name: this.StoreObj.customer_company_name,
          ticket_warranty_type:
            this.StoreObj.ticket_warranty_type != undefined
              ? this.StoreObj.ticket_warranty_type.includes(" ")
                ? this.StoreObj.ticket_warranty_type.replaceAll(" ", "_")
                : this.StoreObj.ticket_warranty_type
              : "",
          warranty_type: this.StoreObj.warranty_type,
          service_serial_number: this.StoreObj.service_serial_number,
        };
      }
    },
  },
  methods: {
    viewScheduleVisitDates(item) {
      this.StoreObjNew = item;
      this.DialogViewScheduleVisitDates = true;
    },
    DialogViewScheduleVisitDatesEmit() {
      this.DialogViewScheduleVisitDates = false;
    },
    AddExtendedWarrantyDialogEmit(item) {
      if (item != undefined) {
        this.extended_warranty_details.push(item);
      }
      this.AddExtendedWarrantyDialog = false;
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
          this.StopScheduledTickettMethod();
        }
      }
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length != 0) {
          this.count = 0;
          this.uploadMediaToS3();
        } else {
          this.StopScheduledTickettMethod(this.s3_files);
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill All Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },
    async StopScheduledTickettMethod(s3URL) {
      this.loading = true;
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          ticket_id: this.stopOrResetMaintainance.ticket_id,
          action: this.stopOrResetMaintainance.action,
          payment_received: this.radios,
        };
        if (
          this.stopOrResetMaintainance.service_serial_number != undefined &&
          this.stopOrResetMaintainance.service_serial_number != null &&
          this.stopOrResetMaintainance.service_serial_number != ""
        ) {
          inputParams.service_serial_number =
            this.stopOrResetMaintainance.service_serial_number;
        }
        if (this.stopOrResetMaintainance.action != "STOP") {
          if (
            this.extended_warranty_details != [] &&
            this.extended_warranty_details.length != 0 &&
            this.extended_warranty_details != undefined
          ) {
            inputParams.extended_warranty_details =
              this.extended_warranty_details;
          }
        }
        if (this.stopOrResetMaintainance.action != "STOP") {
          if (
            this.stopOrResetMaintainance.warranty_type != undefined &&
            this.stopOrResetMaintainance.warranty_type != null &&
            this.stopOrResetMaintainance.warranty_type != ""
          ) {
            inputParams.warranty_type =
              this.stopOrResetMaintainance.warranty_type;
          }
        }
        if (this.stopOrResetMaintainance.action != "STOP") {
          if (
            this.stopOrResetMaintainance.ticket_warranty_type != undefined &&
            this.stopOrResetMaintainance.ticket_warranty_type != null &&
            this.stopOrResetMaintainance.ticket_warranty_type != ""
          ) {
            inputParams.ticket_warranty_type =
              this.stopOrResetMaintainance.ticket_warranty_type;
          }
        }
        if (
          this.stopOrResetMaintainance.payment_method != undefined &&
          this.stopOrResetMaintainance.payment_method != null &&
          this.stopOrResetMaintainance.payment_method != ""
        ) {
          inputParams.payment_method =
            this.stopOrResetMaintainance.payment_method;
        }
        if (
          this.stopOrResetMaintainance.payment_date != undefined &&
          this.stopOrResetMaintainance.payment_date != null &&
          this.stopOrResetMaintainance.payment_date != ""
        ) {
          inputParams.payment_date = this.stopOrResetMaintainance.payment_date;
        }
        if (
          this.stopOrResetMaintainance.payment_details != undefined &&
          this.stopOrResetMaintainance.payment_details != null &&
          this.stopOrResetMaintainance.payment_details != ""
        ) {
          inputParams.payment_details =
            this.stopOrResetMaintainance.payment_details;
        }
        if (
          this.stopOrResetMaintainance.payment_amount != undefined &&
          this.stopOrResetMaintainance.payment_amount != null &&
          this.stopOrResetMaintainance.payment_amount != ""
        ) {
          inputParams.payment_amount =
            this.stopOrResetMaintainance.payment_amount;
        }
        if (this.s3_files.length != 0) {
          inputParams.attachment_file = this.s3_files;
        }
        if (this.stopOrResetMaintainance.action == "RESET") {
          (inputParams.rft_date_list = this.scheduledMaintainanceDates.map(
            (item) => item.date / 1000
          )),
            (inputParams.amc_start_date =
              this.stopOrResetMaintainance.amc_start_date);
          inputParams.amc_end_date = this.stopOrResetMaintainance.amc_end_date;
          inputParams.ticket_frequency =
            this.stopOrResetMaintainance.ticket_frequency;
        }
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Stop_Or_Reset_Scheduled_Ticket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Stop_Or_Reset_Scheduled_Ticket
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
          this.dialogStopTicketEmit((this.Toggle = 2));
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
    dialogStopTicketEmit(Toggle) {
      this.s3_files = [];
      this.selected_files = [];
      this.stopOrResetMaintainance.ticket_frequency = null;
      this.radios = false;
      this.extended_warranty_details = [];
      this.scheduledMaintainanceDates = [];
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
