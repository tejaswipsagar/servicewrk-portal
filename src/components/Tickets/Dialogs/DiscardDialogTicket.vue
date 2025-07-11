<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogDiscard" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{ "mdi-close-circle-outline" }}</v-icon
            >Discard Ticket
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id == undefined"
            >
              ({{ this.StoreObj.ticket_id }})
            </div>
            <div
              class="xsmallFontSize"
              v-else-if="this.StoreObj.custom_ticket_id != undefined"
            >
              ({{ this.StoreObj.custom_ticket_id }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDiscardEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-textarea
              outlined
              rows="2"
              class="FontSize"
              label="Reason *"
              v-model="comments"
              :rules="[(v) => !!v || 'Required']"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="loading"
            class="white--text mb-2"
            @click="validateMethod()"
            >Discard</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { DiscardTicket } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    dialogDiscard: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    comments: "",
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),
  watch: {
    async dialogDiscard(val) {
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
    validateMethod() {
      if (this.$refs.form.validate()) {
        this.DiscardTicketMethod();
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
    async DiscardTicketMethod() {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          ticket_id: this.StoreObj.ticket_id,
          comments: this.comments,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(DiscardTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.DiscardTicket);
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
          this.dialogDiscardEmit((this.Toggle = 2));
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
    dialogDiscardEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
