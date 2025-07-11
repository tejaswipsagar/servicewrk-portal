<template>
  <div>
    <Overlay :overlay="overlay" />
    <detailedTicketDetails
      :StoreObj="StoreObj"
      :DetailedTicketDetailsDialog="DetailedTicketDetailsDialog"
      @clicked="DetailedTicketDetailsDialogEmit"
    />
    <ReopenTicketsDialog
      :StoreObj="StoreObj"
      :dialogReopenTicket="dialogReopenTicket"
      @clicked="dialogReopenTicketEmit"
    />
    <RepeatTicket
      :StoreObj="StoreObj"
      :dialogRepeatDialog="dialogRepeatDialog"
      @clicked="dialogRepeatDialogEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar class="elevation-0" dense no-gutters>
        <div class="largeFontSizeNew">
          Ticket Details of
          <span>{{ StoreObj.setting_name }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="FontSize mt-7 mr-2 WidthVariation1"
        ></v-text-field>
        <v-btn small color="primary" @click="ViewTicketDetailsEmit()">
          <v-icon>mdi-chevron-double-left</v-icon>Back
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card-text>
      <v-data-table
        dense
        fixed-header
        :search="search"
        :loading="loading"
        :height="TableHeight"
        @click:row="checkItem"
        style="cursor: pointer"
        :no-data-text="noDataText"
        :headers="TicketDetailHeaders"
        :items="GetAllTicketDetailsList"
        :items-per-page="100"
        :footer-props="{
          'items-per-page-options': [100, 200, 500],
        }"
      >
        <template v-slot:[`item.ticket_id`]="{ item }">
          <div class="FontSize" v-if="item.custom_ticket_id != undefined">
            {{ item.custom_ticket_id }}
          </div>
          <div class="FontSize" v-else-if="item.ticket_id != undefined">
            {{
              `${item.ticket_id.split("-")[1]}-${
                item.ticket_id.split("-")[2]
              }-${item.ticket_id.split("-")[3]}-${item.ticket_id.split("-")[4]}`
            }}
          </div>
          <div class="FontSize" v-if="item.ticket_creation_type != undefined">
            <span class="FontSize">{{
              item.ticket_creation_type.replaceAll("_", " ")
            }}</span>
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.representative_name">
            <span class="FontSize">{{ item.representative_name }}</span>
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.customer_company_name`]="{ item }">
          <div class="FontSize" v-if="item.customer_company_name != undefined">
            {{ item.customer_company_name }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.customer_name != undefined">
            {{ item.customer_name }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.customer_unique_id != undefined">
            {{ item.customer_unique_id }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.category_name`]="{ item }">
          <div class="FontSize" v-if="item.category_name != undefined">
            {{ item.category_name }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.service_name != undefined">
            {{ item.service_name }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.ticket_created_on`]="{ item }">
          <div class="FontSize" v-if="item.ticket_created_on != undefined">
            {{
              new Date(item.ticket_created_on * 1000).toLocaleDateString(
                "en-GB"
              )
            }}
          </div>
          <div v-else>-</div>
          <div class="FontSize text-capitalize">
            <span>{{ item.service_type_name }}</span>
          </div>
          <div class="FontSize" v-if="item.ticket_status != undefined">
            <span>{{ item.ticket_status }}</span>
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.ticket_warranty_type`]="{ item }">
          <div class="FontSize">
            {{
              item.ticket_warranty_type != undefined
                ? item.ticket_warranty_type
                : "-"
            }}
          </div>
          <div class="FontSize" v-if="item.ticket_warranty_type != undefined">
            <span>{{
              item.support_type != undefined ? item.support_type : ""
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.ticket_status`]="{ item }">
          <div class="FontSize" v-if="item.ticket_status != undefined">
            {{ item.ticket_status }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.is_repeat_ticket != undefined">
            <span v-if="item.is_repeat_ticket == true" class="green--text">
              REPEATED
            </span>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                v-on="on"
                v-bind="attrs"
                icon
                color="primary"
                @click.stop="checkItem(item, 'RECREATE')"
                ><v-icon>mdi-plus-box-outline</v-icon></v-btn
              >
            </template>
            <span>Re-Create Ticket</span>
          </v-tooltip>
          <v-tooltip v-if="item.ticket_status == 'CLOSED'" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                v-on="on"
                v-bind="attrs"
                icon
                color="green"
                class="ml-2"
                @click.stop="checkItem(item, 'REOPEN')"
                ><v-icon>mdi-lock-open</v-icon></v-btn
              >
            </template>
            <span>Re-open Ticket</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import RepeatTicket from "@/components/Product/Dialogs/ProductsFleet/RepeatTicket.vue";
import ReopenTicketsDialog from "@/components/Tickets/Dialogs/ReopenTicketsDialog.vue";
import detailedTicketDetails from "@/components/Product/Dialogs/DetailedTicketDetails.vue";
import { GetAllTicketDetails } from "@/mixins/ScheduleServices/GetTicketDetailsBasedonSerialNumber.js";
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [GetAllTicketDetails],
  components: {
    Overlay,
    RepeatTicket,
    ReopenTicketsDialog,
    detailedTicketDetails,
  },
  data: () => ({
    search: "",
    TableHeight: 0,
    overlay: false,
    loading: false,
    dialogReopenTicket: false,
    dialogRepeatDialog: false,
    DetailedTicketDetailsDialog: false,
    GetAllTicketDetailsList: [],
    TicketDetailHeaders: [
      { text: "ID", value: "ticket_id" },
      { text: "Customer", value: "customer_company_name" },
      { text: "Product", value: "category_name" },
      { text: "Created On", value: "ticket_created_on" },
      { text: "Support", value: "ticket_warranty_type" },
      { text: "Ticket Status", value: "ticket_status" },
      { text: "Actions", value: "actions" },
    ],
  }),
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllTicketDetailsMethod(this.StoreObj.c);
  },
  methods: {
    dialogReopenTicketEmit() {
      this.dialogReopenTicket = false;
      this.GetAllTicketDetailsMethod(this.StoreObj.service_serial_number);
    },
    dialogRepeatDialogEmit() {
      this.dialogRepeatDialog = false;
      this.GetAllTicketDetailsMethod(this.StoreObj.service_serial_number);
    },
    DetailedTicketDetailsDialogEmit() {
      this.DetailedTicketDetailsDialog = false;
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "REOPEN") {
        this.dialogReopenTicket = true;
      } else if (action == "RECREATE") {
        this.dialogRepeatDialog = true;
      } else {
        this.DetailedTicketDetailsDialog = true;
      }
    },
    ViewTicketDetailsEmit() {
      this.$emit("clicked");
    },
  },
};
</script>
