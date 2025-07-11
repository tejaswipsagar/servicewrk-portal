<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="RejectRFSDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-close-circle</v-icon
            ><span>Reject</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="RejectRFSDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-text-field
            v-model="comments"
            dense
            outlined
            label="Comments"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="rejectRFSMethod()"
            >Reject
            <v-icon small color="white" class="pl-1">mdi-close</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import {
  RejectRFSTicket,
  RejectDealerOrPartnerRFSTicket,
} from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    RejectRFSDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    comments: "",
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),
  watch: {
    RejectRFSDialog(val) {
      if (val) {
        console.log("REJECT_DIALOG", this.StoreObj);
      }
    },
  },
  methods: {
    async rejectRFSMethod() {
      const mutationname =
        this.StoreObj.selected_tab === "Dealer Initiated"
          ? RejectDealerOrPartnerRFSTicket
          : RejectRFSTicket;
      const mutationresult =
        this.StoreObj.selected_tab === "Dealer Initiated"
          ? "RejectDealerOrPartnerRFSTicket"
          : "RejectRFSTicket";
      const inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        ticket_id: this.StoreObj.ticket_id,
        comments: this.comments || undefined,
        updater_user_id: this.$store.getters.get_current_user_details.user_id,
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutationresult]);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.RejectRFSDialogEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
      }
    },
    RejectRFSDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
