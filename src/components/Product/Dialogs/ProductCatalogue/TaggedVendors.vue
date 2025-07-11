<template>
  <div>
    <v-dialog
      persistent
      width="1000px"
      overlay-opacity="0.8"
      v-model="TaggedVendorsToProductDialog"
    >
      <v-card>
        <v-toolbar dense color="primary">
          <div class="font-weight-bold ml-4 white--text">
            Tagged Vendors<span class="ml-2"
              >( {{ StoreObj.service_name }} )</span
            >
          </div>
          <v-spacer />
          <v-btn
            icon
            small
            dark
            @click.stop="TaggedVendorsToProductDialogEmit()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-3">
          <v-data-table
            dense
            :headers="headers"
            :items="VendorsListArray"
            :loading="TableLoading"
            class="TableValFontsize"
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div>{{ VendorsListArray.indexOf(item) + 1 }}</div>
            </template>
            <template v-slot:[`item.tagged_on`]="{ item }">
              <div>{{ new Date(item.tagged_on * 1000).toLocaleString() }}</div>
            </template></v-data-table
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GetAllTaggedVendors } from "@/mixins/Product/ListVendorTagged.js";
export default {
  props: {
    TaggedVendorsToProductDialog: Boolean,
    StoreObj: Object,
  },
  mixins: [GetAllTaggedVendors],
  data: () => ({
    TableLoading: false,
    VendorsListArray: [],
    headers: [
      {
        text: "Sl.no",
        value: "sl_no",
      },
      {
        text: "Name",
        value: "venore_name",
      },
      {
        text: "Email",
        value: "vendor_email_id",
      },
      {
        text: "Contact No.",
        value: "vendor_primary_contact_number",
      },
      { text: "Tagged On", value: "tagged_on" },
      {
        text: "Pincode",
        value: "vendor_pincode",
      },
    ],
  }),
  watch: {
    async TaggedVendorsToProductDialog(val) {
      if (val == true) {
        console.log("this.StoreObj", this.StoreObj);
        this.VendorsListArray = await this.GetAllTaggedVendorsMethod(
          this.StoreObj.category_id,
          this.StoreObj.service_id
        );
      }
    },
  },
  methods: {
    TaggedVendorsToProductDialogEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
