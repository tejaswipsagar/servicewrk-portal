<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <Overlay :overlay="overlay" />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div
          class="largeFontSizeNew"
          v-if="user_type == 'PARTNER_REPRESENTATIVE'"
        >
          All Partner Technicians : {{ AllPartnerRepsAndAgentsList.length }}
        </div>
        <div class="largeFontSizeNew" v-if="user_type == 'PARTNER_AGENT'">
          All Partner Service Co-Ordinators :
          {{ AllPartnerRepsAndAgentsList.length }}
        </div>
        <div class="largeFontSizeNew" v-if="user_type == 'DEALER_AGENT'">
          All Dealer Service Co-Ordinators :
          {{ AllPartnerRepsAndAgentsList.length }}
        </div>
        <div class="largeFontSizeNew" v-if="user_type == 'DEALER_TECHNICIAN'">
          All Dealer Technicians : {{ AllPartnerRepsAndAgentsList.length }}
        </div>
        <v-spacer />
        <v-select
          dense
          outlined
          label="User Type"
          v-model="user_type"
          :items="user_type_items"
          class="mt-9 mr-2 WidthVariation1 FontSize"
        ></v-select>
        <v-select
          dense
          outlined
          label="User Status"
          v-model="user_status"
          :items="user_status_items"
          class="mt-9 mr-2 widthSmall FontSize"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="mt-9 mr-2 WidthVariation2 FontSize"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="uploadExcelTemplate()"
              class="primary white--text mt-2 mr-2"
            >
              <input
                v-if="renderCompNew"
                id="uploadExcel"
                ref="excel-upload-input"
                accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                class="excel-upload-input"
                type="file"
                @change="handleClick"
              />
              <v-icon>mdi-cloud-upload</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Excel Bulk Upload (Inventory)</span>
        </v-tooltip>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="downloadExcelTemplate()"
              class="primary white--text mt-2 mr-2"
            >
              <v-icon>mdi-cloud-download</v-icon>
            </v-btn>
          </template>
          <span class="white--text"
            >Download Bulk Upload Excel Template (Inventory)</span
          >
        </v-tooltip>
        <!-- <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="exporttoexcel"
              class="primary white--text mt-2"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip> -->
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          :search="search"
          :page.sync="page"
          :loading="loading"
          hide-default-footer
          :items-per-page="50"
          :height="TableHeight"
          :no-data-text="noDataText"
          @page-count="pageCount = $event"
          :items="AllPartnerRepsAndAgentsList"
          :headers="
            user_type == 'DEALER_TECHNICIAN'
              ? tech_headers.filter((item) => item.text != 'Service Partner')
              : user_type == 'DEALER_AGENT'
              ? agent_headers.filter((item) => item.text != 'Service Partner')
              : user_type == 'PARTNER_REPRESENTATIVE'
              ? tech_headers.filter((item) => item.text != 'Dealer')
              : user_type == 'PARTNER_AGENT'
              ? agent_headers.filter((item) => item.text != 'Dealer')
              : []
          "
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize">
              {{ AllPartnerRepsAndAgentsList.indexOf(item) + 1 }}
            </div>
          </template>
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize" v-if="item.user_name">
              {{ item.user_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_contact_number`]="{ item }">
            <div class="FontSize" v-if="item.user_contact_number">
              +91-{{ item.user_contact_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_email_id`]="{ item }">
            <div class="FontSize" v-if="item.user_email_id">
              {{ item.user_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.partner_name`]="{ item }">
            <div class="FontSize" v-if="item.partner_name">
              {{ item.partner_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.app_version`]="{ item }">
            <div class="FontSize" v-if="item.app_version">
              {{ item.app_version }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <div class="FontSize" v-if="item.user_created_on">
              {{
                new Date(item.user_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            <div>
              {{ item.created_on || "-" }}
            </div>
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
        <v-pagination
          v-model="page"
          :length="pageCount"
          total-visible="4"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
var xlsx = require("json-as-xlsx");
const ExcelJS = require("exceljs");
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import Overlay from "@/components/Extras/OverlayView.vue";
import { AllPartnerRepsAndAgents } from "@/mixins/Users/AllRepsAndAgent.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllInvalidSerialNumbers } from "@/mixins/Product/ListAllInvalidSerialNumber";
export default {
  mixins: [AllPartnerRepsAndAgents, GenerateS3URL, GetAllInvalidSerialNumbers],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    search: "",
    user_status: "ACTIVE",
    noDataText: "No Data Available..!",
    user_type: "PARTNER_REPRESENTATIVE",
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    loading: false,
    overlay: false,
    renderCompNew: true,
    user_status_items: ["ACTIVE", "INACTIVE", "INVITED", "INVALID"],
    user_type_items: [
      { text: "PARTNER REPRESENTATIVES", value: "PARTNER_REPRESENTATIVE" },
      { text: "PARTNER SERVICE CO-ORDINATORS", value: "PARTNER_AGENT" },
      { text: "DEALER TECHNICIANS", value: "DEALER_TECHNICIAN" },
      { text: "DEALER SERVICE CO-ORDINATORS", value: "DEALER_AGENT" },
    ],
    tech_headers: [
      { text: "#", value: "sl_no" },
      { text: "Name", value: "user_name" },
      { text: "Phone", value: "user_contact_number" },
      { text: "Onboarded On", value: "user_created_on" },
      { text: "App Version", value: "app_version" },
      { text: "Service Partner", value: "partner_name" },
      { text: "Dealer", value: "partner_name" },
    ],
    agent_headers: [
      { text: "#", value: "sl_no" },
      { text: "Name", value: "user_name" },
      { text: "Email ID", value: "user_email_id" },
      { text: "Onboarded On", value: "user_created_on" },
      { text: "App Version", value: "app_version" },
      { text: "Service Partner", value: "partner_name" },
      { text: "Dealer", value: "partner_name" },
    ],
    partner_rep_columns: [
      { label: "Name", value: "user_name" },
      { label: "Phone Number", value: "user_contact_number" },
      { label: "Address", value: "user_address" },
      { label: "Pincode", value: "user_pincode" },
      { label: "Qualification", value: "user_qualification" },
      { label: "user_experience", value: "user_experience" },
      { label: "GST Number", value: "gst_no" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Created On", value: "updated_user_created_on" },
      { label: "App Version", value: "app_version" },
      { label: "Service Partner", value: "partner_name" },
    ],
    partner_agent_columns: [
      { label: "Name", value: "user_name" },
      { label: "Mail ID", value: "user_email_id" },
      { label: "Address", value: "user_address" },
      { label: "Pincode", value: "user_pincode" },
      { label: "Qualification", value: "user_qualification" },
      { label: "Experience", value: "user_experience" },
      { label: "GST Number", value: "gst_no" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Created On", value: "updated_user_created_on" },
      { label: "App Version", value: "app_version" },
      { label: "Service Partner", value: "partner_name" },
    ],
    dealer_agent_columns: [
      { label: "Name", value: "user_name" },
      { label: "Mail ID", value: "user_email_id" },
      { label: "Address", value: "user_address" },
      { label: "Pincode", value: "user_pincode" },
      { label: "Qualification", value: "user_qualification" },
      { label: "GST Number", value: "gst_no" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Created On", value: "updated_user_created_on" },
      { label: "App Version", value: "app_version" },
      { label: "Dealer", value: "partner_name" },
    ],
    dealer_rep_columns: [
      { label: "Name", value: "user_name" },
      { label: "Phone Number", value: "user_contact_number" },
      { label: "Address", value: "user_address" },
      { label: "Pincode", value: "user_pincode" },
      { label: "Qualification", value: "user_qualification" },
      { label: "user_experience", value: "user_experience" },
      { label: "GST Number", value: "gst_no" },
      { label: "PAN Number", value: "user_pan_no" },
      { label: "Created On", value: "updated_user_created_on" },
      { label: "App Version", value: "app_version" },
      { label: "Dealer", value: "partner_name" },
    ],
    AllPartnerRepsAndAgentsList: [],
  }),
  watch: {
    user_type(val) {
      this.search = "";
      if (val != undefined && val != "" && val != null) {
        this.AllPartnerRepsAndAgentsList = [];
        this.AllPartnerRepsAndAgentsMethod(val, this.user_status, undefined);
      }
    },
    async user_status(val) {
      this.search = "";
      if (val === "INVALID") {
        this.tech_headers = [
          { text: "Created On", value: "created_on" },
          { text: "Download Excel", value: "invalid_data_s3_url" },
        ];
        this.agent_headers = [
          { text: "Created On", value: "created_on" },
          { text: "Download Excel", value: "invalid_data_s3_url" },
        ];
        await this.GetAllInvalidSerialNumbersMethod(
          undefined,
          "TECHNICIAN_INVENTORY_BULK_UPLOAD"
        );
        this.AllPartnerRepsAndAgentsList = this.GetAllInvalidSerialNumberList;
        console.log("INVALID", this.GetAllInvalidSerialNumberList);
      } else {
        this.tech_headers = [
          { text: "#", value: "sl_no" },
          { text: "Name", value: "user_name" },
          { text: "Phone", value: "user_contact_number" },
          { text: "Onboarded On", value: "user_created_on" },
          { text: "App Version", value: "app_version" },
          { text: "Service Partner", value: "partner_name" },
          { text: "Dealer", value: "partner_name" },
        ];
        this.agent_headers = [
          { text: "#", value: "sl_no" },
          { text: "Name", value: "user_name" },
          { text: "Email ID", value: "user_email_id" },
          { text: "Onboarded On", value: "user_created_on" },
          { text: "App Version", value: "app_version" },
          { text: "Service Partner", value: "partner_name" },
          { text: "Dealer", value: "partner_name" },
        ];
        this.AllPartnerRepsAndAgentsList = [];
        this.AllPartnerRepsAndAgentsMethod(this.user_type, val, undefined);
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.AllPartnerRepsAndAgentsMethod(
          this.user_type,
          this.user_status,
          this.next_token
        );
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.AllPartnerRepsAndAgentsMethod(
      this.user_type,
      this.user_status,
      undefined
    );
  },
  methods: {
    exporttoexcel() {
      this.AllPartnerRepsAndAgentsList.map((item) => {
        if (item.user_created_on) {
          item.updated_user_created_on = new Date(
            item.user_created_on * 1000
          ).toLocaleString("en-GB");
        }
      });
      let data = [
        {
          sheet:
            this.user_type == "PARTNER_REPRESENTATIVE"
              ? "All Partner Representatives"
              : this.user_type == "PARTNER_AGENT"
              ? "Partner Service Co-Ordinators"
              : this.user_type == "DEALER_AGENT"
              ? "Dealer Service Co-Ordinators"
              : "All Dealer Technicians",
          columns:
            this.user_type == "PARTNER_REPRESENTATIVE"
              ? this.partner_rep_columns
              : this.user_type == "PARTNER_AGENT"
              ? this.partner_agent_columns
              : this.user_type == "DEALER_AGENT"
              ? this.dealer_agent_columns
              : this.dealer_rep_columns,
          content: this.AllPartnerRepsAndAgentsList,
        },
      ];
      let settings = {
        fileName:
          this.user_type == "PARTNER_REPRESENTATIVE"
            ? "All Partner Representatives"
            : this.user_type == "PARTNER_AGENT"
            ? "All Partner Service Co-Ordinators"
            : this.user_type == "DEALER_AGENT"
            ? "All Dealer Service Co-Ordinators"
            : "All Dealer Technicians",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },

    excelDownloadMethod(item) {
      console.log("BBB", item);
      window.open(item);
    },

    uploadExcelTemplate() {
      document.getElementById("uploadExcel").click();
    },

    async handleClick(e) {
      console.log("e", e);
      this.overlay = true;
      let result = await this.GenerateS3URLMethods(
        `TECHNICIAN_INVENTORY_BULK_UPLOAD/${
          this.$store.getters.get_current_user_details.organization_id
        }_${new Date().getTime()}.xlsx`,
        e.target.files[0],
        undefined,
        "TECHNICIAN_INVENTORY_BULK_UPLOAD"
      );
      if (result.status == "SUCCESS") {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Excel Uploaded Successfully!",
          };
          this.renderComp = true;
        });
        this.overlay = false;
        this.refreshComponentMethod();
        setTimeout(() => {
          this.AllPartnerRepsAndAgentsMethod(
            this.user_type,
            this.user_status,
            undefined
          );
        }, 1000);
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Something Went Wrong!! Please Try Again!!",
          };
          this.renderComp = true;
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

    downloadExcelTemplate() {
      this.overlay = true;
      let fieldNamesArray = [
        "Component Name*",
        "Component Code",
        "Technician Country Code*",
        "Technician Contact Number*",
        "Component Count",
        "Component Cost*",
        "Component Cost Gst",
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
            downloadLink.download = `Excel-Bulk-Upload-Template-${new Date().toLocaleString(
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
  },
};
</script>

<style></style>
