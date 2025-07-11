<template>
  <div>
    <Overlay :overlay="overlay" />
    <TransferComponentDialog
      :StoreObj="StoreObj"
      :dialogTransferComp="dialogTransferComp"
      @clicked="CloseDialog"
    />
    <v-card class="elevation-0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="12" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Component Inventory</div>
            <v-col> </v-col>
            <v-spacer></v-spacer>
            <v-text-field
              dense
              outlined
              label="Search"
              class="ml-2 FontSize mt-7 maxWidthSmall"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-select
              dense
              outlined
              label="Consist at"
              v-model="required_user_type"
              :items="required_user_type_items"
              class="FontSize maxWidth mt-7 ml-2 maxWidthSmall"
            ></v-select>
            <!-- <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="primary white--text ml-2"
                  @click="DownloadExcel"
                >
                  <v-icon>mdi-file-excel-outline</v-icon>
                </v-btn>
              </template>
              <span class="white--text">Download Excel</span>
            </v-tooltip> -->
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :height="TableHeight"
          :headers="ComponentHeaders"
          :items="GetAllInventoryList"
          :page.sync="page"
          @page-count="pageCount = $event"
          :search="search"
          hide-default-footer
          :items-per-page="50"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ GetAllInventoryList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.component_cost`]="{ item }">
            <div class="FontSize">
              {{ item.component_cost || "-" }}
            </div>
          </template>
          <template v-slot:[`item.component_cost_gst`]="{ item }">
            <div class="FontSize">
              {{ item.component_cost_gst || "-" }}
            </div>
          </template>
          <template v-slot:[`item.component_name`]="{ item }">
            <div class="FontSize" v-if="item.component_name != undefined">
              {{ item.component_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.component_code`]="{ item }">
            <div class="FontSize" v-if="item.component_code != undefined">
              {{ item.component_code }}
            </div>
            <div
              v-else-if="item.component_product_code != undefined"
              class="FontSize"
            >
              {{ item.component_product_code }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.components_in_stock`]="{ item }">
            <div v-if="item.components_in_stock != undefined" class="FontSize">
              {{ item.components_in_stock }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.transacted_at`]="{ item }">
            <div v-if="item.transacted_at != undefined" class="FontSize">
              {{ new Date(item.transacted_at * 1000).toLocaleString("en-GB") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.service_center_name`]="{ item }">
            <div v-if="item.service_center_name != undefined" class="FontSize">
              {{ item.service_center_name }}
            </div>
            <div
              v-else-if="item.representative_name != undefined"
              class="FontSize"
            >
              {{ item.representative_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="checkItem(item, 'TRANSFER')"
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                >
                  mdi-share
                </v-icon>
              </template>
              <span class="white--text">Transfer Component</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            total-visible="4"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { GetAllInventory } from "@/mixins/Locations/GetAllInventory.js";
import Vue from "vue";
var xlsx = require("json-as-xlsx");
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Overlay from "@/components/Extras/OverlayView.vue";
import TransferComponentDialog from "@/components/Inventory/TransferComponentDialog.vue";
export default {
  components: {
    Overlay,
    TransferComponentDialog,
  },
  mixins: [GetAllInventory],
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    next_token: null,
    overlay: false,
    dialogTransferComp: false,
    search: "",
    status: "ACTIVE",
    required_user_type: "SERVICE_CENTER",
    StoreObj: {},
    GetAllInventoryList: [],
    statusItems: ["ACTIVE", "INACTIVE"],
    required_user_type_items: [
      { text: "SERVICE CENTER", value: "SERVICE_CENTER" },
      { text: "ENTERPRISE REPRESENTATIVE", value: "REPRESENTATIVE" },
      { text: "PARTNER REPRESENTATIVE", value: "PARTNER_REPRESENTATIVE" },
      { text: "DEALER REPRESENTATIVE", value: "DEALER_REPRESENTATIVE" },
      { text: "SERVICE PARTNER", value: "SERVICE_PARTNER" },
    ],
    ComponentHeaders: [
      {
        text: "Sl.no",
        value: "sl_no",
      },
      {
        text: "Component",
        value: "component_name",
      },

      { text: "Code", value: "component_code" },
      { text: "Component Cost", value: "component_cost" },
      {
        text: "Component GST",
        value: "component_cost_gst",
      },
      {
        text: "Stock",
        value: "components_in_stock",
      },
      {
        text: "Transacted At",
        value: "transacted_at",
      },
      {
        text: "Having At",
        value: "service_center_name",
      },
      { text: "Actions", value: "Actions" },
    ],
    loadedPages: [],
  }),
  watch: {
    // page() {
    //   if (
    //     this.next_token != undefined &&
    //     this.next_token != null &&
    //     this.next_token != ""
    //   ) {
    //     this.GetAllComponentsMethod(this.next_token, this.required_user_type);
    //   }
    // },
    async page(val) {
      if (
        val % 2 === 0 &&
        !this.loadedPages.includes(val) &&
        this.next_token !== undefined
      ) {
        this.loadedPages.push(val);
        const currentPage = val;
        let copiedInventoryList = [...this.GetAllInventoryList];
        await this.GetAllComponentsMethod(
          this.next_token,
          this.required_user_type
        );
        this.page = currentPage;
        this.GetAllInventoryList.push(...copiedInventoryList);
      }
    },
    async required_user_type(val) {
      this.search = "";
      this.GetAllInventoryList = [];
      await this.GetAllComponentsMethod(undefined, val);
      this.page = 1;
      this.pageCount = 1;
      this.loadedPages = [];
      // this.GetAllInventoryList = [];
    },
  },
  async mounted() {
    this.TableHeight = window.innerHeight - 200;
    await this.GetAllComponentsMethod(undefined, this.required_user_type);
  },
  methods: {
    DownloadExcel() {
      this.GetAllInventoryList.map((item) => {
        item.resultDate =
          item.transacted_at != undefined
            ? new Date(item.transacted_at * 1000).toLocaleString("en-GB")
            : "-";
        item.component_name =
          item.component_name != undefined ? item.component_name : "-";
        item.components_in_stock =
          item.components_in_stock != undefined
            ? item.components_in_stock
            : "-";
        item.service_center_name =
          item.service_center_name != undefined
            ? item.service_center_name
            : "-";
        item.component_code =
          item.component_code != undefined ? item.component_code : "-";
        this.$forceUpdate();
      });
      let data = [
        {
          sheet: "test",
          columns: [
            {
              label: "Component",
              value: "component_name",
            },
            {
              label: "Component Code",
              value: "component_code",
            },
            {
              label: "Component in Stock",
              value: "components_in_stock",
            },
            {
              label: "Transacted At",
              value: "resultDate",
            },
            {
              label: "Service Center Name",
              value: "service_center_name",
            },
          ],
          content: this.GetAllInventoryList,
        },
      ];
      let settings = {
        fileName: "Components Inventory",
        extraLength: 3,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    CloseDialog(Toggle) {
      if (Toggle == 1) {
        this.dialogTransferComp = false;
      } else if (Toggle == 2) {
        this.dialogTransferComp = false;
        this.GetAllComponentsMethod(undefined, this.required_user_type);
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "TRANSFER") {
        this.dialogTransferComp = true;
      }
    },
  },
};
</script>
