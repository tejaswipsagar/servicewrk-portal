<template>
  <div>
    <v-dialog persistent width="90%" :value="MrfTicketDetailsDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <div class="ml-2">Material Request Ticket Details</div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="MrfTicketDetailsDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row no-gutters>
            <div class="ml-2 font-weight-bold black--text">
              Customer Information :
            </div>
          </v-row>
          <v-card-title>
            <v-row>
              <v-col cols="12" sm="12" md="4" xs="12">
                <span class="FontSize font-weight-bold black--text"
                  >Ticket-Id :
                  <span
                    v-if="StoreObj.custom_ticket_id == undefined"
                    class="font-weight-regular black--text"
                    >{{ StoreObj.ticket_id }}
                  </span>
                  <span
                    v-else-if="StoreObj.custom_ticket_id != undefined"
                    class="font-weight-regular black--text"
                    >{{ StoreObj.custom_ticket_id }}</span
                  >
                </span>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Created On :
                  <span class="font-weight-regular black--text">{{
                    new Date(StoreObj.ticket_created_on * 1000).toLocaleString(
                      "en-GB"
                    )
                  }}</span>
                </div>
                <div
                  v-if="StoreObj.created_by_source != undefined"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Created By :
                  <span
                    v-if="StoreObj.created_by_source != 'AGENT'"
                    class="font-weight-regular black-text"
                  >
                    {{ StoreObj.created_by_source.replaceAll("_", " ") }}
                  </span>
                  <span
                    v-if="StoreObj.created_by_source == 'AGENT'"
                    class="font-weight-regular black-text"
                  >
                    Service Co-Ordinator
                  </span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Customer ID :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.customer_unique_id
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Customer Category :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.customer_category_name }}</span
                  >
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold black--text">
                  Customer Type :
                  <span class="font-weight-regular black--text">
                    {{ StoreObj.customer_type }}
                  </span>
                </div>
                <div class="FontSize font-weight-bold black--text">
                  Customer :<span class="font-weight-regular black--text">
                    {{ StoreObj.customer_company_name }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text">
                  Contact Person :<span class="font-weight-regular black--text">
                    {{ StoreObj.customer_name }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Email :
                  <span class="font-weight-regular black--text">
                    {{ StoreObj.customer_email_id }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Phone Number :<span class="font-weight-regular black--text">
                    {{ StoreObj.customer_full_number }}</span
                  >
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold mt-n2 black--text">
                  Address :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_address
                  }}</span>
                </div>
                <div
                  v-if="StoreObj.ticket_city != undefined"
                  class="FontSize font-weight-bold mt-n2 black--text"
                >
                  City :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_city
                  }}</span>
                </div>
                <div
                  v-if="StoreObj.ticket_state != undefined"
                  class="FontSize font-weight-bold mt-n2 black--text"
                >
                  State :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_state
                  }}</span>
                </div>
                <div
                  v-if="StoreObj.ticket_pincode != undefined"
                  class="FontSize font-weight-bold mt-n2 black--text"
                >
                  Pincode :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_pincode
                  }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card-title>
          <div class="ml-2 mt-n3 font-weight-bold black--text">
            Service Information :
          </div>
          <v-card-title>
            <v-row no-gutters>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Category :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.category_name
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Product :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.service_name
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Serial Number :
                  <span class="font-weight-regular black--text"
                    >{{ StoreObj.service_serial_number }}
                  </span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Service Type:<span class="font-weight-regular black--text">
                    {{ StoreObj.service_type_name }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Problem Description :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.service_ticket_description }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Free of Cost:
                  <span
                    class="font-weight-regular green--text"
                    v-if="StoreObj.is_free_of_cost == true"
                  >
                    Yes
                  </span>
                  <span class="font-weight-regular red--text" v-else> No </span>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div
                  v-if="StoreObj.ticket_warranty_details"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Invoice Date :<span class="font-weight-regular black--text">
                    {{
                      StoreObj.ticket_warranty_details.ticket_invoice_date
                    }}</span
                  >
                </div>
                <div
                  v-if="StoreObj.installation_date"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Installation Date :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.installation_date }}</span
                  >
                </div>
                <div
                  v-if="StoreObj.ticket_warranty_details"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Invoice Number :<span class="font-weight-regular black--text">
                    {{
                      StoreObj.ticket_warranty_details.ticket_invoice_number
                    }}</span
                  >
                </div>
                <div
                  v-if="StoreObj.comments"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Comments :<span class="font-weight-regular black--text">
                    {{ StoreObj.comments }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Additional Comments :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.additional_comments
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Support:<span
                    v-if="StoreObj.ticket_warranty_type == 'NO_WARRANTY'"
                    class="font-weight-regular black--text"
                  >
                    {{ "NO WARRANTY" }}</span
                  >
                  <span
                    v-else-if="
                      StoreObj.ticket_warranty_type == 'AMC' ||
                      StoreObj.ticket_warranty_type == 'CONTRACT'
                    "
                    class="font-weight-regular black--text"
                    >CONTRACT</span
                  >
                  <span v-else class="font-weight-regular black--text">{{
                    StoreObj.ticket_warranty_type
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Support type:
                  <span class="font-weight-regular black--text">{{
                    StoreObj.support_type
                  }}</span>
                  <div class="FontSize font-weight-bold black--text mt-n2">
                    Ticket Type:
                    <span class="font-weight-regular black--text">
                      {{ StoreObj.ticket_creation_type }}
                    </span>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="12" xs="12">
                <div class="FontSize black--text font-weight-bold">
                  Territories :
                  <span
                    v-if="
                      StoreObj.territory_names != undefined &&
                      StoreObj.territory_names.length != 0
                    "
                  >
                    <span
                      class="font-weight-regular"
                      v-for="(item, i) in StoreObj.territory_names"
                      :key="i"
                    >
                      {{ i + 1 }}.{{ item
                      }}<span v-if="i + 1 != StoreObj.territory_names.length"
                        >,</span
                      >
                    </span>
                  </span>
                  <span v-else>-</span>
                </div>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObj: Object,
    MrfTicketDetailsDialog: Boolean,
  },

  data: () => ({}),
  watch: {},
  methods: {
    MrfTicketDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
