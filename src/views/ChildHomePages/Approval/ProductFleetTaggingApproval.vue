<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <ViewEditedTicketDetails
      :StoreObjNew="StoreObjNew"
      :dialogViewEditedTicketDetails="dialogViewEditedTicketDetails"
      @clicked="dialogViewEditedTicketDetailsEmit"
    />
    <ViewTicketDetails
      :StoreObj="StoreObj"
      :viewTicketDetailsDialog="viewTicketDetailsDialog"
      @clicked="viewTicketDetailsDialogEmit"
    />
    <CreateUpdateProductFleet
      :StoreObj="StoreObj"
      :CreateUpdateProductFleetDialog="CreateUpdateProductFleetDialog"
      @clicked="CreateUpdateProductFleetDialogEmit"
    />
    <TagProductFleetToCustomerFromCustomers
      :StoreObj="StoreObj"
      :StoreObj1="StoreObj1"
      :TagProductToCustomerFromCustomers="TagProductToCustomerFromCustomers"
      @clicked="TagProductToCustomerFromCustomersEmit"
    />
    <ApproveToEditProductDetailsDialog
      :StoreObj="StoreObj"
      :dialogApproveToEditProductDetails="dialogApproveToEditProductDetails"
      @clicked="dialogApproveToEditProductDetailsEmit"
    />
    <RejectComponentsDialog
      :RejectComponentDialog="RejectComponentDialog"
      :StoreObj="StoreObj"
      @clicked="RejectComponentEmit"
    />
    <ViewAttachmentsDialog
      :StoreObjNew="StoreObjNew"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Product Fleet Tagging Approval</div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          :items="workflow_type_items"
          label="Request Type *"
          v-model="workflow_type"
          class="mt-7 mr-2 FontSize WidthVariation2"
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
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          @input="filterItems()"
          prepend-inner-icon="mdi-magnify"
          class="mt-7 ml-2 FontSize mediumWidth"
        ></v-text-field>
      </v-toolbar>
      <v-data-table
        :search="search"
        dense
        fixed-header
        :height="TableHeight"
        :items="WorkFlowList"
        :no-data-text="noDataText"
        :headers="
          workflow_type != 'EDIT_PRODUCT_DETAILS_REQUEST'
            ? work_flow_status == 'PENDING'
              ? approvalHeaders
              : approvalHeaders.filter((item) => item.value != 'Actions')
            : work_flow_status == 'PENDING'
            ? approvalHeadersForEditProduct
            : approvalHeadersForEditProduct.filter(
                (item) => item.value != 'Actions'
              )
        "
      >
        <template v-slot:[`item.customer_name`]="{ item }">
          <div class="FontSize">
            <span class="">Category :</span>
            <span
              v-if="item.category_name != undefined"
              class="FontSize font-weight-bold"
            >
              {{ item.category_name }}</span
            >
            <span v-else>-</span>
          </div>
          <div class="FontSize" v-if="item.service_name">
            Product :
            <span class="font-weight-bold"> {{ item.service_name }}</span>
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.service_center_name`]="{ item }">
          <div class="FontSize" v-if="item.service_center_name != undefined">
            {{ item.service_center_name }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.custom_ticket_id`]="{ item }">
          <div class="FontSize" v-if="item.customer_name">
            Contact Person :
            <span class="FontSize font-weight-bold">{{
              item.customer_name
            }}</span>
          </div>
          <div v-else>-</div>
          <div>
            <span class="FontSize">Id :</span>
            <span
              class="FontSize font-weight-bold"
              v-if="item.custom_ticket_id != undefined"
            >
              {{ item.custom_ticket_id }}
            </span>
            <span class="FontSize" v-else>{{ item.module_id }}</span>
            <v-icon small @click="viewTicketDetailsMethod(item)" color="primary"
              >mdi-information</v-icon
            >
          </div>
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
        <template v-slot:[`item.product_attachment_file`]="{ item }">
          <div
            class="FontSize"
            v-if="item.product_attachment_file != undefined"
          >
            {{ item.product_attachment_file.length }}
            <span
              ><v-icon color="primary" small @click="previewAttachs(item)"
                >mdi-eye</v-icon
              ></span
            >
          </div>
          <div v-else class="FontSize">NA</div>
        </template>
        <template v-slot:[`item.setting_name`]="{ item }">
          <div class="FontSize" v-if="item.setting_name != undefined">
            {{ item.setting_name }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.new_product_details`]="{ item }">
          <div class="FontSize" v-if="item.new_product_details">
            <v-icon
              small
              color="primary"
              @click="
                viewEditedTicketDetail(
                  item,
                  'REQUESTED_TO_EDIT_PRODUCT_DETAILS'
                )
              "
              >mdi-information</v-icon
            >
          </div>
        </template>
        <template
          v-slot:[`item.Actions`]="{ item }"
          v-if="approval_type == 'TICKET'"
        >
          <div class="FontSize">
            <v-btn
              small
              icon
              color="green"
              @click="
                tagProductMethod(
                  item,
                  workflow_type == 'PRODUCT_TAGGING_REQUEST'
                    ? 'PRODUCT_TAGGING'
                    : 'ADD_PRODUCT_TO_DB'
                )
              "
              ><v-icon small>mdi-check-outline</v-icon></v-btn
            >
            <v-btn
              depressed
              small
              icon
              color="red"
              class="ml-2"
              @click="
                RejectComponentMethod(
                  item,
                  workflow_type == 'PRODUCT_TAGGING_REQUEST'
                    ? 'PRODUCT_TAGGING'
                    : workflow_type == 'ADDING_PRODUCT_TO_DB_REQUEST'
                    ? 'REJECT_PRODUCT_TO_DB'
                    : 'REJECT_PRODUCT_FLEET_UPDATE'
                )
              "
              ><v-icon small>mdi-close-outline</v-icon></v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { CheckUserForWorkflowApproval } from "@/graphql/queries.js";
import { GetAllWorkFlowList } from "@/mixins/Approvals/GetAllWorkFlowList.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewTicketDetails from "@/components/Approvals/ViewTicketDetails.vue";
import RejectComponentsDialog from "@/components/Approvals/RejectComponent.vue";
import ViewAttachmentsDialog from "@/components/Tickets/Dialogs/ViewAttachmentsDialog.vue";
import ViewEditedTicketDetails from "@/components/Tickets/Dialogs/ViewEditedTicketDetails.vue";
import CreateUpdateProductFleet from "@/components/Product/Dialogs/CreateUpdateProductFleet.vue";
import ApproveToEditProductDetailsDialog from "@/components/Product/Dialogs/ApproveToEditProductDetailsDialog.vue";
import TagProductFleetToCustomerFromCustomers from "@/components/Customers/Dialogs/TagProductFleetToCustomerFromCustomers.vue";
export default {
  components: {
    Overlay,
    Snackbar,
    ViewTicketDetails,
    ViewAttachmentsDialog,
    ViewEditedTicketDetails,
    RejectComponentsDialog,
    CreateUpdateProductFleet,
    ApproveToEditProductDetailsDialog,
    TagProductFleetToCustomerFromCustomers,
  },
  mixins: [GetAllWorkFlowList],
  data: () => ({
    search: "",
    noDataText: "No Data Available..!",
    TableHeight: 0,
    overlay: false,
    renderComp: true,
    previewAttachments: false,
    RejectComponentDialog: false,
    viewTicketDetailsDialog: false,
    dialogViewEditedTicketDetails: false,
    CreateUpdateProductFleetDialog: false,
    TagProductToCustomerFromCustomers: false,
    dialogApproveToEditProductDetails: false,
    StoreObj: {},
    StoreObj1: {},
    StoreObjNew: {},
    SnackBarComponent: {},
    WorkFlowList: [],
    approval_type: "TICKET",
    work_flow_status: "PENDING",
    workflow_type: "PRODUCT_TAGGING_REQUEST",
    workflow_type_items: [
      {
        text: "Product Fleet Tagging Request",
        value: "PRODUCT_TAGGING_REQUEST",
      },
      {
        text: "Add Product Fleet to Database Request",
        value: "ADDING_PRODUCT_TO_DB_REQUEST",
      },
      {
        text: "Edit Product Fleet Request",
        value: "EDIT_PRODUCT_DETAILS_REQUEST",
      },
    ],
    statusItems: [
      { text: "PENDING", value: "PENDING" },
      { text: "APPROVED", value: "APPROVED" },
      { text: "REJECTED", value: "REJECTED" },
    ],
    HeadersForTicetAprovalType: [
      {
        text: "Product",
        value: "customer_name",
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
    approvalHeadersForEditProduct: [
      {
        text: "Product",
        value: "customer_name",
      },
      {
        text: "Ticket ID",
        value: "custom_ticket_id",
      },
      {
        text: "Serial No",
        value: "setting_name",
      },
      {
        text: "Update Details",
        value: "new_product_details",
      },
      {
        text: "Requested On",
        value: "workflow_initiated_on",
      },
      {
        text: "Attachs",
        value: "product_attachment_file",
      },
      {
        text: "Actions",
        value: "Actions",
      },
    ],
    approvalHeaders: [
      {
        text: "Product",
        value: "customer_name",
      },
      {
        text: "Ticket ID",
        value: "custom_ticket_id",
      },
      {
        text: "Serial No",
        value: "setting_name",
      },
      {
        text: "Requested On",
        value: "workflow_initiated_on",
      },
      {
        text: "Attachs",
        value: "product_attachment_file",
      },
      {
        text: "Actions",
        value: "Actions",
      },
    ],
  }),
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllWorkFlowListMethod(
      this.work_flow_status,
      this.workflow_type == "PRODUCT_TAGGING_REQUEST"
        ? "PRODUCT_TAGGING"
        : this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST"
        ? "ADDING_PRODUCT_TO_DB"
        : "EDIT_PRODUCT_DETAILS",
      this.workflow_type,
      undefined
    );
  },
  watch: {
    work_flow_status(val) {
      this.search = "";
      this.WorkFlowList = [];
      this.filteredItems = [];
      this.GetAllWorkFlowListMethod(
        val,
        this.workflow_type == "PRODUCT_TAGGING_REQUEST"
          ? "PRODUCT_TAGGING"
          : this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST"
          ? "ADDING_PRODUCT_TO_DB"
          : "EDIT_PRODUCT_DETAILS",
        this.workflow_type,
        undefined
      );
    },
    workflow_type(val) {
      this.search = "";
      this.WorkFlowList = [];
      this.filteredItems = [];
      this.GetAllWorkFlowListMethod(
        this.work_flow_status,
        this.workflow_type == "PRODUCT_TAGGING_REQUEST"
          ? "PRODUCT_TAGGING"
          : this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST"
          ? "ADDING_PRODUCT_TO_DB"
          : "EDIT_PRODUCT_DETAILS",
        val,
        undefined
      );
    },
  },
  methods: {
    viewEditedTicketDetail(item, action) {
      this.StoreObjNew = item;
      this.StoreObjNew.action = action;
      this.dialogViewEditedTicketDetails = true;
    },
    dialogViewEditedTicketDetailsEmit() {
      this.dialogViewEditedTicketDetails = false;
    },
    filterItems() {
      const searchLower = this.search.toLowerCase();
      this.filteredItems = this.WorkFlowList.filter((item) => {
        const itemString = JSON.stringify(item).toLowerCase();
        return itemString.includes(searchLower);
      });
    },
    previewAttachs(item) {
      this.StoreObjNew = item;
      this.previewAttachments = true;
    },
    previewAttachmentsEmit() {
      this.previewAttachments = false;
    },
    viewTicketDetailsMethod(item) {
      this.StoreObj = item;
      this.viewTicketDetailsDialog = true;
    },
    tagProductMethod(item, action) {
      if (action == "PRODUCT_TAGGING") {
        this.StoreObj1 = item;
        this.StoreObj = item;
        this.StoreObj.action = action;
        this.TagProductToCustomerFromCustomers = true;
      } else {
        this.checkValidUserMethod(item, action);
      }
    },
    async checkValidUserMethod(item, action) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(CheckUserForWorkflowApproval, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              workflow_id: item.workflow_id,
              workflow_type: this.workflow_type,
            },
          })
        );
        this.is_valid_user = JSON.parse(
          result.data.CheckUserForWorkflowApproval
        );
        if (this.is_valid_user.status == "SUCCESS") {
          if (this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST") {
            this.overlay = false;
            this.StoreObj = item;
            this.StoreObj.action = action;
            this.CreateUpdateProductFleetDialog = true;
          } else if (this.workflow_type == "EDIT_PRODUCT_DETAILS_REQUEST") {
            this.overlay = false;
            this.StoreObj = item;
            this.dialogApproveToEditProductDetails = true;
          }
        }
      } catch (error) {
        this.overlay = false;
        this.is_valid_user = [];
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
      }
    },
    viewTicketDetailsDialogEmit() {
      this.viewTicketDetailsDialog = false;
    },
    dialogApproveToEditProductDetailsEmit(Toggle) {
      this.dialogApproveToEditProductDetails = false;
      if (Toggle == 2) {
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.workflow_type == "PRODUCT_TAGGING_REQUEST"
            ? "PRODUCT_TAGGING"
            : this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST"
            ? "ADDING_PRODUCT_TO_DB"
            : "EDIT_PRODUCT_DETAILS",
          this.workflow_type,
          undefined
        );
      }
    },
    TagProductToCustomerFromCustomersEmit(Toggle) {
      this.TagProductToCustomerFromCustomers = false;
      if (Toggle == 2) {
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.workflow_type == "PRODUCT_TAGGING_REQUEST"
            ? "PRODUCT_TAGGING"
            : this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST"
            ? "ADDING_PRODUCT_TO_DB"
            : "EDIT_PRODUCT_DETAILS",
          this.workflow_type,
          undefined
        );
      }
    },
    RejectComponentMethod(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.RejectComponentDialog = true;
    },
    RejectComponentEmit(Toggle) {
      this.RejectComponentDialog = false;
      if (Toggle == 2) {
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.workflow_type == "PRODUCT_TAGGING_REQUEST"
            ? "PRODUCT_TAGGING"
            : this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST"
            ? "ADDING_PRODUCT_TO_DB"
            : "EDIT_PRODUCT_DETAILS",
          this.workflow_type,
          undefined
        );
      }
    },
    CreateUpdateProductFleetDialogEmit(Toggle) {
      this.CreateUpdateProductFleetDialog = false;
      if (Toggle == 2) {
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          this.workflow_type == "PRODUCT_TAGGING_REQUEST"
            ? "PRODUCT_TAGGING"
            : this.workflow_type == "ADDING_PRODUCT_TO_DB_REQUEST"
            ? "ADDING_PRODUCT_TO_DB"
            : "EDIT_PRODUCT_DETAILS",
          this.workflow_type,
          undefined
        );
      }
    },
  },
};
</script>
