<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <AddressFromGmap
      :AddressFromGmapDialog="AddressFromGmapDialog"
      :GmapStoreObj="gmapStoreObj"
      @clicked="AddressFromGmapDialogEmit"
    />
    <v-dialog v-model="GenerateOrReopenFgrDialog" persistent :width="1000">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            {{ StoreObj.action === "GENERATE" ? "Generate" : "Reopen" }} Product
            Replacement
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="GenerateOrReopenFgrDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <div>
            <v-text-field
              v-if="StoreObj.action === 'GENERATE'"
              v-model="searchTicket"
              dense
              outlined
              label="Enter Ticket ID"
              class="FontSize"
            >
              <template v-slot:append>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == false"
                  @click="GetTicketsByFilterMethod()"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == true"
                  @click="ClearMethod()"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-text-field>
            <div v-if="Object.keys(ticketObj).length > 0">
              <div class="mt-1 mb-1">
                <span><strong>Ticket Details</strong></span>
              </div>
              <div class="mt-1 mb-1 pt-5">
                <v-row>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="ticketId"
                      dense
                      outlined
                      label="Ticket ID"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="ticketCreatedOn"
                      dense
                      outlined
                      label="Ticket Created On"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerCompanyName"
                      dense
                      outlined
                      label="Customer Company Name"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerName"
                      dense
                      outlined
                      label="Customer Name"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerNumber"
                      dense
                      outlined
                      label="Customer Number"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerEmailId"
                      dense
                      outlined
                      label="Customer Email ID"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerAddress"
                      dense
                      outlined
                      label="Customer Address"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerPincode"
                      dense
                      outlined
                      label="Customer Pincode"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerCity"
                      dense
                      outlined
                      label="Customer City"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="customerState"
                      dense
                      outlined
                      label="Customer State"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="categoryName"
                      dense
                      outlined
                      label="Category Name"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="productName"
                      dense
                      outlined
                      label="Product Name"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="serialNumber"
                      dense
                      outlined
                      label="Serial Number"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="invoiceNumber"
                      dense
                      outlined
                      label="Invoice Number"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="invoiceDate"
                      dense
                      outlined
                      label="Invoice Date"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    sm="12"
                    xs="12"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      v-model="typeOfCall"
                      dense
                      outlined
                      label="Type of Call"
                      readonly
                      class="FontSize"
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  label="FGR Requested Date"
                  class="FontSize"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  label="Replacement Proposed By"
                  class="FontSize"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  label="Replacement Category"
                  class="FontSize"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  label="Replacement Category"
                  class="FontSize"
                ></v-text-field>
              </v-col> -->
                </v-row>
              </div>
              <div class="pt-5 pb-5">
                <span
                  ><strong
                    >Fill Up The Product Replacement Details</strong
                  ></span
                >
              </div>
              <div>
                <v-form ref="fgrForm">
                  <v-row>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-select
                        v-model="replacementCatgry"
                        :items="replacementCatgryItems"
                        dense
                        outlined
                        label="Replacement Category*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-select
                        v-model="typeOfCustomer"
                        :items="typeOfCustomerItems"
                        dense
                        outlined
                        label="Type of Customer*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="machineModel"
                        dense
                        outlined
                        label="Machine Model*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="machinePurchFrom"
                        dense
                        outlined
                        label="Machine Purchased From*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="machinePurchAddress"
                        dense
                        outlined
                        label="Machine Purchased Address*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                        @click="
                          handleTextFieldClickMethod('MACHINE_PURCHASE_ADDRESS')
                        "
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="dealerName"
                        dense
                        outlined
                        label="Dealer Name*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="dealerAddress"
                        dense
                        outlined
                        label="Dealer Address*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                        @click="handleTextFieldClickMethod('DEALER_ADDRESS')"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="technicianName"
                        dense
                        outlined
                        label="Technician Name*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="technicianAddress"
                        dense
                        outlined
                        label="Technician Address*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                        @click="
                          handleTextFieldClickMethod('TECHNICIAN_ADDRESS')
                        "
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="failureCompName"
                        dense
                        outlined
                        label="Failure Component Name*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="reasonForReplacement"
                        dense
                        outlined
                        label="Reason For Replacement*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="scrapValue"
                        dense
                        outlined
                        label="Scrap Value*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-select
                        v-model="actionToBeTaken"
                        :items="[
                          'Machine to be sold locally',
                          'Machine to be pulled back - WH',
                        ]"
                        dense
                        outlined
                        label="Action To Be Taken*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      v-if="actionToBeTaken !== ''"
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-select
                        v-model="actionToBeTakenBased"
                        :items="basedOnDefMach"
                        dense
                        outlined
                        :label="actionToBeTaken"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="defMacToBeSoldTo"
                        dense
                        outlined
                        label="Defective Machine To Be Sold To*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="scrapValToBeDebited"
                        dense
                        outlined
                        label="Scrap Value To Be Debited*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="dispatchToAddress"
                        dense
                        outlined
                        label="Dispatch To Address*"
                        class="FontSize"
                        :rules="[(v) => !!v || 'Required']"
                        @click="handleTextFieldClickMethod('DISPATCH_ADDRESS')"
                      />
                    </v-col>

                    <v-col
                      cols="12"
                      lg="3"
                      md="3"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-file-input
                        v-model="files"
                        dense
                        outlined
                        multiple
                        label="Upload Attachments"
                        class="FontSize"
                        :prepend-icon="null"
                        append-icon="mdi-paperclip"
                      >
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-form>
                <div
                  class="mx-auto mt-3"
                  v-if="savedUploadedFiles && savedUploadedFiles.length > 0"
                >
                  <div class="mb-2">
                    <strong>Saved Files</strong>
                  </div>
                  <v-data-table
                    dense
                    class="elevation-0"
                    :headers="savedUploadedFilesHeader"
                    :items="savedUploadedFiles"
                  >
                    <template v-slot:[`item.sl_no`]="{ item }">
                      <div class="FontSize">
                        {{ savedUploadedFiles.indexOf(item) + 1 }}
                      </div>
                    </template>
                    <template v-slot:[`item.file_name`]="{ item }">
                      <div class="FontSize">
                        {{ item.file_name }}
                      </div>
                    </template>
                    <template v-slot:[`item.file_type`]="{ item }">
                      <div class="FontSize">
                        {{ item.file_type }}
                      </div>
                    </template>
                    <template v-slot:[`item.Action`]="{ item }">
                      <v-btn
                        icon
                        color="red"
                        @click="
                          savedUploadedFiles.splice(
                            savedUploadedFiles.indexOf(item),
                            1
                          )
                        "
                      >
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </div>
                <div
                  class="mx-auto mt-3"
                  v-if="selected_files && selected_files.length != 0"
                >
                  <div class="mb-2">
                    <strong
                      >{{
                        StoreObj.action === "REOPEN" ? "Newly" : null
                      }}
                      Selected Files</strong
                    >
                  </div>
                  <v-data-table
                    dense
                    class="elevation-0 mt-3"
                    :headers="selected_files_header"
                    :items="selected_files"
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
                </div>
              </div>
            </div>
            <div v-if="ConditionsToDisplaySearchTable">
              <span><strong>Select Ticket</strong></span>
              <v-card
                class="pa-5"
                style="height: 200px; width: 100%; overflow: auto"
              >
                <v-data-table
                  dense
                  fixed-header
                  :headers="searchedTicketHeader"
                  :items="GetAllSearchedTickets"
                  hide-default-footer
                  @click:row="handleRowClickMethod"
                >
                  <template v-slot:[`item.custom_ticket_id`]="{ item }">
                    <div class="FontSize">
                      {{ item.custom_ticket_id }}
                    </div>
                  </template>
                  <template v-slot:[`item.customer_name`]="{ item }">
                    <div class="FontSize">
                      {{ item.customer_name }}
                    </div>
                  </template>
                  <template v-slot:[`item.service_name`]="{ item }">
                    <div class="FontSize">
                      {{ item.service_name }}
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <div class="ml-2">
            <v-btn
              v-if="Object.keys(ticketObj).length > 0"
              :loading="btnLoading"
              small
              color="primary"
              @click="generateReopenFgrMethod()"
              >{{ StoreObj.action === "GENERATE" ? "Generate" : "Reopen"
              }}<v-icon small class="pl-1">{{
                StoreObj.action === "GENERATE" ? "md-check" : "mdi-lock-open"
              }}</v-icon></v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { SearchTickets } from "@/graphql/queries.js";
import { GenerateFGR, ReOpenFGR } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";

import AddressFromGmap from "@/components/FGR/Dialogs/AddressFromGmapDialog.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  mixins: [GenerateS3URL],
  props: { GenerateOrReopenFgrDialog: Boolean, StoreObj: Object },
  components: { Snackbar, AddressFromGmap },
  data: () => ({
    btnLoading: false,
    renderComp: true,
    isSearching: false,
    showTicketListTable: false,
    AddressFromGmapDialog: false,
    searchTicket: "",
    ticketId: "",
    ticketCreatedOn: "",
    ticketCreatedOn1: "",
    customerCompanyName: "",
    customerName: "",
    customerNumber: "",
    customerEmailId: "",
    customerAddress: "",
    customerPincode: "",
    customerCity: "",
    customerState: "",
    categoryName: "",
    productName: "",
    serialNumber: "",
    invoiceNumber: "",
    invoiceDate: "",
    typeOfCall: "",
    replacementCatgry: "",
    typeOfCustomer: "",
    machinePurchFrom: "",
    machinePurchAddress: "",
    dealerName: "",
    dealerAddress: "",
    technicianName: "",
    technicianAddress: "",
    failureCompName: "",
    reasonForReplacement: "",
    scrapValue: "",
    actionToBeTaken: "",
    actionToBeTakenBased: "",
    defMacToBeSoldTo: "",
    scrapValToBeDebited: "",
    dispatchToAddress: "",
    machineModel: "",
    SnackBarComponent: {},
    searchedTicketHeader: [
      { text: "Ticket ID", value: "custom_ticket_id" },
      { text: "Customer", value: "customer_name" },
      { text: "Product", value: "service_name" },
    ],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    savedUploadedFilesHeader: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    GetAllSearchedTickets: [],
    replacementCatgryItems: ["Repeat Repair", "DOA", "Transit Damage"],
    typeOfCustomerItems: ["Customer", "Dealer/Distributor"],
    ticketObj: {},
    files: [],
    selected_files: [],
    s3_files: [],
    savedUploadedFiles: [],
    basedOnDefMach: [],
    gmapStoreObj: {},
  }),

  watch: {
    GenerateOrReopenFgrDialog(val) {
      if (val && this.StoreObj.action === "REOPEN") {
        this.ticketObj = { ...this.StoreObj };
        this.callTicketDataAutoPopulateTextFieldMethod();
        this.callFGRDataAutoPopulateTextFieldMethod();
        this.savedUploadedFiles = [...this.StoreObj.fgr_initiated_attachments];
        this.s3_files = this.savedUploadedFiles;
      }
    },
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },

    actionToBeTaken(val) {
      if (val === "Machine to be sold locally") {
        this.basedOnDefMach = [
          "As new after repair",
          "On discount after repair",
          "On discount W/O repair",
          "As scrap after cannibalization of parts",
        ];
      } else if (val === "Machine to be pulled back - WH") {
        this.basedOnDefMach = ["By company", "By customer"];
      }
    },
  },

  computed: {
    ConditionsToDisplaySearchTable() {
      if (this.GetAllSearchedTickets.length > 1 && this.showTicketListTable) {
        return true;
      }
    },
  },

  methods: {
    async GetTicketsByFilterMethod() {
      if (this.searchTicket.length >= 3) {
        this.isSearching = true;
        await this.GetAllTicketsBySearchMethod();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly Enter Ticket ID more than 2 characters!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    async GetAllTicketsBySearchMethod() {
      try {
        this.GetAllSearchedTickets = [];
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(SearchTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              camparison_operator: "CONTAINS",
              field_value: this.searchTicket,
              field_name: "ticket_id",
              ticket_type: "ASSIGNED_TICKET",
              ticket_status: undefined,
              search_type: undefined,
            },
          })
        );
        const response = JSON.parse(result.data.SearchTickets);

        if (response.status === "SUCCESS") {
          // this.overlay = false;
          this.GetAllSearchedTickets = response.data.items;
          if (this.GetAllSearchedTickets.length === 1) {
            this.ticketObj = this.GetAllSearchedTickets[0];
            console.log("TICKET_OBJ", this.ticketObj);
            this.callTicketDataAutoPopulateTextFieldMethod();
            // this.category = this.ticketObj.category_name;
            // this.product = this.ticketObj.service_name;
            // this.territoryList =
            //   this.ticketObj.ticket_territories.length > 0
            //     ? this.ticketObj.ticket_territories
            //     : ["empty_array"];
            // this.territoryIDFromApi =
            //   this.ticketObj.ticket_territories.length === 0 ? true : false;
            // await this.GetAllTagCompMethod(this.ticketObj.service_id);
          } else if (this.GetAllSearchedTickets.length > 1) {
            this.showTicketListTable = true;
          }
        }
      } catch (error) {
        this.overlay = false;
        this.GetAllSearchedTickets = [];
        this.noDataText = error.errors[0].message;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    handleRowClickMethod(item) {
      this.ticketObj = item;
      this.callTicketDataAutoPopulateTextFieldMethod();
      this.showTicketListTable = false;
    },

    handleTextFieldClickMethod(TEXT_FIELD_NAME) {
      if (TEXT_FIELD_NAME === "MACHINE_PURCHASE_ADDRESS") {
        this.gmapStoreObj.first_text_field = this.machinePurchAddress;
      } else if (TEXT_FIELD_NAME === "DEALER_ADDRESS") {
        this.gmapStoreObj.first_text_field = this.dealerAddress;
      } else if (TEXT_FIELD_NAME === "TECHNICIAN_ADDRESS") {
        this.gmapStoreObj.first_text_field = this.technicianAddress;
      } else if (TEXT_FIELD_NAME === "DISPATCH_ADDRESS") {
        this.gmapStoreObj.first_text_field = this.dispatchToAddress;
      }
      this.gmapStoreObj.text_field_name = TEXT_FIELD_NAME;
      this.AddressFromGmapDialog = true;
    },

    callTicketDataAutoPopulateTextFieldMethod() {
      this.ticketId =
        this.ticketObj.custom_ticket_id || this.ticketObj.ticket_id;
      this.ticketCreatedOn = new Date(
        this.ticketObj.ticket_created_on * 1000
      ).toLocaleString("en-GB");
      this.ticketCreatedOn1 = this.ticketObj.ticket_created_on;
      this.customerCompanyName = this.ticketObj.customer_company_name || "N/A";
      this.customerName = this.ticketObj.customer_name || "N/A";
      this.customerNumber = this.ticketObj.customer_phone_number || "N/A";
      this.customerEmailId = this.ticketObj.customer_email_id || "N/A";
      this.customerAddress =
        this.ticketObj.customer_address ||
        this.ticketObj.ticket_address ||
        "N/A";
      this.customerPincode =
        this.ticketObj.customer_pincode ||
        this.ticketObj.ticket_pincode ||
        "N/A";
      this.customerCity =
        this.ticketObj.customer_city || this.ticketObj.ticket_city || "N/A";
      this.customerState =
        this.ticketObj.customer_state || this.ticketObj.ticket_state || "N/A";
      this.categoryName = this.ticketObj.category_name || "N/A";
      this.productName = this.ticketObj.service_name || "N/A";
      this.serialNumber = this.ticketObj.service_serial_number || "N/A";
      this.invoiceNumber =
        this.ticketObj.ticket_warranty_details?.ticket_invoice_number || "N/A";
      this.invoiceDate =
        this.ticketObj.ticket_warranty_details?.ticket_invoice_date || "N/A";
      this.typeOfCall = this.ticketObj.type_of_call || "N/A";
    },

    callFGRDataAutoPopulateTextFieldMethod() {
      this.replacementCatgry = this.StoreObj.replacement_category;
      this.typeOfCustomer = this.StoreObj.type_of_customer;
      this.machinePurchFrom = this.StoreObj.purchased_party_name;
      this.machinePurchAddress = this.StoreObj.purchased_party_address;
      this.dealerName = this.StoreObj.dealer_name;
      this.dealerAddress = this.StoreObj.dealer_address;
      this.technicianName = this.StoreObj.technician_name;
      this.technicianAddress = this.StoreObj.technician_address;
      this.failureCompName = this.StoreObj.component_name;
      this.reasonForReplacement = this.StoreObj.reason_for_replacement;
      this.scrapValue = this.StoreObj.scrap_value;
      this.actionToBeTaken = this.StoreObj.action_to_be_take;
      this.actionToBeTakenBased = this.StoreObj.sub_action_to_be_take;
      this.defMacToBeSoldTo = this.StoreObj.defective_machine_to_be_sold_to;
      this.scrapValToBeDebited = this.StoreObj.scrap_value_to_be_debited;
      this.dispatchToAddress = this.StoreObj.new_machine_dispathed_to;
    },

    ClearMethod() {
      this.isSearching = false;
      this.searchTicket = "";
      this.GetAllSearchedTickets = [];
      this.showTicketListTable = false;
      this.ticketObj = {};
    },

    async s3FileUploadMethod() {
      for (let i = 0; i < this.selected_files.length; i++) {
        const fileName = this.selected_files[i].name;
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}/${fileName}`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
        };
        this.s3_files.push(Obj);
      }
    },

    async generateReopenFgrMethod() {
      if (
        Object.keys(this.ticketObj).length > 0 &&
        this.$refs.fgrForm.validate()
      ) {
        if (this.selected_files.length > 0) {
          await this.s3FileUploadMethod();
          if (this.savedUploadedFiles.length > 0) {
            this.s3_files.push(...this.savedUploadedFiles);
          }
          this.callApiMethod();
        } else {
          this.callApiMethod();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "After searching ticket ID kindly fill the form!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
      // if (this.$refs.fgrForm.validate()) {
      //   if (this.selected_files.length > 0) {
      //     await this.s3FileUploadMethod();
      //     this.callApiMethod();
      //   } else {
      //     this.callApiMethod();
      //   }
      // } else {
      //   this.SnackBarComponent = {
      //     SnackbarVmodel: true,
      //     SnackbarColor: "red",
      //     Top: true,
      //     SnackbarText: "Kindly fill the form!",
      //   };
      //   this.renderComp = false;
      //   this.$nextTick(() => {
      //     this.renderComp = true;
      //   });
      // }
    },

    async callApiMethod() {
      const mutationName =
        this.StoreObj.action === "GENERATE" ? GenerateFGR : ReOpenFGR;
      const mutationNameString =
        this.StoreObj.action === "GENERATE" ? "GenerateFGR" : "ReOpenFGR";
      try {
        this.btnLoading = true;
        const fgrGenResult = await API.graphql(
          graphqlOperation(mutationName, {
            input: {
              user_id: this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              replacement_category: this.replacementCatgry,
              ticket_id: this.ticketObj.ticket_id,
              ticket_created_on: this.ticketCreatedOn1,
              customer_email_id: ["", null, undefined, "N/A"].includes(
                this.customerEmailId
              )
                ? undefined
                : this.customerEmailId,
              type_of_customer: this.typeOfCustomer,
              customer_address: ["", null, undefined, "N/A"].includes(
                this.customerAddress
              )
                ? undefined
                : this.customerAddress,
              customer_city: ["", null, undefined, "N/A"].includes(
                this.customerCity
              )
                ? undefined
                : this.customerCity,
              customer_state: ["", null, undefined, "N/A"].includes(
                this.customerState
              )
                ? undefined
                : this.customerState,
              customer_pincode: ["", null, undefined, "N/A"].includes(
                this.customerPincode
              )
                ? undefined
                : this.customerPincode,
              customer_company_name: ["", null, undefined, "N/A"].includes(
                this.customerCompanyName
              )
                ? undefined
                : this.customerCompanyName,
              customer_contact_number: ["", null, undefined, "N/A"].includes(
                this.customerNumber
              )
                ? undefined
                : this.customerNumber,
              machine_model: this.machineModel,
              machine_serial_number: ["", null, undefined, "N/A"].includes(
                this.serialNumber
              )
                ? undefined
                : this.serialNumber,
              customer_invoice_number: ["", null, undefined, "N/A"].includes(
                this.invoiceNumber
              )
                ? undefined
                : this.invoiceNumber,
              customer_invoice_date: ["", null, undefined, "N/A"].includes(
                this.invoiceDate
              )
                ? undefined
                : this.invoiceDate,
              purchased_party_name: this.machinePurchFrom,
              purchased_party_address: this.machinePurchAddress,
              dealer_name: this.dealerName,
              dealer_address: this.dealerAddress,
              technician_name: this.technicianName,
              technician_address: this.technicianAddress,
              component_name: this.failureCompName,
              reason_for_replacement: this.reasonForReplacement,
              scrap_value: this.scrapValue,
              action_to_be_take: this.actionToBeTaken,
              sub_action_to_be_take: this.actionToBeTakenBased,
              defective_machine_to_be_sold_to: this.defMacToBeSoldTo,
              scrap_value_to_be_debited: this.scrapValToBeDebited,
              new_machine_dispathed_to: this.dispatchToAddress,
              attachments: this.s3_files.length > 0 ? this.s3_files : undefined,
              finished_goods_receipt_id:
                this.StoreObj.finished_goods_receipt_id,
            },
          })
        );
        const response = JSON.parse(fgrGenResult.data[mutationNameString]);
        if (response.status === "SUCCESS") {
          this.btnLoading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: response.status_message,
          };
          this.renderComp = false;
          this.$nextTick(() => {
            this.renderComp = true;
          });
          this.GenerateOrReopenFgrDialogEmit(2);
        }
      } catch (error) {
        this.btnLoading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
        this.GenerateOrReopenFgrDialogEmit(1);
        //
      }
    },

    GenerateOrReopenFgrDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.searchTicket = "";
      if (Object.keys(this.ticketObj).length > 0) {
        this.$refs.fgrForm.reset();
      }
      this.isSearching = false;
      this.ticketObj = {};
      this.files = [];
      this.selected_files = [];
      this.s3_files = [];
    },

    AddressFromGmapDialogEmit(Toggle, addressObj) {
      this.AddressFromGmapDialog = false;
      if (Toggle === 2) {
        if (addressObj.text_field_name === "MACHINE_PURCHASE_ADDRESS") {
          this.machinePurchAddress = addressObj.address;
        } else if (addressObj.text_field_name === "DEALER_ADDRESS") {
          this.dealerAddress = addressObj.address;
        } else if (addressObj.text_field_name === "TECHNICIAN_ADDRESS") {
          this.technicianAddress = addressObj.address;
        } else if (addressObj.text_field_name === "DISPATCH_ADDRESS") {
          this.dispatchToAddress = addressObj.address;
        }
      }
    },
  },
};
</script>
