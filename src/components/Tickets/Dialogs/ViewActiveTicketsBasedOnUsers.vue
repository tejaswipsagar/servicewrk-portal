<template>
  <v-dialog
    :value="dialogViewActiveTicketsBasedOnUser"
    persistent
    max-width="80%"
  >
    <v-card>
      <v-toolbar dark dense class="elevation-0" color="primary">
        <div>Active Tickets on {{ this.StoreObj.user_name }}</div>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialogViewActiveTicketsBasedOnUserEmit()"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          class="elevation-0 mt-4"
          :headers="Headers"
          :items="TicketsListBasedOnUser"
          :loading="loading"
          :height="TableHeight"
          fixed-header
          :footer-props="{
            'items-per-page-options': [50, 100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.ticket_id`]="{ item }">
            <div class="FontSize" v-if="item.custom_ticket_id != undefined">
              {{ item.custom_ticket_id }}
            </div>
            <div class="FontSize" v-else-if="item.ticket_id != undefined">
              {{ item.ticket_id }}
            </div>
            <div class="FontSize" v-if="item.ticket_created_on != undefined">
              {{
                new Date(item.ticket_created_on * 1000).toLocaleString("en-GB")
              }}
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
            <div class="FontSize" v-if="item.service_name != undefined">
              {{ item.service_name }}
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ListActiveTicketsForDealerAndPatner } from "@/graphql/queries.js";
export default {
  props: {
    StoreObj: Object,
    dialogViewActiveTicketsBasedOnUser: Boolean,
  },
  data: () => ({
    noDataText: "",
    TableHeight: 0,
    loading: false,
    TicketsListBasedOnUser: [],
    Headers: [
      { text: "Ticket ID", value: "ticket_id" },
      { text: "Customer", value: "customer_company_name" },
      { text: "Product", value: "category_name" },
    ],
  }),
  watch: {
    dialogViewActiveTicketsBasedOnUser(val) {
      if (val == true) {
        this.TicketsListBasedOnUser = [];
        this.callApiMethod();
        this.TableHeight = window.innerHeight - 300;
      }
    },
  },
  methods: {
    async callApiMethod() {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListActiveTicketsForDealerAndPatner, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.StoreObj.user_id,
            },
          })
        );
        this.TicketsListBasedOnUser = JSON.parse(
          result.data.ListActiveTicketsForDealerAndPatner
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.TicketsListBasedOnUser = [];
        this.noDataText = error.errors[0].message;
      }
    },
    dialogViewActiveTicketsBasedOnUserEmit() {
      this.$emit("clicked");
    },
  },
};
</script>
