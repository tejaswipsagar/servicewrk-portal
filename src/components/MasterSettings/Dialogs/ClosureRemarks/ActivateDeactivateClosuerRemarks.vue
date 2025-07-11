<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="ActivateDeactivateClosureRemarkDialog"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.setting_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
            ><span
              v-text="
                StoreObj.setting_status == 'ACTIVE'
                  ? 'Deactivate '
                  : 'Activate '
              "
            ></span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="ActivateDeactivateClosureRemarkDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.setting_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.setting_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          >
          <div>
            Are you sure you want to
            <span
              v-text="
                StoreObj.setting_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="activateInactivateMethod()"
            ><span
              v-text="
                StoreObj.setting_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { Activate_Or_Deactivate_Setting } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    ActivateDeactivateClosureRemarkDialog: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    renderComp: true,
    loading: false,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async activateInactivateMethod() {
      var mutationname = Activate_Or_Deactivate_Setting;
      var mutationresult = "Activate_Or_Deactivate_Setting";
      var inputParams = {
        setting_id: this.StoreObj.setting_id,
        updater_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        action:
          this.StoreObj.setting_status == "ACTIVE" ? "DEACTIVATE" : "ACTIVATE",
      };
      try {
        this.loading = true;
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
          this.ActivateDeactivateClosureRemarkDialogEmit((this.Toggle = 2));
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
    ActivateDeactivateClosureRemarkDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
