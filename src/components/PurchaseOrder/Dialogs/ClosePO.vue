<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="ClosePoDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Close Purchase Order</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ClosePoDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-text-field v-model="comments" dense outlined label="Comments">
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :loading="btnLoading" @click="closePoMethod()" color="primary"
            >Close<v-icon size="15" class="pl-1">mdi-close</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { UpdatePurchaseOrderClosedDetails } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: { ClosePoDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    btnLoading: false,
    renderComp: true,
    SnackBarComponent: {},
    comments: "",
  }),
  methods: {
    async closePoMethod() {
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(UpdatePurchaseOrderClosedDetails, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              purchase_order_id: this.StoreObj.purchase_order_id,
              comments: this.comments,
            },
          })
        );
        const response = JSON.parse(
          result.data.UpdatePurchaseOrderClosedDetails
        );
        if (response.status === "SUCCESS") {
          this.ClosePoDialogEmit(2);
          this.btnLoading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: response.status_message,
          };
          //   this.renderComp = false;
          //   this.$nextTick(() => {

          //     this.renderComp = true;
          //   });
        }
      } catch (error) {
        console.log("Error", error);
        this.btnLoading = false;
      }
    },

    ClosePoDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
