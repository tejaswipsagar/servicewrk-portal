<template>
  <div>
    <v-dialog v-model="ViewTicketsDialog" persistent width="1030">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>View Tickets</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ViewTicketsDialogEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-tabs v-model="Tabmodel">
          <v-spacer />
          <v-btn
            small
            v-if="Tabmodel === 1"
            @click.stop="Tabmodel = 0"
            color="primary"
            class="mr-5 mt-2"
            ><v-icon class="mr-2">mdi-chevron-double-left</v-icon>back</v-btn
          ></v-tabs
        >

        <v-tabs-items v-model="Tabmodel">
          <v-tab-item>
            <v-data-table
              dense
              class="elevation-0 TableValFontsize"
              :headers="viewTicketsHeaders"
              :items="GetAllTicketDetailsList"
              @click:row="handleRowClick"
              :no-data-text="noDataText"
            >
              <template v-slot:[`item.ticket_created_on`]="{ item }">
                <div class="FontSize">
                  {{ new Date(item.ticket_created_on * 1000).toLocaleString() }}
                </div>
              </template>
              <template v-slot:[`item.ticket_id`]="{ item }">
                <div class="FontSize">
                  {{ item.custom_ticket_id || item.ticket_id }}
                </div>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item>
            <div class="mb-3">
              <ViewTicketDetails v-if="StoreObj" :StoreObj="StoreObj" />
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GetAllTicketDetails } from "@/mixins/ScheduleServices/GetTicketDetailsBasedonSerialNumber.js";
import ViewTicketDetails from "@/components/Tickets/Cards/ViewTicketDetails.vue";
export default {
  components: { ViewTicketDetails },
  props: { ViewTicketsDialog: Boolean, ActionObj: Object },
  mixins: [GetAllTicketDetails],
  data: () => ({
    Tabmodel: 0,
    singleExpand: false,
    currentView: "",
    StoreObj: {},
    noDataText: "No Data Available",
    viewTicketsHeaders: [
      {
        text: "Ticket ID",
        value: "ticket_id",
      },
      {
        text: "Ticket Status",
        value: "ticket_status",
      },
      {
        text: "Ticket Created On",
        value: "ticket_created_on",
      },
    ],
  }),
  watch: {
    async ViewTicketsDialog(val) {
      if (val == true) {
        await this.GetAllTicketDetailsMethod(
          this.ActionObj.machine_serial_number
        );
      }
    },
  },
  methods: {
    handleRowClick(item) {
      this.Tabmodel = 1;
      this.StoreObj = item;
    },
    ViewTicketsDialogEmit(Toggle) {
      this.Tabmodel = 0;
      this.ActionObj = {};
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
