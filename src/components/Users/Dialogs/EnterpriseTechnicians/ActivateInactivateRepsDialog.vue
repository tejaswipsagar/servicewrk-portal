<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-dialog
      :value="dialogActivateInactivateReps"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.user_status == "ACTIVE"
                ? "mdi-account-cancel"
                : "mdi-account-plus"
            }}</v-icon
            ><span>{{
              StoreObj.user_status == "ACTIVE" ? "Deactivate " : "Activate "
            }}</span>
            <span>{{ StoreObj.user_name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogActivateInactivateRepsEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.user_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.user_status == "ACTIVE"
                ? "mdi-account-cancel"
                : "mdi-account-plus"
            }}</v-icon
          >
          <div>
            Are you sure to
            <span
              v-text="
                StoreObj.user_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            {{ StoreObj.user_name }} ?
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
                StoreObj.user_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { Activate_Or_Deactivate_Representative } from "@/graphql/mutations.js";
export default {
  props: {
    StoreObj: Object,
    dialogActivateInactivateReps: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async activateInactivateMethod() {
      try {
        var inputParams = {
          user_id: this.StoreObj.user_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          action:
            this.StoreObj.user_status == "ACTIVE" ? "DEACTIVATE" : "ACTIVATE",
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Activate_Or_Deactivate_Representative, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Activate_Or_Deactivate_Representative
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
          this.dialogActivateInactivateRepsEmit((this.Toggle = 2));
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
    dialogActivateInactivateRepsEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
