<template>
  <div>
    <v-dialog width="700px" :value="openTicketDetailsDialog">
      <v-toolbar color="primary" dense dark>
        <div>Replaced from Ticket Details</div>
        <v-spacer></v-spacer>
        <v-icon @click="openTicketDetailsDialogEmit()"> mdi-close </v-icon>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-row class="black--text mb-6">
            <v-col cols="12" md="6" sm="12">
              <div class="FontSize font-weight-bold" v-if="this.StoreObjNew != undefined">
                <span
                  v-if="this.StoreObjNew.replaced_by_service_details != undefined"
                >
                  <span
                    v-if="
                      this.StoreObjNew.replaced_by_service_details
                        .custom_ticket_id != undefined
                    "
                  >
                    Ticket Id :
                    <span class="font-weight-regular">{{
                      this.StoreObjNew.replaced_by_service_details.custom_ticket_id
                    }}</span>
                  </span>
                  <span
                    v-else-if="
                      this.StoreObjNew.replaced_by_service_details.ticket_id !=
                      undefined
                    "
                  >
                    Ticket Id :
                    <span class="font-weight-regular">{{
                      this.StoreObjNew.replaced_by_service_details.ticket_id
                    }}</span>
                  </span>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <div class="font-weight-bold FontSize" v-if="this.StoreObjNew != undefined">
                Customer :
                <span
                  v-if="this.StoreObjNew.replaced_by_service_details != undefined"
                >
                  <span
                    class="font-weight-regular"
                    v-if="
                      this.StoreObjNew.replaced_by_service_details
                        .customer_company_name != undefined
                    "
                  >
                    {{
                      this.StoreObjNew.replaced_by_service_details
                        .customer_company_name
                    }}
                  </span>
                </span>
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12" v-if="this.StoreObjNew != undefined">
              <span class="font-weight-bold FontSize">Contact Person : </span>
              <span
                v-if="this.StoreObjNew.replaced_by_service_details != undefined"
              >
                <span
                  v-if="
                    this.StoreObjNew.replaced_by_service_details.customer_name !=
                    undefined
                  "
                >
                  {{ this.StoreObjNew.replaced_by_service_details.customer_name }}
                </span>
              </span>
              <span v-else>-</span>
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12" v-if="this.StoreObjNew != undefined">
              <span class="font-weight-bold FontSize">Phone No : </span>
              <span
                v-if="this.StoreObjNew.replaced_by_service_details != undefined"
              >
                <span
                  v-if="
                    this.StoreObjNew.replaced_by_service_details
                      .customer_full_number != undefined
                  "
                >
                  {{
                    this.StoreObjNew.replaced_by_service_details
                      .customer_full_number
                  }}
                </span>
              </span>
              <span v-else>-</span>
            </v-col>
            <v-col cols="12" md="4" xs="12" sm="12" v-if="this.StoreObjNew != undefined">
              <span class="font-weight-bold FontSize">Category : </span>
              <span
                v-if="this.StoreObjNew.replaced_by_service_details != undefined"
              >
                <span
                  v-if="
                    this.StoreObjNew.replaced_by_service_details.category_name !=
                    undefined
                  "
                >
                  {{ this.StoreObjNew.replaced_by_service_details.category_name }}
                </span>
              </span>
              <span v-else>-</span>
            </v-col>
            <v-col cols="12" md="4" xs="12" sm="12" v-if="this.StoreObjNew != undefined">
              <span class="font-weight-bold FontSize">Product : </span>
              <span
                v-if="this.StoreObjNew.replaced_by_service_details != undefined"
              >
                <span
                  v-if="
                    this.StoreObjNew.replaced_by_service_details.product_name !=
                    undefined
                  "
                >
                  {{ this.StoreObjNew.replaced_by_service_details.product_name }}
                </span>
              </span>
              <span v-else>-</span>
            </v-col>
            <v-col cols="12" md="4" xs="12" sm="12" v-if="this.StoreObjNew != undefined">
              <span class="font-weight-bold FontSize">Serial No : </span>
              <span
                v-if="this.StoreObjNew.replaced_by_service_details != undefined"
              >
                <span
                  v-if="
                    this.StoreObjNew.replaced_by_service_details.serial_number !=
                    undefined
                  "
                >
                  {{ this.StoreObjNew.replaced_by_service_details.serial_number }}
                </span>
              </span>
              <span v-else>-</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObjNew: Object,
    openTicketDetailsDialog: Boolean,
  },
  methods: {
    openTicketDetailsDialogEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
