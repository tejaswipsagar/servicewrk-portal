<template>
  <div>
    <v-dialog persistent width="90%" :value="DetailedTicketDetailsDialog">
      <v-card>
        <v-toolbar color="primary" class="white-text elevation-0" dense dark>
          <div class="ml-2">Ticket Details</div>
          <v-spacer />
          <v-btn
            class="mr-n4"
            dark
            text
            @click="DetailedTicketDetailsDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row no-gutters>
            <div class="ml-2 mt-4 font-weight-bold black--text">
              Customer Information :
            </div>
          </v-row>
          <v-card-title>
            <v-row no-gutters>
              <v-col cols="12" sm="12" md="4" xs="12">
                <span class="FontSize font-weight-bold black--text"
                  >Ticket-Id :
                  <span
                    class="font-weight-regular black--text"
                    v-if="StoreObj.custom_ticket_id"
                  >
                    >{{ StoreObj.custom_ticket_id }}
                  </span>
                  <span v-else>{{ StoreObj.ticket_id }}</span>
                </span>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Ticket Type :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_type
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Ticket Status :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_status
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Customer ID :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.customer_unique_id
                  }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold black--text">
                  Customer Name :<span class="font-weight-regular black--text">
                    {{ StoreObj.customer_company_name }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text">
                  Contact Person Name :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.customer_name }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Contact Person Email :
                  <span class="font-weight-regular black--text">
                    {{ StoreObj.customer_email_id }}</span
                  >
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Contact Person Phone Number :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.customer_full_number }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold mt-n2 black--text">
                  Service Address :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_address
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold mt-n2 black--text">
                  Ticket Priority :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.ticket_priority
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
                  Category Name :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.category_name
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Product Name :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.service_name
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Service Type:<span class="font-weight-regular black--text">
                    {{ StoreObj.service_type_name }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Support:<span
                    v-if="StoreObj.ticket_warranty_type == 'NO_WARRANTY'"
                    class="font-weight-regular black--text"
                  >
                    {{ "None" }}</span
                  >
                  <span
                    v-else-if="
                      StoreObj.ticket_warranty_type == 'AMC' ||
                      StoreObj.ticket_warranty_type == 'CONTRACT'
                    "
                    class="font-weight-regular black--text"
                    >Contract</span
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
                  <div class="FontSize font-weight-bold black--text mt-n2">
                    Free of Cost:
                    <span
                      class="font-weight-regular green--text"
                      v-if="StoreObj.is_free_of_cost == true"
                    >
                      Yes
                    </span>
                    <span class="font-weight-regular red--text" v-else>
                      No
                    </span>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Serial Number :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.service_serial_number
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Ticket Problem Description :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.service_ticket_description }}</span
                  >
                </div>
                <div
                  v-if="StoreObj.ticket_warranty_details"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Ticket Invoice Date :<span
                    class="font-weight-regular black--text"
                  >
                    {{
                      StoreObj.ticket_warranty_details.ticket_invoice_date
                    }}</span
                  >
                </div>
                <div
                  v-if="StoreObj.installation_date"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Ticket Installation Date :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.installation_date }}</span
                  >
                </div>
                <div
                  v-if="StoreObj.ticket_warranty_details"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Ticket Invoice Number :<span
                    class="font-weight-regular black--text"
                  >
                    {{
                      StoreObj.ticket_warranty_details.ticket_invoice_number
                    }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Primary Representative :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.representative_name }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Secondary Representative :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.secondary_technician_name }}</span
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
                <div
                  v-if="StoreObj.ticket_closed_location"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Ticket Closed Location :
                  <span class="font-weight-regular black--text">
                    {{ StoreObj.ticket_closed_location.replaceAll("_", " ") }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Prefered Visit Date :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.prefered_visit_date }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Prefered Visit Time :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.prefered_visit_time
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Call Received Date :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.customer_call_date }}</span
                  >
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Call Received Time :<span
                    class="font-weight-regular black--text"
                  >
                    {{ StoreObj.customer_call_time }}</span
                  >
                </div>
                <div
                  class="FontSize font-weight-bold black--text mt-n2"
                  v-if="StoreObj.latest_prefered_visit_date != undefined"
                >
                  Updated Visit Date :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.latest_prefered_visit_date
                  }}</span>
                </div>
                <div
                  class="FontSize font-weight-bold black--text mt-n2"
                  v-if="StoreObj.latest_prefered_visit_time != undefined"
                >
                  Updated Visit Time :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.latest_prefered_visit_time
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  WIP Sub Stage :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.wip_sub_stage_name
                  }}</span>
                </div>
                <div class="FontSize font-weight-bold black--text mt-n2">
                  Additional Comments :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.additional_comments
                  }}</span>
                </div>
                <div
                  v-if="StoreObj.ticket_status == 'CLOSED'"
                  class="FontSize font-weight-bold black--text mt-n2"
                >
                  Closure Remarks :
                  <span class="font-weight-regular black--text">{{
                    StoreObj.closure_remarks
                  }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card-title>
          <v-row no-gutters> </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObj: Object,
    DetailedTicketDetailsDialog: Boolean,
  },
  data: () => ({
    renderComp: true,
    Headers: [
      {
        text: "Name",
        value: "component_name",
      },
      {
        text: "Code",
        value: "component_product_code",
      },
      {
        text: "Quantity",
        value: "component_quantity",
      },
    ],
  }),
  methods: {
    DetailedTicketDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
