<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogAddRemarks" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{ "mdi-message-outline" }}</v-icon
            ><span></span>Add Remarks
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
          <v-btn icon @click="dialogAddRemarksEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-textarea
              outlined
              rows="2"
              class="FontSize"
              label="Remarks *"
              v-model="message_content"
              :rules="[(v) => !!v || 'Required']"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="loading"
            color="primary"
            @click="validateMethod()"
            class="white--text mb-2"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { TicketInteraction } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    dialogAddRemarks: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    message_content: "",
    SnackBarComponent: {},
  }),
  watch: {
    async dialogAddRemarks(val) {
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
        this.AddRemarksMethod();
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
    async AddRemarksMethod() {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          ticket_id: this.StoreObj.ticket_id,
          message_content: this.message_content,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(TicketInteraction, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.TicketInteraction);
        if (ResultObject.status == "Success") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Added Remarks",
            };
            this.renderComp = true;
          });
          this.dialogAddRemarksEmit((this.Toggle = 2));
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
    dialogAddRemarksEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
