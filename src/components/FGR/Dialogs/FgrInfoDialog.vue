<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <ViewAttachments
      :StoreArray="StoreArray"
      :StoredImages="StoredImages"
      :saveAttachment="saveAttachment"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <ViewTicketsDialog
      :ViewTicketsDialog="ViewTicketsDialog"
      :ActionObj="StoreObj"
      @clicked="ViewTicketsDialogEmit"
    />
    <v-dialog v-model="FgrInfoDialog" persistent :width="1000">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Product Replacement Details<strong class="ml-2"
              >(Product Replacement ID: {{ StoreObj.fgr_display_id }})</strong
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="FgrInfoDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pl-5">
          <v-tabs v-model="Tabmodel" slider-color="primary">
            <v-tab class="text-capitalize">Details</v-tab>
            <v-tab class="text-capitalize">History </v-tab>
            <v-tab class="text-capitalize">{{
              StoreObj.primary_rejected_comments ||
              StoreObj.secondary_rejected_comments
                ? "Requested, Rejected & Approved Details"
                : "Requested & Approved Details "
            }}</v-tab>
            <v-spacer />
          </v-tabs>
          <!-- <div
            class="fontsize20px font-weight-bold black--text"
            style="position: relative; left: 400px"
          >
            Product Replacement ID :
            <span class="black--text">{{ StoreObj.fgr_display_id }} </span>
          </div> -->
          <v-tabs-items v-model="Tabmodel">
            <v-tab-item>
              <v-card-text v-if="Tabmodel === 0">
                <v-row>
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <div>
                      <h2 class="black--text">Ticket Details</h2>
                      <div class="mt-4">
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text"
                              >Ticket ID: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.custom_ticket_id ||
                              StoreObj.ticket_id ||
                              "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Ticket Created On: </strong
                            ><span class="fontsize15px">{{
                              FormatedDateTime(StoreObj.ticket_created_on)
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Name: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_name || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Company Name: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_company_name || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Email ID: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_email_id || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Address: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_address || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Phone Number: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_contact_number || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >City: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_city || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >State: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_state || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Pincode: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.customer_pincode || "-"
                            }}</span></span
                          >
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    sm="12"
                    xs="12"
                    class="d-flex justify-start"
                  >
                    <div>
                      <h2 class="black--text">Initiator Details</h2>
                      <div class="pt-2">
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Initiator Name: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.user_name || StoreObj.user_name || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Initiator Contact No.: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.user_contact_number ||
                              StoreObj.user_contact_number ||
                              "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Initiator Email: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.user_email_id ||
                              StoreObj.user_email_id ||
                              "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text mt-3"
                              >Initiator Type: </strong
                            ><span class="fontsize15px">{{
                              StoreObj.user_type || StoreObj.user_type || "-"
                            }}</span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text"
                              >Initiated On: </strong
                            ><span class="fontsize15px">
                              {{
                                new Date(
                                  StoreObj.fgr_initiated_on * 1000
                                ).toLocaleString("en-GB")
                              }}
                              <!-- {{
                              new Date(
                                StoreObj.fgr_initiated_on
                              ).toLocaleString()
                            }} -->
                            </span></span
                          >
                        </div>
                        <div class="mt-3">
                          <span class="FontSize"
                            ><strong class="fontsize15px black--text"
                              >Machine Serial No. : </strong
                            ><span class="fontsize15px"
                              >{{ StoreObj.machine_serial_number
                              }}<v-icon
                                small
                                color="primary"
                                class="mt-n1 ml-2"
                                @click.stop="
                                  openviewTicketDetailsMethod(StoreObj)
                                "
                                >mdi-ticket</v-icon
                              ></span
                            ></span
                          >
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text v-if="Tabmodel === 1">
                <div style="display: flex; flex-direction: column" class="pt-3">
                  <v-card
                    color="#f3e5f5"
                    v-for="(item, index) in StoreObj.fgr_history"
                    :key="index"
                    class="pa-5 mb-4"
                  >
                    <div>
                      <p class="pa-0">
                        <span class="FontSize"
                          ><strong>Action Taken By: </strong
                          >{{ item.action_taken_by }}</span
                        >
                      </p>
                      <p class="pa-0">
                        <span class="FontSize"
                          ><strong>Action Time: </strong
                          >{{ item.action_time }}</span
                        >
                      </p>
                      <p class="pa-0">
                        <span class="FontSize"
                          ><strong>Action Type: </strong
                          >{{ item.action_type }}</span
                        >
                      </p>
                      <p class="pa-0">
                        <span class="FontSize"
                          ><strong>Email ID: </strong
                          >{{ item.user_contact }}</span
                        >
                      </p>
                    </div>
                  </v-card>
                </div>
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text v-if="Tabmodel === 2">
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
                              ><strong
                                >Product Replacement Request Date: </strong
                              >{{
                                FormatedDateTime(StoreObj.fgr_initiated_on) ||
                                "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Replacement Proposed By: </strong
                              >{{ StoreObj.user_name || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Replacement Category: </strong
                              >{{
                                StoreObj.replacement_category || "N/A"
                              }}</span
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
                                FormatedDateTime(StoreObj.ticket_created_on) ||
                                "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Name Of the Customer: </strong
                              >{{ StoreObj.customer_name || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong
                                >Type Of Customer (Customer or Dealer or
                                Distributor): </strong
                              >{{ StoreObj.type_of_customer || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Address of The Customer: </strong
                              >{{ StoreObj.customer_address || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Town/ City: </strong
                              >{{ StoreObj.customer_city || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Pin Code: </strong
                              >{{ StoreObj.customer_pincode || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Contact Name: </strong
                              >{{
                                StoreObj.customer_company_name || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Contact Number: </strong
                              >{{
                                StoreObj.customer_contact_number || "N/A"
                              }}</span
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
                              >{{
                                StoreObj.machine_serial_number || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Customer Invoice Number: </strong
                              >{{
                                StoreObj.customer_invoice_number || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Customer Invoice Date: </strong
                              >{{
                                StoreObj.customer_invoice_date || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Attachments: </strong
                              ><v-btn
                                @click="
                                  viewAttachmentsMethod(
                                    StoreObj.fgr_initiated_attachments,
                                    'SHARE_ATTACHMENTS'
                                  )
                                "
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
                                >Name of the party from where machine was
                                purchased: </strong
                              >{{
                                StoreObj.purchased_party_name || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong
                                >Address of the party from where machine was
                                purchased: </strong
                              >{{
                                StoreObj.purchased_party_address || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Direct Dealer Name: </strong
                              >{{ StoreObj.dealer_name || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Direct Dealer Address: </strong
                              >{{ StoreObj.dealer_address || "N/A" }}</span
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
                              >{{
                                StoreObj.technician_address || "N/A"
                              }}abc</span
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
                              >{{
                                StoreObj.reason_for_replacement || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong
                                >Scrap Value of The Defective Unit As Per
                                Policy: </strong
                              >{{ StoreObj.scrap_value || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Action To be Take: </strong
                              >{{ StoreObj.action_to_be_take || "N/A" }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Defective Machine To Be Sold To: </strong
                              >{{
                                StoreObj.defective_machine_to_be_sold_to ||
                                "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong>Scrap Value To Be Debited: </strong
                              >{{
                                StoreObj.scrap_value_to_be_debited || "N/A"
                              }}</span
                            >
                          </div>
                          <div>
                            <span class="FontSize"
                              ><strong
                                >New Machine To Be Dispatched To (Fill Complete
                                Address): </strong
                              >{{
                                StoreObj.new_machine_dispathed_to || "N/A"
                              }}</span
                            >
                          </div>
                          <div v-if="StoreObj.primary_rejected_comments">
                            <span class="FontSize"
                              ><strong>Primary Rejected Comment: </strong
                              >{{ StoreObj.primary_rejected_comments }}</span
                            >
                          </div>
                          <div v-if="StoreObj.secondary_rejected_comments">
                            <span class="FontSize"
                              ><strong>Secondary Rejected Comment: </strong
                              >{{ StoreObj.secondary_rejected_comments }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div
                  class="pt-5 pb-5"
                  v-if="StoreObj.primary_approved_component_name"
                >
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
                                ><strong>Evaluation of Case: </strong
                                >{{
                                  StoreObj.primary_approved_component_name ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Reason For Failure If Any: </strong
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
                                ><strong>Recomondation: </strong
                                >{{
                                  StoreObj.primary_approved_decision || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Comments: </strong
                                >{{
                                  StoreObj.primary_approved_comments || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Attachments: </strong
                                ><v-btn
                                  @click="
                                    viewAttachmentsMethod(
                                      StoreObj.primary_approved_attachment_file,
                                      'SHARE_ATTACHMENTS'
                                    )
                                  "
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

                <div class="pb-5 pt-3" v-if="StoreObj.invoice_value">
                  <div class="mb-2">
                    <h3>
                      Admin
                      {{
                        StoreObj.fgr_status === "PENDING"
                          ? "Saved"
                          : StoreObj.fgr_status === "REJECTED"
                          ? "Rejected"
                          : "Approved"
                      }}
                      Details
                    </h3>
                  </div>
                  <div style="border: 1px dashed black" class="pa-2 mb-2">
                    <v-row class="mb-3">
                      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                        <div>
                          <div class="pl-3 pt-2">
                            <div>
                              <span class="FontSize"
                                ><strong>Invoice Value: </strong
                                >{{ StoreObj.invoice_value || "N/A" }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Machine used (Days): </strong
                                >{{ StoreObj.machine_used_days || "N/A" }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Machine used (Months): </strong
                                >{{
                                  StoreObj.machine_used_months || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Total percenetage age of dep applicable: </strong
                                >{{
                                  StoreObj.total_percentage_of_age_of_dep_applicable ||
                                  "N/A"
                                }}</span
                              >
                            </div>

                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Depreciation amount payable on Invoice Value: </strong
                                >{{
                                  StoreObj.deprecation_amount_payable_on_invoice_value ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Freight Charges: </strong
                                >{{ StoreObj.freight_charges || "N/A" }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Total Amount To Be Collected From Customer: </strong
                                >{{
                                  StoreObj.total_amount_to_be_collected_from_customer ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Total Amount To Be Brone By Company: </strong
                                >{{
                                  StoreObj.total_amount_to_be_brone_by_company ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Depreciation amount payable on Invoice Value: </strong
                                >{{
                                  StoreObj.deprecation_amount_payable_on_invoice_value ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Total Loss: </strong
                                >{{ StoreObj.total_loss || "N/A" }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Payment Details: </strong
                                >{{ StoreObj.payment_details || "N/A" }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Approval Details: </strong
                                >{{ StoreObj.approval_details || "N/A" }}</span
                              >
                            </div>

                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Unit To Be Replaced From # Dealer or
                                  Distributor or Company: </strong
                                >{{
                                  StoreObj.unit_to_be_replaced_from_dealer_or_distributor_or_company ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Machine To be Sent at # Customer or Dealer or
                                  Distributor: </strong
                                >{{
                                  StoreObj.machine_to_be_sent_at_customer_or_dealer_or_distributor ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Action To be Taken Against Defective Machine: </strong
                                >{{
                                  StoreObj.secondary_approved_action_to_be_taken_against_defective_machine ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Defective Machine To Be Sold To: </strong
                                >{{
                                  StoreObj.secondary_approved_defective_machine_to_be_sold_to ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Scrap Value To Be Debited: </strong
                                >{{
                                  StoreObj.secondary_approved_scrap_value_to_be_debited ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >SO/Challan Generated (Reference No): </strong
                                >{{
                                  StoreObj.so_challan_generated || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>SO Generated Date: </strong
                                >{{
                                  FormatedDateTime(
                                    StoreObj.so_challan_generated_date
                                  ) || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Material Dispatched (Invoice No): </strong
                                >{{
                                  StoreObj.material_dispatched || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Material Dispatched Date: </strong
                                >{{
                                  FormatedDateTime(
                                    StoreObj.material_dispatched_date
                                  ) || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Courier/Transport Name: </strong
                                >{{
                                  StoreObj.courier_tranport_name || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Dispatched Date: </strong
                                >{{
                                  FormatedDateTime(StoreObj.dispatched_date) ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Machine MRN or CN Issued (MRN No): </strong
                                >{{
                                  StoreObj.machine_mrn_or_cn_issued || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>MRN or CN Issued Date: </strong
                                >{{
                                  FormatedDateTime(
                                    StoreObj.mrn_or_cn_issued_date
                                  ) || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong
                                  >Scrap Billing Reference Number: </strong
                                >{{
                                  StoreObj.scrap_billing_reference_number ||
                                  "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Scrap Billing Date: </strong
                                >{{
                                  FormatedDateTime(
                                    StoreObj.scrap_billing_date
                                  ) || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>First Step Comments: </strong
                                >{{
                                  StoreObj.first_section_comments || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Second Step Comments: </strong
                                >{{
                                  StoreObj.second_section_comments || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Third Step Comments: </strong
                                >{{
                                  StoreObj.third_section_comments || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Fourth Step Comments: </strong
                                >{{
                                  StoreObj.fourth_section_comments || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Fifth Step Comments: </strong
                                >{{
                                  StoreObj.fifth_section_comments || "N/A"
                                }}</span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>First Step Attachments: </strong
                                ><v-btn
                                  @click="
                                    viewAttachmentsMethod(
                                      StoreObj.first_section_attachments,
                                      'SHARE_ATTACHMENTS'
                                    )
                                  "
                                  icon
                                  v-if="
                                    StoreObj.first_section_attachments &&
                                    StoreObj.first_section_attachments.length >
                                      0
                                  "
                                  ><v-icon color="primary" small
                                    >mdi-paperclip</v-icon
                                  ></v-btn
                                ><span v-else>N/A</span></span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Second Step Attachments: </strong
                                ><v-btn
                                  @click="
                                    viewAttachmentsMethod(
                                      StoreObj.second_section_attachments,
                                      'SHARE_ATTACHMENTS'
                                    )
                                  "
                                  icon
                                  v-if="
                                    StoreObj.second_section_attachments &&
                                    StoreObj.second_section_attachments.length >
                                      0
                                  "
                                  ><v-icon color="primary" small
                                    >mdi-paperclip</v-icon
                                  ></v-btn
                                ><span v-else>N/A</span></span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Third Step Attachments: </strong
                                ><v-btn
                                  @click="
                                    viewAttachmentsMethod(
                                      StoreObj.third_section_attachments,
                                      'SHARE_ATTACHMENTS'
                                    )
                                  "
                                  icon
                                  v-if="
                                    StoreObj.third_section_attachments &&
                                    StoreObj.third_section_attachments.length >
                                      0
                                  "
                                  ><v-icon color="primary" small
                                    >mdi-paperclip</v-icon
                                  ></v-btn
                                ><span v-else>N/A</span></span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Fourth Step Attachments: </strong
                                ><v-btn
                                  @click="
                                    viewAttachmentsMethod(
                                      StoreObj.fourth_section_attachments,
                                      'SHARE_ATTACHMENTS'
                                    )
                                  "
                                  icon
                                  v-if="
                                    StoreObj.fourth_section_attachments &&
                                    StoreObj.fourth_section_attachments.length >
                                      0
                                  "
                                  ><v-icon color="primary" small
                                    >mdi-paperclip</v-icon
                                  ></v-btn
                                ><span v-else>N/A</span></span
                              >
                            </div>
                            <div>
                              <span class="FontSize"
                                ><strong>Fifth Step Attachments: </strong
                                ><v-btn
                                  @click="
                                    viewAttachmentsMethod(
                                      StoreObj.fifth_section_attachments,
                                      'SHARE_ATTACHMENTS'
                                    )
                                  "
                                  icon
                                  v-if="
                                    StoreObj.fifth_section_attachments &&
                                    StoreObj.fifth_section_attachments.length >
                                      0
                                  "
                                  ><v-icon color="primary" small
                                    >mdi-paperclip</v-icon
                                  ></v-btn
                                ><span v-else>N/A</span></span
                              >
                            </div>
                          </div>
                          <div
                            v-if="StoredImages.length > 0"
                            class="FontSize font-weight-bold mt-3 ml-2"
                          >
                            Saved Attachments :
                            <span class="font-weight-regular">{{
                              StoredImages.length > 0 ? "" : "N/A"
                            }}</span>
                          </div>
                          <v-row>
                            <v-col
                              cols="12"
                              lg="2"
                              md="2"
                              v-for="(item, index) in StoredImages"
                              :key="index"
                            >
                              <v-card elevation="0">
                                <v-btn
                                  icon
                                  @click="deleteAttachmentMethod(item, index)"
                                  ><v-icon small color="red"
                                    >mdi-delete</v-icon
                                  ></v-btn
                                >
                                <v-img
                                  :src="
                                    isFileType(item.file_url) === 'image'
                                      ? item.file_url
                                      : isFileType(item.file_url) === 'video'
                                      ? require('@/assets/img/video-card.png')
                                      : isFileType(item.file_url) === 'pdf'
                                      ? require('@/assets/img/pdf-card.jpg')
                                      : isFileType(item.file_url) === 'excel'
                                      ? require('@/assets/img/excel-card.png')
                                      : isFileType(item.file_url) === 'ppt'
                                      ? require('@/assets/img/ppt-card.png')
                                      : null
                                  "
                                  contain
                                >
                                </v-img>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-btn
                            v-if="StoredImages.length > 0"
                            x-small
                            depressed
                            color="primary"
                            @click="viewAttachmentsMethod(StoredImages)"
                            ><v-icon small>mdi-eye</v-icon>View</v-btn
                          >
                          <v-btn
                            v-if="StoredImages.length > 0"
                            x-small
                            :loading="ShareLoading"
                            color="green"
                            class="white--text ml-6"
                            @click.stop="shareToCustomerMethod()"
                            >Save Attachments</v-btn
                          >
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { EditFGR } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewAttachments from "@/components/FGR/Dialogs/ViewFgrAttachments.vue";
import ViewTicketsDialog from "@/components/FGR/Dialogs/ViewTicketsDialog.vue";

export default {
  props: { FgrInfoDialog: Boolean, StoreObj: Object },
  components: { ViewAttachments, ViewTicketsDialog, Snackbar },
  data: () => ({
    Tabmodel: 0,
    previewAttachments: false,
    StoreArray: [],
    saveAttachment: "",
    ViewTicketsDialog: false,
    ShareLoading: false,
    StoredImages: [],
    SnackBarComponent: {},
    renderComp: true,
  }),

  watch: {
    FgrInfoDialog(val) {
      if (val) {
        this.StoredImages = this.StoreArray =
          this.StoreObj.share_to_customer_attachments.map((item) => {
            return { file_url: item, file_name: item.split("/").pop() };
          });
      }
    },
  },

  methods: {
    isFileType(fileUrl) {
      const extension = fileUrl.split(".").pop().toLowerCase();

      const imageExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "svg",
        "webp",
      ];
      const pdfExtensions = ["pdf"];
      const pptExtensions = ["ppt", "pptx"];
      const excelExtensions = ["xls", "xlsx", "csv"];
      const videoExtensions = [
        "mp4",
        "mkv",
        "avi",
        "mov",
        "wmv",
        "flv",
        "webm",
      ];

      if (imageExtensions.includes(extension)) {
        return "image";
      } else if (pdfExtensions.includes(extension)) {
        return "pdf";
      } else if (pptExtensions.includes(extension)) {
        return "ppt";
      } else if (excelExtensions.includes(extension)) {
        return "excel";
      } else if (videoExtensions.includes(extension)) {
        return "video";
      } else {
        return "unknown"; // Default case for unrecognized file types
      }
    },
    FormatedDateTime(item) {
      const date = new Date(item * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year} `;
    },
    FgrInfoDialogEmit(Toggle) {
      this.StoredImages = [];
      this.$emit("clicked", Toggle);
    },

    async shareToCustomerMethod() {
      try {
        this.ShareLoading = true;
        let inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          finished_goods_receipt_id: this.StoreObj.finished_goods_receipt_id,
          share_to_customer_attachments: this.StoredImages.map(
            (item) => item.file_url
          ),
        };
        let result = await API.graphql(
          graphqlOperation(EditFGR, { input: inputParams })
        );

        let ResultObj = JSON.parse(result.data.EditFGR);

        if (ResultObj.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: ResultObj.Status_Message,
              Top: true,
            };
            this.renderComp = true;
          });
          this.FgrInfoDialogEmit(2);
        }
        this.ShareLoading = false;
      } catch (error) {
        this.ShareLoading = false;
        console.log("error", error);
      }
    },

    viewAttachmentsMethod(array, action) {
      this.StoreArray = array;
      this.saveAttachment = action;
      this.previewAttachments = true;
    },

    openviewTicketDetailsMethod(item) {
      this.StoreObj = item;
      this.ViewTicketsDialog = true;
    },

    deleteAttachmentMethod(item, index) {
      this.StoredImages.splice(index, 1);
    },

    previewAttachmentsEmit(Images) {
      this.previewAttachments = false;
      if (Images && Images.length > 0) {
        this.StoredImages = this.StoredImages.concat(Images);
      }
    },

    ViewTicketsDialogEmit(Toggle) {
      this.ViewTicketsDialog = false;
    },
  },
};
</script>
