<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <ViewAttachments
      :StoreArray="StoreArray"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <EditFgrAttachments
      :EditFgrAttachemntsDialog="EditFgrAttachemntsDialog"
      :AttachementObj="AttachementObj"
      @clicked="EditFgrAttachemntsDialogEmit"
    />
    <ShareToCustomer
      :ShareToCustomerDialog="shareToCustomerDialog"
      :StoreObj="StoreObj"
      @clicked="ShareToCustomerDialogEmit"
    />
    <v-dialog v-model="ApproveFgrDialog" persistent :width="1000">
      <v-card>
        <Overlay :overlay="overlay" />
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Approve FGR</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ApproveFgrDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pl-5">
          <div class="d-flex justify-center mt-2 mb-2">
            <v-row>
              <v-col cols="12" lg="12" class="pt-0 pb-0">
                <div class="mt-3">
                  <h3>Requested Details</h3>
                </div>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                md="6"
                sm="12"
                xs="12"
                class="pt-0 pb-0 mt-2"
              >
                <div style="border: 1px dashed black" class="pa-2">
                  <div class="pl-3 pt-2">
                    <div>
                      <span class="FontSize"
                        ><strong>FGR Request Date: </strong
                        >{{ FormatedDateTime(StoreObj.fgr_initiated_on) }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Replacement Proposed By: </strong
                        >{{ StoreObj.user_name }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Replacement Category: </strong
                        >{{ StoreObj.replacement_category }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Complaint Number: </strong
                        >{{
                          StoreObj.custom_ticket_id || StoreObj.ticket_id
                        }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Complaint Date: </strong
                        >{{
                          FormatedDateTime(StoreObj.ticket_created_on)
                        }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Name Of the Customer: </strong
                        >{{ StoreObj.customer_name }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong
                          >Type Of Customer (Customer or Dealer or Distributor): </strong
                        >{{ StoreObj.type_of_customer }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Address of The Customer: </strong
                        >{{ StoreObj.customer_address }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Town/ City: </strong
                        >{{ StoreObj.customer_city }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Pin Code: </strong
                        >{{ StoreObj.customer_pincode }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Contact Name: </strong
                        >{{ StoreObj.customer_company_name || "N/A" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Contact Number: </strong
                        >{{ StoreObj.customer_contact_number || "N/A" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Machine Model: </strong
                        >{{ StoreObj.machine_model || "N/A" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Machine Serial Number: </strong
                        >{{ StoreObj.machine_serial_number || "N/A" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Customer Invoice Number: </strong
                        >{{ StoreObj.customer_invoice_number }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Customer Invoice Date: </strong
                        >{{
                          StoreObj.invoiceDate || StoreObj.customer_invoice_date
                        }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Attachments: </strong
                        ><v-btn
                          @click="viewAttachmentsMethod('Fgr_Initated')"
                          icon
                          v-if="
                            StoreObj.fgr_initiated_attachments &&
                            StoreObj.fgr_initiated_attachments.length > 0
                          "
                          ><v-icon color="primary" small
                            >mdi-paperclip</v-icon
                          ></v-btn
                        ><span v-else>N/A</span></span
                      >
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <div style="border: 1px dashed black" class="pa-2">
                  <div class="pl-3 pt-2">
                    <div>
                      <span class="FontSize"
                        ><strong
                          >Name of the party from where machine was purchased: </strong
                        >{{ StoreObj.purchased_party_name }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong
                          >Address of the party from where machine was
                          purchased: </strong
                        >{{ StoreObj.purchased_party_address }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Direct Dealer Name: </strong
                        >{{ StoreObj.dealer_name }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Direct Dealer Address: </strong
                        >{{ StoreObj.dealer_address }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Name Of The ECP Involved: </strong
                        >{{ StoreObj.technician_name || "N/A" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Address Of The ECP: </strong
                        >{{ StoreObj.technician_address || "N/A" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong
                          >Name Of The Component Failure Diagnosed By ASP: </strong
                        >{{ StoreObj.component_name || "N/A" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Reason For Replacement: </strong
                        >{{ StoreObj.reason_for_replacement | "-" }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong
                          >Scrap Value of The Defective Unit As Per Policy: </strong
                        >{{ StoreObj.scrap_value }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong
                          >Action To be Taken Against Defective Machine: </strong
                        >{{ StoreObj.action_to_be_take }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Defective Machine To Be Sold To: </strong
                        >{{ StoreObj.defective_machine_to_be_sold_to }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong>Scrap Value To Be Debited: </strong
                        >{{ StoreObj.scrap_value_to_be_debited }}</span
                      >
                    </div>
                    <div>
                      <span class="FontSize"
                        ><strong
                          >New Machine To Be Dispatched To (Fill Complete
                          Address): </strong
                        >{{ StoreObj.new_machine_dispathed_to }}</span
                      >
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
          <div
            v-if="StoreObj.requested_approver_type === 'PRIMARY'"
            class="mt-5"
          >
            <div class="pt-5">
              <h3>Technical Team</h3>
            </div>
            <!-- <v-form ref="form"> -->
            <v-row class="mt-3">
              <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="componentNameFailure"
                  dense
                  outlined
                  label="Evaluation Of Case*"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="repReason"
                  dense
                  outlined
                  label="Reason For Failure If Any"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="machineCond"
                  dense
                  outlined
                  label="Condition Of Machine"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="techTeamDecsn"
                  dense
                  outlined
                  label="Recomondation"
                  class="FontSize"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pt-0 pb-0">
                <!-- <v-form ref="firstCommentForm"> -->
                <v-text-field
                  v-model="comment"
                  dense
                  outlined
                  label="Comment"
                  class="FontSize"
                >
                </v-text-field>
                <!-- </v-form> -->
              </v-col>
              <v-col cols="12" lg="4" md="4" sm="12" xs="12" class="pt-0 pb-0">
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
            <!-- </v-form> -->
            <div class="d-flex justify-center mt-3">
              <v-data-table
                style="max-width: 500px"
                v-if="selected_files && selected_files.length != 0"
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
          <div
            v-if="StoreObj.requested_approver_type === 'SECONDARY'"
            class="pt-5 pb-5"
          >
            <div v-if="StoreObj.primary_approved_component_name">
              <div class="mt-3 mb-2">
                <h3>Technical Approved Details</h3>
              </div>
              <div style="border: 1px dashed black" class="pa-2 mb-2">
                <v-row class="mb-3">
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <div>
                      <div class="pl-3 pt-2">
                        <div>
                          <span class="FontSize"
                            ><strong
                              >Name Of The Component Failure Diagnosed: </strong
                            >{{
                              StoreObj.primary_approved_component_name || "N/A"
                            }}</span
                          >
                        </div>
                        <div>
                          <span class="FontSize"
                            ><strong>Reason For Replacement: </strong
                            >{{
                              StoreObj.primary_approved_reason_for_replacement ||
                              "N/A"
                            }}</span
                          >
                        </div>
                        <div>
                          <span class="FontSize"
                            ><strong>Condition Of Machine: </strong
                            >{{
                              StoreObj.primary_approved_condition_of_machine ||
                              "N/A"
                            }}</span
                          >
                        </div>
                        <div>
                          <span class="FontSize"
                            ><strong>Decision Of Technical team: </strong
                            >{{
                              StoreObj.primary_approved_decision || "N/A"
                            }}</span
                          >
                        </div>
                        <div>
                          <span class="FontSize"
                            ><strong>Attachments: </strong
                            ><v-btn
                              @click="viewAttachmentsMethod('Primary_Approved')"
                              icon
                              v-if="
                                StoreObj.primary_approved_attachment_file &&
                                StoreObj.primary_approved_attachment_file
                                  .length > 0
                              "
                              ><v-icon color="primary" small
                                >mdi-paperclip</v-icon
                              ></v-btn
                            ><span v-else>N/A</span></span
                          >
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div>
              <div class="pt-5">
                <h3>Admin Approvals</h3>
              </div>

              <!-- <v-form ref="form1"> -->
              <div>
                <v-card color="#f3e5f5" class="mt-3 pa-5">
                  <div class="mb-5">
                    <h3>Commercial Computation</h3>
                  </div>
                  <v-row>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="invoiceValue"
                        dense
                        outlined
                        type="number"
                        class="FontSize"
                        label="Invoice Value*"
                        :rules="[(v) => !!v || 'Required']"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="machineUsedDays"
                        readonly
                        type="number"
                        dense
                        outlined
                        class="FontSize"
                        label="Machine used (Days)"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="machineUsedMonth"
                        readonly
                        dense
                        outlined
                        class="FontSize"
                        label="Machine used (Month)"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="perAgeDep"
                        readonly
                        type="number"
                        dense
                        outlined
                        class="FontSize"
                        label="Total % age of dep applicable"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="invoiceAmount"
                        readonly
                        dense
                        outlined
                        class="FontSize"
                        label="Depreciation amount payable on Invoice Value - Specify amount"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="freightCharges"
                        dense
                        outlined
                        class="FontSize"
                        label="Freight Charges"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="newMachDispatch"
                        dense
                        outlined
                        class="FontSize"
                        label="Dispatch Of New Machine"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="collOfDefMachine"
                        dense
                        outlined
                        class="FontSize"
                        label="Collection Of Defective Machine"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="totalAmountCollected"
                        readonly
                        dense
                        outlined
                        class="FontSize"
                        label="Total Amount To Be Collected From Customer"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="totalAmountBrone"
                        dense
                        outlined
                        class="FontSize"
                        label="Total Amount To Be Brone By Company"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="totalLoss"
                        dense
                        outlined
                        class="FontSize"
                        label="Total Loss"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="paymentDetails"
                        dense
                        outlined
                        class="FontSize"
                        label="Payment Details"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="approvalDetails"
                        dense
                        outlined
                        class="FontSize"
                        label="Approval Details"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-form ref="firstCommentForm">
                        <v-text-field
                          v-model="firstSectionComment"
                          dense
                          outlined
                          class="FontSize"
                          label="Comment*"
                          :rules="[(v) => !!v || 'Required']"
                        >
                        </v-text-field>
                      </v-form>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-file-input
                        v-model="firstStepFiles"
                        dense
                        outlined
                        multiple
                        label="Upload Attachments"
                        class="FontSize"
                        :prepend-icon="null"
                        append-icon="mdi-paperclip"
                        :clearable="false"
                      >
                      </v-file-input>
                    </v-col>
                  </v-row>
                  <div v-if="firstStepFileUploading" class="mt-2 mb-2">
                    <v-progress-linear
                      indeterminate
                      color="blue"
                    ></v-progress-linear>
                    <div class="text-center mt-2">
                      File uploading, please wait
                    </div>
                  </div>
                  <v-row v-else>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-btn
                        color="primary"
                        small
                        class="text-capitalize"
                        @click="editOrViewAttachmentsMethod(1)"
                        >View Attachments<v-icon class="pl-1" small
                          >mdi-paperclip</v-icon
                        ></v-btn
                      >
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    >
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    >
                      <v-btn
                        small
                        color="black"
                        class="white--text mr-3"
                        :disabled="viewPdfComputedProp"
                        @click="viewPdfMethod(StoreObj.customer_fgr_pdf_s3_url)"
                        >View<v-icon small class="pl-1">mdi-eye</v-icon></v-btn
                      >
                      <v-btn
                        small
                        color="green"
                        class="white--text mr-3"
                        :disabled="!StoreObj.customer_fgr_pdf_s3_url"
                        @click="shareToCustomerMethod('TO_CUSTOMER')"
                        >Share to customer<v-icon small class="pl-1"
                          >mdi-share</v-icon
                        ></v-btn
                      >
                      <v-btn
                        :loading="firstStageSaveBtnLoading"
                        small
                        color="blue"
                        class="white--text"
                        @click="saveFgrMethod(1)"
                        >Save<v-icon small class="pl-1"
                          >mdi-bookmark</v-icon
                        ></v-btn
                      ></v-col
                    >
                  </v-row>
                </v-card>
              </div>
              <div v-if="fgrSavingSteps > 1" class="mt-5">
                <v-card color="#f3e5f5" class="mt-3 pa-5">
                  <div class="mb-5">
                    <h3>Advised to Bill Unit</h3>
                  </div>
                  <v-row>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="unitRep"
                        dense
                        outlined
                        class="FontSize"
                        label="Unit To Be Replaced From # Dealer or Distributor or Company*"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="machineModelBilled"
                        dense
                        outlined
                        class="FontSize"
                        label="Machine Model To Be Billed"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="machineSent"
                        dense
                        outlined
                        class="FontSize"
                        label="Machine To be Sent at  # Customer or Dealer or Distributor"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="defMachAction"
                        dense
                        outlined
                        class="FontSize"
                        label="Action To be Taken Against Defective Machine"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="debScrapVal"
                        dense
                        outlined
                        class="FontSize"
                        label="Scrap Value To Be Debited"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-form ref="secondCommentForm">
                        <v-text-field
                          v-model="secondSectionComment"
                          dense
                          outlined
                          class="FontSize"
                          label="Comment*"
                          :rules="[(v) => !!v || 'Required']"
                        >
                        </v-text-field>
                      </v-form>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-file-input
                        v-model="secondStepFiles"
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
                  <div v-if="secondStepFileUploading" class="mt-2 mb-2">
                    <v-progress-linear
                      indeterminate
                      color="blue"
                    ></v-progress-linear>
                    <div class="text-center mt-2">
                      File uploading, please wait
                    </div>
                  </div>
                  <v-row v-else>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-btn
                        color="primary"
                        small
                        class="text-capitalize"
                        @click="editOrViewAttachmentsMethod(2)"
                        >View Attachments<v-icon class="pl-1" small
                          >mdi-paperclip</v-icon
                        ></v-btn
                      >
                    </v-col>
                    <v-col cols="12" lg="4" md="4" sm="12" xs="12"></v-col>

                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    >
                      <v-btn
                        small
                        color="black"
                        class="white--text mr-3"
                        :disabled="!StoreObj.dealer_fgr_pdf_s3_url"
                        @click="viewPdfMethod(StoreObj.dealer_fgr_pdf_s3_url)"
                        >View<v-icon small class="pl-1">mdi-eye</v-icon></v-btn
                      >
                      <v-btn
                        small
                        color="green"
                        class="white--text mr-3"
                        :disabled="!StoreObj.dealer_fgr_pdf_s3_url"
                        @click="shareToCustomerMethod('TO_DEALER')"
                        >Share to dealer<v-icon small class="pl-1"
                          >mdi-share</v-icon
                        ></v-btn
                      >
                      <v-btn
                        :loading="secondStageSaveBtnLoading"
                        small
                        color="blue"
                        class="white--text"
                        @click="saveFgrMethod(2)"
                        >Save<v-icon small class="pl-1"
                          >mdi-bookmark</v-icon
                        ></v-btn
                      ></v-col
                    >
                  </v-row>
                </v-card>
              </div>

              <div v-if="fgrSavingSteps > 2" class="mt-5">
                <v-card color="#f3e5f5" class="mt-3 pa-5">
                  <div class="mb-5">
                    <h3>Unit Billed</h3>
                  </div>
                  <v-row>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="challanGenerated"
                        dense
                        outlined
                        class="FontSize"
                        label="SO/Challan Generated (Reference No)*"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-dialog
                        persistent
                        width="290px"
                        color="primary"
                        ref="so_generated_date"
                        v-model="soGeneratedDate"
                        :return-value.sync="soGenDate"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            readonly
                            v-on="on"
                            v-bind="attrs"
                            persistent-hint
                            color="primary"
                            class="FontSize mr-2"
                            label="Support Start Date"
                            v-model="soGenDate"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="primary"
                          scrollable
                          v-model="soGenDate"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="soGeneratedDate = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.so_generated_date.save(soGenDate)"
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-form ref="thirdCommentForm">
                        <v-text-field
                          v-model="thirdSectionComment"
                          dense
                          outlined
                          label="Comment*"
                          class="FontSize"
                          :rules="[(v) => !!v || 'Required']"
                        >
                        </v-text-field>
                      </v-form>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-file-input
                        v-model="thirdStepFiles"
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
                  <div v-if="thirdStepFileUploading" class="mt-2 mb-2">
                    <v-progress-linear
                      indeterminate
                      color="blue"
                    ></v-progress-linear>
                    <div class="text-center mt-2">
                      File uploading, please wait
                    </div>
                  </div>
                  <v-row v-else>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-btn
                        color="primary"
                        small
                        class="text-capitalize"
                        @click="editOrViewAttachmentsMethod(3)"
                        >View Attachments<v-icon class="pl-1" small
                          >mdi-paperclip</v-icon
                        ></v-btn
                      >
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    />
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    >
                      <v-btn
                        :loading="thirdStageSaveBtnLoading"
                        small
                        color="blue"
                        class="white--text"
                        @click="saveFgrMethod(3)"
                        >Save<v-icon small class="pl-1"
                          >mdi-bookmark</v-icon
                        ></v-btn
                      ></v-col
                    >
                  </v-row>
                </v-card>
              </div>
              <div v-if="fgrSavingSteps > 3" class="mt-5">
                <v-card color="#f3e5f5" class="mt-3 pa-5">
                  <div class="mb-5">
                    <h3>Unit Dispatched</h3>
                  </div>
                  <v-row>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="matDispatch"
                        dense
                        outlined
                        class="FontSize"
                        label="Material Dispatched (Invoice No)*"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-dialog
                        persistent
                        width="290px"
                        color="primary"
                        ref="mat_disp_date"
                        v-model="materialDispatchedDate"
                        :return-value.sync="matDispatchDate"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            readonly
                            v-on="on"
                            v-bind="attrs"
                            persistent-hint
                            color="primary"
                            class="FontSize mr-2"
                            label="Invoice Date"
                            v-model="matDispatchDate"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="primary"
                          scrollable
                          v-model="matDispatchDate"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="materialDispatchedDate = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.mat_disp_date.save(matDispatchDate)"
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="courierTransName"
                        dense
                        outlined
                        class="FontSize"
                        label="Courier/Transport Name"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-dialog
                        persistent
                        width="290px"
                        color="primary"
                        ref="dispatched_date"
                        v-model="dispatchedDate"
                        :return-value.sync="dispDate"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            readonly
                            v-on="on"
                            v-bind="attrs"
                            persistent-hint
                            color="primary"
                            class="FontSize mr-2"
                            label="Dispatched Date"
                            v-model="dispDate"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="primary"
                          scrollable
                          v-model="dispDate"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="dispatchedDate = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dispatched_date.save(dispDate)"
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="docketLrNo"
                        dense
                        outlined
                        label="Docket/LR Number"
                        class="FontSize"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-form ref="fourthCommentForm">
                        <v-text-field
                          v-model="fourthSectionComment"
                          dense
                          outlined
                          label="Comment*"
                          class="FontSize"
                          :rules="[(v) => !!v || 'Required']"
                        >
                        </v-text-field>
                      </v-form>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-file-input
                        v-model="fourthStepFiles"
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
                  <div v-if="fourthStepFileUploading" class="mt-2 mb-2">
                    <v-progress-linear
                      indeterminate
                      color="blue"
                    ></v-progress-linear>
                    <div class="text-center mt-2">
                      File uploading, please wait
                    </div>
                  </div>
                  <v-row v-else>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-btn
                        color="primary"
                        small
                        class="text-capitalize"
                        @click="editOrViewAttachmentsMethod(4)"
                        >View Attachments<v-icon class="pl-1" small
                          >mdi-paperclip</v-icon
                        ></v-btn
                      >
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    />

                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    >
                      <v-btn
                        :loading="fourthStageSaveBtnLoading"
                        small
                        color="blue"
                        class="white--text"
                        @click="saveFgrMethod(4)"
                        >Save<v-icon small class="pl-1"
                          >mdi-bookmark</v-icon
                        ></v-btn
                      ></v-col
                    >
                  </v-row>
                </v-card>
              </div>

              <div v-if="fgrSavingSteps > 4" class="mt-5">
                <v-card color="#f3e5f5" class="mt-3 pa-5">
                  <div class="mb-5">
                    <h3>Closing</h3>
                  </div>
                  <v-row>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="mrnCnIssued"
                        dense
                        outlined
                        class="FontSize"
                        label="Machine MRN or CN Issued (MRN No)*"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-dialog
                        persistent
                        width="290px"
                        color="primary"
                        ref="mrn_cn_issued_date"
                        v-model="mrnOrCnIssueDate"
                        :return-value.sync="mrnCnIssuedDate"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            readonly
                            v-on="on"
                            v-bind="attrs"
                            persistent-hint
                            color="primary"
                            class="FontSize mr-2"
                            label="MRN or CN Issued Date"
                            v-model="mrnCnIssuedDate"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="primary"
                          scrollable
                          v-model="mrnCnIssuedDate"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="mrnOrCnIssueDate = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.mrn_cn_issued_date.save(mrnCnIssuedDate)
                            "
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-text-field
                        v-model="scrapBillRefNo"
                        dense
                        outlined
                        class="FontSize"
                        label="Scrap Biiling Reference Number"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-dialog
                        persistent
                        width="290px"
                        color="primary"
                        ref="scrap_billing_date"
                        v-model="scrapBillingDate"
                        :return-value.sync="scrapBillDate"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            readonly
                            v-on="on"
                            v-bind="attrs"
                            persistent-hint
                            color="primary"
                            class="FontSize mr-2"
                            label="Scrap Billing Date"
                            v-model="scrapBillDate"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="primary"
                          scrollable
                          v-model="scrapBillDate"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="scrapBillingDate = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.scrap_billing_date.save(scrapBillDate)
                            "
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-form ref="fifthCommentForm">
                        <v-text-field
                          v-model="fifthSectionComment"
                          dense
                          outlined
                          label="Comment*"
                          class="FontSize"
                          :rules="[(v) => !!v || 'Required']"
                        >
                        </v-text-field>
                      </v-form>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-file-input
                        v-model="fifthStepFiles"
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
                  <div v-if="fifthStepFileUploading" class="mt-2 mb-2">
                    <v-progress-linear
                      indeterminate
                      color="blue"
                    ></v-progress-linear>
                    <div class="text-center mt-2">
                      File uploading, please wait
                    </div>
                  </div>
                  <v-row v-else>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0"
                    >
                      <v-btn
                        color="primary"
                        small
                        class="text-capitalize"
                        @click="editOrViewAttachmentsMethod(5)"
                        >View Attachments<v-icon class="pl-1" small
                          >mdi-paperclip</v-icon
                        ></v-btn
                      >
                    </v-col>
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    />
                    <v-col
                      cols="12"
                      lg="4"
                      md="4"
                      sm="12"
                      xs="12"
                      class="pt-0 pb-0 d-flex justify-end"
                    >
                      <v-btn
                        :loading="fifthStageSaveBtnLoading"
                        small
                        color="blue"
                        class="white--text"
                        @click="saveFgrMethod(5)"
                        >Save<v-icon small class="pl-1"
                          >mdi-bookmark</v-icon
                        ></v-btn
                      ></v-col
                    >
                  </v-row>
                </v-card>
              </div>

              <!-- <div
                class="mx-auto mt-3"
                v-if="savedUploadedFiles && savedUploadedFiles.length > 0 && StoreObj.requested_approver_type !== 'SECONDARY'"
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
                class="mt-3"
                v-if="selected_files && selected_files.length != 0"
              >
                <div class="mb-2">
                  <strong>Selected Files</strong>
                </div>
                <v-data-table
                  dense
                  class="elevation-0"
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
              </div> -->
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-end">
            <!-- <div
              class="mr-2"
              v-if="StoreObj.requested_approver_type === 'SECONDARY'"
            >
              <v-btn
                :loading="saveBtnLoading"
                small
                color="blue"
                class="white--text"
                @click="saveOrApproveFgrMethod('SAVE')"
                >Save<v-icon small class="pl-1">mdi-bookmark</v-icon></v-btn
              >
            </div> -->
            <div class="ml-2">
              <v-btn
                :loading="approveBtnLoading"
                :disabled="conditionDisable"
                small
                :color="
                  StoreObj.requested_approver_type === 'PRIMARY'
                    ? 'green'
                    : 'red'
                "
                class="white--text"
                @click="saveOrApproveFgrMethod('APPROVE')"
                >{{
                  StoreObj.requested_approver_type === "PRIMARY"
                    ? "Approve"
                    : "Close"
                }}<v-icon small class="pl-1">{{
                  StoreObj.requested_approver_type === "PRIMARY"
                    ? "mdi-check"
                    : "mdi-close"
                }}</v-icon></v-btn
              >
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { FgrApproval } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";

import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import ViewAttachments from "@/components/FGR/Dialogs/ViewFgrAttachments.vue";
import EditFgrAttachments from "@/components/FGR/Dialogs/EditFgrAttachments.vue";

import ShareToCustomer from "@/components/FGR/Dialogs/ShareToCustomer.vue";
export default {
  mixins: [GenerateS3URL, GetTicketDetails],
  props: { ApproveFgrDialog: Boolean, StoreObj: Object },
  components: {
    Snackbar,
    Overlay,
    ViewAttachments,
    EditFgrAttachments,
    ShareToCustomer,
  },
  data: () => ({
    overlay: false,
    ticketDetails: [],
    invoiceDate: undefined,
    approveBtnLoading: false,
    saveBtnLoading: false,
    componentNameFailure: "",
    repReason: "",
    machineCond: "",
    techTeamDecsn: "",
    invoiceValue: 0,
    machineUsedDays: 0,
    machineUsedMonth: "",
    invoiceAmount: "",
    perAgeDep: 0,
    unitRep: "",
    machineSent: "",
    defMachAction: "",
    debScrapVal: "",
    challanGenerated: "",
    soGenDate: "",
    matDispatch: "",
    matDispatchDate: "",
    courierTransName: "",
    dispDate: "",
    mrnCnIssued: "",
    mrnCnIssuedDate: "",
    scrapBillRefNo: "",
    defMachSoldTo: "",
    scrapBillDate: "",
    comment: "",
    firstSectionComment: "",
    secondSectionComment: "",
    thirdSectionComment: "",
    fourthSectionComment: "",
    fifthSectionComment: "",
    docketLrNo: "",
    freightCharges: 0,
    collOfDefMachine: "",
    newMachDispatch: "",
    totalAmountCollected: 0,
    totalAmountBrone: 0,
    totalLoss: 0,
    paymentDetails: "",
    approvalDetails: "",
    machineModelBilled: "",
    firstStepS3File: [],
    secondStepS3File: [],
    thirdStepS3File: [],
    fourthStepS3File: [],
    fifthStepS3File: [],
    s3FilePath: "",
    fgrSavingSteps: 1,
    Fgrcount: 1,
    epochSoGenDate: 0,
    epochMatDispDate: 0,
    epochDispatchedDate: 0,
    epochMrnCnIssuedDate: 0,
    epochScrapBillDate: 0,
    soGeneratedDate: false,
    materialDispatchedDate: false,
    dispatchedDate: false,
    mrnOrCnIssueDate: false,
    scrapBillingDate: false,
    files: [],
    firstStepFiles: [],
    secondStepFiles: [],
    thirdStepFiles: [],
    fourthStepFiles: [],
    fifthStepFiles: [],
    s3_files: [],
    selected_files: [],
    savedUploadedFiles: [],
    StoreStagesCount: [],
    AttachementObj: {},
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
    StagesArray: [
      {
        stage_enum: "STAGE_1",
        invoiceValue: "",
        firstSectionComment: "",
        machineUsedDays: "",
        machineUsedMonth: "",
        perAgeDep: "",
        invoiceAmount: "",
      },
      {
        stage_enum: "STAGE_2",
      },
      {
        stage_enum: "STAGE_3",
      },
      {
        stage_enum: "STAGE_4",
      },
      {
        stage_enum: "STAGE_5",
      },
    ],
    renderComp: true,
    SnackBarComponent: {},
    previewAttachments: false,
    EditFgrAttachemntsDialog: false,
    attachmentsModified: false,
    firstStepAttachmentsModified: false,
    secondStepAttachmentsModified: false,
    thirdStepAttachmentsModified: false,
    fourthStepAttachmentsModified: false,
    fifthStepAttachmentsModified: false,
    firstStageSaveBtnLoading: false,
    secondStageSaveBtnLoading: false,
    thirdStageSaveBtnLoading: false,
    fourthStageSaveBtnLoading: false,
    fifthStageSaveBtnLoading: false,
    shareToCustomerDialog: false,
    StoreArray: [],
    firstStepFileUploading: false,
    secondStepFileUploading: false,
    thirdStepFileUploading: false,
    fourthStepFileUploading: false,
    fifthStepFileUploading: false,
  }),

  watch: {
    async ApproveFgrDialog(val) {
      console.log("firstStepFileUploading", this.StoreObj);
      if (val && this.StoreObj.requested_approver_type === "SECONDARY") {
        this.ticketDetails = await this.TicketDetailsListMethod(
          this.StoreObj.ticket_id
        );

        if (
          this.ticketDetails[0]?.ticket_warranty_details?.ticket_invoice_date
        ) {
          this.invoiceDate =
            this.ticketDetails[0].ticket_warranty_details.ticket_invoice_date;
        } else {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText:
              "Couldn't able to fetch Invoice Date, please update in ticket!",
          };
          this.renderComp = false;
          this.$nextTick(() => {
            this.renderComp = true;
          });
        }

        this.invoiceValue = this.StoreObj.invoice_value || "";

        let ticket_created_on = this.StoreObj.ticket_created_on;
        let invoice_date = this.invoiceDate;

        this.machineUsedDays =
          this.calculateDaysDifference(ticket_created_on, invoice_date) || 0;

        this.perAgeDep =
          parseFloat(this.machineUsedMonth * 1.5).toFixed(2) || 0;

        // this.machineUsedMonth = this.StoreObj.machine_used_months || "";
        this.invoiceAmount =
          this.StoreObj.deprecation_amount_payable_on_invoice_value || "";
        // this.perAgeDep =
        //   this.StoreObj.total_percentage_of_age_of_dep_applicable || "";
        this.unitRep =
          this.StoreObj
            .unit_to_be_replaced_from_dealer_or_distributor_or_company || "";
        this.machineSent =
          this.StoreObj
            .machine_to_be_sent_at_customer_or_dealer_or_distributor || "";
        this.defMachAction =
          this.StoreObj
            .secondary_approved_action_to_be_taken_against_defective_machine ||
          "";
        this.debScrapVal =
          this.StoreObj.secondary_approved_scrap_value_to_be_debited || "";
        this.challanGenerated = this.StoreObj.so_challan_generated || "";
        this.soGenDate =
          this.StoreObj.so_challan_generated_date === undefined ||
          this.StoreObj.so_challan_generated_date === "" ||
          this.StoreObj.so_challan_generated_date === null
            ? ""
            : this.FormatedDateInYMDFormat(
                this.StoreObj.so_challan_generated_date
              );

        this.matDispatch = this.StoreObj.material_dispatched || "";
        this.matDispatchDate =
          this.StoreObj.material_dispatched_date === undefined ||
          this.StoreObj.material_dispatched_date === "" ||
          this.StoreObj.material_dispatched_date === null
            ? ""
            : this.FormatedDateInYMDFormat(
                this.StoreObj.material_dispatched_date
              );

        this.courierTransName = this.StoreObj.courier_tranport_name || "";
        this.docketLrNo = this.StoreObj.docket_number || "";
        this.dispDate =
          this.StoreObj.dispatched_date === undefined ||
          this.StoreObj.dispatched_date === "" ||
          this.StoreObj.dispatched_date === null
            ? ""
            : this.FormatedDateInYMDFormat(this.StoreObj.dispatched_date);
        this.mrnCnIssued = this.StoreObj.machine_mrn_or_cn_issued;
        this.mrnCnIssuedDate =
          this.StoreObj.mrn_or_cn_issued_date === undefined ||
          this.StoreObj.mrn_or_cn_issued_date === "" ||
          this.StoreObj.mrn_or_cn_issued_date === null
            ? ""
            : this.FormatedDateInYMDFormat(this.StoreObj.mrn_or_cn_issued_date);
        this.scrapBillRefNo =
          this.StoreObj.scrap_billing_reference_number || "";
        this.defMachSoldTo =
          this.StoreObj.secondary_approved_defective_machine_to_be_sold_to ||
          null;
        this.machineModelBilled = this.StoreObj.machine_model || undefined;
        this.scrapBillDate =
          this.StoreObj.scrap_billing_date === undefined ||
          this.StoreObj.scrap_billing_date === "" ||
          this.StoreObj.scrap_billing_date === null
            ? ""
            : this.FormatedDateInYMDFormat(this.StoreObj.scrap_billing_date);
        // this.savedUploadedFiles =
        //   this.StoreObj.secondary_approved_attachment_file.length === 0
        //     ? []
        //     : [...this.StoreObj.secondary_approved_attachment_file];
        this.firstSectionComment = this.StoreObj.first_section_comments || "";
        this.secondSectionComment = this.StoreObj.second_section_comments || "";
        this.thirdSectionComment = this.StoreObj.third_section_comments || "";
        this.fourthSectionComment = this.StoreObj.fourth_section_comments || "";
        this.fifthSectionComment = this.StoreObj.fifth_section_comments || "";
        this.freightCharges = this.StoreObj.freight_charges || 0;
        this.collOfDefMachine =
          this.StoreObj.collection_of_defective_machine || "";
        this.newMachDispatch = this.StoreObj.dispatch_of_new_machine || "";
        this.totalAmountCollected =
          this.StoreObj.total_amount_to_be_collected_from_customer || 0;
        this.totalAmountBrone =
          this.StoreObj.total_amount_to_be_brone_by_company || 0;
        this.totalLoss = this.StoreObj.total_loss || 0;
        this.paymentDetails = this.StoreObj.payment_details || "";
        this.approvalDetails = this.StoreObj.approval_details || "";
        if (this.StoreObj.first_section_saved === true) {
          this.fgrSavingSteps = 2;
        }
        if (this.StoreObj.second_section_saved === true) {
          this.fgrSavingSteps = 3;
        }
        if (this.StoreObj.third_section_saved === true) {
          this.fgrSavingSteps = 4;
        }
        if (this.StoreObj.fourth_section_saved === true) {
          this.fgrSavingSteps = 5;
        }
        if (this.StoreObj.fifth_section_saved === true) {
          this.fgrSavingSteps = 6;
        }
      }
    },

    invoiceValue(val) {
      if (val) {
        const depreciationAmount =
          parseFloat(val) * (parseFloat(this.perAgeDep) / 100);

        this.invoiceAmount = depreciationAmount.toFixed(2);
        this.totalAmountCollected =
          Number(this.freightCharges) + Number(this.invoiceAmount);
      }
    },

    freightCharges(val) {
      if (val) {
        this.totalAmountCollected = this.totalAmountCollected =
          Number(val) + Number(this.invoiceAmount);
      }
    },

    files(val) {
      this.selected_files = [];
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    // files(val) {
    //   this.selected_files = [];
    //   if (val.length != 0 && val != undefined && val != null) {
    //     for (let i = 0; i < val.length; i++) {
    //       this.selected_files.push(val[i]);
    //     }
    //   }
    // },
    async firstStepFiles(val) {
      if (val[0]?.name) {
        console.log("PPP", val[0].name);
        this.firstStepFileUploading = true;
        this.overlay = true;
        this.selected_files = [];
        if (val.length != 0 && val != undefined && val != null) {
          for (let i = 0; i < val.length; i++) {
            this.selected_files.push(val[i]);
          }
          this.s3FilePath = "FIRST_STEP";
          await this.s3FileUploadMethod();
        }
      }
    },
    async secondStepFiles(val) {
      if (val[0]?.name) {
        this.secondStepFileUploading = true;
        this.overlay = true;
        this.selected_files = [];
        // this.s3_files = [];
        if (val.length != 0 && val != undefined && val != null) {
          for (let i = 0; i < val.length; i++) {
            this.selected_files.push(val[i]);
          }
          this.s3FilePath = "SECOND_STEP";
          await this.s3FileUploadMethod();
        }
      }
    },
    async thirdStepFiles(val) {
      if (val[0]?.name) {
        this.thirdStepFileUploading = true;
        this.overlay = true;
        this.selected_files = [];
        // this.s3_files = [];
        if (val.length != 0 && val != undefined && val != null) {
          for (let i = 0; i < val.length; i++) {
            this.selected_files.push(val[i]);
          }
          this.s3FilePath = "THIRD_STEP";
          await this.s3FileUploadMethod();
        }
      }
    },
    async fourthStepFiles(val) {
      if (val[0]?.name) {
        this.fourthStepFileUploading = true;
        this.overlay = true;
        this.selected_files = [];
        // this.s3_files = [];
        if (val.length != 0 && val != undefined && val != null) {
          for (let i = 0; i < val.length; i++) {
            this.selected_files.push(val[i]);
          }
          this.s3FilePath = "FOURTH_STEP";
          await this.s3FileUploadMethod();
        }
      }
    },
    async fifthStepFiles(val) {
      if (val[0]?.name) {
        this.fifthStepFileUploading = true;
        this.overlay = true;
        this.selected_files = [];
        // this.s3_files = [];
        if (val.length != 0 && val != undefined && val != null) {
          for (let i = 0; i < val.length; i++) {
            this.selected_files.push(val[i]);
          }
          this.s3FilePath = "FIFTH_STEP";
          await this.s3FileUploadMethod();
        }
      }
    },
    soGenDate(val) {
      if (val) {
        this.epochSoGenDate = this.convertDateToEpoch(val);
      }
    },

    matDispatchDate(val) {
      if (val) {
        this.epochMatDispDate = this.convertDateToEpoch(val);
      }
    },

    dispDate(val) {
      if (val) {
        this.epochDispatchedDate = this.convertDateToEpoch(val);
      }
    },

    mrnCnIssuedDate(val) {
      if (val) {
        this.epochMrnCnIssuedDate = this.convertDateToEpoch(val);
      }
    },

    scrapBillDate(val) {
      if (val) {
        this.epochScrapBillDate = this.convertDateToEpoch(val);
      }
    },

    firstStepFileUploading(val) {
      if (val === false) {
        this.editOrViewAttachmentsMethod(1);
      }
    },

    secondStepFileUploading(val) {
      if (val === false) {
        this.editOrViewAttachmentsMethod(2);
      }
    },

    thirdStepFileUploading(val) {
      if (val === false) {
        this.editOrViewAttachmentsMethod(3);
      }
    },

    fourthStepFileUploading(val) {
      if (val === false) {
        this.editOrViewAttachmentsMethod(4);
      }
    },

    fifthStepFileUploading(val) {
      if (val === false) {
        this.editOrViewAttachmentsMethod(5);
      }
    },
  },

  computed: {
    conditionDisable() {
      if (this.StoreObj.requested_approver_type === "SECONDARY") {
        if (this.StoreObj.fifth_section_saved) {
          return false;
        } else {
          if (this.fgrSavingSteps === 6) {
            return false;
          } else {
            return true;
          }
        }
      }
    },

    viewPdfComputedProp() {
      if (this.StoreObj.customer_fgr_pdf_s3_url) {
        return false;
      } else {
        return true;
      }
    },
  },

  methods: {
    convertDateToEpoch(dateVal) {
      try {
        const selectedDate = new Date(dateVal);
        if (isNaN(selectedDate.getTime())) {
          throw new Error("Invalid date format. Please use 'yyyy-mm-dd'.");
        }
        selectedDate.setHours(0, 0, 0, 0);
        const epochTime = Math.floor(selectedDate.getTime() / 1000);
        return epochTime;
      } catch (error) {
        alert(error.message);
        return null;
      }
    },

    viewPdfMethod(url) {
      window.open(url);
    },

    FormatedDateTime(item) {
      const date = new Date(item * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year} `;
    },

    FormatedDateInYMDFormat(item) {
      const date = new Date(item * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day} `;
    },

    viewAttachmentsMethod(type) {
      if (type == "Fgr_Initated") {
        this.StoreArray = this.StoreObj.fgr_initiated_attachments;
      } else if (type == "Primary_Approved") {
        this.StoreArray = this.StoreObj.primary_approved_attachment_file;
      }

      this.previewAttachments = true;
    },
    calculateDaysDifference(ticketCreatedOn, invoiceDate) {
      console.log("CREAT_ON", ticketCreatedOn);
      console.log("INV_DTAE", invoiceDate);
      if (/^\d{2}-\d{2}-\d{4}$/.test(invoiceDate)) {
        const [dd, mm, yyyy] = invoiceDate.split("-");
        invoiceDate = `${yyyy}-${mm}-${dd}`;
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(invoiceDate)) {
        const [dd, mm, yyyy] = invoiceDate.split("/");
        invoiceDate = `${yyyy}-${mm}-${dd}`;
      }
      const endDate = new Date(ticketCreatedOn * 1000);
      const startDate = new Date(invoiceDate);
      const diffInMs = endDate - startDate;
      const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      let fullMonths = 0;
      let current = new Date(startDate);
      while (true) {
        const nextMonth = new Date(current);
        nextMonth.setMonth(current.getMonth() + 1);
        if (nextMonth <= endDate) {
          fullMonths++;
          current = nextMonth;
        } else {
          break;
        }
      }
      const remainingMs = endDate - current;
      const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const daysInMonth = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      ).getDate();
      const partialMonth = remainingDays / daysInMonth;
      this.machineUsedMonth = parseFloat(
        (fullMonths + partialMonth).toFixed(2)
      );

      return totalDays;
    },

    async s3FileUploadMethod() {
      if (this.selected_files.length > 0) {
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

          if (this.s3FilePath === "FIRST_STEP") {
            this.firstStepS3File.push(Obj);
            setTimeout(() => {
              result.status === "SUCCESS"
                ? (this.firstStepFileUploading = false)
                : null;
              this.overlay = false;
            }, 3000);
          } else if (this.s3FilePath === "SECOND_STEP") {
            this.secondStepS3File.push(Obj);
            setTimeout(() => {
              result.status === "SUCCESS"
                ? (this.secondStepFileUploading = false)
                : null;
              this.overlay = false;
            }, 3000);
          } else if (this.s3FilePath === "THIRD_STEP") {
            this.thirdStepS3File.push(Obj);
            setTimeout(() => {
              result.status === "SUCCESS"
                ? (this.thirdStepFileUploading = false)
                : null;
              this.overlay = false;
            }, 3000);
          } else if (this.s3FilePath === "FOURTH_STEP") {
            this.fourthStepS3File.push(Obj);
            setTimeout(() => {
              result.status === "SUCCESS"
                ? (this.fourthStepFileUploading = false)
                : null;
              this.overlay = false;
            }, 3000);
          } else if (this.s3FilePath === "FIFTH_STEP") {
            this.fifthStepS3File.push(Obj);
            setTimeout(() => {
              result.status === "SUCCESS"
                ? (this.fifthStepFileUploading = false)
                : null;
              this.overlay = false;
            }, 3000);
          }
          this.s3_files.push(Obj);
        }
      }
    },

    editOrViewAttachmentsMethod(STAGE_NO) {
      if (STAGE_NO === 1) {
        this.s3FilePath = "FIRST_STEP";
        if (this.firstStepAttachmentsModified === false) {
          this.AttachementObj.section_attachments = [
            ...(this.StoreObj.first_section_attachments ?? []),
          ];
          this.AttachementObj.newly_added_attachments = [
            ...(this.firstStepS3File ?? []),
          ];
        } else {
          this.AttachementObj = {};
          this.AttachementObj.newly_added_attachments = [
            ...(this.firstStepS3File ?? []),
          ];
        }
      } else if (STAGE_NO === 2) {
        this.s3FilePath = "SECOND_STEP";
        if (this.secondStepAttachmentsModified === false) {
          this.AttachementObj.section_attachments = [
            ...(this.StoreObj.second_section_attachments ?? []),
          ];
          this.AttachementObj.newly_added_attachments = [
            ...(this.secondStepS3File ?? []),
          ];
        } else {
          this.AttachementObj = {};
          this.AttachementObj.newly_added_attachments = [
            ...(this.secondStepS3File ?? []),
          ];
        }
      } else if (STAGE_NO === 3) {
        this.s3FilePath = "THIRD_STEP";
        if (this.thirdStepAttachmentsModified === false) {
          this.AttachementObj.section_attachments = [
            ...(this.StoreObj.third_section_attachments ?? []),
          ];
          this.AttachementObj.newly_added_attachments = [
            ...(this.thirdStepS3File ?? []),
          ];
        } else {
          this.AttachementObj = {};
          this.AttachementObj.newly_added_attachments = [
            ...(this.thirdStepS3File ?? []),
          ];
        }
      } else if (STAGE_NO === 4) {
        this.s3FilePath = "FOURTH_STEP";
        if (this.fourthStepAttachmentsModified === false) {
          this.AttachementObj.section_attachments = [
            ...(this.StoreObj.fourth_section_attachments ?? []),
          ];
          this.AttachementObj.newly_added_attachments = [
            ...(this.fourthStepS3File ?? []),
          ];
        } else {
          this.AttachementObj = {};
          this.AttachementObj.newly_added_attachments = [
            ...(this.fourthStepS3File ?? []),
          ];
        }
      } else if (STAGE_NO === 5) {
        this.s3FilePath = "FIFTH_STEP";
        if (this.fifthStepAttachmentsModified === false) {
          this.AttachementObj.section_attachments = [
            ...(this.StoreObj.fifth_section_attachments ?? []),
          ];
          this.AttachementObj.newly_added_attachments = [
            ...(this.fifthStepS3File ?? []),
          ];
        } else {
          this.AttachementObj = {};
          this.AttachementObj.newly_added_attachments = [
            ...(this.fifthStepS3File ?? []),
          ];
        }
      }
      this.EditFgrAttachemntsDialog = true;
    },

    getCurrentDateTimeEpoch() {
      const now = new Date();

      // Current date and time (human-readable)
      const dateTime = now.toLocaleString(); // or now.toISOString() if you prefer ISO format

      // 10-digit Unix epoch timestamp (in seconds)
      const epochTime = Math.floor(now.getTime() / 1000);
      return epochTime;
    },

    async saveFgrMethod(StageNumber) {
      const CurrentSavingStageNumber = StageNumber;
      switch (StageNumber) {
        case 1:
          if (
            this.invoiceValue !== "" &&
            this.$refs.firstCommentForm.validate()
          ) {
            this.firstStageSaveBtnLoading = true;
            let savedObjForFirstStep = {
              invoice_value: this.invoiceValue,
              machine_used_days: this.machineUsedDays || undefined,
              machine_used_months:
                this.machineUsedMonth === "0.00"
                  ? undefined
                  : this.machineUsedMonth || undefined,
              total_percentage_of_age_of_dep_applicable:
                this.perAgeDep === "0.00"
                  ? undefined
                  : this.perAgeDep || undefined,
              deprecation_amount_payable_on_invoice_value:
                this.invoiceAmount.toString() === "0.00"
                  ? undefined
                  : this.invoiceAmount.toString() || undefined,
              first_section_comments: this.firstSectionComment,
              comments: this.comment || undefined,
              first_section_attachments:
                this.firstStepS3File.length > 0
                  ? this.firstStepS3File
                  : undefined,
              first_section_saved: true,
              freight_charges: parseInt(this.freightCharges) || undefined,
              collection_of_defective_machine:
                this.collOfDefMachine || undefined,
              dispatch_of_new_machine: this.newMachDispatch || undefined,
              total_amount_to_be_collected_from_customer:
                parseInt(this.totalAmountCollected) || undefined,
              total_amount_to_be_brone_by_company:
                parseInt(this.totalAmountBrone) || undefined,
              total_loss: parseInt(this.totalLoss) || undefined,
              payment_details: this.paymentDetails || undefined,
              approval_details: this.approvalDetails || undefined,
              first_section_saved_on: this.getCurrentDateTimeEpoch(),
              first_section_saved_by:
                this.$store.getters.get_current_user_details.user_name,
            };
            this.callApiForSaveFgrMethod(
              savedObjForFirstStep,
              CurrentSavingStageNumber
            );
          } else {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Kindly provide invoice value & add comment!",
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
          }
          // }
          break;
        case 2:
          // if (this.fgrSavingSteps === 2) {
          if (this.unitRep !== "" && this.$refs.secondCommentForm.validate()) {
            this.secondStageSaveBtnLoading = true;
            let savedObjForSecondStep = {
              unit_to_be_replaced_from_dealer_or_distributor_or_company:
                this.unitRep,
              machine_to_be_sent_at_customer_or_dealer_or_distributor:
                this.machineSent || undefined,
              secondary_approved_action_to_be_taken_against_defective_machine:
                this.defMachAction || undefined,
              secondary_approved_defective_machine_to_be_sold_to:
                this.defMachSoldTo || undefined,
              secondary_approved_scrap_value_to_be_debited:
                this.debScrapVal || undefined,
              second_section_comments: this.secondSectionComment,
              comments: this.secondSectionComment || undefined,
              second_section_attachments:
                this.secondStepS3File.length > 0
                  ? this.secondStepS3File
                  : undefined,
              machine_model: this.machineModelBilled || undefined,
              second_section_saved: true,
              second_section_saved_on: this.getCurrentDateTimeEpoch(),
            };
            this.callApiForSaveFgrMethod(
              savedObjForSecondStep,
              CurrentSavingStageNumber
            );
          } else {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Kindly fill mandatory field!",
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
          }
          // }
          break;
        case 3:
          if (
            this.challanGenerated !== "" &&
            this.$refs.thirdCommentForm.validate()
          ) {
            this.thirdStageSaveBtnLoading = true;
            let savedObjForThirdStep = {
              so_challan_generated: this.challanGenerated,
              so_challan_generated_date: this.epochSoGenDate || undefined,
              third_section_comments: this.thirdSectionComment,
              comments: this.thirdSectionComment || undefined,
              third_section_attachments:
                this.thirdStepS3File.length > 0
                  ? this.thirdStepS3File
                  : undefined,
              third_section_saved: true,
              third_section_saved_on: this.getCurrentDateTimeEpoch(),
            };
            this.callApiForSaveFgrMethod(
              savedObjForThirdStep,
              CurrentSavingStageNumber
            );
          } else {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Kindly fill mandatory field!",
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
          }
          break;
        case 4:
          if (
            this.matDispatch !== "" &&
            this.$refs.fourthCommentForm.validate()
          ) {
            this.fourthStageSaveBtnLoading = true;
            let savedObjForFourthStep = {
              material_dispatched: this.matDispatch || undefined,
              material_dispatched_date: this.epochMatDispDate || undefined,
              courier_tranport_name: this.courierTransName || undefined,
              docket_number: this.docketLrNo || undefined,
              dispatched_date: this.epochDispatchedDate || undefined,
              fourth_section_comments: this.fourthSectionComment || undefined,
              comments: this.fourthSectionComment || undefined,
              fourth_section_attachments:
                this.fourthStepS3File.length > 0
                  ? this.fourthStepS3File
                  : undefined,
              fourth_section_saved: true,
              fourth_section_saved_on: this.getCurrentDateTimeEpoch(),
            };
            this.callApiForSaveFgrMethod(
              savedObjForFourthStep,
              CurrentSavingStageNumber
            );
          } else {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Kindly fill mandatory field!",
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
          }
          break;
        case 5:
          if (
            this.mrnCnIssued !== "" &&
            this.$refs.fifthCommentForm.validate()
          ) {
            this.fifthStageSaveBtnLoading = true;
            let savedObjForFifthStep = {
              machine_mrn_or_cn_issued: this.mrnCnIssued,
              fifth_section_comments: this.fifthSectionComment || undefined,
              mrn_or_cn_issued_date: this.epochMrnCnIssuedDate || undefined,
              scrap_billing_reference_number: this.scrapBillRefNo || undefined,
              scrap_billing_date: this.epochScrapBillDate || undefined,
              comments: this.fifthSectionComment || undefined,
              fifth_section_attachments:
                this.fifthStepS3File.length > 0
                  ? this.fifthStepS3File
                  : undefined,
              fifth_section_saved: true,
              fifth_section_saved_on: this.getCurrentDateTimeEpoch(),
            };
            this.callApiForSaveFgrMethod(
              savedObjForFifthStep,
              CurrentSavingStageNumber
            );
          } else {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Kindly fill mandatory field!",
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
          }
          break;
      }
      // if (this.fgrSavingSteps === 3) {

      // } else if (this.fgrSavingSteps === 4) {

      // } else if (this.fgrSavingSteps === 5) {

      // }
    },

    async callApiForSaveFgrMethod(OBJ, CurrentSavingStageNumber) {
      try {
        this.saveBtnLoading = true;
        const result = await API.graphql(
          graphqlOperation(FgrApproval, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              finished_goods_receipt_id:
                this.StoreObj.finished_goods_receipt_id,
              action_type: "SAVE",
              comments: this.comment || undefined,
              ...OBJ,
            },
          })
        );
        const response = JSON.parse(result.data.FgrApproval);
        if (response.status === "SUCCESS") {
          let findStage = this.StoreStagesCount.find(
            (i) => i === CurrentSavingStageNumber
          );
          if (!findStage) {
            this.StoreStagesCount.push(CurrentSavingStageNumber);
          }
          if (CurrentSavingStageNumber <= 5) {
            this.Fgrcount = this.fgrSavingSteps;
            if (CurrentSavingStageNumber >= this.Fgrcount) {
              if (!findStage) {
                this.fgrSavingSteps = CurrentSavingStageNumber + 1;
              }
            }
          }
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
          this.files = [];
          this.s3_files = [];
          this.selected_files = [];

          // this.ApproveFgrDialogEmit(2);
          this.firstStageSaveBtnLoading = false;
          this.secondStageSaveBtnLoading = false;
          this.thirdStageSaveBtnLoading = false;
          this.fourthStageSaveBtnLoading = false;
          this.fifthStageSaveBtnLoading = false;
        }
      } catch (error) {
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
        this.firstStageSaveBtnLoading = false;
        this.secondStageSaveBtnLoading = false;
        this.thirdStageSaveBtnLoading = false;
        this.fourthStageSaveBtnLoading = false;
        this.fifthStageSaveBtnLoading = false;
      }
    },

    async saveOrApproveFgrMethod(ACTION) {
      let valCheck;
      if (this.StoreObj.requested_approver_type === "PRIMARY") {
        valCheck = this.componentNameFailure || false;
      } else {
        valCheck = this.invoiceValue || false;
      }
      if (valCheck !== false) {
        try {
          ACTION === "APPROVE"
            ? (this.approveBtnLoading = true)
            : (this.saveBtnLoading = true);
          let objForApi = {};
          if (this.StoreObj.requested_approver_type === "PRIMARY") {
            if (this.selected_files.length > 0) {
              await this.s3FileUploadMethod();
            }
            objForApi = {
              primary_approved_component_name: this.componentNameFailure,
              primary_approved_reason_for_replacement: this.repReason,
              primary_approved_condition_of_machine: this.machineCond,
              primary_approved_decision: this.techTeamDecsn,
              primary_approved_attachment_file:
                this.s3_files.length > 0 ? this.s3_files : undefined,
              comments: this.comment || undefined,
            };
          }
          const result = await API.graphql(
            graphqlOperation(FgrApproval, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                updater_user_id:
                  this.$store.getters.get_current_user_details.user_id,
                finished_goods_receipt_id:
                  this.StoreObj.finished_goods_receipt_id,
                action_type: ACTION,
                ...objForApi,
              },
            })
          );
          const response = JSON.parse(result.data.FgrApproval);
          if (response.status === "SUCCESS") {
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
            this.ApproveFgrDialogEmit(2);
            ACTION === "APPROVE"
              ? (this.approveBtnLoading = false)
              : (this.saveBtnLoading = false);
          }
        } catch (error) {
          ACTION === "APPROVE"
            ? (this.approveBtnLoading = false)
            : (this.saveBtnLoading = false);
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
          console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly fill the text field which is mandatory!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
    },

    shareToCustomerMethod(share_to) {
      this.StoreObj.share_to = share_to;
      this.shareToCustomerDialog = true;
    },

    ApproveFgrDialogEmit(Toggle) {
      // this.componentNameFailure = "";
      // this.repReason = "";
      // this.machineCond = "";
      // this.techTeamDecsn = "";
      // this.invoiceValue = 0;
      // this.machineUsedDays = 0;
      // this.machineUsedMonth = "";
      // this.invoiceAmount = "";
      // this.perAgeDep = 0;
      // this.unitRep = "";
      // this.machineSent = "";
      // this.defMachAction = "";
      // this.debScrapVal = "";
      // this.challanGenerated = "";
      // this.soGenDate = "";
      // this.matDispatch = "";
      // this.matDispatchDate = "";
      // this.courierTransName = "";
      // this.docketLrNo = "";
      // this.dispDate = "";
      // this.mrnCnIssued = "";
      // this.mrnCnIssuedDate = "";
      // this.scrapBillRefNo = "";
      // this.defMachSoldTo = "";
      // this.scrapBillDate = "";
      // this.comment = "";
      // this.freightCharges = 0;
      // this.collOfDefMachine = "";
      // this.newMachDispatch = "";
      // this.totalAmountCollected = 0;
      // this.totalAmountBrone = 0;
      // this.totalLoss = 0;
      // this.paymentDetails = "";
      // this.approvalDetails = "";
      // this.epochSoGenDate = 0;
      // this.epochMatDispDate = 0;
      // this.epochDispatchedDate = 0;
      // this.epochMrnCnIssuedDate = 0;
      // this.epochScrapBillDate = 0;
      // this.soGeneratedDate = false;
      // this.materialDispatchedDate = false;
      // this.dispatchedDate = false;
      // this.mrnOrCnIssueDate = false;
      // this.scrapBillingDate = false;
      // this.firstStepAttachmentsModified = false;
      // this.secondStepAttachmentsModified = false;
      // this.thirdStepAttachmentsModified = false;
      // this.fourthStepAttachmentsModified = false;
      // this.fifthStepAttachmentsModified = false;
      // this.files = [];
      // this.s3_files = [];
      // this.selected_files = [];
      // this.savedUploadedFiles = [];
      // this.AttachementObj = {};
      // this.fgrSavingSteps = 1;
      // this.StoreArray = [];
      // this.firstStepFiles = [];
      // this.secondStepFiles = [];
      // this.thirdStepFiles = [];
      // this.fourthStepFiles = [];
      // this.fifthStepFiles = [];
      this.ticketDetails = [];
      this.invoiceDate = undefined;
      this.approveBtnLoading = false;
      this.saveBtnLoading = false;
      this.componentNameFailure = "";
      this.repReason = "";
      this.machineCond = "";
      this.techTeamDecsn = "";
      this.invoiceValue = 0;
      this.machineUsedDays = 0;
      this.machineUsedMonth = "";
      this.invoiceAmount = "";
      this.perAgeDep = 0;
      this.unitRep = "";
      this.machineSent = "";
      this.defMachAction = "";
      this.debScrapVal = "";
      this.challanGenerated = "";
      this.soGenDate = "";
      this.matDispatch = "";
      this.matDispatchDate = "";
      this.dispDate = "";
      this.mrnCnIssued = "";
      this.mrnCnIssuedDate = "";
      this.scrapBillRefNo = "";
      this.defMachSoldTo = "";
      this.scrapBillDate = "";
      this.comment = "";
      this.firstSectionComment = "";
      this.secondSectionComment = "";
      this.thirdSectionComment = "";
      this.fourthSectionComment = "";
      this.fifthSectionComment = "";
      this.docketLrNo = "";
      this.freightCharges = 0;
      this.collOfDefMachine = "";
      this.newMachDispatch = "";
      this.totalAmountCollected = 0;
      this.totalAmountBrone = 0;
      this.totalLoss = 0;
      this.paymentDetails = "";
      this.approvalDetails = "";
      this.machineModelBilled = "";
      this.firstStepS3File = [];
      this.secondStepS3File = [];
      this.thirdStepS3File = [];
      this.fourthStepS3File = [];
      this.fifthStepS3File = [];
      this.s3FilePath = "";
      this.fgrSavingSteps = 1;
      this.Fgrcount = 1;
      this.epochSoGenDate = 0;
      this.epochMatDispDate = 0;
      this.epochDispatchedDate = 0;
      this.epochMrnCnIssuedDate = 0;
      this.epochScrapBillDate = 0;
      this.soGeneratedDate = false;
      this.materialDispatchedDate = false;
      this.dispatchedDate = false;
      this.mrnOrCnIssueDate = false;
      this.scrapBillingDate = false;
      this.files = [];
      this.firstStepFiles = [];
      this.secondStepFiles = [];
      this.thirdStepFiles = [];
      this.fourthStepFiles = [];
      this.fifthStepFiles = [];
      this.s3_files = [];
      this.selected_files = [];
      this.savedUploadedFiles = [];
      this.StoreStagesCount = [];
      this.AttachementObj = {};
      this.previewAttachments = false;
      this.EditFgrAttachemntsDialog = false;
      this.attachmentsModified = false;
      this.firstStepAttachmentsModified = false;
      this.secondStepAttachmentsModified = false;
      this.thirdStepAttachmentsModified = false;
      this.fourthStepAttachmentsModified = false;
      this.fifthStepAttachmentsModified = false;
      this.firstStageSaveBtnLoading = false;
      this.secondStageSaveBtnLoading = false;
      this.thirdStageSaveBtnLoading = false;
      this.fourthStageSaveBtnLoading = false;
      this.fifthStageSaveBtnLoading = false;
      this.shareToCustomerDialog = false;
      this.StoreArray = [];
      this.firstStepFileUploading = false;
      this.secondStepFileUploading = false;
      this.thirdStepFileUploading = false;
      this.fourthStepFileUploading = false;
      this.fifthStepFileUploading = false;
      this.overlay = false;
      this.$emit("clicked", Toggle);
    },

    previewAttachmentsEmit(Toggle) {
      this.previewAttachments = false;
    },

    EditFgrAttachemntsDialogEmit(Toggle, extractedAttachments) {
      this.EditFgrAttachemntsDialog = false;
      if (Toggle === 2) {
        if (this.s3FilePath === "FIRST_STEP") {
          this.firstStepS3File = [];
          this.firstStepS3File = extractedAttachments;
          this.firstStepAttachmentsModified = true;
        } else if (this.s3FilePath === "SECOND_STEP") {
          this.secondStepS3File = [];
          this.secondStepS3File = extractedAttachments;
          this.secondStepAttachmentsModified = true;
        } else if (this.s3FilePath === "THIRD_STEP") {
          this.thirdStepS3File = [];
          this.thirdStepS3File = extractedAttachments;
          this.thirdStepAttachmentsModified = true;
        } else if (this.s3FilePath === "FOURTH_STEP") {
          this.fourthStepS3File = [];
          this.fourthStepS3File = extractedAttachments;
          this.fourthStepAttachmentsModified = true;
        } else if (this.s3FilePath === "FIFTH_STEP") {
          this.fifthStepS3File = [];
          this.fifthStepS3File = extractedAttachments;
          this.fifthStepAttachmentsModified = true;
        }
        // this.attachmentsModified = true;
      }
    },

    ShareToCustomerDialogEmit(Toggle) {
      this.shareToCustomerDialog = false;
    },
  },
};
</script>
