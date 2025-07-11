<template>
  <div>
    <Overlay :overlay="overlay" />
    <AddEditTerritoryCategory
      :StoreObj="StoreObj"
      :AddEditTerritoryCategoryDialog="AddEditTerritoryCategoryDialog"
      @clicked="AddEditTerritoryCategoryDialogEmit"
    />
    <ActivateDeactivateTerritoryCategory
      :StoreObj="StoreObj"
      :ActivateDeactivateTerritoryCategoryDialog="
        ActivateDeactivateTerritoryCategoryDialog
      "
      @clicked="ActivateDeactivateTerritoryCategoryDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Settings
          <span class="PrimaryFontColorSmall">/ Territory Categories</span>
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
                (AddEditTerritoryCategoryDialog = true),
                  (StoreObj.action = 'CREATE')
              "
              v-on="on"
              v-bind="attrs"
              class="primary white--text ml-2 mr-2"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Create Territory Category</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          fixed-header
          :search="search"
          :height="TableHeight"
          :items-per-page="100"
          :no-data-text="noDataText"
          :headers="additionalPartHeaders"
          :items="GetAllTerritoryCategoryList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAllTerritoryCategoryList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.master_name`]="{ item }">
            <div class="FontSize">{{ item.master_name }}</div>
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            <div class="FontSize">
              {{ new Date(item.created_on * 1000).toLocaleString("en-GB") }}
            </div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary" v-if="master_status == 'ACTIVE'">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  @click="checkItem(item, 'EDIT')"
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
import { GetAllTerritoryCategories } from "@/mixins/MastersSetting/GetAllTerritoryCategories.js";
import Vue from "vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import AddEditTerritoryCategory from "@/components/MasterSettings/Dialogs/TerritoryCategories/AddEditTerritoryCategory.vue";
import ActivateDeactivateTerritoryCategory from "@/components/MasterSettings/Dialogs/TerritoryCategories/ActivateDeactivateTerritoryCategory.vue";
import Croppa from "vue-croppa";
export default {
  components: {
    Overlay,
    AddEditTerritoryCategory,
    ActivateDeactivateTerritoryCategory,
  },
  mixins: [GetAllTerritoryCategories],
  data() {
    return {
      TableHeight: 0,
      search: "",
      master_status: "ACTIVE",
      AddEditTerritoryCategoryDialog: false,
      ActivateDeactivateTerritoryCategoryDialog: false,
      GetAllTerritoryCategoryList: [],
      statusItems: ["ACTIVE", "INACTIVE"],
      additionalPartHeaders: [
        { text: "#", value: "sl_no" },
        {
          text: "Territory Category",
          value: "territory_name",
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
      this.GetAllTerritoryCategoryMethod(val);
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllTerritoryCategoryMethod(this.master_status);
  },
  methods: {
    ActivateDeactivateTerritoryCategoryDialogEmit(Toggle) {
      this.ActivateDeactivateTerritoryCategoryDialog = false;
      if (Toggle == 2) {
        this.GetAllTerritoryCategoryMethod(this.master_status);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.AddEditTerritoryCategoryDialog = true;
      } else if (action == "ACTION") {
        this.ActivateDeactivateTerritoryCategoryDialog = true;
      }
    },
    AddEditTerritoryCategoryDialogEmit(Toggle) {
      this.AddEditTerritoryCategoryDialog = false;
      if (Toggle == 2) {
        this.GetAllTerritoryCategoryMethod(this.master_status);
      }
    },
  },
};
</script>
