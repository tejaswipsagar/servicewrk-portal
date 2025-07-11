<template>
  <div>
    <ViewAttachmentsDialog
      :StoreObjNew="StoreObjNew"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <ViewTicketDetails
      :StoreObj="StoreObj"
      :viewTicketDetailsDialog="viewTicketDetailsDialog"
      @clicked="viewTicketDetailsDialogEmit"
    />
    <ViewStoreDetails
      :StoreObj="StoreObj"
      :work_flow_status="work_flow_status"
      :StoreObjOfCompDetails="StoreObjOfCompDetails"
      :DialogStoreDetails="DialogStoreDetails"
      @clicked="DialogStoreDetailsEmit"
    />
    <VendorDetails
      :ActionOObj="ActionOObj"
      :work_flow_status="work_flow_status"
      :DialogVendorDetails="DialogVendorDetails"
      :StoreObjOfCompDetails="StoreObjOfCompDetails"
      @clicked="DialogVendorDetailsEmit"
    />
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="98%" :value="dailogWorkflowItemsList">
      <v-toolbar color="primary" dense dark>
        <div>
          <div class="ml-2 white--text">
            Components
            <span class="xsmallFontSize" v-if="this.StoreObj.mrf_id">
              MRF ID : ({{ this.StoreObj.mrf_id }})</span
            >
            <span
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id != undefined"
              >Ticket ID: ({{ this.StoreObj.custom_ticket_id }})</span
            >
            <span class="xsmallFontSize" v-else>
              Ticket ID :({{ this.StoreObj.module_id }})</span
            >
            <span>
              <v-icon
                class="ml-1"
                small
                @click="viewTicketDetailsMethod('IN_SIDE')"
                color="white"
                >mdi-information</v-icon
              >
            </span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dailogWorkflowItemsListEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-row
            no-gutters
            v-if="StoreObj.other_details"
            class="font-weight-bold FontSize black--text mb-2 pb-2"
          >
            <v-col cols="12" md="2" xs="12" sm="12">
              <div>
                Dispatch To :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to_type"
                  >{{ StoreObj.other_details.dispatch_to_type }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <div>
                Name :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to"
                  >{{ StoreObj.other_details.dispatch_to }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <div>
                Phone :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to_contact_number"
                  >{{ StoreObj.other_details.dispatch_to_contact_number }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12">
              <div>
                Address :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to_address"
                  >{{ StoreObj.other_details.dispatch_to_address }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.store_name"
            >
              <div>
                Store Name :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.store_name
                }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.city"
            >
              <div>
                City :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.city
                }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.state"
            >
              <div>
                State :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.state
                }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.pincode"
            >
              <div>
                Pincode :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.pincode
                }}</span>
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.quotation_display_id"
            >
              <div class="font-weight-bold black--text FontSize">
                Quotation ID : {{ StoreObj.quotation_display_id }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.payment_done_comments"
            >
              <div class="font-weight-bold black--text FontSize">
                Comments: {{ StoreObj.payment_done_comments }}
              </div>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <div class="font-weight-bold black--text FontSize">Remarks :</div>
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12">
              <div class="FontSize black--text" v-if="StoreObj.remark">
                {{ StoreObj.remark }}
              </div>
              <div class="FontSize black--text" v-else>N/A</div>
            </v-col>
          </v-row>
          <div style="border: solid 1px black" class="pt-2 mb-2">
            <v-form ref="form">
              <v-data-table
                dense
                outlined
                :show-select="work_flow_status == 'PENDING' ? true : false"
                :headers="
                  work_flow_status != 'PENDING'
                    ? headers
                    : headers.filter((item) => item.value != 'approved_count')
                "
                v-model="selected"
                item-key="unique_object_id"
                :items="StoreObj.workflow_items"
              >
                <template v-slot:[`item.component_name`]="{ item }">
                  <div class="FontSize font-weight-bold">
                    <span class="font-weight-regular">{{
                      item.component_name
                    }}</span>
                  </div>
                  <div
                    v-if="item.component_code != undefined"
                    class="font-weight-bold FontSize"
                  >
                    Code :<span class="font-weight-regular">{{
                      item.component_code
                    }}</span>
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-slot:[`item.component_description`]="{ item }">
                  <div
                    v-if="item.component_description != undefined"
                    class="font-weight-bold FontSize"
                  >
                    <span class="font-weight-regular">{{
                      item.component_description
                    }}</span>
                  </div>
                  <div v-else>-</div>
                  <div class="FontSize primary--text font-weight-bold">
                    Requested :
                    <span
                      v-if="
                        StoreObj.approval_type != 'QUOTATION' &&
                        item.requested_component_quantity != undefined
                      "
                    >
                      {{ item.requested_component_quantity }}
                    </span>
                    <span
                      v-else-if="
                        StoreObj.approval_type == 'QUOTATION' &&
                        item.quantity != undefined
                      "
                      >{{ item.quantity }}</span
                    >
                    <span v-else>0</span>
                  </div>
                </template>
                <template v-slot:[`item.requested_from`]="{ item }">
                  <div class="FontSize">
                    {{ item.requested_from || "-" }}
                  </div>
                </template>
                <template v-slot:[`item.own_stock`]="{ item }">
                  <v-text-field
                    dense
                    outlined
                    :disabled="!item.availableCompCountAtRep"
                    type="number"
                    class="FontSize mr-1 mt-2"
                    label="Quantity"
                    :readonly="work_flow_status != 'PENDING' ? true : false"
                    v-model="item.own_stock_approve_count"
                    @input="checkQty(item)"
                  >
                  </v-text-field>
                  <div
                    class="FontSize mt-n6"
                    v-if="work_flow_status == 'PENDING'"
                  >
                    <span
                      v-if="item.availableCompCountAtRep == 0"
                      class="red--text"
                    >
                      Avail : {{ item.availableCompCountAtRep }}</span
                    >
                    <span v-else>
                      Avail : {{ item.availableCompCountAtRep }}</span
                    >
                  </div>
                </template>
                <template v-slot:[`item.local_purchase`]="{ item, index }">
                  <v-btn
                    small
                    class="primary white--text"
                    @click="openVendorDetails(item, index)"
                  >
                    Vendor
                  </v-btn>
                  <div class="FontSize">
                    Qty :
                    <span
                      v-if="
                        item.local_purchase_approve_count != undefined &&
                        item.local_purchase_approve_count != ''
                      "
                      >{{ item.local_purchase_approve_count }}</span
                    >
                    <span v-else>0</span>
                  </div>
                </template>
                <template v-slot:[`item.store`]="{ item }">
                  <div>
                    <v-btn
                      small
                      class="primary white--text ml-1"
                      @click.stop="openStoreDetails(item)"
                      >Store</v-btn
                    >
                    <div class="FontSize">
                      Qty :
                      <span
                        v-if="
                          item.store_approve_count != undefined &&
                          item.store_approve_count != ''
                        "
                        >{{ item.store_approve_count }}</span
                      >
                      <span v-else>0</span>
                    </div>
                  </div>
                </template>
                <template v-slot:[`item.approved_count`]="{ item }">
                  <div v-if="item.approved_count != undefined">
                    {{ item.approved_count }}
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-slot:[`item.component_price`]="{ item }">
                  <v-text-field
                    dense
                    outlined
                    label="Price"
                    class="mt-2 mb-n4 FontSize"
                    v-model="item.component_price"
                  >
                  </v-text-field>
                </template>
                <template v-slot:[`item.free_of_cost`]="{ item }">
                  <v-checkbox label="FOC" v-model="item.free_of_cost">
                  </v-checkbox>
                </template>
                <template v-slot:[`item.comments`]="{ item }">
                  <div>
                    <v-textarea
                      dense
                      outlined
                      label="Comments"
                      class="FontSize mt-4"
                      v-model="item.comments"
                      :readonly="work_flow_status != 'PENDING' ? true : false"
                      auto-grow
                      rows="1"
                    ></v-textarea>
                  </div>
                </template>
                <template v-slot:[`item.attachment_file`]="{ item }">
                  <v-file-input
                    dense
                    counter
                    outlined
                    multiple
                    show-size
                    prepend-icon=""
                    class="FontSize"
                    label="File Upload"
                    v-model="item.file_input"
                    @change="SelectedFileMethod(item)"
                    v-if="work_flow_status == 'PENDING'"
                  ></v-file-input>
                  <div v-if="item.attachment_file">
                    {{ item.attachment_file.length }}
                    <v-icon small color="green" @click="viewAttachs(item)"
                      >mdi-attachment</v-icon
                    >
                  </div>
                  <div v-else>
                    <span v-show="work_flow_status != 'PENDING'">N/A</span>
                  </div>
                </template>
              </v-data-table>
            </v-form>
          </div>
          <div
            style="border: solid 1px"
            class="pa-4 mt-4"
            v-if="StoreObj.tracking_details != undefined"
          >
            <div
              class="font-weight-bold"
              v-if="StoreObj.tracking_details != undefined"
            >
              Tracking Details
            </div>
            <v-data-table
              v-if="StoreObj.tracking_details != undefined"
              outlined
              dense
              :headers="trackingHeaders"
              :items="StoreObj.tracking_details"
              hide-default-footer
            >
              <template v-slot:[`item.courier_name`]="{ item }">
                <div class="FontSize" v-if="item.courier_name != undefined">
                  {{ item.courier_name }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.tracking_id`]="{ item }">
                <div class="FontSize" v-if="item.tracking_id != undefined">
                  {{ item.tracking_id }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.phone_number`]="{ item }">
                <div class="FontSize" v-if="item.phone_number != undefined">
                  {{ item.phone_number }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.date`]="{ item }">
                <div class="FontSize" v-if="item.date != undefined">
                  {{ item.date }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.part_name`]="{ item }">
                <div class="FontSize" v-if="item.part_name != undefined">
                  {{ item.part_name }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.attachments`]="{ item }">
                <div class="FontSize" v-if="item.attachments != undefined">
                  {{ item.attachments.length }}
                  <v-tooltip color="primary" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="viewAttachs(item)"
                        small
                        color="primary"
                        v-on="on"
                        v-bind="attrs"
                        >mdi-attachment
                      </v-icon>
                    </template>
                    <span>View Added Files</span>
                  </v-tooltip>
                </div>
                <div v-else>0</div>
              </template>
            </v-data-table>
          </div>
          <div
            style="border: solid 1px"
            class="pa-4 mt-4"
            v-if="StoreObj.LOP_deatails"
          >
            <div class="font-weight-bold" v-if="StoreObj.LOP_deatails">
              Local Purchase Details
            </div>
            <v-data-table
              v-if="StoreObj.LOP_deatails != undefined"
              dense
              outlined
              hide-default-footer
              :headers="LOP_deatails_headers"
              :items="StoreObj.LOP_deatails"
            >
              <template v-slot:[`item.purchase_number`]="{ item }">
                <div class="FontSize" v-if="item.purchase_number">
                  {{ item.purchase_number }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.purchase_date`]="{ item }">
                <div class="FontSize" v-if="item.purchase_date">
                  {{ item.purchase_date }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.purchase_by`]="{ item }">
                <div class="FontSize" v-if="item.purchase_by">
                  {{ item.purchase_by }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.comments`]="{ item }">
                <div class="FontSize" v-if="item.comments">
                  {{ item.comments }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.attachments`]="{ item }">
                <div class="FontSize" v-if="item.attachments != undefined">
                  {{ item.attachments.length }}
                  <v-tooltip color="primary" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="viewAttachs(item)"
                        small
                        color="primary"
                        v-on="on"
                        v-bind="attrs"
                        >mdi-attachment
                      </v-icon>
                    </template>
                    <span>View Added Files</span>
                  </v-tooltip>
                </div>
                <div v-else>0</div>
              </template>
            </v-data-table>
          </div>
          <div
            style="border: solid 1px"
            class="pa-4 mt-4"
            v-if="StoreObj.ITF_details != undefined"
          >
            <div
              class="font-weight-bold"
              v-if="StoreObj.ITF_details != undefined"
            >
              Indent To Factory Details
            </div>
            <v-data-table
              v-if="StoreObj.ITF_details != undefined"
              dense
              outlined
              hide-default-footer
              :headers="ITF_details_headers"
              :items="StoreObj.ITF_details"
            >
              <template v-slot:[`item.DOA`]="{ item }">
                <div class="FontSize" v-if="item.DOA">
                  {{ item.DOA }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.comments`]="{ item }">
                <div class="FontSize" v-if="item.comments">
                  {{ item.comments }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.attachments`]="{ item }">
                <div class="FontSize" v-if="item.attachments != undefined">
                  {{ item.attachments.length }}
                  <v-tooltip color="primary" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="viewAttachs(item)"
                        small
                        color="primary"
                        v-on="on"
                        v-bind="attrs"
                        >mdi-attachment
                      </v-icon>
                    </template>
                    <span>View Added Files</span>
                  </v-tooltip>
                </div>
                <div v-else>0</div>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
        <v-card-actions class="mb-5 mr-4">
          <v-spacer />
          <v-btn
            color="red"
            v-if="work_flow_status == 'PENDING'"
            :loading="loadingRejectBtn"
            small
            class="white--text"
            @click="validateMethod('REJECT')"
            ><v-icon small>mdi-close</v-icon>
            Reject
          </v-btn>
          <v-btn
            color="green"
            v-if="work_flow_status == 'PENDING'"
            :loading="loadingApproveBtn"
            small
            class="white--text"
            @click="validateMethod('APPROVE')"
            ><v-icon small>mdi-check</v-icon>
            Approve
          </v-btn>
          <!-- <v-btn color="green" small class="white--text" @click="Clickvalue()"
            ><v-icon small>mdi-check</v-icon>
            Check
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import VendorDetails from "@/components/Approvals/VendorDetails.vue";
import ViewStoreDetails from "@/components/Approvals/ViewStoreDetails.vue";
import ViewTicketDetails from "@/components/Approvals/ViewTicketDetails.vue";
import ViewAttachmentsDialog from "@/components/Tickets/Dialogs/ViewAttachmentsDialog.vue";
import { API, graphqlOperation } from "aws-amplify";
import {
  TestingApprovalComponent,
  AproveOrRejectQuotationComponentRequest,
} from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetStoreNamesAndCompCount } from "@/mixins/Approvals/CompCountAtRepAndStore.js";
export default {
  props: {
    StoreObj: Object,
    work_flow_status: String,
    dailogWorkflowItemsList: Boolean,
  },
  components: {
    Overlay,
    Snackbar,
    VendorDetails,
    ViewStoreDetails,
    ViewTicketDetails,
    ViewAttachmentsDialog,
  },
  mixins: [GenerateS3URL, GetStoreNamesAndCompCount],
  data: () => ({
    totalApprovingCount: 0,
    overlay: false,
    renderComp: true,
    loadingRejectBtn: false,
    loadingApproveBtn: false,
    isEligibleToApprove: true,
    previewAttachments: false,
    DialogStoreDetails: false,
    DialogVendorDetails: false,
    viewTicketDetailsDialog: false,
    own_stock_approve_count: "",
    stock_item: "SERVICE_CENTER",
    approved_component_quantity: 0,
    requested_component_quantity: "",
    local_purchase_approve_count: "",
    StoreObjNew: {},
    ActionOObj: {},
    SnackBarComponent: {},
    StoreObjOfCompDetails: {},
    selected: [],
    territory_ids: [],
    vendor_details: [],
    GetStoreNamesAndCompCountList: [],
    stock_items: [
      { text: "Store", value: "SERVICE_CENTER" },
      { text: "Local Purchase", value: "LOCAL_PURCHASE" },
    ],
    trackingHeaders: [
      { text: "Courier", value: "courier_name" },
      { text: "Docket ID", value: "tracking_id" },
      { text: "Phone", value: "phone_number" },
      { text: "Date", value: "date" },
      { text: "Additional Part", value: "part_name" },
      { text: "Attachs", value: "attachments" },
    ],
    ITF_details_headers: [
      { text: "Date Of Arraival", value: "DOA" },
      { text: "Comments", value: "comments" },
      { text: "Attachs", value: "attachments" },
    ],
    LOP_deatails_headers: [
      { text: "Purchased Number", value: "purchase_number" },
      { text: "Purchased Date", value: "purchase_date" },
      { text: "Purchased By", value: "purchased_by" },
      { text: "Comments", value: "comments" },
      { text: "Attachs", value: "attachments" },
    ],
    headers: [
      { text: "Component", value: "component_name", sortable: false },
      {
        text: "Description",
        value: "component_description",
        sortable: false,
      },
      {
        text: "Requested From",
        value: "requested_from",
        sortable: false,
      },
      { text: "Rep Stock", value: "own_stock", sortable: false },
      { text: "Local Purchase", value: "local_purchase", sortable: false },
      { text: "Store", value: "store" },
      { text: "Approved Count", value: "approved_count", sortable: false },
      { text: "Price", value: "component_price", sortable: false },
      { text: "Free of Cost", value: "free_of_cost", sortable: false },
      { text: "Comments", value: "comments", sortable: false },
      { text: "Attchs", value: "attachment_file", sortable: false },
    ],
  }),
  watch: {
    dailogWorkflowItemsList(val) {
      if (val == true) {
        console.log("STOREOBJ_WORKFLOW", this.StoreObj);
        this.callAPIforDisplayCount();
      }
    },
  },
  mounted() {},
  methods: {
    SelectedFileMethod(item) {
      this.UploadToS3Method(item);
    },
    async UploadToS3Method(attachment) {
      let LocalArray = [];
      if (attachment.attachment_file) {
        for (let i = 0; i < attachment.attachment_file.length; i++) {
          LocalArray.push(attachment.attachment_file[i]);
        }
      }
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
        this.selected.map((item) => {
          let Object = item;
          if (item.unique_object_id === attachment.unique_object_id) {
            Object.attachment_file = LocalArray;
          }
          this.$forceUpdate();
        });
      }
    },
    viewTicketDetailsMethod(item) {
      this.viewTicketDetailsDialog = true;
    },
    viewTicketDetailsDialogEmit() {
      this.viewTicketDetailsDialog = false;
    },
    async callAPIforDisplayCount() {
      if (
        this.StoreObj.workflow_items != [] &&
        this.StoreObj.workflow_items.length != 0
      ) {
        for (let i = 0; i < this.StoreObj.workflow_items.length; i++) {
          this.StoreObj.workflow_items[i].availableCompCountAtRep =
            await this.GetStoreNamesAndCompCountMethod(
              this.StoreObj.workflow_items[i].component_id,
              this.StoreObj.initiator_user_id
            );
        }
        this.$forceUpdate();
      }
    },
    checkAvailQty(item) {
      this.GetStoreNamesAndCompCountMethod(
        item.component_id,
        this.StoreObj.initiator_user_id
      );
      setTimeout(() => {
        if (
          this.GetStoreNamesAndCompCountList != undefined &&
          this.GetStoreNamesAndCompCountList.length != 0
        ) {
          this.StoreObj.workflow_details =
            this.GetStoreNamesAndCompCountList[0].components_in_stock;
        }
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }, 500);
    },
    openStoreDetails(item) {
      this.StoreObjOfCompDetails = item;
      this.DialogStoreDetails = true;
    },
    openVendorDetails(item, index) {
      this.StoreObjOfCompDetails = item;
      this.ActionOObj = this.StoreObj;
      this.StoreObjOfCompDetails.index = index;
      this.DialogVendorDetails = true;
    },
    DialogVendorDetailsEmit(Toggle, StoreObjOfCompDetails) {
      this.DialogVendorDetails = false;
      if (Toggle == 2) {
        if (StoreObjOfCompDetails) {
          if (
            StoreObjOfCompDetails.vendor_details != undefined &&
            StoreObjOfCompDetails.vendor_details != null &&
            StoreObjOfCompDetails.vendor_details.length != 0
          ) {
            StoreObjOfCompDetails.local_purchase_approve_count =
              StoreObjOfCompDetails.vendor_details[0].purchased_count;
            StoreObjOfCompDetails.vendor_details =
              StoreObjOfCompDetails.vendor_details;
          }
        } else {
          return 0;
        }
      }
    },
    DialogStoreDetailsEmit(Toggle, StoreObjOfCompDetails) {
      this.DialogStoreDetails = false;
      if (Toggle == 2) {
        if (
          StoreObjOfCompDetails.approve_service_center_details != undefined &&
          StoreObjOfCompDetails.approve_service_center_details.length != 0
        ) {
          let approveQtyFromStore = 0;
          for (
            let i = 0;
            i < StoreObjOfCompDetails.approve_service_center_details.length;
            i++
          ) {
            approveQtyFromStore +=
              StoreObjOfCompDetails.approve_service_center_details[i]
                .approved_component_quantity;
          }
          StoreObjOfCompDetails.store_approve_count = approveQtyFromStore;
        } else {
          StoreObjOfCompDetails.store_approve_count = 0;
        }
      }
    },
    viewAttachs(item) {
      this.StoreObjNew = item;
      this.previewAttachments = true;
    },
    previewAttachmentsEmit() {
      this.previewAttachments = false;
    },
    checkQty(item) {
      if (
        item.own_stock_approve_count != null &&
        item.own_stock_approve_count != undefined &&
        item.own_stock_approve_count != "" &&
        item.availableCompCountAtRep != null &&
        item.availableCompCountAtRep != undefined &&
        item.availableCompCountAtRep != ""
      ) {
        if (item.own_stock_approve_count > item.availableCompCountAtRep) {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Representative do not have this much Quantity..!",
            };
            this.renderComp = true;
          });
        }
      }
    },
    IsRulesRequired(item) {
      return this.selected.includes(item) ? [(v) => !!v || "Required"] : [];
    },
    dailogWorkflowItemsListEmit(Toggle) {
      // this.$refs.form.reset();
      this.selected = [];
      this.$emit("clicked", Toggle);
    },
    validateMethod(act) {
      if (act == "APPROVE") {
        if (this.selected.length != 0) {
          if (this.$refs.form.validate()) {
            this.approveOrRejectItem("APPROVE");
          } else if (!this.$refs.form.validate()) {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill all the required details",
              };
              this.renderComp = true;
            });
          }
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Select Atleast One Component",
            };
            this.renderComp = true;
          });
        }
      } else if (act == "REJECT") {
        if (this.selected.length != 0) {
          this.approveOrRejectItem("REJECT");
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Select Atleast One Component",
            };
            this.renderComp = true;
          });
        }
      }
    },
    async approveOrRejectItem(act) {
      for (let i = 0; i < this.selected.length; i++) {
        this.isEligibleToApprove = true;
        let requestedQty =
          this.StoreObj.approval_type == "QUOTATION"
            ? this.selected[i].requested_component_quantity
            : this.selected[i].quantity;
        let ownStockQty =
          this.selected[i].own_stock_approve_count != undefined &&
          this.selected[i].own_stock_approve_count != ""
            ? parseInt(this.selected[i].own_stock_approve_count)
            : 0;
        let localPurchaseQty =
          this.selected[i].local_purchase_approve_count != undefined &&
          this.selected[i].local_purchase_approve_count != ""
            ? parseInt(this.selected[i].local_purchase_approve_count)
            : 0;
        let storeQty =
          this.selected[i].store_approve_count != undefined &&
          this.selected[i].store_approve_count != ""
            ? this.selected[i].store_approve_count
            : 0;
        this.totalApprovingCount = localPurchaseQty + storeQty + ownStockQty;
        if (this.totalApprovingCount > requestedQty) {
          this.isEligibleToApprove = false;
        }
      }
      if (this.isEligibleToApprove == true) {
        if (this.totalApprovingCount != 0 || act == "REJECT") {
          var mutationname =
            this.StoreObj.approval_type != "QUOTATION"
              ? TestingApprovalComponent
              : AproveOrRejectQuotationComponentRequest;
          var mutationresult =
            this.StoreObj.approval_type != "QUOTATION"
              ? "TestingApprovalComponent"
              : "AproveOrRejectQuotationComponentRequest";
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            user_id:
              this.StoreObj.approval_type != "QUOTATION"
                ? this.$store.getters.get_current_user_details.user_id
                : undefined,
            quotation_id:
              this.StoreObj.quotation_id != undefined
                ? this.StoreObj.quotation_id
                : undefined,
            updater_user_id:
              this.StoreObj.approval_type == "QUOTATION"
                ? this.$store.getters.get_current_user_details.user_id
                : undefined,
            workflow_id: this.StoreObj.workflow_id,
            other_details:
              this.StoreObj.other_details != undefined
                ? this.StoreObj.other_details
                : undefined,
            commonWorkFlowIds:
              this.StoreObj.commonWorkFlowIds != undefined &&
              this.StoreObj.approval_type != "QUOTATION"
                ? this.StoreObj.commonWorkFlowIds
                : undefined,
            initiator_user_id:
              this.StoreObj.approval_type != "QUOTATION"
                ? this.StoreObj.initiator_user_id
                : undefined,
            action: act == "APPROVE" ? "APPROVE" : "REJECT",

            workflow_items: this.selected.map((val) => {
              if (
                val.local_purchase_approve_count != undefined &&
                val.local_purchase_approve_count != null &&
                val.local_purchase_approve_count != 0
              ) {
                let vendor_details = [];
                let obj = {
                  component_name: ["", null, undefined, "N/A"].includes(
                    val.vendor_details[0].vendor_component_name
                  )
                    ? undefined
                    : val.vendor_details[0].vendor_component_name,

                  vendor_component_code: ["", null, undefined, "N/A"].includes(
                    val.vendor_details[0].vendor_component_code
                  )
                    ? undefined
                    : val.vendor_details[0].vendor_component_code,

                  vendor_component_serial_number: [
                    "",
                    null,
                    undefined,
                    "N/A",
                  ].includes(
                    val.vendor_details[0].vendor_component_serial_number
                  )
                    ? undefined
                    : val.vendor_details[0].vendor_component_serial_number,
                  purchased_count:
                    val.local_purchase_approve_count || undefined,
                  vendor_contact_number: val.vendor_contact_number || undefined,
                  vendor_address: val.vendor_address || undefined,
                  vendor_name: val.vendor_name || undefined,
                  comments: val.vendor_comments || undefined,
                  per_component_price:
                    val.vendor_details[0].per_component_price,

                  vendor_id: ["", null, undefined, "N/A"].includes(
                    val.vendor_details[0].vendor_id
                  )
                    ? undefined
                    : val.vendor_details[0].vendor_id,

                  vendor_employee_id: ["", null, undefined, "N/A"].includes(
                    val.vendor_details[0].vendor_employee_id
                  )
                    ? undefined
                    : val.vendor_details[0].vendor_employee_id,
                  vendor_email_id: val.vendor_details[0].vendor_email_id,
                  sub_total: val.vendor_details[0].sub_total,
                  discont_percentage: val.vendor_details[0].discont_percentage,
                  gst: Number(val.vendor_details[0].gst),
                  total_price: val.vendor_details[0].total_price,
                };
                vendor_details.push(obj);
                val.vendor_details = vendor_details;
              }
              return {
                requested_from:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val?.requested_from || undefined
                    : undefined,
                component_id:
                  val.component_id != undefined &&
                  val.component_id != null &&
                  val.component_id != ""
                    ? val.component_id
                    : undefined,
                component_code: val.component_code || undefined,
                component_name: val.component_name || undefined,
                unique_object_id: val.unique_object_id,
                component_description:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.component_description
                    : undefined,
                approved_component_quantity:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.approved_component_quantity
                    : undefined,
                approved_count:
                  this.StoreObj.approval_type == "QUOTATION"
                    ? val.quantity
                    : undefined,
                requested_component_quantity:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.requested_component_quantity
                    : undefined,

                quantity:
                  this.StoreObj.approval_type == "QUOTATION"
                    ? val.quantity
                    : undefined,
                free_of_cost: val.free_of_cost,
                attachment_file:
                  val.attachment_file != undefined &&
                  val.attachment_file != [] &&
                  val.attachment_file.length != 0
                    ? val.attachment_file
                    : undefined,
                comments: val.comments,
                component_price: val.component_price || undefined,
                own_stock_approve_count:
                  parseInt(val.own_stock_approve_count) || undefined,

                local_purchase_approve_count:
                  parseInt(val.local_purchase_approve_count) || undefined,

                approve_service_center_details:
                  val.approve_service_center_details != undefined &&
                  val.approve_service_center_details.length != 0
                    ? val.approve_service_center_details
                    : undefined,

                store_approve_count: val.store_approve_count || undefined,
                category_id: val.category_id,
                category_name: val.category_name,
                service_id: val.service_id,
                service_name: val.service_name,
                vendor_details:
                  val.local_purchase_approve_count != undefined &&
                  val.local_purchase_approve_count != null &&
                  val.local_purchase_approve_count != 0
                    ? val.vendor_details != undefined &&
                      val.vendor_details.length != 0 &&
                      val.vendor_details != []
                      ? val.vendor_details
                      : undefined
                    : undefined,
              };
            }),
          };
          try {
            act == "APPROVE"
              ? (this.loadingApproveBtn = true)
              : (this.loadingRejectBtn = true);
            let result = await API.graphql(
              graphqlOperation(mutationname, {
                input: inputParams,
              })
            );
            var ResultObject = JSON.parse(result.data[mutationresult]);
            if (ResultObject.status == "SUCCESS") {
              this.renderComp = false;
              this.$nextTick(() => {
                this.SnackBarComponent = {
                  SnackbarVmodel: true,
                  SnackbarColor: "green",
                  Top: true,
                  SnackbarText: ResultObject.Status_Message,
                };
                this.renderComp = true;
              });
              this.dailogWorkflowItemsListEmit((this.Toggle = 2));
            }
            act == "APPROVE"
              ? (this.loadingApproveBtn = false)
              : (this.loadingRejectBtn = false);
          } catch (error) {
            act == "APPROVE"
              ? (this.loadingApproveBtn = false)
              : (this.loadingRejectBtn = false);
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText:
                  error.errors[0].message ===
                  "Variable 'input' has coerced Null value for NonNull type 'String!'"
                    ? "Kindly select the data/review the data from Vendor Details!"
                    : error.errors[0].message,
              };
              this.renderComp = true;
            });
          }
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: `${act} Minimum one Component..!`,
            };
            this.renderComp = true;
          });
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: `${
              act == "APPROVE" ? "Approving" : "Rejecting"
            } Quantity is more than Requested..!`,
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>

<!-- <template>
  <div>
    <ViewAttachmentsDialog
      :StoreObjNew="StoreObjNew"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <ViewTicketDetails
      :StoreObj="StoreObj"
      :viewTicketDetailsDialog="viewTicketDetailsDialog"
      @clicked="viewTicketDetailsDialogEmit"
    />
    <ViewStoreDetails
      :StoreObj="StoreObj"
      :work_flow_status="work_flow_status"
      :StoreObjOfCompDetails="StoreObjOfCompDetails"
      :DialogStoreDetails="DialogStoreDetails"
      @clicked="DialogStoreDetailsEmit"
    />
    <VendorDetails
      :ActionOObj="ActionOObj"
      :work_flow_status="work_flow_status"
      :DialogVendorDetails="DialogVendorDetails"
      :PreviousArray="PreviousArray"
      :StoreObjOfCompDetails="StoreObjOfCompDetails"
      @clicked="DialogVendorDetailsEmit"
    />
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="98%" :value="dailogWorkflowItemsList">
      <v-toolbar color="primary" dense dark>
        <div>
          <div class="ml-2 white--text">
            Components
            <span class="xsmallFontSize" v-if="this.StoreObj.mrf_id">
              MRF ID : ({{ this.StoreObj.mrf_id }})</span
            >
            <span
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id != undefined"
              >Ticket ID: ({{ this.StoreObj.custom_ticket_id }})</span
            >
            <span class="xsmallFontSize" v-else>
              Ticket ID :({{ this.StoreObj.module_id }})</span
            >
            <span>
              <v-icon
                class="ml-1"
                small
                @click="viewTicketDetailsMethod('IN_SIDE')"
                color="white"
                >mdi-information</v-icon
              >
            </span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dailogWorkflowItemsListEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-row
            no-gutters
            v-if="StoreObj.other_details"
            class="font-weight-bold FontSize black--text mb-2 pb-2"
          >
            <v-col cols="12" md="2" xs="12" sm="12">
              <div>
                Dispatch To :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to_type"
                  >{{ StoreObj.other_details.dispatch_to_type }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <div>
                Name :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to"
                  >{{ StoreObj.other_details.dispatch_to }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <div>
                Phone :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to_contact_number"
                  >{{ StoreObj.other_details.dispatch_to_contact_number }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12">
              <div>
                Address :
                <span
                  class="font-weight-regular"
                  v-if="StoreObj.other_details.dispatch_to_address"
                  >{{ StoreObj.other_details.dispatch_to_address }}</span
                >
                <span v-else>-</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.store_name"
            >
              <div>
                Store Name :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.store_name
                }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.city"
            >
              <div>
                City :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.city
                }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.state"
            >
              <div>
                State :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.state
                }}</span>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.other_details.pincode"
            >
              <div>
                Pincode :
                <span class="font-weight-regular">{{
                  StoreObj.other_details.pincode
                }}</span>
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.quotation_display_id"
            >
              <div class="font-weight-bold black--text FontSize">
                Quotation ID : {{ StoreObj.quotation_display_id }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              xs="12"
              sm="12"
              v-if="StoreObj.payment_done_comments"
            >
              <div class="font-weight-bold black--text FontSize">
                Comments: {{ StoreObj.payment_done_comments }}
              </div>
            </v-col>
            <v-col cols="12" md="2" xs="12" sm="12">
              <div class="font-weight-bold black--text FontSize">Remarks :</div>
            </v-col>
            <v-col cols="12" md="6" xs="12" sm="12">
              <div class="FontSize black--text" v-if="StoreObj.remark">
                {{ StoreObj.remark }}
              </div>
              <div class="FontSize black--text" v-else>N/A</div>
            </v-col>
          </v-row>
          <div style="border: solid 1px black" class="pt-2 mb-2">
            <v-form ref="form">
              <v-data-table
                dense
                outlined
                :show-select="work_flow_status == 'PENDING' ? true : false"
                :headers="
                  work_flow_status != 'PENDING'
                    ? headers
                    : headers.filter((item) => item.value != 'approved_count')
                "
                v-model="selected"
                item-key="unique_object_id"
                :items="StoreObj.workflow_items"
                checkbox-color="primary"
              >
                <template v-slot:[`item.component_name`]="{ item }">
                  <div class="FontSize font-weight-bold">
                    <span class="font-weight-regular">{{
                      item.component_name
                    }}</span>
                  </div>
                  <div
                    v-if="item.component_code != undefined"
                    class="font-weight-bold FontSize"
                  >
                    Code :<span class="font-weight-regular">{{
                      item.component_code
                    }}</span>
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-slot:[`item.component_description`]="{ item }">
                  <div
                    v-if="item.component_description != undefined"
                    class="font-weight-bold FontSize"
                  >
                    <span class="font-weight-regular">{{
                      item.component_description
                    }}</span>
                  </div>
                  <div v-else>-</div>
                  <div class="FontSize primary--text font-weight-bold">
                    Requested :
                    <span
                      v-if="
                        StoreObj.approval_type != 'QUOTATION' &&
                        item.requested_component_quantity != undefined
                      "
                    >
                      {{ item.requested_component_quantity }}
                    </span>
                    <span
                      v-else-if="
                        StoreObj.approval_type == 'QUOTATION' &&
                        item.quantity != undefined
                      "
                      >{{ item.quantity }}</span
                    >
                    <span v-else>0</span>
                  </div>
                </template>
                <template v-slot:[`item.own_stock`]="{ item }">
                  <v-text-field
                    dense
                    outlined
                    :disabled="!item.availableCompCountAtRep"
                    type="number"
                    class="FontSize mr-1 mt-2"
                    label="Quantity"
                    :readonly="work_flow_status != 'PENDING' ? true : false"
                    v-model="item.own_stock_approve_count"
                    @input="checkQty(item)"
                  >
                  </v-text-field>
                  <div
                    class="FontSize mt-n6"
                    v-if="work_flow_status == 'PENDING'"
                  >
                    <span
                      v-if="item.availableCompCountAtRep == 0"
                      class="red--text"
                    >
                      Avail : {{ item.availableCompCountAtRep }}</span
                    >
                    <span v-else>
                      Avail : {{ item.availableCompCountAtRep }}</span
                    >
                  </div>
                </template>
                <template v-slot:[`item.local_purchase`]="{ item, index }">
                  <v-btn
                    small
                    class="primary white--text"
                    v-model="item.vendor_details"
                    @click="openVendorDetails(item, index)"
                  >
                    Vendor
                  </v-btn>
                  <div class="FontSize">
                    Qty :
                    <span
                      v-if="
                        item.local_purchase_approve_count != undefined &&
                        item.local_purchase_approve_count != ''
                      "
                      >{{ item.local_purchase_approve_count }}</span
                    >
                    <span v-else>0</span>
                  </div>
                </template>
                <template v-slot:[`item.store`]="{ item }">
                  <div>
                    <v-btn
                      small
                      class="primary white--text ml-1"
                      @click.stop="openStoreDetails(item)"
                      >Store</v-btn
                    >
                    <div class="FontSize">
                      Qty :
                      <span
                        v-if="
                          item.store_approve_count != undefined &&
                          item.store_approve_count != ''
                        "
                        >{{ item.store_approve_count }}</span
                      >
                      <span v-else>0</span>
                    </div>
                  </div>
                </template>
                <template v-slot:[`item.approved_count`]="{ item }">
                  <div v-if="item.approved_count != undefined">
                    {{ item.approved_count }}
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-slot:[`item.component_price`]="{ item }">
                  <v-text-field
                    dense
                    outlined
                    label="Price"
                    class="mt-2 mb-n4 FontSize"
                    v-model="item.component_price"
                  >
                  </v-text-field>
                </template>
                <template v-slot:[`item.free_of_cost`]="{ item }">
                  <v-checkbox label="FOC" v-model="item.free_of_cost">
                  </v-checkbox>
                </template>
                <template v-slot:[`item.comments`]="{ item }">
                  <div>
                    <v-text-field
                      dense
                      outlined
                      label="Comments"
                      class="FontSize mt-4"
                      v-model="item.comments"
                      :readonly="work_flow_status != 'PENDING' ? true : false"
                    ></v-text-field>
                  </div>
                </template>
                <template v-slot:[`item.attachment_file`]="{ item }">
                  <v-file-input
                    dense
                    counter
                    outlined
                    multiple
                    show-size
                    prepend-icon=""
                    class="FontSize"
                    label="File Upload"
                    v-model="item.file_input"
                    @change="SelectedFileMethod(item)"
                    v-if="work_flow_status == 'PENDING'"
                  ></v-file-input>
                  <div v-if="item.attachment_file">
                    {{ item.attachment_file.length }}
                    <v-icon small color="green" @click="viewAttachs(item)"
                      >mdi-attachment</v-icon
                    >
                  </div>
                  <div v-else>
                    <span v-show="work_flow_status != 'PENDING'">N/A</span>
                  </div>
                </template>
              </v-data-table>
            </v-form>
          </div>
          <div
            style="border: solid 1px"
            class="pa-4 mt-4"
            v-if="StoreObj.tracking_details != undefined"
          >
            <div
              class="font-weight-bold"
              v-if="StoreObj.tracking_details != undefined"
            >
              Tracking Details
            </div>
            <v-data-table
              v-if="StoreObj.tracking_details != undefined"
              outlined
              dense
              :headers="trackingHeaders"
              :items="StoreObj.tracking_details"
              hide-default-footer
            >
              <template v-slot:[`item.courier_name`]="{ item }">
                <div class="FontSize" v-if="item.courier_name != undefined">
                  {{ item.courier_name }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[item.tracking_id]="{ item }">
                <div class="FontSize" v-if="item.tracking_id != undefined">
                  {{ item.tracking_id }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[item.phone_number]="{ item }">
                <div class="FontSize" v-if="item.phone_number != undefined">
                  {{ item.phone_number }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[item.date]="{ item }">
                <div class="FontSize" v-if="item.date != undefined">
                  {{ item.date }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[item.part_name]="{ item }">
                <div class="FontSize" v-if="item.part_name != undefined">
                  {{ item.part_name }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[item.attachments]="{ item }">
                <div class="FontSize" v-if="item.attachments != undefined">
                  {{ item.attachments.length }}
                  <v-tooltip color="primary" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="viewAttachs(item)"
                        small
                        color="primary"
                        v-on="on"
                        v-bind="attrs"
                        >mdi-attachment
                      </v-icon>
                    </template>
                    <span>View Added Files</span>
                  </v-tooltip>
                </div>
                <div v-else>0</div>
              </template>
            </v-data-table>
          </div>
          <div
            style="border: solid 1px"
            class="pa-4 mt-4"
            v-if="StoreObj.LOP_deatails"
          >
            <div class="font-weight-bold" v-if="StoreObj.LOP_deatails">
              Local Purchase Details
            </div>
            <v-data-table
              v-if="StoreObj.LOP_deatails != undefined"
              dense
              outlined
              hide-default-footer
              :headers="LOP_deatails_headers"
              :items="StoreObj.LOP_deatails"
            >
              <template v-slot:[`item.purchase_number`]="{ item }">
                <div class="FontSize" v-if="item.purchase_number">
                  {{ item.purchase_number }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.purchase_date`]="{ item }">
                <div class="FontSize" v-if="item.purchase_date">
                  {{ item.purchase_date }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.purchase_by`]="{ item }">
                <div class="FontSize" v-if="item.purchase_by">
                  {{ item.purchase_by }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.comments`]="{ item }">
                <div class="FontSize" v-if="item.comments">
                  {{ item.comments }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.attachments`]="{ item }">
                <div class="FontSize" v-if="item.attachments != undefined">
                  {{ item.attachments.length }}
                  <v-tooltip color="primary" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="viewAttachs(item)"
                        small
                        color="primary"
                        v-on="on"
                        v-bind="attrs"
                        >mdi-attachment
                      </v-icon>
                    </template>
                    <span>View Added Files</span>
                  </v-tooltip>
                </div>
                <div v-else>0</div>
              </template>
            </v-data-table>
          </div>
          <div
            style="border: solid 1px"
            class="pa-4 mt-4"
            v-if="StoreObj.ITF_details != undefined"
          >
            <div
              class="font-weight-bold"
              v-if="StoreObj.ITF_details != undefined"
            >
              Indent To Factory Details
            </div>
            <v-data-table
              v-if="StoreObj.ITF_details != undefined"
              dense
              outlined
              hide-default-footer
              :headers="ITF_details_headers"
              :items="StoreObj.ITF_details"
            >
              <template v-slot:[`item.DOA`]="{ item }">
                <div class="FontSize" v-if="item.DOA">
                  {{ item.DOA }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.comments`]="{ item }">
                <div class="FontSize" v-if="item.comments">
                  {{ item.comments }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.attachments`]="{ item }">
                <div class="FontSize" v-if="item.attachments != undefined">
                  {{ item.attachments.length }}
                  <v-tooltip color="primary" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="viewAttachs(item)"
                        small
                        color="primary"
                        v-on="on"
                        v-bind="attrs"
                        >mdi-attachment
                      </v-icon>
                    </template>
                    <span>View Added Files</span>
                  </v-tooltip>
                </div>
                <div v-else>0</div>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
        <v-card-actions class="mb-5 mr-4">
          <v-spacer />
          <v-btn
            color="red"
            v-if="work_flow_status == 'PENDING'"
            :loading="loadingRejectBtn"
            small
            class="white--text"
            @click="validateMethod('REJECT')"
            ><v-icon small>mdi-close</v-icon>
            Reject
          </v-btn>
          <v-btn
            color="green"
            v-if="work_flow_status == 'PENDING'"
            :loading="loadingApproveBtn"
            small
            class="white--text"
            @click="validateMethod('APPROVE')"
            ><v-icon small>mdi-check</v-icon>
            Approve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import VendorDetails from "@/components/Approvals/VendorDetails.vue";
import ViewStoreDetails from "@/components/Approvals/ViewStoreDetails.vue";
import ViewTicketDetails from "@/components/Approvals/ViewTicketDetails.vue";
import ViewAttachmentsDialog from "@/components/Tickets/Dialogs/ViewAttachmentsDialog.vue";
import { API, graphqlOperation } from "aws-amplify";
import {
  TestingApprovalComponent,
  AproveOrRejectQuotationComponentRequest,
} from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetStoreNamesAndCompCount } from "@/mixins/Approvals/CompCountAtRepAndStore.js";
export default {
  props: {
    StoreObj: Object,
    work_flow_status: String,
    dailogWorkflowItemsList: Boolean,
  },
  components: {
    Overlay,
    Snackbar,
    VendorDetails,
    ViewStoreDetails,
    ViewTicketDetails,
    ViewAttachmentsDialog,
  },
  mixins: [GenerateS3URL, GetStoreNamesAndCompCount],
  data: () => ({
    ActionOObj: {},
    totalApprovingCount: 0,
    overlay: false,
    renderComp: true,
    loadingRejectBtn: false,
    loadingApproveBtn: false,
    isEligibleToApprove: true,
    previewAttachments: false,
    DialogStoreDetails: false,
    DialogVendorDetails: false,
    viewTicketDetailsDialog: false,
    own_stock_approve_count: "",
    stock_item: "SERVICE_CENTER",
    approved_component_quantity: 0,
    requested_component_quantity: "",
    local_purchase_approve_count: "",
    StoreObjNew: {},
    SnackBarComponent: {},
    StoreObjOfCompDetails: {},
    selected: [],
    territory_ids: [],
    vendor_details: [],
    GetStoreNamesAndCompCountList: [],
    stock_items: [
      { text: "Store", value: "SERVICE_CENTER" },
      { text: "Local Purchase", value: "LOCAL_PURCHASE" },
    ],
    trackingHeaders: [
      { text: "Courier", value: "courier_name" },
      { text: "Docket ID", value: "tracking_id" },
      { text: "Phone", value: "phone_number" },
      { text: "Date", value: "date" },
      { text: "Additional Part", value: "part_name" },
      { text: "Attachs", value: "attachments" },
    ],
    ITF_details_headers: [
      { text: "Date Of Arraival", value: "DOA" },
      { text: "Comments", value: "comments" },
      { text: "Attachs", value: "attachments" },
    ],
    LOP_deatails_headers: [
      { text: "Purchased Number", value: "purchase_number" },
      { text: "Purchased Date", value: "purchase_date" },
      { text: "Purchased By", value: "purchased_by" },
      { text: "Comments", value: "comments" },
      { text: "Attachs", value: "attachments" },
    ],
    headers: [
      { text: "Component", value: "component_name" },
      {
        text: "Description",
        value: "component_description",
      },
      { text: "Rep Stock", value: "own_stock" },
      { text: "Local Purchase", value: "local_purchase" },
      { text: "Store", value: "store" },
      { text: "Approved Count", value: "approved_count" },
      { text: "Price", value: "component_price" },
      { text: "Free of Cost", value: "free_of_cost" },
      { text: "Comments", value: "comments" },
      { text: "Attchs", value: "attachment_file" },
    ],
    DialogEmitArray: {},
    PreviousArray: {},
  }),
  watch: {
    dailogWorkflowItemsList(val) {
      if (val == true) {
        this.callAPIforDisplayCount();
        console.log("PYAAR", this.StoreObj);
      }
    },
  },
  mounted() {},
  methods: {
    SelectedFileMethod(item) {
      this.UploadToS3Method(item);
    },
    async UploadToS3Method(attachment) {
      let LocalArray = [];
      if (attachment.attachment_file) {
        for (let i = 0; i < attachment.attachment_file.length; i++) {
          LocalArray.push(attachment.attachment_file[i]);
        }
      }
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
        this.selected.map((item) => {
          let Object = item;
          if (item.unique_object_id === attachment.unique_object_id) {
            Object.attachment_file = LocalArray;
          }
          this.$forceUpdate();
        });
      }
    },
    viewTicketDetailsMethod(item) {
      this.viewTicketDetailsDialog = true;
    },
    viewTicketDetailsDialogEmit() {
      this.viewTicketDetailsDialog = false;
    },
    async callAPIforDisplayCount() {
      if (
        this.StoreObj.workflow_items != [] &&
        this.StoreObj.workflow_items.length != 0
      ) {
        for (let i = 0; i < this.StoreObj.workflow_items.length; i++) {
          this.StoreObj.workflow_items[i].availableCompCountAtRep =
            await this.GetStoreNamesAndCompCountMethod(
              this.StoreObj.workflow_items[i].component_id,
              this.StoreObj.initiator_user_id
            );
        }
        this.$forceUpdate();
      }
    },
    checkAvailQty(item) {
      this.GetStoreNamesAndCompCountMethod(
        item.component_id,
        this.StoreObj.initiator_user_id
      );
      setTimeout(() => {
        if (
          this.GetStoreNamesAndCompCountList != undefined &&
          this.GetStoreNamesAndCompCountList.length != 0
        ) {
          this.StoreObj.workflow_details =
            this.GetStoreNamesAndCompCountList[0].components_in_stock;
        }
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }, 500);
    },
    openStoreDetails(item) {
      this.StoreObjOfCompDetails = item;
      this.DialogStoreDetails = true;
    },
    openVendorDetails(item) {
      this.StoreObjOfCompDetails = item;
      this.StoreObjOfCompDetails.vendor_details = [];
      this.ActionOObj = this.StoreObj;
      this.PreviousArray = this.DialogEmitArray;
      this.DialogVendorDetails = true;
    },
    DialogVendorDetailsEmit(Toggle, StoreObjOfCompDetails) {
      this.DialogVendorDetails = false;
      if (Toggle == 2) {
        if (StoreObjOfCompDetails) {
          if (
            StoreObjOfCompDetails.vendor_details != undefined &&
            StoreObjOfCompDetails.vendor_details != null &&
            StoreObjOfCompDetails.vendor_details.length != 0
          ) {
            StoreObjOfCompDetails.local_purchase_approve_count =
              StoreObjOfCompDetails.vendor_details[0].purchased_count;
            StoreObjOfCompDetails.vendor_details =
              StoreObjOfCompDetails.vendor_details;

            console.log("passed", StoreObjOfCompDetails);
            this.DialogEmitArray = StoreObjOfCompDetails;
          }
        } else {
          return 0;
        }
      }
    },
    DialogStoreDetailsEmit(Toggle, StoreObjOfCompDetails) {
      this.DialogStoreDetails = false;
      if (Toggle == 2) {
        if (
          StoreObjOfCompDetails.approve_service_center_details != undefined &&
          StoreObjOfCompDetails.approve_service_center_details.length != 0
        ) {
          let approveQtyFromStore = 0;
          for (
            let i = 0;
            i < StoreObjOfCompDetails.approve_service_center_details.length;
            i++
          ) {
            approveQtyFromStore +=
              StoreObjOfCompDetails.approve_service_center_details[i]
                .approved_component_quantity;
          }
          StoreObjOfCompDetails.store_approve_count = approveQtyFromStore;
        } else {
          StoreObjOfCompDetails.store_approve_count = 0;
        }
      }
    },
    viewAttachs(item) {
      this.StoreObjNew = item;
      this.previewAttachments = true;
    },
    previewAttachmentsEmit() {
      this.previewAttachments = false;
    },
    checkQty(item) {
      if (
        item.own_stock_approve_count != null &&
        item.own_stock_approve_count != undefined &&
        item.own_stock_approve_count != "" &&
        item.availableCompCountAtRep != null &&
        item.availableCompCountAtRep != undefined &&
        item.availableCompCountAtRep != ""
      ) {
        if (item.own_stock_approve_count > item.availableCompCountAtRep) {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Representative do not have this much Quantity..!",
            };
            this.renderComp = true;
          });
        }
      }
    },
    IsRulesRequired(item) {
      return this.selected.includes(item) ? [(v) => !!v || "Required"] : [];
    },
    dailogWorkflowItemsListEmit(Toggle) {
      // this.$refs.form.reset();
      this.selected = [];
      this.$emit("clicked", Toggle);
      this.DialogEmitArray = [];
    },
    validateMethod(act) {
      if (act == "APPROVE") {
        if (this.selected.length != 0) {
          if (this.$refs.form.validate()) {
            this.approveOrRejectItem("APPROVE");
          } else if (!this.$refs.form.validate()) {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText: "Fill all the required details",
              };
              this.renderComp = true;
            });
          }
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Select Atleast One Component",
            };
            this.renderComp = true;
          });
        }
      } else if (act == "REJECT") {
        if (this.selected.length != 0) {
          this.approveOrRejectItem("REJECT");
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Select Atleast One Component",
            };
            this.renderComp = true;
          });
        }
      }
    },
    async approveOrRejectItem(act) {
      for (let i = 0; i < this.selected.length; i++) {
        this.isEligibleToApprove = true;
        let requestedQty =
          this.StoreObj.approval_type == "QUOTATION"
            ? this.selected[i].requested_component_quantity
            : this.selected[i].quantity;
        let ownStockQty =
          this.selected[i].own_stock_approve_count != undefined &&
          this.selected[i].own_stock_approve_count != ""
            ? parseInt(this.selected[i].own_stock_approve_count)
            : 0;
        let localPurchaseQty =
          this.selected[i].local_purchase_approve_count != undefined &&
          this.selected[i].local_purchase_approve_count != ""
            ? parseInt(this.selected[i].local_purchase_approve_count)
            : 0;
        let storeQty =
          this.selected[i].store_approve_count != undefined &&
          this.selected[i].store_approve_count != ""
            ? this.selected[i].store_approve_count
            : 0;
        this.totalApprovingCount = localPurchaseQty + storeQty + ownStockQty;
        if (this.totalApprovingCount > requestedQty) {
          this.isEligibleToApprove = false;
        }
      }
      if (this.isEligibleToApprove == true) {
        if (this.totalApprovingCount != 0 || act == "REJECT") {
          var mutationname =
            this.StoreObj.approval_type != "QUOTATION"
              ? TestingApprovalComponent
              : AproveOrRejectQuotationComponentRequest;
          var mutationresult =
            this.StoreObj.approval_type != "QUOTATION"
              ? "TestingApprovalComponent"
              : "AproveOrRejectQuotationComponentRequest";
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            user_id:
              this.StoreObj.approval_type != "QUOTATION"
                ? this.$store.getters.get_current_user_details.user_id
                : undefined,
            quotation_id:
              this.StoreObj.quotation_id != undefined
                ? this.StoreObj.quotation_id
                : undefined,
            updater_user_id:
              this.StoreObj.approval_type == "QUOTATION"
                ? this.$store.getters.get_current_user_details.user_id
                : undefined,
            workflow_id: this.StoreObj.workflow_id,
            other_details:
              this.StoreObj.other_details != undefined
                ? this.StoreObj.other_details
                : undefined,
            commonWorkFlowIds:
              this.StoreObj.commonWorkFlowIds != undefined &&
              this.StoreObj.approval_type != "QUOTATION"
                ? this.StoreObj.commonWorkFlowIds
                : undefined,
            initiator_user_id:
              this.StoreObj.approval_type != "QUOTATION"
                ? this.StoreObj.initiator_user_id
                : undefined,
            action: act == "APPROVE" ? "APPROVE" : "REJECT",
            workflow_items: this.selected.map((val) => {
              console.log("VAL", this.selected);
              console.log(
                "this.StoreObjOfCompDetails",
                this.StoreObjOfCompDetails
              );
              if (
                val.local_purchase_approve_count != undefined &&
                val.local_purchase_approve_count != null &&
                val.local_purchase_approve_count != 0
              ) {
                let vendor_details = [];
                let obj = {
                  component_name: val.component_name,
                  purchased_count: val.local_purchase_approve_count,
                  vendor_contact_number: val.vendor_contact_number,
                  vendor_address: val.vendor_address,
                  vendor_name: val.vendor_name,
                  comments: val.vendor_comments,
                  per_component_price:
                    this.StoreObjOfCompDetails.vendor_details[0]
                      .per_component_price,
                  vendor_id:
                    this.StoreObjOfCompDetails.vendor_details[0].vendor_id,
                  sub_total:
                    this.StoreObjOfCompDetails.vendor_details[0].sub_total,
                  discont_percentage:
                    this.StoreObjOfCompDetails.vendor_details[0]
                      .discont_percentage,
                  gst: this.StoreObjOfCompDetails.vendor_details[0].gst,
                  total_price:
                    this.StoreObjOfCompDetails.vendor_details[0].total_price,
                };
                vendor_details.push(obj);
                val.vendor_details = vendor_details;
              }
              return {
                component_id:
                  val.component_id != undefined &&
                  val.component_id != null &&
                  val.component_id != ""
                    ? val.component_id
                    : undefined,
                component_code:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.component_code
                    : undefined,
                component_name:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.component_name
                    : undefined,
                unique_object_id: val.unique_object_id,
                component_description:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.component_description
                    : undefined,
                approved_component_quantity:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.approved_component_quantity
                    : undefined,
                approved_count:
                  this.StoreObj.approval_type == "QUOTATION"
                    ? val.quantity
                    : undefined,
                requested_component_quantity:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.quantity
                    : undefined,
                quantity:
                  this.StoreObj.approval_type == "QUOTATION"
                    ? val.quantity
                    : undefined,
                free_of_cost: val.free_of_cost,
                attachment_file:
                  val.attachment_file != undefined &&
                  val.attachment_file != [] &&
                  val.attachment_file.length != 0
                    ? val.attachment_file
                    : undefined,
                comments: val.comments,
                component_price:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.component_price
                    : undefined,
                own_stock_approve_count:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.own_stock_approve_count != undefined &&
                      val.own_stock_approve_count != "" &&
                      val.own_stock_approve_count != null
                      ? parseInt(val.own_stock_approve_count)
                      : undefined
                    : undefined,
                own_stock_approved_count:
                  this.StoreObj.approval_type == "QUOTATION"
                    ? val.own_stock_approve_count != undefined &&
                      val.own_stock_approve_count != "" &&
                      val.own_stock_approve_count != null
                      ? parseInt(val.own_stock_approve_count)
                      : undefined
                    : undefined,
                local_purchase_approve_count:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.local_purchase_approve_count != undefined &&
                      val.local_purchase_approve_count != null &&
                      val.local_purchase_approve_count != ""
                      ? parseInt(val.local_purchase_approve_count)
                      : undefined
                    : undefined,
                local_purchase_approved_count:
                  this.StoreObj.approval_type == "QUOTATION"
                    ? val.local_purchase_approve_count != undefined &&
                      val.local_purchase_approve_count != null &&
                      val.local_purchase_approve_count != ""
                      ? parseInt(val.local_purchase_approve_count)
                      : undefined
                    : undefined,
                approve_service_center_details:
                  val.approve_service_center_details != undefined &&
                  val.approve_service_center_details.length != 0
                    ? val.approve_service_center_details
                    : undefined,
                store_approved_count:
                  this.StoreObj.approval_type == "QUOTATION"
                    ? val.store_approve_count != undefined &&
                      val.store_approve_count != ""
                      ? val.store_approve_count
                      : undefined
                    : undefined,
                store_approve_count:
                  this.StoreObj.approval_type != "QUOTATION"
                    ? val.store_approve_count != undefined &&
                      val.store_approve_count != ""
                      ? val.store_approve_count
                      : undefined
                    : undefined,
                vendor_details:
                  val.local_purchase_approve_count != undefined &&
                  val.local_purchase_approve_count != null &&
                  val.local_purchase_approve_count != 0
                    ? val.vendor_details != undefined &&
                      val.vendor_details.length != 0 &&
                      val.vendor_details != []
                      ? val.vendor_details
                      : undefined
                    : undefined,
              };
            }),
          };
          try {
            act == "APPROVE"
              ? (this.loadingApproveBtn = true)
              : (this.loadingRejectBtn = true);
            let result = await API.graphql(
              graphqlOperation(mutationname, {
                input: inputParams,
              })
            );
            var ResultObject = JSON.parse(result.data[mutationresult]);
            if (ResultObject.status == "SUCCESS") {
              this.renderComp = false;
              this.$nextTick(() => {
                this.SnackBarComponent = {
                  SnackbarVmodel: true,
                  SnackbarColor: "green",
                  Top: true,
                  SnackbarText: ResultObject.Status_Message,
                };
                this.renderComp = true;
              });
              this.dailogWorkflowItemsListEmit((this.Toggle = 2));
            }
            act == "APPROVE"
              ? (this.loadingApproveBtn = false)
              : (this.loadingRejectBtn = false);
          } catch (error) {
            act == "APPROVE"
              ? (this.loadingApproveBtn = false)
              : (this.loadingRejectBtn = false);
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
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: `${act} Minimum one Component..!`,
            };
            this.renderComp = true;
          });
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: `${
              act == "APPROVE" ? "Approving" : "Rejecting"
            } Quantity is more than Requested..!`,
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script> -->
