<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderCompForSnackbar"
    />
    <AddComponent
      :StoreObj="StoreObj"
      :dialogAddComponent="dialogAddComponent"
      @clicked="CloseDialog"
    />
    <ProcureComponentDialog
      :StoreObj="StoreObj"
      :dialogProcureComp="dialogProcureComp"
      @clicked="dialogProcureCompEmit"
    />
    <DeactivateComponent
      :StoreObj="StoreObj"
      :dialogActivateInactivateComp="dialogActivateInactivateComp"
      @clicked="dialogActivateInactivateCompEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Components :
          <span v-if="isSearching == false">
            <span v-if="this.status == 'ACTIVE'">
              {{ this.active_components_count }}
            </span>
            <span v-else-if="this.status == 'INACTIVE'">
              {{ this.inactive_components_count }}
            </span>
          </span>
          <span v-else class="FontSize green--text"
            ><v-icon color="green" small>mdi-magnify</v-icon>
            Search Results
            <span
              ><v-btn
                icon
                small
                @click="clearSearch((isSearching = false), (search = ''))"
                ><v-icon small color="red">mdi-close</v-icon></v-btn
              ></span
            >
          </span>
        </div>
        <v-spacer />
        <v-select
          dense
          outlined
          label="Search By"
          v-model="field_name"
          :items="SearchByItems"
          class="FontSize mt-8 mr-2 WidthVariation2"
        >
        </v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon=""
          class="mt-8 mr-2 WidthVariation1 FontSize"
        >
          <template v-slot:append>
            <v-btn
              icon
              small
              v-if="isSearching == false"
              @click="searchvalue((isSearching = true))"
              color="primary"
            >
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">mdi-magnify</v-icon>
                </template>
                <span>Click to Search</span>
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              small
              v-if="isSearching == true"
              @click="clearSearch((isSearching = false), (search = ''))"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">mdi-close</v-icon>
                </template>
                <span>Clear</span>
              </v-tooltip>
            </v-btn>
          </template>
        </v-text-field>
        <v-select
          dense
          outlined
          label="Status"
          v-model="status"
          :items="statusItems"
          class="mt-8 FontSize maxWidthXSmall"
        ></v-select>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" class="mt-1">
              <v-icon color="primary">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-actions>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      v-show="showCreateButton"
                      @click="downloadExcelBaseMethod()"
                      class="primary white--text text-capitalize mt-2"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'COMPONENTS_BULK_UPLOAD'
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
                      'COMPONENTS_BULK_UPLOAD'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Download Components Upload Template</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      @click="checkExcelPresent()"
                      class="primary white--text mt-2 ml-1"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'COMPONENTS_BULK_UPLOAD'
                        )
                      "
                    >
                      <input
                        type="file"
                        id="uploadExcel"
                        v-if="renderCompNew"
                        @change="handleClick"
                        ref="excel-upload-input"
                        class="excel-upload-input"
                        accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                      'COMPONENTS_BULK_UPLOAD'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Upload Bulk Components</span>
              </v-tooltip>
              <!-- <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    color="primary"
                    @click="exporttoexcel"
                    class="primary white--text ml-1 mt-2"
                  >
                    <v-icon>mdi-file-excel-outline</v-icon>
                  </v-btn>
                </template>
                <span class="white--text">Download Components Data</span>
              </v-tooltip> -->
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      class="primary white--text mt-2 ml-1"
                      @click="downloadExcelBaseMethodforBulkProcure()"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'COMPONENTS_INVENTORY_BULK_UPLOAD'
                        )
                      "
                      ><v-icon>mdi-cloud-download</v-icon>
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
                      'COMPONENTS_INVENTORY_BULK_UPLOAD'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Download Template for Bulk Procure</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    <v-btn
                      small
                      class="primary white--text ml-1 mt-2"
                      @click="checkExcelPresentforBulkProcure()"
                      :disabled="
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload ==
                          undefined ||
                        $store.getters.get_current_user_details
                          .organization_details.approved_bulk_upload == [] ||
                        !$store.getters.get_current_user_details.organization_details.approved_bulk_upload.includes(
                          'COMPONENTS_INVENTORY_BULK_UPLOAD'
                        )
                      "
                    >
                      <input
                        type="file"
                        v-if="renderCompNew"
                        ref="excel-upload-input"
                        class="excel-upload-input"
                        id="uploadExcelForBulkProcure"
                        @change="handleClickforBulkProcure"
                        accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                      'COMPONENTS_INVENTORY_BULK_UPLOAD'
                    )
                  "
                  >You're not eligible to upload, Please contact WRKTOP
                  Team..!</span
                >
                <span v-else>Upload Bulk Procure Components</span>
              </v-tooltip>
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    v-show="showCreateButton"
                    class="mt-2 primary white--text ml-1"
                    @click="
                      (dialogAddComponent = true), (StoreObj.action = 'CREATE')
                    "
                    ><v-icon>mdi-plus</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Add Components</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :page.sync="page"
          :items-per-page="50"
          hide-default-footer
          :height="TableHeight"
          :no-data-text="noDataText"
          :headers="ComponentHeaders"
          @page-count="pageCount = $event"
          :items="
            this.status != 'INVALID'
              ? GetAllComponentsList
              : GetAllInvalidSerialNumberList
          "
        >
          <template v-slot:[`item.sl_no`]="{ item }" v-if="status != 'INVALID'">
            <div class="FontSize">
              {{ GetAllComponentsList.indexOf(item) + 1 }}
            </div>
          </template>
          <template
            v-slot:[`item.sl_no`]="{ item }"
            v-else-if="status == 'INVALID'"
          >
            <div class="FontSize">
              {{ GetAllInvalidSerialNumberList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.component_name`]="{ item }">
            <div class="FontSize" v-if="item.component_name != undefined">
              {{ item.component_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize red--text" v-if="item.invalid_reason">
              {{ item.invalid_reason }}
            </div>
          </template>
          <template v-slot:[`item.component_created_on`]="{ item }">
            <div class="FontSize" v-if="item.component_created_on != undefined">
              {{
                new Date(item.component_created_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
          </template>
          <template v-slot:[`item.component_product_code`]="{ item }">
            <div
              class="FontSize"
              v-if="item.component_product_code != undefined"
            >
              {{ item.component_product_code }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.unit_of_measure`]="{ item }">
            <div class="FontSize" v-if="item.unit_of_measure != undefined">
              {{ item.unit_of_measure }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.component_price`]="{ item }">
            <div v-if="item.component_price" class="FontSize">
              {{ item.component_price }}
            </div>
            <div v-else class="FontSize">-</div>
          </template>
          <template v-slot:[`item.components_used`]="{ item }">
            <div v-if="item.components_used" class="FontSize">
              {{ item.components_used }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.components_remaining`]="{ item }">
            <div v-if="item.components_remaining" class="FontSize">
              {{ item.components_remaining }}
            </div>
            <div v-else class="FontSize">-</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  color="teal"
                  class="mr-3"
                  v-show="showEditButton"
                  @click="checkItem(item, 'PROCURE')"
                  v-if="item.component_status == 'ACTIVE'"
                >
                  mdi-comment-question-outline
                </v-icon>
              </template>
              <span class="white--text">Procure Component</span>
            </v-tooltip>
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-1"
                  color="primary"
                  v-show="showEditButton"
                  @click="checkItem(item, 'EDIT')"
                  v-if="item.component_status == 'ACTIVE'"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span class="white--text">Edit Component</span>
            </v-tooltip>
            <v-tooltip bottom v-if="status != 'INVALID'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-on="on"
                  v-bind="attrs"
                  @click="checkItem(item, 'ACTION')"
                  v-show="showActivateDeactivateButton"
                  :color="item.component_status == 'ACTIVE' ? 'red' : 'green'"
                  ><v-icon small>{{
                    item.component_status == "ACTIVE"
                      ? "mdi-close-thick"
                      : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="
                  item.component_status == 'ACTIVE' ? `Deactivate` : `Activate`
                "
              ></span>
            </v-tooltip>
          </template>
        </v-data-table>
        <v-pagination
          v-model="page"
          total-visible="4"
          :length="pageCount"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
const ExcelJS = require("exceljs");
var xlsx = require("json-as-xlsx");
import { GetAllComponents } from "@/mixins/Product/GetAllComponents.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllComponentsBySearch } from "@/mixins/Product/GetAllSearchedComponents.js";
import { GetAllInvalidSerialNumbers } from "@/mixins/Product/ListAllInvalidSerialNumber.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import AddComponent from "@/components/Product/Dialogs/AddComponent.vue";
import ProcureComponentDialog from "@/components/Inventory/ProcureComponentDialog.vue";
import DeactivateComponent from "@/components/Product/ListComponetInventory/DeactivateComponent.vue";
export default {
  components: {
    Overlay,
    Snackbar,
    AddComponent,
    DeactivateComponent,
    ProcureComponentDialog,
  },
  mixins: [
    GenerateS3URL,
    GetAllComponents,
    GetAllComponentsBySearch,
    GetAllInvalidSerialNumbers,
  ],
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    search: "",
    status: "ACTIVE",
    active_components_count: "",
    field_name: "component_name",
    inactive_components_count: "",
    overlay: false,
    isSearching: false,
    renderCompNew: true,
    showEditButton: false,
    showCreateButton: false,
    dialogProcureComp: false,
    dialogAddComponent: false,
    renderCompForSnackbar: true,
    dialogActivateInactivateComp: false,
    GetAllComponentsList: [],
    GetAllInvalidSerialNumberList: [],
    statusItems: ["ACTIVE", "INACTIVE", "INVALID"],
    SearchByItems: [
      { text: "Comp. Name", value: "component_name" },
      { text: "Comp. Code", value: "component_product_code" },
    ],
    ComponentHeaders: [
      {
        text: "#",
        value: "sl_no",
        width: "6%",
      },
      {
        text: "Component",
        value: "component_name",
        width: "20%",
      },
      {
        text: "Price",
        value: "component_price",
        width: "8%",
      },
      {
        text: "Used",
        value: "components_used",
        width: "8%",
      },
      {
        text: "Remaining",
        value: "components_remaining",
        width: "11%",
      },
      {
        text: "UOM",
        value: "unit_of_measure",
        width: "8%",
      },
      {
        text: "Created On",
        value: "component_created_on",
        width: "15%",
      },
      {
        text: "Code",
        value: "component_product_code",
        width: "10%",
      },
      { text: "Actions", value: "Actions", width: "12%" },
    ],
    StoreObj: {},
    SnackBarComponent: {},
    columnName: [
      { label: "Component", value: "component_name" },
      { label: "Created On", value: "new_component_created_on" },
      { label: "Code", value: "component_product_code" },
      { label: "Price", value: "component_price" },
      { label: "Used", value: "components_used" },
      { label: "Remaining", value: "components_remaining" },
      { label: "Unit Of Measure", value: "unit_of_measure" },
    ],
  }),
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        if (this.status != "INVALID") {
          this.GetAllComponentsMethod(this.status, this.next_token);
        } else {
          this.GetAllInvalidSerialNumbersMethod(this.next_token, "COMPONENTS");
        }
      }
    },
    status(val) {
      this.search = "";
      this.isSearching = false;
      if (val != "INVALID") {
        this.GetAllComponentsList = [];
        this.GetAllComponentsMethod(val, undefined);
      } else {
        this.GetAllInvalidSerialNumberList = [];
        this.GetAllInvalidSerialNumbersMethod(undefined, "COMPONENTS");
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllComponentsMethod(this.status, undefined);
    this.GetAccessModuleMethod();
    if (this.$store.getters.get_current_user_details != undefined) {
      if (
        this.$store.getters.get_current_user_details.organization_details !=
        undefined
      ) {
        if (
          this.$store.getters.get_current_user_details.organization_details
            .active_components_count != undefined
        ) {
          this.active_components_count =
            this.$store.getters.get_current_user_details.organization_details.active_components_count;
        }
      }
    }
    if (this.$store.getters.get_current_user_details != undefined) {
      if (
        this.$store.getters.get_current_user_details.organization_details !=
        undefined
      ) {
        if (
          this.$store.getters.get_current_user_details.organization_details
            .inactive_components_count != undefined
        ) {
          this.inactive_components_count =
            this.$store.getters.get_current_user_details.organization_details.inactive_components_count;
        }
      }
    }
  },
  methods: {
    checkExcelPresentforBulkProcure() {
      document.getElementById("uploadExcelForBulkProcure").click();
    },
    async handleClickforBulkProcure(e) {
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `COMPONENTS_INVENTORY_BULK_UPLOAD/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.renderCompNew = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText:
              "Uploaded Successfully, Please get back in some time !!",
          };
          this.renderCompNew = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
        setTimeout(() => {
          this.GetAllComponentsList = [];
          this.GetAllComponentsMethod(this.status, undefined);
        }, 1000);
      }
    },
    downloadExcelBaseMethodforBulkProcure() {
      this.overlay = true;
      let fieldNamesArray = [
        "Component Name",
        "Component Code",
        "Service Center",
        "Component Count",
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
            downloadLink.download = `Bulk-Procure-Components-${new Date().toDateString(
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
    clearSearch() {
      this.GetAllComponentsList = [];
      this.GetAllComponentsMethod(this.status, undefined);
    },
    searchvalue(isSearching = true) {
      if (
        this.search != "" &&
        this.search != null &&
        this.search != undefined
      ) {
        (this.GetAllComponentsList = []),
          setTimeout(() => {
            this.GetAllComponentsBySearchMethod(
              this.status,
              this.search,
              this.field_name
            );
          }, 200);
        this.next_token = "";
      } else {
        this.isSearching = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Type Something to Search..!",
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    checkExcelPresent() {
      document.getElementById("uploadExcel").click();
    },
    exporttoexcel() {
      this.GetAllComponentsList.map((item) => {
        item.new_component_created_on = new Date(
          item.component_created_on * 1000
        ).toLocaleString("en-GB");
        item.component_product_code =
          item.component_product_code != undefined
            ? item.component_product_code
            : "-";
        item.component_price =
          item.component_price != undefined ? item.component_price : "-";
        item.components_used =
          item.components_used != undefined ? item.components_used : "-";
        item.components_remaining =
          item.components_remaining != undefined
            ? item.components_remaining
            : "-";
        this.$forceUpdate();
      });
      let data = [
        {
          sheet: "Components",
          columns: this.columnName,
          content: this.GetAllComponentsList,
        },
      ];
      let settings = {
        fileName: "Components",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    async handleClick(e) {
      console.log("e", e);
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `COMPONENTS_BULK_UPLOAD/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0]
      );
      if (result.status == "SUCCESS") {
        this.renderCompForSnackbar = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText:
              "Uploaded Successfully, Please get back in some time !!",
          };
          this.renderCompForSnackbar = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
      } else {
        this.renderCompForSnackbar = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Something Went Wrong!! Please Try Again!!",
          };
          this.renderCompForSnackbar = true;
        });
      }
      this.overlay = false;
    },
    refreshComponentMethod() {
      this.renderCompNew = false;
      this.$nextTick(() => {
        this.renderCompNew = true;
      });
      this.renderComp = false;
      this.$nextTick(() => {
        this.renderComp = true;
      });
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
            if (item.sub_modules[2].module_name == "Components") {
              item.sub_modules[2].module_rights.map((moduleRights) => {
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
    downloadExcelBaseMethod() {
      this.overlay = true;
      let fieldNamesArray = [
        "Component Name",
        "Component Code",
        "Description",
        "Component Price",
        "Unit Of Measure",
        "Product Name",
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
            downloadLink.download = `Bulk-Upload-Components-Template-${new Date().toLocaleString(
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
    CloseDialog(Toggle) {
      if (Toggle == 1) {
        this.dialogAddComponent = false;
      } else if (Toggle == 2) {
        this.dialogAddComponent = false;
        this.GetAllComponentsList = [];
        this.GetAllComponentsMethod(this.status, undefined);
      }
    },
    dialogProcureCompEmit(Toggle) {
      if (Toggle == 1) {
        this.dialogProcureComp = false;
      } else if (Toggle == 2) {
        this.dialogProcureComp = false;
        this.GetAllComponentsList = [];
        this.GetAllComponentsMethod(this.status, undefined);
      }
    },
    dialogActivateInactivateCompEmit(Toggle) {
      this.dialogActivateInactivateComp = false;
      if (Toggle == 2) {
        this.GetAllComponentsList = [];
        this.GetAllComponentsMethod(this.status, undefined);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.dialogAddComponent = true;
      } else if (action == "PROCURE") {
        this.dialogProcureComp = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateComp = true;
      }
    },
  },
};
</script>
