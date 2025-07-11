<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <dailogTicketDetails
      :StoreObj="StoreObj"
      :viewTicketDetailsDailog="viewTicketDetailsDailog"
      @clicked="viewTicketDetailsDailogemit"
    />
    <ViewScheduleVisitDate
      :StoreObjNew="StoreObjNew"
      :DialogViewScheduleVisitDates="DialogViewScheduleVisitDates"
      @clicked="DialogViewScheduleVisitDatesEmit"
    />
    <CreateTicketCard
      v-if="current_view == 'CREATE_TICKET'"
      :StoreObj="StoreObj"
      :StoreObj1="StoreObj1"
      @clicked="CreateTicketCardEmit"
    />
    <v-card-text v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0 mt-n3">
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6" xs="12">
            <v-toolbar dense class="elevation-0">
              <v-icon small>mdi-eye</v-icon>
              <div class="ml-1 PrimaryFontColor">Scheduled Service Details</div>
            </v-toolbar>
          </v-col>
          <v-col cols="12" sm="12" md="6" xs="12">
            <v-toolbar dense class="elevation-0">
              <v-spacer></v-spacer>
              <v-btn small color="primary" @click="EmitView()"
                ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
              >
            </v-toolbar>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-card
        outlined
        style="border: 1px solid grey; height: 600px"
        class="ml-3 overflow-auto"
        color=""
        max-width="1275"
      >
        <div class="ml-2 font-weight-bold black--text">
          Customer Information :
        </div>
        <v-card-title>
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="4" xs="12" class="mt-n4">
              <span class="FontSize font-weight-bold black--text"
                >Scheduled Service ID :
                <span class="font-weight-regular black--text"
                  >{{ StoreObj.ticket_id }}
                </span></span
              >
              <div class="FontSize font-weight-bold black--text mt-n2">
                Scheduled Service Type :
                <span
                  v-if="StoreObj.ticket_type != undefined"
                  class="font-weight-regular black--text"
                  >{{ StoreObj.ticket_type }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Support Start Date :
                <span class="font-weight-regular black--text">{{
                  StoreObj.amc_start_date
                }}</span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Support End Date :
                <span class="font-weight-regular black--text">{{
                  StoreObj.amc_end_date
                }}</span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Scheduled Service Created date :<span
                  class="font-weight-regular black--text"
                >
                  {{ StoreObj.ticket_schedule_date }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Invoice Date :<span
                  v-if="StoreObj.ticket_warranty_details != undefined"
                  class="font-weight-regular black--text"
                >
                  {{
                    StoreObj.ticket_warranty_details.ticket_invoice_date
                  }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Invoice Number :<span
                  v-if="StoreObj.ticket_warranty_details != undefined"
                  class="font-weight-regular black--text"
                >
                  {{
                    StoreObj.ticket_warranty_details.ticket_invoice_number
                  }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Service Type :<span class="font-weight-regular black--text">
                  {{ StoreObj.service_type_name }}</span
                >
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="4" xs="12" class="mt-n4">
              <div class="FontSize font-weight-bold black--text">
                Customer Type :<span class="font-weight-regular black--text">
                  {{ StoreObj.customer_type }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text">
                Customer :<span class="font-weight-regular black--text">
                  {{ StoreObj.customer_company_name }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text">
                Contact Person :<span class="font-weight-regular black--text">
                  {{ StoreObj.customer_name }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Email :
                <span class="font-weight-regular black--text">
                  {{ StoreObj.customer_email_id }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Contact Number :<span class="font-weight-regular black--text">
                  {{ StoreObj.customer_phone_number }}</span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Payment Received :<span
                  v-if="StoreObj.payment_received == true"
                  class="font-weight-regular teal--text"
                >
                  Yes</span
                >
                <span
                  v-else-if="StoreObj.payment_received == false"
                  class="font-weight-regular black--text"
                >
                  No</span
                >
              </div>
              <div
                v-if="StoreObj.payment_received == true"
                class="FontSize font-weight-bold black--text mt-n2"
              >
                Payment Method :<span class="font-weight-regular black--text">
                  {{ StoreObj.payment_method }}</span
                >
              </div>
              <div
                v-if="StoreObj.payment_received == true"
                class="FontSize font-weight-bold black--text mt-n2"
              >
                Payment Date :<span class="font-weight-regular black--text">
                  {{ StoreObj.payment_date }}</span
                >
              </div>
              <div
                v-if="StoreObj.payment_received == true"
                class="FontSize font-weight-bold black--text mt-n2"
              >
                Payment Details :<span class="font-weight-regular black--text">
                  {{ StoreObj.payment_details }}</span
                >
              </div>
              <div
                v-if="StoreObj.payment_received == true"
                class="FontSize font-weight-bold black--text mt-n2"
              >
                Payment Amount :<span class="font-weight-regular black--text">
                  {{ StoreObj.payment_amount }}</span
                >
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="4" xs="12" class="mt-n4">
              <div class="FontSize font-weight-bold black--text">
                Product Serial Number :
                <span class="font-weight-regular black--text"
                  >{{ StoreObj.service_serial_number }}
                  <v-icon
                    v-if="StoreObj.service_serial_number != undefined"
                    @click="viewTicketDetailsMethod()"
                    small
                    color="primary"
                    >mdi-ticket</v-icon
                  ></span
                >
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Category Name :
                <span class="font-weight-regular black--text">{{
                  StoreObj.category_name
                }}</span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Product Name :
                <span class="font-weight-regular black--text">{{
                  StoreObj.service_name
                }}</span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Support :
                <span class="font-weight-regular black--text">{{
                  StoreObj.ticket_warranty_type
                }}</span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Support Type :
                <span class="font-weight-regular black--text">{{
                  StoreObj.warranty_type
                }}</span>
                <!-- <span class="font-weight-regular black--text" v-else>{{
                  StoreObj.amc_type_name
                }}</span> -->
              </div>
              <div class="FontSize font-weight-bold mt-n2 black--text">
                Service Address :
                <span class="font-weight-regular black--text">{{
                  StoreObj.ticket_address
                }}</span>
              </div>
              <div class="FontSize font-weight-bold mt-n2 black--text">
                Latitude :
                <span class="font-weight-regular black--text">{{
                  StoreObj.ticket_latitude
                }}</span>
              </div>
              <div class="FontSize font-weight-bold mt-n2 black--text">
                Longitude :
                <span class="font-weight-regular black--text">{{
                  StoreObj.ticket_longitude
                }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-col cols="12" md="12" sm="12" xs="12">
          <div v-if="StoreObj.extended_warranty_details != undefined">
            <div
              class="font-weight-bold"
              v-if="StoreObj.extended_warranty_details.length != 0"
            >
              Extended Warranty Details
            </div>
          </div>
          <div v-if="StoreObj.extended_warranty_details != undefined">
            <v-data-table
              v-if="StoreObj.extended_warranty_details.length != 0"
              dense
              class="elevation-0"
              :headers="extendedSupportHeaders"
              :items="StoreObj.extended_warranty_details"
            >
              <template v-slot:[`item.sl_no`]="{ item }">
                <div class="FontSize">
                  {{ StoreObj.extended_warranty_details.indexOf(item) + 1 }}
                </div>
              </template>
              <template
                v-slot:[`item.extended_ticket_warranty_type`]="{ item }"
              >
                <div class="FontSize">
                  {{ item.extended_ticket_warranty_type }}
                </div>
              </template>
              <template v-slot:[`item.extended_warranty_type`]="{ item }">
                <div class="FontSize">
                  {{ item.extended_warranty_type }}
                </div>
              </template>
              <template v-slot:[`item.extendedWarrantyStartDate`]="{ item }">
                <div class="FontSize">
                  {{ item.extendedWarrantyStartDate }}
                </div>
              </template>
              <template v-slot:[`item.extendedWarrantyEndEate`]="{ item }">
                <div class="FontSize">
                  {{ item.extendedWarrantyEndEate }}
                </div>
              </template>
              <template v-slot:[`item.extendedWarrantyDatesList`]="{ item }">
                <div v-if="item.extendedWarrantyDatesList != undefined">
                  <div
                    class="FontSize"
                    v-if="item.extendedWarrantyDatesList.length != 0"
                  >
                    {{ item.extendedWarrantyDatesList.length }}
                    <v-icon
                      color="primary"
                      small
                      @click="viewScheduleVisitDates(item)"
                      >mdi-calendar-question-outline</v-icon
                    >
                  </div>
                  <div v-else>-</div>
                </div>
                <div v-else>-</div>
              </template>
            </v-data-table>
          </div>
        </v-col>
        <v-col
          v-if="this.StoreObj.attachment_file != 0"
          cols="12"
          md="12"
          sm="12"
        >
          <v-data-table
            @click:row="handleRowClick"
            :headers="FileHeaders"
            :items="StoreObj.attachment_file"
            dense
            class="FontSize elevation-0 mt-n4"
            fixed-header
            height="160px"
            :footer-props="{
              'items-per-page-options': [20, 50, 100],
            }"
            :items-per-page="20"
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize" color="primary">
                {{ StoreObj.attachment_file.indexOf(item) + 1 }}
              </div>
            </template>
          </v-data-table>
        </v-col>
        <v-card-text class="mt-n4">
          <div
            v-if="scheduledMaintainanceDates.length != 0"
            class="font-weight-bold elevation-0"
            style="color: black"
          >
            Scheduled Maintenance Dates
          </div>
          <v-data-table
            v-if="scheduledMaintainanceDates.length != 0"
            dense
            class="elevation-0 mt-2"
            :headers="mantainanceDatesHeader"
            :items="scheduledMaintainanceDates"
            fixed-header
            height="190px"
            :footer-props="{
              'items-per-page-options': [20, 50, 100],
            }"
            :items-per-page="20"
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize">
                {{ scheduledMaintainanceDates.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.date`]="{ item }">
              <div class="FontSize">
                {{ new Date(item.date * 1000).toDateString() }}
              </div>
            </template>
            <template v-slot:[`item.rft_date`]="{ item }">
              <div class="FontSize">
                {{
                  item.rft_date != undefined
                    ? new Date(item.rft_date * 1000).toDateString()
                    : ""
                }}
                <v-icon color="green" small v-if="item.rft_date != undefined"
                  >mdi-check</v-icon
                >
                <div v-else>
                  <v-icon color="red" small>mdi-close</v-icon>
                </div>
              </div>
            </template>
            <template v-slot:[`item.main_ticket_date`]="{ item }">
              <div v-if="item.main_ticket_date != undefined" class="FontSize">
                {{
                  item.main_ticket_date != undefined
                    ? new Date(item.main_ticket_date * 1000).toDateString()
                    : ""
                }}
                <v-icon
                  color="green"
                  small
                  v-if="item.main_ticket_date != undefined"
                  >mdi-check</v-icon
                >
              </div>
              <div v-else>
                <v-icon color="red" small>mdi-close</v-icon>
              </div>
            </template>
            <template v-slot:[`item.Actions`]="{ item }">
              <v-tooltip
                bottom
                v-if="
                  item.main_ticket_date == undefined &&
                  item.rft_date == undefined
                "
                class="FontSize"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    icon
                    color="primary"
                    @click="checkItem(item, 'CREATE_TICKET')"
                  >
                    <v-icon small>mdi-plus-box-outline</v-icon>
                  </v-btn>
                </template>
                <span>Create Ticket</span>
              </v-tooltip>
              <div
                v-else-if="
                  item.main_ticket_date == undefined &&
                  item.rft_date != undefined
                "
              >
                <v-icon
                  color="yellow"
                  small
                  v-if="
                    item.main_ticket_date == undefined &&
                    item.rft_date != undefined
                  "
                  >mdi-checkbox-marked-circle</v-icon
                >
              </div>
              <div
                v-else-if="
                  item.main_ticket_date != undefined &&
                  item.rft_date != undefined
                "
              >
                <v-icon
                  color="green"
                  small
                  v-if="
                    item.main_ticket_date != undefined &&
                    item.rft_date != undefined
                  "
                  >mdi-checkbox-marked-circle</v-icon
                >
              </div>
              <div
                v-else-if="
                  item.main_ticket_date != undefined &&
                  item.rft_date == undefined
                "
              >
                <v-icon
                  color="green"
                  small
                  v-if="
                    item.main_ticket_date != undefined &&
                    item.rft_date == undefined
                  "
                  >mdi-checkbox-marked-circle</v-icon
                >
              </div>
              <div v-else>
                <v-icon color="red" small>mdi-close</v-icon>
              </div>
            </template>
            <template v-slot:[`item.ticket_status`]="{ item }">
              <div class="FontSize" v-if="item.ticket_status != undefined">
                {{ item.ticket_status }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-text class="mt-n4">
          <div
            v-if="extendedScheduledMaintaniceDates.length != 0"
            class="font-weight-bold elevation-0"
            style="color: black"
          >
            Extended Schedule Maintenance Dates
          </div>
          <v-data-table
            v-if="extendedScheduledMaintaniceDates.length != 0"
            dense
            class="elevation-0 mt-2"
            :headers="extendedMaintainceDatesHeader"
            :items="extendedScheduledMaintaniceDates"
            fixed-header
            height="190px"
            :footer-props="{
              'items-per-page-options': [20, 50, 100],
            }"
            :items-per-page="20"
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize">
                {{ extendedScheduledMaintaniceDates.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.extended_dates`]="{ item }">
              <div class="FontSize">
                {{ new Date(item.extended_dates * 1000).toDateString() }}
              </div>
            </template>
            <template v-slot:[`item.extended_rft_date`]="{ item }">
              <div class="FontSize">
                {{
                  item.extended_rft_date != undefined
                    ? new Date(item.extended_rft_date * 1000).toDateString()
                    : ""
                }}
                <v-icon
                  color="green"
                  small
                  v-if="item.extended_rft_date != undefined"
                >
                  mdi-check
                </v-icon>
                <div v-else>
                  <v-icon color="red" small>mdi-close</v-icon>
                </div>
              </div>
            </template>
            <template v-slot:[`item.extended_main_ticket_date`]="{ item }">
              <div class="FontSize">
                {{
                  item.extended_main_ticket_date != undefined
                    ? new Date(
                        item.extended_main_ticket_date * 1000
                      ).toDateString()
                    : ""
                }}
                <v-icon
                  color="green"
                  small
                  v-if="item.extended_main_ticket_date != undefined"
                >
                  mdi-check
                </v-icon>
                <div v-else><v-icon color="red" small>mdi-close</v-icon></div>
              </div>
            </template>
            <template v-slot:[`item.Extended_Actions`]="{ item }">
              <v-tooltip
                bottom
                class="FontSize"
                v-if="
                  item.extended_main_ticket_date == undefined &&
                  item.extended_rft_date == undefined
                "
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    icon
                    color="primary"
                    @click="
                      checkItem(item, 'CREATE_TICKET_FROM_EXTENDED_VISITS')
                    "
                  >
                    <v-icon small>mdi-plus-box-outline</v-icon>
                  </v-btn>
                </template>
                <span>Create Ticket</span>
              </v-tooltip>
              <div
                v-else-if="
                  item.extended_main_ticket_date == undefined &&
                  item.extended_rft_date != undefined
                "
              >
                <v-icon
                  color="yellow"
                  small
                  v-if="
                    item.extended_main_ticket_date == undefined &&
                    item.extended_rft_date != undefined
                  "
                  >mdi-checkbox-marked-circle</v-icon
                >
              </div>
              <div
                v-else-if="
                  item.extended_main_ticket_date != undefined &&
                  item.extended_rft_date != undefined
                "
              >
                <v-icon
                  color="green"
                  small
                  v-if="
                    item.extended_main_ticket_date != undefined &&
                    item.extended_rft_date != undefined
                  "
                  >mdi-checkbox-marked-circle</v-icon
                >
              </div>
              <div v-else>
                <v-icon color="red" small>mdi-close</v-icon>
              </div>
            </template>
            <template v-slot:[`item.ticket_status_extended`]="{ item }">
              <div
                class="FontSize"
                v-if="item.ticket_status_extended != undefined"
              >
                {{ item.ticket_status_extended }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-card-text>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import CreateTicketCard from "@/components/Product/Cards/CreateTicketFromProductFleet.vue";
import dailogTicketDetails from "@/components/ScheduledService/Dialogs/ViewTicketDetailsDailog.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    Snackbar,
    CreateTicketCard,
    dailogTicketDetails,
    ViewScheduleVisitDate,
  },
  data: () => ({
    renderComp: true,
    viewTicketDetailsDailog: false,
    DialogScheduleCreateTicket: false,
    DialogViewScheduleVisitDates: false,
    current_view: "LIST",
    StoreObjNew: {},
    SnackBarComponent: {},
    GetAllCustomerDetails: [],
    extended_warranty_details: [],
    scheduledMaintainanceDates: [],
    extendedScheduledMaintaniceDates: [],
    extendedSupportHeaders: [
      { text: "#", value: "sl_no" },
      { text: "Support", value: "extended_ticket_warranty_type" },
      { text: "Warranty", value: "extended_warranty_type" },
      { text: "Starts", value: "extendedWarrantyStartDate" },
      { text: "Ends", value: "extendedWarrantyEndEate" },
      { text: "Frequency", value: "extendedWarrantyFrequency" },
      { text: "No. of Visits", value: "extendedWarrantyDatesList" },
    ],
    extendedMaintainceDatesHeader: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Dates", value: "extended_dates" },
      { text: "Converted to RFS", value: "extended_rft_date", align: "center" },
      {
        text: "Converted to Ticket",
        value: "extended_main_ticket_date",
        align: "center",
      },
      {
        text: "Convert to Ticket",
        value: "Extended_Actions",
        align: "center",
      },
      {
        text: "Ticket Status",
        value: "ticket_status_extended",
        align: "center",
      },
    ],
    FileHeaders: [
      {
        text: "Sl No.",
        value: "sl_no",
      },
      {
        text: "File Name",
        value: "file_name",
      },
      {
        text: "File Type",
        value: "file_type",
      },
    ],
    mantainanceDatesHeader: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Dates", value: "date" },
      { text: "Converted to RFS", value: "rft_date", align: "center" },
      {
        text: "Converted to Ticket",
        value: "main_ticket_date",
        align: "center",
      },
      {
        text: "Convert to Ticket",
        value: "Actions",
        align: "center",
      },
      {
        text: "Ticket Status",
        value: "ticket_status",
        align: "center",
      },
    ],
  }),
  watch: {},
  mounted() {
    if (this.StoreObj.action == "EDIT") {
      if (
        this.StoreObj.converted_to_rft_ticket != undefined &&
        this.StoreObj.converted_to_original_ticket != undefined
      ) {
        for (
          let i = 0;
          i < this.StoreObj.rft_date_list.map((item) => parseInt(item)).length;
          i++
        ) {
          this.scheduledMaintainanceDates.push({
            date:
              this.StoreObj.rft_date_list.map((item) => parseInt(item))[i] !=
              undefined
                ? this.StoreObj.rft_date_list.map((item) => parseInt(item))[i]
                : undefined,
            rft_date:
              this.StoreObj.converted_to_rft_ticket.map((item) =>
                parseInt(item.rft_ticket_generated_on)
              )[i] != undefined
                ? this.StoreObj.converted_to_rft_ticket.map((item) =>
                    parseInt(item.rft_ticket_generated_on)
                  )[i]
                : undefined,
            main_ticket_date:
              this.StoreObj.converted_to_original_ticket.map((item) =>
                parseInt(item.scheduled_on_date)
              )[i] != undefined &&
              this.StoreObj.converted_to_original_ticket[i] != ""
                ? this.StoreObj.converted_to_original_ticket.map((item) =>
                    parseInt(item.scheduled_on_date)
                  )[i]
                : undefined,
            ticket_status:
              this.StoreObj.converted_to_original_ticket.map(
                (item) => item.ticket_status
              )[i] != undefined &&
              this.StoreObj.converted_to_original_ticket[i] != ""
                ? this.StoreObj.converted_to_original_ticket.map(
                    (item) => item.ticket_status
                  )[i]
                : undefined,
          });
        }
      } else if (
        this.StoreObj.converted_to_rft_ticket != undefined &&
        this.StoreObj.converted_to_original_ticket == undefined
      ) {
        for (
          let i = 0;
          i < this.StoreObj.rft_date_list.map((item) => parseInt(item)).length;
          i++
        ) {
          this.scheduledMaintainanceDates.push({
            date:
              this.StoreObj.rft_date_list.map((item) => parseInt(item))[i] !=
              undefined
                ? this.StoreObj.rft_date_list.map((item) => parseInt(item))[i]
                : undefined,
            rft_date:
              this.StoreObj.converted_to_rft_ticket.map((item) =>
                parseInt(item.rft_ticket_generated_on)
              )[i] != undefined
                ? this.StoreObj.converted_to_rft_ticket.map((item) =>
                    parseInt(item.rft_ticket_generated_on)
                  )[i]
                : undefined,
            ticket_status:
              this.StoreObj.converted_to_original_ticket != undefined
                ? this.StoreObj.converted_to_original_ticket.map(
                    (item) => item.ticket_status
                  )[i] != undefined &&
                  this.StoreObj.converted_to_original_ticket[i] != ""
                  ? this.StoreObj.converted_to_original_ticket.map(
                      (item) => item.ticket_status
                    )[i]
                  : undefined
                : undefined,
          });
        }
      } else if (
        this.StoreObj.converted_to_rft_ticket == undefined &&
        this.StoreObj.converted_to_original_ticket != undefined
      ) {
        for (
          let i = 0;
          i < this.StoreObj.rft_date_list.map((item) => parseInt(item)).length;
          i++
        ) {
          this.scheduledMaintainanceDates.push({
            date:
              this.StoreObj.rft_date_list.map((item) => parseInt(item))[i] !=
              undefined
                ? this.StoreObj.rft_date_list.map((item) => parseInt(item))[i]
                : undefined,
            main_ticket_date:
              this.StoreObj.converted_to_original_ticket.map((item) =>
                parseInt(item.scheduled_on_date)
              )[i] != undefined &&
              this.StoreObj.converted_to_original_ticket[i] != ""
                ? this.StoreObj.converted_to_original_ticket.map((item) =>
                    parseInt(item.scheduled_on_date)
                  )[i]
                : undefined,
            ticket_status:
              this.StoreObj.converted_to_original_ticket.map(
                (item) => item.ticket_status
              )[i] != undefined &&
              this.StoreObj.converted_to_original_ticket[i] != ""
                ? this.StoreObj.converted_to_original_ticket.map(
                    (item) => item.ticket_status
                  )[i]
                : undefined,
          });
        }
      } else {
        for (
          let i = 0;
          i < this.StoreObj.rft_date_list.map((item) => parseInt(item)).length;
          i++
        ) {
          this.scheduledMaintainanceDates.push({
            date:
              this.StoreObj.rft_date_list.map((item) => parseInt(item))[i] !=
              undefined
                ? this.StoreObj.rft_date_list.map((item) => parseInt(item))[i]
                : undefined,
          });
        }
      }
    }
    if (this.StoreObj.action == "EDIT") {
      if (
        this.StoreObj.extended_support_converted_rft_ticket != undefined &&
        this.StoreObj.extednded_support_converted_to_original_tickets !=
          undefined
      ) {
        for (
          let i = 0;
          i <
          this.StoreObj.extended_warranty_dates_list.map((item) =>
            parseInt(item)
          ).length;
          i++
        ) {
          this.extendedScheduledMaintaniceDates.push({
            extended_dates:
              this.StoreObj.extended_warranty_dates_list.map((item) =>
                parseInt(item)
              )[i] != undefined
                ? this.StoreObj.extended_warranty_dates_list.map((item) =>
                    parseInt(item)
                  )[i]
                : undefined,
            extended_rft_date:
              this.StoreObj.extended_support_converted_rft_ticket.map((item) =>
                parseInt(item.extended_rft_ticket_generated_on)
              )[i] != undefined
                ? this.StoreObj.extended_support_converted_rft_ticket.map(
                    (item) => parseInt(item.extended_rft_ticket_generated_on)
                  )[i]
                : undefined,
            extended_main_ticket_date:
              this.StoreObj.extednded_support_converted_to_original_tickets.map(
                (item) => parseInt(item.scheduled_on_date)
              )[i] != undefined &&
              this.StoreObj.extednded_support_converted_to_original_tickets[
                i
              ] != ""
                ? this.StoreObj.extednded_support_converted_to_original_tickets.map(
                    (item) => parseInt(item.scheduled_on_date)
                  )[i]
                : undefined,
            ticket_status:
              this.StoreObj.extednded_support_converted_to_original_tickets.map(
                (item) => item.ticket_status
              )[i] != undefined &&
              this.StoreObj.extednded_support_converted_to_original_tickets[
                i
              ] != ""
                ? this.StoreObj.extednded_support_converted_to_original_tickets.map(
                    (item) => item.ticket_status
                  )[i]
                : undefined,
          });
        }
      } else if (
        this.StoreObj.extended_support_converted_rft_ticket != undefined &&
        this.StoreObj.extednded_support_converted_to_original_tickets ==
          undefined
      ) {
        for (
          let i = 0;
          i <
          this.StoreObj.extended_warranty_dates_list.map((item) =>
            parseInt(item)
          ).length;
          i++
        ) {
          this.extendedScheduledMaintaniceDates.push({
            extended_dates:
              this.StoreObj.extended_warranty_dates_list.map((item) =>
                parseInt(item)
              )[i] != undefined
                ? this.StoreObj.extended_warranty_dates_list.map((item) =>
                    parseInt(item)
                  )[i]
                : undefined,
            extended_rft_date:
              this.StoreObj.extended_support_converted_rft_ticket.map((item) =>
                parseInt(item.extended_rft_ticket_generated_on)
              )[i] != undefined
                ? this.StoreObj.extended_support_converted_rft_ticket.map(
                    (item) => parseInt(item.extended_rft_ticket_generated_on)
                  )[i]
                : undefined,
            ticket_status:
              this.StoreObj.extednded_support_converted_to_original_tickets.map(
                (item) => item.ticket_status
              )[i] != undefined &&
              this.StoreObj.extednded_support_converted_to_original_tickets[
                i
              ] != ""
                ? this.StoreObj.extednded_support_converted_to_original_tickets.map(
                    (item) => item.ticket_status
                  )[i]
                : undefined,
          });
        }
      } else if (
        this.StoreObj.extended_support_converted_rft_ticket == undefined &&
        this.StoreObj.extednded_support_converted_to_original_tickets !=
          undefined
      ) {
        for (
          let i = 0;
          i <
          this.StoreObj.extended_warranty_dates_list.map((item) =>
            parseInt(item)
          ).length;
          i++
        ) {
          this.extendedScheduledMaintaniceDates.push({
            extended_dates:
              this.StoreObj.extended_warranty_dates_list.map((item) =>
                parseInt(item)
              )[i] != undefined
                ? this.StoreObj.extended_warranty_dates_list.map((item) =>
                    parseInt(item)
                  )[i]
                : undefined,
            extended_main_ticket_date:
              this.StoreObj.extednded_support_converted_to_original_tickets.map(
                (item) => parseInt(item.scheduled_on_date)
              )[i] != undefined &&
              this.StoreObj.extednded_support_converted_to_original_tickets[
                i
              ] != ""
                ? this.StoreObj.extednded_support_converted_to_original_tickets.map(
                    (item) => parseInt(item.scheduled_on_date)
                  )[i]
                : undefined,
            ticket_status:
              this.StoreObj.extednded_support_converted_to_original_tickets.map(
                (item) => item.ticket_status
              )[i] != undefined &&
              this.StoreObj.extednded_support_converted_to_original_tickets[
                i
              ] != ""
                ? this.StoreObj.extednded_support_converted_to_original_tickets.map(
                    (item) => item.ticket_status
                  )[i]
                : undefined,
          });
        }
      } else {
        for (
          let i = 0;
          i <
          this.StoreObj.extended_warranty_dates_list.map((item) =>
            parseInt(item)
          ).length;
          i++
        ) {
          this.extendedScheduledMaintaniceDates.push({
            extended_dates:
              this.StoreObj.extended_warranty_dates_list.map((item) =>
                parseInt(item)
              )[i] != undefined
                ? this.StoreObj.extended_warranty_dates_list.map((item) =>
                    parseInt(item)
                  )[i]
                : undefined,
          });
        }
      }
    }
  },
  methods: {
    viewTicketDetailsDailogemit() {
      this.viewTicketDetailsDailog = false;
    },
    DialogViewScheduleVisitDatesEmit() {
      this.DialogViewScheduleVisitDates = false;
    },
    viewScheduleVisitDates(item) {
      this.StoreObjNew = item;
      this.DialogViewScheduleVisitDates = true;
    },
    viewTicketDetailsMethod() {
      this.viewTicketDetailsDailog = true;
    },
    handleRowClick(item) {
      window.open(item.file_url);
    },
    EmitView() {
      this.$emit("clicked");
    },
    CreateTicketCardEmit(Toggle, Status_Message) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: Status_Message,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    checkItem(item, action) {
      this.StoreObj1 = item;
      this.StoreObj1.action = action;
      if (action == "CREATE_TICKET") {
        this.current_view = "CREATE_TICKET";
      } else if (action == "CREATE_TICKET_FROM_EXTENDED_VISITS") {
        this.current_view = "CREATE_TICKET";
      }
    },
  },
};
</script>
