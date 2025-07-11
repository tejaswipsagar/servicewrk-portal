<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <Overlay :overlay="overlay" />
    <ViewActiveTicketsBasedOnUsers
      :StoreObj="StoreObj"
      :dialogViewActiveTicketsBasedOnUser="dialogViewActiveTicketsBasedOnUser"
      @clicked="dialogViewActiveTicketsBasedOnUserEmit"
    />
    <v-card flat outlined height="450px">
      <v-row class="mt-4">
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-autocomplete
            dense
            outlined
            multiple
            :return-object="false"
            item-value="territory_id"
            class="FontSize ml-4 mr-2"
            label="Select territories"
            item-text="territory_name"
            :items="GetAllTerritoriesList"
            v-model="windowPage3.territory_id"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-autocomplete
            dense
            outlined
            label="User Type *"
            class="FontSize ml-2 mr-4"
            :no-data-text="noDataText"
            v-model="windowPage3.UserType"
            :rules="[(v) => !!v || 'Required']"
            :items="
              $store.getters.get_current_user_details.user_type ==
              'SERVICE_PARTNER'
                ? UserListPartner
                : $store.getters.get_current_user_details.user_type ==
                  'DEALER_OWNER'
                ? UserListDealer
                : UserList
            "
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="mt-n4">
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-row>
            <v-col cols="12" sm="12" md="11" xs="12">
              <v-autocomplete
                dense
                outlined
                return-object
                item-value="user_id"
                item-text="user_name"
                class="FontSize ml-4 mr-2"
                :rules="[(v) => !!v || 'Required']"
                v-model="windowPage3.select_representative"
                :label="
                  windowPage3.UserType == 'SERVICE_PARTNER'
                    ? 'Select Primary Service Partner *'
                    : windowPage3.UserType == 'DEALER_OWNER'
                    ? 'Select Primary Dealer *'
                    : 'Select Primary Representative *'
                "
                :items="
                  windowPage3.UserType == 'ENTERPRISE_REPRESENTATIVE'
                    ? GetAllUsrTypeLocationBasedUsers
                    : GetAllUsrTypeLocationBasedUsersForPartnersAndDealers
                "
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="1"
              xs="12"
              v-if="windowPage3.select_representative != ''"
            >
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    small
                    v-on="on"
                    class="ml-n5"
                    v-bind="attrs"
                    @click="checkItem()"
                  >
                    <v-icon color="primary">mdi-ticket</v-icon>
                  </v-btn>
                </template>
                <span>View Active Tickets</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-autocomplete
            dense
            outlined
            item-value="user_id"
            item-text="user_name"
            class="FontSize ml-2 mr-4"
            :items="secondaryRepresentativeItem"
            v-model="windowPage3.select_representative1"
            return-object
            :label="
              windowPage3.UserType == 'SERVICE_PARTNER'
                ? 'Select Secondary Service Partner '
                : windowPage3.UserType == 'DEALER_OWNER'
                ? 'Select Secondary Dealer'
                : 'Select Secondary Representative'
            "
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="mt-n4">
        <v-col cols="12" sm="12" md="4" xs="12">
          <v-autocomplete
            dense
            outlined
            label="Ticket Priority"
            class="FontSize ml-4 mr-2"
            :items="ticket_priority_items"
            v-model="windowPage3.ticket_priority"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" xs="12">
          <v-menu
            offset-y
            ref="menu"
            v-model="menu"
            :nudge-right="40"
            min-width="290px"
            transition="scale-transition"
            :close-on-content-click="false"
            :return-value.sync="windowPage3.date"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                dense
                outlined
                readonly
                v-on="on"
                persistent-hint
                color="primary"
                class="FontSize ml-2 mr-2"
                v-model="windowPage3.date"
                prepend-inner-icon="event"
                label="Preferred Visit Date*"
                :rules="[(v) => !!v || 'Required']"
              ></v-text-field>
            </template>
            <v-date-picker v-model="windowPage3.date" no-title scrollable>
              <v-btn text flat color="primary" @click="menu = false"
                >Cancel</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                flat
                text
                color="primary"
                @click="$refs.menu.save(windowPage3.date)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="12" md="4" xs="12">
          <v-dialog
            persistent
            ref="dialog"
            width="290px"
            v-model="modal2"
            :return-value.sync="windowPage3.time"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                readonly
                v-on="on"
                outlined
                v-bind="attrs"
                class="FontSize ml-2 mr-4"
                v-model="windowPage3.time"
                label="Preferred Visit Time *"
                prepend-inner-icon="access_time"
                :rules="[(v) => !!v || 'Required']"
              ></v-text-field>
            </template>
            <v-time-picker v-if="modal2" v-model="windowPage3.time">
              <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(windowPage3.time)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="12" md="3" xs="12">
          <v-menu
            offset-y
            :nudge-right="40"
            min-width="290px"
            ref="customer_call_date"
            v-model="customer_call_date"
            transition="scale-transition"
            :close-on-content-click="false"
            :return-value.sync="windowPage3.customer_call_date"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                dense
                outlined
                v-on="on"
                persistent-hint
                color="primary"
                label="Call Received Date"
                prepend-inner-icon="event"
                class="FontSize ml-4 mr-2"
                v-model="windowPage3.customer_call_date"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="windowPage3.customer_call_date"
              no-title
              scrollable
            >
              <v-btn
                flat
                text
                color="primary"
                @click="customer_call_date = false"
                >Cancel</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                flat
                text
                color="primary"
                @click="
                  $refs.customer_call_date.save(windowPage3.customer_call_date)
                "
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="12" md="3" xs="12">
          <v-dialog
            ref="customer_call_time"
            v-model="customer_call_time"
            :return-value.sync="windowPage3.customer_call_time"
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                v-on="on"
                outlined
                v-bind="attrs"
                class="FontSize ml-2 mr-4"
                label="Call Received Time"
                prepend-inner-icon="access_time"
                v-model="windowPage3.customer_call_time"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="customer_call_time"
              v-model="windowPage3.customer_call_time"
            >
              <v-btn text color="primary" @click="customer_call_time = false"
                >Cancel</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="
                  $refs.customer_call_time.save(windowPage3.customer_call_time)
                "
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="3" sm="12" xs="12">
          <v-autocomplete
            dense
            outlined
            class="FontSize"
            label="Ticket Source"
            :items="call_source_items"
            v-model="windowPage3.ticket_call_source"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="12" xs="12">
          <v-text-field
            dense
            outlined
            label="Remarks"
            class="FontSize mr-4"
            v-model="windowPage3.source_remark"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" xs="12" md="3">
          <v-autocomplete
            v-model="windowPage3.Pincode_Type"
            :items="
              overAllTerritoryDetails === false
                ? filteredTerritories
                : GetAllTerritoriesListArray
            "
            dense
            label="Territory Name"
            :item-text="
              overAllTerritoryDetails === false
                ? 'pincode_type_name'
                : 'pincode_territory_type'
            "
            :item-value="
              overAllTerritoryDetails === false
                ? 'pincode_type_id'
                : 'pincode_id'
            "
            outlined
            class="FontSize ml-4"
            return-object
          >
          </v-autocomplete>
        </v-col>

        <v-col cols="12" sm="12" xs="12" md="2">
          <v-select
            v-if="windowPage3.Pincode_Type !== ''"
            v-model="selection"
            :items="options"
            label="Select Option"
            dense
            outlined
            class="FontSize"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="12" xs="12" md="3" v-if="selection === 'Hours'">
          <v-select
            dense
            outlined
            label="Hours"
            v-model="windowPage3.Estimated_Time"
            :items="TimeArray"
            class="FontSize"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="12" xs="12" md="3" v-if="selection === 'Days'">
          <v-menu
            v-model="Date_menu"
            :close-on-content-click="false"
            nudge-width="150"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formattedDay"
                label="Select Day"
                readonly
                dense
                outlined
                v-bind="attrs"
                v-on="on"
                class="FontSize"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :picker-date="baseDate"
              :min="startDate"
              :max="endDate"
              show-current="false"
              no-title
              scrollable
              @input="updateFormattedDay"
              class="Date_Custom mt-3 FontSize"
              width="350"
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                class="mt-n8"
                @click="Date_menu = false"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewActiveTicketsBasedOnUsers from "@/components/Tickets/Dialogs/ViewActiveTicketsBasedOnUsers.vue";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { ListAllUserTypeLocationBasedUsers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsers.js";
import { ListAllUserTypeLocationBasedUsersForPartnersAndDealers } from "@/mixins/Tickets/ListAllUserTypeLocationBasedUsersForPartnersAndDealers.js";
import { ListPincodeTypesMixins } from "@/mixins/MastersSetting/ListPincodesTerritory.js";
import { setTimeout } from "core-js";
export default {
  props: {
    StoredObject: Object,
    currentWindow: Number,
  },
  components: {
    Overlay,
    Snackbar,
    ViewActiveTicketsBasedOnUsers,
  },
  mixins: [
    GetAllTerritories,
    ListAllUserTypeLocationBasedUsers,
    ListAllUserTypeLocationBasedUsersForPartnersAndDealers,
    ListPincodeTypesMixins,
  ],
  data: () => ({
    UserType: "",
    menu: false,
    modal2: false,
    overlay: false,
    renderComp: true,
    customer_call_time: false,
    customer_call_date: false,
    dialogViewActiveTicketsBasedOnUser: false,
    nongeo_territory_ids: [],
    secondaryRepresentativeItem: [],
    GetAllUsrTypeLocationBasedUsers: [],
    ticket_priority_items: ["High", "Medium", "Low"],
    GetAllUsrTypeLocationBasedUsersForPartnersAndDealers: [],
    UserListPartner: [{ text: "Service Partner", value: "SERVICE_PARTNER" }],
    UserListDealer: [
      { text: "Service Dealer", value: "DEALER_OWNER" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
    ],
    UserList: [
      { text: "Enterprise Representative", value: "ENTERPRISE_REPRESENTATIVE" },
      { text: "Service Partner", value: "SERVICE_PARTNER" },
      { text: "Dealer", value: "DEALER_OWNER" },
    ],
    call_source_items: [
      { text: "Call", value: "call" },
      { text: "Email", value: "email" },
      { text: "WhatsApp", value: "whatsapp" },
      { text: "Auto Generated", value: "auto_generated" },
      { text: "Forms", value: "forms" },
      { text: "Customer Initiated", value: "Customer Initiated" },
      {
        text: "Organisation Initiated",
        value: "Organisation Initiated",
      },
    ],
    overAllTerritoryDetails: null,
    StoreObj: {},
    SnackBarComponent: {},
    windowPage3: {
      time: null,
      customer_call_time: null,
      territory_id: [],
      UserType: "",
      source_remark: "",
      ticket_priority: "",
      customer_call_date: "",
      select_representative: "",
      select_representative1: "",
      ticket_call_source: "call",
      date: new Date().toISOString().substr(0, 10),
      Pincode_Type: "",
      Estimated_Time: "",
      pincode_type_id: "",
    },
    Territory_Type: "",
    Territory_Name: "",
    options: ["Hours", "Days"],
    selection: "",
    Date_menu: false,
    time: null,
    formattedTime: "",
    date: null,
    formattedDay: "",
    baseDate: "2025-01-01",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    TerritoryLoading: false,
    Pincodes_Items: [],
    Time_Values: "",
    filteredTerritories: [],
  }),
  computed: {
    TimeArray() {
      let Time_Value = [];
      for (let i = 1; i <= 24; i++) {
        if (i === 1) {
          Time_Value.push(`${i} hr`);
        } else {
          Time_Value.push(`${i} hrs`);
        }
      }
      return Time_Value;
    },
  },
  watch: {
    "windowPage3.UserType"(val) {
      this.secondaryRepresentativeItem = [];
      this.GetAllUsrTypeLocationBasedUsers = [];
      this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers = [];
      if (val == "ENTERPRISE_REPRESENTATIVE") {
        this.GetAllUerTypeLocationBasedUsers(
          this.StoredObject.latitude,
          this.StoredObject.longitude,
          this.StoredObject.service_id,
          this.$store.getters.get_current_user_details.user_id,
          val,
          this.windowPage3.territory_id
        );
      } else {
        this.GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
          this.StoredObject.latitude,
          this.StoredObject.longitude,
          this.StoredObject.service_id,
          this.$store.getters.get_current_user_details.user_id,
          val,
          this.windowPage3.territory_id != undefined &&
            this.windowPage3.territory_id != [] &&
            this.windowPage3.territory_id.length != 0 &&
            this.StoredObject.is_tag_territory == false
            ? this.windowPage3.territory_id
            : undefined,
          this.StoredObject.ticket_pincode != undefined &&
            this.StoredObject.ticket_pincode != ""
            ? this.StoredObject.ticket_pincode
            : undefined,
          undefined
        );
      }
    },

    async "windowPage3.territory_id"(val) {
      this.callTerritoryNameMethod(val);
      if (val.length === 0) {
        console.log("AYYAA");
        await this.callClassNameForNoTerrSelMethod();
        // this.windowPage3.Pincode_Type = [];
        // await this.ListPincodeTypes();
        // this.filteredTerritories = this.GetAllTerritoriesListArray.map(
        //   (item) => ({
        //     estimated_time: item.estimated_time,
        //     pincode_type_id: item.pincode_id,
        //     pincode_type_name: item.pincode_territory_type,
        //   })
        // );
      }
      if (this.filteredTerritories.length === 1) {
        this.windowPage3.Pincode_Type = this.filteredTerritories[0];
      }
    },

    "windowPage3.Pincode_Type"(val) {
      if (!val?.estimated_time) {
        this.selection = "";
        this.windowPage3.Estimated_Time = "";
        this.formattedDay = "";
        return;
      }
      const timeParts = val.estimated_time.split(" ");
      const unit = timeParts[1] ?? "";
      const value = timeParts[0] ?? "";
      if (["Hours", "Hour", "hrs", "hr"].includes(unit)) {
        this.selection = "Hours";
        this.windowPage3.Estimated_Time = `${value} ${
          value === "1" ? "hr" : "hrs"
        }`;
      } else if (["Days", "Day"].includes(unit)) {
        this.selection = "Days";
        this.formattedDay = `${value} Days`;
      } else {
        this.selection = "";
        this.windowPage3.Estimated_Time = "";
        this.formattedDay = "";
      }
    },

    "windowPage3.select_representative"(val) {
      this.secondaryRepresentativeItem = [];
      if (this.windowPage3.UserType == "ENTERPRISE_REPRESENTATIVE") {
        if (val != "" && val != undefined && val != null) {
          if (
            this.GetAllUsrTypeLocationBasedUsers != undefined &&
            this.GetAllUsrTypeLocationBasedUsers.length != 0
          ) {
            setTimeout(() => {
              this.GetAllUsrTypeLocationBasedUsers.map((item) => {
                if (item.user_id != val.user_id) {
                  this.secondaryRepresentativeItem.push(item);
                }
              });
            }, 500);
          }
        }
      } else {
        this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers.map(
          (item) => {
            if (item.user_id != val.user_id) {
              this.secondaryRepresentativeItem.push(item);
            }
          }
        );
      }
    },
    currentWindow(val) {
      if (val === 4) {
        this.windowpage3Object(2, this.windowPage3);
      }
    },
  },
  async mounted() {
    await this.GetAllTerritoriesMethod(
      "ACTIVE",
      "NON_GEO_BASED",
      this.StoredObject.ticket_pincode != undefined &&
        this.StoredObject.ticket_pincode != null &&
        this.StoredObject.ticket_pincode != ""
        ? this.StoredObject.ticket_pincode
        : undefined,
      "TERRITORY_BY_PINCODE",
      undefined
    );
    //   this.windowPage3.territory_id =
    // this.StoredObject.territory_ids != []
    //   ? this.StoredObject.territory_ids
    //   : this.GetAllTerritoriesList;
    if (this.StoredObject.territory_ids?.length) {
      console.log("ONE");
      this.windowPage3.territory_id = this.StoredObject.territory_ids;
    } else {
      console.log("TWO");
      if (this.GetAllTerritoriesList.length === 1) {
        this.windowPage3.territory_id.push(
          this.GetAllTerritoriesList[0].territory_id
        );
      } else {
        this.windowPage3.territory_id = [];
        setTimeout(async () => {
          await this.callClassNameForNoTerrSelMethod();
        }, 3000);
      }
      // this.GetAllTerritoriesList.length === 1
      //   ? this.windowPage3.territory_id.push(
      //       this.GetAllTerritoriesList[0].territory_id
      //     )
      //   : (this.windowPage3.territory_id = []),
      //   setTimeout(async () => {
      //     await this.callClassNameForNoTerrSelMethod();
      //   }, 3000);
    }
    setTimeout(async () => {
      if (this.overAllTerritoryDetails === true) {
        await this.ListPincodeTypes();
      } else {
        this.callTerritoryNameMethod(this.windowPage3.territory_id);
        this.windowPage3.Pincode_Type = this.filteredTerritories[0];
      }
    }, 2000);
    this.windowPage3.select_representative =
      this.StoredObject.primary_tech_id != undefined
        ? this.StoredObject.primary_tech_id
        : undefined;
    this.GetAllUerTypeLocationBasedUsers(
      this.StoredObject.latitude,
      this.StoredObject.longitude,
      this.StoredObject.service_id,
      this.$store.getters.get_current_user_details.user_id,
      "ENTERPRISE_REPRESENTATIVE",
      this.windowPage3.territory_id
    );
    this.windowPage3.UserType =
      this.$store.getters.get_current_user_details.user_type ==
      "SERVICE_PARTNER"
        ? "SERVICE_PARTNER"
        : this.$store.getters.get_current_user_details.user_type ==
          "DEALER_OWNER"
        ? "DEALER_OWNER"
        : "ENTERPRISE_REPRESENTATIVE";
  },
  methods: {
    async callTerritoryNameMethod(val) {
      if (Array.isArray(val) && val.length) {
        this.filteredTerritories = [];
        const matchedItems = this.GetAllTerritoriesList.filter((item) =>
          val.includes(item.territory_id)
        )
          .map((foundItem) => {
            if (
              foundItem.estimated_time !== undefined &&
              foundItem.pincode_type_id !== undefined &&
              foundItem.pincode_type_name !== undefined
            ) {
              return {
                estimated_time: foundItem.estimated_time,
                pincode_type_id: foundItem.pincode_type_id,
                pincode_type_name: foundItem.pincode_type_name,
              };
            }
            return null;
          })
          .filter(Boolean);
        this.filteredTerritories = matchedItems;

        if (
          this.filteredTerritories.length === 0 &&
          val.length === this.GetAllTerritoriesList.length
        ) {
          await this.ListPincodeTypes();
          this.filteredTerritories = this.GetAllTerritoriesListArray.map(
            (item) => ({
              estimated_time: item.estimated_time,
              pincode_type_id: item.pincode_id,
              pincode_type_name: item.pincode_territory_type,
            })
          );
        }
      } else {
        this.filteredTerritories = [];
      }
    },
    async callClassNameForNoTerrSelMethod() {
      console.log("CALLING");
      this.windowPage3.Pincode_Type = [];
      await this.ListPincodeTypes();
      this.filteredTerritories = this.GetAllTerritoriesListArray.map(
        (item) => ({
          estimated_time: item.estimated_time,
          pincode_type_id: item.pincode_id,
          pincode_type_name: item.pincode_territory_type,
        })
      );
    },
    updateFormattedDay() {
      if (this.date) {
        const day =
          Math.floor(
            (new Date(this.date) - new Date(this.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        this.formattedDay = `${day} Days`;
      }
    },
    windowpage3Object(Toggle, window3Obj) {
      this.$emit("clicked", Toggle, window3Obj);
    },
    dialogViewActiveTicketsBasedOnUserEmit() {
      this.dialogViewActiveTicketsBasedOnUser = false;
    },
    checkItem() {
      if (
        this.windowPage3.select_representative != "" &&
        this.windowPage3.select_representative != undefined
      ) {
        this.StoreObj = this.windowPage3.select_representative;
        this.dialogViewActiveTicketsBasedOnUser = true;
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Select Representative First..!",
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>

<style>
.Date_Custom .theme--light.v-date-picker-table th {
  display: none !important;
}
.Date_Custom .v-date-picker-header__weekday {
  display: none !important;
}
.Date_Custom .v-date-picker-header {
  display: none !important;
}

.v-date-picker.Date_Custom .v-date-picker-table {
  margin-top: 0 !important;
}

.v-date-picker.Date_Custom .v-date-picker-header__icon {
  display: none !important;
}
</style>
