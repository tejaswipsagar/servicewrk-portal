<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <BillingShippingAddress
      :AddressDialog="addressDialog"
      :AddressObj="addressObj"
      @clicked="AddressDialogEmit"
    />
    <SelectVendors
      :SelectVendorsDialog="selectVendorsDialog"
      :StoreObj="StoreObj"
      @clicked="SelectVendorsDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          <v-icon small class="mr-2" color="primary">mdi-plus</v-icon>
          <span>Generate</span>
          Purchase Order
        </div>
        <v-spacer />
        <v-btn
          @click="GeneratePOEmit((Toggle = 1))"
          class="primary white--text"
          small
        >
          <v-icon color="white" small>mdi-chevron-double-left</v-icon>
          Back</v-btn
        >
      </v-toolbar>
      <hr />
      <v-card-text class="black--text pb-0">
        <div class="d-flex">
          <div class="mr-1">
            <v-select
              :width="300"
              dense
              outlined
              v-model="purchaseOrderFor"
              label="Purchase Order For"
              :items="purchaseOrderForItems"
              item-text="title"
              item-value="value"
              class="FontSize"
            ></v-select>
          </div>
          <div class="ml-1">
            <v-text-field
              v-if="purchaseOrderFor === 'EXISTING_TICKET'"
              :width="300"
              dense
              outlined
              v-model="searchTicket"
              label="Search Ticket"
              class="FontSize"
            >
              <template v-slot:append>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == false"
                  @click="GetTicketsByFilterMethod()"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == true"
                  @click="ClearMethod()"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </div>
          <div class="ml-1">
            <v-text-field
              v-if="purchaseOrderFor === 'EXISTING_QUOTATION'"
              :width="300"
              dense
              outlined
              v-model="searchQuotation"
              label="Search Quotation"
              class="FontSize"
            >
              <template v-slot:append>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == false"
                  @click="getQuotationSearchMethod()"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == true"
                  @click="ClearMethod()"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <div v-if="ConditionsToDisplaySearchTable">
          <span
            ><strong>{{
              purchaseOrderFor === "EXISTING_TICKET"
                ? "Select Ticket"
                : "Select Quotation"
            }}</strong></span
          >
          <v-card
            class="pa-5"
            style="height: 200px; width: 100%; overflow: auto"
          >
            <v-data-table
              dense
              fixed-header
              :headers="
                purchaseOrderFor === 'EXISTING_TICKET'
                  ? searchedTicketHeader
                  : searchedQuotationHeader
              "
              :items="
                purchaseOrderFor === 'EXISTING_TICKET'
                  ? GetAllSearchedTickets
                  : searchedQuotationList
              "
              hide-default-footer
              @click:row="handleRowClickMethod"
            >
              <template v-slot:[`item.custom_ticket_id`]="{ item }">
                <div class="FontSize">
                  {{ item.custom_ticket_id }}
                </div>
              </template>
              <template v-slot:[`item.customer_name`]="{ item }">
                <div class="FontSize">
                  {{ item.customer_name }}
                </div>
              </template>
              <template v-slot:[`item.service_name`]="{ item }">
                <div class="FontSize">
                  {{ item.service_name }}
                </div>
              </template>
              <!-- //////////////////////////////////// -->
              <template v-slot:[`item.quotation_display_id`]="{ item }">
                <div
                  class="FontSize"
                  v-if="purchaseOrderFor === 'EXISTING_QUOTATION'"
                >
                  {{ item.quotation_display_id }}
                </div>
              </template>

              <template v-slot:[`item.customer_phone_number`]="{ item }">
                <div
                  class="FontSize"
                  v-if="purchaseOrderFor === 'EXISTING_QUOTATION'"
                >
                  {{ item.customer_phone_number }}
                </div>
              </template>

              <template v-slot:[`item.customer_email_id`]="{ item }">
                <div
                  class="FontSize"
                  v-if="purchaseOrderFor === 'EXISTING_QUOTATION'"
                >
                  {{ item.customer_email_id }}
                </div>
              </template>
            </v-data-table>
            <!-- <div v-for="(ticketItem, idx) in GetAllSearchedTickets" :key="idx">
              <v-btn text @click="SelectedTicketItem(idx)">
                <span class="FontSize">
                  {{ ticketItem.custom_ticket_id }}
                </span>
              </v-btn>
            </div> -->
          </v-card>
        </div>
        <div v-if="ConditionsToDisplayTicketOrQuotationData">
          <v-row>
            <v-col cols="5">
              <div style="width: 100%; border: 1px dashed black" class="pa-5">
                <div v-if="purchaseOrderFor === 'EXISTING_TICKET'">
                  <span><strong>Ticket Details</strong></span>
                  <v-row class="mt-2 pa-0" style="line-height: 0px">
                    <v-col
                      cols="12"
                      lg="6"
                      md="6"
                      sm="12"
                      xs="12"
                      class="pt-2 pb-2"
                    >
                      <p class="FontSize">
                        <strong>Ticket ID: </strong
                        >{{ ticketObj.custom_ticket_id || "N/A" }}
                      </p>
                    </v-col>
                    <!-- <div>
                      <p class="FontSize">
                        <strong>Customer Company Name:</strong
                        >{{ ticketObj.customer_company_name || "N/A" }}
                      </p>
                    </div> -->
                    <v-col
                      cols="12"
                      lg="12"
                      md="12"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-2"
                    >
                      <p class="FontSize">
                        <strong>Customer Name: </strong
                        >{{ ticketObj.customer_name || "N/A" }}
                      </p>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="12"
                      md="12"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-2"
                    >
                      <p class="FontSize">
                        <strong>Phone: </strong
                        >{{
                          ticketObj.customer_primary_contact_number ||
                          ticketObj.customer_phone_number ||
                          "N/A"
                        }}
                      </p>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="12"
                      md="12"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-2"
                    >
                      <p class="FontSize">
                        <strong>Email ID: </strong
                        >{{ ticketObj.customer_email_id || "N/A" }}
                      </p>
                    </v-col>
                  </v-row>
                  <div class="mt-3">
                    <v-row>
                      <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        class="pt-0 pb-0"
                      >
                        <v-select
                          style="width: 200px"
                          class="FontSize"
                          v-model="lineItem"
                          dense
                          outlined
                          label="Line Item Type"
                          :items="lineItems"
                        ></v-select>
                      </v-col>
                      <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        v-if="
                          lineItem === 'COMPONENT' || lineItem === 'PRODUCT'
                        "
                        class="pt-0 pb-0"
                      >
                        <v-text-field
                          style="width: 200px"
                          class="FontSize"
                          v-model="category"
                          dense
                          outlined
                          label="Category"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        v-if="
                          lineItem === 'COMPONENT' || lineItem === 'PRODUCT'
                        "
                        class="pt-0 pb-0"
                      >
                        <v-text-field
                          style="width: 200px"
                          class="FontSize"
                          v-model="product"
                          dense
                          outlined
                          label="Product"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        v-if="lineItem === 'COMPONENT'"
                        class="pt-0 pb-0"
                      >
                        <v-select
                          style="width: 200px"
                          class="FontSize"
                          v-model="component"
                          dense
                          outlined
                          label="Components"
                          :items="componentItems"
                          item-text="component_name"
                          item-value="component_id"
                        ></v-select>
                      </v-col>
                      <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        v-if="territoryIDFromApi === true"
                        class="pt-0 pb-0"
                      >
                        <v-select
                          style="width: 250px"
                          multiple
                          dense
                          outlined
                          v-model="selectTerritories"
                          label="Select Territories *"
                          :items="territoryList"
                          item-text="territory_name"
                          item-value="territory_id"
                        >
                          <template v-slot:selection="{ item, index }">
                            <v-chip x-small v-if="index === 0">
                              <span>{{ item.territory_name }}</span>
                            </v-chip>
                            <span
                              v-if="index === 0 && selectTerritories.length > 1"
                              class="grey--text text-caption"
                            >
                              (+{{ selectTerritories.length - 1 }}
                              others)
                            </span>
                          </template></v-select
                        >
                      </v-col>
                      <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        class="pt-0 pb-0"
                      >
                        <v-btn
                          small
                          color="primary"
                          @click="SearchVendorMethod()"
                          class="text-center"
                          ><v-icon class="pr-2">mdi-magnify</v-icon
                          >Vendors</v-btn
                        >
                      </v-col>
                    </v-row>
                  </div>
                  <div>
                    <v-data-table
                      style="cursor: pointer"
                      :headers="
                        lineItem === 'COMPONENT' || lineItem === 'PRODUCT'
                          ? componentProductHeader
                          : lineItem === 'LABOUR'
                          ? labourHeader
                          : lineItem === 'OTHERS'
                          ? otherHeader
                          : undefined
                      "
                      :items="
                        lineItem === 'COMPONENT' || lineItem === 'PRODUCT'
                          ? vendorComponentList
                          : null
                      "
                      @click:row="selectedTableRow"
                      class="FontSize"
                    >
                      <template v-slot:[`item.vendor_name`]="{ item }">
                        <div class="FontSize">
                          {{ item.vendor_name }}
                        </div>
                      </template>
                      <template v-slot:[`item.vendor_email_id`]="{ item }">
                        <div class="FontSize">
                          {{ item.vendor_email_id }}
                        </div>
                      </template>
                      <template v-slot:[`item.price`]="{ item }">
                        <div class="FontSize">
                          {{ item.price }}
                        </div>
                      </template>
                    </v-data-table>
                  </div>
                </div>
                <div v-if="purchaseOrderFor === 'EXISTING_QUOTATION'">
                  <span><strong>Quotation Details</strong></span>
                  <v-row class="mt-2 pa-0" style="line-height: 0px">
                    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                      <p class="FontSize">
                        <strong>Customer ID: </strong
                        >{{ quotationObj.custom_ticket_id || "N/A" }}
                      </p>
                    </v-col>
                    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                      <p class="FontSize">
                        <strong>Customer Name: </strong
                        >{{ quotationObj.customer_name || "N/A" }}
                      </p>
                    </v-col>
                    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                      <p class="FontSize">
                        <strong>Customer Phone No: </strong
                        >{{ quotationObj.customer_phone_number || "N/A" }}
                      </p>
                    </v-col>
                    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                      <p class="FontSize">
                        <strong>Email ID: </strong
                        >{{ quotationObj.customer_email_id || "N/A" }}
                      </p>
                    </v-col>
                  </v-row>
                  <div class="mt-2">
                    <v-data-table
                      dense
                      :headers="quotationDetailsHeaders"
                      :items="quotationObj.components_list"
                    >
                      <template v-slot:[`item.category_name`]="{ item }">
                        <div class="FontSize">
                          {{ item.category_name }}
                        </div>
                      </template>
                      <template v-slot:[`item.component_name`]="{ item }">
                        <div class="FontSize">
                          {{ item.component_name }}
                        </div>
                      </template>
                      <template v-slot:[`item.product_name`]="{ item }">
                        <div class="FontSize">
                          {{ item.product_name }}
                        </div>
                      </template>
                      <template v-slot:[`item.action`]="{ item }">
                        <v-btn
                          text
                          color="primary"
                          class="FontSize text-capitalize"
                          @click="openSelectVendorsDialogMethod(item)"
                          ><v-icon small>mdi-magnify</v-icon>Vendors</v-btn
                        >
                      </template>
                    </v-data-table>
                  </div>
                  <!-- <v-row>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-select
                        style="width: 200px"
                        class="FontSize"
                        v-model="lineItem"
                        dense
                        outlined
                        label="Line Item Type"
                        :items="lineItems"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      v-if="lineItem === 'COMPONENT' || lineItem === 'PRODUCT'"
                    >
                      <v-select
                        style="width: 200px"
                        class="FontSize"
                        v-model="category"
                        dense
                        outlined
                        label="Category"
                        :items="quotationObj.components_list"
                        item-text="category_name"
                        item-value="category_id"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      v-if="lineItem === 'COMPONENT'"
                    >
                      <v-text-field
                        style="width: 200px"
                        class="FontSize"
                        v-model="product"
                        dense
                        outlined
                        label="Product"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      v-if="lineItem === 'COMPONENT'"
                    >
                      <v-text-field
                        style="width: 200px"
                        class="FontSize"
                        v-model="component"
                        dense
                        outlined
                        label="Components"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      v-if="territoryIDFromApi === true"
                    >
                      <v-select
                        style="width: 250px"
                        multiple
                        dense
                        outlined
                        v-model="selectTerritories"
                        label="Select Territories *"
                        :items="territoryList"
                        item-text="territory_name"
                        item-value="territory_id"
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip x-small v-if="index === 0">
                            <span>{{ item.territory_name }}</span>
                          </v-chip>
                          <span
                            v-if="index === 0 && selectTerritories.length > 1"
                            class="grey--text text-caption"
                          >
                            (+{{ selectTerritories.length - 1 }}
                            others)
                          </span>
                        </template></v-select
                      >
                    </v-col>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                      <v-btn
                        dense
                        color="primary"
                        @click="SearchVendorMethod()"
                        class="FontSize text-center"
                        >Search<v-icon class="pl-2">mdi-magnify</v-icon></v-btn
                      >
                    </v-col>
                  </v-row> -->
                </div>
              </div>
            </v-col>
            <v-col cols="7">
              <div style="border: 1px dashed black" class="pa-3">
                <v-form ref="selectedRowForm">
                  <div
                    style="
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap;
                      justify-content: space-between;
                    "
                  >
                    <div>
                      <v-text-field
                        dense
                        outlined
                        label="Vendor Name"
                        v-model="selectedVendorName"
                        class="FontSize"
                        readonly
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-text-field
                        readonly
                        dense
                        outlined
                        label="Category"
                        v-model="selectedCategory"
                        class="FontSize"
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-text-field
                        dense
                        outlined
                        label="Product"
                        v-model="selectedProduct"
                        class="FontSize"
                        readonly
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-text-field
                        type="number"
                        dense
                        outlined
                        label="Price"
                        v-model="selectedPrice"
                        class="FontSize"
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-text-field
                        type="number"
                        dense
                        outlined
                        label="Quantity"
                        v-model="quantity"
                        class="FontSize"
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-text-field
                        type="number"
                        dense
                        outlined
                        label="GST"
                        v-model="selectedGST"
                        class="FontSize"
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-text-field
                        type="number"
                        dense
                        outlined
                        label="Discount"
                        v-model="selectedDiscount"
                        class="FontSize"
                      >
                      </v-text-field>
                    </div>
                  </div>
                </v-form>
                <div class="d-flex">
                  <div class="mr-2">
                    <v-btn
                      class="FontSize"
                      v-if="selectedVendorName || null"
                      color="primary"
                      @click="$refs.selectedRowForm.reset()"
                      >Clear<v-icon small class="pl-1">mdi-close</v-icon></v-btn
                    >
                  </div>
                  <div class="ml-2">
                    <v-btn
                      class="FontSize"
                      v-if="selectedVendorName || null"
                      color="primary"
                      @click="AddSelectedItemToTableMethod()"
                      >Add<v-icon small class="pl-1">mdi-plus</v-icon></v-btn
                    >
                  </div>
                </div>
              </div>

              <div>
                <v-expansion-panels
                  dense
                  class="mt-3"
                  accordion
                  v-model="ProductPanel"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      color="#e085ed"
                      class="black--text"
                      >COMPONENTS & PRODUCTS</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                      <v-data-table
                        dense
                        :headers="productPreviewHeader"
                        :items="selectedProductComponentItems"
                      >
                        <template v-slot:[`item.vendor_name`]="{ item }">
                          <div class="FontSize">
                            {{ item.vendor_name }}
                          </div>
                        </template>
                        <template v-slot:[`item.category_name`]="{ item }">
                          <div class="FontSize">
                            {{ item.category_name }}
                          </div>
                        </template>
                        <template v-slot:[`item.product_name`]="{ item }">
                          <div class="FontSize">
                            {{ item.product_name }}
                          </div>
                        </template>
                        <template v-slot:[`item.component_name`]="{ item }">
                          <div class="FontSize">
                            {{ item.component_name }}
                          </div>
                        </template>
                        <template v-slot:[`item.price`]="{ item }">
                          <div class="FontSize">
                            {{ item.price }}
                          </div>
                        </template>
                        <template v-slot:[`item.purchased_count`]="{ item }">
                          <div class="FontSize">
                            {{ item.purchased_count }}
                          </div>
                        </template>
                        <template v-slot:[`item.gst`]="{ item }">
                          <div class="FontSize">
                            {{ item.gst }}
                          </div>
                        </template>
                        <template v-slot:[`item.sub_total`]="{ item }">
                          <div class="FontSize">
                            {{ item.sub_total }}
                          </div>
                        </template>
                        <template v-slot:[`item.discont_percentage`]="{ item }">
                          <div class="FontSize">
                            {{ item.discont_percentage }}
                          </div>
                        </template>
                        <template v-slot:[`item.total_price`]="{ item }">
                          <div class="FontSize">
                            {{ item.total_price }}
                          </div>
                        </template>
                        <template v-slot:[`item.action`]="{ item, index }">
                          <div>
                            <v-btn
                              icon
                              @click="deleteSelectedCompMethod(item, index)"
                              ><v-icon color="red" small
                                >mdi-delete</v-icon
                              ></v-btn
                            >
                          </div>
                        </template>
                      </v-data-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-col>
          </v-row>
          <div
            class="mt-4 mb-4 pa-5"
            style="border: 1px dashed black; width: 100%"
          >
            <div class="d-flex align-center">
              <div>
                <span
                  ><strong
                    >Delivery Address <span style="color: red">*</span></strong
                  ></span
                >
              </div>
              <div class="ml-3">
                <v-btn dense color="primary" @click="OpenDeliveryDialogMethod()"
                  ><v-icon>mdi-arrow-right</v-icon></v-btn
                >
              </div>
            </div>
            <v-row v-if="addressReview" class="mt-3">
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <span class="FontSize"
                  ><strong>Shipping Address: </strong>
                  {{ shippingAddressObj.shipping_address }}</span
                >
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <span class="FontSize"
                  ><strong>Billing Address: </strong>
                  {{ billingAddressObj.billing_address }}</span
                >
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn
          v-show="addedDataList.length > 0"
          :loading="btnLoading"
          small
          class="mr-2"
          color="primary"
          @click="generatePOMethod()"
          >Generate</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { SearchTickets } from "@/graphql/queries.js";
import { SearchQuotationPdf } from "@/graphql/queries.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import { GetAllTaggedComp } from "@/mixins/Product/GetAllTaggedComp.js";
import { ListAllVendorDetails } from "@/mixins/Approvals/GetVendorDetails.js";
import { ListTerritoriesAndPincodes } from "@/graphql/queries.js";
import BillingShippingAddress from "@/components/PurchaseOrder/Dialogs/AddressDialog.vue";
import { GeneratePurchaseOrder } from "@/graphql/mutations.js";
import SelectVendors from "@/components/PurchaseOrder/Dialogs/SelectVendorsDialog.vue";

export default {
  mixins: [GetAllTaggedComp, ListAllVendorDetails],
  components: {
    Snackbar,
    Overlay,
    BillingShippingAddress,
    SelectVendors,
  },
  data: () => ({
    btnLoading: false,
    renderComp: true,
    overlay: false,
    purchaseOrderFor: "EXISTING_TICKET",
    purchaseOrderForItems: [
      { title: "Existing Ticket", value: "EXISTING_TICKET" },
      { title: "Existing Quotation", value: "EXISTING_QUOTATION" },
    ],
    searchTicket: "",
    searchQuotation: "",
    isSearching: false,
    SnackBarComponent: {},
    GetAllSearchedTickets: [],
    ticketObj: {},
    showTicketListTable: false,
    ProductPanel: 0,
    laboursPanel: 0,
    OtheropenPanel: 0,
    lineItem: "COMPONENT",
    // lineItems: ["COMPONENT", "PRODUCT", "LABOUR", "OTHERS"],
    lineItems: ["COMPONENT", "PRODUCT"],
    componentProductHeader: [
      { text: "Vendor Name", value: "vendor_name" },
      { text: "Vendor Email ID", value: "vendor_email_id" },
      { text: "Price", value: "price" },
    ],
    // productHeader: [
    //   { text: "Product", value: "service_name" },
    //   { text: "Price", value: "service_price" },
    // ],
    labourHeader: [
      { text: "Service Name", value: "service_type_name" },
      { text: "Price", value: "service_type_price" },
    ],
    otherHeader: [
      { text: "Service Name", value: "service_name" },
      { text: "GST %", value: "gst" },
      { text: "Price", value: "price" },
    ],
    productPreviewHeader: [
      { text: "Vendor Name", value: "vendor_name", width: "110px" },
      { text: "Category Name", value: "category_name", width: "110px" },
      { text: "Product Name", value: "product_name", width: "110px" },
      { text: "Component Name", value: "component_name", width: "110px" },
      { text: "Price", value: "price" },
      { text: "Qty", value: "purchased_count" },
      { text: "GST %", value: "gst" },
      { text: "Sub Total", value: "sub_total" },
      { text: "Discount", value: "discont_percentage" },
      { text: "Total", value: "total_price" },
      { text: "Delete", value: "action" },
    ],
    labourExpHeader: [
      { text: "Service Name", value: "product_name" },
      { text: "Price", value: "price" },
      { text: "Quantity", value: "quantity" },
      { text: "GST %", value: "gst" },
      { text: "Total", value: "per_component_total_amount" },
    ],
    othersPreviewHeader: [
      { text: "Service Name", value: "component_name" },
      { text: "GST %", value: "gst" },
      { text: "Price", value: "price" },
      { text: "Total", value: "per_component_total_amount" },
    ],
    searchedTicketHeader: [
      { text: "Ticket ID", value: "custom_ticket_id" },
      { text: "Customer", value: "customer_name" },
      { text: "Product", value: "service_name" },
    ],
    searchedQuotationHeader: [
      { text: "Quotation ID", value: "quotation_display_id" },
      { text: "Ticket ID", value: "custom_ticket_id" },
      { text: "Customer", value: "customer_name" },
      { text: "Phone", value: "customer_phone_number" },
      { text: "Email ID", value: "customer_email_id" },
    ],
    quotationDetailsHeaders: [
      { text: "Category Name", value: "category_name", sortable: false },
      { text: "Component Name", value: "component_name", sortable: false },
      { text: "Product Name", value: "product_name", sortable: false },
      { text: "Search", value: "action", width: "10", sortable: false },
    ],
    category: "",
    product: "",
    component: "",
    componentItems: [],
    vendorComponentList: [],
    selectedCategory: "",
    selectedProduct: "",
    selectedComponent: "",
    selectedPrice: null,
    quantity: null,
    selectedGST: null,
    selectedProductComponentItems: [],
    territoryList: [],
    selectTerritories: "",
    territoryIDFromApi: false,
    addedDataList: [],
    subTotalAmount: 0,
    grandTotal: 0,
    discount: 0,
    addressDialog: false,
    searchedQuotationList: [],
    showQuotationListTable: false,
    quotationObj: {},
    // quotationComponentId: "",
    // quotationServiceId: "",
    selectedVendorName: "",
    selectedVendorDetails: {},
    selectVendorsDialog: false,
    StoreObj: {},
    addressObj: {},
    shippingAddressObj: {},
    billingAddressObj: {},
    addressReview: false,
    selectedDiscount: null,
  }),
  watch: {
    purchaseOrderFor(val) {
      if (val) {
        this.isSearching = false;
        this.searchQuotation = "";
        this.searchTicket = "";
        this.showQuotationListTable = false;
        this.showTicketListTable = false;
      }
    },
    async component(val) {
      if (val) {
        // this.vendorComponentList = await this.ListAllVendorDetailsMethod(
        //   this.ticketObj.category_id,
        //   this.ticketObj.service_id,
        //   this.component,
        //   this.ticketObj.ticket_pincode,
        //   this.territoryList
        // );
      }
    },

    lineItem(val) {
      if (val === "PRODUCT") {
        this.component = "";
        this.vendorComponentList = [];
      } else if (val === "COMPONENT") {
        this.vendorComponentList = [];
      }
    },

    async territoryList(val) {
      if (val[0] === "empty_array") {
        this.territoryIDFromApi = true;
        try {
          const result = await API.graphql(
            graphqlOperation(ListTerritoriesAndPincodes, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                territory_status: "ACTIVE",
                territory_type: "NON_GEO_BASED",
                required_type: "TERRITORY",
              },
            })
          );
          const response = JSON.parse(result.data.ListTerritoriesAndPincodes)
            .data.Items;
          this.territoryList = response;
        } catch (error) {
          console.log("Error", error);
        }
      }
    },

    discount(val) {
      if (val) {
        this.grandTotal =
          this.subTotalAmount - this.subTotalAmount * (this.discount / 100);
        this.grandTotal = parseFloat(this.grandTotal.toFixed(2));
      }
    },

    // Used for EXISTING_QUOTATION not required now because I implemented table to show the details
    // category(val) {
    //   if (val && this.purchaseOrderFor === "EXISTING_QUOTATION") {
    //     const componentListIndex = this.quotationObj.components_list.findIndex(
    //       (item) => item.category_id === val
    //     );
    //     this.product =
    //       this.quotationObj.components_list[componentListIndex].product_name;
    //     this.component =
    //       this.quotationObj.components_list[componentListIndex].component_name;
    //     this.quotationServiceId =
    //       this.quotationObj.components_list[componentListIndex].service_id;
    //     this.quotationComponentId =
    //       this.quotationObj.components_list[componentListIndex].component_id;
    //     console.log(
    //       this.category,
    //       this.quotationServiceId,
    //       this.quotationComponentId
    //     );
    //   }
    // },
  },

  computed: {
    ConditionsToDisplaySearchTable() {
      if (this.purchaseOrderFor === "EXISTING_TICKET") {
        if (this.GetAllSearchedTickets.length > 1 && this.showTicketListTable) {
          return true;
        }
      } else if (this.purchaseOrderFor === "EXISTING_QUOTATION") {
        if (
          this.searchedQuotationList.length > 1 &&
          this.showQuotationListTable
        ) {
          return true;
        }
      }
    },

    ConditionsToDisplayTicketOrQuotationData() {
      if (
        Object.keys(this.ticketObj).length > 0 &&
        this.purchaseOrderFor === "EXISTING_TICKET" &&
        this.isSearching
      ) {
        return true;
      } else if (
        this.purchaseOrderFor === "EXISTING_QUOTATION" &&
        this.isSearching &&
        Object.keys(this.quotationObj).length > 0
      ) {
        return true;
      }
    },

    QuotationProduct() {},
  },
  methods: {
    async GetTicketsByFilterMethod() {
      if (this.searchTicket.length >= 3) {
        this.isSearching = true;
        await this.GetAllTicketsBySearchMethod();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly Enter Ticket ID more than 2 characters!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    ClearMethod() {
      this.isSearching = false;
      this.addedDataList = [];
      this.selectedProductComponentItems = [];
      if (this.purchaseOrderFor === "EXISTING_TICKET") {
        this.searchTicket = "";
        this.GetAllSearchedTickets = [];
        this.componentItems = [];
        this.territoryList = [];
        this.territoryIDFromApi = false;
        this.showTicketListTable = false;
        this.ticketObj = {};
      } else if (this.purchaseOrderFor === "EXISTING_QUOTATION") {
        this.searchQuotation = "";
        this.searchedQuotationList = [];
        this.showQuotationListTable = false;
        this.quotationObj = {};
      }
    },

    async GetAllTicketsBySearchMethod() {
      try {
        this.GetAllSearchedTickets = [];
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(SearchTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              camparison_operator: "CONTAINS",
              field_value: this.searchTicket,
              field_name: "ticket_id",
              ticket_type: "ASSIGNED_TICKET",
              ticket_status: undefined,
              search_type: undefined,
            },
          })
        );
        const response = JSON.parse(result.data.SearchTickets);
        if (response.status === "SUCCESS") {
          this.overlay = false;
          this.GetAllSearchedTickets = response.data.items;
          if (this.GetAllSearchedTickets.length === 1) {
            this.ticketObj = this.GetAllSearchedTickets[0];
            this.category = this.ticketObj.category_name;
            this.product = this.ticketObj.service_name;
            this.territoryList =
              this.ticketObj.ticket_territories.length > 0
                ? this.ticketObj.ticket_territories
                : ["empty_array"];
            this.territoryIDFromApi =
              this.ticketObj.ticket_territories.length === 0 ? true : false;
            await this.GetAllTagCompMethod(this.ticketObj.service_id);
            console.log("SEARCHED_TICKET", this.ticketObj);
          } else if (this.GetAllSearchedTickets.length > 1) {
            this.showTicketListTable = true;
          }
          this.componentItems = this.GetAllTagCompList;
        }
      } catch (error) {
        this.overlay = false;
        this.GetAllSearchedTickets = [];
        this.noDataText = error.errors[0].message;
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
    },

    async getQuotationSearchMethod() {
      if (this.searchQuotation.length >= 3) {
        try {
          this.isSearching = true;
          this.overlay = true;
          const result = await API.graphql(
            graphqlOperation(SearchQuotationPdf, {
              input: {
                user_id: this.$store.getters.get_current_user_details.user_id,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                quotation_status: "ACTIVE",
                field_name: "quotation_display_id",
                field_value: this.searchQuotation,
              },
            })
          );
          const response = JSON.parse(result.data.SearchQuotationPdf).data
            .items;
          this.searchedQuotationList = response;
          if (this.searchedQuotationList.length > 1) {
            this.showQuotationListTable = true;
          } else {
            this.quotationObj = this.searchedQuotationList[0];
          }
          this.overlay = false;
        } catch (error) {
          this.overlay = false;
          this.isSearching = false;
          console.log("Error", error);
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
          SnackbarText: "Kindly Enter Quotation ID more than 2 characters!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    handleRowClickMethod(item, data) {
      if (this.purchaseOrderFor === "EXISTING_TICKET") {
        this.SelectedTicketItem(item, data);
      } else if (this.purchaseOrderFor === "EXISTING_QUOTATION") {
        this.SelectedQuotationItem(item, data);
      }
    },

    SelectedTicketItem(item, data) {
      this.showTicketListTable = false;
      this.ticketObj = this.GetAllSearchedTickets[data.index];
      this.category = this.ticketObj.category_name;
      this.product = this.ticketObj.service_name;
      this.territoryList = this.ticketObj.ticket_territories;
      this.GetAllTagCompMethod(this.ticketObj.service_id);
      this.componentItems = this.GetAllTagCompList;
    },

    SelectedQuotationItem(item, data) {
      this.showQuotationListTable = false;
      this.quotationObj = this.searchedQuotationList[data.index];
    },

    selectedTableRow(item) {
      this.selectedVendorName = item.vendor_name || "";
      this.selectedCategory = item.category_name || "";
      this.selectedProduct = item.product_name || "";
      this.selectedComponent = item.component_name || "";
      this.selectedPrice = item.price || "";
      this.quantity = 1;
      this.selectedDiscount = 0;
      this.selectedGST = item.gst || 0;
      this.selectedVendorDetails = item;
    },

    async SearchVendorMethod() {
      if (
        (this.lineItem === "COMPONENT" && this.component !== "") ||
        this.lineItem === "PRODUCT"
      ) {
        let response;
        if (this.purchaseOrderFor === "EXISTING_TICKET") {
          response = await this.ListAllVendorDetailsMethod(
            this.ticketObj.category_id,
            this.ticketObj.service_id,
            this.component,
            this.ticketObj.ticket_pincode,
            this.territoryIDFromApi === true
              ? this.selectTerritories
              : this.territoryList
          );
        } else if (this.purchaseOrderFor === "EXISTING_QUOTATION") {
          response = await this.ListAllVendorDetailsMethod(
            this.quotationCategoryId,
            this.quotationServiceId,
            this.quotationComponentId
            // this.ticketObj.ticket_pincode,
            // this.territoryIDFromApi === true
            //   ? this.selectTerritories
            //   : this.territoryList
          );
        }

        if (response === undefined) {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "No vendors found!",
          };
          this.renderComp = false;
          this.$nextTick(() => {
            this.renderComp = true;
          });
        } else {
          this.vendorComponentList = response;
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly select component!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    AddSelectedItemToTableMethod() {
      if (this.lineItem === "COMPONENT" || this.lineItem === "PRODUCT") {
        const subTotal = parseFloat(
          (
            this.selectedVendorDetails.price *
              this.quantity *
              (this.selectedGST / 100) +
            this.selectedVendorDetails.price * this.quantity
          ).toFixed(2)
        );
        const vendorDetails = {
          component_name: this.selectedVendorDetails.component_name,
          // Not required for API
          category_name: this.selectedVendorDetails.category_name,
          product_name: this.selectedVendorDetails.product_name,
          price: this.selectedVendorDetails.price,
          // Till Here
          purchased_count: parseFloat(parseFloat(this.quantity).toFixed(2)),
          vendor_name: this.selectedVendorDetails.vendor_name,
          vendor_address: this.selectedVendorDetails.vendor_address,
          vendor_contact_number:
            this.selectedVendorDetails.vendor_primary_contact_number,
          per_component_price: this.selectedVendorDetails.price * this.quantity,
          vendor_id: this.selectedVendorDetails.vendor_id,
          vendor_employee_id: this.selectedVendorDetails.vendor_employee_id,
          vendor_email_id: this.selectedVendorDetails.vendor_email_id,
          sub_total: subTotal,
          total_price: parseFloat(
            (subTotal - subTotal * (this.selectedDiscount / 100)).toFixed(2)
          ),
          discont_percentage: parseFloat(
            parseFloat(this.selectedDiscount).toFixed(2)
          ),
          gst: parseFloat(parseFloat(this.selectedGST).toFixed(2)),
        };
        this.selectedProductComponentItems.push({ ...vendorDetails });
        delete vendorDetails.category_name;
        delete vendorDetails.product_name;
        delete vendorDetails.price;
        const componentDetails = {
          component_id: this.selectedVendorDetails.component_id,
          component_name: this.selectedVendorDetails.component_name,
          service_name: this.selectedVendorDetails.product_name,
          component_code:
            this.selectedVendorDetails.component_code || undefined,
          component_description:
            this.selectedVendorDetails.component_description || undefined,
          approved_component_quantity: parseFloat(this.quantity),
          component_price: this.selectedVendorDetails.price,
          vendor_details: vendorDetails,
          // vendor_name: this.selectedVendorName || "-",
          // category_name: this.selectedCategory || "-",
          // product_name: this.selectedProduct || "-",
          // component_name: this.selectedComponent || "-",
          // price: this.selectedPrice || 0,
          // quantity: this.quantity || 1,
          // gst: this.selectedGST || 0,
          // per_component_total_amount: parseFloat(
          //   (
          //     this.selectedPrice * this.quantity * (this.selectedGST / 100) +
          //     this.selectedPrice * this.quantity
          //   ).toFixed(2)
          // ),
        };

        this.addedDataList.push(componentDetails);
        this.CallCalculationMethod();
        this.$refs.selectedRowForm.reset();
      }
    },

    deleteSelectedCompMethod(item, index) {
      this.selectedProductComponentItems.splice(index, 1);
      this.addedDataList.splice(index, 1);
    },

    CallCalculationMethod() {
      this.addedDataList.map(
        (item) => (this.subTotalAmount += item.per_component_total_amount)
      );
      this.grandTotal =
        this.subTotalAmount - this.subTotalAmount * (this.discount / 100);
      this.grandTotal = parseFloat(this.grandTotal.toFixed(2));
    },

    openSelectVendorsDialogMethod(item) {
      this.StoreObj = item;
      this.selectVendorsDialog = true;
    },

    async generatePOMethod() {
      if (this.addressReview === true) {
        try {
          this.btnLoading = true;
          this.overlay = true;
          const result = await API.graphql(
            graphqlOperation(GeneratePurchaseOrder, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                creator_user_id:
                  this.$store.getters.get_current_user_details.user_id,
                ticket_id:
                  this.ticketObj.ticket_id ||
                  this.quotationObj.ticket_id ||
                  undefined,
                quotation_id:
                  this.purchaseOrderFor === "EXISTING_QUOTATION"
                    ? this.quotationObj.quotation_id
                    : undefined,
                po_shipping_address: this.shippingAddressObj,
                po_billing_address: this.billingAddressObj,
                componetsList: this.addedDataList,
              },
            })
          );
          const response = JSON.parse(result.data.GeneratePurchaseOrder);
          if (response === "SUCCESS") {
            this.btnLoading = false;
            this.overlay = false;
            // this.SnackBarComponent = {
            //   SnackbarVmodel: true,
            //   SnackbarColor: "green",
            //   Top: true,
            //   SnackbarText: "Created Successfully!",
            // };
            // this.renderComp = false;
            // this.$nextTick(() => {
            //   this.renderComp = true;
            // });
            this.GeneratePOEmit(2);
          }
        } catch (error) {
          this.btnLoading = false;
          this.overlay = false;
          console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please review address!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    GeneratePOEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },

    OpenDeliveryDialogMethod() {
      if (this.purchaseOrderFor === "EXISTING_TICKET") {
        this.addressObj = this.ticketObj;
        this.addressObj.object_type = "EXISTING_TICKET";
      } else if (this.purchaseOrderFor === "EXISTING_QUOTATION") {
        this.addressObj = this.quotationObj;
        this.addressObj.object_type = "EXISTING_QUOTATION";
      }
      this.addressDialog = true;
    },

    AddressDialogEmit(Toggle, shippingAddressObj, billingAddressObj) {
      this.addressDialog = false;
      if (Toggle === 2) {
        this.shippingAddressObj = shippingAddressObj;
        this.billingAddressObj = billingAddressObj;
        this.addressReview = true;
      }
    },

    SelectVendorsDialogEmit(Toggle, item) {
      this.selectVendorsDialog = false;
      if (Toggle === 2) {
        this.selectedTableRow(item);
      }
    },
  },
};
</script>
