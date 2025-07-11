<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <LookUpCustomerDialog
      :dialogLookUpCustomer="dialogLookUpCustomer"
      @clicked="dialogLookUpCustomerEmit"
    />
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
    <v-card>
      <v-toolbar dense class="elevation-0">
        <v-icon color="primary">mdi-plus</v-icon>
        <div class="ml-2 largeFontSizeNew">Schedule a Service</div>
        <v-spacer></v-spacer>
        <v-btn
          small
          color="primary"
          @click="CreateScheduledTicketCardEmit((Toggle = 1))"
          ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
        >
      </v-toolbar>
      <v-card-text class="py-0">
        <v-row no-gutters>
          <v-col cols="12" xs="12" sm="12" md="6">
            <v-card class="elevation-0 mt-5" height="400px">
              <gmap-map
                :center="center"
                :zoom="20"
                style="width: 100%; height: 80%"
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
            <div class="font-weight-bold">
              Tagged Products on Selected Customer
            </div>
            <hr />
            <v-data-table
              dense
              height="200"
              fixed-header
              :page.sync="page"
              :loading="loading"
              class="elevation-0"
              :items-per-page="50"
              :no-data-text="noDataText"
              @click:row="handleRowClick"
              :items="GetTaggedProductList"
              :headers="serial_number_header"
              @page-count="pageCount = $event"
              :footer-props="{
                'disable-items-per-page': true,
              }"
            >
            </v-data-table>
            <v-card-text>
              <div
                v-if="scheduledMaintainanceDates.length != 0"
                class="font-weight-bold my-2"
              >
                Scheduled Maintainance Dates
              </div>
              <v-data-table
                dense
                class="elevation-0"
                :headers="mantainanceDatesHeader"
                :items="scheduledMaintainanceDates"
                v-if="scheduledMaintainanceDates.length != 0"
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
              <div v-if="selected_files.length != 0" class="font-weight-bold">
                Selected Files
              </div>
              <v-data-table
                dense
                class="elevation-0"
                :items="selected_files"
                v-if="selected_files.length != 0"
                :headers="selected_files_header"
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
            <v-card-text>
              <div
                class="font-weight-bold"
                v-if="extended_warranty_details.length != 0"
              >
                Extended Scheduled Maintainance Dates
              </div>
              <v-data-table
                dense
                class="elevation-0"
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
                <template v-slot:[`item.extendedWarrantyStartDate`]="{ item }">
                  <div class="FontSize">
                    {{ item.extendedWarrantyStartDate }}
                  </div>
                  <div class="FontSize">
                    {{ item.extendedWarrantyEndEate }}
                  </div>
                </template>
                <template v-slot:[`item.extendedWarrantyFrequency`]="{ item }">
                  <div class="FontSize">
                    {{ item.extendedWarrantyFrequency }}
                  </div>
                </template>
                <template v-slot:[`item.extendedWarrantyDatesList`]="{ item }">
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
            </v-card-text>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" class="mt-7">
            <v-form ref="form" class="ml-2">
              <v-toolbar
                dense
                outlined
                class="elevation-0 mt-n2 mb-4"
                style="border: 0.2px solid grey"
              >
                <gmap-autocomplete
                  placeholder="Search Service Location"
                  style="
                    width: 500px;
                    border-bottom: 1px solid grey;
                    font-size: 15px;
                  "
                  :value="search"
                  class="ml-0"
                  ref="clearSearch"
                  @place_changed="setPlace"
                >
                </gmap-autocomplete>
                <v-icon>mdi-magnify</v-icon>
              </v-toolbar>
              <v-row>
                <v-col cols="12" xs="12" md="3" sm="12">
                  <b>Customer Type :</b>
                </v-col>
                <v-col cols="12" xs="12" md="9" sm="12">
                  <v-radio-group
                    v-model="create_Scheduled_ticket.customer_type"
                    class="font-weight-bold mt-n2"
                  >
                    <v-row class="mb-n8">
                      <v-col class="ml-2">
                        <v-radio
                          label="INDIVIDUAL"
                          value="INDIVIDUAL"
                        ></v-radio>
                      </v-col>
                      <v-col>
                        <v-radio label="BUSINESS" value="BUSINESS"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  sm="12"
                  xs="12"
                  v-if="
                    this.create_Scheduled_ticket.customer_type != 'INDIVIDUAL'
                  "
                >
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Customer"
                    v-model="create_Scheduled_ticket.customer_company_name"
                  >
                    <template v-slot:append>
                      <v-btn
                        icon
                        small
                        color="primary"
                        @click.stop="dialogLookUpCustomer = true"
                      >
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  :md="
                    this.create_Scheduled_ticket.customer_type != 'INDIVIDUAL'
                      ? 6
                      : 12
                  "
                  xs="12"
                  sm="12"
                >
                  <v-text-field
                    dense
                    outlined
                    readonly
                    class="FontSize"
                    label="Contact Person *"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_Scheduled_ticket.customer_name"
                  >
                    <template v-slot:append>
                      <v-btn
                        icon
                        small
                        color="primary"
                        @click.stop="dialogLookUpCustomer = true"
                      >
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters class="mt-n4 mb-2">
                <v-col cols="12" xs="12" sm="12" md="6"
                  ><h5>
                    Latitude : {{ create_Scheduled_ticket.ticket_latitude }}
                  </h5>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6"
                  ><h5>
                    Longitude : {{ create_Scheduled_ticket.ticket_longitude }}
                  </h5>
                </v-col>
              </v-row>
              <v-text-field
                dense
                outlined
                class="FontSize"
                label="Customer Address *"
                :rules="[(v) => !!v || 'Required']"
                v-model="create_Scheduled_ticket.ticket_address"
              ></v-text-field>
              <v-row no-gutters>
                <v-col cols="12" sm="12" md="4" xs="12">
                  <v-autocomplete
                    dense
                    outlined
                    item-text="name"
                    class="FontSize"
                    :items="CountryList"
                    label="Country Code *"
                    item-value="dial_code"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_Scheduled_ticket.customer_country_code"
                  >
                    <template slot="selection" slot-scope="{ item }">
                      {{ item.dial_code }}
                    </template>
                    <template slot="item" slot-scope="{ item }">
                      {{ item.name }}({{ item.dial_code }})
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="8" xs="12">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize ml-2"
                    label="Customer Contact Number *"
                    hint="Enter Valid Customer Contact Number"
                    v-model="create_Scheduled_ticket.customer_phone_number"
                    :rules="[
                      (v) =>
                        /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(
                          v
                        ) || 'Invalid',
                      (v) => (v && v.length < 11) || 'Invalid',
                      (v) => (v && v.length > 9) || 'Invalid',
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                dense
                outlined
                class="FontSize"
                label="Customer Email-Id"
                v-model="create_Scheduled_ticket.customer_email_id"
              ></v-text-field>
              <v-row no-gutters>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-autocomplete
                    dense
                    outlined
                    label="Category *"
                    class="mr-2 FontSize"
                    :items="categoryItems"
                    item-text="category_name"
                    item-value="category_id"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_Scheduled_ticket.category_id"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" xs="12" sm="12">
                  <v-autocomplete
                    dense
                    outlined
                    label="Product *"
                    class="FontSize mr-2"
                    item-value="service_id"
                    item-text="service_name"
                    :rules="[(v) => !!v || 'Required']"
                    :items="GetServiceByCategoriesList"
                    v-model="create_Scheduled_ticket.service_id"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="Serial Number"
                    class="mr-2 FontSize"
                    v-model="create_Scheduled_ticket.service_serial_number"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-autocomplete
                    dense
                    outlined
                    return-object
                    class="FontSize mr-2"
                    label="Service Type *"
                    item-value="service_type_id"
                    item-text="service_type_name"
                    :rules="[(v) => !!v || 'Required']"
                    :items="GetAllServiceTypeByServiceIDList"
                    v-model="create_Scheduled_ticket.service_type"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-autocomplete
                    dense
                    outlined
                    label="Support"
                    class="FontSize mr-2"
                    :items="ticket_warranty_type_items"
                    v-model="create_Scheduled_ticket.ticket_warranty_type"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-autocomplete
                    dense
                    outlined
                    return-object
                    class="FontSize"
                    label="Support Type"
                    item-value="setting_id"
                    item-text="setting_name"
                    :items="GetAllAMCTypeList"
                    v-model="create_Scheduled_ticket.warranty_type"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-dialog
                    persistent
                    width="290px"
                    ref="dialogStartDate"
                    v-model="modalStartDate"
                    :return-value.sync="create_Scheduled_ticket.amc_start_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        readonly
                        v-on="on"
                        v-bind="attrs"
                        prepend-icon=""
                        class="FontSize"
                        label="Support Start Date *"
                        :rules="[(v) => !!v || 'Required']"
                        v-model="create_Scheduled_ticket.amc_start_date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      scrollable
                      v-model="create_Scheduled_ticket.amc_start_date"
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
                            create_Scheduled_ticket.amc_start_date
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
                    persistent
                    width="290px"
                    ref="dialogEndDate"
                    v-model="modalEndDate"
                    :return-value.sync="create_Scheduled_ticket.amc_end_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        readonly
                        v-on="on"
                        v-bind="attrs"
                        prepend-icon=""
                        class="FontSize ml-2"
                        label="Support End Date *"
                        :rules="[(v) => !!v || 'Required']"
                        v-model="create_Scheduled_ticket.amc_end_date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      scrollable
                      v-model="create_Scheduled_ticket.amc_end_date"
                      :min="create_Scheduled_ticket.amc_start_date + 1"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modalEndDate = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="
                          $refs.dialogEndDate.save(
                            create_Scheduled_ticket.amc_end_date
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
                    label="Frequency *"
                    class="ml-2 FontSize"
                    :items="ticket_frequency_Items"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_Scheduled_ticket.ticket_frequency"
                  ></v-select>
                </v-col>
              </v-row>
              <v-btn
                small
                color="primary"
                class="mb-4"
                @click="
                  (AddExtendedWarrantyDialog = true),
                    (StoreObjExtendedWarranty.action = 'ADD')
                "
              >
                Add Extended Warranty
              </v-btn>
              <div class="font-weight-bold mb-2">Invoice Information</div>
              <v-row no-gutters>
                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Invoice Number"
                    v-model="create_Scheduled_ticket.ticket_invoice_number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-dialog
                    ref="menu3"
                    v-model="modalticket_invoice_date"
                    color="primary"
                    :return-value.sync="
                      create_Scheduled_ticket.ticket_invoice_date
                    "
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        persistent-hint
                        color="primary"
                        label="Invoice Date"
                        class="FontSize ml-2"
                        v-model="create_Scheduled_ticket.ticket_invoice_date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      scrollable
                      color="primary"
                      v-model="create_Scheduled_ticket.ticket_invoice_date"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="modalticket_invoice_date = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="
                          $refs.menu3.save(
                            create_Scheduled_ticket.ticket_invoice_date
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
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
                    :rules="
                      create_Scheduled_ticket.ticket_warranty_type !=
                      'NO_WARRANTY'
                        ? [(v) => !!v || 'Required']
                        : []
                    "
                    class="FontSize"
                    label="Payment Method"
                    v-model="create_Scheduled_ticket.payment_method"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-dialog
                    ref="menu3"
                    persistent
                    width="290px"
                    color="primary"
                    v-model="modalticket_payment_date"
                    :return-value.sync="create_Scheduled_ticket.payment_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        persistent-hint
                        color="primary"
                        label="Payment Date"
                        class="FontSize ml-2"
                        v-model="create_Scheduled_ticket.payment_date"
                        :rules="
                          create_Scheduled_ticket.ticket_warranty_type !=
                          'NO_WARRANTY'
                            ? [(v) => !!v || 'Required']
                            : []
                        "
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      scrollable
                      color="primary"
                      v-model="create_Scheduled_ticket.payment_date"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="payment_date = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="
                          $refs.menu3.save(create_Scheduled_ticket.payment_date)
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
                    v-model="create_Scheduled_ticket.payment_details"
                    :rules="
                      create_Scheduled_ticket.ticket_warranty_type !=
                      'NO_WARRANTY'
                        ? [(v) => !!v || 'Required']
                        : []
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize ml-2"
                    label="Payment Amount"
                    v-model="create_Scheduled_ticket.payment_amount"
                    :rules="
                      create_Scheduled_ticket.ticket_warranty_type !=
                      'NO_WARRANTY'
                        ? [(v) => !!v || 'Required']
                        : []
                    "
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-file-input
                dense
                outlined
                multiple
                v-model="files"
                class="FontSize"
                label="File input"
                :prepend-icon="null"
                append-icon="mdi-paperclip"
              ></v-file-input>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn
          small
          color="primary"
          class="mr-1 mb-3"
          :loading="loading"
          @click="validateMethod()"
          >Confirm</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
window.Buffer = Buffer;
var aws = require("aws-sdk");
import { Buffer } from "buffer";
import CountryList from "@/JsonFiles/CountryList.json";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddExtendedWarranty from "@/components/Product/Dialogs/AddExtendedWarranty.vue";
import LookUpCustomerDialog from "@/components/Tickets/Dialogs/LookUpCustomerDialog.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
import { API, graphqlOperation } from "aws-amplify";
import { Create_Scheduled_Ticket } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetTaggedProduct } from "@/mixins/Tickets/ListTaggedProducts.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllServiceTypeBasedOnServiceID } from "@/mixins/Tickets/GetAllListServiceTypeById.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [
    GenerateS3URL,
    GetTaggedProduct,
    GetServicesByCategory,
    GetAllOrganizationSetting,
    GetAllServiceTypeBasedOnServiceID,
    GetAllOrganizationSettingsTypesInMS,
  ],
  components: {
    Snackbar,
    AddExtendedWarranty,
    LookUpCustomerDialog,
    ViewScheduleVisitDate,
  },
  data: () => ({
    page: 1,
    Toggle: 0,
    pageCount: 1,
    search: "",
    radios: false,
    loading: false,
    renderComp: true,
    modalEndDate: false,
    modalStartDate: false,
    dialogLookUpCustomer: false,
    modelExtendedStartDate: false,
    modalticket_payment_date: false,
    modalticket_invoice_date: false,
    AddExtendedWarrantyDialog: false,
    DialogViewScheduleVisitDates: false,
    modelExtendedWarrantyEndDate: false,
    files: [],
    s3_files: [],
    CountryList: [],
    categoryItems: [],
    selected_files: [],
    ticket_s3_files: [],
    GetAllAMCTypeList: [],
    GetTaggedProductList: [],
    extended_warranty_details: [],
    GetServiceByCategoriesList: [],
    scheduledMaintainanceDates: [],
    GetAllServiceTypeByServiceIDList: [],
    ticket_frequency_Items: [
      { text: "No visits Required", value: "0 Days" },
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
    markers: [
      {
        position: {},
      },
    ],
    ExtendedMantainanceDatesHeader: [
      { text: "Support", value: "extended_ticket_warranty_type", width: "40%" },
      { text: "Dates", value: "extendedWarrantyStartDate", width: "20%" },
      { text: "Frequency", value: "extendedWarrantyFrequency", width: "10%" },
      { text: "Visits", value: "extendedWarrantyDatesList", width: "8%" },
      { text: "Delete", value: "Actions", width: "8%" },
    ],
    mantainanceDatesHeader: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Dates", value: "date" },
      { text: "Action", value: "Action" },
    ],
    ticket_warranty_type_items: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    ScheduledS3Files: [
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
    serial_number_header: [
      { text: "Category", value: "category_name", width: "30%" },
      { text: "Product", value: "product_name", width: "30%" },
      { text: "Serial Number", value: "setting_name", width: "40%" },
    ],
    StoreObjNew: {},
    StoreObjExtendedWarranty: {},
    SnackBarComponent: {},
    center: { lat: 0, lng: 0 },
    create_Scheduled_ticket: {
      service_id: "",
      amc_end_date: "",
      service_type: [],
      payment_date: "",
      customer_name: "",
      warranty_type: "",
      ticket_address: "",
      amc_start_date: "",
      payment_method: "",
      payment_amount: "",
      payment_details: "",
      ticket_latitude: "",
      ticket_longitude: "",
      customer_email_id: "",
      ticket_frequency: null,
      frequency_type: "DAYS",
      ticket_warranty_type: "",
      customer_phone_number: "",
      ticket_invoice_number: "",
      customer_company_name: "",
      customer_type: "BUSINESS",
      service_serial_number: "",
      extended_warranty_type: "",
      customer_country_code: "+91",
      extended_warranty_end_date: "",
      extended_warranty_frequency: "",
      extended_warranty_start_date: "",
      extended_ticket_warranty_type: "",
    },
  }),
  watch: {
    "create_Scheduled_ticket.ticket_warranty_type"(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    files(val) {
      if (val.length != 0 && val != undefined && val != null)
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
    },
    "create_Scheduled_ticket.service_id"(val) {
      this.GetAllServiceTypeByServiceIDMethod(val);
    },
    "create_Scheduled_ticket.ticket_frequency"(val) {
      this.scheduledMaintainanceDates = [];
      if (val != undefined && val != null && val != "" && val != "0 Days") {
        let start_date = new Date(
          parseInt(this.create_Scheduled_ticket.amc_start_date.split("-")[0]),
          parseInt(this.create_Scheduled_ticket.amc_start_date.split("-")[1]) -
            1,
          parseInt(this.create_Scheduled_ticket.amc_start_date.split("-")[2])
        ).getTime();
        let end_date = new Date(
          parseInt(this.create_Scheduled_ticket.amc_end_date.split("-")[0]),
          parseInt(this.create_Scheduled_ticket.amc_end_date.split("-")[1]) - 1,
          parseInt(this.create_Scheduled_ticket.amc_end_date.split("-")[2])
        ).getTime();
        this.scheduledMaintainanceDates = [];
        while (start_date < end_date) {
          this.scheduledMaintainanceDates.push({ date: start_date });
          start_date +=
            this.create_Scheduled_ticket.ticket_frequency * 24 * 60 * 60 * 1000;
        }
      }
    },
    "create_Scheduled_ticket.category_id"(val) {
      if (val != undefined && val != null && val != "") {
        this.GetServicesByCategoriesMethod(val);
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetTaggedProductMethod(
          this.customer_id,
          undefined,
          this.next_token
        );
      }
    },
  },
  mounted() {
    this.GetCurrentLocation();
    this.CountryList = CountryList;
    this.GetAllOrganizationSettingsTypesMethod();
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
    handleRowClick(item) {
      this.create_Scheduled_ticket.category_id = item.category_id;
      this.GetServicesByCategoriesMethod(item.category_id);
      setTimeout(() => {
        this.create_Scheduled_ticket.service_id = item.product_id;
      }, 1000);
      this.create_Scheduled_ticket.service_serial_number = item.setting_name;
      this.create_Scheduled_ticket.amc_start_date =
        item.warranty_start_date != "-" ? item.warranty_start_date : "";
      this.create_Scheduled_ticket.amc_end_date =
        item.warranty_end_date != "-" ? item.warranty_end_date : "";
      this.create_Scheduled_ticket.ticket_invoice_number = item.invoice_number;
      this.create_Scheduled_ticket.ticket_invoice_date =
        item.invoice_date != "-" ? item.invoice_date : "";
      this.create_Scheduled_ticket.ticket_warranty_type = item.support_type;
      this.GetAllAMCTypeMethod("ACTIVE", item.support_type);
      setTimeout(() => {
        this.create_Scheduled_ticket.warranty_type = item.warranty_type;
      }, 1000);
    },
    dialogLookUpCustomerEmit(Toggle, item) {
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
        this.create_Scheduled_ticket.customer_name = item.customer_name;
        this.create_Scheduled_ticket.customer_country_code =
          item.customer_primary_country_code;
        this.create_Scheduled_ticket.customer_phone_number =
          item.customer_primary_contact_number;
        this.create_Scheduled_ticket.customer_company_name =
          item.customer_company_name;
        this.create_Scheduled_ticket.customer_type = item.customer_type;
        this.create_Scheduled_ticket.ticket_latitude = item.customer_latitude;
        this.create_Scheduled_ticket.ticket_longitude = item.customer_longitude;
        this.create_Scheduled_ticket.ticket_address = item.customer_address;
        this.create_Scheduled_ticket.customer_email_id = item.customer_email_id;
        this.customer_id = item.customer_id;
        this.GetTaggedProductMethod(this.customer_id, undefined, undefined);
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
          this.createScheduledTicketMethod();
        }
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
    setPlace(place) {
      this.currentPlace = place;
      this.center.lat = this.currentPlace.geometry.location.lat();
      this.center.lng = this.currentPlace.geometry.location.lng();
      this.create_Scheduled_ticket.ticket_latitude =
        this.currentPlace.geometry.location.lat();
      this.create_Scheduled_ticket.ticket_longitude =
        this.currentPlace.geometry.location.lng();
      this.create_Scheduled_ticket.ticket_address = place.formatted_address;
      this.TicketName = place.name;
      self.markers = [];
      self.markers.push({
        position: {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        },
      });
    },
    async createScheduledTicketMethod(s3URL) {
      var inputParams = {
        creator_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        customer_id: this.customer_id,
        user_id_timestamp:
          this.$store.getters.get_current_user_details.user_id +
          "_" +
          Date.now(),
        service_id: this.create_Scheduled_ticket.service_id,
        frequency_type: this.create_Scheduled_ticket.frequency_type,
        ticket_frequency: this.create_Scheduled_ticket.ticket_frequency,
        customer_name: this.create_Scheduled_ticket.customer_name,
        customer_country_code:
          this.create_Scheduled_ticket.customer_country_code,
        customer_phone_number:
          this.create_Scheduled_ticket.customer_phone_number,
        customer_address: this.create_Scheduled_ticket.ticket_address,
        ticket_latitude: this.create_Scheduled_ticket.ticket_latitude,
        ticket_longitude: this.create_Scheduled_ticket.ticket_longitude,
        amc_start_date: this.create_Scheduled_ticket.amc_start_date,
        amc_end_date: this.create_Scheduled_ticket.amc_end_date,
        category_id: this.create_Scheduled_ticket.category_id,
        service_type_name:
          this.create_Scheduled_ticket.service_type.service_type_name,
        service_type_id:
          this.create_Scheduled_ticket.service_type.service_type_id,
        payment_received: this.radios == "yes" ? true : false,
        rft_date_list: this.scheduledMaintainanceDates.map(
          (item) => item.date / 1000
        ),
      };
      if (this.s3_files.length != 0) {
        inputParams.ticket_s3_files = this.s3_files;
      }
      if (
        this.create_Scheduled_ticket.ticket_warranty_type != undefined &&
        this.create_Scheduled_ticket.ticket_warranty_type != null &&
        this.create_Scheduled_ticket.ticket_warranty_type != ""
      ) {
        inputParams.ticket_warranty_type =
          this.create_Scheduled_ticket.ticket_warranty_type;
      }
      if (
        this.create_Scheduled_ticket.warranty_type != undefined &&
        this.create_Scheduled_ticket.warranty_type != null &&
        this.create_Scheduled_ticket.warranty_type != ""
      ) {
        if (typeof this.create_Scheduled_ticket.warranty_type != "string") {
          inputParams.amc_type_id =
            this.create_Scheduled_ticket.warranty_type.setting_id;
        } else {
          inputParams.amc_type_id = this.create_Scheduled_ticket.warranty_type;
        }
      }
      if (
        this.create_Scheduled_ticket.warranty_type != undefined &&
        this.create_Scheduled_ticket.warranty_type != null &&
        this.create_Scheduled_ticket.warranty_type != ""
      ) {
        if (typeof this.create_Scheduled_ticket.warranty_type != "string") {
          inputParams.warranty_type =
            this.create_Scheduled_ticket.warranty_type.setting_name;
        } else {
          this.create_Scheduled_ticket.warranty_type;
        }
      }
      if (
        this.create_Scheduled_ticket.customer_company_name != undefined &&
        this.create_Scheduled_ticket.customer_company_name != null &&
        this.create_Scheduled_ticket.customer_company_name != "" &&
        this.create_Scheduled_ticket.customer_type != "INDIVIDUAL"
      ) {
        inputParams.customer_company_name =
          this.create_Scheduled_ticket.customer_company_name;
      }
      if (
        this.create_Scheduled_ticket.customer_type != undefined &&
        this.create_Scheduled_ticket.customer_type != null &&
        this.create_Scheduled_ticket.customer_type != ""
      ) {
        inputParams.customer_type = this.create_Scheduled_ticket.customer_type;
      }
      if (
        this.create_Scheduled_ticket.service_serial_number != undefined &&
        this.create_Scheduled_ticket.service_serial_number != null &&
        this.create_Scheduled_ticket.service_serial_number != ""
      ) {
        inputParams.service_serial_number =
          this.create_Scheduled_ticket.service_serial_number;
      }
      if (
        this.create_Scheduled_ticket.payment_method != undefined &&
        this.create_Scheduled_ticket.payment_method != null &&
        this.create_Scheduled_ticket.payment_method != ""
      ) {
        inputParams.payment_method =
          this.create_Scheduled_ticket.payment_method;
      }
      if (
        this.create_Scheduled_ticket.payment_date != undefined &&
        this.create_Scheduled_ticket.payment_date != null &&
        this.create_Scheduled_ticket.payment_date != ""
      ) {
        inputParams.payment_date = this.create_Scheduled_ticket.payment_date;
      }
      if (
        this.create_Scheduled_ticket.payment_details != undefined &&
        this.create_Scheduled_ticket.payment_details != null &&
        this.create_Scheduled_ticket.payment_details != ""
      ) {
        inputParams.payment_details =
          this.create_Scheduled_ticket.payment_details;
      }
      if (
        this.create_Scheduled_ticket.payment_amount != undefined &&
        this.create_Scheduled_ticket.payment_amount != null &&
        this.create_Scheduled_ticket.payment_amount != ""
      ) {
        inputParams.payment_amount =
          this.create_Scheduled_ticket.payment_amount;
      }
      if (
        this.create_Scheduled_ticket.customer_email_id != undefined &&
        this.create_Scheduled_ticket.customer_email_id != null &&
        this.create_Scheduled_ticket.customer_email_id != ""
      ) {
        inputParams.customer_email_id =
          this.create_Scheduled_ticket.customer_email_id;
      }
      if (
        this.create_Scheduled_ticket.ticket_warranty_type != undefined &&
        this.create_Scheduled_ticket.ticket_warranty_type != null &&
        this.create_Scheduled_ticket.ticket_warranty_type != ""
      ) {
        inputParams.ticket_warranty_details = {
          ticket_invoice_number:
            this.create_Scheduled_ticket.ticket_invoice_number,
          ticket_invoice_date: this.create_Scheduled_ticket.ticket_invoice_date,
        };
      }
      if (
        this.extended_warranty_details != [] &&
        this.extended_warranty_details.length != 0 &&
        this.extended_warranty_details != undefined
      ) {
        inputParams.extended_warranty_details = this.extended_warranty_details;
      }
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Create_Scheduled_Ticket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.Create_Scheduled_Ticket);
        if (ResultObject.status == "SUCCESS") {
          this.CreateScheduledTicketCardEmit(
            (this.Toggle = 2),
            ResultObject.Status_Message
          );
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length != 0) {
          this.uploadMediaToS3();
        } else {
          this.createScheduledTicketMethod();
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all mandatory fields..!",
          };
          this.renderComp = true;
        });
      }
    },
    CreateScheduledTicketCardEmit(Toggle, Status_Message) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle, Status_Message);
    },
  },
};
</script>
