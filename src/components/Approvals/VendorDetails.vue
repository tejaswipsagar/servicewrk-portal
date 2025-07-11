<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="DialogVendorDetails" width="1000" persistent>
      <v-card>
        <v-toolbar dense dark color="primary">
          <div class="ml-2 white--text">Vendor Details</div>
          <v-spacer />
          <v-btn icon @click="handleClick()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-left">
              <span
                ><span class="black--text font-weight-bold fontsize16px"
                  >Category Name: </span
                ><strong>{{
                  ActionOObj.category_name ||
                  StoreObjOfCompDetails.category_name
                }}</strong></span
              >
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-center">
              <span
                ><span class="black--text font-weight-bold fontsize16px"
                  >Component Name:</span
                >
                <strong>{{
                  ActionOObj.component_names ||
                  ActionOObj.component_name ||
                  StoreObjOfCompDetails.component_name
                }}</strong>
              </span>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-right">
              <span
                ><span class="black--text font-weight-bold fontsize16px"
                  >Product Name:
                </span>
                <strong>{{
                  ActionOObj.service_name || StoreObjOfCompDetails.service_name
                }}</strong>
              </span>
            </v-col>
          </v-row>
          <div
            style="
              width: 100%;
              border: 1px dashed black;
              padding: 30px 0px 0px 0px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            class="mt-3 mb-5"
          >
            <div>
              <v-card-text>
                <v-form ref="form">
                  <v-row class="pa-0 mt-n8">
                    <!-- <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pa-2">
                  <v-text-field
                    dense
                    outlined
                    label="Component Name*"
                    class="FontSize mr-1"
                    v-model="component_name"
                    readonly
                    :rules="[(v) => !!v || 'Required']"
                  ></v-text-field>
                </v-col> -->
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="px-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor ID"
                        class="FontSize mr-1"
                        v-model="vendorEmpID"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Name"
                        class="FontSize mr-1"
                        v-model="vendor_name"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Contact Number"
                        class="FontSize mr-1"
                        v-model="vendor_contact_number"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Email"
                        class="FontSize mr-1"
                        v-model="vendorEmail"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        label="Price *"
                        class="FontSize mr-1"
                        v-model="price"
                        :rules="priceRules"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Quantity *"
                        class="FontSize mr-1"
                        v-model="purchased_count"
                        :readonly="work_flow_status != 'PENDING'"
                        :rules="[(v) => !!v || 'Required']"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="GST  %"
                        class="FontSize mr-1"
                        v-model="gst"
                        :readonly="work_flow_status != 'PENDING'"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Total Amount"
                        class="FontSize mr-1"
                        v-model="totalAmount"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Component Name"
                        class="FontSize mr-1"
                        v-model="vendorCompName"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Component Code"
                        class="FontSize mr-1"
                        v-model="vendorCompCode"
                        readonly
                      ></v-text-field
                    ></v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Serial Number"
                        class="FontSize mr-1"
                        v-model="vendorSerialNumber"
                        readonly
                      ></v-text-field
                    ></v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Discount  %"
                        class="FontSize mr-1"
                        v-model="discount"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    ></v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    ></v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    ></v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Final Amount"
                        class="FontSize mr-1"
                        v-model="finalAmount"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pa-2">
                  <v-text-field
                    dense
                    outlined
                    label="Comments"
                    v-model="vendor_comments"
                    class="FontSize mr-1"
                    :readonly="work_flow_status != 'PENDING'"
                  ></v-text-field>
                </v-col> -->
                  </v-row>
                </v-form>
              </v-card-text>
            </div>
          </div>
          <div
            v-if="
              tableView == 'TAGGED_TERRITORIES' &&
              ActionOObj.workflow_status != 'APPROVED' &&
              ActionOObj.workflow_status != 'IN_PROGRESS'
            "
          >
            <div class="mt-2">
              <span><strong>Vendor Details Table</strong></span>
            </div>

            <v-data-table
              :loading="tableLoading"
              style="cursor: pointer"
              :headers="headers"
              :items="vendorsList"
              @click:row="MoveItemToTextFieldMethod"
              :no-data-text="NoDataText"
              class="mt-3"
            >
              <template v-slot:[`item.vendor_name`]="{ item }">
                <div class="FontSize">
                  {{ item.vendor_name || "-" }}
                </div>
              </template>
              <template
                v-slot:[`item.vendor_primary_contact_number`]="{ item }"
              >
                <div class="FontSize">
                  {{ item.vendor_primary_contact_number || "-" }}
                </div>
              </template>
              <template v-slot:[`item.vendor_component_code`]="{ item }">
                <div class="FontSize">
                  {{ item.vendor_component_code || "-" }}
                </div>
              </template>
              <template v-slot:[`item.vendor_component_name`]="{ item }">
                <div class="FontSize">
                  {{ item.vendor_component_name || "-" }}
                </div>
              </template>
              <template v-slot:[`item.component_name`]="{ item }">
                <div class="FontSize">
                  {{ item.component_name || "-" }}
                </div>
              </template>
              <template v-slot:[`item.component_code`]="{ item }">
                <div class="FontSize">
                  {{ item.component_code || "-" }}
                </div>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                <div class="FontSize">
                  {{ item.price || "-" }}
                </div>
              </template>
              <template
                v-slot:[`item.vendor_component_serial_number`]="{ item }"
              >
                <div class="FontSize">
                  {{ item.vendor_component_serial_number || "-" }}
                </div>
              </template>
              <template v-slot:[`item.vendor_address`]="{ item }">
                <div class="FontSize">
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        {{ FormattedVendorAddressMethod(item.vendor_address) }}
                      </span>
                    </template>
                    <span>{{ item.vendor_address || "-" }}</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </div>
          <div
            v-if="
              tableView == 'TERRITORIES' &&
              ActionOObj.workflow_status != 'APPROVED' &&
              ActionOObj.workflow_status != 'IN_PROGRESS'
            "
          >
            <div class="mt-2">
              <span><strong>Select Territories</strong></span>
            </div>
            <v-row>
              <v-col cols="11" md="11" sm="11" xs="11">
                <div class="d-flex mr-2">
                  <v-select
                    dense
                    outlined
                    v-model="selectTerritories"
                    multiple
                    :items="territoryIDList"
                    item-text="territory_name"
                    item-value="territory_id"
                  ></v-select>
                </div>
              </v-col>
              <v-col cols="1" md="1" sm="1" xs="1">
                <div class="mr-4">
                  <v-btn
                    color="primary"
                    dense
                    class="FontClass"
                    @click="CallTerritoryApiMethod()"
                    ><v-icon small>mdi-magnify</v-icon></v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            :disabled="tableView != 'TAGGED_TERRITORIES'"
            v-if="work_flow_status == 'PENDING'"
            @click="localPurchaseVendorDetails()"
            class="primary white--text mb-4 mt-n4 mr-4"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { ListAllVendorDetails } from "@/mixins/Approvals/GetVendorDetails.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
import { ListTerritoriesAndPincodes } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    ActionOObj: Object,
    work_flow_status: String,
    DialogVendorDetails: Boolean,
    StoreObjOfCompDetails: Object,
  },
  components: {
    Snackbar,
  },
  mixins: [ListAllVendorDetails, GetTicketDetails],
  data: () => ({
    Toggle: 0,
    vendor_comments: "",
    vendor_name: "",
    component_name: "",
    vendor_address: "",
    purchased_count: "",
    vendor_contact_number: "",
    renderComp: true,
    SnackBarComponent: {},
    vendor_details: [],
    phone_number_rules: [],
    GetStoreNamesAndCompCountList: [],
    approve_service_center_details: [],
    gst: 0,
    totalAmount: 0,
    discount: 0,
    finalAmount: 0,
    price: "",
    NoDataText: "",
    vendorEmail: "",
    vendorID: "",
    tableView: "TAGGED_TERRITORIES",
    headers: [
      { text: "Vendor Name", value: "vendor_name" },
      { text: "Vendor Contact Number", value: "vendor_primary_contact_number" },
      // { text: "Category Name", value: "category_name" },
      // { text: "Product Name", value: "product_name" },
      // { text: "Organisation Component Name", value: "component_name" },
      // { text: "Organisation Component Code", value: "component_code" },
      { text: "Vendor Component Name", value: "vendor_component_name" },
      { text: "Vendor Component Code", value: "vendor_component_code" },
      { text: "Vendor Serial Number", value: "vendor_component_serial_number" },
      { text: "Cost", value: "price" },
      { text: "Vendor Address", value: "vendor_address" },
    ],
    vendorsList: [],
    priceRules: [
      (v) => !!v || "Required",
      (v) => /^\d*\.?\d*$/.test(v) || "Only numbers  are allowed.",
    ],
    componentName: "",
    vendorEmpID: "",
    vendorSerialNumber: "",
    vendorCompName: "",
    vendorCompCode: "",
    tableLoading: true,
  }),
  watch: {
    vendor_contact_number(val) {
      if (val != undefined && val != "") {
        this.phone_number_rules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 11) || "Invalid",
          (v) => (v && v.length > 9) || "Invalid",
        ];
      } else {
        this.phone_number_rules = [];
      }
    },
    async DialogVendorDetails(val) {
      if (val == true) {
        if (
          this.ActionOObj.workflow_status != "APPROVED" &&
          this.ActionOObj.workflow_status != "IN_PROGRESS"
        ) {
          console.log("STATUS_IS_PENDING", this.ActionOObj);
          // For second level
          if ("workflow_items" in this.ActionOObj) {
            if (
              "vendor_details" in
              this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
            ) {
              console.log("GET_ACTION", this.ActionOObj);
              this.vendorCompName =
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].component_name ||
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].vendor_component_name ||
                "";
              this.vendorCompCode =
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].vendor_component_code || "";
              this.vendorSerialNumber =
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].vendor_component_serial_number || "";
              this.vendorEmail =
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].vendor_email_id || "";
              this.vendorEmpID =
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].vendor_employee_id || "";
              this.vendor_name =
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].vendor_name || "";
              this.vendorID =
                this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
                  .vendor_details[0].vendor_id || "";
              console.log("DURING_DIALOG_OPEN", this.vendorCompName);
            }
          }
          // if (this.$refs.form) {
          //   this.$refs.form.reset();
          // }
          this.selectTerritories = "";
          let TicketTerritories = await this.TicketDetailsListMethod(
            this.ActionOObj.module_id != undefined
              ? this.ActionOObj.module_id
              : this.ActionOObj.ticket_module_id
          );

          if (
            TicketTerritories[0].ticket_territories == undefined ||
            TicketTerritories[0].ticket_territories.length == 0
          ) {
            try {
              const result = await API.graphql(
                graphqlOperation(ListTerritoriesAndPincodes, {
                  input: {
                    organization_id:
                      this.$store.getters.get_current_user_details
                        .organization_id,
                    territory_status: "ACTIVE",
                    territory_type: "NON_GEO_BASED",
                    required_type: "TERRITORY_BY_PINCODE",
                    territory_pincode: TicketTerritories[0].ticket_pincode,
                  },
                })
              );
              const response = JSON.parse(
                result.data.ListTerritoriesAndPincodes
              ).data.Items;

              this.tableView = "TERRITORIES";
              this.territoryIDList = response;
            } catch (error) {
              this.tableView = "TAGGED_TERRITORIES";
              console.log("Error", error);
            }
          } else {
            this.vendorsList = await this.ListAllVendorDetailsMethod(
              this.StoreObjOfCompDetails.category_id,
              this.StoreObjOfCompDetails.service_id,
              this.StoreObjOfCompDetails.component_id,
              this.StoreObjOfCompDetails.customer_pincode,
              TicketTerritories[0].ticket_territories
            );
          }
        }
        if (
          this.ActionOObj.workflow_status == "APPROVED" ||
          this.ActionOObj.workflow_status == "IN_PROGRESS"
        ) {
          console.log("STATUS_IS_APPROVED_OR_INPROGRESS");
          this.vendorCompName =
            this.StoreObjOfCompDetails.vendor_details[0].component_name ||
            undefined;
          this.vendorCompCode =
            this.StoreObjOfCompDetails.vendor_details[0]
              .vendor_component_code || undefined;
          this.vendorSerialNumber =
            this.StoreObjOfCompDetails.vendor_details[0]
              .vendor_component_serial_number || undefined;
          this.vendorEmail =
            this.StoreObjOfCompDetails.vendor_details[0].vendor_email_id || "";
          this.vendorEmpID =
            this.StoreObjOfCompDetails.vendor_details[0].vendor_employee_id ||
            "";
        }
        if (
          this.StoreObjOfCompDetails != undefined &&
          this.StoreObjOfCompDetails.vendor_details.length != 0
        ) {
          this.component_name = this.StoreObjOfCompDetails.component_name;
          this.purchased_count =
            this.StoreObjOfCompDetails.local_purchase_approve_count != undefined
              ? this.StoreObjOfCompDetails.local_purchase_approve_count
              : this.StoreObjOfCompDetails.vendor_details[0].purchased_count;
          this.vendor_contact_number =
            this.StoreObjOfCompDetails.vendor_contact_number != undefined
              ? this.StoreObjOfCompDetails.vendor_contact_number
              : this.StoreObjOfCompDetails.vendor_details[0]
                  .vendor_contact_number;
          this.vendor_address =
            this.StoreObjOfCompDetails.vendor_address != undefined
              ? this.StoreObjOfCompDetails.vendor_address
              : this.StoreObjOfCompDetails.vendor_details[0].vendor_address;
          this.vendor_name =
            this.StoreObjOfCompDetails.vendor_name != undefined
              ? this.StoreObjOfCompDetails.vendor_name
              : this.StoreObjOfCompDetails.vendor_details[0].vendor_name;
          this.vendor_comments =
            this.StoreObjOfCompDetails.vendor_details[0].comments;
          this.price =
            this.StoreObjOfCompDetails.vendor_details[0].per_component_price;
          this.purchased_count =
            this.StoreObjOfCompDetails.vendor_details[0].purchased_count;
          this.gst = this.StoreObjOfCompDetails.vendor_details[0].gst;
          this.discount =
            this.StoreObjOfCompDetails.vendor_details[0].discont_percentage;
          this.finalAmount =
            this.StoreObjOfCompDetails.vendor_details[0].total_price;
          this.totalAmount =
            this.StoreObjOfCompDetails.vendor_details[0].sub_total;
          this.vendorEmail =
            this.StoreObjOfCompDetails.vendor_details[0].vendor_email_id;
          this.vendorEmpID =
            this.StoreObjOfCompDetails.vendor_details[0].vendor_employee_id;
        }
      }
    },
    price(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.purchased_count !== null ||
            this.purchased_count !== undefined) &&
          (this.gst !== null || this.gst !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    purchased_count(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.gst !== null || this.gst !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    gst(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.purchased_count !== null || this.purchased_count !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    discount(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.gst !== null || this.gst !== undefined) &&
          (this.purchased_count !== null || this.purchased_count !== undefined)
        ) {
          this.DiscountCalculation();
        }
      }
    },
  },
  methods: {
    handleClick() {
      if (
        "workflow_items" in this.ActionOObj &&
        this.ActionOObj.workflow_items
      ) {
        if (
          "vendor_details" in
            this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index] &&
          this.ActionOObj.workflow_items[this.StoreObjOfCompDetails.index]
            .vendor_details
        ) {
          this.localPurchaseVendorDetails();
        } else {
          this.DialogVendorDetailsEmit(1);
        }
      } else {
        this.DialogVendorDetailsEmit(1);
      }
    },
    MoveItemToTextFieldMethod(item) {
      this.vendorEmpID = item.vendor_employee_id || "N/A";
      this.vendor_name = item.vendor_name || "";
      this.vendor_address = item.vendor_address || "";
      this.vendor_contact_number = item.vendor_primary_contact_number || "";
      this.price = item.price || 0;
      this.vendorEmail = item.vendor_email_id || "N/A";
      this.vendorID = item.vendor_id || "";
      this.component_name = item.component_name;
      this.vendorSerialNumber = item.vendor_component_serial_number || "N/A";
      this.vendorCompName = item.vendor_component_name || "N/A";
      this.vendorCompCode = item.vendor_component_code || "N/A";
    },
    FormattedVendorAddressMethod(item) {
      if (item) {
        return item.length > 99 ? item.slice(0, 99) : item;
      } else {
        return "-";
      }
    },
    GstCalculation() {
      this.totalAmount =
        this.price * this.purchased_count * (this.gst / 100) +
        this.price * this.purchased_count;
      this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
    },
    DiscountCalculation() {
      this.finalAmount =
        this.totalAmount - this.totalAmount * (this.discount / 100);
      this.finalAmount = parseFloat(this.finalAmount.toFixed(2));
    },

    async CallTerritoryApiMethod() {
      this.vendorsList = await this.ListAllVendorDetailsMethod(
        this.StoreObjOfCompDetails.category_id,
        this.StoreObjOfCompDetails.service_id,
        this.StoreObjOfCompDetails.component_id,
        this.StoreObjOfCompDetails.customer_pincode,
        this.selectTerritories
      );
      this.tableView = "TAGGED_TERRITORIES";
    },
    localPurchaseVendorDetails() {
      if (this.$refs.form.validate()) {
        this.vendor_details = [];

        let Obj = {
          vendor_component_name:
            this.vendorCompName === "N/A" ? undefined : this.vendorCompName,
          vendor_component_code:
            this.vendorCompCode === "N/A" ? undefined : this.vendorCompCode,
          purchased_count: parseInt(this.purchased_count),
          vendor_name:
            this.vendor_name != undefined &&
            this.vendor_name != null &&
            this.vendor_name != ""
              ? this.vendor_name
              : undefined,
          vendor_email_id: this.vendorEmail || undefined,
          vendor_address:
            this.vendor_address != undefined &&
            this.vendor_address != null &&
            this.vendor_address != ""
              ? this.vendor_address
              : undefined,
          vendor_contact_number:
            this.vendor_contact_number != undefined &&
            this.vendor_contact_number != null &&
            this.vendor_contact_number != ""
              ? this.vendor_contact_number
              : undefined,
          vendor_comments:
            this.vendor_comments != undefined &&
            this.vendor_comments != null &&
            this.vendor_comments != ""
              ? this.vendor_comments
              : undefined,
          per_component_price: this.price,
          vendor_id: this.vendorID,
          vendor_employee_id: this.vendorEmpID,
          sub_total: this.totalAmount,
          discont_percentage: parseFloat(this.discount),
          gst: this.gst,
          total_price: this.finalAmount,
          vendor_component_serial_number:
            this.vendorSerialNumber === "N/A"
              ? undefined
              : this.vendorSerialNumber,
        };
        this.vendor_details.push(Obj);
        this.StoreObjOfCompDetails.vendor_details = this.vendor_details;
        this.StoreObjOfCompDetails.vendor_name = this.vendor_name;
        this.StoreObjOfCompDetails.vendor_comments = this.vendor_comments;
        this.StoreObjOfCompDetails.vendor_contact_number =
          this.vendor_contact_number;
        this.StoreObjOfCompDetails.vendor_address = this.vendor_address;
        this.DialogVendorDetailsEmit(2, this.StoreObjOfCompDetails);
        console.log("VENDOR_ID", this.StoreObjOfCompDetails);
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },

    DialogVendorDetailsEmit(Toggle) {
      this.$emit("clicked", Toggle, this.StoreObjOfCompDetails);
      this.vendorsList = [];
      this.noDataText = "";
      this.$refs.form.reset();
      console.log("DURING_EMIT", this.vendorCompName);
    },
  },
};
</script>

<!-- <template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="DialogVendorDetails" width="1000" persistent>
      <v-card>
        <v-toolbar dense dark color="primary">
          <div class="ml-2 white--text">Vendor Details</div>
          <v-spacer />
          <v-btn icon @click="DialogVendorDetailsEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-left">
              <span
                ><span class="black--text font-weight-bold fontsize16px"
                  >Category Name: </span
                ><strong>{{ ActionOObj.category_name }}</strong></span
              >
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-center">
              <span
                ><span class="black--text font-weight-bold fontsize16px"
                  >Component Name:</span
                >
                <strong>{{ StoreObjOfCompDetails.component_name }}</strong>
              </span>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-right">
              <span
                ><span class="black--text font-weight-bold fontsize16px"
                  >Product Name:
                </span>
                <strong>{{ ActionOObj.service_name }}</strong>
              </span>
            </v-col>
          </v-row>
          <div
            style="
              width: 100%;
              border: 1px dashed black;
              padding: 30px 0px 0px 0px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            class="mt-3 mb-5"
          >
            <div>
              <v-card-text>
                <v-form ref="form">
                  <v-row class="pa-0 mt-n8">
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="px-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor ID"
                        class="FontSize mr-1"
                        v-model="vendorEmpID"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Name"
                        class="FontSize mr-1"
                        v-model="vendor_name"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Contact Number"
                        class="FontSize mr-1"
                        v-model="vendor_contact_number"
                        :rules="phone_number_rules"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Email"
                        class="FontSize mr-1"
                        v-model="vendorEmail"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        label="Price *"
                        class="FontSize mr-1"
                        v-model="price"
                        :rules="priceRules"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Quantity *"
                        class="FontSize mr-1"
                        v-model="purchased_count"
                        :readonly="work_flow_status != 'PENDING'"
                        :rules="[(v) => !!v || 'Required']"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="GST  %"
                        class="FontSize mr-1"
                        v-model="gst"
                        :readonly="work_flow_status != 'PENDING'"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Total Amount"
                        class="FontSize mr-1"
                        v-model="totalAmount"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pa-2"
                    ></v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pa-2"
                    ></v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Discount  %"
                        class="FontSize mr-1"
                        v-model="discount"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="mt-n5"
                    >
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Final Amount"
                        class="FontSize mr-1"
                        v-model="finalAmount"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </div>
          </div>
          <div v-if="tableView == 'TAGGED_TERRITORIES'">
            <div class="mt-2">
              <span><strong>Vendor Details Table</strong></span>
            </div>

            <v-data-table
              style="cursor: pointer"
              :headers="headers"
              :items="vendorsList"
              @click:row="MoveItemToTextFieldMethod"
              :no-data-text="NoDataText"
              class="mt-3"
            >
              <template v-slot:[`item.vendor_name`]="{ item }">
                <div class="FontSize">
                  {{ item.vendor_name }}
                </div>
              </template>
              <template
                v-slot:[`item.vendor_primary_contact_number`]="{ item }"
              >
                <div class="FontSize">
                  {{ item.vendor_primary_contact_number }}
                </div>
              </template>
              <template v-slot:[`item.category_name`]="{ item }">
                <div class="FontSize">
                  {{ item.category_name }}
                </div>
              </template>
              <template v-slot:[`item.product_name`]="{ item }">
                <div class="FontSize">
                  {{ item.product_name }}
                </div>
              </template>
              <template v-slot:[`item.component_name`]="{ item }">
                <div class="FontSize">
                  {{ item.component_name }}
                </div>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                <div class="FontSize">
                  {{ item.price }}
                </div>
              </template>
              <template v-slot:[`item.vendor_address`]="{ item }">
                <div class="FontSize">
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        {{ FormattedVendorAddressMethod(item.vendor_address) }}
                      </span>
                    </template>
                    <span>{{ item.vendor_address }}</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </div>
          <div v-if="tableView == 'TERRITORIES'">
            <div class="mt-2">
              <span><strong>Select Territories</strong></span>
            </div>
            <v-row>
              <v-col cols="11" md="11" sm="11" xs="11">
                <div class="d-flex mr-2">
                  <v-select
                    dense
                    outlined
                    v-model="selectTerritories"
                    multiple
                    :items="territoryIDList"
                    item-text="territory_name"
                    item-value="territory_id"
                  ></v-select>
                </div>
              </v-col>
              <v-col cols="1" md="1" sm="1" xs="1">
                <div class="mr-4">
                  <v-btn
                    color="primary"
                    dense
                    class="FontClass"
                    @click="CallTerritoryApiMethod()"
                    :loading="TerriLoading"
                    ><v-icon small>mdi-magnify</v-icon></v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </div>
          <div></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            :disabled="tableView != 'TAGGED_TERRITORIES'"
            v-if="work_flow_status == 'PENDING'"
            @click="localPurchaseVendorDetails()"
            class="primary white--text mb-4 mt-n4 mr-4"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { ListAllVendorDetails } from "@/mixins/Approvals/GetVendorDetails.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
import { ListTerritoriesAndPincodes } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  mixins: [ListAllVendorDetails, GetTicketDetails],
  props: {
    ActionOObj: Object,
    work_flow_status: String,
    DialogVendorDetails: Boolean,
    StoreObjOfCompDetails: Object,
    PreviousArray: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    vendor_comments: "",
    vendor_name: "",
    component_name: "",
    vendor_address: "",
    purchased_count: "",
    vendor_contact_number: "",
    renderComp: true,
    SnackBarComponent: {},
    vendor_details: [],
    phone_number_rules: [],
    GetStoreNamesAndCompCountList: [],
    approve_service_center_details: [],
    priceRules: [
      (v) => !!v || "Required",
      (v) => /^\d*\.?\d*$/.test(v) || "Only numbers  are allowed.",
    ],
    price: "",
    headers: [
      { text: "Vendor Name", value: "vendor_name" },
      { text: "Vendor Contact Number", value: "vendor_primary_contact_number" },
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Component Name", value: "component_name" },
      { text: "Price", value: "price" },
      { text: "Vendor Address", value: "vendor_address" },
    ],
    vendorsList: [],
    gst: 0,
    totalAmount: 0,
    discount: 0,
    finalAmount: 0,
    vendorEmail: "",
    vendorID: "",
    territoryIDList: [],
    selectTerritories: "",
    tableView: "TAGGED_TERRITORIES",
    NoDataText: "",
    TerriLoading: false,
  }),
  watch: {
    vendor_contact_number(val) {
      if (val != undefined && val != "") {
        this.phone_number_rules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 11) || "Invalid",
          (v) => (v && v.length > 9) || "Invalid",
        ];
      } else {
        this.phone_number_rules = [];
      }
    },
    async DialogVendorDetails(val) {
      if (val == true) {
        console.log("PYAAR uuuuuuuuuuuuuuu", this.StoreObjOfCompDetails);
        console.log("this.ActionOObj", this.ActionOObj);
        console.log("this.PreviousArray", this.PreviousArray);
        if (this.PreviousArray && Object.keys(this.PreviousArray).length != 0) {
          this.tableView = "TAGGED_TERRITORIES";
          this.selectTerritories = "";
        } else if (
          this.PreviousArray &&
          Object.keys(this.PreviousArray).length == 0
        ) {
          if (this.$refs.form) {
            this.$refs.form.reset();
          }
          this.selectTerritories = "";
          let TicketTerritories = await this.TicketDetailsListMethod(
            this.ActionOObj.module_id != undefined
              ? this.ActionOObj.module_id
              : this.ActionOObj.ticket_module_id
          );

          console.log("Niranjna", TicketTerritories[0].ticket_territories);

          if (
            TicketTerritories[0].ticket_territories == undefined ||
            TicketTerritories[0].ticket_territories.length == 0
          ) {
            try {
              console.log(
                "TicketTerritories[0].ticket_territories",
                TicketTerritories[0].ticket_territories
              );
              const result = await API.graphql(
                graphqlOperation(ListTerritoriesAndPincodes, {
                  input: {
                    organization_id:
                      this.$store.getters.get_current_user_details
                        .organization_id,
                    territory_status: "ACTIVE",
                    territory_type: "NON_GEO_BASED",
                    required_type: "TERRITORY",
                  },
                })
              );
              const response = JSON.parse(
                result.data.ListTerritoriesAndPincodes
              ).data.Items;
              console.log("responseresponse", response);
              this.tableView = "TERRITORIES";
              this.territoryIDList = response;
            } catch (error) {
              this.tableView = "TAGGED_TERRITORIES";
              console.log("Error", error);
            }
          } else {
            console.log(
              "TicketTerritories[0]TicketTerritories[0]",
              TicketTerritories
            );
            this.vendorsList = await this.ListAllVendorDetailsMethod(
              this.StoreObjOfCompDetails.category_id,
              this.StoreObjOfCompDetails.service_id,
              this.StoreObjOfCompDetails.component_id,
              this.StoreObjOfCompDetails.customer_pincode,
              TicketTerritories[0].ticket_territories
            );
          }
        }
        // this.vendorsList = await this.ListAllVendorDetailsMethod(
        //   this.StoreObjOfCompDetails.category_id,
        //   this.StoreObjOfCompDetails.service_id,
        //   this.StoreObjOfCompDetails.component_id,
        //   this.StoreObjOfCompDetails.customer_pincode
        // );
        // if (this.StoreObjOfCompDetails != undefined) {
        //   this.component_name = this.StoreObjOfCompDetails.component_name;
        //   this.purchased_count =
        //     this.StoreObjOfCompDetails.local_purchase_approve_count != undefined
        //       ? this.StoreObjOfCompDetails.local_purchase_approve_count
        //       : this.StoreObjOfCompDetails.vendor_details[0].purchased_count;
        //   this.vendor_contact_number =
        //     this.StoreObjOfCompDetails.vendor_contact_number != undefined
        //       ? this.StoreObjOfCompDetails.vendor_contact_number
        //       : this.StoreObjOfCompDetails.vendor_details[0]
        //           .vendor_contact_number;
        //   this.vendor_address =
        //     this.StoreObjOfCompDetails.vendor_address != undefined
        //       ? this.StoreObjOfCompDetails.vendor_address
        //       : this.StoreObjOfCompDetails.vendor_details[0].vendor_address;
        //   this.vendor_name =
        //     this.StoreObjOfCompDetails.vendor_name != undefined
        //       ? this.StoreObjOfCompDetails.vendor_name
        //       : this.StoreObjOfCompDetails.vendor_details[0].vendor_name;
        //   this.vendor_comments =
        //     this.StoreObjOfCompDetails.vendor_details[0].comments;
        // }
      }
    },

    price(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.purchased_count !== null ||
            this.purchased_count !== undefined) &&
          (this.gst !== null || this.gst !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    purchased_count(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.gst !== null || this.gst !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    gst(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.purchased_count !== null || this.purchased_count !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    discount(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.gst !== null || this.gst !== undefined) &&
          (this.purchased_count !== null || this.purchased_count !== undefined)
        ) {
          this.DiscountCalculation();
        }
      }
    },
  },
  methods: {
    GstCalculation() {
      this.totalAmount =
        this.price * this.purchased_count * (this.gst / 100) +
        this.price * this.purchased_count;
      this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
    },

    async CallTerritoryApiMethod() {
      this.vendorsList = await this.ListAllVendorDetailsMethod(
        this.StoreObjOfCompDetails.category_id,
        this.StoreObjOfCompDetails.service_id,
        this.StoreObjOfCompDetails.component_id,
        this.StoreObjOfCompDetails.customer_pincode,
        this.selectTerritories
      );
      this.tableView = "TAGGED_TERRITORIES";
    },

    DiscountCalculation() {
      this.finalAmount =
        this.totalAmount - this.totalAmount * (this.discount / 100);
      this.finalAmount = parseFloat(this.finalAmount.toFixed(2));
    },

    DialogVendorDetailsEmit(Toggle) {
      // this.$refs.form.reset();
      // this.gst = 0;
      // this.discount = 0;
      // this.selectTerritories = "";
      this.$emit("clicked", Toggle, this.StoreObjOfCompDetails);

      // this.vendorEmpID = "";
      // this.vendor_name = "";
      // this.vendorEmail = "";
      // this.vendor_contact_number = "";
      // this.price = 0;
      // this.purchased_count = 0;
      // this.gst = 0;
      // this.totalAmount = 0;
      // this.discount = 0;
      // this.finalAmount = 0;
    },
    MoveItemToTextFieldMethod(item) {
      console.log("GETTING_CALLEd", item);
      this.vendorEmpID = item.vendor_employee_id || "N/A";
      this.vendor_name = item.vendor_name || "";
      this.vendor_address = item.vendor_address || "";
      this.vendor_contact_number = item.vendor_primary_contact_number || "";
      this.price = item.price || 0;
      this.vendorEmail = item.vendor_email_id || "N/A";
      this.vendorID = item.vendor_id || "";
    },
    FormattedVendorAddressMethod(item) {
      if (item) {
        return item.length > 99 ? item.slice(0, 99) : item;
      } else {
        return "-";
      }
    },
    localPurchaseVendorDetails() {
      if (this.$refs.form.validate()) {
        this.vendor_details = [];
        let Obj = {
          component_name: this.component_name,
          purchased_count: parseInt(this.purchased_count),
          vendor_name:
            this.vendor_name != undefined &&
            this.vendor_name != null &&
            this.vendor_name != ""
              ? this.vendor_name
              : undefined,
          vendor_address:
            this.vendor_address != undefined &&
            this.vendor_address != null &&
            this.vendor_address != ""
              ? this.vendor_address
              : undefined,
          vendor_contact_number:
            this.vendor_contact_number != undefined &&
            this.vendor_contact_number != null &&
            this.vendor_contact_number != ""
              ? this.vendor_contact_number
              : undefined,
          vendor_comments:
            this.vendor_comments != undefined &&
            this.vendor_comments != null &&
            this.vendor_comments != ""
              ? this.vendor_comments
              : undefined,
          per_component_price: this.price,
          vendor_id: this.vendorID,
          sub_total: this.totalAmount,
          discont_percentage: this.discount,
          gst: this.gst,
          total_price: this.finalAmount,
        };
        this.vendor_details.push(Obj);
        this.StoreObjOfCompDetails.vendor_details = this.vendor_details;
        this.StoreObjOfCompDetails.vendor_name = this.vendor_name;
        this.StoreObjOfCompDetails.vendor_comments = this.vendor_comments;
        this.StoreObjOfCompDetails.vendor_contact_number =
          this.vendor_contact_number;
        this.StoreObjOfCompDetails.vendor_address = this.vendor_address;
        // this.$refs.form.reset();
        console.log(
          "CHECK_SAVED_VENODR_OBJ",
          this.StoreObjOfCompDetails.vendor_details
        );
        this.DialogVendorDetailsEmit(2, this.StoreObjOfCompDetails);
        // this.$refs.form.reset();
        // this.vendorEmpID = "";
        // this.vendor_name = "";
        // this.vendorEmail = "";
        // this.vendor_contact_number = "";
        // this.price = 0;
        // this.purchased_count = 0;
        // this.gst = 0;
        // this.totalAmount = 0;
        // this.discount = 0;
        // this.finalAmount = 0;
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script> -->

<!-- <template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="DialogVendorDetails" width="1000" persistent>
      <v-card>
        <v-toolbar dense dark color="primary">
          <div class="ml-2 white--text">Vendor Details</div>
          <v-spacer />
          <v-btn icon @click="DialogVendorDetailsEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-left">
              <span
                ><strong>Category Name: </strong
                >{{ StoreObjOfCompDetails.category_name }}</span
              >
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-center">
              <span
                ><strong>Component Name: </strong
                >{{ StoreObjOfCompDetails.component_name }}</span
              >
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="text-right">
              <span
                ><strong>Product Name: </strong
                >{{ StoreObjOfCompDetails.service_name }}</span
              >
            </v-col>
          </v-row>
          <div
            style="
              width: 100%;
              border: 1px dashed black;
              padding: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            class="mt-3 mb-5"
          >
            <div>
              <v-form ref="form">
                <v-row class="pa-0 mt-3">
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      label="Vendor ID"
                      class="FontSize mr-1"
                      v-model="vendorEmpID"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      label="Vendor Name"
                      class="FontSize mr-1"
                      v-model="vendor_name"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      label="Vendor Contact Number"
                      class="FontSize mr-1"
                      maxlength="10"
                      v-model="vendor_contact_number"
                      :rules="phone_number_rules"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      label="Vendor Email"
                      class="FontSize mr-1"
                      v-model="vendorEmail"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Price *"
                      class="FontSize mr-1"
                      v-model="price"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Quantity *"
                      class="FontSize mr-1"
                      v-model="purchased_count"
                      :readonly="work_flow_status != 'PENDING'"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="GST"
                      class="FontSize mr-1"
                      v-model="gst"
                      :readonly="work_flow_status != 'PENDING'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Total Amount"
                      class="FontSize mr-1"
                      v-model="totalAmount"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pa-2"
                  ></v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pa-2"
                  ></v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Discount"
                      class="FontSize mr-1"
                      v-model="discount"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pa-2">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Final Amount"
                      class="FontSize mr-1"
                      v-model="finalAmount"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </div>
          <div class="mt-2">
            <span><strong>Vendor Details Table</strong></span>
          </div>

          <v-data-table
            style="cursor: pointer"
            :headers="headers"
            :items="vendorsList"
            @click:row="MoveItemToTextFieldMethod"
          >
            <template v-slot:[`item.venore_name`]="{ item }">
              <div class="FontSize">
                {{ item.venore_name }}
              </div>
            </template>
            <template v-slot:[`item.vendor_primary_contact_number`]="{ item }">
              <div class="FontSize">
                {{ item.vendor_primary_contact_number }}
              </div>
            </template>
            <template v-slot:[`item.category_name`]="{ item }">
              <div class="FontSize">
                {{ item.category_name }}
              </div>
            </template>
            <template v-slot:[`item.product_name`]="{ item }">
              <div class="FontSize">
                {{ item.product_name }}
              </div>
            </template>
            <template v-slot:[`item.component_name`]="{ item }">
              <div class="FontSize">
                {{ item.component_name }}
              </div>
            </template>
            <template v-slot:[`item.price`]="{ item }">
              <div class="FontSize">
                {{ item.price }}
              </div>
            </template>
            <template v-slot:[`item.vendor_address`]="{ item }">
              <div class="FontSize">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      {{ FormattedVendorAddressMethod(item.vendor_address) }}
                    </span>
                  </template>
                  <span>{{ item.vendor_address }}</span>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
          <div></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            v-if="work_flow_status == 'PENDING'"
            @click="localPurchaseVendorDetails()"
            class="primary white--text mb-4 mt-n4 mr-4"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { ListAllVendorDetails } from "@/mixins/Approvals/GetVendorDetails.js";
export default {
  mixins: [ListAllVendorDetails],
  props: {
    StoreObj: Object,
    work_flow_status: String,
    DialogVendorDetails: Boolean,
    StoreObjOfCompDetails: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    vendor_comments: "",
    vendor_name: "",
    component_name: "",
    vendor_address: "",
    purchased_count: "",
    vendor_contact_number: "",
    renderComp: true,
    SnackBarComponent: {},
    vendor_details: [],
    phone_number_rules: [],
    GetStoreNamesAndCompCountList: [],
    approve_service_center_details: [],
    price: "",
    headers: [
      { text: "Vendor Name", value: "venore_name" },
      { text: "Vendor Contact Number", value: "vendor_primary_contact_number" },
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Component Name", value: "component_name" },
      { text: "Price", value: "price" },
      { text: "Vendor Address", value: "vendor_address" },
    ],
    vendorsList: [],
    gst: 0,
    totalAmount: 0,
    discount: 0,
    finalAmount: 0,
    vendorEmail: "",
  }),
  watch: {
    vendor_contact_number(val) {
      if (val != undefined && val != "") {
        this.phone_number_rules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 11) || "Invalid",
          (v) => (v && v.length > 9) || "Invalid",
        ];
      } else {
        this.phone_number_rules = [];
      }
    },
    async DialogVendorDetails(val) {
      if (val == true) {
        console.log("DETAILS_DIJ", this.StoreObjOfCompDetails);
        this.vendorsList = await this.ListAllVendorDetailsMethod(
          this.StoreObjOfCompDetails.category_id,
          this.StoreObjOfCompDetails.service_id,
          this.StoreObjOfCompDetails.component_id,
          this.StoreObjOfCompDetails.customer_pincode
        );
        console.log("GET_TABEL_DATA", this.vendorsList);
        if (this.StoreObjOfCompDetails != undefined) {
          this.component_name = this.StoreObjOfCompDetails.component_name;
          this.purchased_count =
            this.StoreObjOfCompDetails.local_purchase_approve_count != undefined
              ? this.StoreObjOfCompDetails.local_purchase_approve_count
              : this.StoreObjOfCompDetails.vendor_details[0].purchased_count;
          this.vendor_contact_number =
            this.StoreObjOfCompDetails.vendor_contact_number != undefined
              ? this.StoreObjOfCompDetails.vendor_contact_number
              : this.StoreObjOfCompDetails.vendor_details[0]
                  .vendor_contact_number;
          this.vendor_address =
            this.StoreObjOfCompDetails.vendor_address != undefined
              ? this.StoreObjOfCompDetails.vendor_address
              : this.StoreObjOfCompDetails.vendor_details[0].vendor_address;
          this.vendor_name =
            this.StoreObjOfCompDetails.vendor_name != undefined
              ? this.StoreObjOfCompDetails.vendor_name
              : this.StoreObjOfCompDetails.vendor_details[0].vendor_name;
          this.vendor_comments =
            this.StoreObjOfCompDetails.vendor_details[0].comments;
        }
      }
    },

    price(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.purchased_count !== null ||
            this.purchased_count !== undefined) &&
          (this.gst !== null || this.gst !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    purchased_count(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.gst !== null || this.gst !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    gst(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.purchased_count !== null || this.purchased_count !== undefined)
        ) {
          this.GstCalculation();
          this.DiscountCalculation();
        }
      }
    },

    discount(val) {
      if (val !== null || val !== undefined) {
        if (
          (this.price !== null || this.price !== undefined) &&
          (this.gst !== null || this.gst !== undefined) &&
          (this.purchased_count !== null || this.purchased_count !== undefined)
        ) {
          this.DiscountCalculation();
        }
      }
    },
  },
  methods: {
    GstCalculation() {
      this.totalAmount =
        this.price * this.purchased_count * (this.gst / 100) +
        this.price * this.purchased_count;
      this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
    },

    DiscountCalculation() {
      this.finalAmount =
        this.totalAmount - this.totalAmount * (this.discount / 100);
      this.finalAmount = parseFloat(this.finalAmount.toFixed(2));
    },

    DialogVendorDetailsEmit(Toggle) {

      this.$emit("clicked", Toggle, this.StoreObjOfCompDetails);
      this.vendorEmpID = "";
      this.vendor_name = "";
      this.vendorEmail = "";
      this.vendor_contact_number = "";
      this.price = 0;
 
      this.gst = 0;
      this.totalAmount = 0;
      this.discount = 0;
      this.finalAmount = 0;
    },
    MoveItemToTextFieldMethod(item) {
      console.log("GETTING_CALLEd", item);
      this.vendorEmpID = item.vendor_employee_id || "-";
      this.vendor_name = item.venore_name || "";
      this.vendor_address = item.vendor_address || "";
      this.vendor_contact_number = item.vendor_primary_contact_number || "";
      this.price = item.price || 0;
      this.vendorEmail = item.vendor_email_id || "-";
    },
    FormattedVendorAddressMethod(item) {
      if (item) {
        return item.length > 99 ? item.slice(0, 99) : item;
      } else {
        return "-";
      }
    },
    localPurchaseVendorDetails() {
      if (this.$refs.form.validate()) {
        this.vendor_details = [];
        let Obj = {
          component_name: this.component_name,
          purchased_count: parseInt(this.purchased_count),
          vendor_name:
            this.vendor_name != undefined &&
            this.vendor_name != null &&
            this.vendor_name != ""
              ? this.vendor_name
              : undefined,
          vendor_address:
            this.vendor_address != undefined &&
            this.vendor_address != null &&
            this.vendor_address != ""
              ? this.vendor_address
              : undefined,
          vendor_contact_number:
            this.vendor_contact_number != undefined &&
            this.vendor_contact_number != null &&
            this.vendor_contact_number != ""
              ? this.vendor_contact_number
              : undefined,
          vendor_comments:
            this.vendor_comments != undefined &&
            this.vendor_comments != null &&
            this.vendor_comments != ""
              ? this.vendor_comments
              : undefined,
          per_component_price: this.price,
          vendor_id: this.vendorEmpID === "-" ? "" : this.vendorEmpID,
          sub_total: this.totalAmount,
          discont_percentage: this.discount,
          gst: this.gst,
          total_price: this.finalAmount,
        };
        this.vendor_details.push(Obj);
        this.StoreObjOfCompDetails.vendor_details = this.vendor_details;
        this.StoreObjOfCompDetails.vendor_name = this.vendor_name;
        this.StoreObjOfCompDetails.vendor_comments = this.vendor_comments;
        this.StoreObjOfCompDetails.vendor_contact_number =
          this.vendor_contact_number;
        this.StoreObjOfCompDetails.vendor_address = this.vendor_address;
        // this.$refs.form.reset();
        console.log(
          "CHECK_SAVED_VENODR_OBJ",
          this.StoreObjOfCompDetails.vendor_details
        );
        this.DialogVendorDetailsEmit(2, this.StoreObjOfCompDetails);
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>

<style></style> -->
