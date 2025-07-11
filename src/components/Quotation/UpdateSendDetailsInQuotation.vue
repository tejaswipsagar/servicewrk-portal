<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogUpdateSendDetails" persistent width="30%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-share</v-icon> Update Send Details
            <span v-if="StoreObj.quotation_display_id">{{
              StoreObj.quotation_display_id
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogUpdateSendDetailsEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <v-form ref="form">
            <v-select
              label="Shared By *"
              v-model="shared_through"
              class="FontSize"
              dense
              outlined
              :items="shared_through_items"
              :rules="[(v) => !!v || 'Required']"
            ></v-select>
            <v-text-field
              dense
              outlined
              class="FontSize"
              v-model="sent_comments"
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
            @click="updateSendDetailsMethod()"
          >
            <v-icon small>mdi-update</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { SendQuotationPdfToCustomer } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogUpdateSendDetails: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    renderComp: true,
    loading_btn: false,
    sent_comments: "",
    customer_email_id: "",
    shared_through: "WHATSAPP",
    SnackBarComponent: {},
    shared_through_items: ["WHATSAPP", "MAIL"],
  }),
  methods: {
    async updateSendDetailsMethod() {
      if (this.$refs.form.validate()) {
        try {
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            sender_user_id:
              this.$store.getters.get_current_user_details.user_id,
            quotation_id: this.StoreObj.quotation_id,
            shared_through: this.shared_through,
            sent_comments:
              this.sent_comments != undefined &&
              this.sent_comments != null &&
              this.sent_comments != ""
                ? this.sent_comments
                : undefined,
          };
          this.loading_btn = true;
          let result = await API.graphql(
            graphqlOperation(SendQuotationPdfToCustomer, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.SendQuotationPdfToCustomer);
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
            this.dialogUpdateSendDetailsEmit((this.Toggle = 2));
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
            SnackbarText: "Fill Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },
    dialogUpdateSendDetailsEmit(Toggle) {
      this.sent_comments = "";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
