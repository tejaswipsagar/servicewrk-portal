<template>
  <div>
    <!-- <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" /> -->
    <DisplayPaymentImages
      :DisplayPaymentImagesDialog="DisplayPaymentImagesDialog"
      :StoreArray="StoreArray"
      @clicked="DisplayPaymentImagesDialogEmit"
    />
    <v-dialog v-model="DisplayPaymentDetailsDialog" persistent :width="1000">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Payment Details
            <span class="font-weight-regular white--text ml-5"
              >(
              {{
                StoreObj.quotation_created_from_ticket_type == undefined ||
                StoreObj.quotation_created_from_ticket_type == ""
                  ? "NA"
                  : StoreObj.quotation_created_from_ticket_type ==
                    "ORIGINAL_TICKET"
                  ? "Quotation Generated Against The Ticket"
                  : "Quotation Generated Directly"
              }}
              )</span
            >
          </div>
          <v-spacer></v-spacer>
          <div class="mr-10">
            Initiated By :
            <span class="font-weight-bold"
              >{{ StoreObj.initiater_user_name }}
              <span v-if="StoreObj.initiater_user_type"
                >( {{ StoreObj.initiater_user_type }} )</span
              ></span
            >
          </div>
          <v-btn icon @click="DisplayPaymentDetailsDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-tabs v-model="Tabmodel" slider-color="primary">
          <v-tab>Qutation Details</v-tab>
          <v-tab> Qutation History </v-tab>
          <v-spacer />
          <div class="fontsize20px font-weight-bold black--text mr-5 mt-2">
            Quotation ID :
            <span class="font-weight-regular black--text">{{
              StoreObj.quotation_display_id
            }}</span>
            <!-- StoreObj.quotation_created_from_ticket_type == "ORIGINAL_TICKET"
                ? StoreObj.custom_ticket_id != undefined
                  ? StoreObj.custom_ticket_id
                  : StoreObj.ticket_id
                : -->
          </div>
        </v-tabs>
        <v-tabs-items v-model="Tabmodel">
          <v-tab-item>
            <v-card-text v-if="Tabmodel === 0">
              <v-row class="ml-8">
                <v-col cols="12" md="7" xs="12" sm="12">
                  <div class="font-weight-bold fontsize20px black--text mt-4">
                    Customer Details
                  </div>
                  <div
                    class="FontSize font-weight-bold black--text mt-2 align-left"
                  >
                    Name :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.creator_user_name == undefined ||
                      StoreObj.creator_user_name == ""
                        ? "NA"
                        : StoreObj.creator_user_name
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Company Name :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_company_name == undefined ||
                      StoreObj.customer_company_name == ""
                        ? "NA"
                        : StoreObj.customer_company_name
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    ID :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_unique_id == undefined ||
                      StoreObj.customer_unique_id == ""
                        ? "NA"
                        : StoreObj.customer_unique_id
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Email ID :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_email_id == undefined ||
                      StoreObj.customer_email_id == ""
                        ? "NA"
                        : StoreObj.customer_email_id
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Address :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_address == undefined ||
                      StoreObj.customer_address == ""
                        ? "NA"
                        : StoreObj.customer_address
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Ph.No :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_phone_number == undefined ||
                      StoreObj.customer_phone_number == ""
                        ? "NA"
                        : StoreObj.customer_phone_number
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    City :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_city == undefined ||
                      StoreObj.customer_city == ""
                        ? "NA"
                        : StoreObj.customer_city
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    State :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_state == undefined ||
                      StoreObj.customer_state == ""
                        ? "NA"
                        : StoreObj.customer_state
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Pin Code :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.customer_pincode == undefined ||
                      StoreObj.customer_pincode == ""
                        ? "NA"
                        : StoreObj.customer_pincode
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Sent Comments :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.sent_comments ?? "N/A"
                    }}</span>
                  </div>
                  <div
                    class="FontSize font-weight-bold black--text mt-2"
                    v-if="StoreObj.closed_on"
                  >
                    Attachments:
                    <v-btn
                      icon
                      v-if="attachementList.length > 0"
                      @click="displayDialogssmethod(StoreObj.attachments)"
                      ><v-icon color="primary" size="17"
                        >mdi-paperclip</v-icon
                      ></v-btn
                    >
                    <span v-else>N/A</span>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  xs="12"
                  sm="12"
                  v-if="
                    Status_Type == 'PAYMENT_DONE' || Status_Type == 'CLOSED'
                  "
                >
                  <div class="font-weight-bold mt-4 black--text fontsize20px">
                    Payment Details
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Payment Type :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.payment_details?.payment_type || "N/A"
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Mode of Payment :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.payment_details?.mode_of_payment || "N/A"
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Date of Payment :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.payment_details?.date_of_payment || "N/A"
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Payment Value :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.payment_details?.payment_value || "N/A"
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Payment Reference Number :
                    <span class="font-weight-regular black--text">{{
                      StoreObj.payment_details?.payment_reference_number ||
                      "N/A"
                    }}</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Payment Done Remarks :
                    <span
                      v-if="StoreObj.payment_done_comments"
                      class="font-weight-regular black--text"
                      >{{ StoreObj.payment_done_comments }}</span
                    >
                    <span v-else>N/A</span>
                  </div>
                  <div class="FontSize font-weight-bold black--text mt-2">
                    Attachments :
                    <span class="font-weight-regular black--text"
                      >{{ attachementList.length <= 0 ? "No attachments" : null
                      }}<v-btn
                        icon
                        v-if="attachementList.length > 0"
                        @click="displayDialogssmethod(StoreObj.attachments)"
                        ><v-icon color="primary" size="17"
                          >mdi-paperclip</v-icon
                        ></v-btn
                      ></span
                    >
                  </div>

                  <v-col
                    cols="12"
                    md="12"
                    xs="12"
                    sm="12"
                    v-if="Status_Type == 'CLOSED'"
                    class="ml-n3"
                  >
                    <div class="font-weight-bold mt-4 black--text fontsize20px">
                      Closed Details
                    </div>

                    <div class="FontSize font-weight-bold black--text mt-2">
                      Date of Closed:
                      <span
                        v-if="StoreObj.closed_on"
                        class="font-weight-regular black--text"
                        >{{
                          new Date(
                            StoreObj.closed_on * 1000
                          ).toLocaleDateString()
                        }}</span
                      >
                      <span v-else>N/A</span>
                    </div>

                    <div class="FontSize font-weight-bold black--text mt-2">
                      Closed Remarks :
                      <span
                        v-if="StoreObj.closed_comments"
                        class="font-weight-regular black--text"
                        >{{ StoreObj.closed_comments }}</span
                      >
                      <span v-else>N/A</span>
                    </div>
                    <div class="FontSize font-weight-bold black--text mt-2">
                      Attachments :
                      <v-btn
                        icon
                        v-if="
                          StoreObj.quotation_closed_attachments &&
                          StoreObj.quotation_closed_attachments.length > 0
                        "
                        @click="
                          displayDialogssmethod(
                            StoreObj.quotation_closed_attachments
                          )
                        "
                        ><v-icon color="primary" size="17"
                          >mdi-paperclip</v-icon
                        ></v-btn
                      >
                      <span v-else class="font-weight-regular black--text"
                        >No attachments</span
                      >
                    </div></v-col
                  >
                  <!-- <div class="ml-4" style="display: flex; flex-direction: row; flex-wrap: wrap; ">
                <div class="mr-4 mb-4" v-for="(attachment, index) in attachementList" :key="index">
                  <v-img :width="300" :height="150" :src="attachment" />
                </div>
              </div> -->
                </v-col>
              </v-row>
            </v-card-text>
          </v-tab-item>
          <v-tab-item>
            <v-card-text v-if="Tabmodel === 1">
              <v-card
                class="elevation-0 mt-1"
                outlined
                color="#f3e5f5"
                v-for="(item, index) in StoreObj.quotation_history"
                :key="index"
              >
                <div class="FontSize font-weight-bold black--text ml-4 mt-2">
                  Action Taken By :
                  <span class="font-weight-regular black--text">{{
                    item.action_taken_by == undefined ||
                    item.action_taken_by == ""
                      ? "NA"
                      : item.action_taken_by
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text ml-4 mt-2">
                  Time :
                  <span class="font-weight-regular black--text">{{
                    item.action_time == undefined || item.action_time == ""
                      ? "NA"
                      : item.action_time
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text ml-4 mt-2">
                  Type :
                  <span class="font-weight-regular black--text">{{
                    item.action_type == undefined || item.action_type == ""
                      ? "NA"
                      : item.action_type
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text ml-4 mt-2">
                  Email ID :
                  <span class="font-weight-regular black--text">{{
                    item.user_contact == undefined || item.user_contact == ""
                      ? "NA"
                      : item.user_contact
                  }}</span>
                </div>
              </v-card>
            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import DisplayPaymentImages from "./DisplayPaymentImages.vue";
import { GetParticularQuotData } from "@/mixins/Approvals/GetQuotationDetails.js";
export default {
  mixins: [GetParticularQuotData],
  props: {
    StoreObj: Object,
    DisplayPaymentDetailsDialog: Boolean,
    Status_Type: String,
  },
  components: {
    DisplayPaymentImages,
  },
  data: () => ({
    Tabmodel: 0,
    attachementList: [],
    DisplayPaymentImagesDialog: false,
    StoreArray: [],
  }),
  watch: {
    DisplayPaymentDetailsDialog(val) {
      if (val == true) {
        if (this.StoreObj.attachments) {
          this.attachementList = this.StoreObj.attachments.map(
            (item) => item.file_url
          );
        } else if (this.StoreObj.quotation_closed_attachments) {
          this.attachementList = this.StoreObj.quotation_closed_attachments.map(
            (item) => item.file_url
          );
        }
        if (this.StoreObj.route_path === "/QuotationApprovals") {
          this.CallGetQuotDataAPIMethod();
        }
      }
    },
  },

  methods: {
    DisplayPaymentDetailsDialogEmit(Toggle) {
      this.attachementList = [];
      this.Tabmodel = null;
      this.$emit("clicked", Toggle);
    },

    async CallGetQuotDataAPIMethod() {
      await this.GetParticularQuotDataMethod(this.StoreObj.quotation_id);
    },

    DisplayPaymentImagesDialogEmit(Toggle) {
      this.DisplayPaymentImagesDialog = false;
    },
    displayDialogssmethod(item) {
      this.StoreArray = item;
      this.DisplayPaymentImagesDialog = true;
    },
  },
};
</script>
