<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="MarkTerritoryPincodeDialog" persistent width="900">
      <Overlay :overlay="overlay" />
      <v-card>
        <v-toolbar dense color="primary" dark class="elevation-0"
          ><div>
            {{
              PincodeTypeValue != "ALL" && PincodeTypeValue != "Unmapped"
                ? "Un Map"
                : "Map"
            }}
          </div>
          <v-spacer />
          <v-btn icon @click.stop="MarkTerritoryPincodeDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="Terr_form">
            <v-autocomplete
              v-if="PincodeTypeValue == 'ALL' || PincodeTypeValue == 'Unmapped'"
              outlined
              class="mt-2 MaxWidthValue"
              label="Territory Type *"
              v-model="Territory_Type_Select"
              :items="Pincodes_Items"
              item-text="pincode_territory_type"
              item-value="pincode_id"
              :rules="[(v) => !!v || 'Required']"
              return-object
            ></v-autocomplete>
          </v-form>
          <v-data-table
            dense
            fixed-header
            :search="search"
            :headers="headers"
            class="elevation-0 mt-2"
            height="300"
            :items-per-page="100"
            :no-data-text="noDataText"
            :items="SelectedPincodes"
            checkbox-color="primary"
            item-key="pincode_id"
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
          >
            <template v-slot:[`item.pincode`]="{ item }">
              <div class="FontSize" v-if="item.pincode">
                {{ item.pincode }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.division`]="{ item }">
              <div class="FontSize" v-if="item.division">
                {{ item.division }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.district`]="{ item }">
              <div class="FontSize" v-if="item.district">
                {{ item.district }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.region`]="{ item }">
              <div class="FontSize" v-if="item.region">
                {{ item.region }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.state`]="{ item }">
              <div class="FontSize" v-if="item.state">
                {{ item.state }}
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="PincodeTypeValue == 'ALL' || PincodeTypeValue == 'Unmapped'"
            small
            :loading="loading_btn"
            class="primary white--text"
            @click="validateMethod()"
            >Map
          </v-btn>
          <v-btn
            v-if="PincodeTypeValue != 'ALL' && PincodeTypeValue != 'Unmapped'"
            small
            :loading="Untag_Btn"
            class="primary white--text"
            @click="unMapPincodeMethod()"
            >Un Map
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import {
  UpdatePincodesAsUpcountry,
  UnMapPincodesFromTerritoryType,
} from "@/graphql/mutations.js";
import { ListPincodeTypesMixins } from "@/mixins/MastersSetting/ListPincodesTerritory.js";
export default {
  props: {
    SelectedPincodes: Array,
    PincodeTypeValue: String,
    MarkTerritoryPincodeDialog: Boolean,
  },
  components: {
    Overlay,
    Snackbar,
  },
  mixins: [ListPincodeTypesMixins],
  data: () => ({
    search: "",
    overlay: false,
    renderComp: true,
    loading_btn: false,
    Untag_Btn: false,
    Territory_Type_Select: "",
    SnackBarComponent: {},
    GetAllTerritoriesList: [],
    Pincodes_Items: [],
    headers: [
      { text: "Pincode", value: "pincode" },
      { text: "Division", value: "division" },
      { text: "District", value: "district" },
      { text: "Region", value: "region" },
      { text: "State", value: "state" },
    ],
    noDataText: "",
  }),
  watch: {
    MarkTerritoryPincodeDialog(val) {
      if (val == true) {
        console.log("SelectedPincodes", this.SelectedPincodes);
        this.ListPincodeTypes();
      }
    },
  },
  methods: {
    validateMethod() {
      if (this.$refs.Terr_form.validate()) {
        this.transferPincodeMethod();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Select Territory Type",
          };
          this.renderComp = true;
        });
      }
    },
    async transferPincodeMethod() {
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          territory_id: this.SelectedPincodes[0].territory_id,
          pincode_ids: this.SelectedPincodes.map((val) => val.pincode_id),
          pincode_type_name: this.Territory_Type_Select.pincode_territory_type,
          pincode_type_id: this.Territory_Type_Select.pincode_id,
          estimated_time: this.Territory_Type_Select.estimated_time,
        };
        this.loading_btn = true;
        let result = await API.graphql(
          graphqlOperation(UpdatePincodesAsUpcountry, {
            input: inputParams,
          })
        );
        console.log("result", result);
        var ResultObject = JSON.parse(result.data.UpdatePincodesAsUpcountry);
        if (ResultObject.Status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "primary",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.MarkTerritoryPincodeDialogEmit(2);
          this.loading_btn = false;
        }
        this.loading_btn = false;
      } catch (error) {
        this.loading_btn = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error,
          };
          this.renderComp = true;
        });
      }
    },
    async unMapPincodeMethod() {
      try {
        this.Untag_Btn = true;
        let inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          pincode_ids: this.SelectedPincodes.map((val) => val.pincode_id),
        };
        let result = await API.graphql(
          graphqlOperation(UnMapPincodesFromTerritoryType, {
            input: inputParams,
          })
        );
        let ResultObj = JSON.parse(result.data.UnMapPincodesFromTerritoryType);
        if (ResultObj.Status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "primary",
              Top: true,
              SnackbarText: ResultObj.Status_Message,
            };
            this.renderComp = true;
          });
          this.Untag_Btn = false;
          this.MarkTerritoryPincodeDialogEmit(2);
        }
      } catch (error) {
        this.Untag_Btn = false;
        console.log("error", error);
      }
    },
    MarkTerritoryPincodeDialogEmit(Toggle) {
      this.$refs.Terr_form.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
