<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-dialog
      :value="taggedTerritoriesDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="60%"
    >
      <v-card>
        <v-toolbar elevation="0" dense color="primary">
          <v-icon small dark class="mr-2">mdi-map-marker-plus</v-icon>
          <strong class="white--text"
            >Tagged Territories to {{ this.StoreObj.user_name }}</strong
          >
          <v-spacer />
          <v-btn icon class="white--text">
            <v-icon small @click="closeEmmit1((Toggle = 1))"> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            :headers="header"
            :items="GetAllTaggedTerritoriesList"
            :loading="loading"
          >
            <template v-slot:[`item.territory_name`]="{ item }">
              <div class="FontSize" v-if="item.territory_name != undefined">
                {{ item.territory_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.territory_ticket_prefix`]="{ item }">
              <div
                class="FontSize"
                v-if="item.territory_ticket_prefix != undefined"
              >
                {{ item.territory_ticket_prefix }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.territory_type`]="{ item }">
              <div class="FontSize" v-if="item.territory_type != undefined">
                {{ item.territory_type.replaceAll("_", " ") }}
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import { GetAllTaggedTerritories } from "@/mixins/Users/GetAllTaggedTerritories.js";
export default {
  components: {
    Overlay,
  },
  props: {
    StoreObj: Object,
    taggedTerritoriesDialog: Boolean,
  },
  mixins: [GetAllTaggedTerritories],
  data: () => ({
    overlay: false,
    loading: false,
    GetAllTaggedTerritoriesList: [],
    header: [
      { text: " Territory Names", value: "territory_name" },
      { text: "Territory Prefix", value: "territory_ticket_prefix" },
      { text: "Territory Type", value: "territory_type" },
    ],
  }),
  watch: {
    taggedTerritoriesDialog(val) {
      if (val == true) {
        this.GetAllTaggedTerritoriesList = [];
        this.GetAllTaggedTerritoriesMethod(this.StoreObj.territory_ids);
      }
    },
  },
  methods: {
    closeEmmit1(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
