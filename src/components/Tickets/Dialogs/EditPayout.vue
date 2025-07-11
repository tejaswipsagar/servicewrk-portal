<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="EditPayoutDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Edit Payout</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditPayoutDialogEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-text-field
              outlined
              rows="2"
              class="FontSize"
              label="Cost"
              v-model="cost"
            ></v-text-field>
            <v-text-field
              outlined
              rows="2"
              class="FontSize"
              label="GST"
              v-model="gst"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="btnLoader"
            color="primary"
            @click="savePayoutMethod()"
            class="white--text mb-2"
            >Save<v-icon class="pl-1" small>mdi-bookmark</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { updateServiceChargesInTicket } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";

export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    EditPayoutDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    btnLoader: false,
    renderComp: true,
    gst: "",
    cost: "",
    SnackBarComponent: {},
  }),
  watch: {
    async EditPayoutDialog(val) {
      if (val) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.cost = this.StoreObj.cost_for_ticket || "";
        this.gst = this.StoreObj.cost_configuration_gst || "";
      }
    },
  },
  methods: {
    async savePayoutMethod() {
      const costChanged =
        this.StoreObj.cost_for_ticket === this.cost ? false : true;
      const gstChanged =
        this.StoreObj.cost_configuration_gst === this.gst ? false : true;
      if (costChanged || gstChanged) {
        try {
          this.btnLoader = true;
          const result = await API.graphql(
            graphqlOperation(updateServiceChargesInTicket, {
              input: {
                user_id: this.$store.getters.get_current_user_details.user_id,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                ticket_id: this.StoreObj.ticket_id,
                cost_for_ticket: costChanged
                  ? parseFloat(parseFloat(this.cost).toFixed(2))
                  : undefined,
                cost_configuration_gst: gstChanged
                  ? parseFloat(parseFloat(this.gst).toFixed(2))
                  : undefined,
              },
            })
          );
          const response = JSON.parse(result.data.updateServiceChargesInTicket);
          if (response.status === "SUCCESS") {
            this.EditPayoutDialogEmit(2);
            this.btnLoader = false;
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
          }
          console.log("CHECK_EDIT_PAYOUT_RESPO", result);
        } catch (error) {
          this.btnLoader = false;
          // console.log(error);
        }
      } else {
        this.EditPayoutDialogEmit(1);
      }
      //
    },
    EditPayoutDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
