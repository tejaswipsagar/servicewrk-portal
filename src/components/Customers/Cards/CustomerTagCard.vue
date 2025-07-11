<template>
  <v-card flat>
    <v-tabs
      class="ma-2"
      v-model="tab"
      color="primary"
      background-color="transparent"
      style="border-bottom: solid 1px gray"
    >
      <v-tab>Customer Details</v-tab>
      <v-tab>Edit Customer</v-tab>
      <v-tab v-show="taggedProductCond">Tagged Products</v-tab>
      <v-tab>Multiple Locations</v-tab>
      <v-toolbar dense class="elevation-0">
        <v-spacer /><v-spacer />
        <v-btn small color="primary" @click="EmitTab()"
          ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
        >
      </v-toolbar>
    </v-tabs>
    <v-card flat v-if="tab == 0">
      <ViewCustomerDetails :StoreObj="StoreObj" />
    </v-card>
    <v-card flat v-if="tab == 1">
      <CreateCustomersCard :StoreObj="StoreObj" />
    </v-card>
    <v-card flat v-if="tab == 2">
      <TagProductsCard
        :StoreObj="StoreObj"
        :GetAllCustomersData="GetAllCustomersData"
      />
    </v-card>
    <v-card flat v-if="tab == 3">
      <AddMultipleLocationsDialogForCustomersTab :StoreObj="StoreObj" />
    </v-card>
  </v-card>
</template>
<script>
import TagProductsCard from "@/components/Customers/Cards/TagProductsCard.vue";
import CreateCustomersCard from "@/components/Customers/Cards/CreateCustomersCard.vue";
import ViewCustomerDetails from "@/components/Customers/Cards/ViewCustomerDetails.vue";
import AddMultipleLocationsDialogForCustomersTab from "@/components/Customers/Dialogs/AddMultipleLocationsDialogForCustomersTab.vue";
export default {
  components: {
    TagProductsCard,
    ViewCustomerDetails,
    CreateCustomersCard,
    AddMultipleLocationsDialogForCustomersTab,
  },
  props: {
    StoreObj: Object,
  },
  data() {
    return {
      Toggle: 0,
      tab: null,
      current_view: "TAG",
      GetAllCustomersData: [],
    };
  },
  computed: {
    taggedProductCond() {
      const userDetails = this.$store.getters.get_current_user_details;
      const userType = userDetails.user_type;
      if (userType === "DEALER_OWNER" || userType === "DEALER_AGENT") {
        const isDisabled = userDetails.is_customer_tagged_product_tab_visible;
        return isDisabled ?? true;
      }
      return true;
    },
  },
  methods: {
    EmitTab() {
      this.$emit("clicked");
    },
  },
};
</script>
