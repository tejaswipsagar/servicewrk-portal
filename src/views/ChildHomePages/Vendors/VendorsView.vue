<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <TagProductsToVendor
      v-if="CurrentView === 'TAG_VENDOR'"
      :TagProductsToVendor="TagProductsToVendor"
      :StoreObj="StoreObj"
      @clicked="TagProductsToVendorEmit"
    />
    <CreateVendor
      v-if="CurrentView === 'CREATE_VENDOR'"
      :CreateVendorDialog="CreateVendorDialog"
      :StoreObj="StoreObj"
      @clicked="CreateEditVendorDialogEmit"
    />
    <UpdateVendorDetails
      :UpdateVendorDetailsDialog="UpdateVendorDetailsDialog"
      :StoreObj="StoreObj"
      @clicked="UpdateVendorDetailsDialogEmit"
    />
    <ChangeVendorStatus
      :ChangeStatusDialog="ChangeStatusDialog"
      :StoreObj="StoreObj"
      @clicked="ChangeStatusDialogEmit"
    />
    <v-card v-if="CurrentView == 'VENDOR'" elevation="0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="5" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Vendors</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="7" xs="12" class="d-flex justify-end">
          <div>
            <v-toolbar dense class="elevation-0">
              <v-select
                dense
                outlined
                label="Vendor Status"
                v-model="vendorStatus"
                :items="vendorStatusItems"
                class="mt-9 FontSize maxWidthXSmall ml-2"
              ></v-select>
              <v-select
                v-if="vendorStatus === 'INVALID'"
                dense
                outlined
                label="Select Invalid Type"
                v-model="invalidType"
                :items="invalidTypeItems"
                class="mt-9 FontSize maxWidthXSmall ml-2"
              ></v-select>
              <v-text-field
                dense
                outlined
                label="Search"
                v-model="search"
                @input="searchMethod()"
                prepend-inner-icon="mdi-magnify"
                class="mt-9 ml-2 maxWidthSmall FontSize"
              ></v-text-field>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    class="mt-3 primary white--text ml-2"
                    @click="(uploadExcelCard = true), (cardContent = 'UPLOAD')"
                    ><v-icon>mdi-cloud-upload</v-icon>
                  </v-btn>
                  <!-- <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    class="mt-3 primary white--text ml-2"
                    @click="uploadExcelMethod()"
                    ><v-icon>mdi-cloud-upload</v-icon>
                    <input
                      type="file"
                      v-if="renderComp"
                      @change="handleClick"
                      ref="excel-upload-input"
                      class="excel-upload-input"
                      id="uploadExcelToVendor"
                      accept=".xlx, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                  </v-btn> -->
                </template>
                <span class="white--text">Upload Excel</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    class="mt-3 primary white--text ml-2"
                    @click="
                      (uploadExcelCard = true), (cardContent = 'DOWNLOAD_EXCEL')
                    "
                    ><v-icon>mdi-cloud-download</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Template For Bulk Upload</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    class="mt-3 primary white--text ml-2"
                    @click="CreateVendorMethod()"
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Add Vendor</span>
              </v-tooltip>
            </v-toolbar>
          </div>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="headers"
          :loading="loading"
          :items-per-page="100"
          :height="TableHeight"
          :items="
            vendorStatus === 'INVALID'
              ? GetAllInvalidSerialNumberList
              : vendorsDataList
          "
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          @click:row="TaggedProductstoVendorMethod"
        >
          <template v-slot:[`item.vendor_name`]="{ item }">
            <div class="FontSize">
              {{ item.vendor_name || "-" }}
            </div>
          </template>
          <template v-slot:[`item.vendor_primary_contact_number`]="{ item }">
            <div class="FontSize">
              {{ item.vendor_primary_contact_number || "-" }}
            </div>
          </template>
          <template v-slot:[`item.vendor_email_id`]="{ item }">
            <div class="FontSize">
              {{ item.vendor_email_id || "-" }}
            </div>
          </template>
          <template v-slot:[`item.vendor_qualification`]="{ item }">
            <div class="FontSize">
              {{ item.vendor_qualification || "-" }}
            </div>
          </template>
          <template v-slot:[`item.vendor_created_on`]="{ item }">
            <div class="FontSize" v-if="item.vendor_created_on">
              {{ FormatedDateTime(item.vendor_created_on) || "-" }}
            </div>
            <div v-else class="FontSize">
              {{ FormatedDateTime1(item.created_on) || "-" }}
            </div>
          </template>
          <!-- <template v-slot:[`item.invalid_reason`]="{ item }">
            <div color="red" v-if="item.invalid_reason" class="FontSize">
              <span style="color: red">{{ item.invalid_reason[0] }}</span>
            </div>
          </template> -->
          <template v-slot:[`item.Actions`]="{ item }">
            <v-menu right bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense nav>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-if="item.vendor_status === 'ACTIVE'"
                    @click="UpdateVendorDetailsMethods(item, 'edit')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pencil-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Edit {{ item.vendor_name }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click="ChangeStatusMethod(item)"
                    v-if="vendorStatus !== 'INVALID'"
                  >
                    <v-list-item-icon>
                      <v-icon
                        small
                        :color="
                          item.vendor_status === 'ACTIVE' ? 'red' : 'green'
                        "
                      >
                        {{
                          item.vendor_status === "ACTIVE"
                            ? "mdi-account-cancel"
                            : "mdi-account-plus"
                        }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        item.vendor_status == "ACTIVE"
                          ? "Deactivate"
                          : "Activate"
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.vendor_status === 'ACTIVE'"
                    @click="UpdateVendorDetailsMethods(item, 'tag')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-tag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Map Components/Products</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="vendorStatus === 'INVALID'">
                    <v-list-item-icon>
                      <v-icon small color="red">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Delete {{ item.vendor_name }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
          <template v-slot:[`item.invalid_data_s3_url`]="{ item }">
            <div v-if="item.invalid_data_s3_url">
              <v-btn
                icon
                @click.stop="excelDownloadMethod(item.invalid_data_s3_url)"
                ><v-icon small color="green darken-3"
                  >mdi-file-excel</v-icon
                ></v-btn
              >
            </div>
            <div v-else class="FontSize">
              <span>-</span>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <TaggedProductsVendorsDialog
      v-if="CurrentView == 'Tagged'"
      :TaggedProductsVendorsDialog="TaggedProductsVendorsDialog"
      :StoreObj="StoreObj"
      @clicked="TaggedProductsDialogEmit"
    />
    <TaggingComponentsFromTagged
      v-if="CurrentView === 'MAPPING_PAGE'"
      :ObjFromTaggedProductsVendors="objFromTaggedProductsVendors"
      @clicked="taggingComponentsFromTaggedEmit"
    />
    <div
      v-if="uploadExcelCard"
      style="
        width: 300px;
        position: absolute;
        top: 80px;
        right: 50px;
        z-index: 2;
      "
    >
      <v-card elevation="5">
        <div
          style="position: absolute; top: 2px; right: 2px; margin-bottom: 10px"
        >
          <div>
            <v-btn @click="uploadExcelCard = false" icon
              ><v-icon small color="grey">mdi-close-circle</v-icon></v-btn
            >
          </div>
        </div>
        <div v-if="cardContent === 'UPLOAD'">
          <v-row align="center" class="pa-2">
            <v-col cols="12" lg="3" md="3" sm="12">
              <v-btn
                small
                class="mt-3 primary white--text ml-2"
                @click="uploadExcelMethod('VENDOR_UPLOAD')"
                ><v-icon>mdi-cloud-upload</v-icon>
                <input
                  type="file"
                  v-if="renderComp"
                  @change="handleClick"
                  ref="excelUploadInput"
                  class="excel-upload-input"
                  id="uploadExcelToVendor"
                  accept=".xlx, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
              </v-btn>
            </v-col>
            <v-col cols="12" lg="9" md="9" sm="12">
              <strong><h5>Excel Bulk Upload For Vendors</h5></strong>
            </v-col>
          </v-row>
          <div class="ma-3">
            <v-divider />
          </div>
          <v-row align="center" class="pa-2">
            <v-col cols="12" lg="3" md="3" sm="12">
              <v-btn
                small
                class="mt-3 primary white--text ml-2"
                @click="uploadExcelMethod('VENDOR_COMP_UPLOAD')"
                ><v-icon>mdi-cloud-upload</v-icon>
                <input
                  type="file"
                  v-if="renderComp"
                  @change="handleClick"
                  ref="excel-upload-input"
                  class="excel-upload-input"
                  id="uploadExcelToVendor"
                  accept=".xlx, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
              </v-btn>
            </v-col>
            <v-col cols="12" lg="9" md="9" sm="12">
              <strong> <h5>Excel Bulk Upload For Vendor Components</h5></strong>
            </v-col>
          </v-row>
        </div>
        <div v-if="cardContent === 'DOWNLOAD_EXCEL'">
          <v-row align="center" class="pa-2">
            <v-col cols="12" lg="3" md="3" sm="12">
              <v-btn
                small
                class="mt-3 primary white--text ml-2"
                @click="templateForVendorBulkUploadMethod('VENDOR_TEMPLATE')"
                ><v-icon>mdi-cloud-download</v-icon></v-btn
              >
            </v-col>
            <v-col cols="12" lg="9" md="9" sm="12">
              <strong>
                <h5>Download Excel Template For Vendor Bulk Upload</h5>
              </strong>
            </v-col>
          </v-row>
          <div class="ma-3">
            <v-divider />
          </div>
          <v-row align="center" class="pa-2">
            <v-col cols="12" lg="3" md="3" sm="12">
              <v-btn
                small
                class="mt-3 primary white--text ml-2"
                @click="
                  templateForVendorBulkUploadMethod('VENDOR_COMP_TEMPLATE')
                "
                ><v-icon>mdi-cloud-download</v-icon></v-btn
              >
            </v-col>
            <v-col cols="12" lg="9" md="9" sm="12">
              <strong>
                <h5>
                  Download Excel Template For Vendor Components Bulk Upload
                </h5></strong
              >
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
const ExcelJS = require("exceljs");
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import { GetVendorList } from "@/mixins/Vendors/GetVendor.js";
import UpdateVendorDetails from "@/components/Vendors/Dialogs/UpdateVendorDetailsDialog.vue";
import CreateVendor from "@/components/Vendors/Cards/CreateEditVendorDetails.vue";
import ChangeVendorStatus from "@/components/Vendors/Dialogs/ChangeStatusDialog.vue";
import TagProductsToVendor from "@/components/Vendors/Dialogs/TagProductstoVendors.vue";
import TaggedProductsVendorsDialog from "@/components/Vendors/Dialogs/TaggedProductsVendors.vue";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllInvalidSerialNumbers } from "@/mixins/Product/ListAllInvalidSerialNumber";
import TaggingComponentsFromTagged from "@/components/Vendors/Cards/TaggingComponentsFromTagged.vue";
// import { API, graphqlOperation } from "aws-amplify";
// import { GetDetailsOfDesignationRole } from "@/graphql/queries.js";

export default {
  mixins: [
    GetCurrentUser,
    GetVendorList,
    GenerateS3URL,
    GetAllInvalidSerialNumbers,
  ],
  components: {
    Overlay,
    Snackbar,
    UpdateVendorDetails,
    CreateVendor,
    ChangeVendorStatus,
    TagProductsToVendor,
    TaggedProductsVendorsDialog,
    TaggingComponentsFromTagged,
  },
  data: () => ({
    loading: true,
    TagProductsToVendor: false,
    TaggedProductsVendorsDialog: false,
    search: "",
    CurrentView: "VENDOR",
    TableHeight: 0,
    vendorStatus: "ACTIVE",
    vendorStatusItems: ["ACTIVE", "INACTIVE", "INVALID"],
    vendorsDataList: [],
    headers: [
      {
        text: "Vendor Name",
        value: "vendor_name",
      },
      {
        text: "Vendor Contact Number",
        value: "vendor_primary_contact_number",
      },
      {
        text: "Vendor Email ID",
        value: "vendor_email_id",
      },
      { text: "Vendor Qualification", value: "vendor_qualification" },

      { text: "Vendor Created On", value: "vendor_created_on" },
      { text: "Action", value: "Actions" },
    ],
    CreateVendorDialog: false,
    UpdateVendorDetailsDialog: false,
    btnLoading: false,
    StoreObj: {},
    SnackBarComponent: {},
    ChangeStatusDialog: false,
    renderComp: true,
    uploadExcelCard: false,
    cardContent: "",
    uploadFormat: "",
    objFromTaggedProductsVendors: {},
    invalidType: "Vendors",
    invalidTypeItems: ["Vendors", "Vendors Component/Product"],
  }),

  watch: {
    async vendorStatus(val) {
      if (val !== "INVALID") {
        this.headers = [
          {
            text: "Vendor Name",
            value: "vendor_name",
          },
          {
            text: "Vendor Contact Number",
            value: "vendor_primary_contact_number",
          },
          {
            text: "Vendor Email ID",
            value: "vendor_email_id",
          },
          { text: "Vendor Qualification", value: "vendor_qualification" },

          { text: "Vendor Created On", value: "vendor_created_on" },
          { text: "Action", value: "Actions" },
        ];
        this.vendorsDataList = await this.GetVendorListMethod(val);
      } else if (val === "INVALID") {
        this.headers = [
          { text: "Vendor Created On", value: "vendor_created_on" },
          { text: "Download Excel", value: "invalid_data_s3_url" },
        ];
        const invalidType =
          this.invalidType === "Vendors"
            ? "VENDORS_BULK_UPLOAD"
            : "VENDORS_PRODUCTS_BULKUPLOAD";
        await this.GetAllInvalidSerialNumbersMethod(undefined, invalidType);
      }
    },

    async invalidType(val) {
      if (val) {
        const invalidType =
          this.invalidType === "Vendors"
            ? "VENDORS_BULK_UPLOAD"
            : "VENDORS_PRODUCTS_BULKUPLOAD";
        await this.GetAllInvalidSerialNumbersMethod(undefined, invalidType);
      }
      if (val !== "Vendors") {
        this.headers = [
          // {
          //   text: "Vendor Name",
          //   value: "vendor_name",
          // },
          // {
          //   text: "Vendor Contact Number",
          //   value: "vendor_primary_contact_number",
          // },
          // {
          //   text: "Vendor Email ID",
          //   value: "vendor_email_id",
          // },
          // { text: "Vendor Qualification", value: "vendor_qualification" },

          { text: "Vendor Created On", value: "vendor_created_on" },
          { text: "Download Excel", value: "invalid_data_s3_url" },
          // { text: "Action", value: "Actions" },
        ];
      }
    },
  },

  async mounted() {
    this.TableHeight = window.innerHeight - 200;
    // try {
    //   const result = await API.graphql(
    //     graphqlOperation(GetDetailsOfDesignationRole, {
    //       input: {
    //         user_id: this.$store.getters.get_current_user_details.user_id,
    //         organization_id:
    //           this.$store.getters.get_current_user_details.organization_id,
    //         setting_status: "ACTIVE",
    //       },
    //     })
    //   );
    //   console.log("DES_API", result);
    // } catch (error) {
    //   console.log("DES_ERROR", error);

    // }
    this.vendorsDataList = await this.GetVendorListMethod("ACTIVE");
    this.loading = false;
  },

  methods: {
    FormatedDateTime(item) {
      const date = new Date(item * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      hours = String(hours).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    },

    FormatedDateTime1(item) {
      const date = new Date(item);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },

    uploadExcelMethod(UPLOAD_FORMAT) {
      document.getElementById("uploadExcelToVendor").click();
      this.uploadFormat = UPLOAD_FORMAT;
    },

    async handleClick(e) {
      this.overlay = true;
      const pathName =
        this.uploadFormat === "VENDOR_UPLOAD"
          ? "VENDORS_BULKUPLOAD/"
          : "VENDORS_PRODUCTS_BULKUPLOAD/";
      let result = await this.GenerateS3URLMethods(
        `${pathName}${
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
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
        this.overlay = false;
        this.vendorsDataList = await this.GetVendorListMethod(
          this.vendorStatus
        );
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Something Went Wrong!! Please Try Again!!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
      this.$refs.excelUploadInput.value = "";
      this.overlay = false;
      this.uploadExcelCard = false;
    },
    UpdateVendorDetailsMethods(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      switch (action) {
        case "edit":
          this.CurrentView = "CREATE_VENDOR";
          break;
        case "tag":
          this.objFromTaggedProductsVendors = item;
          this.objFromTaggedProductsVendors.from = "vendor_page";
          this.CurrentView = "MAPPING_PAGE";
          break;
      }
    },

    templateForVendorBulkUploadMethod(TEMPLATE) {
      this.overlay = true;
      let fieldNamesArray;
      if (TEMPLATE === "VENDOR_TEMPLATE") {
        fieldNamesArray = [
          "Vendor Employee Id",
          "Vendor Name",
          "Vendor Country Code*",
          "Vendor Mobile Number*",
          "Vendor Email Id*",
          "Vendor Address",
          "Vendor City",
          "Vendor State",
          "Vendor Pincode",
          "Vendor PAN Number",
          "Vendor Experience",
          "Vendor Qualification",
          "Vendor GST Number",
          "Vendor Latitude",
          "Vendor Longitude",
          "Vendor Billing Address",
          "Vendor Billing City",
          "Vendor Billing State",
          "Vendor Billing Pincode",
          "Vendor Website",
          "Vendor Company Name",
          "Vendor Categories",
          "Vendor Secondary Country Code",
          "Vendor Secondary Mobile Number",
        ];
      } else {
        fieldNamesArray = [
          "Vendor Name",
          "Vendor Country Code*",
          "Vendor Contact Number*",
          "Component",
          "Component Code",
          "Vendor Component Name*",
          "Vendor Component Serial Number",
          "Vendor Component Code*",
          "Component Price*",
        ];
      }
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
            const downloadFileName =
              TEMPLATE === "VENDOR_TEMPLATE"
                ? "Template-For-Vendor-Bulk-Upload"
                : "Template-For-Vendor-Comp-Bulk-Upload";
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${downloadFileName}-${new Date().toLocaleString(
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

    ChangeStatusMethod(item) {
      this.StoreObj = item;
      this.ChangeStatusDialog = true;
    },

    CreateVendorMethod() {
      // this.CreateVendorDialog = true;
      this.StoreObj = {};
      this.StoreObj.action = "CREATE";
      this.CurrentView = "CREATE_VENDOR";
    },

    async CreateEditVendorDialogEmit(Toggle) {
      // this.CreateVendorDialog = false;
      this.CurrentView = "VENDOR";
      if (Toggle === 2) {
        this.vendorsDataList = await this.GetVendorListMethod(
          this.vendorStatus
        );
      }
    },

    async UpdateVendorDetailsDialogEmit(Toggle) {
      this.UpdateVendorDetailsDialog = false;
      if (Toggle === 2) {
        this.vendorsDataList = await this.GetVendorListMethod(
          this.vendorStatus
        );
      }
    },

    TaggedProductstoVendorMethod(item) {
      this.CurrentView = "Tagged";
      this.StoreObj = item;
      this.TaggedProductsVendorsDialog = true;
      console.log("VENDOR_ROW_CLICK", item);
    },

    async ChangeStatusDialogEmit(Toggle) {
      this.ChangeStatusDialog = false;
      if (Toggle === 2) {
        this.vendorsDataList = await this.GetVendorListMethod(
          this.vendorStatus
        );
      }
    },
    async TagProductsToVendorEmit(Toggle) {
      // this.TagProductsToVendor = false;
      this.CurrentView = "VENDOR";
      if (Toggle === 2) {
        this.vendorsDataList = await this.GetVendorListMethod("ACTIVE");
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Tagged Successfully!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    excelDownloadMethod(item) {
      console.log("BBB", item);
      window.open(item);
    },
    TaggedProductsDialogEmit() {
      this.CurrentView = "VENDOR";
      this.TaggedProductsVendorsDialog = false;
    },

    async taggingComponentsFromTaggedEmit(Toggle) {
      this.CurrentView = "VENDOR";
      if (Toggle === 2) {
        this.vendorsDataList = await this.GetVendorListMethod("ACTIVE");
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Mapped Successfully",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },
  },
};
</script>
