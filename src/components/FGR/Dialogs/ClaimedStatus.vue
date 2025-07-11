<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="ClaimedStatusDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>{{ StoreObj.action }} Product Replacement</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ClaimedStatusDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-text-field
            v-model="comments"
            dense
            outlined
            label="Comments"
            class="FontSize"
          ></v-text-field>
          <!-- <div align="center" class="mt-4 font-weight-bold">
            Are you sure you want to Update to FGR as {{ StoreObj.action }}
          </div> -->
        </v-card-text>

        <!-- <v-card-actions align="center"> -->
        <div class="ml-2 mt-4" align="center">
          <v-btn
            :loading="btnLoading"
            small
            color="primary"
            class="white--text mb-3"
            @click="ClaimFgrMethod()"
            >{{
              StoreObj.action == "NOT_CLAIMED" ? "UnClaimed" : "Claimed"
            }}</v-btn
          >
        </div>
        <!-- </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { UpdateFGRClaimStatus } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: { ClaimedStatusDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    btnLoading: false,
    renderComp: true,
    rejectFgrComment: "",
    SnackBarComponent: {},
    comments: "",
  }),

  methods: {
    async ClaimFgrMethod() {
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(UpdateFGRClaimStatus, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              finished_goods_receipt_id:
                this.StoreObj.finished_goods_receipt_id,
              fgr_claim_status: this.StoreObj.action,
              comments: this.comments || undefined,
            },
          })
        );
        const response = JSON.parse(result.data.UpdateFGRClaimStatus);
        if (response.status === "SUCCESS") {
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
          this.ClaimedStatusDialogEmit(2);
          this.btnLoading = false;
        }
      } catch (error) {
        this.btnLoading = false;
        console.log("Error", error);
      }
    },

    ClaimedStatusDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
