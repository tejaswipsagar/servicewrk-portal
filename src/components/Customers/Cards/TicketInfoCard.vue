<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <ChangeTicketStatusDialog
      :StoreObj="StoreObj"
      :dialogChangeTicketStatus="dialogChangeTicketStatus"
      @clicked="dialogChangeTicketStatusEmit"
    />
    <ReassignTicketDialog
      :StoreObj="StoreObj"
      :dialogReassignTicket="dialogReassignTicket"
      @clicked="dialogReassignTicketEmit"
    />
    <DiscardDialogTicket
      :StoreObj="StoreObj"
      :dialogDiscard="dialogDiscard"
      @clicked="dialogDiscardEmit"
    />
    <CloseTicket
      :StoreObj="StoreObj"
      :closeDilaog="closeDilaog"
      @clicked="dialogCloseEmit"
    />
    <DeactivateTicket
      :StoreObj="StoreObj"
      :deactivateTicketDilaog="deactivateTicketDilaog"
      @clicked="dialogDeactivateEmit"
    />
    <ChangeVisitDateTime
      :StoreObj="StoreObj"
      :dialogChangeVisitDateTime="dialogChangeVisitDateTime"
      @clicked="dialogChangeVisitDateTimeEmit"
    />
    <AddRemarks
      :StoreObj="StoreObj"
      :dialogAddRemarks="dialogAddRemarks"
      @clicked="dialogAddRemarksEmit"
    />
    <EditTicket
      :StoreObj="StoreObj"
      :dialogEditTicket="dialogEditTicket"
      @clicked="dialogEditTicketEmit"
    />
    <ProductFleetRequestDialog
      :StoreObj="StoreObj"
      :dialogProductFleetRequest="dialogProductFleetRequest"
      @clicked="dialogProductFleetRequestEmit"
    />
    <ComponentsInformation
      :StoreObj="StoreObj"
      :dialogComponentsInformation="dialogComponentsInformation"
      @clicked="dialogComponentsInformationEmit"
    />
    <ReopenTicketsDialog
      :StoreObj="StoreObj"
      :dialogReopenTicket="dialogReopenTicket"
      @clicked="dialogReopenTicketEmit"
    />
    <RepeatTicket
      :StoreObj="StoreObj"
      :dialogRepeatDialog="dialogRepeatDialog"
      @clicked="dialogRepeatDialogEmit"
    />
    <v-card class="elevation-0 mt-3">
      <v-form ref="form">
        <v-toolbar dense class="elevation-0">
          <div class="largeFontSizeNew py-0 mt-1">
            {{ TicketHeadline }}
          </div>
          <v-spacer></v-spacer>

          <!-- <v-select
            style="max-width: 200px"
            v-model="ticketStatus"
            :items="ticketStatusItems"
            item-text="text"
            item-value="value"
            dense
            outlined
            label="Ticket Status"
            class="mr-2 mt-7 FontSize"
          ></v-select> -->
          <v-btn
            color="primary"
            small
            dense
            class="ml-2"
            @click="ticketInfoCardEmit(1)"
            ><v-icon small>mdi-arrow-left</v-icon>To Tagged Product</v-btn
          >
        </v-toolbar>
        <v-card-text class="py-0">
          <div v-if="ticketItem.length === 0">
            <strong><span>No tickets available!</span></strong>
          </div>
          <div
            v-if="
              ticketItem[0].ticket_status === 'ASSIGNED' ||
              ticketItem[0].ticket_status === 'REQUEST_FOR_COMPONENTS' ||
              ticketItem[0].ticket_status === 'SELF_ASSIGNED' ||
              ticketItem[0].ticket_status === 'OPEN' ||
              ticketItem[0].ticket_status === 'SCHEDULED'
            "
          >
            <v-data-table
              dense
              fixed-header
              class="elevation-0"
              :height="TableHeight"
              style="cursor: pointer"
              :headers="openTicketHeaders"
              :items="ticketItem"
              hide-default-footer
            >
              <template v-slot:[`item.work_status`]="{ item }">
                <div
                  v-if="
                    item.is_service_partner_partially_open_ticket == true ||
                    item.is_dealer_owner_partially_open_ticket == true
                  "
                >
                  <v-card
                    width="90px"
                    height="70px"
                    color="yellow"
                    align="center"
                    class="elevation-0 pa-1 pt-2 mr-3"
                  >
                    <div style="font-size: 12px" color="white--text">
                      Take Action by
                      {{
                        new Date(item.ticket_revoke_time * 1000).toLocaleString(
                          "en-GB"
                        )
                      }}
                    </div>
                  </v-card>
                </div>
                <div v-else class="mx-n3">
                  <v-icon
                    :class="
                      item.work_status == 'START'
                        ? 'green--text'
                        : item.work_status == 'END'
                        ? 'red--text'
                        : 'yellow--text'
                    "
                    size="10"
                    >mdi-circle</v-icon
                  >
                </div>
                <div v-if="item.is_repeat_ticket == true" class="ml-n4">
                  <v-tooltip color="primary" right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small color="primary" v-on="on" v-bind="attrs"
                        >mdi-repeat</v-icon
                      >
                    </template>
                    <span>Repeated Ticket</span>
                  </v-tooltip>
                </div>
                <div v-else></div>
              </template>
              <template v-slot:[`item.ticket_id`]="{ item }">
                <div>
                  <div
                    class="FontSize font-weight-bold"
                    v-if="item.custom_ticket_id == undefined"
                  >
                    {{
                      `${item.ticket_id.split("-")[1]}-${
                        item.ticket_id.split("-")[2]
                      }-${item.ticket_id.split("-")[3]}-${
                        item.ticket_id.split("-")[4]
                      }`
                    }}
                    <span v-if="item.is_quotation_created">
                      <v-tooltip color="green" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small v-on="on" v-bind="attrs" color="green"
                            >mdi-cash-100</v-icon
                          >
                        </template>
                        <span>Quotation Generated</span>
                      </v-tooltip>
                    </span>
                  </div>
                  <div
                    class="FontSize font-weight-bold"
                    v-else-if="item.custom_ticket_id != undefined"
                  >
                    {{ item.custom_ticket_id }}
                    <span v-if="item.is_quotation_created">
                      <v-tooltip color="green" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small v-on="on" v-bind="attrs" color="green"
                            >mdi-cash-100</v-icon
                          >
                        </template>
                        <span>Quotation Generated</span>
                      </v-tooltip>
                    </span>
                  </div>
                  <div
                    class="FontSize"
                    v-if="item.ticket_creation_type != undefined"
                  >
                    <span class="FontSize">{{
                      item.ticket_creation_type.replaceAll("_", " ")
                    }}</span>
                  </div>
                  <div v-else>-</div>
                  <div class="FontSize" v-if="item.representative_name">
                    <span class="FontSize">{{ item.representative_name }}</span>
                  </div>
                  <div v-else>-</div>
                </div>
                <v-btn
                  v-if="item.requested_serial_number != undefined"
                  x-small
                  color="orange white--text"
                  class="ml-n8"
                  @click.stop="checkItem(item, 'PRODUCT_FLEET_REQUEST')"
                  >Requested For Product Fleet</v-btn
                >
              </template>
              <template v-slot:[`item.customer_company_name`]="{ item }">
                <div
                  class="FontSize"
                  v-if="item.customer_company_name != undefined"
                >
                  {{ item.customer_company_name }}
                </div>
                <div v-else>-</div>
                <div class="FontSize" v-if="item.customer_name != undefined">
                  {{ item.customer_name }}
                </div>
                <div v-else>-</div>
                <div v-if="item.ticket_city != undefined" class="FontSize">
                  {{ item.ticket_city }}
                </div>
              </template>
              <template v-slot:[`item.category_name`]="{ item }">
                <div class="FontSize">{{ item.category_name }}</div>
                <div class="FontSize">{{ item.service_name }}</div>
                <div
                  class="FontSize primary--text"
                  v-if="item.additional_ticket_status"
                >
                  {{ item.additional_ticket_status.replaceAll("_", " ") }}
                </div>
                <div
                  class="FontSize"
                  v-else-if="item.ticket_status != undefined"
                >
                  <span class="primary--text"
                    >{{ item.ticket_status.replaceAll("_", " ") }}
                  </span>
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ticket_created_on`]="{ item }">
                <div class="FontSize">
                  {{
                    new Date(item.ticket_created_on * 1000).toLocaleString(
                      "en-GB"
                    )
                  }}
                </div>
                <div class="FontSize text-capitalize">
                  <span>{{ item.service_type_name }}</span>
                </div>
              </template>
              <template v-slot:[`item.ticket_warranty_type`]="{ item }">
                <div class="FontSize text-capitalize font-weight-bold">
                  {{
                    item.ticket_warranty_type != undefined
                      ? item.ticket_warranty_type
                      : "-"
                  }}
                </div>
                <div
                  class="FontSize text-capitalize"
                  v-if="item.ticket_warranty_type != undefined"
                >
                  <span class="text-capitalize">{{
                    item.support_type != undefined ? item.support_type : ""
                  }}</span>
                </div>
                <div
                  class="FontSize"
                  v-if="item.additional_comments != undefined"
                >
                  {{ item.additional_comments }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.requested_components_details`]="{ item }">
                <div
                  v-if="
                    item.requested_components_details != undefined ||
                    (item.component_list != undefined &&
                      item.component_list.length != 0)
                  "
                >
                  <v-icon
                    color="primary"
                    @click.stop="checkItem(item, 'COMPONENTS')"
                    small
                    >mdi-information</v-icon
                  >
                </div>
                <div v-else><v-icon color="red" small>mdi-close</v-icon></div>
              </template>
              <template v-slot:[`item.requested_components_details`]="{ item }">
                <div
                  v-if="
                    item.requested_components_details != undefined ||
                    (item.component_list != undefined &&
                      item.component_list.length != 0)
                  "
                >
                  <v-icon
                    color="primary"
                    @click.stop="checkItem(item, 'COMPONENTS')"
                    small
                    >mdi-information</v-icon
                  >
                </div>
                <div v-else><v-icon color="red" small>mdi-close</v-icon></div>
              </template>
              <template v-slot:[`item.Actions`]="{ item }">
                <div v-if="ticketItem[0].ticket_status !== 'SCHEDULED'">
                  <v-menu right bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon color="primary">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense nav>
                      <v-list-item-group color="primary">
                        <v-list-item @click.stop="checkItem(item, 'STATUS')">
                          <v-list-item-icon>
                            <v-icon small color="blue">mdi-recycle</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title>Change Status</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click.stop="checkItem(item, 'REASSIGN')">
                          <v-list-item-icon>
                            <v-icon small color="teal">mdi-refresh</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title
                              >Reassign Ticket</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click.stop="checkItem(item, 'DISCARD')">
                          <v-list-item-icon>
                            <v-icon small color="red lighten-2"
                              >mdi-close-circle-outline</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title
                              >Discard Ticket</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click.stop="checkItem(item, 'CLOSE')">
                          <v-list-item-icon>
                            <v-icon small color="red darken-2"
                              >mdi-close</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title>Close Ticket</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          @click.stop="checkItem(item, 'DEACTIVATE')"
                        >
                          <v-list-item-icon>
                            <v-icon small color="red darken-2"
                              >mdi-close-octagon</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title
                              >Inactive Ticket</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          @click.stop="checkItem(item, 'DOWNLOAD_PDF')"
                        >
                          <v-list-item-icon>
                            <v-icon small color="amber darken-2"
                              >mdi-cloud-download</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title>Download PDF</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          @click.stop="
                            checkItem(item, 'CHANGE_VISIT_DATE_TIME')
                          "
                        >
                          <v-list-item-icon>
                            <v-icon small color="purple darken-2"
                              >mdi-clipboard-text-clock-outline</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title
                              >Change Visit Date & Time</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click.stop="checkItem(item, 'REMARKS')">
                          <v-list-item-icon>
                            <v-icon small color="green darken-2"
                              >mdi-message</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title>Add Remarks</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          v-if="
                            $store.getters.get_user_type == 'OWNER' ||
                            $store.getters.get_user_type == 'ADMIN'
                          "
                          @click.stop="checkItem(item, 'EDIT_TICKET')"
                        >
                          <v-list-item-icon>
                            <v-icon small color="primary darken-2"
                              >mdi-ticket</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content class="ml-n5">
                            <v-list-item-title>Edit Ticket</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </div>
                <div v-else>
                  <span>-</span>
                </div>
              </template>
            </v-data-table>
          </div>
          <div
            v-if="
              ticketItem[0].ticket_status === 'RSM_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status === 'NSM_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status === 'AGENT_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status ===
                'REPRESENTATIVE_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status ===
                'SERVICE_PARTNER_AGENT_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status ===
                'SERVICE_PARTNER_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status === 'PARTNER_REPRESENTATIVE' ||
              ticketItem[0].ticket_status === 'DEALER_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status === 'DEALER_TECHNICIAN' ||
              ticketItem[0].ticket_status === 'DEALER_AGENT_PARTIALLY_CLOSED' ||
              ticketItem[0].ticket_status ===
                'SERVICE_REPRESENTATIVE_PARTIALLY_CLOSED'
            "
          >
            <v-data-table
              dense
              fixed-header
              class="elevation-0"
              :height="TableHeight"
              style="cursor: pointer"
              :headers="partiallyClosedTicketHeaders"
              :items="ticketItem"
              hide-default-footer
            >
              <template v-slot:[`item.custom_ticket_id`]="{ item }">
                <div class="FontSize" v-if="item.custom_ticket_id != undefined">
                  {{ item.custom_ticket_id }}
                </div>
                <div class="FontSize" v-else-if="item.ticket_id != undefined">
                  {{
                    `${item.ticket_id.split("-")[1]}-${
                      item.ticket_id.split("-")[2]
                    }-${item.ticket_id.split("-")[3]}-${
                      item.ticket_id.split("-")[4]
                    }`
                  }}
                </div>
                <div v-else>-</div>
                <div class="FontSize" v-if="item.representative_name">
                  <span class="FontSize">{{ item.representative_name }}</span>
                </div>
                <div v-else>-</div>
                <div class="FontSize">
                  <div
                    v-if="
                      item.captured_otp != undefined &&
                      item.satisfied_otp != undefined
                    "
                  >
                    <span
                      v-if="item.captured_otp == item.satisfied_otp"
                      class="green--text"
                      >By Customer</span
                    >
                    <span v-else-if="item.not_satisfied_otp">
                      <span
                        class="red--text"
                        v-if="item.captured_otp == item.not_satisfied_otp"
                      >
                        By Technician
                      </span>
                    </span>
                  </div>
                  <div
                    v-else-if="item.closed_otp_type == 'PORTAL'"
                    class="blue--text FontSize"
                  >
                    From Portal
                  </div>
                </div>
              </template>
              <template v-slot:[`item.customer_company_name`]="{ item }">
                <div class="FontSize" v-if="item.customer_company_name">
                  {{ item.customer_company_name }}
                </div>
                <div v-else>-</div>
                <div class="FontSize" v-if="item.customer_name">
                  {{ item.customer_name }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.category_name`]="{ item }">
                <div class="FontSize" v-if="item.category_name">
                  {{ item.category_name }}
                </div>
                <div v-else>-</div>
                <div class="FontSize" v-if="item.service_name">
                  {{ item.service_name }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ticket_status`]="{ item }">
                <div
                  class="FontSize primary--text"
                  v-if="item.ticket_status != undefined"
                >
                  {{ item.ticket_status.replaceAll("_", " ") }}
                </div>
                <div class="FontSize" v-if="item.ticket_closed_time">
                  {{
                    new Date(item.ticket_closed_time * 1000).toLocaleString(
                      "en-GB"
                    )
                  }}
                </div>
              </template>
              <template v-slot:[`item.Actions`]="{ item }">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      color="green"
                      v-on="on"
                      @click.stop="checkItem(item, 'REOPEN')"
                    >
                      mdi-lock-open
                    </v-icon>
                  </template>
                  <span>Re-Open Ticket</span>
                </v-tooltip>
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="red"
                      v-on="on"
                      small
                      class="ml-2"
                      @click.stop="checkItem(item, 'CLOSE')"
                      >mdi-close-thick</v-icon
                    >
                  </template>
                  <span>Close Ticket</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </div>
          <div v-if="ticketItem[0].ticket_status === 'CLOSED'">
            <v-data-table
              dense
              fixed-header
              class="elevation-0"
              :height="TableHeight"
              style="cursor: pointer"
              :headers="closedTicketHeaders"
              :items="ticketItem"
              hide-default-footer
            >
              <template v-slot:[`item.ticket_id`]="{ item }">
                <div class="FontSize" v-if="item.custom_ticket_id == undefined">
                  {{
                    `${item.ticket_id.split("-")[1]}-${
                      item.ticket_id.split("-")[2]
                    }-${item.ticket_id.split("-")[3]}-${
                      item.ticket_id.split("-")[4]
                    }`
                  }}
                </div>
                <div
                  class="FontSize"
                  v-else-if="item.custom_ticket_id != undefined"
                >
                  {{ item.custom_ticket_id }}
                </div>
                <div class="FontSize">
                  <span class="FontSize">{{ item.category_name }}</span>
                </div>
                <div class="FontSize">
                  <span class="FontSize">{{ item.service_name }}</span>
                </div>
                <v-btn
                  v-if="item.old_serial_number_details != undefined"
                  color="green"
                  class="white--text"
                  x-small
                  @click.stop="checkItem(item, 'OLD_SERIAL_NUMBER_DETAILS')"
                  >Product Fleet Replaced</v-btn
                >
              </template>
              <template v-slot:[`item.customer_company_name`]="{ item }">
                <div class="FontSize">
                  {{ item.customer_company_name }}
                </div>
                <div class="FontSize">
                  <span class="FontSize">
                    {{ item.customer_name }}
                  </span>
                </div>
                <div
                  class="FontSize"
                  v-if="item.customer_unique_id != undefined"
                >
                  {{ item.customer_unique_id }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ticket_created_on`]="{ item }">
                <div class="FontSize">
                  <span>
                    {{
                      new Date(item.ticket_created_on * 1000).toLocaleString(
                        "en-GB"
                      )
                    }}
                  </span>
                </div>
                <div class="FontSize" v-if="item.ticket_city != undefined">
                  {{ item.ticket_city }}
                </div>
              </template>
              <template v-slot:[`item.ticket_closed_time`]="{ item }">
                <div class="FontSize">
                  <span>
                    {{
                      new Date(item.ticket_closed_time * 1000).toLocaleString(
                        "en-GB"
                      )
                    }}
                  </span>
                </div>
                <div class="FontSize">
                  <div
                    v-if="
                      item.captured_otp != undefined &&
                      item.satisfied_otp != undefined
                    "
                  >
                    <span
                      v-if="item.captured_otp == item.satisfied_otp"
                      class="green--text"
                      >By Customer</span
                    >
                    <span v-else-if="item.not_satisfied_otp">
                      <span
                        class="red--text"
                        v-if="item.captured_otp == item.not_satisfied_otp"
                      >
                        By Technician
                      </span>
                    </span>
                  </div>
                  <div
                    v-else-if="item.closed_otp_type == 'PORTAL'"
                    class="blue--text FontSize"
                  >
                    From Portal
                  </div>
                </div>
                <div class="FontSize" v-if="item.ticket_closed_location">
                  {{ item.ticket_closed_location.replaceAll("_", " ") }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ticket_total_time`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span class="FontSize" v-bind="attrs" v-on="on">{{
                      GetTotalTime(
                        item.assigned_or_closed_on - item.ticket_created_on
                      )
                    }}</span>
                  </template>
                  {{
                    GetTotalTime(
                      item.assigned_or_closed_on - item.ticket_created_on
                    )
                  }}
                </v-tooltip>
                <div class="FontSize">{{ item.representative_name }}</div>
                <div
                  class="FontSize"
                  v-if="item.ticket_creation_type != undefined"
                >
                  {{ item.ticket_creation_type.replaceAll("_", " ") }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.requested_components_details`]="{ item }">
                <div
                  v-if="
                    item.requested_components_details != undefined ||
                    (item.component_list != undefined &&
                      item.component_list.length != 0)
                  "
                >
                  <v-icon
                    color="primary"
                    @click.stop="checkItem(item, 'COMPONENTS')"
                    small
                    >mdi-information</v-icon
                  >
                </div>
                <div v-else><v-icon color="red" small>mdi-close</v-icon></div>
                <div class="FontSize" v-if="item.attachment_file != undefined">
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on, attrs }">
                      <span class="FontSize" v-bind="attrs" v-on="on">
                        <v-icon small color="primary" class="mr-1"
                          >mdi-attachment</v-icon
                        ><span>{{ item.attachment_file.length }}</span>
                      </span>
                    </template>
                    <span>No. of Attached Files</span>
                  </v-tooltip>
                </div>
              </template>
              <template v-slot:[`item.ticket_warranty_type`]="{ item }">
                <div v-if="item.ticket_warranty_type" class="FontSize">
                  {{ item.ticket_warranty_type }}
                </div>
                <div v-if="item.support_type" class="FontSize">
                  {{ item.support_type }}
                </div>
                <div v-else>-</div>
                <div v-if="item.additional_comments" class="FontSize">
                  {{ item.additional_comments }}
                </div>
                <div v-else>-</div>
              </template>
              <template v-slot:[`item.ActionsC`]="{ item }">
                <v-menu right botton>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon color="primary">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense nav>
                    <v-list-item @click.stop="checkItem(item, 'REOPEN')">
                      <v-list-item-icon>
                        <v-icon small color="green">mdi-lock-open</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Re-Open Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click.stop="checkItem(item, 'DOWNLOAD_PDF')">
                      <v-list-item-icon>
                        <v-icon small color="amber darken-2"
                          >mdi-cloud-download</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Download PDF</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click.stop="checkItem(item, 'REPEAT_TICKET')">
                      <v-list-item-icon>
                        <v-icon small color="primary">mdi-repeat</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Repeat Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { GetProductReleatedTickets } from "@/graphql/queries.js";
import { GenerateTicketPDF } from "@/graphql/mutations.js";

import Snackbar from "@/components/Extras/SnackbarView.vue";
import ChangeTicketStatusDialog from "@/components/Tickets/Dialogs/ChangeTicketStatusDialog.vue";
import ReassignTicketDialog from "@/components/Tickets/Dialogs/ReassignTicketDialog.vue";
import DiscardDialogTicket from "@/components/Tickets/Dialogs/DiscardDialogTicket.vue";
import CloseTicket from "@/components/Tickets/Dialogs/CloseTicket.vue";
import DeactivateTicket from "@/components/Tickets/Dialogs/DeactivateTicket.vue";
import ChangeVisitDateTime from "@/components/Tickets/Dialogs/ChangeVisitDateTime.vue";
import AddRemarks from "@/components/Tickets/Dialogs/AddRemarks.vue";
import EditTicket from "@/components/Tickets/Dialogs/EditTicket.vue";
import ProductFleetRequestDialog from "@/components/Tickets/Dialogs/ProductFleetRequestDialog.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import ComponentsInformation from "@/components/Tickets/Dialogs/ComponentsInformation.vue";
import ReopenTicketsDialog from "@/components/Tickets/Dialogs/ReopenTicketsDialog.vue";
import RepeatTicket from "@/components/Product/Dialogs/ProductsFleet/RepeatTicket.vue";

export default {
  props: { StoreObjTicket: Object },
  components: {
    ChangeTicketStatusDialog,
    ReassignTicketDialog,
    DiscardDialogTicket,
    CloseTicket,
    DeactivateTicket,
    Snackbar,
    ChangeVisitDateTime,
    AddRemarks,
    EditTicket,
    ProductFleetRequestDialog,
    Overlay,
    ComponentsInformation,
    ReopenTicketsDialog,
    RepeatTicket,
  },
  data: () => ({
    overlay: true,
    TableHeight: 0,
    ticketStatus: "ACTIVE",
    ticketStatusItems: [
      { text: "ACTIVE", value: "ACTIVE" },
      { text: "PARTIALLY CLOSED", value: "PARTIALLY_CLOSED" },
      { text: "CLOSED", value: "CLSOED" },
    ],
    openTicketHeaders: [
      {
        text: "#",
        value: "work_status",
        tooltip_text: "Serial Number",
        width: "8%",
      },
      {
        text: "Ticket",
        value: "ticket_id",
        tooltip_text: "Ticket Details",
        width: "20%",
      },
      {
        text: "Customer",
        value: "customer_company_name",
        tooltip_text: "Customer Details",
        width: "20%",
      },
      {
        text: "Product",
        value: "category_name",
        tooltip_text: "Product Details",
        width: "14%",
      },
      {
        text: "Created",
        value: "ticket_created_on",
        tooltip_text: "Ticket Created On",
        width: "10%",
      },
      {
        text: "Support",
        value: "ticket_warranty_type",
        tooltip_text: "Support",
      },
      {
        text: "Comp.",
        value: "requested_components_details",
        tooltip_text: "Components Required",
        width: "4%",
      },
      {
        text: "Actions",
        value: "Actions",
        tooltip_text: "Actions",
        width: "4%",
      },
    ],
    closedTicketHeaders: [
      // { text: "#", value: "sl_no", width: "4%", tooltip_text: "Serial Number" },
      {
        text: "Ticket ID",
        value: "ticket_id",
        tooltip_text: "Ticket Details",
        width: "20%",
      },
      {
        text: "Customer",
        value: "customer_company_name",
        tooltip_text: "Customer Details",
        width: "16%",
      },
      {
        text: "Created",
        value: "ticket_created_on",
        tooltip_text: "Created On",
        width: "8%",
      },
      {
        text: "Closed",
        value: "ticket_closed_time",
        tooltip_text: "Closed On",
        width: "10%",
      },
      {
        text: "TAT",
        value: "ticket_total_time",
        tooltip_text: "Turn Around Time",
        width: "13%",
      },
      {
        text: "Support",
        value: "ticket_warranty_type",
        tooltip_text: "Support & Additional Comments",
        width: "10%",
      },
      {
        text: "Comp.",
        value: "requested_components_details",
        tooltip_text: "Components Required",
        width: "5%",
      },
      {
        text: "Actions",
        value: "ActionsC",
        tooltip_text: "Actions",
        width: "8%",
      },
    ],
    partiallyClosedTicketHeaders: [
      // { text: "#", value: "sl_no", width: "6%" },
      {
        text: "Ticket ID",
        value: "custom_ticket_id",
        width: "25%",
      },
      {
        text: "Customer",
        value: "customer_company_name",
        width: "25%",
      },
      {
        text: "Product",
        value: "category_name",
        width: "13%",
      },
      {
        text: "Closed By",
        value: "ticket_status",
        width: "15%",
      },
      {
        text: "Actions",
        value: "Actions",
        width: "8%",
      },
    ],
    ticketItem: [{ ticket_status: "" }],
    StoreObj: {},
    SnackBarComponent: {},
    dialogChangeTicketStatus: false,
    dialogReassignTicket: false,
    dialogDiscard: false,
    closeDilaog: false,
    deactivateTicketDilaog: false,
    renderComp: true,
    dialogChangeVisitDateTime: false,
    dialogAddRemarks: false,
    dialogEditTicket: false,
    dialogProductFleetRequest: false,
    dialogComponentsInformation: false,
    dialogReopenTicket: false,
    dialogRepeatDialog: false,
  }),

  computed: {
    TicketHeadline() {
      if (
        this.ticketItem[0].ticket_status === "OPEN" ||
        this.ticketItem[0].ticket_status === "ASSIGNED"
      ) {
        return "Active Ticket";
      } else if (this.ticketItem[0].ticket_status === "CLOSED") {
        return "Closed Ticket";
      } else if (
        this.ticketItem[0].ticket_status === "RSM_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status === "NSM_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status === "AGENT_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status ===
          "REPRESENTATIVE_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status ===
          "SERVICE_PARTNER_AGENT_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status ===
          "SERVICE_PARTNER_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status === "PARTNER_REPRESENTATIVE" ||
        this.ticketItem[0].ticket_status === "DEALER_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status === "DEALER_TECHNICIAN" ||
        this.ticketItem[0].ticket_status === "DEALER_AGENT_PARTIALLY_CLOSED" ||
        this.ticketItem[0].ticket_status ===
          "SERVICE_REPRESENTATIVE_PARTIALLY_CLOSED"
      ) {
        return "Partially Closed";
      }
    },
  },

  mounted() {
    this.callApiMethod();
    this.TableHeight = window.innerHeight - 220;
  },

  methods: {
    async callApiMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(GetProductReleatedTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              service_serial_number: this.StoreObjTicket.setting_name,
            },
          })
        );
        const response = JSON.parse(result.data.GetProductReleatedTickets);
        console.log("CHECK_RESSS", response.data);
        if (response.status === "SUCCESS") {
          this.ticketItem = [];
          this.ticketItem.push(response.data.items);
        }
        this.overlay = false;
      } catch (error) {
        console.log("TWO", error);
        this.overlay = false;
        // this.ticketItem = [];
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
        //
      }
    },

    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "STATUS") {
        this.dialogChangeTicketStatus = true;
      } else if (action == "REASSIGN") {
        this.dialogReassignTicket = true;
      } else if (action == "DISCARD") {
        this.dialogDiscard = true;
      } else if (action == "CLOSE") {
        this.closeDilaog = true;
      } else if (action == "DEACTIVATE") {
        this.deactivateTicketDilaog = true;
      } else if (action == "DOWNLOAD_PDF") {
        this.createDownloadPDF();
      } else if (action == "CHANGE_VISIT_DATE_TIME") {
        this.dialogChangeVisitDateTime = true;
      } else if (action == "REMARKS") {
        this.dialogAddRemarks = true;
      } else if (action == "EDIT_TICKET") {
        this.dialogEditTicket = true;
      } else if (action == "PRODUCT_FLEET_REQUEST") {
        this.dialogProductFleetRequest = true;
      } else if (action == "COMPONENTS") {
        this.dialogComponentsInformation = true;
      } else if (action == "REOPEN") {
        this.dialogReopenTicket = true;
      } else if (action == "REPEAT_TICKET") {
        this.dialogRepeatDialog = true;
      }
    },

    async createDownloadPDF() {
      this.overlay = true;
      var inputParams = {
        user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        ticket_id: this.StoreObj.ticket_id,
      };
      try {
        let result = await API.graphql(
          graphqlOperation(GenerateTicketPDF, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.GenerateTicketPDF);
        if (ResultObject.status == "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.Status_Message,
          };
          this.renderComp = false;
          this.$nextTick(() => {
            this.renderComp = true;
          });
          this.pdf_url = ResultObject.pdf_url;
          window.open(this.pdf_url);
          // this.dialogCreateServiceCenterEmit((this.Toggle = 2));
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
      }
    },

    GetTotalTime(seconds) {
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);
      var dDisplay = d > 0 ? d + (d == 1 ? " Day" : " Days") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " Hour" : " Hours") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " Minute" : " Minutes") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " Second" : " Seconds") : "";
      if (dDisplay != "") return dDisplay;
      else if (hDisplay != "") return hDisplay;
      else if (mDisplay != "") return mDisplay;
      else if (sDisplay) return sDisplay;
    },

    ticketInfoCardEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },

    dialogChangeTicketStatusEmit(Toggle) {
      this.dialogChangeTicketStatus = false;
      if (Toggle === 2) {
        this.callApiMethod();
      }
    },

    async dialogReassignTicketEmit(Toggle) {
      this.dialogReassignTicket = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },

    dialogDiscardEmit(Toggle) {
      this.dialogDiscard = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },

    dialogCloseEmit(Toggle) {
      this.closeDilaog = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },

    dialogDeactivateEmit(Toggle) {
      this.deactivateTicketDilaog = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },

    dialogChangeVisitDateTimeEmit(Toggle) {
      this.dialogChangeVisitDateTime = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },

    dialogAddRemarksEmit() {
      this.dialogAddRemarks = false;
    },

    dialogEditTicketEmit(Toggle) {
      this.dialogEditTicket = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },

    dialogProductFleetRequestEmit() {
      this.dialogProductFleetRequest = false;
    },
    dialogComponentsInformationEmit() {
      this.dialogComponentsInformation = false;
    },

    dialogReopenTicketEmit(Toggle) {
      this.dialogReopenTicket = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },

    dialogRepeatDialogEmit(Toggle) {
      this.dialogRepeatDialog = false;
      if (Toggle == 2) {
        this.callApiMethod();
      }
    },
  },
};
</script>
