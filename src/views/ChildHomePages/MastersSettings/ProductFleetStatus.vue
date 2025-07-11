<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <AddEditProductFleetStatus
      :StoreObj="StoreObj"
      :AddEditProductFleetStatusDialog="AddEditProductFleetStatusDialog"
      @clicked="AddEditProductFleetStatusDialogEmit"
    />
    <ActivateInactivateProductFleetStatus
      :StoreObj="StoreObj"
      :ActivateInactivateProductFleetStatusDailog="
        ActivateInactivateProductFleetStatusDailog
      "
      @clicked="ActivateInactivateProductFleetStatusDailogEmit"
    />
    <v-card elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="5" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">
              Settings
              <span class="PrimaryFontColorSmall">/Product Fleet Status</span>
            </div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="7" xs="12">
          <v-card-actions class="py-0 pr-0">
            <v-spacer></v-spacer>
            <v-select
              dense
              outlined
              label="Status"
              :items="statusItems"
              v-model="setting_status"
              class="mt-3 FontSize maxWidthXSmall"
            ></v-select>
            <v-text-field
              dense
              outlined
              label="Search"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              class="mt-3 ml-2 FontSize maxWidth"
            ></v-text-field>
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  @click="
                    (AddEditProductFleetStatusDialog = true),
                      (StoreObj.action = 'CREATE')
                  "
                  v-on="on"
                  v-bind="attrs"
                  class="mt-n4 gradient-bg white--text ml-2 mr-2"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
              <span class="white--text">Add Product Fleet Status</span>
            </v-tooltip>
          </v-card-actions>
        </v-col>
      </v-row>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="amcHeaders"
          :height="TableHeight"
          :items-per-page="100"
          :no-data-text="noDataText"
          :items="GetAllProductFleetStatusList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAllProductFleetStatusList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.setting_name`]="{ item }">
            <div class="FontSize">{{ item.setting_name }}</div>
          </template>
          <template v-slot:[`item.setting_created_on`]="{ item }">
            <div class="FontSize">{{ getTime(item) }}</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary" v-if="setting_status == 'ACTIVE'">
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="checkItem(item, 'EDIT')"
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span class="white--text">Update Product Fleet Status</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.setting_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon small>{{
                    item.setting_status == "ACTIVE"
                      ? "mdi-close-thick"
                      : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="
                  item.setting_status == 'ACTIVE' ? `Deactivate` : `Activate`
                "
              ></span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddEditProductFleetStatus from "@/components/MasterSettings/Dialogs/ProductFleetStatus/AddEditProductFleetStatus.vue";
import { GetAllProductFleetStatus } from "@/mixins/MastersSetting/GetAllProductFleetStatus.js";
import ActivateInactivateProductFleetStatus from "@/components/MasterSettings/Dialogs/ProductFleetStatus/ActivateInactivateProductFleetStatus.vue";
import Croppa from "vue-croppa";
Vue.use(Croppa);
export default {
  components: {
    Overlay,
    Snackbar,
    AddEditProductFleetStatus,
    ActivateInactivateProductFleetStatus,
  },
  mixins: [GetAllProductFleetStatus],
  data() {
    return {
      TableHeight: 0,
      renderComp: true,
      search: "",
      setting_status: "ACTIVE",
      statusItems: ["ACTIVE", "INACTIVE"],
      amcHeaders: [
        { text: "#", value: "sl_no" },
        {
          text: "Product Fleet Status",
          value: "setting_name",
        },
        {
          text: "Created On",
          value: "setting_created_on",
        },

        { text: "Actions", value: "Actions" },
      ],
      AddEditProductFleetStatusDialog: false,
      ActivateInactivateProductFleetStatusDailog: false,
      StoreObj: {},
      SnackBarComponent: {},
    };
  },
  watch: {
    setting_status(val) {
      this.search = '';
      this.GetAllProductFleetStatusMethod(val);
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllProductFleetStatusMethod(this.setting_status);
  },
  methods: {
    getTime(item) {
      let timeFromServer = item.setting_created_on;
      let epochTime = new Date(timeFromServer).getTime();
      let localTime = new Date(epochTime).toLocaleDateString("en-GB");
      return localTime;
    },
    ActivateInactivateProductFleetStatusDailogEmit(Toggle) {
      this.ActivateInactivateProductFleetStatusDailog = false;
      if (Toggle == 2) {
        this.GetAllProductFleetStatusMethod(this.setting_status);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.AddEditProductFleetStatusDialog = true;
      } else if (action == "ACTION") {
        this.ActivateInactivateProductFleetStatusDailog = true;
      }
    },
    AddEditProductFleetStatusDialogEmit(Toggle) {
      this.AddEditProductFleetStatusDialog = false;
      if (Toggle == 2) {
        this.GetAllProductFleetStatusMethod(this.setting_status);
      }
    },
  },
};
</script>
