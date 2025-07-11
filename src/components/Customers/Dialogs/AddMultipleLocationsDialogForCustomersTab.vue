<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
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
    <UpdateDateOnRFTDateList
      :rft_date_list="rft_date_list"
      :DialogUpdateDateOnRFTDateList="DialogUpdateDateOnRFTDateList"
      @clicked="DialogUpdateDateOnRFTDateListEmit"
    />
    <v-card>
      <v-toolbar dense class="elevation-0">
        <h4>
          <v-icon small class="mr-2 mb-1" color="primary"
            >mdi-map-marker-plus</v-icon
          >Add Location
          <span v-if="StoreObj != undefined">
            <span v-if="StoreObj.customer_company_name"
              >to {{ StoreObj.customer_company_name }}</span
            >
          </span>
          <span v-else>to {{ StoreObjCustomer.customer_company_name }}</span>
        </h4>
        <v-spacer />
        <v-btn
          v-if="StoreObjCustomer"
          @click="addLocationEmit()"
          small
          class="primary white--text"
          >Back</v-btn
        >
      </v-toolbar>
      <v-card-text class="py-0">
        <v-row no-gutters>
          <v-col cols="12" xs="12" sm="12" md="4">
            <GoogleMaps :StoreObj="StoreObj" @clicked="GoogleMapsEmit" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="8">
            <v-card-text>
              <v-form ref="form">
                <v-row no-gutters>
                  <v-col cols="12" xs="12" sm="12" md="12">
                    <div class="mb-2 font-weight-bold black--text">
                      Contact Person Details
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Customer"
                      class="FontSize mr-2"
                      v-model="add_location.customer_company_name"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Contact Person"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_location.customer_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Customer ID *"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_location.customer_unique_id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="2">
                    <v-autocomplete
                      dense
                      outlined
                      item-text="name"
                      :items="CountryList"
                      class="FontSize mr-2"
                      item-value="dial_code"
                      label="Country Code *"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_location.customer_primary_country_code"
                    >
                      <template slot="selection" slot-scope="{ item }">
                        {{ item.dial_code }}
                      </template>
                      <template slot="item" slot-scope="{ item }">
                        {{ item.name }}({{ item.dial_code }})
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Contact Number *"
                      v-model="add_location.customer_primary_contact_number"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(
                            v
                          ) || 'Invalid',
                        (v) => (v && v.length < 11) || 'Invalid Contact Number',
                        (v) => (v && v.length > 9) || 'Invalid Contact Number',
                      ]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="2">
                    <v-autocomplete
                      dense
                      outlined
                      item-text="name"
                      :items="CountryList"
                      class="FontSize mr-2"
                      item-value="dial_code"
                      label="Secondary Country Code"
                      v-model="add_location.customer_secondary_country_code"
                    >
                      <template slot="selection" slot-scope="{ item }">
                        {{ item.dial_code }}
                      </template>
                      <template slot="item" slot-scope="{ item }">
                        {{ item.name }}({{ item.dial_code }})
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Secondary Contact Number"
                      v-model="add_location.customer_secondary_contact_number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Email ID"
                      v-model="add_location.customer_email_id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      class="FontSize mr-2"
                      item-value="setting_id"
                      item-text="setting_name"
                      label="Customer Category"
                      :items="GetAllCustomerCategoryList"
                      v-model="add_location.customer_category_id"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      label="Website"
                      class="FontSize"
                      v-model="add_location.customer_website"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <h4 class="mb-2 black--text">Location Details</h4>
                <v-row no-gutters>
                  <v-col cols="12" xs="12" sm="12" md="3">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mr-2"
                      label="Location Name *"
                      placeholder="Home/ Office..etc"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_location.customer_location_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Shipping Address *"
                      class="FontSize mr-2"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_location.customer_address"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Shipping State"
                      class="FontSize mr-2"
                      v-model="add_location.customer_state"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Shipping City"
                      class="FontSize mr-2"
                      v-model="add_location.customer_city"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Shipping Pincode"
                      type="number"
                      class="FontSize mr-2"
                      v-model="add_location.customer_pincode"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="3">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      label="Latitude *"
                      class="FontSize mr-2"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_location.customer_latitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="3">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      class="FontSize"
                      label="Longitude *"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_location.customer_longitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <v-checkbox
                      label="Same as shipping Address"
                      class="mt-n4 mb-n2"
                      v-model="add_location.same_as_shipping_address"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Billing Address"
                      class="FontSize"
                      v-model="add_location.customer_billing_address"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Billing City"
                      class="FontSize"
                      v-model="add_location.customer_billing_city"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Billing State"
                      class="FontSize ml-2"
                      v-model="add_location.customer_billing_state"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Billing Pincode"
                      class="FontSize ml-2"
                      type="number"
                      v-model="add_location.customer_billing_pincode"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      multiple
                      class="FontSize"
                      label="Tag Territories"
                      item-value="territory_id"
                      item-text="territory_name"
                      :items="GetAllTerritoriesList"
                      v-model="add_location.territory_ids"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-text>
              <h3 class="black--text mb-2">Added Addresses</h3>
              <v-data-table
                dense
                :headers="locationHeaders"
                :items="AddedAddresses"
                class="elevation-0"
                no-data-text="No Locations Added Yet"
              >
                <template v-slot:[`item.customer_address`]="{ item }">
                  <div class="FontSize" v-if="item.customer_address">
                    {{ item.customer_address }}
                  </div>
                </template>
                <template v-slot:[`item.customer_name`]="{ item }">
                  <div class="FontSize">{{ item.customer_name }}</div>
                </template>
                <template
                  v-slot:[`item.customer_primary_contact_number`]="{ item }"
                >
                  <div class="FontSize">
                    {{ item.customer_primary_contact_number }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn
                    v-if="$store.getters.get_user_type != 'AGENT'"
                    icon
                    color="red"
                    @click="deleteSecondaryCustomer(item)"
                    ><v-icon small>mdi-delete</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-card-text>
          </v-col>
        </v-row>
        <v-card outlined>
          <v-toolbar dense class="elevation-0">
            <h3 class="pt-4">Create & Tag Product Fleet</h3>
          </v-toolbar>
          <v-divider class="mx-4 mt-2"></v-divider>
          <v-card-text>
            <v-form ref="form1">
              <v-row no-gutters>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-autocomplete
                    dense
                    outlined
                    return-object
                    class="FontSize mr-2"
                    label="Select Category"
                    :items="category_lists"
                    item-value="category_id"
                    item-text="category_name"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_product_fleet.category_id"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-autocomplete
                    dense
                    outlined
                    return-object
                    class="FontSize mr-2"
                    item-value="service_id"
                    item-text="service_name"
                    :items="GetServiceByCategoriesList"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_product_fleet.product_id"
                    :disabled="!create_product_fleet.category_id"
                    :label="
                      !create_product_fleet.category_id
                        ? 'Select Category first *'
                        : 'Select Product *'
                    "
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mr-2"
                    label="Serial Number *"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_product_fleet.setting_name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    label="Price"
                    class="FontSize mr-2"
                    v-model="create_product_fleet.setting_price"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mr-2"
                    label="Asset Number"
                    v-model="create_product_fleet.asset_number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Description"
                    v-model="create_product_fleet.setting_description"
                  ></v-text-field>
                </v-col>
                <v-col col="12" xs="12" sm="12" md="2">
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize mr-2"
                    item-text="setting_name"
                    label="Product Fleet Status"
                    :items="GetAllProductFleetStatusList"
                    v-model="
                      create_product_fleet.organization_products_fleet_status
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="2" sm="12" xs="12">
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
                        class="FontSize mr-2"
                        label="Manufacture Date"
                        prepend-inner-icon="mdi-calendar"
                        text-value="product_manufactured_date"
                        v-model="create_product_fleet.product_manufactured_date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="create_product_fleet.product_manufactured_date"
                      @input="manufacture_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mr-2"
                    label="Invoice Number"
                    v-model="create_product_fleet.invoice_number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    v-model="menu_invoice_date"
                    transition="scale-transition"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize mr-2"
                        label="Invoice Date"
                        text-value="invoice_date"
                        prepend-inner-icon="mdi-calendar"
                        v-model="create_product_fleet.invoice_date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="create_product_fleet.invoice_date"
                      @input="menu_invoice_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="product_purchased_on_dialog"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize mr-2"
                        label="Installation Date"
                        text-value="product_purchased_on"
                        prepend-inner-icon="mdi-calendar"
                        v-model="create_product_fleet.product_purchased_on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="create_product_fleet.product_purchased_on"
                      @input="product_purchased_on_dialog = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="2" xs="12" sm="12">
                  <v-text-field
                    dense
                    outlined
                    label="Version"
                    class="FontSize"
                    v-model="create_product_fleet.software_version"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-autocomplete
                    dense
                    outlined
                    label="Support"
                    item-text="text"
                    item-value="value"
                    :items="supportItems"
                    class="FontSize mr-2"
                    v-model="create_product_fleet.support_type"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize mr-2"
                    label="Support Type"
                    item-text="setting_name"
                    item-value="setting_name"
                    :items="GetAllAMCTypeList"
                    v-model="create_product_fleet.warranty_type"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="menu_warranty_start_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize mr-2"
                        label="Support Start Date"
                        text-value="warranty_start_date"
                        prepend-inner-icon="mdi-calendar"
                        v-model="create_product_fleet.warranty_start_date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="create_product_fleet.warranty_start_date"
                      @input="menu_warranty_start_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="menu_warranty_end_date"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize mr-2"
                        label="Support End Date"
                        text-value="warranty_end_date"
                        prepend-inner-icon="mdi-calendar"
                        v-model="create_product_fleet.warranty_end_date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="create_product_fleet.warranty_end_date"
                      @input="menu_warranty_end_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-checkbox
                    dense
                    outlined
                    class="FontSize"
                    label="Schedule Service ?"
                    v-model="create_product_fleet.is_schedule_service"
                  >
                  </v-checkbox>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="2">
                  <v-select
                    dense
                    outlined
                    class="FontSize"
                    label="Frequency *"
                    :items="frequency_items"
                    v-model="create_product_fleet.frequency"
                    :disabled="
                      create_product_fleet.is_schedule_service == false
                    "
                    :rules="
                      create_product_fleet.is_schedule_service == true
                        ? [(v) => !!v || 'Required']
                        : []
                    "
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="8" xs="12" sm="12"> </v-col>
                <v-col cols="12" md="2" xs="12" sm="12">
                  <v-btn
                    small
                    class="primary white--text ml-10"
                    :disabled="create_product_fleet.frequency == ''"
                    @click="DialogUpdateDateOnRFTDateList = true"
                    ><v-icon small class="mr-1"
                      >mdi-calendar-question-outline</v-icon
                    >Visits ({{ this.rft_date_list.length }})</v-btn
                  >
                </v-col>
                <v-col cols="12" md="1" xs="12" sm="12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        small
                        v-on="on"
                        v-bind="attrs"
                        color="primary"
                        @click="
                          (AddExtendedWarrantyDialog = true),
                            (StoreObjExtendedWarranty.action = 'ADD')
                        "
                      >
                        <v-icon small>mdi-alpha-e-box</v-icon>
                      </v-btn>
                    </template>
                    <span>Add Extended Warranty</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="1" class="pl-0 pb-0">
                  <v-tooltip color="primary" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        small
                        v-on="on"
                        v-bind="attrs"
                        class="primary white--text"
                        @click="createProductFleetMethod()"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </template>
                    <span class="white--text">Add Product Fleet</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-form>
            <v-row>
              <v-col cols="12" md="12" xs="12" sm="12">
                <div
                  class="font-weight-bold"
                  v-if="extended_warranty_details.length != 0"
                >
                  Extended Warranties
                </div>
                <v-data-table
                  v-if="extended_warranty_details.length != 0"
                  dense
                  class="elevation-0"
                  :headers="extendedSupportHeaders"
                  :items="extended_warranty_details"
                >
                  <template
                    v-slot:[`item.extendedWarrantyDatesList`]="{ item }"
                  >
                    <div>
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
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" xs="12" md="12" class="py-0">
                <v-data-table
                  :headers="productFleetHeaders"
                  :items="productFleetList"
                  :items-per-page="100"
                >
                  <template v-slot:[`item.category_name`]="{ item }">
                    <div class="FontSize">
                      {{ item.category_name }}
                    </div>
                    <div class="FontSize">
                      {{ item.product_name }}
                    </div>
                    <div class="FontSize">
                      <span class="font-weight-bold">SL No. </span>
                      {{ item.setting_name }}
                    </div>
                  </template>
                  <template v-slot:[`item.setting_description`]="{ item }">
                    <div class="FontSize" v-if="item.setting_description">
                      {{ item.setting_description }}
                    </div>
                    <div v-else>-</div>
                    <div class="FontSize" v-if="item.setting_price">
                      <v-icon small color="primary">mdi-currency-inr</v-icon> -
                      {{ item.setting_price }}
                    </div>
                    <div v-else>-</div>
                    <div class="FontSize" v-if="item.asset_number">
                      <span class="font-weight-bold">Asset:</span>
                      {{ item.asset_number }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.invoice_number`]="{ item }">
                    <div class="FontSize" v-if="item.invoice_number">
                      {{ item.invoice_number }}
                    </div>
                    <div v-else>-</div>
                    <div class="FontSize" v-if="item.invoice_date">
                      {{ item.invoice_date }}
                    </div>
                    <div v-else>-</div>
                    <div class="FontSize" v-if="item.product_manufactured_date">
                      <span class="font-weight-bold">MFD :</span>
                      {{ item.product_manufactured_date }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.product_purchased_on`]="{ item }">
                    <div v-if="item.product_purchased_on" class="FontSize">
                      {{ item.product_purchased_on }}
                    </div>
                    <div v-else>-</div>
                    <div v-if="item.support_type" class="FontSize">
                      {{ item.support_type }}
                    </div>
                    <div v-else>-</div>
                    <div v-if="item.warranty_type" class="FontSize">
                      {{ item.warranty_type }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.warranty_start_date`]="{ item }">
                    <div v-if="item.warranty_start_date" class="FontSize">
                      {{ item.warranty_start_date }}
                    </div>
                    <div v-else>-</div>
                    <div v-if="item.warranty_end_date" class="FontSize">
                      {{ item.warranty_end_date }}
                    </div>
                    <div v-else>-</div>
                    <div v-if="item.is_schedule_service" class="FontSize">
                      Visits - YES
                    </div>
                    <div v-else class="FontSize">Visits - NO</div>
                  </template>
                  <template v-slot:[`item.frequency`]="{ item }">
                    <div class="FontSize" v-if="item.frequency">
                      {{ item.frequency }} Days
                    </div>
                    <div v-else>-</div>
                    <div
                      class="FontSize"
                      v-if="item.organization_products_fleet_status"
                    >
                      {{ item.organization_products_fleet_status }}
                    </div>
                    <div v-else>-</div>
                    <div v-if="item.software_version" class="FontSize">
                      <span class="font-weight-bold">Vers. :</span>
                      {{ item.software_version }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.Actions`]="{ item }">
                    <v-tooltip color="primary" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          small
                          v-on="on"
                          v-bind="attrs"
                          @click="
                            productFleetList.splice(
                              productFleetList.indexOf(item),
                              1
                            )
                          "
                          color="red"
                          ><v-icon small>mdi-delete</v-icon></v-btn
                        >
                      </template>
                      <span class="white--text">Delete Product Fleet</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="loading"
            class="mr-1 mb-3"
            color="primary"
            @click="addLocationsMethods()"
            ><v-icon small class="mr-1">mdi-map-marker-plus</v-icon>SAVE</v-btn
          >
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import CountryList from "@/JsonFiles/CountryList.json";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import AddExtendedWarranty from "@/components/Product/Dialogs/AddExtendedWarranty.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
import UpdateDateOnRFTDateList from "@/components/Product/Dialogs/ProductsFleet/UpdateDateOnRFTDateList.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { Delete_Customers_Secondary_Location } from "@/graphql/mutations.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { Create_Multiple_Locations_Of_Customer } from "@/graphql/mutations.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";
import { GetAllProductFleetStatus } from "@/mixins/MastersSetting/GetAllProductFleetStatus.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  props: {
    StoreObj: Object,
    StoreObjCustomer: Array,
  },
  mixins: [
    GetAllTerritories,
    GetServicesByCategory,
    GetAllCustomerCategory,
    GetAllProductFleetStatus,
    GetAllOrganizationSetting,
    GetAllOrganizationSettingsTypesInMS,
  ],
  components: {
    Overlay,
    Snackbar,
    GoogleMaps,
    AddExtendedWarranty,
    ViewScheduleVisitDate,
    UpdateDateOnRFTDateList,
  },
  data: () => ({
    loading: false,
    overlay: false,
    renderComp: true,
    manufacture_date: false,
    menu_invoice_date: false,
    menu_warranty_end_date: false,
    menu_warranty_start_date: false,
    product_purchased_on_dialog: false,
    AddExtendedWarrantyDialog: false,
    DialogViewScheduleVisitDates: false,
    DialogUpdateDateOnRFTDateList: false,
    StoreObjNew: {},
    add_location: {
      customer_city: "",
      territory_ids: "",
      customer_name: "",
      customer_state: "",
      customer_address: "",
      customer_pincode: "",
      customer_website: "",
      customer_email_id: "",
      customer_latitude: "",
      customer_unique_id: "",
      customer_longitude: "",
      customer_category_id: "",
      customer_company_name: "",
      customer_billing_city: "",
      customer_billing_state: "",
      customer_location_name: "",
      customer_billing_pincode: "",
      customer_billing_address: "",
      customer_primary_contact_number: "",
      customer_primary_country_code: "+91",
      customer_secondary_contact_number: "",
      customer_secondary_country_code: "+91",
      same_as_shipping_address: true,
    },
    create_product_fleet: {
      is_schedule_service: false,
      frequency: "",
      product_id: "",
      category_id: "",
      setting_name: "",
      asset_number: "",
      invoice_date: "",
      support_type: "",
      warranty_type: "",
      setting_price: "",
      invoice_number: "",
      software_version: "",
      warranty_end_date: "",
      warranty_start_date: "",
      setting_description: "",
      product_purchased_on: "",
      product_manufactured_date: "",
      organization_products_fleet_status: "",
    },
    StoreObjExtendedWarranty: {},
    SnackBarComponent: {},
    CountryList: [],
    rft_date_list: [],
    AddedAddresses: [],
    category_lists: [],
    productFleetList: [],
    GetAllAMCTypeList: [],
    GetAllTerritoriesList: [],
    extended_warranty_details: [],
    GetServiceByCategoriesList: [],
    GetAllProductFleetStatusList: [],
    GetAllCustomerCategoryList: [],
    productFleetHeaders: [
      { text: "Product", value: "category_name" },
      { text: "Description", value: "setting_description" },
      { text: "Invoice", value: "invoice_number" },
      { text: "Installation", value: "product_purchased_on" },
      { text: "Support", value: "warranty_start_date" },
      { text: "Frequency", value: "frequency" },
      { text: "Actions", value: "Actions" },
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
    supportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    locationHeaders: [
      { text: "Address", value: "customer_address", width: "40%" },
      { text: "Contact Name", value: "customer_name", width: "25%" },
      {
        text: "Contact No.",
        value: "customer_primary_contact_number",
        width: "25%",
      },
      { text: "Action", value: "Action", width: "10%" },
    ],
  }),
  watch: {
    "create_product_fleet.category_id"(val) {
      if (val != undefined) {
        this.GetServicesByCategoriesMethod(val.category_id);
      }
    },
    "create_product_fleet.support_type"(val) {
      if (val != undefined && val != "" && val != null) {
        this.GetAllAMCTypeMethod("ACTIVE", val);
      }
    },
    GetAllOrganizationSettingsTypesObject(val) {
      this.category_lists = val.categories_list;
    },
    "create_product_fleet.frequency"(val) {
      this.rft_date_list = [];
      if (val != undefined && val != null && val != 0 && val != "") {
        let support_start_date = new Date(
          parseInt(this.create_product_fleet.warranty_start_date.split("-")[0]),
          parseInt(
            this.create_product_fleet.warranty_start_date.split("-")[1]
          ) - 1,
          parseInt(this.create_product_fleet.warranty_start_date.split("-")[2])
        ).getTime();
        let support_end_date = new Date(
          parseInt(this.create_product_fleet.warranty_end_date.split("-")[0]),
          parseInt(this.create_product_fleet.warranty_end_date.split("-")[1]) -
            1,
          parseInt(this.create_product_fleet.warranty_end_date.split("-")[2])
        ).getTime();
        this.rft_date_list = [];
        while (support_start_date < support_end_date) {
          this.rft_date_list.push({
            rft_date: support_start_date,
          });
          support_start_date +=
            this.create_product_fleet.frequency * 24 * 60 * 60 * 1000;
        }
      }
    },
    "add_location.same_as_shipping_address"(val) {
      if (val == false) {
        this.add_location.customer_billing_address = "";
        this.add_location.customer_billing_state = "";
        this.add_location.customer_billing_city = "";
        this.add_location.customer_billing_pincode = "";
      } else {
        this.add_location.customer_billing_address =
          this.add_location.customer_address;
        this.add_location.customer_billing_state =
          this.add_location.customer_state;
        this.add_location.customer_billing_city =
          this.add_location.customer_city;
        this.add_location.customer_billing_pincode =
          this.add_location.customer_pincode;
      }
    },
  },
  mounted() {
    this.GetAllOrganizationSettingsTypesMethod();
    this.GetAllProductFleetStatusMethod("ACTIVE");
    this.add_location.customer_company_name =
      this.StoreObj != undefined
        ? this.StoreObj.customer_company_name
        : this.StoreObjCustomer.customer_company_name;
    this.GetAllCustomerCategoryMethod("ACTIVE");
    this.GetAllTerritoriesMethod(
      "ACTIVE",
      "NON_GEO_BASED",
      undefined,
      "TERRITORY",
      undefined
    );
    this.CountryList = CountryList;
    this.AddedAddresses =
      this.StoreObj != undefined
        ? this.StoreObj.secondary_customers != undefined &&
          this.StoreObj.secondary_customers.length != 0
          ? this.StoreObj.secondary_customers
          : []
        : this.StoreObjCustomer.secondary_customers != undefined &&
          this.StoreObjCustomer.secondary_customers.length != 0
        ? this.StoreObjCustomer.secondary_customers
        : [];
    if (this.StoreObjCustomer) {
      console.log(this.StoreObjCustomer, "StoreObjCustomer");
      this.add_location.customer_billing_address =
        this.StoreObjCustomer.customer_billing_address;
      this.add_location.customer_name = this.StoreObjCustomer.customer_name;
      this.add_location.customer_unique_id =
        this.StoreObjCustomer.customer_unique_id;
      this.add_location.customer_primary_country_code =
        this.StoreObjCustomer.customer_primary_country_code;
      this.add_location.customer_primary_contact_number =
        this.StoreObjCustomer.customer_primary_contact_number;
      this.add_location.customer_secondary_country_code =
        this.StoreObjCustomer.customer_secondary_country_code;
      this.add_location.customer_secondary_contact_number =
        this.StoreObjCustomer.customer_secondary_contact_number;
      this.add_location.customer_email_id =
        this.StoreObjCustomer.customer_email_id;
      this.add_location.customer_category_id =
        this.StoreObjCustomer.customer_category_id;
      this.add_location.customer_website =
        this.StoreObjCustomer.customer_website;
      this.add_location.customer_address =
        this.StoreObjCustomer.customer_address;
      this.add_location.customer_state = this.StoreObjCustomer.customer_state;
      this.add_location.customer_city = this.StoreObjCustomer.customer_city;
      this.add_location.customer_pincode =
        this.StoreObjCustomer.customer_pincode;
      this.add_location.customer_latitude =
        this.StoreObjCustomer.customer_latitude;
      this.add_location.customer_longitude =
        this.StoreObjCustomer.customer_longitude;
      this.add_location.customer_billing_city =
        this.StoreObjCustomer.customer_billing_city;
      this.add_location.customer_billing_state =
        this.StoreObjCustomer.customer_billing_state;
      this.add_location.customer_billing_pincode =
        this.StoreObjCustomer.customer_billing_pincode;
      this.add_location.territory_ids = this.StoreObjCustomer.territory_ids;
      this.productFleetList = this.StoreObjCustomer.productFleetList;
    }
  },
  methods: {
    createProductFleetMethod() {
      if (this.$refs.form1.validate()) {
        let productFleetObj = {
          category_id: this.create_product_fleet.category_id.category_id,
          category_name: this.create_product_fleet.category_id.category_name,
          product_id: this.create_product_fleet.product_id.service_id,
          product_name: this.create_product_fleet.product_id.service_name,
          setting_name: this.create_product_fleet.setting_name,
          setting_price:
            this.create_product_fleet.setting_price != "" &&
            this.create_product_fleet.setting_price != null &&
            this.create_product_fleet.setting_price != undefined
              ? this.create_product_fleet.setting_price
              : undefined,
          product_purchased_on:
            this.create_product_fleet.product_purchased_on != "" &&
            this.create_product_fleet.product_purchased_on != null &&
            this.create_product_fleet.product_purchased_on != undefined
              ? this.create_product_fleet.product_purchased_on
              : undefined,
          setting_description:
            this.create_product_fleet.setting_description != "" &&
            this.create_product_fleet.setting_description != undefined &&
            this.create_product_fleet.setting_description != null
              ? this.create_product_fleet.setting_description
              : undefined,
          asset_number:
            this.create_product_fleet.asset_number != "" &&
            this.create_product_fleet.asset_number != undefined &&
            this.create_product_fleet.asset_number != null
              ? this.create_product_fleet.asset_number
              : undefined,
          product_manufactured_date:
            this.create_product_fleet.product_manufactured_date != undefined &&
            this.create_product_fleet.product_manufactured_date != null &&
            this.create_product_fleet.product_manufactured_date != ""
              ? this.create_product_fleet.product_manufactured_date
              : undefined,
          organization_products_fleet_status:
            this.create_product_fleet.organization_products_fleet_status !=
              undefined &&
            this.create_product_fleet.organization_products_fleet_status !=
              null &&
            this.create_product_fleet.organization_products_fleet_status != ""
              ? this.create_product_fleet.organization_products_fleet_status
              : undefined,
          software_version:
            this.create_product_fleet.software_version != undefined &&
            this.create_product_fleet.software_version != null &&
            this.create_product_fleet.software_version != ""
              ? this.create_product_fleet.software_version
              : undefined,
          frequency:
            this.create_product_fleet.frequency != undefined &&
            this.create_product_fleet.frequency != null &&
            this.create_product_fleet.frequency != "" &&
            this.create_product_fleet.is_schedule_service == true
              ? this.create_product_fleet.frequency
              : undefined,
          rft_date_list:
            this.create_product_fleet.is_schedule_service == true
              ? this.rft_date_list.map((item) => item.rft_date / 1000)
              : undefined,
          support_type:
            this.create_product_fleet.support_type != "" &&
            this.create_product_fleet.support_type != null &&
            this.create_product_fleet.support_type != undefined
              ? this.create_product_fleet.support_type
              : undefined,
          warranty_type:
            this.create_product_fleet.warranty_type != "" &&
            this.create_product_fleet.warranty_type != null &&
            this.create_product_fleet.warranty_type != undefined
              ? this.create_product_fleet.warranty_type
              : undefined,
          product_manufactured_date:
            this.create_product_fleet.product_manufactured_date != undefined &&
            this.create_product_fleet.product_manufactured_date != null &&
            this.create_product_fleet.product_manufactured_date != ""
              ? this.create_product_fleet.product_manufactured_date
              : undefined,
          is_schedule_service:
            this.create_product_fleet.frequency != undefined &&
            this.create_product_fleet.frequency != null &&
            this.create_product_fleet.frequency != "" &&
            this.create_product_fleet.frequency != 0
              ? this.create_product_fleet.is_schedule_service
              : false,
          warranty_start_date:
            this.create_product_fleet.warranty_start_date != "" &&
            this.create_product_fleet.warranty_start_date != undefined &&
            this.create_product_fleet.warranty_start_date != null
              ? this.create_product_fleet.warranty_start_date
              : undefined,
          warranty_end_date:
            this.create_product_fleet.warranty_end_date != "" &&
            this.create_product_fleet.warranty_end_date != undefined &&
            this.create_product_fleet.warranty_end_date != null
              ? this.create_product_fleet.warranty_end_date
              : undefined,
          invoice_number:
            this.create_product_fleet.invoice_number != "" &&
            this.create_product_fleet.invoice_number != undefined &&
            this.create_product_fleet.invoice_number != null
              ? this.create_product_fleet.invoice_number
              : undefined,
          invoice_date:
            this.create_product_fleet.invoice_date != "" &&
            this.create_product_fleet.invoice_date != undefined &&
            this.create_product_fleet.invoice_date != null
              ? this.create_product_fleet.invoice_date
              : undefined,
          extended_warranty_details:
            this.extended_warranty_details != [] &&
            this.extended_warranty_details.length != 0 &&
            this.extended_warranty_details != undefined
              ? this.extended_warranty_details
              : undefined,
        };
        this.productFleetList.push(productFleetObj);
        this.$refs.form1.reset();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill Valid Mandatory Fields ..!",
          };
          this.renderComp = true;
        });
      }
    },
    addLocationEmit() {
      this.$emit("clicked");
    },
    DialogViewScheduleVisitDatesEmit() {
      this.DialogViewScheduleVisitDates = false;
    },
    DialogUpdateDateOnRFTDateListEmit(Toggle, rft_date_list) {
      if (Toggle == 2) {
        this.rft_date_list = rft_date_list;
      }
      this.DialogUpdateDateOnRFTDateList = false;
    },
    viewScheduleVisitDates(item) {
      this.StoreObjNew = item;
      this.DialogViewScheduleVisitDates = true;
    },
    AddExtendedWarrantyDialogEmit(item) {
      if (item != undefined) {
        this.extended_warranty_details.push(item);
      }
      this.AddExtendedWarrantyDialog = false;
    },
    async deleteSecondaryCustomer(item) {
      if (item.customer_id) {
        try {
          this.overlay = true;
          var inputParams = {
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            secondary_customer_id: item.customer_id,
          };
          let result = await API.graphql(
            graphqlOperation(Delete_Customers_Secondary_Location, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(
            result.data.Delete_Customers_Secondary_Location
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
            this.overlay = false;
            this.AddedAddresses.splice(this.AddedAddresses.indexOf(item), 1);
          }
        } catch (error) {
          this.overlay = false;
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
        this.AddedAddresses.splice(this.AddedAddresses.indexOf(item), 1);
      }
    },
    async addLocationsMethods() {
      if (this.$refs.form.validate()) {
        // this.productFleetList.map((item) => {
        //   delete item.category_name;
        //   delete item.service_name;
        //   delete item.product_name;
        //   this.$forceUpdate();
        // });
        try {
          this.loading = true;
          var inputParams = {
            primary_customer_id:
              this.StoreObj != undefined
                ? this.StoreObj.customer_id
                : this.StoreObjCustomer.customer_id,
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            customer_name: this.add_location.customer_name,
            customer_unique_id:
              this.add_location.customer_unique_id != undefined &&
              this.add_location.customer_unique_id != null &&
              this.add_location.customer_unique_id != ""
                ? this.add_location.customer_unique_id
                : undefined,
            customer_company_name:
              this.add_location.customer_company_name != undefined &&
              this.add_location.customer_company_name != null &&
              this.add_location.customer_company_name != ""
                ? this.add_location.customer_company_name
                : undefined,
            customer_billing_address:
              this.add_location.customer_billing_address != undefined &&
              this.add_location.customer_billing_address != null &&
              this.add_location.customer_billing_address != ""
                ? this.add_location.customer_billing_address
                : undefined,
            customer_billing_city:
              this.add_location.customer_billing_city != undefined &&
              this.add_location.customer_billing_city != null &&
              this.add_location.customer_billing_city != ""
                ? this.add_location.customer_billing_city
                : undefined,
            customer_billing_state:
              this.add_location.customer_billing_state != undefined &&
              this.add_location.customer_billing_state != null &&
              this.add_location.customer_billing_state != ""
                ? this.add_location.customer_billing_state
                : undefined,
            customer_billing_pincode:
              this.add_location.customer_billing_pincode != undefined &&
              this.add_location.customer_billing_pincode != null &&
              this.add_location.customer_billing_pincode != ""
                ? this.add_location.customer_billing_pincode
                : undefined,
            customer_address: this.add_location.customer_address,
            customer_state:
              this.add_location.customer_state != undefined &&
              this.add_location.customer_state != "" &&
              this.add_location.customer_state != null
                ? this.add_location.customer_state
                : undefined,
            customer_pincode:
              this.add_location.customer_pincode != undefined &&
              this.add_location.customer_pincode != "" &&
              this.add_location.customer_pincode != null
                ? this.add_location.customer_pincode
                : undefined,
            customer_city:
              this.add_location.customer_city != undefined &&
              this.add_location.customer_city != "" &&
              this.add_location.customer_city != null
                ? this.add_location.customer_city
                : undefined,
            customer_location_name: this.add_location.customer_location_name,
            customer_primary_country_code:
              this.add_location.customer_primary_country_code,
            customer_secondary_country_code:
              this.add_location.customer_secondary_country_code != undefined &&
              this.add_location.customer_secondary_country_code != null &&
              this.add_location.customer_secondary_country_code != ""
                ? this.add_location.customer_secondary_country_code
                : undefined,
            customer_secondary_contact_number:
              this.add_location.customer_secondary_contact_number !=
                undefined &&
              this.add_location.customer_secondary_contact_number != null &&
              this.add_location.customer_secondary_contact_number != ""
                ? this.add_location.customer_secondary_contact_number
                : undefined,
            customer_primary_contact_number:
              this.add_location.customer_primary_contact_number,
            customer_email_id:
              this.add_location.customer_email_id != undefined &&
              this.add_location.customer_email_id != null &&
              this.add_location.customer_email_id != ""
                ? this.add_location.customer_email_id
                : undefined,
            customer_category_id:
              this.add_location.customer_category_id != undefined &&
              this.add_location.customer_category_id != null &&
              this.add_location.customer_category_id != ""
                ? this.add_location.customer_category_id.setting_id
                : undefined,
            customer_category_name:
              this.add_location.customer_category_id != undefined &&
              this.add_location.customer_category_id != null &&
              this.add_location.customer_category_id != ""
                ? this.add_location.customer_category_id.setting_name
                : undefined,
            customer_website:
              this.add_location.customer_website != undefined &&
              this.add_location.customer_website != null &&
              this.add_location.customer_website != ""
                ? this.add_location.customer_website
                : undefined,
            customer_latitude: this.add_location.customer_latitude,
            customer_longitude: this.add_location.customer_longitude,
            territory_ids:
              this.add_location.territory_ids != "" &&
              this.add_location.territory_ids != undefined &&
              this.add_location.territory_ids != null &&
              this.add_location.territory_ids != [] &&
              this.add_location.territory_ids.length != 0
                ? this.add_location.territory_ids
                : [],
            tagged_serial_numbers:
              this.productFleetList != undefined &&
              this.productFleetList.length != 0 &&
              this.productFleetList != [] &&
              this.productFleetList != null
                ? this.productFleetList.map((item) => {
                    const {
                      category_name,
                      service_name,
                      product_name,
                      ...rest
                    } = item;
                    return rest;
                  })
                : undefined,
          };
          let result = await API.graphql(
            graphqlOperation(Create_Multiple_Locations_Of_Customer, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(
            result.data.Create_Multiple_Locations_Of_Customer
          );
          if (ResultObject.status == "SUCCESS") {
            this.productFleetList = [];
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
            this.loading = false;
            let newAddressObj = {
              customer_location_name: this.add_location.customer_location_name,
              customer_address: this.add_location.customer_address,
              customer_name: this.add_location.customer_name,
              customer_primary_contact_number:
                this.add_location.customer_primary_contact_number,
            };
            this.AddedAddresses.push(newAddressObj);
            this.$refs.form.reset();
          }
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
            SnackbarText: "Fill All Mandatory Fields",
          };
          this.renderComp = true;
        });
      }
    },
    GoogleMapsEmit(place) {
      this.add_location.customer_location_name = place.name;
      this.add_location.customer_latitude = place.geometry.location.lat();
      this.add_location.customer_longitude = place.geometry.location.lng();
      this.add_location.customer_address = place.formatted_address;
      this.add_location.customer_billing_address = place.formatted_address;
      this.add_location.customer_primary_country_code = "+91";
      this.add_location.customer_secondary_country_code = "+91";
      this.getPincode(
        this.add_location.customer_latitude,
        this.add_location.customer_longitude
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
        this.add_location.customer_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.add_location.customer_billing_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.add_location.customer_city = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.add_location.customer_state = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.add_location.customer_billing_city = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.add_location.customer_billing_state = stateComponent
          ? stateComponent.long_name
          : "State not found";
      }
    },
  },
};
</script>
