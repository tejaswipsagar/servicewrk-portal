<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-dialog :value="dialogRepeatDialog" persistent width="80%">
      <Overlay :overlay="overlay" />
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <v-icon small class="mr-2">mdi-repeat</v-icon>
          <span
            >Repeat Ticket
            <span v-if="this.StoreObj.custom_ticket_id == undefined">
              {{ StoreObj.ticket_id }}
            </span>
            <span v-else-if="this.StoreObj.custom_ticket_id != undefined">
              {{ StoreObj.custom_ticket_id }}
            </span>
          </span>
          <v-spacer />
          <v-btn icon @click="dialogRepeatDialogEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-5 pb-0">
          <v-card class="elevation-0 FontSize">
            <h2 class="mb-3">Customer information :</h2>
            <v-row>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Customer Type :
                  <span class="font-weight-regular">{{
                    StoreObj.customer_type
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Customer :
                  <span class="font-weight-regular">{{
                    StoreObj.customer_company_name
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Contact Person :
                  <span class="font-weight-regular">{{
                    StoreObj.customer_name
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Phone :
                  <span class="font-weight-regular">{{
                    StoreObj.customer_phone_number
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Email :
                  <span class="font-weight-regular">{{
                    StoreObj.customer_email_id
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Customer ID :
                  <span class="font-weight-regular">{{
                    StoreObj.customer_unique_id
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Address :
                  <span class="font-weight-regular">{{
                    StoreObj.ticket_address
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  City :
                  <span class="font-weight-regular">{{
                    StoreObj.ticket_city
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  State :
                  <span class="font-weight-regular">{{
                    StoreObj.ticket_state
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Pincode :
                  <span class="font-weight-regular">{{
                    StoreObj.ticket_pincode
                  }}</span>
                </div>
              </v-col>
            </v-row>
            <h2 class="my-3">Product Information :</h2>
            <v-row>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Category :
                  <span class="font-weight-regular">
                    {{ StoreObj.category_name }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Product :
                  <span class="font-weight-regular">
                    {{ StoreObj.service_name }}
                  </span>
                </div>
              </v-col>
              <!-- <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Serial Number :
                  <span class="font-weight-regular">
                    {{ StoreObj.service_serial_number }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Ticket Type :
                  <span class="font-weight-regular">
                    {{ StoreObj.ticket_type }}
                  </span>
                </div>
              </v-col> -->
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Service Type :
                  <span class="font-weight-regular">
                    {{ StoreObj.service_type_name }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Problem Description :
                  <span class="font-weight-regular">
                    {{ StoreObj.service_ticket_description }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Support :
                  <span class="font-weight-regular">
                    {{ StoreObj.ticket_warranty_type }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Support Type :
                  <span class="font-weight-regular">
                    {{ StoreObj.support_type }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Invoice Date :
                  <span class="font-weight-regular">
                    {{ StoreObj.ticket_invoice_date }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Installation Date :
                  <span class="font-weight-regular">
                    {{ StoreObj.installation_date }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Additional Comments :
                  <span class="font-weight-regular">
                    {{ StoreObj.additional_comments }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <div class="font-weight-bold">
                  Free Of Cost :
                  <span
                    class="font-weight-regular green--text"
                    v-if="StoreObj.is_free_of_cost == true"
                  >
                    Yes
                  </span>
                  <span class="font-weight-regular red--text" v-else> No </span>
                </div>
              </v-col>
              <v-col cols="12" md="8" xs="12" sm="12">
                <v-form ref="form">
                  <v-row no-gutters>
                    <v-col cols="12" lg="3" md="3" xs="12" sm="12">
                      <v-text-field
                        dense
                        outlined
                        class="FontSize mr-3"
                        label="Serial Number"
                        :rules="serail_number_rules"
                        v-model="service_serial_number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" xs="12" sm="12">
                      <v-text-field
                        dense
                        outlined
                        class="FontSize mr-3"
                        label="Asset Number"
                        readonly
                        :rules="serail_number_rules"
                        v-model="assetNumber"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" xs="12" sm="12">
                      <v-autocomplete
                        dense
                        outlined
                        class="FontSize ml-3"
                        label="Ticket Type"
                        :rules="ticket_type_rules"
                        v-model="ticket_creation_type"
                        :items="ticket_creation_type_items"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
              <!-- <v-col cols="12" md="4" xs="12" sm="12">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Serial Number"
                  :rules="serail_number_rules"
                  v-model="service_serial_number"
                ></v-text-field>
              </v-col> -->
            </v-row>
          </v-card>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="4" sm="12" xs="12">
                <v-select
                  dense
                  outlined
                  class="FontSize"
                  v-model="UserType"
                  label="User Type *"
                  :rules="[(v) => !!v || 'Required']"
                  :items="
                    $store.getters.get_current_user_details.user_type ==
                    'SERVICE_PARTNER'
                      ? UserListPartner
                      : $store.getters.get_current_user_details.user_type ==
                        'DEALER_OWNER'
                      ? UserListDealer
                      : UserList
                  "
                ></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <v-select
                  dense
                  outlined
                  class="FontSize"
                  item-value="user_id"
                  item-text="user_name"
                  v-model="assignee_user_id"
                  :rules="[(v) => !!v || 'Required']"
                  :label="
                    this.UserType == 'SERVICE_PARTNER'
                      ? 'Select Primary Service Partner *'
                      : this.UserType == 'DEALER_OWNER'
                      ? 'Select Primary Dealer *'
                      : 'Select Primary Representative *'
                  "
                  :items="
                    this.UserType == 'ENTERPRISE_REPRESENTATIVE'
                      ? GetAllUsrTypeLocationBasedUsers
                      : GetAllUsrTypeLocationBasedUsersForPartnersAndDealers
                  "
                >
                </v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  item-value="user_id"
                  item-text="user_name"
                  v-model="secondary_technician_id"
                  :items="secondaryRepresentativeItem"
                  :label="
                    this.UserType == 'SERVICE_PARTNER'
                      ? 'Select Secondary Service Partner '
                      : this.UserType == 'DEALER_OWNER'
                      ? 'Select Secondary Dealer'
                      : 'Select Secondary Representative'
                  "
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  label="Ticket Priority"
                  v-model="ticket_priority"
                  :items="ticket_priority_items"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <v-menu
                  offset-y
                  ref="menu"
                  v-model="menu"
                  :nudge-right="40"
                  :return-value.sync="date"
                  transition="scale-transition"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      v-on="on"
                      v-model="date"
                      color="primary"
                      persistent-hint
                      class="FontSize"
                      prepend-inner-icon="event"
                      label="Preferred Visit Date*"
                      :rules="[(v) => !!v || 'Required']"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-btn text color="primary" @click="menu = false"
                      >Cance</v-btn
                    >
                    <v-spacer />
                    <v-btn text color="primary" @click="$refs.menu.save(date)"
                      >OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <v-dialog
                  persistent
                  ref="dialog"
                  width="300px"
                  v-model="modal2"
                  :return-value.sync="time"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      readonly
                      v-on="on"
                      outlined
                      v-bind="attrs"
                      v-model="time"
                      class="FontSize ml-2 mr-4"
                      label="Preferred Visit Time *"
                      prepend-inner-icon="access_time"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="modal2" v-model="time">
                    <v-btn text color="primary" @click="modal2 = false"
                      >Cancel</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="$refs.dialog.save(time)"
                      >OK</v-btn
                    >
                  </v-time-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-form>
          <div>
            <strong> Product Files</strong>
            <v-data-table
              v-if="StoreObj?.product_attachments"
              dense
              :headers="productFilesHeaders"
              :items="StoreObj.product_attachments"
              class="TableValFontsize"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <div>
                  <v-btn icon @click="viewAttachment(item.file_url)">
                    <v-icon small color="primary">mdi-eye</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer />
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="repeatTicketMethod()"
          >
            Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { ReCreateTicket } from "@/graphql/mutations.js";
import { ListAllUserTypeLocationBasedUsers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsers.js";
import { ListAllUserTypeLocationBasedUsersForPartnersAndDealers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsersForPartnersAndDealers.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  props: {
    StoreObj: Object,
    dialogRepeatDialog: Boolean,
  },
  mixins: [
    ListAllUserTypeLocationBasedUsers,
    ListAllUserTypeLocationBasedUsersForPartnersAndDealers,
    GetTicketDetails,
  ],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    menu: false,
    modal2: false,
    overlay: false,
    loading: false,
    renderComp: true,
    time: "",
    ticket_priority: "",
    assignee_user_id: "",
    ticket_creation_type: "",
    service_serial_number: "",
    assetNumber: "",
    secondary_technician_id: "",
    UserType: "ENTERPRISE_REPRESENTATIVE",
    date: new Date().toISOString().substr(0, 10),
    SnackBarComponent: {},
    ticket_type_rules: [],
    serail_number_rules: [],
    secondaryRepresentativeItem: [],
    GetAllUsrTypeLocationBasedUsersForPartnersAndDealers: [],
    ticket_creation_type_items: [
      { text: "Breakdown", value: "BREAKDOWN" },
      { text: "Installation", value: "INSTALLATION" },
      { text: "Schedule Service", value: "SCHEDULE_SERVICE" },
      { text: "Core Service Job", value: "CORE_SERVICE_JOB" },
      { text: "Non-Core Service Job", value: "NON_CORE_SERVICE_JOB" },
      { text: "Sundary Job", value: "SUNDARY_JOB" },
      { text: "Other", value: "OTHER" },
    ],
    UserList: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
    UserListPartner: [{ text: "Service Partner", value: "SERVICE_PARTNER" }],
    UserListDealer: [
      { text: "Service Dealer", value: "DEALER_OWNER" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
    ],
    UserListDealer: [
      { text: "Service Dealer", value: "DEALER_OWNER" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
    ],
    ticket_priority_items: ["High", "Medium", "Low"],
    UserList: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
    productFilesHeaders: [
      { text: "File Name", value: "file_name" },
      { text: "File Type", value: "file_type" },
      { text: "Actions", value: "actions" },
    ],
  }),
  watch: {
    async dialogRepeatDialog(val) {
      console.log("STOREOBJ_REPEAT_TICKET", this.StoreObj.product_attachments);
      if (val == true) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.GetAllUerTypeLocationBasedUsers(
          this.StoreObj.ticket_latitude,
          this.StoreObj.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.UserType,
          this.StoreObj.ticket_territories != undefined &&
            this.StoreObj.ticket_territories.length != 0
            ? this.StoreObj.ticket_territories
            : undefined
        );
        this.assetNumber = this.StoreObj.asset_number || "";
        this.service_serial_number =
          this.StoreObj.service_serial_number != undefined &&
          this.StoreObj.service_serial_number != null &&
          this.StoreObj.service_serial_number != ""
            ? this.StoreObj.service_serial_number
            : "";
        this.ticket_creation_type =
          this.StoreObj.ticket_creation_type != undefined &&
          this.StoreObj.ticket_creation_type != null &&
          this.StoreObj.ticket_creation_type != ""
            ? this.StoreObj.ticket_creation_type
            : "";
        this.serail_number_rules = [];
        if (
          this.$store.getters.get_current_user_details.organization_details
            .ticket_create_sequence != undefined
        ) {
          if (
            this.$store.getters.get_current_user_details.organization_details.ticket_create_sequence.includes(
              "PRODUCT_FLEET"
            )
          ) {
            this.serail_number_rules = [(v) => !!v || "Required"];
          } else {
            this.serail_number_rules = [];
          }
        } else {
          this.serail_number_rules = [];
        }
        this.ticket_type_rules = [];
        if (
          this.$store.getters.get_current_user_details.organization_details
            .ticket_create_sequence != undefined
        ) {
          if (
            this.$store.getters.get_current_user_details.organization_details.ticket_create_sequence.includes(
              "CALL_TYPE"
            )
          ) {
            this.ticket_type_rules = [(v) => !!v || "Required"];
          } else {
            this.ticket_type_rules = [];
          }
        } else {
          this.ticket_type_rules = [];
        }
      }
    },
    UserType(val) {
      this.secondaryRepresentativeItem = [];
      this.GetAllUsrTypeLocationBasedUsers = [];
      this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers = [];
      if (val == "ENTERPRISE_REPRESENTATIVE") {
        this.GetAllUerTypeLocationBasedUsers(
          this.StoreObj.ticket_latitude,
          this.StoreObj.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          val,
          this.StoreObj.ticket_territories != undefined &&
            this.StoreObj.ticket_territories.length != 0
            ? this.StoreObj.ticket_territories
            : undefined
        );
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.StoreObj.ticket_latitude,
          this.StoreObj.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          val,
          this.StoreObj.ticket_territories != undefined &&
            this.StoreObj.ticket_territories.length != 0
            ? this.StoreObj.ticket_territories
            : undefined,
          this.StoreObj.ticket_pincode != undefined &&
            this.StoreObj.ticket_pincode != ""
            ? this.StoreObj.ticket_pincode
            : undefined,
          undefined
        );
      }
    },
    assignee_user_id(val) {
      this.secondaryRepresentativeItem = [];
      if (this.UserType == "ENTERPRISE_REPRESENTATIVE") {
        if (val != "" && val != null && val != undefined) {
          this.GetAllUsrTypeLocationBasedUsers.map((item) => {
            if (item.user_id != val) {
              this.secondaryRepresentativeItem.push(item);
            }
          });
        }
      } else {
        this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers.map(
          (item) => {
            if (item.user_id != val) {
              this.secondaryRepresentativeItem.push(item);
            }
          }
        );
      }
    },
  },
  monted() {
    this.GetAllUerTypeLocationBasedUsers(
      this.StoreObj.ticket_latitude,
      this.StoreObj.ticket_longitude,
      this.StoreObj.service_id,
      this.$store.getters.get_current_user_details.user_id,
      this.UserType,
      undefined
    );
  },
  methods: {
    viewAttachment(url) {
      window.open(url, "__blank");
    },
    async repeatTicketMethod() {
      if (this.$refs.form.validate()) {
        try {
          var inputParams = {
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            customer_name: this.StoreObj.customer_name,
            is_rft_ticket: false,
            customer_type: this.StoreObj.customer_type,
            ticket_latitude: this.StoreObj.ticket_latitude,
            ticket_longitude: this.StoreObj.ticket_longitude,
            customer_country_code: this.StoreObj.customer_country_code,
            customer_phone_number: this.StoreObj.customer_phone_number,
            primary_ticket_id: this.StoreObj.ticket_id,
            ticket_address: this.StoreObj.ticket_address,
            ticket_city:
              this.StoreObj.ticket_city != undefined &&
              this.StoreObj.ticket_city != null &&
              this.StoreObj.ticket_city != ""
                ? this.StoreObj.ticket_city
                : undefined,
            ticket_state:
              this.StoreObj.ticket_state != undefined &&
              this.StoreObj.ticket_state != null &&
              this.StoreObj.ticket_state != ""
                ? this.StoreObj.ticket_state
                : undefined,
            ticket_pincode:
              this.StoreObj.ticket_pincode != undefined &&
              this.StoreObj.ticket_pincode != null &&
              this.StoreObj.ticket_pincode != ""
                ? this.StoreObj.ticket_pincode
                : undefined,
            add_customer_to_db: false,
            is_repeat_ticket:
              this.StoreObj.action == "REPEAT_TICKET" ? true : false,
            tagged_territories:
              this.StoreObj.tagged_territories != undefined
                ? this.StoreObj.tagged_territories
                : [],
            assignee_user_id: this.assignee_user_id,
            prefered_visit_date: this.date,
            prefered_visit_time: this.time,
            ticket_dependency_details: [
              {
                category_id: this.StoreObj.category_id,
                service_id: this.StoreObj.service_id,
                asset_number: this.assetNumber || undefined,
                service_serial_number:
                  this.service_serial_number != undefined &&
                  this.service_serial_number != null &&
                  this.service_serial_number != ""
                    ? this.service_serial_number
                    : undefined,
                service_type_id: this.StoreObj.service_type_id,
                service_ticket_description:
                  this.StoreObj.service_ticket_description != undefined &&
                  this.StoreObj.service_ticket_description != null &&
                  this.StoreObj.service_ticket_description != ""
                    ? this.StoreObj.service_ticket_description
                    : undefined,
                additional_comments:
                  this.StoreObj.additional_comments != undefined &&
                  this.StoreObj.additional_comments != null &&
                  this.StoreObj.additional_comments != ""
                    ? this.StoreObj.additional_comments
                    : undefined,
                is_free_of_cost:
                  this.StoreObj.is_free_of_cost != undefined
                    ? this.StoreObj.is_free_of_cost
                    : false,
                ticket_warranty_type:
                  this.StoreObj.ticket_warranty_type != undefined &&
                  this.StoreObj.ticket_warranty_type != null &&
                  this.StoreObj.ticket_warranty_type != ""
                    ? this.StoreObj.ticket_warranty_type
                    : undefined,
                support_type:
                  this.StoreObj.support_type != undefined &&
                  this.StoreObj.support_type != null &&
                  this.StoreObj.support_type != ""
                    ? this.StoreObj.support_type
                    : undefined,
                installation_date:
                  this.StoreObj.installation_date != undefined &&
                  this.StoreObj.installation_date != null &&
                  this.StoreObj.installation_date != ""
                    ? this.StoreObj.installation_date
                    : undefined,
                ticket_creation_type:
                  this.ticket_creation_type != undefined &&
                  this.ticket_creation_type != null &&
                  this.ticket_creation_type != ""
                    ? this.ticket_creation_type
                    : undefined,
                ticket_warranty_details:
                  this.StoreObj.ticket_warranty_details != undefined
                    ? this.StoreObj.ticket_warranty_details
                    : undefined,
                ticket_s3_files:
                  this.StoreObj.attachment_file != undefined
                    ? this.StoreObj.attachment_file
                    : undefined,
                product_attachments:
                  this.StoreObj.product_attachments?.length > 0
                    ? this.StoreObj.product_attachments
                    : undefined,
              },
            ],
          };
          if (
            this.ticket_priority != undefined &&
            this.ticket_priority != null &&
            this.ticket_priority != ""
          ) {
            inputParams.ticket_priority = this.ticket_priority;
          }
          if (
            this.secondary_technician_id != undefined &&
            this.secondary_technician_id != null &&
            this.secondary_technician_id != ""
          ) {
            inputParams.secondary_technician_id = this.secondary_technician_id;
          }
          if (
            this.StoreObj.customer_unique_id != undefined &&
            this.StoreObj.customer_unique_id != null &&
            this.StoreObj.customer_unique_id != ""
          ) {
            inputParams.customer_unique_id = this.StoreObj.customer_unique_id;
          }
          if (
            this.StoreObj.customer_email_id != undefined &&
            this.StoreObj.customer_email_id != null &&
            this.StoreObj.customer_email_id != ""
          ) {
            inputParams.customer_email_id = this.StoreObj.customer_email_id;
          }
          if (
            this.StoreObj.customer_call_time != undefined &&
            this.StoreObj.customer_call_time != null &&
            this.StoreObj.customer_call_time != ""
          ) {
            inputParams.customer_call_time = this.StoreObj.customer_call_time;
          }
          if (
            this.StoreObj.customer_call_date != undefined &&
            this.StoreObj.customer_call_date != null &&
            this.StoreObj.customer_call_date != ""
          ) {
            inputParams.customer_call_date = this.StoreObj.customer_call_date;
          }
          if (
            this.StoreObj.customer_company_name != undefined &&
            this.StoreObj.customer_company_name != null &&
            this.StoreObj.customer_company_name != ""
          ) {
            inputParams.customer_company_name =
              this.StoreObj.customer_company_name;
          }
          if (
            this.StoreObj.secondary_customer_contact != undefined &&
            this.StoreObj.secondary_customer_contact != null &&
            this.StoreObj.secondary_customer_contact != ""
          ) {
            inputParams.secondary_customer_contact =
              this.StoreObj.secondary_customer_contact;
          }
          this.loading = true;
          let result = await API.graphql(
            graphqlOperation(ReCreateTicket, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.ReCreateTicket);
          if (ResultObject.status == "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: ResultObject.status_message,
              };
              this.renderComp = true;
            });
            this.dialogRepeatDialogEmit((this.Toggle = 2));
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
      } else {
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
    dialogRepeatDialogEmit(Toggle) {
      this.$refs.form.reset();
      this.UserType = "ENTERPRISE_REPRESENTATIVE";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
