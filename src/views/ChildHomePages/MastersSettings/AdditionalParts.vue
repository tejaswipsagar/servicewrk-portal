<template>
  <div>
    <Overlay :overlay="overlay" />
    <AddEditAdditionalParts
      :StoreObj="StoreObj"
      :AddEditAdditionalPartDialog="AddEditAdditionalPartDialog"
      @clicked="AddEditAdditionalPartDialogEmit"
    />
    <ActivateDeactivateAdditioanalPart
      :StoreObj="StoreObj"
      :ActivateDeactivateAdditionalPartDialog="
        ActivateDeactivateAdditionalPartDialog
      "
      @clicked="ActivateDeactivateAdditionalPartDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Settings
          <span class="PrimaryFontColorSmall">/ Additional Parts</span>
        </div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          class="mt-6 FontSize maxWidthXSmall"
          label="Status"
          v-model="master_status"
          :items="statusItems"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-6 ml-2 WidthVariation2 FontSize"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              @click="
                (AddEditAdditionalPartDialog = true),
                  (StoreObj.action = 'CREATE')
              "
              v-on="on"
              v-bind="attrs"
              class="primary white--text ml-2 mr-2"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Create Additional Part</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          :search="search"
          fixed-header
          :height="TableHeight"
          :headers="additionalPartHeaders"
          :items="GetAllAdditionalPartsList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAllAdditionalPartsList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.master_name`]="{ item }">
            <div class="FontSize">{{ item.master_name }}</div>
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary" v-if="master_status == 'ACTIVE'">
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
              <span class="white--text">Update {{ item.master_name }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.master_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon small>{{
                    item.master_status == "ACTIVE"
                      ? "mdi-close-thick"
                      : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="
                  item.master_status == 'ACTIVE'
                    ? `Deactivate ${item.master_name}`
                    : `Activate ${item.master_name}`
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
import { GetAllAdditionalParts } from "@/mixins/MastersSetting/GetAllAdditionalParts.js";
import Vue from "vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import AddEditAdditionalParts from "@/components/MasterSettings/Dialogs/AdditionalParts/AddEditAdditionalParts.vue";
import ActivateDeactivateAdditioanalPart from "@/components/MasterSettings/Dialogs/AdditionalParts/ActivateDeactivateAdditioanalPart.vue";
import Croppa from "vue-croppa";
export default {
  components: {
    Overlay,
    AddEditAdditionalParts,
    ActivateDeactivateAdditioanalPart,
  },
  mixins: [GetAllAdditionalParts],
  data() {
    return {
      TableHeight: 0,
      search: "",
      master_status: "ACTIVE",
      AddEditAdditionalPartDialog: false,
      ActivateDeactivateAdditionalPartDialog: false,
      GetAllAdditionalPartsList: [],
      statusItems: ["ACTIVE", "INACTIVE"],
      additionalPartHeaders: [
        { text: "#", value: "sl_no" },
        {
          text: "Part Name",
          value: "master_name",
        },
        {
          text: "Created On",
          value: "created_on",
        },
        { text: "Actions", value: "Actions" },
      ],
      StoreObj: {},
    };
  },
  watch: {
    master_status(val) {
      this.search = '';
      this.GetAllAdditionalPartsMethod(val);
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllAdditionalPartsMethod(this.master_status);
  },
  methods: {
    ActivateDeactivateAdditionalPartDialogEmit(Toggle) {
      this.ActivateDeactivateAdditionalPartDialog = false;
      if (Toggle == 2) {
        this.GetAllAdditionalPartsMethod(this.master_status);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.AddEditAdditionalPartDialog = true;
      } else if (action == "ACTION") {
        this.ActivateDeactivateAdditionalPartDialog = true;
      }
    },
    AddEditAdditionalPartDialogEmit(Toggle) {
      this.AddEditAdditionalPartDialog = false;
      if (Toggle == 2) {
        this.GetAllAdditionalPartsMethod(this.master_status);
      }
    },
  },
};
</script>
