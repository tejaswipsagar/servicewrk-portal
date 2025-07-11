<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="UpdateBillDetailsDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Update Bill Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="UpdateBillDetailsDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-form ref="form">
            <v-text-field
              v-model="billNumber"
              dense
              outlined
              label="Bill Number*"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-text-field>
            <div class="d-flex">
              <div>
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :return-value.sync="billDate"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedBillDate"
                      label="Bill Date"
                      outlined
                      dense
                      class="FontSize field_label_size field_height maxWidthSmall"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="billDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false"
                      >Cancel</v-btn
                    >
                    <v-btn text color="primary" @click="saveDate">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </div>

              <div>
                <v-menu
                  ref="menum"
                  v-model="menum"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="FontSize field_label_size field_height maxWidthSmall ml-3"
                      outlined
                      dense
                      v-model="formattedBillMonth"
                      label="Bill Month"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="billMonth"
                    type="month"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menum = false"
                      >Cancel</v-btn
                    >
                    <v-btn text color="primary" @click="saveMonth">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="btnLoader"
            small
            class="mr-2"
            color="primary"
            @click="updateBillDetailsMethod()"
            >Update<v-icon small class="pl-1">mdi-update</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { UpdateBillDetailsOfInvoice } from "@/graphql/mutations.js";

import Snackbar from "@/components/Extras/SnackbarView.vue";

export default {
  props: {
    UpdateBillDetailsDialog: Boolean,
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
      billNumber: "",
      menu1: false,
      billDate: "",
      billMonth: "",
      menum: false,
    };
  },

  computed: {
    formattedBillDate() {
      if (!this.billDate) return "";
      const [year, month, day] = this.billDate.split("-");
      return `${day}-${month}-${year}`;
    },

    formattedBillMonth() {
      if (!this.billMonth) return "";
      const [year, month] = this.billMonth.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]}-${year.slice(2)}`;
    },
  },

  methods: {
    saveDate() {
      this.$refs.menu1.save(this.billDate);
      this.menu1 = false;
    },

    saveMonth() {
      this.$refs.menum.save(this.billMonth);
      this.menum = false;
    },
    async updateBillDetailsMethod() {
      try {
        this.btnLoader = true;
        const result = await API.graphql(
          graphqlOperation(UpdateBillDetailsOfInvoice, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              invoice_id: this.InvoiceObj.invoice_id,
              bill_number: this.billNumber,
              bill_date: this.formattedBillDate,
              bill_month: this.formattedBillMonth,
            },
          })
        );
        const response = JSON.parse(result.data.UpdateBillDetailsOfInvoice);
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
          this.UpdateBillDetailsDialogEmit(2);
          this.btnLoader = false;
        }
      } catch (error) {
        this.btnLoader = false;
        //
      }
    },
    UpdateBillDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
