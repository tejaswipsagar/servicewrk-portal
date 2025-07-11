<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <CreateServiceTypes
      :StoreObj="StoreObj"
      :CreateServiceTypesDialog="CreateServiceTypesDialog"
      @clicked="CreateServiceTypesDialogEmit"
    />
    <ActivateInactivateMasterSettingsTypes
      :StoreObj="StoreObj"
      :dialogActivateInactivateMasterSettingTypes="
        dialogActivateInactivateMasterSettingTypes
      "
      @clicked="dialogActivateInactivateMasterSettingTypesEmit"
    />
    <v-card elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="5" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">
              Settings
              <span class="PrimaryFontColorSmall">/ Service Types</span>
            </div>
          </v-toolbar>
        </v-col>
        <v-col>
          <v-card-actions class="py-0 pr-0">
            <v-spacer></v-spacer>
            <v-select
              dense
              outlined
              class="mt-3 FontSize field_label_size field_height maxWidthXSmall"
              label="Status"
              v-model="status"
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
                    (CreateServiceTypesDialog = true),
                      (StoreObj.action = 'CREATE')
                  "
                  v-on="on"
                  v-bind="attrs"
                  class="mt-n4 gradient-bg white--text ml-2 mr-2"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
              <span class="white--text">Add Service Type</span>
            </v-tooltip>
          </v-card-actions>
        </v-col>
      </v-row>
      <v-card-text class="pt-0">
        <v-data-table
          fixed-header
          :height="TableHeight"
          dense
          :search="search"
          :headers="ServiceTypeHeaders"
          :items="GetAllServiceTypeList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div>
              {{ GetAllServiceTypeList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.service_type_name`]="{ item }">
            <div class="FontSize" v-if="item.service_type_name != undefined">
              {{ item.service_type_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_type_code`]="{ item }">
            <div class="FontSize" v-if="item.service_type_code != undefined">
              {{ item.service_type_code }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_type_price`]="{ item }">
            <div class="FontSize" v-if="item.service_type_price != undefined">
              {{ item.service_type_price }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_type_created_on`]="{ item }">
            <div
              class="FontSize"
              v-if="item.service_type_created_on != undefined"
            >
              {{
                new Date(
                  item.service_type_created_on * 1000
                ).toLocaleDateString("en-GB")
              }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.tagged_ticket_type_ids`]="{ item }">
            <div
              class="FontSize"
              v-if="
                item.tagged_ticket_type_ids ==
                '7c8280d4-7125-40bb-8d25-41dbf532ae1e'
              "
            >
              SCHEDULE SERVICE
            </div>
            <div
              class="FontSize"
              v-else-if="
                item.tagged_ticket_type_ids ==
                'ec7fd6bc-e84f-47bb-a69b-8e1f5aed1e0a'
              "
            >
              OTHER
            </div>
            <div
              class="FontSize"
              v-else-if="
                item.tagged_ticket_type_ids ==
                '6bb0267d-c4ed-496f-a08b-99901c183acb'
              "
            >
              BREAKDOWN
            </div>
            <div
              class="FontSize"
              v-else-if="
                item.tagged_ticket_type_ids ==
                '05247ae5-87be-4b70-8b57-f21afaae4258'
              "
            >
              INSTALLATION
            </div>
            <div
              class="FontSize"
              v-else-if="
                item.tagged_ticket_type_ids ==
                '706d15cb-2e1a-41d5-b3a0-440ab7f081cc'
              "
            >
              TEST
            </div>
            <div
              class="FontSize"
              v-else-if="
                item.tagged_ticket_type_ids ==
                '6bb0267d-c4ed-496f-a08b-99901c183ahv'
              "
            >
              CORE SERVICE JOB
            </div>
            <div
              class="FontSize"
              v-else-if="
                item.tagged_ticket_type_ids ==
                '6bb0267d-c4ed-496f-a08b-99901c183ahc'
              "
            >
              NON CORE SERVICE JOB
            </div>
            <div
              class="FontSize"
              v-else-if="
                item.tagged_ticket_type_ids ==
                '6bb0267d-c4ed-496f-a08b-99901c183ahd'
              "
            >
              SUNDARY JOB
            </div>
            <div class="FontSize" v-else>-</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary" v-if="status == 'ACTIVE'">
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
              <span class="white--text">Update Service Type</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon small>{{
                    item.status == "ACTIVE" ? "mdi-close-thick" : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="item.status == 'ACTIVE' ? `Deactivate` : `Activate`"
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
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
import CreateServiceTypes from "@/components/MasterSettings/Dialogs/ServiceTypes/CreateServiceTypes.vue";
import ActivateInactivateMasterSettingsTypes from "@/components/MasterSettings/Dialogs/ServiceTypes/ActivateInactivateMasterSettingsTypes.vue";
import Croppa from "vue-croppa";
var aws = require("aws-sdk");
Vue.use(Croppa);
export default {
  components: {
    Overlay,
    Snackbar,
    CreateServiceTypes,
    ActivateInactivateMasterSettingsTypes,
  },
  mixins: [GetAllServiceTypes],
  data() {
    return {
      search: "",
      TableHeight: 0,
      status: "ACTIVE",
      statusItems: ["ACTIVE", "INACTIVE"],
      StoreObj: {},
      tableHeader: [],
      SnackBarComponent: {},
      CreateServiceTypesDialog: false,
      AddWIPCategoryLocationDialog: false,
      dialogActivateInactivateMasterSettingTypes: false,
      ServiceTypeHeaders: [
        { text: "#", value: "sl_no" },
        {
          text: "Name",
          value: "service_type_name",
        },
        {
          text: "Created On",
          value: "service_type_created_on",
        },
        {
          text: "Code",
          value: "service_type_code",
        },
        {
          text: "Price",
          value: "service_type_price",
        },
        {
          text: "Tagged Ticket Type",
          value: "tagged_ticket_type_ids",
        },
        { text: "Actions", value: "Actions" },
      ],
    };
  },
  watch: {
    status(val) {
      this.search = "";
      this.GetAllServiceTypeMethod(val);
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllServiceTypeMethod(this.status);
  },
  methods: {
    dialogActivateInactivateMasterSettingTypesEmit(Toggle) {
      this.dialogActivateInactivateMasterSettingTypes = false;
      if (Toggle == 2) {
        this.GetAllServiceTypeMethod(this.status);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      console.log("ITEM", item);
      if (action == "EDIT") {
        this.CreateServiceTypesDialog = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateMasterSettingTypes = true;
      }
    },
    CreateServiceTypesDialogEmit(Toggle) {
      this.CreateServiceTypesDialog = false;
      if (Toggle == 2) {
        this.GetAllServiceTypeMethod(this.status);
      }
    },
  },
};
</script>
