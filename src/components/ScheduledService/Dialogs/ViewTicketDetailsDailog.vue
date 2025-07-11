<template>
  <div>
    <v-dialog persistent width="1100px" :value="viewTicketDetailsDailog">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">Ticket History Details</div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            large
            class="mr-n4"
            @click="viewTicketDetailsDailogemit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-data-table
              dense
              fixed-header
              :headers="headers"
              :loading="loading"
              :items="GetAllTicketDetailsList"
            >
              <template v-slot:[`item.ticket_id`]="{ item }">
                <div v-if="item.custom_ticket_id != undefined" class="FontSize">
                  {{ item.custom_ticket_id }}
                </div>
                <div v-else-if="item.ticket_id != undefined" class="FontSize">
                  {{ item.ticket_id }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ticket_created_on`]="{ item }">
                <div class="FontSize">
                  {{
                    new Date(item.ticket_created_on * 1000).toLocaleDateString(
                      "en-GB"
                    )
                  }}
                </div>
              </template>
              <template v-slot:[`item.ticket_status`]="{ item }">
                <div class="FontSize" v-if="item.ticket_status != undefined">
                  {{ item.ticket_status.replaceAll("_", " ") }}
                </div>
              </template>
            </v-data-table>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { GetAllTicketDetails } from "@/mixins/ScheduleServices/GetTicketDetailsBasedonSerialNumber.js";
export default {
  props: {
    StoreObj: Object,
    WorkFlowList: Array,
    StoreObjTicketDetails: Object,
    viewTicketDetailsDailog: Boolean,
  },
  mixins: [GetAllTicketDetails],
  data: () => ({
    loading: false,
    renderComp: true,
    showEditButton: false,
    GetAllTicketDetailsList: [],
    headers: [
      { text: "ID", value: "ticket_id" },
      { text: "Product", value: "service_name" },
      { text: "Sl No", value: "service_serial_number" },
      { text: "Created On", value: "ticket_created_on" },
      { text: "Ticket Status", value: "ticket_status" },
    ],
  }),
  watch: {
    viewTicketDetailsDailog(val) {
      if (val == true) {
        if (this.StoreObj.service_serial_number != undefined) {
          this.GetAllTicketDetailsMethod(this.StoreObj.service_serial_number);
        } else if (this.StoreObjTicketDetails != undefined) {
          this.GetAllTicketDetailsMethod(
            this.StoreObjTicketDetails.setting_name
          );
        }
      }
    },
  },
  mounted() {},
  methods: {
    viewTicketDetailsDailogemit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
