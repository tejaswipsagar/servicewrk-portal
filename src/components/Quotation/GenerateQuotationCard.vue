<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <LookUpCustomerDialog
      :dialogLookUpCustomer="dialogLookUpCustomer"
      @clicked="dialogLookUpCustomerEmit"
    />
    <DialogAddCustomer
      :StoreObj="StoreObj"
      :dialogAddCustomerToGenerateQuotation="
        dialogAddCustomerToGenerateQuotation
      "
      @clicked="dialogAddCustomerOnQuotationEmit"
    />
    <EditComponentInQuotation
      :StoreObjNew="StoreObjNew"
      :dialogEditComponentInQuotation="dialogEditComponentInQuotation"
      @clicked="dialogEditComponentInQuotationEmit"
    />
    <AddDeliveryDetails
      :AddDeliveryDetailsDialog="AddDeliveryDetailsDialog"
      :DeliveryDialogStoreObj="DeliveryDialogStoreObj"
      @clicked="AddDeliveryDetailsDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          <v-icon small class="mr-2" color="primary">mdi-plus</v-icon>
          <span v-if="StoreObj.action != 'EDIT'">Generate</span>
          <span v-else>Edit</span>
          Quotation
        </div>
        <v-spacer />
        <div v-if="StoreObj.action == 'EDIT'" class="mr-6 mt-4">
          <p
            v-if="
              GetAllSearchedTickets &&
              GetAllSearchedTickets[0] &&
              GetAllSearchedTickets[0].custom_ticket_id
            "
          >
            <strong>Ticket ID :</strong
            >{{ GetAllSearchedTickets[0].custom_ticket_id }}
          </p>
        </div>

        <v-btn
          @click="GenerateQuatationEmit((Toggle = 1))"
          class="primary white--text"
          small
        >
          <v-icon color="white" small>mdi-chevron-double-left</v-icon>
          Back</v-btn
        >
      </v-toolbar>
      <hr />
      <v-card-text class="black--text pb-0">
        <v-form ref="form">
          <v-row no-gutters class="mb-n8 mt-2" v-if="StoreObj.action != 'EDIT'">
            <v-col cols="12" md="2" sm="12" xs="12">
              <v-select
                label="Quotation For *"
                v-model="quotation_for"
                dense
                outlined
                :items="quotation_for_items"
                class="FontSize mr-2"
              >
              </v-select>
            </v-col>
            <v-col
              cols="12"
              md="2"
              sm="12"
              xs="12"
              v-if="quotation_for == 'EXISTING_TICKET'"
            >
              <v-text-field
                dense
                outlined
                label="Search Ticket *"
                v-model="ticket_id_to_search"
                class="FontSize"
              >
                <template v-slot:append>
                  <v-btn
                    icon
                    small
                    color="primary"
                    v-if="isSearching == false"
                    @click.stop="GetTicketsByFilterMethod((isSearching = true))"
                  >
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    color="primary"
                    v-if="isSearching == true"
                    @click="ClearMethod((isSearching = false))"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-col
              cols="2"
              md="2"
              sm="12"
              xs="12"
              v-if="quotation_for == 'DIRECT_QUOTATION'"
            >
              <v-select
                label="Customer"
                class="FontSize"
                outlined
                dense
                v-model="customer_existance"
                :items="customer_existance_items"
              >
              </v-select>
            </v-col>
            <v-col
              cols="12"
              md="2"
              sm="12"
              xs="12"
              v-if="
                quotation_for == 'DIRECT_QUOTATION' &&
                customer_existance == 'NEW_CUSTOMER'
              "
            >
              <v-btn
                small
                @click="dialogAddCustomerToGenerateQuotation = true"
                class="primary white--text mx-4"
                >Add Customer</v-btn
              >
            </v-col>
            <v-col
              cols="12"
              md="2"
              sm="12"
              xs="12"
              v-if="
                quotation_for == 'DIRECT_QUOTATION' &&
                customer_existance == 'EXISTING_CUSTOMER'
              "
            >
              <v-text-field
                dense
                outlined
                readonly
                label="Customer"
                class="FontSize ml-2 black--text"
                v-model="customer_company_name"
              >
                <template v-slot:append>
                  <v-btn
                    icon
                    small
                    color="primary"
                    @click.stop="dialogLookUpCustomer = true"
                  >
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <!-- <v-col
              cols="12"
              md="2"
              sm="12"
              xs="12"
              v-if="
                quotation_for == 'DIRECT_QUOTATION' &&
                customer_existance == 'EXISTING_CUSTOMER'
              "
            >
              <v-text-field
                dense
                outlined
                readonly
                class="FontSize ml-2"
                label="Contact Person"
                v-model="customer_name"
              >
              </v-text-field>
            </v-col> -->
            <v-col
              cols="12"
              md="2"
              sm="12"
              xs="12"
              v-if="DisplayPhEmailCondition"
            >
              <v-text-field
                dense
                outlined
                label="Phone Number *"
                class="FontSize ml-2 black--text"
                v-model="customer_primary_contact_number"
              >
              </v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="2"
              sm="12"
              xs="12"
              v-if="DisplayPhEmailCondition"
            >
              <v-text-field
                dense
                outlined
                label="Email Id *"
                class="FontSize ml-2 black--text"
                v-model="customer_email_id"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row v-else-if="StoreObj.action == 'EDIT'" class="font-weight-bold">
            <v-col cols="12" md="3" sm="12" xs="12">
              Customer :
              <span
                v-if="this.customer_company_name"
                class="font-weight-regular"
              >
                {{ this.customer_company_name }}
              </span>
              <span v-else>-</span>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
              Contact Person :
              <span v-if="this.customer_name" class="font-weight-regular">
                {{ this.customer_name }}
              </span>
              <span v-else>-</span>
            </v-col>
            <v-col cols="12" md="2" sm="12" xs="12">
              Phone :
              <span
                v-if="this.customer_primary_contact_number"
                class="font-weight-regular"
              >
                {{ this.customer_primary_contact_number }}
              </span>
              <span v-else>-</span>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
              Email :
              <span v-if="this.customer_email_id" class="font-weight-regular">
                {{ this.customer_email_id }}
              </span>
              <span v-else>-</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="5" sm="12" xs="12">
              <div style="border: dashed 1px gray">
                <v-card-text
                  v-if="
                    quotation_for == 'EXISTING_TICKET' &&
                    StoreObj.action !== 'EDIT'
                  "
                >
                  <b class="pa-0 ma-0 mt-2"> Ticket Details </b>
                  <v-row
                    no-gutters
                    class="FontSize"
                    v-if="
                      StoreObj.action != 'EDIT' &&
                      GetAllSearchedTickets.length > 0
                    "
                  >
                    <v-col cols="12" md="6" sm="12" xs="12">
                      <p v-if="original_ticket_id">
                        <strong>Ticket ID :</strong
                        >{{ GetAllSearchedTickets[0].custom_ticket_id }}
                      </p>
                    </v-col>
                    <v-col cols="12" md="6" sm="12" xs="12">
                      <p v-if="this.customer_company_name">
                        <strong>Customer Company Name:</strong
                        >{{ this.customer_company_name }}
                      </p>
                    </v-col>
                    <v-col cols="12" md="6" sm="12" xs="12">
                      <p v-if="this.customer_name">
                        <strong>Customer Name :</strong>{{ this.customer_name }}
                      </p>
                      <p v-if="customer_email_id">
                        <strong>Contact Email ID :</strong
                        >{{ customer_email_id }}
                      </p>
                    </v-col>
                    <v-col cols="12" md="6" sm="12" xs="12">
                      <p v-if="this.customer_primary_contact_number">
                        <strong>Phone :</strong
                        >{{ this.customer_primary_contact_number }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text
                  v-if="
                    quotation_for === 'DIRECT_QUOTATION' &&
                    customer_company_name !== '' &&
                    StoreObj.action !== 'EDIT'
                  "
                >
                  <b class="pa-0 ma-0 mt-2"> Customer Details </b>
                  <v-row align="center">
                    <v-col
                      cols="12"
                      lg="6"
                      md="6"
                      sm="12"
                      xs="12"
                      style="line-height: 15px"
                    >
                      <p class="pa-0" style="font-size: 12px">
                        <strong>Customer ID: </strong
                        >{{ customer_company_name || "-" }}
                      </p>
                      <p class="pa-0" style="font-size: 12px">
                        <strong>Customer Phone Number: </strong
                        >{{ customer_primary_contact_number || "-" }}
                      </p>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="6"
                      md="6"
                      sm="12"
                      xs="12"
                      style="line-height: 15px"
                    >
                      <p class="pa-0" style="font-size: 12px">
                        <strong>Customer Name: </strong
                        >{{
                          customer_company_name ||
                          DeliveryDialogStoreObj.customer_name ||
                          "-"
                        }}
                      </p>
                      <p class="pa-0" style="font-size: 12px">
                        <strong>Customer Email ID: </strong
                        >{{ customer_email_id || "-" }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-row>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-autocomplete
                      v-model="product_type"
                      :items="product_type_items"
                      class="FontSize ml-2 mt-2"
                      label="Line Item Type *"
                      outlined
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    xs="12"
                    sm="12"
                    v-if="
                      product_type === 'COMPONENT' || product_type === 'PRODUCT'
                    "
                  >
                    <v-autocomplete
                      v-if="quotation_for === 'DIRECT_QUOTATION'"
                      label="Category *"
                      v-model="category"
                      :items="categoryItems"
                      class="FontSize mt-2"
                      outlined
                      dense
                      item-text="category_name"
                      item-value="category_id"
                    ></v-autocomplete>
                    <v-text-field
                      v-else
                      label="Category *"
                      v-model="categoryForExTi"
                      class="FontSize mt-2"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    xs="12"
                    sm="12"
                    v-if="product_type == 'COMPONENT'"
                  >
                    <v-autocomplete
                      v-if="quotation_for === 'DIRECT_QUOTATION'"
                      label="Product *"
                      dense
                      outlined
                      v-model="product"
                      item-text="service_name"
                      item-value="service_id"
                      class="FontSize mt-2 mr-2"
                      :items="GetServiceByCategoriesList"
                      return-object
                    ></v-autocomplete>
                    <v-text-field
                      v-else
                      label="Product *"
                      dense
                      outlined
                      v-model="productForExiTi"
                      class="FontSize mt-2 mr-2"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-data-table
                  dense
                  height="255"
                  fixed-header
                  style="cursor: pointer"
                  class="elevation-0"
                  :items-per-page="50"
                  @click:row="handleRowClick"
                  :no-data-text="
                    GetAllSearchedTickets.length === 0
                      ? 'No data available'
                      : null
                  "
                  :items="TableDisplayItemCondition"
                  :headers="
                    product_type == 'PRODUCT'
                      ? product_headers
                      : product_type == 'COMPONENT'
                      ? component_headers
                      : product_type == 'LABOUR'
                      ? service_headers
                      : product_type == 'OTHER'
                      ? Other_Headers
                      : []
                  "
                  :footer-props="{
                    'disable-items-per-page': true,
                  }"
                >
                  <template v-slot:[`item.component_name`]="{ item }">
                    <div class="FontSize">{{ item.component_name }}</div>
                  </template>
                  <template v-slot:[`item.service_type_name`]="{ item }">
                    <div class="FontSize" v-if="item.service_type_name">
                      {{ item.service_type_name }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.service_type_price`]="{ item }">
                    <div class="FontSize" v-if="item.service_type_price">
                      {{ item.service_type_price }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.customer_company_name`]="{ item }">
                    <div class="FontSize">{{ item.customer_company_name }}</div>
                    <div class="FontSize">{{ item.customer_name }}</div>
                  </template>
                  <template v-slot:[`item.customer_phone_number`]="{ item }">
                    <div class="FontSize">{{ item.customer_phone_number }}</div>
                    <div class="FontSize">{{ item.customer_email_id }}</div>
                  </template>
                  <template v-slot:[`item.price`]="{ item }">
                    <div class="FontSize" v-if="item.service_price">
                      {{ item.service_price }}
                    </div>
                    <div v-else>-</div>
                  </template>

                  <template v-slot:[`item.category_name`]="{ item }">
                    <div class="FontSize">{{ item.category_name }}</div>
                    <div
                      class="FontSize"
                      v-if="quotation_for == 'EXISTING_TICKET'"
                    >
                      {{ item.service_name }}
                    </div>
                  </template>
                  <template v-slot:[`item.product_name`]="{ item }">
                    <div class="FontSize">{{ item.product_name }}</div>
                  </template>
                  <template v-slot:[`item.service_price`]="{ item }">
                    <div class="FontSize">{{ item.service_price }}</div>
                  </template>
                  <template v-slot:[`item.setting_price`]="{ item }">
                    <div class="FontSize" v-if="item.setting_price">
                      {{ item.setting_price }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.setting_name`]="{ item }">
                    <div class="FontSize">{{ item.setting_name }}</div>
                  </template>
                  <template v-slot:[`item.component_product_code`]="{ item }">
                    <div class="FontSize" v-if="item.component_product_code">
                      {{ item.component_product_code }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.service_name`]="{ item }">
                    <div class="FontSize" v-if="item.service_name">
                      {{ item.service_name }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.component_price`]="{ item }">
                    <div class="FontSize" v-if="item.component_price">
                      {{ item.component_price }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.gst`]="{ item }">
                    <div class="FontSize" v-if="item.service_gst">
                      {{ item.service_gst }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.price`]="{ item }">
                    <div class="FontSize" v-if="item.service_cost">
                      {{ item.service_cost }}
                    </div>
                    <div v-else>-</div>
                  </template>
                </v-data-table>
              </div>
            </v-col>
            <v-col cols="12" md="7" sm="12" xs="12">
              <div
                style="
                  border: dashed 1px grey;
                  display: flex;
                  flex-wrap: wrap;
                  flex-direction: row;
                "
              >
                <div v-if="product_type === 'COMPONENT'">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mt-3 ml-3"
                    label="Component *"
                    v-model="component_name"
                  ></v-text-field>
                </div>
                <div v-if="product_type === 'PRODUCT'">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mt-3 ml-3"
                    label="Product *"
                    v-model="product_name"
                  ></v-text-field>
                </div>
                <div
                  v-if="product_type === 'LABOUR' || product_type == 'OTHER'"
                >
                  <v-text-field
                    dense
                    outlined
                    class="FontSize mt-3 ml-3"
                    label="Service Name"
                    v-model="serviceTypeName"
                  ></v-text-field>
                </div>
                <div v-if="product_type == 'COMPONENT'">
                  <v-text-field
                    dense
                    outlined
                    label="Comp. Code"
                    class="FontSize mt-3 ml-3 mr-2"
                    v-model="component_code"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    dense
                    outlined
                    label="Price *"
                    type="number"
                    class="FontSize ml-3 mr-3 mt-3"
                    v-model="price"
                  ></v-text-field>
                </div>
                <div v-if="product_type !== 'OTHER'">
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    class="FontSize mt-3 ml-3"
                    label="Quantity *"
                    v-model="quantity"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    :class="
                      product_type == 'COMPONENT'
                        ? 'FontSize ml-3 mt-3'
                        : 'FontSize ml-3 mt-3'
                    "
                    label="Discount % *"
                    v-model="discount"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    dense
                    outlined
                    type="number"
                    :class="
                      product_type == 'COMPONENT'
                        ? 'FontSize ml-3 mt-3'
                        : 'FontSize ml-3 mt-3'
                    "
                    label="Tax % *"
                    v-model="gst"
                  ></v-text-field>
                </div>
                <div>
                  <v-btn
                    v-show="
                      component_name !== '' &&
                      component_code !== '' &&
                      price !== '' &&
                      quantity > 0
                    "
                    :class="
                      product_type == 'COMPONENT'
                        ? 'primary white--text ml-3 mt-3'
                        : 'primary white--text FontSize ml-3 mt-3'
                    "
                    small
                    @click="ClearSelectedTicketMethod()"
                    >Clear<v-icon>mdi-close</v-icon></v-btn
                  >
                  <v-btn
                    v-if="product_type == 'OTHER'"
                    v-show="price !== ''"
                    :class="
                      product_type == 'COMPONENT'
                        ? 'primary white--text ml-3 mt-3'
                        : 'primary white--text FontSize ml-3 mt-3'
                    "
                    small
                    @click="ClearSelectedTicketMethod()"
                    >Clear<v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
                <div>
                  <v-btn
                    :class="
                      product_type == 'COMPONENT'
                        ? 'primary white--text ml-3 mt-3'
                        : 'primary white--text FontSize ml-3 mt-3'
                    "
                    small
                    @click="pushProductMethod()"
                    >Add</v-btn
                  >
                </div>
                <!-- <v-row no-gutters>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mt-3 ml-3"
                      :label="
                        product_type == 'COMPONENT'
                          ? 'Component *'
                          : product_type == 'PRODUCT'
                          ? 'Product *'
                          : 'Service Type *'
                      "
                      v-model="component_name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                    xs="12"
                    v-if="product_type == 'COMPONENT'"
                  >
                    <v-text-field
                      dense
                      outlined
                      label="Comp. Code"
                      class="FontSize mt-3 ml-3 mr-2"
                      v-model="component_code"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Price *"
                      type="number"
                      class="FontSize ml-3 mr-3 mt-3"
                      v-model="price"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      class="FontSize mt-3"
                      label="Quantity *"
                      v-model="quantity"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      :class="
                        product_type == 'COMPONENT'
                          ? 'FontSize ml-3'
                          : 'FontSize ml-3 mt-3'
                      "
                      label="Tax % *"
                      v-model="gst"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <div style="display: flex; flex-direction: row">
                      <div>
                        <v-btn
                          v-show="
                            component_name !== '' &&
                            component_code !== '' &&
                            price !== '' &&
                            quantity > 0
                          "
                          :class="
                            product_type == 'COMPONENT'
                              ? 'primary white--text ml-3'
                              : 'primary white--text FontSize ml-3 mt-3'
                          "
                          small
                          @click="ClearSelectedTicketMethod()"
                          >Clear<v-icon>mdi-close</v-icon></v-btn
                        >
                      </div>
                      <div>
                        <v-btn
                          :class="
                            product_type == 'COMPONENT'
                              ? 'primary white--text ml-3'
                              : 'primary white--text FontSize ml-3 mt-3'
                          "
                          small
                          @click="pushProductMethod()"
                          >Add</v-btn
                        >
                      </div>
                    </div>
                  </v-col>
                </v-row> -->
              </div>

              <!-- <div style="border: dashed 1px gray" class="mt-3"> -->
              <v-expansion-panels
                dense
                class="mt-3"
                accordion
                v-model="ProductPanel"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header color="#e085ed" class="black--text"
                    >PRODUCT & COMPONENT</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-data-table
                      dense
                      fixed-header
                      height="auto"
                      class="elevation-0 TableDataClass"
                      :items-per-page="50"
                      :no-data-text="noDataTextInBillPreview"
                      :items="produtComponentList"
                      :headers="productsPriviewHeaders"
                      hide-default-footer
                      :footer-props="{
                        'disable-items-per-page': true,
                      }"
                    >
                      <template v-slot:[`item.product_name`]="{ item }">
                        <div class="FontSize" v-if="item.product_name">
                          {{ item.product_name }}
                        </div>
                        <div v-else class="FontSize">-</div>
                      </template>
                      <template v-slot:[`item.component_name`]="{ item }">
                        <div class="FontSize" v-if="item.component_name">
                          {{ item.component_name }}
                        </div>
                        <div
                          class="FontSize"
                          v-else-if="item.service_type_name"
                        >
                          {{ item.service_type_name }}
                        </div>
                      </template>
                      <!-- <template v-slot:[`item.quantity`]="{ item, index }">
                        <div>
                          <span
                            >{{ item.quantity }}
                            <v-btn
                              icon
                              @click="EditQtyDialogMethod(item, index)"
                              ><v-icon color="green" size="17"
                                >mdi-pencil</v-icon
                              ></v-btn
                            ></span
                          >
                        </div>
                      </template> -->
                      <template v-slot:[`item.gst`]="{ item }">
                        <div
                          class="FontSize"
                          v-if="item.gst != undefined && item.gst != null"
                        >
                          {{ item.gst }}
                        </div>
                        <div v-else>0</div>
                      </template>
                      <template v-slot:[`item.discount`]="{ item }">
                        <div
                          class="FontSize"
                          v-if="
                            item.discount !== undefined &&
                            item.discount !== null
                          "
                        >
                          {{ item.discount }}
                        </div>
                        <div v-else>-</div>
                      </template>
                      <template v-slot:[`item.actions`]="{ item, index }">
                        <v-btn icon>
                          <v-icon
                            color="green"
                            small
                            @click="EditDataInTableMethod(item, index)"
                            >mdi-pencil</v-icon
                          >
                        </v-btn>
                        <v-btn icon>
                          <v-icon
                            color="red"
                            small
                            @click="DeleteDataFromTableMethod(item, index)"
                            >mdi-delete</v-icon
                          >
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-expansion-panels
                dense
                class="mt-3"
                accordion
                v-model="laboursPanel"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header color="#e085ed" class="black--text"
                    >LABOURS</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-data-table
                      dense
                      fixed-header
                      height="auto"
                      class="elevation-0 TableDataClass"
                      :items-per-page="50"
                      :no-data-text="noDataTextInBillPreview"
                      :items="laboursList"
                      :headers="labourHeaders"
                      hide-default-footer
                      :footer-props="{
                        'disable-items-per-page': true,
                      }"
                    >
                      <template v-slot:[`item.actions`]="{ item, index }">
                        <v-btn icon>
                          <v-icon
                            color="green"
                            small
                            @click="EditDataInTableMethod(item, index)"
                            >mdi-pencil</v-icon
                          >
                        </v-btn>
                        <v-btn
                          icon
                          @click="DeleteDataFromTableMethod(item, index)"
                        >
                          <v-icon color="red" small>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:[`item.discount`]="{ item }">
                        <div
                          class="FontSize"
                          v-if="
                            item.discount !== undefined &&
                            item.discount !== null
                          "
                        >
                          {{ item.discount }}
                        </div>
                        <div v-else>-</div>
                      </template></v-data-table
                    >
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-expansion-panels
                dense
                class="mt-3"
                accordion
                v-model="OtheropenPanel"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header color="#e085ed" class="black--text"
                    >Others</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <v-data-table
                      dense
                      fixed-header
                      :items="othersList"
                      :headers="OthersPreviewHeaders"
                      hide-default-footer
                      class="TableDataClass"
                    >
                      <template v-slot:[`item.discount`]="{ item }">
                        <div
                          class="FontSize"
                          v-if="
                            item.discount !== undefined &&
                            item.discount !== null
                          "
                        >
                          {{ item.discount }}
                        </div>
                        <div v-else>-</div>
                      </template>
                      <template v-slot:[`item.actions`]="{ item, index }">
                        <v-btn icon @click="EditDataInTableMethod(item, index)">
                          <v-icon color="green" small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          @click="DeleteDataFromTableMethod(item, index)"
                        >
                          <v-icon color="red" small>mdi-delete</v-icon>
                        </v-btn>
                      </template></v-data-table
                    >
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-row class="mt-2">
                <v-col cols="12" md="4" sm="12" xs="12" class="mt-1">
                  <p class="ml-3 FontSize">
                    Total : {{ calculatePriceFromCompMethod() }}
                  </p>
                </v-col>
                <v-col cols="12" md="4" sm="12" xs="12" class="mt-1 mb-6">
                  <b class="FontSize">Grand Total : {{ total_amount }}</b>
                </v-col>
              </v-row>
              <!-- </div> -->
            </v-col>
          </v-row>
        </v-form>
        <section id="deliveryInfo-section">
          <div class="mt-2 mb-4" v-if="customer_existance !== 'NEW_CUSTOMER'">
            <span class="largeFontSizeNew">
              Delivery Address <span style="color: red">*</span> </span
            ><v-btn
              dense
              color="primary"
              class="ml-2"
              @click="DeliveryDetailsMethod()"
              ><v-icon>mdi-arrow-right</v-icon></v-btn
            >
            <div
              class="ml-4 mt-2 mb-2"
              v-if="
                valueInShippingAddress === true && StoreObj.action !== 'EDIT'
              "
            >
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <span
                    ><strong
                      ><v-icon size="20" class="pr-1">mdi-domain</v-icon>Billing
                      Address: </strong
                    >{{ billingDeliveryDetailsObj.billing_address }}</span
                  >
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="12"
                  xs="12"
                  class="text-left"
                >
                  <span
                    ><strong
                      ><v-icon size="20" class="pr-1">mdi-truck</v-icon>Shipping
                      Address: </strong
                    >{{
                      shippingDeliveryDetailsObj.shipping_address === ""
                        ? "N/A"
                        : shippingDeliveryDetailsObj.shipping_address
                    }}</span
                  ></v-col
                >
              </v-row>
            </div>
          </div>
          <div
            v-if="
              customer_existance === 'NEW_CUSTOMER' &&
              Object.keys(DeliveryDialogStoreObj).length > 0 &&
              StoreObj.action !== 'EDIT'
            "
          >
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <span
                  ><strong
                    ><v-icon size="20" class="pr-1">mdi-domain</v-icon>Billing
                    Address: </strong
                  >{{ DeliveryDialogStoreObj.customer_billing_address }}</span
                >
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="text-left">
                <span
                  ><strong
                    ><v-icon size="20" class="pr-1">mdi-truck</v-icon>Shipping
                    Address: </strong
                  >{{ DeliveryDialogStoreObj.customer_address || "N/A" }}</span
                ></v-col
              >
            </v-row>
            <span class="mt-2 mb-2">
              To edit the delivery address kindly click "Add Customer" button
              and change your address respectively
            </span>
          </div>
          <div v-if="StoreObj.action === 'EDIT'">
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <span
                  ><strong
                    ><v-icon size="20" class="pr-1">mdi-domain</v-icon>Billing
                    Address: </strong
                  >{{
                    DeliveryDialogStoreObj.customer_address !== undefined
                      ? DeliveryDialogStoreObj.customer_address
                      : DeliveryDialogStoreObj.billing_address_details
                          .billing_address
                  }}</span
                >
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="text-left">
                <span
                  ><strong
                    ><v-icon size="20" class="pr-1">mdi-truck</v-icon>Shipping
                    Address: </strong
                  >{{
                    DeliveryDialogStoreObj.shipping_address_details
                      .shipping_address !== undefined
                      ? DeliveryDialogStoreObj.shipping_address_details
                          .shipping_address
                      : DeliveryDialogStoreObj.shipping_address_details
                          .shipping_address === undefined
                      ? "N/A"
                      : DeliveryDialogStoreObj.shipping_address_details
                          .shipping_address
                  }}</span
                ></v-col
              >
            </v-row>
          </div>

          <!-- <div>
            <v-card elevation="0">
              <v-row align="center">
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <GoogleMaps :StoreObj="StoreObj" @clicked="GoogleMapsEmit" />
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <span style="font-weight: 600" class="mb-2"
                    >Shipping Address</span
                  >
                  <v-text-field
                    dense
                    outlined
                    label="Customer Address *"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="shippingAddress"
                  ></v-text-field>
                  <v-row>
                    <v-col cols="12" lg="4" md="4">
                      <v-text-field
                        dense
                        outlined
                        label="City"
                        v-model="shippingCity"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="4" md="4">
                      <v-text-field
                        dense
                        outlined
                        label="State"
                        v-model="shippingState"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="4" md="4">
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Pincode"
                        v-model="shippingPincode"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <span style="font-weight: 600" class="mb-2"
                    >Billing Address</span
                  >
                  <v-checkbox
                    dense
                    label="Same as Shipping Address"
                    v-model="same_as_billing_address"
                  ></v-checkbox>
                  <v-text-field
                    dense
                    outlined
                    label="Billing Address"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="billingAddress"
                  ></v-text-field>
                  <v-row>
                    <v-col cols="12" lg="4" md="4">
                      <v-text-field
                        dense
                        outlined
                        label="City"
                        v-model="billingCity"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="4" md="4">
                      <v-text-field
                        dense
                        outlined
                        label="State"
                        v-model="billingState"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="4" md="4">
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        label="Pincode"
                        v-model="billingPincode"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </div> -->
        </section>
        <v-expansion-panels v-if="enable_terms_and_conditions" class="mt-2">
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold black--text"
              expand-icon="mdi-menu-down"
            >
              Terms and Conditions
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-textarea
                rows="1"
                dense
                outlined
                label="Terms and Conditions *"
                class="FontSize"
                :rules="[(v) => !!v || 'Required']"
                v-model="terms_and_conditions"
              >
              </v-textarea>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- <v-form ref="termsForm" class="mt-4">
            <v-textarea
              rows="1"
              dense
              outlined
              label="Terms and Conditions *"
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
              v-model="terms_and_conditions"
            >
            </v-textarea>
          </v-form> -->
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn
          small
          class="mr-2"
          color="primary"
          :loading="loading_btn"
          @click="GenerateQuotationMethod()"
          >Generate</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { SearchTickets } from "@/graphql/queries.js";
import { GenerateQuotationForComponent } from "@/graphql/mutations.js";
import { GetAllTicketsBySearch } from "@/mixins/Tickets/GetTicketsBySearch.js";
import { GetTaggedProduct } from "@/mixins/Quotations/GetAllTaggedProductsForQuotations.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import LookUpCustomerDialog from "@/components/Tickets/Dialogs/LookUpCustomerDialog.vue";
import DialogAddCustomer from "@/components/Quotation/DialogAddCustomer.vue";
import EditComponentInQuotation from "@/components/Quotation/EditComponentInQuotation.vue";
import { GetAllTaggedComp } from "@/mixins/Product/GetAllTaggedComp.js";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import AddDeliveryDetails from "@/components/Quotation/GenerateQuotation/Dialogs/AddDeliveryDetailsDialog.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    Snackbar,
    Overlay,
    DialogAddCustomer,
    LookUpCustomerDialog,
    EditComponentInQuotation,
    GoogleMaps,
    AddDeliveryDetails,
  },
  mixins: [
    GetTaggedProduct,
    GetServicesByCategory,
    GetAllTicketsBySearch,
    GetAllTaggedComp,
    GetAllServiceTypes,
    GetAllOrganizationSettingsTypesInMS,
    GetTicketDetails,
  ],
  data: () => ({
    Toggle: 0,
    discount_percentage: 0,
    loading_btn: false,
    renderComp: true,
    loading: false,
    overlay: false,
    StoreObjNew: {},
    enable_discount: false,
    isSearching: false,
    enable_terms_and_conditions: false,
    quotation_for: "EXISTING_TICKET",
    dialogAddCustomerToGenerateQuotation: false,
    dialogEditComponentInQuotation: false,
    dialogLookUpCustomer: false,
    EditQtyDialog: false,
    SnackBarComponent: {},
    GetAllServiceTypeList: [],
    product_type: "COMPONENT",
    noDataTextInBillPreview: "No Components added..",
    component_name: "",
    component_code: "",
    price: "",
    product: "",
    ticket_id: "",
    original_ticket_id: "",
    customer_company_name: "",
    category: "",
    customer_email_id: "",
    ticket_id_to_search: "",
    terms_and_conditions: "",
    customer_unique_id: "",
    customer_add_to_data_base: false,
    labour_quotation: false,
    ProductPanel: 0,
    OtheropenPanel: 0,
    laboursPanel: 0,
    quantity: 0,
    gst: 0,
    discount: 0,
    service_type: "",
    sub_total_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    productId: "",
    customer_id: "",
    index: null,
    service_type_id: "",
    service_type_name: "",
    service_id: "",
    category_id: "",
    customer_name: "",
    component_id: "",
    customer_company_name: "",
    customer_all_details: {},
    customer_address: "",
    city: "",
    customer_pincode: "",
    labour_chargers: null,
    state: "",
    customer_primary_contact_number: "",
    customer_phone_number: "",
    customer_existance: "",
    categoryItems: [],
    components_list: [],
    GetAllTagCompList: [],
    GetTaggedProductList: [],
    GetOthersListArray: [],
    ModifiedOthersArray: [],
    service_headers: [
      { text: "Service Name", value: "service_type_name" },
      { text: "Price", value: "service_type_price" },
    ],
    customer_existance_items: [
      { text: "Existing Customer", value: "EXISTING_CUSTOMER" },
      { text: "New Customer", value: "NEW_CUSTOMER" },
    ],
    quotation_for_items: [
      { text: "Existing Ticket", value: "EXISTING_TICKET" },
      { text: "Direct Quotation", value: "DIRECT_QUOTATION" },
    ],
    Other_Headers: [
      { text: "Service Name", value: "service_name" },
      { text: "GST %", value: "gst" },
      { text: "Price", value: "price" },
    ],
    OthersPreviewHeaders: [
      { text: "Service Name", value: "component_name" },
      { text: "Price", value: "price" },
      { text: "Discount %", value: "discount" },
      { text: "GST %", value: "gst" },
      { text: "Total", value: "per_component_total_amount" },
      { text: "Action", value: "actions" },
    ],
    productsPriviewHeaders: [
      { text: "Product", value: "product_name" },
      { text: "Component", value: "component_name" },
      { text: "Price", value: "price" },
      { text: "Qty", value: "quantity" },
      { text: "Discount %", value: "discount" },
      { text: "GST %", value: "gst" },
      { text: "Total", value: "per_component_total_amount" },
      { text: "Actions", value: "actions" },
    ],
    product_headers: [
      { text: "Product", value: "service_name" },
      { text: "Price", value: "service_price" },
    ],
    component_headers: [
      { text: "Component", value: "component_name" },
      { text: "Code", value: "component_product_code" },
      { text: "Service Name", value: "service_name" },
      { text: "Price", value: "component_price" },
    ],
    labourHeaders: [
      { text: "Service Name", value: "product_name" },
      { text: "Price", value: "price" },
      { text: "Quantity", value: "quantity" },
      { text: "Discount %", value: "discount" },
      { text: "GST %", value: "gst" },
      { text: "Total", value: "per_component_total_amount" },
      { text: "Actions", value: "actions" },
    ],
    product_type_items: [
      { text: "Component", value: "COMPONENT" },
      { text: "Product", value: "PRODUCT" },
      { text: "Labour", value: "LABOUR" },
      { text: "Other", value: "OTHER" },
    ],
    productName: "",
    product_name: "",
    AddDeliveryDetailsDialog: false,
    billingDeliveryDetailsObj: {},
    shippingDeliveryDetailsObj: {},
    CustomerGSTNumber: "",
    CustomerPANNumber: "",
    same_as_billing_address: false,
    StorageObj: {},
    valueInShippingAddress: false,
    produtComponentList: [],
    laboursList: [],
    othersList: [],
    DeliveryDialogStoreObj: {},
    addedCustomerShippingAddress: {},
    categoryForExTi: "",
    productForExiTi: "",
    serviceTypeName: "",
    categoryIDForExTi: "",
    productIDForExiTi: "",
    serviceID: "",
  }),

  watch: {
    async category(val) {
      if (val != undefined && val != null && val != "") {
        await this.GetServicesByCategoriesMethod(val);
      }
    },
    service_type(val) {
      if (val != undefined && val != null && val != "") {
        this.labour_chargers = val.service_type_price;
      }
    },
    product(val) {
      this.GetAllTagCompMethod(val.service_id);
      if (val) {
        console.log("PRODUCT", val);
        this.GetServiceByCategoriesList.map((item) => {
          if (item.service_id === val.service_id) {
            this.productName = item.service_name;
          }
        });
      }
    },
    customer_existance() {
      this.customer_company_name = "";
      this.customer_name = "";
      this.customer_primary_contact_number = "";
    },

    // quotation_for(val) {
    //   if (val === "EXISTING_TICKET") {
    //     this.DisplayPhEmailCondition;
    //     this.customer_existance = "";
    //     this.customer_company_name = "";
    //   } else {
    //     this.GetAllSearchedTickets = [];
    //     this.ticket_id_to_search = "";
    //     this.DisplayPhEmailCondition;
    //   }
    // },

    async quotation_for(val) {
      if (val === "DIRECT_QUOTATION") {
        this.DisplayPhEmailCondition;
        this.TableDisplayItemCondition.length = 0;
        this.GetAllSearchedTickets = [];
        this.ticket_id_to_search = "";
        await this.GetAllOrganizationSettingsTypesMethod();
        await this.GetAllServiceTypeMethod("ACTIVE");
      } else {
        this.DisplayPhEmailCondition;
        this.customer_existance = "";
        this.customer_company_name = "";
        this.categoryItems = [];
        this.categoryForExTi = "";
        this.GetServiceByCategoriesList = [];
        this.productForExiTi = "";
        this.TableDisplayItemCondition.length = 0;
      }
    },

    product_type(val) {
      if (val == "OTHER") {
        this.GetOthersListArray =
          this.$store.getters.get_current_user_details.organization_details.quotation_service_charges;
      }
    },
  },

  computed: {
    DisplayPhEmailCondition() {
      if (this.quotation_for === "EXISTING_TICKET") {
        if (this.GetAllSearchedTickets.length > 0) {
          return true;
        } else {
          return false;
        }
      } else if (this.quotation_for === "DIRECT_QUOTATION") {
        if (
          this.customer_existance === "EXISTING_CUSTOMER" &&
          this.customer_company_name !== ""
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    TableDisplayItemCondition() {
      if (
        this.quotation_for === "EXISTING_TICKET" ||
        this.quotation_for === "DIRECT_QUOTATION"
      ) {
        if (this.product_type === "PRODUCT") {
          return this.GetServiceByCategoriesList;
        } else if (this.product_type === "COMPONENT") {
          return this.GetAllTagCompList;
        } else if (this.product_type === "LABOUR") {
          return this.GetAllServiceTypeList;
        } else if (this.product_type === "OTHER") {
          return this.GetOthersListArray;
        }
      }
    },

    CallConditionsForCategoryName() {
      if (this.quotation_for === "EXISTING_TICKET") {
        if (this.product_type !== "LABOUR" || this.product_type !== "OTHER") {
          return this.categoryForExTi;
        }
      } else {
        if (this.product_type !== "LABOUR" || this.product_type !== "OTHER") {
          const item = this.categoryItems.find(
            (item) => item.category_id === this.category
          );
          return item.category_name;
        }
      }
    },

    CallConditionsForCategoryID() {
      if (this.quotation_for === "EXISTING_TICKET") {
        if (this.product_type !== "LABOUR" || this.product_type !== "OTHER") {
          return this.categoryIDForExTi;
        }
      } else {
        if (this.product_type !== "LABOUR" || this.product_type !== "OTHER") {
          return this.category;
        }
      }
    },

    CallConditionsForServiceID() {
      if (this.quotation_for === "EXISTING_TICKET") {
        if (this.product_type === "COMPONENT") {
          return this.productIDForExiTi;
        } else if (this.product_type === "PRODUCT") {
          return this.serviceID;
        }
      } else {
        if (this.product_type === "PRODUCT") {
          return this.serviceID;
        } else if (this.product_type === "COMPONENT") {
          return this.product.service_id;
        }
      }
      // if (this.quotation_for === "EXISTING_TICKET") {
      //   if (this.product_type !== "LABOUR" || this.product_type !== "OTHER") {
      //     return this.productIDForExiTi;
      //   }
      // } else {
      //   if (this.product_type !== "LABOUR" || this.product_type !== "OTHER") {
      //     return this.product;
      //   }
      // }
    },
  },
  async mounted() {
    this.enable_discount =
      this.$store.getters.get_current_user_details.organization_details
        .enable_discount != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_discount
        : false;
    this.discount_percentage =
      this.$store.getters.get_current_user_details.organization_details
        .maximum_discount != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .maximum_discount
        : 0;
    this.enable_terms_and_conditions =
      this.$store.getters.get_current_user_details.organization_details
        .enable_terms_and_conditions != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .enable_terms_and_conditions
        : false;
    this.terms_and_conditions =
      this.$store.getters.get_current_user_details.organization_details
        .enable_terms_and_conditions != undefined &&
      this.$store.getters.get_current_user_details.organization_details
        .enable_terms_and_conditions != false &&
      this.$store.getters.get_current_user_details.organization_details
        .terms_and_conditions != undefined
        ? this.$store.getters.get_current_user_details.organization_details
            .terms_and_conditions
        : "";
    if (this.StoreObj.action == "EDIT") {
      this.valueInShippingAddress = true;
      this.DeliveryDialogStoreObj = this.StoreObj;
      if ("custom_ticket_id" in this.StoreObj) {
        this.quotation_for = "EXISTING_TICKET";
        this.ticket_id_to_search = this.StoreObj.custom_ticket_id;
        try {
          this.GetAllSearchedTickets = [];
          this.overlay = true;
          // let result = await API.graphql(
          //   graphqlOperation(SearchTickets, {
          //     input: {
          //       organization_id:
          //         this.$store.getters.get_current_user_details.organization_id,
          //       user_id: this.$store.getters.get_current_user_details.user_id,
          //       camparison_operator: "CONTAINS",
          //       field_value: this.ticket_id_to_search,
          //       field_name: "ticket_id",
          //       ticket_type: "ASSIGNED_TICKET",
          //       ticket_status: undefined,
          //       search_type: undefined,
          //     },
          //   })
          // );
          this.GetAllSearchedTickets = await this.TicketDetailsListMethod(
            this.StoreObj.ticket_id
          );
          // JSON.parse(
          //   result.data.SearchTickets
          // ).data.items;

          this.categoryForExTi = this.GetAllSearchedTickets[0].category_name;
          this.categoryIDForExTi = this.GetAllSearchedTickets[0].category_id;
          this.productForExiTi = this.GetAllSearchedTickets[0].service_name;
          this.productIDForExiTi = this.GetAllSearchedTickets[0].service_id;
          await this.GetServicesByCategoriesMethod(
            this.GetAllSearchedTickets[0].category_id
          );
          this.GetAllTagCompMethod(this.GetAllSearchedTickets[0].service_id);
          this.GetAllServiceTypeMethod("ACTIVE");

          this.GetServiceByCategoriesList =
            this.GetServiceByCategoriesList.filter((item) => {
              if (
                item.service_id === this.GetAllSearchedTickets[0].service_id
              ) {
                return item;
              }
            });
          this.overlay = false;
        } catch (error) {
          this.overlay = false;
          console.log("Error", error);
        }
      } else {
        this.quotation_for = "DIRECT_QUOTATION";
        this.GetAllOrganizationSettingsTypesMethod();
        this.GetAllServiceTypeMethod("ACTIVE");
      }
      this.produtComponentList = this.StoreObj.components_list.filter(
        (item) => {
          if (
            item.product_type === "COMPONENT" ||
            item.product_type === "PRODUCT"
          ) {
            return item;
          }
        }
      );
      this.laboursList = this.StoreObj.components_list.filter((item) => {
        if (item.product_type === "LABOUR") {
          return item;
        }
      });
      this.othersList = this.StoreObj.components_list.filter((item) => {
        if (item.product_type === "OTHERS") {
          return item;
        }
      });

      this.components_list = this.StoreObj.components_list.map((item) => {
        if ("requested_components_list" in item) {
          delete item.requested_components_list;
        }
        return item;
      });
      this.DiscountCalcForEditDeleteMethod();
      this.discount_percentage =
        this.StoreObj.discount_percentage != undefined
          ? this.StoreObj.discount_percentage
          : 0;
      this.customer_address = this.StoreObj.customer_address;
      this.customer_name = this.StoreObj.customer_name;
      this.customer_primary_contact_number =
        this.StoreObj.customer_phone_number;
      this.original_ticket_id = this.StoreObj.ticket_id;
      this.customer_id = this.StoreObj.customer_id;
      this.customer_unique_id = this.StoreObj.customer_unique_id;
      this.customer_company_name = this.StoreObj.customer_company_name;
      this.city = this.StoreObj.customer_city;
      this.customer_pincode = this.StoreObj.customer_pincode;
      this.state = this.StoreObj.customer_state;
      this.customer_email_id = this.StoreObj.customer_email_id;
      this.is_new_customer = this.StoreObj.is_new_customer;
      this.customer_all_details = this.StoreObj.customer_all_details;
    }
  },
  methods: {
    ClearMethod() {
      this.GetAllSearchedTickets = [];
      this.ticket_id_to_search = "";
      this.ticket_id = "";
      this.customer_company_name = "";
      this.customer_name = "";
      this.customer_primary_contact_number = "";
      this.category = "";
      this.product = "";
      this.component_name = "";
      this.component_code = "";
      this.price = 0;
      this.quantity = 0;
      this.gst = 0;
      this.discount = 0;
      this.valueInShippingAddress = false;
      this.productForExiTi = "";
      this.categoryForExTi = "";
      if (this.components_list.length > 0) {
        this.components_list = [];
        this.sub_total_amount = 0;
        this.total_amount = 0;
      }
    },
    dialogEditComponentInQuotationEmit(Toggle, obj) {
      this.dialogEditComponentInQuotation = false;
      if (Toggle == 2) {
        if (
          obj.product_type === "COMPONENT" ||
          obj.product_type === "PRODUCT"
        ) {
          this.produtComponentList.splice(obj.index, 1, obj);
        } else if (obj.product_type === "LABOUR") {
          this.laboursList.splice(obj.index, 1, obj);
        } else if (obj.product_type === "OTHERS") {
          this.othersList.splice(obj.index, 1, obj);
        }
        this.components_list = [];
        this.components_list.push(
          ...this.produtComponentList.map((item) => {
            const { index, ...rest } = item;
            return rest;
          }),
          ...this.laboursList.map((item) => {
            const { index, ...rest } = item;
            return rest;
          }),
          ...this.othersList.map((item) => {
            const { index, ...rest } = item;
            return rest;
          })
        );
        this.DiscountCalcForEditDeleteMethod();
      }
    },
    EditDataInTableMethod(item, index) {
      this.StoreObjNew = item;
      this.StoreObjNew.index = index;
      this.dialogEditComponentInQuotation = true;
    },

    DeleteDataFromTableMethod(item, index) {
      if (
        item.product_type === "PRODUCT" ||
        item.product_type === "COMPONENT"
      ) {
        this.produtComponentList.splice(index, 1);
      } else if (item.product_type === "LABOUR") {
        this.laboursList.splice(index, 1);
      } else if (item.product_type === "OTHERS") {
        this.othersList.splice(index, 1);
      }
      this.components_list = [];
      this.components_list.push(
        ...this.produtComponentList,
        ...this.laboursList,
        ...this.othersList
      );
      this.DiscountCalcForEditDeleteMethod();
    },
    calculate_discount(val) {
      if (val != null && val != undefined && val != "") {
        this.total_amount =
          this.sub_total_amount - this.sub_total_amount * (parseInt(val) / 100);
        let num_2 = this.total_amount;
        let fixedNum = num_2.toFixed(2);
        this.total_amount = fixedNum;
      }
    },
    DiscountCalcForEditDeleteMethod() {
      console.log("COMP_lIS", this.components_list);
      this.sub_total_amount = 0;
      this.total_amount = 0;
      if (this.components_list.length > 0) {
        this.components_list.forEach((item) => {
          this.sub_total_amount += item.per_component_total_amount || 0;
          this.total_amount = this.sub_total_amount;
          // if (item.discount !== undefined && item.discount !== null) {
          //   console.log("DISCOO");
          //   this.total_amount =
          //     this.sub_total_amount -
          //     this.sub_total_amount * (item.discount / 100);
          // } else {
          //   this.total_amount = this.sub_total_amount;
          // }
        });
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
              field_value: this.ticket_id_to_search,
              field_name: "ticket_id",
              ticket_type: "ASSIGNED_TICKET",
              ticket_status: undefined,
              search_type: undefined,
            },
          })
        );
        this.GetAllSearchedTickets = JSON.parse(
          result.data.SearchTickets
        ).data.items;

        this.categoryForExTi = this.GetAllSearchedTickets[0].category_name;
        this.categoryIDForExTi = this.GetAllSearchedTickets[0].category_id;
        this.productForExiTi = this.GetAllSearchedTickets[0].service_name;
        this.productIDForExiTi = this.GetAllSearchedTickets[0].service_id;
        await this.GetServicesByCategoriesMethod(
          this.GetAllSearchedTickets[0].category_id
        );
        this.GetAllTagCompMethod(this.GetAllSearchedTickets[0].service_id);
        this.GetAllServiceTypeMethod("ACTIVE");

        this.GetServiceByCategoriesList =
          this.GetServiceByCategoriesList.filter((item) => {
            if (item.service_id === this.GetAllSearchedTickets[0].service_id) {
              return item;
            }
          });
        this.StorageObj = this.GetAllSearchedTickets[0];
        this.DeliveryDialogStoreObj = this.GetAllSearchedTickets[0];
        this.StorageObj.quotation_for = this.quotation_for;
        this.overlay = false;
        this.ticket_id =
          this.GetAllSearchedTickets[0].custom_ticket_id != undefined
            ? this.GetAllSearchedTickets[0].custom_ticket_id
            : this.GetAllSearchedTickets[0].ticket_id;
        this.original_ticket_id = this.GetAllSearchedTickets[0].ticket_id;
        this.customer_company_name =
          this.GetAllSearchedTickets[0].customer_company_name != undefined
            ? this.GetAllSearchedTickets[0].customer_company_name
            : undefined;
        this.customer_address =
          this.GetAllSearchedTickets[0].ticket_address != undefined
            ? this.GetAllSearchedTickets[0].ticket_address
            : undefined;
        this.customer_unique_id =
          this.GetAllSearchedTickets[0].customer_unique_id != undefined
            ? this.GetAllSearchedTickets[0].customer_unique_id
            : undefined;
        this.city =
          this.GetAllSearchedTickets[0].ticket_city != undefined
            ? this.GetAllSearchedTickets[0].ticket_city
            : undefined;
        this.customer_pincode =
          this.GetAllSearchedTickets[0].ticket_pincode != undefined
            ? this.GetAllSearchedTickets[0].ticket_pincode
            : undefined;
        this.customer_primary_contact_number =
          this.GetAllSearchedTickets[0].customer_phone_number != undefined
            ? this.GetAllSearchedTickets[0].customer_phone_number
            : undefined;
        this.state =
          this.GetAllSearchedTickets[0].ticket_state != undefined
            ? this.GetAllSearchedTickets[0].ticket_state
            : undefined;
        this.customer_name =
          this.GetAllSearchedTickets[0].customer_name != undefined
            ? this.GetAllSearchedTickets[0].customer_name
            : undefined;
        this.customer_email_id =
          this.GetAllSearchedTickets[0].customer_email_id != undefined
            ? this.GetAllSearchedTickets[0].customer_email_id
            : undefined;
        this.customer_id =
          this.GetAllSearchedTickets[0].customer_id != undefined
            ? this.GetAllSearchedTickets[0].customer_id
            : undefined;
        // this.category =
        //   this.GetAllSearchedTickets[0].category_id != undefined
        //     ? this.GetAllSearchedTickets[0].category_id
        //     : undefined;
        // setTimeout(() => {
        //   this.product =
        //     this.GetAllSearchedTickets[0].service_id != undefined
        //       ? this.GetAllSearchedTickets[0].service_id
        //       : undefined;
        // }, 500);
      } catch (error) {
        this.overlay = false;
        this.GetAllSearchedTickets = [];
        this.noDataText = error.errors[0].message;
      }
    },
    async GetTicketsByFilterMethod() {
      if (this.ticket_id_to_search != "") {
        this.Current_Filter = "WITH_SEARCH";
        this.GetAllTicketsBySearchMethod();
        this.isSearching = true;
      } else {
        this.renderComp = false;
        this.isSearching = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Type Something...",
          };
          this.renderComp = true;
        });
      }
    },
    GenerateQuatationEmit(Toggle) {
      this.components_list = [];
      this.labour_quotation = false;
      this.$emit("clicked", Toggle);
    },
    DiscountCalMethod(totalProductPrice) {
      this.sub_total_amount =
        parseFloat(this.sub_total_amount) + parseFloat(totalProductPrice);
      let num = this.sub_total_amount;
      let fixedNum = num.toFixed(2);
      this.sub_total_amount = fixedNum;
      if (this.enable_discount) {
        if (this.discount_percentage) {
          this.total_amount =
            this.sub_total_amount -
            this.sub_total_amount * (parseInt(this.discount_percentage) / 100);
          let num_2 = this.total_amount;
          let fixedNum = num_2.toFixed(2);
          this.total_amount = fixedNum;
        } else {
          this.total_amount = fixedNum;
        }
      } else {
        this.total_amount = fixedNum;
      }
    },

    calculateSubTotalAmountMethod(amount) {
      let subtotal = parseFloat(this.sub_total_amount) + parseFloat(amount);
      subtotal = parseFloat(subtotal.toFixed(2));
      this.sub_total_amount = subtotal;
      this.total_amount = subtotal;
    },
    pushProductMethod() {
      if (this.price === null || this.price === undefined) {
        this.price = 0;
      }
      if (
        this.product_type === "PRODUCT" ||
        this.product_type === "COMPONENT"
      ) {
        if (
          this.component_name != "" &&
          this.component_name != undefined &&
          this.component_name != null &&
          this.price != undefined &&
          this.price != null &&
          this.price != "" &&
          this.quantity != undefined &&
          this.quantity != null &&
          this.quantity != 0 &&
          this.quantity != "" &&
          this.gst != undefined &&
          this.gst != null &&
          this.discount != undefined &&
          this.discount != null
        ) {
          let priceWithQty = parseFloat(this.price) * parseInt(this.quantity);
          let discountedPrice =
            priceWithQty - (priceWithQty * parseInt(this.discount)) / 100;
          let gstAmount = (discountedPrice * parseInt(this.gst)) / 100;
          let totalProductPrice = discountedPrice + gstAmount;
          let fixedTotalProductPrice = totalProductPrice.toFixed(2);
          let Obj = {
            category_name: this.CallConditionsForCategoryName,
            category_id: this.CallConditionsForCategoryID,
            component_id:
              this.product_type != "PRODUCT" ? this.component_id : undefined,
            service_id: this.CallConditionsForServiceID,
            component_name:
              this.product_type === "COMPONENT" ? this.component_name : "-",
            component_code:
              this.component_code != undefined &&
              this.component_code != null &&
              this.component_code != "" &&
              this.product_type == "COMPONENT"
                ? this.component_code
                : "-",
            price:
              this.price != undefined &&
              this.price != null &&
              this.price != "" &&
              this.price != 0
                ? parseFloat(this.price)
                : 0,
            quantity:
              this.quantity != undefined &&
              this.quantity != null &&
              this.quantity != 0 &&
              this.quantity != ""
                ? parseInt(this.quantity)
                : 0,
            gst:
              this.gst != undefined && this.gst != null && this.gst != ""
                ? parseInt(this.gst)
                : 0,
            discount:
              this.discount != undefined &&
              this.discount != null &&
              this.discount != ""
                ? parseInt(this.discount)
                : 0,
            per_component_total_amount: parseFloat(fixedTotalProductPrice),
            product_type: this.product_type,
            product_name: this.product_name || undefined,
            // this.product_type === "COMPONENT"
            //   ? this.productName
            //   : this.product_name,
          };
          console.log("SEE_HERE", Obj);
          this.produtComponentList.push(Obj);
          this.components_list.push(Obj);
          // this.DiscountCalMethod(fixedTotalProductPrice);
          this.calculateSubTotalAmountMethod(fixedTotalProductPrice);
          this.component_name = "";
          this.component_code = "";
          this.product_name = "";
          this.price = 0;
          this.quantity = 0;
          this.gst = 0;
          this.discount = 0;
          this.service_type = "";
          this.service_type_name = "";
          this.serviceTypeName = "";
          this.service_type_id = "";
          this.labour_chargers = null;
        } else {
          console.log("GST_DIS", this.gst, this.discount);
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Fill Mandatory fields marked with *",
            };
            this.renderComp = true;
          });
        }
      }
      if (
        this.product_type === "OTHER" &&
        (this.price !== undefined ||
          this.price !== null ||
          this.price !== "" ||
          this.price === 0 ||
          this.price === "0") &&
        (this.gst !== null ||
          this.gst !== undefined ||
          this.gst !== "" ||
          this.gst === 0 ||
          this.gst === "0") &&
        (this.discount !== null ||
          this.discount !== undefined ||
          this.discount !== "" ||
          this.discount === 0 ||
          this.discount === "0") &&
        (this.serviceTypeName !== undefined ||
          this.serviceTypeName !== null ||
          this.serviceTypeName !== "")
      ) {
        let priceWithQty = parseFloat(this.price) * parseInt(this.quantity);
        let totalProductPrice =
          priceWithQty + priceWithQty * (parseInt(this.gst) / 100);
        let fixedTotalProductPrice = totalProductPrice.toFixed(2);
        totalProductPrice = fixedTotalProductPrice;
        let Obj = {
          component_name: this.serviceTypeName,
          per_component_total_amount: parseFloat(totalProductPrice),
          gst:
            this.gst != undefined && this.gst != null && this.gst != ""
              ? parseInt(this.gst)
              : 0,
          discount:
            this.discount != undefined &&
            this.discount != null &&
            this.discount != ""
              ? parseInt(this.discount)
              : 0,
          price:
            this.price != undefined &&
            this.price != null &&
            this.price != "" &&
            this.price != 0
              ? parseFloat(this.price)
              : 0,
          product_type: "OTHERS",
          quantity: 0,
        };
        this.othersList.push(Obj);
        this.components_list.push(Obj);
        this.calculateSubTotalAmountMethod(totalProductPrice);
        // this.DiscountCalMethod(totalProductPrice);
      }
      if (
        this.product_type === "LABOUR" &&
        this.serviceTypeName !== "" &&
        this.price !== "" &&
        this.quantity >= 1
      ) {
        //   { text: "Service Type", value: "service_type_name" },
        // { text: "Price", value: "price" },
        // { text: "Quantity", value: "quantity" },
        // { text: "GST %", value: "gst" },
        // { text: "Total", value: "per_component_total_amount" },
        let priceWithQty = parseFloat(this.price) * parseInt(this.quantity);
        let totalProductPrice =
          priceWithQty + priceWithQty * (parseInt(this.gst) / 100);
        let fixedTotalProductPrice = totalProductPrice.toFixed(2);
        totalProductPrice = fixedTotalProductPrice;
        const laboursItemObj = {
          category_id:
            this.product_type != "LABOUR" ? this.category_id : undefined,
          component_id:
            this.product_type != "PRODUCT" ? this.component_id : undefined,
          service_id:
            this.product_type != "LABOUR" ? this.service_id : undefined,
          component_name:
            this.product_type === "COMPONENT" ? this.component_name : "-",
          component_code:
            this.component_code != undefined &&
            this.component_code != null &&
            this.component_code != "" &&
            this.product_type == "COMPONENT"
              ? this.component_code
              : "-",
          product_name: this.serviceTypeName,
          price: this.price,
          quantity: this.quantity,
          gst: this.gst,
          discount: this.discount,
          product_type: this.product_type,
          per_component_total_amount: parseFloat(totalProductPrice),
        };
        this.laboursList.push(laboursItemObj);
        this.components_list.push(laboursItemObj);
        this.calculateSubTotalAmountMethod(totalProductPrice);
        // this.DiscountCalMethod(totalProductPrice);
        this.serviceTypeName = "";
        this.price = "";
        this.quantity = 0;
        this.gst = 0;
        this.discount = 0;
      }
      if (
        this.product_type === "OTHER" &&
        (this.price === undefined ||
          this.price === null ||
          this.price === "" ||
          this.serviceTypeName === undefined ||
          this.serviceTypeName === "" ||
          this.serviceTypeName === null ||
          this.gst === undefined ||
          this.gst === null ||
          this.gst === "" ||
          this.discount === undefined ||
          this.discount === null ||
          this.discount === "")
      ) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please provide all necessary fields",
        };
      }
    },
    DeliveryDetailsMethod() {
      if (this.StoreObj.action === "GENERATE_QUOTATION") {
        if (Object.keys(this.DeliveryDialogStoreObj).length === 0) {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please get the data from ticket/customer",
          };
        } else {
          this.DeliveryDialogStoreObj.action = "GENERATE_QUOTATION";
          this.AddDeliveryDetailsDialog = true;
        }
      } else if (this.StoreObj.action === "EDIT") {
        // this.DeliveryDialogStoreObj = this.StoreObj;
        this.AddDeliveryDetailsDialog = true;
      }
      // if (
      //   this.quotation_for === "EXISTING_TICKET" &&
      //   this.ticket_id_to_search === ""
      // ) {
      //   this.StorageObj = this.StoreObj;
      // } else {
      //   this.StorageObj.action = "NEW";
      // }
      // this.AddDeliveryDetailsDialog = true;
    },
    ClearSelectedTicketMethod() {
      this.component_name = "";
      this.component_code = "";
      this.price = "";
      this.quantity = 0;
      this.gst = 0;
      this.serviceTypeName = "";
      this.product_name = "";
    },
    handleRowClick(item) {
      console.log("ITEM", item);
      this.quantity = 1;
      if (this.product_type === "COMPONENT") {
        this.component_name = item.component_name;
        this.product_name = this.product.service_name || this.productForExiTi;
        console.log("HREE_TEJ", this.product_name);
      } else if (this.product_type === "PRODUCT") {
        this.product_name = item.service_name;
        this.component_name = this.product_name;
        this.serviceID = item.service_id;
      } else if (this.product_type === "OTHER") {
        this.gst = item.service_gst;
        this.serviceTypeName = item.service_name;
      } else {
        this.serviceTypeName = item.service_type_name;
        this.component_name = this.serviceTypeName;
      }
      this.category_id =
        item.category_id != undefined ? item.category_id : undefined;
      this.service_id =
        item.service_id != undefined ? item.service_id : undefined;
      this.component_code =
        item.component_code != undefined
          ? item.component_code
          : item.component_product_code != undefined
          ? item.component_product_code
          : undefined;
      this.price =
        this.product_type == "PRODUCT"
          ? item.service_price
          : this.product_type == "COMPONENT"
          ? item.component_price
          : this.product_type == "LABOUR"
          ? item.service_type_price
          : this.product_type === "OTHER"
          ? item.service_cost
          : 0;
      if (this.product_type == "COMPONENT" || this.product_type == "LABOUR") {
        this.component_id =
          this.product_type == "COMPONENT"
            ? item.component_id
            : this.product_type == "LABOUR"
            ? item.service_type_id
            : undefined;
      }
    },
    async GenerateQuotationMethod() {
      if (this.ModifiedOthersArray.length > 0) {
        for (let i = 0; i < this.ModifiedOthersArray.length; i++) {
          this.components_list.push(this.ModifiedOthersArray[i]);
        }
      }
      if (
        this.components_list != undefined &&
        this.components_list.length != 0 &&
        this.components_list != [] &&
        this.valueInShippingAddress === true
      ) {
        this.labour_quotation = false;
        for (let i = 0; i < this.components_list.length; i++) {
          if (this.components_list[i].product_type == "LABOUR") {
            this.labour_quotation = true;
          } else {
            this.labour_quotation = false;
            break;
          }
        }
        if (parseFloat(this.sub_total_amount) > parseFloat(this.total_amount)) {
          this.discount_amount =
            parseFloat(this.sub_total_amount) - parseFloat(this.total_amount);
          let DiscountAmount = this.discount_amount;
          let fixedDiscountAmount = DiscountAmount.toFixed(2);
          this.discount_amount = fixedDiscountAmount;
        } else {
          this.discount_amount = 0;
        }

        try {
          this.overlay = true;
          this.components_list.map((item) => {
            if (item.unique_object_id) {
              delete item.unique_object_id;
            }
          });
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            labour_quotation: this.labour_quotation,
            quotation_id:
              this.StoreObj.action == "EDIT"
                ? this.StoreObj.quotation_id
                : undefined,
            s3_key:
              this.StoreObj.action == "EDIT"
                ? this.StoreObj.quotation_s3_key
                : undefined,
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            customer_all_details:
              this.quotation_for == "DIRECT_QUOTATION" &&
              this.customer_existance == "NEW_CUSTOMER"
                ? this.customer_all_details
                : undefined,
            ticket_id:
              this.quotation_for == "EXISTING_TICKET" &&
              this.original_ticket_id != undefined &&
              this.original_ticket_id != null &&
              this.original_ticket_id != ""
                ? this.original_ticket_id
                : undefined,
            customer_id:
              this.customer_id != undefined &&
              this.customer_id != null &&
              this.customer_id != ""
                ? this.customer_id
                : undefined,
            is_new_customer:
              this.quotation_for == "DIRECT_QUOTATION" &&
              this.customer_existance == "NEW_CUSTOMER"
                ? true
                : false,
            customer_add_to_data_base:
              this.quotation_for == "DIRECT_QUOTATION" &&
              this.customer_existance == "NEW_CUSTOMER"
                ? this.customer_add_to_data_base
                : undefined,
            customer_unique_id:
              this.customer_unique_id != undefined &&
              this.customer_unique_id != null &&
              this.customer_unique_id != ""
                ? this.customer_unique_id
                : undefined,
            customer_company_name:
              this.customer_company_name != undefined &&
              this.customer_company_name != null &&
              this.customer_company_name != ""
                ? this.customer_company_name
                : undefined,
            customer_address:
              this.billingDeliveryDetailsObj.billing_address != undefined &&
              this.billingDeliveryDetailsObj.billing_address != null &&
              this.billingDeliveryDetailsObj.billing_address != ""
                ? this.billingDeliveryDetailsObj.billing_address
                : this.customer_address,
            city:
              this.billingDeliveryDetailsObj.billing_city != undefined &&
              this.billingDeliveryDetailsObj.billing_city != null &&
              this.billingDeliveryDetailsObj.billing_city != ""
                ? this.billingDeliveryDetailsObj.billing_city
                : this.customer_city,
            customer_pincode:
              this.billingDeliveryDetailsObj.billing_pincode != undefined &&
              this.billingDeliveryDetailsObj.billing_pincode != null &&
              this.billingDeliveryDetailsObj.billing_pincode != ""
                ? this.billingDeliveryDetailsObj.billing_pincode
                : this.customer_pincode,
            customer_primary_contact_number:
              this.customer_primary_contact_number,
            state:
              this.billingDeliveryDetailsObj.billing_state != undefined &&
              this.billingDeliveryDetailsObj.billing_state != null &&
              this.billingDeliveryDetailsObj.billing_state != ""
                ? this.billingDeliveryDetailsObj.billing_state
                : this.customer_state,
            customer_name: this.customer_name,
            customer_email_id:
              this.customer_email_id != undefined &&
              this.customer_email_id != null &&
              this.customer_email_id != ""
                ? this.customer_email_id
                : undefined,
            components_list: this.components_list,
            sub_total_amount: this.calculatePriceFromCompMethod(),
            discount_percentage: 0,
            discount_amount: this.discountAmountCalcMethod(),
            // discount_percentage:
            //   this.enable_discount === true
            //     ? parseFloat(this.discount_percentage) || 0
            //     : 0,

            total_amount: parseFloat(this.total_amount),
            terms_and_conditions:
              this.terms_and_conditions != undefined &&
              this.terms_and_conditions != null &&
              this.terms_and_conditions != ""
                ? this.terms_and_conditions
                : undefined,
            // discount_amount:
            //   this.enable_discount === true
            //     ? parseFloat(this.discount_amount) || 0
            //     : 0,

            shipping_address_details:
              this.StoreObj.action === "EDIT"
                ? this.DeliveryDialogStoreObj.shipping_address_details
                : this.customer_existance === "NEW_CUSTOMER"
                ? this.addedCustomerShippingAddress
                : Object.values(this.shippingDeliveryDetailsObj).every(
                    (value) => value === ""
                  )
                ? undefined
                : this.shippingDeliveryDetailsObj,
            service_quotation: !this.components_list.some((item) => {
              return (
                item.product_type !== "COMPONENT" ||
                item.product_type !== "PRODUCT"
              );
            }),
            same_as_billing_address: this.same_as_billing_address,
            customer_gst_number:
              this.CustomerGSTNumber == "" ? undefined : this.CustomerGSTNumber,
            customer_pan_number:
              this.CustomerPANNumber == "" ? undefined : this.CustomerPANNumber,
            quotation_display_id:
              this.StoreObj.action === "EDIT"
                ? this.StoreObj.quotation_display_id
                : undefined,
          };
          this.loading_btn = true;
          let result = await API.graphql(
            graphqlOperation(GenerateQuotationForComponent, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(
            result.data.GenerateQuotationForComponent
          );
          if (ResultObject.status == "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: ResultObject.Status_Message,
              };
              this.renderComp = true;
            });
            this.overlay = false;
            this.GenerateQuatationEmit((this.Toggle = 2));
          }
          this.loading_btn = false;
        } catch (error) {
          this.overlay = false;
          this.loading_btn = false;
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: error.errors[0].message,
            };
            this.renderComp = true;
          });
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly fill all fields and review delivery address!",
          };
          this.renderComp = true;
        });
      }
    },

    discountAmountCalcMethod() {
      if (!Array.isArray(this.components_list)) return 0;
      let totalDiscount = 0;
      this.components_list.forEach((item) => {
        let price = parseFloat(item.price) || 0;
        let discount = parseFloat(item.discount) || 0;
        let quantity = parseFloat(item.quantity) || 1;
        let discountAmount = price * quantity * (discount / 100);
        totalDiscount += discountAmount;
      });
      return parseFloat(totalDiscount.toFixed(2));
    },

    calculatePriceFromCompMethod() {
      if (!Array.isArray(this.components_list)) return 0;
      let totalPrice = 0;
      this.components_list.forEach((item) => {
        let price = parseFloat(item.price) || 0;
        let quantity = parseFloat(item.quantity) || 1;
        totalPrice += price * quantity;
      });
      return parseFloat(totalPrice.toFixed(2));
    },
    dialogAddCustomerOnQuotationEmit(
      Toggle,
      customer_obj,
      customer_add_to_data_base
    ) {
      this.dialogAddCustomerToGenerateQuotation = false;
      if (Toggle == 2) {
        this.customer_unique_id = customer_obj.customer_unique_id;
        this.customer_add_to_data_base = customer_add_to_data_base;
        this.customer_company_name = customer_obj.customer_company_name;
        this.city = customer_obj.customer_billing_city;
        this.customer_pincode = customer_obj.customer_billing_pincode;
        this.customer_primary_contact_number =
          customer_obj.customer_primary_contact_number;
        this.customer_address = customer_obj.customer_billing_address;
        this.state = customer_obj.customer_billing_state;
        this.customer_email_id = customer_obj.customer_email_id;
        this.customer_name = customer_obj.customer_name;
        this.CustomerGSTNumber = customer_obj.gst_number;
        this.CustomerPANNumber = customer_obj.pan_number;
        delete customer_obj.gst_number;
        delete customer_obj.pan_number;
        this.customer_all_details = customer_obj;
        this.DeliveryDialogStoreObj = { ...customer_obj };
        this.DeliveryDialogStoreObj.customer_type = "NEW_CUSTOMER";
        this.valueInShippingAddress = true;
        this.addedCustomerShippingAddress = {
          shipping_address: this.DeliveryDialogStoreObj.customer_address,
          shipping_city: this.DeliveryDialogStoreObj.city,
          // shipping_city: this.DeliveryDialogStoreObj.city,
          shipping_state: this.DeliveryDialogStoreObj.state,
          shipping_pincode: this.DeliveryDialogStoreObj.customer_pincode,
        };
      }
    },
    dialogLookUpCustomerEmit(Toggle, item) {
      this.dialogLookUpCustomer = false;
      if (Toggle == 2) {
        this.StorageObj = item;
        this.StorageObj.quotation_for = this.quotation_for;
        this.customer_name = item.customer_name;
        this.customer_unique_id = item.customer_unique_id;
        this.city = item.customer_city;
        this.customer_pincode = item.customer_pincode;
        this.customer_primary_contact_number =
          item.customer_primary_contact_number;
        this.state = item.customer_state;
        this.customer_company_name = item.customer_company_name;
        this.customer_address = item.customer_address;
        this.customer_email_id = item.customer_email_id;
        this.customer_id = item.customer_id;
        this.product_type = "COMPONENT";
        this.StorageObj = item;
        this.DeliveryDialogStoreObj = item;
      }
    },

    AddDeliveryDetailsDialogEmit(
      Toggle,
      billingDeliveryDetailsObj,
      shippingDeliveryDetailsObj,
      Customer_GST_number,
      Customer_PAN_number,
      same_as_billing_address
    ) {
      this.AddDeliveryDetailsDialog = false;
      if (Toggle === 2) {
        this.billingDeliveryDetailsObj = billingDeliveryDetailsObj;
        this.shippingDeliveryDetailsObj = shippingDeliveryDetailsObj;
        this.CustomerGSTNumber = Customer_GST_number;
        this.CustomerPANNumber = Customer_PAN_number;
        this.same_as_billing_address = same_as_billing_address;
        this.valueInShippingAddress = true;
        this.DeliveryDialogStoreObj = {};
        this.DeliveryDialogStoreObj = {
          action: this.StoreObj.action,
          billing_address_details: {
            billing_address: billingDeliveryDetailsObj.billing_address,
            billing_city: billingDeliveryDetailsObj.billing_city,
            billing_state: billingDeliveryDetailsObj.billing_state,
            billing_pincode: billingDeliveryDetailsObj.billing_pincode,
          },
          shipping_address_details: {
            shipping_address: shippingDeliveryDetailsObj.shipping_address,
            shipping_city: shippingDeliveryDetailsObj.shipping_city,
            shipping_state: shippingDeliveryDetailsObj.shipping_state,
            shipping_pincode: shippingDeliveryDetailsObj.shipping_pincode,
          },
          customer_pan_number: this.CustomerPANNumber,
          customer_gst_number: this.CustomerGSTNumber,
          changed: true,
        };
      }
    },
  },
};
</script>

<style>
.v-expansion-panel-header {
  min-height: 45px !important;
}
</style>
