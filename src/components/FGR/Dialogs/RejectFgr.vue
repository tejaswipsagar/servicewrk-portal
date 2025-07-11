<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="RejectFgrDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Reject FGR</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="RejectFgrDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pl-5">
          <v-form ref="form">
            <v-text-field
              v-model="rejectFgrComment"
              dense
              outlined
              label="Provide comment to reject*"
              class="mt-3"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
          </v-form>
          <!-- <div class="d-flex justify-center mt-4">
            <span
              >Do you want to reject<strong>
                {{ StoreObj.fgr_display_id }}</strong
              >?</span
            >
          </div> -->
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <div class="ml-2">
            <v-btn
              :loading="btnLoading"
              small
              color="red"
              class="white--text"
              @click="rejectFgrMethod()"
              >Reject<v-icon small class="pl-1">mdi-close</v-icon></v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { FgrApproval } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: { RejectFgrDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    btnLoading: false,
    renderComp: true,
    rejectFgrComment: "",
    SnackBarComponent: {},
  }),

  methods: {
    async rejectFgrMethod() {
      if (this.$refs.form.validate()) {
        try {
          this.btnLoading = true;
          const result = await API.graphql(
            graphqlOperation(FgrApproval, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                updater_user_id:
                  this.$store.getters.get_current_user_details.user_id,
                finished_goods_receipt_id:
                  this.StoreObj.finished_goods_receipt_id,
                action_type: "REJECT",
                comments: this.rejectFgrComment,
              },
            })
          );
          const response = JSON.parse(result.data.FgrApproval);
          if (response.status === "SUCCESS") {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.status_message,
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
            this.RejectFgrDialogEmit(2);
            this.btnLoading = false;
          }
        } catch (error) {
          this.btnLoading = false;
          console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly provide comment to reject the FGR!",
        };
        this.renderComp = false;

        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    RejectFgrDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style scoped>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
