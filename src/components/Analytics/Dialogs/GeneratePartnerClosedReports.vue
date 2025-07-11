<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      v-model="GeneratePartnerClosedReportsDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500"
    >
      <v-card>
        <v-toolbar color="primary" dense dark>
          <div class="ml-2 white--text">
            Partner Closed Ticket Reports Details
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="GeneratePartnerClosedReportsDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="d-flex justify-center mt-5">
          <v-menu
            offset-y
            ref="menum"
            v-model="menum"
            :return-value.sync="month"
            transition="scale-transition"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                outlined
                readonly
                v-on="on"
                v-bind="attrs"
                v-model="month"
                label="Select Month"
                class="FontSize smallwidth mt-4"
              ></v-text-field>
            </template>
            <v-date-picker
              no-title
              scrollable
              type="month"
              v-model="month"
              :min="minMonth"
              :max="maxMonth"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menum.save(month)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-card-text>
        <v-spacer />
        <v-card-actions class="ma-2 ms-auto">
          <v-btn
            :loading="btnLoader"
            small
            color="primary"
            class="mt-4"
            @click="generateNewReqReportsDialogMethod()"
          >
            Generate
            <v-icon small>mdi-microsoft-excel</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { ShareMonthlyClosedTicketReportDetailsToPartners } from "@/graphql/mutations.js";
export default {
  components: { Snackbar },
  props: {
    GeneratePartnerClosedReportsDialog: Boolean,
  },
  data: () => ({
    menum: false,
    month: new Date().toISOString().substr(0, 7),
    maxMonth: "",
    minMonth: "",
    renderComp: true,
    SnackBarComponent: {},
    btnLoader: false,
  }),
  watch: {
    month(val) {
      this.getMonthAndDateDetails();
    },
  },
  mounted() {
    const currentDate = new Date();
    this.maxMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    // Calculate previous month
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    this.minMonth = `${prevDate.getFullYear()}-${(prevDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  },

  methods: {
    getMonthAndDateDetails() {
      const [year, month] = this.month.split("-");
      const date = new Date(`${year}-${month}-01`);
      const shortMonth = date.toLocaleString("en-US", { month: "short" });
      this.formatedMonth = `${shortMonth}-${year}`;
      const from = new Date(year, month - 1, 1, 0, 0, 0);
      this.fromDate = Math.floor(from.getTime() / 1000);
      const end = new Date(year, month, 0, 23, 59, 59);
      this.toDate = Math.floor(end.getTime() / 1000);
    },
    async generateNewReqReportsDialogMethod() {
      try {
        this.btnLoader = true;
        this.getMonthAndDateDetails();
        const result = await API.graphql(
          graphqlOperation(ShareMonthlyClosedTicketReportDetailsToPartners, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              from_date: this.fromDate,
              to_date: this.toDate,
              month: this.formatedMonth,
            },
          })
        );
        const response = JSON.parse(
          result.data.ShareMonthlyClosedTicketReportDetailsToPartners
        );
        if (response.status === "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = true;
          });
          this.GeneratePartnerClosedReportsDialogEmit(2);
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
      } finally {
        this.btnLoader = false;
      }
    },

    async GeneratePartnerClosedReportsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
