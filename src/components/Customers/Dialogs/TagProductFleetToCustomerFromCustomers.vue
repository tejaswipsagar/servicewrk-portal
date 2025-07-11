<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog width="80%" persistent :value="TagProductToCustomerFromCustomers">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <div class="ml-2">Tag Product Fleet</div>
          <v-spacer />
          <v-btn
            small
            text
            dark
            class="primary"
            @click="TagProductToCustomerFromCustomersEmit(1)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  label="Customer"
                  readonly
                  v-model="customer_name"
                  class="FontSize mt-4"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  readonly
                  label="Customer Phone Number"
                  v-model="customer_primary_contact_number"
                  class="FontSize mt-4"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  readonly
                  label="Category"
                  v-model="category_name"
                  class="FontSize mt-4"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  readonly
                  label="Product"
                  v-model="service_name"
                  class="FontSize mt-4"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  readonly
                  label="Serial Number"
                  v-model="serial_number"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  type="number"
                  dense
                  label="Price"
                  v-model="setting_price"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  label="Description"
                  v-model="setting_description"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-menu
                  v-model="product_purchased_on_date"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      v-model="product_purchased_on"
                      text-value="product_purchased_on"
                      label="Installation Date"
                      prepend-inner-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="product_purchased_on"
                    @input="product_purchased_on_date = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  label="Invoice Number"
                  v-model="invoice_number"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-menu
                  v-model="Invoice_date_dialog"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      v-model="invoice_date"
                      text-value="invoice_date"
                      label="Invoice Date"
                      prepend-inner-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="invoice_date"
                    @input="Invoice_date_dialog = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  label="Support"
                  item-value="value"
                  :items="supportItems"
                  v-model="support_type"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  label="Support Type"
                  item-text="setting_name"
                  item-value="setting_name"
                  v-model="warranty_type"
                  :items="GetAllAMCTypeList"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-menu
                  offset-y
                  min-width="auto"
                  :nudge-right="40"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  v-model="warranty_start_date_date"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      v-on="on"
                      v-bind="attrs"
                      class="FontSize"
                      label="Support Start Date"
                      v-model="warranty_start_date"
                      text-value="warranty_start_date"
                      prepend-inner-icon="mdi-calendar"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="warranty_start_date"
                    @input="warranty_start_date_date = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3" sm="12" xs="12">
                <v-menu
                  offset-y
                  min-width="auto"
                  :nudge-right="40"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  v-model="warranty_end_date_date"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      v-on="on"
                      v-bind="attrs"
                      class="FontSize"
                      label="Support End Date"
                      v-model="warranty_end_date"
                      text-value="warranty_end_date"
                      prepend-inner-icon="mdi-calendar"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="warranty_end_date"
                    @input="warranty_end_date_date = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- <v-col cols="12" md="3" sm="12" xs="12">
                <v-checkbox
                  class="mt-n1"
                  label="Is Schedule Service ?"
                  v-model="is_schedule_service"
                ></v-checkbox>
              </v-col> -->
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            :loading="loading"
            class="primary white--text mr-2 mb-6 mt-n3"
            @click="
              StoreObj.action == 'PRODUCT_TAGGING'
                ? TagProductFleetApprovalMethod()
                : tagProductToCustomer()
            "
            >Confirm</v-btn
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
import { TagProductsToCustomer } from "@/graphql/mutations.js";
import { ApproveRequestedProductToTagCustomer } from "@/graphql/mutations.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
export default {
  props: {
    StoreObj: Object,
    StoreObj1: Object,
    TagProductToCustomerFromCustomers: Boolean,
  },
  mixins: [GetAllOrganizationSetting],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    service_name: "",
    support_type: "",
    invoice_date: "",
    setting_price: "",
    serial_number: "",
    category_name: "",
    customer_name: "",
    warranty_type: "",
    invoice_number: "",
    warranty_end_date: "",
    setting_description: "",
    warranty_start_date: "",
    product_purchased_on: "",
    customer_primary_contact_number: "",
    overlay: false,
    loading: false,
    renderComp: true,
    Invoice_date_dialog: false,
    is_schedule_service: false,
    warranty_end_date_date: false,
    warranty_start_date_date: false,
    product_purchased_on_date: false,
    SnackBarComponent: {},
    GetAllAMCTypeList: [],
    supportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
  }),
  watch: {
    support_type(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    TagProductToCustomerFromCustomers(val) {
      if (val == true) {
        this.customer_primary_contact_number =
          this.StoreObj.customer_primary_contact_number;
        this.customer_name = this.StoreObj.customer_name;
        this.category_name = this.StoreObj1.category_name;
        this.service_name =
          this.StoreObj.service_name != undefined
            ? this.StoreObj.service_name
            : this.StoreObj1.product_name;
        this.serial_number = this.StoreObj1.setting_name;
        this.setting_price = this.StoreObj1.setting_price;
        this.setting_description = this.StoreObj1.setting_description;
      }
    },
  },
  methods: {
    async tagProductToCustomer() {
      var mutationname = TagProductsToCustomer;
      var mutationresult = "TagProductsToCustomer";
      var inputParams = {
        creator_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        customer_id: this.StoreObj.customer_id,
        requested_work_flow_id: this.StoreObj.workflow_id,
        is_requested_product_tagging: true,
        products_fleet_list: [
          {
            category_id: this.StoreObj1.category_id,
            service_id: this.StoreObj1.product_id,
            setting_id: this.StoreObj1.setting_id,
            setting_price:
              this.setting_price != undefined &&
              this.setting_price != "" &&
              this.setting_price != null
                ? this.setting_price
                : undefined,
            setting_description:
              this.setting_description != undefined &&
              this.setting_description != "" &&
              this.setting_description != null
                ? this.setting_description
                : undefined,
            product_purchased_on:
              this.product_purchased_on != undefined &&
              this.product_purchased_on != null &&
              this.product_purchased_on != ""
                ? this.product_purchased_on
                : undefined,
            warranty_start_date:
              this.warranty_start_date != undefined &&
              this.warranty_start_date != null &&
              this.warranty_start_date != ""
                ? this.warranty_start_date
                : undefined,
            warranty_end_date:
              this.warranty_end_date != undefined &&
              this.warranty_end_date != null &&
              this.warranty_end_date != ""
                ? this.warranty_end_date
                : undefined,
            support_type:
              this.support_type != undefined &&
              this.support_type != null &&
              this.support_type != ""
                ? this.support_type
                : undefined,
            warranty_type:
              this.warranty_type != undefined &&
              this.warranty_type != null &&
              this.warranty_type != ""
                ? this.warranty_type
                : undefined,
            invoice_number:
              this.invoice_number != undefined &&
              this.invoice_number != null &&
              this.invoice_number != ""
                ? this.invoice_number
                : undefined,
            invoice_date:
              this.invoice_date != undefined &&
              this.invoice_date != null &&
              this.invoice_date != ""
                ? this.invoice_date
                : undefined,
            is_schedule_service:
              this.is_schedule_service != undefined &&
              this.is_schedule_service != null &&
              this.is_schedule_service != ""
                ? this.is_schedule_service
                : undefined,
          },
        ],
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutationresult]);
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
          this.TagProductToCustomerFromCustomersEmit(2);
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
    async TagProductFleetApprovalMethod() {
      var inputParams = {
        updater_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        customer_id: this.StoreObj.customer_id,
        workflow_id: this.StoreObj.workflow_id,
        products_fleet_list: [
          {
            category_id: this.StoreObj1.category_id,
            service_id: this.StoreObj1.product_id,
            setting_id: this.StoreObj1.setting_id,
            setting_price:
              this.setting_price != undefined &&
              this.setting_price != "" &&
              this.setting_price != null
                ? this.setting_price
                : undefined,
            setting_description:
              this.setting_description != undefined &&
              this.setting_description != "" &&
              this.setting_description != null
                ? this.setting_description
                : undefined,
            product_purchased_on:
              this.product_purchased_on != undefined &&
              this.product_purchased_on != null &&
              this.product_purchased_on != ""
                ? this.product_purchased_on
                : undefined,
            warranty_start_date:
              this.warranty_start_date != undefined &&
              this.warranty_start_date != null &&
              this.warranty_start_date != ""
                ? this.warranty_start_date
                : undefined,
            warranty_end_date:
              this.warranty_end_date != undefined &&
              this.warranty_end_date != null &&
              this.warranty_end_date != ""
                ? this.warranty_end_date
                : undefined,
            support_type:
              this.support_type != undefined &&
              this.support_type != null &&
              this.support_type != ""
                ? this.support_type
                : undefined,
            warranty_type:
              this.warranty_type != undefined &&
              this.warranty_type != null &&
              this.warranty_type != ""
                ? this.warranty_type
                : undefined,
            invoice_number:
              this.invoice_number != undefined &&
              this.invoice_number != null &&
              this.invoice_number != ""
                ? this.invoice_number
                : undefined,
            invoice_date:
              this.invoice_date != undefined &&
              this.invoice_date != null &&
              this.invoice_date != ""
                ? this.invoice_date
                : undefined,
            is_schedule_service:
              this.is_schedule_service != undefined &&
              this.is_schedule_service != null &&
              this.is_schedule_service != ""
                ? this.is_schedule_service
                : undefined,
          },
        ],
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ApproveRequestedProductToTagCustomer, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.ApproveRequestedProductToTagCustomer
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
          this.TagProductToCustomerFromCustomersEmit(2);
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
    TagProductToCustomerFromCustomersEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
