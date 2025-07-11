<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <CreateAMCTypes
      :StoreObj="StoreObj"
      :CreateAMCTypesDialog="CreateAMCTypesDialog"
      @clicked="CreateAMCTypesDialogEmit"
    />
    <ActivateDeactivateAmcTypes
      :StoreObj="StoreObj"
      :ActivateDeactivateAmcTypeDialog="ActivateDeactivateAmcTypeDialog"
      @clicked="ActivateDeactivateAmcTypeDialogEmit"
    />
    <v-card elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="5" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">
              Settings
              <span class="PrimaryFontColorSmall">/ Support Types</span>
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
            <v-select
              dense
              outlined
              label="Support"
              class="mt-3 ml-2 FontSize field_label_size field_height maxWidthXSmall"
              item-text="text"
              item-value="value"
              :items="WarrentyType"
              v-model="support_type"
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
                    (CreateAMCTypesDialog = true), (StoreObj.action = 'CREATE')
                  "
                  v-on="on"
                  v-bind="attrs"
                  class="mt-n4 gradient-bg white--text ml-2 mr-2"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
              <span class="white--text">Add AMC Type</span>
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
          :items="GetAllAMCTypeList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.setting_name`]="{ item }">
            <div class="FontSize">{{ item.setting_name }}</div>
          </template>
          <template v-slot:[`item.support_type`]="{ item }">
            <div class="FontSize" v-if="item.support_type == 'AMC'">
              CONTRACT
            </div>
            <div class="FontSize" v-else>
              {{ item.support_type.replaceAll("_", " ") }}
            </div>
          </template>
          <template v-slot:[`item.support_frequency`]="{ item }">
            <div class="FontSize">{{ item.support_frequency }}</div>
          </template>
          <template v-slot:[`item.setting_price`]="{ item }">
            <div v-if="item.setting_price != undefined" class="FontSize">
              {{ item.setting_price }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAllAMCTypeList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.setting_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.setting_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
          <template v-slot:[`item.setting_description`]="{ item }">
            <div class="FontSize" v-if="item.setting_description != undefined">
              {{ item.setting_description }}
            </div>
            <div v-else>-</div>
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
Vue.use(Croppa);
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import Vue from "vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import CreateAMCTypes from "@/components/MasterSettings/Dialogs/AMCTypes/CreateAMCTypes.vue";
import ActivateDeactivateAmcTypes from "@/components/MasterSettings/Dialogs/AMCTypes/ActivateDeactivateAmcTypes.vue";
import Croppa from "vue-croppa";
export default {
  components: {
    Overlay,
    Snackbar,
    CreateAMCTypes,
    ActivateDeactivateAmcTypes,
  },
  mixins: [GetAllOrganizationSetting],
  data() {
    return {
      TableHeight: 0,
      search: null,
      CreateAMCTypesDialog: false,
      ActivateDeactivateAmcTypeDialog: false,
      StoreObj: {},
      SnackBarComponent: {},
      setting_status: "ACTIVE",
      support_type: "WARRANTY",
      statusItems: ["ACTIVE", "INACTIVE"],
      amcHeaders: [
        { text: "#", value: "sl_no" },
        {
          text: "Support Type",
          value: "setting_name",
        },
        {
          text: "Created On",
          value: "setting_created_on",
        },
        {
          text: "Price",
          value: "setting_price",
        },
        {
          text: "Description",
          value: "setting_description",
          maxwidth: "20%",
        },
        {
          text: "Support",
          value: "support_type",
        },
        {
          text: "Support Frequency",
          value: "support_frequency",
        },
        { text: "Actions", value: "Actions" },
      ],
      WarrentyType: [
        { text: "GUARANTEE", value: "GUARANTEE" },
        { text: "WARRANTY", value: "WARRANTY" },
        { text: "CONTRACT", value: "AMC" },
        { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
        { text: "NO WARRANTY", value: "NO_WARRANTY" },
      ],
    };
  },
  watch: {
    setting_status(val) {
      this.search = "";
      this.GetAllAMCTypeMethod(this.setting_status, this.support_type, val);
    },
    support_type(val) {
      this.search = "";
      this.GetAllAMCTypeMethod(this.setting_status, this.support_type, val);
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllAMCTypeMethod(this.setting_status, this.support_type);
  },
  methods: {
    ActivateDeactivateAmcTypeDialogEmit(Toggle) {
      this.ActivateDeactivateAmcTypeDialog = false;
      if (Toggle == 2) {
        this.GetAllAMCTypeMethod(this.setting_status, this.support_type);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.CreateAMCTypesDialog = true;
      } else if (action == "ACTION") {
        this.ActivateDeactivateAmcTypeDialog = true;
      }
    },
    CreateAMCTypesDialogEmit(Toggle) {
      this.CreateAMCTypesDialog = false;
      if (Toggle == 2) {
        this.GetAllAMCTypeMethod(this.setting_status, this.support_type);
      }
    },
  },
};
</script>
