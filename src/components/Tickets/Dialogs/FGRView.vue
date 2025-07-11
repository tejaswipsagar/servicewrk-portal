<template>
  <div>
    <ViewAttachments
      :StoreArray="StoreArray"
      :previewAttachments="previewAttachments"
      @clicked="previewAttachmentsEmit"
    />
    <v-dialog v-model="ViewFGRDetailsDialog" persistent :width="1000">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>FGR Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="FgrInfoDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pl-5">
          <v-tabs v-model="Tabmodel" slider-color="primary">
            <v-tab class="text-capitalize">FGR Details</v-tab>
            <v-tab class="text-capitalize">FGR History </v-tab>
            <v-tab class="text-capitalize"
              >FGR Requested & Approved Details
            </v-tab>
            <v-spacer />
            <div class="fontsize20px font-weight-bold black--text mr-5 mt-2">
              FGR ID :
              <span class="black--text">{{ StoreObj.fgr_display_id }} </span>
            </div>
          </v-tabs>
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
                            ><span class="fontsize15px">{{
                              new Date(
                                StoreObj.fgr_initiated_on * 1000
                              ).toLocaleString("en-GB")
                            }}</span></span
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
                              ><strong>FGR Request Date: </strong
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
                                    StoreObj.fgr_initiated_attachments
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
                              ><strong
                                >Action To be Taken Against Defective Machine: </strong
                              >{{ StoreObj.action_to_be_taken || "N/A" }}</span
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
                                ><strong
                                  >Name Of The Component Failure Diagnosed: </strong
                                >{{
                                  StoreObj.primary_approved_component_name ||
                                  "N/A"
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
                                      StoreObj.primary_approved_attachment_file
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
                                      StoreObj.first_section_attachments
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
                                      StoreObj.second_section_attachments
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
                                      StoreObj.third_section_attachments
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
                                      StoreObj.fourth_section_attachments
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
                                      StoreObj.fifth_section_attachments
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
import ViewAttachments from "@/components/FGR/Dialogs/ViewFgrAttachments.vue";
import { API, graphqlOperation } from "aws-amplify";
import { getFGRDetails } from "@/graphql/queries.js";
export default {
  props: { ViewFGRDetailsDialog: Boolean, ActionObj: Object },
  components: { ViewAttachments },
  data: () => ({
    Tabmodel: 0,
    previewAttachments: false,
    StoreArray: [],
    StoreObj: {},
  }),

  watch: {
    ViewFGRDetailsDialog(val) {
      if (val) {
        this.frgDetailsViewMethod();
      }
    },
  },

  methods: {
    async frgDetailsViewMethod() {
      try {
        let result = await API.graphql(
          graphqlOperation(getFGRDetails, {
            input: {
              finished_goods_receipt_id: this.ActionObj.fgr_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
            },
          })
        );
        var ResultObject = JSON.parse(result.data.getFGRDetails).data.items[0];
        console.log("result", ResultObject);
        // if (ResultObject.status == "SUCCESS") {
        this.StoreObj = ResultObject;
        console.log("this.StoreObj", this.StoreObj);
        // }
      } catch (error) {
        this.isLoading = false;
        this.renderComp = false;
        console.log("error", error);
        // this.$nextTick(() => {
        //   this.SnackBarComponent = {
        //     SnackbarVmodel: true,
        //     SnackbarColor: "red",
        //     Top: true,
        //     SnackbarText: error.errors[0].message,
        //   };
        //   this.renderComp = true;
        // });
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
      this.$emit("clicked", Toggle);
    },

    viewAttachmentsMethod(array) {
      this.StoreArray = array;
      this.previewAttachments = true;
    },

    previewAttachmentsEmit(Toggle) {
      this.previewAttachments = false;
    },
  },
};
</script>
