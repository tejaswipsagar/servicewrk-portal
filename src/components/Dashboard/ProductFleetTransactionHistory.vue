<template>
  <div>
    <v-dialog width="80%" :value="dialogProductFleetTransferHistory">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">
          Product Fleet Transactions
          <span v-if="StoreObj.user_name != undefined">
            By {{ StoreObj.user_name }}</span
          >
        </div>
        <v-spacer></v-spacer>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              icon
              class="white--text mr-4"
              @click="exporttoexcel"
              v-on="on"
              v-bind="attrs"
              ><v-icon>mdi-file-excel-outline</v-icon></v-btn
            >
          </template>
          <span>Download Excel</span>
        </v-tooltip>
        <v-icon @click="DialogProductFleetTransHistoryEmit()">
          mdi-close
        </v-icon>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-data-table
            dense
            :headers="headers"
            fixed-header
            :no-data-text="noDataText"
            :height="tableHeight"
            :loading="loading"
            :items="ListGetProductFleetTransHistory"
          >
            <template v-slot:[`item.customer_company_name`]="{ item }">
              <div
                class="FontSize"
                v-if="item.replaced_from_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_from_service_details.customer_company_name !=
                    undefined
                  "
                >
                  {{ item.replaced_from_service_details.customer_company_name }}
                </div>
                <div v-else>-</div>
              </div>
              <div
                class="FontSize"
                v-if="item.replaced_from_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_from_service_details.customer_name !=
                    undefined
                  "
                >
                  {{ item.replaced_from_service_details.customer_name }}
                </div>
                <div v-else>-</div>
              </div>
            </template>
            <template v-slot:[`item.created_on`]="{ item }">
              <div class="FontSize" v-if="item.created_on != undefined">
                {{ new Date(item.created_on * 1000).toLocaleString("en-GB") }}
              </div>
              <div v-else>-</div>
              <div
                class="FontSize"
                v-if="item.replaced_from_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_from_service_details.custom_ticket_id !=
                    undefined
                  "
                >
                  {{ item.replaced_from_service_details.custom_ticket_id }}
                </div>
                <div
                  v-else-if="
                    item.replaced_from_service_details.ticket_id != undefined
                  "
                >
                  {{ item.replaced_from_service_details.ticket_id }}
                </div>
                <div v-else>-</div>
              </div>
            </template>
            <template v-slot:[`item.replaced_to_service_details`]="{ item }">
              <div
                class="FontSize"
                v-if="item.replaced_to_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_to_service_details.category_name != undefined
                  "
                >
                  {{ item.replaced_to_service_details.category_name }}
                </div>
                <div v-else>-</div>
              </div>
              <div
                class="FontSize"
                v-if="item.replaced_to_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_to_service_details.product_name != undefined
                  "
                >
                  {{ item.replaced_to_service_details.product_name }}
                </div>
                <div v-else>-</div>
              </div>
              <div
                class="FontSize"
                v-if="item.replaced_to_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_to_service_details.serial_number != undefined
                  "
                >
                  {{ item.replaced_to_service_details.serial_number }}
                </div>
                <div v-else>-</div>
              </div>
            </template>
            <template v-slot:[`item.replaced_from_service_details`]="{ item }">
              <div
                class="FontSize"
                v-if="item.replaced_from_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_from_service_details.category_name !=
                    undefined
                  "
                >
                  {{ item.replaced_from_service_details.category_name }}
                </div>
                <div v-else>-</div>
              </div>
              <div
                class="FontSize"
                v-if="item.replaced_from_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_from_service_details.product_name != undefined
                  "
                >
                  {{ item.replaced_from_service_details.product_name }}
                </div>
                <div v-else>-</div>
              </div>
              <div
                class="FontSize"
                v-if="item.replaced_from_service_details != undefined"
              >
                <div
                  v-if="
                    item.replaced_from_service_details.serial_number !=
                    undefined
                  "
                >
                  {{ item.replaced_from_service_details.serial_number }}
                </div>
                <div v-else>-</div>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { GetProductFleetTransHistory } from "@/mixins/Dashboard/GetProductFleetTransHistory.js";
import xlsx from "json-as-xlsx";
export default {
  props: {
    StoreObj: Object,
    dialogProductFleetTransferHistory: Boolean,
  },
  mixins: [GetProductFleetTransHistory],
  data: () => ({
    loading: false,
    tableHeight: 0,
    ListGetProductFleetTransHistory: [],
    headers: [
      { text: "Old Product Fleet", value: "replaced_to_service_details" },
      { text: "New Product Fleet", value: "replaced_from_service_details" },
      { text: "Customer", value: "customer_company_name" },
      { text: "Date", value: "created_on" },
    ],
    columnName: [
      { label: "Representative", value: "user_name" },
      { label: "Customer", value: "customer" },
      { label: "Contact Person", value: "contact_person" },
      { label: "Ticket ID", value: "ticket_id" },
      { label: "Old Serial Number", value: "old_serial_number" },
      { label: "Old Category", value: "old_category" },
      { label: "Old Product", value: "old_product" },
      { label: "New Serial Number", value: "new_serial_number" },
      { label: "New Category", value: "new_category" },
      { label: "New Product", value: "new_product" },
      { label: "Date", value: "updated_created_on" },
    ],
  }),
  watch: {
    dialogProductFleetTransferHistory(val) {
      if (val == true) {
        this.GetProductFleetTransHistoryMethod(this.StoreObj.user_id);
        this.tableHeight = window.innerHeight - 200;
      }
    },
  },
  methods: {
    exporttoexcel() {
      this.ListGetProductFleetTransHistory.map((item) => {
        item.updated_created_on = new Date(
          item.created_on * 1000
        ).toLocaleString("en-GB");
        item.old_serial_number =
          item.replaced_to_service_details.serial_number != undefined
            ? item.replaced_to_service_details.serial_number
            : "-";
        item.old_category =
          item.replaced_to_service_details.category_name != undefined
            ? item.replaced_to_service_details.category_name
            : "-";
        item.old_product =
          item.replaced_to_service_details.product_name != undefined
            ? item.replaced_to_service_details.product_name
            : "-";
        item.new_serial_number =
          item.replaced_from_service_details.serial_number != undefined
            ? item.replaced_from_service_details.serial_number
            : "-";
        item.new_category =
          item.replaced_from_service_details.category_name != undefined
            ? item.replaced_from_service_details.category_name
            : "-";
        item.new_product =
          item.replaced_from_service_details.product_name != undefined
            ? item.replaced_from_service_details.product_name
            : "-";
        item.customer =
          item.replaced_from_service_details.customer_company_name != undefined
            ? item.replaced_from_service_details.customer_company_name
            : "-";
        item.contact_person =
          item.replaced_from_service_details.customer_name != undefined
            ? item.replaced_from_service_details.customer_name
            : "-";
        item.ticket_id =
          item.replaced_from_service_details.ticket_id != undefined
            ? item.replaced_from_service_details.ticket_id
            : "-";
      });
      let data = [
        {
          sheet: "Product Fleet Transactions",
          columns: this.columnName,
          content: this.ListGetProductFleetTransHistory,
        },
      ];
      let settings = {
        fileName: "Product Fleet Transactions",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    DialogProductFleetTransHistoryEmit() {
      this.$emit("clicked");
      this.ListGetProductFleetTransHistory = [];
    },
  },
};
</script>

<style></style>
