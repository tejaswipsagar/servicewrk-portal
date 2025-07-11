<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogSendForApprovals" persistent width="30%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-check-decagram-outline</v-icon> Send
            for Approvals
            <span v-if="StoreObj.quotation_display_id">{{
              StoreObj.quotation_display_id
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogSendForApprovalsEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <v-form ref="form">
            <v-text-field
              dense
              outlined
              class="FontSize"
              v-model="comments"
              label="Comments *"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading_btn"
            @click="sendForApprovalsMethod()"
          >
            <v-icon small>mdi-check-decagram-outline</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { SendQuotationToApprovals } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogSendForApprovals: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    renderComp: true,
    loading_btn: false,
    comments: "",
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async sendForApprovalsMethod() {
      if (this.$refs.form.validate()) {
        try {
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            user_id: this.$store.getters.get_current_user_details.user_id,
            quotation_id: this.StoreObj.quotation_id,
            ticket_id:
              this.StoreObj.ticket_id != undefined
                ? this.StoreObj.ticket_id
                : undefined,
            comments:
              this.comments != undefined &&
              this.comments != null &&
              this.comments != ""
                ? this.comments
                : undefined,
          };
          this.loading_btn = true;
          let result = await API.graphql(
            graphqlOperation(SendQuotationToApprovals, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.SendQuotationToApprovals);
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
            this.dialogSendForApprovalsEmit((this.Toggle = 2));
          }
          this.loading_btn = false;
        } catch (error) {
          this.loading_btn = false;
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
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Add Comments..!",
          };
          this.renderComp = true;
        });
      }
    },
    dialogSendForApprovalsEmit(Toggle) {
      this.comments = "";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
