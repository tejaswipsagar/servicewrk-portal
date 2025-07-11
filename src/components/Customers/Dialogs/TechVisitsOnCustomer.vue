<template>
  <div>
    <v-dialog :value="DialogTechVisitsBasedOnCustomer" persistent width="80%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mx-1">mdi-account-wrench</v-icon>
            Technician Visits
          </div>
          <v-spacer />
          <v-btn icon @click="DialogTechVisitsBasedOnCustomerEmit()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            class="mt-2"
            fixed-header
            :height="250"
            :headers="Headers"
            :loading="loading"
            hide-default-footer
            :items-per-page="500"
            :no-data-text="noDataText"
            :items="GetAllTechVisitsOnCustomerList"
          >
          <template v-slot:[`item.ticket_id`]='{ item }'>
            <div v-if="item.custom_ticket_id">
                {{ item.custom_ticket_id }}
            </div>
            <div v-else-if="item.ticket_id">
                {{ item.ticket_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.category_name`]='{ item }'>
            <div v-if="item.category_name">
                {{ item.category_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_name`]='{ item }'>
            <div v-if="item.service_name">
                {{ item.service_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_serial_number`]='{ item }'>
            <div v-if="item.service_serial_number">
                {{ item.service_serial_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.visited_on`]='{ item }'>
            <div v-if="item.visited_on">
                {{ new Date(item.visited_on * 1000).toLocaleDateString('en-GB')}}
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
import { GetAllTechVisitsOnCustomer } from "@/mixins/Customers/RepVisitsToCustomer.js";
export default {
  props: {
    StoreObjTechVisits: Object,
    DialogTechVisitsBasedOnCustomer: Boolean,
  },
  mixins: [GetAllTechVisitsOnCustomer],
  data: () => ({
    noDataText: "",
    loading: false,
    GetAllTechVisitsOnCustomerList: [],
    Headers: [
      { text: "Technician", value: "user_name" },
      { text: "Visited On", value: "visited_on" },
      { text: "Ticket ID", value: "ticket_id" },
      { text: "Category", value: "category_name" },
      { text: "Product", value: "service_name" },
      { text: "Serial Number", value: "service_serial_number" },
    ],
  }),
  watch: {
    DialogTechVisitsBasedOnCustomer(val) {
      if (val == true) {
        this.GetAllTechVisitsOnCustomerMethod(
          this.StoreObjTechVisits.customer_id
        );
      }
    },
  },
  methods: {
    DialogTechVisitsBasedOnCustomerEmit() {
      this.GetAllTechVisitsOnCustomerList = [];
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
