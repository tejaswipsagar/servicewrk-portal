<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogLookUpCustomer" persistent max-width="800px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{ "mdi-magnify" }}</v-icon
            >Customer Lookup
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogLookUpCustomerEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-row justify="center" class="mt-1 mb-2">
          <v-radio-group v-model="customer_type">
            <v-row justify="center">
              <v-col class="ml-2">
                <v-radio label="INDIVIDUAL" value="INDIVIDUAL"></v-radio>
              </v-col>
              <v-col>
                <v-radio label="BUSINESS" value="BUSINESS"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-row>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="1"></v-col>
            <v-form ref="form">
              <v-row class="text-center">
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-select
                    dense
                    outlined
                    label="Search By"
                    class="ml-2 WidthVariation1 FontSize field_label_size field_height"
                    :items="
                      customer_type !== 'BUSINESS'
                        ? SearchByItems.filter(
                            (item) => item.text != 'Customer Company Name'
                          )
                        : SearchByItems
                    "
                    item-text="text"
                    item-value="value"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="SearchBy"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-text-field
                    dense
                    outlined
                    label="Search"
                    class="ml-n2 FontSize field_label_size field_height"
                    v-model="search"
                    :rules="[(v) => !!v || 'Required']"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon>mdi-magnify</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-btn
              class="ml-2"
              small
              color="primary"
              @click="GetCustomersByFilterMethod()"
              >Search</v-btn
            >
            <v-btn small color="primary" class="ml-2" @click="ClearMethod()"
              >clear</v-btn
            >
          </v-row>
          <v-data-table
            dense
            height="260px"
            :page.sync="page"
            :loading="loading"
            class="elevation-0"
            hide-default-footer
            :items-per-page="50"
            :fixed-header="true"
            @click:row="checkItem"
            style="cursor: pointer"
            :no-data-text="noDataText"
            @page-count="pageCount = $event"
            :items="
              Current_Filter === 'WITHOUT_SEARCH'
                ? GetAllCustomersData
                : GetAllSearchCustomerList
            "
            :headers="
              customer_type != 'BUSINESS'
                ? lookUpHeaders.filter((item) => item.text != 'Customer')
                : lookUpHeaders
            "
          >
            <template v-slot:[`item.customer_name`]="{ item }">
              <div v-if="item.customer_name != undefined">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span class="FontSize" v-bind="attrs" v-on="on">{{
                      item.customer_name.length > 25
                        ? `${item.customer_name.slice(0, 25)}...`
                        : item.customer_name
                    }}</span>
                  </template>
                  <span>{{ item.customer_name }}</span>
                </v-tooltip>
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.customer_company_name`]="{ item }">
              <div
                class="FontSize"
                v-if="item.customer_company_name != undefined"
              >
                {{ item.customer_company_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.customer_unique_id`]="{ item }">
              <div class="FontSize" v-if="item.customer_unique_id != undefined">
                {{ item.customer_unique_id }}
              </div>
              <div v-else>-</div>
            </template>
            <template
              v-slot:[`item.customer_primary_contact_number`]="{ item }"
            >
              <div
                class="FontSize"
                v-if="item.customer_primary_contact_number != undefined"
              >
                {{ item.customer_primary_contact_number }}
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
          <v-pagination
            v-model="page"
            :length="pageCount"
            total-visible="4"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllCustomersList } from "@/mixins/Customers/GetAllCustomers.js";
import { GetAllCustomerBySearch } from "@/mixins/Terretories/GetCustomerListBySearch.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  props: {
    Customer: String,
    dialogLookUpCustomer: Boolean,
  },
  mixins: [
    GetAllCustomersList,
    GetAllCustomerBySearch,
    GetAllOrganizationSettingsTypesInMS,
  ],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    page: 1,
    Toggle: 0,
    pageCount: 1,
    loading: false,
    renderComp: true,
    search: "",
    searchCustomer: "",
    SearchBy: "customer_name",
    customer_status: "ACTIVE",
    customer_type: "BUSINESS",
    Current_Filter: "WITHOUT_SEARCH",
    SnackBarComponent: {},
    GetAllCustomersData: [],
    lookUpHeaders: [
      {
        text: "Contact Person",
        value: "customer_name",
        width: "30%",
      },
      {
        text: "Customer",
        value: "customer_company_name",
        width: "25%",
      },
      {
        text: "Contact Number",
        value: "customer_primary_contact_number",
        width: "25%",
      },
      {
        text: "Customer ID",
        value: "customer_unique_id",
        width: "20%",
      },
    ],
    SearchByItems: [
      {
        text: "Contact Person",
        value: "customer_name",
      },
      {
        text: "Customer",
        value: "customer_company_name",
      },
      {
        text: "Customer Phone Number",
        value: "customer_primary_phone_number",
      },
      {
        text: "Customer ID",
        value: "customer_unique_id",
      },
    ],
  }),
  watch: {
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllCustomersListMethod(
          this.customer_status,
          this.customer_type,
          this.next_token
        );
      }
    },
    searchCustomer(customer_name) {
      if (
        customer_name != undefined &&
        customer_name != null &&
        customer_name != ""
      ) {
        this.GetAllCustomersData = [];
        this.GetAllCustomersListMethod(
          this.customer_status,
          this.customer_type,
          undefined
        );
      }
    },
    customer_type() {
      this.GetAllCustomersData = [];
      this.GetAllCustomersListMethod(
        this.customer_status,
        this.customer_type,
        undefined
      );
    },
  },
  async mounted() {
    this.GetAllCustomersListMethod("ACTIVE", this.customer_type, undefined);
    await this.GetAllOrganizationSettingsTypesMethod();
    this.customer_type =
      this.GetAllOrganizationSettingsTypesObject.default_customer_type;
  },
  methods: {
    async ClearMethod() {
      this.Current_Filter = "WITHOUT_SEARCH";
      this.Current_Filter = "WITHOUT_SEARCHING";
      this.$refs.form.reset();
      this.GetAllSearchCustomerList = [];
      this.noDataText = "Search above for Customers";
      await this.GetAllOrganizationSettingsTypesMethod();
      this.customer_type = await this.GetAllOrganizationSettingsTypesObject
        .default_customer_type;
      this.customer_status = "ACTIVE";
      this.Current_Filter = "WITHOUT_SEARCH";
      setTimeout(() => {
        this.GetAllCustomersData = [];
        this.GetAllCustomersListMethod(
          this.customer_status,
          this.customer_type,
          undefined
        );
      }, 300);
    },
    GetCustomersByFilterMethod() {
      if (this.$refs.form.validate()) {
        this.Current_Filter = "WITH_SEARCH";
        this.GetAllCustomerBySearchMethod(
          this.customer_status,
          this.search,
          this.SearchBy,
          this.customer_type
        );
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill Mandatory Field..!",
          };
          this.renderComp = true;
        });
      }
    },
    checkItem(item) {
      item.Is_enabled_checkBox = false;
      this.dialogLookUpCustomerEmit(2, item);
      console.log("CHEC_THE_ROW", item);
    },
    dialogLookUpCustomerEmit(Toggle, item) {
      this.searchCustomer = "";
      this.GetAllSearchCustomerList = [];
      this.$emit("clicked", Toggle, item);
    },
  },
};
</script>
