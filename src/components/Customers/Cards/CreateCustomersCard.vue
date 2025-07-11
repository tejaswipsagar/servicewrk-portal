<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <AddExtendedWarranty
      :StoreObjExtendedWarranty="StoreObjExtendedWarranty"
      :AddExtendedWarrantyDialog="AddExtendedWarrantyDialog"
      @clicked="AddExtendedWarrantyDialogEmit"
    />
    <ConfirmCreationOfSecondaryCustomer
      :confirmCreateSecondaryCustomerDailog="
        confirmCreateSecondaryCustomerDailog
      "
      @clicked="confirmCreateSecondaryCustomerDailogEmit"
    />
    <ViewScheduleVisitDate
      :StoreObjNew="StoreObjNew"
      :DialogViewScheduleVisitDates="DialogViewScheduleVisitDates"
      @clicked="DialogViewScheduleVisitDatesEmit"
    />
    <UpdateDateOnRFTDateList
      :StoreObjNew="visitDateObj"
      :DialogUpdateDateOnRFTDateList="DialogUpdateDateOnRFTDateList"
      @clicked="DialogUpdateDateOnRFTDateListEmit"
    />
    <AddMultipleLocationsDialogForCustomersTab
      v-if="current_page == 'ADD_SECONDARY_LOCATION'"
      :StoreObjCustomer="StoreObjCustomer"
      @clicked="addLocationEmit"
    />;
    <v-card class="elevation-0" v-if="current_page == 'CREATE_OR_EDIT'">
      <v-toolbar dense class="elevation-0">
        <v-icon color="primary" small>
          {{ StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil" }}
        </v-icon>
        <div
          class="ml-2 largeFontSizeNew"
          v-text="
            StoreObj.action == 'CREATE' ? 'Add Customer' : 'Edit Customer'
          "
        ></div>
        <v-spacer></v-spacer>
        <v-btn
          small
          v-if="
            StoreObj.action == 'CREATE' ||
            StoreObj.action == 'UPDATE_INVALID_CUSTOMER'
          "
          color="primary"
          @click="CreateCustomerCardEmit((Toggle = 1))"
          ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
        >
      </v-toolbar>
      <v-card-text class="py-0">
        <v-row no-gutters>
          <v-col cols="12" xs="12" sm="12" md="6" class="mt-n4">
            <GoogleMaps :StoreObj="StoreObj" @clicked="GoogleMapsEmit" />
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
                <v-btn icon color="primary" @click="previewImg(item)">
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
          <v-col cols="12" xs="12" sm="12" md="6">
            <v-form ref="form">
              <v-row no-gutters>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-select
                    dense
                    outlined
                    class="FontSize mr-2"
                    label="Customer Type *"
                    :items="customer_type_items"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_customer.customer_type"
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  xs="12"
                  sm="12"
                  md="4"
                  v-if="create_customer.customer_type == 'BUSINESS'"
                >
                  <v-text-field
                    dense
                    outlined
                    label="Customer Name"
                    class="FontSize mx-2"
                    v-model="create_customer.company_name"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  xs="12"
                  sm="12"
                  md="4"
                  v-if="create_customer.customer_type == 'BUSINESS'"
                >
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mx-2"
                    label="Company Website"
                    v-model="create_customer.customer_website"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Required']"
                    label="Customer ID *"
                    class="FontSize mr-2"
                    v-model="create_customer.customer_unique_id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    class="mx-2 FontSize"
                    label="Contact Person Name *"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_customer.customer_name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="Email ID"
                    :rules="emailRules"
                    class="FontSize ml-2"
                    v-model="create_customer.customer_email_id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    type="number"
                    label="Latitude *"
                    class="FontSize mx-1"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_customer.customer_latitude"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    type="number"
                    label="Longitude *"
                    class="FontSize mx-1"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_customer.customer_longitude"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize mx-2"
                    item-value="setting_id"
                    item-text="setting_name"
                    label="Customer Category"
                    :items="GetAllCustomerCategoryList"
                    v-model="create_customer.customer_category_id"
                  ></v-autocomplete>
                </v-col>
                <v-row no-gutters class="mx-2">
                  <v-col cols="12" md="12">
                    <div class="mb-2 font-weight-bold">
                      Primary Contact Number :
                    </div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      item-text="name"
                      class="FontSize"
                      :items="CountryList"
                      label="Country Code *"
                      item-value="dial_code"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="create_customer.customer_primary_country_code"
                    >
                      <template slot="selection" slot-scope="{ item }">
                        {{ item.dial_code }}
                      </template>
                      <template slot="item" slot-scope="{ item }">
                        {{ item.name }}({{ item.dial_code }})
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="8">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize ml-2"
                      label="Contact Number *"
                      v-model="create_customer.customer_primary_contact_number"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(
                            v
                          ) || 'Invalid',
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mx-2">
                  <v-col cols="12" md="12">
                    <div class="mb-2 font-weight-bold">
                      Secondary Contact Number :
                    </div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      item-text="name"
                      class="FontSize"
                      :items="CountryList"
                      label="Country Code"
                      item-value="dial_code"
                      v-model="create_customer.customer_secondary_country_code"
                    >
                      <template slot="selection" slot-scope="{ item }">
                        {{ item.dial_code }}
                      </template>
                      <template slot="item" slot-scope="{ item }">
                        {{ item.name }}({{ item.dial_code }})
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="8">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize ml-2"
                      label="Contact Number"
                      v-model="
                        create_customer.customer_secondary_contact_number
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-col cols="12" md="12" class="mx-2 mb-2">
                  <b>Shipping Address :</b>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mx-2"
                    label="Customer Address *"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="create_customer.customer_address"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="City"
                    class="FontSize mx-2"
                    v-model="create_customer.city"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="State"
                    class="FontSize mx-2"
                    v-model="create_customer.state"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    label="Pincode"
                    class="FontSize mx-2"
                    v-model="create_customer.customer_pincode"
                  ></v-text-field>
                </v-col>
                <b class="ml-2 mb-2">Billing Address:</b>
                <v-checkbox
                  dense
                  class="ml-2 mt-n1"
                  label="Same as Shipping Address"
                  v-model="same_as_billing_address"
                  v-if="this.StoreObj.action == 'CREATE'"
                ></v-checkbox>
                <v-col cols="12" xs="12" sm="12" md="12">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mx-2"
                    label="Billing Address"
                    v-model="create_customer.customer_billing_address"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="City"
                    class="FontSize mx-2"
                    v-model="create_customer.customer_billing_city"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    label="State"
                    class="FontSize mx-2"
                    v-model="create_customer.customer_billing_state"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4">
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    label="Pincode"
                    class="FontSize mx-2"
                    :rules="pincodeRulesForBillingPincode"
                    v-model="create_customer.customer_billing_pincode"
                  ></v-text-field>
                </v-col>
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="12">
                    <v-autocomplete
                      dense
                      outlined
                      multiple
                      class="FontSize mx-2"
                      label="Tag Territories"
                      item-value="territory_id"
                      item-text="territory_name"
                      :items="GetAllTerritoriesList"
                      v-model="create_customer.nonGeoBasedterritory"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip x-small v-if="index === 0">
                          <span>{{ item.territory_name }}</span>
                        </v-chip>
                        <span
                          v-if="
                            index === 0 &&
                            create_customer.nonGeoBasedterritory.length > 1
                          "
                          class="grey--text text-caption"
                        >
                          (+{{
                            create_customer.nonGeoBasedterritory.length - 1
                          }}
                          others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <!-- <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="5"
                    v-if="create_customer.customer_type == 'BUSINESS'"
                  >
                    <v-checkbox
                      dense
                      class="mx-3"
                      label="Enable Multiple Location"
                      v-model="create_customer.enable_multiple_location"
                    ></v-checkbox>
                  </v-col> -->
                </v-row>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-file-input
                    outlined
                    multiple
                    v-model="files"
                    class="FontSize ml-2"
                    :prepend-icon="null"
                  >
                    <template v-slot:label>
                      <div class="mt-n1">File Input</div>
                    </template></v-file-input
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-checkbox
                    class="mt-n2"
                    label="Enable Ticket Auto Assign"
                    v-model="create_customer.enable_auto_assign"
                  ></v-checkbox>
                </v-col>
                <div v-if="this.create_customer.enable_auto_assign == true">
                  <div class="mb-2 ml-2 font-weight-bold">
                    Select Technician :
                  </div>
                  <v-row>
                    <v-col cols="12" xs="12" sm="12" md="4">
                      <v-autocomplete
                        dense
                        outlined
                        label="User Type"
                        class="FontSize ml-2"
                        :items="UserTypeItems"
                        v-model="create_customer.user_type"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="4">
                      <v-autocomplete
                        dense
                        outlined
                        class="FontSize"
                        item-value="user_id"
                        item-text="user_name"
                        label="Primary Technician"
                        :rules="[(v) => !!v || 'Required']"
                        :items="GetAllUsrTypeLocationBasedUsers"
                        v-model="create_customer.assignee_user_id"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12" md="4">
                      <v-autocomplete
                        dense
                        outlined
                        class="FontSize"
                        item-value="user_id"
                        item-text="user_name"
                        label="Secondary Technician"
                        :items="secondaryRepresentativeItem"
                        v-model="create_customer.secondary_technician_id"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
              </v-row>
            </v-form>
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
                    @click="visitDateDialogMethod()"
                    ><v-icon small class="mr-1"
                      >mdi-calendar-question-outline</v-icon
                    >Visits ({{ rft_date_list.length }})</v-btn
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
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn
          small
          color="primary"
          :loading="loading"
          class="mt-3 mr-2 mb-4"
          @click="validateMethod()"
        >
          Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import CountryList from "@/JsonFiles/CountryList.json";
import Overlay from "@/components/Extras/OverlayView.vue";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddExtendedWarranty from "@/components/Product/Dialogs/AddExtendedWarranty.vue";
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
import UpdateDateOnRFTDateList from "@/components/Product/Dialogs/ProductsFleet/UpdateDateOnRFTDateList.vue";
import ConfirmCreationOfSecondaryCustomer from "@/components/Customers/Dialogs/ConfirmCreationOfSecondaryCustomer.vue";
import AddMultipleLocationsDialogForCustomersTab from "@/components/Customers/Dialogs/AddMultipleLocationsDialogForCustomersTab.vue";
import {
  CreateBusinessOrIndividualCustomer,
  UpdateBusinessOrIndividualCustomer,
  DeleteInvalidCustomer,
} from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllCustomerCategory } from "@/mixins/MastersSetting/GetAllCustomerCategory.js";
import { GetAllProductFleetStatus } from "@/mixins/MastersSetting/GetAllProductFleetStatus.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { ListAllUserTypeLocationBasedUsers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsers.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
var aws = require("aws-sdk");
import { Buffer } from "buffer";
window.Buffer = Buffer;
const uuid = require("uuid");
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [
    GenerateS3URL,
    GetAllTerritories,
    GetServicesByCategory,
    GetAllCustomerCategory,
    GetAllProductFleetStatus,
    GetAllOrganizationSetting,
    ListAllUserTypeLocationBasedUsers,
    GetAllOrganizationSettingsTypesInMS,
  ],
  components: {
    Overlay,
    Snackbar,
    GoogleMaps,
    AddExtendedWarranty,
    ViewScheduleVisitDate,
    UpdateDateOnRFTDateList,
    ConfirmCreationOfSecondaryCustomer,
    AddMultipleLocationsDialogForCustomersTab,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    overlay: false,
    renderComp: true,
    manufacture_date: false,
    menu_invoice_date: false,
    menu_warranty_end_date: false,
    same_as_billing_address: true,
    menu_warranty_start_date: false,
    AddExtendedWarrantyDialog: false,
    product_purchased_on_dialog: false,
    DialogViewScheduleVisitDates: false,
    DialogUpdateDateOnRFTDateList: false,
    confirmCreateSecondaryCustomerDailog: false,
    files: [],
    s3_files: [],
    emailRules: [],
    CountryList: [],
    pincodeRules: [],
    rft_date_list: [],
    category_lists: [],
    selected_files: [],
    productFleetList: [],
    GetAllAMCTypeList: [],
    GetAllTerritoriesList: [],
    extended_warranty_details: [],
    GetAllCustomerCategoryList: [],
    GetServiceByCategoriesList: [],
    secondaryRepresentativeItem: [],
    GetAllProductFleetStatusList: [],
    pincodeRulesForBillingPincode: [],
    GetAllUsrTypeLocationBasedUsers: [],
    customer_type_items: ["INDIVIDUAL", "BUSINESS"],
    extendedSupportHeaders: [
      { text: "Support", value: "extended_ticket_warranty_type" },
      { text: "Support Type", value: "extended_warranty_type" },
      { text: "Starts", value: "extendedWarrantyStartDate" },
      { text: "Ends", value: "extendedWarrantyEndEate" },
      { text: "Frequency", value: "extendedWarrantyFrequency" },
      { text: "No. of Visits", value: "extendedWarrantyDatesList" },
      { text: "Delete", value: "Actions" },
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
    supportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    UserTypeItems: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
    productFleetHeaders: [
      { text: "Product", value: "category_name" },
      { text: "Description", value: "setting_description" },
      { text: "Invoice", value: "invoice_number" },
      { text: "Installation", value: "product_purchased_on" },
      { text: "Support", value: "warranty_start_date" },
      { text: "Frequency", value: "frequency" },
      { text: "Actions", value: "Actions" },
    ],
    StoreObjNew: {},
    StoreObjCustomer: [],
    SnackBarComponent: {},
    StoreObjExtendedWarranty: {},
    current_page: "CREATE_OR_EDIT",
    create_customer: {
      city: "",
      state: "",
      company_name: "",
      customer_type: "",
      customer_name: "",
      customer_address: "",
      customer_pincode: "",
      assignee_user_id: "",
      customer_website: "",
      customer_email_id: "",
      customer_latitude: "",
      customer_longitude: "",
      customer_unique_id: "",
      nonGeoBasedterritory: "",
      customer_category_id: "",
      customer_billing_city: "",
      customer_billing_state: "",
      secondary_technician_id: "",
      customer_billing_address: "",
      customer_billing_pincode: "",
      customer_primary_contact_number: "",
      customer_primary_country_code: "+91",
      customer_secondary_contact_number: "",
      customer_secondary_country_code: "+91",
      enable_auto_assign: false,
      enable_multiple_location: false,
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
    visitDateObj: {},
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
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    "create_customer.customer_pincode"(val) {
      if (val != undefined && val != null && val != "") {
        this.pincodeRules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 7) || "Invalid",
          (v) => (v && v.length > 5) || "Invalid",
        ];
      } else {
        this.pincodeRules = [];
      }
    },
    "create_customer.customer_billing_pincode"(val) {
      if (val != undefined && val != null && val != "") {
        this.pincodeRulesForBillingPincode = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 7) || "Invalid",
          (v) => (v && v.length > 5) || "Invalid",
        ];
      } else {
        this.pincodeRulesForBillingPincode = [];
      }
    },
    same_as_billing_address(val) {
      if (val == false) {
        this.create_customer.customer_billing_address = "";
        this.create_customer.customer_billing_city = "";
        this.create_customer.customer_billing_state = "";
        this.create_customer.customer_billing_pincode = "";
      } else {
        this.create_customer.customer_billing_address =
          this.create_customer.customer_address;
        this.create_customer.customer_billing_city = this.create_customer.city;
        this.create_customer.customer_billing_state =
          this.create_customer.state;
        this.create_customer.customer_billing_pincode =
          this.create_customer.customer_pincode;
      }
    },
    GetAllOrganizationSettingsTypesObject(val) {
      this.category_lists = val.categories_list;
    },
    "create_customer.user_type"(val) {
      this.GetAllUerTypeLocationBasedUsers(
        this.create_customer.customer_latitude,
        this.create_customer.customer_longitude,
        undefined,
        this.$store.getters.get_current_user_details.user_id,
        val,
        this.create_customer.nonGeoBasedterritory
      );
    },
    "create_customer.assignee_user_id"(val) {
      this.secondaryRepresentativeItem = [];
      this.GetAllUsrTypeLocationBasedUsers.map((item) => {
        if (item.user_id != val) {
          this.secondaryRepresentativeItem.push(item);
        }
      });
    },
    "create_customer.customer_email_id"(val) {
      if (val != "" && val != null) {
        this.emailRules = [(v) => /.+@.+/.test(v) || "Email Must Be Valid"];
      } else {
        this.emailRules = [];
      }
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
  },
  mounted() {
    if (this.StoreObj.action != "CREATE") {
      this.create_customer.customer_type = this.StoreObj.customer_type;
      this.create_customer.nonGeoBasedterritory =
        this.StoreObj.territory_ids != null &&
        this.StoreObj.territory_ids != undefined &&
        this.StoreObj.territory_ids.length != 0 &&
        this.StoreObj.territory_ids != []
          ? this.StoreObj.territory_ids
          : [];
      this.create_customer.customer_unique_id =
        this.StoreObj.customer_unique_id;
      // this.create_customer.enable_multiple_location =
      //   this.StoreObj.enable_multiple_location;
      this.create_customer.customer_name = this.StoreObj.customer_name;
      this.create_customer.customer_email_id = this.StoreObj.customer_email_id;
      this.create_customer.company_name = this.StoreObj.customer_company_name;
      this.create_customer.customer_latitude = this.StoreObj.customer_latitude;
      this.create_customer.customer_longitude =
        this.StoreObj.customer_longitude;
      this.create_customer.customer_address = this.StoreObj.customer_address;
      this.create_customer.city = this.StoreObj.city;
      this.create_customer.state = this.StoreObj.state;
      this.create_customer.customer_pincode = this.StoreObj.customer_pincode;
      this.create_customer.customer_billing_address =
        this.StoreObj.customer_billing_address;
      this.create_customer.customer_billing_city =
        this.StoreObj.customer_billing_city;
      this.create_customer.customer_billing_state =
        this.StoreObj.customer_billing_state;
      this.create_customer.customer_billing_pincode =
        this.StoreObjcustomer_billing_pincode;
      this.create_customer.customer_primary_country_code =
        this.StoreObj.action == "CREATE"
          ? this.StoreObj.customer_primary_country_code
          : this.StoreObj.action == "UPDATE_INVALID_CUSTOMER"
          ? "+" + this.StoreObj.customer_primary_country_code
          : "+91";
      this.create_customer.customer_primary_contact_number =
        this.StoreObj.customer_primary_contact_number;

      this.create_customer.customer_secondary_country_code = "+91";
      this.create_customer.customer_secondary_contact_number =
        this.StoreObj.customer_secondary_contact_number;
      this.create_customer.customer_website = this.StoreObj.customer_website;
      this.create_customer.customer_category_id =
        this.StoreObj.customer_category_id;
      this.create_customer.customer_company_name =
        this.StoreObj.customer_company_name;
      this.s3_files =
        this.StoreObj.customer_file_attachment != null &&
        this.StoreObj.customer_file_attachment != undefined &&
        this.StoreObj.customer_file_attachment.length != 0
          ? this.StoreObj.customer_file_attachment
          : [];
      this.create_customer.enable_auto_assign =
        this.StoreObj.enable_auto_assign;
      if (this.StoreObj.enable_auto_assign) {
        this.GetAllUerTypeLocationBasedUsers(
          this.create_customer.customer_latitude,
          this.create_customer.customer_longitude,
          undefined,
          this.$store.getters.get_current_user_details.user_id,
          "ENTERPRISE_REPRESENTATIVE",
          this.create_customer.nonGeoBasedterritory
        );
        setTimeout(() => {
          this.create_customer.assignee_user_id =
            this.StoreObj.primary_representative_details != undefined
              ? this.StoreObj.primary_representative_details.user_id
              : undefined;
          if (
            this.GetAllUsrTypeLocationBasedUsers != undefined &&
            this.GetAllUsrTypeLocationBasedUsers.length != 0
          ) {
            this.secondaryRepresentativeItem = [];
            this.GetAllUsrTypeLocationBasedUsers.map((item) => {
              if (item.user_id != this.create_customer.assignee_user_id) {
                this.secondaryRepresentativeItem.push(item);
              }
            });
          }
        }, 1000);
        setTimeout(() => {
          this.create_customer.secondary_technician_id =
            this.StoreObj.secondary_representative_details != undefined
              ? this.StoreObj.secondary_representative_details.user_id
              : "";
        }, 2000);
      }
      if (this.StoreObj.primary_representative_details != undefined) {
        if (
          this.StoreObj.primary_representative_details.user_type != undefined
        ) {
          if (
            this.StoreObj.primary_representative_details.user_type ==
            "REPRESENTATIVE"
          ) {
            this.create_customer.user_type = "ENTERPRISE_REPRESENTATIVE";
          } else {
            this.create_customer.user_type =
              this.StoreObj.primary_representative_details.user_type;
          }
        }
      }
    }
    this.CountryList = CountryList;
    this.GetAllCustomerCategoryMethod("ACTIVE");
    this.GetAllOrganizationSettingsTypesMethod();
    this.GetAllProductFleetStatusMethod("ACTIVE");
    this.GetAllTerritoriesMethod(
      "ACTIVE",
      "NON_GEO_BASED",
      undefined,
      "TERRITORY",
      undefined
    );
    if (this.StoreObj.action == "CREATE") {
      if (this.StoreObj.call_rfs_data) {
        console.log("comming inside yes");
        this.create_customer.customer_primary_contact_number =
          this.StoreObj.call_rfs_data.customer_contact_number;
      }
      setTimeout(() => {
        this.create_customer.customer_type =
          this.GetAllOrganizationSettingsTypesObject.default_customer_type;
      }, 500);
    }
  },
  methods: {
    visitDateDialogMethod() {
      const modifiedDateList = this.rft_date_list.map(
        (item) => item.rft_date / 1000
      );
      console.log("CHECK_VOIST", modifiedDateList);
      this.visitDateObj.rft_date_list = modifiedDateList;
      // console.log("CHECK_VOIST", this.visitDateObj);
      this.DialogUpdateDateOnRFTDateList = true;
    },
    previewImg(item) {
      window.open(item.file_url);
    },
    confirmCreateSecondaryCustomerDailogEmit(Toggle, StoreObjCustomer) {
      this.confirmCreateSecondaryCustomerDailog = false;
      if (Toggle == 2) {
        this.StoreObjCustomer.productFleetList = this.productFleetList;
        this.StoreObjCustomer.customer_id = this.StoreObjCustomer.customer_id;
        this.StoreObjCustomer.customer_billing_address =
          this.create_customer.customer_billing_address;
        this.StoreObjCustomer.customer_company_name =
          this.create_customer.company_name;
        this.StoreObjCustomer.customer_name =
          this.create_customer.customer_name;
        this.StoreObjCustomer.customer_unique_id =
          this.create_customer.customer_unique_id;
        this.StoreObjCustomer.customer_primary_country_code =
          this.create_customer.customer_primary_country_code;
        this.StoreObjCustomer.customer_primary_contact_number =
          this.create_customer.customer_primary_contact_number;
        this.StoreObjCustomer.customer_secondary_country_code =
          this.create_customer.customer_secondary_country_code;
        this.StoreObjCustomer.customer_secondary_contact_number =
          this.create_customer.customer_secondary_contact_number;
        this.StoreObjCustomer.customer_email_id =
          this.create_customer.customer_email_id;
        this.StoreObjCustomer.customer_website =
          this.create_customer.customer_website;
        this.StoreObjCustomer.customer_category_id =
          this.create_customer.customer_category_id;
        this.StoreObjCustomer.customer_address =
          this.create_customer.customer_address;
        this.StoreObjCustomer.customer_state = this.create_customer.state;
        this.StoreObjCustomer.customer_city = this.create_customer.city;
        this.StoreObjCustomer.customer_pincode =
          this.create_customer.customer_pincode;
        this.StoreObjCustomer.customer_latitude =
          this.create_customer.customer_latitude;
        this.StoreObjCustomer.customer_longitude =
          this.create_customer.customer_longitude;
        this.StoreObjCustomer.customer_billing_city =
          this.create_customer.customer_billing_city;
        this.StoreObjCustomer.customer_billing_state =
          this.create_customer.customer_billing_state;
        this.StoreObjCustomer.customer_billing_pincode =
          this.create_customer.customer_billing_pincode;
        this.StoreObjCustomer.territory_ids =
          this.create_customer.nonGeoBasedterritory;
        this.StoreObjCustomer.secondary_customers =
          this.StoreObjCustomer.secondary_customers;
        this.current_page = "ADD_SECONDARY_LOCATION";
      }
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
          if (this.StoreObj.action == "CREATE") {
            this.createCustomerMethod();
          } else {
            this.updateCustomerMethod();
          }
        }
      }
    },
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
    async createCustomerMethod(s3URL) {
      try {
        // this.productFleetList.map((item) => {
        //   delete item.category_name;
        //   delete item.service_name;
        //   delete item.product_name;
        //   this.$forceUpdate();
        // });
        var inputParams = {
          customer_type: this.create_customer.customer_type,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          customer_name: this.create_customer.customer_name,
          customer_latitude: this.create_customer.customer_latitude,
          customer_longitude: this.create_customer.customer_longitude,
          customer_address: this.create_customer.customer_address,
          customer_primary_country_code:
            this.create_customer.customer_primary_country_code,
          customer_primary_contact_number:
            this.create_customer.customer_primary_contact_number,
          // enable_multiple_location:
          //   this.create_customer.enable_multiple_location,
          enable_auto_assign: this.create_customer.enable_auto_assign,
          is_call_initiated_customer:
            this.StoreObj.call_rfs_data?.is_call_initiated_customer === true
              ? true
              : undefined,
          rfs_id:
            this.StoreObj.call_rfs_data?.is_call_initiated_customer === true
              ? this.StoreObj.call_rfs_data.rfs_id
              : undefined,
        };
        if (
          this.create_customer.nonGeoBasedterritory != "" &&
          this.create_customer.nonGeoBasedterritory.length != 0 &&
          this.create_customer.nonGeoBasedterritory != [] &&
          this.create_customer.nonGeoBasedterritory != null
        ) {
          inputParams.territory_ids = this.create_customer.nonGeoBasedterritory;
        }
        if (
          this.productFleetList != undefined &&
          this.productFleetList.length != 0 &&
          this.productFleetList != [] &&
          this.productFleetList != null
        ) {
          // inputParams.tagged_serial_numbers = this.productFleetList.map(
          //   (item) => {
          //     delete item.category_name;
          //     delete item.service_name;
          //     delete item.product_name;
          //     this.$forceUpdate();
          //   }
          // );
          inputParams.tagged_serial_numbers = this.productFleetList.map(
            (item) => {
              const { category_name, service_name, product_name, ...rest } =
                item;
              return rest;
            }
          );
        }
        if (this.create_customer.customer_type == "BUSINESS") {
          inputParams.location_type = "PRIMARY";
        }
        if (this.create_customer.enable_auto_assign == true) {
          inputParams.assignee_user_id = this.create_customer.assignee_user_id;
        }
        if (this.s3_files.length != 0) {
          inputParams.customer_file_attachment = this.s3_files;
        }
        if (
          this.create_customer.city != undefined &&
          this.create_customer.city != null &&
          this.create_customer.city != ""
        ) {
          inputParams.city = this.create_customer.city;
        }
        if (
          this.create_customer.state != undefined &&
          this.create_customer.state != null &&
          this.create_customer.state != ""
        ) {
          inputParams.state = this.create_customer.state;
        }
        if (
          this.create_customer.customer_pincode != undefined &&
          this.create_customer.customer_pincode != null &&
          this.create_customer.customer_pincode != ""
        ) {
          inputParams.customer_pincode = this.create_customer.customer_pincode;
        }
        if (
          this.create_customer.customer_secondary_contact_number != undefined &&
          this.create_customer.customer_secondary_contact_number != null &&
          this.create_customer.customer_secondary_contact_number != ""
        ) {
          inputParams.customer_secondary_contact_number =
            this.create_customer.customer_secondary_contact_number;
        }
        if (
          this.create_customer.customer_secondary_country_code != undefined &&
          this.create_customer.customer_secondary_country_code != null &&
          this.create_customer.customer_secondary_country_code != ""
        ) {
          inputParams.customer_secondary_country_code =
            this.create_customer.customer_secondary_country_code;
        }
        if (this.create_customer.enable_auto_assign == true) {
          if (
            this.create_customer.secondary_technician_id != undefined &&
            this.create_customer.secondary_technician_id != null &&
            this.create_customer.secondary_technician_id != ""
          ) {
            inputParams.secondary_technician_id =
              this.create_customer.secondary_technician_id;
          }
        }
        if (
          this.create_customer.company_name != "" &&
          this.create_customer.company_name != null &&
          this.create_customer.company_name != undefined
        ) {
          inputParams.customer_company_name = this.create_customer.company_name;
        }
        if (
          this.create_customer.customer_unique_id != "" &&
          this.create_customer.customer_unique_id != null &&
          this.create_customer.customer_unique_id != undefined
        ) {
          inputParams.customer_unique_id =
            this.create_customer.customer_unique_id;
        }
        if (
          this.create_customer.customer_email_id != "" &&
          this.create_customer.customer_email_id != null &&
          this.create_customer.customer_email_id != undefined
        ) {
          inputParams.customer_email_id =
            this.create_customer.customer_email_id;
        }
        if (
          this.create_customer.customer_website != "" &&
          this.create_customer.customer_website != null &&
          this.create_customer.customer_website != undefined
        ) {
          inputParams.customer_website = this.create_customer.customer_website;
        }
        if (
          this.create_customer.customer_category_id != "" &&
          this.create_customer.customer_category_id != null &&
          this.create_customer.customer_category_id != undefined
        ) {
          inputParams.customer_category_id =
            this.create_customer.customer_category_id;
        }
        if (
          this.create_customer.customer_billing_address != "" &&
          this.create_customer.customer_billing_address != null &&
          this.create_customer.customer_billing_address != undefined
        ) {
          inputParams.customer_billing_address =
            this.create_customer.customer_billing_address;
        }
        if (
          this.create_customer.customer_billing_city != "" &&
          this.create_customer.customer_billing_city != null &&
          this.create_customer.customer_billing_city != undefined
        ) {
          inputParams.customer_billing_city =
            this.create_customer.customer_billing_city;
        }
        if (
          this.create_customer.customer_billing_state != "" &&
          this.create_customer.customer_billing_state != null &&
          this.create_customer.customer_billing_state != undefined
        ) {
          inputParams.customer_billing_state =
            this.create_customer.customer_billing_state;
        }
        if (
          this.create_customer.customer_billing_pincode != undefined &&
          this.create_customer.customer_billing_pincode != null &&
          this.create_customer.customer_billing_pincode != ""
        ) {
          inputParams.customer_billing_pincode =
            this.create_customer.customer_billing_pincode;
        }
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(CreateBusinessOrIndividualCustomer, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.CreateBusinessOrIndividualCustomer
        );
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.selected_files = [];
          this.s3_files = [];
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
            this.renderComp = true;
          });
          if (
            this.StoreObj.action == "CREATE" ||
            this.StoreObj.action == "UPDATE_INVALID_CUSTOMER"
          ) {
            this.CreateCustomerCardEmit(
              (this.Toggle = 2),
              ResultObject.status_message
            );
          }
          this.CreateCustomerCardEmit(1);
        } else if (ResultObject.status == "CUSTOMER_ALREADY_EXISTS") {
          this.StoreObjCustomer.secondary_customers =
            ResultObject.Data[0].secondary_customers;
          this.StoreObjCustomer.customer_id = ResultObject.Data[0].customer_id;
          this.confirmCreateSecondaryCustomerDailog = true;
        }
        if (this.StoreObj.action == "UPDATE_INVALID_CUSTOMER") {
          this.deleteCustomer();
          this.CreateCustomerCardEmit(1);
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
    async deleteCustomer() {
      if (this.StoreObj.invalid_reason) {
        try {
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            customer_id: this.StoreObj.customer_id,
          };
          let result = await API.graphql(
            graphqlOperation(DeleteInvalidCustomer, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.DeleteInvalidCustomer);
          if (ResultObject.status == "SUCCESS") {
            console.log("Invalid customer deleted Successfully");
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: "Invalid customer deleted Successfully",
              };
              this.renderComp = true;
            });
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
      }
    },
    async updateCustomerMethod(s3URL) {
      console.log("TERRITORY_IDS", this.create_customer.nonGeoBasedterritory);
      try {
        this.productFleetList.map((item) => {
          delete item.category_name;
          delete item.service_name;
          delete item.product_name;
          this.$forceUpdate();
        });
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          customer_id: this.StoreObj.customer_id,
          customer_address: this.create_customer.customer_address,
          customer_type: this.create_customer.customer_type,
          customer_name: this.create_customer.customer_name,
          customer_primary_country_code:
            this.create_customer.customer_primary_country_code,
          customer_primary_contact_number:
            this.create_customer.customer_primary_contact_number,
          // enable_multiple_location:
          //   this.create_customer.enable_multiple_location,
          customer_latitude: this.create_customer.customer_latitude,
          customer_longitude: this.create_customer.customer_longitude,
          enable_auto_assign: this.create_customer.enable_auto_assign,
        };
        if (
          this.create_customer.nonGeoBasedterritory != "" &&
          this.create_customer.nonGeoBasedterritory.length != 0 &&
          this.create_customer.nonGeoBasedterritory != [] &&
          this.create_customer.nonGeoBasedterritory != null
        ) {
          if (Array.isArray(this.create_customer.nonGeoBasedterritory[0])) {
            inputParams.territory_ids =
              this.create_customer.nonGeoBasedterritory[0];
          } else {
            inputParams.territory_ids =
              this.create_customer.nonGeoBasedterritory;
          }
          // inputParams.territory_ids = this.create_customer.nonGeoBasedterritory;
        }
        if (
          this.productFleetList != undefined &&
          this.productFleetList.length != 0 &&
          this.productFleetList != []
        ) {
          inputParams.tagged_serial_numbers = this.productFleetList;
        }
        if (this.create_customer.customer_type == "BUSINESS") {
          if (
            this.create_customer.company_name != "" &&
            this.create_customer.company_name != null &&
            this.create_customer.company_name != undefined
          ) {
            inputParams.customer_company_name =
              this.create_customer.company_name;
          }
        }
        if (this.s3_files.length != 0) {
          inputParams.customer_file_attachment = this.s3_files;
        }
        if (
          this.create_customer.city != undefined &&
          this.create_customer.city != null &&
          this.create_customer.city != ""
        ) {
          inputParams.city = this.create_customer.city;
        }
        if (
          this.create_customer.state != undefined &&
          this.create_customer.state != null &&
          this.create_customer.state != ""
        ) {
          inputParams.state = this.create_customer.state;
        }
        if (
          this.create_customer.customer_pincode != undefined &&
          this.create_customer.customer_pincode != null &&
          this.create_customer.customer_pincode != ""
        ) {
          inputParams.customer_pincode = this.create_customer.customer_pincode;
        }
        if (this.create_customer.enable_auto_assign == true) {
          if (
            this.create_customer.assignee_user_id != undefined &&
            this.create_customer.assignee_user_id != null &&
            this.create_customer.assignee_user_id != undefined
          ) {
            inputParams.assignee_user_id =
              this.create_customer.assignee_user_id;
          }
        }
        if (this.create_customer.enable_auto_assign == true) {
          if (
            this.create_customer.secondary_technician_id != undefined &&
            this.create_customer.secondary_technician_id != null &&
            this.create_customer.secondary_technician_id != ""
          ) {
            inputParams.secondary_technician_id =
              this.create_customer.secondary_technician_id;
          }
        }
        if (
          this.create_customer.customer_unique_id != "" &&
          this.create_customer.customer_unique_id != null &&
          this.create_customer.customer_unique_id != undefined
        ) {
          inputParams.customer_unique_id =
            this.create_customer.customer_unique_id;
        }
        if (
          this.create_customer.customer_email_id != "" &&
          this.create_customer.customer_email_id != null &&
          this.create_customer.customer_email_id != undefined
        ) {
          inputParams.customer_email_id =
            this.create_customer.customer_email_id;
        }
        if (
          this.create_customer.customer_secondary_contact_number != undefined &&
          this.create_customer.customer_secondary_contact_number != null &&
          this.create_customer.customer_secondary_contact_number != ""
        ) {
          inputParams.customer_secondary_contact_number =
            this.create_customer.customer_secondary_contact_number;
        }
        if (this.create_customer.customer_type == "BUSINESS") {
          if (
            this.create_customer.customer_website != "" &&
            this.create_customer.customer_website != null &&
            this.create_customer.customer_website != undefined
          ) {
            inputParams.customer_website =
              this.create_customer.customer_website;
          }
        }
        if (
          this.create_customer.customer_category_id != "" &&
          this.create_customer.customer_category_id != null &&
          this.create_customer.customer_category_id != undefined
        ) {
          inputParams.customer_category_id =
            this.create_customer.customer_category_id;
        }
        if (
          this.create_customer.customer_billing_address != "" &&
          this.create_customer.customer_billing_address != null &&
          this.create_customer.customer_billing_address != undefined
        ) {
          inputParams.customer_billing_address =
            this.create_customer.customer_billing_address;
        }
        if (
          this.create_customer.customer_billing_city != "" &&
          this.create_customer.customer_billing_city != null &&
          this.create_customer.customer_billing_city != undefined
        ) {
          inputParams.customer_billing_city =
            this.create_customer.customer_billing_city;
        }
        if (
          this.create_customer.customer_billing_state != "" &&
          this.create_customer.customer_billing_state != null &&
          this.create_customer.customer_billing_state != undefined
        ) {
          inputParams.customer_billing_state =
            this.create_customer.customer_billing_state;
        }
        if (
          this.create_customer.customer_billing_pincode != undefined &&
          this.create_customer.customer_billing_pincode != null &&
          this.create_customer.customer_billing_pincode != ""
        ) {
          inputParams.customer_billing_pincode =
            this.create_customer.customer_billing_pincode;
        }
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(UpdateBusinessOrIndividualCustomer, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.UpdateBusinessOrIndividualCustomer
        );
        if (ResultObject.status == "SUCCESS") {
          this.productFleetList = [];
          this.renderComp = false;
          this.selected_files = [];
          this.s3_files = [];
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
            this.renderComp = true;
            this.StoreObj;
          });
          if (this.StoreObj.action != "CREATE") {
            this.CreateCustomerCardEmit(
              (this.Toggle = 1),
              ResultObject.status_message
            );
          }
        }
        this.CreateCustomerCardEmit(1);
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
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (!this.StoreObj.invalid_reason) {
          if (this.StoreObj.action == "CREATE") {
            if (this.selected_files.length != 0) {
              this.count = 0;
              this.uploadMediaToS3();
            } else {
              this.createCustomerMethod(this.s3_files);
            }
          } else if (this.StoreObj.action != "CREATE") {
            if (this.selected_files.length != 0) {
              this.count = 0;
              this.uploadMediaToS3();
            } else {
              this.updateCustomerMethod(this.s3_files);
            }
          }
        } else {
          if (this.selected_files.length != 0) {
            this.count = 0;
            this.uploadMediaToS3();
          } else {
            this.createCustomerMethod(this.s3_files);
          }
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
        this.create_customer.customer_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode not found";
        this.create_customer.city = cityComponent
          ? cityComponent.long_name
          : "City not found";
        this.create_customer.state = stateComponent
          ? stateComponent.long_name
          : "State not found";
        this.same_as_billing_address == true
          ? (this.create_customer.customer_billing_city = cityComponent
              ? cityComponent.long_name
              : "City Not Found")
          : "";
        this.same_as_billing_address == true
          ? (this.create_customer.customer_billing_state = stateComponent
              ? stateComponent.long_name
              : "State Not Found")
          : "";
        this.same_as_billing_address == true
          ? (this.create_customer.customer_billing_pincode = pincodeComponent
              ? pincodeComponent.long_name
              : "Pincode Not Found")
          : "";
      }
      return {
        pincode: "Pincode not found",
        city: "City not found",
        state: "State not found",
      };
    },
    GoogleMapsEmit(place) {
      let lengthOfAddress = place.address_components.length;
      this.create_customer.customer_latitude = place.geometry.location.lat();
      this.create_customer.customer_longitude = place.geometry.location.lng();
      this.getPincode(
        this.create_customer.customer_latitude,
        this.create_customer.customer_longitude
      );
      this.create_customer.customer_address = place.formatted_address;
      if (this.same_as_billing_address == true) {
        this.create_customer.customer_billing_address = place.formatted_address;
      } else {
        this.create_customer.customer_billing_address = "";
      }
      if (place.plus_code != undefined) {
        const CityAndState = place.plus_code.compound_code.split(" ");
        CityAndState.shift();
        CityAndState.pop();
        CityAndState.join(" ");
        this.create_customer.city = CityAndState[0].replaceAll(",", "");
        if (this.same_as_billing_address == true) {
          this.create_customer.customer_billing_city =
            CityAndState[0].replaceAll(",", "");
        } else {
          this.create_customer.customer_billing_city = "";
        }
        if (CityAndState[2] != undefined) {
          this.create_customer.state =
            CityAndState[1].replaceAll(",", " ") +
            CityAndState[2].replaceAll(",", "");
          this.create_customer.customer_billing_state =
            CityAndState[1].replaceAll(",", " ") +
            CityAndState[2].replaceAll(",", "");
        } else {
          this.create_customer.state = CityAndState[1].replaceAll(",", "");
          this.create_customer.customer_billing_state =
            CityAndState[1].replaceAll(",", "");
        }
      } else {
        this.create_customer.state = "";
        this.create_customer.city = "";
      }
    },
    CreateCustomerCardEmit(Toggle, status_message) {
      this.s3_files = [];
      this.selected_files = [];
      if (this.StoreObj.call_rfs_data) {
        this.$router.push("/RequestForServices");
      } else {
        this.$emit("clicked", Toggle, status_message);
      }
    },
    addLocationEmit() {
      this.current_page = "CREATE_OR_EDIT";
    },
  },
};
</script>
