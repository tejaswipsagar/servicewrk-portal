<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="ActivatedeactivatePurchaseOrderDialog"
      persistent
      :width="500"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            {{
              StoreObj.purchase_order_status === "ACTIVE"
                ? "Deactivate"
                : "Activate"
            }}
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="ActivatedeactivatePurchaseOrderDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          Do you want to
          {{
            StoreObj.purchase_order_status === "ACTIVE"
              ? "deactivate"
              : "activate"
          }}
          ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="ActivateDeactivateMethod()" color="primary">
            {{
              StoreObj.purchase_order_status === "ACTIVE"
                ? "deactivate"
                : "Activate"
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { ActivateOrDeactivatePurchaseOrderToVendor } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";

export default {
  props: { ActivatedeactivatePurchaseOrderDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    customerEmailID: "",
    comments: "",
    SnackBarComponent: {},
  }),
  methods: {
    async ActivateDeactivateMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(ActivateOrDeactivatePurchaseOrderToVendor, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              purchase_order_id: this.StoreObj.purchase_order_id,
              action_type:
                this.StoreObj.purchase_order_status === "ACTIVE"
                  ? "DEACTIVATE"
                  : "ACTIVATE",
            },
          })
        );
        const response = JSON.parse(
          result.data.ActivateOrDeactivatePurchaseOrderToVendor
        );
        if (response.status === "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Updated successfully!",
          };
          this.ActivatedeactivatePurchaseOrderDialogEmit(2);
        }
      } catch (error) {
        console.log("Error", error);
      }
    },
    ActivatedeactivatePurchaseOrderDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
