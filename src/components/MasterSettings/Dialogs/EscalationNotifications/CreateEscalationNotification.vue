<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      persistent
      width="400px"
      :value="CreateEscalationNotificationDialog"
    >
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2">
            {{ StoreObj.action == "CREATE" ? "Add " : "Edit " }} Escalation
            Notification
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="CreateEscalationNotificationDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-form ref="form">
                <v-text-field
                  outlined
                  dense
                  label="Escalation Day *"
                  type="number"
                  class="FontSize field_label_size field_height mt-4"
                  v-model="create_setting.setting_name"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
                <v-select
                  label="Notify to User"
                  :items="GetAllUsersList"
                  item-text="user_email_id"
                  item-value="users_to_notify"
                  outlined
                  class="FontSize"
                  multiple
                  :rules="[(v) => !!v || 'Required']"
                  dense
                  v-model="create_setting.users_to_notify"
                >
                </v-select>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="isLoading"
            color="primary"
            @click="validateMethod()"
            class="white--text mb-2 mr-2"
            >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import {
  CreateTicketEscalationNotification,
  UpdateTicketEscalationNotification,
} from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
export default {
  mixins: [GetAllUsers],
  props: {
    StoreObj: Object,
    CreateEscalationNotificationDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    Toggle: 0,
    GetAllUsersList: [],
    create_setting: {
      setting_name: "",
      service_id: "",
      users_to_notify: "",
    },
    isLoading: false,
    SnackBarComponent: {},
  }),
  watch: {
    CreateEscalationNotificationDialog(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.create_setting.setting_name = this.StoreObj.setting_name;
          this.create_setting.users_to_notify = this.StoreObj.users_to_notify;
        }
      }
    },
  },
  mounted() {
    this.GetAllUsersMethod(this.user_type, (this.user_status = "ACTIVE"));
  },
  methods: {
    async validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.action == "CREATE") {
          var mutationname = CreateTicketEscalationNotification;
          var mutationresult = "CreateTicketEscalationNotification";
          var inputParams = {
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            setting_name: this.create_setting.setting_name,
            users_to_notify: this.create_setting.users_to_notify,
            setting_id:
              this.StoreObj.action == "EDIT"
                ? this.StoreObj.setting_id
                : undefined,
          };
        } else if (this.StoreObj.action == "EDIT") {
          mutationname = UpdateTicketEscalationNotification;
          mutationresult = "UpdateTicketEscalationNotification";
          inputParams = {
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            setting_name: this.create_setting.setting_name,
            users_to_notify: this.create_setting.users_to_notify,
            setting_id:
              this.StoreObj.action == "EDIT"
                ? this.StoreObj.setting_id
                : undefined,
          };
        }
        try {
          this.isLoading = true;
          let result = await API.graphql(
            graphqlOperation(mutationname, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data[mutationresult]);
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

            this.CreateEscalationNotificationDialogEmit((this.Toggle = 2));
          }
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
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
      } else if (!this.$refs.form.validate()) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.renderComp = true;
        });
      }
    },
    CreateEscalationNotificationDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
