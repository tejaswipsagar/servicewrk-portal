<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="CustomerLookupDialog" persistent max-width="700px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-magnify</v-icon
            ><span>Customer Lookup</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="CustomerLookupDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-data-table
            dense
            :headers="customerHeader"
            :items="multipleCustomerItems"
            class="TableValFontsize"
            @click:row="handleRowClick"
            hide-default-footer
          >
            <template v-slot:[`item.sl_no`]="{ item, index }">
              <div>
                {{ index + 1 }}
              </div>
            </template>
            <template v-slot:[`item.customer_company_name`]="{ item, index }">
              <div>
                {{ item.customer_company_name || "-" }}
              </div>
            </template>
            <template v-slot:[`item.customer_email_id`]="{ item }">
              <div>
                {{ item.customer_email_id || "-" }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { GetCustomerDetailsForPhoneNumber } from "@/graphql/queries.js";

import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    CustomerLookupDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    SnackBarComponent: {},
    customerHeader: [
      { text: "Sl No", value: "sl_no" },
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
        text: "Customer Email ID",
        value: "customer_email_id",
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
    multipleCustomerItems: [],
  }),

  watch: {
    async CustomerLookupDialog(val) {
      if (val) {
        try {
          const result = await API.graphql(
            graphqlOperation(GetCustomerDetailsForPhoneNumber, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                user_id: this.$store.getters.get_current_user_details.user_id,
                customer_contact_number: this.StoreObj.customer_contact_number,
              },
            })
          );
          const response = JSON.parse(
            result.data.GetCustomerDetailsForPhoneNumber
          ).data.Items;
          this.multipleCustomerItems = response;
          console.log("RESPONSE_CUST", response);
        } catch (error) {
          //
        }
      }
    },
  },

  methods: {
    handleRowClick(item) {
      this.CustomerLookupDialogEmit(2, item);
    },
    CustomerLookupDialogEmit(Toggle, row_item) {
      this.$emit("clicked", Toggle, row_item);
    },
  },
};
</script>
