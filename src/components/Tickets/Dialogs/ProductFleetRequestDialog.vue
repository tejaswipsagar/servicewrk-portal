<template>
  <v-dialog :value="dialogProductFleetRequest" persistent max-width="780px">
    <v-card>
      <v-toolbar dark dense class="elevation-0" color="primary">
        <div>
          <v-icon small class="mr-2">mdi-pandora</v-icon>Requsted Product Fleet
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialogProductFleetRequestEmit((Toggle = 1))"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <div class="black--text">
          <div class="font-weight-bold text-center mt-4 mb-4">
            Requested Product Fleet :
          </div>
          <v-row>
            <v-col cols="12" sm="12" md="4" xs="12">
              <div class="FontSize font-weight-bold">
                Category :
                <span
                  v-if="StoreObj.requested_serial_number_details != undefined"
                >
                  <span
                    v-if="
                      StoreObj.requested_serial_number_details.category_name !=
                      undefined
                    "
                    class="font-weight-regular"
                    >{{
                      StoreObj.requested_serial_number_details.category_name
                    }}
                  </span>
                </span>
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="4" xs="12">
              <div class="FontSize font-weight-bold">
                Product :
                <span
                  v-if="StoreObj.requested_serial_number_details != undefined"
                >
                  <span
                    v-if="
                      StoreObj.requested_serial_number_details.product_name !=
                      undefined
                    "
                    class="font-weight-regular"
                    >{{ StoreObj.requested_serial_number_details.product_name }}
                  </span>
                </span>
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="4" xs="12">
              <div class="FontSize font-weight-bold">
                Serial Number :
                <span
                  v-if="StoreObj.requested_serial_number_details != undefined"
                >
                  <span
                    v-if="
                      StoreObj.requested_serial_number_details.serial_number !=
                      undefined
                    "
                    class="font-weight-regular"
                    >{{
                      StoreObj.requested_serial_number_details.serial_number
                    }}
                  </span>
                </span>
              </div>
            </v-col>
          </v-row>
          <div class="font-weight-bold text-center mt-6 mb-4">
            Existing Product Fleet :
          </div>
          <v-row class="mb-4">
            <v-col cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold">
                Category :
                <span
                  v-if="StoreObj.category_name != undefined"
                  class="font-weight-regular"
                >
                  {{ StoreObj.category_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold">
                Product :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.service_name != undefined"
                >
                  {{ StoreObj.service_name }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold">
                Serial Number :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.service_serial_number != undefined"
                >
                  {{ StoreObj.service_serial_number }}
                </span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";

export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    dialogProductFleetRequest: Boolean,
  },

  data: () => ({}),

  watch: {
    async dialogProductFleetRequest(val) {
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
    dialogProductFleetRequestEmit() {
      this.$emit("clicked");
    },
  },
};
</script>
