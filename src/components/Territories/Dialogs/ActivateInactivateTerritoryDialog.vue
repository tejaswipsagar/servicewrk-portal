<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="dialogActivateInactivateTerritory"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-1">{{
              StoreObj.territory_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
            ><span
              v-text="
                StoreObj.territory_status == 'ACTIVE'
                  ? 'Deactivate'
                  : 'Activate'
              "
            ></span>
            Territory
            <span>{{ StoreObj.territory_name }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialogActivateInactivateTerritoryEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.territory_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.territory_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          >
          <div class="font-weight-bold">
            <span v-if="StoreObj.territory_status == 'ACTIVE'">
              The Pincodes under this territory will be untag,
            </span>
            Are you sure to
            <span
              v-text="
                StoreObj.territory_status == 'ACTIVE'
                  ? 'Deactivate'
                  : 'Activate'
              "
            ></span>
            {{ StoreObj.territory_name }} ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary white--text"
            :loading="loading"
            @click="activateInactivateMethod()"
            ><span
              v-text="
                StoreObj.territory_status == 'ACTIVE'
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
import { API, graphqlOperation } from "aws-amplify";
import { ActivateOrDeactivateTerritoryOrPincode } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogActivateInactivateTerritory: Boolean,
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
          territory_id: this.StoreObj.territory_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          action:
            this.StoreObj.territory_status == "ACTIVE"
              ? "DEACTIVATE"
              : "ACTIVATE",
          action_type: "TERRITORY",
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ActivateOrDeactivateTerritoryOrPincode, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivateTerritoryOrPincode
        );
        if (ResultObject.Status == "SUCCESS") {
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
          this.dialogActivateInactivateTerritoryEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = true;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "wrong",
          };
          this.renderComp = false;
        });
      }
    },
    dialogActivateInactivateTerritoryEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
