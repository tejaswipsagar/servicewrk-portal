<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <SelectMonthToGenerate
      :SelectMonthToGenerateDialog="selectMonthToGenerateDialog"
      @clicked="SelectMonthToGenerateDialogEmit"
    />
    <UploadInvoice
      :UploadInvoiceDialog="uploadInvoiceDialog"
      :InvoiceObj="invoiceObj"
      @clicked="UploadInvoiceDialogEmit"
    />
    <PayoutInfo
      :PayoutInfoDialog="payoutInfoDialog"
      :PayoutObj="payoutObj"
      @clicked="PayoutInfoDialogEmit"
    />
    <AcceptInvoice
      :AcceptInvoiceDialog="acceptInvoiceDialog"
      :InvoiceObj="invoiceObj"
      @clicked="AcceptInvoiceDialogEmit"
    />
    <InvoiceChangeRequest
      :InvoiceChangeRequestDialog="invoiceChangeRequestDialog"
      :InvoiceObj="invoiceObj"
      @clicked="InvoiceChangeRequestDialogEmit"
    />
    <EditedInvoiceInfo
      :EditedInvoiceInfoDialog="editedInvoiceInfoDialog"
      :InvoiceObj="invoiceObj"
      @clicked="EditedInvoiceInfoDialogEmit"
    />
    <UpdateBillDetails
      :UpdateBillDetailsDialog="updateBillDetailsDialog"
      :InvoiceObj="invoiceObj"
      @clicked="UpdateBillDetailsDialogEmit"
    />
    <v-card elevation="0" v-if="currentView === 'MAIN_PAGE'">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4" xs="12" class="ml-n4">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Payout</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="8" xs="12" class="d-flex justify-end">
          <div>
            <v-toolbar dense class="elevation-0">
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
              <v-text-field
                class="mt-9 mr-2 maxWidthSmall FontSize"
                dense
                outlined
                label="Search"
                v-model="search"
                append-icon="mdi-magnify"
              />

              <!-- <v-select
                dense
                outlined
                label="Status"
                v-model="status"
                :items="statusItem"
                class="mt-8 FontSize maxWidthXSmall"
              ></v-select> -->
              <!-- <v-select
                dense
                outlined
                v-model="uploadingInvoice"
                :items="uploadingInvoiceItems"
                class="mt-8 ml-2 mr-2 FontSize maxWidthXSmall"
              ></v-select> -->
              <v-btn
                v-if="
                  $store.getters.get_current_user_details.user_type !==
                  'SERVICE_PARTNER'
                "
                small
                class="ml-2 mt-1"
                color="primary"
                @click="generateMethod()"
              >
                Generate<v-icon small>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                v-if="
                  $store.getters.get_current_user_details.user_type !==
                  'SERVICE_PARTNER'
                "
                small
                class="ml-2 mt-1"
                color="primary"
                @click="CardEmit()"
              >
                Back<v-icon small>mdi-arrow-left</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          :search="search"
          dense
          fixed-header
          :items-per-page="50"
          :height="TableHeight"
          style="cursor: pointer"
          class="elevation-0 pa-0 TableValFontsize"
          :no-data-text="
            invoiceList && invoiceList.length === 0 ? 'No data found' : null
          "
          :headers="invoiceListHeader"
          :items="invoiceList"
          :footer-props="{
            'disable-items-per-page': true,
          }"
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.invoice_display_id`]="{ item }">
            <div
              v-if="item.is_requested_for_edit"
              style="position: relative; right: 20px"
            >
              <v-btn
                icon
                @click.stop="
                  (editedInvoiceInfoDialog = true), (invoiceObj = item)
                "
              >
                <v-icon color="red" small>mdi-pencil</v-icon>
              </v-btn>
              {{ item.invoice_display_id }}
            </div>
            <div v-else>
              {{ item.invoice_display_id }}
            </div>
          </template>
          <template v-slot:[`item.invoice_generated_on`]="{ item }">
            <div>
              {{
                new Date(item.invoice_generated_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
          </template>
          <template v-slot:[`item.is_payment_initiated_on`]="{ item }">
            <div>
              {{
                item.is_payment_initiated
                  ? new Date(
                      item.is_payment_initiated_on * 1000
                    ).toLocaleString("en-GB")
                  : "-"
              }}
            </div>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu right bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense nav>
                <v-list-item-group color="primary">
                  <v-list-item @click.stop="viewPdfMethod(item.invoice_s3_url)">
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Verify PDF</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="
                      (updateBillDetailsDialog = true), (invoiceObj = item)
                    "
                    v-if="
                      $store.getters.get_current_user_details.user_type ===
                        'SERVICE_PARTNER' &&
                      item.is_invoice_accepted === true &&
                      (item.is_bill_details_updated === false ||
                        item.is_bill_details_updated === undefined)
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="pink">mdi-update</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Update Bill Details</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="reUploadInvoiceMethod(item)"
                    v-if="
                      $store.getters.get_current_user_details.user_type ===
                        'SERVICE_PARTNER' &&
                      item.is_bill_details_updated === true &&
                      (item.is_payment_initiated === false ||
                        item.is_payment_initiated === undefined)
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="orange">mdi-upload</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Upload Document</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="
                      (acceptInvoiceDialog = true), (invoiceObj = item)
                    "
                    v-if="
                      $store.getters.get_current_user_details.user_type ===
                        'SERVICE_PARTNER' &&
                      (item.is_invoice_accepted === undefined ||
                        item.is_invoice_accepted === false)
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="green">mdi-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Accept Invoice</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="
                      (invoiceChangeRequestDialog = true), (invoiceObj = item)
                    "
                    v-if="
                      $store.getters.get_current_user_details.user_type ===
                        'SERVICE_PARTNER' &&
                      (item.is_invoice_accepted === false ||
                        item.is_invoice_accepted === undefined)
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Request For Changes</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
          <!-- <template v-slot:[`item.invoice_s3_url`]="{ item }">
            <div class="d-flex">
              <div>
                <v-btn icon @click.stop="viewPdfMethod(item.invoice_s3_url)"
                  ><v-icon small color="primary">mdi-eye</v-icon></v-btn
                >
              </div>
              <div
                v-if="
                  $store.getters.get_current_user_details.user_type ===
                  'SERVICE_PARTNER'
                "
              >
                <v-btn
                  v-if="
                    item.is_payment_initiated === false ||
                    item.is_payment_initiated === undefined
                  "
                  icon
                  @click.stop="reUploadInvoiceMethod(item)"
                  ><v-icon small color="blue">mdi-upload</v-icon></v-btn
                >
              </div>
            </div>
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>
    <GenerateServicePayout v-else :StoreObj2="storeObj2" @clicked="CardEmit2" />
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import GenerateServicePayout from "@/components/ServicePartnerPayout/Cards/GenerateServicePayoutCard.vue";
import SelectMonthToGenerate from "@/components/ServicePartnerPayout/Dialogs/SelectMonthToGenerateDialog.vue";
import UploadInvoice from "@/components/ServicePartnerPayout/Dialogs/UploadInvoiceDialog.vue";
import { ListInvoice } from "@/graphql/queries.js";
import { UsersWorkFlowPayments } from "@/graphql/queries.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import PayoutInfo from "@/components/ServicePartnerPayout/Dialogs/PayoutInfoDialog.vue";
import AcceptInvoice from "@/components/ServicePartnerPayout/Dialogs/AcceptInvoiceDialog.vue";
import InvoiceChangeRequest from "@/components/ServicePartnerPayout/Dialogs/InvoiceChangeRequestDialog.vue";
import EditedInvoiceInfo from "@/components/ServicePartnerPayout/Dialogs/EditedInvoiceInfoDialog.vue";
import UpdateBillDetails from "@/components/ServicePartnerPayout/Dialogs/UpdateBillDetails.vue";

export default {
  components: {
    Snackbar,
    GenerateServicePayout,
    SelectMonthToGenerate,
    Overlay,
    UploadInvoice,
    PayoutInfo,
    AcceptInvoice,
    InvoiceChangeRequest,
    EditedInvoiceInfo,
    UpdateBillDetails,
  },
  props: {
    StoreObj: Object,
  },
  data: () => ({
    reportmonth: new Date().toISOString().substr(0, 7),
    menum: false,
    renderComp: true,
    search: "",
    overlay: true,
    SnackBarComponent: {},
    status: "APPROVED",
    statusItem: ["ALL", "INITIATED", "INPROGRESS", "APPROVED"],
    currentView: "MAIN_PAGE",
    selectMonthToGenerateDialog: false,
    storeObj2: {},
    invoiceList: [],
    invoiceListHeader: [
      // {
      //   text: "",
      //   value: "is_requested_for_edit",
      //   width: "0",
      // },
      {
        text: "Invoice Display ID",
        value: "invoice_display_id",
      },
      {
        text: "Invoice Generated On",
        value: "invoice_generated_on",
      },
      {
        text: "Reporting User Name",
        value: "reporting_user_name",
      },
      {
        text: "Reporting User Email ID",
        value: "reporting_user_email_id",
      },
      {
        text: "Invoice Status",
        value: "invoice_status",
      },
      {
        text: "Total Cost",
        value: "total_cost",
      },
      {
        text: "Payment Initiated On",
        value: "is_payment_initiated_on",
      },
      {
        text: "Actions",
        value: "actions",
      },
    ],
    uploadInvoiceDialog: false,
    invoiceObj: {},
    uploadingInvoice: "INVOICE",
    uploadingInvoiceItems: ["INVOICE", "PAYMENT"],
    TableHeight: 0,
    payoutInfoDialog: false,
    acceptInvoiceDialog: false,
    invoiceChangeRequestDialog: false,
    editedInvoiceInfoDialog: false,
    updateBillDetailsDialog: false,
    payoutObj: {},
  }),

  async mounted() {
    this.TableHeight = window.innerHeight - 220;
    this.callApiMethod();
  },

  watch: {
    async reportmonth(val) {
      if (val) {
        this.invoiceList = [];
        this.overlay = true;
        await this.callApiMethod();
      }
    },

    async status(val) {
      if (val && this.uploadingInvoice === "INVOICE") {
        this.invoiceList = [];
        await this.callApiMethod();
      } else {
        this.invoiceList = [];
        await this.callSecondApiMethod();
      }
    },

    async uploadingInvoice(val) {
      if (val === "INVOICE") {
        this.invoiceList = [];
        this.status = "APPROVED";
        // this.statusItem = ["ALL", "INITIATED", "INPROGRESS", "APPROVED"];
        await this.callApiMethod();
      } else {
        this.invoiceList = [];
        this.status = "INITIATED";
        this.statusItem = ["INITIATED", "APPROVED", "INPROGRESS", "REJECTED"];
        await this.callSecondApiMethod();
      }
    },
  },

  methods: {
    viewPdfMethod(url) {
      const cacheBustedUrl = `${url}?cb=${new Date().getTime()}`;
      window.open(cacheBustedUrl, "_blank");
    },

    handleRowClick(item) {
      this.payoutObj = item;
      this.payoutObj.invoiceOrPayment = this.uploadingInvoice;
      this.payoutInfoDialog = true;
      console.log("ITEM", item);
    },

    reUploadInvoiceMethod(item) {
      this.invoiceObj = item;
      console.log("INVOICE_IT", item);
      this.uploadInvoiceDialog = true;
    },
    async callApiMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(ListInvoice, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              viwer_user_id:
                this.$store.getters.get_current_user_details.user_type ===
                "SERVICE_PARTNER"
                  ? this.$store.getters.get_current_user_details.user_id
                  : this.StoreObj.partner_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              month: this.reportmonth,
              invoice_status: this.status,
            },
          })
        );
        const response = JSON.parse(result.data.ListInvoice).data.Items;
        this.invoiceList = response;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
      }
    },

    async callSecondApiMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(UsersWorkFlowPayments, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id:
                this.$store.getters.get_current_user_details.user_type ===
                "SERVICE_PARTNER"
                  ? this.$store.getters.get_current_user_details.user_id
                  : this.StoreObj.partner_id,
              payment_month: this.reportmonth,
              payment_workflow_status:
                this.status === "INITIATED" ? "PENDING" : this.status,
            },
          })
        );
        const response = JSON.parse(result.data.UsersWorkFlowPayments).data
          .Items;
        this.invoiceList = response;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
      }
    },

    generateMethod() {
      this.selectMonthToGenerateDialog = true;
    },

    CardEmit() {
      this.$emit("clicked");
    },

    async CardEmit2() {
      this.currentView = "MAIN_PAGE";
      await this.callApiMethod();
    },

    SelectMonthToGenerateDialogEmit(Toggle, from, to) {
      this.selectMonthToGenerateDialog = false;
      if (Toggle === 2) {
        this.currentView = "GENERATE_VIEW";
        this.storeObj2.from_month = from;
        this.storeObj2.to_month = to;
        this.storeObj2.partner_id = this.StoreObj.partner_id;
      }
    },

    async UploadInvoiceDialogEmit(Toggle) {
      this.uploadInvoiceDialog = false;
      if (Toggle === 2) {
        await this.callApiMethod();
      }
    },

    PayoutInfoDialogEmit(Toggle) {
      this.payoutInfoDialog = false;
    },

    async AcceptInvoiceDialogEmit(Toggle) {
      this.acceptInvoiceDialog = false;
      if (Toggle === 2) {
        // this.uploadInvoiceDialog = true;
        await this.callApiMethod();
      }
    },

    async InvoiceChangeRequestDialogEmit(Toggle) {
      this.invoiceChangeRequestDialog = false;
      if (Toggle === 2) {
        await this.callApiMethod();
      }
    },

    EditedInvoiceInfoDialogEmit(Toggle) {
      this.editedInvoiceInfoDialog = false;
    },

    async UpdateBillDetailsDialogEmit(Toggle) {
      this.updateBillDetailsDialog = false;
      if (Toggle === 2) {
        await this.callApiMethod();
      }
    },
  },
};
</script>
