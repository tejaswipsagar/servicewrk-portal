<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
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
    <ComponentsInformation
      :StoreObj="StoreObj"
      :dialogComponentsInformation="dialogComponentsInformation"
      @clicked="dialogComponentsInformationEmit"
    />
    <OldSerialNumbersDialog
      :StoreObj="StoreObj"
      :oldSerialNumberDetailsDialog="oldSerialNumberDetailsDialog"
      @clicked="oldSerialNumberDetailsDialogEmit"
    />
    <TicketTabCard
      v-if="current_view == 'TABVIEW'"
      :StoreObj="StoreObj"
      @clicked="EmitTab"
    />
    <v-card class="elevation-0" v-if="current_view == 'LIST'">
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
      <v-toolbar dense class="elevation-0 mx-3">
        <div class="largeFontSizeNew" v-if="ticket_status == 'CLOSED'">
          Closed Tickets :
          <span v-if="isSearching == false">
            <span v-if="applied_filters == false">{{
              closed_ticket_count
            }}</span>
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
        <div
          class="largeFontSizeNew"
          v-else-if="ticket_status == 'DEACTIVATED'"
        >
          Inactive Tickets
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
        <!-- <v-select
          dense
          outlined
          item-text="text"
          item-value="value"
          label="Ticket Status"
          v-model="ticket_status"
          :items="ticketstatusItems"
          class="FontSize WidthVariation2 mt-7 ml-2"
        ></v-select> -->
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              color="primary"
              @click="$router.push('TicketReports')"
              class="white--text mt-1 ml-2"
            >
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Download Excel</span>
        </v-tooltip>
        <v-menu right bottom :close-on-content-click="CloseValue" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              class="primary white--text ml-2 mr-2 mt-1"
            >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-card width="400px">
            <v-row>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-menu
                  ref="menuStart"
                  v-model="menuStart"
                  transition="scale-transition"
                  :return-value.sync="startdate"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      v-on="on"
                      v-bind="attrs"
                      v-model="startdate"
                      label="Starting date"
                      class="FontSize px-3 mt-4"
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
              <v-col cols="12" md="6" xs="12" sm="12">
                <v-menu
                  ref="menuEnd"
                  v-model="menuEnd"
                  :close-on-content-click="false"
                  :return-value.sync="enddate"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      v-on="on"
                      v-bind="attrs"
                      v-model="enddate"
                      label="Ending date"
                      class="FontSize px-3 mt-4"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    scrollable
                    :min="startdate"
                    v-model="enddate"
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
              <v-col cols="12" md="6" xs="12" sm="12">
                <v-autocomplete
                  dense
                  outlined
                  label="Service Type"
                  class="FontSize mt-n4 mx-3"
                  v-model="selectServiceType"
                  item-text="service_type_name"
                  item-value="service_type_id"
                  :items="GetAllServiceTypeList"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" xs="12" sm="12">
                <v-autocomplete
                  dense
                  outlined
                  label="Closure Remarks"
                  item-text="setting_name"
                  v-model="closure_remarks"
                  item-value="setting_name"
                  class="FontSize mt-n4 mx-3"
                  :items="GetAllClosureRemarksList"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-select
                  dense
                  outlined
                  item-text="text"
                  label="User Type"
                  v-model="userType"
                  item-value="value"
                  :items="
                    $store.getters.get_user_type == 'DEALER_OWNER' ||
                    $store.getters.get_user_type == 'DEALER_AGENT'
                      ? user_type_items_dealer
                      : this.$store.getters.get_user_type == 'SERVICE_PARTNER'
                      ? user_type_items_service_partner
                      : user_type_items_owner
                  "
                  class="FontSize mx-3 mt-n4"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-autocomplete
                  dense
                  outlined
                  item-value="user_id"
                  item-text="user_name"
                  class="FontSize mx-3 mt-n4"
                  v-model="selectTechnicianType"
                  :label="
                    userType == 'ENTERPRISE_REPRESENTATIVE'
                      ? 'Technician'
                      : userType == 'SERVICE_PARTNER'
                      ? 'Service Partners'
                      : 'Dealers'
                  "
                  :items="
                    this.userType == 'ENTERPRISE_REPRESENTATIVE'
                      ? GetAllServiceRepresentativeList
                      : this.userType == 'SERVICE_PARTNER'
                      ? GetAllPartnerAndPartnerUserList
                      : GetDealersList
                  "
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="6"
                sm="12"
                xs="12"
                v-if="userType != 'ENTERPRISE_REPRESENTATIVE'"
              >
                <v-autocomplete
                  outlined
                  dense
                  class="FontSize mx-3 mt-n4"
                  v-model="dealerOrParterUsers"
                  :label="
                    userType == 'SERVICE_PARTNER'
                      ? 'Partner User Type'
                      : 'Dealer User Type'
                  "
                  :items="
                    userType == 'SERVICE_PARTNER' ? PartnerUsers : DealerUsers
                  "
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="6"
                sm="12"
                xs="12"
                v-if="userType != 'ENTERPRISE_REPRESENTATIVE'"
              >
                <v-autocomplete
                  outlined
                  dense
                  item-text="user_name"
                  item-value="user_id"
                  class="FontSize mt-n4 mx-3"
                  v-model="dealerOrPartnerUserid"
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
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-select
                  dense
                  outlined
                  label="Ticket Type"
                  class="FontSize mx-3 mt-n4"
                  v-model="ticket_creation_type"
                  :items="ticket_creation_type_items"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-select
                  dense
                  outlined
                  label="Created By"
                  v-model="createdBy"
                  :items="created_by_items"
                  class="FontSize mr-4 ml-2 mt-n4"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-autocomplete
                  dense
                  outlined
                  label="WIP Sub Stage"
                  item-value="setting_id"
                  item-text="setting_name"
                  v-model="wip_sub_stage_id"
                  class="FontSize mx-3 mt-n4"
                  :items="GetAllWIPStateList"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn
                small
                color="primary"
                class="mb-6 mx-2 px-2"
                @click="SortByDateMethod()"
                :close-on-content-click="false"
                ><v-icon class="white--text" small>mdi-filter</v-icon
                >Filter</v-btn
              >
              <v-btn
                small
                color="primary"
                class="mb-6 mx-2 px-2"
                @click="ClearFilterMethod()"
                :close-on-content-click="false"
              >
                <v-icon class="white--text" small>mdi-close</v-icon>Clear
              </v-btn>
            </div>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-col cols="12" xs="12" sm="12" md="12">
        <v-card-text v-if="GetAllSearchedTickets.length == 0" class="py-0">
          <v-data-table
            dense
            fixed-header
            ref="dataTable"
            :page.sync="page"
            :items-per-page="50"
            :height="TableHeight"
            :item-class="closedBy"
            style="cursor: pointer"
            class="elevation-0 pa-0"
            :no-data-text="noDataText"
            @click:row="handleRowClick"
            :headers="closedTicketHeaders"
            @page-count="pageCount = $event"
            :loading="loading_closed_tickets"
            :items="GetAllClosedTicketList"
            :footer-props="{
              'disable-items-per-page': true,
            }"
          >
            <template v-slot:footer.page-text>
              <div v-if="applied_filters == false && ticket_status == 'CLOSED'">
                {{ pageStart }}-{{ pageStop }} of
                {{ closed_ticket_count }}
              </div>
              <div v-else>
                {{ pageStart }}-{{ pageStop }} of
                {{ GetAllClosedTicketList.length }}
              </div>
            </template>
            <template
              v-for="(h, i) in closedTicketHeaders"
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
            <template v-slot:[`item.sl_no`]="{ item }">
              <div v-if="Current_Filter == 'WITHOUT_SEARCH'">
                {{ GetAllClosedTicketList.indexOf(item) + 1 }}
              </div>
              <div v-if="Current_Filter != 'WITHOUT_SEARCH'">
                {{ GetAllSearchedTickets.indexOf(item) + 1 }}
              </div>
            </template>
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
              <div class="FontSize" v-if="item.customer_unique_id != undefined">
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
                  <v-list-item
                    v-show="showCreateButton"
                    @click.stop="checkItem(item, 'REOPEN')"
                  >
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
                  <v-list-item
                    v-show="showCreateButton"
                    @click.stop="checkItem(item, 'REPEAT_TICKET')"
                  >
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
          <v-pagination
            v-model="page"
            :length="pageCount"
            total-visible="4"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </v-card-text>
        <v-card-text v-else class="py-0">
          <v-data-table
            dense
            fixed-header
            :items-per-page="50"
            :height="TableHeight"
            :item-class="closedBy"
            style="cursor: pointer"
            class="elevation-0 pa-0 TableValFontsize"
            :no-data-text="noDataText"
            @click:row="handleRowClick"
            :headers="closedTicketHeader"
            :items="GetAllSearchedTickets"
            :footer-props="{
              'disable-items-per-page': true,
            }"
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
              <v-menu right botton>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="primary">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense nav>
                  <v-list-item
                    v-show="showCreateButton"
                    @click.stop="checkItem(item, 'REOPEN')"
                  >
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
                  <v-list-item
                    v-show="showCreateButton"
                    @click.stop="checkItem(item, 'REPEAT_TICKET')"
                  >
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
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import TicketTabCard from "@/components/Tickets/Cards/TicketTabCard.vue";
import RepeatTicket from "@/components/Product/Dialogs/ProductsFleet/RepeatTicket.vue";
import ReopenTicketsDialog from "@/components/Tickets/Dialogs/ReopenTicketsDialog.vue";
import ComponentsInformation from "@/components/Tickets/Dialogs/ComponentsInformation.vue";
import OldSerialNumbersDialog from "@/components/Tickets/Dialogs/OldSerialNumbersDialog.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateTicketPDF } from "@/graphql/mutations.js";
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import { GetAllWipState } from "@/mixins/MastersSetting/GetAllWipState.js";
import { GetAllClosedTickets } from "@/mixins/Tickets/GetAllClosedTickets.js";
import { GetAllTicketsBySearch } from "@/mixins/Tickets/GetTicketsBySearch.js";
import { GetAllDashboardData } from "@/mixins/Dashboard/GetAllDashboardData.js";
import { GetAllServiceTypes } from "@/mixins/MastersSetting/GetAllServiceTypes.js";
import { GetAllClouserRemarks } from "@/mixins/MastersSetting/GetAllClouserRemarks.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
import { GetAllDealersForTicketFilter } from "@/mixins/Tickets/GetAllDealerUsersForTicketFilter.js";
import { GetAllPartnerUserForTicketFilter } from "@/mixins/Tickets/GetAllParterUsersForTicketFilter.js";
import { getAllTicketUsingS3URL } from "@/mixins/Tickets/GetTicketFromS3Url.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  components: {
    Overlay,
    Snackbar,
    RepeatTicket,
    TicketTabCard,
    ReopenTicketsDialog,
    ComponentsInformation,
    OldSerialNumbersDialog,
  },
  mixins: [
    GetAllDealers,
    GetAllWipState,
    GetAllPartnerUser,
    GetAllServiceTypes,
    GetAllDashboardData,
    GetAllClosedTickets,
    GetAllClouserRemarks,
    GetAllTicketsBySearch,
    GetAllServiceRepresentative,
    GetAllDealersForTicketFilter,
    GetAllPartnerUserForTicketFilter,
    getAllTicketUsingS3URL,
    GetTicketDetails,
  ],
  data: () => ({
    page: 1,
    count: 0,
    length: 0,
    pageCount: 1,
    TableHeight: 0,
    itemsPerPage: 50,
    search: "",
    noDataText: "",
    createdBy: "ALL",
    current_view: "LIST",
    SearchBy: "ticket_id",
    closure_remarks: "ALL",
    ticket_status: "CLOSED",
    wip_sub_stage_id: "ALL",
    closed_ticket_count: "",
    dealerOrParterUsers: "",
    selectServiceType: "ALL",
    selectTechnicianType: "ALL",
    ticket_creation_type: "ALL",
    dealerOrPartnerUserid: "ALL",
    Current_Filter: "WITHOUT_SEARCH",
    userType: "",
    menuEnd: false,
    overlay: false,
    menuStart: false,
    renderComp: true,
    CloseValue: false,
    isSearching: false,
    showEditButton: false,
    applied_filters: false,
    showCreateButton: false,
    dialogReopenTicket: false,
    dialogRepeatDialog: false,
    loading_closed_tickets: false,
    dialogComponentsInformation: false,
    oldSerialNumberDetailsDialog: false,
    showActivateDeactivateButton: false,
    GetAllWIPStateList: [],
    GetAllServiceTypeList: [],
    GetAllSearchedTickets: [],
    GetAllClosureRemarksList: [],
    GetDealersListForTicketFilter: [],
    GetAllServiceRepresentativeList: [],
    GetAllPartnerAndPartnerUserList: [],
    GetAllPartnerAndPartnerUserListForTicketFilter: [],
    user_type_items_owner: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
    user_type_items_dealer: [{ text: "Dealer", value: "DEALER_OWNER" }],
    user_type_items_service_partner: [
      { text: "Service Partner", value: "SERVICE_PARTNER" },
    ],
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
    ticketstatusItems: [
      { text: "CLOSED", value: "CLOSED" },
      { text: "INACTIVATED", value: "DEACTIVATED" },
    ],
    ticket_creation_type_items: [
      { text: "ALL", value: "ALL" },
      { text: "Breakdown", value: "BREAKDOWN" },
      { text: "Installation", value: "INSTALLATION" },
      { text: "Schedule Service", value: "SCHEDULE_SERVICE" },
      { text: "Core Service Job", value: "CORE_SERVICE_JOB" },
      { text: "Non-Core Service Job", value: "NON_CORE_SERVICE_JOB" },
      { text: "Sundary Job", value: "SUNDARY_JOB" },
      { text: "Other", value: "OTHER" },
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
      {
        label: "Customer ID",
        value: "customer_unique_id",
      },
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
        label: "Closure Remarks",
        value: "closure_remarks",
      },
      {
        label: "Created On",
        value: "new_ticket_created_on",
      },
      {
        label: "Closed On",
        value: "new_ticket_closed_on",
      },
      { label: "TAT(HH:MM)", value: "result" },
      {
        label: "Closed Location",
        value: "ticket_closed_location",
      },
      {
        label: "Training Provided To",
        value: "training_provided_to",
      },
      {
        label: "Closure Type",
        value: "closure_type",
      },
      { label: "Product", value: "service_name" },
      {
        label: "Category",
        value: "category_name",
      },
      {
        label: "Closed By",
        value: "closed_with",
      },
      {
        label: "Closure Comments",
        value: "comments",
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
        label: "Old Serial Number",
        value: "oldSerialNumber",
      },
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
        label: "Ticket Invoice Date",
        value: "ticket_warranty_details.ticket_invoice_date",
      },
      {
        label: "Ticket Invoice Number",
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
      {
        label: "Ticket Closed By Number",
        value: "ticket_closed_by_number",
      },
      {
        label: "Distance Tranvelled in KM's",
        value: "distance_travelled_in_km",
      },
      {
        label: "Distance Tranvelled in Meters",
        value: "distance_travelled_in_meters",
      },
      {
        label: "Time Taken",
        value: "hours_and_minuts",
      },
      {
        label: "Time Taken in Mins",
        value: "total_minutes",
      },
    ],
    closedTicketHeaders: [
      { text: "#", value: "sl_no", width: "4%", tooltip_text: "Serial Number" },
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
    startdate: new Date(new Date().getTime() - 365 * 86400000)
      .toISOString()
      .substr(0, 10),
    enddate: new Date(new Date().getTime() + 30 * 86400000)
      .toISOString()
      .substr(0, 10),
    StoreObj: {},
    SnackBarComponent: {},
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
    closedTicketHeader: [
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
    s3data: [],
  }),
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
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
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != "" &&
        this.page != 1
      ) {
        this.GetAllClosedTicketMethod(
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
          this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          this.next_token,
          this.createdBy == "ALL" ? undefined : this.createdBy,
          this.wip_sub_stage_id == "ALL" ? undefined : this.wip_sub_stage_id,
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
    ticket_status() {
      this.GetAllClosedTicketList = [];
      this.page = 1;
      this.GetAllClosedTicketMethod(
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
        this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
        this.ticket_creation_type == "ALL"
          ? undefined
          : this.ticket_creation_type,
        undefined,
        undefined,
        undefined,
        undefined
      );
      setTimeout(() => {
        this.GetAllDashboardDataMethod();
      }, 500);
    },
  },
  computed: {
    pageStart() {
      return (this.$refs.dataTable.page - 1) * this.itemsPerPage + 1;
    },
    pageStop() {
      return Math.min(
        this.pageStart + this.itemsPerPage - 1,
        this.closed_ticket_count
      );
    },
  },
  async mounted() {
    const s3data = await this.getAllTicketUsingS3URLMethod();
    this.s3data = s3data.filter((item) => item.g == "CLOSED");
    setTimeout(() => {
      this.GetAllDashboardDataMethod();
    }, 500);
    this.GetAllWipStateMethod("ACTIVE");
    this.GetAccessModuleMethod();
    this.TableHeight = window.innerHeight - 280;
    this.GetAllClosedTicketMethod(
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
      this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
      this.ticket_creation_type == "ALL"
        ? undefined
        : this.ticket_creation_type,
      undefined,
      undefined,
      undefined,
      undefined
    );
    this.GetAllClosureRemarksMethod("ACTIVE");
    this.GetAllServiceTypeMethod("ACTIVE");
    this.GetAllServiceRepresentativeMethod("ACTIVE");
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
    oldSerialNumberDetailsDialogEmit() {
      this.oldSerialNumberDetailsDialog = false;
    },
    dialogRepeatDialogEmit(Toggle) {
      this.dialogRepeatDialog = false;
      if (Toggle == 2) {
        this.GetAllClosedTicketList = [];
        this.GetAllClosedTicketMethod(
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
          this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    GetTicketsByFilterMethod(isSearching = true) {
      if (this.search != "") {
        this.Current_Filter = "WITH_SEARCH";
        this.GetAllClosedTicketList = [];
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
      this.GetAllClosedTicketList = [];
      this.GetAllSearchedTickets = [];
      setTimeout(() => {
        this.GetAllClosedTicketMethod(
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
          this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }, 300);
      this.search = "";
    },
    GetAccessModuleMethod() {
      console.log(
        "Module Details",
        this.$store.getters.get_access_module_details
      );
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
            if (item.sub_modules[1].module_name == "Closed Tickets") {
              item.sub_modules[1].module_rights.map((moduleRights) => {
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
    closedBy(item) {
      if (item.captured_otp != undefined && item.satisfied_otp != undefined) {
        if (item.captured_otp == item.satisfied_otp) {
          return "purple lighten-3";
        }
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
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.pdf_url = ResultObject.pdf_url;
          window.open(this.pdf_url);
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
      }
    },
    dialogComponentsInformationEmit() {
      this.dialogComponentsInformation = false;
    },
    dialogReopenTicketEmit(Toggle) {
      this.dialogReopenTicket = false;
      if (Toggle == 2) {
        this.GetAllClosedTicketList = [];
        this.GetAllSearchedTickets = [];
        this.GetAllClosedTicketMethod(
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
          this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
          this.ticket_creation_type == "ALL"
            ? undefined
            : this.ticket_creation_type,
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
      if (action == "REOPEN") {
        this.dialogReopenTicket = true;
      } else if (action == "COMPONENTS") {
        this.dialogComponentsInformation = true;
      } else if (action == "DOWNLOAD_PDF") {
        this.createDownloadPDF();
      } else if (action == "REPEAT_TICKET") {
        this.dialogRepeatDialog = true;
      } else if (action == "OLD_SERIAL_NUMBER_DETAILS") {
        this.oldSerialNumberDetailsDialog = true;
      }
    },
    EmitTab() {
      this.current_view = "LIST";
    },
    async handleRowClick(item) {
      if ("a" in item) {
        const ticketDetails = await this.TicketDetailsListMethod(item.a);
        this.StoreObj = ticketDetails[0];
        console.log("THIS_STOREOBJ", this.StoreObj);
      } else {
        this.StoreObj = item;
      }
      //   this.StoreObj = item;
      this.current_view = "TABVIEW";
      this.StoreObj.action = "MOREACTION";
      this.count = 1;
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
    ClearFilterMethod() {
      this.CloseValue = true;
      this.applied_filters = false;
      this.selectServiceType = "ALL";
      this.userType =
        this.$store.getters.get_user_type == "DEALER_OWNER"
          ? "DEALER_OWNER"
          : this.$store.getters.get_user_type == "SERVICE_PARTNER"
          ? "SERVICE_PARTNER"
          : "ENTERPRISE_REPRESENTATIVE";
      this.dealerOrPartnerUserid = "ALL";
      this.selectTechnicianType = "ALL";
      this.ticket_creation_type = "ALL";
      this.wip_sub_stage_id = "ALL";
      this.startdate = new Date(new Date().getTime() - 365 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.enddate = new Date(new Date().getTime() + 30 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.closure_remarks = "ALL";
      this.GetAllClosedTicketList = [];
      this.GetAllClosedTicketMethod(
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
        this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
        this.ticket_creation_type == "ALL"
          ? undefined
          : this.ticket_creation_type,
        undefined,
        undefined,
        undefined,
        undefined
      );
      setTimeout(() => {
        this.GetAllDashboardDataMethod();
      }, 500);
      setTimeout(() => {
        this.CloseValue = false;
      }, 1000);
    },
    SortByDateMethod() {
      this.GetAllClosedTicketList = [];
      this.CloseValue = true;
      this.applied_filters = true;
      this.GetAllClosedTicketMethod(
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
        this.closure_remarks == "ALL" ? undefined : this.closure_remarks,
        this.ticket_creation_type == "ALL"
          ? undefined
          : this.ticket_creation_type,
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
    },
    exporttoexcel() {
      this.GetAllClosedTicketList.map((item) => {
        item.result = this.GetTotalTime(
          item.assigned_or_closed_on - item.ticket_created_on,
          (item.territory_names =
            item.territory_names != undefined
              ? item.territory_names.toString()
              : undefined)
        );
        if (item.custom_ticket_id != undefined) {
          item.custom_ticket_id_or_ticket_id = item.custom_ticket_id;
        } else {
          item.custom_ticket_id_or_ticket_id = item.ticket_id;
        }
        if (item.old_serial_number_details != undefined) {
          item.oldSerialNumber = item.old_serial_number_details.serial_number;
        } else {
          item.oldSerialNumber = "";
        }
        if (item.ticket_created_on != undefined) {
          item.new_ticket_created_on = new Date(
            item.ticket_created_on * 1000
          ).toLocaleString("en-GB");
        } else {
          return "";
        }
        if (item.ticket_closed_time != undefined) {
          item.new_ticket_closed_on = new Date(
            item.ticket_closed_time * 1000
          ).toLocaleString("en-GB");
        } else {
          return "";
        }
        if (item.closed_otp_type == "PORTAL") {
          item.closed_with = "PORTAL";
        } else if (item.closed_otp_type.includes("HAPPY")) {
          item.closed_with = "CUSTOMER";
        } else if (item.closed_otp_type.includes("SERVICE")) {
          item.closed_with = "TECHNICIAN";
        }
        item.is_foc = item.is_free_of_cost == true ? "Yes" : "No";
        this.$forceUpdate();
      });
      let data = [
        {
          sheet: "Tickets",
          columns: this.columnName,
          content: this.GetAllClosedTicketList,
        },
      ];
      let settings = {
        fileName: "Closed Tickets",
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
  },
};
</script>
