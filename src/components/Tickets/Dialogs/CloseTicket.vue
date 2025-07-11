<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="closeDilaog"
      persistent
      :width="selected_files.length == 0 ? '600px' : '1000px'"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-close-circle-outline</v-icon>Close
            Ticket
            <div
              class="xsmallFontSize"
              v-if="StoreObj.custom_ticket_id == undefined"
            >
              ({{ StoreObj.ticket_id }})
            </div>
            <div
              class="xsmallFontSize"
              v-else-if="StoreObj.custom_ticket_id != undefined"
            >
              ({{ StoreObj.custom_ticket_id }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogCloseEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="selected_files.length != 0 ? 4 : 12"
            >
              <v-form ref="form">
                <v-select
                  dense
                  outlined
                  class="FontSize"
                  label="Closure Remark *"
                  item-text="setting_name"
                  item-value="setting_name"
                  v-model="closure_remarks"
                  :rules="[(v) => !!v || 'Required']"
                  :items="
                    GetAllClosureRemarksList.filter(
                      (item) => item.setting_name != 'ALL'
                    )
                  "
                >
                </v-select>
                <v-textarea
                  outlined
                  rows="2"
                  label="Comments *"
                  v-model="comments"
                  class="FontSize mt-n2"
                  :rules="[(v) => !!v || 'Required']"
                ></v-textarea>
                <v-btn
                  v-if="addServices === false"
                  block
                  color="primary"
                  class="text-capitalize mb-8"
                  @click="addServices = true"
                >
                  Add Services & Cost
                </v-btn>
                <v-row align="center" v-if="addServices">
                  <v-col cols="12" lg="3" class="d-flex justify-left pt-0 pb-0">
                    <v-select
                      dense
                      outlined
                      class="FontSize mt-n2"
                      label="Services"
                      v-model="serviceSelected"
                      :items="serviceList"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    class="d-flex justify-left pt-0 pb-0"
                    v-if="serviceSelected === 'Travel Allowance'"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="FontSize mt-n2"
                      label="Travel Distance(Km)"
                      v-model="travelDistance"
                    />
                  </v-col>
                  <v-col cols="12" lg="3" class="d-flex justify-left pt-0 pb-0">
                    <v-text-field
                      dense
                      outlined
                      label="Cost*"
                      v-model="serviceCost"
                      class="FontSize mb-2"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="3" class="d-flex justify-left pt-0 pb-0">
                    <div
                      class="d-flex"
                      style="position: relative; bottom: 15px"
                    >
                      <div class="mr-2">
                        <v-btn
                          small
                          color="green"
                          @click="addServicesMethod()"
                          :disabled="serviceList.length === 0"
                        >
                          <v-icon color="white" small>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-col>
                  <div class="mb-8 mx-auto" style="width: 100%">
                    <v-data-table
                      dense
                      :headers="servicesHeader"
                      :items="serviceArray"
                      hide-default-footer
                      class="TableValFontsize"
                    >
                      <template v-slot:[`item.delete`]="{ item, index }">
                        <div>
                          <v-btn icon @click="deleteServiceMethod(item, index)"
                            ><v-icon small color="red"
                              >mdi-delete</v-icon
                            ></v-btn
                          >
                        </div>
                      </template>
                    </v-data-table>
                  </div>
                </v-row>
                <div>
                  <div class="d-flex align-center">
                    <div>
                      <span>
                        <strong>
                          Have you used or replace material that you requested?
                        </strong>
                      </span>
                    </div>
                    <div class="ms-auto">
                      <v-checkbox v-model="enableApprovedDetails"></v-checkbox>
                    </div>
                  </div>
                  <v-expansion-panels
                    v-if="enableApprovedDetails"
                    elevation="0"
                    class="FontSize"
                  >
                    <v-expansion-panel
                      v-for="(mrfApprovedDetail, index) in mrfApprovedDetails"
                      :key="index"
                      class="mt-2 mb-2"
                    >
                      <v-expansion-panel-header>
                        <span class="FontSize">
                          <strong> Component </strong>:
                          {{ mrfApprovedDetail.component_name }}
                        </span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <div class="FontSize text-left">
                          <strong> Component Code: </strong>
                          {{ mrfApprovedDetail.component_code || "-" }}
                        </div>
                        <div class="FontSize text-left">
                          <strong> Component Description: </strong>
                          {{ mrfApprovedDetail.component_description || "-" }}
                        </div>
                        <div class="FontSize text-left">
                          <strong> Requested From: </strong>
                          {{ mrfApprovedDetail.requested_from || "-" }}
                        </div>
                        <div class="FontSize text-left">
                          <strong> Requested Quantity: </strong>
                          {{
                            mrfApprovedDetail.requested_component_quantity ?? 0
                          }}
                        </div>
                        <!-- <div class="FontSize text-left">
                          <strong> Approved Quantity: </strong>
                          {{
                            mrfApprovedDetail.approved_component_quantity ?? 0
                          }}
                        </div> -->
                        <div class="FontSize text-left">
                          <strong> Org Approved Quantity: </strong>
                          {{ mrfApprovedDetail.store_approve_count ?? 0 }}
                        </div>
                        <div class="FontSize text-left">
                          <strong> Own Stock Approved Quantity: </strong>
                          {{ mrfApprovedDetail.own_stock_approve_count ?? 0 }}
                        </div>
                        <div class="FontSize text-left">
                          <span>
                            <strong> Consumed Org Approved Quantity: </strong>
                            <span v-if="consumedOrgQuantitySaved">
                              {{ storeConsumedCount }}
                            </span>
                            <span v-else>
                              {{
                                mrfApprovedDetail.store_consumed_count ??
                                mrfApprovedDetail.store_approve_count ??
                                0
                              }}
                            </span>
                          </span>
                          <v-btn
                            icon
                            @click="editConOrgAppMethod(index)"
                            v-if="editConOrgAppBtn"
                            v-show="
                              mrfApprovedDetail.store_approve_count &&
                              mrfApprovedDetail.store_approve_count > 0
                            "
                          >
                            <v-icon color="green" small>mdi-pencil</v-icon>
                          </v-btn>
                          <div class="d-flex justify-left mt-1" v-else>
                            <v-text-field
                              v-model="usedQuantity"
                              label="Consumed Quantity"
                              dense
                              outlined
                              class="FontSize widthSmall"
                            >
                            </v-text-field>
                            <v-btn
                              dense
                              small
                              color="primary"
                              class="ml-2"
                              @click="saveConsumedQuantityMethod(index, 'ORG')"
                              >Ok</v-btn
                            >
                          </div>
                        </div>
                        <div class="FontSize text-left">
                          <span>
                            <strong>
                              Consumed Own Stock Approved Quantity:
                            </strong>
                            <span v-if="consumedOwnStockQuantitySaved">
                              {{ ownStockConsumedCount }}
                            </span>
                            <span v-else>
                              {{
                                mrfApprovedDetail.own_stock_consumed_count ??
                                mrfApprovedDetail.own_stock_approve_count ??
                                0
                              }}
                            </span>
                          </span>
                          <v-btn
                            icon
                            @click="editOwnStockAppMethod(index)"
                            v-show="
                              mrfApprovedDetail.own_stock_approve_count &&
                              mrfApprovedDetail.own_stock_approve_count > 0
                            "
                            v-if="editOwnStockAppBtn"
                          >
                            <v-icon color="green" small>mdi-pencil</v-icon>
                          </v-btn>
                          <div class="d-flex justify-left mt-1" v-else>
                            <v-text-field
                              v-model="usedQuantity"
                              label="Consumed Quantity"
                              dense
                              outlined
                              class="FontSize widthSmall"
                            >
                            </v-text-field>
                            <v-btn
                              dense
                              small
                              color="primary"
                              class="ml-2"
                              @click="saveConsumedQuantityMethod(index, 'OWN')"
                              >Ok</v-btn
                            >
                          </div>
                        </div>
                        <div class="FontSize text-left">
                          <strong>Pending Quantity: </strong>
                          {{
                            mrfApprovedDetail.pending_component_quantity || 0
                          }}
                        </div>
                        <!-- <div
                          class="FontSize text-left"
                          v-if="usedQuantitySaved"
                          style="position: relative; bottom: 5px"
                        >
                          <strong> Used Quantity: </strong>
                          {{ mrfApprovedDetail.used_component_quantity ?? 0 }}
                          <v-btn icon @click="editUsedQuantityMethod(index)">
                            <v-icon color="green" small>mdi-pencil</v-icon>
                          </v-btn>
                        </div> -->
                        <!-- <div class="d-flex justify-left mt-1" v-else>
                          <v-text-field
                            v-model="usedQuantity"
                            label="Used Quantity"
                            dense
                            outlined
                            class="FontSize widthSmall"
                          >
                          </v-text-field>
                          <v-btn
                            dense
                            small
                            color="primary"
                            class="ml-2"
                            @click="saveUsedQunatityMethod(index)"
                            >Ok</v-btn
                          >
                        </div> -->

                        <div class="d-flex justify-end">
                          <v-btn icon @click="deleteApprovedMrfMethod(index)">
                            <v-icon color="red" small>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
                <div class="mt-7">
                  <v-file-input
                    dense
                    outlined
                    multiple
                    v-model="files"
                    label="File input"
                    :prepend-icon="null"
                    class="FontSize mt-n2"
                    append-icon="mdi-paperclip"
                  >
                  </v-file-input>
                </div>
              </v-form>
            </v-col>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="8"
              v-if="selected_files.length != 0"
            >
              <div
                v-if="selected_files.length != 0"
                class="font-weight-bold mt-1"
              >
                Selected Files
              </div>
              <v-data-table
                dense
                class="elevation-0"
                :items="selected_files"
                :headers="selected_files_header"
                v-if="selected_files.length != 0"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ selected_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <div class="FontSize">
                    {{ item.name }}
                  </div>
                </template>
                <template v-slot:[`item.type`]="{ item }">
                  <div class="FontSize">
                    {{ item.type }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn
                    icon
                    color="red"
                    @click="
                      selected_files.splice(selected_files.indexOf(item), 1)
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="loading"
            @click="validateMethod()"
            class="white--text mb-2"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { CloseTicket } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllClouserRemarks } from "@/mixins/MastersSetting/GetAllClouserRemarks.js";
import { GetTicketServices } from "@/graphql/queries.js";
import { listApprovedComponentForTheTicket } from "@/graphql/queries.js";
import { UpdateMRFApprovedDetailsInTicket } from "@/graphql/mutations.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
var aws = require("aws-sdk");
export default {
  props: {
    StoreObj: Object,
    closeDilaog: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GenerateS3URL, GetAllClouserRemarks, GetTicketDetails],
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: false,
    comments: "",
    closure_remarks: "",
    SnackBarComponent: {},
    files: [],
    s3_files: [],
    selected_files: [],
    GetAllClosureRemarksList: [],
    s3_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    serviceList: [],
    serviceSelected: "",
    addServices: false,
    sectionNo: null,
    serviceCost: "",
    servicesHeader: [
      { text: "Service Name", value: "service_name" },
      { text: "Travel Distance", value: "travel_distance" },
      { text: "Service Cost", value: "service_charge" },
      { text: "Delete", value: "delete" },
    ],
    serviceArray: [],
    serviceObjForApi: {},
    enableApprovedDetails: false,
    mrfApprovedDetails: [],
    usedQuantity: 0,
    usedQuantitySaved: true,
    editConOrgAppBtn: true,
    showConOrgAppQuantityField: false,
    editOwnStockAppBtn: true,
    showOwnStockAppQuantityField: false,
    ownStockConsumedCount: undefined,
    storeConsumedCount: undefined,
    consumedOrgQuantitySaved: false,
    consumedOwnStockQuantitySaved: false,
  }),
  watch: {
    // serviceCost(val) {
    //   const numericVal = parseFloat(val);
    //   if (isNaN(numericVal)) {
    //     this.renderComp = false;
    //     this.$nextTick(() => {
    //       this.SnackBarComponent = {
    //         SnackbarVmodel: true,
    //         SnackbarColor: "red",
    //         Top: true,
    //         SnackbarText: "Kindly provide a valid number",
    //       };
    //       this.renderComp = true;
    //     });
    //     this.serviceCost = "";
    //   }
    // },
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    async closeDilaog(val) {
      if (val == true) {
        console.log("CLOSE_TICKET", this.StoreObj);
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.GetAllClosureRemarksMethod("ACTIVE");
        this.getServicesMethod();
      }
    },
    async enableApprovedDetails(val) {
      if (val) {
        if (this.StoreObj.mrf_approved_details?.length > 0) {
          this.mrfApprovedDetails = this.StoreObj.mrf_approved_details;
        } else {
          await this.callApprovedComponentListMethod();
        }
      }
    },
  },
  methods: {
    editConOrgAppMethod() {
      this.showConOrgAppQuantityField = true;
      this.editConOrgAppBtn = false;
    },
    editOwnStockAppMethod() {
      this.showOwnStockAppQuantityField = true;
      this.editOwnStockAppBtn = false;
    },
    saveConsumedQuantityMethod(index, from) {
      const inputQty = Math.round(Number(this.usedQuantity));
      if (from === "ORG") {
        if (inputQty > this.mrfApprovedDetails[index].store_approve_count) {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Shouldn't exceed limit of (Org Approved Qunatity)",
            };
            this.renderComp = true;
          });
        } else {
          this.storeConsumedCount = inputQty;
          this.mrfApprovedDetails[index].store_consumed_count =
            this.storeConsumedCount;
          this.mrfApprovedDetails[index].pending_component_quantity =
            Number(this.mrfApprovedDetails[index].store_approve_count || 0) +
            Number(
              this.mrfApprovedDetails[index].own_stock_approve_count || 0
            ) -
            (Number(this.mrfApprovedDetails[index].store_consumed_count || 0) +
              Number(
                this.mrfApprovedDetails[index].own_stock_consumed_count || 0
              ));
          this.editConOrgAppBtn = true;
          this.consumedOrgQuantitySaved = true;
        }
      } else {
        if (inputQty > this.mrfApprovedDetails[index].own_stock_approve_count) {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText:
                "Shouldn't exceed limit of (Own Stock Approved Qunatity)",
            };
            this.renderComp = true;
          });
        } else {
          this.ownStockConsumedCount = inputQty;
          this.mrfApprovedDetails[index].own_stock_consumed_count =
            this.ownStockConsumedCount;
          this.mrfApprovedDetails[index].pending_component_quantity =
            Number(this.mrfApprovedDetails[index].store_approve_count || 0) +
            Number(
              this.mrfApprovedDetails[index].own_stock_approve_count || 0
            ) -
            (Number(this.mrfApprovedDetails[index].store_consumed_count || 0) +
              Number(
                this.mrfApprovedDetails[index].own_stock_consumed_count || 0
              ));
          this.editOwnStockAppBtn = true;
          this.consumedOwnStockQuantitySaved = true;
        }
      }
    },
    // saveConsumedQuantityMethod(index, from) {
    //   const inputQty = Math.round(Number(this.usedQuantity));
    //   const detail = this.mrfApprovedDetails[index];
    //   const isOrg = from === "ORG";
    //   const approvedKey = isOrg
    //     ? "store_approve_count"
    //     : "own_stock_approve_count";
    //   const consumedKey = isOrg
    //     ? "store_consumed_count"
    //     : "own_stock_consumed_count";
    //   const editBtnKey = isOrg ? "editConOrgAppBtn" : "editOwnStockAppBtn";
    //   const approvedLimit = Number(detail[approvedKey] || 0);
    //   if (inputQty > approvedLimit) {
    //     this.renderComp = false;
    //     this.$nextTick(() => {
    //       this.SnackBarComponent = {
    //         SnackbarVmodel: true,
    //         SnackbarColor: "red",
    //         Top: true,
    //         SnackbarText: `Shouldn't exceed limit of (${
    //           isOrg ? "Org" : "Own Stock"
    //         } Approved Quantity)`,
    //       };
    //       this.renderComp = true;
    //     });
    //   } else {
    //     if (isOrg) {
    //       this.storeConsumedCount = inputQty;
    //     } else {
    //       this.ownStockConsumedCount = inputQty;
    //     }
    //     detail[consumedKey] = inputQty;
    //     const totalApproved =
    //       Number(detail.store_approve_count || 0) +
    //       Number(detail.own_stock_approve_count || 0);
    //     const totalConsumed =
    //       Number(detail.store_consumed_count || 0) +
    //       Number(detail.own_stock_consumed_count || 0);
    //     detail.pending_component_quantity = totalApproved - totalConsumed;
    //     this[editBtnKey] = true;
    //   }
    // },
    async callApprovedComponentListMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(listApprovedComponentForTheTicket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              ticket_id: this.StoreObj.ticket_id,
            },
          })
        );
        const response = JSON.parse(
          result.data.listApprovedComponentForTheTicket
        ).data.item;
        this.mrfApprovedDetails = response;
      } catch (error) {
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
    saveUsedQunatityMethod(index) {
      const detail = this.mrfApprovedDetails[index];
      const approvedQty = Number(detail.approved_component_quantity) || 0;
      const inputQty = Math.round(Number(this.usedQuantity));
      if (isNaN(inputQty)) {
        this.showSnackbar("Invalid quantity provided.", "red");
        return;
      }
      if (inputQty > approvedQty) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText:
              "Provide quantity is greater than the Approved Quantity...!",
          };
          this.renderComp = true;
        });
        return;
      }
      this.mrfApprovedDetails[index].used_component_quantity = inputQty;
      this.mrfApprovedDetails[index].pending_component_quantity =
        approvedQty - inputQty;
      this.usedQuantitySaved = true;
      this.usedQuantity = 0;
    },

    editUsedQuantityMethod(index) {
      this.usedQuantity =
        this.mrfApprovedDetails[index].used_component_quantity;
      this.usedQuantitySaved = false;
    },
    deleteApprovedMrfMethod(index) {
      this.mrfApprovedDetails.splice(index, 1);
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length == 0) {
          this.CloseTicketMethod();
        } else {
          this.uploadMediaToS3();
        }
      } else {
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
    },

    async getServicesMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(GetTicketServices, {
            input: {
              user_id: this.$store.getters.get_current_user_details.user_id,
            },
          })
        );
        const response = JSON.parse(result.data.GetTicketServices).data;
        this.serviceList = response.items[0].services;
      } catch (error) {
        //
      }
    },

    addServicesMethod() {
      if (this.serviceCost && this.serviceSelected) {
        const serviceObj = {
          service_name: this.serviceSelected,
          service_charge: parseFloat(this.serviceCost).toFixed(2),
          travel_distance: this.travelDistance,
        };
        this.serviceArray.push(serviceObj);
        this.serviceCost = "";
        this.serviceSelected = "";
        this.travelDistance = "";
        this.serviceList = this.serviceList.filter(
          (listItem) =>
            !this.serviceArray.some(
              (arrayItem) => arrayItem.service_name === listItem
            )
        );
        this.serviceObjForApi = {
          travel_allowance: undefined,
          meals: undefined,
          night_stay: undefined,
          hotel: undefined,
          travel_distance: undefined,
          transportation: undefined,
        };
        this.serviceArray.forEach((item) => {
          if (!item) return;
          switch (item.service_name) {
            case "Travel Allowance":
              this.serviceObjForApi.travel_allowance = item.service_charge;
              this.serviceObjForApi.travel_distance = item.travel_distance;
              break;
            case "Meals":
              this.serviceObjForApi.meals = item.service_charge;
              break;
            case "Night Stay":
              this.serviceObjForApi.night_stay = item.service_charge;
              break;
            case "Hotel":
              this.serviceObjForApi.hotel = item.service_charge;
              break;
            case "Transportation":
              this.serviceObjForApi.transportation = item.service_charge;
              break;
          }
        });
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly select service name and fill cost!",
          };
          this.renderComp = true;
        });
      }
    },

    deleteServiceMethod(item, index) {
      const removedItem = this.serviceArray[index];
      this.serviceList.push(removedItem.service_name);
      this.serviceArray.splice(index, 1);
      if (removedItem.service_name === "Travel Allowance") {
        this.serviceObjForApi.travel_allowance = undefined;
        this.serviceObjForApi.travel_distance = undefined;
      } else if (removedItem.service_name === "Meals") {
        this.serviceObjForApi.meals = undefined;
      } else if (removedItem.service_name === "Night Stay") {
        this.serviceObjForApi.night_stay = undefined;
      } else if (removedItem.service_name === "Hotel") {
        this.serviceObjForApi.hotel = undefined;
      } else if (removedItem.service_name === "Transportation") {
        this.serviceObjForApi.transportation = undefined;
      }
    },
    async CloseTicketMethod(s3_files) {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          ticket_id: this.StoreObj.ticket_id,
          comments: this.comments,
          closure_remarks: this.closure_remarks,
          service_charges: this.serviceObjForApi || undefined,
        };
        if (this.s3_files != undefined) {
          inputParams.attachment_file = this.s3_files;
        }
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(CloseTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.CloseTicket);
        if (ResultObject.status === "Success") {
          if (
            this.mrfApprovedDetails.length > 0 &&
            this.enableApprovedDetails
          ) {
            await this.callUpdateMrfApprovedDetailsMethod();
          }
        }
        if (
          ResultObject.status == "Success" ||
          ResultObject.status == "Error"
        ) {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: ResultObject.status === "Error" ? "red" : "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.dialogCloseEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
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
    async uploadMediaToS3() {
      this.loading = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
          source_type: "CLOSE_TICKET",
        };
        this.s3_files.push(Obj);
        if (i == this.selected_files.length - 1) {
          this.CloseTicketMethod();
        }
      }
    },
    async callUpdateMrfApprovedDetailsMethod() {
      const approvedDetailsArray = this.mrfApprovedDetails.map((item) => {
        const {
          approve_service_center_details,
          approved_count,
          component_description,
          component_id,
          component_price,
          is_service_center_approved,
          category_id,
          category_name,
          service_id,
          service_name,
          ...rest
        } = item;
        const ownStock = Number(item.own_stock_consumed_count || 0);
        const store = Number(item.store_consumed_count || 0);
        const totalUsed = ownStock + store;
        return {
          ...rest,
          source: item.requested_from || undefined,
          used_component_quantity: isNaN(totalUsed)
            ? undefined
            : Math.round(totalUsed),
        };
      });
      try {
        const user = this.$store.getters.get_current_user_details;
        const result = await API.graphql(
          graphqlOperation(UpdateMRFApprovedDetailsInTicket, {
            input: {
              user_id: user.user_id,
              organization_id: user.organization_id,
              ticket_id: this.StoreObj.ticket_id,
              is_manager_or_admin_mrf_utilization_updated:
                this.enableApprovedDetails,
              mrf_approved_details: approvedDetailsArray,
            },
          })
        );
      } catch (error) {
        console.error("Error updating MRF Approved Details:", error);
      }
    },
    dialogCloseEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.s3_files = [];
      this.selected_files = [];
      this.serviceList = [];
      this.serviceSelected = "";
      this.addServices = false;
      this.sectionNo = null;
      this.serviceCost = "";
      this.serviceArray = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
