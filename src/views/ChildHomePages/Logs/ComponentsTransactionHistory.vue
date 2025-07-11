<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-card class="ma-1" elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="8" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Component Transaction History</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="4" xs="12">
          <v-toolbar dense class="elevation-0">
            <v-text-field
              dense
              outlined
              label="Search"
              v-model="search"
              class="mt-9 ml-2 FontSize"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="headers"
          :items-per-page="100"
          :height="TableHeight"
          :no-data-text="noDataText"
          :items="GetComponentHistoryList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template v-slot:[`item.component_name`]="{ item }">
            <div class="FontSize" v-if="item.component_name != undefined">
              {{ item.component_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_center_name`]="{ item }">
            <div class="FontSize" v-if="item.service_center_name != undefined">
              {{ item.service_center_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.transaction_type`]="{ item }">
            <div
              v-if="item.transaction_type == 'PROCURED'"
              class="FontSize teal--text"
            >
              {{ item.transaction_type }}
            </div>
            <div
              v-else-if="item.transaction_type == 'TRANSFERED'"
              class="FontSize primary--text"
            >
              {{ item.transaction_type }}
            </div>
            <div
              v-else-if="
                item.transaction_type == 'TICKET_COMPONENTS_DISPATCHED'
              "
              class="FontSize blue--text"
            >
              {{ item.transaction_type.replaceAll("_", " ") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.transacted_at`]="{ item }">
            <div class="FontSize" v-if="item.transacted_at != undefined">
              {{ new Date(item.transacted_at * 1000).toLocaleString("en-GB") }}
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import { GetAllComponentHistory } from "@/mixins/Logs/GetAllComponentHistory.js";
export default {
  mixins: [GetAllComponentHistory],
  components: {
    Overlay,
  },
  data: () => ({
    search: "",
    noDataText: "",
    StoreObj: {},
    TableHeight: 0,
    overlay: false,
    isLoading: false,
    GetComponentHistoryList: [],
    headers: [
      { text: "Component Name", value: "component_name" },
      { text: "Service Center Name", value: "service_center_name" },
      { text: "Transacted At", value: "transacted_at" },
      { text: "Transaction Type", value: "transaction_type" },
    ],
  }),
  watch: {},
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetComponentHistoryMethod();
  },
  methods: {},
};
</script>
