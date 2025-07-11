<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      v-model="InitiateInvoiceDirectlyDialog"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Initiate Invoice</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="InitiateInvoiceDirectlyDialogEmit(1)">
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
                  label="From Month"
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
            @click="initiateInvoiceMethod()"
            >Initiate Invoice</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateInvoiceForClosedTickets } from "@/graphql/mutations.js";
export default {
  props: {
    InitiateInvoiceDirectlyDialog: Boolean,
    SelectedPartners: Array,
  },
  components: {
    Snackbar,
  },
  data() {
    return {
      reportmonth: new Date().toISOString().substr(0, 7),
      menum: false,
      partnerIds: [],
      btnLoading: false,
      SnackBarComponent: {},
      renderComp: true,
    };
  },
  watch: {
    InitiateInvoiceDirectlyDialog(val) {
      if (val) {
        console.log("DIREC", this.SelectedPartners);
        this.partnerIds = this.SelectedPartners.map((item) => item.partner_id);
      }
    },
  },
  methods: {
    getEpochFromMonth() {
      const date = new Date(`${this.reportmonth}-01T00:00:00Z`);
      return date.getTime() / 1000;
    },

    getEpochCurrentMonth() {
      if (!this.reportmonth) return null;
      const [year, month] = this.reportmonth.split("-").map(Number);
      const lastDay = new Date(year, month, 0);
      lastDay.setHours(23, 59, 59, 999);
      return Math.floor(lastDay.getTime() / 1000);
    },
    async initiateInvoiceMethod() {
      // this.InitiateInvoiceDialog = true;
      console.log("MONTH", this.reportmonth);
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(GenerateInvoiceForClosedTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              viwer_user_id: this.StoreObj?.partner_id || this.partnerIds,
              month: this.reportmonth,
              from_date: this.getEpochFromMonth(),
              to_date: this.getEpochCurrentMonth(),
              ticket_ids: this.StoreObj?.ticket_ids || undefined,
              total_cost: this.StoreObj?.total_gst_incl_amount || undefined,
              invoice_input: JSON.stringify(this.InvoiceInputObj) || undefined,
              generation_type: "ALL",
            },
          })
        );
        const response = JSON.parse(
          result.data.GenerateInvoiceForClosedTickets
        );
        console.log("INITIATED_RES", response);
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
          this.InitiateInvoiceDirectlyDialogEmit(2);
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

    InitiateInvoiceDirectlyDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
