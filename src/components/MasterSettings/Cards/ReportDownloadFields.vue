<template>
  <div>
    <v-card elevation="0">
      <Overlay :overlay="overlay" />
      <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
      <v-expansion-panels class="mb-4 mr-3">
        <v-card outlined>
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold black--text"
              expand-icon="mdi-menu-down"
            >
              Tickets
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-tabs
                class="ma-2"
                v-model="tabs"
                background-color="transparent"
                color="primary"
              >
                <v-tab>Active</v-tab>
                <v-tab>Closed</v-tab>
                <v-tab>C1 Closed</v-tab>
              </v-tabs>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="12" sm="12" xs="12">
                      <h4>Fields</h4>
                      <div
                        style="
                          border: 2px dashed #ccc;
                          padding: 10px;
                          min-height: 150px;
                        "
                      >
                        <span
                          v-for="(chip, index) in this.tabs == 0
                            ? this.open_ticket_report_params
                            : this.tabs == 1
                            ? this.closed_ticket_report_params
                            : this.tabs == 2
                            ? this.c1_partially_closed_ticket_report_params
                            : []"
                          :key="chip.key"
                          :draggable="true"
                          @dragstart="dragStart(index, 'ticket')"
                          @dragover.prevent
                          @drop="drop(index, 'ticket')"
                          class="FontSize"
                        >
                          <v-chip class="ma-1 custom-chip" small>
                            {{ chip.header }}
                          </v-chip>
                        </span>
                      </div>
                    </v-col>
                    <v-col cols="12" md="12" xs="12" sm="12">
                      <h4>Positions</h4>
                      <div
                        class="drop-zone"
                        @dragover.prevent
                        @drop="handleDropInNewArea"
                        style="border: 2px dashed #ccc; min-height: 150px"
                      >
                        <v-chip
                          v-for="(chip, index) in this.tabs == 0
                            ? this.selected_open_ticket_report_params
                            : this.tabs == 1
                            ? this.selected_closed_ticket_report_params
                            : this.tabs == 2
                            ? this
                                .selected_c1_partially_closed_ticket_report_params
                            : undefined"
                          :key="chip.key"
                          :draggable="chip.header != 'Ticket ID' ? true : false"
                          @dragstart="dragStart(index, 'dropped')"
                          @dragover.prevent
                          @drop="drop(index, 'dropped')"
                          class="FontSize ma-1 custom-chip"
                          small
                        >
                          {{ index + 1 }}. {{ chip.header }}
                          <v-btn
                            icon
                            @click="deleteChip(index)"
                            v-if="chip.header != 'Ticket ID'"
                          >
                            <v-icon small color="red">mdi-close</v-icon>
                          </v-btn>
                        </v-chip>
                      </div>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      small
                      :loading="loading_btn"
                      class="primary white--text"
                      @click="saveParamsMethod()"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-expansion-panels>
      <v-expansion-panels class="mb-4 mr-3">
        <v-card outlined>
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold black--text"
              expand-icon="mdi-menu-down"
            >
              MRF
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-tabs
                class="ma-2"
                v-model="mrf_tabs"
                background-color="transparent"
                color="primary"
              >
                <v-tab>Pending</v-tab>
                <v-tab>Approved</v-tab>
                <v-tab>Rejected</v-tab>
                <v-tab>Inprogress</v-tab>
              </v-tabs>
              <v-card-text>
                <v-container>
                  <h4>Fields</h4>
                  <div
                    style="
                      border: 2px dashed #ccc;
                      padding: 10px;
                      min-height: 150px;
                    "
                  >
                    <span
                      v-for="(chip, index) in this.mrf_tabs == 0
                        ? this.pending_mrf_report_params
                        : this.mrf_tabs == 1
                        ? this.approved_mrf_report_params
                        : this.mrf_tabs == 2
                        ? this.rejected_mrf_report_params
                        : this.mrf_tabs == 3
                        ? this.inprogress_mrf_report_params
                        : []"
                      :key="`mrf-${mrf_tabs}-${chip.key}-${index}`"
                      :draggable="true"
                      @dragstart="dragStartMrf(index, 'ticket')"
                      @dragover.prevent
                      @drop="dropMrf(index, 'ticket')"
                      class="FontSize"
                    >
                      <v-chip class="ma-1 custom-chip" small>
                        {{ chip.header }}
                      </v-chip>
                    </span>
                  </div>
                  <h4>Positions</h4>
                  <div
                    class="drop-zone"
                    @dragover.prevent
                    @drop="handleDropInNewAreaMrf"
                    style="border: 2px dashed #ccc; min-height: 150px"
                  >
                    <v-chip
                      v-for="(chip, index) in this.mrf_tabs == 0
                        ? this.selected_pending_mrf_report_params
                        : this.mrf_tabs == 1
                        ? this.selected_approved_mrf_report_params
                        : this.mrf_tabs == 2
                        ? this.selected_rejected_mrf_report_params
                        : this.mrf_tabs == 3
                        ? this.selected_inprogress_mrf_report_params
                        : []"
                      :key="chip.key"
                      :draggable="chip.header != 'Ticket ID' ? true : false"
                      @dragstart="dragStartMrf(index, 'dropped')"
                      @dragover.prevent
                      @drop="dropMrf(index, 'dropped')"
                      class="FontSize ma-1 custom-chip"
                      small
                    >
                      {{ index + 1 }}. {{ chip.header }}
                      <v-btn
                        icon
                        @click="deleteChipMrf(index)"
                        v-if="chip.header != 'Ticket ID'"
                      >
                        <v-icon small color="red">mdi-close</v-icon>
                      </v-btn>
                    </v-chip>
                  </div>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      small
                      :loading="loading_btn"
                      class="primary white--text"
                      @click="saveMrfParamsMethod()"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-expansion-panels>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { ListGenerateExcelReportParams } from "@/graphql/queries.js";
import { UpdateGenerateExcelReportParams } from "@/graphql/mutations.js";
export default {
  components: {
    Overlay,
    Snackbar,
  },
  watch: {},
  data() {
    return {
      tabs: 0,
      mrf_tabs: 0,
      overlay: false,
      renderComp: true,
      loading_btn: false,
      draggedFrom: null,
      draggedChip: null,
      GetReportFieldsList: [],
      open_ticket_report_params: [],
      pending_mrf_report_params: [],
      rejected_mrf_report_params: [],
      approved_mrf_report_params: [],
      closed_ticket_report_params: [],
      inprogress_mrf_report_params: [],
      selected_open_ticket_report_params: [],
      selected_pending_mrf_report_params: [],
      selected_approved_mrf_report_params: [],
      selected_rejected_mrf_report_params: [],
      selected_closed_ticket_report_params: [],
      selected_inprogress_mrf_report_params: [],
      c1_partially_closed_ticket_report_params: [],
      SnackBarComponent: {},
    };
  },
  mounted() {
    this.GetListGenerateExcelReportParams();
  },
  methods: {
    reportsFieldsEmit(Status_Message, status) {
      this.$emit("clicked", Status_Message, status);
    },
    async saveMrfParamsMethod() {
      if (
        this.mrf_tabs == 0 &&
        this.selected_pending_mrf_report_params.some((obj) =>
          obj.hasOwnProperty("originalIndex")
        )
      ) {
        let removingKey = "originalIndex";
        const newArray = this.selected_pending_mrf_report_params.map((obj) => {
          const { [removingKey]: _, ...rest } = obj;
          return rest;
        });
        this.selected_pending_mrf_report_params = newArray;
      } else if (
        this.mrf_tabs == 1 &&
        this.selected_approved_mrf_report_params.some((obj) =>
          obj.hasOwnProperty("originalIndex")
        )
      ) {
        let removingKey = "originalIndex";
        const newArray = this.selected_approved_mrf_report_params.map((obj) => {
          const { [removingKey]: _, ...rest } = obj;
          return rest;
        });
        this.selected_approved_mrf_report_params = newArray;
      } else if (
        this.mrf_tabs == 2 &&
        this.selected_rejected_mrf_report_params.some((obj) =>
          obj.hasOwnProperty("originalIndex")
        )
      ) {
        let removingKey = "originalIndex";
        const newArray = this.selected_rejected_mrf_report_params.map((obj) => {
          const { [removingKey]: _, ...rest } = obj;
          return rest;
        });
        this.selected_rejected_mrf_report_params = newArray;
      } else if (
        this.mrf_tabs == 3 &&
        this.selected_inprogress_mrf_report_params.some((obj) =>
          obj.hasOwnProperty("originalIndex")
        )
      ) {
        let removingKey = "originalIndex";
        const newArray = this.selected_inprogress_mrf_report_params.map(
          (obj) => {
            const { [removingKey]: _, ...rest } = obj;
            return rest;
          }
        );
        this.selected_inprogress_mrf_report_params = newArray;
      }
      var mutationname = UpdateGenerateExcelReportParams;
      var mutationresult = "UpdateGenerateExcelReportParams";
      var inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        pending_mrf_report_params:
          this.mrf_tabs == 0 ? this.pending_mrf_report_params : undefined,
        selected_pending_mrf_report_params:
          this.mrf_tabs == 0
            ? this.selected_pending_mrf_report_params
            : undefined,
        approved_mrf_report_params:
          this.mrf_tabs == 1 ? this.approved_mrf_report_params : undefined,
        selected_approved_mrf_report_params:
          this.mrf_tabs == 1
            ? this.selected_approved_mrf_report_params
            : undefined,
        rejected_mrf_report_params:
          this.mrf_tabs == 2 ? this.rejected_mrf_report_params : undefined,
        selected_rejected_mrf_report_params:
          this.mrf_tabs == 2
            ? this.selected_rejected_mrf_report_params
            : undefined,
        inprogress_mrf_report_params:
          this.mrf_tabs == 3 ? this.inprogress_mrf_report_params : undefined,
        selected_inprogress_mrf_report_params:
          this.mrf_tabs == 3
            ? this.selected_inprogress_mrf_report_params
            : undefined,
      };
      try {
        this.loading_btn = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutationresult]);
        if (ResultObject.status == "SUCCESS") {
          this.reportsFieldsEmit(ResultObject.Status_Message, "SUCCESS");
        }
        this.loading_btn = false;
      } catch (error) {
        this.loading_btn = false;
        this.reportsFieldsEmit(error.errors[0].message, "ERROR");
      }
    },
    async saveParamsMethod() {
      if (
        this.tabs == 0 &&
        this.selected_open_ticket_report_params.some((obj) =>
          obj.hasOwnProperty("originalIndex")
        )
      ) {
        let removingKey = "originalIndex";
        const newArray = this.selected_open_ticket_report_params.map((obj) => {
          const { [removingKey]: _, ...rest } = obj;
          return rest;
        });
        this.selected_open_ticket_report_params = newArray;
      } else if (
        this.tabs == 1 &&
        this.selected_closed_ticket_report_params.some((obj) =>
          obj.hasOwnProperty("originalIndex")
        )
      ) {
        let removingKey = "originalIndex";
        const newArray = this.selected_closed_ticket_report_params.map(
          (obj) => {
            const { [removingKey]: _, ...rest } = obj;
            return rest;
          }
        );
        this.selected_closed_ticket_report_params = newArray;
      } else if (
        this.tabs == 2 &&
        this.selected_c1_partially_closed_ticket_report_params.some((obj) =>
          obj.hasOwnProperty("originalIndex")
        )
      ) {
        let removingKey = "originalIndex";
        const newArray =
          this.selected_c1_partially_closed_ticket_report_params.map((obj) => {
            const { [removingKey]: _, ...rest } = obj;
            return rest;
          });
        this.selected_c1_partially_closed_ticket_report_params = newArray;
      }
      var mutationname = UpdateGenerateExcelReportParams;
      var mutationresult = "UpdateGenerateExcelReportParams";
      var inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        open_ticket_report_params:
          this.tabs == 0 ? this.open_ticket_report_params : undefined,
        selected_open_ticket_report_params:
          this.tabs == 0 ? this.selected_open_ticket_report_params : undefined,
        closed_ticket_report_params:
          this.tabs == 1 ? this.closed_ticket_report_params : undefined,
        selected_closed_ticket_report_params:
          this.tabs == 1
            ? this.selected_closed_ticket_report_params
            : undefined,
        c1_partially_closed_ticket_report_params:
          this.tabs == 2
            ? this.c1_partially_closed_ticket_report_params
            : undefined,
        selected_c1_partially_closed_ticket_report_params:
          this.tabs == 2
            ? this.selected_c1_partially_closed_ticket_report_params
            : undefined,
      };
      try {
        this.loading_btn = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutationresult]);
        if (ResultObject.status == "SUCCESS") {
          this.reportsFieldsEmit(ResultObject.Status_Message, "SUCCESS");
        }
        this.loading_btn = false;
      } catch (error) {
        this.loading_btn = false;
        this.reportsFieldsEmit(error.errors[0].message, "ERROR");
      }
    },
    async GetListGenerateExcelReportParams() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListGenerateExcelReportParams, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
            },
          })
        );
        this.GetReportFieldsList = JSON.parse(
          result.data.ListGenerateExcelReportParams
        ).data.items[0];
        this.open_ticket_report_params =
          this.GetReportFieldsList.open_ticket_report_params;
        this.closed_ticket_report_params =
          this.GetReportFieldsList.closed_ticket_report_params;
        this.c1_partially_closed_ticket_report_params =
          this.GetReportFieldsList.c1_partially_closed_ticket_report_params;
        this.selected_open_ticket_report_params =
          this.GetReportFieldsList.selected_open_ticket_report_params;
        this.selected_closed_ticket_report_params =
          this.GetReportFieldsList.selected_closed_ticket_report_params;
        this.selected_c1_partially_closed_ticket_report_params =
          this.GetReportFieldsList.selected_c1_partially_closed_ticket_report_params;
        this.pending_mrf_report_params =
          this.GetReportFieldsList.pending_mrf_report_params;
        this.approved_mrf_report_params =
          this.GetReportFieldsList.approved_mrf_report_params;
        this.inprogress_mrf_report_params =
          this.GetReportFieldsList.inprogress_mrf_report_params;
        this.rejected_mrf_report_params =
          this.GetReportFieldsList.rejected_mrf_report_params;
        this.selected_pending_mrf_report_params =
          this.GetReportFieldsList.selected_pending_mrf_report_params;
        this.selected_inprogress_mrf_report_params =
          this.GetReportFieldsList.selected_inprogress_mrf_report_params;
        this.selected_rejected_mrf_report_params =
          this.GetReportFieldsList.selected_rejected_mrf_report_params;
        this.selected_approved_mrf_report_params =
          this.GetReportFieldsList.selected_approved_mrf_report_params;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetReportFieldsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
    dragStart(index, list) {
      this.draggedChip = index;
      this.draggedFrom = list;
    },
    dragStartMrf(index, list) {
      this.draggedChip = index;
      this.draggedFrom = list;
    },
    dropMrf(index, list) {
      if (this.draggedChip !== null) {
        if (this.draggedFrom === list) {
          if (list === "ticket") {
            const draggedChip =
              this.mrf_tabs == 0
                ? this.pending_mrf_report_params[this.draggedChip]
                : this.mrf_tabs == 1
                ? this.approved_mrf_report_params[this.draggedChip]
                : this.mrf_tabs == 2
                ? this.rejected_mrf_report_params[this.draggedChip]
                : this.mrf_tabs == 3
                ? this.inprogress_mrf_report_params[this.draggedChip]
                : undefined;
            this.mrf_tabs == 0
              ? this.pending_mrf_report_params.splice(this.draggedChip, 1)
              : this.mrf_tabs == 1
              ? this.approved_mrf_report_params.splice(this.draggedChip, 1)
              : this.mrf_tabs == 2
              ? this.rejected_mrf_report_params.splice(this.draggedChip, 1)
              : this.mrf_tabs == 3
              ? this.inprogress_mrf_report_params.splice(this.draggedChip, 1)
              : undefined;
            this.mrf_tabs == 0
              ? this.pending_mrf_report_params.splice(index, 0, draggedChip)
              : this.mrf_tabs == 1
              ? this.approved_mrf_report_params.splice(index, 0, draggedChip)
              : this.mrf_tabs == 2
              ? this.rejected_mrf_report_params.splice(index, 0, draggedChip)
              : this.mrf_tabs == 3
              ? this.inprogress_mrf_report_params.splice(index, 0, draggedChip)
              : undefined;
          } else if (list === "dropped") {
            const draggedChip =
              this.mrf_tabs == 0
                ? this.selected_pending_mrf_report_params[this.draggedChip]
                : this.mrf_tabs == 1
                ? this.selected_approved_mrf_report_params[this.draggedChip]
                : this.mrf_tabs == 2
                ? this.selected_rejected_mrf_report_params[this.draggedChip]
                : this.mrf_tabs == 3
                ? this.selected_inprogress_mrf_report_params[this.draggedChip]
                : undefined;
            this.mrf_tabs == 0
              ? this.selected_pending_mrf_report_params.splice(
                  this.draggedChip,
                  1
                )
              : this.mrf_tabs == 1
              ? this.selected_approved_mrf_report_params.splice(
                  this.draggedChip,
                  1
                )
              : this.mrf_tabs == 2
              ? this.selected_rejected_mrf_report_params.splice(
                  this.draggedChip,
                  1
                )
              : this.mrf_tabs == 3
              ? this.selected_inprogress_mrf_report_params.splice(
                  this.draggedChip,
                  1
                )
              : undefined;
            this.mrf_tabs == 0
              ? this.selected_pending_mrf_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : this.mrf_tabs == 1
              ? this.selected_approved_mrf_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : this.mrf_tabs == 2
              ? this.selected_rejected_mrf_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : this.mrf_tabs == 3
              ? this.selected_inprogress_mrf_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : undefined;
          }
        }
        this.draggedChip = null;
        this.draggedFrom = null;
      }
    },
    drop(index, list) {
      if (this.draggedChip !== null) {
        if (this.draggedFrom === list) {
          if (list === "ticket") {
            const draggedChip =
              this.tabs == 0
                ? this.open_ticket_report_params[this.draggedChip]
                : this.tabs == 1
                ? this.closed_ticket_report_params[this.draggedChip]
                : this.tabs == 2
                ? this.c1_partially_closed_ticket_report_params[
                    this.draggedChip
                  ]
                : undefined;
            this.tabs == 0
              ? this.open_ticket_report_params.splice(this.draggedChip, 1)
              : this.tabs == 1
              ? this.closed_ticket_report_params.splice(this.draggedChip, 1)
              : this.tabs == 2
              ? this.c1_partially_closed_ticket_report_params.splice(
                  this.draggedChip,
                  1
                )
              : undefined;
            this.tabs == 0
              ? this.open_ticket_report_params.splice(index, 0, draggedChip)
              : this.tabs == 1
              ? this.closed_ticket_report_params.splice(index, 0, draggedChip)
              : this.tabs == 2
              ? this.c1_partially_closed_ticket_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : undefined;
          } else if (list === "dropped") {
            const draggedChip =
              this.tabs == 0
                ? this.selected_open_ticket_report_params[this.draggedChip]
                : this.tabs == 1
                ? this.selected_closed_ticket_report_params[this.draggedChip]
                : this.tabs == 2
                ? this.selected_c1_partially_closed_ticket_report_params[
                    this.draggedChip
                  ]
                : undefined;
            this.tabs == 0
              ? this.selected_open_ticket_report_params.splice(
                  this.draggedChip,
                  1
                )
              : this.tabs == 1
              ? this.selected_closed_ticket_report_params.splice(
                  this.draggedChip,
                  1
                )
              : this.tabs == 2
              ? this.selected_c1_partially_closed_ticket_report_params.splice(
                  this.draggedChip,
                  1
                )
              : undefined;
            this.tabs == 0
              ? this.selected_open_ticket_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : this.tabs == 1
              ? this.selected_closed_ticket_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : this.tabs == 2
              ? this.selected_c1_partially_closed_ticket_report_params.splice(
                  index,
                  0,
                  draggedChip
                )
              : undefined;
          }
        }
        this.draggedChip = null;
        this.draggedFrom = null;
      }
    },
    handleDropInNewAreaMrf() {
      if (this.draggedChip !== null && this.draggedFrom === "ticket") {
        if (this.mrf_tabs == 0) {
          this.selected_pending_mrf_report_params.push({
            key: this.pending_mrf_report_params[this.draggedChip].key,
            header: this.pending_mrf_report_params[this.draggedChip].header,
            width: this.pending_mrf_report_params[this.draggedChip].width,
            originalIndex: this.draggedChip,
          });
          this.pending_mrf_report_params.splice(this.draggedChip, 1);
          this.draggedChip = null;
          this.draggedFrom = null;
        } else if (this.mrf_tabs == 1) {
          this.selected_approved_mrf_report_params.push({
            key: this.approved_mrf_report_params[this.draggedChip].key,
            header: this.approved_mrf_report_params[this.draggedChip].header,
            width: this.approved_mrf_report_params[this.draggedChip].width,
            originalIndex: this.draggedChip,
          });
          this.approved_mrf_report_params.splice(this.draggedChip, 1);
          this.draggedChip = null;
          this.draggedFrom = null;
        } else if (this.mrf_tabs == 2) {
          this.selected_rejected_mrf_report_params.push({
            key: this.rejected_mrf_report_params[this.draggedChip].key,
            header: this.rejected_mrf_report_params[this.draggedChip].header,
            width: this.rejected_mrf_report_params[this.draggedChip].width,
            originalIndex: this.draggedChip,
          });
          this.rejected_mrf_report_params.splice(this.draggedChip, 1);
          this.draggedChip = null;
          this.draggedFrom = null;
        } else if (this.mrf_tabs == 3) {
          this.selected_inprogress_mrf_report_params.push({
            key: this.inprogress_mrf_report_params[this.draggedChip].key,
            header: this.inprogress_mrf_report_params[this.draggedChip].header,
            width: this.inprogress_mrf_report_params[this.draggedChip].width,
            originalIndex: this.draggedChip,
          });
          this.inprogress_mrf_report_params.splice(this.draggedChip, 1);
          this.draggedChip = null;
          this.draggedFrom = null;
        }
        this.draggedChip = null;
        this.draggedFrom = null;
      }
    },
    handleDropInNewArea() {
      if (this.draggedChip !== null && this.draggedFrom === "ticket") {
        if (this.tabs == 0) {
          this.selected_open_ticket_report_params.push({
            key: this.open_ticket_report_params[this.draggedChip].key,
            header: this.open_ticket_report_params[this.draggedChip].header,
            width: this.open_ticket_report_params[this.draggedChip].width,
            originalIndex: this.draggedChip,
          });
          this.open_ticket_report_params.splice(this.draggedChip, 1);
          this.draggedChip = null;
          this.draggedFrom = null;
        } else if (this.tabs == 1) {
          this.selected_closed_ticket_report_params.push({
            key: this.closed_ticket_report_params[this.draggedChip].key,
            header: this.closed_ticket_report_params[this.draggedChip].header,
            width: this.closed_ticket_report_params[this.draggedChip].width,
            originalIndex: this.draggedChip,
          });
          this.closed_ticket_report_params.splice(this.draggedChip, 1);
          this.draggedChip = null;
          this.draggedFrom = null;
        } else if (this.tabs == 2) {
          this.selected_c1_partially_closed_ticket_report_params.push({
            key: this.c1_partially_closed_ticket_report_params[this.draggedChip]
              .key,
            header:
              this.c1_partially_closed_ticket_report_params[this.draggedChip]
                .header,
            width:
              this.c1_partially_closed_ticket_report_params[this.draggedChip]
                .width,
            originalIndex: this.draggedChip,
          });
          this.c1_partially_closed_ticket_report_params.splice(
            this.draggedChip,
            1
          );
          this.draggedChip = null;
          this.draggedFrom = null;
        }
        this.draggedChip = null;
        this.draggedFrom = null;
      }
    },
    deleteChipMrf(index) {
      const chip =
        this.mrf_tabs == 0
          ? this.selected_pending_mrf_report_params[index]
          : this.mrf_tabs == 1
          ? this.selected_approved_mrf_report_params[index]
          : this.mrf_tabs == 2
          ? this.selected_rejected_mrf_report_params[index]
          : this.mrf_tabs == 3
          ? this.selected_inprogress_mrf_report_params[index]
          : undefined;
      this.mrf_tabs == 0
        ? this.pending_mrf_report_params.splice(chip.originalIndex, 0, chip)
        : this.mrf_tabs == 1
        ? this.approved_mrf_report_params.splice(chip.originalIndex, 0, chip)
        : this.mrf_tabs == 2
        ? this.rejected_mrf_report_params.splice(chip.originalIndex, 0, chip)
        : this.mrf_tabs == 3
        ? this.inprogress_mrf_report_params.splice(chip.originalIndex, 0, chip)
        : undefined;
      this.mrf_tabs == 0
        ? this.selected_pending_mrf_report_params.splice(index, 1)
        : this.mrf_tabs == 1
        ? this.selected_approved_mrf_report_params.splice(index, 1)
        : this.mrf_tabs == 2
        ? this.selected_rejected_mrf_report_params.splice(index, 1)
        : this.mrf_tabs == 3
        ? this.selected_inprogress_mrf_report_params.splice(index, 1)
        : undefined;
    },
    deleteChip(index) {
      const chip =
        this.tabs == 0
          ? this.selected_open_ticket_report_params[index]
          : this.tabs == 1
          ? this.selected_closed_ticket_report_params[index]
          : this.tabs == 2
          ? this.selected_c1_partially_closed_ticket_report_params[index]
          : undefined;
      this.tabs == 0
        ? this.open_ticket_report_params.splice(chip.originalIndex, 0, chip)
        : this.tabs == 1
        ? this.closed_ticket_report_params.splice(chip.originalIndex, 0, chip)
        : this.tabs == 2
        ? this.c1_partially_closed_ticket_report_params.splice(
            chip.originalIndex,
            0,
            chip
          )
        : undefined;
      this.tabs == 0
        ? this.selected_open_ticket_report_params.splice(index, 1)
        : this.tabs == 1
        ? this.selected_closed_ticket_report_params.splice(index, 1)
        : this.tabs == 2
        ? this.selected_c1_partially_closed_ticket_report_params.splice(
            index,
            1
          )
        : undefined;
    },
  },
};
</script>
<style scoped>
.custom-chip:hover {
  background-color: purple !important; /* Change this to your desired color */
  color: white; /* Optional: change the text color */
}
</style>
