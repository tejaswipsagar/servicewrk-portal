<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <!-- <InitiateInvoice
      :InitiateInvoiceDialog="InitiateInvoiceDialog"
      :StoreObj="storeObj"
      @clicked="InitiateInvoiceDialogEmit"
    /> -->

    <v-card elevation="0" v-if="currentView === 'CLOSED_TICKET_VIEW'">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4" xs="12" class="ml-n4">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Closed Tickets</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="8" xs="12" class="d-flex justify-end">
          <div>
            <v-toolbar dense class="elevation-0">
              <v-text-field
                class="mt-9 mr-2 maxWidthSmall"
                dense
                outlined
                label="Search"
                v-model="search"
              />
              <v-btn small class="mt-2" color="primary" @click="CardEmit2()">
                Back<v-icon small>mdi-arrow-left</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          :show-select="true"
          v-model="selectedClosedTicket"
          item-key="ticket_id"
          :search="search"
          dense
          fixed-header
          :items-per-page="50"
          :height="TableHeight"
          style="cursor: pointer"
          class="elevation-0 pa-0 TableValFontsize"
          :no-data-text="
            getAllClosedTicketList && getAllClosedTicketList.length === 0
              ? 'No data found'
              : null
          "
          :headers="closedTicketHeaders"
          :items="getAllClosedTicketList"
          :footer-props="{
            'disable-items-per-page': true,
          }"
          @click:row="handleClickRow"
          hide-default-footer
        >
          <template v-slot:[`item.sl_no`]="{ item, index }">
            <div>
              {{ index + 1 }}
            </div>
          </template>

          <template v-slot:[`item.ticket_id`]="{ item }">
            <div class="FontSize" v-if="item.custom_ticket_id == undefined">
              {{
                `${item.ticket_id.split("-")[1]}-${
                  item.ticket_id.split("-")[2]
                }-${item.ticket_id.split("-")[3]}-${
                  item.ticket_id.split("-")[4]
                }`
              }}
            </div>
            <div
              class="FontSize"
              v-else-if="item.custom_ticket_id != undefined"
            >
              {{ item.custom_ticket_id }}
            </div>
            <div class="FontSize">
              <span class="FontSize">{{ item.category_name }}</span>
            </div>
            <div class="FontSize">
              <span class="FontSize">{{ item.service_name }}</span>
            </div>
            <v-btn
              v-if="item.old_serial_number_details != undefined"
              color="green"
              class="white--text"
              x-small
              >Product Fleet Replaced</v-btn
            >
          </template>
          <template v-slot:[`item.service_charges`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on, attrs }">
                <div v-if="item.service_charges">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="primary" small>mdi-information</v-icon>
                  </v-btn>
                </div>
                <div v-else>-</div>
              </template>
              <div v-for="(value, key) in item.service_charges">
                <span :key="key">{{
                  `${key.replace("_", " ")}: ${value}`
                }}</span>
              </div>
            </v-tooltip>
          </template>
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div class="FontSize">
              {{ item.customer_company_name }}
            </div>
            <div class="FontSize">
              <span class="FontSize">
                {{ item.customer_name }}
              </span>
            </div>
            <div class="FontSize" v-if="item.customer_unique_id != undefined">
              {{ item.customer_unique_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_created_on`]="{ item }">
            <div class="FontSize">
              <span>
                {{
                  new Date(item.ticket_created_on * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </span>
            </div>
            <div class="FontSize" v-if="item.ticket_city != undefined">
              {{ item.ticket_city }}
            </div>
          </template>
          <template v-slot:[`item.ticket_closed_time`]="{ item }">
            <div class="FontSize">
              <span>
                {{
                  new Date(item.ticket_closed_time * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </span>
            </div>
            <div class="FontSize">
              <div
                v-if="
                  item.captured_otp != undefined &&
                  item.satisfied_otp != undefined
                "
              >
                <span
                  v-if="item.captured_otp == item.satisfied_otp"
                  class="green--text"
                  >By Customer</span
                >
                <span v-else-if="item.not_satisfied_otp">
                  <span
                    class="red--text"
                    v-if="item.captured_otp == item.not_satisfied_otp"
                  >
                    By Technician
                  </span>
                </span>
              </div>
              <div
                v-else-if="item.closed_otp_type == 'PORTAL'"
                class="blue--text FontSize"
              >
                From Portal
              </div>
            </div>
            <div class="FontSize" v-if="item.ticket_closed_location">
              {{ item.ticket_closed_location.replaceAll("_", " ") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_total_time`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span class="FontSize" v-bind="attrs" v-on="on">{{
                  GetTotalTime(
                    item.assigned_or_closed_on - item.ticket_created_on
                  )
                }}</span>
              </template>
              {{
                GetTotalTime(
                  item.assigned_or_closed_on - item.ticket_created_on
                )
              }}
            </v-tooltip>
            <div class="FontSize">{{ item.representative_name }}</div>
            <div class="FontSize" v-if="item.ticket_creation_type != undefined">
              {{ item.ticket_creation_type.replaceAll("_", " ") }}
            </div>
            <div v-else>-</div>
          </template>

          <template v-slot:[`item.ticket_warranty_type`]="{ item }">
            <div v-if="item.ticket_warranty_type" class="FontSize">
              {{ item.ticket_warranty_type }}
            </div>
            <div v-if="item.support_type" class="FontSize">
              {{ item.support_type }}
            </div>
            <div v-else>-</div>
            <div v-if="item.additional_comments" class="FontSize">
              {{ item.additional_comments }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.cost_for_ticket`]="{ item }">
            <div>
              {{ item.cost_for_ticket || "-" }}
            </div>
          </template>
          <template v-slot:[`item.cost_configuration_gst`]="{ item }">
            <div>
              {{ item.cost_configuration_gst || 0 }}
            </div>
          </template>
          <template v-slot:[`item.gst_amount`]="{ item }">
            <div v-if="item.cost_for_ticket">
              {{
                parseFloat(
                  (parseFloat(item.cost_for_ticket) *
                    parseFloat(item.cost_configuration_gst)) /
                    100
                ).toFixed(2)
              }}
            </div>
            <div v-else>0</div>
          </template>
          <template v-slot:[`item.total_cost`]="{ item }">
            <div v-if="item.cost_for_ticket">
              {{ calculateTotalCost(item) }}
            </div>
            <div v-else>0</div>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="mt-3">
        <v-spacer />
        <div
          style="
            border: 1px solid black;
            border-style: dashed;
            width: 100%;
            background-color: #f8f5e9;
          "
          class="pa-5"
        >
          <v-row align="center">
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div class="FontSize mt-2 mb-2">
                <span>
                  <strong class="mr-2">Total Closed Ticket: </strong>
                  {{ getAllClosedTicketList.length }}
                </span>
              </div>
              <div class="FontSize mt-2 mb-2">
                <span>
                  <strong class="mr-2">Selected Closed Ticket: </strong>
                  {{ selectedClosedTicket.length }}
                </span>
              </div>
              <div class="FontSize mt-2 mb-2">
                <span>
                  <strong class="mr-2">Total Basic Amount: </strong>
                  ₹{{ totalBasicAmount }}
                </span>
              </div>
              <div class="FontSize mt-2 mb-2">
                <span>
                  <strong class="mr-2">Total GST Amount: </strong>
                  ₹{{ totalGSTAmount }}
                </span>
              </div>
              <div class="FontSize mt-2 mb-2">
                <span>
                  <strong class="mr-2">Total Amount: </strong>
                  ₹{{ totalAmountIncGST }}
                </span>
              </div>
              <div class="FontSize mt-2 mb-2">
                <span>
                  <strong class="mr-2">Total Service Charges Amount: </strong>
                  ₹{{ totalServiceCharges() }}
                </span>
              </div>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="12"
              xs="12"
              class="d-flex justify-end"
            >
              <v-btn
                small
                class="mt-1"
                color="primary"
                @click="initiatedInvoiceMethod()"
              >
                Initiate Invoice<v-icon small>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-actions>
    </v-card>
    <InitiateInvoiceCard
      v-else
      :StoreObj="storeObj"
      :StoreObj2="StoreObj2"
      :InvoiceInputObj="invoiceInputObj"
      :AdditionalChargesArray="additionalCharges"
      @clicked="InitiateInvoiceCardEmit"
    />
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { ListClosedTicketsForInvoiceGenerate } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import Overlay from "@/components/Extras/OverlayView.vue";
// import InitiateInvoice from "@/components/ServicePartnerPayout/Dialogs/InitiateInvoiceDialog.vue";
import InitiateInvoiceCard from "@/components/ServicePartnerPayout/Cards/InitiateInvoiceCard.vue";

export default {
  components: {
    Snackbar,
    Overlay,
    // InitiateInvoice,
    InitiateInvoiceCard,
  },
  props: {
    StoreObj2: Object,
  },
  data: () => ({
    overlay: true,
    TableHeight: 0,
    renderComp: true,
    search: "",
    SnackBarComponent: {},
    reportmonth: new Date().toISOString().substr(0, 7),
    menum: false,
    InitiateInvoiceDialog: false,
    getAllClosedTicketList: [],
    closedTicketHeaders: [
      { text: "Sl No", value: "sl_no", tooltip_text: "Serial Number" },
      {
        text: "Ticket ID",
        value: "ticket_id",
        tooltip_text: "Ticket Details",
      },
      {
        text: "Customer",
        value: "customer_company_name",
        tooltip_text: "Customer Details",
      },
      {
        text: "Created",
        value: "ticket_created_on",
        tooltip_text: "Created On",
      },
      {
        text: "Closed",
        value: "ticket_closed_time",
        tooltip_text: "Closed On",
      },
      {
        text: "Support",
        value: "ticket_warranty_type",
        tooltip_text: "Support & Additional Comments",
      },
      {
        text: "Service Charges",
        value: "service_charges",
      },
      {
        text: "Cost",
        value: "cost_for_ticket",
      },
      {
        text: "GST%",
        value: "cost_configuration_gst",
      },
      {
        text: "GST Amount",
        value: "gst_amount",
      },
      {
        text: "Total Cost",
        value: "total_cost",
      },
    ],
    storeObj: {},
    totalAmountIncGST: 0,
    totalGSTAmount: 0,
    ticketIds: [],
    invoiceInputObj: {},
    currentView: "CLOSED_TICKET_VIEW",
    selectedClosedTicket: [],
    totalBasicAmount: 0,
    additionalCharges: [],
  }),

  watch: {
    selectedClosedTicket(val) {
      if (val) {
        this.totalServiceCharges();
        this.totalAmountIncGST = 0;
        this.totalGSTAmount = 0;
        this.totalBasicAmount = 0;
        this.ticketIds = [];

        val.map((item) => {
          this.ticketIds.push(item.ticket_id);
          if (item.cost_for_ticket) {
            this.totalAmountIncGST =
              this.totalAmountIncGST +
              Number(
                parseFloat(
                  parseFloat(item.cost_for_ticket) *
                    parseFloat(item.cost_configuration_gst / 100) +
                    parseFloat(item.cost_for_ticket)
                ).toFixed(2)
              );
            this.totalGSTAmount =
              this.totalGSTAmount +
              parseFloat(item.cost_configuration_gst / 100) *
                parseFloat(item.cost_for_ticket);
            this.totalBasicAmount =
              this.totalBasicAmount + parseFloat(item.cost_for_ticket);
          }
        });
      }
    },
  },

  async mounted() {
    this.TableHeight = window.innerHeight - 300;
    this.ticketIds = [];
    this.totalAmountIncGST = 0;
    this.totalGSTAmount = 0;
    try {
      let result = await API.graphql(
        graphqlOperation(ListClosedTicketsForInvoiceGenerate, {
          input: {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            user_id: this.$store.getters.get_current_user_details.user_id,
            viwer_user_id: this.StoreObj2.partner_id,
            // ticket_type: "ASSIGNED_TICKET",
            // ticket_status: "CLOSED",
            from_date: this.getEpochFromMonth(),
            to_date: this.getEpochCurrentMonth(),
            // limit: 51,
          },
        })
      );
      const ResultObj = JSON.parse(
        result.data.ListClosedTicketsForInvoiceGenerate
      );
      if (ResultObj.status == "SUCCESS") {
        this.getAllClosedTicketList = ResultObj.data.Items;

        this.invoiceInputObj = ResultObj.invoiceInput;
        // this.getAllClosedTicketList.map((item) => {
        //   this.ticketIds.push(item.ticket_id);
        // if (item.cost_for_ticket) {
        //   this.totalAmountIncGST =
        //     this.totalAmountIncGST +
        //     Number(
        //       parseFloat(
        //         parseFloat(item.cost_for_ticket) *
        //           parseFloat(item.cost_configuration_gst / 100) +
        //           parseFloat(item.cost_for_ticket)
        //       ).toFixed(2)
        //     );
        //   this.totalGSTAmount =
        //     this.totalGSTAmount +
        //     parseFloat(item.cost_configuration_gst / 100) *
        //       parseFloat(item.cost_for_ticket);
        // }
        // });
        this.overlay = false;
      }
    } catch (error) {
      this.getAllClosedTicketList = [];
      this.overlay = false;
    }
  },

  methods: {
    getEpochFromMonth() {
      const date = new Date(`${this.StoreObj2.from_month}-01T00:00:00Z`);
      return date.getTime() / 1000;
    },

    totalServiceCharges() {
      let totalServCharges = 0;
      if (this.selectedClosedTicket.length > 0) {
        this.selectedClosedTicket
          .filter((item) => Object.keys(item.service_charges).length > 0)
          .forEach((item2) => {
            const { travel_distance, ...rest } = item2.service_charges;
            totalServCharges += eval(Object.values(rest).join("+"));
          });
      }
      return totalServCharges;
    },

    getEpochCurrentMonth() {
      if (!this.StoreObj2.from_month) return null;
      const [year, month] = this.StoreObj2.from_month.split("-").map(Number);
      const lastDay = new Date(year, month, 0);
      lastDay.setHours(23, 59, 59, 999);
      return Math.floor(lastDay.getTime() / 1000);
    },

    getFromMonthName() {
      const [year, month] = this.StoreObj2.from_month.split("-").map(Number);
      const date = new Date(year, month - 1);
      return date.toLocaleString("en-US", { month: "long" });
    },

    getCurrentMonthName() {
      const now = new Date();
      return now.toLocaleString("en-US", { month: "long" });
    },

    GetTotalTime(seconds) {
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);
      var dDisplay = d > 0 ? d + (d == 1 ? " Day" : " Days") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " Hour" : " Hours") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " Minute" : " Minutes") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " Second" : " Seconds") : "";
      if (dDisplay != "") return dDisplay;
      else if (hDisplay != "") return hDisplay;
      else if (mDisplay != "") return mDisplay;
      else if (sDisplay) return sDisplay;
    },

    calculateTotalCost(item) {
      if (!item.cost_for_ticket) return "0.00";
      let gstPercentage = item.cost_configuration_gst / 100;
      let costForTicket = parseFloat(item.cost_for_ticket);
      let gstAmount = parseFloat((gstPercentage * costForTicket).toFixed(2));
      let totalCost = parseFloat((gstAmount + costForTicket).toFixed(2));
      return totalCost.toFixed(2);
    },

    initiatedInvoiceMethod() {
      if (this.selectedClosedTicket.length > 0) {
        this.storeObj.total_gst_incl_amount = this.totalAmountIncGST;
        this.storeObj.ticket_ids = this.ticketIds;
        this.storeObj.partner_id = this.StoreObj2.partner_id;
        this.callModifiedInvoiceObjMethod();
        this.currentView = "INITIALIZE_VIEW";
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly select any one ticket!",
          };
          this.renderComp = true;
        });
      }
    },
    callModifiedInvoiceObjMethod() {
      const modifiedInvoiceObj = structuredClone(this.invoiceInputObj);
      delete modifiedInvoiceObj.service_groups;
      let service_groups = [];
      this.selectedClosedTicket.forEach((selectedItem) => {
        const existingGroup = service_groups.find(
          (group) => group.service_type_id === selectedItem.service_type_id
        );
        const ticketIdsArray = Array.isArray(selectedItem.ticket_id)
          ? selectedItem.ticket_id
          : selectedItem.ticket_id
          ? [selectedItem.ticket_id]
          : [];
        if (existingGroup) {
          const groupItem = existingGroup.service_groups[0];
          groupItem.cost_for_ticket += selectedItem.cost_for_ticket ?? 0;
          groupItem.cost_configuration_gst +=
            selectedItem.cost_configuration_gst ?? 0;
          groupItem.total_cost += selectedItem.total_ticket_service_cost ?? 0;
          groupItem.ticket_ids.push(
            ...ticketIdsArray.filter((id) => !groupItem.ticket_ids.includes(id))
          );
          groupItem.tickets_count = groupItem.ticket_ids.length;
        } else {
          const sectionNo = (service_groups.length + 1).toString();
          service_groups.push({
            service_type_id: selectedItem.service_type_id,
            service_type_name: selectedItem.service_type_name,
            sectionNo: sectionNo,
            service_groups: [
              {
                cost_for_ticket: selectedItem.cost_for_ticket ?? 0,
                cost_configuration_gst:
                  selectedItem.cost_configuration_gst ?? 0,
                total_cost: selectedItem.total_ticket_service_cost ?? 0,
                ticket_ids: ticketIdsArray,
                tickets_count: ticketIdsArray.length,
                service_type_name: selectedItem.service_type_name,
                hsn_code: "",
              },
            ],
          });
        }
      });
      this.invoiceInputObj.service_groups = service_groups;
      this.invoiceInputObj.basic_amount = this.totalBasicAmount;
      const allServiceNames = new Set();
      this.selectedClosedTicket.forEach((ticket) => {
        Object.keys(ticket.service_charges).forEach((serviceName) => {
          allServiceNames.add(serviceName);
        });
      });
      const serviceIdMap = {};
      Array.from(allServiceNames).forEach((serviceName, index) => {
        serviceIdMap[serviceName] = (index + 1).toString();
      });
      // const mergedCharges = {};
      // this.selectedClosedTicket.forEach((ticket) => {
      //   Object.entries(ticket.service_charges).forEach(([key, value]) => {
      //     if (!mergedCharges[key]) {
      //       mergedCharges[key] = {
      //         section_no: serviceIdMap[key] ?? "other_id",
      //         service_groups: [
      //           {
      //             service_type_name: key,
      //             total_cost: 0,
      //           },
      //         ],
      //         service_type_id: serviceIdMap[key] ?? "other_id",
      //         service_type_name: key,
      //       };
      //     }
      //     mergedCharges[key].service_groups[0].total_cost += value;
      //   });
      // });
      // this.additionalCharges = Object.values(mergedCharges);
      const mergedCharges = {};
      this.selectedClosedTicket.forEach((ticket) => {
        Object.entries(ticket.service_charges).forEach(([key, value]) => {
          if (key === "travel_distance") return;
          if (!mergedCharges[key]) {
            mergedCharges[key] = {
              service_type_id: serviceIdMap[key] ?? "other_id",
              service_type_name: key,
              service_groups: [
                {
                  service_type_name: key,
                  total_cost: 0,
                  ticket_ids: [],
                  tickets_count: 0,
                },
              ],
            };
          }
          const group = mergedCharges[key].service_groups[0];
          group.total_cost += value;
          if (!group.ticket_ids.includes(ticket.ticket_id)) {
            group.ticket_ids.push(ticket.ticket_id);
            group.tickets_count = group.ticket_ids.length;
          }
        });
      });
      this.additionalCharges = Object.values(mergedCharges);
      let existingSections = this.invoiceInputObj.service_groups
        .map((group) => parseInt(group.sectionNo))
        .filter((n) => !isNaN(n));
      let nextSection =
        existingSections.length > 0 ? Math.max(...existingSections) + 1 : 1;
      this.additionalCharges.forEach((item, index) => {
        if (!item.sectionNo) {
          item.sectionNo = String(nextSection++);
        }
      });
      this.invoiceInputObj.service_groups.push(...this.additionalCharges);
    },

    InitiateInvoiceCardEmit(Toggle) {
      if (Toggle === 2) {
        this.CardEmit2();
      } else {
        this.currentView = "CLOSED_TICKET_VIEW";
      }
    },

    CardEmit2() {
      this.$emit("clicked");
    },

    handleClickRow(item) {
      console.log("CHECK", item);
    },
  },
};
</script>
