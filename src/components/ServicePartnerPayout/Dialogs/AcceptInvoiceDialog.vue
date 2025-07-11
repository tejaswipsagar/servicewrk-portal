<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="AcceptInvoiceDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Accept Invoice</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="AcceptInvoiceDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <span>
            Are you sure want to accept this invoice
            <strong>{{ InvoiceObj.invoice_display_id }}</strong
            >?
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="btnLoader"
            small
            class="mr-2"
            color="primary"
            @click="acceptInvoiceMethod()"
            >Accept<v-icon small class="pl-1"> mdi-check </v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { VerifyInvoiceOrRequestChangesInInvoice } from "@/graphql/mutations.js";

import Snackbar from "@/components/Extras/SnackbarView.vue";

export default {
  props: {
    AcceptInvoiceDialog: Boolean,
    InvoiceObj: Object,
  },
  components: {
    Snackbar,
  },
  data() {
    return {
      renderComp: true,
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  methods: {
    async acceptInvoiceMethod() {
      try {
        this.btnLoader = true;
        const result = await API.graphql(
          graphqlOperation(VerifyInvoiceOrRequestChangesInInvoice, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              invoice_id: this.InvoiceObj.invoice_id,
              invoice_verified_action: "VERIFY",
            },
          })
        );
        const response = JSON.parse(
          result.data.VerifyInvoiceOrRequestChangesInInvoice
        );
        if (response.status === "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.renderComp = true;
          });
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: response.status_message,
          };
          this.btnLoader = false;
          this.AcceptInvoiceDialogEmit(2);
        }
      } catch (error) {
        this.btnLoader = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
        //
      }
      //
    },
    AcceptInvoiceDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
