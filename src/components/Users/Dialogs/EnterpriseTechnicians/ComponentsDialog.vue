<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog persistent width="800px" :value="dialogComponentsAvailable">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">
          Components Available at
          <span>{{ StoreObj.user_name }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogComponentsAvailableEmit((Toggle = 1))"
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
            :items="ListAllAvailableComponentsFromTechnician"
            :loading="loading"
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
            :items-per-page="100"
            class="TableValFontsize"
          >
            <template v-slot:[`item.component_code`]="{ item }">
              <div>
                {{ item.component_code || item.component_product_code || "-" }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllAvailableComponentsFromTech } from "@/mixins/Users/GetAvailableComponentsForTech.js";
export default {
  props: {
    StoreObj: Object,
    dialogComponentsAvailable: Boolean,
  },
  mixins: [GetAllAvailableComponentsFromTech],
  components: {
    Snackbar,
  },
  data: () => ({
    loading: false,
    SnackBarComponent: {},
    ListAllAvailableComponentsFromTechnician: [],
    headers: [
      { text: "Component Name", value: "component_name" },
      { text: "Component Code", value: "component_code" },
      { text: "Component Stock", value: "components_in_stock" },
    ],
  }),
  mounted() {},
  watch: {
    dialogComponentsAvailable(val) {
      if (val == true) {
        this.ListAllAvailableComponentsFromTechnicianMethod(
          this.StoreObj.user_id
        );
      }
    },
  },
  methods: {
    dialogComponentsAvailableEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
