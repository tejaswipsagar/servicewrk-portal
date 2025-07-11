<template>
  <div>
    <v-select
      dense
      outlined
      class="FontSize ma-4 mb-n6 WidthVariation1"
      :items="select_items"
      v-model="Select_Module"
      label="Select Module"
    >
    </v-select>
    <ActiveTickets v-if="Select_Module == 'ActiveTickets'" />
    <PartiallyClosedTickets v-if="Select_Module == 'PartiallyClosedTickets'" />
    <ClosedTickets v-if="Select_Module == 'ClosedTickets'" />
    <ScheduleServices v-if="Select_Module == 'ScheduleServices'" />
    <ProductFleet v-if="Select_Module == 'ProductFleets'" />
    <CustomersView v-if="Select_Module == 'Customers'" />
  </div>
</template>

<script>
import ProductFleet from "@/views/ChildHomePages/Products/ProductFleet2.vue";
import ActiveTickets from "@/views/ChildHomePages/Tickets/ActiveTickets.vue";
import ClosedTickets from "@/views/ChildHomePages/Tickets/ClosedTickets.vue";
import CustomersView from "@/views/ChildHomePages/Customers/CustomersView.vue";
import ScheduleServices from "@/views/ChildHomePages/ScheduleServices/ScheduleServices.vue";
import PartiallyClosedTickets from "@/views/ChildHomePages/Tickets/PartiallyClosedTickets.vue";
export default {
  components: {
    ProductFleet,
    ActiveTickets,
    ClosedTickets,
    CustomersView,
    ScheduleServices,
    PartiallyClosedTickets,
  },
  data: () => ({
    Select_Module: "ActiveTickets",
    select_items: [
      { text: "Active Tickets", value: "ActiveTickets" },
      { text: "Partially Closed Tickets", value: "PartiallyClosedTickets" },
      { text: "Closed Tickets", value: "ClosedTickets" },
      { text: "Schedule Services", value: "ScheduleServices" },
      { text: "Product Fleets", value: "ProductFleets" },
      { text: "Customers", value: "Customers" },
    ],
  }),
};
</script>

<style></style>
