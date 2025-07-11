<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-dialog
      :value="dialogActivateInactivateComp"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.component_status == "ACTIVE"
                ? "mdi-account-cancel"
                : "mdi-account-plus"
            }}</v-icon
            ><span>{{
              StoreObj.component_status == "ACTIVE" ? "Deactivate" : "Activate"
            }}</span>
            Component
            <span>{{ StoreObj.component_name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogActivateInactivateCompEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.component_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.component_status == "ACTIVE"
                ? "mdi-account-cancel"
                : "mdi-account-plus"
            }}</v-icon
          >
          <div>
            Are you sure you want to
            <span
              v-text="
                StoreObj.component_status == 'ACTIVE'
                  ? 'Deactivate'
                  : 'Activate'
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
                StoreObj.component_status == 'ACTIVE'
                  ? 'Deactivate'
                  : 'Activate'
              "
            ></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { Activate_Or_Deactivate_Component } from "@/graphql/mutations.js";
export default {
  props: {
    StoreObj: Object,
    dialogActivateInactivateComp: Boolean,
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
          component_id: this.StoreObj.component_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          action:
            this.StoreObj.component_status == "ACTIVE"
              ? "DEACTIVATE"
              : "ACTIVATE",
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Activate_Or_Deactivate_Component, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Activate_Or_Deactivate_Component
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
          this.dialogActivateInactivateCompEmit((this.Toggle = 2));
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
    dialogActivateInactivateCompEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
