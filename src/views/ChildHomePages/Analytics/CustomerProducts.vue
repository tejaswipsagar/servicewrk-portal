<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Customer Products :
          {{ tagged_serial_numbers }}
        </div>
        <v-spacer />
        <v-select
          dense
          outlined
          label="Search By"
          class="ml-1 mr-1 mt-8 WidthVariation2 FontSize"
          :items="SearchByItems"
          item-text="text"
          item-value="value"
          v-model="SearchBy"
        >
        </v-select>
        <v-text-field
          dense
          outlined
          class="mt-0 ml-1 mt-8 mr-1 FontSize WidthVariation1"
          v-model="search"
          label="Search"
          prepend-inner-icon=""
        >
          <template v-slot:append>
            <v-btn
              icon
              small
              v-if="isSearching == false"
              @click="searchvalue((isSearching = true))"
              color="primary"
            >
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">mdi-magnify</v-icon>
                </template>
                <span>Click to Search</span>
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              small
              v-if="isSearching == true"
              @click="abcsearch((isSearching = false), (search = ''))"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on">mdi-close</v-icon>
                </template>
                <span aria-label="clear"> Clear</span>
              </v-tooltip>
            </v-btn>
          </template>
        </v-text-field>
        <!-- <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              class="gradient-bg white--text mt-2 ml-2"
              color="primary"
              @click="exporttoexcel"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip> -->
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :page.sync="page"
          :loading="loading"
          :headers="headers"
          hide-default-footer
          :items-per-page="50"
          :height="TableHeight"
          :no-data-text="noDataText"
          :items="GetAllListSerialNumbers"
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div>
              {{ GetAllListSerialNumbers.indexOf(item) + 1 }}
            </div>
          </template>
          <template
            v-for="(h, i) in headers"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <div :key="i">
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ header.text }}</span>
                </template>
                <span>{{ header.tooltip_text }}</span>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div
              class="FontSize"
              v-if="item.customer_company_name != undefined"
            >
              {{ item.customer_company_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.customer_name != undefined">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.category_name`]="{ item }">
            <div class="FontSize" v-if="item.category_name != undefined">
              {{ item.category_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.product_name != undefined">
              {{ item.product_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.setting_name`]="{ item }">
            <div class="FontSize" v-if="item.setting_name != undefined">
              {{ item.setting_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.setting_price != undefined">
              Price : {{ item.setting_price }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.product_purchased_on`]="{ item }">
            <div class="FontSize" v-if="item.product_purchased_on != undefined">
              {{ item.product_purchased_on }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.invoice_date != undefined">
              Invoice : {{ item.invoice_date }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.support_type`]="{ item }">
            <div class="FontSize" v-if="item.support_type != undefined">
              {{ item.support_type }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.warranty_type != undefined">
              {{ item.warranty_type }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.warranty_start_date`]="{ item }">
            <div class="FontSize" v-if="item.warranty_start_date != undefined">
              {{ item.warranty_start_date }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.warranty_end_date != undefined">
              {{ item.warranty_end_date }}
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
  </div>
</template>
<script>
import Vue from "vue";
var xlsx = require("json-as-xlsx");
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { ListSerialNumber } from "@/mixins/ScheduleServices/ListSerialNumber.js";
import { GetAllTaggedTerritories } from "@/mixins/Users/GetAllTaggedTerritories.js";
import { GetAllSearchedSerialNumber } from "@/mixins/Product/ProductFleetSearch.js";
export default {
  mixins: [
    ListSerialNumber,
    GetAllTaggedTerritories,
    GetAllSearchedSerialNumber,
  ],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    overlay: false,
    loading: false,
    renderComp: true,
    isSearching: false,
    dialogAddUser: false,
    search: "",
    noDataText: "",
    CustomerName: "ALL",
    customer_type: "BUSINESS",
    tagged_serial_numbers: "",
    SearchBy: "customer_name",
    StoreObj: {},
    StoreObjUser: {},
    SnackBarComponent: {},
    GetAllListSerialNumbers: [],
    SearchByItems: [
      { text: "Serial Number", value: "setting_name" },
      { text: "Contact Person", value: "customer_name" },
      { text: "Customer", value: "customer_company_name" },
    ],
    customer_type_items: [
      { text: "INDIVIDUAL", value: "INDIVIDUAL" },
      { text: "BUSINESS", value: "BUSINESS" },
    ],
    headers: [
      {
        text: "#",
        value: "sl_no",
        width: "8%",
        tooltip_text: "Serail Number",
      },
      {
        text: "Customer",
        value: "customer_company_name",
        tooltip_text: "Customer & Contact Person",
        width: "20%",
      },
      {
        text: "Category",
        value: "category_name",
        tooltip_text: "Category & Product",
        width: "15%",
      },
      {
        text: "Serial Number",
        value: "setting_name",
        tooltip_text: "Serial Number",
        width: "14%",
      },
      {
        text: "Installation",
        value: "product_purchased_on",
        tooltip_text: "Installation Date",
        width: "15%",
      },
      {
        text: "Support",
        value: "support_type",
        width: "15%",
        tooltip_text: "Support",
      },
      {
        text: "Support Date",
        value: "warranty_start_date",
        width: "10%",
        tooltip_text: "Support Start, End Dates",
      },
    ],
    columnName: [
      { label: "Customer", value: "customer_company_name" },
      { label: "Contact Person", value: "customer_name" },
      {
        label: "Category",
        value: "category_name",
      },
      {
        label: "Product",
        value: "product_name",
      },
      { label: "Serial Number", value: "setting_name" },
      { label: "Price", value: "setting_price" },
      { label: "Description", value: "setting_description" },
      { label: "Invoice Number", value: "invoice_number" },
      { label: "Invoice Date", value: "invoice_date" },
      { label: "Installation Date", value: "product_purchased_on" },
      { label: "Support", value: "support_type" },
      { label: "Support Type", value: "warranty_type" },
      { label: "Support Start Date", value: "warranty_start_date" },
      { label: "Support End Date", value: "warranty_end_date" },
    ],
  }),
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllListSerialNumberMethod(
          "TAGGED",
          this.Product_id == "ALL" ? undefined : this.Product_id,
          undefined,
          this.next_token,
          undefined
        );
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.user_type_view = "";
    this.GetAllListSerialNumberMethod(
      "TAGGED",
      undefined,
      undefined,
      undefined,
      undefined
    );
  },
  methods: {
    abcsearch() {
      this.GetAllListSerialNumbers = [];
      this.GetAllListSerialNumberMethod(
        "TAGGED",
        undefined,
        undefined,
        undefined,
        undefined
      );
    },
    searchvalue(isSearching = true) {
      if (this.search != "") {
        (this.GetAllListSerialNumbers = []),
          setTimeout(() => {
            this.searchcustomerandserialNoMethod(
              "TAGGED",
              this.search,
              this.SearchBy
            );
          }, 200);
      } else {
        this.isSearching = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Type Something to search ...!",
          };
          this.renderComp = true;
        });
      }
    },
    ClearFilterMethod() {
      this.SearchBy = "";
      this.search = "";
      this.Current_Filter = "WITHOUT_SEARCH";
      this.GetAllListSerialNumberMethod(
        "TAGGED",
        undefined,
        undefined,
        undefined,
        undefined
      );
    },
    exporttoexcel() {
      let data = [
        {
          sheet: "Customer Products",
          columns: this.columnName,
          content: this.GetAllListSerialNumbers,
        },
      ];
      let settings = {
        fileName: "Customer Products",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
  },
};
</script>

<style></style>
