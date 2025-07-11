<template>
  <div>
    <dialogVisitDetails
      :StoreObj="StoreObj"
      :dialogVisitDetails="dialogVisitDetails"
      :markers="markers"
      @clicked="dialogEmitVisitDetails"
      :StoreObjNew="StoreObjNew"
    />
    <v-card-text>
      <v-toolbar dense class="elevation-0 mt-n3">
        <h2>Visit Details</h2>
        <v-spacer></v-spacer>
        <v-btn small color="primary" @click="VisitDetailsEmit()">
          <v-icon>mdi-chevron-double-left</v-icon> Back
        </v-btn>
      </v-toolbar>
      <v-card class="elevation-0">
        <v-data-table
          dense
          class="elevation-0"
          :headers="visitDetailsHeaders"
          :items="StoreObj.visit_details"
        >
          <template v-slot:[`item.ticket_id`]="{ item }">
            <div
              class="FontSize"
              v-if="
                item.custom_ticket_id != undefined &&
                item.custom_ticket_id != '-'
              "
            >
              {{ item.custom_ticket_id }}
            </div>
            <div class="FontSize" v-else-if="item.ticket_id != undefined">
              {{ item.ticket_id }}
            </div>
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
          <template v-slot:[`item.service_serial_number`]="{ item }">
            <div class="FontSize" v-if="item.service_serial_number">
              {{ item.service_serial_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div class="FontSize" v-if="item.customer_company_name">
              {{ item.customer_company_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_name`]="{ item }">
            <div class="FontSize" v-if="item.customer_name">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_visits`]="{ item }">
            <div v-if="item.ticket_visits != undefined">
              {{ item.ticket_visits.length }}
              <v-icon small color="primary" @click="openVisitDetails(item)"
                >mdi-information</v-icon
              >
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-card>
    </v-card-text>
  </div>
</template>
<script>
import dialogVisitDetails from "@/components/Analytics/Dialogs/VisitDetailsDialog.vue";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    dialogVisitDetails,
  },
  data: () => ({
    dialogVisitDetails: false,
    StoreObjNew: {},
    markers: [],
    visitDetailsHeaders: [
      { text: "Ticket ID", value: "ticket_id" },
      { text: "Category", value: "category_name" },
      { text: "Product", value: "service_name" },
      { text: "Serial Number", value: "service_serial_number" },
      { text: "Customer", value: "customer_company_name" },
      { text: "Contact Person", value: "customer_name" },
      { text: "Details", value: "ticket_visits" },
    ],
  }),
  methods: {
    openVisitDetails(item) {
      this.StoreObjNew = item;
      this.markers = [];
      this.markers = this.StoreObjNew.ticket_visits;
      this.dialogVisitDetails = true;
    },
    VisitDetailsEmit() {
      this.$emit("clicked");
    },
    dialogEmitVisitDetails(Toggle) {
      if (Toggle == 1) {
        this.dialogVisitDetails = false;
      }
    },
  },
};
</script>

<style></style>
