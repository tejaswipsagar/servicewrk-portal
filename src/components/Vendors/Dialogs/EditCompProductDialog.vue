<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="EditCompProduDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Edit</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditCompProduDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-text-field
            v-if="EditStoreObj.type === 'COMPONENT'"
            v-model="componentName"
            dense
            outlined
            label="Component Name"
          ></v-text-field>
          <v-text-field
            v-if="EditStoreObj.type === 'PRODUCT'"
            v-model="productName"
            dense
            outlined
            label="Product Name"
          ></v-text-field>
          <v-text-field
            v-model="price"
            dense
            outlined
            label="Price"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn dense color="primary" @click="UpdateMethod()"
            >Update<v-icon>mdi-bookmark</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    EditCompProduDialog: Boolean,
    EditStoreObj: Object,
  },

  data: () => ({
    componentName: "",
    price: 0,
    productName: "",
  }),

  watch: {
    EditCompProduDialog(val) {
      if (val) {
        if (this.EditStoreObj.type === "COMPONENT") {
          this.price = this.EditStoreObj.component_price || "";
          this.componentName = this.EditStoreObj.component_name || "";
        } else {
          this.price = this.EditStoreObj.service_price || "";
          this.productName = this.EditStoreObj.service_name || "";
        }
      }
    },
  },

  methods: {
    UpdateMethod() {
      this;
      if (this.EditStoreObj.type === "COMPONENT") {
        this.EditStoreObj.component_name = this.componentName;
        this.EditStoreObj.component_price = this.price;
      } else {
        this.EditStoreObj.service_name = this.productName;
        this.EditStoreObj.service_price = this.price;
      }
      this.EditCompProduDialogEmit(2, this.EditStoreObj);
    },
    EditCompProduDialogEmit(Toggle, Obj) {
      this.$emit("clicked", Toggle, Obj);
    },
  },
};
</script>
