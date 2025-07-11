<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <ApproveOrRejectProductFleet
      :StoreObj="StoreObj"
      :DialogApproveOrRejectProductFleet="DialogApproveOrRejectProductFleet"
      @clicked="DialogApproveOrRejectProductFleetEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Product Fleet Approvals</div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          :items="statusItems"
          label="Work Flow Status"
          v-model="work_flow_status"
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
      </v-toolbar>
      <v-card-text class="pt-0">
        <v-data-table
          dense
          :search="search"
          fixed-header
          :height="TableHeight"
          :items-per-page="100"
          :items="WorkFlowList"
          :no-data-text="noDataText"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :headers="
            work_flow_status == 'PENDING'
              ? headers
              : headers.filter((item) => item.text != 'Actions')
          "
        >
          <template v-slot:[`item.initiator_user_name`]="{ item }">
            <div class="FontSize" v-if="item.initiator_user_name != undefined">
              {{ item.initiator_user_name }}
            </div>
            <div v-else>-</div>
            <div
              class="FontSize"
              v-if="item.workflow_initiated_on != undefined"
            >
              {{
                new Date(item.workflow_initiated_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
            <div v-if="item.custom_ticket_id != undefined" class="FontSize">
              {{ item.custom_ticket_id }}
            </div>
            <div v-else-if="item.ticket_id != undefined" class="FontSize">
              {{ item.ticket_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div
              class="FontSize"
              v-if="item.customer_company_name != undefined"
            >
              {{ item.customer_company_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.customer_name != undefined">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
            <div
              class="FontSize"
              v-if="item.customer_phone_number != undefined"
            >
              {{ item.customer_phone_number }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_product_details`]="{ item }">
            <div
              class="FontSize"
              v-if="item.ticket_product_details != undefined"
            >
              <div
                v-if="item.ticket_product_details.category_name != undefined"
              >
                {{ item.ticket_product_details.category_name }}
              </div>
              <div v-else>-</div>
              <div v-if="item.ticket_product_details.product_name != undefined">
                {{ item.ticket_product_details.product_name }}
              </div>
              <div v-else>-</div>
              <div
                v-if="item.ticket_product_details.serial_number != undefined"
              >
                {{ item.ticket_product_details.serial_number }}
              </div>
              <div v-else>-</div>
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.category_name`]="{ item }">
            <div class="FontSize" v-if="item.category_name != undefined">
              {{ item.category_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.product_name != undefined">
              {{ item.product_name }}
            </div>
            <div v-else>-</div>
            <div v-if="item.setting_name != undefined" class="FontSize">
              {{ item.setting_name }}
            </div>
            <div v-else>-</div>
            <div class="FontSize" v-if="item.pending_on_name != undefined">
              <span
                class="orange--text"
                v-if="work_flow_status == 'PENDING'"
              >
                Pending On :
                {{ item.pending_on_name }}
              </span>
              <span
                class="green--text"
                v-if="work_flow_status == 'APPROVED'"
              >
                Approved By :
                {{ item.pending_on_name }}
              </span>
              <span class="red--text" v-if="work_flow_status == 'REJECTED'">
                Rejected By :
                {{ item.pending_on_name }}</span
              >
            </div>
          </template>
          <template
            v-slot:[`item.Actions`]="{ item }"
            v-if="this.work_flow_status == 'PENDING'"
          >
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  color="green"
                  small
                  v-on="on"
                  class="mr-2"
                  @click="checkItem(item, 'APPROVE')"
                >
                  mdi-check-outline
                </v-icon>
              </template>
              <span>Approve</span>
            </v-tooltip>
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-icon
                  @click.stop="checkItem(item, 'REJECT')"
                  color="red"
                  small
                  v-on="on"
                >
                  mdi-close-outline
                </v-icon>
              </template>
              <span>Reject</span>
            </v-tooltip>
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
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ApproveOrRejectProductFleet from "@/components/Approvals/ApproveOrRejectProductFleet.vue";
import { GetAllWorkFlowList } from "@/mixins/Approvals/GetAllWorkFlowList.js";
export default {
  components: {
    Overlay,
    Snackbar,
    ApproveOrRejectProductFleet,
  },
  mixins: [GetAllWorkFlowList],
  data() {
    return {
      search: "",
      work_flow_status: "PENDING",
      noDataText: "No Data Available..!",
      StoreObj: {},
      TableHeight: 0,
      WorkFlowList: [],
      statusItems: ["PENDING", "APPROVED", "REJECTED"],
      DialogApproveOrRejectProductFleet: false,
      headers: [
        {
          text: "Requested By",
          value: "initiator_user_name",
          width: "25%",
        },
        {
          text: "Customer",
          value: "customer_company_name",
          width: "25%",
        },
        {
          text: "Old Product Fleet",
          value: "ticket_product_details",
          width: "20%",
        },
        {
          text: "New Product Fleet",
          value: "category_name",
          width: "20%",
        },
        {
          text: "Actions",
          value: "Actions",
          width: "9%",
        },
      ],
      SnackBarComponent: {},
    };
  },
  watch: {
    work_flow_status(val) {
      this.WorkFlowList = [];
      this.search = '';
      this.GetAllWorkFlowListMethod(
        val,
        "PRODUCT_FLEET",
        "PRODUCT_FLEET_REQUEST"
      );
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllWorkFlowListMethod(
      this.work_flow_status,
      "PRODUCT_FLEET",
      "PRODUCT_FLEET_REQUEST"
    );
  },
  methods: {
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      this.DialogApproveOrRejectProductFleet = true;
    },
    DialogApproveOrRejectProductFleetEmit(Toggle) {
      this.DialogApproveOrRejectProductFleet = false;
      if (Toggle == 2) {
        this.GetAllWorkFlowListMethod(
          this.work_flow_status,
          "PRODUCT_FLEET",
          "PRODUCT_FLEET_REQUEST"
        );
      }
    },
  },
};
</script>
