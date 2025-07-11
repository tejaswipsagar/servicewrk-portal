<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="transferPincodeDialog" persistent width="600">
      <Overlay :overlay="overlay" />
      <v-card>
        <v-toolbar dense color="primary" dark class="elevation-0"
          ><div>Transfer Pincode(s)</div>
          <v-spacer />
          <v-btn icon @click="transferPincodeDialogEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            fixed-header
            :search="search"
            :headers="headers"
            class="elevation-0"
            height="300"
            :items-per-page="100"
            :no-data-text="noDataText"
            show-select
            single-select
            v-model="selected_territory"
            :items="GetAllTerritoriesList"
            item-key="territory_id"
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            :loading="loading_btn"
            class="primary white--text"
            @click="transferPincodeMethod()"
            >Transfer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { AddOrRemovePincodeFromTerritory } from "@/graphql/mutations.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
export default {
  props: {
    StoreObj: Object,
    StoreObjTerritory: Array,
    transferPincodeDialog: Boolean,
  },
  components: {
    Overlay,
    Snackbar,
  },
  mixins: [GetAllTerritories],
  data: () => ({
    search: "",
    overlay: false,
    renderComp: true,
    loading_btn: false,
    SnackBarComponent: {},
    selected_territory: [],
    GetAllTerritoriesList: [],
    headers: [{ text: "Territory", value: "territory_name" }],
  }),
  watch: {
    transferPincodeDialog(val) {
      if (val == true) {
        this.GetAllTerritoriesMethod(
          "ACTIVE",
          "NON_GEO_BASED",
          undefined,
          "TERRITORY",
          undefined
        );
      }
    },
  },
  methods: {
    transferPincodeDialogEmit(Toggle) {
      this.selected_territory = [];
      this.$emit("clicked", Toggle);
    },
    async transferPincodeMethod() {
      try {
        var inputParams = {
          action_type: "TAG_DIFFERENT_TERRITOR",
          territory_id: this.StoreObj.territory_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          new_territory_id: this.selected_territory[0].territory_id,
          territory_pincode: this.StoreObjTerritory.map((val) => val.pincode),
        };
        this.loading_btn = true;
        let result = await API.graphql(
          graphqlOperation(AddOrRemovePincodeFromTerritory, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.AddOrRemovePincodeFromTerritory
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
          this.transferPincodeDialogEmit((this.Toggle = 2));
          this.loading_btn = false;
        }
        this.loading_btn = false;
      } catch (error) {
        this.loading_btn = false;
        this.renderComp = true;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error,
          };
          this.renderComp = false;
        });
      }
    },
  },
};
</script>

<style></style>
