<template>
  <div>
    <ViewAttachmentsDialog
      :StoreObjNew="StoreObjNew"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <v-dialog :value="dialogComponentsInformation" persistent max-width="80%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Requested & Approved Components</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogComponentsInformationEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text">
          <div v-if="StoreObj.requested_components_details != undefined">
            <div v-if="StoreObj.requested_components_details.length != 0">
              <div class="mt-3 pa-4" style="border: solid 1px">
                <h3 class="mt-3">Requested Components</h3>
                <v-data-table
                  class="elevation-0 mt-4"
                  dense
                  :headers="requestedCompsHeaders"
                  :items="StoreObj.requested_components_details"
                  hide-default-footer
                ></v-data-table>
              </div>
            </div>
          </div>
          <div v-if="StoreObj.component_list != undefined">
            <div v-if="StoreObj.component_list.length != 0">
              <div class="mt-3 pa-4" style="border: solid 1px">
                <h3 class="mt-3">Approved Components</h3>
                <v-data-table
                  class="elevation-0 mt-4"
                  dense
                  :headers="approvedComponentsHeaders"
                  :items="StoreObj.component_list"
                  hide-default-footer
                >
                  <template v-slot:[`item.component_name`]="{ item }">
                    <div class="FontSize" v-if="item.component_name">
                      {{ item.component_name }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.component_code`]="{ item }">
                    <div class="FontSize" v-if="item.component_code">
                      {{
                        item.component_code != undefined
                          ? item.component_code
                          : "-"
                      }}
                    </div>
                    <div
                      class="FontSize"
                      v-else-if="item.component_product_code"
                    >
                      {{
                        item.component_product_code != undefined
                          ? item.component_product_code
                          : "-"
                      }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template
                    v-slot:[`item.approved_component_quantity`]="{ item }"
                  >
                    <div
                      class="FontSize"
                      v-if="item.approved_component_quantity"
                    >
                      {{ item.approved_component_quantity }}
                    </div>
                    <div class="FontSize" v-else-if="item.component_quantity">
                      {{ item.component_quantity }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.service_center_name`]="{ item }">
                    <div class="FontSize" v-if="item.service_center_name">
                      {{ item.service_center_name }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.component_price`]="{ item }">
                    <div
                      class="FontSize"
                      v-if="item.component_price != undefined"
                    >
                      {{ item.component_price }}
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.component_description`]="{ item }">
                    <div class="FontSize" v-if="item.component_description">
                      {{ item.component_description }}
                    </div>
                    <div v-else>-</div>
                  </template>
                </v-data-table>
              </div>
            </div>
          </div>
          <div v-if="StoreObj.tracking_details != undefined">
            <div v-if="StoreObj.tracking_details.length != 0">
              <div class="mt-3 pa-4" style="border: solid 1px">
                <h3 class="mt-3">Tracking Details</h3>
                <v-data-table
                  class="elevation-0 mt-4"
                  dense
                  :headers="trackingHeaders"
                  :items="StoreObj.tracking_details"
                  hide-default-footer
                >
                  <template v-slot:[`item.attachments`]="{ item }">
                    <div v-if="item.attachments != undefined">
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
                  </template>
                </v-data-table>
              </div>
            </div>
          </div>

          <div v-if="StoreObj.LOP_deatails != undefined">
            <div v-if="StoreObj.LOP_deatails.length != 0">
              <div class="mt-3 pa-4" style="border: solid 1px">
                <h3 class="mt-3">LOP Details</h3>
                <v-data-table
                  class="elevation-0 mt-4"
                  dense
                  :headers="lopHeaders"
                  :items="StoreObj.LOP_deatails"
                  hide-default-footer
                >
                  <template v-slot:[`item.attachments`]="{ item }">
                    <div v-if="item.attachments != undefined">
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
                  </template>
                </v-data-table>
              </div>
            </div>
          </div>

          <div v-if="StoreObj.ITF_details != undefined">
            <div v-if="StoreObj.ITF_details.length != 0">
              <div class="mt-3 pa-4" style="border: solid 1px">
                <h3 class="mt-3">ITF Details</h3>
                <v-data-table
                  class="elevation-0 mt-4"
                  dense
                  :headers="itfHeaders"
                  :items="StoreObj.ITF_details"
                  hide-default-footer
                >
                  <template v-slot:[`item.attachments`]="{ item }">
                    <div v-if="item.attachments != undefined">
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
                  </template>
                </v-data-table>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ViewAttachmentsDialog from "@/components/Tickets/Dialogs/ViewAttachmentsDialog.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";

export default {
  mixins: [GetTicketDetails],
  props: {
    StoreObj: Object,
    dialogComponentsInformation: Boolean,
  },
  components: {
    ViewAttachmentsDialog,
  },
  data: () => ({
    Toggle: 0,
    StoreObjNew: {},
    previewAttachments: false,
    requestedCompsHeaders: [
      { text: "Comp. Name", value: "component_name" },
      { text: "Comp. Code", value: "component_code" },
      { text: "Description", value: "component_description" },
      { text: "Requested From ", value: "requested_from" },
      { text: "Requested Quantity", value: "requested_component_quantity" },
    ],
    approvedComponentsHeaders: [
      { text: "Component Name", value: "component_name" },
      { text: "Code", value: "component_code" },
      { text: "Quantity", value: "approved_component_quantity" },
      { text: "Service Center", value: "service_center_name" },
      { text: "Price", value: "component_price" },
      { text: "Requested From ", value: "requested_from" },
      { text: "Description", value: "component_description" },
    ],
    trackingHeaders: [
      { text: "Courier", value: "courier_name" },
      { text: "Docket ID", value: "tracking_id" },
      { text: "Phone", value: "phone_number" },
      { text: "Date", value: "date" },
      { text: "Additional Part", value: "part_name" },
      { text: "Attachs", value: "attachments" },
    ],
    itfHeaders: [
      { text: "Remarks", value: "comments" },
      { text: "Date of Arrival", value: "DOA" },
      { text: "Attachs", value: "attachments" },
    ],
    lopHeaders: [
      { text: "Remarks", value: "comments" },
      { text: "Purchased By", value: "purchased_by" },
      { text: "Purchased Date", value: "purchase_date" },
      { text: "Attachs", value: "attachments" },
    ],
  }),
  watch: {
    async dialogComponentsInformation(val) {
      if (val) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        console.log("STOREOBJ", this.StoreObj);
      }
    },
  },
  methods: {
    dialogComponentsInformationEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    viewAttachs(item) {
      this.StoreObjNew = item;
      this.previewAttachments = true;
    },
    previewAttachmentsEmit() {
      this.previewAttachments = false;
    },
  },
};
</script>
