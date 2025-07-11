<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <UpdateForm
      :StoreObj="StoreObj"
      :UpdateFormDialog="UpdateFormDialog"
      @clicked="UpdateFormDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Leads</div>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-7 ml-2 mr-3 FontSize maxWidth field_label_size field_height"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              class="gradient-bg white--text mr-4"
              color="primary"
              @click="exporttoexcel"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Data in Excel</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          :headers="formHeaders"
          fixed-header
          :height="TableHeight"
          :items="GetAllFormsList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template
            v-for="(h, i) in formHeaders"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <div :key="i">
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ header.text }}</span>
                </template>
                <span>{{ header.tooltip_text }}</span>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:[`item.company_name`]="{ item }">
            <div v-if="item.company_name != undefined" class="FontSize">
              {{ item.company_name }}
            </div>
            <div v-else>-</div>
            <div v-if="item.customer_name != undefined" class="FontSize">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.customer_contact_number">
              {{ item.customer_contact_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.technician_name`]="{ item }">
            <div
              class="FontSize text-capitalize"
              v-if="item.technician_name != undefined"
            >
              {{ item.technician_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.created_on != undefined">
              {{ new Date(item.created_on * 1000).toLocaleDateString() }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.category_name`]="{ item }">
            <div
              class="FontSize text-capitalize"
              v-if="item.category_name != undefined"
            >
              {{ item.category_name }}
            </div>
            <div v-else>-</div>
            <div
              class="FontSize text-capitalize"
              v-if="item.product_name != undefined"
            >
              {{ item.product_name }}
            </div>
            <div v-else>-</div>
            <div
              class="FontSize text-capitalize"
              v-if="item.form_comments != undefined"
            >
              <span class="font-weight-bold">Comments :</span
              >{{ item.form_comments }}
            </div>
            <div v-else>-</div>
          </template>

          <template v-slot:[`item.sent_to_email_ids`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="FontSize"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  {{
                    item.sent_to_email_ids != undefined
                      ? item.sent_to_email_ids.length > 1
                        ? `${item.sent_to_email_ids.slice(0, 1)}...`
                        : item.sent_to_email_ids
                      : "-"
                  }}
                </div>
              </template>
              <div
                class="FontSize"
                v-for="(mail_id, idx) in item.sent_to_email_ids"
                :key="idx"
              >
                {{ mail_id }}
              </div>
            </v-tooltip>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="checkItem(item, 'EDIT')"
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                >
                  mdi-send
                </v-icon>
              </template>
              <span class="white--text">Send Lead</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import Vue from "vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import UpdateForm from "@/components/Forms/UpdateForm.vue";
import { GetAllFormList } from "@/mixins/Forms/GetAllFormLists.js";
import Croppa from "vue-croppa";
Vue.use(Croppa);
export default {
  components: {
    Overlay,
    Snackbar,
    UpdateForm,
  },
  mixins: [GetAllFormList],
  data() {
    return {
      TableHeight: 0,
      search: null,
      formHeaders: [
        {
          text: "Customer",
          value: "company_name",
          tooltip_text: "Customer",
        },
        {
          text: "Technician",
          value: "technician_name",
          tooltip_text: "Technician Name",
        },
        {
          text: "Category",
          value: "category_name",
          tooltip_text: "Category Name",
        },
        {
          text: "Sent to",
          value: "sent_to_email_ids",
          tooltip_text: "Sent To Mail Ids",
        },
        { text: "Actions", value: "Actions" },
      ],
      columnName: [
        { label: "Customer Name", value: "customer_name" },
        { label: "Company Name", value: "company_name" },
        { label: "Created On", value: "resultDate" },
        { label: "Customer Contact Number", value: "customer_contact_number" },
        { label: "Technician Name", value: "technician_name" },
        { label: "Customer Mail ID", value: "customer_email" },
        { label: "Category", value: "category_name" },
        { label: "Product", value: "product_name" },
        { label: "Email Subject", value: "email_subject" },
        { label: "Email Body", value: "email_body_new" },
        { label: "Comments", value: "form_comments" },
      ],
      UpdateFormDialog: false,
      StoreObj: {},
      SnackBarComponent: {},
    };
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllFormListMethod();
  },
  methods: {
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.UpdateFormDialog = true;
      }
    },
    UpdateFormDialogEmit(Toggle) {
      this.UpdateFormDialog = false;
      if (Toggle == 2) {
        this.GetAllFormListMethod();
      }
    },
    exporttoexcel() {
      this.GetAllFormsList.map((item) => {
        item.resultDate = new Date(item.created_on * 1000).toLocaleString(
          "en-GB"
        );
        item.email_body_new = item.email_body.replaceAll("<br/>", " ");
        this.$forceUpdate();
      });
      let data = [
        {
          sheet: "Leads",
          columns: this.columnName,
          content: this.GetAllFormsList,
        },
      ];
      let settings = {
        fileName: "Leads",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
  },
};
</script>
