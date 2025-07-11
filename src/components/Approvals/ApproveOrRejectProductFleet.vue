<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="DialogApproveOrRejectProductFleet"
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
          <v-btn
            icon
            @click="DialogApproveOrRejectProductFleetEmit((Toggle = 1))"
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
import { ApproveOrRejectProductFleetRequest } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    DialogApproveOrRejectProductFleet: Boolean,
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
      var mutationname = ApproveOrRejectProductFleetRequest;
      var mutationresult = "ApproveOrRejectProductFleetRequest";
      var inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        user_id: this.$store.getters.get_current_user_details.user_id,
        workflow_id: this.StoreObj.workflow_id,
        representative_id: this.StoreObj.initiator_user_id,
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
          this.DialogApproveOrRejectProductFleetEmit((this.Toggle = 2));
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
    DialogApproveOrRejectProductFleetEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
