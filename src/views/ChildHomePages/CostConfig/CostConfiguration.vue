<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <GenerateCostConfig
      :GenerateCostConfigDialog="generateCostConfigDialog"
      :StoreObj="storeObj"
      @clicked="GenerateCostConfigDialogEmit"
    />
    <ActivateDeactivateConfig
      :ActivateDeactivateConfigDialog="activateDeactivateConfigDialog"
      :StoreObj="storeObj"
      @clicked="ActivateDeactivateConfigDialogEmit"
    />
    <v-card elevation="0" v-if="currentView === 'MAIN_PAGE'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Cost Configuration</div>
        <v-spacer />
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          class="mt-7 ml-2 FontSize mediumWidth"
          append-icon="mdi-magnify"
        />
        <v-select
          v-model="costConfigStatus"
          :items="costConfigStatusItems"
          dense
          outlined
          class="mt-7 ml-2 FontSize mediumWidth"
          label="Status"
        />
        <v-btn
          small
          color="primary"
          class="ml-2"
          @click="generateCostConfigMethod('CREATE')"
          >Generate<v-icon small class="pl-1">mdi-plus</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text class="pt-2">
        <v-data-table
          style="cursor: pointer"
          class="TableValFontsize"
          :headers="costConfigHeader"
          :items="costConfigItems"
          dense
          fixed-header
          :search="search"
          :items-per-page="50"
          :height="TableHeight"
          :no-data-text="
            costConfigItems && costConfigItems.length === 0
              ? 'No data found'
              : undefined
          "
          @click:row="handleRowClick"
        >
          <template v-slot:[`item.gst`]="{ item }">
            <div>
              {{ item.gst || "0" }}
            </div>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <v-menu right bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense nav>
                <v-list-item-group color="primary">
                  <v-list-item @click="editConstConfigMethod('EDIT', item)">
                    <v-list-item-icon>
                      <v-icon color="blue" small>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.configuration_status !== 'ACTIVE'"
                    @click="activateDeactivateMethod('ACTIVATE', item)"
                  >
                    <v-list-item-icon>
                      <v-icon color="green" small>mdi-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Activate</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-else
                    @click="activateDeactivateMethod('DEACTIVATE', item)"
                  >
                    <v-list-item-icon>
                      <v-icon color="red" small>mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Deactivate</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
            <!-- <v-btn color="primary" small
              >View<v-icon small class="pl-1">mdi-eye</v-icon></v-btn
            > -->
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <CostConfigDetails
      v-else
      :StoreObj="storeObj"
      @clicked="CostConfigDetailsCardEmit"
    />
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";

import GenerateCostConfig from "@/components/CostConfig/Dialogs/GenerateCostConfigDialog.vue";
import ActivateDeactivateConfig from "@/components/CostConfig/Dialogs/ActivateDeactivateConfigDialog.vue";
import CostConfigDetails from "@/components/CostConfig/Cards/CostConfigDetailsCard.vue";

import { API, graphqlOperation } from "aws-amplify";
import { ListCostConfiguration } from "@/graphql/queries.js";

export default {
  components: {
    Overlay,
    Snackbar,
    GenerateCostConfig,
    ActivateDeactivateConfig,
    CostConfigDetails,
  },
  data: () => ({
    TableHeight: 0,
    search: "",
    costConfigItems: [],
    renderComp: true,
    SnackBarComponent: {},
    storeObj: {},
    overlay: false,
    generateCostConfigDialog: false,
    activateDeactivateConfigDialog: false,
    currentView: "MAIN_PAGE",
    costConfigStatus: "ACTIVE",
    costConfigStatusItems: ["ACTIVE", "INACTIVE"],
    costConfigHeader: [
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Service Type Name", value: "service_type_name" },
      { text: "Ticket Type Name", value: "ticket_type" },
      { text: "Support", value: "support_name" },
      { text: "Support Type", value: "support_type_name" },
      { text: "Cost", value: "cost" },
      { text: "GST", value: "gst" },
      { text: "Action", value: "action" },
    ],
  }),

  watch: {
    costConfigStatus(val) {
      if (val) {
        this.costConfigItems = [];
        this.callApi();
      }
    },
  },

  mounted() {
    this.TableHeight = window.innerHeight - 170;
    this.callApi();
  },

  methods: {
    async callApi() {
      try {
        this.overlay = true;
        const result = await API.graphql(
          graphqlOperation(ListCostConfiguration, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              limit: 500,
              configuration_status:
                this.costConfigStatus === "ACTIVE" ? "ACTIVE" : "DEACTIVE",
            },
          })
        );
        const response = JSON.parse(result.data.ListCostConfiguration);
        this.costConfigItems = response.data.Items;
        console.log("RESP", response);
      } catch (error) {
        //
      } finally {
        this.overlay = false;
      }
    },

    handleRowClick(item) {
      this.storeObj = item;
      this.currentView = "DETAILS_VIEW";
      console.log("ROW_DET", this.storeObj);
    },

    generateCostConfigMethod(action) {
      this.storeObj.action = action;
      this.generateCostConfigDialog = true;
    },

    activateDeactivateMethod(action, item) {
      this.storeObj = item;
      this.storeObj.action = action;
      this.activateDeactivateConfigDialog = true;
    },

    editConstConfigMethod(action, item) {
      this.storeObj = item;
      this.storeObj.action = action;
      this.generateCostConfigDialog = true;
    },

    GenerateCostConfigDialogEmit(Toggle) {
      this.generateCostConfigDialog = false;
      if (Toggle === 2) {
        this.callApi();
      }
    },

    ActivateDeactivateConfigDialogEmit(Toggle) {
      this.activateDeactivateConfigDialog = false;
      if (Toggle === 2) {
        this.costConfigItems = [];
        this.callApi();
      }
    },

    CostConfigDetailsCardEmit() {
      this.currentView = "MAIN_PAGE";
    },
  },
};
</script>
