<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />

    <CreateDesignation
      :StoreObj="StoreObj"
      :createDesignationDailog="createDesignationDailog"
      @clicked="createDesignationDailogEmit"
    />
    <ActivateDeactivateAmcTypes
      :StoreObj="StoreObj"
      :ActivateDeactivateDesignation="ActivateDeactivateDesignation"
      @clicked="ActivateDeactivateDesignationEmit"
    />
    <v-card elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="5" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">
              Settings
              <span class="PrimaryFontColorSmall">/Roles</span>
            </div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="7" xs="12">
          <v-card-actions class="py-0 pr-0">
            <v-spacer></v-spacer>
            <v-select
              dense
              outlined
              class="mt-3 FontSize field_label_size field_height maxWidthXSmall"
              label="Status"
              v-model="setting_status"
              :items="statusItems"
            ></v-select>
            <v-text-field
              dense
              outlined
              label="Search"
              class="mt-3 ml-2 FontSize field_label_size field_height"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  @click="
                    (createDesignationDailog = true),
                      (StoreObj.action = 'CREATE')
                  "
                  v-on="on"
                  v-bind="attrs"
                  class="mt-n4 gradient-bg white--text ml-2 mr-2"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
              <span class="white--text">Create Designation</span>
            </v-tooltip>
          </v-card-actions>
        </v-col>
      </v-row>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          :search="search"
          fixed-header
          :height="TableHeight"
          :headers="amcHeaders"
          :items="GetAllDesignationsList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAllDesignationsList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.setting_name`]="{ item }">
            <div class="FontSize">{{ item.setting_name }}</div>
          </template>
          <template v-slot:[`item.setting_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.setting_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary" v-if="setting_status == 'ACTIVE'">
              <template v-slot:activator="{ on }">
                <v-icon
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                  @click="checkItem(item, 'EDIT')"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span class="white--text">Update AMC Type</span>
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
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import CreateDesignation from "@/components/MasterSettings/Dialogs/Designations/CreateDesignations.vue";
import ActivateDeactivateAmcTypes from "@/components/MasterSettings/Dialogs/Designations/ActivateDeactivateDesignation.vue";
import { GetAllDesignations } from "@/mixins/MastersSetting/GetAllDesignations.js";
import Croppa from "vue-croppa";
Vue.use(Croppa);
export default {
  components: {
    Overlay,
    Snackbar,
    CreateDesignation,
    ActivateDeactivateAmcTypes,
  },
  mixins: [GetAllDesignations],
  data() {
    return {
      search: null,
      createDesignationDailog: false,
      ActivateDeactivateDesignation: false,
      TableHeight: 0,
      setting_status: "ACTIVE",
      statusItems: ["ACTIVE", "INACTIVE"],
      amcHeaders: [
        { text: "#", value: "sl_no" },
        {
          text: "Name",
          value: "setting_name",
        },
        {
          text: "Created On",
          value: "setting_created_on",
        },
        { text: "Actions", value: "Actions" },
      ],
      StoreObj: {},
      SnackBarComponent: {},
    };
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllDesignationsMethod(this.setting_status);
  },
  watch: {
    setting_status(val) {
      this.search = '';
      this.GetAllDesignationsMethod(val);
    },
  },
  methods: {
    ActivateDeactivateDesignationEmit(Toggle) {
      this.ActivateDeactivateDesignation = false;
      if (Toggle == 2) {
        this.GetAllDesignationsMethod(this.setting_status);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.createDesignationDailog = true;
      } else if (action == "ACTION") {
        this.ActivateDeactivateDesignation = true;
      }
    },
    createDesignationDailogEmit(Toggle) {
      this.createDesignationDailog = false;
      if (Toggle == 2) {
        this.GetAllDesignationsMethod(this.setting_status);
      }
    },
  },
};
</script>
