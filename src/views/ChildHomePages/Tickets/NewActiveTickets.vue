<template>
  <div @click="openedMenu = undefined">
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
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
    <TicketAcceptOrReject
      :StoreObj="StoreObj"
      :dialogTicketAcceptOrReject="dialogTicketAcceptOrReject"
      @clicked="dialogTicketAcceptOrRejectEmit"
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
    <CloseTicket
      :StoreObj="StoreObj"
      :closeDilaog="closeDilaog"
      @clicked="dialogCloseEmit"
    />
    <ComponentsInformation
      :StoreObj="StoreObj"
      :dialogComponentsInformation="dialogComponentsInformation"
      @clicked="dialogComponentsInformationEmit"
    />
    <ProductFleetRequestDialog
      :StoreObj="StoreObj"
      :dialogProductFleetRequest="dialogProductFleetRequest"
      @clicked="dialogProductFleetRequestEmit"
    />
    <DeactivateTicket
      :StoreObj="StoreObj"
      :deactivateTicketDilaog="deactivateTicketDilaog"
      @clicked="dialogDeactivateEmit"
    />
    <CreateTicketCard
      v-if="current_view == 'CREATE'"
      :StoreObj="StoreObj"
      @clicked="CreateTicketCardEmit"
    />
    <TicketTabCard
      v-if="current_view == 'TABVIEW'"
      :StoreObj="StoreObj"
      @clicked="EmitTab"
    />
    <AddPaymentDetails
      :AddPaymentDetailsDialog="addPaymentDetailsDialog"
      :StoreObj="StoreObj"
      @clicked="AddPaymentDetailsDialogEmit"
    />
    <EditFOC
      :EditFOCDialog="editFOCDialog"
      :StoreObj="StoreObj"
      @clicked="EditFOCDialogEmit"
    />
    <EditPayout
      :EditPayoutDialog="editPayoutDialog"
      :StoreObj="StoreObj"
      @clicked="EditPayoutDialogEmit"
    />
    <CreateTicketDealer
      v-if="current_view === 'DEALER_TICKET_CREATE_PAGE'"
      :SerialNumberDataArray="serialNumberDataArray"
      :Obj="obj"
      @clicked="backToMainPageFrom"
    />
    <SearchSerialNumber
      :SearchSerialNumberDialog="searchSerialNumberDialog"
      @clicked="searchSerialNumberDialogEmit"
    />
    <Overlay :overlay="overlay" />
    <v-card class="elevation-0" flat v-if="current_view == 'LIST'">
      <div class="d-flex pa-5">
        <div class="mr-2" v-for="(ticketBtn, index) in ticketBtns" :key="index">
          <v-btn
            dense
            small
            class="text-capitalize mr-2"
            :color="$route.path === ticketBtn.path ? 'primary' : null"
            @click="$router.push(ticketBtn.path)"
            >{{ ticketBtn.name }}</v-btn
          >
        </div>
      </div>
      <v-row no-gutters>
        <v-toolbar dense class="elevation-0 mx-3">
          <div class="largeFontSizeNew">
            Active Tickets :
            <span v-if="isSearching == false">
              <span v-if="applied_filters == false">
                <span
                  v-if="
                    this.next_token == undefined &&
                    this.GetAllOpenTicketList != undefined
                  "
                >
                  {{ this.GetAllOpenTicketList.length }}
                </span>
                <span v-else>
                  {{ active_ticket_count }}
                </span>
              </span>
              <span v-if="applied_filters == true" class="FontSize"
                ><v-icon small color="green">mdi-filter</v-icon>Filters Applied
                <span class="ml-2"
                  ><v-btn
                    x-small
                    class="primary white--text"
                    @click="ClearFilterMethod()"
                    ><v-icon x-small>mdi-filter-off</v-icon>Clear</v-btn
                  ></span
                >
              </span>
            </span>
            <span v-else class="FontSize green--text">
              <v-icon small color="green">mdi-magnify</v-icon>
              Search Results
              <span
                ><v-btn
                  x-small
                  class="primary white--text"
                  @click="ClearMethod((isSearching = false))"
                  ><v-icon small>mdi-close</v-icon></v-btn
                ></span
              >
            </span>
          </div>
          <v-spacer></v-spacer>
          <v-select
            dense
            outlined
            label="Search By"
            v-model="SearchBy"
            :items="SearchByItems"
            class="FontSize mt-7 WidthVariation2 mr-2"
          >
          </v-select>
          <v-text-field
            dense
            outlined
            label="Search"
            v-model="search"
            class="FontSize mt-7 WidthVariation1 mr-2"
            :rules="[
              (v) => !!v || 'Required',
              (v) => (v && v.length >= 3) || 'Minimum 3 characters',
            ]"
          >
            <template v-slot:append>
              <v-btn
                :disabled="search.length <= 2"
                icon
                small
                color="primary"
                v-if="isSearching == false"
                @click="GetTicketsByFilterMethod((isSearching = true))"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="primary"
                v-if="isSearching == true"
                @click="ClearMethod((isSearching = false))"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <v-tooltip
            color="primary"
            bottom
            v-if="
              $store.getters.get_current_user_details.user_type !==
                'DEALER_OWNER' &&
              $store.getters.get_current_user_details.user_type !==
                'DEALER_AGENT'
            "
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-on="on"
                v-bind="attrs"
                color="primary"
                @click="$router.push('TicketReports')"
                class="primary white--text mt-0"
              >
                <v-icon>mdi-file-excel-outline</v-icon>
              </v-btn>
            </template>
            <span class="white--text">Download Tickets in Excel</span>
          </v-tooltip>
          <v-tooltip color="primary" bottom v-if="create_ticket_btn">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-on="on"
                v-bind="attrs"
                color="primary"
                @click="createTicketMethod()"
                class="primary white--text mt-0 ml-2"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </template>
            <span class="white--text">Create Ticket</span>
          </v-tooltip>
          <v-menu right bottom :close-on-content-click="CloseValue" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-on="on"
                v-bind="attrs"
                class="primary white--text ml-2"
              >
                <v-icon v-if="applied_filters == false" small
                  >mdi-filter</v-icon
                >
                <v-icon v-else-if="applied_filters == true" small
                  >mdi-filter-off</v-icon
                >
              </v-btn>
            </template>
            <v-card width="400px">
              <v-row>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-menu ref="menuStart" :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="startdate"
                        label="Starting date"
                        outlined
                        dense
                        class="FontSize pl-2 mt-5 ml-4"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="startdate" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menuStart = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menuStart.save(startdate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-menu
                    ref="menuEnd"
                    v-model="menuEnd"
                    :close-on-content-click="false"
                    :return-value.sync="enddate"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="enddate"
                        label="Ending date"
                        outlined
                        dense
                        width="290px"
                        class="FontSize mr-3 mt-5"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="enddate"
                      no-title
                      scrollable
                      :min="startdate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menuEnd = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menuEnd.save(enddate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-select
                    dense
                    outlined
                    class="FontSize ml-6"
                    label="Service Type"
                    item-text="service_type_name"
                    item-value="service_type_id"
                    :items="GetAllServiceTypeList"
                    v-model="selectServiceType"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-select
                    dense
                    outlined
                    class="FontSize mr-4"
                    label="Created By"
                    :items="created_by_items"
                    v-model="createdBy"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col cols="12" md="6" xs="12" sm="12">
                  <v-select
                    dense
                    outlined
                    class="FontSize ml-6"
                    label="User Type"
                    item-text="text"
                    item-value="value"
                    v-model="userType"
                    :items="
                      $store.getters.get_user_type == 'DEALER_OWNER' ||
                      $store.getters.get_user_type == 'DEALER_AGENT'
                        ? user_type_items_dealer
                        : this.$store.getters.get_user_type == 'SERVICE_PARTNER'
                        ? user_type_items_service_partner
                        : user_type_items_owner
                    "
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize mr-4"
                    :label="
                      userType == 'ENTERPRISE_REPRESENTATIVE'
                        ? 'Technician'
                        : userType == 'SERVICE_PARTNER'
                        ? 'Service Partners'
                        : 'Dealers'
                    "
                    item-text="user_name"
                    item-value="user_id"
                    :items="
                      this.userType == 'ENTERPRISE_REPRESENTATIVE'
                        ? GetAllServiceRepresentativeList
                        : this.userType == 'SERVICE_PARTNER'
                        ? GetAllPartnerAndPartnerUserList
                        : GetDealersList
                    "
                    v-model="selectTechnicianType"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row
                class="mt-n5"
                v-if="userType != 'ENTERPRISE_REPRESENTATIVE'"
              >
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-autocomplete
                    outlined
                    dense
                    class="FontSize ml-6"
                    :label="
                      userType == 'SERVICE_PARTNER'
                        ? 'Partner User Type'
                        : 'Dealer User Type'
                    "
                    v-model="dealerOrParterUsers"
                    :items="
                      userType == 'SERVICE_PARTNER' ? PartnerUsers : DealerUsers
                    "
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-autocomplete
                    outlined
                    dense
                    class="FontSize mr-4"
                    :label="
                      userType == 'SERVICE_PARTNER'
                        ? 'Partner Users'
                        : 'Dealer Users'
                    "
                    :items="
                      userType == 'SERVICE_PARTNER'
                        ? GetAllPartnerAndPartnerUserListForTicketFilter
                        : userType == 'DEALER_OWNER'
                        ? GetDealersListForTicketFilter
                        : []
                    "
                    item-text="user_name"
                    item-value="user_id"
                    v-model="dealerOrPartnerUserid"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize ml-6"
                    label="Product"
                    item-text="service_name"
                    item-value="service_id"
                    :items="GetAllServicesList"
                    v-model="selectProduct"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize mr-3"
                    label="Ticket Status"
                    v-model="ticket_status"
                    :items="ticketOpenstatusItems"
                    item-text="text"
                    item-value="value"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-select
                    dense
                    outlined
                    label="Ticket Type"
                    class="FontSize ml-6"
                    v-model="ticket_creation_type"
                    :items="ticket_create_type_items"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-autocomplete
                    dense
                    outlined
                    label="Support"
                    v-model="support"
                    class="FontSize mr-3"
                    :items="support_items"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" sm="12" xs="12">
                  <v-autocomplete
                    dense
                    outlined
                    label="WIP Sub Stage"
                    item-value="setting_id"
                    item-text="setting_name"
                    v-model="wip_sub_stage_id"
                    class="FontSize ml-6 mt-n6"
                    :items="GetAllWIPStateList"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <div class="text-center">
                <v-btn
                  small
                  class="mb-6"
                  color="primary"
                  @click="SortByDateMethod()"
                  ><v-icon class="white--text" small>mdi-filter</v-icon
                  >Filter</v-btn
                >
                <v-btn
                  small
                  color="primary"
                  class="mb-6 ml-2"
                  @click="ClearFilterMethod()"
                  ><v-icon class="white--text" small>mdi-close</v-icon
                  >Clear</v-btn
                >
              </div>
            </v-card>
          </v-menu>
        </v-toolbar>
      </v-row>
      <v-col cols="12" xs="12" sm="12" md="12">
        <v-card-text class="mt-n4" v-if="GetAllSearchedTickets.length === 0">
          <v-data-table
            dense
            fixed-header
            :page.sync="page"
            class="elevation-0"
            :items-per-page="50"
            :item-class="openedMenuRow"
            :height="TableHeight"
            style="cursor: pointer"
            :no-data-text="noDataText"
            @click:row="handleRowClick"
            :headers="openTicketHeaders"
            @page-count="pageCount = $event"
            :loading="loading_active_tickets"
            :items="GetAllOpenTicketList"
            :footer-props="{
              'disable-items-per-page': true,
            }"
          >
            <template
              v-for="(h, i) in openTicketHeaders"
              v-slot:[`header.${h.value}`]="{ header }"
            >
              <div :key="i">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ header.text }}</span>
                  </template>
                  <span>{{ header.tooltip_text }}</span>
                </v-tooltip>
              </div>
            </template>
            <template
              v-if="
                this.$store.getters.get_user_type != 'SERVICE_PARTNER' &&
                this.$store.getters.get_user_type != 'DEALER_OWNER'
              "
              v-slot:[`item.work_status`]="{ item }"
            >
              <div class="ml-n3" v-if="Current_Filter == 'WITHOUT_SEARCH'">
                {{ GetAllOpenTicketList.indexOf(item) + 1 }}
              </div>
              <div class="ml-n3" v-else-if="Current_Filter != 'WITHOUT_SEARCH'">
                {{ GetAllSearchedTickets.indexOf(item) + 1 }}
              </div>
              <div class="mx-n3">
                <v-tooltip color="primary" right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-on="on"
                      v-bind="attrs"
                      :class="
                        item.work_status == 'START'
                          ? 'yellow--text'
                          : item.work_status == 'END'
                          ? 'green--text'
                          : 'primary--text'
                      "
                      size="10"
                      >mdi-circle</v-icon
                    >
                  </template>
                  <span v-if="item.work_status == 'START'">Work Started</span>
                  <span v-else-if="item.work_status == 'END'"
                    >Work Completed</span
                  >
                  <span v-else>Work yet to be Start</span>
                </v-tooltip>
              </div>
              <div>
                <v-tooltip right color="primary">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      small
                      v-on="on"
                      class="ml-n4"
                      v-bind="attrs"
                      color="primary"
                      v-if="item.is_repeat_ticket == true"
                      >mdi-repeat</v-icon
                    >
                  </template>
                  <span>Repeated Ticket</span>
                </v-tooltip>
              </div>
              <v-tooltip right color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    v-on="on"
                    color="green"
                    class="ml-n4"
                    v-bind="attrs"
                    v-if="item.is_reopened_ticket == true"
                    >mdi-lock-open-variant-outline</v-icon
                  >
                </template>
                <span>Re-Opened Ticket</span>
              </v-tooltip>
            </template>
            <template v-else v-slot:[`item.work_status`]="{ item }">
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
              <div class="ml-n10">
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
              <div class="FontSize" v-else-if="item.ticket_status != undefined">
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
            <template
              v-slot:[`item.Actions`]="{ item, index }"
              v-if="
                this.$store.getters.get_user_type != 'SERVICE_PARTNER' &&
                this.$store.getters.get_user_type != 'DEALER_OWNER'
              "
            >
              <v-menu right bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="verticalIconClickedMethod(item, index)"
                  >
                    <v-icon color="primary">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense nav>
                  <v-list-item-group color="primary">
                    <v-list-item
                      @click.stop="checkItem(item, 'STATUS')"
                      v-show="showEditButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="blue">mdi-recycle</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Change Status</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="
                        item.ticket_status == 'ASSIGNED' ||
                        item.ticket_status == 'CLAIMED' ||
                        item.ticket_status == 'WORK_IN_PROGRESS' ||
                        item.ticket_status == 'OPEN' ||
                        item.ticket_status == 'SELF_ASSIGNED' ||
                        item.ticket_status == 'ASSIGNED_TICKET'
                      "
                      @click.stop="checkItem(item, 'REASSIGN')"
                      v-show="showEditButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="teal">mdi-refresh</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Reassign Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'DISCARD')"
                      v-show="showActivateDeactivateButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="red lighten-2"
                          >mdi-close-circle-outline</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Discard Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'CLOSE')"
                      v-show="showActivateDeactivateButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="red darken-2">mdi-close</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Close Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'DEACTIVATE')"
                      v-show="showActivateDeactivateButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="red darken-2"
                          >mdi-close-octagon</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Inactive Ticket</v-list-item-title>
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
                    <v-list-item
                      @click.stop="checkItem(item, 'CHANGE_VISIT_DATE_TIME')"
                      v-show="showEditButton"
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
                        $store.getters.get_user_type === 'OWNER' ||
                        $store.getters.get_user_type === 'ADMIN' ||
                        $store.getters.get_user_type === 'AGENT' ||
                        $store.getters.get_user_type === 'RSM'
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
                    <v-list-item
                      v-if="
                        (item.ticket_warranty_type === 'NO_WARRANTY' ||
                          item.ticket_warranty_type === 'EXTENDED_WARRANTY') &&
                        $store.getters.get_current_user_details
                          .organization_details
                          .enable_payment_details_for_tickets === true
                      "
                      @click.stop="checkItem(item, 'ADD_PAYMENT_INFO')"
                    >
                      <v-list-item-icon>
                        <v-icon small color="pink">mdi-cash</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title
                          >Add Payment Details</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click.stop="checkItem(item, 'EDIT_FOC')">
                      <v-list-item-icon>
                        <v-icon small color="orange"
                          >mdi-all-inclusive-box</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Edit FOC</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'EDIT_PAYOUT')"
                      v-if="
                        item.cost_configuration_id &&
                        ($store.getters.get_current_user_details.user_type ===
                          'ADMIN' ||
                          $store.getters.get_current_user_details.user_type ===
                            'OWNER')
                      "
                    >
                      <v-list-item-icon>
                        <v-icon small color="grey"
                          >mdi-all-inclusive-box</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Edit Payout</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </template>
            <template
              v-slot:[`item.Actions`]="{ item }"
              v-else-if="
                this.$store.getters.get_user_type == 'SERVICE_PARTNER' ||
                this.$store.getters.get_user_type == 'DEALER_OWNER'
              "
            >
              <div
                v-if="
                  item.is_service_partner_partially_open_ticket == true ||
                  item.is_dealer_owner_partially_open_ticket == true
                "
              >
                <v-btn @click.stop="checkItem(item, 'ACCEPT_OR_REJECT')" small
                  ><span class="green--text">Accept </span>/<span
                    class="red--text"
                    >Reject</span
                  ></v-btn
                >
              </div>
              <div v-else>
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
                      <v-list-item
                        v-if="
                          item.ticket_status == 'ASSIGNED' ||
                          item.ticket_status == 'CLAIMED' ||
                          item.ticket_status == 'WORK_IN_PROGRESS' ||
                          item.ticket_status == 'OPEN' ||
                          item.ticket_status == 'SELF_ASSIGNED'
                        "
                        @click.stop="checkItem(item, 'REASSIGN')"
                      >
                        <v-list-item-icon>
                          <v-icon small color="teal">mdi-refresh</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="ml-n5">
                          <v-list-item-title>Reassign Ticket</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click.stop="checkItem(item, 'DISCARD')">
                        <v-list-item-icon>
                          <v-icon small color="red lighten-2"
                            >mdi-close-circle-outline</v-icon
                          >
                        </v-list-item-icon>
                        <v-list-item-content class="ml-n5">
                          <v-list-item-title>Discard Ticket</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click.stop="checkItem(item, 'CLOSE')">
                        <v-list-item-icon>
                          <v-icon small color="red darken-2">mdi-close</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="ml-n5">
                          <v-list-item-title>Close Ticket</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click.stop="checkItem(item, 'DEACTIVATE')">
                        <v-list-item-icon>
                          <v-icon small color="red darken-2"
                            >mdi-close-octagon</v-icon
                          >
                        </v-list-item-icon>
                        <v-list-item-content class="ml-n5">
                          <v-list-item-title
                            >Deactivate Ticket</v-list-item-title
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
                        @click.stop="checkItem(item, 'CHANGE_VISIT_DATE_TIME')"
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
                      <v-list-item @click.stop="checkItem(item, 'EDIT_TICKET')">
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
            </template>
          </v-data-table>
          <v-pagination
            v-model="page"
            :length="pageCount"
            total-visible="4"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </v-card-text>
        <v-card-text v-else class="mt-n4">
          <v-data-table
            dense
            fixed-header
            :items-per-page="50"
            :item-class="openedMenuRow"
            :height="TableHeight"
            class="TableValFontsize"
            :headers="activeTicketHeader"
            :items="GetAllSearchedTickets"
            @click:row="handleRowClick"
          >
            <template v-slot:[`item.sl_no`]="{ item, index }">
              <div>
                {{ index + 1 }}
              </div>
            </template>
            <template v-slot:[`item.column_one`]="{ item }">
              <div>
                <div>
                  {{ item.b || item.a }}
                </div>
                <div>
                  {{ item.m.replace("_", " ") || "-" }}
                </div>
                <div>
                  {{ item.n || "-" }}
                </div>
              </div>
            </template>
            <template v-slot:[`item.column_two`]="{ item }">
              <div>
                <div>
                  {{ item.d || "-" }}
                </div>
                <div>
                  {{ item.e || "-" }}
                </div>
              </div>
            </template>
            <template v-slot:[`item.column_three`]="{ item }">
              <div>
                {{ new Date(item.c * 1000).toLocaleString("en-GB") || "-" }}
              </div>
            </template>
            <template v-slot:[`item.column_four`]="{ item }">
              <div>
                <div>
                  {{ item.k || "-" }}
                </div>
                <div>
                  {{ item.j || "-" }}
                </div>
                <div>
                  {{ item.l || "-" }}
                </div>
              </div>
            </template>
            <template v-slot:[`item.column_five`]="{ item }">
              <v-menu right bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="verticalIconClickedMethod(item, index)"
                  >
                    <v-icon color="primary">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense nav>
                  <v-list-item-group color="primary">
                    <v-list-item
                      @click.stop="checkItem(item, 'STATUS')"
                      v-show="showEditButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="blue">mdi-recycle</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Change Status</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="
                        item.g == 'ASSIGNED' ||
                        item.g == 'CLAIMED' ||
                        item.g == 'WORK_IN_PROGRESS' ||
                        item.g == 'OPEN' ||
                        item.g == 'SELF_ASSIGNED' ||
                        item.g == 'ASSIGNED_TICKET'
                      "
                      @click.stop="checkItem(item, 'REASSIGN')"
                      v-show="showEditButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="teal">mdi-refresh</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Reassign Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'DISCARD')"
                      v-show="showActivateDeactivateButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="red lighten-2"
                          >mdi-close-circle-outline</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Discard Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'CLOSE')"
                      v-show="showActivateDeactivateButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="red darken-2">mdi-close</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Close Ticket</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'DEACTIVATE')"
                      v-show="showActivateDeactivateButton"
                    >
                      <v-list-item-icon>
                        <v-icon small color="red darken-2"
                          >mdi-close-octagon</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Inactive Ticket</v-list-item-title>
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
                    <v-list-item
                      @click.stop="checkItem(item, 'CHANGE_VISIT_DATE_TIME')"
                      v-show="showEditButton"
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
                        $store.getters.get_user_type === 'OWNER' ||
                        $store.getters.get_user_type === 'ADMIN' ||
                        $store.getters.get_user_type === 'AGENT' ||
                        $store.getters.get_user_type === 'RSM'
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
                    <v-list-item
                      v-if="
                        (item.j === 'NO_WARRANTY' ||
                          item.j === 'EXTENDED_WARRANTY') &&
                        $store.getters.get_current_user_details
                          .organization_details
                          .enable_payment_details_for_tickets === true
                      "
                      @click.stop="checkItem(item, 'ADD_PAYMENT_INFO')"
                    >
                      <v-list-item-icon>
                        <v-icon small color="pink">mdi-cash</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title
                          >Add Payment Details</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click.stop="checkItem(item, 'EDIT_FOC')">
                      <v-list-item-icon>
                        <v-icon small color="orange"
                          >mdi-all-inclusive-box</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Edit FOC</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click.stop="checkItem(item, 'EDIT_PAYOUT')"
                      v-if="
                        item.o &&
                        ($store.getters.get_current_user_details.user_type ===
                          'ADMIN' ||
                          $store.getters.get_current_user_details.user_type ===
                            'OWNER')
                      "
                    >
                      <v-list-item-icon>
                        <v-icon small color="grey"
                          >mdi-all-inclusive-box</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="ml-n5">
                        <v-list-item-title>Edit Payout</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card-text>
      </v-col>
    </v-card>
  </div>
</template>
<script>
var xlsx = require("json-as-xlsx");
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
import { API, graphqlOperation } from "aws-amplify";
import { GenerateTicketPDF } from "@/graphql/mutations.js";
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GetAllOpenTicket } from "@/mixins/Tickets/GetAllOpenTicket.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import { GetAllWipState } from "@/mixins/MastersSetting/GetAllWipState.js";
import { GetAllTicketsBySearch } from "@/mixins/Tickets/GetTicketsBySearch.js";
import { GetAllDashboardData } from "@/mixins/Dashboard/GetAllDashboardData.js";
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
import { GetAllDealersForTicketFilter } from "@/mixins/Tickets/GetAllDealerUsersForTicketFilter.js";
import { GetAllPartnerUserForTicketFilter } from "@/mixins/Tickets/GetAllParterUsersForTicketFilter.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import EditTicket from "@/components/Tickets/Dialogs/EditTicket.vue";
import AddRemarks from "@/components/Tickets/Dialogs/AddRemarks.vue";
import CloseTicket from "@/components/Tickets/Dialogs/CloseTicket.vue";
import TicketTabCard from "@/components/Tickets/Cards/TicketTabCard.vue";
import CreateTicketCard from "@/components/Tickets/Cards/CreateTicketCard.vue";
import DeactivateTicket from "@/components/Tickets/Dialogs/DeactivateTicket.vue";
import ChangeVisitDateTime from "@/components/Tickets/Dialogs/ChangeVisitDateTime.vue";
import DiscardDialogTicket from "@/components/Tickets/Dialogs/DiscardDialogTicket.vue";
import ReassignTicketDialog from "@/components/Tickets/Dialogs/ReassignTicketDialog.vue";
import TicketAcceptOrReject from "@/components/Tickets/Dialogs/AcceptOrRejectTicket.vue";
import ComponentsInformation from "@/components/Tickets/Dialogs/ComponentsInformation.vue";
import ChangeTicketStatusDialog from "@/components/Tickets/Dialogs/ChangeTicketStatusDialog.vue";
import ProductFleetRequestDialog from "@/components/Tickets/Dialogs/ProductFleetRequestDialog.vue";
import AddPaymentDetails from "@/components/Tickets/Dialogs/AddPaymentInfoDialog.vue";
import EditFOC from "@/components/Tickets/Dialogs/EditFOCDialog.vue";
import EditPayout from "@/components/Tickets/Dialogs/EditPayout.vue";
import { getAllTicketUsingS3URL } from "@/mixins/Tickets/GetTicketFromS3Url.js";
import CreateTicketDealer from "@/components/Tickets/Cards/CreateTicketDealer.vue";
import SearchSerialNumber from "@/components/Tickets/Dialogs/SearchSerialNumber.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";

export default {
  mixins: [
    GetAllDealers,
    GetAllWipState,
    GetAllServices,
    GetAllOpenTicket,
    GetAllPartnerUser,
    GetAllServiceTypes,
    GetAllDashboardData,
    GetAllTicketsBySearch,
    GetAllServiceRepresentative,
    GetAllDealersForTicketFilter,
    GetAllPartnerUserForTicketFilter,
    getAllTicketUsingS3URL,
    GetTicketDetails,
  ],
  components: {
    Overlay,
    Snackbar,
    EditTicket,
    AddRemarks,
    CloseTicket,
    TicketTabCard,
    CreateTicketCard,
    DeactivateTicket,
    DiscardDialogTicket,
    ChangeVisitDateTime,
    TicketAcceptOrReject,
    ReassignTicketDialog,
    ComponentsInformation,
    ChangeTicketStatusDialog,
    ProductFleetRequestDialog,
    AddPaymentDetails,
    EditFOC,
    EditPayout,
    CreateTicketDealer,
    SearchSerialNumber,
  },
  data: () => ({
    ticketBtns: [
      {
        name: "Active",
        path: "/ActiveTickets",
      },
      {
        name: "Partially Closed",
        path: "/PartiallyClosedTickets",
      },
      {
        name: "Closed",
        path: "/ClosedTickets",
      },
      {
        name: "Inactive",
        path: "/InactiveTickets",
      },
    ],
    page: 1,
    count: 0,
    length: 0,
    pageCount: 1,
    TableHeight: 0,
    menu: false,
    overlay: false,
    menuEnd: false,
    renderComp: true,
    menuStart: false,
    CloseValue: false,
    closeDilaog: false,
    isSearching: false,
    dialogDiscard: false,
    showEditButton: false,
    applied_filters: false,
    showCreateButton: false,
    dialogAddRemarks: false,
    dialogEditTicket: false,
    create_ticket_btn: true,
    dialogReassignTicket: false,
    loading_active_tickets: false,
    deactivateTicketDilaog: false,
    dialogStopOrResetTicket: false,
    dialogChangeTicketStatus: false,
    dialogChangeVisitDateTime: false,
    dialogProductFleetRequest: false,
    dialogTicketAcceptOrReject: false,
    dialogComponentsInformation: false,
    showActivateDeactivateButton: false,
    addPaymentDetailsDialog: false,
    editPayoutDialog: false,
    search: "",
    pdf_url: "",
    enddate: "",
    startdate: "",
    support: "ALL",
    noDataText: "",
    createdBy: "ALL",
    support_type: "ALL",
    current_view: "LIST",
    ticket_status: "ALL",
    selectProduct: "ALL",
    SearchBy: "ticket_id",
    dealerOrParterUsers: "",
    wip_sub_stage_id: "ALL",
    selectServiceType: "ALL",
    active_ticket_count: "",
    selectTechnicianType: "ALL",
    ticket_creation_type: "ALL",
    dealerOrPartnerUserid: "ALL",
    Current_Filter: "WITHOUT_SEARCH",
    userType: "",
    component_list: [],
    GetDealersList: [],
    GetAllAMCTypeList: [],
    GetAllServicesList: [],
    GetAllWIPStateList: [],
    GetAllSearchedTickets: [],
    GetDealersListForTicketFilter: [],
    GetAllPartnerAndPartnerUserList: [],
    GetAllServiceRepresentativeList: [],
    GetAllPartnerAndPartnerUserListForTicketFilter: [],
    PartnerUsers: [
      { text: "Partner Technician", value: "PARTNER_REPRESENTATIVE" },
      { text: "Partner Service Co-Ordinator", value: "PARTNER_AGENT" },
    ],
    DealerUsers: [
      { text: "Dealer Technician", value: "DEALER_TECHNICIAN" },
      { text: "Dealer Service Co-Ordinator", value: "DEALER_AGENT" },
    ],
    created_by_items: [
      { text: "ALL", value: "ALL" },
      { text: "OWNER", value: "OWNER" },
      { text: "ADMIN", value: "ADMIN" },
      { text: "MANAGER", value: "MANAGER" },
      { text: "SERVICE CO-ORDINATOR", value: "AGENT" },
      { text: "TECHNICIAN", value: "REPRESENTATIVE" },
      { text: "SERVICE PARTNER", value: "SERVICE_PARTNER" },
      { text: "PARTNER SERVICE CO-ORDINATOR", value: "PARTNER_AGENT" },
      { text: "PARTNER REPRESENTATIVE", value: "PARTNER_REPRESENTATIVE" },
      { text: "DEALER OWNER", value: "DEALER_OWNER" },
      { text: "DEALER TECHNICIAN", value: "DEALER_TECHNICIAN" },
      { text: "DEALER SERVICE CO-ORDINATOR", value: "DEALER_AGENT" },
    ],
    user_type_items_owner: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
    user_type_items_dealer: [{ text: "Dealer", value: "DEALER_OWNER" }],
    user_type_items_service_partner: [
      { text: "Service Partner", value: "SERVICE_PARTNER" },
    ],
    SearchByItems: [
      {
        text: "Ticket ID",
        value: "ticket_id",
      },
      {
        text: "Customer",
        value: "customer_company_name",
      },
      {
        text: "Contact Person",
        value: "customer_name",
      },
      {
        text: "Customer ID",
        value: "customer_unique_id",
      },
      {
        text: "Phone Number",
        value: "customer_full_number",
      },
      {
        text: "Serial Number",
        value: "service_serial_number",
      },
    ],
    ticket_create_type_items: [
      { text: "ALL", value: "ALL" },
      { text: "Breakdown", value: "BREAKDOWN" },
      { text: "Installation", value: "INSTALLATION" },
      { text: "Schedule Service", value: "SCHEDULE_SERVICE" },
      { text: "Core Service Job", value: "CORE_SERVICE_JOB" },
      { text: "Non-Core Service Job", value: "NON_CORE_SERVICE_JOB" },
      { text: "Sundary Job", value: "SUNDARY_JOB" },
      { text: "Other", value: "OTHER" },
    ],
    support_items: [
      { text: "ALL", value: "ALL" },
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
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
    ticketOpenstatusItems: [
      { text: "ALL", value: "ALL" },
      { text: "OPEN", value: "OPEN" },
      { text: "CLAIMED", value: "CLAIMED" },
      { text: "ASSIGNED", value: "ASSIGNED" },
      { text: "WIP", value: "WORK_IN_PROGRESS" },
      { text: "SELF ASSIGNED", value: "SELF_ASSIGNED" },
    ],
    columnName: [
      {
        label: "Representative",
        value: "representative_name",
      },
      { label: "Ticket ID", value: "custom_ticket_id_or_ticket_id" },
      {
        label: "Customer Type",
        value: "customer_type",
      },
      { label: "Customer ID", value: "customer_unique_id" },
      {
        label: "Customer Name",
        value: "customer_company_name",
      },
      {
        label: "Contact Person Name",
        value: "customer_name",
      },
      {
        label: "Customer Category",
        value: "customer_category_name",
      },
      {
        label: "Customer Address",
        value: "ticket_address",
      },
      {
        label: "City",
        value: "ticket_city",
      },
      {
        label: "State",
        value: "ticket_state",
      },
      {
        label: "pincode",
        value: "ticket_pincode",
      },
      {
        label: "Additional Comments",
        value: "additional_comments",
      },
      {
        label: "Service Type",
        value: "service_type_name",
      },
      { label: "Problem Description", value: "service_ticket_description" },
      {
        label: "Ticket Type",
        value: "ticket_creation_type",
      },
      {
        label: "Service Partner Name",
        value: "reporting_manager_name",
      },
      {
        label: "Reporting Manager",
        value: "ticket_reporting_manager_name",
      },
      {
        label: "Created On",
        value: "new_ticket_created_on",
      },
      { label: "Product", value: "service_name" },
      {
        label: "Category",
        value: "category_name",
      },
      {
        label: "Ticket Territory",
        value: "territory_names",
      },
      {
        label: "Created By",
        value: "created_by",
      },
      {
        label: "Free Of Cost",
        value: "is_foc",
      },
      {
        label: "Customer Phone Number",
        value: "customer_phone_number",
      },
      {
        label: "Customer Mail ID",
        value: "customer_email_id",
      },
      {
        label: "Ticket Status",
        value: "ticket_status",
      },
      {
        label: "Ticket Priority",
        value: "ticket_priority",
      },
      { label: "Serial Number", value: "service_serial_number" },
      {
        label: "Support",
        value: "ticket_warranty_type",
      },
      {
        label: "Support Type",
        value: "support_type",
      },
      {
        label: "WIP Sub Stage",
        value: "wip_sub_stage_name",
      },
      {
        label: "Invoice Date",
        value: "ticket_warranty_details.ticket_invoice_date",
      },
      {
        label: "Invoice Number",
        value: "ticket_warranty_details.ticket_invoice_number",
      },
      {
        label: "Secondary Phone Number",
        value: "secondary_customer_contact",
      },
      {
        label: "Secondary Representative",
        value: "secondary_technician_name",
      },
      { label: "Components", value: "new_component_list" },
      {
        label: "Installation Date",
        value: "installation_date",
      },
      {
        label: "Preferred Visit Date",
        value: "prefered_visit_date",
      },
      {
        label: "Preferred Visit Time",
        value: "prefered_visit_time",
      },
      {
        label: "Customer Call Date",
        value: "customer_call_date",
      },
      {
        label: "Customer Call Time",
        value: "customer_call_time",
      },
      {
        label: "Ticket Source",
        value: "ticket_call_source",
      },
      {
        label: "Source Remarks",
        value: "source_remark",
      },
    ],
    activeTicketHeader: [
      {
        text: "Sl No",
        value: "sl_no",
      },
      {
        text: "Ticket ID",
        value: "column_one",
      },
      {
        text: "Customer",
        value: "column_two",
      },
      {
        text: "Created",
        value: "column_three",
      },
      {
        text: "Support",
        value: "column_four",
      },
      {
        text: "Actions",
        value: "column_five",
      },
    ],
    StoreObj: {},
    SnackBarComponent: {},
    editFOCDialog: false,
    openedMenu: undefined,
    openTicketsFuncParams: [],
    serialNumberDataArray: [],
    searchSerialNumberDialog: false,
    obj: {},
    s3data: [],
  }),
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },
    support(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    dealerOrParterUsers(val) {
      if (this.userType == "SERVICE_PARTNER") {
        this.GetAllPartnerAndPartnerUserListForTicketFilter = [];
        this.GetAllPartnerUserForTicketFilterMethod(
          val,
          "ACTIVE",
          this.selectTechnicianType
        );
      } else if (this.userType == "DEALER_OWNER") {
        this.GetDealersListForTicketFilter = [];
        this.GetDealersMethodForTicketFilter(
          val,
          "ACTIVE",
          this.selectTechnicianType,
          undefined
        );
      }
    },
    userType(val) {
      if (val == "ENTERPRISE_REPRESENTATIVE") {
        this.GetAllServiceRepresentativeMethod("ACTIVE");
      } else if (val == "SERVICE_PARTNER") {
        this.GetAllPartnerUserMethod("SERVICE_PARTNER", "ACTIVE", undefined);
      } else if (val == "DEALER_OWNER") {
        this.GetDealersMethod("DEALER_OWNER", "ACTIVE", undefined);
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          this.support == "ALL" ? undefined : this.support,
          this.support_type == "ALL" ? undefined : this.support_type,
          this.next_token,
          this.createdBy == "ALL" ? undefined : this.createdBy,
          this.wip_sub_stage_id == "ALL" ? undefined : this.wip_sub_stage_id,
          this.dealerOrPartnerUserid == "ALL" &&
            (this.userType == "SERVICE_PARTNER" ||
              this.userType == "DEALER_OWNER") &&
            this.selectTechnicianType != "ALL"
            ? this.userType
            : undefined
        );
      }
    },
  },
  async mounted() {
    this.s3data = await this.getAllTicketUsingS3URLMethod();
    setTimeout(() => {
      this.GetAllDashboardDataMethod();
    }, 500);
    this.accessToCreateTicket();
    this.GetAllWipStateMethod("ACTIVE");
    this.GetAccessModuleMethod();
    this.TableHeight = window.innerHeight - 280;
    this.GetAllServiceRepresentativeMethod("ACTIVE");
    this.startdate = new Date(new Date().getTime() - 365 * 86400000)
      .toISOString()
      .substr(0, 10);
    this.enddate = new Date(new Date().getTime() + 30 * 86400000)
      .toISOString()
      .substr(0, 10);
    this.GetAllOpenTicketMethod(
      this.ticket_status == "ALL" ? undefined : this.ticket_status,
      this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
      this.selectTechnicianType == "ALL"
        ? undefined
        : this.dealerOrPartnerUserid != "ALL" &&
          this.dealerOrPartnerUserid != "" &&
          this.dealerOrPartnerUserid != undefined
        ? this.dealerOrPartnerUserid
        : this.selectTechnicianType,
      this.startdate,
      this.enddate,
      this.selectProduct == "ALL" ? undefined : this.selectProduct,
      this.ticket_creation_type == "ALL"
        ? undefined
        : this.ticket_creation_type,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    this.GetAllServiceTypeMethod((this.user_status = "ACTIVE"));
    this.GetAllServicesMethod(this.service_enable_type, this.service_status);
    this.userType =
      this.$store.getters.get_user_type == "DEALER_OWNER"
        ? "DEALER_OWNER"
        : this.$store.getters.get_user_type == "SERVICE_PARTNER"
        ? "SERVICE_PARTNER"
        : "ENTERPRISE_REPRESENTATIVE";
    this.$store.getters.get_user_type == "DEALER_OWNER" ||
    this.$store.getters.get_user_type == "DEALER_AGENT"
      ? (this.userType = "DEALER_OWNER")
      : null;
  },
  methods: {
    createTicketMethod() {
      const userDetails = this.$store.getters.get_current_user_details;
      const isDealer =
        userDetails.user_type === "DEALER_OWNER" ||
        userDetails.user_type === "DEALER_AGENT";
      if (!isDealer) {
        this.current_view = "CREATE";
        this.StoreObj.action = "CREATE";
        return;
      }
      const ticketCreatedEnabled = userDetails.enable_ticket_creation;
      const isSerialBased = userDetails.is_serial_number_based_ticket_creation;
      if (ticketCreatedEnabled && isSerialBased) {
        this.searchSerialNumberDialog = true;
      } else {
        this.current_view = "CREATE";
        this.StoreObj.action = "CREATE";
      }
    },
    verticalIconClickedMethod(item, index) {
      this.openedMenu = item.ticket_id;
    },

    openedMenuRow(item) {
      if (this.openedMenu) {
        if (item.ticket_id === this.openedMenu) {
          // setTimeout(() => {
          // this.openedMenu = undefined;
          // }, 10000);
          return "purple lighten-3";
        }
      }
    },
    accessToCreateTicket() {
      if (
        this.$store.getters.get_user_type == "SERVICE_PARTNER" ||
        this.$store.getters.get_user_type == "DEALER_OWNER"
      ) {
        const userDetails = this.$store.getters.get_current_user_details;
        const ticketCreatedEnabled = userDetails.enable_ticket_creation;
        this.create_ticket_btn = ticketCreatedEnabled;
        // const serialBasedEnabled =
        //   userDetails.is_serial_number_based_ticket_creation;
        // this.create_ticket_btn =
        //   ticketCreatedEnabled !== false || serialBasedEnabled !== false;

        // this.$store.getters.get_current_user_details.enable_ticket_creation
        //   ? (this.create_ticket_btn = true)
        //   :this.$store.getters.get_current_user_details.enable_ticket_creation ?? (this.create_ticket_btn = false);
        // if (
        //   this.$store.getters.get_current_user_details.enable_ticket_creation !=
        //   undefined
        // ) {
        //   if (
        //     this.$store.getters.get_current_user_details
        //       .enable_ticket_creation == false
        //   ) {
        //     this.create_ticket_btn = false;
        //   } else {
        //     this.create_ticket_btn = true;
        //   }
        // } else {
        //   this.create_ticket_btn = true;
        // }
      }
      // if (this.$store.getters.get_user_type == "DEALER_OWNER") {
      //   if (
      //     this.$store.getters.get_current_user_details.organization_details
      //       .enable_dealer_ticket_creation != undefined
      //   ) {
      //     if (
      //       this.$store.getters.get_current_user_details.organization_details
      //         .enable_dealer_ticket_creation == false
      //     ) {
      //       this.create_ticket_btn = false;
      //     }
      //   }
      // }
    },
    GetTicketsByFilterMethod(isSearching = true) {
      if (this.search != "") {
        this.Current_Filter = "WITH_SEARCH";
        const SearchByFieldMap = {
          ticket_id: "a",
          customer_company_name: "e",
          customer_name: "d",
          customer_unique_id: "h",
          customer_full_number: "i",
          service_serial_number: "f",
        };
        const rawSearch = (this.search || "").toString();
        const searchTerms = rawSearch.toLowerCase().split(" ");
        this.GetAllSearchedTickets = this.s3data.filter((item) => {
          let fieldValue = item[SearchByFieldMap[this.SearchBy]];
          if (this.SearchBy === "ticket_id") {
            const aValue = (item["a"] || "").toString().toLowerCase();
            const matchesA = searchTerms.every((term) => aValue.includes(term));
            if (matchesA) return true;
            const bValue = (item["b"] || "").toString().toLowerCase();
            return searchTerms.every((term) => bValue.includes(term));
          }
          if (!fieldValue) return false;
          const fieldValueLower = fieldValue.toString().toLowerCase();
          return searchTerms.every((term) => fieldValueLower.includes(term));
        });
        console.log("SEARCHED_VAL", this.GetAllSearchedTickets);

        // this.GetAllTicketsBySearchMethod(
        //   this.search,
        //   this.SearchBy,
        //   undefined,
        //   undefined
        // );
      } else {
        this.renderComp = false;
        this.isSearching = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Type Something...",
          };
          this.renderComp = true;
        });
      }
    },
    ClearMethod() {
      this.Current_Filter = "WITHOUT_SEARCH";
      this.GetAllOpenTicketList = [];
      this.GetAllSearchedTickets = [];
      setTimeout(() => {
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }, 300);
      setTimeout(() => {
        this.GetAllDashboardDataMethod();
      }, 500);
      this.search = "";
    },
    GetAccessModuleMethod() {
      let ModuleDetails = this.$store.getters.get_access_module_details;
      if (
        this.$store.getters.get_user_type != "ADMIN" &&
        this.$store.getters.get_user_type != "OWNER" &&
        this.$store.getters.get_user_type != "DEALER_OWNER" &&
        this.$store.getters.get_current_user_details.organization_details
          .is_access_control_enable == true
      ) {
        ModuleDetails.map((item) => {
          if (item.module_name == "Tickets") {
            if (item.sub_modules[0].module_name == "Active Tickets") {
              item.sub_modules[0].module_rights.map((moduleRights) => {
                if (moduleRights.CREATE == true) {
                  this.showCreateButton = true;
                }
                if (moduleRights.EDIT == true) {
                  this.showEditButton = true;
                }
                if (moduleRights.DELETE == true) {
                  this.showActivateDeactivateButton = true;
                }
              });
            }
          }
        });
      } else {
        this.showCreateButton = true;
        this.showEditButton = true;
        this.showActivateDeactivateButton = true;
      }
    },
    CreateTicketCardEmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        setTimeout(() => {
          this.GetAllDashboardDataMethod();
        }, 500);
      }
    },
    EmitTab() {
      this.current_view = "LIST";
    },
    async handleRowClick(item) {
      if ("a" in item) {
        this.ticketDetails = await this.TicketDetailsListMethod(item.a);
        this.StoreObj = this.ticketDetails[0];
        console.log("THIS_STOREOBJ", this.StoreObj);
      } else {
        this.StoreObj = item;
      }
      this.current_view = "TABVIEW";
      this.StoreObj.action = "MOREACTION";
      this.count = 1;
    },
    async dialogReassignTicketEmit(Toggle) {
      this.dialogReassignTicket = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    dialogChangeTicketStatusEmit(Toggle) {
      this.dialogChangeTicketStatus = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
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
          this.pdf_url = ResultObject.pdf_url;
          window.open(this.pdf_url);
          this.dialogCreateServiceCenterEmit((this.Toggle = 2));
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
      }
    },
    dialogComponentsInformationEmit() {
      this.dialogComponentsInformation = false;
    },
    dialogProductFleetRequestEmit() {
      this.dialogProductFleetRequest = false;
    },
    dialogTicketAcceptOrRejectEmit(Toggle) {
      this.dialogTicketAcceptOrReject = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    dialogDiscardEmit(Toggle) {
      this.dialogDiscard = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    dialogAddRemarksEmit() {
      this.dialogAddRemarks = false;
    },
    dialogEditTicketEmit(Toggle) {
      this.dialogEditTicket = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    dialogChangeVisitDateTimeEmit(Toggle) {
      this.dialogChangeVisitDateTime = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    dialogCloseEmit(Toggle) {
      this.closeDilaog = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];

        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        setTimeout(() => {
          this.GetAllDashboardDataMethod();
        }, 500);
      }
    },
    dialogDeactivateEmit(Toggle) {
      this.deactivateTicketDilaog = false;
      if (Toggle == 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllSearchedTickets = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        setTimeout(() => {
          this.GetAllDashboardDataMethod();
        }, 500);
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
      } else if (action == "COMPONENTS") {
        this.dialogComponentsInformation = true;
      } else if (action == "DEACTIVATE") {
        this.deactivateTicketDilaog = true;
      } else if (action == "DOWNLOAD_PDF") {
        this.createDownloadPDF();
      } else if (action == "CHANGE_VISIT_DATE_TIME") {
        this.dialogChangeVisitDateTime = true;
      } else if (action == "ACCEPT_OR_REJECT") {
        this.dialogTicketAcceptOrReject = true;
      } else if (action == "REMARKS") {
        this.dialogAddRemarks = true;
      } else if (action == "PRODUCT_FLEET_REQUEST") {
        this.dialogProductFleetRequest = true;
      } else if (action == "EDIT_TICKET") {
        this.dialogEditTicket = true;
      } else if (action == "ADD_PAYMENT_INFO") {
        this.StoreObj.from = "ticket";
        this.addPaymentDetailsDialog = true;
      } else if (action === "EDIT_FOC") {
        this.editFOCDialog = true;
      } else if (action === "EDIT_PAYOUT") {
        this.editPayoutDialog = true;
      }
    },
    ClearFilterMethod() {
      this.GetAllOpenTicketList = [];
      this.GetAllSearchedTickets = [];
      this.CloseValue = true;
      this.applied_filters = false;
      this.startdate = new Date(new Date().getTime() - 90 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.enddate = new Date(new Date().getTime() + 30 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.ticket_status = "ALL";
      this.userType =
        this.$store.getters.get_user_type == "DEALER_OWNER"
          ? "DEALER_OWNER"
          : this.$store.getters.get_user_type == "SERVICE_PARTNER"
          ? "SERVICE_PARTNER"
          : "ENTERPRISE_REPRESENTATIVE";
      this.selectServiceType = "ALL";
      this.createdBy = "ALL";
      this.selectTechnicianType = "ALL";
      this.selectProduct = "ALL";
      this.ticket_creation_type = "ALL";
      this.wip_sub_stage_id = "ALL";
      this.support = "ALL";
      this.support_type = "ALL";
      this.dealerOrPartnerUserid = "ALL";
      this.GetAllOpenTicketMethod(
        undefined,
        undefined,
        undefined,
        this.startdate,
        this.enddate,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      ),
        setTimeout(() => {
          this.CloseValue = false;
        }, 1000);
      setTimeout(() => {
        this.GetAllDashboardDataMethod();
      }, 500);
    },
    SortByDateMethod() {
      this.CloseValue = true;
      this.applied_filters = true;
      this.GetAllOpenTicketList = [];
      this.GetAllOpenTicketMethod(
        this.ticket_status == "ALL" ? undefined : this.ticket_status,
        this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
        this.selectTechnicianType == "ALL"
          ? undefined
          : this.dealerOrPartnerUserid != "ALL" &&
            this.dealerOrPartnerUserid != "" &&
            this.dealerOrPartnerUserid != undefined
          ? this.dealerOrPartnerUserid
          : this.selectTechnicianType,
        this.startdate,
        this.enddate,
        this.selectProduct == "ALL" ? undefined : this.selectProduct,
        this.ticket_creation_type == "ALL"
          ? undefined
          : this.ticket_creation_type,
        this.support == "ALL" ? undefined : this.support,
        this.support_type == "ALL" ? undefined : this.support_type,
        undefined,
        this.createdBy == "ALL" ? undefined : this.createdBy,
        this.wip_sub_stage_id == "ALL" ? undefined : this.wip_sub_stage_id,
        this.dealerOrPartnerUserid == "ALL" &&
          (this.userType == "SERVICE_PARTNER" ||
            this.userType == "DEALER_OWNER") &&
          this.selectTechnicianType != "ALL"
          ? this.userType
          : undefined
      );
      setTimeout(() => {
        this.CloseValue = false;
      }, 1000);
      setTimeout(() => {
        this.GetAllDashboardDataMethod();
      }, 500);
    },
    exporttoexcel() {
      this.GetAllOpenTicketList.map((item) => {
        if (item.ticket_created_on != undefined) {
          item.new_ticket_created_on = new Date(
            item.ticket_created_on * 1000
          ).toLocaleString("en-GB");
        } else {
          return "";
        }
        if (item.custom_ticket_id != undefined) {
          item.custom_ticket_id_or_ticket_id = item.custom_ticket_id;
        } else {
          item.custom_ticket_id_or_ticket_id = item.ticket_id;
        }
        item.territory_names =
          item.territory_names != undefined
            ? item.territory_names.toString()
            : undefined;
        this.$forceUpdate();
        item.is_foc = item.is_free_of_cost == true ? "Yes" : "No";
      });
      let data = [
        {
          sheet: "Active Tickets",
          columns: this.columnName,
          content: this.GetAllOpenTicketList,
        },
      ];
      let settings = {
        fileName: "Active Tickets",
        extraLength: 3,
        writeOptions: {},
      };
      xlsx(data, settings);
    },

    async AddPaymentDetailsDialogEmit(Toggle) {
      this.addPaymentDetailsDialog = false;
      if (Toggle === 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },

    async EditFOCDialogEmit(Toggle) {
      this.editFOCDialog = false;
      if (Toggle === 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },

    async EditPayoutDialogEmit(Toggle) {
      this.editPayoutDialog = false;
      if (Toggle === 2) {
        this.GetAllOpenTicketList = [];
        this.GetAllOpenTicketMethod(
          this.ticket_status == "ALL" ? undefined : this.ticket_status,
          this.selectServiceType == "ALL" ? undefined : this.selectServiceType,
          this.selectTechnicianType == "ALL"
            ? undefined
            : this.dealerOrPartnerUserid != "ALL" &&
              this.dealerOrPartnerUserid != "" &&
              this.dealerOrPartnerUserid != undefined
            ? this.dealerOrPartnerUserid
            : this.selectTechnicianType,
          this.startdate,
          this.enddate,
          this.selectProduct == "ALL" ? undefined : this.selectProduct,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    searchSerialNumberDialogEmit(Toggle, data, existence) {
      this.searchSerialNumberDialog = false;
      if (Toggle === 2) {
        this.current_view = "DEALER_TICKET_CREATE_PAGE";
        this.serialNumberDataArray = data;
        this.obj.existence = existence;
      }
    },

    backToMainPageFrom(Toggle, sm) {
      this.current_view = "LIST";
      if (Toggle === 2) {
        this.CreateTicketCardEmit(2);
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            SnackbarText: sm,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>
