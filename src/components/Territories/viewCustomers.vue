<template>
  <div>
    <v-dialog :value="viewCustomerdialog" persistent max-width="80%">
      <v-card>
        <v-toolbar dense color="primary" class="elevation-0">
          <v-icon small dark>mdi-eye</v-icon>
          <div class="ml-2 white--text">
            View Customers to
            {{ StoreObj.territory_name }}
          </div>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="openemmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-data-table
          dense
          :headers="headers"
          :loading="loading"
          :items="customerList"
        >
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div
              class="FontSize"
              v-if="item.customer_company_name != undefined"
            >
              {{ item.customer_company_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_name`]="{ item }">
            <div class="FontSize" v-if="item.customer_name != undefined">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_primary_contact_number`]="{ item }">
            <div
              class="FontSize"
              v-if="item.customer_primary_contact_number != undefined"
            >
              {{ item.customer_primary_contact_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_address`]="{ item }">
            <div class="FontSize" v-if="item.customer_address != undefined">
              {{ item.customer_address }}
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ListTaggedItemsToTerritory } from "@/graphql/queries.js";
export default {
  props: {
    StoreObj: Object,
    viewCustomerdialog: Boolean,
  },
  data: () => ({
    loading: false,
    headers: [
      { text: "Customer", value: "customer_company_name", width: "23%" },
      { text: "Contact person", value: "customer_name", width: "23%" },
      {
        text: "Contact No.",
        value: "customer_primary_contact_number",
        width: "14%",
      },
      { text: "Address", value: "customer_address", width: "40%" },
    ],
    customerList: [],
  }),
  watch: {
    viewCustomerdialog(val) {
      if (val == true) {
        this.viewcustomer();
      }
    },
  },
  methods: {
    openemmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    async viewcustomer() {
      try {
        this.overlay = true;
        this.loading = true;
        this.customerList = [];
        let result = await API.graphql(
          graphqlOperation(ListTaggedItemsToTerritory, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              territory_id: this.StoreObj.territory_id,
              module_name: "ENTERPRISE_CUSTOMER",
            },
          })
        );
        var StoreArray = JSON.parse(result.data.ListTaggedItemsToTerritory);
        this.customerList = StoreArray.data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.NoData = error.errors[0].message;
      }
    },
  },
};
</script>
