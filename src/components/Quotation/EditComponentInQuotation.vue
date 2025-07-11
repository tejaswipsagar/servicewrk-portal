<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogEditComponentInQuotation" persistent width="400">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-pencil-plus</v-icon> Edit
            <span>{{ this.StoreObjNew.product_type }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogEditComponentInQuotationEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <v-form ref="form">
            <v-row no-gutters>
              <v-col
                v-if="
                  StoreObjNew.product_type === 'COMPONENT' ||
                  StoreObjNew.product_type === 'PRODUCT'
                "
                cols="12"
                :md="StoreObjNew.product_type == 'COMPONENT' ? 6 : 12"
                sm="12"
                xs="12"
              >
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  :label="
                    StoreObjNew.product_type == 'LABOUR'
                      ? 'Service Type'
                      : 'Component'
                  "
                  v-model="component_name"
                  readonly
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="
                   Product Name
                  "
                  v-model="productName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col v-if="StoreObjNew.product_type === 'LABOUR'">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="
                   Service Type Name
                  "
                  v-model="serviceTypeName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col v-if="StoreObjNew.product_type === 'OTHERS'">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="
                   Service Type Name
                  "
                  v-model="component_name"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                :md="StoreObjNew.product_type == 'COMPONENT' ? 6 : 12"
                sm="12"
                xs="12"
                v-if="StoreObjNew.product_type == 'COMPONENT'"
              >
                <v-text-field
                  dense
                  outlined
                  class="FontSize ml-2"
                  label="Component Code"
                  v-model="component_code"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="4" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Price"
                  v-model="price"
                  type="number"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <v-text-field
                  v-if="StoreObjNew.product_type !== 'OTHERS'"
                  dense
                  outlined
                  class="FontSize ml-2"
                  label="Quantity"
                  v-model="quantity"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) => v >= 0 || 'Quantity must be a positive number',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <v-text-field
                  dense
                  outlined
                  class="FontSize ml-2"
                  label="Tax %"
                  v-model="gst"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" xs="12" sm="12">
                <v-text-field
                  dense
                  outlined
                  class="FontSize ml-2"
                  label="Discount %"
                  v-model="discount"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12" xs="12">
                <v-text-field
                  outlined
                  dense
                  label="Total"
                  v-model="per_component_total_amount"
                  class="FontSize"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading_btn"
            @click="editComponentInQuotationMethod()"
          >
            <v-icon small>mdi-check-decagram-outline</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObjNew: Object,
    dialogEditComponentInQuotation: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    renderComp: true,
    loading_btn: false,
    component_name: "",
    component_code: "",
    product_type: "",
    unique_object_id: "",
    price: null,
    gst: null,
    discount: null,
    per_component_total_amount: null,
    quantity: 1,
    productName: "",
    serviceTypeName: "",
    SnackBarComponent: {},
  }),
  watch: {
    dialogEditComponentInQuotation(val) {
      if (val == true) {
        this.component_name = this.StoreObjNew.component_name;
        this.component_code =
          this.StoreObjNew.product_type == "COMPONENT"
            ? this.StoreObjNew.component_code
            : "";
        this.component_id = this.StoreObjNew.component_id;
        this.price = this.StoreObjNew.price;
        this.gst = this.StoreObjNew.gst;
        this.discount = this.StoreObjNew.discount;
        this.quantity = this.StoreObjNew.quantity;
        this.per_component_total_amount =
          this.StoreObjNew.per_component_total_amount;
        this.unique_object_id = this.StoreObjNew.unique_object_id;
        this.product_type = this.StoreObjNew.product_type;
        this.category_id = this.StoreObjNew.category_id;
        this.service_id = this.StoreObjNew.service_id;
        this.productName = this.StoreObjNew.product_name;
        this.serviceTypeName = this.StoreObjNew.service_type_name;
      }
    },
    price(val) {
      if (val) {
        const price = parseFloat(this.price);
        const quantity = parseFloat(this.quantity) || 1;
        const gst = parseFloat(this.gst) || 0;
        const discount = parseFloat(this.discount) || 0;

        if (this.StoreObjNew.product_type === "OTHERS") {
          let discountedPrice = price - (price * discount) / 100;
          let totalProductPrice =
            discountedPrice + (discountedPrice * gst) / 100;
          this.per_component_total_amount = totalProductPrice.toFixed(2);
        } else {
          let priceWithQty = price * quantity;
          let discountedPrice = priceWithQty - (priceWithQty * discount) / 100;
          let totalProductPrice =
            discountedPrice + (discountedPrice * gst) / 100;
          this.per_component_total_amount = totalProductPrice.toFixed(2);
        }
      }
    },
    gst(val) {
      if (val) {
        const price = parseFloat(this.price);
        const quantity = parseFloat(this.quantity) || 1;
        const gst = parseFloat(this.gst) || 0;
        const discount = parseFloat(this.discount) || 0;

        if (this.StoreObjNew.product_type === "OTHERS") {
          let discountedPrice = price - (price * discount) / 100;
          let totalProductPrice =
            discountedPrice + (discountedPrice * gst) / 100;
          this.per_component_total_amount = totalProductPrice.toFixed(2);
        } else {
          let priceWithQty = price * quantity;
          let discountedPrice = priceWithQty - (priceWithQty * discount) / 100;
          let totalProductPrice =
            discountedPrice + (discountedPrice * gst) / 100;
          this.per_component_total_amount = totalProductPrice.toFixed(2);
        }
      }
    },

    discount(val) {
      if (val < 0) {
        this.discount = 0;
      }
      if (this.StoreObjNew.product_type === "OTHERS") {
        let basePrice = parseFloat(this.price);
        let discountedPrice =
          basePrice - basePrice * (parseFloat(this.discount) / 100);
        let totalProductPrice =
          discountedPrice + discountedPrice * (parseFloat(this.gst) / 100);
        this.per_component_total_amount = totalProductPrice.toFixed(2);
      } else {
        let priceWithQty = parseFloat(this.price) * parseFloat(this.quantity);
        let discountedPrice =
          priceWithQty - priceWithQty * (parseFloat(this.discount) / 100);
        let totalProductPrice =
          discountedPrice + discountedPrice * (parseFloat(this.gst) / 100);
        this.per_component_total_amount = totalProductPrice.toFixed(2);
      }
    },

    quantity(val) {
      if (val <= 0) {
        this.quantity = 1;
        return;
      }
      const price = parseFloat(this.price);
      const quantity = parseFloat(this.quantity);
      const gst = parseFloat(this.gst) || 0;
      const discount = parseFloat(this.discount) || 0;
      if (this.StoreObjNew.product_type === "OTHERS") {
        let discountedPrice = price - (price * discount) / 100;
        let totalProductPrice = discountedPrice + (discountedPrice * gst) / 100;
        this.per_component_total_amount = totalProductPrice.toFixed(2);
      } else {
        let priceWithQty = price * quantity;
        let discountedPrice = priceWithQty - (priceWithQty * discount) / 100;
        let totalProductPrice = discountedPrice + (discountedPrice * gst) / 100;
        this.per_component_total_amount = totalProductPrice.toFixed(2);
      }
    },
  },
  methods: {
    async editComponentInQuotationMethod() {
      if (this.$refs.form.validate()) {
        let obj = {
          ...this.StoreObjNew,
          price: parseFloat(this.price),
          gst: parseFloat(this.gst),
          discount: parseFloat(this.discount) || undefined,
          quantity: parseFloat(this.quantity),
          per_component_total_amount: parseFloat(
            this.per_component_total_amount
          ),
        };
        console.log("CHECK_OUTPUT", obj);
        this.dialogEditComponentInQuotationEmit(2, obj);
      } else {
        this.renderComp = false;
        this.isSearching = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all fields with correct value!",
          };
          this.renderComp = true;
        });
      }
    },
    dialogEditComponentInQuotationEmit(Toggle, obj) {
      this.$emit("clicked", Toggle, obj);
    },
  },
};
</script>
