<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      persistent
      :max-width="
        s3_files.length == 0 && selected_files.length == 0 ? '400px' : '1100px'
      "
      :value="dialogAddComponent"
    >
      <v-card class="elevation-0">
        <v-toolbar class="primary elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATE" ? "Add Component" : "Edit Component"
            }}
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.component_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            dark
            text
            class="mr-n4"
            @click="CloseDialog((Toggle = 1))"
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
              <v-form ref="form">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  v-model="component_name"
                  label="Component Name *"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  :maxlength="12"
                  label="Component Code *"
                  v-model="component_product_code"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Description *"
                  v-model="component_description"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  label="Component Price"
                  v-model="component_price"
                ></v-text-field>
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  label="Unit Of Measure"
                  v-model="unit_of_measure"
                  :items="unit_measure_List"
                ></v-autocomplete>
                <v-file-input
                  dense
                  outlined
                  multiple
                  v-model="files"
                  class="FontSize"
                  label="File input"
                  :prepend-icon="null"
                  append-icon="mdi-paperclip"
                  v-if="StoreObj.action == 'EDIT'"
                >
                </v-file-input>
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
                @click:row="handleRowClick"
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
                  <v-btn
                    icon
                    color="red"
                    @click.stop="s3_files.splice(s3_files.indexOf(item), 1)"
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
                dense
                class="elevation-0"
                :items="selected_files"
                :headers="selected_files_header"
                v-if="selected_files.length != 0"
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
                    @click.stop="
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
var aws = require("aws-sdk");
import { Buffer } from "buffer";
window.Buffer = Buffer;
import {
  Create_Service_Based_Component,
  Update_Component,
} from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllActiveCategories } from "@/mixins/Product/GetAllActiveCategories.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  components: {
    Snackbar,
  },
  props: {
    StoreObj: Object,
    dialogAddComponent: Boolean,
  },
  mixins: [
    GenerateS3URL,
    GetAllActiveCategories,
    GetAllOrganizationSettingsTypesInMS
  ],
  data: () => ({
    component_name: "",
    component_price: "",
    unit_of_measure: "",
    component_description: "",
    component_product_code: "",
    isLoading: false,
    renderComp: true,
    service_technician_enabled: true,
    files: [],
    s3_files: [],
    selected_files: [],
    SnackBarComponent: {},
    unit_measure_List: [
      { text: "KILOGRAM", value: "KILOGRAM" },
      { text: "GRAM", value: "GRAM" },
      { text: "LITRE", value: "LITRE" },
      { text: "MILLIMETER", value: "MILLIMETER" },
      { text: "CENTIMETER", value: "CENTIMETER" },
      { text: "METER", value: "METER" },
      { text: "INCH", value: "INCH" },
      { text: "SQUARE FEET", value: "SQUARE_FEET" },
      { text: "UNITS", value: "UNITS" },
    ],
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
  }),
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    dialogAddComponent(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.unit_of_measure = this.StoreObj.unit_of_measure;
          this.component_name = this.StoreObj.component_name;
          this.component_product_code = this.StoreObj.component_product_code;
          this.component_description = this.StoreObj.component_description;
          this.component_price = this.StoreObj.component_price;
          this.s3_files =
            this.StoreObj.component_attachments != null &&
            this.StoreObj.component_attachments != undefined &&
            this.StoreObj.component_attachments.length != 0
              ? this.StoreObj.component_attachments
              : [];
        }
      }
    },
  },
  methods: {
    handleRowClick(item) {
      window.open(item.file_url);
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
        if (i === this.selected_files.length - 1) {
          if (this.StoreObj.action == "CREATE") {
            this.addServiceCatalogue();
          } else if (this.StoreObj.action == "EDIT") {
            console.log("check ", this.s3_files);
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
    async updateServiceCatalogue() {
      this.isLoading = true;
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          component_id: this.StoreObj.component_id,
          component_name: this.component_name,
        };
        if (
          this.component_product_code != undefined &&
          this.component_product_code != null &&
          this.component_product_code != ""
        ) {
          inputParams.component_product_code = this.component_product_code;
        }
        if (
          this.unit_of_measure != undefined &&
          this.unit_of_measure != null &&
          this.unit_of_measure != ""
        ) {
          inputParams.unit_of_measure = this.unit_of_measure;
        }
        if (
          this.component_description != undefined &&
          this.component_description != null &&
          this.component_description != ""
        ) {
          inputParams.component_description = this.component_description;
        }
        if (
          this.component_price != undefined &&
          this.component_price != null &&
          this.component_price != ""
        ) {
          inputParams.component_price = this.component_price;
        }
        if (this.s3_files.length != 0) {
          inputParams.component_attachments = this.s3_files;
        }
        let result = await API.graphql(
          graphqlOperation(Update_Component, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.Update_Component);
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
          this.CloseDialog((this.Toggle = 2));
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
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          component_name: this.component_name,
        };
        if (
          this.component_product_code != undefined &&
          this.component_product_code != null &&
          this.component_product_code != ""
        ) {
          inputParams.component_product_code = this.component_product_code;
        }
        if (
          this.unit_of_measure != undefined &&
          this.unit_of_measure != null &&
          this.unit_of_measure != ""
        ) {
          inputParams.unit_of_measure = this.unit_of_measure;
        }
        if (
          this.component_description != undefined &&
          this.component_description != null &&
          this.component_description != ""
        ) {
          inputParams.component_description = this.component_description;
        }
        if (
          this.component_price != undefined &&
          this.component_price != null &&
          this.component_price != ""
        ) {
          inputParams.component_price = this.component_price;
        }
        if (s3URL.length != 0) {
          inputParams.service_s3_files = s3URL;
        }
        let result = await API.graphql(
          graphqlOperation(Create_Service_Based_Component, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Create_Service_Based_Component
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
          this.CloseDialog((this.Toggle = 2));
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
    CloseDialog(Toggle) {
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
