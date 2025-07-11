<template>
  <div>
    <dailogTicketDetails
      :StoreObj="StoreObj"
      :viewTicketDetailsDailog="viewTicketDetailsDailog"
      @clicked="viewTicketDetailsDailogemit"
    />
    <OldSerialNumbersDialog
      :StoreObj="StoreObj"
      :oldSerialNumberDetailsDialog="oldSerialNumberDetailsDialog"
      @clicked="oldSerialNumberDetailsDialogEmit"
    />
    <ComponentsInformation
      :StoreObj="StoreObj"
      :dialogComponentsInformation="dialogComponentsInformation"
      @clicked="dialogComponentsInformationEmit"
    />
    <ViewFGRDetailsDialog
      :ViewFGRDetailsDialog="ViewFGRDetailsDialog"
      :ActionObj="ActionObj"
      @clicked="FgrInfoDialogEmit"
    />
    <dialogMRFApprovedDetails
      :dialogMRFApprovedDetails="dialogMRFApprovedDetails"
      :ActionArray="ActionArray"
      @clicked="dialogMRFApprovedDetailsEmit"
    />
    <DisplayPaymentImage
      :DisplayPaymentImagesDialog="displayPaymentImagesDialog"
      :StoreArray="imageArray"
      @clicked="DisplayPaymentImagesDialogEmit"
    />
    <PurchaseOrderDetails
      :PurchaseOrderDetailsDialog="purchaseOrderDetailsDialog"
      :PurchaseOrderObj="purchaseOrderObj"
      @clicked="purchaseOrderDetailsDialogEmit"
    />
    <QuotationDetails
      :QuotationDetailsDialog="quotationDetailsDialog"
      :QuotationObj="quotationObj"
      @clicked="quotationDetailsDialogEmit"
    />
    <v-card
      outlined
      style="border: 1px solid grey"
      class="overflow-y-auto ml-2 mx-auto"
      max-width="1010"
    >
      <v-row no-gutters>
        <div class="ml-2 font-weight-bold black--text">
          Customer Information :
        </div>
      </v-row>
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="4" xs="12">
            <span class="FontSize font-weight-bold black--text"
              >Ticket-Id :
              <span
                v-if="StoreObj.custom_ticket_id == undefined"
                class="font-weight-regular black--text"
                >{{ StoreObj.ticket_id }}
              </span>
              <span
                v-else-if="StoreObj.custom_ticket_id != undefined"
                class="font-weight-regular black--text"
                >{{ StoreObj.custom_ticket_id }}</span
              >
            </span>
            <div class="FontSize font-weight-bold black--text">
              Ticket Status :

              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_status
                  ? StoreObj.ticket_status.replaceAll("_", " ")
                  : "-"
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text">
              Additional Ticket Status :
              <span class="font-weight-regular black--text">
                {{
                  StoreObj.additional_ticket_status
                    ? StoreObj.additional_ticket_status.replaceAll("_", " ")
                    : "-"
                }}
              </span>
            </div>
            <div
              class="FontSize font-weight-bold black--text"
              v-if="StoreObj.wip_sub_stage_name != undefined"
            >
              Wip Sub Stage :
              <span
                v-if="StoreObj.wip_sub_stage_name != undefined"
                class="font-weight-regular black--text"
              >
                {{ StoreObj.wip_sub_stage_name }}
              </span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Created On :
              <span class="font-weight-regular black--text">{{
                new Date(StoreObj.ticket_created_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}</span>
            </div>
            <div
              v-if="StoreObj.created_by_source != undefined"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Created By :
              <span
                v-if="StoreObj.created_by_source != 'AGENT'"
                class="font-weight-regular black-text"
              >
                {{ StoreObj.created_by_source.replaceAll("_", " ") }}
              </span>
              <span
                v-if="StoreObj.created_by_source == 'AGENT'"
                class="font-weight-regular black-text"
              >
                Service Co-Ordinator
              </span>
            </div>
            <div
              v-if="this.$route.name == 'ClosedTickets'"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Closed On :
              <span class="font-weight-regular">
                {{
                  new Date(StoreObj.ticket_closed_time * 1000).toLocaleString(
                    "en-GB"
                  )
                }}
              </span>
            </div>
            <!-- <div class="FontSize font-weight-bold black--text mt-n2">
              Ticket Type :
              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_type
              }}</span>
            </div> -->
            <div class="FontSize font-weight-bold mt-n2 black--text">
              Ticket Priority :
              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_priority
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Customer ID :
              <span class="font-weight-regular black--text">{{
                StoreObj.customer_unique_id
              }}</span>
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12">
            <div class="FontSize font-weight-bold black-text">
              Customer Type :
              <span class="font-weight-regular black--text">
                {{ StoreObj.customer_type }}
              </span>
            </div>
            <div class="FontSize font-weight-bold black--text">
              Customer :<span class="font-weight-regular black--text">
                {{ StoreObj.customer_company_name }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text">
              Contact Person :<span class="font-weight-regular black--text">
                {{ StoreObj.customer_name }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Email :
              <span class="font-weight-regular black--text">
                {{ StoreObj.customer_email_id }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Phone Number :<span class="font-weight-regular black--text">
                {{ StoreObj.customer_full_number }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Secondary Phone Number :<span
                class="font-weight-regular black--text"
              >
                {{ StoreObj.secondary_customer_contact || "-" }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Customer Category :<span class="font-weight-regular black--text">
                {{ StoreObj.customer_category_name }}</span
              >
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12">
            <div class="FontSize font-weight-bold mt-n2 black--text">
              Address :
              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_address
              }}</span>
            </div>
            <div
              v-if="StoreObj.ticket_city != undefined"
              class="FontSize font-weight-bold mt-n2 black--text"
            >
              City :
              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_city
              }}</span>
            </div>
            <div
              v-if="StoreObj.ticket_state != undefined"
              class="FontSize font-weight-bold mt-n2 black--text"
            >
              State :
              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_state
              }}</span>
            </div>
            <div
              v-if="StoreObj.ticket_pincode != undefined"
              class="FontSize font-weight-bold mt-n2 black--text"
            >
              Pincode :
              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_pincode
              }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <div class="ml-2 mt-n3 font-weight-bold black--text">
        Service Information :
      </div>
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="4" xs="12">
            <div class="FontSize font-weight-bold black--text mt-n2">
              Category :
              <span class="font-weight-regular black--text">{{
                StoreObj.category_name
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Product :
              <span class="font-weight-regular black--text">{{
                StoreObj.service_name
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Serial Number :
              <span class="font-weight-regular black--text"
                >{{ StoreObj.service_serial_number }}
                <v-tooltip color="primary" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-if="StoreObj.old_serial_number_details != undefined"
                      v-on="on"
                      v-bind="attrs"
                      small
                      class="mx-1"
                      color="green"
                      @click.stop="oldSerialNumberDetailsDialog = true"
                    >
                      mdi-swap-horizontal
                    </v-icon>
                  </template>
                  <span>Product Fleet Replaced</span>
                </v-tooltip>
                <v-tooltip color="primary" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-on="on"
                      v-bind="attrs"
                      v-if="StoreObj.service_serial_number != undefined"
                      color="primary"
                      small
                      @click="viewTicketDetailsDailog = true"
                      >mdi-ticket</v-icon
                    >
                  </template>
                  <span
                    >Tickets Created on this Serial Number ({{
                      StoreObj.service_serial_number
                    }})</span
                  >
                </v-tooltip>
              </span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Asset Number:
              <span class="font-weight-regular black--text">{{
                StoreObj.asset_number || "-"
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Service Type:<span class="font-weight-regular black--text">
                {{ StoreObj.service_type_name }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Support:<span
                v-if="StoreObj.ticket_warranty_type == 'NO_WARRANTY'"
                class="font-weight-regular black--text"
              >
                {{ "NO WARRANTY" }}</span
              >
              <span
                v-else-if="
                  StoreObj.ticket_warranty_type == 'AMC' ||
                  StoreObj.ticket_warranty_type == 'CONTRACT'
                "
                class="font-weight-regular black--text ml-2"
                >CONTRACT</span
              >
              <span v-else class="font-weight-regular black--text">{{
                StoreObj.ticket_warranty_type
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Support type:
              <span class="font-weight-regular black--text">{{
                StoreObj.support_type
              }}</span>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Ticket Type:
                <span class="font-weight-regular black--text">
                  {{ StoreObj.ticket_creation_type }}
                </span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Free of Cost:
                <span
                  class="font-weight-regular green--text"
                  v-if="StoreObj.is_free_of_cost == true"
                >
                  Yes
                </span>
                <span class="font-weight-regular red--text" v-else> No </span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Territory Classification Name:
                <span class="font-weight-regular black--text">
                  {{ StoreObj.pincode_type_name || "-" }}
                </span>
              </div>
              <div class="FontSize font-weight-bold black--text mt-n2">
                Estimated Time:
                <span class="font-weight-regular black--text">
                  {{ StoreObj.estimated_time || "-" }}
                </span>
              </div>
              <div
                v-if="StoreObj.ticket_status == 'CLOSED'"
                class="FontSize font-weight-bold black--text mt-n2"
              >
                Closed Location :
                <span
                  v-if="StoreObj.ticket_closed_location"
                  class="font-weight-regular black--text"
                >
                  {{ StoreObj.ticket_closed_location.replaceAll("_", " ") }}
                </span>
              </div>
              <div
                v-if="StoreObj.ticket_status == 'CLOSED'"
                class="FontSize font-weight-bold black--text mt-n2"
              >
                Closure Type :
                <span
                  v-if="StoreObj.closure_type"
                  class="font-weight-regular black--text"
                >
                  {{ StoreObj.closure_type.replaceAll("_", " ") }}
                </span>
              </div>
              <div
                v-if="StoreObj.ticket_status == 'CLOSED'"
                class="FontSize font-weight-bold blass--text mt-n2"
              >
                Training Provided To :
                <span
                  v-if="StoreObj.training_provided_to"
                  class="font-weight-regular black--text"
                >
                  {{ StoreObj.training_provided_to }}
                </span>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12">
            <div
              v-if="StoreObj.primary_representative__user_type != undefined"
              class="FontSize font-weight-bold mt-n2"
            >
              User Type :
              <span class="FontSize font-weight-regular">{{
                StoreObj.primary_representative__user_type.replaceAll("_", " ")
              }}</span>
            </div>
            <div class="FontSize font-weight-bold mt-n2">
              Service Partner Name :
              <span
                v-if="StoreObj.reporting_manager_name != undefined"
                class="font-weight-regular"
                >{{ StoreObj.reporting_manager_name }}</span
              ><span v-else>-</span>
            </div>
            <div class="FontSize font-weight-bold mt-n2">
              Reporting Manager :
              <span
                v-if="StoreObj.ticket_reporting_manager_name != undefined"
                class="font-weight-regular"
                >{{ StoreObj.ticket_reporting_manager_name }}</span
              ><span v-else>-</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Primary Representative :<span
                class="font-weight-regular black--text"
              >
                {{ StoreObj.representative_name }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Secondary Representative :<span
                class="font-weight-regular black--text"
              >
                {{ StoreObj.secondary_technician_name }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Problem Description :<span
                class="font-weight-regular black--text"
              >
                {{ StoreObj.service_ticket_description }}</span
              >
            </div>
            <div
              v-if="StoreObj.ticket_warranty_details"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Invoice Date :<span class="font-weight-regular black--text">
                {{ StoreObj.ticket_warranty_details.ticket_invoice_date }}</span
              >
            </div>
            <div
              v-if="StoreObj.installation_date"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Installation Date :<span class="font-weight-regular black--text">
                {{ StoreObj.installation_date }}</span
              >
            </div>
            <div
              v-if="StoreObj.ticket_warranty_details"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Invoice Number :<span class="font-weight-regular black--text">
                {{
                  StoreObj.ticket_warranty_details.ticket_invoice_number
                }}</span
              >
            </div>
            <div
              class="FontSize font-weight-bold black--text mt-n2"
              v-if="this.$route.name == 'ClosedTickets'"
            >
              Distance Travelled :
              <span
                v-if="StoreObj.distance_travelled_in_km != undefined"
                class="font-weight-regular"
                >{{ StoreObj.distance_travelled_in_km }} KMs
                <span v-if="StoreObj.distance_travelled_in_meters != undefined"
                  >| {{ StoreObj.distance_travelled_in_meters }} Mts</span
                ></span
              >
              <span v-else>-</span>
            </div>
            <div
              class="FontSize font-weight-bold mt-n2"
              v-if="this.$route.name == 'ClosedTickets'"
            >
              Time Taken :
              <span
                v-if="StoreObj.hours_and_minuts != undefined"
                class="font-weight-regular"
                >{{ StoreObj.hours_and_minuts }}
              </span>
              <span v-else>-</span>
            </div>
            <div
              v-if="StoreObj.comments"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Comments :<span class="font-weight-regular black--text">
                {{ StoreObj.comments }}</span
              >
            </div>
            <div
              v-if="StoreObj.ticket_status != 'OPEN'"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Closure Remarks :
              <span class="font-weight-regular black--text">{{
                StoreObj.closure_remarks
              }}</span>
            </div>
            <div
              v-if="
                StoreObj.ticket_status === 'CLOSED' ||
                StoreObj.ticket_status === 'REPRESENTATIVE_PARTIALLY_CLOSED'
              "
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Service Report Number:
              <span class="font-weight-regular black--text">{{
                StoreObj.service_report_number || "-"
              }}</span>
            </div>
            <!-- <div
              v-if="StoreObj.service_charges"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Travel Allowance:
              <span class="font-weight-regular black--text">{{
                StoreObj.service_charges?.travel_allowance || "-"
              }}</span>
            </div>
            <div
              v-if="StoreObj.service_charges"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Meals:
              <span class="font-weight-regular black--text">{{
                StoreObj.service_charges?.meals || "-"
              }}</span>
            </div>
            <div
              v-if="StoreObj.service_charges"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Night Stay:
              <span class="font-weight-regular black--text">{{
                StoreObj.service_charges?.night_stay || "-"
              }}</span>
            </div>
            <div
              v-if="StoreObj.service_charges"
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Hotel:
              <span class="font-weight-regular black--text">{{
                StoreObj.service_charges?.hotel || "-"
              }}</span>
            </div> -->
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12">
            <div class="FontSize font-weight-bold black--text mt-n2">
              Prefered Visit Date :<span
                class="font-weight-regular black--text"
              >
                {{ StoreObj.prefered_visit_date }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Prefered Visit Time :
              <span class="font-weight-regular black--text">{{
                StoreObj.prefered_visit_time
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Call Received Date :<span class="font-weight-regular black--text">
                {{ StoreObj.customer_call_date }}</span
              >
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Call Received Time :<span class="font-weight-regular black--text">
                {{ StoreObj.customer_call_time }}</span
              >
            </div>
            <div
              class="FontSize font-weight-bold black--text mt-n2"
              v-if="StoreObj.latest_prefered_visit_date != undefined"
            >
              Updated Visit Date :
              <span class="font-weight-regular black--text">{{
                StoreObj.latest_prefered_visit_date
              }}</span>
            </div>
            <div
              class="FontSize font-weight-bold black--text mt-n2"
              v-if="StoreObj.latest_prefered_visit_time != undefined"
            >
              Updated Visit Time :
              <span class="font-weight-regular black--text">{{
                StoreObj.latest_prefered_visit_time
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              WIP Sub Stage :
              <span class="font-weight-regular black--text">{{
                StoreObj.wip_sub_stage_name
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Additional Comments :
              <span class="font-weight-regular black--text">{{
                StoreObj.additional_comments
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Ticket Source :
              <span class="font-weight-regular black--text">{{
                StoreObj.ticket_call_source
              }}</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Call Source Remarks :
              <span class="font-weight-regular black--text">{{
                StoreObj.source_remark
              }}</span>
            </div>
            <div
              v-if="
                this.$route.name == 'ClosedTickets' ||
                this.$route.name == 'PartiallyClosedTickets'
              "
              class="FontSize font-weight-bold black--text mt-n2"
            >
              Ticket Closed By Number :
              <span
                class="font-weight-regular black--text"
                v-if="StoreObj.ticket_closed_by_number != undefined"
                >{{ StoreObj.ticket_closed_by_number }}</span
              >
              <span v-else>-</span>
            </div>
            <div
              class="FontSize font-weight-bold black--text mt-n2"
              v-if="StoreObj.is_reopened_ticket"
            >
              Re-Opened Ticket : Yes
            </div>
            <div
              class="FontSize font-weight-bold black--text mt-n2"
              v-if="StoreObj.is_repeat_ticket"
            >
              Repeated Ticket : Yes
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              MRF :
              <span
                v-if="
                  StoreObj.requested_components_details != undefined ||
                  (StoreObj.component_list != undefined &&
                    StoreObj.component_list.length != 0)
                "
                ><v-btn
                  x-small
                  class="primary white--text"
                  @click="dialogComponentsInformation = true"
                  >View
                  <v-icon x-small class="ml-1">mdi-eye</v-icon>
                </v-btn>
              </span>
              <span v-else class="font-weight-regular">Not Requested</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              MRF Approved details:
              <span
                v-if="
                  StoreObj.mrf_approved_details &&
                  StoreObj.component_list.length > 0
                "
                ><v-btn
                  icon
                  x-small
                  class="primary white--text"
                  @click.stop="mrfApproved_Method()"
                >
                  <v-icon x-small>mdi-ticket</v-icon>
                </v-btn>
              </span>
              <span v-else class="font-weight-regular">-</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-3">
              FGR :
              <span
                v-if="
                  StoreObj.fgr_initiated != undefined ||
                  (StoreObj.fgr_initiated != undefined &&
                    StoreObj.fgr_initiated)
                "
                ><v-btn
                  x-small
                  class="primary white--text"
                  @click="fgrViewMethod(StoreObj)"
                  >View FGR Details
                  <v-icon x-small class="ml-1">mdi-eye</v-icon>
                </v-btn>
              </span>
              <span v-else class="font-weight-regular">Not Requested</span>
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="12" xs="12" class="mt-4">
            <div class="FontSize black--text font-weight-bold">
              Territories :
              <span
                v-if="
                  StoreObj.territory_names != undefined &&
                  StoreObj.territory_names.length != 0
                "
              >
                <span
                  class="font-weight-regular"
                  v-for="(item, i) in StoreObj.territory_names"
                  :key="i"
                >
                  {{ i + 1 }}.{{ item
                  }}<span v-if="i + 1 != StoreObj.territory_names.length"
                    >,</span
                  >
                </span>
              </span>
              <span v-else>-</span>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <div v-if="this.$route.name != 'ActiveTickets'">
        <v-row no-gutters v-if="StoreObj.payment_details">
          <v-expansion-panels class="mb-4 ml-3 mr-3">
            <v-card outlined>
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="FontSize font-weight-bold black--text"
                  expand-icon="mdi-menu-down"
                >
                  Closure Payment Details
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="12" md="4" sm="12" xs="12">
                      <span
                        v-if="StoreObj.payment_details"
                        class="font-weight-regular black--text"
                      >
                        <span class="FontSize font-weight-bold"
                          >Amount :
                          <span v-if="StoreObj.payment_details.payment_price">
                            <v-icon color="green" x-small
                              >mdi-currency-rupee</v-icon
                            >
                            <span class="font-weight-regular">
                              {{ StoreObj.payment_details.payment_price }}
                            </span>
                          </span>
                          <span class="font-weight-regular" v-else>NA</span>
                        </span>
                      </span>
                    </v-col>
                    <v-col cols="12" md="4" xs="12" sm="12">
                      <span class="FontSize font-weight-bold"
                        >Payment Method :
                        <span
                          class="font-weight-regular"
                          v-if="StoreObj.payment_details.payment_method"
                        >
                          {{
                            StoreObj.payment_details.payment_method.replaceAll(
                              "_",
                              " "
                            )
                          }}
                        </span>
                        <span class="font-weight-regular" v-else>NA</span>
                      </span>
                    </v-col>
                    <v-col cols="12" md="4" sm="12" xs="12">
                      <span class="FontSize font-weight-bold"
                        >Payment Number :
                        <span
                          class="font-weight-regular"
                          v-if="StoreObj.payment_details.payment_number"
                        >
                          {{ StoreObj.payment_details.payment_number }}
                        </span>
                        <span class="font-weight-regular" v-else>NA</span>
                      </span>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card>
          </v-expansion-panels>
        </v-row>
      </div>

      <v-row no-gutters>
        <v-expansion-panels
          v-if="StoreObj.ticket_status != 'CLOSED'"
          class="mb-4 ml-3 mr-3"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Component List
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="Headers"
                  :items="StoreObj.component_list"
                  dense
                  class="FontSize elevation-0 ma-1"
                >
                  <template v-slot:[`item.sl_no`]="{ item }">
                    <div class="FontSize" color="primary">
                      {{ StoreObj.component_list.indexOf(item) + 1 }}
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          v-if="StoreObj.ticket_status != 'CLOSED'"
          class="mb-4 ml-3 mr-3"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                WIP States
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="HeadersWIP"
                  :items="StoreObj.ticket_transaction_history"
                  dense
                  class="FontSize elevation-0 ma-1"
                >
                  <template v-slot:[`item.sl_no`]="{ item }">
                    <div class="FontSize" color="primary">
                      {{
                        StoreObj.ticket_transaction_history.indexOf(item) + 1
                      }}
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Product Files
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  @click:row="handleRowClick"
                  :headers="FileHeaders"
                  :items="StoreObj.product_attachments"
                  dense
                  class="FontSize elevation-0 ma-1"
                >
                  <template v-slot:[`item.sl_no`]="{ item }">
                    <div class="FontSize" color="primary">
                      {{ StoreObj.product_attachments.indexOf(item) + 1 }}
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                MRF Attachments
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  @click:row="mrfAttachRowClick"
                  :headers="mrfAttachmentHeader"
                  :items="StoreObj.mrf_attachments"
                  dense
                  class="FontSize elevation-0 ma-1"
                >
                  <template v-slot:[`item.sl_no`]="{ item }">
                    <div class="FontSize" color="primary">
                      {{ StoreObj.mrf_attachments.indexOf(item) + 1 }}
                    </div>
                  </template>
                  <template v-slot:[`item.file_url`]="{ item }">
                    <div>
                      {{ item }}
                    </div>
                  </template>
                  <template v-slot:[`item.file_type`]="{ item }">
                    <div>
                      {{ GetFileFormat(item) }}
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          class="mb-4 ml-3 mr-3"
          v-if="StoreObj.updated_payment_details"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Warranty Claimed Payment Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="paymentDetailsHeader"
                  :items="paymentDetails"
                  dense
                  class="FontSize elevation-0 ma-1"
                >
                  <template v-slot:[`item.payment_type`]="{ item }">
                    <div class="FontSize">
                      {{ item.payment_type }}
                    </div>
                  </template>
                  <template v-slot:[`item.mode_of_payment`]="{ item }">
                    <div class="FontSize">
                      {{ item.mode_of_payment }}
                    </div>
                  </template>
                  <template v-slot:[`item.date_of_payment`]="{ item }">
                    <div class="FontSize">
                      {{ item.date_of_payment }}
                    </div>
                  </template>
                  <template v-slot:[`item.payment_value`]="{ item }">
                    <div class="FontSize">
                      {{ item.payment_value }}
                    </div>
                  </template>
                  <template v-slot:[`item.payment_reference_number`]="{ item }">
                    <div class="FontSize">
                      {{ item.payment_reference_number }}
                    </div>
                  </template>
                  <template v-slot:[`item.payment_attachment_file`]="{ item }">
                    <div
                      v-if="
                        item.payment_attachment_file &&
                        item.payment_attachment_file.length > 0
                      "
                    >
                      <v-icon
                        small
                        color="primary"
                        @click="
                          displayImageMethod(item.payment_attachment_file)
                        "
                        >mdi-paperclip</v-icon
                      >
                    </div>
                    <div v-else>-</div>
                  </template>
                  <template v-slot:[`item.file_type`]="{ item }">
                    <div>
                      {{ GetFileFormat(item) }}
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4 ml-3 mr-3" v-if="StoreObj.foc_comments">
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                FOC Edited Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="focDetailsHeader"
                  :items="focDetails"
                  dense
                  class="FontSize elevation-0 ma-1 TableValFontsize"
                >
                  <template v-slot:[`item.foc_attachments`]="{ item }">
                    <div
                      v-if="
                        item.foc_attachments && item.foc_attachments.length > 0
                      "
                    >
                      <v-icon
                        small
                        color="primary"
                        @click="displayImageMethod(item.foc_attachments)"
                        >mdi-paperclip</v-icon
                      >
                    </div>
                    <div v-else>-</div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          class="mb-4 ml-3 mr-3"
          v-if="StoreObj.cost_configuration_id"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Payout Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Cost For Ticket: </strong>
                        {{ StoreObj.cost_for_ticket || "-" }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Cost Configuration GST: </strong>
                        {{ StoreObj.cost_configuration_gst || "-" }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          class="mb-4 ml-3 mr-3"
          v-if="StoreObj.service_charges"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Service Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Travel Allowance: </strong>
                        {{ StoreObj.service_charges?.travel_allowance || "-" }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Travel Distance: </strong>
                        {{ StoreObj.service_charges?.travel_distance || "-" }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Meals: </strong>
                        {{ StoreObj.service_charges?.meals || "-" }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Night Stay: </strong>
                        {{ StoreObj.service_charges?.night_stay || "-" }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Hotel: </strong>
                        {{ StoreObj.service_charges?.hotel || "-" }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <div class="FontSize">
                      <span>
                        <strong>Transportation: </strong>
                        {{ StoreObj.service_charges?.transportation || "-" }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          class="mb-4 ml-3 mr-3"
          v-if="StoreObj.ownstock_utilised_components"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Own Stock Utilized Components Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="ownStockCompInfoHeader"
                  :items="StoreObj.ownstock_utilised_components"
                  dense
                  class="FontSize elevation-0 ma-1 TableValFontsize"
                >
                  <template v-slot:[`item.sl_no`]="{ item, index }">
                    <div class="FontSize" color="primary">
                      {{ index + 1 }}
                    </div>
                  </template>
                  <template v-slot:[`item.component_cost`]="{ item }">
                    <div class="FontSize" color="primary">
                      {{ item.component_cost || "-" }}
                    </div>
                  </template>
                  <template v-slot:[`item.approved_source`]="{ item }">
                    <div class="FontSize" color="primary">
                      {{
                        item.approved_source
                          .trim()
                          .replace(/_/g, " ")
                          .replace(/-/g, "") || "-"
                      }}
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          class="mb-4 ml-3 mr-3"
          v-if="StoreObj.purchase_order_initiated"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Purchase Order Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="purchaseOrderHeader"
                  :items="StoreObj.purchase_order_details"
                  dense
                  class="FontSize elevation-0 ma-1 TableValFontsize"
                  hide-default-footer
                  style="cursor: pointer"
                >
                  <template
                    v-slot:[`item.purchase_order_created_on`]="{ item }"
                  >
                    <div>
                      {{
                        new Date(
                          item.purchase_order_created_on * 1000
                        ).toLocaleString("en-GB")
                      }}
                    </div>
                  </template>
                  <template
                    v-slot:[`item.purchase_order_s3_pdf_url`]="{ item }"
                  >
                    <div>
                      <v-btn
                        icon
                        @click="
                          viewPOQuotAttachmentMethod(item.purchase_order_s3_url)
                        "
                        ><v-icon color="primary" small>mdi-eye</v-icon></v-btn
                      >
                    </div>
                  </template>
                  <template v-slot:[`item.payment_done`]="{ item }">
                    <div v-if="item.purchanse_order_payment_details">
                      <v-btn icon @click.stop="viewPODetailsMethod(item)"
                        ><v-icon color="green" small
                          >mdi-check-circle</v-icon
                        ></v-btn
                      >
                    </div>
                    <div v-else>-</div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
        <v-expansion-panels
          class="mb-4 ml-3 mr-3"
          v-if="StoreObj.is_quotation_created"
        >
          <v-card outlined>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="FontSize font-weight-bold black--text"
                expand-icon="mdi-menu-down"
              >
                Quotation Details
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-table
                  :headers="quotationHeader"
                  :items="StoreObj.quotation_details"
                  dense
                  class="FontSize elevation-0 ma-1 TableValFontsize"
                  hide-default-footer
                  style="cursor: pointer"
                >
                  <template v-slot:[`item.quotation_created_on`]="{ item }">
                    <div>
                      {{
                        new Date(
                          item.quotation_created_on * 1000
                        ).toLocaleString("en-GB")
                      }}
                    </div>
                  </template>
                  <template v-slot:[`item.quotation_s3_url`]="{ item }">
                    <div>
                      <v-btn
                        icon
                        @click.stop="
                          viewPOQuotAttachmentMethod(item.quotation_s3_url)
                        "
                        ><v-icon color="primary" small>mdi-eye</v-icon></v-btn
                      >
                    </div>
                  </template>
                  <template v-slot:[`item.payment_done`]="{ item }">
                    <div v-if="item.quotation_payment_details">
                      <v-btn icon @click.stop="viewQuotationDetailsMethod(item)"
                        ><v-icon color="green" small
                          >mdi-check-circle</v-icon
                        ></v-btn
                      >
                    </div>
                    <div v-else>-</div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </v-expansion-panels>
      </v-row>
      <v-col
        v-if="this.StoreObj.attachment_file != 0"
        cols="12"
        md="12"
        sm="12"
      >
        <div class="FontSize ml-4">
          <h4>
            Attached Files
            <v-icon
              v-if="StoreObj.attachment_file != undefined"
              color="primary"
              small
              @click="openPreviewDocs('TICKET')"
              >mdi-information</v-icon
            >
          </h4>
        </div>
        <v-data-table
          dense
          @click:row="handleRowClick"
          :headers="FileHeadersClosed"
          class="FontSize elevation-0"
          :items="StoreObj.attachment_file"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize" color="primary">
              {{ StoreObj.attachment_file.indexOf(item) + 1 }}
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-col
        cols="12"
        md="12"
        sm="12"
        xs="12"
        v-if="
          StoreObj.quotation_attachments != undefined &&
          StoreObj.quotation_attachments.length != 0
        "
      >
        <div class="FontSize ml-4">
          <h4>
            Quotation Attachements
            <v-icon
              v-if="StoreObj.quotation_attachments != undefined"
              color="primary"
              small
              @click="openPreviewDocs('QUOTATION')"
              >mdi-information</v-icon
            >
          </h4>
        </div>
        <v-data-table
          dense
          @click:row="handleRowClick"
          :headers="FileHeadersClosed"
          class="FontSize elevation-0"
          :items="StoreObj.quotation_attachments"
        >
          <template v-slot:[`item.sl_no`]="{ item }">
            <div class="FontSize" color="primary">
              {{ StoreObj.quotation_attachments.indexOf(item) + 1 }}
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-dialog :value="PreviewDocs" width="70%" height="90%">
        <v-card>
          <v-toolbar dense dark class="elevation-0" color="primary">
            <div>Uploaded Images</div>
            <v-spacer></v-spacer>
            <v-btn text @click="PreviewDocsEmit"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-toolbar>
          <v-card-text>
            <v-carousel>
              <v-carousel-item
                v-for="(item, i) in this.preview_image_type != 'QUOTATION'
                  ? this.StoreObj.attachment_file
                  : this.StoreObj.quotation_attachments"
                :key="i"
                reverse-transition="fade-transition"
                transition="fade-transition"
              >
                <v-img :src="item.file_url" contain height="80%"> </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import ComponentsInformation from "@/components/Tickets/Dialogs/ComponentsInformation.vue";
import OldSerialNumbersDialog from "@/components/Tickets/Dialogs/OldSerialNumbersDialog.vue";
import dailogTicketDetails from "@/components/ScheduledService/Dialogs/ViewTicketDetailsDailog.vue";
import ViewFGRDetailsDialog from "@/components/Tickets/Dialogs/FGRView.vue";
import dialogMRFApprovedDetails from "@/components/Tickets/Dialogs/ConsumedCompDialog.vue";
import DisplayPaymentImage from "@/components/Quotation/DisplayPaymentImages.vue";
import PurchaseOrderDetails from "@/components/Tickets/Dialogs/PurchaseOrderDetailsDialog.vue";
import QuotationDetails from "@/components/Tickets/Dialogs/QuotationDetailsDialog.vue";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    dailogTicketDetails,
    ComponentsInformation,
    OldSerialNumbersDialog,
    ViewFGRDetailsDialog,
    dialogMRFApprovedDetails,
    DisplayPaymentImage,
    PurchaseOrderDetails,
    QuotationDetails,
  },
  data: () => ({
    search: "",
    ticket_invoice_date: "",
    preview_image_type: "",
    PreviewDocs: false,
    viewTicketDetailsDailog: false,
    oldSerialNumberDetailsDialog: false,
    dialogComponentsInformation: false,
    ViewFGRDetailsDialog: false,
    dialogMRFApprovedDetails: false,
    displayPaymentImagesDialog: false,
    ActionObj: {},
    List: [],
    panel: [0, 1],
    quotation_attachments: [],
    service_s3_files: [],
    ticket_transaction_history: [],
    ActionArray: [],
    paymentDetails: [],
    FileHeaders: [
      {
        text: "#",
        value: "sl_no",
      },
      {
        text: "File Name",
        value: "file_name",
      },
      {
        text: "File Type",
        value: "file_type",
      },
    ],
    HeadersWIP: [
      {
        text: "#",
        value: "sl_no",
      },
      {
        text: "WIP States",
        value: "wip_sub_stage_name",
      },
      {
        text: "Action By",
        value: "action_taken_by",
      },
      {
        text: "Action Time",
        value: "action_time",
      },
    ],
    Headers: [
      {
        text: "Name",
        value: "component_name",
      },
      {
        text: "Code",
        value: "component_product_code",
      },
      {
        text: "Quantity",
        value: "component_quantity",
      },
    ],
    FileHeadersClosed: [
      {
        text: "#",
        value: "sl_no",
      },
      {
        text: "File Name",
        value: "file_name",
      },
      {
        text: "File Type",
        value: "file_type",
      },
    ],
    mrfAttachmentHeader: [
      { text: "Sl.No", value: "sl_no" },
      { text: "File Name", value: "file_url" },
      { text: "File Type", value: "file_type" },
    ],
    paymentDetailsHeader: [
      { text: "Payment Type", value: "payment_type" },
      { text: "Mode Of Payment", value: "mode_of_payment" },
      { text: "Date Of Payment", value: "date_of_payment" },
      { text: "Payment Value", value: "payment_value" },
      { text: "Payment Ref No", value: "payment_reference_number" },
      { text: "Attachments", value: "payment_attachment_file" },
    ],
    focDetailsHeader: [
      { text: "FOC Comment", value: "foc_comments" },
      { text: "FOC Attachments", value: "foc_attachments" },
    ],
    ownStockCompInfoHeader: [
      { text: "Sl No", value: "sl_no" },
      { text: "Component Name", value: "component_name" },
      { text: "Component Code", value: "component_code" },
      { text: "Category Name", value: "category_name" },
      { text: "Component Cost", value: "component_cost" },
      { text: "Approved Source", value: "approved_source" },
    ],
    focDetails: [],
    imageArray: [],
    purchaseOrderHeader: [
      { text: "Purchase Order ID", value: "purchase_order_display_id" },
      { text: "Purchase Order Created On", value: "purchase_order_created_on" },
      { text: "Payment Done", value: "payment_done" },
      { text: "View PDF", value: "purchase_order_s3_pdf_url" },
    ],
    quotationHeader: [
      { text: "Quotation ID", value: "quotation_display_id" },
      { text: "Quotation Created On", value: "quotation_created_on" },
      { text: "Payment Done", value: "payment_done" },
      { text: "View PDF", value: "quotation_s3_url" },
    ],
    // quotationDataItem: [],
    // purchaseOrderItem: [],
    purchaseOrderDetailsDialog: false,
    quotationDetailsDialog: false,
    purchaseOrderObj: {},
    quotationObj: {},
  }),
  mounted() {
    console.log("GET_MOUNTED", this.StoreObj);
    if (
      this.StoreObj.updated_payment_details ||
      (this.StoreObj.ticket_payment_attachments &&
        this.StoreObj.ticket_payment_attachments.length > 0)
    ) {
      this.paymentDetails = [];
      const paymentDetObj = { ...this.StoreObj.updated_payment_details };
      paymentDetObj.payment_attachment_file =
        this.StoreObj.ticket_payment_attachments;
      this.paymentDetails.push(paymentDetObj);
      console.log("PAY_DETA", this.paymentDetails);
    }
    if (this.StoreObj.foc_comments) {
      const focDetail = { foc_comments: this.StoreObj.foc_comments };
      if (
        this.StoreObj.foc_attachments &&
        this.StoreObj.foc_attachments.length > 0
      ) {
        focDetail.foc_attachments = this.StoreObj.foc_attachments;
      }
      this.focDetails.push(focDetail);
    }
    // if (this.StoreObj.purchase_order_initiated) {
    //   this.purchaseOrderItem = [];
    //   const obj = {
    //     purchase_order_display_id: this.StoreObj.purchase_order_display_id,
    //     purchase_order_s3_pdf_url: this.StoreObj.purchase_order_s3_pdf_url,
    //     purchase_order_id: this.StoreObj.purchase_order_id,
    //   };
    //   this.purchaseOrderItem.push(obj);
    // }
  },
  methods: {
    displayImageMethod(item) {
      try {
        this.imageArray = item;
        this.displayPaymentImagesDialog = true;
        console.log("CHECK_FOR_ATTA", item);
      } catch (error) {
        console.log("CHECK_FOR_ATTA_ERROR", error);
      }
    },
    GetFileFormat(item) {
      if (item) {
        const parts = item.split(".");
        return parts[parts.length - 1];
      }
    },

    viewTicketDetailsDailogemit() {
      this.viewTicketDetailsDailog = false;
    },
    dialogComponentsInformationEmit() {
      this.dialogComponentsInformation = false;
    },
    oldSerialNumberDetailsDialogEmit() {
      this.oldSerialNumberDetailsDialog = false;
    },
    PreviewDocsEmit() {
      this.preview_image_type = "";
      this.PreviewDocs = false;
    },
    openPreviewDocs(preview_image_type) {
      this.preview_image_type = preview_image_type;
      this.PreviewDocs = true;
    },
    handleRowClick(item) {
      window.open(item.file_url);
    },
    mrfAttachRowClick(item) {
      window.open(item);
    },
    fgrViewMethod(item) {
      this.ActionObj = item;
      this.ViewFGRDetailsDialog = true;
    },
    FgrInfoDialogEmit() {
      this.ViewFGRDetailsDialog = false;
    },
    mrfApproved_Method() {
      this.ActionArray = this.StoreObj.mrf_approved_details;
      this.dialogMRFApprovedDetails = true;
    },

    viewPOQuotAttachmentMethod(url) {
      window.open(url, "__blank");
    },

    viewPODetailsMethod(rowItem) {
      this.purchaseOrderObj = rowItem;
      this.purchaseOrderDetailsDialog = true;
    },

    viewQuotationDetailsMethod(rowItem) {
      this.quotationObj = rowItem;
      this.quotationDetailsDialog = true;
    },

    dialogMRFApprovedDetailsEmit(Toggle) {
      this.dialogMRFApprovedDetails = false;
    },

    DisplayPaymentImagesDialogEmit(Toggle) {
      this.displayPaymentImagesDialog = false;
    },

    purchaseOrderDetailsDialogEmit(Toggle) {
      this.purchaseOrderDetailsDialog = false;
    },

    quotationDetailsDialogEmit(Toggle) {
      this.quotationDetailsDialog = false;
    },
  },
};
</script>
