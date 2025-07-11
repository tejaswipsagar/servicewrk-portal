<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="ShareToCustomerDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Share To
            {{ StoreObj.share_to === "TO_CUSTOMER" ? "Customer" : "Dealer" }}
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ShareToCustomerDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pl-5">
          <v-form ref="form">
            <v-text-field
              v-model="customerEmail"
              dense
              outlined
              label="Customer Email (Add more email with comma)"
              class="mt-3 FontSize"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <div class="ml-2">
            <v-btn
              :loading="btnLoading"
              small
              color="green"
              class="white--text"
              @click="callUserMailMethod()"
              >Share<v-icon small class="pl-1">mdi-share</v-icon></v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { SendProductReplacementFormToCustomer } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: { ShareToCustomerDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    btnLoading: false,
    renderComp: true,
    customerEmail: "",
    SnackBarComponent: {},
    usermailArray: [],
  }),

  watch: {
    ShareToCustomerDialog(val) {
      if (val) {
        console.log("CHECK_STORE", this.StoreObj);
        this.customerEmail = this.StoreObj.customer_email_id;
      }
    },
  },

  methods: {
    callUserMailMethod() {
      if (
        !this.customerEmail ||
        this.customerEmail.trim() === "," ||
        this.customerEmail.trim() === ""
      ) {
        this.showErrorSnackbar("Please enter a valid email.");
        return undefined;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let emails = this.customerEmail
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");
      if (!emails.every((email) => emailRegex.test(email))) {
        this.showErrorSnackbar("One or more email addresses are invalid.");
        return undefined;
      }
      this.shareToCustomerMethod(emails);
    },

    showErrorSnackbar(message) {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        Top: true,
        SnackbarText: message,
      };
      this.renderComp = false;
      this.$nextTick(() => {
        this.renderComp = true;
      });
    },
    async shareToCustomerMethod(customer_emails) {
      if (this.$refs.form.validate()) {
        try {
          this.btnLoading = true;
          const result = await API.graphql(
            graphqlOperation(SendProductReplacementFormToCustomer, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                fgr_id: this.StoreObj.finished_goods_receipt_id,
                sender_user_id:
                  this.$store.getters.get_current_user_details.user_id,
                customer_email_id: customer_emails,
                is_dealer_pdf:
                  this.StoreObj.share_to === "TO_DEALER" ? true : undefined,
                is_customer_pdf:
                  this.StoreObj.share_to === "TO_CUSTOMER" ? true : undefined,
              },
            })
          );
          const response = JSON.parse(
            result.data.SendProductReplacementFormToCustomer
          );
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
            this.ShareToCustomerDialogEmit(2);
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
          SnackbarText: "Kindly provide comment to rejct the FGR!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    ShareToCustomerDialogEmit(Toggle) {
      this.usermailArray = [];
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
