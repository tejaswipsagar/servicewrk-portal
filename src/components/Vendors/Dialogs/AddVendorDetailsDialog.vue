<template>
  <div>
    <v-dialog v-model="AddVendorDetailsDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Add Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="addVendorDetailsEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-form ref="form">
            <v-text-field
              v-model="vendorCompName"
              label="Vendor Component Name*"
              dense
              outlined
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
            />
            <v-text-field
              v-model="vendorCompCode"
              label="Vendor Component Code*"
              dense
              outlined
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
            />
            <v-text-field
              v-model="vendorSerialNum"
              label="Vendor Serial Number*"
              dense
              outlined
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
            />
            <v-text-field
              v-model="vendorCompCost"
              label="Cost*"
              dense
              outlined
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn small color="primary" @click="addEditVendorDetailsMethod()">{{
            StoreObj.action === "EDIT" ? "Update" : "Add"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: { AddVendorDetailsDialog: Boolean, StoreObj: Object },
  data: () => ({
    vendorCompName: "",
    vendorCompCode: "",
    vendorSerialNum: "",
    vendorCompCost: 0,
  }),

  watch: {
    AddVendorDetailsDialog(val) {
      if (val) {
        if (this.StoreObj.action === "EDIT") {
          this.vendorCompName = this.StoreObj.vendor_component_name;
          this.vendorCompCode = this.StoreObj.vendor_component_code;
          this.vendorSerialNum = this.StoreObj.vendor_serial_number;
          this.vendorCompCost = this.StoreObj.vendor_component_price;
        }
      }
    },
  },
  methods: {
    addEditVendorDetailsMethod() {
      if (this.$refs.form.validate()) {
        const obj = {
          vendor_component_name: this.vendorCompName,
          vendor_component_code: this.vendorCompCode,
          vendor_serial_number: this.vendorSerialNum,
          vendor_component_price: this.vendorCompCost,
        };
        const addedOrEdited =
          this.StoreObj.action === "EDIT"
            ? { type: "Edited", index: this.StoreObj.index }
            : { type: "Added" };
        this.addVendorDetailsEmit(2, obj, addedOrEdited);
      }
    },
    addVendorDetailsEmit(Toggle, obj, addedOrEdited) {
      this.$emit("clicked", Toggle, obj, addedOrEdited);
      this.$refs.form.reset();
    },
  },
};
</script>
