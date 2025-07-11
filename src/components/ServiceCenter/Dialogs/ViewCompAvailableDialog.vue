<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog persistent width="800px" :value="dialogCompAvailable">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">
          Components Available (<span class="xsmallFontSize mr-6">{{
            this.StoreObj.service_center_name
          }}</span
          >)
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="FontSize mediumWidth mt-6"
        ></v-text-field>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogemit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-data-table
            dense
            :search="search"
            :headers="headers"
            :items="AvailableCompLocList"
            :loading="loading"
            fixed-header
            :height="tableHeight"
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
            :items-per-page="100"
          >
            <template v-slot:[`item.component_name`]="{ item }">
              <div class="FontSize">{{ item.component_name }}</div>
            </template>
            <template v-slot:[`item.component_product_code`]="{ item }">
              <div class="FontSize" v-if="item.component_product_code != undefined">
                {{ item.component_product_code }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.components_in_stock`]="{ item }">
              <div class="FontSize">{{ item.components_in_stock }}</div>
            </template>
            <template v-slot:[`item.transacted_at`]="{ item }">
              <span class="FontSize">{{
                new Date(item.transacted_at * 1000).toLocaleDateString('en-GB')
              }}</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllAvailableCompLoc } from "@/mixins/Locations/GetAllAvailableCompLoc.js";
export default {
  props: {
    StoreObj: Object,
    dialogCompAvailable: Boolean,
  },
  mixins: [GetAllAvailableCompLoc],
  components: {
    Snackbar,
  },
  data: () => ({
    search: "",
    tableHeight: 0,
    loading: false,
    SnackBarComponent: {},
    AvailableCompLocList: [],
    headers: [
      { text: "Component", value: "component_name" },
      { text: "Component Code", value: "component_product_code" },
      { text: "Component In Stock", value: "components_in_stock" },
      { text: "Transacted At", value: "transacted_at" },
    ],
  }),
  mounted() {},
  watch: {
    dialogCompAvailable(val) {
      if (val == true) {
        this.GetAvailableCompLocMethod(this.StoreObj.service_center_id);
        this.tableHeight = window.innerHeight - 300;
      }
    },
  },
  methods: {
    dialogemit(Toggle) {
      this.search = "";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
