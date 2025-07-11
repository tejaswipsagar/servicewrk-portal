<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog persistent width="800px" :value="dialogFleetAvailable">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">
          Product Fleets Available (<span class="xsmallFontSize mr-6">{{
            this.StoreObj.service_center_name
          }}</span
          >)
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogFleetemit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-data-table
            dense
            :headers="headers"
            :items="AvailableFleetList"
            :loading="loading"
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
            :items-per-page="100"
          >
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllAvailableProductFleet } from "@/mixins/Locations/GetAllAvailableProductFleet.js";
export default {
  props: {
    StoreObj: Object,
    dialogFleetAvailable: Boolean,
  },
  mixins: [GetAllAvailableProductFleet],
  components: {
    Snackbar,
  },
  data: () => ({
    loading: false,
    SnackBarComponent: {},
    AvailableFleetList: [],
    headers: [
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Serial Number", value: "setting_name" },
      { text: "Description", value: "setting_description" },
    ],
  }),
  mounted() {
    this.GetAvailableFleetMethod(this.StoreObj.service_center_id);
  },
  watch: {
    dialogFleetAvailable(val) {
      if (val == true) {
        this.GetAvailableFleetMethod(this.StoreObj.service_center_id);
      }
    },
  },
  methods: {
    dialogFleetemit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
