<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <EditCompProduct
      :EditCompProduDialog="editCompProduDialog"
      :EditStoreObj="EditStoreObj"
      @clicked="EditCompProduDialogEmit"
    />
    <!-- <v-dialog persistent v-model="TagProductsToVendor" width="600px"> -->
    <v-card class="elevation-0">
      <v-toolbar color="white" dense tile class="black--text elevation-0">
        <div class="font-weight-bold">
          Tag Products Or Components
          <span class="font-weight-bold red--text"
            >( {{ StoreObj.vendor_name }} )</span
          >
        </div>
        <v-spacer />
        <v-btn
          small
          color="primary"
          dark
          @click.stop="TagProductsToVendorEmit()"
          ><v-icon color="white" class="mr-2">mdi-arrow-left</v-icon>Back</v-btn
        >
      </v-toolbar>
      <v-card-text class="pa-3">
        <v-form ref="forms">
          <v-row>
            <v-col cols="12" md="6" xs="12" sm="12">
              <v-select
                dense
                outlined
                label="Select Tag Type"
                v-model="SelectTagType"
                :items="SelectTagList"
              ></v-select>

              <div v-if="SelectTagType !== ''">
                <v-card class="DashedCard elevation-0">
                  <v-row class="ma-2">
                    <v-col cols="6" md="6" xs="12" sm="12">
                      <v-autocomplete
                        v-if="SelectTagType !== ''"
                        dense
                        outlined
                        v-model="categories"
                        class="mt-4 FontSize"
                        :items="category_lists"
                        item-value="category_id"
                        label="Select Category *"
                        item-text="category_name"
                        :readonly="SelectTagType == ''"
                        :rules="[(v) => !!v || 'Required']"
                        @change="
                          GetServicesByCategoriesMethod(categories.category_id)
                        "
                        return-object
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6" md="6" xs="12" sm="12">
                      <v-autocomplete
                        v-if="categories !== '' && SelectTagType == 'COMPONENT'"
                        dense
                        outlined
                        class="FontSize mt-4"
                        v-model="products"
                        :items="productsList"
                        item-value="service_id"
                        item-text="service_name"
                        :rules="[(v) => !!v || 'Required']"
                        :label="
                          !categories
                            ? 'Select Category first'
                            : 'Select Product *'
                        "
                        return-object
                      >
                      </v-autocomplete>
                    </v-col>
                    <!-- <v-col cols="4" md="4" xs="12" sm="12">
                      <v-select
                        v-if="SelectTagType == 'COMPONENT' && categories != ''"
                        dense
                        outlined
                        label="Component"
                        v-model="Component_name"
                        :items="GetAllTagCompList"
                        item-text="component_name"
                        item-value="component_id"
                        class="mt-4"
                        return-object
                        no-data-text="Please contact admin to tag component to product or select different product"
                        :rules="
                          SelectTagType == 'COMPONENT' ? Componentsrules : []
                        "
                      >
                      </v-select>
                    </v-col> -->
                    <!-- <v-text-field
                      v-if="categories !== ''"
                      dense
                      outlined
                      label="Price"
                      v-model="Product_Price"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field> -->
                  </v-row>
                  <v-card
                    class="elevation-0"
                    v-if="
                      (categories !== '' && SelectTagType == 'PRODUCT') ||
                      (products !== '' && SelectTagType == 'COMPONENT')
                    "
                  >
                    <v-data-table
                      :headers="
                        SelectTagType == 'COMPONENT'
                          ? ComponentsHeaders
                          : ProductHeaders
                      "
                      :items="
                        SelectTagType == 'PRODUCT'
                          ? GetAllTagCompList
                          : ComponentList
                      "
                      v-model="selectedItems"
                      :loading="TableLoading"
                      dense
                      class="TableValFontsize"
                      show-select
                      checkbox-color="primary"
                      :item-key="
                        SelectTagType == 'COMPONENT'
                          ? 'component_id'
                          : 'service_id'
                      "
                    >
                      <template v-slot:top>
                        <v-btn
                          x-small
                          color="primary"
                          @click="selectAllItems"
                          class="ml-3"
                        >
                          All
                        </v-btn>
                        <v-btn
                          x-small
                          color="primary"
                          @click="UnselectAll"
                          class="ml-3"
                        >
                          Un select all
                        </v-btn>
                      </template>
                      <template v-slot:[`item.component_price`]="{ item }">
                        <div v-if="item.component_price">
                          {{ item.component_price }}
                        </div>
                        <div v-else>-</div>
                      </template>
                      <template v-slot:[`item.service_name`]="{ item }">
                        <div v-if="item.service_name">
                          {{ item.service_name }}
                        </div>
                        <div v-else>-</div>
                      </template></v-data-table
                    >
                  </v-card>
                </v-card>
              </div>
            </v-col>
            <v-col cols="1" md="1"></v-col>
            <v-col
              align="right"
              justify="right"
              cols="5"
              md="5"
              xs="12"
              sm="12"
            >
              <div v-if="componentsListItems.length > 0">
                <div align="left" class="font-weight-bold black--text ml-n12">
                  Selected Components
                </div>
                <div align="right" class="ml-n12 mr-3">
                  <v-card class="DashedCard1 elevation-0 mt-3">
                    <v-data-table
                      :height="TableHeight"
                      :headers="ComponentsHeaders"
                      :items="componentsListItems"
                      dense
                      class="TableValFontsize"
                    >
                      <template v-slot:[`item.edit_action`]="{ item, index }">
                        <div>
                          <v-btn
                            icon
                            @click="
                              editComponentProductItemMethod(
                                item,
                                index,
                                'COMPONENT'
                              )
                            "
                            ><v-icon small color="green"
                              >mdi-pencil</v-icon
                            ></v-btn
                          >
                        </div>
                      </template>
                      <!-- <template v-slot:[`item.component_price`]="{ item }">
                        <v-text-field
                          v-if="SelectTagType == 'COMPONENT'"
                          dense
                          solo
                          class="mt-4"
                          v-model="item.component_price"
                          label="Price*"
                        ></v-text-field>
                      </template>
                      <template v-slot:[`item.service_price`]="{ item }">
                        <v-text-field
                          v-if="SelectTagType == 'PRODUCT'"
                          dense
                          solo
                          class="mt-4"
                          v-model="item.service_price"
                          label="Price*"
                        ></v-text-field>
                      </template> -->
                    </v-data-table>
                  </v-card>
                </div>
              </div>
              <div v-if="productsListItems.length > 0">
                <div
                  align="left"
                  class="font-weight-bold black--text ml-n12 mt-3"
                >
                  Selected Products
                </div>
                <div align="right" class="ml-n12 mr-3">
                  <v-card class="DashedCard1 elevation-0 mt-3">
                    <v-data-table
                      :height="TableHeight"
                      :headers="ProductHeaders"
                      :items="productsListItems"
                      dense
                      class="TableValFontsize"
                    >
                      <template v-slot:[`item.edit_action`]="{ item, index }">
                        <div>
                          <v-btn
                            icon
                            @click="
                              editComponentProductItemMethod(
                                item,
                                index,
                                'PRODUCT'
                              )
                            "
                            ><v-icon small color="green"
                              >mdi-pencil</v-icon
                            ></v-btn
                          >
                        </div>
                      </template>
                    </v-data-table>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-card-actions class="mt-3" v-if="selectedItems.length != 0">
            <v-spacer />
            <v-btn small text @click.stop="TagProductsToVendorEmit()"
              >Cancel</v-btn
            >
            <v-btn
              small
              color="primary"
              :loading="btnLoading"
              depressed
              @click.stop="validateMethod()"
              ><v-icon small class="mr-2">mdi-tag</v-icon>Tag</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card-text>
      <!-- <v-row>
        <v-col cols="12" md="6" xs="12" sm="12">
          <v-card class="elevation-0">
            <v-data-table :headers="ComponentsHeaders" dense></v-data-table>
          </v-card>
        </v-col>
      </v-row> -->
    </v-card>
    <!-- </v-dialog> -->
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllTaggedComp } from "@/mixins/Product/GetAllTaggedComp.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import { GetTaggedProductsIdsOfVendor } from "@/mixins/Vendors/TaggedProductsIDs.js";
import { TagProductOrComponentToVendor } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import EditCompProduct from "@/components/Vendors/Dialogs/EditCompProductDialog.vue";
import { compileToFunctions } from "vue-template-compiler";
export default {
  props: {
    TagProductsToVendor: Boolean,
    StoreObj: Object,
  },
  components: { Snackbar, EditCompProduct },
  mixins: [
    GetServicesByCategory,
    GetAllOrganizationSettingsTypesInMS,
    GetAllTaggedComp,
    GetTaggedProductsIdsOfVendor,
  ],
  data: () => ({
    TableHeight: 0,
    categories: "",
    products: "",
    SelectTagType: "",
    Component_name: "",
    category_lists: [],
    productsList: [],
    GetServiceByCategoriesList: [],
    SelectTagList: ["COMPONENT", "PRODUCT"],
    SnackBarComponent: {},
    Product_Price: "",
    renderComp: true,
    btnLoading: false,
    TableLoading: false,
    GetAllTagCompList: [],
    FinalselectedItems: [],
    TaggedListArray: [],
    Componentsrules: [(v) => !!v || "Required"],
    ComponentsHeaders: [
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
      { text: "Edit", value: "edit_action" },
    ],
    ProductHeaders: [
      {
        text: "Product",
        value: "service_name",
      },
      {
        text: "Code",
        value: "service_display_id",
      },
      {
        text: "Price",
        value: "service_price",
      },
      { text: "Edit", value: "edit_action" },
    ],
    selectedItems: [],
    TableSelectedList: [],
    ComponentList: [],
    productsListItems: [],
    componentsListItems: [],
    EditStoreObj: {},
    editCompProduDialog: false,
  }),
  watch: {
    TagProductsToVendor(val) {
      if (val == true) {
        this.GetAllOrganizationSettingsTypesMethod();
      }
    },

    selectedItems(val) {
      if (val) {
        const updatedVal = val.map((item) => ({
          ...item,
          type: this.SelectTagType,
          category_id: this.categories.category_id,
          category_name: this.categories.category_name,
          product_id: this.products.service_id,
          product_name: this.products.service_name,
        }));

        console.log("SEL_VAL", updatedVal);

        if (this.SelectTagType === "COMPONENT") {
          updatedVal.forEach((item) => {
            // Check if the item is already in the list
            if (
              !this.componentsListItems.some(
                (existingItem) =>
                  existingItem.component_id === item.component_id
              )
            ) {
              this.componentsListItems.push(item);
            }
          });
          console.log("COMPON_LIST", this.componentsListItems);
        } else if (this.SelectTagType === "PRODUCT") {
          updatedVal.forEach((item) => {
            // Check if the item is already in the list
            if (
              !this.productsListItems.some(
                (existingItem) => existingItem.service_id === item.service_id
              )
            ) {
              this.productsListItems.push(item);
            }
          });
        }
      }
    },

    async categories(val) {
      if (val != "") {
        this.selectedItems = [];
        this.products = "";
        this.TaggedListArray = await this.GetTaggedProductsIdsOfVendorMethod(
          this.StoreObj.vendor_id,
          this.SelectTagType,
          undefined,
          this.categories.category_id
        );
      }
    },
    async products(val) {
      if (val != "" && val != null) {
        this.selectedItems = [];
        this.ComponentList = await this.GetAllTagCompMethod(val.service_id);
      }
      if (this.SelectTagType == "COMPONENT") {
        this.TaggedListArray = await this.GetTaggedProductsIdsOfVendorMethod(
          this.StoreObj.vendor_id,
          this.SelectTagType,
          val.service_id,
          this.categories.category_id
        );
        this.TableLoading = true;
        setTimeout(() => {
          console.log("this.TaggedListArray", this.TaggedListArray);
          if (this.TaggedListArray && this.TaggedListArray.length != 0) {
            this.ComponentList = this.ComponentList.filter((item) => {
              return !this.TaggedListArray.includes(
                item.component_id.toString()
              );
            });
            this.TableLoading = false;
          }
        }, 100);
        this.TableLoading = false;
      }
    },
    Component_name(val) {
      if (val != "" && val != null) {
        this.Product_Price = val.component_price;
      }
    },
    SelectTagType(val) {
      this.selectedItems = [];
      this.products = "";
      this.categories = "";
      if (val === "COMPONENT") {
        this.selectedItems = this.componentsListItems;
      } else {
        this.selectedItems = this.productsListItems;
      }
    },
    GetAllOrganizationSettingsTypesObject(val) {
      this.category_lists = val.categories_list;
    },
    GetServiceByCategoriesList(val) {
      if (this.SelectTagType == "COMPONENT") {
        this.productsList = val;
      } else if (this.SelectTagType == "PRODUCT") {
        let ListingArray = val;
        this.TableLoading = true;
        setTimeout(() => {
          if (this.TaggedListArray && this.TaggedListArray.length != 0) {
            this.GetAllTagCompList = ListingArray.filter((item) => {
              return !this.TaggedListArray.includes(item.service_id.toString());
            });
            this.TableLoading = false;
          } else {
            this.GetAllTagCompList = ListingArray;
          }
        }, 2000);
      }
      console.log("this.GetAllTagCompList", this.GetAllTagCompList);
      //   if (this.StoreObj.action == "EDIT") {
      //     this.products = [...this.productsList]
      //       .filter((item) => item.service_id == this.StoreObj.product_id)
      //       .map((ppp) => {
      //         return ppp.service_id;
      //       })[0];
      //   }
    },
  },
  async mounted() {
    this.TableHeight = window.innerHeight - 260;
    await this.GetAllOrganizationSettingsTypesMethod();
  },
  methods: {
    selectAllItems() {
      if (this.SelectTagType == "PRODUCT") {
        this.selectedItems = [...this.GetAllTagCompList];
      } else if (this.SelectTagType == "COMPONENT") {
        this.selectedItems = [...this.ComponentList];
      }
    },
    UnselectAll() {
      this.selectedItems = [];
    },
    validateMethod() {
      this.TableSelectedList = [];
      this.TableSelectedList = [
        ...this.componentsListItems,
        ...this.productsListItems,
      ];

      console.log("TABLE_BOTH_LIST", this.TableSelectedList);
      this.CreateVendorMethod();

      // if (this.$refs.forms.validate()) {
      //
      // } else {
      //   this.SnackBarComponent = {
      //     SnackbarVmodel: true,
      //     SnackbarColor: "red",
      //     Top: true,
      //     SnackbarText: "Please fill required fields",
      //   };
      // }
    },

    editComponentProductItemMethod(item, index, action) {
      this.EditStoreObj = item;
      this.EditStoreObj.item_index = index;
      this.EditStoreObj.type = action;
      this.editCompProduDialog = true;
    },
    clickSnackbar() {
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "red",
        Top: true,
        SnackbarText: "Please fill required fields",
      };
      this.renderComp = false;
      this.$nextTick(() => {
        this.renderComp = true;
      });
    },
    async CreateVendorMethod() {
      // if (this.$refs.form.validate()) {
      // this.btnLoading = true;

      let SelectedArray = this.TableSelectedList.map((item) => {
        // if (item.component_price || item.service_price) {
        return {
          category_id: item.category_id,
          category_name: item.category_name,
          product_id:
            item.type == "COMPONENT" ? item.product_id : item.service_id,
          product_name:
            item.type == "COMPONENT" ? item.product_name : item.service_name,
          component_id: item.component_id,
          component_name: item.component_name,
          tag_type: item.type,
          price:
            item.type == "COMPONENT"
              ? parseFloat(item.component_price)
              : parseFloat(item.service_price),
        };
        // }
        // else {
        //   this.SnackBarComponent = {
        //     SnackbarVmodel: true,
        //     SnackbarColor: "red",
        //     Top: true,
        //     SnackbarText: "Kindly provide the price!",
        //   };
        //   this.renderComp = false;
        //   this.$nextTick(() => {
        //     this.renderComp = true;
        //   });
        // }
      });
      console.log("products", SelectedArray);
      try {
        this.btnLoading = true;
        let result = await API.graphql(
          graphqlOperation(TagProductOrComponentToVendor, {
            input: {
              user_id: this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              vendor_id: this.StoreObj.vendor_id,
              // category_id: this.categories.category_id,
              // category_name: this.categories.category_name,
              // product_id: this.products.service_id,
              // product_name: this.products.service_name,
              // tag_type: this.SelectTagType,
              // price: Number(this.Product_Price),
              // component_id:
              //   this.Component_name != undefined
              //     ? this.Component_name.component_id
              //     : undefined,
              // component_name:
              //   this.Component_name != undefined
              //     ? this.Component_name.component_name
              //     : undefined,
              product_tagging_list: SelectedArray,
            },
          })
        );

        let response = JSON.parse(result.data.TagProductOrComponentToVendor);
        console.log("CHECK_CREATE_RESPONSE", response);
        if (response.status == "SUCCESS") {
          console.log(
            "njknkjhdjknkjnjknkjnkjndjmnkjsnkjsnj",
            response.Status_Message
          );
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

          this.btnLoading = false;
          this.TagProductsToVendorEmit(2);
        }
      } catch (error) {
        this.renderComp = false;
        this.btnLoading = false;
        console.log("Error", error);
      }
      // } else {
      //   this.SnackBarComponent = {
      //     SnackbarVmodel: true,
      //     SnackbarColor: "red",
      //     Top: true,
      //     SnackbarText: "Please fill the form!",
      //   };
      // }
    },
    EditCompProduDialogEmit(Toggle, Obj) {
      this.editCompProduDialog = false;
      if (Toggle === 2) {
        if (Obj.type === "COMPONENT") {
          this.componentsListItems.splice(Obj.item_index, 1, Obj);
        } else {
          this.productsListItems.splice(Obj.item_index, 1, Obj);
        }
      }
    },
    TagProductsToVendorEmit(Toggle) {
      this.$refs.forms.reset();
      this.SelectTagType = "";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
