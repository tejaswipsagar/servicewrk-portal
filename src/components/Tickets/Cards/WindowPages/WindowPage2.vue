<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <dailogTicketDetails
      :StoreObjTicketDetails="StoreObjTicketDetails"
      :StoreObj="StoreObj"
      :viewTicketDetailsDailog="viewTicketDetailsDailog"
      @clicked="viewTicketDetailsDailogemit"
    />
    <v-card flat outlined>
      <v-data-table
        dense
        show-select
        show-expand
        fixed-header
        item-key="sl_no"
        :search="search"
        :page.sync="page"
        v-model="selected"
        :loading="loading"
        :items-per-page="100"
        :height="TableHeight"
        :headers="TableHeader"
        :expanded.sync="expanded"
        :single-expand="singleExpand"
        :items="GetTaggedProductList"
        @page-count="pageCount = $event"
        :footer-props="{
          'disable-items-per-page': true,
        }"
        @click:row="handleRowClick"
        class="TableValFontsize"
      >
        <v-switch
          class="mt-2"
          label="Single expand"
          v-model="singleExpand"
        ></v-switch>
        <template v-slot:[`item.category_name`]="{ item }">
          <div class="FontSize">
            {{ item.category_name }}
          </div>
        </template>
        <template v-slot:[`item.product_name`]="{ item }">
          <div class="FontSize">
            {{ item.product_name }}
          </div>
        </template>
        <template v-slot:[`item.asset_number`]="{ item }">
          <div class="FontSize">
            {{ item.asset_number || "-" }}
          </div>
        </template>
        <template v-slot:[`item.setting_name`]="{ item }">
          <div class="FontSize">
            {{ item.setting_name
            }}<v-icon
              small
              color="primary"
              @click="viewTicketDetailsMethod(item)"
              v-if="item.setting_name != undefined && item.setting_name != ''"
              >mdi-information</v-icon
            >
          </div>
        </template>
        <template v-slot:[`item.ticket_creation_type`]="{ item }">
          <div class="FontSize">
            <v-card flat width="100px" height="25px">
              <v-autocomplete
                dense
                outlined
                :rules="ticket_type_rules(item)"
                height="25px"
                class="rounded-0 FontSize10px"
                :items="ticket_creation_type_items"
                v-model="item.ticket_creation_type"
              ></v-autocomplete>
            </v-card>
          </div>
        </template>
        <template v-slot:[`item.service_type`]="{ item }">
          <div class="FontSize">
            <v-card flat width="100px" height="25px">
              <v-select
                dense
                outlined
                height="25px"
                return-object
                v-model="item.service_type"
                :items="item.GetServiceList"
                item-value="service_type_id"
                item-text="service_type_name"
                :rules="IsRulesRequired(item)"
                class="rounded-0 FontSize10px"
              ></v-select>
            </v-card>
          </div>
        </template>
        <template v-slot:[`item.problem_type`]="{ item }">
          <div class="FontSize">
            <v-card flat width="100px" height="25px">
              <v-combobox
                dense
                outlined
                height="25px"
                :items="GetProblem"
                item-text="setting_name"
                item-value="setting_name"
                v-model="item.problem_type"
                class="rounded-0 FontSize10px"
                :rules="IsRulesRequired(item)"
              ></v-combobox>
            </v-card>
          </div>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row class="pt-8 ma-2">
              <v-card flat width="100px" class="ma-2">
                <div v-if="item.support_type != undefined">
                  <div class="FontSize">
                    <b>Support :</b> {{ item.support_type }}
                    <div
                      style="font-size: 10px"
                      v-if="
                        item.warranty_start_date != undefined &&
                        item.warranty_start_date != '-'
                      "
                    >
                      <b> Warranty Starts : </b> {{ item.warranty_start_date }}
                    </div>
                    <div
                      style="font-size: 10px"
                      v-if="
                        item.extended_warranty_start_date != undefined &&
                        item.extended_warranty_start_date != '-'
                      "
                    >
                      <b> Extended Warranty : </b>
                      {{ item.extended_warranty_start_date }}
                    </div>
                  </div>
                </div>
                <div v-else>
                  <v-select
                    dense
                    outlined
                    label="Support"
                    :items="WarrentyType"
                    v-model="item.support_typeee"
                    class="rounded-0 FontSize10px"
                    @input="GetAllAMCTypeMethod('ACTIVE', item.support_typeee)"
                  ></v-select>
                </div>
              </v-card>
              <v-card flat width="100px" class="ma-2">
                <div class="FontSize" v-if="item.warranty_type != undefined">
                  <b>Support Type :</b> {{ item.warranty_type }}
                  <div
                    style="font-size: 10px"
                    v-if="
                      item.warranty_end_date != undefined &&
                      item.warranty_end_date != '-'
                    "
                  >
                    <b> Warranty Ends : </b>
                    {{ item.warranty_end_date }}
                  </div>
                  <div
                    style="font-size: 10px"
                    v-if="
                      item.extended_warranty_end_date != undefined &&
                      item.extended_warranty_end_date != '-'
                    "
                  >
                    <b> Extended Warranty : </b>
                    {{ item.extended_warranty_end_date }}
                  </div>
                </div>
                <v-select
                  dense
                  outlined
                  label="Support Type"
                  item-text="setting_name"
                  item-value="setting_name"
                  :items="GetAllAMCTypeList"
                  v-model="item.warranty_typeee"
                  class="rounded-0 FontSize10px"
                  v-if="item.warranty_type == undefined"
                  return-object
                ></v-select>
              </v-card>
              <v-card flat width="100px" class="ma-2">
                <v-text-field
                  dense
                  outlined
                  label="Invoice Number"
                  v-model="item.invoice_number"
                  class="rounded-0 FontSize10px"
                ></v-text-field>
              </v-card>
              <v-card flat width="100px" class="ma-2">
                <v-menu
                  left
                  offset-y
                  min-width="auto"
                  :nudge-right="40"
                  transition="scale-transition"
                  v-model="item.MenuInvoiceDate"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      v-on="on"
                      v-bind="attrs"
                      label="Invoice Date"
                      v-model="item.invoice_date"
                      class="rounded-0 FontSize10px"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="item.invoice_date"
                    @input="item.MenuInvoiceDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-card>
              <v-card flat width="100px" class="ma-2">
                <v-menu
                  left
                  min-width="auto"
                  :nudge-right="40"
                  v-model="item.Menu"
                  transition="scale-transition"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      v-on="on"
                      v-bind="attrs"
                      label="Installation Date"
                      class="rounded-0 FontSize10px"
                      v-model="item.product_purchased_on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    @input="item.Menu = false"
                    v-model="item.product_purchased_on"
                  ></v-date-picker>
                </v-menu>
              </v-card>
              <v-col cols="12" md="2">
                <div class="FontSize">
                  <v-file-input
                    dense
                    counter
                    outlined
                    multiple
                    show-size
                    height="30px"
                    prepend-icon=""
                    label="File Upload"
                    v-model="item.file_input"
                    class="FontSize10px rounded-0"
                    @change="SelectedFileMethod(item)"
                  ></v-file-input>
                </div>
              </v-col>
              <v-col cols="12" md="2">
                <div class="FontSize">
                  <v-text-field
                    dense
                    outlined
                    label="Additional Comments"
                    class="rounded-0 FontSize10px"
                    v-model="item.additional_comments"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="1"
                v-if="
                  $store.getters.get_current_user_details.organization_details
                    .enable_foc_for_ticket === true
                "
              >
                <div class="FontSize mt-n4">
                  <v-checkbox label="FOC" v-model="item.is_free_of_cost">
                  </v-checkbox>
                </div>
              </v-col>
            </v-row>
          </td>
        </template>
      </v-data-table>
      <v-dialog :value="AddCategoryDialog" persistent max-width="650px">
        <v-card>
          <v-toolbar dark dense class="elevation-0" color="primary">
            <div>
              <v-icon small class="mr-2">{{ "mdi-plus" }}</v-icon
              >Add New Product
            </div>
            <v-spacer></v-spacer>
            <v-btn text @click="WindowPageEmit"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form ref="formN">
                <v-row cols="12" xs="12" sm="12" md="12" class="ma-3">
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      return-object
                      class="FontSize"
                      label="Category *"
                      :items="categoryItems"
                      item-text="category_name"
                      item-value="category_id"
                      v-model="AddCategory.category_name"
                      :rules="[(v) => !!v || 'Required']"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-autocomplete
                      dense
                      outlined
                      return-object
                      class="FontSize"
                      label="Product *"
                      item-text="service_name"
                      item-value="service_name"
                      v-model="AddCategory.product_name"
                      :rules="[(v) => !!v || 'Required']"
                      :items="GetServiceByCategoriesList"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      :rules="serail_number_rules"
                      class="FontSize"
                      label="Serial Number"
                      item-text="setting_name"
                      item-value="setting_name"
                      :items="GetTaggedProductList"
                      v-model="AddCategory.setting_name"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="save1">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>
<script>
window.Buffer = Buffer;
var AWS = require("aws-sdk");
import { Buffer } from "buffer";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetTaggedProduct } from "@/mixins/Tickets/ListTaggedProducts.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllOrganizationSettings } from "@/mixins/Tickets/GetAllOrganizationSettings.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import { GetAllServiceTypeBasedOnServiceID } from "@/mixins/Tickets/GetAllListServiceTypeById.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import dailogTicketDetails from "@/components/ScheduledService/Dialogs/ViewTicketDetailsDailog.vue";
export default {
  props: {
    search: String,
    StoredObject: Object,
    currentWindow: Number,
    AddCategoryDialog: Boolean,
  },
  mixins: [
    GenerateS3URL,
    GetTaggedProduct,
    GetServicesByCategory,
    GetAllOrganizationSetting,
    GetAllOrganizationSettings,
    GetAllServiceTypeBasedOnServiceID,
    GetAllOrganizationSettingsTypesInMS,
  ],
  components: {
    Overlay,
    Snackbar,
    dailogTicketDetails,
  },
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    menu: false,
    loading: false,
    overlay: false,
    renderComp: true,
    singleExpand: false,
    mandatoryField: false,
    MenuInvoiceDate: false,
    viewTicketDetailsDailog: false,
    dailogAddServiceInformationDetails: false,
    date: new Date().toISOString().substring(0, 10),
    file_Url: "",
    ticket_warranty_type: "None",
    StoreObj: {},
    SnackBarComponent: {},
    StoreObjTicketDetails: {},
    AddCategory: {
      file_input: [],
      date: "",
      service_id: "",
      product_id: "",
      product_name: "",
      category_name: "",
      service_type_id: "",
      service_type_name: "",
      additional_comments: "",
      ticket_creation_type: "",
      service_serial_number: "",
      is_free_of_cost: false,
    },
    expanded: [],
    selected: [],
    GetProblem: [],
    SelectedFile: [],
    categoryItems: [],
    selected_files: [],
    GetAllAMCTypeList: [],
    serail_number_rules: [],
    ticket_creation_type_items: [
      { text: "Breakdown", value: "BREAKDOWN" },
      { text: "Installation", value: "INSTALLATION" },
      { text: "Schedule Service", value: "SCHEDULE_SERVICE" },
      { text: "Core Service Job", value: "CORE_SERVICE_JOB" },
      { text: "Non-Core Service Job", value: "NON_CORE_SERVICE_JOB" },
      { text: "Sundary Job", value: "SUNDARY_JOB" },
      { text: "Other", value: "OTHER" },
    ],
    WarrentyType: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "AMC" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NONE", value: "NO_WARRANTY" },
    ],
    TableHeader: [
      { text: "Category *", value: "category_name", sortable: false },
      { text: "Product *", value: "product_name", sortable: false },
      {
        text: "Serial Number",
        value: "setting_name",
        sortable: false,
      },
      {
        text: "Asset Number",
        value: "asset_number",
        sortable: false,
      },
      { text: "Ticket Type", value: "ticket_creation_type" },
      { text: "Service Type *", value: "service_type", sortable: false },
      { text: "Problem Description *", value: "problem_type", sortable: false },
      { text: "More", value: "data-table-expand" },
    ],
  }),
  watch: {
    AddCategoryDialog(val) {
      if (val == true) {
        this.serail_number_rules = [];
        if (
          this.$store.getters.get_current_user_details.organization_details
            .ticket_create_sequence != undefined
        ) {
          if (
            this.$store.getters.get_current_user_details.organization_details.ticket_create_sequence.includes(
              "PRODUCT_FLEET"
            )
          ) {
            this.serail_number_rules = [(v) => !!v || "Required"];
          } else {
            this.serail_number_rules = [];
          }
        } else {
          this.serail_number_rules = [];
        }
      }
    },
    "AddCategory.category_name"(val) {
      this.GetServicesByCategoriesMethod(val.category_id);
    },
    "AddCategory.service_id"(val) {
      this.GetAllServiceTypeByServiceIDMethod(val);
      this.GetTaggedProductMethod(
        this.StoredObject.customer_id,
        undefined,
        undefined
      );
    },
    currentWindow(val) {
      if (val === 3) {
        this.WindowPageEmit(2, this.selected);
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetTaggedProductMethod(
          this.StoredObject.customer_id,
          undefined,
          this.next_token
        );
        setTimeout(() => {
          this.ListServiceTypeMethod();
        }, 2000);
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 255;
    this.GetAllOrganizationSettingsTypesMethod();
    console.log("CHECK_THIS_OBJ_FROM_W2", this.StoredObject);
    if (this.StoredObject.customer_id != undefined) {
      this.GetTaggedProductMethod(
        this.StoredObject.customer_id,
        undefined,
        undefined
      );
    }
    this.GetAllOrganizationSettingsMethod("ACTIVE", "PROBLEM_DESCRIPTION");
    setTimeout(() => {
      this.ListServiceTypeMethod();
    }, 2000);
  },
  methods: {
    handleRowClick(item) {
      console.log("ITEmm", item);
    },
    ticket_type_rules(item) {
      if (
        this.$store.getters.get_current_user_details.organization_details
          .ticket_create_sequence != undefined
      ) {
        if (
          this.$store.getters.get_current_user_details.organization_details.ticket_create_sequence.includes(
            "CALL_TYPE"
          )
        ) {
          return this.selected.includes(item) ? [(v) => !!v || "Required"] : [];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    IsRulesRequired(item) {
      return this.selected.includes(item) ? [(v) => !!v || "Required"] : [];
    },
    viewTicketDetailsDailogemit() {
      this.viewTicketDetailsDailog = false;
    },
    viewTicketDetailsMethod(item) {
      this.StoreObjTicketDetails = item;
      this.viewTicketDetailsDailog = true;
    },
    SelectedFileMethod(item) {
      this.UploadToS3Method(item);
    },
    // OnclickEvent(e) {
    //   this.SelectedFile = e.target.files;
    //   setTimeout(() => {
    //     this.UploadToS3Method();
    //   }, 500);
    // },
    async UploadToS3Method(attachment) {
      let LocalArray = [];
      for (let i = 0; i < attachment.file_input.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
          attachment.file_input[i]
        );
        let Obj = {
          file_name: attachment.file_input[i].name,
          file_type: attachment.file_input[i].type,
          file_url: result.profile_pic_url,
        };
        LocalArray.push(Obj);
      }
      this.GetTaggedProductList.map((item) => {
        let Object = item;
        if (item.setting_name === attachment.setting_name) {
          Object.UploadedFile = LocalArray;
        }
        this.$forceUpdate();
      });
      console.log("check File", this.GetTaggedProductList);
    },
    async ListServiceTypeMethod() {
      if (this.GetTaggedProductList.length != 0) {
        for (let i = 0; i < this.GetTaggedProductList.length; i++) {
          this.GetTaggedProductList[i].GetServiceList =
            await this.GetAllServiceTypeByServiceIDMethod(
              this.GetTaggedProductList[i].product_id
            );
        }
        this.$forceUpdate();
      }
    },
    WindowPageEmit(Toggle, SelectedData) {
      this.$emit("clicked", Toggle, SelectedData);
    },
    save1() {
      if (this.$refs.formN.validate()) {
        let Object = {
          category_name: this.AddCategory.category_name.category_name,
          category_id: this.AddCategory.category_name.category_id,
          product_name: this.AddCategory.product_name.service_name,
          product_id: this.AddCategory.product_name.service_id,
          setting_name: this.AddCategory.setting_name,
          service_type: this.AddCategory.service_type,
          sl_no: Math.random(),
          support_type: this.AddCategory.support_typeee,
          warranty_type: this.AddCategory.warranty_typeee,
          problem_type: this.AddCategory.problem_type,
          invoice_number: this.AddCategory.invoice_number,
          product_purchased_on: this.AddCategory.product_purchased_on,
          invoice_date: this.AddCategory.invoice_date,
          Menu: false,
          file_input: this.selected_files,
          additional_comments: this.AddCategory.additional_comments,
          is_free_of_cost: this.AddCategory.is_free_of_cost,
          ticket_creation_type: this.AddCategory.ticket_creation_type,
        };
        this.GetTaggedProductList.push(Object);
        this.GetTaggedProductList.map((item) => {
          if (item.GetServiceList != undefined) {
            item.GetServiceList = [];
          }
        });
        this.selected.push(Object);
        this.ListServiceTypeMethod();
        this.WindowPageEmit();
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill All Mandatory Fields *",
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>

<style></style>
