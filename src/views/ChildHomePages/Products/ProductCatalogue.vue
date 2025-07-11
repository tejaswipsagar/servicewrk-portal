<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <TaggedVendorsToProductDialog
      :TaggedVendorsToProductDialog="TaggedVendorsToProductDialog"
      :StoreObj="StoreObj"
      @clicked="TaggedVendorsToProductDialogEmit"
    />
    <AddServiceCatalogue
      :StoreObj="StoreObj"
      :AddServiceCatalogue="AddServiceCatalogue"
      @clicked="AddServiceCatalogueEmit"
    />
    <ActivateInactivateCatalogueDialog
      :StoreObj="StoreObj"
      :dialogActivateInactivateCatalogue="dialogActivateInactivateCatalogue"
      @clicked="dialogActivateInactivateCatalogueEmit"
    />
    <TaggedCompDialog
      :StoreObj="StoreObj"
      :dialogTaggedList="dialogTaggedList"
      @clicked="dialogemit"
    />
    <TagComponent
      :StoreObj="StoreObj"
      v-if="current_view == 'TAG'"
      @clicked="TagCardEmit"
    />
    <UploadExcelCard
      v-if="current_view == 'EXCEL'"
      :tableHeader="tableHeader"
      :tableData="tableData"
      @clicked="UploadExcelCardEmit"
    />
    <v-card class="elevation-0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Product Catalogue</div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          label="Status"
          :items="StatusItems"
          v-model="service_status"
          class="mt-7 FontSize maxWidthXSmall"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="mx-2 mt-7 FontSize maxWidth"
        ></v-text-field>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" class="mt-1">
              <v-icon color="primary">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-actions>
              <ExcelUpload
                class="mt-5"
                v-show="showCreateButton"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                v-if="$store.getters.get_user_type != 'MANAGER'"
              />
              <v-tooltip
                color="primary"
                bottom
                v-if="$store.getters.get_user_type != 'MANAGER'"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    v-show="showCreateButton"
                    @click="downloadExcelBaseMethod()"
                    class="primary white--text ml-1 text-capitalize mt-1"
                  >
                    <v-icon>mdi-cloud-download</v-icon>
                  </v-btn>
                </template>
                <span>Template for Bulk Upload Product Catalogues</span>
              </v-tooltip>
              <!-- <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    color="primary"
                    @click="exporttoexcel"
                    class="primary white--text ml-2 mt-1"
                  >
                    <v-icon>mdi-file-excel-outline</v-icon>
                  </v-btn>
                </template>
                <span class="white--text">Download Excel</span>
              </v-tooltip> -->
              <v-tooltip
                bottom
                color="primary"
                v-if="$store.getters.get_user_type != 'MANAGER'"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    v-show="showCreateButton"
                    class="ml-2 mt-1 primary white--text"
                    @click="
                      (AddServiceCatalogue = true), (StoreObj.action = 'CREATE')
                    "
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Add Service Catalogue</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      class="primary white-text ml-1 mt-1"
                      @click="uploadToTagProductsWithComponents()"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'PRODUCT_TAGGING_TO_COMPONENTS'
                        )
                      "
                    >
                      <input
                        type="file"
                        v-if="renderComp"
                        @change="handleClick"
                        ref="excel-upload-input"
                        class="excel-upload-input"
                        id="uploadExcelToTagProductsWithComponents"
                        accept=".xlx, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      />
                      <v-icon>mdi-cloud-upload</v-icon>
                    </v-btn>
                  </span>
                </template>
                <span
                  v-if="
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == undefined ||
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == [] ||
                    !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                      'PRODUCT_TAGGING_TO_COMPONENTS'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Upload to Tag Products with Components</span>
              </v-tooltip>
              <v-tooltip
                bottom
                color="primary"
                v-if="$store.getters.get_user_type != 'MANAGER'"
              >
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      v-show="showCreateButton"
                      class="primary white--text ml-1 text-capitalize mt-1"
                      @click="
                        downloadExcelBaseMethodForComponentTaggingToProducts()
                      "
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'PRODUCT_TAGGING_TO_COMPONENTS'
                        )
                      "
                    >
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-btn>
                  </span>
                </template>
                <span
                  v-if="
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == undefined ||
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == [] ||
                    !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                      'PRODUCT_TAGGING_TO_COMPONENTS'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else
                  >Template for Bulk Tagging Components with Products</span
                >
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="headers"
          :height="TableHeight"
          :items-per-page="100"
          :items="GetAllServicesList"
          :no-data-text="noDataText"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
          <template v-slot:[`item.service_name`]="{ item }">
            <div class="FontSize" v-if="item.service_name != undefined">
              {{ item.service_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.component_count`]="{ item }">
            <div v-if="item.component_count" class="FontSize">
              {{ item.component_count }}
              <v-icon @click="openList(item)" small color="primary"
                >mdi-information</v-icon
              >
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_ticket_prefix`]="{ item }">
            <div class="FontSize">{{ item.service_ticket_prefix }}</div>
          </template>
          <template v-slot:[`item.category_name`]="{ item }">
            <div class="FontSize" v-if="item.category_name != undefined">
              {{ item.category_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_price`]="{ item }">
            <div v-if="item.service_price" class="FontSize">
              {{ item.service_price }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_created_on`]="{ item }">
            <div class="FontSize" v-if="item.service_created_on != undefined">
              {{
                new Date(item.service_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip
              bottom
              color="primary"
              v-if="item.service_status == 'ACTIVE'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  color="teal"
                  class="mr-3"
                  v-show="showEditButton"
                  @click="checkItem(item, 'Tagged_Vendor')"
                >
                  mdi-account
                </v-icon>
              </template>
              <span class="white--text">Tagged Vendors</span>
            </v-tooltip>
            <v-tooltip
              bottom
              color="primary"
              v-if="item.service_status == 'ACTIVE'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  color="teal"
                  class="mr-3"
                  v-show="showEditButton"
                  @click="checkItem(item, 'TAG')"
                >
                  mdi-tag-plus-outline
                </v-icon>
              </template>
              <span class="white--text">Tag Components</span>
            </v-tooltip>
            <v-tooltip
              bottom
              color="primary"
              v-if="item.service_status == 'ACTIVE'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  v-show="showEditButton"
                  @click="checkItem(item, 'EDIT')"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span class="white--text">Catalog Details</span>
            </v-tooltip>
            <v-tooltip bottom v-if="$store.getters.get_user_type != 'MANAGER'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-on="on"
                  v-bind="attrs"
                  @click="checkItem(item, 'ACTION')"
                  v-show="showActivateDeactivateButton"
                  :color="item.service_status == 'ACTIVE' ? 'red' : 'green'"
                  ><v-icon small>{{
                    item.service_status == "ACTIVE"
                      ? "mdi-close-thick"
                      : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="
                  item.service_status == 'ACTIVE'
                    ? `Deactivate ${item.service_name}`
                    : `Activate ${item.service_name}`
                "
              ></span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ExcelUpload from "@/components/Extras/ExcelUpload.vue";
import TagComponent from "@/components/Product/Cards/TagComponent.vue";
import UploadExcelCard from "@/components/Product/Cards/UploadExcelCard.vue";
import TaggedCompDialog from "@/components/Product/Dialogs/ProductCatalogue/TaggedCompDialog.vue";
import AddServiceCatalogue from "@/components/Product/Dialogs/ProductCatalogue/AddServiceCatalogue.vue";
import ActivateInactivateCatalogueDialog from "@/components/Product/Dialogs/ProductCatalogue/ActivateInactivateCatalogueDialog.vue";
import TaggedVendorsToProductDialog from "@/components/Product/Dialogs/ProductCatalogue/TaggedVendors.vue";

export default {
  components: {
    Overlay,
    Snackbar,
    ExcelUpload,
    TagComponent,
    UploadExcelCard,
    TaggedCompDialog,
    AddServiceCatalogue,
    ActivateInactivateCatalogueDialog,
    TaggedVendorsToProductDialog,
  },
  mixins: [GetAllServices, GenerateS3URL],
  data: () => ({
    search: "",
    current_view: "LIST",
    service_status: "ACTIVE",
    TableHeight: 0,
    overlay: false,
    renderComp: true,
    showEditButton: false,
    dialogTaggedList: false,
    showCreateButton: false,
    AddServiceCatalogue: false,
    showActivateDeactivateButton: false,
    dialogActivateInactivateCatalogue: false,
    TaggedVendorsToProductDialog: false,
    tableData: [],
    tableHeader: [],
    GetAllServicesList: [],
    StatusItems: ["ACTIVE", "INACTIVE"],
    headers: [
      { text: "Product", value: "service_name" },
      { text: "Prefix", value: "service_ticket_prefix" },
      { text: "Category", value: "category_name" },
      { text: "Component", value: "component_count" },
      { text: "Price", value: "service_price" },
      { text: "Created On", value: "service_created_on" },
      { text: "Actions", value: "Actions" },
    ],
    StoreObj: {},
    SnackBarComponent: {},
    columnName: [
      { label: "Category", value: "category_name" },
      { label: "Product", value: "service_name" },
      { label: "Service Prefix", value: "service_ticket_prefix" },
      { label: "Price", value: "service_price" },
      { label: "Component Count", value: "component_count" },
      { label: "Created On", value: "updated_service_created_on" },
    ],
  }),
  watch: {
    service_status() {
      this.search = "";
      this.GetAllServicesMethod("PRODUCT", this.service_status);
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAccessModuleMethod();
    this.GetAllServicesMethod("PRODUCT", this.service_status);
  },
  methods: {
    exporttoexcel() {
      this.GetAllServicesList.map((item) => {
        if (item.service_created_on) {
          item.updated_service_created_on = new Date(
            item.service_created_on * 1000
          ).toLocaleString("en-IN");
        }
      });
      let data = [
        {
          sheet: "Product Catalogue",
          columns: this.columnName,
          content: this.GetAllServicesList,
        },
      ];
      let settings = {
        fileName: "Product Catalogue",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    async handleClick(e) {
      console.log("e", e);
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `PRODUCT_TAGGING_TO_COMPONENTS/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "File Uploaded Successfully!!",
        };
        this.refreshComponentMethod();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Something Went Wrong!! Please Try Again!!",
        };
      }
      this.overlay = false;
    },
    refreshComponentMethod() {
      this.renderComp = false;
      this.$nextTick(() => {
        this.renderComp = true;
      });
    },
    uploadToTagProductsWithComponents() {
      document.getElementById("uploadExcelToTagProductsWithComponents").click();
    },
    downloadExcelBaseMethodForComponentTaggingToProducts() {
      this.overlay = true;
      let fieldNameArray = ["Product Name", "Components"];
      async function generateExcel() {
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Bulk Upload Deal Fields");
          sheet.addRow(fieldNameArray);
          for (let num = 2; num < 5000; num++) {
            for (let i = 0; i < sheet._columns.length; i++) {
              sheet.getColumn(sheet._columns[i].number).width = 30;
            }
          }
          const buffer = await workbook.xlsx.writeBuffer();
          return buffer;
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
      setTimeout(() => {
        generateExcel()
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `Bulk-Tagging-Components-with-products-${new Date().toLocaleString(
              "en-GB"
            )}`;
            downloadLink.click();
          })
          .catch((err) => {
            console.log("Error:", err);
          });
        this.overlay = false;
      });
    },
    downloadExcelBaseMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Enable Technician (yes/no)",
        "Enable Visibility (yes/no)",
        "Master Category",
        "Category",
        "Product",
        "Product Id",
        "Product Price",
        "Service Prefix",
        "Service Type",
        "Auto Tag to Users (yes/no)",
      ];
      async function generateExcel() {
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Bulk Upload Deal Fields");
          sheet.addRow(fieldNamesArray);
          for (let num = 2; num < 5000; num++) {
            for (let i = 0; i < sheet._columns.length; i++) {
              sheet.getColumn(sheet._columns[i].number).width = 30;
            }
          }
          const buffer = await workbook.xlsx.writeBuffer();
          return buffer;
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
      setTimeout(() => {
        generateExcel()
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `Bulk-upload-Product-Catalogues-${new Date().toLocaleString(
              "en-GB"
            )}.xlsx`;
            downloadLink.click();
          })
          .catch((err) => {
            console.error("Error:", err);
          });
        this.overlay = false;
      }, 1000);
    },
    GetAccessModuleMethod() {
      console.log(
        "Module Details",
        this.$store.getters.get_access_module_details
      );
      let ModuleDetails = this.$store.getters.get_access_module_details;
      if (
        this.$store.getters.get_user_type != "ADMIN" &&
        this.$store.getters.get_user_type != "OWNER" &&
        this.$store.getters.get_user_type != "DEALER_OWNER" &&
        this.$store.getters.get_current_user_details.organization_details
          .is_access_control_enable == true
      ) {
        ModuleDetails.map((item) => {
          if (item.module_name == "Products") {
            if (item.sub_modules[0].module_name == "Product Catalogue") {
              item.sub_modules[0].module_rights.map((moduleRights) => {
                if (moduleRights.CREATE == true) {
                  this.showCreateButton = true;
                }
                if (moduleRights.EDIT == true) {
                  this.showEditButton = true;
                }
                if (moduleRights.DELETE == true) {
                  this.showActivateDeactivateButton = true;
                }
              });
            }
          }
        });
      } else {
        this.showCreateButton = true;
        this.showEditButton = true;
        this.showActivateDeactivateButton = true;
      }
    },
    openList(item) {
      this.StoreObj = item;
      this.dialogTaggedList = true;
    },
    UploadExcelCardEmit(Toggle, Status_Message) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: Status_Message,
        };
      }
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      this.current_view = "EXCEL";
    },
    TagCardEmit(Toggle) {
      if (Toggle == 1) {
        this.current_view = "LIST";
      } else if (Toggle) {
        this.GetAllServicesMethod("PRODUCT", this.service_status);
        this.current_view = "LIST";
      }
    },
    dialogActivateInactivateCatalogueEmit(Toggle) {
      this.dialogActivateInactivateCatalogue = false;
      if (Toggle == 2) {
        this.GetAllServicesMethod("PRODUCT", this.service_status);
      }
    },
    dialogemit(Toggle) {
      if (Toggle == 1) {
        this.dialogTaggedList = false;
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.AddServiceCatalogue = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateCatalogue = true;
      } else if (action == "TAG") {
        this.current_view = "TAG";
      } else if (action == "Tagged_Vendor") {
        this.TaggedVendorsToProductDialog = true;
      }
    },
    AddServiceCatalogueEmit(Toggle) {
      this.AddServiceCatalogue = false;
      if (Toggle == 2) {
        this.GetAllServicesMethod("PRODUCT", this.service_status);
      }
    },

    TaggedVendorsToProductDialogEmit() {
      this.TaggedVendorsToProductDialog = false;
    },
  },
};
</script>
