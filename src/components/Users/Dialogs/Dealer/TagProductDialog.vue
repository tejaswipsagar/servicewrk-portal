<template>
  <div>
    <!-- <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    /> -->
    <CreateProduct
      :CreateProductDialog="createProductDialog"
      :StoreObj1="storeObj1"
      @clicked="CreateProductDialogEmit"
    />
    <v-dialog persistent width="80%" v-model="TagProductDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <div class="ml-2 white--text">Tag Products</div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="TagProductDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-toolbar elevation="0" dense>
            <h3>Dealer Products</h3>
            <v-spacer></v-spacer>
            <v-btn color="primary" small @click="createProductDialogMethod()"
              >Create
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <!-- <v-select
            v-model="selectedCustomer"
            :items="customerItems"
            item-text="customer_name"
            item-value="customer_id"
            dense
            outlined
            label="Select Customer"
            class="FontSize mt-3 mb-3"
          /> -->
          <v-data-table :headers="productsHeaders" :items="dealerProductItems">
            <template v-slot:[`item.sl_no`]="{ item, index }">
              <div class="d-flex">
                <div
                  class="mr-1"
                  v-if="item.product_status === 'CUSTOMER_TAGGED'"
                >
                  <v-icon size="15" color="primary">mdi-tag</v-icon>
                </div>
                <div class="FontSize">
                  {{ index + 1 }}
                </div>
              </div>
            </template>
            <template v-slot:[`item.category_name`]="{ item }">
              <div class="FontSize">
                {{ item.category_name || "-" }}
              </div>
            </template>
            <template v-slot:[`item.setting_name`]="{ item }">
              <div class="FontSize">
                {{ item.setting_name || "-" }}
              </div>
            </template>
            <template v-slot:[`item.customer_name`]="{ item }">
              <div class="FontSize">
                {{ item.customer_name || "-" }}
              </div>
            </template>
            <template v-slot:[`item.setting_price`]="{ item }">
              <div class="FontSize">
                {{ item.setting_price || "-" }}
              </div>
            </template>
            <template
              v-slot:[`item.organization_products_fleet_status`]="{ item }"
            >
              <div class="FontSize">
                {{ item.organization_products_fleet_status || "-" }}
              </div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-menu right bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="primary">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense nav>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-if="item.product_status !== 'CUSTOMER_TAGGED'"
                      @click.stop="
                        tagToCustomerMethod(item, 'CUSTOMER_TAGGING')
                      "
                    >
                      <v-list-item-icon>
                        <v-icon small color="blue">mdi-tag</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Tag to customer</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-else
                      @click.stop="
                        tagToCustomerMethod(item, 'CUSTOMER_TAGGING')
                      "
                    >
                      <v-list-item-icon>
                        <v-icon small color="blue">mdi-tag-off-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Untag</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- <v-list-item v-if="item.customer_name">
                      <v-list-item-icon>
                        <v-icon small color="red">mdi-tag-off-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Untag</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item> -->
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card-text>

        <!-- <v-card-actions
            class="pt-0"
            v-if="
              $store.getters.get_user_type != 'AGENT' &&
              $store.getters.get_user_type != 'MANAGER'
            "
          >
            <v-spacer></v-spacer>
            <v-btn
              small
              :loading="isLoading"
              color="primary"
              @click="valicateCreateReps"
              class="white--text mb-4 mr-4"
              >Save</v-btn
            >
          </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import CreateProduct from "@/components/Users/Dialogs/Dealer/CreateProduct.vue";
import { GetDealersOrPartnerCustomers } from "@/graphql/queries.js";
import { ListDealerOrPartnerTaggedProducts } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    StoreObj: Object,
    TagProductDialog: Boolean,
  },

  components: {
    CreateProduct,
  },

  data: () => ({
    createProductDialog: false,
    storeObj1: {},
    dealerProductItems: [],
    selectedCustomer: "",
    customerItems: [],
    productsHeaders: [
      { text: "#", value: "sl_no", width: "6%" },
      { text: "Category & Product", value: "category_name", width: "15%" },
      { text: "Serial No. & Age", value: "setting_name", width: "14%" },
      { text: "Tagged To", value: "customer_name", width: "20%" },
      { text: "Price & Desc.", value: "setting_price", width: "13%" },
      {
        text: "Fleet Status",
        value: "organization_products_fleet_status",
        width: "11%",
      },
      { text: "Actions", value: "actions", width: "10%" },
    ],
  }),

  watch: {
    async TagProductDialog(val) {
      if (val) {
        console.log("TAG_PRODUCT_DIALOG", this.StoreObj);
        await this.callDealerProductApiMethod();
        // try {
        //   const customerResult = await API.graphql(
        //     graphqlOperation(GetDealersOrPartnerCustomers, {
        //       input: {
        //         organization_id:
        //           this.$store.getters.get_current_user_details.organization_id,
        //         user_id: this.StoreObj.user_id,
        //       },
        //     })
        //   );
        //   this.customerItems = JSON.parse(
        //     customerResult.data.GetDealersOrPartnerCustomers
        //   ).data.items;
        // } catch (error) {
        //   //
        // }
      }
    },

    // async selectedCustomer(val) {
    //   if (val) {
    //     await this.callDealerProductApiMethod();
    //   }
    // },
  },

  methods: {
    async callDealerProductApiMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(ListDealerOrPartnerTaggedProducts, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.StoreObj.user_id,
              customer_id: undefined,
              // limit: 500,
              next_token: undefined,
              product_id: undefined,
              product_status: undefined,
            },
          })
        );
        const response = JSON.parse(
          result.data.ListDealerOrPartnerTaggedProducts
        );
        this.dealerProductItems = response.data.items;
        console.log("LIST_DEALER_PRODUCTS", this.dealerProductItems);
      } catch (error) {
        console.log("Error", error);
        //
      }
    },

    tagToCustomerMethod(item, action) {
      this.storeObj1 = item;
      this.storeObj1.dealer_id = this.StoreObj.user_id;
      this.storeObj1.action = action;
      this.createProductDialog = true;
      console.log("TAG_TO_CUSTOMER", item, action);
    },
    createProductDialogMethod() {
      this.storeObj1 = this.StoreObj;
      this.storeObj1.action = "CREATE_PRODUCT";
      this.createProductDialog = true;
    },

    async CreateProductDialogEmit(Toggle) {
      this.createProductDialog = false;
      if (Toggle === 2) {
        await this.callDealerProductApiMethod();
      }
    },

    TagProductDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
