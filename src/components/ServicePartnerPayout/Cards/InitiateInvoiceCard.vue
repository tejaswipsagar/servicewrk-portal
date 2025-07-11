<template>
  <div>
    <!-- <InitiateInvoice
      :InitiateInvoiceDialog="InitiateInvoiceDialog"
      :StoreObj="StoreObj"
      :InvoiceInputObj="InvoiceInputObj"
      @clicked="InitiateInvoiceDialogEmit"
    /> -->
    <EditInvoiceItem
      :EditInvoiceItemDialog="editInvoiceItemDialog"
      :HsnCode="hsnCode"
      @clicked="EditInvoiceItemDialogEmit"
    />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-card elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4" xs="12" class="ml-n4">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Initiate Invoice</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="8" xs="12" class="d-flex justify-end">
          <div>
            <v-toolbar dense class="elevation-0">
              <v-btn
                small
                class="ml-2 mt-2"
                color="primary"
                @click="InitiateInvoiceCardEmit(1)"
              >
                Back<v-icon small>mdi-arrow-left</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
        </v-col>
      </v-row>
      <v-card-text>
        <!-- <div
          style="border: 1px solid black; border-style: dashed; width: 100%"
          class="pa-3"
        >
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div class="text-center FontSize">
                <strong>Bill To Pay</strong>
              </div>
              <div class="mt-3">
                <div class="FontSize">
                  <span> <strong>Address: </strong>- </span>
                </div>
                <div class="FontSize">
                  <span> <strong>GSTIN: </strong>- </span>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="12"
              xs="12"
              style="border-left: 1px dashed black"
            >
              <div class="text-center FontSize">
                <strong>Invoice Detail</strong>
              </div>
              <div class="mt-3">
                <div class="FontSize">
                  <span> <strong>Bill No: </strong>- </span>
                </div>
                <div class="FontSize">
                  <span> <strong>Bill Date: </strong>- </span>
                </div>
                <div class="FontSize">
                  <span> <strong>Bill Period: </strong>- </span>
                </div>
                <div class="FontSize">
                  <span> <strong>Bill Month: </strong>- </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="mt-2"  style="border: 1px solid black; border-style: dashed; width: 100%">

        </div> -->

        <!-- XYZ Electronics Header -->
        <div class="header">
          <h2>{{ InvoiceInputObj.bill_to_name || "-" }}</h2>
          <p>{{ InvoiceInputObj.company_address || "-" }}</p>
          <p>
            Name:
            <span class="nobold">{{ InvoiceInputObj.ecp_name || "-" }}</span>
          </p>
          <!-- <p>Mob: -</p> -->
          <p style="position: relative; bottom: 15px">
            Email ID:
            <span class="nobold">{{
              InvoiceInputObj.ecp_email_id || "-"
            }}</span>
          </p>
          <!-- <p>Pan No: -</p>
          <p>GST No: -</p> -->
        </div>
        <!-- Bill to Party & Invoice Details -->
        <table>
          <tr>
            <th colspan="2">Bill To Party</th>
            <th colspan="3">Invoice Details</th>
          </tr>
          <tr>
            <td colspan="2">
              <strong>Address: </strong>{{ InvoiceInputObj.bill_to_address
              }}<br />
              <!-- Address: __________<br /> -->
              <strong>GSTIN:</strong> {{ InvoiceInputObj.bill_to_gstin }}
            </td>
            <td colspan="3">
              <strong>Bill No: </strong> {{ InvoiceInputObj.bill_no }}<br />
              <strong>Bill Date: </strong> {{ InvoiceInputObj.bill_date }}<br />
              <strong>Bill Period: </strong> {{ InvoiceInputObj.bill_period
              }}<br />
              <strong>Bill Month: </strong>
              {{ formatYearMonth(StoreObj2.from_month) }}
              <!-- Bill Month: Mar-25 -->
            </td>
          </tr>
        </table>

        <!-- Main Invoice Table -->
        <table>
          <thead>
            <tr>
              <th>SR No.</th>
              <th>Service Type</th>
              <th>HSN Code</th>
              <th>Total No Of Tickets</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(section, sectionIndex) in InvoiceInputObj.service_groups"
            >
              <tr
                v-for="(group, groupIndex) in section.service_groups"
                :key="`${sectionIndex}-${groupIndex}`"
              >
                <td>
                  <!-- Show section number only on the first row of that section -->
                  <span v-if="groupIndex === 0">{{ section.sectionNo }}</span>
                </td>
                <td>{{ group.service_type_name }}</td>
                <td>
                  <v-row align="center">
                    <v-col cols="12" lg="6">
                      {{ group.hsn_code || "-" }}
                    </v-col>
                    <v-col cols="12" lg="6" class="d-flex justify-end">
                      <v-btn
                        icon
                        @click="
                          editInvoiceItemMethod(
                            section.sectionNo,
                            groupIndex,
                            group.hsn_code
                          )
                        "
                        ><v-icon small color="green">mdi-pencil</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                </td>
                <td>{{ group.tickets_count || "-" }}</td>
                <td>{{ `₹${group.total_cost}` || "₹0" }}</td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Basic Amount Section -->
        <div class="section">
          Basic Amount:
          <span class="nobold">₹{{ basicAmount }}</span>
        </div>

        <!-- Bank Details -->
        <h3 class="mt-5">Bank Details</h3>
        <table>
          <tr>
            <th>Bank Name</th>
            <th>A/C No</th>
            <th>IFSC Code</th>
          </tr>
          <tr>
            <td>{{ InvoiceInputObj.bank_name || "-" }}</td>
            <td>{{ InvoiceInputObj.account_no || "-" }}</td>
            <td>{{ InvoiceInputObj.ifscode || "-" }}</td>
          </tr>
        </table>

        <!-- GST Section -->
        <!-- <h3 class="mt-5">Additional Charges</h3>
        <table>
          <tr>
            <th>Description</th>
            <th>Rate</th>
          </tr>
          <tr>
            <td>GST on Call Charges</td>
            <td>
              {{
                `₹${$store.getters.get_current_user_details.organization_details.gst_call_charges}` ||
                "-"
              }}
            </td>
          </tr>
          <tr>
            <td>GST on Spare Part</td>
            <td>
              {{
                `₹${$store.getters.get_current_user_details.organization_details.gst_spare_part}` ||
                "-"
              }}
            </td>
          </tr>
        </table> -->

        <!-- Final Amount Section -->
        <h3 class="mt-5">Final Amount</h3>
        <p>
          <strong>Amounts in Words: </strong
          ><span class="nobold">{{ amountInWords || "-" }}</span>
        </p>
        <p style="position: relative; bottom: 15px">
          <strong>Final Amount: </strong>
          <span class="nobold"
            >₹{{ finalAmount || "-" }} + GST(If Applicable)</span
          >
        </p>
      </v-card-text>
      <v-card-actions class="mb-3">
        <v-spacer />
        <v-btn
          :loading="btnLoading"
          small
          class="mr-2 mt-2"
          color="primary"
          @click="initiatedInvoiceMethod()"
          >Initiate<v-icon small>mdi-plus</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import InitiateInvoice from "@/components/ServicePartnerPayout/Dialogs/InitiateInvoiceDialog.vue";
import EditInvoiceItem from "@/components/ServicePartnerPayout/Dialogs/EditInvoiceItemDialog.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GenerateInvoiceForClosedTickets } from "@/graphql/mutations.js";
import { toWords } from "number-to-words";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    StoreObj: Object,
    StoreObj2: Object,
    InvoiceInputObj: Object,
    AdditionalChargesArray: Array,
  },
  components: {
    InitiateInvoice,
    EditInvoiceItem,
    Snackbar,
  },
  data: () => ({
    InitiateInvoiceDialog: false,
    editInvoiceItemDialog: false,
    selectedSectionNo: 0,
    selectedChildServGrpIndex: 0,
    hsnCode: "",
    btnLoading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),

  computed: {
    basicAmount() {
      let total = 0;
      this.InvoiceInputObj.service_groups.forEach((section) => {
        section.service_groups.forEach((group) => {
          total += Number(group.total_cost) || 0;
        });
      });
      return total;
    },

    finalAmount() {
      const userDetails = this.$store.getters.get_current_user_details;
      const gstCall = userDetails.organization_details.gst_call_charges || 0;
      const gstSpare = userDetails.organization_details.gst_spare_part || 0;
      return this.basicAmount;
      // return this.basicAmount + gstCall + gstSpare;
    },
    amountInWords() {
      return (
        toWords(this.finalAmount).replace(/^\w/, (c) => c.toUpperCase()) +
        " only"
      );
    },
  },

  mounted() {
    console.log("INVOICE_OBJ", this.InvoiceInputObj);
  },

  methods: {
    editInvoiceItemMethod(section_no, child_service_group_index, hsn_code) {
      this.selectedSectionNo = section_no;
      this.selectedChildServGrpIndex = child_service_group_index;
      this.hsnCode = hsn_code;
      this.editInvoiceItemDialog = true;
    },

    formatYearMonth(input) {
      const [year, month] = input.split("-");
      const date = new Date(`${input}-01`);
      const monthName = date.toLocaleString("default", { month: "short" });
      return `${monthName} ${year}`;
    },

    async initiatedInvoiceMethod() {
      // this.InvoiceInputObj.service_groups.push(...this.AdditionalChargesArray);
      this.InvoiceInputObj.basic_amount = this.basicAmount;
      this.InvoiceInputObj.final_amount = this.finalAmount;
      this.InvoiceInputObj.gst_call_charges = undefined;
      this.InvoiceInputObj.gst_spare_part = undefined;
      this.InvoiceInputObj.bill_month = this.formatYearMonth(
        this.StoreObj2.from_month
      );
      console.log("INI_INVOICE_API", this.InvoiceInputObj);
      // this.InvoiceInputObj.gst_call_charges =
      //   this.$store.getters.get_current_user_details.organization_details.gst_call_charges;
      // this.InvoiceInputObj.gst_spare_part =
      //   this.$store.getters.get_current_user_details.organization_details.gst_spare_part;
      this.InvoiceInputObj.amount_in_words = this.amountInWords;
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(GenerateInvoiceForClosedTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              viwer_user_id: this.StoreObj.partner_id,
              month: this.StoreObj2.from_month,
              ticket_ids: this.StoreObj.ticket_ids,
              total_cost: this.finalAmount,
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
          setTimeout(() => {
            this.InitiateInvoiceCardEmit(2);
            this.btnLoading = false;
          }, 5000);
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

    InitiateInvoiceCardEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },

    EditInvoiceItemDialogEmit(Toggle, hsn_code) {
      this.editInvoiceItemDialog = false;
      if (Toggle === 2) {
        let section = this.InvoiceInputObj.service_groups.find(
          (grp) => grp.sectionNo === this.selectedSectionNo
        );
        if (section && section.service_groups[this.selectedChildServGrpIndex]) {
          section.service_groups[this.selectedChildServGrpIndex].hsn_code =
            hsn_code;
          const updatedServiceGroups = this.InvoiceInputObj.service_groups.map(
            (grp) => (grp.sectionNo === this.selectedSectionNo ? section : grp)
          );
          this.InvoiceInputObj.service_groups = updatedServiceGroups;
        }
        console.log("SECTION", this.InvoiceInputObj);
      }
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
.header,
.sub-header {
  text-align: center;
  font-weight: bold;
}
.section {
  margin-top: 20px;
  font-weight: bold;
}

.nobold {
  font-weight: normal;
}
</style>
