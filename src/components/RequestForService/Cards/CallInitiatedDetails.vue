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
            <v-tab
              class="text-capitalize"
              v-if="StoreObj.email_type === 'CONVERTED'"
              >Ticket Details</v-tab
            >
            <v-tab class="text-capitalize">History</v-tab>
          </v-tabs>
          <v-spacer></v-spacer>
          <v-btn small color="primary" @click="CallInitiatedDeatilsEmit()"
            ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
          >
        </v-toolbar>
      </v-card-text>
      <v-card
        outlined
        style="border: 1px solid grey"
        class="ml-3"
        v-if="tab === 0 && StoreObj1[0]"
      >
        <v-card-title>
          <v-row>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div>
                <span class="FontSize font-weight-bold">Customer Type :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].customer_type != undefined"
                >
                  {{ StoreObj1[0].customer_type }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div>
                <span class="FontSize font-weight-bold">Customer :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].customer_company_name != undefined"
                >
                  {{ StoreObj1[0].customer_company_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12">
              <div>
                <span class="FontSize font-weight-bold">Contact Person :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].customer_name != undefined"
                >
                  {{ StoreObj1[0].customer_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n4">
              <div>
                <span class="FontSize font-weight-bold">Customer ID :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].customer_unique_id != undefined"
                >
                  {{ StoreObj1[0].customer_unique_id }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n4">
              <div>
                <span class="FontSize font-weight-bold">Phone Number :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].customer_phone_number != undefined"
                >
                  {{ StoreObj1[0].customer_phone_number }}
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
                  v-if="StoreObj1[0].secondary_customer_contact != undefined"
                >
                  {{ StoreObj1[0].secondary_customer_contact }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Mail Id :</span>
                <span class="font-weight-regular black--text FontSize">
                  {{
                    StoreObj1[0].initiater_email_id ||
                    StoreObj1[0].customer_email_id ||
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
                    new Date(
                      StoreObj1[0].email_received_on * 1000
                    ).toLocaleString("en-GB") ||
                    new Date(
                      StoreObj1[0].ticket_created_on * 1000
                    ).toLocaleString("en-GB") ||
                    "-"
                  }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Source :</span>
                <span class="font-weight-regular black--text FontSize">
                  {{
                    StoreObj1[0].source ||
                    StoreObj1[0].ticket_call_source ||
                    "-"
                  }}
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
                  v-if="StoreObj1[0].ticket_address != undefined"
                >
                  {{ StoreObj1[0].ticket_address }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">City :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].ticket_city != undefined"
                >
                  {{ StoreObj1[0].ticket_city }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">State :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].ticket_state != undefined"
                >
                  {{ StoreObj1[0].ticket_state }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Pincode :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].ticket_pincode != undefined"
                >
                  {{ StoreObj1[0].ticket_pincode }}
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
                  v-if="StoreObj1[0].customer_category_name != undefined"
                >
                  {{ StoreObj1[0].customer_category_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Email Subject :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].email_subject != undefined"
                >
                  {{ StoreObj1[0].email_subject }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Email Body :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].email_body != undefined"
                >
                  {{ StoreObj1[0].email_body }}
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
                  v-if="StoreObj1[0].category_name != undefined"
                >
                  {{ StoreObj1[0].category_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Product :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].service_name != undefined"
                >
                  {{ StoreObj1[0].service_name }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Serial Number :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].service_serial_number != undefined"
                >
                  {{ StoreObj1[0].service_serial_number }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Ticket Priority :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].ticket_priority != undefined"
                >
                  {{ StoreObj1[0].ticket_priority }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Support :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].ticket_warranty_type != undefined"
                >
                  {{ StoreObj1[0].ticket_warranty_type }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Support Type :</span>
                <span class="font-weight-regular black--text FontSize">
                  {{
                    StoreObj1[0].warranty_type ||
                    StoreObj1[0].support_type ||
                    "-"
                  }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Ticket Type :</span>
                <span
                  class="font-weight-regular black--text FontSize"
                  v-if="StoreObj1[0].ticket_creation_type != undefined"
                >
                  {{ StoreObj1[0].ticket_creation_type.replaceAll("_", " ") }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Invoice Date :</span>
                <span v-if="StoreObj1[0].ticket_warranty_details != undefined">
                  <span
                    class="font-weight-regular black--text FontSize"
                    v-if="
                      StoreObj1[0].ticket_warranty_details
                        .ticket_invoice_date != undefined
                    "
                  >
                    {{
                      StoreObj1[0].ticket_warranty_details.ticket_invoice_date
                    }}
                  </span>
                  <span v-else class="font-weight-regular ml-4">-</span>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-n6">
              <div>
                <span class="FontSize font-weight-bold">Invoice Number :</span>
                <span v-if="StoreObj1[0].ticket_warranty_details != undefined">
                  <span
                    class="font-weight-regular black--text FontSize"
                    v-if="
                      StoreObj1[0].ticket_warranty_details
                        .ticket_invoice_number != undefined
                    "
                  >
                    {{
                      StoreObj1[0].ticket_warranty_details.ticket_invoice_number
                    }}
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
                  v-if="StoreObj1[0].additional_comments != undefined"
                >
                  {{ StoreObj1[0].additional_comments }}
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
                  v-if="StoreObj1[0].prefered_visit_date != undefined"
                >
                  {{ StoreObj1[0].prefered_visit_date }}
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
                  v-if="StoreObj1[0].prefered_visit_time != undefined"
                >
                  {{ StoreObj1[0].prefered_visit_time }}
                </span>
                <span v-else class="font-weight-regular ml-4">-</span>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
      <v-card
        outlined
        v-if="StoreObj.email_type === 'CONVERTED' ? tab === 1 : tab === 0"
      >
        <v-card-title>
          <v-card
            color="purple lighten-5"
            class="pa-5 mb-3"
            v-for="(item, index) in StoreObj.rfs_history"
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
                  <strong>Taken On: </strong>{{ item.action_time || "-" }}
                </p>
                <p class="FontSize pb-2">
                  <strong>Action By: </strong>{{ item.action_taken_by || "-" }}
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-card-title>
      </v-card>
    </v-card>
  </div>
</template>
<script>
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
  },
  data: () => ({
    tab: 0,
    StoreObj1: {},
    FileHeaders: [
      { text: "Sl No", value: "sl_no" },
      { text: "File Name", value: "file_name" },
      { text: "File Type", value: "file_type" },
    ],
  }),

  async mounted() {
    console.log("CARD_STOREOBJ", this.StoreObj);
    if (this.StoreObj.email_type === "CONVERTED") {
      this.StoreObj1 = await this.TicketDetailsListMethod(
        this.StoreObj.ticket_id
      );
      console.log("StoreObj1[0]", this.StoreObj1[0]);
    }
  },
  methods: {
    CallInitiatedDeatilsEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
