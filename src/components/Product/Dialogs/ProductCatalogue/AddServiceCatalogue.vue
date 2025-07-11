<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      persistent
      :max-width="
        s3_files.length == 0 && selected_files.length == 0 ? '400px' : '1100px'
      "
      :value="AddServiceCatalogue"
    >
      <v-card class="elevation-0">
        <v-toolbar class="primary elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATE"
                ? "Add Product Catalogue"
                : "Edit Product Catalogue"
            }}
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.service_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="AddServiceCatalogueEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-2 pb-0">
          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="s3_files.length == 0 && selected_files.length == 0 ? 12 : 4"
            >
              <v-row no-gutters>
                <v-col cols="12" xs="12" sm="12" md="5">
                  <v-checkbox
                    :readonly="StoreObj.action == 'EDIT'"
                    v-model="service_technician_enabled"
                    label="Enable Technician"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="5">
                  <v-checkbox
                    :readonly="$store.getters.get_user_type == 'MANAGER'"
                    v-if="service_technician_enabled == true"
                    v-model="is_visible"
                    label="Enable Visibility"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-form ref="form">
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  label="Master Category *"
                  v-model="master_category_id"
                  :items="masterCategoryItems"
                  item-value="master_category_id"
                  item-text="master_category_name"
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="
                    StoreObj.action == 'EDIT' ||
                    $store.getters.get_user_type == 'MANAGER'
                  "
                >
                </v-autocomplete>
                <v-autocomplete
                  dense
                  outlined
                  persistent-hint
                  class="FontSize"
                  label="Category *"
                  v-model="category_id"
                  item-value="category_id"
                  item-text="category_name"
                  :rules="[(v) => !!v || 'Required']"
                  :items="GetCategoriesByMasterCategoryListFilter"
                  :readonly="
                    StoreObj.action == 'EDIT' ||
                    $store.getters.get_user_type == 'MANAGER'
                  "
                >
                </v-autocomplete>
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Product *"
                  v-model="service_name"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Product Id"
                  v-model="product_id"
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Product Price"
                  v-model="product_price"
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  :maxlength="3"
                  persistent-hint
                  label="Prefix *"
                  class="FontSize"
                  v-model="service_ticket_prefix"
                  :rules="[(v) => !!v || 'Required']"
                  hint="Service Prefix must be 3 Characters"
                  @keyup="callmethodUppercase(service_ticket_prefix)"
                  :readonly="$store.getters.get_user_type == 'MANAGER'"
                ></v-text-field>
                <v-autocomplete
                  dense
                  multiple
                  outlined
                  class="FontSize"
                  label="Service Type"
                  v-model="service_type_ids"
                  item-value="service_type_id"
                  item-text="service_type_name"
                  :items="GetAllServiceTypeList"
                  v-if="service_technician_enabled"
                  :readonly="$store.getters.get_user_type == 'MANAGER'"
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggle">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            GetAllServiceTypeList.length > 0
                              ? 'purple darken-4'
                              : ''
                          "
                        >
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Select All</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-autocomplete>
                <v-file-input
                  dense
                  outlined
                  multiple
                  v-model="files"
                  class="FontSize"
                  :prepend-icon="null"
                  label="Product Manual"
                  append-icon="mdi-paperclip"
                  v-if="service_technician_enabled == true"
                  :readonly="$store.getters.get_user_type == 'MANAGER'"
                >
                </v-file-input>
                <v-checkbox
                  mb-4
                  label="Auto tag users"
                  v-model="autotag_to_users"
                ></v-checkbox>
              </v-form>
            </v-col>
            <v-col
              v-if="s3_files.length != 0 || selected_files.length != 0"
              cols="12"
              xs="12"
              sm="12"
              md="8"
            >
              <div v-if="s3_files.length != 0" class="font-weight-bold">
                Files Added
              </div>
              <v-data-table
                dense
                :items="s3_files"
                class="elevation-0"
                :headers="s3_files_header"
                v-if="s3_files.length != 0"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ s3_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.file_name`]="{ item }">
                  <div class="FontSize">
                    {{ item.file_name }}
                  </div>
                </template>
                <template v-slot:[`item.file_type`]="{ item }">
                  <div class="FontSize">
                    {{ item.file_type }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn icon color="primary" @click="previewAttachment(item)">
                    <v-icon small>mdi-paperclip</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="red"
                    @click="s3_files.splice(s3_files.indexOf(item), 1)"
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
              <div
                v-if="selected_files.length != 0"
                class="font-weight-bold mt-n3"
              >
                Selected Files
              </div>
              <v-data-table
                v-if="selected_files.length != 0"
                dense
                class="elevation-0"
                :headers="selected_files_header"
                :items="selected_files"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ selected_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <div class="FontSize">
                    {{ item.name }}
                  </div>
                </template>
                <template v-slot:[`item.type`]="{ item }">
                  <div class="FontSize">
                    {{ item.type }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn
                    icon
                    color="red"
                    @click="
                      selected_files.splice(selected_files.indexOf(item), 1)
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="isLoading"
            @click="validateMethod()"
            class="mr-2 primary white--text"
            >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import {
  Create_Service_Products_Or_Center,
  Update_Service_Products_Or_Center,
} from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
import { GetAllActiveCategories } from "@/mixins/Product/GetAllActiveCategories.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
var aws = require("aws-sdk");
import { Buffer } from "buffer";
window.Buffer = Buffer;
const uuid = require("uuid");
export default {
  components: {
    Snackbar,
  },
  props: {
    StoreObj: Object,
    AddServiceCatalogue: Boolean,
  },
  mixins: [
    GenerateS3URL,
    GetAllServiceTypes,
    GetAllActiveCategories,
    GetAllOrganizationSettingsTypesInMS,
  ],
  data: () => ({
    renderComp: true,
    is_visible: true,
    isLoading: false,
    autotag_to_users: false,
    service_technician_enabled: true,
    product_id: "",
    category_id: "",
    service_name: "",
    product_price: "",
    master_category_id: "",
    service_ticket_prefix: "",
    files: [],
    s3_files: [],
    selected_files: [],
    service_type_ids: [],
    masterCategoryItems: [],
    GetAllServiceTypeList: [],
    GetCategoriesByMasterCategoryListFilter: [],
    s3_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    SnackBarComponent: {},
  }),
  mounted() {
    this.GetAllOrganizationSettingsTypesMethod();
  },
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    master_category_id(val) {
      if (val != null) {
        this.GetCategoriesByMasterCategoryListFilter =
          this.categoryItems.filter((item) => item.master_category_id == val);
      }
    },
    AddServiceCatalogue(val) {
      if (val == true) {
        this.GetAllServiceTypeMethod("ACTIVE");
        if (this.StoreObj.action == "EDIT") {
          this.master_category_id = this.StoreObj.master_category_id;
          this.category_id = this.StoreObj.category_id;
          this.service_name = this.StoreObj.service_name;
          this.product_id = this.StoreObj.service_display_id;
          this.service_ticket_prefix = this.StoreObj.service_ticket_prefix;
          this.product_price = this.StoreObj.service_price;
          this.service_technician_enabled =
            this.StoreObj.service_technician_enabled;
          this.service_type_ids = this.StoreObj.service_type_ids;
          this.s3_files =
            this.StoreObj.service_s3_files != null &&
            this.StoreObj.service_s3_files != undefined &&
            this.StoreObj.service_s3_files.length != 0
              ? this.StoreObj.service_s3_files
              : [];
          this.autotag_to_users = this.StoreObj.autotag_to_users;
          if (this.service_technician_enabled == true) {
            this.is_visible = this.StoreObj.is_visible;
          }
        }
      }
    },
  },
  computed: {
    allProductsSelected() {
      return this.GetAllServiceTypeList.length === this.service_type_ids.length;
    },
    someProductsSelected() {
      return this.GetAllServiceTypeList.length > 0 && !this.allProductsSelected;
    },
    icon() {
      if (this.allProductsSelected) return "mdi-close-box";
      if (this.someProductsSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  methods: {
    previewAttachment(item){
      window.open(item.file_url);
    },
    toggle() {
      this.$nextTick(() => {
        if (this.allProductsSelected) {
          this.service_type_ids = [];
        } else {
          this.service_type_ids = this.GetAllServiceTypeList.map(
            (item) => item.service_type_id
          );
        }
      });
    },
    callmethodUppercase(service_ticket_prefix) {
      this.service_ticket_prefix = service_ticket_prefix.toUpperCase();
    },
    async uploadMediaToS3() {
      this.isLoading = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
        };
        this.s3_files.push(Obj);
        if (i == this.selected_files.length - 1) {
          if (this.StoreObj.action == "CREATE") {
            this.addServiceCatalogue();
          } else {
            this.updateServiceCatalogue();
          }
        }
      }
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.service_technician_enabled == true) {
          if (this.StoreObj.action == "CREATE") {
            if (this.selected_files.length != 0) {
              this.count = 0;
              this.uploadMediaToS3();
            } else {
              this.addServiceCatalogue(this.s3_files);
            }
          } else if (this.StoreObj.action == "EDIT") {
            if (this.selected_files.length != 0) {
              this.count = 0;
              this.uploadMediaToS3();
            } else {
              this.updateServiceCatalogue(this.s3_files);
            }
          }
        } else {
          if (this.StoreObj.action == "CREATE") {
            if (this.files.length != 0) {
              this.count = 0;
              this.uploadMediaToS3();
            } else {
              this.addServiceCatalogue(this.selected_files);
            }
          } else if (this.StoreObj.action == "EDIT") {
            if (this.files.length != 0) {
              this.count = 0;
              this.uploadMediaToS3();
            } else {
              this.updateServiceCatalogue(this.selected_files);
            }
          }
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.renderComp = true;
        });
      }
    },
    async updateServiceCatalogue(s3URL) {
      this.isLoading = true;
      try {
        this.s3_files.map((item) => {
          delete item.file_size;
          delete item.__typename;
          this.$forceUpdate();
        });
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          service_id: this.StoreObj.service_id,
          service_name: this.service_name,
          service_ticket_prefix: this.service_ticket_prefix,
        };
        if (
          this.product_id != undefined &&
          this.product_id != null &&
          this.product_id != ""
        ) {
          inputParams.service_display_id = this.product_id;
        }
        if (
          this.product_price != undefined &&
          this.product_price != null &&
          this.product_price != ""
        ) {
          inputParams.service_price = this.product_price;
        }
        if (this.StoreObj.service_technician_enabled == true) {
          inputParams.is_visible = this.is_visible;
          inputParams.service_type_ids = this.service_type_ids;
        }
        if (this.s3_files.length != 0) {
          inputParams.service_s3_files = this.s3_files;
        }
        let result = await API.graphql(
          graphqlOperation(Update_Service_Products_Or_Center, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Update_Service_Products_Or_Center
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
          this.AddServiceCatalogueEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
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
    },
    async addServiceCatalogue(s3URL) {
      this.isLoading = true;
      try {
        var inputParams = {
          service_id: uuid.v4(),
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          category_id: this.category_id,
          service_name: this.service_name,
          service_ticket_prefix: this.service_ticket_prefix,
          service_technician_enabled: this.service_technician_enabled,
          autotag_to_users:
            this.autotag_to_users != undefined &&
            this.autotag_to_users != null &&
            this.autotag_to_users != ""
              ? this.autotag_to_users
              : undefined,
        };
        if (
          this.product_id != undefined &&
          this.product_id != null &&
          this.product_id != ""
        ) {
          inputParams.service_display_id = this.product_id;
        }
        if (
          this.product_price != undefined &&
          this.product_price != null &&
          this.product_price != ""
        ) {
          inputParams.service_price = this.product_price;
        }
        if (this.service_technician_enabled == true) {
          inputParams.is_visible = this.is_visible;
          if (
            this.service_type_ids != undefined &&
            this.service_type_ids != null &&
            this.service_type_ids != ""
          ) {
            inputParams.service_type_ids = this.service_type_ids;
          }
        }
        if (this.s3_files.length != 0) {
          inputParams.service_s3_files = this.s3_files;
        }
        let result = await API.graphql(
          graphqlOperation(Create_Service_Products_Or_Center, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Create_Service_Products_Or_Center
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

          this.AddServiceCatalogueEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
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
    },

    AddServiceCatalogueEmit(Toggle) {
      this.s3_files = [];
      this.selected_files = [];
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
