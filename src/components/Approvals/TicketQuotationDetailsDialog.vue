<template>
  <div>
    <DisplayPaymentImages
      :DisplayPaymentImagesDialog="DisplayPaymentImagesDialog"
      :StoreArray="attachementList"
      @clicked="DisplayPaymentImagesDialogEmit"
    />
    <v-dialog v-model="TicketQuotationDisplayDialog" persistent :width="1000">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div v-if="StoreObj.approval_type !== 'QUOTATION'">
            {{
              StoreObj.type === "MRF"
                ? "Ticket Details"
                : "Ticket & Quotation Details"
            }}
          </div>
          <div v-else>Quotation Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="TicketQuotationDisplayDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div v-if="StoreObj.approval_type !== 'QUOTATION'">
          <v-tabs v-model="Tabmodel" slider-color="primary">
            <v-tab>TICKET DETAILS</v-tab>
            <v-tab v-show="StoreObj.mrf_hold_details?.length > 0"
              >HOLD DETAILS</v-tab
            >

            <!-- <v-tab v-if="StoreObj.type !== 'MRF'"> QUOTATION DETAILS </v-tab> -->
          </v-tabs>
          <v-tabs-items v-model="Tabmodel">
            <v-tab-item>
              <v-card-text v-if="Tabmodel === 0">
                <div>
                  <div
                    class="FontSize red--text text-center mt-3"
                    v-if="this.noDataText != undefined && this.noDataText != ''"
                  >
                    Error : {{ this.noDataText }}
                  </div>
                  <v-row no-gutters>
                    <div class="ml-2 mt-4 font-weight-bold black--text">
                      Customer Information :
                    </div>
                  </v-row>
                  <v-card-title>
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" md="4" xs="12">
                        <span class="FontSize font-weight-bold black--text"
                          >Ticket-Id :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span
                                class="font-weight-regular black--text"
                                v-if="TicketDetailsList[0].custom_ticket_id"
                                >{{ TicketDetailsList[0].custom_ticket_id }}
                              </span>
                              <span
                                class="font-weight-regular black--text"
                                v-else
                                >{{ TicketDetailsList[0].ticket_id }}
                              </span>
                            </span>
                          </span>
                        </span>
                        <div
                          class="FontSize font-weight-bold black--text mt-n2"
                        >
                          Ticket Type :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">{{
                                TicketDetailsList[0].ticket_type
                              }}</span>
                            </span>
                          </span>
                        </div>
                        <div
                          class="FontSize font-weight-bold black--text mt-n2"
                        >
                          Ticket Status :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">{{
                                TicketDetailsList[0].ticket_status
                              }}</span>
                            </span>
                          </span>
                        </div>
                        <div
                          class="FontSize font-weight-bold black--text mt-n2"
                        >
                          Customer ID :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">{{
                                TicketDetailsList[0].customer_unique_id
                              }}</span>
                            </span>
                          </span>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="4" xs="12">
                        <div class="FontSize font-weight-bold black--text">
                          Customer Name :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">
                                {{
                                  TicketDetailsList[0].customer_company_name
                                }}</span
                              >
                            </span>
                          </span>
                        </div>
                        <div class="FontSize font-weight-bold black--text">
                          Contact Person Name :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">
                                {{ TicketDetailsList[0].customer_name }}</span
                              >
                            </span>
                          </span>
                        </div>
                        <div
                          class="FontSize font-weight-bold black--text mt-n2"
                        >
                          Contact Person Email :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">
                                {{
                                  TicketDetailsList[0].customer_email_id
                                }}</span
                              >
                            </span></span
                          >
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="4" xs="12">
                        <div
                          class="FontSize font-weight-bold black--text mt-n2"
                        >
                          Contact Person Phone Number :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">
                                {{
                                  TicketDetailsList[0].customer_full_number
                                }}</span
                              >
                            </span>
                          </span>
                        </div>
                        <div
                          class="FontSize font-weight-bold mt-n2 black--text"
                        >
                          Service Address :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">{{
                                TicketDetailsList[0].ticket_address
                              }}</span>
                            </span>
                          </span>
                        </div>
                        <div
                          class="FontSize font-weight-bold mt-n2 black--text"
                        >
                          Ticket Priority :
                          <span v-if="TicketDetailsList">
                            <span v-if="TicketDetailsList.length != 0">
                              <span class="font-weight-regular black--text">{{
                                TicketDetailsList[0].ticket_priority
                              }}</span>
                            </span>
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-title>
                  <div>
                    <div class="ml-2 mt-n3 font-weight-bold black--text">
                      Service Information :
                    </div>
                    <v-card-title>
                      <v-row no-gutters>
                        <v-col cols="12" sm="12" md="4" xs="12">
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Category Name :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">{{
                                  TicketDetailsList[0].category_name
                                }}</span>
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Product Name :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">{{
                                  TicketDetailsList[0].service_name
                                }}</span>
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Serial Number :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">{{
                                  TicketDetailsList[0].service_serial_number
                                }}</span>
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Service Type:
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].service_type_name
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Support:
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].ticket_warranty_type
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Support Type:
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{ TicketDetailsList[0].support_type }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Ticket Type:
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].ticket_creation_type
                                  }}
                                </span>
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Free of Cost:
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span
                                  class="font-weight-regular green--text"
                                  v-if="
                                    TicketDetailsList[0].is_free_of_cost == true
                                  "
                                >
                                  Yes
                                </span>
                                <span
                                  class="font-weight-regular red--text"
                                  v-else
                                >
                                  No
                                </span>
                              </span>
                            </span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" xs="12">
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Service Partner Name :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].reporting_manager_name
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Reporting Manager :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0]
                                      .ticket_reporting_manager_name
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Primary Representative :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].representative_name
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Secondary Representative :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0]
                                      .secondary_technician_name
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Ticket Problem Description :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0]
                                      .service_ticket_description
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Ticket Invoice Date :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span
                                  class="font-weight-regular black--text"
                                  v-if="
                                    TicketDetailsList[0].ticket_warranty_details
                                  "
                                >
                                  {{
                                    TicketDetailsList[0].ticket_warranty_details
                                      .ticket_invoice_date
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div v-if="TicketDetailsList">
                            <div v-if="TicketDetailsList.length != 0">
                              <div
                                v-if="TicketDetailsList[0].installation_date"
                                class="FontSize font-weight-bold black--text mt-n2"
                              >
                                Ticket Installation Date :<span
                                  class="font-weight-regular black--text"
                                >
                                  {{
                                    TicketDetailsList[0].installation_date
                                  }}</span
                                >
                              </div>
                            </div>
                          </div>
                          <div v-if="TicketDetailsList">
                            <div v-if="TicketDetailsList.length != 0">
                              <div
                                v-if="
                                  TicketDetailsList[0].ticket_warranty_details
                                "
                                class="FontSize font-weight-bold black--text mt-n2"
                              >
                                Ticket Invoice Number :<span
                                  class="font-weight-regular black--text"
                                >
                                  {{
                                    TicketDetailsList[0].ticket_warranty_details
                                      .ticket_invoice_number
                                  }}</span
                                >
                              </div>
                            </div>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Comments :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{ TicketDetailsList[0].comments }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Ticket Closed Location :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span
                                  class="font-weight-regular black--text"
                                  v-if="
                                    TicketDetailsList[0].ticket_closed_location
                                  "
                                >
                                  {{
                                    TicketDetailsList[0].ticket_closed_location.replaceAll(
                                      "_",
                                      " "
                                    )
                                  }}
                                </span>
                              </span>
                            </span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" xs="12">
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Prefered Visit Date :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].prefered_visit_date
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Prefered Visit Time :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">{{
                                  TicketDetailsList[0].prefered_visit_time
                                }}</span>
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Call Received Date :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].customer_call_date
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Call Received Time :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">
                                  {{
                                    TicketDetailsList[0].customer_call_time
                                  }}</span
                                >
                              </span>
                            </span>
                          </div>

                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            WIP Sub Stage :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">{{
                                  TicketDetailsList[0].wip_sub_stage_name
                                }}</span>
                              </span>
                            </span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Additional Comments :
                            <span v-if="TicketDetailsList">
                              <span v-if="TicketDetailsList.length != 0">
                                <span class="font-weight-regular black--text">{{
                                  TicketDetailsList[0].additional_comments
                                }}</span>
                              </span>
                            </span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-title>
                  </div>
                  <div v-if="TicketDetailsList[0].payment_details">
                    <div class="ml-2 mt-n3 font-weight-bold black--text">
                      Payment Details:
                    </div>
                    <v-card-title>
                      <v-row no-gutters>
                        <v-col cols="12" sm="12" md="4" xs="12">
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Mode of Payment:
                            <span class="font-weight-regular black--text">{{
                              TicketDetailsList[0].payment_details
                                ?.mode_of_payment || "-"
                            }}</span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Date of Payment:

                            <span class="font-weight-regular black--text">{{
                              TicketDetailsList[0].payment_details
                                ?.date_of_payment || "-"
                            }}</span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Payment Type:

                            <span class="font-weight-regular black--text">{{
                              TicketDetailsList[0].payment_details
                                ?.payment_type || "-"
                            }}</span>
                          </div>
                          <div
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Payment Reference Number:

                            <span class="font-weight-regular black--text">
                              {{
                                TicketDetailsList[0].payment_details
                                  ?.payment_reference_number || "-"
                              }}</span
                            >
                          </div>
                          <div
                            v-if="
                              TicketDetailsList[0].ticket_payment_attachments &&
                              TicketDetailsList[0].ticket_payment_attachments
                                .length > 0
                            "
                            class="FontSize font-weight-bold black--text mt-n2"
                          >
                            Payment Attachments:

                            <v-icon
                              color="primary"
                              size="small"
                              @click="
                                (DisplayPaymentImagesDialog = true),
                                  (attachementList =
                                    TicketDetailsList[0]
                                      .ticket_payment_attachments)
                              "
                              >mdi-paperclip</v-icon
                            >>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-title>
                  </div>
                </div>
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text v-if="Tabmodel === 1">
                <div
                  class="pa-5 ma-2"
                  v-for="(mrfDetail, index) in StoreObj.mrf_hold_details"
                  :key="index"
                  style="background-color: #ffdfef"
                >
                  <div>
                    <span class="FontSize font-weight-bold black--text">
                      Comment:
                      <span class="font-weight-regular black--text"
                        >{{ mrfDetail.comments }}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span class="FontSize font-weight-bold black--text"
                      >Acted By:
                      <span class="font-weight-regular black--text"
                        >{{ mrfDetail.updated_by_name }}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span class="FontSize font-weight-bold black--text"
                      >Acted On:
                      <span class="font-weight-regular black--text"
                        >{{
                          new Date(mrfDetail.updated_on * 1000).toLocaleString(
                            "en-GB"
                          )
                        }}
                      </span>
                    </span>
                  </div>
                  <div v-if="mrfDetail.attachements">
                    <span class="FontSize font-weight-bold black--text"
                      >Attachments:
                    </span>
                    <v-data-table
                      style="width: 100%; background-color: #ffdfef"
                      dense
                      :headers="holdAttachemntsHeader"
                      :items="mrfDetail.attachements"
                      class="TableValFontsize"
                      hide-default-footer
                    >
                      <template v-slot:[`item.view`]="{ item }">
                        <v-btn icon @click="navigateToUrlMethod(item.file_url)">
                          <v-icon small color="primary">mdi-eye</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </div>
                </div>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div v-else>
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div class="ml-2 mt-2 font-weight-bold black--text">
                Quotation Information :
              </div>
              <div class="ml-5">
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Quotation Initiated By:
                    <span class="font-weight-regular black--text"
                      >{{ quotationDataObject.initiater_user_name ?? "N/A" }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Quotation Created On:
                    <span class="font-weight-regular black--text"
                      >{{ quotationDataObject.quotation_created_on ?? "N/A" }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Quotation Sent On:
                    <span class="font-weight-regular black--text"
                      >{{ quotationDataObject.quotation_sent_on ?? "N/A" }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Sent Comments:
                    <span class="font-weight-regular black--text"
                      >{{ quotationDataObject.sent_comments ?? "N/A" }}
                    </span>
                  </span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div class="ml-2 mt-2 font-weight-bold black--text">
                Payment Details :
              </div>
              <div class="ml-5">
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Payment Type :
                    <span class="font-weight-regular black--text"
                      >{{
                        quotationDataObject.payment_details?.payment_type ||
                        "N/A"
                      }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Mode of Payment :
                    <span class="font-weight-regular black--text"
                      >{{
                        quotationDataObject.payment_details?.mode_of_payment ||
                        "N/A"
                      }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Date of Payment :
                    <span class="font-weight-regular black--text"
                      >{{
                        quotationDataObject.payment_details?.date_of_payment ||
                        "N/A"
                      }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Payment Value :
                    <span class="font-weight-regular black--text"
                      >{{
                        quotationDataObject.payment_details?.payment_value ||
                        "N/A"
                      }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Payment Reference Number :
                    <span class="font-weight-regular black--text"
                      >{{
                        quotationDataObject.payment_details
                          ?.payment_reference_number || "N/A"
                      }}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="FontSize font-weight-bold black--text"
                    >Attachment:
                    <span class="font-weight-regular black--text">
                      {{ attachementList.length <= 0 ? "No attachments" : null
                      }}<v-btn
                        v-if="attachementList.length > 0"
                        icon
                        @click="DisplayPaymentImagesDialog = true"
                        ><v-icon color="primary" size="17"
                          >mdi-paperclip</v-icon
                        ></v-btn
                      >
                    </span>
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DisplayPaymentImages from "@/components/Quotation/DisplayPaymentImages.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
import { GetParticularQuotData } from "@/mixins/Approvals/GetQuotationDetails.js";
import { Store } from "vuex";
export default {
  mixins: [GetTicketDetails, GetParticularQuotData],
  props: { TicketQuotationDisplayDialog: Boolean, StoreObj: Object },
  components: {
    DisplayPaymentImages,
  },
  data: () => ({
    Tabmodel: 0,
    quotationDataObject: {},
    attachementList: [],
    DisplayPaymentImagesDialog: false,
    holdAttachemntsHeader: [
      { text: "File Name", value: "file_name" },
      { text: "View", value: "view" },
    ],
  }),
  watch: {
    async TicketQuotationDisplayDialog(val) {
      if (val) {
        await this.TicketDetailsListMethod(
          this.StoreObj.module_id != undefined
            ? this.StoreObj.module_id
            : this.StoreObj.ticket_id
        );
        console.log("TAKKKEE", this.StoreObj);
        // this.StoreObj.ticket_module_id
        if (this.StoreObj.type !== "MRF") {
          this.CallGetQuotDataAPIMethod();
        }
      }
    },
  },
  methods: {
    async CallGetQuotDataAPIMethod() {
      this.quotationDataObject = await this.GetParticularQuotDataMethod(
        this.StoreObj.quotation_id
      );
      if (this.quotationDataObject.attachments) {
        this.attachementList = this.quotationDataObject.attachments.map(
          (item) => item.file_url
        );
      }
      console.log("CHECK_THE_OBJ", this.quotationDataObject);
    },
    navigateToUrlMethod(url) {
      window.open(url, "__blank");
    },
    TicketQuotationDisplayDialogEmit(Toggle) {
      this.attachementList = [];
      this.Tabmodel = null;
      this.$emit("clicked", Toggle);
    },
    DisplayPaymentImagesDialogEmit(Toggle) {
      this.DisplayPaymentImagesDialog = false;
    },
  },
};
</script>
