<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="ActivateDeactivateAdditionalPartDialog"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.master_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
            ><span
              >{{
                StoreObj.master_status == "ACTIVE" ? "Deactivate " : "Activate "
              }}
            </span>
            <span>{{ StoreObj.master_name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="ActivateDeactivateAdditionalPartDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.master_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.master_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          >
          <div>
            Are you sure to
            <span
              v-text="
                StoreObj.master_status == 'ACTIVE'
                  ? `Deactivate ${this.StoreObj.master_name}`
                  : `Activate ${this.StoreObj.master_name}`
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
                StoreObj.master_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
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
import { ActivateORDeactivateAdditionalPart } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    ActivateDeactivateAdditionalPartDialog: Boolean,
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
      var mutationname = ActivateORDeactivateAdditionalPart;
      var mutationresult = "ActivateORDeactivateAdditionalPart";
      var inputParams = {
        master_id: this.StoreObj.master_id,
        user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        action:
          this.StoreObj.master_status == "ACTIVE" ? "DEACTIVATE" : "ACTIVATE",
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
          this.ActivateDeactivateAdditionalPartDialogEmit((this.Toggle = 2));
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
    ActivateDeactivateAdditionalPartDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
