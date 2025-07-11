<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="InitiateInvoiceDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Initiate Invoice</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="InitiateInvoiceDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="d-flex justify-center">
            <v-menu
              ref="menum"
              v-model="menum"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-9 mr-2 FontSize field_label_size field_height pl-2 smallwidth"
                  outlined
                  dense
                  v-model="reportmonth"
                  label="Select Month & year"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="reportmonth"
                type="month"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menum = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="menum = false">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="btnLoading"
            small
            class="mr-2"
            color="primary"
            @click="initiateMethod()"
            >Initiate</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GenerateInvoiceForClosedTickets } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";

export default {
  props: {
    InitiateInvoiceDialog: Boolean,
    StoreObj: Object,
    InvoiceInputObj: Object,
  },
  components: { Snackbar },
  data() {
    return {
      reportmonth: new Date().toISOString().substr(0, 7),
      menum: false,
      btnLoading: false,
      SnackBarComponent: {},
    };
  },

  methods: {
    async initiateMethod() {
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(GenerateInvoiceForClosedTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              viwer_user_id: this.StoreObj.partner_id,
              month: this.reportmonth,
              ticket_ids: this.StoreObj.ticket_ids,
              total_cost: this.StoreObj.total_gst_incl_amount,
              invoice_input: JSON.stringify(this.InvoiceInputObj),
            },
          })
        );
        const response = JSON.parse(
          result.data.GenerateInvoiceForClosedTickets
        );
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
          this.InitiateInvoiceDialogEmit(2);
          this.btnLoading = false;
        }
      } catch (error) {
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
        this.btnLoading = false;
        //
      }
    },
    InitiateInvoiceDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
