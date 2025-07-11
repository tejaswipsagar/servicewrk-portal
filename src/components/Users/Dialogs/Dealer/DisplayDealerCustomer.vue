<template>
  <div>
    <v-dialog :value="DealerCustomerLookupDialog" persistent max-width="800px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{ "mdi-magnify" }}</v-icon
            >Dealer Customer Lookup
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="DealerCustomerLookupDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-row justify="center" class="mt-1 mb-2"> </v-row>
        <v-card-text>
          <v-text-field
            dense
            outlined
            label="Search"
            class="FontSize"
            v-model="search"
            :rules="[(v) => !!v || 'Required']"
          >
            <template v-slot:prepend-inner>
              <v-icon>mdi-magnify</v-icon>
            </template>
          </v-text-field>
          <v-data-table
            dense
            height="260px"
            :loading="loading"
            class="elevation-0"
            hide-default-footer
            :items-per-page="50"
            :fixed-header="true"
            @click:row="checkItem"
            style="cursor: pointer"
            :items="dealerCustomerList"
            :headers="dealerCustomerHeaders"
            :search="search"
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
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { GetDealersOrPartnerCustomers } from "@/graphql/queries.js";
export default {
  props: {
    DealerCustomerLookupDialog: Boolean,
    DealerId: String,
  },

  data: () => ({
    loading: false,
    renderComp: true,
    search: "",
    SnackBarComponent: {},
    dealerCustomerList: [],

    dealerCustomerHeaders: [
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
  }),

  watch: {
    async DealerCustomerLookupDialog(val) {
      if (val) {
        console.log("DEALER_CUSTOMER_LOOKUP_DIALOG", this.DealerId);
        try {
          const customerResult = await API.graphql(
            graphqlOperation(GetDealersOrPartnerCustomers, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                user_id: this.DealerId,
              },
            })
          );
          console.log("CUSTOMER_RESULT", customerResult);
          this.dealerCustomerList = JSON.parse(
            customerResult.data.GetDealersOrPartnerCustomers
          ).data.items;
        } catch (error) {
          //
        }
      }
    },
  },

  methods: {
    checkItem(item) {
      this.DealerCustomerLookupDialogEmit(2, item);
    },
    DealerCustomerLookupDialogEmit(Toggle, item) {
      this.$emit("clicked", Toggle, item);
    },
  },
};
</script>
