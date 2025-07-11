<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogTicketAcceptOrReject" persistent max-width="80%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon class="ma-2">mdi-gesture-tap-button</v-icon>
            Accept or Reject Ticket
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogTicketAcceptOrRejectEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-row>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Ticket ID :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.custom_ticket_id != undefined"
                  >{{ this.StoreObj.custom_ticket_id }}</span
                ><span v-else>{{ this.StoreObj.ticket_id }}</span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Customer :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.customer_company_name != undefined"
                >
                  {{ this.StoreObj.customer_company_name }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Contact Person :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.customer_name != undefined"
                >
                  {{ this.StoreObj.customer_name }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Phone Number :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.customer_full_number != undefined"
                >
                  {{ this.StoreObj.customer_full_number }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="8" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Address :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.ticket_address != undefined"
                >
                  {{ this.StoreObj.ticket_address }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Category :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.category_name != undefined"
                >
                  {{ this.StoreObj.category_name }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Product :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.service_name != undefined"
                >
                  {{ this.StoreObj.service_name }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Serial Number :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.service_serial_number != undefined"
                >
                  {{ this.StoreObj.service_serial_number }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Ticket Type :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.ticket_creation_type != undefined"
                >
                  {{ this.StoreObj.ticket_creation_type }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Service Type :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.service_type_name != undefined"
                >
                  {{ this.StoreObj.service_type_name }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Problem Description :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.service_ticket_description != undefined"
                >
                  {{ this.StoreObj.service_ticket_description }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Support :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.ticket_warranty_type != undefined"
                >
                  {{ this.StoreObj.ticket_warranty_type }}
                </span>
              </div>
            </v-col>
            <v-col align="left" cols="12" md="4" xs="12" sm="12">
              <div class="FontSize font-weight-bold black--text">
                Support Type :
                <span
                  class="font-weight-regular"
                  v-if="this.StoreObj.support_type != undefined"
                >
                  {{ this.StoreObj.support_type }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="red"
            class="white--text mb-4"
            :loading="loadingRejectBtn"
            @click="validateMethod('REJECT')"
          >
            <v-icon small class="mr-2">mdi-close-outline</v-icon>
            Reject
          </v-btn>
          <v-btn
            small
            color="green"
            class="white--text mb-4"
            :loading="loadingAcceptBtn"
            @click="validateMethod('ACCEPT')"
          >
            <v-icon small class="mr-2">mdi-check-outline</v-icon>
            Accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { AcceptOrRejectTicket } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";

export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    dialogTicketAcceptOrReject: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    renderComp: true,
    loadingAcceptBtn: false,
    loadingRejectBtn: false,
    SnackBarComponent: {},
  }),
  watch: {
    async dialogTicketAcceptOrReject(val) {
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
    async validateMethod(act) {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          ticket_id: this.StoreObj.ticket_id,
          action: act == "ACCEPT" ? "ACCEPT" : "REJECT",
        };
        if (act == "ACCEPT") {
          this.loadingAcceptBtn = true;
        } else if (act == "REJECT") {
          this.loadingRejectBtn = true;
        }
        let result = await API.graphql(
          graphqlOperation(AcceptOrRejectTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.AcceptOrRejectTicket);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.message,
            };
            this.renderComp = true;
          });
          this.dialogTicketAcceptOrRejectEmit((this.Toggle = 2));
        }
        this.loadingAcceptBtn = false;
        this.loadingRejectBtn = false;
      } catch (error) {
        this.loadingAcceptBtn = false;
        this.loadingRejectBtn = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
      }
    },
    dialogTicketAcceptOrRejectEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
