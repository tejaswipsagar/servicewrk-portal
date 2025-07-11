<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="snackbarRenderComp"
    />
    <Overlay :overlay="overlay" />
    <ActivateInactivateTerritoryDialog
      :StoreObj="StoreObj"
      :dialogActivateInactivateTerritory="dialogActivateInactivateTerritory"
      @clicked="dialogActivateInactivateTerritoryEmit"
    />
    <CreateTerritory
      :StoreObj="StoreObj"
      :dialogCreateTerritory="dialogCreateTerritory"
      @clicked="dialogCreateTerritoryEmit"
    />
    <TerritoryPincodes
      :StoreObj="StoreObj"
      v-if="current_view == 'PINCODES'"
      @clicked="viewPincodesDialogEmit"
    />
    <CustmerTag
      :StoreObj="StoreObj"
      v-if="current_view == 'CUSTOMERTAG'"
      @clicked="opencustmeremmit"
    />
    <TagServiceCenter
      :StoreObj="StoreObj"
      v-if="current_view == 'SERVICECENTERTAG'"
      @clicked="tagServiceCenterDailogEmit"
    />
    <viewCustomer
      :StoreObj="StoreObj"
      :viewCustomerdialog="viewCustomerdialog"
      @clicked="openemmit"
    />
    <v-card elevation="0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Territories</div>
        <v-spacer />
        <v-select
          dense
          outlined
          label="Status"
          :items="StatusItems"
          v-model="territory_status"
          class="mt-9 FontSize maxWidthXSmall mr-2"
        ></v-select>
        <v-select
          dense
          outlined
          label="Territory Type"
          v-model="territory_type"
          :items="territory_type_list"
          class="mt-9 FontSize maxWidthXSmall mr-2"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="mt-9 FontSize WidthVariation1"
        ></v-text-field>
        <!-- <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              <v-btn
                small
                @click="downloadExcelBaseMethod()"
                class="primary white--text ml-2 mt-3"
                :disabled="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'TERRITORY_BULK_UPLOAD'
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
                'TERRITORY_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Download Excel Template</span>
        </v-tooltip> -->
        <!-- <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              <v-btn
                small
                @click="checkExcelPresent()"
                class="primary white-text ml-2 mt-3"
                :disabled="
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == undefined ||
                  $store.getters.get_current_user_details.organization_details
                    .approved_bulk_upload == [] ||
                  !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                    'TERRITORY_BULK_UPLOAD'
                  )
                "
              >
                <input
                  id="uploadExcel"
                  ref="excel-upload-input"
                  accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  class="excel-upload-input"
                  type="file"
                  @change="handleClick"
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
                'TERRITORY_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Upload Bulk Territories</span>
        </v-tooltip> -->
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-menu
              offset-y
              :close-on-content-click="true"
              v-bind="attrs"
              v-on="on"
            >
              <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                <v-btn
                  small
                  v-on="{ ...menuOn, ...on }"
                  v-bind="{ ...attrs, ...menuAttrs }"
                  class="gradient-bg white--text text-capitalize mt-3 ml-2"
                  :disabled="
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == undefined ||
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == [] ||
                    !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                      'TERRITORY_BULK_UPLOAD'
                    )
                  "
                >
                  <v-icon>mdi-package-up</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item
                  v-for="(item, index) in filteredItemsMenu"
                  :key="index"
                  @click.stop="handleMenuClick(item.action)"
                >
                  <v-list-item-icon class="mx-0">
                    <v-icon small color="primary">{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <span
            v-if="
              $store.getters.get_current_user_details.organization_details
                .approved_bulk_upload == undefined ||
              $store.getters.get_current_user_details.organization_details
                .approved_bulk_upload == [] ||
              !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                'TERRITORY_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Bulk Upload</span>
        </v-tooltip>
        <input
          id="uploadExcel"
          ref="exceluploadinput"
          accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          class="exceluploadinput"
          type="file"
          @change="handleClick"
        />

        <input
          id="uploadBulkExcel"
          ref="pincodeuploadinput"
          accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          class="pincodeuploadinput"
          type="file"
          @change="BulkUploadhandle"
        />
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-menu
              offset-y
              :close-on-content-click="true"
              v-bind="attrs"
              v-on="on"
            >
              <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                <v-btn
                  small
                  v-on="{ ...menuOn, ...on }"
                  v-bind="{ ...attrs, ...menuAttrs }"
                  class="gradient-bg white--text text-capitalize mt-3 ml-3 mr-2"
                  :disabled="
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == undefined ||
                    $store.getters.get_current_user_details.organization_details
                      .approved_bulk_upload == [] ||
                    !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                      'TERRITORY_BULK_UPLOAD'
                    )
                  "
                >
                  <v-icon>mdi-package-down</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item
                  v-for="(item, index) in filterDownloadItems"
                  :key="index"
                  @click.stop="handleDownloadClick(item.action)"
                >
                  <v-list-item-icon class="mx-0">
                    <v-icon small color="primary">{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <span
            v-if="
              $store.getters.get_current_user_details.organization_details
                .approved_bulk_upload == undefined ||
              $store.getters.get_current_user_details.organization_details
                .approved_bulk_upload == [] ||
              !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                'TERRITORY_BULK_UPLOAD'
              )
            "
            >You're not eligible to upload, Please contact WRKTOP Team..!</span
          >
          <span v-else>Download Excel Template</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              v-show="showCreateButton"
              class="primary mt-3 ml-2 white--text"
              @click="
                (dialogCreateTerritory = true), (StoreObj.action = 'CREATE')
              "
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Create Territory</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :headers="territory_status != 'INVALID' ? headers : InvalidHeaders"
          class="elevation-0"
          :height="TableHeight"
          :items-per-page="100"
          :no-data-text="noDataText"
          :items="
            territory_status != 'INVALID'
              ? GetAllTerritoriesList
              : GetAllInvalidSerialNumberList
          "
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
        >
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
          <template v-slot:[`item.created_on`]="{ item }">
            <div class="FontSize" v-if="item.created_on">
              {{ new Date(item.created_on).toLocaleString() || "-" }}
            </div>
            <div v-else class="FontSize">-</div>
          </template>
          <template v-slot:[`item.territory_name`]="{ item }">
            <div class="FontSize" v-if="item.territory_name != undefined">
              {{ item.territory_name }}
            </div>
          </template>
          <template v-slot:[`item.territory_ticket_prefix`]="{ item }">
            <div
              class="FontSize"
              v-if="item.territory_ticket_prefix != undefined"
            >
              {{ item.territory_ticket_prefix }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.territory_type`]="{ item }">
            <div class="FontSize" v-if="item.territory_type != undefined">
              <div v-if="item.territory_type == 'GEO_BASED'">GEO</div>
              <div v-else-if="item.territory_type == 'NON_GEO_BASED'">
                NON GEO
              </div>
            </div>
          </template>
          <template v-slot:[`item.territory_description`]="{ item }">
            <div v-if="item.territory_description != undefined">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span class="FontSize" v-bind="attrs" v-on="on">{{
                    item.territory_description.length > 25
                      ? `${item.territory_description.slice(0, 25)}...`
                      : item.territory_description
                  }}</span>
                </template>
                <span>{{ item.territory_description }}</span>
              </v-tooltip>
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.territory_status`]="{ item }">
            <span
              :class="
                item.territory_status == 'ACTIVE' ? 'green--text' : 'red--text'
              "
            >
              {{ item.territory_status }}
            </span>
          </template>
          <template v-slot:[`item.territory_area`]="{ item }">
            <div v-if="item.territory_area != undefined" class="FontSize">
              {{ item.territory_area }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom v-if="item.territory_status == 'ACTIVE'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="primary"
                  @click="checkItem(item, 'EDIT')"
                  ><v-icon small>mdi-pencil-plus</v-icon></v-btn
                >
              </template>
              <span>Edit Territory</span>
            </v-tooltip>
            <v-tooltip bottom v-if="$store.getters.get_user_type != 'MANAGER'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.territory_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon small class="ml-n3">{{
                    item.territory_status == "ACTIVE"
                      ? "mdi-close-thick"
                      : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="
                  item.territory_status == 'ACTIVE' ? `Deactivate` : `Activate`
                "
              ></span>
            </v-tooltip>
            <v-menu
              right
              bottom
              v-if="
                item.territory_type == 'NON_GEO_BASED' &&
                item.territory_status == 'ACTIVE'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense flat>
                <v-list-item-group color="primary">
                  <v-list-item @click.stop="checkItem(item, 'TAG2')">
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-tag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Tag Customer</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click.stop="checkItem(item, 'CUST')">
                    <v-list-item-icon>
                      <v-icon small color="primary"
                        >mdi-format-list-bulleted</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Tagged customers </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click.stop="checkItem(item, 'TAG_SERVICE_CENTER')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-tag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Tag Service Center</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click.stop="checkItem(item, 'PINCODES')">
                    <v-list-item-icon>
                      <v-icon small color="primary"
                        >mdi-map-marker-multiple</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>Pin Codes</v-list-item-title>
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
const ExcelJS = require("exceljs");
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import CustmerTag from "@/components/Territories/CustmerTag.vue";
import viewCustomer from "@/components/Territories/viewCustomers.vue";
import TagServiceCenter from "@/components/Territories/TagServiceCenter.vue";
import CreateTerritory from "@/components/Territories/Dialogs/CreateTerritory.vue";
import TerritoryPincodes from "@/components/Territories/TerritoryPincodes.vue";
import ActivateInactivateTerritoryDialog from "@/components/Territories/Dialogs/ActivateInactivateTerritoryDialog.vue";
import { GetAllInvalidSerialNumbers } from "@/mixins/Product/ListAllInvalidSerialNumber.js";
export default {
  components: {
    Overlay,
    Snackbar,
    CustmerTag,
    viewCustomer,
    CreateTerritory,
    TagServiceCenter,
    TerritoryPincodes,
    ActivateInactivateTerritoryDialog,
  },
  mixins: [GenerateS3URL, GetAllTerritories, GetAllInvalidSerialNumbers],
  data: () => ({
    TableHeight: 0,
    overlay: false,
    loading: false,
    showEditButton: true,
    showCreateButton: true,
    snackbarRenderComp: true,
    tagCustomersdilog: false,
    viewCustomerdialog: false,
    dialogCreateTerritory: false,
    showActivateDeactivateButton: true,
    dialogActivateInactivateTerritory: false,
    search: "",
    current_view: "LIST",
    territory_type: "ALL",
    territory_status: "ACTIVE",
    StoreObj: {},
    SnackBarComponent: {},
    StatusItems: ["ACTIVE", "INACTIVE", "INVALID"],
    headers: [
      { text: "Territory Type", value: "territory_type", width: "13%" },
      {
        text: "Territory Name",
        align: "start",
        sortable: false,
        value: "territory_name",
        width: "18%",
      },
      { text: "Prefix", value: "territory_ticket_prefix" },
      { text: "Description", value: "territory_description" },
      { text: "Area", value: "territory_area" },
      { text: "Actions", value: "Actions" },
    ],
    territory_type_list: [
      { text: "ALL", value: "ALL" },
      { text: "GEO BASED", value: "GEO_BASED" },
      { text: "NON GEO BASED", value: "NON_GEO_BASED" },
    ],
    itemsMenu: [
      {
        icon: "mdi-folder-upload",
        title: "Upload Bulk Territories",
        action: "TerritoriesUpload",
      },
      {
        icon: "mdi-upload",
        title: "Upload Bulk Pincodes",
        action: "PincodesUpload",
      },
    ],

    itemsDownloadMenu: [
      {
        icon: "mdi-folder-download",
        title: "Territory Excel Download",
        action: "TERRITORY_DOWNLAOD",
      },
      {
        icon: "mdi-download",
        title: "Pincode Excel Download",
        action: "PINCODE_DOWNLOAD",
      },
    ],
    InvalidHeaders: [
      { text: "Created On", value: "created_on" },
      { text: "Download Excel", value: "invalid_data_s3_url" },
    ],
    GetAllInvalidSerialNumberList: [],
  }),
  watch: {
    territory_status(val) {
      this.search = "";
      if (val != "INVALID") {
        this.GetAllTerritoriesMethod(
          val,
          this.territory_type != "ALL" ? this.territory_type : undefined,
          undefined,
          "TERRITORY",
          undefined
        );
      } else if (val == "INVALID") {
        this.GetAllInvalidSerialNumbersMethod(
          undefined,
          "PINCODE_MARKING_BULK_UPLOAD"
        );
      }
    },
    territory_type(val) {
      this.search = "";
      this.GetAllTerritoriesMethod(
        this.territory_status,
        val,
        undefined,
        "TERRITORY",
        undefined
      );
    },
  },
  computed: {
    filteredItemsMenu() {
      return this.itemsMenu.filter((item) => {
        if (item.action === "TerritoriesUpload") {
          return item;
        } else if (item.action === "PincodesUpload") {
          return item;
        }
        return true; // Include other items unconditionally
      });
    },
    filterDownloadItems() {
      return this.itemsDownloadMenu.filter((item) => {
        if (item.action === "TERRITORY_DOWNLAOD") {
          return item;
        } else if (item.action === "PINCODE_DOWNLOAD") {
          return item;
        }
        return true;
      });
    },
  },
  mounted() {
    this.GetAccessModuleMethod();
    this.TableHeight = window.innerHeight - 200;
    this.GetAllTerritoriesMethod(
      this.territory_status,
      undefined,
      undefined,
      "TERRITORY",
      undefined
    );
  },
  methods: {
    checkExcelPresent() {
      document.getElementById("uploadExcel").click();
    },
    excelDownloadMethod(item) {
      console.log("BBB", item);
      window.open(item);
    },
    async handleClick(e) {
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `TERRITORY_BULK_UPLOAD/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.snackbarRenderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText:
              "Uploaded Successfully, Please get back in some time !!",
          };
          this.snackbarRenderComp = true;
        });
        this.GetAllTerritoriesMethod(
          this.territory_status,
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
        this.overlay = false;
      } else {
        this.snackbarRenderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Something Went Wrong!! Please Try Again!!",
          };
          this.snackbarRenderComp = true;
        });
      }
      this.overlay = false;
    },
    handleMenuClick(action) {
      if (action === "TerritoriesUpload") {
        this.$refs.exceluploadinput.click();
      } else if (action === "PincodesUpload") {
        this.$refs.pincodeuploadinput.click();
      }
    },

    async BulkUploadhandle(e) {
      this.overlay = true;
      console.log("Niranjan", e);
      let result = await this.GenerateS3URLMethods(
        `PINCODE_MARKING/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.snackbarRenderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText:
              "Uploaded Successfully, Please get back in some time !!",
          };
          this.snackbarRenderComp = true;
        });
        this.GetAllTerritoriesMethod(
          this.territory_status,
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
        this.overlay = false;
      } else {
        this.snackbarRenderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Something Went Wrong!! Please Try Again!!",
          };
          this.snackbarRenderComp = true;
        });
      }
      this.overlay = false;
    },

    handleDownloadClick(action) {
      this.downloadExcelBaseMethod(action);
    },

    downloadExcelBaseMethod(action) {
      this.overlay = true;
      let fieldNamesArray = [
        "Territory Name *",
        "Territory Type *",
        "Latitude *",
        "Longitude *",
        "Pincode(s)",
        "Territory Prefix *",
        "Territory Description *",
        "Territory Category",
        "Technician Name",
        "Technician Phone Number",
        "Dealer Name",
        "Dealer Email ID",
        "Service Partner Name",
        "Service Partner Email ID",
      ];
      let PincodeHeaderExcel = [
        "Territory Name",
        "Territory Classification Name",
        "Pincode",
      ];
      async function generateExcel() {
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Bulk Upload Deal Fields");
          if (action == "TERRITORY_DOWNLAOD") {
            sheet.addRow(fieldNamesArray);
          } else if (action == "PINCODE_DOWNLOAD") {
            sheet.addRow(PincodeHeaderExcel);
          }
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
            downloadLink.download = `Bulk-Upload-${action}-${new Date().toDateString(
              "en-GB"
            )}.xlsx`;
            downloadLink.click();
          })
          .catch((err) => {
            console.error("Error: ", err);
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
      ModuleDetails.map((item) => {
        if (
          this.$store.getters.get_user_type != "OWNER" &&
          this.$store.getters.get_user_type != "ADMIN"
        ) {
          if (item.module_name == "Territories") {
            item.module_rights.map((moduleRights) => {
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
        } else {
          this.showCreateButton = true;
          this.showEditButton = true;
          this.showActivateDeactivateButton = true;
        }
      });
    },
    opencustmeremmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.current_view = "LIST";
        this.GetAllTerritoriesMethod(
          this.territory_status,
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
      }
    },
    tagServiceCenterDailogEmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.GetAllTerritoriesMethod(
          this.territory_status,
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
        this.current_view = "LIST";
      }
    },
    openemmit() {
      this.viewCustomerdialog = false;
    },
    viewPincodesDialogEmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.GetAllTerritoriesMethod(
          this.territory_status,
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
      }
    },
    dialogCreateTerritoryEmit(Toggle) {
      this.dialogCreateTerritory = false;
      if (Toggle == 2) {
        this.GetAllTerritoriesMethod(
          this.territory_status,
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
      }
    },
    dialogActivateInactivateTerritoryEmit(Toggle) {
      this.dialogActivateInactivateTerritory = false;
      if (Toggle == 2) {
        this.GetAllTerritoriesMethod(
          this.territory_status,
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.dialogCreateTerritory = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateTerritory = true;
      } else if (action == "TAG2") {
        this.current_view = "CUSTOMERTAG";
      } else if (action == "TAG_SERVICE_CENTER") {
        this.current_view = "SERVICECENTERTAG";
      } else if (action == "CUST") {
        this.viewCustomerdialog = true;
      } else if (action == "PINCODES") {
        this.current_view = "PINCODES";
        // this.viewPincodesDialog = true;
      }
    },
  },
};
</script>

<style scoped>
.exceluploadinput {
  display: none !important;
  z-index: -9999 !important;
}
.pincodeuploadinput {
  display: none !important;
  z-index: -9999 !important;
}
</style>
