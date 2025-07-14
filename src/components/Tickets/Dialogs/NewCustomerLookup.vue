<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogLookUpCustomer" persistent max-width="800px">
      <v-card v-if="customerData.length > 0">
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{ "mdi-magnify" }}</v-icon
            >Customer Lookup(v2)
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
              <v-row
                class="text-center"
                style="position: relative; left: 130px"
              >
                <v-col cols="12" md="6" lg="6" sm="12" xs="12">
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
                <v-col cols="12" md="6" lg="6" sm="12" xs="12">
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
            <!-- <v-btn
              class="ml-2"
              small
              color="primary"
              @click="GetCustomersByFilterMethod()"
              >Search</v-btn
            >
            <v-btn small color="primary" class="ml-2" @click="ClearMethod()"
              >clear</v-btn
            > -->
          </v-row>
          <v-data-table
            :search="SearchBy === 'all' ? search : undefined"
            dense
            height="260px"
            :page.sync="page"
            :loading="loading"
            class="elevation-0"
            :items-per-page="50"
            :fixed-header="true"
            @click:row="checkItem"
            style="cursor: pointer"
            :no-data-text="noDataText"
            @page-count="pageCount = $event"
            :items="
              SearchBy !== 'all' && search !== ''
                ? filteredCustomerData
                : customerData
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
          <!-- <v-pagination
            v-model="page"
            :length="pageCount"
            total-visible="4"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination> -->
        </v-card-text>
      </v-card>
      <v-card v-else></v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
// import { GetAllCustomersList } from "@/mixins/Customers/GetAllCustomers.js";
// import { GetAllCustomerBySearch } from "@/mixins/Terretories/GetCustomerListBySearch.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
// import { getAllCustomerUsingS3URL } from "@/mixins/Customers/GetAllS3Customers.js";
import { GetCustomerDetails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import { getOrgS3DataMethod } from "@/IndexedDB/IndexedDBGetter.js";
export default {
  props: {
    Customer: String,
    dialogLookUpCustomer: Boolean,
  },
  mixins: [
    // GetAllCustomersList,
    // GetAllCustomerBySearch,
    GetAllOrganizationSettingsTypesInMS,
    // getAllCustomerUsingS3URL,
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
    SearchBy: "all",
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
        text: "All",
        value: "all",
      },
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
        value: "customer_primary_contact_number",
      },
      {
        text: "Customer ID",
        value: "customer_unique_id",
      },
    ],
    customerData: [],
    filteredCustomerData: [],
  }),
  watch: {
    // page() {
    //   if (
    //     this.next_token != undefined &&
    //     this.next_token != null &&
    //     this.next_token != ""
    //   ) {
    //     this.GetAllCustomersListMethod(
    //       this.customer_status,
    //       this.customer_type,
    //       this.next_token
    //     );
    //   }
    // },
    SearchBy(val) {
      this.search = "";
      // const formattedVal = this.search.toLowerCase().trim();
      // const key = val;
      // if (!key) return;
      // this.filteredCustomerData = this.customerData.filter((cust) =>
      //   String(cust[key] || "")
      //     .toLowerCase()
      //     .includes(formattedVal)
      // );
    },
    search(val) {
      const formattedVal = String(val).toLowerCase().trim();
      const key = this.SearchBy;
      if (!key) return;
      this.filteredCustomerData = this.customerData.filter((cust) =>
        String(cust[key] || "")
          .toLowerCase()
          .includes(formattedVal)
      );
    },

    async dialogLookUpCustomer(val) {
      if (val) {
        // this.customerData = await this.getAllCustomerUsingS3URLMethod();

        await this.callApiMethod();
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
    async customer_type(val) {
      this.search = "";
      console.log("CUST_TYPE888", val);
      const baseItems = [
        { text: "All", value: "all" },
        { text: "Contact Person", value: "customer_name" },
        {
          text: "Customer Phone Number",
          value: "customer_primary_contact_number",
        },
        { text: "Customer ID", value: "customer_unique_id" },
      ];

      if (val === "INDIVIDUAL") {
        this.SearchByItems = baseItems;
      } else {
        this.SearchByItems = [
          ...baseItems.slice(0, 2), // up to "Contact Person"
          { text: "Customer Name", value: "customer_company_name" },
          ...baseItems.slice(2),
        ];
      }

      await this.callApiMethod();
    },
    // customer_type() {
    //   this.GetAllCustomersData = [];
    //   this.GetAllCustomersListMethod(
    //     this.customer_status,
    //     this.customer_type,
    //     undefined
    //   );
    // },
  },
  async mounted() {
    // this.GetAllCustomersListMethod("ACTIVE", this.customer_type, undefined);
    await this.GetAllOrganizationSettingsTypesMethod();
    this.customer_type =
      this.GetAllOrganizationSettingsTypesObject.default_customer_type;
  },
  methods: {
    async callApiMethod() {
      this.overlay = true;
      const timeout = 60 * 1000;
      const interval = 1000;
      const startTime = Date.now();
      let obj = null;
      while (!obj && Date.now() - startTime < timeout) {
        obj = await getOrgS3DataMethod();
        if (!obj) {
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      }
      if (!obj) {
        console.error("⏳ Timed out waiting for org_s3_data.");
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText:
              "Failed to get customers data, try refreshing the page..!",
          };
          this.renderComp = true;
        });
        return;
      }
      this.overlay = false;
      const allCustomers = obj.customer_data;
      if (
        this.customer_type === "INDIVIDUAL" ||
        this.customer_type === "BUSINESS"
      ) {
        this.customerData = allCustomers.filter(
          (item) => item.customer_type === this.customer_type
        );
      }
    },
    async checkItem(item) {
      console.log("CUST_DET", item);
      item.Is_enabled_checkBox = false;
      let response;
      try {
        const result = await API.graphql(
          graphqlOperation(GetCustomerDetails, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: item.customer_id,
            },
          })
        );
        response = JSON.parse(result.data.GetCustomerDetails).data.items;
        console.log("CUSS_DET", response);
      } catch (error) {
        //
      }
      this.dialogLookUpCustomerEmit(2, response);
      console.log("CHEC_THE_ROW");
    },

    dialogLookUpCustomerEmit(Toggle, item) {
      this.searchCustomer = "";
      this.GetAllSearchCustomerList = [];
      this.$emit("clicked", Toggle, item);
    },
  },
};
</script>
