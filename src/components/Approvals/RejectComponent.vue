<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="RejectComponentDialog" persistent width="400px">
      <v-card>
        <v-toolbar dense color="primary" class="white--text elevation-0">
          <v-icon color="white" class="mr-2">mdi-close-circle</v-icon>Product
          Fleet Approval
          <v-spacer />
          <v-btn
            x-small
            @click="RejectComponentEmit(1)"
            color="primary"
            depressed
            ><v-icon color="white">mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div class="mt-4" align="center">
          Reject Product Fleet Approval
          <span class="font-weight-bold primary--text">
            {{ StoreObj.setting_name }}</span
          >
        </div>
        <v-card-actions class="mt-4 pb-6">
          <v-spacer />
          <v-btn outlined small @click="RejectComponentEmit(1)">Cancel</v-btn>
          <v-btn
            depressed
            dark
            color="red"
            small
            :loading="loading"
            @click="RejectComponentsMethod()"
            >Reject</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  RejectRequestedProductToTag,
  UpdateWorkFlowStatusToApproved,
  ApprovalForEditProductDetails,
} from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    RejectComponentDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    RejectComponentEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    async RejectComponentsMethod() {
      var mutationname =
        this.StoreObj.action == "PRODUCT_TAGGING"
          ? RejectRequestedProductToTag
          : this.StoreObj.action == "REJECT_PRODUCT_TO_DB"
          ? UpdateWorkFlowStatusToApproved
          : ApprovalForEditProductDetails;
      var mutaionresult =
        this.StoreObj.action == "PRODUCT_TAGGING"
          ? "RejectRequestedProductToTag"
          : this.StoreObj.action == "REJECT_PRODUCT_TO_DB"
          ? "UpdateWorkFlowStatusToApproved"
          : "ApprovalForEditProductDetails";
      var inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        updater_user_id:
          this.StoreObj.action == "PRODUCT_TAGGING"
            ? this.$store.getters.get_current_user_details.user_id
            : undefined,
        user_id:
          this.StoreObj.action == "REJECT_PRODUCT_TO_DB" ||
          this.StoreObj.action == "REJECT_PRODUCT_FLEET_UPDATE"
            ? this.$store.getters.get_current_user_details.user_id
            : undefined,
        workflow_id: this.StoreObj.workflow_id,
        action_type:
          this.StoreObj.action == "REJECT_PRODUCT_TO_DB" ? "REJECT" : undefined,
        action:
          this.StoreObj.action == "REJECT_PRODUCT_FLEET_UPDATE"
            ? "REJECT"
            : undefined,
        ticket_id:
          this.StoreObj.action == "REJECT_PRODUCT_FLEET_UPDATE"
            ? this.StoreObj.ticket_id
            : undefined,
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutaionresult]);
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
          this.RejectComponentEmit((this.Toggle = 2));
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
  },
};
</script>
