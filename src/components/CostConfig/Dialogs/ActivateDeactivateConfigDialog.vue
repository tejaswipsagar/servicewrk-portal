<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="ActivateDeactivateConfigDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            {{ StoreObj.action === "ACTIVATE" ? "Activate" : "Deactivate" }}
            Cost Configuration
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ActivateDeactivateConfigDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          Do you want to
          {{ StoreObj.action === "ACTIVATE" ? "activate" : "deactivate" }} of
          category <strong>{{ StoreObj.category_name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="ml-2">
            <v-btn
              :loading="btnLoading"
              small
              color="primary"
              class="white--text"
              @click="activateDeactivateMethod()"
              >{{
                StoreObj.action === "ACTIVATE" ? "Activate" : "Deactivate"
              }}</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { ActivateOrDeactivateCostConfiguration } from "@/graphql/mutations.js";
export default {
  components: { Snackbar },
  props: {
    ActivateDeactivateConfigDialog: Boolean,
    StoreObj: Object,
  },

  data: () => ({
    btnLoading: false,
    SnackBarComponent: {},
    renderComp: true,
  }),

  methods: {
    async activateDeactivateMethod() {
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(ActivateOrDeactivateCostConfiguration, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              configuration_id: this.StoreObj.configuration_id,
              action:
                this.StoreObj.action === "ACTIVATE" ? "ACTIVATE" : "DEACTIVATE",
            },
          })
        );
        const response = JSON.parse(
          result.data.ActivateOrDeactivateCostConfiguration
        );
        if (response.status === "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = true;
          });
          this.btnLoading = false;
          this.ActivateDeactivateConfigDialogEmit(2);
        }
        console.log("RESP", response);
      } catch (error) {
        this.btnLoading = false;
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
    ActivateDeactivateConfigDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
