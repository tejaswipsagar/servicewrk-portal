<template>
  <div>
    <v-dialog
      :value="confirmCreateSecondaryCustomerDailog"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Customer Already Exists</div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="confirmCreateSecondaryCustomerDailogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <div class="black--text">
            Customer with the phone number is already exists, do you want to add
            as Secondary Customer ?
          </div>
          {{ StoreObjCustomer }}
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            @click="confirmCreateSecondaryCustomerDailogEmit(1)"
            >No</v-btn
          >
          <v-btn
            small
            class="text-capitalize mr-2"
            color="primary"
            @click="confirmCreateSecondaryCustomerDailogEmit(2)"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObjCustomer: Object,
    confirmCreateSecondaryCustomerDailog: Boolean,
  },
  data: () => ({
    Toggle: 0,
  }),
  watch: {},
  methods: {
    confirmCreateSecondaryCustomerDailogEmit(Toggle, StoreObjCustomer) {
      this.$emit("clicked", Toggle, StoreObjCustomer);
    },
  },
};
</script>
