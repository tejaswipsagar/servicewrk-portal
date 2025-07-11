<template>
  <div>
    <v-dialog
      :value="oldSerialNumberDetailsDialog"
      persistent
      max-width="780px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          Product Fleet Details
          <v-spacer></v-spacer>
          <v-btn icon @click="oldSerialNumberDetailsDialogEmit()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <div class="black--text">
            <div class="font-weight-bold text-center mt-4">
              Old Product Fleet :
            </div>
            <v-row>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold">
                  Category :
                  <span v-if="StoreObj.old_serial_number_details != undefined">
                    <span
                      v-if="
                        StoreObj.old_serial_number_details.category_name !=
                        undefined
                      "
                      class="font-weight-regular"
                      >{{
                        StoreObj.old_serial_number_details.category_name
                      }}</span
                    >
                    <span v-else>-</span>
                  </span>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold">
                  Product :
                  <span v-if="StoreObj.old_serial_number_details != undefined">
                    <span
                      v-if="
                        StoreObj.old_serial_number_details.product_name !=
                        undefined
                      "
                      class="font-weight-regular"
                      >{{
                        StoreObj.old_serial_number_details.product_name
                      }}</span
                    >
                    <span v-else>-</span>
                  </span>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold">
                  Serial Number :
                  <span v-if="StoreObj.old_serial_number_details != undefined">
                    <span
                      v-if="
                        StoreObj.old_serial_number_details.serial_number !=
                        undefined
                      "
                      class="font-weight-regular"
                      >{{
                        StoreObj.old_serial_number_details.serial_number
                      }}</span
                    >
                    <span v-else>-</span>
                  </span>
                </div>
              </v-col>
            </v-row>
          </div>
          <div class="black--text">
            <div class="font-weight-bold text-center mt-4">
              New Product Fleet :
            </div>
            <v-row class="mb-4">
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold">
                  Category :
                  <span
                    v-if="StoreObj.category_name != undefined"
                    class="font-weight-regular"
                    >{{ StoreObj.category_name }}</span
                  >
                  <span v-else>-</span>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold">
                  Product :
                  <span
                    v-if="StoreObj.service_name != undefined"
                    class="font-weight-regular"
                    >{{ StoreObj.service_name }}</span
                  >
                  <span v-else>-</span>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4" xs="12">
                <div class="FontSize font-weight-bold">
                  Serial Number :
                  <span
                    v-if="StoreObj.service_serial_number != undefined"
                    class="font-weight-regular"
                    >{{ StoreObj.service_serial_number }}</span
                  >
                  <span v-else>-</span>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    oldSerialNumberDetailsDialog: Boolean,
  },
  watch: {
    async oldSerialNumberDetailsDialog(val) {
      if (val) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
      }
    },
  },
  methods: {
    oldSerialNumberDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
