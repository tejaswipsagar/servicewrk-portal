<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <ViewWorkFlowItemsDailog
      :StoreObj="StoreObj"
      :work_flow_status="work_flow_status"
      :dailogWorkflowItemsList="dailogWorkflowItemsList"
      @clicked="dailogWorkflowItemsListEmit"
    />
    <UpdateApprovedComponent
      :StoreObj="StoreObj"
      :UpdateApprovedComponentDialog="UpdateApprovedComponentDialog"
      @clicked="UpdateApprovedComponentDialogEmit"
    />
    <ViewTicketDetails
      :StoreObj="StoreObj"
      :viewTicketDetailsDialog="viewTicketDetailsDialog"
      @clicked="viewTicketDetailsDialogEmit"
    />
    <ViewAttachmentsDialog
      :StoreObjNew="StoreObjNew"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <TicketQuotationDisplay
      :TicketQuotationDisplayDialog="TicketQuotationDisplayDialog"
      :StoreObj="StoreObj"
      @clicked="TicketQuotationDisplayDialogEmit"
    />
    <HoldComponent
      :HoldComponentDialog="holdComponentDialog"
      :HoldComponentObj="holdComponentObj"
      @clicked="HoldComponentDialogEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Component Approvals
          <span v-if="this.approval_type == 'TICKET'"> ( TICKET )</span>
          <span v-else-if="this.approval_type == 'QUOTATION'">
            ( DIRECT QUOTATION )</span
          >
          <span v-else-if="this.approval_type == 'REPRESENTATIVE'"
            >( USER )</span
          >
        </div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          label="Approval Type"
          v-model="approval_type"
          :items="approval_type_items"
          class="mt-7 mr-2 FontSize maxWidthXSmall"
        >
        </v-select>
        <v-select
          dense
          outlined
          :items="statusItems"
          label="Work Flow Status"
          v-model="work_flow_status"
          class="mt-7 FontSize WidthVariation2"
        ></v-select>
        <v-select
          v-if="work_flow_status == 'APPROVED'"
          outlined
          dense
          label="Filter Status"
          class="mt-7 mx-2 FontSize WidthVariation2"
          :items="FilterStatusItems"
          v-model="FilteredValue"
        ></v-select>
        <v-select
          v-if="approval_type === 'QUOTATION'"
          v-model="searchBy"
          :items="searchByItems"
          item-text="text"
          item-value="value"
          dense
          outlined
          label="Search By"
          class="mt-7 ml-2 FontSize mediumWidth"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          class="mt-7 ml-2 FontSize mediumWidth"
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
                  <v-icon color="primary" v-on="on">mdi-close</v-icon>
                </template>
                <span aria-label="clear">Clear</span>
              </v-tooltip>
            </v-btn>
          </template>
        </v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="
                $router.push({
                  name: 'TicketReports',
                  params: { page: 'MRF' },
                })
              "
              class="primary white--text ml-2"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          fixed-header
          :search="search"
          :page.sync="page"
          :items-per-page="50"
          :height="TableHeight"
          :items="
            approval_type == 'REPRESENTATIVE' || approval_type == 'TICKET'
              ? WorkFlowList
              : GetAllQuotationApprovalsList
          "
          :no-data-text="noDataText"
          @page-count="pageCount = $event"
          :headers="
            approval_type == 'REPRESENTATIVE'
              ? HeadersForTicetAprovalType
              : work_flow_status != 'APPROVED'
              ? approvalHeaders.filter((item) => item.value != 'Actions')
              : approvalHeaders
          "
          @click:row="DisplayTicketQuotation"
          class="TableValFontsize"
        >
          <template v-slot:[`item.mrf_id`]="{ item }">
            <div class="FontSize" v-if="item.mrf_id">
              <v-tooltip bottom color="green" v-if="item.is_holded_mrf">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-on="on"
                    v-bind="attrs"
                    small
                    color="green"
                    class="mr-1"
                    >mdi-pause-circle</v-icon
                  >
                </template>
                <span>Holded MRF</span>
              </v-tooltip>
              {{ item.mrf_id }}

              <span v-if="item.type">
                <span v-if="item.type == 'QUOTATION_MRF'">
                  <v-tooltip bottom color="green">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-on="on" v-bind="attrs" small color="green"
                        >mdi-cash-check</v-icon
                      >
                    </template>
                    <span>Quotation MRF</span>
                  </v-tooltip>
                </span>
              </span>
            </div>
            <div v-else>N/A</div>
            <div class="FontSize" v-if="item.service_name">
              <span class="font-weight-bold"> Product : </span>
              {{ item.service_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.approved_from_status`]="{ item }">
            <div>
              {{ formatedApprovedStatus(item.approved_from_status) }}
            </div>
          </template>
          <template v-slot:[`item.service_center_name`]="{ item }">
            <div class="FontSize" v-if="item.service_center_name != undefined">
              {{ item.service_center_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.previous_approver_name`]="{ item }">
            <div v-if="work_flow_status === 'HOLD'">
              {{ item.previous_approver_name || "-" }}
            </div>
          </template>
          <template v-slot:[`item.custom_ticket_id`]="{ item }">
            <div>
              <div v-if="approval_type != 'QUOTATION'">
                <span
                  class="FontSize"
                  v-if="item.custom_ticket_id != undefined"
                >
                  {{ item.custom_ticket_id }}
                </span>
                <span class="FontSize" v-else-if="item.ticket_module_id">{{
                  item.ticket_module_id
                }}</span>
                <span class="FontSize" v-else>{{ item.module_id }}</span>
                <!--<v-icon
                  small
                  @click="viewTicketDetailsMethod(item)"
                  color="primary"
                  >mdi-information</v-icon
                > -->
              </div>

              <!-- <div v-show="approval_type === 'QUOTATION'">
                <span class="FontSize">
                  <div class="d-flex">
                    <div>
                      {{ item.custom_ticket_id }}
                    </div>
                    <div>
                      <v-btn
                        icon
                        @click="OpenQuotationTicketDetailsMethod(item)"
                      >
                        <v-icon color="primary" size="17"
                          >mdi-information</v-icon
                        ></v-btn
                      >
                    </div>
                  </div>
                </span>
              </div> -->
            </div>
            <div
              class="FontSize font-weight-bold"
              v-if="item.attachments && item.attachments.length != 0"
            >
              Attachments : {{ item.attachments.length }}
              <v-icon small color="primary" @click.stop="viewAttachs(item)"
                >mdi-attachment</v-icon
              >
            </div>
            <div v-else class="FontSize font-weight-bold">Attachments : 0</div>
          </template>
          <template v-slot:[`item.quotation_display_id`]="{ item }">
            <div v-if="item.quotation_display_id">
              <span class="FontSize">{{
                item.quotation_display_id || "-"
              }}</span>
            </div>
            <div
              class="FontSize font-weight-bold"
              v-if="item.attachments && item.attachments.length != 0"
            >
              Attachments : {{ item.attachments.length }}
              <v-icon small color="primary" @click.stop="viewAttachs(item)"
                >mdi-attachment</v-icon
              >
            </div>
            <div v-else class="FontSize font-weight-bold">Attachments : 0</div>
          </template>
          <template v-slot:[`item.workflow_initiated_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.workflow_initiated_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
            <div class="FontSize">{{ item.initiator_user_name }}</div>
          </template>
          <template v-slot:[`item.modified_on`]="{ item }">
            <div class="FontSize" v-if="item.modified_on != undefined">
              {{ new Date(item.modified_on * 1000).toLocaleString("en-GB") }}
            </div>
            <div v-else>-</div>
            <div v-if="work_flow_status == 'PENDING'">
              <div
                class="FontSize green--text"
                v-if="item.pending_on_name != undefined"
              >
                Pending At : {{ item.pending_on_name }}
              </div>
              <div v-else>-</div>
            </div>
          </template>
          <template
            v-slot:[`item.workflow_items`]="{ item }"
            v-if="approval_type == 'TICKET'"
          >
            <div v-if="item.workflow_items" class="FontSize">
              {{ item.workflow_items.length }}
              <v-btn
                x-small
                class="ma-2"
                color="primary"
                @click.stop="checkItem(item, 'APPROVE_TICKET_REQUEST_COMPS')"
              >
                <v-icon small class="white--text mr-1">mdi-eye-outline</v-icon>
                View
              </v-btn>
              <v-btn
                icon
                color="primary"
                v-if="
                  item.pending_approver_type === 'SECONDARY' &&
                  work_flow_status === 'PENDING'
                "
                @click.stop="holdComponentMethod(item, 'HOLD')"
              >
                <v-icon size="19">mdi-pause-circle</v-icon>
              </v-btn>
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.workflow_items`]="{ item }" v-else>
            <div v-if="item.workflow_items" class="FontSize">
              {{ item.workflow_items.length }}
              <v-btn
                x-small
                class="ma-2"
                color="primary"
                @click.stop="checkItem(item, 'APPROVE_USER_REQUEST_COMPS')"
              >
                <v-icon small class="white--text mr-1">mdi-eye-outline</v-icon
                >View
              </v-btn>
            </div>
            <div v-else>-</div>
          </template>
          <template
            v-if="work_flow_status == 'APPROVED'"
            v-slot:[`item.Actions`]="{ item }"
          >
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  size="20"
                  v-on="on"
                  class="mr-2"
                  color="primary"
                  @click.stop="checkItem(item, 'UPDATE_APPROVED_PRODUCT_FLEET')"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span>Update Component</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.Actions2`]="{ item }">
            <div v-if="item.is_hold_record_to_be_updated === true">
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-icon
                    size="20"
                    v-on="on"
                    class="mr-2"
                    color="primary"
                    @click.stop="holdComponentMethod(item, 'UPDATE')"
                  >
                    mdi-pencil-plus
                  </v-icon>
                </template>
                <span>Update Component</span>
              </v-tooltip>
            </div>
            <div v-else>-</div>
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
import { GetAllSearchedMRF } from "@/mixins/Approvals/GetSearchMrf.js";
import { GetAllWorkFlowList } from "@/mixins/Approvals/GetAllWorkFlowList.js";
import { GetAllQuotationApprovals } from "@/mixins/Approvals/GetAllQuotationApprovals.js";
Vue.use(Croppa);
import Vue from "vue";
import Croppa from "vue-croppa";
var xlsx = require("json-as-xlsx");
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import ViewTicketDetails from "@/components/Approvals/ViewTicketDetails.vue";
import UpdateApprovedComponent from "@/components/Approvals/UpdateApprovedComponent.vue";
import ViewWorkFlowItemsDailog from "@/components/Approvals/ViewWorkFlowItemsDailog.vue";
import ViewAttachmentsDialog from "@/components/Tickets/Dialogs/ViewAttachmentsDialog.vue";
import TicketQuotationDisplay from "@/components/Approvals/TicketQuotationDetailsDialog.vue";
import HoldComponent from "@/components/Approvals/HoldComponents.vue";
export default {
  components: {
    Overlay,
    Snackbar,
    ViewTicketDetails,
    ViewAttachmentsDialog,
    ViewWorkFlowItemsDailog,
    UpdateApprovedComponent,
    TicketQuotationDisplay,
    HoldComponent,
  },
  mixins: [GetAllSearchedMRF, GetAllWorkFlowList, GetAllQuotationApprovals],
  data() {
    return {
      page: 1,
      pageCount: 1,
      TableHeight: 0,
      search: "",
      approval_type: "TICKET",
      work_flow_status: "PENDING",
      noDataText: "No Data Available..!",
      menu: false,
      menu1: false,
      overlay: false,
      renderComp: true,
      isSearching: false,
      previewAttachments: false,
      viewTicketDetailsDialog: false,
      dailogWorkflowItemsList: false,
      UpdateApprovedComponentDialog: false,
      WorkFlowList: [],
      GetAllQuotationApprovalsList: [],
      from_date: new Date(new Date().getTime() - 30 * 86400000)
        .toISOString()
        .substr(0, 10),
      to_date: new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10),
      GetAllListMRF: [],
      statusItems: [
        { text: "PENDING", value: "PENDING" },
        { text: "HOLD", value: "HOLD" },
        { text: "IN PROGRESS", value: "IN_PROGRESS" },
        { text: "APPROVED", value: "APPROVED" },
        { text: "REJECTED", value: "REJECTED" },
      ],
      approval_type_items: [
        { text: "TICKET", value: "TICKET" },
        { text: "USER", value: "REPRESENTATIVE" },
        { text: "DIRECT QUOTATION", value: "QUOTATION" },
      ],
      HeadersForTicetAprovalType: [
        {
          text: "MRF ID",
          value: "mrf_id",
        },
        {
          text: "User Name",
          value: "initiator_user_name",
        },
        {
          text: "Service Center Name",
          value: "service_center_name",
        },
        {
          text: "Requested On",
          value: "workflow_initiated_on",
        },
        {
          text: "Modified On",
          value: "modified_on",
        },
        {
          text: "Workflow Items",
          value: "workflow_items",
        },
      ],
      approvalHeaders: [
        {
          text: "MRF ID",
          value: "mrf_id",
        },
        {
          text: "Ticket ID",
          value: "custom_ticket_id",
        },
        {
          text: "Requested On",
          value: "workflow_initiated_on",
        },
        {
          text: "Modified On",
          value: "modified_on",
        },
        {
          text: "Items",
          value: "workflow_items",
        },
        {
          text: "Actions",
          value: "Actions",
        },
      ],
      StoreObj: {},
      StoreObjNew: {},
      SnackBarComponent: {},
      StoreObjTicketDetails: {},
      TicketQuotationDisplayDialog: false,
      FilteredValue: "ALL",
      FilterStatusItems: [
        {
          text: "ALL",
          value: "ALL",
        },
        {
          text: "LPO",
          value: "LPO",
        },
        {
          text: "NPC",
          value: "NPC",
        },
        {
          text: "OWN STOCK",
          value: "OWN_STOCK",
        },
        {
          text: "ITF",
          value: "ITF",
        },
      ],
      searchBy: "quotation_id",
      searchByItems: [
        { text: "Quotation ID", value: "quotation_id" },
        { text: "Customer Contact Number", value: "customer_contact_number" },
      ],
      holdComponentDialog: false,
      holdComponentObj: {},
    };
  },
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },

    FilteredValue(val) {
      if (val) {
        this.WorkFlowList = [];
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.approval_type,
          "COMPONENT_REQUEST",
          undefined,
          val
        );
      }
    },

    approval_type(val) {
      this.WorkFlowList = [];
      this.GetAllQuotationApprovalsList = [];
      this.page = 1;
      this.search = "";
      this.isSearching = false;
      if (this.approval_type != "QUOTATION") {
        this.approvalHeaders = [
          {
            text: "MRF ID",
            value: "mrf_id",
          },
          {
            text: "Ticket ID",
            value: "custom_ticket_id",
          },
          {
            text: "Requested On",
            value: "workflow_initiated_on",
          },
          {
            text: "Modified On",
            value: "modified_on",
          },
          {
            text: "Items",
            value: "workflow_items",
          },
          {
            text: "Actions",
            value: "Actions",
          },
        ];
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          val,
          "COMPONENT_REQUEST",
          undefined,
          this.FilteredValue
        );
      } else {
        this.approvalHeaders = [
          {
            text: "MRF ID",
            value: "mrf_id",
          },
          {
            text: "Quotation ID",
            value: "quotation_display_id",
          },
          {
            text: "Requested On",
            value: "workflow_initiated_on",
          },
          {
            text: "Modified On",
            value: "modified_on",
          },
          {
            text: "Items",
            value: "workflow_items",
          },
          {
            text: "Actions",
            value: "Actions",
          },
        ];
        this.GetAllQuotationApprovalsMethod(
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399,
          this.work_flow_status,
          "QUOTATION_TICKET_COMPONENT_REQUEST",
          "QUOTATION_TICKET"
        );
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != "" &&
        this.page != 1
      ) {
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.approval_type,
          "COMPONENT_REQUEST",
          this.next_token
        );
      }
    },
    work_flow_status(val) {
      this.WorkFlowList = [];
      this.search = "";
      this.isSearching = false;
      if (val === "APPROVED") {
        this.approvalHeaders = [
          {
            text: "MRF ID",
            value: "mrf_id",
          },
          {
            text: "Ticket ID",
            value: "custom_ticket_id",
          },
          {
            text: "Approved Status",
            value: "approved_from_status",
          },

          {
            text: "Requested On",
            value: "workflow_initiated_on",
          },
          {
            text: "Modified On",
            value: "modified_on",
          },
          {
            text: "Items",
            value: "workflow_items",
          },
          {
            text: "Actions",
            value: "Actions",
          },
        ];
      } else if (val === "HOLD") {
        this.approvalHeaders = [
          {
            text: "MRF ID",
            value: "mrf_id",
          },
          {
            text: "Ticket ID",
            value: "custom_ticket_id",
          },

          {
            text: "Requested On",
            value: "workflow_initiated_on",
          },
          {
            text: "Modified On",
            value: "modified_on",
          },
          {
            text: "Action To Be Taken By",
            value: "previous_approver_name",
          },
          {
            text: "Items",
            value: "workflow_items",
          },
          {
            text: "Actions",
            value: "Actions2",
          },
        ];
      } else {
        this.approvalHeaders = [
          {
            text: "MRF ID",
            value: "mrf_id",
          },
          {
            text: "Ticket ID",
            value: "custom_ticket_id",
          },
          {
            text: "Requested On",
            value: "workflow_initiated_on",
          },
          {
            text: "Modified On",
            value: "modified_on",
          },
          {
            text: "Items",
            value: "workflow_items",
          },
          {
            text: "Actions",
            value: "Actions",
          },
        ];
      }
      if (this.approval_type != "QUOTATION") {
        this.GetAllWorkFlowListMethod(
          val,
          this.approval_type,
          "COMPONENT_REQUEST",
          undefined,
          this.FilteredValue
        );
      } else {
        this.GetAllQuotationApprovalsMethod(
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399,
          val,
          "QUOTATION_TICKET_COMPONENT_REQUEST",
          "QUOTATION_TICKET"
        );
      }
      this.page = 1;
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllWorkFlowListMethod(
      this.work_flow_status,
      this.approval_type,
      "COMPONENT_REQUEST",
      undefined
    );
  },
  methods: {
    formatedApprovedStatus(item) {
      if (!Array.isArray(item)) return "";
      return item
        .filter(Boolean)
        .map((val) => val.replace(/_/g, " "))
        .join(", ");
    },
    holdComponentMethod(item, purpose) {
      this.holdComponentObj = item;
      this.holdComponentObj.purpose = purpose;
      this.holdComponentDialog = true;
    },
    searchvalue(isSearching = true) {
      if (
        this.search != "" &&
        this.search != null &&
        this.search != undefined
      ) {
        this.WorkFlowList = [];
        this.next_token = undefined;
        let fieldName;
        if (this.approval_type === "TICKET") {
          fieldName = "ticket_id";
        } else if (this.approval_type === "QUOTATION") {
          if (this.searchBy === "quotation_id") {
            fieldName = "quotation_id";
          } else {
            fieldName = "customer_contact_number";
          }
        }
        setTimeout(() => {
          this.searchMRFMethod(this.work_flow_status, this.search, fieldName);
        }, 200);
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
    DisplayTicketQuotation(item) {
      console.log("GETIT", item);
      this.TicketQuotationDisplayDialog = true;
      this.StoreObj = item;
      this.StoreObj.approval_type = this.approval_type;
    },
    clearSearch() {
      if (this.isSearching == true) {
        this.WorkFlowList = [];
      }
      this.WorkFlowList = [];
      this.GetAllWorkFlowListMethod(
        this.work_flow_status,
        this.approval_type,
        "COMPONENT_REQUEST",
        undefined
      );
    },
    viewTicketDetailsMethod(item) {
      this.StoreObj = item;
      this.viewTicketDetailsDialog = true;
    },
    viewAttachs(item) {
      this.StoreObjNew = item;
      this.previewAttachments = true;
    },
    previewAttachmentsEmit() {
      this.previewAttachments = false;
    },
    OpenQuotationTicketDetailsMethod(item) {
      this.viewTicketDetailsDialog = true;
      this.StoreObj = item;
      this.StoreObj.approval_type = "QUOTATION";
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.StoreObj.approval_type = this.approval_type;
      console.log("ACTION", this.StoreObj.action);
      if (action == "UPDATE_APPROVED_PRODUCT_FLEET") {
        this.UpdateApprovedComponentDialog = true;
      } else if (action == "APPROVE_TICKET_REQUEST_COMPS") {
        this.dailogWorkflowItemsList = true;
      } else if (action == "APPROVE_USER_REQUEST_COMPS") {
        this.dailogWorkflowItemsList = true;
      }
    },
    viewTicketDetailsDialogEmit() {
      this.viewTicketDetailsDialog = false;
    },
    UpdateApprovedComponentDialogEmit(Toggle) {
      this.UpdateApprovedComponentDialog = false;
      if (Toggle == 2) {
        this.WorkFlowList = [];
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.approval_type,
          "COMPONENT_REQUEST",
          undefined
        );
      }
    },
    dailogWorkflowItemsListEmit() {
      this.dailogWorkflowItemsList = false;
      this.WorkFlowList = [];
      if (this.approval_type != "QUOTATION") {
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          undefined,
          "COMPONENT_REQUEST",
          undefined
        );
      } else {
        this.GetAllQuotationApprovalsMethod(
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399,
          this.work_flow_status,
          "QUOTATION_TICKET_COMPONENT_REQUEST",
          "QUOTATION_TICKET"
        );
      }
    },
    TicketQuotationDisplayDialogEmit(Toggle) {
      this.TicketQuotationDisplayDialog = false;
    },

    HoldComponentDialogEmit(Toggle) {
      this.holdComponentDialog = false;
      if (Toggle == 2) {
        this.WorkFlowList = [];
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.approval_type,
          "COMPONENT_REQUEST",
          undefined
        );
      }
    },
  },
};
</script>
