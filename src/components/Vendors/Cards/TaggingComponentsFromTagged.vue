<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <AddVendorDetails
      :AddVendorDetailsDialog="addVendorDetailsDialog"
      :StoreObj="storeObj"
      @clicked="addVendorDetailsEmit"
    />
    <v-card tile class="elevation-0">
      <v-toolbar dense tile class="black--text elevation-0">
        <div class="font-weight-bold">
          Mapping Component/Product To Vendor Component/Product
        </div>
        <v-spacer />
        <v-btn color="primary" small @click="taggingComponentsFromTaggedEmit(1)"
          ><v-icon>mdi-arrow-left</v-icon
          >{{
            ObjFromTaggedProductsVendors.from === "vendor_page"
              ? "To Vendors Page"
              : "To Map Component/Products"
          }}</v-btn
        >
      </v-toolbar>
      <v-card-text>
        {{ ObjFromTaggedProductsVendors.page }}
        <v-row>
          <v-col cols="12" lg="6" md="6" sm="12" xs="12">
            <div style="border: 1px dashed black" class="pa-5">
              <v-select
                style="max-width: 300px"
                v-model="mapType"
                :items="mapTypeList"
                dense
                outlined
                class="FontSize"
                label="Select Map Type"
              ></v-select>
              <v-row>
                <v-col
                  v-if="ObjFromTaggedProductsVendors.from !== 'vendor_page'"
                  cols="12"
                  lg="3"
                  md="3"
                  sm="12"
                  xs="12"
                  class="pt-0 pb-0"
                >
                  <v-text-field
                    v-model="vendorCompName"
                    dense
                    outlined
                    label="Vendor Component Name"
                    class="FontSize"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="ObjFromTaggedProductsVendors.from !== 'vendor_page'"
                  cols="12"
                  lg="3"
                  md="3"
                  sm="12"
                  xs="12"
                  class="pt-0 pb-0"
                >
                  <v-text-field
                    v-model="vendorCompCode"
                    dense
                    outlined
                    label="Vendor Component Code"
                    class="FontSize"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="ObjFromTaggedProductsVendors.from !== 'vendor_page'"
                  cols="12"
                  lg="3"
                  md="3"
                  sm="12"
                  xs="12"
                  class="pt-0 pb-0"
                >
                  <v-text-field
                    v-model="vendorSerialNumber"
                    dense
                    outlined
                    label="Vendor Serial Number"
                    class="FontSize"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  lg="3"
                  md="3"
                  sm="12"
                  xs="12"
                  v-if="
                    ObjFromTaggedProductsVendors.from !== 'vendor_page' &&
                    selectedCompItems.length > 0
                  "
                  class="pt-0 pb-0"
                >
                  <v-text-field
                    v-model="vendorCompPrice"
                    dense
                    outlined
                    label="Vendor Component Price"
                    class="FontSize"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="12"
                  xs="12"
                  class="pt-0 pb-0"
                >
                  <v-select
                    v-model="category"
                    :items="categoryItems"
                    item-text="category_name"
                    item-value="category_id"
                    dense
                    outlined
                    label="Select Category"
                    class="FontSize"
                    return-object
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="12"
                  xs="12"
                  class="pt-0 pb-0"
                >
                  <v-select
                    v-model="product"
                    :items="GetServiceByCategoriesList"
                    item-text="service_name"
                    item-value="service_id"
                    dense
                    outlined
                    label="Select Product"
                    class="FontSize"
                    return-object
                  ></v-select>
                </v-col>
              </v-row>
            </div>
            <div style="border: 1px dashed black" class="pa-5 mt-5">
              <v-data-table
                dense
                :headers="headers"
                :items="GetAllTagCompList"
                class="TableValFontsize"
                @click:row="handleRowClick"
              >
              </v-data-table>
            </div>
          </v-col>
          <v-col cols="12" lg="6" md="6" sm="12" xs="12">
            <div style="border: 1px dashed black" class="pa-5">
              <div class="mb-3">
                <span><strong>Selected Component</strong></span>
              </div>
              <v-data-table
                dense
                :headers="selectedCompHeader"
                :items="selectedCompItems"
                hide-default-footer
              >
                <template v-slot:[`item.component_name`]="{ item }">
                  <div class="FontSize">
                    {{ item.component_name }}
                  </div>
                </template>
                <template v-slot:[`item.component_product_code`]="{ item }">
                  <div class="FontSize">
                    {{ item.component_product_code }}
                  </div>
                </template>
                <!-- <template v-slot:[`item.service_name`]="{ item }">
                  <div class="FontSize">
                    {{ item.service_name || "-" }}
                  </div>
                </template> -->
                <!-- <template v-slot:[`item.component_price`]="{ item }">
                  <div class="FontSize">
                    {{ item.component_price || "-" }}
                  </div>
                </template> -->
              </v-data-table>
            </div>
            <div style="border: 1px dashed black" class="pa-5 mt-5">
              <div class="mb-3 d-flex">
                <div>
                  <span><strong>Vendor Component</strong></span>
                </div>
                <v-spacer />
                <div v-if="ObjFromTaggedProductsVendors.from === 'vendor_page'">
                  <v-btn
                    color="primary"
                    small
                    @click="addVendorDetailsDialogMethod()"
                    >Add<v-icon small>mdi-plus</v-icon></v-btn
                  >
                </div>
              </div>
              <v-data-table
                dense
                :headers="vendorComponent"
                :items="vendorComponentList"
                hide-default-footer
              >
                <template v-slot:[`item.vendor_component_name`]="{ item }">
                  <div class="FontSize">
                    {{ item.vendor_component_name || "-" }}
                  </div>
                </template>
                <template v-slot:[`item.vendor_component_code`]="{ item }">
                  <div class="FontSize">
                    {{ item.vendor_component_code || "-" }}
                  </div>
                </template>

                <template v-slot:[`item.component_price`]="{ item }">
                  <div class="FontSize">
                    {{ item.component_price || "-" }}
                  </div>
                </template>
                <template v-slot:[`item.action`]="{ item, index }">
                  <div class="d-flex">
                    <div>
                      <v-btn icon @click="editVendorDetails(item, index)"
                        ><v-icon small color="green">mdi-pencil</v-icon></v-btn
                      >
                    </div>
                    <div>
                      <v-btn
                        icon
                        @click="deleteVendorDetailsMethod(item, index)"
                        ><v-icon small color="red">mdi-delete</v-icon></v-btn
                      >
                    </div>
                  </div>
                </template>
              </v-data-table>
              <p
                class="text-end mt-2"
                v-if="
                  ObjFromTaggedProductsVendors.from !== 'vendor_page' &&
                  vendorComponentList.length > 0
                "
              >
                <span style="color: red">*</span> To edit Vendor Component Name
                & Code, and Price kindly edit in the text field given
              </p>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            small
            @click="mapVendorCompMethod()"
            :loading="btnLoading"
            ><v-icon small class="pr-1">mdi-tag</v-icon>Map</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddVendorDetails from "@/components/Vendors/Dialogs/AddVendorDetailsDialog.vue";

import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllTaggedComp } from "@/mixins/Product/GetAllTaggedComp.js";

import { TagProductOrComponentToVendor } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  components: { Snackbar, AddVendorDetails },
  mixins: [
    GetAllOrganizationSettingsTypesInMS,
    GetServicesByCategory,
    GetAllTaggedComp,
  ],
  props: { ObjFromTaggedProductsVendors: Object },
  data: () => ({
    btnLoading: false,
    SnackBarComponent: {},
    overlay: false,
    mapType: "COMPONENT",
    mapTypeList: ["COMPONENT"],
    vendorCompName: "",
    vendorCompCode: "",
    category: "",
    product: "",
    headers: [
      {
        text: "Component",
        value: "component_name",
      },
      {
        text: "Code",
        value: "component_product_code",
      },
      {
        text: "Service Name",
        value: "service_name",
      },
      {
        text: "Price",
        value: "component_price",
      },
    ],
    selectedCompItems: [],
    selectedCompHeader: [
      {
        text: "Component",
        value: "component_name",
      },

      {
        text: "Code",
        value: "component_product_code",
      },
      {
        text: "Price",
        value: "component_price",
      },
      //   {
      //     text: "Service Name",
      //     value: "service_name",
      //   },
      //   {
      //     text: "Price",
      //     value: "component_price",
      //   },
    ],
    vendorComponentList: [],
    vendorComponent: [
      {
        text: "Vendor Component",
        value: "vendor_component_name",
      },

      {
        text: "Vendor Component Code",
        value: "vendor_component_code",
      },
      {
        text: "Vendor Serial Number",
        value: "vendor_serial_number",
      },
      {
        text: "Cost",
        value: "vendor_component_price",
      },
    ],
    categoryItems: [],
    vendorCompPrice: "",
    renderComp: true,
    vendorSerialNumber: "",
    addVendorDetailsDialog: false,
    vendorDetailsForApiParams: [],
    storeObj: {},
  }),

  watch: {
    async category(val) {
      if (val) {
        await this.GetServicesByCategoriesMethod(val.category_id);
      }
    },

    async product(val) {
      if (val) {
        await this.GetAllTagCompMethod(val.service_id);
      }
    },

    vendorCompName(val) {
      if (val) {
        if (this.vendorComponentList.length > 0) {
          this.vendorComponentList[0].vendor_component_name = val;
        }
      }
    },
    vendorCompCode(val) {
      if (val) {
        if (this.vendorComponentList.length > 0) {
          this.vendorComponentList[0].vendor_component_code = val;
        }
      }
    },

    vendorSerialNumber(val) {
      if (val) {
        if (this.vendorComponentList.length > 0) {
          this.vendorComponentList[0].vendor_serial_number = val;
        }
      }
    },

    selectedCompItems(val) {
      if (val && this.ObjFromTaggedProductsVendors.from !== "vendor_page") {
        this.vendorCompPrice = val[0].component_price;
      }
    },
    vendorCompPrice(val) {
      if (val) {
        this.vendorComponentList[0].vendor_component_price = val;
      }
    },
  },

  async mounted() {
    this.vendorCompName =
      this.ObjFromTaggedProductsVendors.vendor_component_name;
    this.vendorCompCode =
      this.ObjFromTaggedProductsVendors.vendor_component_code;
    await this.GetAllOrganizationSettingsTypesMethod();
    if (this.ObjFromTaggedProductsVendors.from === "vendor_page") {
      this.vendorComponent.push({
        text: "Action",
        value: "action",
      });
    }
  },

  methods: {
    handleRowClick(item) {
      console.log("CJ", item);
      this.selectedCompItems = [];
      this.selectedCompItems.push(item);
      if (this.ObjFromTaggedProductsVendors.from !== "vendor_page") {
        this.vendorComponentList = [];
        this.vendorComponentList.push({
          ...item,
          vendor_component_name: this.vendorCompName,
          vendor_component_code: this.vendorCompCode,
          vendor_serial_number: this.vendorSerialNumber,
        });
      }
    },

    addVendorDetailsDialogMethod() {
      if (this.selectedCompItems.length > 0) {
        this.addVendorDetailsDialog = true;
        this.storeObj.action = "ADD";
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please select Category, Product and Component!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    async mapVendorCompMethod() {
      if (
        (this.ObjFromTaggedProductsVendors.from === "vendor_page" &&
          this.vendorDetailsForApiParams.length > 0) ||
        (this.ObjFromTaggedProductsVendors.from !== "vendor_page" &&
          this.vendorCompName !== "" &&
          this.vendorCompCode !== "" &&
          this.vendorComponentList.length > 0)
      ) {
        try {
          this.btnLoading = true;
          const result = await API.graphql(
            graphqlOperation(TagProductOrComponentToVendor, {
              input: {
                user_id: this.$store.getters.get_current_user_details.user_id,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                vendor_id: this.ObjFromTaggedProductsVendors.vendor_id,
                product_tagging_list:
                  this.ObjFromTaggedProductsVendors.from !== "vendor_page"
                    ? {
                        category_id: this.category.category_id,
                        category_name: this.category.category_name,
                        product_id: this.product.service_id,
                        product_name: this.product.service_name,
                        component_id: this.selectedCompItems[0].component_id,
                        component_name:
                          this.selectedCompItems[0].component_name,
                        component_code:
                          this.selectedCompItems[0].component_product_code,
                        vendor_component_name:
                          this.vendorComponentList[0].vendor_component_name,
                        vendor_component_code:
                          this.vendorComponentList[0].vendor_component_code,
                        // vendor_component_serial_number:
                        tag_type: this.mapType,
                        price: parseFloat(this.vendorCompPrice),
                      }
                    : this.vendorDetailsForApiParams,
              },
            })
          );
          const response = JSON.parse(
            result.data.TagProductOrComponentToVendor
          );
          if (response.status === "SUCCESS") {
            this.taggingComponentsFromTaggedEmit(2);
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
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
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText:
            "Kindly add the component and provide vendor component details!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    addVendorDetailsEmit(Toggle, obj, addedOrEdited) {
      this.addVendorDetailsDialog = false;
      if (Toggle === 2) {
        const newObj = {
          category_id: this.category.category_id,
          category_name: this.category.category_name,
          product_id: this.product.service_id,
          product_name: this.product.service_name,
          component_id: this.selectedCompItems[0].component_id,
          component_name: this.selectedCompItems[0].component_name,
          component_code: this.selectedCompItems[0].component_product_code,
          vendor_component_name: obj.vendor_component_name,
          vendor_component_code: obj.vendor_component_code,
          vendor_component_serial_number: obj.vendor_serial_number,
          price: parseFloat(parseFloat(obj.vendor_component_price).toFixed(2)),
          tag_type: this.mapType,
        };
        if (addedOrEdited.type === "Edited") {
          this.vendorDetailsForApiParams.splice(addedOrEdited.index, 1, newObj);
          this.vendorComponentList.splice(addedOrEdited.index, 1, obj);
        } else {
          const exists = this.vendorDetailsForApiParams.some(
            (item) =>
              item.vendor_component_name === newObj.vendor_component_name &&
              item.vendor_component_code === newObj.vendor_component_code &&
              item.vendor_component_serial_number ===
                newObj.vendor_component_serial_number
          );
          if (!exists) {
            this.vendorDetailsForApiParams.push(newObj);
            this.vendorComponentList.push(obj);
          } else {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText:
                "Provided vendor details are already existed in the table",
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
          }
        }
      }
    },

    editVendorDetails(item, index) {
      this.addVendorDetailsDialog = true;
      this.storeObj = item;
      this.storeObj.action = "EDIT";
      this.storeObj.index = index;
    },

    deleteVendorDetailsMethod(item, index) {
      this.vendorComponentList.splice(index, 1);
      this.vendorDetailsForApiParams.splice(index, 1);
    },

    taggingComponentsFromTaggedEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
