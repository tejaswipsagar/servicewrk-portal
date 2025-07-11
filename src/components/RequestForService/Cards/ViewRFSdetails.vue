<template>
  <div>
    <v-card class="elevation-0">
      <v-card-text>
        <v-toolbar dense class="elevation-0">
          <v-tabs
            class="ma-2"
            v-model="tab"
            background-color="transparent"
            color="primary"
          >
            <v-tab class="text-capitalize">Request For Service Details</v-tab>
            <v-tab class="text-capitalize">History</v-tab>
          </v-tabs>
          <!-- <v-icon small class="ml-n4">mdi-eye</v-icon>
          <div class="PrimaryFontColor ml-2">Request For Service Details</div> -->
          <v-spacer></v-spacer>
          <v-btn small color="primary" @click="ViewRfsDetailsEmit()"
            ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
          >
        </v-toolbar>
      </v-card-text>
      <v-card
        outlined
        style="border: 1px solid grey"
        class="ml-3"
        a
        v-if="tab == 0"
      >
        <v-card-title>
          <v-row>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div>
                <span class="FontSize font-weight-bold">Customer Type :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.customer_type != undefined"
                >
                  {{ StoreObj.customer_type }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div>
                <span class="FontSize font-weight-bold">Customer :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.customer_company_name != undefined"
                >
                  {{ StoreObj.customer_company_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div>
                <span class="FontSize font-weight-bold">Contact Person :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.customer_name != undefined"
                >
                  {{ StoreObj.customer_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n4">
              <div>
                <span class="FontSize font-weight-bold">Customer ID :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.customer_unique_id != undefined"
                >
                  {{ StoreObj.customer_unique_id }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n4">
              <div>
                <span class="FontSize font-weight-bold">Phone Number :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.customer_phone_number != undefined"
                >
                  {{ StoreObj.customer_phone_number }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n4">
              <div>
                <span class="FontSize font-weight-bold"
                  >Secondary Phone Number :</span
                >
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.secondary_customer_contact != undefined"
                >
                  {{ StoreObj.secondary_customer_contact }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Mail Id :</span>
                <span class="font-weight-regular black--text FontSize">
                  {{
                    StoreObj.initiater_email_id ||
                    StoreObj.customer_email_id ||
                    "-"
                  }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold"
                  >Request Received On :</span
                >
                <span class="font-weight-regular black--text FontSize">
                  {{
                    new Date(StoreObj.email_received_on * 1000).toLocaleString(
                      "en-GB"
                    ) ||
                    new Date(StoreObj.ticket_created_on * 1000).toLocaleString(
                      "en-GB"
                    ) ||
                    "-"
                  }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Source :</span>
                <span class="font-weight-regular black--text FontSize">
                  {{ StoreObj.source || StoreObj.ticket_call_source || "-" }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="12" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold"
                  >Customer Address :</span
                >
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.ticket_address != undefined"
                >
                  {{ StoreObj.ticket_address }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">City :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.ticket_city != undefined"
                >
                  {{ StoreObj.ticket_city }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">State :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.ticket_state != undefined"
                >
                  {{ StoreObj.ticket_state }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Pincode :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.ticket_pincode != undefined"
                >
                  {{ StoreObj.ticket_pincode }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold"
                  >Customer Category :</span
                >
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.customer_category_name != undefined"
                >
                  {{ StoreObj.customer_category_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Email Subject :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.email_subject != undefined"
                >
                  {{ StoreObj.email_subject }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Email Body :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.email_body != undefined"
                >
                  {{ StoreObj.email_body }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Category :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.category_name != undefined"
                >
                  {{ StoreObj.category_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Product :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.service_name != undefined"
                >
                  {{ StoreObj.service_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Serial Number :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.service_serial_number != undefined"
                >
                  {{ StoreObj.service_serial_number }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Ticket Priority :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.ticket_priority != undefined"
                >
                  {{ StoreObj.ticket_priority }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Support :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.ticket_warranty_type != undefined"
                >
                  {{ StoreObj.ticket_warranty_type }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Support Type :</span>
                <span class="font-weight-regular black--text FontSize">
                  {{ StoreObj.warranty_type || StoreObj.support_type || "-" }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Ticket Type :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.ticket_creation_type != undefined"
                >
                  {{ StoreObj.ticket_creation_type.replaceAll("_", " ") }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Invoice Date :</span>
                <span v-if="StoreObj.ticket_warranty_details != undefined">
                  <span
                    class="font-weight-regular black--text FontSize"
                    v-if="
                      StoreObj.ticket_warranty_details.ticket_invoice_date !=
                      undefined
                    "
                  >
                    {{ StoreObj.ticket_warranty_details.ticket_invoice_date }}
                  </span>
                  <span v-else class="font-weight-regular ml-4">-</span>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Invoice Number :</span>
                <span v-if="StoreObj.ticket_warranty_details != undefined">
                  <span
                    class="font-weight-regular black--text FontSize"
                    v-if="
                      StoreObj.ticket_warranty_details.ticket_invoice_number !=
                      undefined
                    "
                  >
                    {{ StoreObj.ticket_warranty_details.ticket_invoice_number }}
                  </span>
                  <span v-else class="font-weight-regular ml-4">-</span>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold"
                  >Additional Comments :</span
                >
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.additional_comments != undefined"
                >
                  {{ StoreObj.additional_comments }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold"
                  >Preferred Visit Date :</span
                >
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.prefered_visit_date != undefined"
                >
                  {{ StoreObj.prefered_visit_date }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold"
                  >Preferred Visit Time :</span
                >
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj.prefered_visit_time != undefined"
                >
                  {{ StoreObj.prefered_visit_time }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="12">
              <h3
                v-if="
                  StoreObj.attachments != undefined &&
                  StoreObj.attachments.length != 0
                "
              >
                Added Files
              </h3>
              <div
                v-if="
                  StoreObj.attachments != undefined &&
                  StoreObj.attachments.length != 0
                "
              >
                <v-data-table
                  @click:row="handleRowClick"
                  :headers="FileHeaders"
                  :items="StoreObj.attachments"
                  dense
                  class="FontSize elevation-0"
                  fixed-header
                  height="auto"
                  nax-height="300px"
                  :footer-props="{
                    'items-per-page-options': [20, 50, 100],
                  }"
                  :items-per-page="20"
                >
                  <template v-slot:[`item.sl_no`]="{ item }">
                    <div class="FontSize" color="primary">
                      {{ StoreObj.attachments.indexOf(item) + 1 }}
                    </div>
                  </template>
                </v-data-table>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
      <v-card
        elevation="0"
        class="ml-3 pa-5"
        style="border: 1px solid black"
        v-if="tab == 1"
        width="80%"
      >
        <v-row>
          <v-col cols="12" lg="6" md="6" sm="12" xs="12">
            <p class="FontSize pb-2">
              <strong>Ticket ID: </strong
              >{{ StoreObj.custom_ticket_id || StoreObj.ticket_id }}
            </p>
            <p class="FontSize pb-2">
              <strong>Complaint ID: </strong>{{ StoreObj.complaint_id || "-" }}
            </p>
            <p class="FontSize pb-2">
              <strong>Ticket Type: </strong>{{ StoreObj.ticket_type || "-" }}
            </p>
          </v-col>
          <v-col cols="12" lg="6" md="6" sm="12" xs="12">
            <p class="FontSize pb-2">
              <strong>Customer Email ID: </strong
              >{{ StoreObj.custom_email_id || "-" }}
            </p>
            <p class="FontSize pb-2">
              <strong>Customer Phone Number: </strong
              >{{ StoreObj.customer_phone_number || "-" }}
            </p>
          </v-col>
        </v-row>
        <v-card
          color="purple lighten-5"
          class="pa-5 mb-3"
          v-for="(item, index) in StoreObj.rft_history"
          :key="index"
        >
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <p class="FontSize pb-2">
                <strong>Action Type: </strong>{{ item.action_type || "-" }}
              </p>
              <p class="FontSize pb-2">
                <strong>Action Taken: </strong>{{ item.action_taken || "-" }}
              </p>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <p class="FontSize pb-2">
                <strong>Taken On: </strong>{{ item.action_taken_on || "-" }}
              </p>
              <p class="FontSize pb-2">
                <strong>Action By: </strong>{{ item.action_taken_by || "-" }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    StoreObj: Object,
  },
  data: () => ({
    tab: null,
    FileHeaders: [
      { text: "Sl No", value: "sl_no" },
      { text: "File Name", value: "file_name" },
      { text: "File Type", value: "file_type" },
    ],
  }),

  mounted() {
    console.log("CARD_STOREOBJ", this.StoreObj);
  },
  methods: {
    handleRowClick(item) {
      window.open(item.file_url);
    },
    ViewRfsDetailsEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
