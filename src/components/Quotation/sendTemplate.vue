<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <Overlay :overlay="overlay" />
    <v-card class="elevation-0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="3" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Create Quotation</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="9" xs="12">
          <v-toolbar dense class="elevation-0">
            <v-spacer></v-spacer>
            <v-select
              v-model="select_template"
              dense
              class="mt-6 mr-2 FontSize field_label_size field_height"
              outlined
              label="Select Template"
              :items="quotationBuilderItems"
              item-text="template_name"
              item-value="template_id"
              return-object
              hint="Please select a template"
            >
            </v-select>
            <v-btn small color="primary" @click="SendCardEmit((Toggle = 1))"
              ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
            >
          </v-toolbar>
        </v-col>
      </v-row>

      <v-col cols="12" sm="12" md="12" xs="12" v-if="select_template">
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="3" xs="12">
            <v-row no-gutters>
              <v-col cols="12" md="12">
                <v-card outlined class="ml-n1">
                  <v-card-text align="center" class="mt-2 ma-0 pa-0">
                    <b> Select / Update Active fields </b>
                  </v-card-text>
                  <v-row class="mx-0 mt-2">
                    <v-col v-if="header_shown == true" cols="12" md="12">
                      <v-card elevation="10">
                        <v-row no-gutters>
                          <v-card-text
                            align="center"
                            class="primary white--text ma-0 pa-0 py-1"
                            style="font-size: 15px"
                            >Select Type of Header</v-card-text
                          >
                          <v-col cols="12" md="12">
                            <v-radio-group
                              class="pa-0 ma-0 mt-3 ml-5"
                              row
                              v-model="header_radio"
                            >
                              <v-radio label="Image" value="image"></v-radio>
                              <v-radio label="text" value="text"></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col cols="12" md="12">
                            <div
                              v-if="header_radio == 'image'"
                              class="mt-n5"
                              id="app"
                            >
                              <div class="container">
                                <form
                                  enctype="multipart/form-data"
                                  novalidate
                                  v-if="isInitial || isSaving"
                                >
                                  <div class="dropbox">
                                    <input
                                      type="file"
                                      multiple
                                      :name="uploadFieldName"
                                      :disabled="isSaving"
                                      @change="handleClick"
                                      accept="image/*"
                                      class="input-file"
                                    />
                                    <p v-if="isInitial">
                                      Drag your image here to begin<br />
                                      or click to browse<br />
                                    </p>
                                    <p v-if="isSaving">
                                      Uploading {{ fileCount }} files...
                                    </p>
                                  </div>
                                </form>
                                <div>
                                  <div v-if="isSuccess">
                                    <div
                                      v-for="(item, key) in srcArray"
                                      :key="key"
                                    >
                                      <v-card class="primary white--text">
                                        <v-row no-gutters>
                                          <div
                                            style="font-size: 14px"
                                            class="mt-2 ml-2"
                                          >
                                            Header -
                                            {{
                                              item.name.length >= 10
                                                ? item.name.substr(0, 10) +
                                                  "..."
                                                : item.name
                                            }}
                                          </div>
                                          <v-spacer />
                                          <v-tooltip bottom color="primary">
                                            <template v-slot:activator="{ on }">
                                              <v-btn
                                                v-on="on"
                                                icon
                                                @click="reset()"
                                              >
                                                <v-icon class="red--text"
                                                  >mdi-close</v-icon
                                                >
                                              </v-btn>
                                            </template>
                                            <span class="white--text"
                                              >upload another image?</span
                                            >
                                          </v-tooltip>
                                        </v-row>
                                      </v-card>
                                      <v-card>
                                        <v-img
                                          :src="item.src"
                                          class="img-responsive img-thumbnail"
                                          :alt="item.name"
                                          contain
                                          height="200px"
                                          width="400px"
                                        />
                                        <v-card-subtitle
                                          class="mx-auto mt-n5 pa-0 mb-5"
                                          align="center"
                                          style="font-size: 10px"
                                        >
                                          Set Height and width of Image
                                        </v-card-subtitle>
                                        <v-row class="mt-n3 mx-3" no-gutters>
                                          <v-col cols="12" md="12">
                                            <div>
                                              <span style="font-size: 14px"
                                                >Width in pixel</span
                                              >
                                              <span
                                                ><v-text-field
                                                  v-model.number="width"
                                                  placeholder="Enter Width in px"
                                                  dense
                                                  outlined
                                                  type="number"
                                                  class="mr-2"
                                                ></v-text-field
                                              ></span>
                                            </div>
                                          </v-col>
                                          <v-col cols="12" md="12">
                                            <div class="mt-n5">
                                              <span style="font-size: 14px"
                                                >Height in pixel</span
                                              >
                                              <span
                                                ><v-text-field
                                                  v-model.number="height"
                                                  placeholder="Enter Height in px"
                                                  dense
                                                  outlined
                                                  type="number"
                                                ></v-text-field
                                              ></span>
                                            </div>
                                          </v-col>
                                        </v-row>
                                      </v-card>
                                    </div>
                                  </div>
                                </div>

                                <div v-if="isFailed">
                                  <h2>upload 1 image only</h2>
                                  <p>
                                    <a
                                      href="javascript:void(0)"
                                      @click="reset()"
                                      >Try again</a
                                    >
                                  </p>
                                  <pre>{{ uploadError }}</pre>
                                </div>
                              </div>
                            </div>
                            <v-textarea
                              rows="2"
                              auto-grow
                              class="FontSize field_label_size field_height mx-3"
                              outlined
                              dense
                              v-model="header_temp"
                              v-if="
                                header_shown == true && header_radio == 'text'
                              "
                              label="Headers"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" md="1"></v-col>
                          <v-col cols="12" md="10" v-if="header_shown == true">
                            <v-btn
                              small
                              color="primary"
                              @click="add_headers(header_temp, width, height)"
                              block
                              class="mb-3"
                            >
                              <v-icon medium>mdi-plus</v-icon>Add Header
                            </v-btn>
                          </v-col>
                          <v-col cols="12" md="1"></v-col>
                        </v-row>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="12" v-if="org_shown == true">
                      <v-select
                        class="FontSize field_label_size field_height"
                        outlined
                        dense
                        v-model="customer_address"
                        label="Select Organisation Address"
                        :items="list_items"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-select
                        outlined
                        dense
                        v-if="cust_shown == true"
                        v-model="customer_name"
                        :items="GetAllCustomerList"
                        label="Select Customer Name"
                        item-text="customer_name"
                        item-value="customer_name"
                        class="mt-n3 FontSize field_label_size field_height"
                        return-object
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="12" v-if="date_shown == true">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            class="mt-n8 FontSize field_label_size field_height"
                            v-model="date"
                            label="Select Date"
                            append-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="date" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="12" v-if="active_shown == true">
                      <v-dialog v-model="dialog" max-width="600px">
                        <v-toolbar class="primary elevation-0" dense dark>
                          <div class="ml-2 white--text">
                            Insert Quotation Table
                          </div>
                          <v-spacer></v-spacer>
                          <v-btn
                            large
                            class="mr-n4"
                            dark
                            text
                            @click="dialog = false"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-toolbar>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            dark
                            class="mt-n8"
                            v-bind="attrs"
                            v-on="on"
                            small
                            block
                          >
                            insert quotation Table
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-text>
                            <v-container>
                              <v-row no-gutters>
                                <v-col cols="12" md="12" sm="12">
                                  <v-col cols="12" md="12" sm="12">
                                    <v-select
                                      class="ml-n3 FontSize field_label_size field_height"
                                      dense
                                      outlined
                                      label="Select Type"
                                      v-model="type"
                                      :items="select_type"
                                    >
                                    </v-select>
                                  </v-col>
                                  <v-row
                                    no-gutters
                                    class="ml-1"
                                    v-if="type == 'Product'"
                                  >
                                    <v-col cols="12" md="6" sm="12">
                                      <v-select
                                        class="FontSize field_label_size field_height"
                                        dense
                                        outlined
                                        label="Product"
                                        v-model="producttypes"
                                        :items="GetAllServicesList"
                                        item-value="service_id"
                                        item-text="service_name"
                                        return-object
                                      >
                                      </v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                      <v-text-field
                                        class="ml-2 FontSize field_label_size field_height"
                                        dense
                                        label="Quantity"
                                        v-model="qty"
                                        outlined
                                      >
                                      </v-text-field>
                                    </v-col>
                                    <v-btn
                                      @click="save('Product')"
                                      class="ml-2 mt-1"
                                      x-small
                                      color="primary"
                                      >Add
                                    </v-btn>
                                  </v-row>
                                  <v-row
                                    no-gutters
                                    class="mt-n2 ml-1"
                                    v-if="type == 'Components'"
                                  >
                                    <v-col cols="12" md="6" sm="12">
                                      <v-select
                                        class="FontSize field_label_size field_height"
                                        dense
                                        outlined
                                        label="Component"
                                        v-model="component"
                                        :items="GetAllComponentsList"
                                        item-text="component_name"
                                        item-value="component_id"
                                        return-object
                                      >
                                      </v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                      <v-text-field
                                        class="ml-2 FontSize field_label_size field_height"
                                        dense
                                        label="Quantity"
                                        v-model="compqty"
                                        outlined
                                      >
                                      </v-text-field>
                                    </v-col>
                                    <v-btn
                                      @click="save('Component')"
                                      class="ml-2 mt-1"
                                      x-small
                                      color="primary"
                                      >Add
                                    </v-btn>
                                  </v-row>
                                  <v-row
                                    no-gutters
                                    class="mt-n2 ml-1"
                                    v-if="type == 'Service Type'"
                                  >
                                    <v-col cols="12" md="6" sm="12">
                                      <v-select
                                        class="FontSize field_label_size field_height"
                                        dense
                                        outlined
                                        label="Service Type"
                                        v-model="servicetype"
                                        :items="GetAllServiceTypeList"
                                        item-text="service_type_name"
                                        item-value="service_type_id"
                                        return-object
                                      >
                                      </v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                      <v-text-field
                                        class="ml-2 FontSize field_label_size field_height"
                                        dense
                                        label="Quantity"
                                        v-model="serviceTypeQty"
                                        outlined
                                      >
                                      </v-text-field>
                                    </v-col>
                                    <v-btn
                                      @click="save('Service Type')"
                                      class="ml-2 mt-1"
                                      x-small
                                      color="primary"
                                      >Add
                                    </v-btn>
                                  </v-row>
                                  <v-row
                                    no-gutters
                                    class="ml-1 mt-n2"
                                    v-if="type == 'AMC Type'"
                                  >
                                    <v-col cols="12" md="6" sm="12">
                                      <v-select
                                        class="FontSize field_label_size field_height"
                                        dense
                                        outlined
                                        label="AMC Type"
                                        v-model="amcType"
                                        :items="GetAllAMCTypeList"
                                        item-value="setting_id"
                                        item-text="setting_name"
                                        return-object
                                      >
                                      </v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                      <v-text-field
                                        class="ml-2 FontSize field_label_size field_height"
                                        dense
                                        label="Quantity"
                                        v-model="amcqty"
                                        outlined
                                      >
                                      </v-text-field>
                                    </v-col>
                                    <v-btn
                                      @click="save('AMC')"
                                      class="ml-2 mt-1"
                                      x-small
                                      color="primary"
                                      >Add
                                    </v-btn>
                                  </v-row>
                                  <v-col
                                    cols="12"
                                    md="12"
                                    class="mt-n3"
                                    v-if="type"
                                  >
                                    <v-data-table
                                      hide-default-footer
                                      :headers="headers"
                                      :items="quotationList"
                                      dense
                                    >
                                      <template
                                        v-slot:[`item.Action`]="{ item }"
                                      >
                                        <v-btn
                                          icon
                                          small
                                          color="red"
                                          @click="
                                            quotationList.splice(
                                              quotationList.indexOf(item),
                                              1
                                            )
                                          "
                                        >
                                          <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                      </template>
                                    </v-data-table>
                                  </v-col>
                                  <v-card-actions>
                                    <v-spacer />
                                    <v-btn
                                      :loading="isLoading"
                                      @click="saveList()"
                                      small
                                      color="primary"
                                      >Save
                                    </v-btn>
                                  </v-card-actions>
                                </v-col>
                                <!-- <v-col
                                  cols="12"
                                  md="7"
                                  sm="12"
                                >
                                  <v-data-table
                                    hide-default-footer
                                    :headers="headers1"
                                    :items="list"
                                    dense
                                  >
                                  </v-data-table>
                                  <v-card-actions>
                                    <v-spacer />
                                    <v-btn
                                      color="primary"
                                      small
                                      @click="buildTable"
                                    >
                                      Add
                                    </v-btn>
                                  </v-card-actions>
                                </v-col> -->
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-col>
                    <v-col v-if="footer_shown == true" cols="12" md="12">
                      <v-card elevation="10">
                        <v-row no-gutters>
                          <v-card-text
                            align="center"
                            class="primary white--text ma-0 pa-0 py-1"
                            style="font-size: 15px"
                            >Select Type of Footer</v-card-text
                          >
                          <v-col cols="12" md="12">
                            <v-radio-group
                              class="pa-0 ma-0 mt-3 ml-5"
                              row
                              v-model="footer_radio"
                            >
                              <v-radio label="Image" value="image"></v-radio>
                              <v-radio label="text" value="text"></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col cols="12" md="12">
                            <div
                              v-if="footer_radio == 'image'"
                              class="mt-n5"
                              id="app"
                            >
                              <div class="container">
                                <form
                                  enctype="multipart/form-data"
                                  novalidate
                                  v-if="isInitialFooter || isSavingFooter"
                                >
                                  <div class="dropbox">
                                    <input
                                      type="file"
                                      :name="uploadFieldNameFooter"
                                      :disabled="isSavingFooter"
                                      @change="handleClickFooter"
                                      accept="image/*"
                                      class="input-file"
                                    />
                                    <p v-if="isInitialFooter">
                                      Drag your image here to begin<br />
                                      or click to browse<br />
                                    </p>
                                    <p v-if="isSavingFooter">
                                      Uploading {{ fileCount }} files...
                                    </p>
                                  </div>
                                </form>
                                <div>
                                  <div v-if="isSuccessFooter">
                                    <div
                                      v-for="(item, key) in srcArrayFooter"
                                      :key="key"
                                    >
                                      <v-card class="primary white--text">
                                        <v-row no-gutters>
                                          <div class="mt-2 ml-2">
                                            Footer -
                                            {{
                                              item.name.length >= 10
                                                ? item.name.substr(0, 10) +
                                                  "..."
                                                : item.name
                                            }}
                                          </div>
                                          <v-spacer />
                                          <v-tooltip bottom color="primary">
                                            <template v-slot:activator="{ on }">
                                              <v-btn
                                                v-on="on"
                                                icon
                                                @click="resetFooter()"
                                              >
                                                <v-icon class="red--text"
                                                  >mdi-close</v-icon
                                                >
                                              </v-btn>
                                            </template>
                                            <span class="white--text"
                                              >upload another image?</span
                                            >
                                          </v-tooltip>
                                        </v-row>
                                      </v-card>
                                      <v-card>
                                        <v-img
                                          :src="item.src"
                                          class="img-responsive img-thumbnail ma-1"
                                          :alt="item.name"
                                          contain
                                          height="200px"
                                          width="400px"
                                        />
                                        <v-card-subtitle
                                          class="mt-n5"
                                          style="font-size: 9px"
                                        >
                                          Set Height and width of Footer
                                        </v-card-subtitle>
                                        <v-row class="mt-n3 mx-3" no-gutters>
                                          <v-col cols="12" md="12">
                                            <div>
                                              <span style="font-size: 14px"
                                                >Width in pixel</span
                                              >
                                              <span
                                                ><v-text-field
                                                  v-model.number="width_footer"
                                                  placeholder="Enter Width in px"
                                                  dense
                                                  outlined
                                                  type="number"
                                                  class="mr-2"
                                                ></v-text-field
                                              ></span>
                                            </div>
                                          </v-col>
                                          <v-col cols="12" md="12">
                                            <div class="mt-n5">
                                              <span style="font-size: 14px"
                                                >Height in pixel</span
                                              >
                                              <span
                                                ><v-text-field
                                                  v-model.number="height_footer"
                                                  placeholder="Enter Hreight in px"
                                                  dense
                                                  outlined
                                                  type="number"
                                                ></v-text-field
                                              ></span>
                                            </div>
                                          </v-col>
                                        </v-row>
                                      </v-card>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="isFailedFooter">
                                  <h2>upload 1 image only</h2>
                                  <p>
                                    <a
                                      href="javascript:void(0)"
                                      @click="resetFooter()"
                                      >Try again</a
                                    >
                                  </p>
                                  <pre>{{ uploadErrorFooter }}</pre>
                                </div>
                              </div>
                            </div>
                            <v-textarea
                              rows="2"
                              auto-grow
                              class="FontSize field_label_size field_height mx-3"
                              outlined
                              dense
                              v-model="footer_temp"
                              v-if="
                                footer_shown == true && footer_radio == 'text'
                              "
                              label="Headers"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" md="1"></v-col>
                          <v-col cols="12" md="10" v-if="footer_shown == true">
                            <v-btn
                              small
                              color="primary"
                              @click="
                                add_footer(
                                  footer_temp,
                                  width_footer,
                                  height_footer
                                )
                              "
                              block
                              class="mb-3"
                            >
                              <v-icon medium>mdi-plus</v-icon>Add Footer
                            </v-btn>
                          </v-col>
                          <v-col cols="12" md="1"></v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="12" md="9" xs="12">
            <v-card
              class=""
              v-for="(item, idx) in this.StoreObj.html_array"
              :key="idx"
              outlined
              height=""
            >
              <!-- <v-form ref="form"> -->
              <v-card
                height="1250"
                ref="content"
                class="mb-1 pa-3 elevation-2"
                v-html="item.html_contents"
                style="white-space: pre-wrap"
              ></v-card>
              <!-- </v-form> -->
            </v-card>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="isLoading"
                @click="generateQuotation"
                small
                color="primary"
                >Generate quotation
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </div>
</template>
<script>
// import { VueEditor } from "vue2-editor";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GetAllComponents } from "@/mixins/Product/GetAllComponents.js";
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateQuotation } from "@/graphql/mutations.js";
import { GetHTMLTable } from "@/mixins/Contracts/GetHTMLTable.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;
const STATUS_INITIAL_FOOTER = 0,
  STATUS_SAVING_FOOTER = 1,
  STATUS_SUCCESS_FOOTER = 2,
  STATUS_FAILED_FOOTER = 3;
var AWS = require("aws-sdk");

// import { VueEditor } from "vue2-editor";
export default {
  components: {
    Snackbar,
    Overlay,
    // VueEditor,
  },
  props: {
    current_view: String,
  },
  mixins: [
    GetAllServices,
    GetAllComponents,
    GetAllServiceTypes,
    GetHTMLTable,
    GetAllOrganizationSetting,
  ],
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
    isInitialFooter() {
      return this.currentStatusFooter === STATUS_INITIAL_FOOTER;
    },
    isSavingFooter() {
      return this.currentStatusFooter === STATUS_SAVING_FOOTER;
    },
    isSuccessFooter() {
      return this.currentStatusFooter === STATUS_SUCCESS_FOOTER;
    },
    isFailedFooter() {
      return this.currentStatusFooter === STATUS_FAILED_FOOTER;
    },
  },

  data: () => ({
    footer_temp: "",
    srcArrayFooter: [],
    GetAllAMCTypeList : [],
    footer_value: false,
    height: 200,
    width: 200,
    height_footer: 200,
    width_footer: 200,
    header_radio: "image",
    uploadFieldName: "photos",
    uploadFieldNameFooter: "photos",
    customToolbar: [[]],
    view: false,
    dialog: false,
    date: "",
    menu: false,
    select_template: "",
    GetAllCustomerList: [],
    overlay: false,
    SnackBarComponent: {},
    content: "",
    org_shown: false,
    orglogo_shown: false,
    cust_shown: false,
    header_shown: false,
    footer_shown: false,
    date_shown: false,
    active_shown: false,
    cust_add_shown: false,
    list_items: ["Vidyaranyapura"],
    customer_address: "",
    text_to_replace: "",
    customer_name: "",
    producttypes: "",
    product_List: [],
    GetAllServicesList: [],
    GetAllComponentsList: [],
    component: "",
    qty: "",
    compqty: "",
    amcType: "",
    amcqty: "",
    SerTypeList: [],
    servicetype: "",
    serviceTypeQty: "",
    quotationList: [],
    quotationBuilderItems: [],
    list: [],
    datatable: [],
    isLoading: false,
    header_temp: "",
    footer: "",
    logosrc: "",
    headers: [
      { text: "Item", value: "producttypes" },
      { text: "Quantity", value: "qty" },
      { text: "Action", value: "Action" },
    ],
    headers1: [
      { text: "Code", value: "data_code" },
      { text: "Item", value: "data_name" },
      { text: "Quantity", value: "quantity" },
      { text: "Price", value: "price" },
      { text: "Total Price", value: "price" },
    ],
    select_type: ["Product", "Components", "Service Type", "AMC Type"],
    type: "",
    cust_name_change_count: 0,
    new_cust_name_array: [],
    cust_date_change_count: 0,
    new_cust_date_array: [],
    cust_address_change_count: 0,
    new_cust_address_array: [],
    new_header_array: [],
    new_footer_array: [],
    cust_footer_change_count: 0,
    srcArray: [],
    uploadError: null,
    uploadErrorFooter: null,
    currentStatus: null,
    currentStatusFooter: null,
    fileList: [],
    fileCount: 0,
    insert_image: false,
    width_array: [],
    height_array: [],
    new_image_header_array: [],
    cust_image_header_change_count: [],
    data_img: [],
    data_img_footer: [],
    width_array_footer: [],
    height_array_footer: [],
    footer_radio: "image",
    cust_header_change_count: 0,
    fileListFooter: [],
    contentArray: [],
  }),
  mounted() {
    this.reset();
    this.resetFooter();
    this.listTemplate();
    this.GetAllServicesMethod(
      (this.service_enable_type = "PRODUCT"),
      (this.service_status = "ACTIVE")
    );
    this.GetAllComponentsMethod((this.status = "ACTIVE"));
    this.GetAllServiceTypeMethod((this.status = "ACTIVE"));
    this.GetAllCustomerMethod((this.customer_status = "ACTIVE"));
    this.GetAllAMCTypeMethod("ACTIVE", "AMC");
    // this.gethtmlmethod();
  },
  watch: {
    select_template(item) {
      this.new_header_array = [];
      this.new_footer_array = [];
      this.width_array = [];
      this.height_array = [];
      this.StoreObj = item;
      for (let i = 0; i < this.StoreObj.html_array.length; i++) {
        if (
          this.StoreObj.html_array[i].html_contents.includes(
            "$_{Organization_Address}"
          )
        ) {
          this.org_shown = true;
        }
        if (this.StoreObj.html_array[i].html_contents.includes("$_{Header}")) {
          this.header_shown = true;
        }
        if (this.StoreObj.html_array[i].html_contents.includes("$_{Footer}")) {
          this.footer_shown = true;
        }
        if (
          this.StoreObj.html_array[i].html_contents.includes(
            "$_{Customer_Name}"
          )
        ) {
          this.cust_shown = true;
        }
        if (
          this.StoreObj.html_array[i].html_contents.includes(
            "$_{Date_Selection}"
          )
        ) {
          this.date_shown = true;
        }
        if (
          this.StoreObj.html_array[i].html_contents.includes(
            "$_{Quotation_Table}"
          )
        ) {
          this.active_shown = true;
        }
      }
    },

    customer_address(val) {
      this.new_cust_address_array.push(val);
      for (let i = 0; i < this.StoreObj.html_array.length; i++) {
        if (this.cust_address_change_count == 0) {
          if (
            this.StoreObj.html_array[i].html_contents.includes(
              " $_{Organization_Address}"
            )
          ) {
            this.StoreObj.html_array[i].html_contents =
              this.StoreObj.html_array[i].html_contents.replace(
                "$_{Organization_Address}",
                this.new_cust_address_array[0]
              );
          }
        } else {
          if (
            this.StoreObj.html_array[i].html_contents.includes(
              this.new_cust_address_array[this.cust_address_change_count - 1]
            )
          ) {
            this.StoreObj.html_array[i].html_contents =
              this.StoreObj.html_array[i].html_contents.replace(
                this.new_cust_address_array[this.cust_address_change_count - 1],
                this.new_cust_address_array[this.cust_address_change_count]
              );
          }
        }
      }
      this.cust_address_change_count += 1;
    },
    customer_name(val) {
      this.new_cust_name_array.push(`${
        val.customer_name != undefined ? val.customer_name : " - "
      }
    ${val.customer_address != undefined ? val.customer_address : " - "}
    ${val.customer_email_id != undefined ? val.customer_email_id : " - "}`);
      for (let i = 0; i < this.StoreObj.html_array.length; i++) {
        if (this.cust_name_change_count == 0) {
          if (
            this.StoreObj.html_array[i].html_contents.includes(
              "$_{Customer_Name}"
            )
          ) {
            this.StoreObj.html_array[i].html_contents =
              this.StoreObj.html_array[i].html_contents.replace(
                "$_{Customer_Name}",
                this.new_cust_name_array[0]
              );
          }
        } else {
          if (
            this.StoreObj.html_array[i].html_contents.includes(
              this.new_cust_name_array[this.cust_name_change_count - 1]
            )
          ) {
            this.StoreObj.html_array[i].html_contents =
              this.StoreObj.html_array[i].html_contents.replace(
                this.new_cust_name_array[this.cust_name_change_count - 1],
                this.new_cust_name_array[this.cust_name_change_count]
              );
          }
        }
      }
      this.cust_name_change_count += 1;
    },
    date(val) {
      this.new_cust_date_array.push(val);
      for (let i = 0; i < this.StoreObj.html_array.length; i++) {
        if (this.cust_date_change_count == 0) {
          if (
            this.StoreObj.html_array[i].html_contents.includes(
              "$_{Date_Selection}"
            )
          ) {
            this.StoreObj.html_array[i].html_contents =
              this.StoreObj.html_array[i].html_contents.replace(
                "$_{Date_Selection}",
                this.new_cust_date_array[0]
              );
          }
        } else {
          if (
            this.StoreObj.html_array[i].html_contents.includes(
              this.new_cust_date_array[this.cust_date_change_count - 1]
            )
          ) {
            this.StoreObj.html_array[i].html_contents =
              this.StoreObj.html_array[i].html_contents.replace(
                this.new_cust_date_array[this.cust_date_change_count - 1],
                this.new_cust_date_array[this.cust_date_change_count]
              );
          }
        }
      }
      this.cust_date_change_count += 1;
    },
    header_temp(val) {
      if (val.length === 0) {
        for (let i = 0; i < this.StoreObj.html_array.length; i++) {
          this.StoreObj.html_array[i].html_contents =
            "$_{Header}" + this.StoreObj.html_array[i].html_contents;
        }
      }
      this.$forceUpdate();
    },
    footer(val) {
      if (val.length === 0) {
        for (let i = 0; i < this.StoreObj.html_array.length; i++) {
          this.StoreObj.html_array[i].html_contents =
            this.StoreObj.html_array[i].html_contents + "$_{Footer}";
        }
      }
      this.$forceUpdate();
    },
  },
  methods: {
    async uploadMediaToS3(callbackFn) {
      this.loading = true;
      if (this.fileList.length != 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          const fr = new FileReader();
          fr.readAsDataURL(this.fileList[i]);
          fr.addEventListener("load", async () => {
            var imageUrl = [];
            imageUrl = fr.result.replace(
              "data:" + this.fileList[i].type + ";base64,",
              ""
            );
            var keyValue =
              new Date().getTime() + "/" + this.fileList[i].name.includes(" ")
                ? this.fileList[i].name.split(" ")[0]
                : this.fileList[i].name;
            var self = this;
            self.urls3 = [];
            var s3Bucket = new AWS.S3({
              region: "ap-south-1",
              accessKeyId: "AKIARAJXABES6RGOPDVD",
              secretAccessKey: "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",
            });
            var param = {
              Bucket: "servicewrkcabinet",
              Key: keyValue,
              Body: Buffer.from(imageUrl, "base64"),
              ContentType: self.fileList[i].type,
              ACL: "public-read-write",
            };
            try {
              await s3Bucket.putObject(param).promise();
              self.urls3.push({
                file_url:
                  "https://servicewrkcabinet.s3.ap-south-1.amazonaws.com/" +
                  keyValue,
                type: self.fileList[i].type.split("/")[0],
              });
              if (self.urls3.length == self.fileList.length) {
                callbackFn(self.urls3);
              }
            } catch (error) {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Uploading failed. Try again",
              };
            }
          });
        }
      }
    },
    async uploadMediaToS3Footer(callbackFn) {
      this.loading = true;
      if (this.fileListFooter.length != 0) {
        for (let i = 0; i < this.fileListFooter.length; i++) {
          const fr = new FileReader();
          fr.readAsDataURL(this.fileListFooter[i]);
          fr.addEventListener("load", async () => {
            var imageUrl = [];
            imageUrl = fr.result.replace(
              "data:" + this.fileListFooter[i].type + ";base64,",
              ""
            );
            var keyValue =
              new Date().getTime() +
              "/" +
              this.fileListFooter[i].name.includes(" ")
                ? this.fileListFooter[i].name.split(" ")[0]
                : this.fileListFooter[i].name;
            var self = this;
            self.urls3 = [];
            var s3Bucket = new AWS.S3({
              region: "ap-south-1",
              accessKeyId: "AKIARAJXABES6RGOPDVD",
              secretAccessKey: "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",
            });
            var param = {
              Bucket: "servicewrkcabinet",
              Key: keyValue,
              Body: Buffer.from(imageUrl, "base64"),
              ContentType: self.fileListFooter[i].type,
              ACL: "public-read-write",
            };
            try {
              await s3Bucket.putObject(param).promise();
              self.urls3.push({
                file_url:
                  "https://servicewrkcabinet.s3.ap-south-1.amazonaws.com/" +
                  keyValue,
                type: self.fileListFooter[i].type.split("/")[0],
              });
              if (self.urls3.length == self.fileListFooter.length) {
                callbackFn(self.urls3);
              }
            } catch (error) {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Uploading failed. Try again",
              };
            }
          });
        }
      }
    },
    show_upload_UI() {
      this.insert_image = true;
    },
    reset() {
      this.srcArray = [];
      this.uploadError = null;
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.currentStatus = STATUS_INITIAL;
    },
    resetFooter() {
      this.srcArrayFooter = [];
      this.uploadErrorFooter = null;
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.currentStatusFooter = STATUS_INITIAL_FOOTER;
    },
    handleClick(e) {
      this.currentStatus = STATUS_SAVING;
      this.fileList = [];
      this.fileCount = e.target.files.length;
      if (e.target.files.length < 2) {
        this.fileList = e.target.files;
        this.uploadMethod(e.target.files);
      } else {
        this.fileList = [];
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Maximum allowed upload is 1",
        };
        this.currentStatus = STATUS_FAILED;
      }
    },
    handleClickFooter(e) {
      this.currentStatusFooter = STATUS_SAVING_FOOTER;
      this.fileListFooter = [];
      this.fileCount = e.target.files.length;
      if (e.target.files.length < 2) {
        this.fileListFooter = e.target.files;
        this.uploadMethodFooter(e.target.files);
      } else {
        this.fileListFooter = [];
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Maximum allowed upload is 1",
        };
        this.currentStatusFooter = STATUS_FAILED_FOOTER;
      }
    },
    async uploadMethod(files) {
      for (let i = 0; i < files.length; i++) {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(files[i]);
        fileReader.addEventListener("load", (e) => {
          this.srcArray.push({
            src: e.target.result,
            name: files[i].name,
          });
          this.currentStatus = STATUS_SUCCESS;
          this.$forceUpdate();
        });
      }
    },
    async uploadMethodFooter(files) {
      for (let i = 0; i < files.length; i++) {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(files[i]);
        fileReader.addEventListener("load", (e) => {
          this.srcArrayFooter.push({
            src: e.target.result,
            name: files[i].name,
          });
          this.currentStatusFooter = STATUS_SUCCESS_FOOTER;
          this.$forceUpdate();
        });
      }
    },
    async add_headers(val, width, height) {
      var self = this;
      self.overlay = true;
      if (self.header_radio == "image") {
        await self.uploadMediaToS3(function (data) {
          self.data_img = data;
          self.new_header_array.push(self.data_img[0].file_url);
          self.width_array.push(width);
          self.height_array.push(height);
          self.push_header_contents_method(self.new_header_array);
        });
      } else if (self.header_radio != "image") {
        self.new_header_array.push(val);
        self.push_header_contents_method(self.new_header_array);
      }
    },
    push_header_contents_method() {
      var self = this;
      for (let i = 0; i < self.StoreObj.html_array.length; i++) {
        if (self.cust_header_change_count == 0) {
          if (self.header_radio == "image") {
            if (
              self.StoreObj.html_array[i].html_contents.includes("$_{Header}")
            ) {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  "$_{Header}",
                  `<img src='${self.new_header_array[0]}' width=${self.width_array[0]}px; height=${self.height_array[0]}px;  padding: 0; margin: 0> </img>`
                );
            }
          } else if (self.header_radio != "image") {
            self.StoreObj.html_array[i].html_contents =
              self.StoreObj.html_array[i].html_contents.replace(
                "$_{Header}",
                self.new_header_array[0]
              );
          }
        }
        if (self.cust_header_change_count != 0) {
          if (
            self.new_header_array[self.cust_header_change_count - 1].includes(
              "https://servicewrkcabinet.s3.ap-south-1.amazonaws.com"
            )
          ) {
            if (self.header_radio == "image") {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  `<img src='${
                    self.new_header_array[self.cust_header_change_count - 1]
                  }' width=${
                    self.width_array[self.cust_header_change_count - 1]
                  }px; height=${
                    self.height_array[self.cust_header_change_count - 1]
                  }px;  padding: 0; margin: 0> </img>`,
                  `<img src='${
                    self.new_header_array[self.cust_header_change_count]
                  }' width=${
                    self.width_array[self.width_array.length - 1]
                  }px; height=${
                    self.height_array[self.width_array.length - 1]
                  }px;  padding: 0; margin: 0> </img>`
                );
              self.$forceUpdate();
            } else {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  `<img src='${
                    self.new_header_array[self.cust_header_change_count - 1]
                  }' width=${
                    self.width_array[self.width_array.length - 1]
                  }px; height=${
                    self.height_array[self.width_array.length - 1]
                  }px;  padding: 0; margin: 0> </img>`,
                  self.new_header_array[self.cust_header_change_count]
                );
            }
          } else {
            if (self.header_radio == "image") {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  self.new_header_array[self.cust_header_change_count - 1],
                  `<img src='${
                    self.new_header_array[self.cust_header_change_count]
                  }' width=${
                    self.width_array[self.width_array.length - 1]
                  }px; height=${
                    self.height_array[self.width_array.length - 1]
                  }px;  padding: 0; margin: 0> </img>`
                );
            } else {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  self.new_header_array[self.cust_header_change_count - 1],
                  self.new_header_array[self.cust_header_change_count]
                );
            }
          }
        }
      }
      self.$forceUpdate();
      self.cust_header_change_count += 1;
      self.overlay = false;

      self.$forceUpdate();
    },
    async add_footer(val, width, height) {
      var self = this;
      self.overlay = true;

      if (self.footer_radio == "image") {
        await self.uploadMediaToS3Footer(function (data) {
          self.data_img_footer = data;
          self.new_footer_array.push(self.data_img_footer[0].file_url);
          self.width_array_footer.push(width);
          self.height_array_footer.push(height);
          self.push_footer_contents_method(self.new_footer_array);
        });
      } else if (self.footer_radio != "image") {
        self.new_footer_array.push(val);
        self.push_footer_contents_method(self.new_footer_array);
      }
    },
    push_footer_contents_method() {
      var self = this;
      for (let i = 0; i < self.StoreObj.html_array.length; i++) {
        if (self.cust_footer_change_count == 0) {
          if (self.footer_radio == "image") {
            if (
              self.StoreObj.html_array[i].html_contents.includes("$_{Footer}")
            ) {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  "$_{Footer}",
                  `<img src='${self.new_footer_array[0]}' width=${self.width_array_footer[0]}px; height=${self.height_array_footer[0]}px;  padding: 0; margin: 0> </img>`
                );
            }
          } else if (self.footer_radio != "image") {
            self.StoreObj.html_array[i].html_contents =
              self.StoreObj.html_array[i].html_contents.replace(
                "$_{Footer}",
                self.new_footer_array[0]
              );
          }
        }
        if (self.cust_footer_change_count != 0) {
          if (
            self.new_footer_array[self.cust_footer_change_count - 1].includes(
              "https://servicewrkcabinet.s3.ap-south-1.amazonaws.com"
            )
          ) {
            if (self.footer_radio == "image") {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  `<img src='${
                    self.new_footer_array[self.cust_footer_change_count - 1]
                  }' width=${
                    self.width_array_footer[self.cust_footer_change_count - 1]
                  }px; height=${
                    self.height_array_footer[self.cust_footer_change_count - 1]
                  }px;  padding: 0; margin: 0> </img>`,
                  `<img src='${
                    self.new_footer_array[self.cust_footer_change_count]
                  }' width=${
                    self.width_array_footer[self.width_array_footer.length - 1]
                  }px; height=${
                    self.height_array_footer[self.width_array_footer.length - 1]
                  }px;  padding: 0; margin: 0> </img>`
                );
              self.$forceUpdate();
            } else {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  `<img src='${
                    self.new_footer_array[self.cust_footer_change_count - 1]
                  }' width=${
                    self.width_array_footer[self.width_array_footer.length - 1]
                  }px; height=${
                    self.height_array_footer[self.width_array_footer.length - 1]
                  }px;  padding: 0; margin: 0> </img>`,
                  self.new_footer_array[self.cust_footer_change_count]
                );
            }
          } else {
            if (self.footer_radio == "image") {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  self.new_footer_array[self.cust_footer_change_count - 1],
                  `<img src='${
                    self.new_footer_array[self.cust_footer_change_count]
                  }' width=${
                    self.width_array_footer[self.width_array_footer.length - 1]
                  }px; height=${
                    self.height_array_footer[self.width_array_footer.length - 1]
                  }px;  padding: 0; margin: 0> </img>`
                );
            } else {
              self.StoreObj.html_array[i].html_contents =
                self.StoreObj.html_array[i].html_contents.replace(
                  self.new_footer_array[self.cust_footer_change_count - 1],
                  self.new_footer_array[self.cust_footer_change_count]
                );
            }
          }
        }
      }
      self.$forceUpdate();
      self.cust_footer_change_count += 1;
      self.overlay = false;
      self.$forceUpdate();
    },
    buildTable() {
      // Build a HTML Template
      let HTML = `
        <style>
          table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
          font-size: 16px
        }
        body{
          margin-left:6px;
          margin-right:6px;
          margin-top:6px;
          margin-bottom:6px;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
        </style>
        <html>
        <body>
        ${this.StoreObj.html_array[0].html_contents}
        </body>
        </html>
        `;
      let tableData = `<table>
        <tr>
          <th>S.No</th>
          <th>Item Code</th>
          <th>Item Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total Price</th>
        </tr>`;
      for (let i = 0; i < this.list.length; i++) {
        var row = `<tr>
          <td>${i + 1}</td>
          <td>${
            this.list[i].data_code != undefined ? this.list[i].data_code : "-"
          }</td>
          <td>${
            this.list[i].data_name != undefined ? this.list[i].data_name : "-"
          }</td>
          <td>${
            this.list[i].quantity != undefined ? this.list[i].quantity : "-"
          }</td>
          <td>${this.list[i].price != undefined ? this.list[i].price : "-"}</td>
          <td>${
            this.list[i].total_price != undefined
              ? this.list[i].total_price
              : "-"
          }</td>
          </tr>`;
        tableData += row;
        var footer = `<tfoot>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>Tax</td>
              <td>${this.Tax}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>Grand Total</td>
              <td>${this.Final}</td>
            </tr>
          </tfoot>`;
      }
      tableData = tableData + footer + "</table>";
      var new_HTML = ``;
      new_HTML = HTML.replace(
        "$_{Quotation_Table}",
        "<p>" + tableData + "</p>"
      );
      this.StoreObj.html_array[0].html_contents = new_HTML;
      this.dialog = false;
      this.$forceUpdate();
    },
    async generateQuotation() {
      this.isLoading = true;
      this.overlay = true;
      try {
        var new_html_contents_array = [];
        for (let i = 0; i < this.StoreObj.html_array.length; i++) {
          new_html_contents_array.push({
            html_contents: `<div style="white-space: pre-wrap"> ${this.StoreObj.html_array[i].html_contents}</div><style>
            .ql-align-center {
              text-align: center;
            }
            .ql-align-left {
              text-align: left;
            }
            .ql-align-right {
              text-align: right;
            }
            .ql-align-justify {
              text-align: justify;
            }
            .main_div {
              position: relative;
              height: 1000px;
              display: flow-root;
            }
            .sub_div {
              position: absolute;
              bottom: 0px;
            }
            .margin-top {
              margin-top: 150px;
            }
            .center {
              margin: auto;
              width: 50%;
            }
            .ql-font-monospace {
              font-family: "Courier New", monospace;
            }
            .ql-font-serif {
              font-family: Georgia, serif;
            }
            * {
              margin: 0px;
              padding: 0px;
            }
            body {
              margin-left: 30px;
              margin-right: 30px;
              margin-bottom: 30px;
              font-size: 12px;
            }
            .v-application p {
              margin-bottom: 0px;
            }
            </style>`,
            page_no: this.StoreObj.html_array[i].page_no,
          });
        }
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          template_id: this.StoreObj.template_id,
          html_array: new_html_contents_array,
        };
        if (
          this.customer_name != undefined &&
          this.customer_name != null &&
          this.customer_name != ""
        ) {
          inputParams.customer_name = this.customer_name.customer_name;
        }

        let result = await API.graphql(
          graphqlOperation(GenerateQuotation, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.GenerateQuotation);
        if (ResultObject.status == "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.Status_Message,
          };
        }
        this.SendCardEmit((this.Toggle = 2));

        this.isLoading = false;
        this.overlay = false;
      } catch (error) {
        this.isLoading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
      }
    },

    async saveList() {
      try {
        var self = this;
        self.overlay = true;
        this.isLoading = true;
        var ql = [];
        for (let i = 0; i < this.quotationList.length; i++) {
          ql.push({
            data_id: this.quotationList[i].id,
            query_type: this.quotationList[i].type,
            quantity: Number(this.quotationList[i].qty),
          });
        }
        const path = "listquerybaseditemsfortabulardata";
        const myInit = {
          body: {
            command: "listQueryBasedItemsForTabularData",
            selected_data: ql,
          },
        };
        API.post("listquerybaseditemsfortabulardata", path, myInit).then(
          (response) => {
            self.overlay = false;
            this.isLoading = false;
            this.GrandTotal = 0;

            if (response.errorType != "Error") {
              self.list = response.data.items;
              for (let i = 0; i < self.list.length; i++) {
                this.Total = this.list[i].total_price;
                this.GrandTotal += this.Total;
                this.Tax = this.GrandTotal * 0.18;
                this.Final = this.GrandTotal + this.Tax;
              }
              this.buildTable();
              this.dialog = false;
              self.overlay = false;
              this.isLoading = false;
            } else {
              self.list = [];
              self.overlay = false;
              this.isLoading = false;
            }
          }
        );
      } catch (err) {
        self.overlay = true;
        self.list = [];
      }
    },
    async listTemplate() {
      try {
        var self = this;
        self.overlay = true;
        const path = "listtemplates";
        const myInit = {
          body: {
            command: "listTemplates",
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            template_status: "ACTIVE" / "INACTIVE",
          },
        };
        API.post("SERVICEWRK", path, myInit).then((response) => {
          if (response.errorType != "Error") {
            self.quotationBuilderItems = response.data.items;
            self.overlay = false;
          } else {
            self.quotationBuilderItems = [];
            self.overlay = false;
          }
        });
      } catch (err) {
        console.log(err);
        self.overlay = true;
        self.quotationBuilderItems = [];
      }
    },
    get_html() {
      this.org_shown = false;
      this.cust_shown = false;
      this.date_shown = false;
      this.active_shown = false;
      this.header_shown = false;
      this.footer_shown = false;
      var content = document.body;
      content.addEventListener("click", this.onClick());
    },
    getBoundaryPoints(range) {
      return {
        start: range.startOffset,
        end: range.endOffset,
      };
    },
    expandTextRange(range) {
      // expand to include a whole word
      var matchesStart = (r) => r.toString().match(/^\s/); // Alternative: /^\W/
      var matchesEnd = (r) => r.toString().match(/\s$/); // Alternative: /\W$/

      // Find start of word
      while (!matchesStart(range) && range.startOffset > 0) {
        range.setStart(range.startContainer, range.startOffset - 1);
      }
      if (matchesStart(range))
        range.setStart(range.startContainer, range.startOffset + 1);

      // Find end of word
      var length =
        range.endContainer.length || range.endContainer.childNodes.length;
      while (!matchesEnd(range) && range.endOffset < length) {
        range.setEnd(range.endContainer, range.endOffset + 1);
      }
      if (matchesEnd(range) && range.endOffset > 0)
        range.setEnd(range.endContainer, range.endOffset - 1);
      this.$forceUpdate();
    },

    save(type) {
      var ObjectList = {
        producttypes: "",
        qty: 0,
        type: "",
        id: "",
      };
      if (type == "Product") {
        ObjectList = {
          producttypes: this.producttypes.service_name,
          id: this.producttypes.service_id,
          qty: this.qty,
          type: "SERVICE",
        };
      }
      if (type == "Component") {
        ObjectList = {
          producttypes: this.component.component_name,
          id: this.component.component_id,
          qty: this.compqty,
          type: "COMPONENT",
        };
      }
      if (type == "Service Type") {
        ObjectList = {
          producttypes: this.servicetype.service_type_name,
          id: this.servicetype.service_type_id,
          qty: this.serviceTypeQty,
          type: "SERVICE_TYPE",
        };
      }
      if (type == "AMC") {
        ObjectList = {
          producttypes: this.amcType.setting_name,
          id: this.amcType.setting_id,
          qty: this.amcqty,
          type: "AMC_TYPE",
        };
      }

      this.quotationList.push(ObjectList);
    },
    SendCardEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style>
/* .table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    border-style: solid;
    margin-right: 10px;
    margin-left: 5px;
  }
  
  th,
  td {
    border-style: solid;
    border-color: #96d4d4;
    border: 1px solid;
  }
  .html-content {
    padding: 8px;
  }
  tr:nth-child(even) {
    background-color: #dddddd;
    border: 1px solid;
  }
  .tableclass {
    width: 500px;
    block-size: fit-content;
    border: 1px solid;
  }
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    border: 1px solid;
  }
  
  tr:nth-child(even) {
    background-color: #dddddd;
  }
  .tableclass {
    width: 500px;
    block-size: fit-content;
  }
  #myTable {
    border: 2px solid;
    text-align: left;
    padding: 12px;
  } */
.ql-align-center {
  text-align: center;
}
.ql-align-left {
  text-align: left;
}
.ql-align-right {
  text-align: right;
}
.ql-align-justify {
  text-align: justify;
}
.main_div {
  position: relative;
  height: 1000px;
  display: flow-root;
}
.sub_div {
  position: absolute;
  bottom: 0px;
}
.margin-top {
  margin-top: 150px;
}
.center {
  margin: auto;
  width: 50%;
}
.ql-font-monospace {
  font-family: "Courier New", monospace;
}
.ql-font-serif {
  font-family: Georgia, serif;
}
* {
  margin: 0;
  padding: 0;
}
.v-application p {
  margin-bottom: 0px;
}
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  /* padding: 10px 10px; */
  height: 100px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 0.8em;
  text-align: center;
  padding: 25px 0;
}
</style>
