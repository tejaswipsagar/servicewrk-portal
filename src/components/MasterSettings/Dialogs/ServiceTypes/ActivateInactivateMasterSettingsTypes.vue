<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      :value="dialogActivateInactivateMasterSettingTypes"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
            ><span>{{
              StoreObj.status == "ACTIVE" ? "Deactivate " : "Activate "
            }}</span>
            <span>{{ StoreObj.service_type_name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="
              dialogActivateInactivateMasterSettingTypesEmit((Toggle = 1))
            "
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          >
          <div>
            Are you sure you want to
            <span
              v-text="StoreObj.status == 'ACTIVE' ? 'Deactivate' : 'Activate'"
            ></span>
            <span>{{ StoreObj.service_type_name }}</span>
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
              v-text="StoreObj.status == 'ACTIVE' ? 'Deactivate' : 'Activate'"
            ></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { Activate_Or_Deactivate_ServiceType } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogActivateInactivateMasterSettingTypes: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async activateInactivateMethod() {
      var mutationname = Activate_Or_Deactivate_ServiceType;
      var mutationresult = "Activate_Or_Deactivate_ServiceType";
      var inputParams = {
        service_type_id: this.StoreObj.service_type_id,
        updater_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        action: this.StoreObj.status == "ACTIVE" ? "DEACTIVATE" : "ACTIVATE",
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
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.Status_Message,
          };
          this.dialogActivateInactivateMasterSettingTypesEmit(
            (this.Toggle = 2)
          );
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
      }
    },
    dialogActivateInactivateMasterSettingTypesEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
