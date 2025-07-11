<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogReopenTicket" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-refresh</v-icon><span></span>Reopen
            Ticket
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id != undefined"
            >
              ({{ this.StoreObj.custom_ticket_id }})
            </div>
            <div
              class="xsmallFontSize"
              v-else-if="this.StoreObj.ticket_id != undefined"
            >
              ({{ this.StoreObj.ticket_id }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogReopenTicketEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              :items="UserList"
              label="User Type *"
              v-model="required_user_type"
              :rules="[(v) => !!v || 'Required']"
            ></v-autocomplete>
            <v-select
              dense
              outlined
              class="FontSize"
              v-model="user_id"
              item-value="user_id"
              item-text="user_name"
              label="Select Representative"
              :rules="[(v) => !!v || 'Required']"
              :items="
                this.required_user_type == 'ENTERPRISE_REPRESENTATIVE'
                  ? GetAllUsrTypeLocationBasedUsers
                  : GetAllUsrTypeLocationBasedUsersForPartnersAndDealers
              "
            ></v-select>
            <v-textarea
              outlined
              rows="2"
              class="FontSize"
              label="Comments *"
              v-model="comments"
              :rules="[(v) => !!v || 'Required']"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="loading"
            @click="validateMethod()"
            class="white--text mb-5 mr-2"
            >Reopen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { ReAssignPartiallyClosedTicket } from "@/graphql/mutations.js";
import { ListAllUserTypeLocationBasedUsers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsers.js";
import { ListAllUserTypeLocationBasedUsersForPartnersAndDealers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsersForPartnersAndDealers.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  props: {
    StoreObj: Object,
    dialogReopenTicket: Boolean,
  },
  mixins: [
    ListAllUserTypeLocationBasedUsers,
    ListAllUserTypeLocationBasedUsersForPartnersAndDealers,
    GetTicketDetails,
  ],
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    user_id: "",
    comments: "",
    required_user_type: "",
    SnackBarComponent: {},
    GetAllUsrTypeLocationBasedUsers: [],
    GetAllUsrTypeLocationBasedUsersForPartnersAndDealers: [],
    UserList: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
  }),
  watch: {
    async dialogReopenTicket(val) {
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
    required_user_type() {
      if (this.required_user_type == "ENTERPRISE_REPRESENTATIVE") {
        this.GetAllUerTypeLocationBasedUsers(
          this.StoreObj.ticket_latitude,
          this.StoreObj.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.required_user_type
        );
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.StoreObj.ticket_latitude,
          this.StoreObj.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.required_user_type,
          this.StoreObj.ticket_territories,
          this.StoreObj.ticket_pincode,
          undefined
        );
      }
    },
  },
  methods: {
    validateMethod() {
      if (this.$refs.form.validate()) {
        this.ReopenTicketMethod();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please Select Representative",
          };
          this.renderComp = true;
        });
      }
    },
    async ReopenTicketMethod() {
      try {
        var inputParams = {
          ticket_id: this.StoreObj.ticket_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          comments: this.comments,
          ticket_action: "REASSIGN",
          assignee_user_id: this.user_id,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ReAssignPartiallyClosedTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.ReAssignPartiallyClosedTicket
        );
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.dialogReopenTicketEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
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
    dialogReopenTicketEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
