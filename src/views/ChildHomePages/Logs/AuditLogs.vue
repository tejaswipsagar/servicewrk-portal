<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-card class="ma-1" elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Audit Logs(Last 100)</div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          class="mt-9 FontSize field_label_size field_height maxWidth"
          label="Log Type"
          v-model="ActionType"
          :items="ActionTypeItems"
          item-text="text"
          item-value="value"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-9 ml-2 FontSize field_label_size field_height maxWidth"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :height="TableHeight"
          :search="search"
          :headers="headers"
          :items="GetAllPORTALLogs"
          :no-data-text="noDataText"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          hide-default-footer
        >
          <template v-slot:[`item.log_action`]="{ item }">
            <div class="FontSize">
              {{ item.log_action }}
            </div>
          </template>
          <template v-slot:[`item.log_type`]="{ item }">
            <div class="FontSize" v-if="item.log_type != undefined">
              {{ item.log_type.replaceAll("_", " ") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.logged_by`]="{ item }">
            <div
              class="text-capitalize FontSize"
              v-if="item.logged_by != undefined && item.logged_by != ''"
            >
              {{ item.logged_by.replaceAll("_", " ") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.logged_on`]="{ item }">
            <div class="FontSize">
              {{ new Date(item.logged_on * 1000).toLocaleDateString("en-GB") }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import { GetAllPORTALLogs } from "@/mixins/Logs/GetAllPORTALLogs.js";
export default {
  mixins: [GetAllPORTALLogs],
  components: {
    Overlay,
  },
  data: () => ({
    search: "",
    noDataText: "",
    ActionType: "ALL",
    sortBy: "logged_on",
    overlay: false,
    sortDesc: true,
    TableHeight: 0,
    GetAllPORTALLogs: [],
    GetAllPORTALLogsFilter: [],
    headers: [
      { text: "Log Action", value: "log_action", width: "55%" },
      { text: "Log Type", value: "log_type" },
      { text: "Logged By", value: "logged_by" },
      { text: "Logged On", value: "logged_on" },
    ],
    ActionTypeItems: [
      { text: "ALL", value: "ALL" },
      { text: "USER MANAGEMENT", value: "USER_MANAGEMENT" },
      { text: "SERVICE MANAGEMENT", value: "SERVICE_MANAGEMENT" },
      { text: "COMPONENT MANAGEMENT", value: "COMPONENT_MANAGEMENT" },
      { text: "SERVICE CENTER MANAGEMENT", value: "SERVICE_CENTER_MANAGEMENT" },
      { text: "SERVICE TYPE MANAGEMENT", value: "SERVICE_TYPE_MANAGEMENT" },
      { text: "TICKET MANAGEMENT", value: "TICKET_MANAGEMENT" },
      { text: "REPRESENTATIVE MANAGEMENT", value: "REPRESENTATIVE_MANAGEMENT" },
      { text: "TERRITORY MANAGEMENT", value: "TERRITORY_MANAGEMENT" },
      { text: "SETTING MANAGEMENT", value: "SETTING_MANAGEMENT" },
      { text: "CUSTOMER MANAGEMENT", value: "CUSTOMER_MANAGEMENT" },
    ],
  }),
  watch: {
    ActionType(val) {
      if (val == "ALL") {
        this.GetAllPORTALLogs = this.GetAllPORTALLogsFilter;
      } else {
        this.GetAllPORTALLogs = this.GetAllPORTALLogsFilter.filter(
          (item) => item.log_type == val
        );
      }
      if (this.GetAllPORTALLogs.length == 0) {
        this.noDataText = `No logs Found With Log Type ${val.replaceAll(
          "_",
          " "
        )}`;
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllPORTALLogsMethod();
  },
};
</script>

<style></style>
