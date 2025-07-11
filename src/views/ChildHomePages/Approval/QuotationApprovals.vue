<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <ApproveOrRejectQuotation
      :StoreObj="StoreObj"
      :DialogApproveOrRejectQuotation="DialogApproveOrRejectQuotation"
      @clicked="DialogApproveOrRejectQuotationEmit"
    />
    <UpdateSendDetailsInQuotation
      :StoreObj="StoreObj"
      :dialogUpdateSendDetails="dialogUpdateSendDetails"
      @clicked="dialogUpdateSendDetailsEmit"
    />
    <SharePdf
      :StoreObj="StoreObj"
      :dialogSharePdf="dialogSharePdf"
      @clicked="dialogSharePdfEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div
          class="largeFontSizeNew"
          v-if="workflow_type == 'COMPONENT_QUOTATION'"
        >
          Quotations Approvals
        </div>
        <div
          class="largeFontSizeNew"
          v-else-if="workflow_type == 'QUOTATION_TICKET_COMPONENT_REQUEST'"
        >
          Quotation MRF
        </div>
        <v-spacer></v-spacer>
        <!-- <v-select
          dense
          outlined
          :items="workflow_type_items"
          v-model="workflow_type"
          label="Approval Type *"
          class="mt-7 FontSize maxWidthXSmall mr-2"
        ></v-select> -->
        <v-select
          dense
          outlined
          :items="statusItems"
          label="Work Flow Status"
          v-model="workflow_status"
          class="mt-7 FontSize maxWidthXSmall"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="mt-7 ml-2 FontSize mediumWidth"
        ></v-text-field>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="from_date"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="from_date"
              label="Start Date"
              outlined
              desne
              class="FontSize mt-8 ml-2 widthSmall"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="from_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(from_date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :return-value.sync="to_date"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="to_date"
              label="End Date"
              outlined
              dense
              class="ml-2 mt-7 FontSize widthSmall"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            :min="from_date + 1"
            v-model="to_date"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
            <v-btn
              text
              color="primary"
              @click="
                $refs.menu1.save(to_date);
                callListMethod();
              "
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-toolbar>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          :search="search"
          fixed-header
          :height="TableHeight"
          :items-per-page="100"
          :items="GetAllQuotationApprovalsList"
          :no-data-text="noDataText"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :headers="
            workflow_status == 'PENDING'
              ? headers.filter((item) => item.value != 'modified_on')
              : headers
          "
        >
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div class="FontSize" v-if="item.customer_company_name">
              {{ item.customer_company_name }}
            </div>
            <div class="FontSize" v-if="item.customer_name">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.customer_unique_id">
              {{ item.customer_unique_id }}
            </div>
          </template>
          <template v-slot:[`item.request_comments`]="{ item }">
            <div class="FontSize" v-if="item.request_comments">
              {{ item.request_comments }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.workflow_initiated_on">
              Created :
              {{
                new Date(item.workflow_initiated_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
            <div v-if="workflow_type != 'COMPONENT_QUOTATION'">
              <span
                class="FontSize"
                v-if="item.workflow_created_from_ticket_type"
              >
                <span
                  v-if="item.workflow_created_from_ticket_type.includes('_')"
                >
                  {{
                    item.workflow_created_from_ticket_type.replaceAll("_", " ")
                  }}
                </span>
                <span v-else
                  >{{ item.workflow_created_from_ticket_type }}
                </span>
              </span>
            </div>
            <div v-if="workflow_type == 'COMPONENT_QUOTATION'">
              <span class="FontSize" v-if="item.quotation_send_status">
                <span v-if="item.quotation_send_status.includes('_')"></span>
                {{ item.quotation_send_status.replaceAll("_", " ") }}
                <span v-if="item.shared_through"
                  >By {{ item.shared_through }}</span
                >
              </span>
              <span v-else
                >{{ item.quotation_send_status }}
                <span v-if="item.shared_through"
                  >By {{ item.shared_through }}</span
                >
              </span>
            </div>
          </template>
          <template v-slot:[`item.modified_on`]="{ item }">
            <div class="FontSize" v-if="item.modified_on">
              Acted On :
              {{ new Date(item.modified_on * 1000).toLocaleString("en-GB") }}
            </div>
          </template>
          <template v-slot:[`item.customer_phone_number`]="{ item }">
            <div class="FontSize" v-if="item.customer_phone_number">
              {{ item.customer_phone_number }}
            </div>
            <div class="FontSize" v-if="item.customer_name">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
          </template>
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
                    v-if="workflow_type == 'COMPONENT_QUOTATION'"
                    @click.stop="downloadPdf(item)"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Preview</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="workflow_status == 'PENDING'"
                    @click="
                      checkItem(
                        item,
                        'APPROVE',
                        workflow_type == 'COMPONENT_QUOTATION'
                          ? 'COMPONENT_QUOTATION'
                          : 'QUOTATION_TICKET_COMPONENT_REQUEST'
                      )
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="green"> mdi-check-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Approve</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="workflow_status == 'PENDING'"
                    @click.stop="
                      checkItem(
                        item,
                        'REJECT',
                        workflow_type == 'COMPONENT_QUOTATION'
                          ? 'COMPONENT_QUOTATION'
                          : 'QUOTATION_TICKET_COMPONENT_REQUEST'
                      )
                    "
                  >
                    <v-list-item-icon>
                      <v-icon small color="red"> mdi-close-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Reject</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="workflow_status == 'APPROVED'"
                    @click.stop="checkItem(item, 'UPDATE_SEND_DETAILS')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="blue">mdi-update</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Update Send Details</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="workflow_status == 'APPROVED'"
                    @click.stop="shareToCustomer(item)"
                  >
                    <v-list-item-icon>
                      <v-icon small color="green">mdi-share</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Share to Customer</v-list-item-title>
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
Vue.use(Croppa);
import Vue from "vue";
import Croppa from "vue-croppa";
import Overlay from "@/components/Extras/OverlayView.vue";
import SharePdf from "@/components/Quotation/SharePdf.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import UpdateSendDetailsInQuotation from "@/components/Quotation/UpdateSendDetailsInQuotation.vue";
import ApproveOrRejectQuotation from "@/components/Approvals/ApproveOrRejectQuotation.vue";
import { GetAllQuotationApprovals } from "@/mixins/Approvals/GetAllQuotationApprovals.js";
export default {
  components: {
    Overlay,
    Snackbar,
    SharePdf,
    UpdateSendDetailsInQuotation,
    ApproveOrRejectQuotation,
  },
  mixins: [GetAllQuotationApprovals],
  data() {
    return {
      search: "",
      workflow_status: "PENDING",
      noDataText: "No Data Available..!",
      StoreObj: {},
      TableHeight: 0,
      menu: false,
      menu1: false,
      dialogSharePdf: false,
      dialogUpdateSendDetails: false,
      workflow_type: "COMPONENT_QUOTATION",
      workflow_type_items: [
        { text: "Quotation Approvals", value: "COMPONENT_QUOTATION" },
        {
          text: "Quotation MRF Approvals",
          value: "QUOTATION_TICKET_COMPONENT_REQUEST",
        },
      ],
      DialogApproveOrRejectQuotation: false,
      GetAllQuotationApprovalsList: [],
      statusItems: [
        { text: "PENDING", value: "PENDING" },
        { text: "APPROVED", value: "APPROVED" },
        { text: "REJECTED", value: "REJECTED" },
        { text: "IN PROGRESS", value: "IN_PROGRESS" },
      ],
      DialogApproveOrRejectProductFleet: false,
      from_date: new Date(new Date().getTime() - 30 * 86400000)
        .toISOString()
        .substr(0, 10),
      to_date: new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10),
      headers: [
        {
          text: "Customer",
          value: "customer_company_name",
        },
        {
          text: "Contact Details",
          value: "customer_phone_number",
        },
        {
          text: "Request Comments",
          value: "request_comments",
        },
        {
          text: "Acted On",
          value: "modified_on",
        },
        { text: "Actions", value: "Actions" },
      ],
      SnackBarComponent: {},
    };
  },
  watch: {
    workflow_status(val) {
      this.GetAllQuotationApprovalsList = [];
      this.search = "";
      this.GetAllQuotationApprovalsMethod(
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399,
        val,
        this.workflow_type,
        this.workflow_type == "QUOTATION_TICKET_COMPONENT_REQUEST"
          ? "QUOTATION_TICKET"
          : "QUOTATION"
      );
    },
    workflow_type(val) {
      this.GetAllQuotationApprovalsList = [];
      this.search = "";
      this.GetAllQuotationApprovalsMethod(
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399,
        this.workflow_status,
        val,
        this.workflow_type == "QUOTATION_TICKET_COMPONENT_REQUEST"
          ? "QUOTATION_TICKET"
          : "QUOTATION"
      );
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllQuotationApprovalsMethod(
      Date.parse(this.from_date) / 1000,
      Date.parse(this.to_date) / 1000 + 86399,
      this.workflow_status,
      this.workflow_type,
      this.workflow_type == "QUOTATION_TICKET_COMPONENT_REQUEST"
        ? "QUOTATION_TICKET"
        : "QUOTATION"
    );
  },
  methods: {
    dialogSharePdfEmit(Toggle) {
      this.dialogSharePdf = false;
      if (Toggle == 2) {
        this.GetAllQuotationsMethod(
          this.quotation_status,
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399
        );
      }
    },
    callListMethod() {
      this.GetAllQuotationApprovalsMethod(
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399,
        this.workflow_status,
        this.workflow_type,
        this.workflow_type == "QUOTATION_TICKET_COMPONENT_REQUEST"
          ? "QUOTATION_TICKET"
          : "QUOTATION"
      );
    },
    shareToCustomer(item) {
      this.StoreObj = item;
      this.dialogSharePdf = true;
    },
    downloadPdf(item) {
      window.open(item.quotation_s3_url);
    },
    checkItem(item, action, workflow_type) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.StoreObj.workflow_type = workflow_type;
      if (action == "APPROVE" || action == "REJECT") {
        this.DialogApproveOrRejectQuotation = true;
      }
      if (action == "UPDATE_SEND_DETAILS") {
        this.dialogUpdateSendDetails = true;
      }
    },
    dialogUpdateSendDetailsEmit(Toggle) {
      this.dialogUpdateSendDetails = false;
      if (Toggle == 2) {
        this.GetAllQuotationApprovalsMethod(
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399,
          this.workflow_status,
          this.workflow_type,
          this.workflow_type == "QUOTATION_TICKET_COMPONENT_REQUEST"
            ? "QUOTATION_TICKET"
            : "QUOTATION"
        );
      }
    },
    DialogApproveOrRejectQuotationEmit(Toggle) {
      this.DialogApproveOrRejectQuotation = false;
      if (Toggle == 2) {
        this.GetAllQuotationApprovalsMethod(
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399,
          this.workflow_status,
          this.workflow_type,
          this.workflow_type == "QUOTATION_TICKET_COMPONENT_REQUEST"
            ? "QUOTATION_TICKET"
            : "QUOTATION"
        );
      }
    },
  },
};
</script>
