<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <CreateMRFTicket
      v-if="current_view == 'CREATE_MRF_TICKET'"
      :StoreObj="StoreObj"
      @clicked="CreateMRFTicketEmit"
    />
    <MrfTicketDetails
      :StoreObj="StoreObj"
      :MrfTicketDetailsDialog="MrfTicketDetailsDialog"
      @clicked="MrfTicketDetailsDialogEmit"
    />
    <v-card elevation="0" v-if="current_view == 'LIST'">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Material Request Tickets</div>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          outlined
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          class="mt-7 ml-2 FontSize maxWidth"
        ></v-text-field>
        <v-btn
          small
          color="primary"
          @click="
            (current_view = 'CREATE_MRF_TICKET'),
              (StoreObj.action = 'CREATE_MRF_TICKET')
          "
          class="primary white--text mt-0 ml-2"
        >
          <v-icon small>mdi-plus</v-icon> Create
        </v-btn>
        <v-menu right bottom :close-on-content-click="CloseValue" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              v-on="on"
              v-bind="attrs"
              class="primary white--text ml-2"
            >
              <v-icon small>mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-card width="240px">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="from_date"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="from_date"
                  label="Start Date"
                  outlined
                  dense
                  class="mt-6 mx-6 FontSize"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="from_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(from_date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-menu
              ref="end_date_dialog"
              v-model="end_date_dialog"
              :close-on-content-click="false"
              :return-value.sync="to_date"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="to_date"
                  label="End Date"
                  outlined
                  dense
                  width="290px"
                  class="mx-6 FontSize"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                :min="from_date + 1"
                v-model="to_date"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="end_date_dialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.end_date_dialog.save(to_date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <!-- <v-autocomplete
              :items="categoryItems"
              dense
              outlined
              label="Category"
              v-model="category_id"
              class="FontSize mx-6 mb-n3"
              item-text="category_name"
              item-value="category_id"
            >
            </v-autocomplete>
            <v-autocomplete
              dense
              outlined
              label="Product"
              v-model="service_id"
              class="FontSize mx-6 mb-n3"
              :items="GetServiceByCategoriesList"
              item-text="service_name"
              item-value="service_id"
            ></v-autocomplete>
            <v-autocomplete
              dense
              outlined
              label="Service Type"
              v-model="service_type_id"
              class="FontSize mx-6 mb-n3"
              :items="GetAllServiceTypeByServiceIDList"
              item-value="service_type_id"
              item-text="service_type_name"
            ></v-autocomplete> 
            <v-autocomplete
              dense
              outlined
              label="Ticket Type"
              v-model="ticket_creation_type"
              :items="ticket_creation_type_items"
              class="FontSize mx-6"
            ></v-autocomplete> -->
            <div class="text-center">
              <v-btn
                color="primary"
                small
                class="mb-8 mt-n1"
                @click="SortByDateMethod"
              >
                <v-icon class="white--text" small>mdi-filter</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                small
                class="ml-2 mb-8 mt-n1"
                @click="ClearFilterMethod"
              >
                <v-icon class="white-text" small>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          fixed-header
          style="cursor: pointer"
          :search="search"
          :headers="headers"
          :height="TableHeight"
          @click:row="handleRowClick"
          :items="GetAllMrfTicketsList"
          :items-per-page="50"
          @page-count="pageCount = $event"
          :page.sync="page"
          hide-default-footer
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.ticket_id`]="{ item }">
            <div v-if="item.custom_ticket_id" class="FontSize">
              {{ item.custom_ticket_id }}
            </div>
            <div class="FontSize" v-else>
              {{
                `${item.ticket_id.split("-")[2]}-${
                  item.ticket_id.split("-")[3]
                }-${item.ticket_id.split("-")[4]}`
              }}
            </div>
            <div v-if="item.ticket_type" class="FontSize">
              {{ item.ticket_type.replaceAll("_", " ") }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.customer_company_name`]="{ item }">
            <div v-if="item.customer_company_name" class="FontSize">
              {{ item.customer_company_name }}
            </div>
            <div v-else>-</div>
            <div v-if="item.customer_name" class="FontSize">
              {{ item.customer_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.category_name`]="{ item }">
            <div v-if="item.category_name" class="FontSize">
              {{ item.category_name }}
            </div>
            <div v-else>-</div>
            <div v-if="item.service_name" class="FontSize">
              {{ item.service_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.ticket_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
            <div class="FontSize" v-if="item.service_type_name">
              {{ item.service_type_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.ticket_warranty_type`]="{ item }">
            <div v-if="item.ticket_warranty_type" class="FontSize">
              {{ item.ticket_warranty_type }}
            </div>
            <div v-else>-</div>
            <div v-if="item.support_type" class="FontSize">
              {{ item.support_type }}
            </div>
            <div v-else>-</div>
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
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import CreateMRFTicket from "@/components/MrfTickets/Cards/CreateMRFTicket.vue";
import MrfTicketDetails from "@/components/MrfTickets/Dialogs/MrfTicketDetails.vue";
import { GetAllMrfTickets } from "@/mixins/MRFTickets/GetAllMrfTickets.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllServiceTypeBasedOnServiceID } from "@/mixins/Tickets/GetAllListServiceTypeById.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  mixins: [
    GetAllMrfTickets,
    GetServicesByCategory,
    GetAllServiceTypeBasedOnServiceID,
    GetAllOrganizationSettingsTypesInMS,
  ],
  components: {
    Overlay,
    Snackbar,
    CreateMRFTicket,
    MrfTicketDetails,
  },
  data() {
    return {
      TableHeight: 0,
      page: 1,
      count: 0,
      pageCount: 1,
      menu: false,
      CloseValue: false,
      end_date_dialog: false,
      overlay: false,
      renderComp: true,
      MrfTicketDetailsDialog: false,
      search: "",
      next_token : "",
      noDataText: "",
      service_id: "",
      category_id: "",
      service_type_id: "",
      ticket_creation_type: "ALL",
      current_view: "LIST",
      categoryItems: [],
      GetAllMrfTicketsList: [],
      GetServiceByCategoriesList: [],
      ticket_creation_type_items: [
        { text: "ALL", value: "ALL" },
        { text: "BREAKDOWN", value: "BREAKDOWN" },
        { text: "INSTALLATION", value: "INSTALLATION" },
        { text: "SCHEDULE SERVICE", value: "SCHEDULE_SERVICE" },
        { text: "CORE SERVICE JOB", value: "CORE_SERVICE_JOB" },
        { text: "NON CORE SERVICE JOB", value: "NON_CORE_SERVICE_JOB" },
      ],
      from_date: new Date(new Date().getTime() - 60 * 86400000)
        .toISOString()
        .substr(0, 10),
      to_date: new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10),
      headers: [
        { text: "Ticket ID", value: "ticket_id" },
        { text: "Customer", value: "customer_company_name" },
        { text: "Product", value: "category_name" },
        { text: "Created On", value: "ticket_created_on" },
        { text: "Support", value: "ticket_warranty_type" },
      ],
      StoreObj: {},
      SnackBarComponent: {},
    };
  },
  watch: {
    category_id(val) {
      this.GetServicesByCategoriesMethod(val);
    },
    service_id(val) {
      this.GetAllServiceTypeByServiceIDMethod(val);
    },
    page() {
      if(this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllMrfTicketsMethod(
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399,
        this.service_id != undefined &&
          this.service_id != null &&
          this.service_id != ""
          ? this.service_id
          : undefined,
        this.service_type_id != undefined &&
          this.service_type_id != null &&
          this.service_type_id != ""
          ? this.service_type_id
          : undefined,
        this.ticket_creation_type != undefined &&
          this.ticket_creation_type != null &&
          this.ticket_creation_type != "" &&
          this.ticket_creation_type != "ALL"
          ? this.ticket_creation_type
          : undefined,
        this.next_token
      );
      }
    }
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllMrfTicketsMethod(
      Date.parse(this.from_date) / 1000,
      Date.parse(this.to_date) / 1000 + 86399,
      undefined,
      undefined,
      undefined,
      undefined
    );
    this.GetAllOrganizationSettingsTypesMethod();
  },
  methods: {
    SortByDateMethod() {
      this.CloseValue = true;
      this.GetAllMrfTicketsMethod(
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399,
        this.service_id != undefined &&
          this.service_id != null &&
          this.service_id != ""
          ? this.service_id
          : undefined,
        this.service_type_id != undefined &&
          this.service_type_id != null &&
          this.service_type_id != ""
          ? this.service_type_id
          : undefined,
        this.ticket_creation_type != undefined &&
          this.ticket_creation_type != null &&
          this.ticket_creation_type != "" &&
          this.ticket_creation_type != "ALL"
          ? this.ticket_creation_type
          : undefined,
        undefined
      );
      setTimeout(() => {
        this.CloseValue = false;
      }, 1000);
    },
    ClearFilterMethod() {
      this.CloseValue = true;
      (this.service_id = ""), (this.service_type_id = "");
      this.ticket_creation_type = "ALL";
      this.from_date = new Date(new Date().getTime() - 60 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.to_date = new Date(new Date().getTime() - 0 * 86400000)
        .toISOString()
        .substr(0, 10);
      this.GetAllMrfTicketsMethod(
        Date.parse(this.from_date) / 1000,
        Date.parse(this.to_date) / 1000 + 86399,
        undefined,
        undefined,
        undefined,
        undefined
      );
      setTimeout(() => {
        this.CloseValue = false;
      }, 1000);
    },
    CreateMRFTicketEmit(Toggle) {
      this.current_view = "LIST";
      if (Toggle == 2) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            timeout: 50,
            SnackbarText: "Materail Ticket Created Successfully..!",
            Top: true,
          };
          this.renderComp = true;
        });
        this.GetAllMrfTicketsMethod(
          Date.parse(this.from_date) / 1000,
          Date.parse(this.to_date) / 1000 + 86399,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    MrfTicketDetailsDialogEmit() {
      this.MrfTicketDetailsDialog = false;
    },
    handleRowClick(item) {
      this.StoreObj = item;
      this.MrfTicketDetailsDialog = true;
    },
  },
};
</script>
