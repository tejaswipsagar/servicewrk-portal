<template>
  <div>
    <ProductFleetAtRepForDashboard
      :DialogProductFleetAtRep="DialogProductFleetAtRep"
      :StoreObj="StoreObj"
      @clicked="DialogProductFleetAtRepEmit"
    />
    <v-toolbar dense>
      <h3 class="ml-6">Product Fleet at Representatives</h3>
      <v-spacer />
      <v-btn
        small
        class="primary white--text"
        @click="repProductFleetsDialogEmit()"
      >
        <v-icon>mdi-chevron-double-left</v-icon>Back
      </v-btn>
    </v-toolbar>
    <v-card class="pa-4 elevation-0">
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          fixed-header
          :loading="loading"
          :headers="headers"
          :height="TableHeight"
          :no-data-text="noDataText"
          :items="GetProductFleetDashboardList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize">
              {{ item.user_name }}
            </div>
          </template>
          <template v-slot:[`item.user_full_number`]="{ item }">
            <div class="FontSize">
              {{ item.user_full_number }}
            </div>
          </template>
          <template v-slot:[`item.repStock`]="{ item }">
            <div v-if="item.repStock != undefined">
              <div class="FontSize">
                {{ item.repStock.length }}
                <v-icon
                  @click="checkItem(item, 'ACTIVE_PRODUCT_FLEET')"
                  small
                  color="primary"
                  >mdi-information</v-icon
                >
              </div>
            </div>
          </template>
          <template v-slot:[`item.customer`]="{ item }">
            <div v-if="item.customer != undefined">
              <div class="FontSize">
                {{ item.customer.length }}
                <v-icon
                @click="checkItem(item, 'REPLACED_PRODUCT_FLEET')"
                small color="primary">mdi-information</v-icon>
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { GetProductFleetDashboard } from "@/mixins/Dashboard/GetProductFleetDashboard.js";
import ProductFleetAtRepForDashboard from "@/components/Dashboard/ProductFleetAtRepForDashboard.vue";
export default {
  mixins: [GetProductFleetDashboard],
  components: {
    ProductFleetAtRepForDashboard,
  },
  data: () => ({
    search: "",
    noDataText: "",
    TableHeight: 0,
    StoreObj: {},
    GetProductFleetDashboardList: [],
    loading: false,
    DialogProductFleetAtRep: false,
    headers: [
      {
        text: "Name",
        value: "user_name",
      },
      {
        text: "Phone Number",
        value: "user_full_number",
      },
      { text: "Active", value: "repStock" },
      { text: "Replaced", value: "customer" },
    ],
  }),
  mounted() {
    this.GetProductFleetDashboardMethod();
    this.TableHeight = window.innerHeight - 200;
  },
  methods: {
    repProductFleetsDialogEmit() {
      this.$emit("clicked");
    },
    DialogProductFleetAtRepEmit() {
      this.DialogProductFleetAtRep = false;
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
        if (action == "ACTIVE_PRODUCT_FLEET") {
        this.DialogProductFleetAtRep = true;
      } else if (action == 'REPLACED_PRODUCT_FLEET') {
        this.DialogProductFleetAtRep = true;
      }
    },
  },
};
</script>
