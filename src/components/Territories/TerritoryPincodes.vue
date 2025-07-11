<template>
  <div>
    <TransferPincodeToOtherTerritory
      :StoreObj="StoreObj"
      :StoreObjTerritory="StoreObjTerritory"
      :transferPincodeDialog="transferPincodeDialog"
      @clicked="transferPincodeDialogEmit"
    />
    <MarkTerritoryPincodeDialog
      :MarkTerritoryPincodeDialog="MarkTerritoryPincodeDialog"
      :SelectedPincodes="SelectedPincodes"
      :PincodeTypeValue="PincodeTypeValue"
      @clicked="MarkTerritoryPincodeDialogEmit"
    />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <v-icon color="primary">mdi-map-marker-multiple</v-icon>
        <div class="largeFontSizeNew ml-2">
          Pincodes of {{ this.StoreObj.territory_name }}
        </div>
        <v-spacer />
        <v-btn
          v-if="selected.length > 0"
          x-small
          color="primary"
          class="mr-2 mt-2"
          @click.stop="territoryPincodesMarkMethod()"
        >
          <v-icon x-small>mdi-check-all</v-icon
          >{{
            Pincode_Type == "ALL" || Pincode_Type.pincode_id == "UNMAPPED"
              ? "Map To"
              : "UnMap"
          }}</v-btn
        >
        <v-select
          dense
          outlined
          label="Pincode Status *"
          v-model="pincode_status"
          :items="pincode_status_items"
          class="FontSize WidthVariation2 mt-9 mr-2"
        ></v-select>
        <v-select
          dense
          outlined
          label="Pincode Type"
          :items="Pincodes_Items"
          v-model="Pincode_Type"
          item-text="pincode_territory_type"
          item-value="pincode_id"
          class="FontSize WidthVariation2 mt-9 mr-2"
          return-object
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="mt-9 FontSize WidthVariation1"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              class="primary mt-2 ml-2 white--text"
              @click="deletePincodes()"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Delete Selected Pincodes</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              @click="transferPincodes()"
              class="primary mt-2 ml-2 white--text"
            >
              <v-icon small>mdi-tag-arrow-right-outline</v-icon>
            </v-btn>
          </template>
          <span>Transfer these to other Territory</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              class="primary mr-2 mt-2 ml-2 white--text"
              @click="addPincode()"
              ><v-icon small>mdi-map-marker-plus-outline</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add Pincode</span>
        </v-tooltip>
        <v-btn
          color="primary"
          dark
          small
          class="mt-2"
          @click="viewPincodesDialogEmit((Toggle = 1))"
          ><v-icon>mdi-chevron-double-left</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="pincode_headers"
          show-select
          item-key="pincode_id"
          v-model="selected"
          class="elevation-0"
          max-height="300"
          :items-per-page="100"
          :no-data-text="noDataText"
          :items="GetAllTerritoriesList"
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
          <template v-slot:[`item.pincode_type_name`]="{ item }">
            <div class="FontSize" v-if="item.pincode_type_name">
              {{ item.pincode_type_name }}
            </div>
            <div v-else>Unmapped</div>
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
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom color="teal" v-if="pincode_status == 'ACTIVE'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="teal"
                  @click="untagPincode(item)"
                >
                  <v-icon small>mdi-tag-off-outline</v-icon>
                </v-btn>
              </template>
              <span>Untag this Pincode</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog :value="addPincodeToTerritory" persistent width="400px">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div>Add Pincode</div>
          <v-spacer />
          <v-btn icon @click="addPincodeToTerritoryEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5">
          <v-form ref="form">
            <v-text-field
              dense
              outlined
              class="FontSize"
              label="Pincode(s) *"
              :rules="[(v) => !!v || 'Required']"
              hint="Multiple Pincodes allowed seperated with Comma (,)"
              v-model="territory_pincode"
            >
            </v-text-field>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn
              small
              outlined
              @click="addPincodeToTerritoryEmit((Toggle = 1))"
              >No</v-btn
            >
            <v-btn
              small
              class="primary"
              :loading="loading_btn"
              @click="addPincodeToTerritoryMethod()"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog :value="removePincodeFromTerritory" persistent width="400px">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div><v-icon small>mdi-delete</v-icon> Delete Pincode</div>
          <v-spacer />
          <v-btn icon @click="removePincodeTerritoryEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5">
          <v-icon size="50px" color="red">mdi-delete-outline</v-icon>
          <div>
            Are you sure to Delete these
            {{ StoreObjTerritory.length }} pincode(s) from Territory ({{
              StoreObj.territory_name
            }}) ?
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              small
              outlined
              @click="removePincodeTerritoryEmit((Toggle = 1))"
              >No</v-btn
            >
            <v-btn
              small
              class="primary"
              :loading="loading_btn"
              @click="removePincodeFromTerritoryMethod()"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog :value="untagPincodeDialog" persistent width="400px">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div><v-icon small>mdi-tag-off-outline</v-icon> Untag Pincode</div>
          <v-spacer />
          <v-btn icon @click="untagPincodeDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5">
          <v-icon size="50px" color="teal">mdi-tag-off-outline</v-icon>
          <div>
            Are you sure to untag this pincode ({{ StoreObjTerritory.pincode }})
            from Territory ({{ StoreObj.territory_name }}) ?
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn small outlined @click="untagPincodeDialogEmit((Toggle = 1))"
              >No</v-btn
            >
            <v-btn
              small
              class="primary"
              :loading="loading_btn"
              @click="untagPincodemethod()"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import TransferPincodeToOtherTerritory from "@/components/Territories/Dialogs/TransferPincodeToOtherTerritory.vue";
import { API, graphqlOperation } from "aws-amplify";
import { AddOrRemovePincodeFromTerritory } from "@/graphql/mutations.js";
import { ActivateOrDeactivateTerritoryOrPincode } from "@/graphql/mutations.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { ListPincodeTypesMixins } from "@/mixins/MastersSetting/ListPincodesTerritory.js";
import MarkTerritoryPincodeDialog from "@/components/Territories/Dialogs/TerritoriesMark.vue";
export default {
  components: {
    Overlay,
    Snackbar,
    TransferPincodeToOtherTerritory,
    MarkTerritoryPincodeDialog,
  },
  props: {
    StoreObj: Object,
    viewPincodesDialog: Boolean,
  },
  mixins: [GetAllTerritories, ListPincodeTypesMixins],
  data: () => ({
    search: "",
    pincode_status: "ACTIVE",
    PincodeTypeValue: "",
    overlay: false,
    renderComp: true,
    loading_btn: false,
    untagPincodeDialog: false,
    addPincodeToTerritory: false,
    transferPincodeDialog: false,
    removePincodeFromTerritory: false,
    MarkTerritoryPincodeDialog: false,
    SnackBarComponent: {},
    StoreObjTerritory: [],
    selected: [],
    SelectedPincodes: [],
    territory_pincode: [],
    GetAllTerritoriesList: [],
    pincode_status_items: [
      { text: "TAGGED", value: "ACTIVE" },
      { text: "UNTAGGED", value: "INACTIVE" },
    ],
    pincode_headers: [
      { text: "Pincode", value: "pincode" },
      { text: "Division", value: "division" },
      { text: "Mapped To", value: "pincode_type_name" },
      { text: "District", value: "district" },
      { text: "Region", value: "region" },
      { text: "State", value: "state" },
      { text: "Actions", value: "actions" },
    ],
    Pincode_Type: "ALL",
    Pincodes_Items: [],
  }),
  watch: {
    pincode_status(val) {
      this.GetAllTerritoriesMethod(
        val,
        undefined,
        undefined,
        "PINCODE",
        this.StoreObj.territory_id,
        this.Pincode_Type
      );
    },
    Pincode_Type(val) {
      if (val != "") {
        this.selected = [];
        this.GetAllTerritoriesMethod(
          this.pincode_status,
          undefined,
          undefined,
          "PINCODE",
          this.StoreObj.territory_id,
          val
        );
      }
    },
  },
  mounted() {
    this.GetAllTerritoriesMethod(
      this.pincode_status,
      undefined,
      undefined,
      "PINCODE",
      this.StoreObj.territory_id,
      this.Pincode_Type
    );
    this.ListPincodeTypes();
    setTimeout(() => {
      this.Pincodes_Items.splice(0, 0, "ALL", {
        pincode_territory_type: "Unmapped",
        pincode_id: "UNMAPPED",
      });
      console.log("Niranjan", this.Pincodes_Items);
    }, 1000);
  },
  methods: {
    territoryPincodesMarkMethod() {
      this.SelectedPincodes = this.selected;
      this.PincodeTypeValue =
        this.Pincode_Type == "ALL"
          ? this.Pincode_Type
          : this.Pincode_Type.pincode_territory_type;
      this.MarkTerritoryPincodeDialog = true;
    },
    transferPincodes() {
      if (
        this.selected != [] &&
        this.selected != undefined &&
        this.selected.length != 0
      ) {
        this.StoreObjTerritory = this.selected;
        this.transferPincodeDialog = true;
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Select atleast one pincode..!",
          };
          this.renderComp = true;
        });
      }
    },
    viewPincodesDialogEmit(Toggle) {
      this.search = "";
      this.GetAllTerritoriesList = [];
      this.$emit("clicked", Toggle);
    },
    transferPincodeDialogEmit(Toggle) {
      this.transferPincodeDialog = false;
      if (Toggle == 2) {
        this.selected = [];
        this.GetAllTerritoriesList = [];
        this.GetAllTerritoriesMethod(
          undefined,
          undefined,
          undefined,
          "PINCODE",
          this.StoreObj.territory_id,
          this.Pincode_Type
        );
      }
    },
    async addPincodeToTerritoryMethod() {
      try {
        var inputParams = {
          action_type: "ADD_PINCODE",
          territory_id: this.StoreObj.territory_id,
          territory_pincode: this.territory_pincode.split(","),
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
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
          this.addPincodeToTerritoryEmit((this.Toggle = 2));
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
    addPincodeToTerritoryEmit(Toggle) {
      this.territory_pincode = [];
      this.addPincodeToTerritory = false;
      if (Toggle == 2) {
        this.GetAllTerritoriesList = [];
        this.GetAllTerritoriesMethod(
          undefined,
          undefined,
          undefined,
          "PINCODE",
          this.StoreObj.territory_id,
          this.Pincode_Type
        );
      }
    },
    removePincodeTerritoryEmit(Toggle) {
      this.removePincodeFromTerritory = false;
      if (Toggle == 2) {
        this.selected = [];
        this.GetAllTerritoriesList = [];
        this.GetAllTerritoriesMethod(
          undefined,
          undefined,
          undefined,
          "PINCODE",
          this.StoreObj.territory_id,
          this.Pincode_Type
        );
      }
    },
    untagPincodeDialogEmit(Toggle) {
      this.untagPincodeDialog = false;
      if (Toggle == 2) {
        this.GetAllTerritoriesList = [];
        this.GetAllTerritoriesMethod(
          undefined,
          undefined,
          undefined,
          "PINCODE",
          this.StoreObj.territory_id,
          this.Pincode_Type
        );
      }
    },
    untagPincode(item) {
      this.StoreObjTerritory = item;
      this.untagPincodeDialog = true;
    },
    deletePincodes() {
      if (
        this.selected != undefined &&
        this.selected.length != 0 &&
        this.selected != []
      ) {
        this.StoreObjTerritory = this.selected;
        this.removePincodeFromTerritory = true;
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Select Atleast one Pincode..!",
          };
          this.renderComp = true;
        });
      }
    },
    addPincode() {
      this.addPincodeToTerritory = true;
    },
    async removePincodeFromTerritoryMethod() {
      try {
        var inputParams = {
          action_type: "REMOVE",
          territory_id: this.StoreObj.territory_id,
          territory_pincode: this.selected.map((val) => val.pincode),
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
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
          this.removePincodeTerritoryEmit((this.Toggle = 2));
          this.loading_btn = false;
        }
      } catch (error) {
        this.loading_btn = false;
        this.renderComp = true;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = false;
        });
      }
    },
    async untagPincodemethod() {
      try {
        var inputParams = {
          territory_id: this.StoreObj.territory_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          action: "DEACTIVATE",
          action_type: "PINCODE",
          pincode_id: this.StoreObjTerritory.pincode_id,
        };
        this.loading_btn = true;
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
          this.untagPincodeDialogEmit((this.Toggle = 2));
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
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = false;
        });
      }
    },
    MarkTerritoryPincodeDialogEmit(Toggle) {
      this.MarkTerritoryPincodeDialog = false;
      if (Toggle == 2) {
        this.selected = [];
        this.GetAllTerritoriesMethod(
          this.pincode_status,
          undefined,
          undefined,
          "PINCODE",
          this.StoreObj.territory_id,
          this.Pincode_Type
        );
      }
    },
  },
};
</script>

<style></style>
