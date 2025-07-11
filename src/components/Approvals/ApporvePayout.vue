<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="ApprovePayout" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            {{ StoreObj.action === "APPROVE" ? "Approve" : "Reject" }} Payout
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ApprovePayoutEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-5 pb-0">
          <div v-if="StoreObj.action === 'APPROVE'">
            Do you want to approve
            <strong> {{ StoreObj.invoice_display_id }}</strong>
            ?
          </div>
          <div v-else>
            <v-text-field
              v-model="comment"
              label="Comment"
              dense
              outlined
              class="FontSize"
            ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="btnLoader"
            @click="approvePayoutMethod()"
            >{{ StoreObj.action }}
            <v-icon small class="pl-1">
              {{ StoreObj.action === "APPROVE" ? "mdi-check" : "mdi-close" }}
            </v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ApproveOrRejectPayment } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    ApprovePayout: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    btnLoader: false,
    renderComp: true,
    SnackBarComponent: {},
    comment: "",
  }),
  watch: {},
  methods: {
    async approvePayoutMethod() {
      try {
        this.btnLoader = true;
        const result = await API.graphql(
          graphqlOperation(ApproveOrRejectPayment, {
            input: {
              payment_id: this.StoreObj.payment_id,
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              approve_action: this.StoreObj.action,
              comments:
                this.StoreObj.action === "REJECT"
                  ? this.comment || undefined
                  : undefined,
            },
          })
        );
        const response = JSON.parse(result.data.ApproveOrRejectPayment);
        if (response.status === "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.status_message,
            };
            this.renderComp = true;
          });
          this.ApprovePayoutEmit(2);
          this.btnLoader = false;
        }
      } catch (error) {
        this.btnLoader = false;
        // /
      }
    },
    ApprovePayoutEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
