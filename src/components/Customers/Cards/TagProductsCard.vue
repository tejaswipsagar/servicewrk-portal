<template>
  <div>
    <v-card flat>
      <div>
        <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
        <Overlay :overlay="overlay" />
        <ViewExtendedWarrantyDetails
          :StoreObjNew1="StoreObjNew1"
          :DialogExtendedWarrantyDetails="DialogExtendedWarrantyDetails"
          @clicked="DialogExtendedWarrantyDetailsEmit"
        />
        <UpdateTaggedProductFleet
          :StoreObjForTaggedProductFleet="storeTableView"
          :AddUpdateProductFleetDialog="AddUpdateProductFleetDialog"
          @clicked="AddUpdateProductFleetDialogEmit"
        />
        <CreateTicketCard
          v-if="current_view == 'CREATE_TICKET'"
          :StoreObj="StoreObj"
          :StoreObj1="StoreObj1"
          @clicked="CreateTicketCardEmit"
        />
        <v-card
          class="elevation-0"
          v-if="current_view == 'TAGGED_PRODUCT_FLEET'"
        >
          <v-form ref="form">
            <v-toolbar dense class="elevation-0">
              <div>
                <h4>
                  Tagged Product Fleet to {{ this.StoreObj.customer_name }}
                  <span v-if="this.StoreObj.customer_company_name != undefined"
                    >({{ this.StoreObj.customer_company_name }})</span
                  >
                </h4>
              </div>
              <v-spacer></v-spacer>
              <v-text-field
                outlined
                dense
                v-model="search"
                label="Search"
                class="mt-7 ml-2 FontSize maxWidth"
                prepend-inner-icon="mdi-magnify"
              >
              </v-text-field>
              <v-btn
                small
                @click="current_view = 'UNTAGGED_PRODUCT_FLEET'"
                class="primary white--text ml-2 mr-2"
                >Tag More</v-btn
              >
            </v-toolbar>
            <v-card-text class="py-0">
              <v-data-table
                style="cursor: pointer"
                dense
                fixed-header
                :search="search"
                :page.sync="page"
                :loading="loading"
                :headers="headers"
                :items-per-page="50"
                :height="TableHeight"
                :no-data-text="noDataText"
                :items="GetTaggedProductList"
                @page-count="pageCount = $event"
                :footer-props="{
                  'disable-items-per-page': true,
                }"
                @click:row="handleRowClick"
                class="TableValFontsize"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ GetTaggedProductList.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.asset_number`]="{ item }">
                  <div class="FontSize">
                    {{ item.asset_number || "-" }}
                  </div>
                </template>
                <template v-slot:[`item.setting_name`]="{ item }">
                  <div class="FontSize" v-if="item.setting_name != undefined">
                    {{ item.setting_name }}
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-slot:[`item.category_name`]="{ item }">
                  <div class="FontSize" v-if="item.category_name != undefined">
                    {{ item.category_name }}
                  </div>
                  <div v-else>-</div>
                  <div class="FontSize" v-if="item.product_name != undefined">
                    {{ item.product_name }}
                  </div>
                </template>
                <template v-slot:[`item.support_type`]="{ item }">
                  <div class="FontSize" v-if="item.support_type != undefined">
                    {{ item.support_type }}
                  </div>
                  <div v-else>-</div>
                  <div class="FontSize" v-if="item.warranty_type != undefined">
                    {{ item.warranty_type }}
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-slot:[`item.warranty_start_date`]="{ item }">
                  <div
                    v-if="item.warranty_start_date != undefined"
                    class="FontSize ml-n3"
                  >
                    {{ item.warranty_start_date }}
                  </div>
                  <div v-else>-</div>
                  <div
                    v-if="item.warranty_end_date != undefined"
                    class="FontSize ml-n3"
                  >
                    {{ item.warranty_end_date }}
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-slot:[`item.extended_warranty_details`]="{ item }">
                  <div v-if="item.extended_warranty_details != undefined">
                    <v-btn
                      small
                      icon
                      @click.stop="viewExtendedWarrantyDetailsDialog(item)"
                      class="ml-n3"
                      ><v-icon color="primary" small
                        >mdi-eye-outline</v-icon
                      ></v-btn
                    >
                  </div>
                  <div v-else class="ml-n3">
                    <v-icon color="red" small>mdi-close</v-icon>
                  </div>
                </template>
                <template v-slot:[`item.Actions`]="{ item }">
                  <v-tooltip bottom color="primary" v-if="create_ticket_btn">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        color="blue"
                        small
                        v-on="on"
                        class="mr-2"
                        @click.stop="checkItem(item, 'CREATE_TICKET')"
                      >
                        mdi-plus-box-outline
                      </v-icon>
                    </template>
                    <span class="white--text">Create Ticket</span>
                  </v-tooltip>
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        @click.stop="
                          editProductFleet(item, 'EDIT'),
                            (storeTableView.action = 'EDIT')
                        "
                        color="primary"
                        small
                        v-on="on"
                        class="ml-2 mr-2"
                      >
                        mdi-pencil-plus
                      </v-icon>
                    </template>
                    <span class="white--text">Update Product Fleet</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        color="red"
                        @click.stop="untagProductFleet(item)"
                        ><v-icon small>mdi-close-thick</v-icon></v-btn
                      >
                    </template>
                    <span>Untag Product</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-form>
        </v-card>

        <!-- <div v-if="current_view === 'TICKET_INFO_ON_PRODUCT'">
          <v-row align="center">
            <v-col cols="12" lg="6" md="6" sm="12" xs="12"> </v-col>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <v-select
                v-model="ticketStatus"
                :items="ticketStatusItems"
                item-text="text"
                item-value="value"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </div> -->
        <div v-if="current_view == 'TICKET_INFO_ON_PRODUCT'">
          <TicketInfo
            :StoreObjTicket="storeObj"
            @clicked="ticketInfoCardEmit"
          />
        </div>
        <!-- <v-card
          class="elevation-0 mt-3"
          v-if="current_view == 'TICKET_INFO_ON_PRODUCT'"
        >
          <v-form ref="form">
            <v-toolbar dense class="elevation-0">
              <div>
                <h4>
                  
                </h4>
              </div>
              <v-spacer></v-spacer>
              <v-select
                style="max-width: 200px"
                v-model="ticketStatus"
                :items="ticketStatusItems"
                item-text="text"
                item-value="value"
                dense
                outlined
                label="Ticket Status"
                class="mr-2 mt-7 FontSize"
              ></v-select>
              <v-btn
                color="primary"
                small
                dense
                class="ml-2"
                @click="current_view = 'TAGGED_PRODUCT_FLEET'"
                ><v-icon small>mdi-arrow-left</v-icon>To Tagged Product</v-btn
              >
            </v-toolbar>
            <v-card-text class="py-0"> </v-card-text>
          </v-form>
        </v-card> -->
        <DeactivateProductFleet
          :StoreObj="StoreObj"
          :storeTableView="storeTableView"
          :DeactivateProductFleetDialog="DeactivateProductFleetDialog"
          @clicked="DeactivateProductFleetDialogEmit"
        />
        <ViewUntaggedProducts
          v-if="current_view == 'UNTAGGED_PRODUCT_FLEET'"
          :StoreObj="StoreObj"
          @clicked="TagUntaggedProductsDailogEmit"
        />
      </div>
    </v-card>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTaggedProduct } from "@/mixins/Tickets/ListTaggedProducts.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import ViewUntaggedProducts from "@/components/Customers/Cards/ViewUntaggedProducts.vue";
import DeactivateProductFleet from "@/components/Customers/Dialogs/DeactivateProductFleet.vue";
import ViewExtendedWarrantyDetails from "@/components/Customers/Dialogs/ViewExtendedWarrantyDetails.vue";
import UpdateTaggedProductFleet from "@/components/Product/Dialogs/ProductsFleet/UpdateTaggedProductFleet.vue";
import CreateTicketCard from "@/components/Customers/Cards/CreateTicket.vue";
import TicketInfo from "@/components/Customers/Cards/TicketInfoCard.vue";
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [GetTaggedProduct],
  components: {
    Snackbar,
    Overlay,
    ViewUntaggedProducts,
    DeactivateProductFleet,
    UpdateTaggedProductFleet,
    ViewExtendedWarrantyDetails,
    CreateTicketCard,
    TicketInfo,
  },
  data: () => ({
    search: "",
    current_view: "TAGGED_PRODUCT_FLEET",
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    loading: false,
    overlay: false,
    AddUpdateProductFleetDialog: false,
    DeactivateProductFleetDialog: false,
    DialogExtendedWarrantyDetails: false,
    StoreObjNew1: {},
    storeTableView: {},
    GetTaggedProductList: [],
    headers: [
      { text: "#", value: "sl_no" },
      { text: "Product", value: "category_name" },
      { text: "Serial Number", value: "setting_name" },
      { text: "Asset Number", value: "asset_number" },
      { text: "Support", value: "support_type" },
      { text: "Support Dates", value: "warranty_start_date", align: "center" },
      {
        text: "Extended Warranty",
        value: "extended_warranty_details",
        align: "center",
      },
      { text: "Actions", value: "Actions", align: "center" },
    ],
    StoreObj1: {},
    SnackBarComponent: {},
    renderComp: true,
    storeObj: {},
    create_ticket_btn: false,
  }),
  watch: {
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetTaggedProductMethod(
          this.StoreObj.customer_id,
          undefined,
          this.next_token
        );
      }
    },
  },
  mounted() {
    this.accessToCreateTicket();
    this.TableHeight = window.innerHeight - 230;
    this.GetTaggedProductMethod(
      this.StoreObj.customer_id,
      undefined,
      undefined
    );
  },
  methods: {
    accessToCreateTicket() {
      if (
        this.$store.getters.get_user_type == "DEALER_OWNER" ||
        this.$store.getters.get_user_type == "DEALER_AGENT"
      ) {
        this.create_ticket_btn =
          this.$store.getters.get_current_user_details
            .enable_ticket_creation_for_customer_tagged_product ?? true;
      } else {
        this.create_ticket_btn = true;
      }
    },
    DialogExtendedWarrantyDetailsEmit() {
      this.DialogExtendedWarrantyDetails = false;
    },
    viewExtendedWarrantyDetailsDialog(item) {
      this.StoreObjNew1 = item;
      this.DialogExtendedWarrantyDetails = true;
    },
    TagUntaggedProductsDailogEmit() {
      this.current_view = "TAGGED_PRODUCT_FLEET";
      this.GetTaggedProductList = [];
      this.GetTaggedProductMethod(
        this.StoreObj.customer_id,
        undefined,
        undefined
      );
    },
    handleRowClick(item) {
      console.log("ROW_ITEM", item);
      this.current_view = "TICKET_INFO_ON_PRODUCT";
      this.storeObj = item;
    },
    checkItem(item, action) {
      this.current_view = action;
      this.StoreObj1 = item;
      console.log("INSIDE_ROW_CLICK", item);
    },
    editProductFleet(item, action) {
      this.storeTableView = item;
      if (action == "EDIT") {
        this.AddUpdateProductFleetDialog = true;
      }
    },
    untagProductFleet(item) {
      this.storeTableView = item;
      this.DeactivateProductFleetDialog = true;
    },
    DeactivateProductFleetDialogEmit(Toggle) {
      this.DeactivateProductFleetDialog = false;
      if (Toggle == 2) {
        this.GetTaggedProductList = [];
        this.GetTaggedProductMethod(
          this.StoreObj.customer_id,
          undefined,
          undefined
        );
      }
    },
    AddUpdateProductFleetDialogEmit(Toggle) {
      this.AddUpdateProductFleetDialog = false;
      if (Toggle == 2) {
        this.GetTaggedProductList = [];
        this.GetTaggedProductMethod(
          this.StoreObj.customer_id,
          undefined,
          undefined
        );
      }
    },

    CreateTicketCardEmit(Toggle, status_message) {
      this.current_view = "TAGGED_PRODUCT_FLEET";
      if (Toggle === 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: status_message,
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
      this.$emit("clicked", Toggle, status_message);
    },

    ticketInfoCardEmit(Toggle) {
      this.current_view = "TAGGED_PRODUCT_FLEET";
    },
  },
};
</script>
