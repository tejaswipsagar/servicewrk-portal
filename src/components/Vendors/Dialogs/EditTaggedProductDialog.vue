<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="EditTaggedProductDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Edit Mapped Component/Product ({{ StoreObj.component_name }})
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditTaggedProductDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-form ref="form">
            <v-text-field
              v-model="taggedComponentName"
              :rules="[(v) => !!v || 'Required']"
              dense
              outlined
              label="Vendor Component Name *"
            ></v-text-field>
            <v-text-field
              v-model="vendorCompCode"
              :rules="[(v) => !!v || 'Required']"
              dense
              outlined
              label="Vendor Component Code *"
            ></v-text-field>
            <v-text-field
              v-model="vendorSerialNum"
              :rules="[(v) => !!v || 'Required']"
              dense
              outlined
              label="Vendor Serial Number *"
            ></v-text-field>
            <v-text-field
              v-model="taggedProductPrice"
              :rules="[(v) => !!v || 'Required']"
              dense
              outlined
              label="Cost *"
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="btnLoading"
            dense
            color="primary"
            @click="EditTaggedProductMethod()"
            >Update<v-icon small class="ml-2">mdi-pencil</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { editTaggedProductOrComponentOfVendor } from "@/graphql/mutations.js";

export default {
  props: { EditTaggedProductDialog: Boolean, StoreObj: Object },
  components: {
    Snackbar,
  },
  data: () => ({
    btnLoader: false,
    SnackBarComponent: {},
    btnLoading: false,
    taggedComponentName: "",
    vendorSerialNum: "",
    vendorCompCode: "",
    taggedProductPrice: null,
    renderComp: true,
  }),

  watch: {
    EditTaggedProductDialog(val) {
      if (val) {
        this.taggedComponentName = this.StoreObj.vendor_component_name || "-";
        this.taggedProductPrice = this.StoreObj.price || "-";
        this.vendorCompCode = this.StoreObj.vendor_component_code || "-";
        this.vendorSerialNum =
          this.StoreObj.vendor_component_serial_number || "-";
      }
    },
  },

  methods: {
    async EditTaggedProductMethod() {
      if (this.$refs.form.validate()) {
        try {
          this.btnLoading = true;
          const result = await API.graphql(
            graphqlOperation(editTaggedProductOrComponentOfVendor, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                user_id: this.$store.getters.get_current_user_details.user_id,
                tagged_id: this.StoreObj.tagged_id,
                vendor_component_name:
                  this.StoreObj.vendor_component_name ===
                  this.taggedComponentName.trim(" ")
                    ? undefined
                    : this.taggedComponentName,
                vendor_component_code:
                  this.StoreObj.vendor_component_code ===
                  this.vendorCompCode.trim(" ")
                    ? undefined
                    : this.vendorCompCode,
                vendor_component_serial_number:
                  this.StoreObj.vendor_component_serial_number ===
                  this.vendorSerialNum.trim(" ")
                    ? undefined
                    : this.vendorSerialNum.trim(" "),
                price:
                  this.StoreObj.price === parseFloat(this.taggedProductPrice)
                    ? undefined
                    : parseFloat(this.taggedProductPrice),
              },
            })
          );
          const response = JSON.parse(
            result.data.editTaggedProductOrComponentOfVendor
          );
          if (response.status === "SUCCESS") {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.status_message,
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
            this.btnLoading = false;
            this.EditTaggedProductDialogEmit(2);
          }
        } catch (error) {
          this.btnLoading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = false;
          this.$nextTick(() => {
            this.renderComp = true;
          });
        }
      }
    },
    EditTaggedProductDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
