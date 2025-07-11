<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />

    <AddWipState
      :StoreObj="StoreObj"
      :AddWipStateDialog="AddWipStateDialog"
      @clicked="AddWipStateDialogEmit"
    />
    <ActivateDeactivateWipState
      :StoreObj="StoreObj"
      :ActivateDeactivateWipStateDialog="ActivateDeactivateWipStateDialog"
      @clicked="ActivateDeactivateWipStateDialogEmit"
    />
    <v-card elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="5" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">
              Settings
              <span class="PrimaryFontColorSmall">/ WIP State</span>
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
              class="mt-3 ml-2 FontSize field_label_size field_height maxWidth"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  @click="
                    (AddWipStateDialog = true), (StoreObj.action = 'CREATE')
                  "
                  v-on="on"
                  v-bind="attrs"
                  class="mt-n4 gradient-bg white--text ml-2 mr-2"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
              <span class="white--text">Add WIP State</span>
            </v-tooltip>
          </v-card-actions>
        </v-col>
      </v-row>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          fixed-header
          :height="TableHeight"
          :search="search"
          :headers="amcHeaders"
          :items="GetAllWIPStateList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAllWIPStateList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.setting_name`]="{ item }">
            <div class="FontSize">{{ item.setting_name }}</div>
          </template>
          <template v-slot:[`item.setting_created_on`]="{ item }">
            <div class="FontSize">
              {{ new Date(item.setting_created_on * 1000).toLocaleString("en-GB") }}
            </div>
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
              <span class="white--text">Update WIP State</span>
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
                    item.setting_status == "ACTIVE" ? "mdi-close-thick" : "mdi-check"
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
import { GetAllWipState } from "@/mixins/MastersSetting/GetAllWipState.js";
import AddWipState from "@/components/MasterSettings/Dialogs/WipState/AddWipState.vue";
import ActivateDeactivateWipState from "@/components/MasterSettings/Dialogs/WipState/ActivateDeactivateWipState.vue";
import Croppa from "vue-croppa";
Vue.use(Croppa);
export default {
  components: {
    Overlay,
    Snackbar,
    AddWipState,
    ActivateDeactivateWipState,
  },
  mixins: [GetAllWipState],
  data() {
    return {
      search: "",
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
      AddWipStateDialog: false,
      ActivateDeactivateWipStateDialog: false,
      StoreObj: {},
      SnackBarComponent: {},
    };
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllWipStateMethod(this.setting_status);
  },

  watch: {
    setting_status(val) {
      this.search = '';
      this.GetAllWipStateMethod(val);
    },
  },
  methods: {
    ActivateDeactivateWipStateDialogEmit(Toggle) {
      this.ActivateDeactivateWipStateDialog = false;
      if (Toggle == 2) {
        this.GetAllWipStateMethod(this.setting_status);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.AddWipStateDialog = true;
      } else if (action == "ACTION") {
        this.ActivateDeactivateWipStateDialog = true;
      }
    },
    AddWipStateDialogEmit(Toggle) {
      this.AddWipStateDialog = false;
      if (Toggle == 2) {
        this.GetAllWipStateMethod(this.setting_status);
      }
    },
  },
};
</script>
