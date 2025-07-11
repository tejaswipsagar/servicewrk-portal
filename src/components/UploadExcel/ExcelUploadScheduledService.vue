<template>
  <v-dialog :value="UploadExcelDialog" persistent fullscreen>
    <v-toolbar dense dark class="gradient-bg2">
      <v-toolbar-title class="white--text mt-n3"
        >Upload Member Details</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn class="mt-n3" text dark @click="cleardata">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card class="elevation-0">
      <v-row class="mx-3">
        <v-col cols="12" md="2">
          <v-row no-gutters class="mt-2">
            <v-col cols="12">
              <v-select
                outlined
                label="Customer Name"
                class=""
                v-model="customer_company_name"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Contact Person *"
                class=""
                v-model="customer_name"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Customer Country Code *"
                v-model="customer_country_code"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Contact Number *"
                v-model="customer_phone_number"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Email id"
                v-model="customer_email_id"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Category Name *"
                class=""
                v-model="category_name"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Product Name *"
                class=""
                v-model="service_name"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Serial Number"
                v-model="service_serial_number"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Service Type"
                v-model="service_type_name"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Support"
                v-model="ticket_warranty_type"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Support Type"
                v-model="warranty_type"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Support Start Date"
                v-model="amc_start_date"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Support End Date"
                v-model="amc_end_date"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Frequency"
                v-model="ticket_frequency"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-select
                outlined
                label="Invoice Date"
                v-model="ticket_invoice_date"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Invoice Number"
                v-model="ticket_invoice_number"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Payment Received"
                v-model="payment_received"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Payment Method"
                v-model="payment_method"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Payment Details"
                v-model="payment_details"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Amount"
                v-model="payment_amount"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                outlined
                label="Payment Date"
                v-model="payment_date"
                :items="headerList"
                dense
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-spacer />
            <v-btn
              @click="ConstructTableMethod()"
              class="gradient-bg white--text"
              block
              dark
              tile
              >Preview</v-btn
            >
          </v-row>
        </v-col>
        <v-col cols="12" md="10">
          <v-card
            v-if="headerList.length != 0 && StoreTableData.length != 0"
            flat
          >
            <v-tabs v-model="model" centered slider-color="primary">
              <v-tab>Valid</v-tab>
              <v-tab>
                Invalid
                <v-badge color="red" :content="UploadList.invalid.length">
                </v-badge
              ></v-tab>
            </v-tabs>
            <v-tabs-items v-model="model">
              <v-tab-item>
                <v-card flat v-if="model == 0">
                  <v-data-table
                    :headers="ValidHeader"
                    :items="UploadList.valid"
                    dense
                  >
                    <template v-slot:[`no-data`]>
                      <v-alert class="gradient-bg2 white--text"
                        >No details are Valid. Click on Invalid to
                        proceed!</v-alert
                      >
                    </template>
                  </v-data-table>
                  <v-card-actions></v-card-actions>
                  <v-card-actions>
                    <v-row justify="center">
                      <v-btn
                        @click="updateMember"
                        v-if="UploadList.valid.length != 0"
                        :loading="isLoadingUpload"
                        class="gradient-bg white--text"
                        ><v-icon class="mr-2">mdi-plus</v-icon> Upload
                        Members</v-btn
                      >
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat v-if="model == 1">
                  <v-data-table
                    :headers="InValidHeader"
                    :items="UploadList.invalid"
                    dense
                  >
                    <template v-slot:[`no-data`]>
                      <v-alert class="gradient-bg2 white--text"
                        >No details are Invalid. Click on valid to
                        proceed!</v-alert
                      >
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-tooltip bottom color="primary">
                        <template v-slot:activator="{ on }">
                          <a @click="openreasondialog(item)">
                            <v-icon
                              small
                              v-on="on"
                              class="mr-2"
                              color="primary"
                            >
                              mdi-information
                            </v-icon>
                          </a>
                        </template>
                        <span class="white--text">View Reason</span>
                      </v-tooltip>
                      <v-tooltip bottom color="primary">
                        <template v-slot:activator="{ on }">
                          <a @click="editItem(item)">
                            <v-icon
                              small
                              v-on="on"
                              color="primary"
                              class="mr-2"
                            >
                              mdi-pencil
                            </v-icon>
                          </a>
                        </template>
                        <span class="white--text">Edit Member Details</span>
                      </v-tooltip>
                      <v-tooltip bottom color="primary">
                        <template v-slot:activator="{ on }">
                          <a @click="deleteitem(item)">
                            <v-icon
                              small
                              v-on="on"
                              color="primary"
                              class="mr-5"
                            >
                              mdi-delete
                            </v-icon>
                          </a>
                        </template>
                        <span class="white--text">Delete current record</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:top>
                      <v-spacer></v-spacer>
                      <v-dialog v-model="dialogEdited" max-width="600px">
                        <v-card flat>
                          <v-toolbar dense dark class="gradient-bg2">
                            <v-toolbar-items
                              ><v-card-title>
                                <span class="white--text titcss"
                                  >Edit Member</span
                                >
                              </v-card-title>
                            </v-toolbar-items>
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="white"
                              dark
                              @click="dialogEdited = false"
                            >
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-toolbar>
                          <v-form
                            ref="form"
                            v-model="valid"
                            :lazy-validation="lazy"
                          >
                            <v-card-text>
                              <!-- customer_name -->
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[customer_name]"
                                  color="primary"
                                  label="Contact Person"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[customer_company_name]"
                                  color="primary"
                                  label="Customer Name"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[category_name]"
                                  :rules="idrules"
                                  color="primary"
                                  label="Category Name *"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[service_name]"
                                  :rules="idrules"
                                  color="primary"
                                  label="Service Name"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[ticket_frequency]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Frequency"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[ticket_invoice_number]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Invoice Number"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[ticket_invoice_date]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Invoice Date"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  :disabled="Email == ''"
                                  v-model="editStoreObj[customer_email_id]"
                                  :rules="emailRules"
                                  color="primary"
                                  label="emailid"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-0 mt-n3">
                                <v-col cols="12" md="3">
                                  <v-select
                                    label="CountryCode"
                                    :rules="[
                                      (v) => !!v || 'Country Code is required',
                                    ]"
                                    v-model="
                                      editStoreObj[customer_country_code]
                                    "
                                    :items="CountryList"
                                    item-value="phonecode"
                                    item-text="name"
                                  >
                                    <template
                                      slot="selection"
                                      slot-scope="{ item }"
                                    >
                                      {{ item.flag }} ({{
                                        item.phonecode
                                          .toString()
                                          .includes("+") == false
                                          ? "+" + item.phonecode
                                          : item.phonecode
                                      }})
                                    </template>
                                    <template slot="item" slot-scope="{ item }">
                                      {{ item.flag }} {{ item.name }} ({{
                                        item.phonecode
                                      }})
                                    </template>
                                  </v-select>
                                </v-col>
                                <v-col cols="12" md="9">
                                  <v-text-field
                                    :rules="numberRules"
                                    v-model="
                                      editStoreObj[customer_phone_number]
                                    "
                                    color="primary"
                                    label="Contact Number"
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[service_type_name]"
                                  color="primary"
                                  label="Service Type"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[ticket_warranty_type]"
                                  color="primary"
                                  label="Support"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[warranty_type]"
                                  color="primary"
                                  label="Support"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[service_serial_number]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Serial Number"
                                ></v-text-field>
                              </v-row>

                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[payment_amount]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Amount"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[payment_date]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Payment Date"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[payment_details]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Payment Details"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[payment_method]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Payment Method"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[payment_received]"
                                  :rules="namerules"
                                  color="primary"
                                  label="Payment Received"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[amc_start_date]"
                                  :rules="namerules"
                                  color="primary"
                                  label="AMC Start Date"
                                ></v-text-field>
                              </v-row>
                              <v-row class="mx-3">
                                <v-text-field
                                  v-model="editStoreObj[amc_end_date]"
                                  :rules="namerules"
                                  color="primary"
                                  label="AMC End Date"
                                ></v-text-field>
                              </v-row>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                class="gradient-bg white--text mr-7 mb-8"
                                @click="ValidateAddDialog(editStoreObj)"
                                :loading="isLoadingEdit"
                                ><v-icon small class="mr-3"
                                  >mdi-content-save</v-icon
                                >
                                Save Details</v-btn
                              >
                            </v-card-actions>
                          </v-form>
                        </v-card>
                      </v-dialog>
                    </template>
                  </v-data-table>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
          <v-card v-else class="mt-10 elevation-10">
            <v-card-actions>
              <v-spacer />
              <v-card-actions class="mt-n10">
                <v-spacer />
              </v-card-actions>
            </v-card-actions>
            <v-card-text
              align="center"
              style="font-size: 20px"
              class="py-16 px-1"
              >Please Select The Respective Column Headers For
              <div class="ml-1 primary--text">respective data</div>
              From The Excel Sheet For Preview.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="routerView == true" />
  </v-dialog>
</template>
<script>
import { Country } from "country-state-city";
import { API, graphqlOperation } from "aws-amplify";
import { UploadScheduledServices } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  components: {
    Snackbar,
  },
  props: {
    EditUploadDialog: Boolean,
    UploadExcelDialog: Boolean,
  },
  data: () => ({
    model: 0,
    valid: true,
    lazy: false,
    Snackbar: false,
    routerView : true,
    reasonDialog: false,
    dialogEdited: false,
    isLoadingEdit: false,
    isLoadingUpload: false,
    color: "",
    EmpId: "",
    EmpName: "",
    ContNum: "",
    CountryCode: "",
    amc_end_date: "",
    SnackbarText: "",
    service_name: "",
    payment_date: "",
    category_name: "",
    warranty_type: "",
    customer_name: "",
    amc_start_date: "",
    frequency_type: "",
    payment_amount: "",
    payment_method: "",
    payment_details: "",
    ticket_frequency: "",
    payment_received: "",
    customer_email_id: "",
    service_type_name: "",
    ticket_invoice_date: "",
    ticket_warranty_type: "",
    service_serial_number: "",
    customer_country_code: "",
    customer_phone_number: "",
    customer_company_name: "",
    ticket_invoice_number: "",
    numberRegEx: "/^[0-9]+$/",
    dataList: [],
    swipelist: [],
    ValidData: [],
    ValidList: [],
    emailRules: [],
    headerList: [],
    UploadList: [],
    InvalidData: [],
    InvalidList: [],
    CountryList: [],
    ValidHeader: [],
    InValidHeader: [],
    invalidReasons: [],
    StoreTableData: [],
    StoreValidUserArray: [],
    ExcelList: ["EmployeeName", "EmployeeId", "CountryCode", "ContactNum"],
    namerules: [
      (x) =>
        /^[a-z\sA-Z]{3,30}$/.test(x) ||
        "Name must be between 3 & 30 characters and Should not contain special characters",
      (x) => x.length != 0 || "Member Name cannot be empty",
    ],
    idrules: [
      (v) => v.length != 0 || "Member Id cannot be empty",
      (v) =>
        /^[a-z\sA-Z0-9]{0,10}$/.test(v) ||
        "Member Id must be between 1 & 10 characters and Should not contain special characters",
    ],
    numberRules: [
      (v) => v.length != 0 || "Contact Number cannot be empty",
      (v) => /^[0-9]{8,12}$/.test(v) || "Contact Number must be valid",
    ],
    item: {},
    editStoreObj: {},
    ReasonsObject: {},
    SnackBarComponent: {},
    exceldata: { tabledata: null, tableheader: null },
    editedItem: {
      Name: "",
      Employee_ID: "",
      CountryCode: "",
      Contact_Number: "",
    },
  }),
  methods: {
    openreasondialog(item) {
      this.ReasonsObject = item;
      this.reasonDialog = true;
    },
    cleardata() {
      this.isLoadingUpload = false;
      this.category_name = "";
      this.customer_company_name = "";
      this.customer_name = "";
      this.amc_start_date = "";
      this.amc_end_date = "";
      this.service_name = "";
      this.headerList = "";
      this.StoreTableData = "";
      this.ticket_frequency = "";
      this.ticket_invoice_number = "";
      this.ticket_invoice_date = "";
      this.service_serial_number = "";
      this.service_type_name = "";
      this.ticket_warranty_type = "";
      this.warranty_type = "";
      this.customer_email_id = "";
      this.customer_country_code = "";
      this.customer_phone_number = "";
      this.frequency_type = "";
      this.payment_amount = "";
      this.payment_date = "";
      this.payment_details = "";
      this.payment_method = "";
      this.payment_received = "";
      this.$emit("close");
    },
    ValidateAddDialog(item) {
      if (this.Email != "") {
        this.emailRules = [
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ];
      } else if (this.Email == "") {
        this.emailRules = [];
      }
      if (this.$refs.form.validate()) {
        this.UploadList.valid.push(item);
        this.UploadList.invalid.splice(item, 1);
        this.dialogEdited = false;
      } else {
        this.routerView = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Enter Valid Inputs",
        };
        this.routerView = true;
        })
      }
    },
    deleteitem() {
      this.UploadList.invalid.splice(this.item, 1);
    },
    getexceldata(table) {
      // this.dialog = true;
      this.headerList = table.tableheader;
      this.dataList = table.tabledata;
    },
    ConstructTableMethod() {
      this.ValidHeader = [
        { text: "Customer", value: this.customer_company_name },
        { text: "Contact Person", value: this.customer_name },
        { text: "Country Code", value: this.customer_country_code },
        { text: "Contact Number", value: this.customer_phone_number },
        { text: "Email id", value: this.customer_email_id },
        { text: "Produt Name", value: this.service_name },
        { text: "Serial Number", value: this.service_serial_number },
        { text: "Service Type", value: this.service_type_name },
        { text: "Support", value: this.ticket_warranty_type },
        { text: "warranty_type", value: this.warranty_type },
        { text: "Support Start Date", value: this.amc_start_date },
        { text: "Support End Date", value: this.amc_end_date },
        { text: "Frequency", value: this.ticket_frequency },
        { text: "Invoice Number", value: this.ticket_invoice_number },
        { text: "Invoice Date", value: this.ticket_invoice_date },
        { text: "Payment Received", value: this.payment_received },
        { text: "Amount", value: this.payment_amount },
        { text: "Payment Date", value: this.payment_date },
        { text: "Payment Details", value: this.payment_details },
        { text: "Payment Method", value: this.payment_method },
      ];
      this.InValidHeader = [
        { text: "Customer", value: this.customer_company_name },
        { text: "Contact Person", value: this.customer_name },
        { text: "Country Code", value: this.customer_country_code },
        { text: "Contact Number", value: this.customer_phone_number },
        { text: "Email id", value: this.customer_email_id },
        { text: "Category Name", value: this.category_name },
        { text: "Product Name", value: this.service_name },
        { text: "Serial Number", value: this.service_serial_number },
        { text: "Service Type", value: this.service_type_name },
        { text: "Support", value: this.ticket_warranty_type },
        { text: "Support Type", value: this.warranty_type },
        { text: "Support Start Date", value: this.amc_start_date },
        { text: "Support End Date", value: this.amc_end_date },
        { text: "Invoice Number", value: this.ticket_invoice_number },
        { text: "Invoice Date", value: this.ticket_invoice_date },
        { text: "Frequency", value: this.ticket_frequency },
        { text: "Payment Received", value: this.payment_received },
        { text: "Amount", value: this.payment_amount },
        { text: "Payment Date", value: this.payment_date },
        { text: "Payment Details", value: this.payment_details },
        { text: "Payment Method", value: this.payment_method },
        {
          text: "Actions",
          value: "actions",
          width: "auto",
          sortable: false,
        },
      ];
      this.StoreTableData = this.dataList;
      this.filterUserTable();
    },
    filterUserTable() {
      var self = this;
      self.UploadList = {
        valid: [],
        invalid: [],
      };
      self.StoreTableData.forEach(function (cc) {
        for (let key in cc) {
          if (key == self.customer_country_code) {
            if (cc[key].toString().includes("+") == false) {
              cc[key] = "+" + cc[key];
            }
          }
        }
      });
      for (const item of this.StoreTableData) {
        let invalidReasons = [];
        if (invalidReasons.length > 0) {
          this.UploadList.invalid.push(item);
        } else {
          this.UploadList.valid.push(item);
        }
      }
    },
    updateuploaddetails() {
      this.UploadList.valid.push(this.item);
      this.UploadList.invalid.splice(this.item, 1);
      this.dialogEdited = false;
    },
    editItem(item) {
      this.CountryList = Country.getAllCountries();
      for (let i = 0; i < this.CountryList.length; i++) {
        this.CountryList[i].phonecode =
          this.CountryList[i].phonecode.includes("+") == false
            ? `+${this.CountryList[i].phonecode}`
            : this.CountryList[i].phonecode;
      }
      this.editStoreObj = item;
      this.dialogEdited = true;
    },
    async updateMember() {
      this.isLoadingUpload = true;
      let StoreValidUser = this.UploadList.valid;
      const self = this;
      const StoreValidUserArray = StoreValidUser.map((user) => {
        return {
          category_name: user[self.category_name],
          customer_company_name: user[self.customer_company_name],
          customer_name: user[self.customer_name],
          service_name: user[self.service_name],
          ticket_frequency: user[self.ticket_frequency],
          frequency_type: "DAYS",
          ticket_warranty_details: {
            ticket_invoice_number: user[self.ticket_invoice_number],
            ticket_invoice_date: user[self.ticket_invoice_date],
          },
          service_serial_number: user[self.service_serial_number],
          service_type_name: user[self.service_type_name],
          ticket_warranty_type: user[self.ticket_warranty_type],
          warranty_type: user[self.warranty_type],
          customer_email_id: user[self.customer_email_id],
          payment_date: user[self.payment_date],
          amc_start_date: user[self.amc_start_date],
          amc_end_date: user[self.amc_end_date],
          payment_received: user[self.payment_received],
          customer_country_code:
            user[self.customer_country_code] != undefined
              ? user[self.customer_country_code].toString()
              : "",
          customer_phone_number:
            user[self.customer_phone_number] != undefined
              ? user[self.customer_phone_number].toString()
              : "",
          frequency_type: user[self.frequency_type],
          payment_amount:
            user[self.payment_amount] != undefined
              ? user[self.payment_amount].toString()
              : "",
          payment_details: user[self.payment_details],
          payment_method: user[self.payment_method],
        };
      });
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          scheduled_services_list: StoreValidUserArray,
        };
        await API.graphql(
          graphqlOperation(UploadScheduledServices, {
            input: inputParams,
          })
        ).then((response) => {
          this.routerView = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: JSON.parse(response.data.UploadScheduledServices)
              .Status_Message,
          };
          this.routerView = true;
          })
          setTimeout(() => {
            this.closeEditUploadDialog();
          }, 1000);
        });
      } catch (e) {
        console.log(e);
        this.isLoadingUpload = false;
        this.routerView = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: JSON.parse(response.data.UploadScheduledServices)
              .Status_Message,
          };
          this.routerView = true;
          })
      }
    },
    closeEditUploadDialog() {
      this.isLoadingUpload = false;
      this.category_name = "";
      this.customer_company_name = "";
      this.customer_name = "";
      this.amc_start_date = "";
      this.amc_end_date = "";
      this.service_name = "";
      this.headerList = "";
      this.StoreTableData = "";
      this.ticket_frequency = "";
      this.ticket_invoice_number = "";
      this.ticket_invoice_date = "";
      this.service_serial_number = "";
      this.service_type_name = "";
      this.ticket_warranty_type = "";
      this.warranty_type = "";
      this.customer_email_id = "";
      this.customer_country_code = "";
      this.customer_phone_number = "";
      this.frequency_type = "";
      this.payment_amount = "";
      this.payment_date = "";
      this.payment_details = "";
      this.payment_method = "";
      this.payment_received = "";
      this.$emit("close");
    },
  },
};
</script>
