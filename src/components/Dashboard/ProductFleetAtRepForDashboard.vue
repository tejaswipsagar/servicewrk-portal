<template>
  <div>
    <v-dialog :value="DialogProductFleetAtRep" persistent max-width="80%">
      <v-card>
        <v-toolbar elevation="0" dark dense color="primary">
          <div>Product Fleet</div>
          <v-spacer />
          <v-btn @click="DialogProductFleetAtRepEmit()" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            :headers="headers"
            hide-default-footer
            :items-per-page="100"
            :items="
              StoreObj.action == 'ACTIVE_PRODUCT_FLEET'
                ? StoreObj.repStock
                : StoreObj.customer
            "
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObj: Object,
    DialogProductFleetAtRep: Boolean,
  },
  data: () => ({
    headers: [
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Serial Number", value: "setting_name" },
      { text: "Fleet Status", value: "organization_products_fleet_status" },
    ],
  }),
  methods: {
    DialogProductFleetAtRepEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
