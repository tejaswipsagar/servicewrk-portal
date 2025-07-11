<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="SelectVendorsDialog" persistent :width="700">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Select Vendors</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="SelectVendorsDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-row>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pb-0">
              <v-text-field
                v-model="categoryName"
                dense
                outlined
                label="Category Name"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pb-0">
              <v-text-field
                v-model="componentName"
                dense
                outlined
                label="Component Name"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pb-0">
              <v-text-field
                v-model="productName"
                dense
                outlined
                label="Product Name"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="12" md="12" sm="12" xs="12" class="pt-0">
              <div class="d-flex justify-center">
                <div>
                  <v-select
                    v-model="selectedTerritories"
                    :items="territoryList"
                    item-text="territory_name"
                    item-value="territory_id"
                    multiple
                    dense
                    outlined
                    label="Select Territories"
                  ></v-select>
                </div>
                <div>
                  <v-btn icon @click="searchVendorsMethod(), (loader = true)"
                    ><v-icon color="primary" small>mdi-magnify</v-icon></v-btn
                  >
                </div>
              </div>
              <div class="d-flex justify-center">
                <v-progress-circular
                  v-if="loader"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
            </v-col>
          </v-row>
          <v-data-table
            v-if="NoDataText !== '' || vendorsList.length > 0"
            dense
            :headers="vendorHeader"
            :items="vendorsList"
            :no-data-text="NoDataText"
            @click:row="handleRowClick"
          >
            <template v-slot:[`item.vendor_name`]="{ item }">
              <div class="FontSize">
                {{ item.vendor_name }}
              </div>
            </template>
            <template v-slot:[`item.vendor_email_id`]="{ item }">
              <div class="FontSize">
                {{ item.vendor_email_id }}
              </div>
            </template>
            <template v-slot:[`item.price`]="{ item }">
              <div class="FontSize">
                {{ item.price }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { ListTerritoriesAndPincodes } from "@/graphql/queries.js";
import { ListAllVendorDetails } from "@/mixins/Approvals/GetVendorDetails.js";
export default {
  mixins: [ListAllVendorDetails],
  props: { SelectVendorsDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    NoDataText: "",
    categoryName: "",
    componentName: "",
    productName: "",
    territoryList: [],
    selectedTerritories: "",
    vendorsList: [],
    vendorHeader: [
      { text: "Vendor Name", value: "vendor_name" },
      { text: "Vendor Email ID", value: "vendor_email_id" },
      { text: "Price", value: "price" },
    ],
    SnackBarComponent: {},
    loader: false,
  }),
  watch: {
    SelectVendorsDialog(val) {
      if (val) {
        this.territoryListMethod();
        this.categoryName = this.StoreObj.category_name || "";
        this.componentName = this.StoreObj.component_name || "";
        this.productName = this.StoreObj.product_name || "";
      }
    },
  },
  methods: {
    async territoryListMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(ListTerritoriesAndPincodes, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              territory_status: "ACTIVE",
              territory_type: "NON_GEO_BASED",
              required_type: "TERRITORY",
            },
          })
        );
        const response = JSON.parse(result.data.ListTerritoriesAndPincodes).data
          .Items;
        this.territoryList = response;
      } catch (error) {
        console.log("Error", error);
      }
    },

    async searchVendorsMethod() {
      this.vendorsList = await this.ListAllVendorDetailsMethod(
        this.StoreObj.category_id,
        this.StoreObj.service_id,
        this.StoreObj.component_id,
        this.StoreObj.customer_pincode,
        this.selectedTerritories
      );
      if (this.vendorsList.length > 0) {
        this.loader = false;
      }
    },

    handleRowClick(item) {
      this.SelectVendorsDialogEmit(2, item);
    },

    SelectVendorsDialogEmit(Toggle, item) {
      this.$emit("clicked", Toggle, item);
      this.selectedTerritories = "";
      this.vendorsList = [];
      this.NoDataText = "";
    },
  },
};
</script>
