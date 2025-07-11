<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogChangeVisitDateTime" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              "mdi-clipboard-text-clock-outline"
            }}</v-icon
            >Change Preferred Visit Date & Time
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id == undefined"
            >
              ({{ this.StoreObj.ticket_id }})
            </div>
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id != undefined"
            >
              ({{ this.StoreObj.custom_ticket_id }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogChangeVisitDateTimeEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-menu
              lazy
              offset-y
              ref="menu"
              full-width
              v-model="menu"
              :nudge-right="40"
              min-width="290px"
              transition="scale-transition"
              :close-on-content-click="false"
              :return-value.sync="latest_prefered_visit_date"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  outlined
                  readonly
                  v-on="on"
                  persistent-hint
                  color="primary"
                  prepend-inner-icon="event"
                  class="FontSize ml-2 mr-2"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="latest_prefered_visit_date"
                  label="Latest Preferred Visit Date *"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="latest_prefered_visit_date"
                no-title
                scrollable
              >
                <v-btn text flat color="primary" @click="menu = false"
                  >Cancel</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  flat
                  text
                  color="primary"
                  @click="$refs.menu.save(latest_prefered_visit_date)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-menu>
            <v-dialog
              persistent
              ref="dialog"
              width="290px"
              v-model="latest_time"
              :return-value.sync="latest_prefered_visit_time"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  readonly
                  v-on="on"
                  outlined
                  v-bind="attrs"
                  class="FontSize ml-2 mr-4"
                  prepend-inner-icon="access_time"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="latest_prefered_visit_time"
                  label="Latest Preferred Visit Time *"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="latest_time"
                v-model="latest_prefered_visit_time"
                full-width
              >
                <v-btn text color="primary" @click="latest_time = false"
                  >Cancel</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(latest_prefered_visit_time)"
                  >OK</v-btn
                >
              </v-time-picker>
            </v-dialog>
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
            >Change</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { UpdateVisitDateAndTimeToTicket } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    dialogChangeVisitDateTime: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    menu: false,
    loading: false,
    renderComp: true,
    latest_time: false,
    SnackBarComponent: {},
    latest_prefered_visit_date: "",
    latest_prefered_visit_time: "",
  }),
  watch: {
    async dialogChangeVisitDateTime(val) {
      if (val == true) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.latest_prefered_visit_date =
          this.StoreObj.latest_prefered_visit_date ||
          this.StoreObj.prefered_visit_date;
        this.latest_prefered_visit_time =
          this.StoreObj.latest_prefered_visit_time ||
          this.StoreObj.prefered_visit_time;
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
          latest_prefered_visit_date: this.latest_prefered_visit_date,
          latest_prefered_visit_time: this.latest_prefered_visit_time,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(UpdateVisitDateAndTimeToTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.UpdateVisitDateAndTimeToTicket
        );
        if (ResultObject.status == "Success") {
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
          this.dialogChangeVisitDateTimeEmit((this.Toggle = 2));
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
    dialogChangeVisitDateTimeEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
