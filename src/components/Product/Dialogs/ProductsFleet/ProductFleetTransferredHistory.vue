<template>
  <div>
    <v-dialog
      :value="dialogProductFleetTransferredHistory"
      persistent
      max-width="80%"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-history</v-icon>
            Product Fleet Trasferred History for
            <span>{{ StoreObj.setting_name }}</span>
          </div>
          <v-spacer />
          <v-btn
            icon
            @click="dialogProductFleetTransferredHistoryEmit()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            fixed-header
            :loading="loading"
            :no-data-text="noDataText"
            :items="transferred_history"
            :headers="TransferHistoryHeaders"
          >
            <template v-slot:[`item.action`]="{ item }">
              <div class="FontSize" v-if="item.action != undefined">
                {{ item.action }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.history_created_on`]="{ item }">
              <div v-if="item.history_created_on != undefined" class="FontSize">
                {{
                  new Date(item.history_created_on * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.action_taken_by`]="{ item }">
              <div v-if="item.action_taken_by != undefined" class="FontSize">
                {{ item.action_taken_by }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.transfered_from_name`]="{ item }">
              <div
                v-if="item.transfered_from_name != undefined"
                class="FontSize primary--text"
              >
                {{ item.transfered_from_name }}
              </div>
              <div v-else>-</div>
              <div
                class="FontSize"
                v-if="item.transfered_from_type != undefined"
              >
                {{ item.transfered_from_type.replaceAll("_", " ") }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.transfered_to_name`]="{ item }">
              <div v-if="item.transfered_to_name != undefined" class="FontSize">
                {{ item.transfered_to_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.product_fleet_status`]="{ item }">
              <div
                class="FontSize"
                v-if="item.product_fleet_status != undefined"
              >
                <span
                  class="yellow--text"
                  v-if="item.product_fleet_status == 'TRANSFERED'"
                >
                  {{ item.product_fleet_status }}
                </span>
                <span
                  class="orange--text"
                  v-else-if="item.product_fleet_status == 'REQUESTED'"
                >
                  {{ item.product_fleet_status }}
                </span>
                <span
                  class="red--text"
                  v-else-if="item.product_fleet_status == 'REJECTED'"
                >
                  {{ item.product_fleet_status }}
                </span>
                <span
                  class="green--text"
                  v-else-if="item.product_fleet_status == 'APPROVED'"
                >
                  {{ item.product_fleet_status }}
                </span>
                <span v-else class="primary--text">{{ item.product_fleet_status }}</span>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ListTransferProductFleetHistory } from "@/graphql/queries.js";
export default {
  props: {
    StoreObj: Object,
    dialogProductFleetTransferredHistory: Boolean,
  },
  data: () => ({
    noDataText: "",
    loading: false,
    transferred_history: [],
    TransferHistoryHeaders: [
      { text: "Action", value: "action", width: "40%" },
      { text: "Acted By", value: "action_taken_by" },
      { text: "Acted on", value: "history_created_on" },
      { text: "Transferred To", value: "transfered_to_name" },
      { text: "Status", value: "product_fleet_status" },
    ],
  }),
  watch: {
    dialogProductFleetTransferredHistory(val) {
      if (val == true) {
        this.getProductFleetHistoryMethod();
      }
    },
  },
  methods: {
    dialogProductFleetTransferredHistoryEmit() {
      this.$emit("clicked");
    },
    async getProductFleetHistoryMethod() {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListTransferProductFleetHistory, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              product_fleet_id: this.StoreObj.setting_id,
            },
          })
        );
        this.transferred_history = JSON.parse(
          result.data.ListTransferProductFleetHistory
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.transferred_history = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
  mounted() {},
};
</script>
