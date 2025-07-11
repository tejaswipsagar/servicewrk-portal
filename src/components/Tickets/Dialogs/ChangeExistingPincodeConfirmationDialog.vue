<template>
  <div>
    <v-dialog
      :value="dialogConfirmToChangeCustomerPincode"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Change Pincode</div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialogConfirmToChangeCustomerPincodeEmit((Toggle = 1), StoreObjPincode)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <v-row>
            <v-col cols="12" md="6" sm="12" xs="12">
              <div style="border: 1px solid black" class="pa-2">
                Customer Existing Pincode :
                {{ StoreObjPincode.existing_customer_pincode }}
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
              <div style="border: 1px solid black" class="pa-2">
                Customer New Pincode : {{ StoreObjPincode.new_pincode }}
              </div>
            </v-col>
          </v-row>
          <div class="text-center my-4">
            If you change the Customer PINCODE, The Tagged Territories of this
            customer will be changed, Still Do you want to change the pincode ?
          </div>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2 mt-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            outlined
            @click="dialogConfirmToChangeCustomerPincodeEmit((Toggle = 1), StoreObjPincode)"
            class="white--text mb-2 mr-2"
            >Cancel</v-btn
          >
          <v-btn
            small
            color="primary"
            @click="dialogConfirmToChangeCustomerPincodeEmit((Toggle = 2), StoreObjPincode)"
            class="white--text mb-2"
            >Change</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObjPincode: Object,
    dialogConfirmToChangeCustomerPincode: Boolean,
  },
  data: () => ({
    Toggle: 0,
  }),
  methods: {
    dialogConfirmToChangeCustomerPincodeEmit(Toggle, StoreObjPincode) {
      this.$emit("clicked", Toggle, StoreObjPincode);
    },
  },
};
</script>
