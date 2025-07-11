<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="EditQtyDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Edit Quantity</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditQtyDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-text-field
            type="number"
            v-model="quantity"
            dense
            outlined
            label="Quantity"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="EditMethod()" color="primary"
            >Edit<v-icon size="15">mdi-pencil</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: { EditQtyDialog: Boolean, StoreObj: Object },
  components: {
    Snackbar,
  },
  data: () => ({
    quantity: "",
    SnackBarComponent: {},
  }),
  watch: {
    EditQtyDialog(val) {
      if (val) {
        this.quantity = this.StoreObj.quantity;
      }
    },
  },
  methods: {
    EditMethod() {
      if (this.quantity !== "") {
        this.StoreObj = { ...this.StoreObj, quantity: this.quantity };
        console.log("UPDATED_STOREOBJ", this.StoreObj);
        this.EditQtyDialogEmit(2);
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly fill the field!",
        };
      }
    },
    EditQtyDialogEmit(Toggle) {
      this.$emit("clicked", Toggle, this.StoreObj);
    },
  },
};
</script>
