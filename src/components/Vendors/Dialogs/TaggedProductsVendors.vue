<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <dialogActivateInactivateVendorDialog
      :dialogActivateInactivateVendorDialog="
        dialogActivateInactivateVendorDialog
      "
      :ActionObj="ActionObj"
      @clicked="ActivateInactivateVendorComponentEmit"
    />
    <EditTaggedProduct
      :EditTaggedProductDialog="editTaggedProductDialog"
      :StoreObj="StoreObj"
      @clicked="EditTaggedProductDialogEmit"
    />
    <div v-if="currentView === 'TAGGED_PAGE'">
      <v-card tile class="elevation-0">
        <v-toolbar dense tile class="black--text elevation-0">
          <div class="font-weight-bold">
            {{
              ActionType === "ACTIVE"
                ? "Mapped"
                : ActionType === "INACTIVE"
                ? "Deactivated"
                : "Unmapped"
            }}
            Compoenents/Products
            <span class="red--text ml-2">( {{ StoreObj.vendor_name }} )</span>
          </div>
          <v-spacer />
          <v-select
            background-color="white"
            dense
            outlined
            v-model="ActionType"
            :items="ActionType_Items"
            label="Status"
            class="mt-7 mr-3 maxWidthSmall FontSize"
          ></v-select>
          <v-select
            background-color="white"
            dense
            outlined
            v-model="Select_type"
            :items="Select_Type_Items"
            label="Type"
            class="mt-7 mr-3 maxWidthSmall FontSize"
          ></v-select>
          <v-btn color="primary" small @click.stop="TaggedProductsDialogEmit(1)"
            ><v-icon small>mdi-arrow-left</v-icon>Back</v-btn
          >
        </v-toolbar>
      </v-card>
      <v-data-table
        dense
        :headers="Select_type == 'COMPONENT' ? ComponentHeaders : headers"
        class="elevation-0 mt-4 TableValFontsize"
        :loading="Tableloading"
        :items="TaggedProductsVentorList"
        :no-data-text="noDataText"
      >
        <template v-slot:[`item.component_code`]="{ item }">
          <div>
            {{ item.component_code || "-" }}
          </div>
        </template>
        <template v-slot:[`item.vendor_component_code`]="{ item }">
          <div>
            {{ item.vendor_component_code || "-" }}
          </div>
        </template>
        <template v-slot:[`item.vendor_component_serial_number`]="{ item }">
          <div>
            {{ item.vendor_component_serial_number || "-" }}
          </div>
        </template>
        <template v-slot:[`item.price`]="{ item }">
          <div>
            {{ item.price || "-" }}
          </div>
        </template>
        <template v-slot:[`item.modified_on`]="{ item }">
          <div>{{ FormatedDateTime(item.modified_on) }}</div>
        </template>
        <template v-slot:[`item.actions`]="{ item, index }">
          <v-menu right bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon color="primary">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense nav>
              <v-list-item-group color="primary">
                <v-list-item
                  v-if="item.tagged_product_status === 'ACTIVE'"
                  @click="EditTaggedProductsMethod(item, index)"
                >
                  <v-icon color="primary" small class="mr-2">mdi-pencil</v-icon>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <!-- <v-list-item>
                  <v-icon
                    small
                    :color="
                      item.tagged_product_status === 'ACTIVE' ? 'red' : 'green'
                    "
                  >
                    {{
                      item.tagged_product_status === "ACTIVE"
                        ? "Deactivate"
                        : "Activate"
                    }}</v-icon
                  >
                </v-list-item> -->
                <v-list-item
                  @click.stop="checkItem(item)"
                  v-if="item.tagged_product_status !== 'UNMAPPED'"
                >
                  <v-icon
                    small
                    :color="
                      item.tagged_product_status === 'ACTIVE' ? 'red' : 'green'
                    "
                  >
                    {{
                      item.tagged_product_status === "ACTIVE"
                        ? "mdi-close"
                        : "mdi-check"
                    }}
                  </v-icon>
                  <v-list-item-title class="ml-3">{{
                    item.tagged_product_status == "ACTIVE"
                      ? "Deactivate"
                      : "Activate"
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="item.tagged_product_status === 'UNMAPPED'"
                  @click="mapVendorMethod(item)"
                >
                  <v-icon
                    small
                    color="
                    green
                  "
                  >
                    mdi-tag
                  </v-icon>
                  <v-list-item-title class="ml-3">Map</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
    <div v-if="currentView === 'MAPPING_PAGE'">
      <TaggingComponentsFromTagged
        :ObjFromTaggedProductsVendors="objFromTaggedProductsVendors"
        @clicked="taggingComponentsFromTaggedEmit"
      />
    </div>
    <!-- </v-dialog> -->
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import { GetVendorTaggedList } from "@/mixins/Vendors/GetTaggedProducts.js";
import dialogActivateInactivateVendorDialog from "@/components/Vendors/Dialogs/ActivateorDeactivateDialog.vue";
import EditTaggedProduct from "@/components/Vendors/Dialogs/EditTaggedProductDialog.vue";
import TaggingComponentsFromTagged from "@/components/Vendors/Cards/TaggingComponentsFromTagged.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  components: {
    Overlay,
    dialogActivateInactivateVendorDialog,
    EditTaggedProduct,
    TaggingComponentsFromTagged,
    Snackbar,
  },
  props: {
    TaggedProductsVendorsDialog: Boolean,
    StoreObj: Object,
  },
  mixins: [GetVendorTaggedList],
  data: () => ({
    SnackBarComponent: {},
    renderComp: true,
    noDataText: "",
    Select_type: "COMPONENT",
    Tableloading: false,
    overlay: false,
    viewWorkDialog: false,
    ActionObj: {},
    dialogActivateInactivateVendorDialog: false,
    StoreObject: {},
    TaggedProductsVentorList: [],
    work_location_array: [],
    Select_Type_Items: ["COMPONENT", "PRODUCT"],
    ActionType: "ACTIVE",
    ActionType_Items: [
      { text: "Mapped", value: "ACTIVE" },
      { text: "Deactivated", value: "INACTIVE" },
      { text: "Unmapped", value: "UNMAPPED" },
    ],
    ComponentHeaders: [
      // { text: "Category Name", value: "category_name" },
      { text: "Component Type", value: "tagged_type" },
      { text: "Organisation Component Name", value: "component_name" },
      { text: "Organisation Component Code", value: "component_code" },
      { text: "Vendor Component Name", value: "vendor_component_name" },
      { text: "Vendor Component Code", value: "vendor_component_code" },
      { text: "Vendor Serial Number", value: "vendor_component_serial_number" },
      { text: "Cost", value: "price" },
      { text: "Mapped On", value: "modified_on" },
      {
        text: "Actions",
        value: "actions",
      },
    ],
    headers: [
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Type", value: "tagged_type" },
      { text: "Price", value: "price" },
      { text: "Tagged On", value: "modified_on" },
      {
        text: "Actions",
        value: "actions",
      },
      //   { text: "Status", value: "current_work_status" },
      //   { text: "Work Logs", value: "worklog" },
    ],
    editTaggedProductDialog: false,
    currentView: "TAGGED_PAGE",
    objFromTaggedProductsVendors: {},
  }),
  watch: {
    // async TaggedProductsVendorsDialog(val) {
    //   if (val == true) {
    //     this.TaggedProductsVentorList = await this.GetVendorTaggedListMethod(
    //       this.StoreObj.vendor_id,
    //       this.Select_type,
    // this.ActionType
    //     );
    //   }
    // },
    async Select_type(val) {
      if (val != "") {
        this.TaggedProductsVentorList = await this.GetVendorTaggedListMethod(
          this.StoreObj.vendor_id,
          val,
          this.ActionType
        );
      }
    },
    async ActionType(val) {
      if (val) {
        this.ComponentHeaders = [
          { text: "Component Type", value: "tagged_type" },
          { text: "Organisation Component Name", value: "component_name" },
          {
            text: "Organisation Component Code",
            value: "component_code",
          },
          { text: "Vendor Component Name", value: "vendor_component_name" },
          { text: "Vendor Component Code", value: "vendor_component_code" },
          {
            text: "Vendor Serial Number",
            value: "vendor_component_serial_number",
          },
          { text: "Cost", value: "price" },
          { text: "Mapped On", value: "modified_on" },
          {
            text: "Actions",
            value: "actions",
          },
        ];
        this.headers = [
          { text: "Category Name", value: "category_name" },
          { text: "Product Name", value: "product_name" },
          { text: "Type", value: "tagged_type" },
          { text: "Price", value: "price" },
          { text: "Tagged On", value: "modified_on" },
          {
            text: "Actions",
            value: "actions",
          },
        ];
        this.TaggedProductsVentorList = await this.GetVendorTaggedListMethod(
          this.StoreObj.vendor_id,
          this.Select_type,
          val
        );
      }
      if (val === "UNMAPPED") {
        this.ComponentHeaders = [
          { text: "Component Type", value: "tagged_type" },
          { text: "Organization Component Name", value: "component_name" },
          { text: "Organisation Component Code", value: "component_code" },
          { text: "Vendor Component Name", value: "vendor_component_name" },
          { text: "Vendor Component Code", value: "vendor_component_code" },
          {
            text: "Vendor Serial Number",
            value: "vendor_component_serial_number",
          },
          { text: "Cost", value: "price" },
          // { text: "Initiated On", value: "modified_on" },
          {
            text: "Actions",
            value: "actions",
          },
        ];
        this.headers = [
          { text: "Product Name", value: "product_name" },
          { text: "Type", value: "tagged_type" },
          { text: "Price", value: "price" },
          { text: "Initiated On", value: "modified_on" },
          {
            text: "Actions",
            value: "actions",
          },
        ];
      }
    },
  },
  async mounted() {
    this.TaggedProductsVentorList = await this.GetVendorTaggedListMethod(
      this.StoreObj.vendor_id,
      this.Select_type,
      this.ActionType
    );
  },
  methods: {
    checkItem(item, action = "ACTIVATE") {
      this.ActionObj = item;
      this.ActionObj.action = action;
      this.dialogActivateInactivateVendorDialog = true;
    },
    TaggedProductsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },

    EditTaggedProductsMethod(item, index) {
      this.editTaggedProductDialog = true;
      this.StoreObj = item;
    },

    mapVendorMethod(item) {
      this.objFromTaggedProductsVendors = item;
      this.currentView = "MAPPING_PAGE";
    },

    FormatedDateTime(item) {
      const date = new Date(item * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      hours = String(hours).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    },

    async ActivateInactivateVendorComponentEmit(Toggle) {
      this.dialogActivateInactivateVendorDialog = false;
      if (Toggle == 2) {
        this.TaggedProductsVentorList = await this.GetVendorTaggedListMethod(
          this.StoreObj.vendor_id,
          this.Select_type,
          this.ActionType
        );
      }
    },

    async EditTaggedProductDialogEmit(Toggle) {
      this.editTaggedProductDialog = false;
      if (Toggle === 2) {
        this.TaggedProductsVentorList = await this.GetVendorTaggedListMethod(
          this.StoreObj.vendor_id,
          this.Select_type,
          this.ActionType
        );
      }
    },

    async taggingComponentsFromTaggedEmit(Toggle) {
      this.currentView = "TAGGED_PAGE";
      if (Toggle === 2) {
        this.TaggedProductsVentorList = await this.GetVendorTaggedListMethod(
          this.StoreObj.vendor_id,
          this.Select_type,
          this.ActionType
        );
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Mapped Successfully!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },
  },
};
</script>
