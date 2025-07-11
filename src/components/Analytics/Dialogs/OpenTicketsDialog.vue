<template>
  <div>
    <v-dialog
      :value="taggedTerritoriesDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="80%"
    >
      <v-card>
        <v-toolbar elevation="0" dense color="primary">
          <strong class="white--text"
            >{{ StoreObj.service_type_name }} -
            {{ StoreObj.active_ticket_count }}</strong
          >
          <v-spacer />
          <v-tooltip color="primary" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                small
                icon
                class="primary white--text mr-2"
                @click="DownloadExcel"
              >
                <v-icon>mdi-file-excel-outline</v-icon>
              </v-btn>
            </template>
            <span class="white--text">Download Excel</span>
          </v-tooltip>
          <v-btn
            icon
            class="primary white--text"
            @click="closeEmmit1((Toggle = 1))"
          >
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-0 mt-2">
          <v-data-table
            dense
            :headers="headers"
            :items="StoreObj.active_ticket_details"
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
            :items-per-page="100"
          >
            <template v-slot:[`item.ticket_id`]="{ item }">
              <div class="FontSize" v-if="item.custom_ticket_id != undefined">
                {{ item.custom_ticket_id }}
              </div>
              <div class="FontSize" v-if="item.ticket_id != undefined">
                {{ item.ticket_id }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.ticket_status != undefined">
                {{ item.ticket_status.replaceAll("_", " ") }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.category_name`]="{ item }">
              <div v-if="item.category_name != undefined" class="FontSize">
                {{ item.category_name }}
              </div>
              <div v-else>-</div>
              <div v-if="item.product_name != undefined" class="FontSize">
                {{ item.product_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.created_by`]="{ item }">
              <div class="FontSize" v-if="item.created_by != undefined">
                {{ item.created_by }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.ticket_created_on != undefined">
                {{
                  new Date(item.ticket_created_on * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.customer_name`]="{ item }">
              <div class="FontSize" v-if="item.customer_name != undefined">
                {{ item.customer_name }}
              </div>
              <div v-else>-</div>
              <div class="FontSize" v-if="item.technician_name != undefined">
                <span class="primary--text">Rep :</span>
                {{ item.technician_name }}
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
export default {
  components: {},
  props: {
    StoreObj: Object,
    taggedTerritoriesDialog: Boolean,
  },
  data: () => ({
    headers: [
      { text: "Ticket Id & Status", value: "ticket_id" },
      { text: "Category & Product", value: "category_name" },
      { text: "Created", value: "created_by" },
      { text: "Customer & Representative", value: "customer_name" },
    ],
  }),
  watch: {},
  methods: {
    closeEmmit1(Toggle) {
      this.$emit("clicked", Toggle);
    },
    DownloadExcel() {
      this.StoreObj.active_ticket_details.map((item) => {
        item.updated_ticket_created_on = new Date(
          item.ticket_created_on * 1000
        ).toLocaleString("en-GB");
        this.$forceUpdate();
      });
      let data = [
        {
          sheet: "test",
          columns: [
            {
              label: "Ticket ID",
              value: "ticket_id",
            },
            {
              label: "Category",
              value: "category_name",
            },
            {
              label: "Product",
              value: "product_name",
            },
            {
              label: "Ticket Status",
              value: "ticket_status",
            },
            {
              label: "Created By",
              value: "created_by",
            },
            {
              label: "Contact Person",
              value: "customer_name",
            },
            {
              label: "Technician",
              value: "technician_name",
            },
            {
              label: "Ticket Created On",
              value: "updated_ticket_created_on",
            },
          ],
          content: this.StoreObj.active_ticket_details,
        },
      ];
      let settings = {
        fileName: "Active Ticket Details",
        extraLength: 3,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
  },
};
</script>
