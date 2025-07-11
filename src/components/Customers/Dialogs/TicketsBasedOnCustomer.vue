<template>
  <div>
    <v-dialog :value="DialogTicketsBasedOnCustomer" persistent width="80%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mx-1">mdi-ticket</v-icon>
            <span v-if="this.StoreObjTickets.action == 'ACTIVE_TICKETS'">
              Active Tickets on {{ this.StoreObjTickets.customer_name }}
            </span>
            <span v-else
              >Closed Tickets on
              {{ this.StoreObjTickets.customer_name }}
            </span>
          </div>
          <v-spacer />
          <v-btn icon @click="DialogTicketsBasedOnCustomerEmit()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            class="mt-2"
            dense
            :headers="
              this.StoreObjTickets.action == 'ACTIVE_TICKETS'
                ? Headers.filter((item) => item.text != 'Closed On')
                : Headers
            "
            fixed-header
            :items="
              this.StoreObjTickets.action == 'ACTIVE_TICKETS'
                ? this.StoreObjTickets.customer_open_tickets
                : this.StoreObjTickets.customer_close_tickets
            "
            no-data-text="No Tickets Found"
            :height="250"
            hide-default-footer
            :items-per-page="500"
          >
            <template v-slot:[`item.ticket_id`]="{ item }">
              <div class="FontSize" v-if="item.custom_ticket_id">
                {{ item.custom_ticket_id }}
              </div>
              <div v-else-if="item.ticket_id" class="FontSize">
                {{ item.ticket_id }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.representative_name`]="{ item }">
              <div v-if="item.representative_name" class="FontSize">
                {{ item.representative_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.category_name`]="{ item }">
              <div class="FontSize" v-if="item.category_name">
                {{ item.category_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.service_name`]="{ item }">
              <div class="FontSize" v-if="item.service_name">
                {{ item.service_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.ticket_created_on`]="{ item }">
              <div class="FontSize" v-if="item.ticket_created_on">
                {{
                  new Date(item.ticket_created_on * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.ticket_closed_time`]="{ item }">
              <div class="FontSize" v-if="item.ticket_closed_time">
                {{
                  new Date(item.ticket_closed_time * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
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
export default {
  props: {
    StoreObjTickets: Object,
    DialogTicketsBasedOnCustomer: Boolean,
  },
  data: () => ({
    Headers: [
      { text: "Ticket ID", value: "ticket_id" },
      { text: "Representative", value: "representative_name" },
      { text: "Category", value: "category_name" },
      { text: "Product", value: "service_name" },
      { text: "Created On", value: "ticket_created_on" },
      { text: "Closed On", value: "ticket_closed_time" },
    ],
  }),
  methods: {
    DialogTicketsBasedOnCustomerEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
