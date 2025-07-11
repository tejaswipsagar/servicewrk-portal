<template>
  <div>
    <TagProductFleetToCustomerFromCustomers
      :StoreObj="StoreObj"
      :StoreObj1="StoreObj1"
      :TagProductToCustomerFromCustomers="TagProductToCustomerFromCustomers"
      @clicked="TagProductToCustomerFromCustomersEmit"
    />
    <v-card flat>
      <v-toolbar dense class="elevation-0">
        <h3 class="ml-3">Untagged Product Fleet</h3>
        <v-spacer />
        <v-text-field
          dense
          outlined
          class="mt-7 mr-1 FontSize WidthVariation1"
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
                  <v-icon v-on="on">mdi-close</v-icon>
                </template>
                <span aria-label="clear">Clear</span>
              </v-tooltip>
            </v-btn>
          </template>
        </v-text-field>
        <v-btn
          dense
          small
          class="primary"
          @click="TagUntaggedProductsDailogEmit((Toggle = 1))"
        >
          <v-icon>mdi-chevron-left</v-icon>Back
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :page.sync="page"
          :headers="headers"
          :loading="loading"
          :items-per-page="50"
          hide-default-footer
          :height="TableHeight"
          @page-count="pageCount = $event"
          :items="GetAllListSerialNumbers"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div>
              {{ GetAllListSerialNumbers.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.setting_price`]="{ item }">
            <div
              class="FontSize"
              v-if="item.setting_price != undefined && item.setting_price != ''"
            >
              {{ item.setting_price }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.setting_description`]="{ item }">
            <div
              class="FontSize"
              v-if="
                item.setting_description != undefined &&
                item.setting_description != ''
              "
            >
              {{ item.setting_description }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="tagProductMethod(item)"
                  color="primary"
                  v-on="on"
                  small
                  class="mr-2"
                >
                  mdi-tag-plus
                </v-icon>
              </template>
              <span class="white--text"
                >Tag to {{ StoreObj.customer_name }}</span
              >
            </v-tooltip>
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
import { ListSerialNumber } from "@/mixins/ScheduleServices/ListSerialNumber.js";
import { GetAllSearchedSerialNumber } from "@/mixins/Product/ProductFleetSearch.js";
import TagProductFleetToCustomerFromCustomers from "@/components/Customers/Dialogs/TagProductFleetToCustomerFromCustomers.vue";
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [ListSerialNumber, GetAllSearchedSerialNumber],
  components: {
    TagProductFleetToCustomerFromCustomers,
  },
  data: () => ({
    search: "",
    page: 1,
    Toggle: 0,
    pageCount: 1,
    TableHeight: 0,
    loading: false,
    isSearching: false,
    TagProductToCustomerFromCustomers: false,
    GetAllListSerialNumbers: [],
    headers: [
      { text: "#", value: "sl_no" },
      { text: "Category", value: "category_name" },
      { text: "Product", value: "product_name" },
      { text: "Serial Number", value: "setting_name" },
      { text: "Price", value: "setting_price" },
      { text: "Description", value: "setting_description" },
      { text: "Actions", value: "actions", align: "center" },
    ],
    StoreObj1: {},
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
          "ACTIVE",
          this.Product_id == "ALL" ? undefined : this.Product_id,
          undefined,
          this.next_token,
          undefined
        );
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 240;
    this.GetAllListSerialNumberMethod(
      "ACTIVE",
      undefined,
      undefined,
      undefined,
      undefined
    );
  },
  methods: {
    tagProductMethod(item) {
      this.StoreObj1 = item;
      this.TagProductToCustomerFromCustomers = true;
    },
    TagProductToCustomerFromCustomersEmit(Toggle) {
      if (Toggle == 2) {
        this.GetAllListSerialNumbers = [];
        this.GetAllListSerialNumberMethod(
          "ACTIVE",
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
      this.TagProductToCustomerFromCustomers = false;
    },
    searchvalue(isSearching = true) {
      if (
        this.search != "" &&
        this.search != null &&
        this.search != undefined
      ) {
        (this.GetAllListSerialNumbers = []),
          setTimeout(() => {
            this.searchcustomerandserialNoMethod(
              "ACTIVE",
              this.search,
              "setting_name"
            );
          }, 200);
      } else {
        this.isSearching = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Type Something to Search..!",
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    abcsearch() {
      if (this.isSearching == true) {
        this.GetAllListSerialNumbers = [];
      }
      this.GetAllListSerialNumbers = [];
      this.GetAllListSerialNumberMethod(
        this.SettingStatus,
        undefined,
        undefined,
        undefined,
        undefined
      );
    },
    TagUntaggedProductsDailogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
