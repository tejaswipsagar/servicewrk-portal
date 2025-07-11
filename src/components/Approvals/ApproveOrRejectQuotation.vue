<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="DialogApproveOrRejectQuotation"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.action == "APPROVE"
                ? "mdi-check-outline"
                : "mdi-close-outline"
            }}</v-icon
            ><span
              >{{ StoreObj.action == "APPROVE" ? "Approve " : "Reject " }}
            </span>
            <span>{{ StoreObj.setting_name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="DialogApproveOrRejectQuotationEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.action == 'APPROVE' ? 'green' : 'red'"
            >{{
              StoreObj.action == "APPROVE"
                ? "mdi-check-outline"
                : "mdi-close-outline"
            }}</v-icon
          >
          <div>
            Are you sure you want to
            <span
              v-text="StoreObj.action == 'APPROVE' ? 'Approve' : 'Reject'"
            ></span>
            ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="approveOrRejectMethod()"
            ><span
              v-text="StoreObj.action == 'APPROVE' ? 'Approve' : 'Reject'"
            ></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import {
  ApproveOrRejectQuotation,
  AproveOrRejectQuotationComponentRequest,
} from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    DialogApproveOrRejectQuotation: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async approveOrRejectMethod() {
      var mutationname =
        this.StoreObj.workflow_type == "COMPONENT_QUOTATION"
          ? ApproveOrRejectQuotation
          : AproveOrRejectQuotationComponentRequest;
      var mutationresult =
        this.StoreObj.workflow_type == "COMPONENT_QUOTATION"
          ? "ApproveOrRejectQuotation"
          : "AproveOrRejectQuotationComponentRequest";
      var inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        user_id:
          this.StoreObj.workflow_type == "COMPONENT_QUOTATION"
            ? this.$store.getters.get_current_user_details.user_id
            : undefined,
        updater_user_id:
          this.StoreObj.workflow_type != "COMPONENT_QUOTATION"
            ? this.$store.getters.get_current_user_details.user_id
            : undefined,
        workflow_id: this.StoreObj.workflow_id,
        quotation_id: this.StoreObj.quotation_id,
        action: this.StoreObj.action == "APPROVE" ? "APPROVE" : "REJECT",
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
          this.DialogApproveOrRejectQuotationEmit((this.Toggle = 2));
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
    DialogApproveOrRejectQuotationEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
