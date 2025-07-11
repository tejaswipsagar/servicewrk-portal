<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="PrimaryFontColor heading1 font-weight-bold">
          Create Ticket
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
              label="Serial Number"
              class="FontSize mr-2"
              v-model="create_ticket.service_serial_number"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="3">
            <v-text-field
              dense
              readonly
              outlined
              label="Asset Number"
              class="FontSize mr-2"
              v-model="create_ticket.asset_number"
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
          <v-col cols="12" md="6" sm="12" xs="12">
            <v-autocomplete
              dense
              outlined
              multiple
              class="FontSize mr-2"
              item-value="territory_id"
              label="Select territories"
              item-text="territory_name"
              :items="GetAllTerritoriesList"
              v-model="create_ticket.tagged_territories"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pa-0 ma-0 pr-2">
            <v-autocomplete
              v-model="pincodeType"
              :items="
                overAllTerritoryDetails === false
                  ? filteredTerritories
                  : GetAllTerritoriesListArray
              "
              dense
              label="Territory Classification Name"
              :item-text="
                overAllTerritoryDetails === false
                  ? 'pincode_type_name'
                  : 'pincode_territory_type'
              "
              :item-value="
                overAllTerritoryDetails === false
                  ? 'pincode_type_id'
                  : 'pincode_id'
              "
              outlined
              class="FontSize ml-4"
              return-object
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pa-0 ma-0 pr-2">
            <v-select
              v-if="pincodeType !== ''"
              v-model="selection"
              :items="options"
              label="Select Option"
              dense
              outlined
              class="FontSize"
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            lg="4"
            md="4"
            sm="12"
            xs="12"
            v-if="selection === 'Hours'"
            class="pa-0 ma-0"
          >
            <v-select
              dense
              outlined
              label="Hours"
              v-model="estimatedTime"
              :items="TimeArray"
              class="FontSize"
            ></v-select>
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
            <v-autocomplete
              dense
              outlined
              :items="UserList"
              label="User Type *"
              class="FontSize mr-2"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.required_user_type"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-autocomplete
              dense
              outlined
              item-value="user_id"
              class="FontSize mr-2"
              item-text="user_name"
              label="Primary Representative *"
              :rules="[(v) => !!v || 'Required']"
              v-model="create_ticket.representative_id"
              :items="
                this.create_ticket.required_user_type ==
                'ENTERPRISE_REPRESENTATIVE'
                  ? GetAllUsrTypeLocationBasedUsers
                  : GetAllUsrTypeLocationBasedUsersForPartnersAndDealers
              "
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3" xs="12" sm="12">
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              item-value="user_id"
              item-text="user_name"
              label="Secondary Representative"
              :items="secondaryRepresentativeItem"
              v-model="create_ticket.seconary_representative"
            >
            </v-autocomplete>
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
import { CreateAssignedTicketV2 } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetAllCustomerDetails } from "@/mixins/Product/GetCustomerDetails.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";
import { GetAllProblemDescription } from "@/mixins/MastersSetting/GetAllProblemDescription.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllServiceTypeBasedOnServiceID } from "@/mixins/Tickets/GetAllListServiceTypeById.js";
import { ListAllUserTypeLocationBasedUsers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsers.js";
import { ListAllUserTypeLocationBasedUsersForPartnersAndDealers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsersForPartnersAndDealers.js";
import { ListPincodeTypesMixins } from "@/mixins/MastersSetting/ListPincodesTerritory.js";
import { getParticularProdFleetData } from "@/mixins/Product/GetProductFleetDetails.js";
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
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
    ListPincodeTypesMixins,
    getParticularProdFleetData,
    GetAllServiceTypes,
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
      asset_number: "",
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
    pincodeType: {},
    filteredTerritories: [],
    overAllTerritoryDetails: null,
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
    selection: "",
    estimatedTime: "",
    options: ["Hours", "Days"],
    formattedDay: "",
    currentProductDetails: [],
  }),
  computed: {
    TimeArray() {
      let Time_Value = [];
      for (let i = 1; i <= 24; i++) {
        if (i === 1) {
          Time_Value.push(`${i} hr`);
        } else {
          Time_Value.push(`${i} hrs`);
        }
      }
      return Time_Value;
    },
  },
  watch: {
    pincodeType(val) {
      this.callTerritoryNameMethod(val);
      if (!val?.estimated_time) {
        this.selection = "";
        this.estimatedTime = "";
        this.formattedDay = "";
        return;
      }
      const timeParts = val.estimated_time.split(" ");
      const unit = timeParts[1] ?? "";
      const value = timeParts[0] ?? "";
      if (["Hours", "Hour", "hrs", "hr"].includes(unit)) {
        this.selection = "Hours";
        this.estimatedTime = `${value} ${value === "1" ? "hr" : "hrs"}`;
      } else if (["Days", "Day"].includes(unit)) {
        this.selection = "Days";
        this.formattedDay = `${value} Days`;
      } else {
        this.selection = "";
        this.estimatedTime = "";
        this.formattedDay = "";
      }
    },
    files(val) {
      if (val.length != 0 && val != undefined && val != null)
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
    },

    async "create_ticket.tagged_territories"(val) {
      this.callTerritoryNameMethod(val);

      if (val.length === 0) {
        await this.callClassNameForNoTerrSelMethod();
      }
      if (this.filteredTerritories.length === 1) {
        this.pincodeType = this.filteredTerritories[0];
      }
    },

    "create_ticket.support_type"(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    "create_ticket.representative_id"(val) {
      if (
        this.create_ticket.required_user_type == "ENTERPRISE_REPRESENTATIVE"
      ) {
        this.GetAllUerTypeLocationBasedUsers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.currentProductDetails[0].product_id,
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
          this.currentProductDetails[0].product_id,
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
          this.currentProductDetails[0].product_id,
          this.$store.getters.get_current_user_details.user_id,
          this.create_ticket.required_user_type,
          this.create_ticket.tagged_territories
        );
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.currentProductDetails[0].product_id,
          this.$store.getters.get_current_user_details.user_id,
          this.create_ticket.required_user_type,
          this.create_ticket.tagged_territories,
          this.create_ticket.ticket_pincode,
          undefined
        );
      }
    },
  },
  // created() {
  //   this.GetAllCustomerDetailsMethod(this.StoreObj.customer_id);
  // },
  async mounted() {
    this.currentProductDetails = await this.getParticularProdFleetDataMethod(
      this.StoreObj.setting_id
    );
    this.GetAllCustomerCategoryMethod("ACTIVE");
    this.GetAllProblemDescriptionMethod("ACTIVE");
    await this.GetAllServiceTypeByServiceIDMethod(
      this.currentProductDetails[0].product_id
    );
    console.log("TYPEOF", typeof this.GetAllServiceTypeByServiceIDList);
    if (
      Array.isArray(this.GetAllServiceTypeByServiceIDList) &&
      this.GetAllServiceTypeByServiceIDList.length > 0
    ) {
      //
    } else {
      console.log("IF_SO_CHECK", this.GetAllServiceTypeByServiceIDList);
      await this.GetAllServiceTypeMethod("ACTIVE");
      this.GetAllServiceTypeByServiceIDList = this.GetAllServiceTypeList;
    }
    await this.GetAllCustomerDetailsMethod(
      this.currentProductDetails[0].customer_id
    );
    console.log("CUSTOMER_DETAILS", this.currentProductDetails[0]);
    await this.GetAllTerritoriesMethod(
      "ACTIVE",
      "NON_GEO_BASED",
      this.GetCustomerDetails[0].customer_pincode,
      "TERRITORY_BY_PINCODE",
      undefined
    );

    // if (this.GetAllTerritoriesList.length === 1) {
    //   this.create_ticket.tagged_territories.push(
    //     this.GetAllTerritoriesList[0].territory_id
    //   );
    //   console.log("TRUEE_YES", this.create_ticket.tagged_territories);
    // } else {
    //   await this.callClassNameForNoTerrSelMethod();
    // }
    // }
    setTimeout(() => {
      if (this.overAllTerritoryDetails === true) {
        this.ListPincodeTypes();
      } else {
        this.callTerritoryNameMethod(this.pincodeType);
      }
    }, 3000);
    console.log("PARICHAYAVADE111", this.GetCustomerDetails.territory_ids);
    if (this.GetCustomerDetails[0].territory_ids?.length) {
      console.log("PARICHAYAVADE", this.GetCustomerDetails.territory_ids);
      this.create_ticket.tagged_territories =
        this.GetCustomerDetails[0].territory_ids;
    } else {
      console.log("PARICHAYAVADE222");
      if (this.GetAllTerritoriesList.length === 1) {
        this.create_ticket.tagged_territories.push(
          this.GetAllTerritoriesList[0].territory_id
        );
        console.log("TRUEE_YES", this.create_ticket.tagged_territories);
      } else {
        await this.callClassNameForNoTerrSelMethod();
      }
    }

    if (this.StoreObj.action == "CREATE_TICKET") {
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
          // this.create_ticket.tagged_territories =
          //   this.GetCustomerDetails[0].territory_ids != undefined &&
          //   this.GetCustomerDetails[0].territory_ids.length != 0
          //     ? this.GetCustomerDetails[0].territory_ids
          //     : [];
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
    }
    this.create_ticket.customer_name = this.GetCustomerDetails[0].customer_name;
    this.create_ticket.category_id =
      this.currentProductDetails[0].category_name;
    this.create_ticket.service_id = this.currentProductDetails[0].product_name;
    this.create_ticket.service_serial_number =
      this.currentProductDetails[0].setting_name;
    this.create_ticket.asset_number =
      this.currentProductDetails[0].asset_number;
    // if (
    //   this.currentProductDetails[0].extended_warranty_details &&
    //   this.currentProductDetails[0].extended_warranty_details.length > 0
    // ) {
    //   let currentDate = new Date();
    //   let currentEpochTimeInSeconds = Math.floor(currentDate.getTime() / 1000);
    //   if (
    //     (this.currentProductDetails[0].warranty_end_date != undefined &&
    //       this.currentProductDetails[0].warranty_end_date != "-" &&
    //       this.currentProductDetails[0].warranty_end_date != "") ||
    //     (this.currentProductDetails[0].amc_end_date != undefined &&
    //       this.currentProductDetails[0].amc_end_date != "-" &&
    //       this.currentProductDetails[0].amc_end_date != "")
    //   ) {
    //     let supportEndDate =
    //       this.currentProductDetails[0].warranty_end_date != undefined &&
    //       this.currentProductDetails[0].warranty_end_date != "-" &&
    //       this.currentProductDetails[0].warranty_end_date != ""
    //         ? new Date(
    //             this.currentProductDetails[0].warranty_end_date
    //           ).getTime()
    //         : new Date(this.currentProductDetails[0].amc_end_date).getTime();
    //     let supportEndDateInsecs = supportEndDate / 1000;
    //     if (supportEndDateInsecs < currentEpochTimeInSeconds) {
    //       for (
    //         let k = 0;
    //         k < this.currentProductDetails[0].extended_warranty_details.length;
    //         k++
    //       ) {
    //         let extended_warranty_end_date =
    //           this.currentProductDetails[0].extended_warranty_details[k]
    //             .extendedWarrantyEndEate;
    //         let extendedSupportEndDate = new Date(
    //           extended_warranty_end_date
    //         ).getTime();
    //         let extendedSupportEndDateinSecs = extendedSupportEndDate / 1000;
    //         let extended_warranty_start_date =
    //           this.currentProductDetails[0].extended_warranty_details[k]
    //             .extendedWarrantyStartDate;
    //         let extendedSupportStartDate = new Date(
    //           extended_warranty_start_date
    //         ).getTime();
    //         let extendedSupportStartDateInSecs =
    //           extendedSupportStartDate / 1000;
    //         if (
    //           currentEpochTimeInSeconds < extendedSupportEndDateinSecs &&
    //           currentEpochTimeInSeconds > extendedSupportStartDateInSecs
    //         ) {
    //           this.create_ticket.warranty_start_date =
    //             this.currentProductDetails[0].extended_warranty_details[
    //               k
    //             ].extendedWarrantyStartDate;
    //           this.create_ticket.warranty_end_date =
    //             this.currentProductDetails[0].extended_warranty_details[
    //               k
    //             ].extendedWarrantyEndEate;

    //           setTimeout(() => {
    //             this.create_ticket.warranty_type =
    //               this.currentProductDetails[0].extended_warranty_details[
    //                 k
    //               ].extended_warranty_type;
    //           }, 1000);
    //         }
    //       }
    //     } else {
    //       this.create_ticket.support_type =
    //         this.currentProductDetails[0].support_type;
    //       setTimeout(() => {
    //         this.create_ticket.warranty_type =
    //           this.currentProductDetails[0].warranty_type;
    //       }, 1000);
    //       this.create_ticket.warranty_start_date =
    //         this.currentProductDetails[0].warranty_start_date != undefined &&
    //         this.currentProductDetails[0].warranty_start_date != "-"
    //           ? this.currentProductDetails[0].warranty_start_date
    //           : this.currentProductDetails[0].amc_start_date != undefined
    //           ? this.currentProductDetails[0].amc_start_date
    //           : "";
    //       this.create_ticket.warranty_end_date =
    //         this.currentProductDetails[0].warranty_end_date != undefined &&
    //         this.currentProductDetails[0].warranty_end_date != "-"
    //           ? this.currentProductDetails[0].warranty_end_date
    //           : this.currentProductDetails[0].amc_end_date != undefined
    //           ? this.currentProductDetails[0].amc_end_date
    //           : "";
    //     }
    //   }
    //   else {
    //     this.create_ticket.support_type =
    //       this.currentProductDetails[0].support_type;
    //     setTimeout(() => {
    //       this.create_ticket.warranty_type =
    //         this.currentProductDetails[0].warranty_type;
    //     }, 1000);
    //     this.create_ticket.warranty_start_date =
    //       this.currentProductDetails[0].warranty_start_date != undefined &&
    //       this.currentProductDetails[0].warranty_start_date != "-"
    //         ? this.currentProductDetails[0].warranty_start_date
    //         : this.currentProductDetails[0].amc_start_date != undefined
    //         ? this.currentProductDetails[0].amc_start_date
    //         : "";
    //     this.create_ticket.warranty_end_date =
    //       this.currentProductDetails[0].warranty_end_date != undefined &&
    //       this.currentProductDetails[0].warranty_end_date != "-"
    //         ? this.currentProductDetails[0].warranty_end_date
    //         : this.currentProductDetails[0].amc_end_date != undefined
    //         ? this.currentProductDetails[0].amc_end_date
    //         : "";
    //   }
    // }

    this.create_ticket.support_type =
      this.currentProductDetails[0].support_type;
    setTimeout(() => {
      this.create_ticket.warranty_type =
        this.currentProductDetails[0].warranty_type;
    }, 1000);
    this.create_ticket.warranty_start_date =
      this.currentProductDetails[0].warranty_start_date != undefined &&
      this.currentProductDetails[0].warranty_start_date != "-"
        ? this.currentProductDetails[0].warranty_start_date
        : this.currentProductDetails[0].amc_start_date != undefined
        ? this.currentProductDetails[0].amc_start_date
        : "";
    this.create_ticket.warranty_end_date =
      this.currentProductDetails[0].warranty_end_date != undefined &&
      this.currentProductDetails[0].warranty_end_date != "-"
        ? this.currentProductDetails[0].warranty_end_date
        : this.currentProductDetails[0].amc_end_date != undefined
        ? this.currentProductDetails[0].amc_end_date
        : "";
    if (this.StoreObj.action == "CREATE_TICKET") {
      this.create_ticket.ticket_invoice_number =
        this.currentProductDetails[0].invoice_number;
    } else {
      this.create_ticket.ticket_invoice_number =
        this.currentProductDetails[0].ticket_warranty_details != undefined
          ? this.currentProductDetails[0].ticket_warranty_details
              .ticket_invoice_number
          : undefined;
    }
    if (this.StoreObj.action == "CREATE_TICKET") {
      this.create_ticket.ticket_invoice_date =
        this.currentProductDetails[0].invoice_date != undefined &&
        this.currentProductDetails[0].invoice_date != "-"
          ? this.currentProductDetails[0].invoice_date
          : "";
    } else {
      this.create_ticket.ticket_invoice_date =
        this.currentProductDetails[0].ticket_warranty_details != undefined
          ? this.currentProductDetails[0].ticket_warranty_details
              .ticket_invoice_date
          : undefined;
    }
    if (this.StoreObj.action == "CREATE_TICKET") {
      this.create_ticket.product_purchased_on =
        this.currentProductDetails[0].product_purchased_on || undefined;
    } else {
      this.create_ticket.product_purchased_on =
        this.currentProductDetails[0].installation_date;
    }
    this.create_ticket.ticket_creation_type =
      this.currentProductDetails[0].ticket_creation_type;
    this.create_ticket.service_type_id =
      this.currentProductDetails[0].service_type_id;
    this.create_ticket.service_ticket_description =
      this.currentProductDetails[0].service_ticket_description;
    this.create_ticket.is_free_of_cost =
      this.currentProductDetails[0].is_free_of_cost;
    this.create_ticket.additional_comments =
      this.currentProductDetails[0].additional_comments;
    this.create_ticket.prefered_visit_date =
      this.currentProductDetails[0].prefered_visit_date;
    this.create_ticket.prefered_visit_time =
      this.currentProductDetails[0].prefered_visit_time;
    this.create_ticket.ticket_priority =
      this.currentProductDetails[0].ticket_priority;
    this.$refs.form.resetValidation();
  },
  methods: {
    async callTerritoryNameMethod(val) {
      if (Array.isArray(val) && val.length) {
        this.filteredTerritories = [];
        const matchedItems = this.GetAllTerritoriesList.filter((item) =>
          val.includes(item.territory_id)
        )
          .map((foundItem) => {
            if (
              foundItem.estimated_time !== undefined &&
              foundItem.pincode_type_id !== undefined &&
              foundItem.pincode_type_name !== undefined
            ) {
              return {
                estimated_time: foundItem.estimated_time,
                pincode_type_id: foundItem.pincode_type_id,
                pincode_type_name: foundItem.pincode_type_name,
              };
            }
            return null;
          })
          .filter(Boolean);
        this.filteredTerritories = matchedItems;

        if (
          this.filteredTerritories.length === 0 &&
          val.length === this.GetAllTerritoriesList.length
        ) {
          await this.ListPincodeTypes();
          this.filteredTerritories = this.GetAllTerritoriesListArray.map(
            (item) => ({
              estimated_time: item.estimated_time,
              pincode_type_id: item.pincode_id,
              pincode_type_name: item.pincode_territory_type,
            })
          );
        }
      }
      // else {
      //   this.filteredTerritories = [];
      // }
    },
    async callClassNameForNoTerrSelMethod() {
      await this.ListPincodeTypes();
      this.filteredTerritories = this.GetAllTerritoriesListArray.map(
        (item) => ({
          estimated_time: item.estimated_time,
          pincode_type_id: item.pincode_id,
          pincode_type_name: item.pincode_territory_type,
        })
      );
    },
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
    async CreateAssignedTicket(s3URL) {
      this.loadingBtn = true;
      try {
        let Local_Array = [];
        let Object = {
          category_id: this.currentProductDetails[0].category_id,
          service_id:
            this.StoreObj.action == "CREATE_TICKET"
              ? this.currentProductDetails[0].product_id
              : undefined,
          service_serial_number: this.create_ticket.service_serial_number,
          asset_number: this.create_ticket.asset_number || undefined,
          service_type_id: this.create_ticket.service_type_id,
          ticket_warranty_type:
            this.create_ticket.support_type != "" &&
            this.create_ticket.support_type != undefined &&
            this.create_ticket.support_type != null
              ? this.create_ticket.support_type
              : undefined,
          additional_comments:
            this.create_ticket.additional_comments != undefined &&
            this.create_ticket.additional_comments != null &&
            this.create_ticket.additional_comments != ""
              ? this.create_ticket.additional_comments
              : undefined,
          installation_date:
            this.create_ticket.product_purchased_on != undefined &&
            this.create_ticket.product_purchased_on != null &&
            this.create_ticket.product_purchased_on != ""
              ? this.create_ticket.product_purchased_on
              : undefined,
          is_free_of_cost:
            this.create_ticket.is_free_of_cost != undefined
              ? this.create_ticket.is_free_of_cost
              : false,
          support_type:
            this.create_ticket.warranty_type != "" &&
            this.create_ticket.warranty_type != undefined &&
            this.create_ticket.warranty_type != null
              ? this.create_ticket.warranty_type
              : undefined,
          service_ticket_description:
            this.create_ticket.service_ticket_description != undefined &&
            this.create_ticket.service_ticket_description != null &&
            this.create_ticket.service_ticket_description != ""
              ? this.create_ticket.service_ticket_description
              : undefined,
          ticket_creation_type:
            this.create_ticket.ticket_creation_type != undefined &&
            this.create_ticket.ticket_creation_type != null &&
            this.create_ticket.ticket_creation_type != ""
              ? this.create_ticket.ticket_creation_type
              : undefined,
          ticket_s3_files:
            this.s3_files != undefined && this.s3_files.length != 0
              ? this.s3_files
              : undefined,
          ticket_warranty_details: {
            ticket_invoice_number: this.create_ticket.ticket_invoice_number,
            ticket_invoice_date: this.create_ticket.ticket_invoice_date,
          },
          estimated_time: this.estimatedTime || undefined,
          pincode_type_id:
            this.pincodeType.pincode_id ||
            this.pincodeType.pincode_type_id ||
            undefined,
          pincode_type_name:
            this.pincodeType.pincode_territory_type ||
            this.pincodeType.pincode_type_name ||
            undefined,
          product_attachments:
            this.currentProductDetails[0].product_attachments?.length > 0
              ? this.currentProductDetails[0].product_attachments
              : undefined,
        };
        Local_Array.push(Object);
        this.loadingBtn = true;
        var inputparams = {
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          tagged_territories: this.create_ticket.tagged_territories,
          ticket_address: this.create_ticket.ticket_address,
          ticket_latitude: this.create_ticket.ticket_latitude,
          ticket_longitude: this.create_ticket.ticket_longitude,
          prefered_visit_date: this.create_ticket.prefered_visit_date,
          customer_type: this.create_ticket.customer_type,
          assignee_user_id: this.create_ticket.representative_id,
          ticket_dependency_details: Local_Array,
          customer_country_code: this.create_ticket.customer_country_code,
          customer_phone_number: this.create_ticket.customer_phone_number,
          add_customer_to_db: false,
        };

        inputparams.is_rft_ticket = false;

        if (
          this.create_ticket.customer_call_date != undefined &&
          this.create_ticket.customer_call_date != null &&
          this.create_ticket.customer_call_date != ""
        ) {
          inputparams.customer_call_date =
            this.create_ticket.customer_call_date;
        }
        if (
          this.create_ticket.ticket_priority != undefined &&
          this.create_ticket.ticket_priority != null &&
          this.create_ticket.ticket_priority != ""
        ) {
          inputparams.ticket_priority = this.create_ticket.ticket_priority;
        }
        if (
          this.create_ticket.customer_call_time != undefined &&
          this.create_ticket.customer_call_time != null &&
          this.create_ticket.customer_call_time != ""
        ) {
          inputparams.customer_call_time =
            this.create_ticket.customer_call_time;
        }
        if (
          this.create_ticket.seconary_representative != undefined &&
          this.create_ticket.seconary_representative != null &&
          this.create_ticket.seconary_representative != ""
        ) {
          inputparams.secondary_technician_id =
            this.create_ticket.seconary_representative;
        }
        if (
          this.create_ticket.prefered_visit_time != undefined &&
          this.create_ticket.prefered_visit_time != null &&
          this.create_ticket.prefered_visit_time != ""
        ) {
          inputparams.prefered_visit_time =
            this.create_ticket.prefered_visit_time;
        }
        if (
          this.create_ticket.source_remark != undefined &&
          this.create_ticket.source_remark != null &&
          this.create_ticket.source_remark != ""
        ) {
          inputparams.source_remark = this.create_ticket.source_remark;
        }
        if (
          this.create_ticket.ticket_call_source != undefined &&
          this.create_ticket.ticket_call_source != null &&
          this.create_ticket.ticket_call_source != ""
        ) {
          inputparams.ticket_call_source =
            this.create_ticket.ticket_call_source;
        }
        if (
          this.create_ticket.ticket_pincode != undefined &&
          this.create_ticket.ticket_pincode != null &&
          this.create_ticket.ticket_pincode != ""
        ) {
          inputparams.ticket_pincode = this.create_ticket.ticket_pincode;
        }
        if (
          this.create_ticket.ticket_state != undefined &&
          this.create_ticket.ticket_state != null &&
          this.create_ticket.ticket_state != ""
        ) {
          inputparams.ticket_state = this.create_ticket.ticket_state;
        }
        if (
          this.create_ticket.ticket_city != undefined &&
          this.create_ticket.ticket_city != null &&
          this.create_ticket.ticket_city != ""
        ) {
          inputparams.ticket_city = this.create_ticket.ticket_city;
        }
        if (
          this.create_ticket.secondary_customer_contact != undefined &&
          this.create_ticket.secondary_customer_contact != null &&
          this.create_ticket.secondary_customer_contact != ""
        ) {
          inputparams.secondary_customer_contact =
            this.create_ticket.secondary_customer_contact;
        }
        if (
          this.create_ticket.customer_email_id != undefined &&
          this.create_ticket.customer_email_id != null &&
          this.create_ticket.customer_email_id != ""
        ) {
          inputparams.customer_email_id = this.create_ticket.customer_email_id;
        }
        if (
          this.create_ticket.customer_unique_id != undefined &&
          this.create_ticket.customer_unique_id != null &&
          this.create_ticket.customer_unique_id != ""
        ) {
          inputparams.customer_unique_id =
            this.create_ticket.customer_unique_id;
        }
        if (
          this.create_ticket.customer_category_id != undefined &&
          this.create_ticket.customer_category_id != null &&
          this.create_ticket.customer_category_id != ""
        ) {
          inputparams.customer_category_id =
            this.create_ticket.customer_category_id;
        }
        if (
          this.create_ticket.customer_name != undefined &&
          this.create_ticket.customer_name != null &&
          this.create_ticket.customer_name != ""
        ) {
          inputparams.customer_name = this.create_ticket.customer_name;
        }
        if (
          this.create_ticket.customer_company_name != undefined &&
          this.create_ticket.customer_company_name != null &&
          this.create_ticket.customer_company_name != ""
        ) {
          inputparams.customer_company_name =
            this.create_ticket.customer_company_name;
        }
        let result = await API.graphql(
          graphqlOperation(CreateAssignedTicketV2, {
            input: inputparams,
          })
        );
        var ResultObject = JSON.parse(result.data.CreateAssignedTicketV2);
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
