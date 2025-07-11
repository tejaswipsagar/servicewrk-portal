<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogSharePdf" persistent width="30%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-share</v-icon> Share Quotation to
            Customer
            <span v-if="StoreObj.quotation_display_id">{{
              StoreObj.quotation_display_id
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogSharePdfEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <v-form ref="form">
            <v-text-field
              dense
              outlined
              class="FontSize"
              label="Customer Mail ID *"
              :rules="[
                (v) => !!v || 'Required',
                (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(v) ||
                  'Email must be valid',
              ]"
              v-model="customer_email_id"
            >
            </v-text-field>
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
            @click="shareQuotationMethod()"
          >
            <v-icon small>mdi-share</v-icon> Share</v-btn
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
    dialogSharePdf: Boolean,
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
    SnackBarComponent: {},
  }),
  watch: {
    dialogSharePdf(val) {
      if (val == true) {
        this.customer_email_id = this.StoreObj.customer_email_id;
      }
    },
  },
  methods: {
    async shareQuotationMethod() {
      if (this.$refs.form.validate()) {
        try {
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            sender_user_id:
              this.$store.getters.get_current_user_details.user_id,
            customer_email_id: this.customer_email_id,
            pdf_link: this.StoreObj.quotation_s3_url,
            quotation_id: this.StoreObj.quotation_id,
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
            this.dialogSharePdfEmit((this.Toggle = 2));
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
            SnackbarText: "Enter Mail ID..!",
          };
          this.renderComp = true;
        });
      }
    },
    dialogSharePdfEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.customer_email_id = "";
      this.sent_comments = "";
    },
  },
};
</script>
