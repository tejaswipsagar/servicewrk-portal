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
        <v-btn dense small color="primary" @click="backToMainPageFrom">
          <v-icon small>mdi-arrow-left</v-icon>Back
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          lg="5"
          md="5"
          sm="12"
          xs="12"
          v-show="SerialNumberDataArray.length === 0"
        >
          <GoogleMaps @clicked="GoogleMapsEmit" />
        </v-col>
        <v-col
          cols="12"
          :lg="SerialNumberDataArray.length === 0 ? 7 : 12"
          :md="SerialNumberDataArray.length === 0 ? 7 : 12"
          sm="12"
          xs="12"
        >
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
                  label="Customer"
                  class="FontSize mr-2"
                  v-model="create_ticket.customer_company_name"
                  :readonly="SerialNumberDataArray.length > 0"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  class="FontSize mr-2"
                  label="Contact Person *"
                  v-model="create_ticket.customer_name"
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="SerialNumberDataArray.length > 0"
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
                  v-model="
                    create_ticket.secondary_customer_contact_country_code
                  "
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
                  label="Latitude *"
                  class="FontSize mr-1"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="create_ticket.ticket_latitude"
                  :readonly="SerialNumberDataArray.length > 0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="1" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Longitude *"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="create_ticket.ticket_longitude"
                  :readonly="SerialNumberDataArray.length > 0"
                ></v-text-field>
              </v-col>
            </v-row>
            <b>Service Information :</b>
            <v-row class="mt-2" no-gutters>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  v-if="
                    create_ticket.category_id &&
                    SerialNumberDataArray.length > 0
                  "
                  dense
                  outlined
                  label="Category *"
                  class="FontSize mr-2"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="create_ticket.category_id"
                  readonly
                >
                </v-text-field>
                <v-autocomplete
                  v-else
                  dense
                  outlined
                  return-object
                  class="FontSize mr-2"
                  label="Category *"
                  :items="categoryItems"
                  item-text="category_name"
                  item-value="category_id"
                  v-model="create_ticket.category_id"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="3">
                <v-text-field
                  v-if="
                    create_ticket.service_id && SerialNumberDataArray.length > 0
                  "
                  dense
                  outlined
                  label="Product *"
                  class="FontSize mr-2"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="create_ticket.service_id"
                  readonly
                >
                </v-text-field>
                <v-autocomplete
                  v-else
                  dense
                  outlined
                  return-object
                  class="FontSize mr-2"
                  label="Product *"
                  item-text="service_name"
                  item-value="service_id"
                  v-model="create_ticket.service_id"
                  :rules="[(v) => !!v || 'Required']"
                  :items="GetServiceByCategoriesList"
                >
                </v-autocomplete>
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
                  outlined
                  label="Serial Number*"
                  class="FontSize mr-2"
                  v-model="create_ticket.service_serial_number"
                  :readonly="SerialNumberDataArray.length > 0"
                  :rules="[(v) => !!v || 'Required']"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="3">
                <v-text-field
                  dense
                  outlined
                  label="Asset Number"
                  class="FontSize mr-2"
                  v-model="assetNumber"
                  :readonly="SerialNumberDataArray.length > 0"
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
                      v-on="on"
                      v-bind="attrs"
                      persistent-hint
                      color="primary"
                      class="FontSize mr-2"
                      label="Support Start Date"
                      v-model="create_ticket.warranty_start_date"
                      :readonly="SerialNumberDataArray.length > 0"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="primary"
                    scrollable
                    v-model="create_ticket.warranty_start_date"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="supportStartDate = false"
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
                      v-on="on"
                      v-bind="attrs"
                      persistent-hint
                      color="primary"
                      class="FontSize mr-2"
                      label="Support End Date"
                      v-model="create_ticket.warranty_end_date"
                      :readonly="SerialNumberDataArray.length > 0"
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
                        $refs.support_End_Date.save(
                          create_ticket.warranty_end_date
                        )
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
                      @click="
                        $refs.menu3.save(create_ticket.ticket_invoice_date)
                      "
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
                    <v-btn
                      text
                      color="primary"
                      @click="installation_date = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.instal_date.save(
                          create_ticket.product_purchased_on
                        )
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <!-- <v-col cols="12" md="6" sm="12" xs="12">
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
          </v-col> -->
            </v-row>
            <!-- <v-row>
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
        </v-row> -->
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
              <v-col cols="12" md="3" xs="12" sm="12" v-if="settingEnabled">
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
              <v-col cols="12" md="3" xs="12" sm="12" v-if="settingEnabled">
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
              <v-col cols="12" md="3" xs="12" sm="12" v-if="settingEnabled">
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
                      @click="
                        $refs.menu.save(create_ticket.prefered_visit_date)
                      "
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
                      outlined
                      v-on="on"
                      v-bind="attrs2"
                      class="FontSize mr-2"
                      label="Preferred Visit Time *"
                      :rules="[(v) => !!v || 'Required']"
                      append-icon="mdi-clock-time-four-outline"
                      v-model="create_ticket.prefered_visit_time"
                      :readonly="SerialNumberDataArray.length > 0"
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
                      @click="
                        $refs.dialog.save(create_ticket.prefered_visit_time)
                      "
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
                    <v-btn
                      text
                      color="primary"
                      @click="customer_call_date = false"
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
                    <v-btn
                      text
                      color="primary"
                      @click="customer_call_time = false"
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
import { ListPincodeTypesMixins } from "@/mixins/MastersSetting/ListPincodesTerritory.js";
import { getParticularProdFleetData } from "@/mixins/Product/GetProductFleetDetails.js";
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";

var aws = require("aws-sdk");
export default {
  components: {
    Overlay,
    Snackbar,
    GoogleMaps,
  },
  props: {
    SerialNumberDataArray: Array,
    Obj: Object,
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
    GetAllOrganizationSettingsTypesInMS,
    GetAllServiceTypeBasedOnServiceID,
    GetServicesByCategory,
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
      required_user_type: "",
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
    SerialNumberDataArray: [],
    settingEnabled: null,
    categoryItems: [],
    assetNumber: "",
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

    async "create_ticket.category_id"(val) {
      await this.GetServicesByCategoriesMethod(val.category_id);
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
          this.SerialNumberDataArray[0]?.product_id ||
            this.create_ticket.service_id.service_id,
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

          this.create_ticket.seconary_representative =
            this.GetCustomerDetails[0]?.secondary_representative_id != undefined
              ? this.GetCustomerDetails[0]?.secondary_representative_id
              : "";
        }, 1000);
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.SerialNumberDataArray[0]?.product_id ||
            this.create_ticket.service_id.service_id,
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

          this.create_ticket.seconary_representative =
            this.GetCustomerDetails[0]?.secondary_representative_id != undefined
              ? this.GetCustomerDetails[0]?.secondary_representative_id
              : "";
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
          this.SerialNumberDataArray[0]?.product_id,
          this.$store.getters.get_current_user_details.user_id,
          this.create_ticket.required_user_type,
          this.create_ticket.tagged_territories
        );
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.create_ticket.ticket_latitude,
          this.create_ticket.ticket_longitude,
          this.SerialNumberDataArray[0]?.product_id,
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
    console.log("MOUNTED", this.Obj.existence);
    if (this.SerialNumberDataArray.length > 0) {
      console.log("IFFF");
      // this.settingEnabled =
      //   this.$store.getters.get_current_user_details.is_original_ticket_creation_enabled;
      this.settingEnabled = true;
    } else {
      if (this.Obj.existence === "WITHOUT") {
        this.settingEnabled =
          this.$store.getters.get_current_user_details.is_original_ticket_creation_enabled;
      } else {
        this.settingEnabled = false;
      }
      console.log("ELSEEE");
    }
    if (
      this.SerialNumberDataArray.length == 0 &&
      this.Obj.existence === "WITH"
    ) {
      this.renderComp = false;
      this.$nextTick(() => {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText:
            "Couldn't be able to find the details, kindly fill fields manually..!",
        };
        this.renderComp = true;
      });
    }
    // this.SerialNumberDataArray = await this.getParticularProdFleetDataMethod(
    //   this.SerialNumberDataArray[0].setting_id
    // );
    this.GetAllCustomerCategoryMethod("ACTIVE");
    await this.GetAllOrganizationSettingsTypesMethod();
    this.GetAllProblemDescriptionMethod("ACTIVE");
    if (this.SerialNumberDataArray[0]?.product_id) {
      this.GetAllServiceTypeByServiceIDMethod(
        this.SerialNumberDataArray[0]?.product_id
      );
    } else {
      await this.GetAllServiceTypeMethod("ACTIVE");
      this.GetAllServiceTypeByServiceIDList = this.GetAllServiceTypeList;
    }

    await this.GetAllCustomerDetailsMethod(
      this.SerialNumberDataArray[0]?.customer_id
    );

    await this.GetAllTerritoriesMethod(
      "ACTIVE",
      "NON_GEO_BASED",
      this.GetCustomerDetails[0]?.customer_pincode,
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

    if (this.GetCustomerDetails[0]?.territory_ids?.length) {
      this.create_ticket.tagged_territories =
        this.GetCustomerDetails[0]?.territory_ids;
    } else {
      if (this.GetAllTerritoriesList.length === 1) {
        this.create_ticket.tagged_territories.push(
          this.GetAllTerritoriesList[0].territory_id
        );
      } else {
        await this.callClassNameForNoTerrSelMethod();
      }
    }

    setTimeout(() => {
      if (
        this.GetCustomerDetails.length != 0 &&
        this.GetCustomerDetails != []
      ) {
        this.create_ticket.customer_company_name =
          this.GetCustomerDetails[0]?.customer_company_name != undefined
            ? this.GetCustomerDetails[0]?.customer_company_name
            : "";
        this.create_ticket.customer_type =
          this.GetCustomerDetails[0]?.customer_type;
        this.create_ticket.customer_country_code =
          this.GetCustomerDetails[0]?.customer_primary_country_code;
        this.create_ticket.customer_phone_number =
          this.GetCustomerDetails[0]?.customer_primary_contact_number;
        this.create_ticket.secondary_customer_contact =
          this.GetCustomerDetails[0]?.customer_secondary_contact_number;
        this.create_ticket.secondary_customer_contact_country_code =
          this.GetCustomerDetails[0]?.customer_secondary_country_code !=
          undefined
            ? this.GetCustomerDetails[0]?.customer_secondary_country_code
            : "";
        this.create_ticket.ticket_address =
          this.GetCustomerDetails[0]?.customer_address;
        this.create_ticket.ticket_city = this.GetCustomerDetails[0]?.city;
        this.create_ticket.ticket_state = this.GetCustomerDetails[0]?.state;
        this.create_ticket.ticket_pincode =
          this.GetCustomerDetails[0]?.customer_pincode;
        this.create_ticket.ticket_latitude =
          this.GetCustomerDetails[0]?.customer_latitude;
        this.create_ticket.ticket_longitude =
          this.GetCustomerDetails[0]?.customer_longitude;
        this.create_ticket.customer_email_id =
          this.GetCustomerDetails[0]?.customer_email_id != undefined
            ? this.GetCustomerDetails[0]?.customer_email_id
            : "";
        this.create_ticket.customer_unique_id =
          this.GetCustomerDetails[0]?.customer_unique_id != undefined
            ? this.GetCustomerDetails[0]?.customer_unique_id
            : "";
        this.create_ticket.customer_category_id =
          this.GetCustomerDetails[0]?.customer_category_id != undefined
            ? this.GetCustomerDetails[0]?.customer_category_id
            : "";
        this.create_ticket.representative_id =
          this.GetCustomerDetails[0]?.primary_representative_details !=
          undefined
            ? this.GetCustomerDetails[0]?.primary_representative_id
            : undefined;
      } else {
        // this.renderComp = false;
        // this.$nextTick(() => {
        //   this.SnackBarComponent = {
        //     SnackbarVmodel: true,
        //     SnackbarColor: "red",
        //     Top: true,
        //     SnackbarText: "Something went wrong, Please try again ..!",
        //   };
        //   this.renderComp = true;
        // });
      }
    }, 1500);

    this.create_ticket.customer_name =
      this.GetCustomerDetails[0]?.customer_name;
    this.create_ticket.category_id =
      this.SerialNumberDataArray[0]?.category_name;
    this.create_ticket.service_id = this.SerialNumberDataArray[0].product_name;
    this.create_ticket.service_serial_number =
      this.SerialNumberDataArray[0].setting_name;
    this.assetNumber = this.SerialNumberDataArray[0].asset_number;
    this.create_ticket.support_type =
      this.SerialNumberDataArray[0].support_type;
    setTimeout(() => {
      this.create_ticket.warranty_type =
        this.SerialNumberDataArray[0].warranty_type;
    }, 1000);
    this.create_ticket.warranty_start_date =
      this.SerialNumberDataArray[0].warranty_start_date != undefined &&
      this.SerialNumberDataArray[0].warranty_start_date != "-"
        ? this.SerialNumberDataArray[0].warranty_start_date
        : this.SerialNumberDataArray[0].amc_start_date != undefined
        ? this.SerialNumberDataArray[0].amc_start_date
        : "";
    this.create_ticket.warranty_end_date =
      this.SerialNumberDataArray[0].warranty_end_date != undefined &&
      this.SerialNumberDataArray[0].warranty_end_date != "-"
        ? this.SerialNumberDataArray[0].warranty_end_date
        : this.SerialNumberDataArray[0].amc_end_date != undefined
        ? this.SerialNumberDataArray[0].amc_end_date
        : "";

    this.create_ticket.ticket_invoice_number =
      this.SerialNumberDataArray[0].invoice_number;

    this.create_ticket.ticket_invoice_date =
      this.SerialNumberDataArray[0].invoice_date != undefined &&
      this.SerialNumberDataArray[0].invoice_date != "-"
        ? this.SerialNumberDataArray[0].invoice_date
        : "";

    this.create_ticket.product_purchased_on =
      this.SerialNumberDataArray[0].product_purchased_on ||
      this.SerialNumberDataArray[0].installation_date ||
      undefined;

    this.create_ticket.ticket_creation_type =
      this.SerialNumberDataArray[0].ticket_creation_type;
    this.create_ticket.service_type_id =
      this.SerialNumberDataArray[0].service_type_id;
    this.create_ticket.service_ticket_description =
      this.SerialNumberDataArray[0].service_ticket_description;
    this.create_ticket.is_free_of_cost =
      this.SerialNumberDataArray[0].is_free_of_cost;
    this.create_ticket.additional_comments =
      this.SerialNumberDataArray[0].additional_comments;
    this.create_ticket.prefered_visit_date =
      this.SerialNumberDataArray[0].prefered_visit_date;
    this.create_ticket.prefered_visit_time =
      this.SerialNumberDataArray[0].prefered_visit_time;
    this.create_ticket.ticket_priority =
      this.SerialNumberDataArray[0].ticket_priority;
    this.$refs.form.resetValidation();
  },
  methods: {
    GoogleMapsEmit(place) {
      this.create_ticket.ticket_latitude = place.geometry.location.lat();
      this.create_ticket.ticket_longitude = place.geometry.location.lng();
      this.create_ticket.ticket_address = place.formatted_address;
      this.getPincode(
        this.create_ticket.ticket_latitude,
        this.create_ticket.ticket_longitude
      );
    },
    async getPincode(lat, lng) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAuHcsssNtWZhnt0op_n5nm9s8raGeNHGk`
      );
      const data = await response.json();
      if (JSON.parse(data.results.length)) {
        const addressComponents = data.results[0].address_components;
        const pincodeComponent = addressComponents.find((item) =>
          item.types.includes("postal_code")
        );
        const cityComponent = addressComponents.find((item) =>
          item.types.includes("locality")
        );
        const stateComponent = addressComponents.find((item) =>
          item.types.includes("administrative_area_level_1")
        );
        this.create_ticket.ticket_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.create_ticket.ticket_city = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.create_ticket.ticket_state = stateComponent
          ? stateComponent.long_name
          : "State not found";
      }
      return {
        pincode: "Pincode not found",
        city: "City not found",
        state: "State not found",
      };
    },
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
          category_id: this.settingEnabled
            ? this.SerialNumberDataArray[0]?.category_id ||
              this.create_ticket.category_id?.category_id
            : undefined,
          service_id: this.settingEnabled
            ? this.SerialNumberDataArray[0]?.product_id ||
              this.create_ticket.service_id.service_id
            : undefined,
          service_serial_number: this.settingEnabled
            ? this.create_ticket.service_serial_number
            : undefined,
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
          is_free_of_cost: this.settingEnabled
            ? this.create_ticket.is_free_of_cost != undefined
              ? this.create_ticket.is_free_of_cost
              : false
            : undefined,
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
          estimated_time: this.settingEnabled
            ? this.estimatedTime || undefined
            : undefined,
          pincode_type_id: this.settingEnabled
            ? this.pincodeType.pincode_id ||
              this.pincodeType.pincode_type_id ||
              undefined
            : undefined,
          pincode_type_name: this.settingEnabled
            ? this.pincodeType.pincode_territory_type ||
              this.pincodeType.pincode_type_name ||
              undefined
            : undefined,
        };
        Local_Array.push(Object);
        this.loadingBtn = true;
        var inputparams = {
          creator_user_id: this.settingEnabled
            ? this.$store.getters.get_current_user_details.user_id
            : undefined,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          tagged_territories: this.settingEnabled
            ? this.create_ticket.tagged_territories.length > 0
              ? this.create_ticket.tagged_territories
              : undefined
            : undefined,
          ticket_address: this.settingEnabled
            ? this.create_ticket.ticket_address || undefined
            : undefined,
          ticket_latitude: this.settingEnabled
            ? this.create_ticket.ticket_latitude || undefined
            : undefined,
          ticket_longitude: this.settingEnabled
            ? this.create_ticket.ticket_longitude || undefined
            : undefined,
          prefered_visit_date: this.create_ticket.prefered_visit_date,
          customer_type: this.create_ticket.customer_type || undefined,
          assignee_user_id: this.settingEnabled
            ? this.create_ticket.representative_id || undefined
            : undefined,
          ticket_dependency_details: this.settingEnabled
            ? Local_Array
            : undefined,
          customer_country_code: this.settingEnabled
            ? this.create_ticket.customer_country_code || undefined
            : undefined,
          customer_phone_number: this.settingEnabled
            ? this.create_ticket.customer_phone_number || undefined
            : undefined,
          add_customer_to_db: this.settingEnabled ? false : undefined,
          is_rft_ticket: this.settingEnabled ? false : undefined,
          customer_call_date:
            this.create_ticket.customer_call_date || undefined,
          ticket_priority: this.create_ticket.ticket_priority || undefined,
          customer_call_time:
            this.create_ticket.customer_call_time || undefined,
          secondary_technician_id: this.settingEnabled
            ? this.create_ticket.seconary_representative || undefined
            : undefined,
          prefered_visit_time:
            this.create_ticket.prefered_visit_time || undefined,
          source_remark: this.settingEnabled
            ? this.create_ticket.source_remark || undefined
            : undefined,
          ticket_call_source:
            this.create_ticket.ticket_call_source || undefined,
          ticket_pincode: this.settingEnabled
            ? this.create_ticket.ticket_pincode || undefined
            : undefined,
          ticket_state: this.settingEnabled
            ? this.create_ticket.ticket_state || undefined
            : undefined,
          ticket_city: this.settingEnabled
            ? this.create_ticket.ticket_city || undefined
            : undefined,
          secondary_customer_contact: this.settingEnabled
            ? this.create_ticket.secondary_customer_contact || undefined
            : undefined,
          customer_email_id: this.create_ticket.customer_email_id || undefined,

          customer_unique_id:
            this.create_ticket.customer_unique_id || undefined,

          customer_category_id: this.settingEnabled
            ? this.create_ticket.customer_category_id || undefined
            : undefined,
          customer_name: this.create_ticket.customer_name || undefined,

          customer_company_name:
            this.create_ticket.customer_company_name || undefined,

          // FOR RFS API
          //
          category_id:
            this.settingEnabled === false
              ? this.SerialNumberDataArray.length === 0
                ? this.create_ticket.category_id?.category_id
                : this.create_ticket.category_id
              : undefined,
          service_id:
            this.settingEnabled === false
              ? this.SerialNumberDataArray.length === 0
                ? this.create_ticket.service_id.service_id
                : this.create_ticket.service_id
              : undefined,
          serial_number:
            this.settingEnabled === false
              ? this.create_ticket.service_serial_number
              : undefined,
          customer_id:
            this.settingEnabled === false
              ? this.GetCustomerDetails[0]?.customer_id || undefined
              : undefined,
          customer_latitude:
            this.settingEnabled === false
              ? this.create_ticket.ticket_latitude || undefined
              : undefined,
          customer_longitude:
            this.settingEnabled === false
              ? this.create_ticket.ticket_longitude || undefined
              : undefined,
          customer_address:
            this.settingEnabled === false
              ? this.create_ticket.ticket_address || undefined
              : undefined,
          customer_country_code:
            this.create_ticket.customer_country_code || undefined,
          customer_phone_number:
            this.create_ticket.customer_phone_number || undefined,
          city:
            this.settingEnabled === false
              ? this.create_ticket.ticket_city || undefined
              : undefined,
          state:
            this.settingEnabled === false
              ? this.create_ticket.ticket_state || undefined
              : undefined,
          customer_pincode:
            this.settingEnabled === false
              ? this.create_ticket.ticket_pincode || undefined
              : undefined,
          customer_category_id:
            this.create_ticket.customer_category_id || undefined,
          customer_unique_id:
            this.create_ticket.customer_unique_id || undefined,
          is_new_serial_number:
            this.settingEnabled === false
              ? this.GetCustomerDetails.length === 0
                ? true
                : false
              : undefined,
          dealear_or_partner_id:
            this.settingEnabled === false
              ? this.$store.getters.get_current_user_details.user_id
              : undefined,
          setting_id:
            this.settingEnabled === false
              ? this.SerialNumberDataArray[0]?.setting_id || undefined
              : undefined,
          service_type_id:
            this.settingEnabled === false
              ? this.create_ticket.service_type_id
              : undefined,
          service_ticket_description:
            this.settingEnabled === false
              ? this.create_ticket.service_ticket_description || undefined
              : undefined,
          ticket_warranty_type:
            this.settingEnabled === false
              ? this.create_ticket.support_type || undefined
              : undefined,
          support_type:
            this.settingEnabled === false
              ? this.create_ticket.warranty_type || undefined
              : undefined,
          ticket_warranty_details:
            this.settingEnabled === false
              ? {
                  ticket_invoice_number:
                    this.create_ticket.ticket_invoice_number,
                  ticket_invoice_date: this.create_ticket.ticket_invoice_date,
                }
              : undefined,
          installation_date:
            this.settingEnabled === false
              ? this.create_ticket.product_purchased_on || undefined
              : undefined,
          ticket_s3_files:
            this.settingEnabled === false
              ? this.s3_files.length > 0
                ? this.s3_files
                : undefined
              : undefined,
          ticket_creation_type:
            this.settingEnabled === false
              ? this.create_ticket.ticket_creation_type || undefined
              : undefined,
          additional_comments:
            this.settingEnabled === false
              ? this.create_ticket.additional_comments || undefined
              : undefined,
          warranty_start_date:
            this.settingEnabled === false
              ? this.create_ticket.warranty_start_date || undefined
              : undefined,
          warranty_end_date:
            this.settingEnabled === false
              ? this.create_ticket.warranty_end_date || undefined
              : undefined,
          call_source_remarks:
            this.settingEnabled === false
              ? this.create_ticket.source_remark || undefined
              : undefined,
        };
        const mutationName = this.settingEnabled
          ? CreateAssignedTicketV2
          : CreateDealerOrPartnerRFS;
        const mutationNameString = this.settingEnabled
          ? "CreateAssignedTicketV2"
          : "CreateDealerOrPartnerRFS";
        let result = await API.graphql(
          graphqlOperation(mutationName, {
            input: inputparams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutationNameString]);
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
          this.backToMainPageFrom(2, ResultObject.status_message);
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
    backToMainPageFrom(Toggle, sm) {
      this.$emit("clicked", Toggle, sm);
    },
  },
};
</script>
