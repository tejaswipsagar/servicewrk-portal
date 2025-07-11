<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <CreateProduct
      :CreateProductDialog="createProductDialog"
      :StoreObj1="storeObj1"
      @clicked="CreateProductDialogEmit"
    />
    <UpdateProduct
      :UpdateProductDialog="updateProductDialog"
      :StoreObjForTaggedProductFleet="storeObj1"
      @clicked="UpdateProductDialogEmit"
    />
    <CreateTicket
      v-if="current_view === 'CREATE_TICKET'"
      :StoreObj="storeObj"
      @clicked="CreateTicketCardEmit"
    />
    <v-card elevation="0" v-if="current_view == 'TAG_PRODUCT'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Dealer Products</div>
        <v-spacer />
        <v-text-field
          v-model="search"
          dense
          outlined
          label="Search"
          class="FontSize mr-2 mt-7 maxWidthSmall"
        ></v-text-field>
        <v-btn
          color="primary"
          class="ml-2 mr-2"
          small
          @click="createProductDialogMethod()"
          >Create
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          small
          class="ml-2"
          @click="TagProductDialogEmit()"
        >
          <v-icon>mdi-chevron-double-left</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          fixed-header
          :height="TableHeight"
          :headers="productsHeaders"
          :items="dealerProductItems"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.sl_no`]="{ item, index }">
            <div class="d-flex">
              <div
                class="mr-1"
                v-if="item.product_status === 'CUSTOMER_TAGGED'"
              >
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      style="cursor: pointer"
                      v-bind="attrs"
                      v-on="on"
                      size="15"
                      color="primary"
                      class="mb-1"
                      >mdi-tag</v-icon
                    >
                  </template>
                  <span>Tagged to customer</span>
                </v-tooltip>
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
                    @click.stop="tagToCustomerMethod(item, 'CUSTOMER_TAGGING')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-tag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Tag to customer</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <!-- <v-list-item
                    v-else
                    @click.stop="tagToCustomerMethod(item, 'CUSTOMER_TAGGING')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-tag-off-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Untag</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item> -->
                  <v-list-item
                    v-if="item.product_status === 'CUSTOMER_TAGGED'"
                    @click.stop="updateProductMethod(item, 'UPDATE_PRODUCT')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="green">mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Update details</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.product_status === 'CUSTOMER_TAGGED'"
                    @click.stop="createTicketMethod(item, 'CREATE_TICKET')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary"
                        >mdi-plus-box-outline</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Create Ticket</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import CreateProduct from "@/components/Users/Dialogs/Dealer/CreateProduct.vue";
import { GetDealersOrPartnerCustomers } from "@/graphql/queries.js";
import { ListDealerOrPartnerTaggedProducts } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
import UpdateProduct from "@/components/Users/Dialogs/Dealer/UpdateProductDialog.vue";
import CreateTicket from "@/components/DealerProducts/Cards/CreateTicket.vue";

export default {
  props: {
    StoreObj: Object,
    TagProductDialog: Boolean,
  },

  components: {
    Overlay,
    Snackbar,
    CreateProduct,
    UpdateProduct,
    CreateTicket,
  },

  data: () => ({
    TableHeight: 0,
    search: "",
    overlay: true,
    SnackBarComponent: {},
    renderComp: true,
    current_view: "TAG_PRODUCT",
    createProductDialog: false,
    updateProductDialog: false,
    storeObj1: {},
    storeObj: {},
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

  async mounted() {
    this.TableHeight = window.innerHeight - 200;
    await this.callDealerProductApiMethod();
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
        this.overlay = false;
      } catch (error) {
        console.log("Error", error);
        this.overlay = false;
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
      this.storeObj1.dealer_id = this.StoreObj.user_id;
      this.storeObj1.action = "CREATE_PRODUCT";
      this.createProductDialog = true;
    },

    updateProductMethod(item, action) {
      this.storeObj1 = item;
      this.updateProductDialog = true;
    },

    createTicketMethod(item, action) {
      this.current_view = action;
      this.storeObj = item;
      this.storeObj.action = action;
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

    async UpdateProductDialogEmit(Toggle) {
      this.updateProductDialog = false;
      if (Toggle === 2) {
        await this.callDealerProductApiMethod();
      }
    },

    async CreateTicketCardEmit(Toggle) {
      this.current_view = "TAG_PRODUCT";
      if (Toggle === 2) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: "Ticket Created Successfully",
            Top: true,
          };
          this.renderComp = true;
        });
        await this.callDealerProductApiMethod();
      }
    },
  },
};
</script>
