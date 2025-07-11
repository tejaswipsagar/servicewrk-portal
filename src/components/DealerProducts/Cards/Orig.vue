<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="PrimaryFontColor heading1 font-weight-bold">
          {{
            $store.getters.get_current_user_details.user_type == "DEALER_OWNER"
              ? "Raise A Complaint"
              : "Craete Ticket"
          }}
        </div>
        <v-spacer></v-spacer>
        <v-btn small color="primary" @click="CreateTicketCardEmit((Toggle = 1))"
          ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
        >
      </v-toolbar>
    </v-card>
    <v-card-text>
      <v-form ref="form">
        <b>Customer Information: </b>
        <v-row class="mt-1" no-gutters>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-select
              dense
              outlined
              class="FontSize mr-2"
              label="Customer Type *"
              :items="customer_type_items"
              v-model="create_ticket.customer_type"
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
            xs="12"
            v-if="this.create_ticket.customer_type == 'BUSINESS'"
          >
            <v-text-field
              dense
              outlined
              readonly
              label="Customer"
              class="FontSize mr-2"
              v-model="create_ticket.customer_company_name"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              readonly
              class="FontSize mr-2"
              label="Contact Person *"
              v-model="create_ticket.customer_name"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="3" xs="12">
            <v-text-field
              dense
              outlined
              label="Email ID "
              class="FontSize"
              v-model="create_ticket.customer_email_id"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="1" xs="12">
            <v-text-field
              dense
              outlined
              item-text="name"
              class="FontSize mr-1"
              label="Country Code *"
              item-value="dial_code"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.customer_country_code"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="2" xs="12">
            <v-text-field
              dense
              outlined
              class="FontSize mr-2"
              label="Contact Number *"
              v-model="create_ticket.customer_phone_number"
              :rules="[
                (v) =>
                  /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) ||
                  'Invalid',
                (v) => (v && v.length < 11) || 'Invalid',
                (v) => (v && v.length > 9) || 'Invalid',
              ]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="1" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              item-text="dial_code"
              class="FontSize mr-1"
              item-value="dial_code"
              label="Seconary Contact Country Code"
              v-model="create_ticket.secondary_customer_contact_country_code"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="2" xs="12">
            <v-text-field
              dense
              outlined
              class="FontSize mr-2"
              label="Secondary Contact Number"
              v-model="create_ticket.secondary_customer_contact"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="3" xs="12">
            <v-text-field
              dense
              outlined
              label="Customer ID"
              class="FontSize mr-2"
              v-model="create_ticket.customer_unique_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              item-value="setting_id"
              item-text="setting_name"
              label="Customer Category"
              :items="GetAllCustomerCategoryList"
              v-model="create_ticket.customer_category_id"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              label="Address *"
              class="FontSize mr-2"
              v-model="create_ticket.ticket_address"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              label="City"
              class="FontSize mr-2"
              v-model="create_ticket.ticket_city"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="2" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              label="State"
              class="FontSize mr-1"
              v-model="create_ticket.ticket_state"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="2" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              type="number"
              label="Pincode"
              class="FontSize mr-1"
              v-model="create_ticket.ticket_pincode"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="1" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              readonly
              label="Latitude *"
              class="FontSize mr-1"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.ticket_latitude"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="1" sm="12" xs="12">
            <v-text-field
              dense
              readonly
              outlined
              class="FontSize"
              label="Longitude *"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.ticket_longitude"
            ></v-text-field>
          </v-col>
        </v-row>
        <b>Service Information :</b>
        <v-row class="mt-2" no-gutters>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              readonly
              label="Category *"
              class="FontSize mr-2"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.category_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="3">
            <v-text-field
              dense
              outlined
              readonly
              label="Product *"
              class="FontSize mr-2"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.service_id"
            >
            </v-text-field>
          </v-col>
          <!-- <v-col cols="12" xs="12" sm="12" md="6" v-show="false">
              <v-autocomplete
                dense
                outlined
                v-model="create_ticket.service_id_new"
              >
              </v-autocomplete>
            </v-col> -->
          <v-col cols="12" xs="12" sm="12" md="3">
            <v-text-field
              dense
              readonly
              outlined
              label="Serail Number"
              class="FontSize mr-2"
              v-model="create_ticket.service_serial_number"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-autocomplete
              dense
              outlined
              label="Support"
              item-text="text"
              item-value="value"
              class="FontSize mr-2"
              :items="SupportItems"
              :return-object="false"
              v-model="create_ticket.support_type"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" xs="12" md="3">
            <v-autocomplete
              dense
              outlined
              label="Support Type"
              class="FontSize mr-2"
              :return-object="false"
              item-text="setting_name"
              item-value="setting_name"
              :items="GetAllAMCTypeList"
              v-model="create_ticket.warranty_type"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-dialog
              persistent
              width="290px"
              color="primary"
              ref="support_Start_Date"
              v-model="supportStartDate"
              :return-value.sync="create_ticket.warranty_start_date"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  outlined
                  readonly
                  v-on="on"
                  v-bind="attrs"
                  persistent-hint
                  color="primary"
                  class="FontSize mr-2"
                  label="Support Start Date"
                  v-model="create_ticket.warranty_start_date"
                ></v-text-field>
              </template>
              <v-date-picker
                color="primary"
                scrollable
                v-model="create_ticket.warranty_start_date"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="supportStartDate = false"
                  >Cancel</v-btn
                >
                <v-btn
                  text
                  color="primary"
                  @click="
                    $refs.support_Start_Date.save(
                      create_ticket.warranty_start_date
                    )
                  "
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-dialog
              persistent
              width="290px"
              color="primary"
              ref="support_End_Date"
              v-model="supportEndDate"
              :return-value.sync="create_ticket.warranty_end_date"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  outlined
                  readonly
                  v-on="on"
                  v-bind="attrs"
                  persistent-hint
                  color="primary"
                  class="FontSize mr-2"
                  label="Support End Date"
                  v-model="create_ticket.warranty_end_date"
                ></v-text-field>
              </template>
              <v-date-picker
                scrollable
                color="primary"
                v-model="create_ticket.warranty_end_date"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="supportEndDate = false"
                  >Cancel</v-btn
                >
                <v-btn
                  text
                  color="primary"
                  @click="
                    $refs.support_End_Date.save(create_ticket.warranty_end_date)
                  "
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-text-field
              dense
              outlined
              class="FontSize mr-2"
              label="Invoice Number"
              v-model="create_ticket.ticket_invoice_number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-dialog
              ref="menu3"
              persistent
              width="290px"
              color="primary"
              v-model="modalticket_invoice_date"
              :return-value.sync="create_ticket.ticket_invoice_date"
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
                  class="FontSize mr-2"
                  v-model="create_ticket.ticket_invoice_date"
                ></v-text-field>
              </template>
              <v-date-picker
                scrollable
                color="primary"
                v-model="create_ticket.ticket_invoice_date"
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
                  @click="$refs.menu3.save(create_ticket.ticket_invoice_date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-dialog
              persistent
              width="290px"
              color="primary"
              ref="instal_date"
              v-model="installation_date"
              :return-value.sync="create_ticket.product_purchased_on"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  outlined
                  v-on="on"
                  v-bind="attrs"
                  persistent-hint
                  color="primary"
                  class="FontSize mr-2"
                  label="Installation Date"
                  v-model="create_ticket.product_purchased_on"
                ></v-text-field>
              </template>
              <v-date-picker
                scrollable
                color="primary"
                v-model="create_ticket.product_purchased_on"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="installation_date = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="
                    $refs.instal_date.save(create_ticket.product_purchased_on)
                  "
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <b>Ticket Information :</b>
        <v-row no-gutters class="mt-2">
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-autocomplete
              dense
              outlined
              item-text="text"
              item-value="value"
              label="Ticket Type"
              class="FontSize mr-2"
              :items="ticket_creation_type_items"
              v-model="create_ticket.ticket_creation_type"
            ></v-autocomplete>
          </v-col>
          <!-- <v-col
              cols="12"
              md="3"
              sm="12"
              xs="12"
            >
              <v-combobox
                dense
                outlined
                class="FontSize mr-2"
                label="Service Type *"
                item-value="service_type_id"
                item-text="service_type_name"
                :rules="[(v) => !!v || 'Required']"
                v-model="create_ticket.service_type_id"
                :items="GetAllServiceTypeByServiceIDList"
              >
              </v-combobox>
            </v-col> -->
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-autocomplete
              dense
              outlined
              class="FontSize mr-2"
              label="Service Type *"
              item-value="service_type_id"
              item-text="service_type_name"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.service_type_id"
              :items="GetAllServiceTypeByServiceIDList"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-combobox
              dense
              outlined
              :items="GetProblem"
              class="FontSize mr-2"
              label="Problem Description"
              v-model="create_ticket.service_ticket_description"
            >
            </v-combobox>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-checkbox
              class="mt-n1"
              label="Is free of cost ?"
              v-model="create_ticket.is_free_of_cost"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-text-field
              dense
              outlined
              class="FontSize mr-2"
              label="Additional Comments"
              v-model="create_ticket.additional_comments"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3" xs="12" sm="12">
            <v-dialog
              ref="menu"
              persistent
              width="290px"
              color="primary"
              v-model="modalprefered_visit_date"
              :return-value.sync="create_ticket.prefered_visit_date"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  outlined
                  v-on="on"
                  v-bind="attrs"
                  persistent-hint
                  color="primary"
                  class="FontSize mr-2"
                  label="Preferred Visit Date *"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="create_ticket.prefered_visit_date"
                ></v-text-field>
              </template>
              <v-date-picker
                scrollable
                color="primary"
                v-model="create_ticket.prefered_visit_date"
                :min="new Date().toISOString().substr(0, 10)"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="modalprefered_visit_date = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(create_ticket.prefered_visit_date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-dialog
              persistent
              ref="dialog"
              width="290px"
              v-model="modalprefered_visit_time"
              :return-value.sync="create_ticket.prefered_visit_time"
            >
              <template v-slot:activator="{ on, attrs2 }">
                <v-text-field
                  dense
                  readonly
                  outlined
                  v-on="on"
                  v-bind="attrs2"
                  class="FontSize mr-2"
                  label="Preferred Visit Time *"
                  :rules="[(v) => !!v || 'Required']"
                  append-icon="mdi-clock-time-four-outline"
                  v-model="create_ticket.prefered_visit_time"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="modalprefered_visit_time"
                v-model="create_ticket.prefered_visit_time"
                full-width
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="modalprefered_visit_time = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(create_ticket.prefered_visit_time)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="12" xs="12" md="3">
            <v-autocomplete
              dense
              outlined
              :items="timeitems"
              class="FontSize mr-2"
              label="Ticket Priority"
              v-model="create_ticket.ticket_priority"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="3" xs="12">
            <v-menu
              offset-y
              :nudge-right="40"
              min-width="290px"
              ref="customer_call_date"
              v-model="customer_call_date"
              transition="scale-transition"
              :close-on-content-click="false"
              :return-value.sync="create_ticket.customer_call_date"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  outlined
                  v-on="on"
                  persistent-hint
                  color="primary"
                  class="FontSize mr-2"
                  label="Call Received Date"
                  prepend-inner-icon="event"
                  v-model="create_ticket.customer_call_date"
                ></v-text-field>
              </template>
              <v-date-picker
                no-title
                scrollable
                v-model="create_ticket.customer_call_date"
              >
                <v-btn text color="primary" @click="customer_call_date = false"
                  >Cancel</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="
                    $refs.customer_call_date.save(
                      create_ticket.customer_call_date
                    )
                  "
                  >OK</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-dialog
              width="290px"
              ref="customer_call_time"
              v-model="customer_call_time"
              :return-value.sync="create_ticket.customer_call_time"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  v-on="on"
                  outlined
                  v-bind="attrs"
                  class="FontSize mr-2"
                  label="Call Received Time"
                  prepend-inner-icon="access_time"
                  v-model="create_ticket.customer_call_time"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="customer_call_time"
                v-model="create_ticket.customer_call_time"
              >
                <v-btn text color="primary" @click="customer_call_time = false"
                  >Cancel</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="
                    $refs.customer_call_time.save(
                      create_ticket.customer_call_time
                    )
                  "
                  >OK</v-btn
                >
              </v-time-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-autocomplete
              dense
              outlined
              label="Ticket Source"
              class="FontSize mr-2"
              :items="call_source_items"
              v-model="create_ticket.ticket_call_source"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-text-field
              dense
              outlined
              class="FontSize mr-2"
              label="Source Remarks"
              v-model="create_ticket.source_remark"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="12" xs="12">
            <v-file-input
              dense
              multiple
              outlined
              v-model="files"
              label="File input"
              :prepend-icon="null"
              class="mr-2 FontSize"
              append-icon="mdi-paperclip"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-form>
      <v-card-text class="py-0">
        <div v-if="selected_files.length != 0" class="font-weight-bold">
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
              @click="selected_files.splice(selected_files.indexOf(item), 1)"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-spacer></v-spacer>
      <v-btn
        small
        color="primary"
        :loading="loadingBtn"
        @click="validateMethod"
        class="mr-2 white--text"
        >Confirm</v-btn
      >
    </v-card-actions>
    <v-card-actions />
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { CreateDealerOrPartnerRFS } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetAllCustomerDetails } from "@/mixins/Product/GetCustomerDetails.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";
import { GetAllProblemDescription } from "@/mixins/MastersSetting/GetAllProblemDescription.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllServiceTypeBasedOnServiceID } from "@/mixins/Tickets/GetAllListServiceTypeById.js";
import { ListAllUserTypeLocationBasedUsers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsers.js";
import { ListAllUserTypeLocationBasedUsersForPartnersAndDealers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsersForPartnersAndDealers.js";
var aws = require("aws-sdk");
export default {
  components: {
    Overlay,
    Snackbar,
  },
  props: {
    StoreObj: Object,
    StoreObj1: Object,
  },
  mixins: [
    GenerateS3URL,
    GetAllTerritories,
    GetAllCustomerDetails,
    GetAllCustomerCategory,
    GetAllProblemDescription,
    GetAllOrganizationSetting,
    GetAllServiceTypeBasedOnServiceID,
    ListAllUserTypeLocationBasedUsers,
    ListAllUserTypeLocationBasedUsersForPartnersAndDealers,
  ],
  data: () => ({
    count: 0,
    Toggle: 0,
    overlay: false,
    renderComp: true,
    loadingBtn: false,
    supportEndDate: false,
    supportStartDate: false,
    installation_date: false,
    customer_call_date: false,
    customer_call_time: false,
    modalprefered_visit_date: false,
    modalprefered_visit_time: false,
    modalticket_invoice_date: false,
    support_start_date_dialog: false,
    create_ticket: {
      tagged_territories: [],
      is_free_of_cost: false,
      service_id: "",
      category_id: "",
      ticket_city: "",
      ticket_state: "",
      support_type: "",
      warranty_type: "",
      customer_name: "",
      customer_type: "",
      source_remark: "",
      ticket_address: "",
      ticket_pincode: "",
      // service_id_new: "",
      service_type_id: "",
      ticket_latitude: "",
      ticket_priority: "",
      ticket_longitude: "",
      customer_email_id: "",
      representative_id: "",
      warranty_end_date: "",
      customer_unique_id: "",
      customer_call_time: "",
      customer_call_date: "",
      ticket_call_source: "",
      prefered_visit_time: "",
      prefered_visit_date: "",
      additional_comments: "",
      warranty_start_date: "",
      customer_category_id: "",
      ticket_creation_type: "",
      product_purchased_on: "",
      ticket_invoice_number: "",
      customer_company_name: "",
      customer_phone_number: "",
      service_serial_number: "",
      seconary_representative: "",
      customer_country_code: "+91",
      secondary_customer_contact: "",
      service_ticket_description: "",
      secondary_customer_contact_country_code: "+91",
      required_user_type: "ENTERPRISE_REPRESENTATIVE",
    },
    SnackBarComponent: {},
    center: { lat: 0, lng: 0 },
    files: [],
    s3_files: [],
    GetProblem: [],
    selected_files: [],
    ticket_s3_files: [],
    GetAllAMCTypeList: [],
    GetCustomerDetails: [],
    GetAllTerritoriesList: [],
    GetAllCustomerCategoryList: [],
    secondaryRepresentativeItem: [],
    GetAllUsrTypeLocationBasedUsers: [],
    GetAllServiceTypeByServiceIDList: [],
    timeitems: ["High", "Medium", "Low"],
    customer_type_items: ["INDIVIDUAL", "BUSINESS"],
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
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    call_source_items: [
      { text: "Call", value: "call" },
      { text: "Email", value: "email" },
      { text: "WhatsApp", value: "whatsapp" },
      { text: "Auto Generated", value: "auto_generated" },
      { text: "Forms", value: "forms" },
    ],
    SupportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    UserList: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
  }),
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null)
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
    },
    "create_ticket.support_type"(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    "create_ticket.representative_id"(val) {
      // if (this.StoreObj.action == "CREATE_TICKET") {
      if (
        this.create_ticket.required_user_type == "ENTERPRISE_REPRESENTATIVE"
      ) {
        this.GetAllUerTypeLocationBasedUsers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.create_ticket.required_user_type,
          this.create_ticket.tagged_territories
        );
        this.secondaryRepresentativeItem = [];
        setTimeout(() => {
          this.GetAllUsrTypeLocationBasedUsers.map((item) => {
            if (item.user_id != val) {
              this.secondaryRepresentativeItem.push(item);
            }
          });
          if (this.StoreObj.action == "CREATE_TICKET") {
            this.create_ticket.seconary_representative =
              this.GetCustomerDetails[0].secondary_representative_id !=
              undefined
                ? this.GetCustomerDetails[0].secondary_representative_id
                : "";
          }
        }, 1000);
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.create_ticket.required_user_type,
          this.create_ticket.tagged_territories,
          this.create_ticket.ticket_pincode,
          undefined
        );
        this.secondaryRepresentativeItem = [];
        setTimeout(() => {
          this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers.map(
            (item) => {
              if (item.user_id != val) {
                this.secondaryRepresentativeItem.push(item);
              }
            }
          );
          if (this.StoreObj.action == "CREATE_TICKET") {
            this.create_ticket.seconary_representative =
              this.GetCustomerDetails[0].secondary_representative_id !=
              undefined
                ? this.GetCustomerDetails[0].secondary_representative_id
                : "";
          }
        }, 1000);
      }
    },
    "create_ticket.required_user_type"() {
      this.secondaryRepresentativeItem = [];
      this.GetAllUsrTypeLocationBasedUsers = [];
      this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers = [];
      if (
        this.create_ticket.required_user_type == "ENTERPRISE_REPRESENTATIVE"
      ) {
        this.GetAllUerTypeLocationBasedUsers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.create_ticket.required_user_type,
          this.create_ticket.tagged_territories
        );
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.create_ticket.required_user_type,
          this.create_ticket.tagged_territories,
          this.create_ticket.ticket_pincode,
          undefined
        );
      }
    },
  },
  created() {
    this.GetAllCustomerDetailsMethod(this.StoreObj.customer_id);
  },
  mounted() {
    console.log("STOREOBJ", this.StoreObj);
    this.GetAllCustomerCategoryMethod("ACTIVE");
    this.GetAllProblemDescriptionMethod("ACTIVE");
    this.GetAllServiceTypeByServiceIDMethod(
      this.StoreObj.product_id != undefined
        ? this.StoreObj.product_id
        : this.StoreObj.service_id
    );
    if (this.StoreObj.action == "CREATE_TICKET") {
      this.GetAllCustomerDetailsMethod(this.StoreObj.customer_id);
      setTimeout(() => {
        if (
          this.GetCustomerDetails.length != 0 &&
          this.GetCustomerDetails != []
        ) {
          this.create_ticket.customer_company_name =
            this.GetCustomerDetails[0].customer_company_name != undefined
              ? this.GetCustomerDetails[0].customer_company_name
              : "";
          this.create_ticket.customer_type =
            this.GetCustomerDetails[0].customer_type;
          this.create_ticket.customer_country_code =
            this.GetCustomerDetails[0].customer_primary_country_code;
          this.create_ticket.customer_phone_number =
            this.GetCustomerDetails[0].customer_primary_contact_number;
          this.create_ticket.secondary_customer_contact =
            this.GetCustomerDetails[0].customer_secondary_contact_number;
          this.create_ticket.secondary_customer_contact_country_code =
            this.GetCustomerDetails[0].customer_secondary_country_code !=
            undefined
              ? this.GetCustomerDetails[0].customer_secondary_country_code
              : "";
          this.create_ticket.ticket_address =
            this.GetCustomerDetails[0].customer_address;
          this.create_ticket.ticket_city = this.GetCustomerDetails[0].city;
          this.create_ticket.ticket_state = this.GetCustomerDetails[0].state;
          this.create_ticket.ticket_pincode =
            this.GetCustomerDetails[0].customer_pincode;
          this.create_ticket.ticket_latitude =
            this.GetCustomerDetails[0].customer_latitude;
          this.create_ticket.ticket_longitude =
            this.GetCustomerDetails[0].customer_longitude;
          this.create_ticket.customer_email_id =
            this.GetCustomerDetails[0].customer_email_id != undefined
              ? this.GetCustomerDetails[0].customer_email_id
              : "";
          this.create_ticket.customer_unique_id =
            this.GetCustomerDetails[0].customer_unique_id != undefined
              ? this.GetCustomerDetails[0].customer_unique_id
              : "";
          this.create_ticket.customer_category_id =
            this.GetCustomerDetails[0].customer_category_id != undefined
              ? this.GetCustomerDetails[0].customer_category_id
              : "";
          this.create_ticket.tagged_territories =
            this.GetCustomerDetails[0].territory_ids != undefined &&
            this.GetCustomerDetails[0].territory_ids.length != 0
              ? this.GetCustomerDetails[0].territory_ids
              : [];
          this.create_ticket.representative_id =
            this.GetCustomerDetails[0].primary_representative_details !=
            undefined
              ? this.GetCustomerDetails[0].primary_representative_id
              : undefined;
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Something went wrong, Please try again ..!",
            };
            this.renderComp = true;
          });
        }
      }, 1500);
    } else {
      this.create_ticket.customer_company_name =
        this.StoreObj.customer_company_name;
      this.create_ticket.customer_country_code =
        this.StoreObj.customer_country_code;
      this.create_ticket.customer_phone_number =
        this.StoreObj.customer_phone_number != undefined
          ? this.StoreObj.customer_phone_number
          : this.StoreObj.customer_contact_number;
      this.create_ticket.secondary_customer_contact =
        this.StoreObj.secondary_customer_contact;
      this.create_ticket.secondary_customer_contact =
        this.StoreObj.secondary_customer_contact;
      this.create_ticket.customer_type = this.StoreObj.customer_type;
      this.create_ticket.customer_email_id =
        this.StoreObj.customer_email_id != undefined
          ? this.StoreObj.customer_email_id
          : this.StoreObj.initiater_email_id;
      this.create_ticket.customer_unique_id = this.StoreObj.customer_unique_id;
      this.create_ticket.customer_category_id =
        this.StoreObj.customer_category_id;
      this.create_ticket.ticket_address = this.StoreObj.ticket_address;
      this.create_ticket.ticket_city = this.StoreObj.ticket_city;
      this.create_ticket.ticket_state = this.StoreObj.ticket_state;
      this.create_ticket.ticket_pincode = this.StoreObj.ticket_pincode;
      this.create_ticket.ticket_latitude = this.StoreObj.ticket_latitude;
      this.create_ticket.ticket_longitude = this.StoreObj.ticket_longitude;
      setTimeout(() => {
        this.GetAllUerTypeLocationBasedUsers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          "ENTERPRISE_REPRESENTATIVE",
          this.create_ticket.tagged_territories
        );
      }, 1500);
    }
    setTimeout(() => {
      this.GetAllTerritoriesMethod(
        "ACTIVE",
        "NON_GEO_BASED",
        this.create_ticket.ticket_pincode != undefined &&
          this.create_ticket.ticket_pincode != null &&
          this.create_ticket.ticket_pincode != ""
          ? this.create_ticket.ticket_pincode
          : undefined,
        "TERRITORY_BY_PINCODE",
        undefined
      );
    }, 2000);
    this.create_ticket.customer_name = this.StoreObj.customer_name;
    this.create_ticket.category_id = this.StoreObj.category_name;
    this.create_ticket.service_id =
      this.StoreObj.service_name != undefined
        ? this.StoreObj.service_name
        : this.StoreObj.product_name;
    this.create_ticket.service_serial_number =
      this.StoreObj.service_serial_number != undefined
        ? this.StoreObj.service_serial_number
        : this.StoreObj.setting_name;
    if (
      this.StoreObj.extended_warranty_details != undefined &&
      this.StoreObj.extended_warranty_details.length != 0
    ) {
      let currentDate = new Date();
      let currentEpochTimeInSeconds = Math.floor(currentDate.getTime() / 1000);
      if (
        (this.StoreObj.warranty_end_date != undefined &&
          this.StoreObj.warranty_end_date != "-" &&
          this.StoreObj.warranty_end_date != "") ||
        (this.StoreObj.amc_end_date != undefined &&
          this.StoreObj.amc_end_date != "-" &&
          this.StoreObj.amc_end_date != "")
      ) {
        let supportEndDate =
          this.StoreObj.warranty_end_date != undefined &&
          this.StoreObj.warranty_end_date != "-" &&
          this.StoreObj.warranty_end_date != ""
            ? new Date(this.StoreObj.warranty_end_date).getTime()
            : new Date(this.StoreObj.amc_end_date).getTime();
        let supportEndDateInsecs = supportEndDate / 1000;
        if (supportEndDateInsecs < currentEpochTimeInSeconds) {
          for (
            let k = 0;
            k < this.StoreObj.extended_warranty_details.length;
            k++
          ) {
            let extended_warranty_end_date =
              this.StoreObj.extended_warranty_details[k]
                .extendedWarrantyEndEate;
            let extendedSupportEndDate = new Date(
              extended_warranty_end_date
            ).getTime();
            let extendedSupportEndDateinSecs = extendedSupportEndDate / 1000;
            let extended_warranty_start_date =
              this.StoreObj.extended_warranty_details[k]
                .extendedWarrantyStartDate;
            let extendedSupportStartDate = new Date(
              extended_warranty_start_date
            ).getTime();
            let extendedSupportStartDateInSecs =
              extendedSupportStartDate / 1000;
            if (
              currentEpochTimeInSeconds < extendedSupportEndDateinSecs &&
              currentEpochTimeInSeconds > extendedSupportStartDateInSecs
            ) {
              this.create_ticket.warranty_start_date =
                this.StoreObj.extended_warranty_details[
                  k
                ].extendedWarrantyStartDate;
              this.create_ticket.warranty_end_date =
                this.StoreObj.extended_warranty_details[
                  k
                ].extendedWarrantyEndEate;
              this.create_ticket.support_type =
                this.StoreObj.extended_warranty_details[
                  k
                ].extended_ticket_warranty_type.includes(" ")
                  ? this.StoreObj.extended_warranty_details[
                      k
                    ].extended_ticket_warranty_type.replace(" ", "_")
                  : this.StoreObj.extended_warranty_details[k]
                      .extended_ticket_warranty_type;
              setTimeout(() => {
                this.create_ticket.warranty_type =
                  this.StoreObj.extended_warranty_details[
                    k
                  ].extended_warranty_type;
              }, 1000);
            }
          }
        } else {
          this.create_ticket.support_type =
            this.StoreObj.ticket_warranty_type != undefined
              ? this.StoreObj.ticket_warranty_type
              : this.StoreObj.support_type;
          setTimeout(() => {
            this.create_ticket.warranty_type = this.StoreObj.warranty_type;
          }, 1000);
          this.create_ticket.warranty_start_date =
            this.StoreObj.warranty_start_date != undefined &&
            this.StoreObj.warranty_start_date != "-"
              ? this.StoreObj.warranty_start_date
              : this.StoreObj.amc_start_date != undefined
              ? this.StoreObj.amc_start_date
              : "";
          this.create_ticket.warranty_end_date =
            this.StoreObj.warranty_end_date != undefined &&
            this.StoreObj.warranty_end_date != "-"
              ? this.StoreObj.warranty_end_date
              : this.StoreObj.amc_end_date != undefined
              ? this.StoreObj.amc_end_date
              : "";
        }
      } else {
        this.create_ticket.support_type =
          this.StoreObj.ticket_warranty_type != undefined
            ? this.StoreObj.ticket_warranty_type
            : this.StoreObj.support_type;
        setTimeout(() => {
          this.create_ticket.warranty_type = this.StoreObj.warranty_type;
        }, 1000);
        this.create_ticket.warranty_start_date =
          this.StoreObj.warranty_start_date != undefined &&
          this.StoreObj.warranty_start_date != "-"
            ? this.StoreObj.warranty_start_date
            : this.StoreObj.amc_start_date != undefined
            ? this.StoreObj.amc_start_date
            : "";
        this.create_ticket.warranty_end_date =
          this.StoreObj.warranty_end_date != undefined &&
          this.StoreObj.warranty_end_date != "-"
            ? this.StoreObj.warranty_end_date
            : this.StoreObj.amc_end_date != undefined
            ? this.StoreObj.amc_end_date
            : "";
      }
    } else {
      this.create_ticket.support_type =
        this.StoreObj.ticket_warranty_type != undefined
          ? this.StoreObj.ticket_warranty_type
          : this.StoreObj.support_type;
      setTimeout(() => {
        this.create_ticket.warranty_type = this.StoreObj.warranty_type;
      }, 1000);
      this.create_ticket.warranty_start_date =
        this.StoreObj.warranty_start_date != undefined &&
        this.StoreObj.warranty_start_date != "-"
          ? this.StoreObj.warranty_start_date
          : this.StoreObj.amc_start_date != undefined
          ? this.StoreObj.amc_start_date
          : "";
      this.create_ticket.warranty_end_date =
        this.StoreObj.warranty_end_date != undefined &&
        this.StoreObj.warranty_end_date != "-"
          ? this.StoreObj.warranty_end_date
          : this.StoreObj.amc_end_date != undefined
          ? this.StoreObj.amc_end_date
          : "";
    }
    if (this.StoreObj.action == "CREATE_TICKET") {
      this.create_ticket.ticket_invoice_number =
        this.StoreObj.invoice_number != undefined
          ? this.StoreObj.invoice_number
          : undefined;
    } else {
      this.create_ticket.ticket_invoice_number =
        this.StoreObj.ticket_warranty_details != undefined
          ? this.StoreObj.ticket_warranty_details.ticket_invoice_number
          : undefined;
    }
    if (this.StoreObj.action == "CREATE_TICKET") {
      this.create_ticket.ticket_invoice_date =
        this.StoreObj.invoice_date != undefined &&
        this.StoreObj.invoice_date != "-"
          ? this.StoreObj.invoice_date
          : "";
    } else {
      this.create_ticket.ticket_invoice_date =
        this.StoreObj.ticket_warranty_details != undefined
          ? this.StoreObj.ticket_warranty_details.ticket_invoice_date
          : undefined;
    }
    if (this.StoreObj.action == "CREATE_TICKET") {
      this.create_ticket.product_purchased_on =
        this.StoreObj.product_purchased_on != undefined &&
        this.StoreObj.product_purchased_on != "-"
          ? this.StoreObj.product_purchased_on
          : "";
    } else {
      this.create_ticket.product_purchased_on = this.StoreObj.installation_date;
    }
    this.create_ticket.ticket_creation_type =
      this.StoreObj.ticket_creation_type;
    this.create_ticket.service_type_id = this.StoreObj.service_type_id;
    this.create_ticket.service_ticket_description =
      this.StoreObj.service_ticket_description;
    this.create_ticket.is_free_of_cost = this.StoreObj.is_free_of_cost;
    this.create_ticket.additional_comments = this.StoreObj.additional_comments;
    this.create_ticket.prefered_visit_date = this.StoreObj.prefered_visit_date;
    this.create_ticket.prefered_visit_time = this.StoreObj.prefered_visit_time;
    this.create_ticket.ticket_priority = this.StoreObj.ticket_priority;
    this.$refs.form.resetValidation();
  },
  methods: {
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length != 0) {
          this.count = 0;
          this.uploadMediaToS3();
        } else {
          this.CreateAssignedTicket();
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
    async uploadMediaToS3() {
      this.loadingBtn = true;
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
          this.CreateAssignedTicket();
        }
      }
    },
    async CreateAssignedTicket() {
      try {
        this.loadingBtn = true;
        const result = await API.graphql(
          graphqlOperation(CreateDealerOrPartnerRFS, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: this.GetCustomerDetails[0].customer_id,
              dealear_or_partner_id: this.StoreObj.dealer_partner_rep_id,
              setting_id: this.StoreObj.setting_id,
              service_type_id: this.create_ticket.service_type_id,
              service_ticket_description:
                this.create_ticket.service_ticket_description || undefined,
              ticket_warranty_type:
                this.create_ticket.support_type || undefined,
              support_type: this.create_ticket.warranty_type || undefined,
              ticket_warranty_details: {
                ticket_invoice_number: this.create_ticket.ticket_invoice_number,
                ticket_invoice_date: this.create_ticket.ticket_invoice_date,
              },
              installation_date:
                this.create_ticket.product_purchased_on || undefined,
              ticket_s3_files:
                this.s3_files.length > 0 ? this.s3_files : undefined,
              ticket_creation_type:
                this.create_ticket.ticket_creation_type || undefined,
              additional_comments:
                this.create_ticket.additional_comments || undefined,
              warranty_start_date:
                this.create_ticket.warranty_start_date || undefined,
              warranty_end_date:
                this.create_ticket.warranty_end_date || undefined,
              prefered_visit_date: this.create_ticket.prefered_visit_date,
              prefered_visit_time: this.create_ticket.prefered_visit_time,
              ticket_priority: this.create_ticket.ticket_priority || undefined,
              customer_call_date:
                this.create_ticket.customer_call_date || undefined,
              customer_call_time:
                this.create_ticket.customer_call_time || undefined,
              ticket_call_source:
                this.create_ticket.ticket_call_source || undefined,
              call_source_remarks:
                this.create_ticket.source_remark || undefined,
            },
          })
        );
        const ResultObject = JSON.parse(result.data.CreateDealerOrPartnerRFS);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: ResultObject.status_message,
              Top: true,
            };
            this.renderComp = true;
          });
          this.CreateTicketCardEmit(
            (this.Toggle = 2),
            ResultObject.status_message
          );
        }
        this.loadingBtn = false;
      } catch (error) {
        this.loadingBtn = false;
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
    CreateTicketCardEmit(Toggle, status_message) {
      this.$emit("clicked", Toggle, status_message);
    },
  },
};
</script>
