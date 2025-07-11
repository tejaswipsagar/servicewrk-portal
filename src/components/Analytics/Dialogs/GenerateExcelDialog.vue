<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-dialog :value="dialogGenerateExcel" persistent width="500">
      <v-card>
        <v-toolbar elevation="0" dense color="primary white--text">
          <v-icon color="white" class="mr-2">mdi-microsoft-excel</v-icon>
          <div class="mr-1">Generate Excel</div>
          <span v-if="select_type == 'TICKETS'">
            <span v-if="this.ticket_tabs == 0">for Active Tickets</span>
            <span v-else-if="this.ticket_tabs == 1">for Closed Tickets</span>
            <span v-else-if="this.ticket_tabs == 4"
              >for Both C1 & C2 Closed Tickets</span
            >
            <span v-else-if="this.ticket_tabs == 2">for C1 Closed Tickets</span>
            <span v-else-if="this.ticket_tabs == 3">for C2 Closed Tickets</span>
          </span>
          <span v-else-if="select_type == 'MRF'">
            <span v-if="this.mrf_tabs == 0">for Pending MRF</span>
            <span v-else-if="this.mrf_tabs == 1">for Approved MRF</span>
            <span v-else-if="this.mrf_tabs == 3">for Rejected MRF</span>
            <span v-else-if="this.mrf_tabs == 2">for In Progress MRF</span>
          </span>
          <v-spacer />
          <v-btn
            icon
            class="primary white--text"
            @click="dialogGenerateExcelEmit((Toggle = 1))"
          >
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-0 mt-2 text-center black--text">
          <v-row no-gutters>
            <v-col
              cols="12"
              :md="
                this.StoreObj.excel_type == 'CUSTOM'
                  ? '4'
                  : this.StoreObj.excel_type == 'MONTHLY'
                  ? '6'
                  : '12'
              "
              sm="12"
              xs="12"
            >
              <span>
                Period :
                <span v-if="this.StoreObj.excel_type == 'CURRENT_DAY'"
                  >TODAY</span
                >
                <span v-else-if="this.StoreObj.excel_type == 'MONTHLY'"
                  >MONTH</span
                >
                <span v-else> {{ this.StoreObj.excel_type }}</span>
              </span>
            </v-col>
            <v-col
              v-if="this.StoreObj.excel_type == 'MONTHLY'"
              cols="12"
              md="6"
              sm="12"
              xs="12"
            >
              Month : {{ this.StoreObj.month }}
            </v-col>
            <v-col
              v-if="this.StoreObj.excel_type == 'CUSTOM'"
              cols="12"
              md="4"
              sm="12"
              xs="12"
            >
              From : {{ this.StoreObj.start_date }}
            </v-col>
            <v-col
              v-if="this.StoreObj.excel_type == 'CUSTOM'"
              cols="12"
              md="4"
              sm="12"
              xs="12"
            >
              To : {{ this.StoreObj.end_date }}
            </v-col>
          </v-row>
          <v-icon size="50px" color="primary">mdi-microsoft-excel</v-icon>
          <div>Are you sure to Generate Excel ?</div>
        </v-card-text>
        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn
            small
            outlined
            color="red"
            class="red--text mb-4"
            @click="dialogGenerateExcelEmit((Toggle = 1))"
          >
            <v-icon small>mdi-close</v-icon>
            Cancel</v-btn
          >
          <v-btn
            small
            :loading="loading_btn"
            @click="GenerateExcel()"
            class="primary white--text mb-4"
            ><v-icon small class="mr-2">mdi-microsoft-excel</v-icon>
            Generate</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateExcelForMRF } from "@/graphql/mutations.js";
import { GenerateExcelForPartiallyClosedTicket } from "@/graphql/mutations.js";
import { GenerateExcelForOrganiztionOfMonthlyActiveTicket } from "@/graphql/mutations.js";
import { GenerateExcelForOrganiztionOfMonthlyClosedTicket } from "@/graphql/mutations.js";
export default {
  components: {
    Snackbar,
  },
  props: {
    StoreObj: Object,
    select_type: String,
    ticket_tabs: Number,
    mrf_tabs: Number,
    dialogGenerateExcel: Boolean,
  },
  data: () => ({
    overlay: false,
    renderComp: true,
    loading_btn: false,
    SnackBarComponent: {},
  }),
  methods: {
    async GenerateExcel() {
      this.overlay = true;
      this.loading_btn = true;
      const thisday = new Date();
      thisday.setHours(0, 0, 0, 0);
      let epochToday = thisday.getTime();
      let todayStart = Math.floor(epochToday / 1000);
      let todayEnd = Math.floor(epochToday / 1000) + 86399;
      let startDate = new Date(this.StoreObj.start_date);
      let epochStartDate = startDate.getTime() / 1000;
      let toDate = new Date(this.StoreObj.end_date);
      let epochTotDate = toDate.getTime() / 1000 + 86399;
      if (this.select_type == "TICKETS") {
        var inputParams = {
          current_month:
            this.StoreObj.excel_type == "MONTHLY"
              ? this.StoreObj.month
              : undefined,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          to_date:
            this.StoreObj.excel_type == "CUSTOM"
              ? epochTotDate
              : this.StoreObj.excel_type == "CURRENT_DAY"
              ? todayEnd
              : undefined,
          from_date:
            this.StoreObj.excel_type == "CUSTOM"
              ? epochStartDate
              : this.StoreObj.excel_type == "CURRENT_DAY"
              ? todayStart
              : undefined,
          excel_type: this.StoreObj.excel_type,
          C1_required: this.ticket_tabs == 2 ? true : undefined,
          C2_required: this.ticket_tabs == 3 ? true : undefined,
          required_both: this.ticket_tabs == 4 ? true : undefined,
        };
      } else if (this.select_type == "MRF") {
        var inputParamsForMRF = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          workflow_status:
            this.mrf_tabs == 0
              ? "PENDING"
              : this.mrf_tabs == 1
              ? "APPROVED"
              : this.mrf_tabs == 2
              ? "IN_PROGRESS"
              : "REJECTED",
          to_date:
            this.StoreObj.excel_type == "CUSTOM"
              ? epochTotDate
              : this.StoreObj.excel_type == "CURRENT_DAY"
              ? todayEnd
              : undefined,
          from_date:
            this.StoreObj.excel_type == "CUSTOM"
              ? epochStartDate
              : this.StoreObj.excel_type == "CURRENT_DAY"
              ? todayStart
              : undefined,
          excel_type: this.StoreObj.excel_type,
          current_month:
            this.StoreObj.excel_type == "MONTHLY"
              ? this.StoreObj.month
              : undefined,
        };
      }
      try {
        this.loading = true;
        let result =
          this.ticket_tabs == 0 && this.select_type == "TICKETS"
            ? await API.graphql(
                graphqlOperation(
                  GenerateExcelForOrganiztionOfMonthlyActiveTicket,
                  {
                    input: inputParams,
                  }
                )
              )
            : this.ticket_tabs == 1 && this.select_type == "TICKETS"
            ? await API.graphql(
                graphqlOperation(
                  GenerateExcelForOrganiztionOfMonthlyClosedTicket,
                  {
                    input: inputParams,
                  }
                )
              )
            : (this.ticket_tabs == 2 ||
                this.ticket_tabs == 3 ||
                this.ticket_tabs == 4) &&
              this.select_type == "TICKETS"
            ? await API.graphql(
                graphqlOperation(GenerateExcelForPartiallyClosedTicket, {
                  input: inputParams,
                })
              )
            : await API.graphql(
                graphqlOperation(GenerateExcelForMRF, {
                  input: inputParamsForMRF,
                })
              );
        var ResultObject =
          this.ticket_tabs == 0 && this.select_type == "TICKETS"
            ? JSON.parse(
                result.data.GenerateExcelForOrganiztionOfMonthlyActiveTicket
              )
            : this.ticket_tabs == 1 && this.select_type == "TICKETS"
            ? JSON.parse(
                result.data.GenerateExcelForOrganiztionOfMonthlyClosedTicket
              )
            : (this.ticket_tabs == 2 ||
                this.ticket_tabs == 3 ||
                this.ticket_tabs == 4) &&
              this.select_type == "TICKETS"
            ? JSON.parse(result.data.GenerateExcelForPartiallyClosedTicket)
            : JSON.parse(result.data.GenerateExcelForMRF);
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
          this.dialogGenerateExcelEmit(2);
        }
        this.loading = false;
        this.overlay = false;
        this.loading_btn = false;
      } catch (error) {
        this.loading = false;
        this.overlay = false;
        this.loading_btn = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText:
              error.errors[0].Status_Message != undefined
                ? error.errors[0].Status_Message
                : error.errors[0].message,
          };
          this.renderComp = true;
        });
      }
    },
    dialogGenerateExcelEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
