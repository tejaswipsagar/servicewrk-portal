<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-card flat>
      <v-toolbar dense class="elevation-0">
        <v-icon color="primary" small dark>mdi-tag</v-icon>
        <div class="ml-2 largeFontSizeNew">Tag Customers</div>
        <v-spacer></v-spacer>
        <v-form ref="form">
          <v-row class="space-between">
            <v-select
              outlined
              dense
              class="mt-8 FontSize WidthVariation2"
              v-model="customer_type"
              label="Customer Type *"
              :rules="[(v) => !!v || 'Required']"
              :items="customer_type_items"
            >
            </v-select>
            <v-select
              dense
              outlined
              label="Search By"
              class="mt-8 mr-2 ml-2 FontSize WidthVariation2 field_label_size field_height"
              :items="SearchByItems"
              item-text="text"
              item-value="value"
              :rules="[(v) => !!v || 'Required']"
              v-model="SearchBy"
            ></v-select>
            <v-autocomplete
              dense
              outlined
              label="Representative"
              :items="GetAllServiceRepresentativeList"
              v-if="SearchBy == 'representative_id'"
              v-model="representative_id"
              item-text="user_name"
              item-value="user_id"
              class="mt-8 mr-4 ml-2 WidthVariation1 FontSize field_label_size field_height"
            >
            </v-autocomplete>
            <v-text-field
              dense
              outlined
              label="Search"
              v-if="SearchBy != 'representative_id'"
              class="mt-8 mr-5 ml-2 FontSize field_label_size field_height"
              v-model="search"
              :rules="[(v) => !!v || 'Required']"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-row>
        </v-form>
        <v-btn dark small color="primary" @click="SearchDataMethod()">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn
          dark
          small
          class="mx-2"
          color="primary"
          @click="current_view = 'WITHOUT_SEARCHING'"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          dark
          small
          @click="opencustmeremmit((Toggle = 1))"
          ><v-icon>mdi-chevron-double-left</v-icon></v-btn
        >
      </v-toolbar>
      <v-data-table
        dense
        :height="tableHeight"
        :fixed-header="true"
        :headers="headers"
        :items="
          current_view == 'WITHOUT_SEARCHING'
            ? GetAllCustomersData
            : GetAllSearchCustomerList
        "
        :single-select="singleSelect"
        show-select
        v-model="selected"
        :no-data-text="noDataText"
        item-key="customer_id"
        :loading="loading"
        @page-count="pageCount = $event"
        :page.sync="page"
        :items-per-page="50"
        hide-default-footer
      >
        <template v-slot:[`item.customer_name`]="{ item }">
          <div class="FontSize" v-if="item.customer_name != undefined">
            {{ item.customer_name }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.customer_company_name != undefined">
            {{ item.customer_company_name }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.customer_primary_phone_number`]="{ item }">
          <div
            class="FontSize"
            v-if="item.customer_primary_phone_number != undefined"
          >
            {{ item.customer_primary_phone_number }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.customer_company_name`]="{ item }">
          <div class="FontSize" v-if="item.customer_company_name != undefined">
            {{ item.customer_company_name }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.customer_address`]="{ item }">
          <div class="FontSize" v-if="item.customer_address != undefined">
            {{ item.customer_address }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.customer_unique_id`]="{ item }">
          <div class="FontSize" v-if="item.customer_unique_id != undefined">
            {{ item.customer_unique_id }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.primary_representative_details`]="{ item }">
          <div
            v-if="item.primary_representative_details != undefined"
            class="FontSize"
          >
            {{ item.primary_representative_details.user_name }}
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
      <v-card-actions>
        <v-spacer />
        <v-btn
          :loading="loading"
          @click="tagCustomerTerritory()"
          color="primary"
          small
        >
          confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import {
  TagCustomersToDealers,
  TagCustomersToPartner,
} from "@/graphql/mutations.js";
import { TagRequiredModuleToTerritories } from "@/graphql/mutations.js";
import { GetAllCustomersList } from "@/mixins/Customers/GetAllCustomers.js";
import { GetAllCustomerBySearch } from "@/mixins/Terretories/GetCustomerListBySearch.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
import { GetAllCustomerBySearchTech } from "@/mixins/Terretories/GetCustomerByTechFilter.js";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  mixins: [
    GetAllCustomersList,
    GetAllCustomerBySearch,
    GetAllCustomerBySearchTech,
    GetAllServiceRepresentative,
  ],
  data: () => ({
    search: "",
    representative_id: "",
    customer_type: "BUSINESS",
    SearchBy: "customer_name",
    current_view: "WITHOUT_SEARCHING",
    page: 1,
    pageCount: 1,
    tableHeight: 0,
    loading: false,
    renderComp: true,
    singleSelect: false,
    selected: [],
    GetAllCustomersData: [],
    GetAllServiceRepresentativeList: [],
    headers: [
      { text: "Customer", value: "customer_name", width: "25%" },
      {
        text: "Phone Number",
        value: "customer_primary_phone_number",
        width: "12%",
      },
      { text: "Address", value: "customer_address", width: "25%" },
      { text: "Customer ID", value: "customer_unique_id", width: "15%" },
      {
        text: "Tagged Technician",
        value: "primary_representative_details",
        width: "15%",
      },
    ],
    customer_type_items: ["INDIVIDUAL", "BUSINESS"],
    SearchByItems: [
      {
        text: "Contact Person",
        value: "customer_name",
      },
      {
        text: "Customer Name",
        value: "customer_company_name",
      },
      {
        text: "Customer Phone Number",
        value: "customer_primary_phone_number",
      },
      {
        text: "Customer Address",
        value: "customer_address",
      },
      {
        text: "Customer ID",
        value: "customer_unique_id",
      },
      {
        text: "Representative",
        value: "representative_id",
      },
    ],
    SnackBarComponent: {},
  }),
  watch: {
    current_view(val) {
      if (val == "WITHOUT_SEARCHING") {
        this.SearchBy = "customer_name";
        this.search = "";
        this.GetAllCustomersData = [];
        this.GetAllCustomersListMethod("ACTIVE", this.customer_type, undefined);
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllCustomersListMethod(
          "ACTIVE",
          this.customer_type,
          this.next_token
        );
      }
    },
    tagCustomersdilog(val) {
      if (val == true) {
        this.GetAllCustomerMethod((this.customer_status = "ACTIVE"));
        this.selected = this.StoreObj.customer_ids;
      }
    },
    searchCustomer(val) {
      if (val != undefined && val != null && val != "") {
        this.GetAllCustomerLookMethod(this.customer_type, val);
      }
    },
    customer_type() {
      this.GetAllCustomersData = [];
      this.GetAllCustomersListMethod("ACTIVE", this.customer_type, undefined);
    },
  },
  mounted() {
    console.log("PARTNER_STOREOBJ", this.StoreObj);
    this.GetAllServiceRepresentativeMethod("ACTIVE");
    this.tableHeight = window.innerHeight - 200;
    this.GetAllCustomersListMethod("ACTIVE", this.customer_type, undefined);
    // if (this.StoreObj.action == "TAG2") {
    this.selected =
      this.StoreObj.customer_ids != undefined &&
      this.StoreObj.customer_ids.length != 0
        ? this.StoreObj.customer_ids.map((val) => {
            return {
              customer_id: val,
            };
          })
        : [];
    // }
    // else if (this.StoreObj.action == "CUSTOMERTAGTODEALER") {
    //   this.selected =
    //     this.StoreObj.customer_ids != undefined &&
    //     this.StoreObj.customer_ids.length != 0
    //       ? this.StoreObj.customer_ids.map((val) => {
    //           return {
    //             customer_id: val,
    //           };
    //         })
    //       : [];
    // }
  },
  methods: {
    SearchDataMethod() {
      if (this.$refs.form.validate()) {
        if (this.SearchBy != "representative_id") {
          this.current_view = "WITH_SEARCH";
          this.GetAllCustomerBySearchMethod(
            "ACTIVE",
            this.search,
            this.SearchBy,
            this.customer_type
          );
        } else if (this.SearchBy == "representative_id") {
          this.current_view = "WITH_SEARCH";
          this.GetAllCustomerBySearchTechMethod(
            this.representative_id,
            this.customer_type
          );
        }
      }
    },
    opencustmeremmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    async tagCustomerTerritory() {
      if (this.StoreObj.action == "TAG2") {
        try {
          this.loading = true;
          var inputparams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            user_id: this.$store.getters.get_current_user_details.user_id,
            territory_id: this.StoreObj.territory_id,
            customer_ids: this.selected.map((val) => val.customer_id),
            module_name: "ENTERPRISE_CUSTOMER",
          };
          let result = await API.graphql(
            graphqlOperation(TagRequiredModuleToTerritories, {
              input: inputparams,
            })
          );
          var ResultObject = JSON.parse(
            result.data.TagRequiredModuleToTerritories
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
            this.opencustmeremmit((this.Toggle = 2));
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
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
      } else if (this.StoreObj.action == "CUSTOMERTAGTODEALER") {
        try {
          var inputParams = {
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            user_id: this.StoreObj.user_id,
            customer_ids: this.selected.map((val) => val.customer_id),
          };
          this.loading = true;
          let result = await API.graphql(
            graphqlOperation(TagCustomersToDealers, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.TagCustomersToDealers);
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
            this.opencustmeremmit((this.Toggle = 2));
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
      } else if (this.StoreObj.action == "SERVICE_PARTNER") {
        try {
          this.loading = true;
          const result = await API.graphql(
            graphqlOperation(TagCustomersToPartner, {
              input: {
                updater_user_id:
                  this.$store.getters.get_current_user_details.user_id,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                partner_user_id: this.StoreObj.partner_id,
                customer_ids: this.selected.map((val) => val.customer_id),
              },
            })
          );
          const ResultObject = JSON.parse(result.data.TagCustomersToPartner);
          if (ResultObject.status == "SUCCESS") {
            console.log("EXECUTING");
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: ResultObject.status_message,
              };
              this.renderComp = true;
            });
            setTimeout(() => {
              this.opencustmeremmit((this.Toggle = 2));
              this.loading = false;
            }, 2000);
          }
        } catch (error) {
          //
        }
      }
    },
  },
};
</script>
