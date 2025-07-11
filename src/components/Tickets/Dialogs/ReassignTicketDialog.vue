<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogReassignTicket" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-refresh</v-icon>Reassign Ticket
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id == undefined"
            >
              ({{ this.StoreObj.ticket_id }})
            </div>
            <div
              v-else-if="this.StoreObj.custom_ticket_id != undefined"
              class="xsmallFontSize"
            >
              ({{ this.StoreObj.custom_ticket_id }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogReassignTicketEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              label="User Type *"
              v-model="required_user_type"
              :rules="[(v) => !!v || 'Required']"
              v-if="$store.getters.get_user_type != 'SERVICE_PARTNER'"
              :items="
                $store.getters.get_user_type == 'DEALER_OWNER'
                  ? UserList.filter(
                      (item) => item.text != 'Enterprise Representative'
                    )
                  : UserList
              "
            ></v-autocomplete>
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              v-model="user_id"
              item-value="user_id"
              item-text="user_name"
              :rules="[(v) => !!v || 'Required']"
              :label="
                required_user_type == 'SERVICE_PARTNER'
                  ? 'Select Service Partner'
                  : required_user_type == 'DEALER_OWNER'
                  ? 'Select Dealer'
                  : 'Select Representative'
              "
              :items="
                this.required_user_type == 'ENTERPRISE_REPRESENTATIVE'
                  ? GetAllUsrTypeLocationBasedUsers
                  : GetAllUsrTypeLocationBasedUsersForPartnersAndDealers
              "
            ></v-autocomplete>
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
            class="white--text mb-4 mr-2"
            >Reassign</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ReassignOrOpenTheAssignedTicket } from "@/graphql/mutations.js";
import { ListAllUserTypeLocationBasedUsers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsers.js";
import { ListAllUserTypeLocationBasedUsersForPartnersAndDealers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsersForPartnersAndDealers.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogReassignTicket: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [
    ListAllUserTypeLocationBasedUsers,
    ListAllUserTypeLocationBasedUsersForPartnersAndDealers,
    GetTicketDetails,
  ],
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    user_id: "",
    comments: "",
    ticket_latitude: "",
    ticket_longitude: "",
    representative_id: "",
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
          true
        );
      }
    },
    async dialogReassignTicket(val) {
      if (val == true) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.calUserApi();
      }
    },
  },
  mounted() {},
  methods: {
    calUserApi() {
      if (
        this.$store.getters.get_current_user_details.user_type ==
        "SERVICE_PARTNER"
      ) {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.StoreObj.ticket_latitude,
          this.StoreObj.ticket_longitude,
          this.StoreObj.service_id,
          this.$store.getters.get_current_user_details.user_id,
          this.$store.getters.get_current_user_details.user_type,
          undefined,
          undefined,
          undefined
        );
      }
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        this.ReassignTicketMethod();
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
    async ReassignTicketMethod() {
      try {
        var inputParams = {
          ticket_id: this.StoreObj.ticket_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          comments: this.comments,
          assignee_user_id: this.user_id,
          ticket_action: "REASSIGN",
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ReassignOrOpenTheAssignedTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.ReassignOrOpenTheAssignedTicket
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
          this.dialogReassignTicketEmit((this.Toggle = 2));
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
    dialogReassignTicketEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.component_ids = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
