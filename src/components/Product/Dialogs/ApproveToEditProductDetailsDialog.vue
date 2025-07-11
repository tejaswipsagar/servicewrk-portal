<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogApproveToEditProductDetails" persistent width="60%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Approve Edited Product Fleet Details
            <span class="ml-3">
              Serial Number: ({{ StoreObj.setting_name }})
            </span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialogApproveToEditProductDetailsEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <b class="black--text">Existing Details</b>
          <v-row class="black--text mt-1">
            <v-col cols="12" md="3" sm="12" xs="12" class="mt-3">
              <p class="FontSize font-weight-bold">
                Ticket ID :
                <span class="font-weight-regular">{{
                  StoreObj.custom_ticket_id != undefined
                    ? StoreObj.custom_ticket_id
                    : StoreObj.module_id
                }}</span>
              </p>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12">
              <p class="FontSize font-weight-bold">
                Serial Number :
                <span class="font-weight-regular">{{
                  old_serial_number || "N/A"
                }}</span>
              </p>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12" v-if="old_support">
              <p class="FontSize font-weight-bold">
                Support :
                <span class="font-weight-regular">{{ old_support }}</span>
              </p>
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="12" v-if="old_support_type">
              <p class="FontSize font-weight-bold">
                Support Type :
                <span class="font-weight-regular">{{ old_support_type }}</span>
              </p>
            </v-col>
          </v-row>
          <b class="black--text mt-4">Requested to Update</b>
          <v-form ref="form">
            <v-row class="mt-3">
              <!-- <v-col cols="12" md="4" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  v-model="new_serial_number"
                  label="Old Serial Number *"
                ></v-text-field>
              </v-col> -->
              <v-col
                cols="12"
                md="4"
                sm="12"
                xs="12"
                v-if="new_serial_number !== false"
              >
                <v-text-field
                  dense
                  outlined
                  class="FontSize"
                  v-model="new_serial_number"
                  label="New Serial Number *"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="4"
                sm="12"
                xs="12"
                v-if="new_support != undefined"
              >
                <v-autocomplete
                  dense
                  outlined
                  label="New Support"
                  v-model="new_support"
                  class="FontSize"
                  :items="supportItems"
                  item-title="text"
                  item-value="value"
                >
                </v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="4"
                sm="12"
                xs="12"
                v-if="new_support != undefined"
              >
                <v-autocomplete
                  dense
                  outlined
                  label="New Support Type"
                  v-model="new_support_type"
                  class="FontSize"
                  :items="GetAllAMCTypeList"
                  item-text="setting_name"
                  item-value="setting_name"
                >
                </v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="12"
                xs="12"
                v-if="new_support != undefined"
              >
                <v-menu
                  offset-y
                  min-width="auto"
                  :nudge-right="40"
                  v-model="support_start_date"
                  transition="scale-transition"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Support Start Date"
                      v-model="warranty_start_date"
                      text-value="warranty_start_date"
                      prepend-inner-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="warranty_start_date"
                    @input="support_start_date = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="12"
                xs="12"
                v-if="new_support != undefined"
              >
                <v-menu
                  offset-y
                  min-width="auto"
                  :nudge-right="40"
                  v-model="support_end_date"
                  transition="scale-transition"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Support End Date"
                      v-model="warranty_end_date"
                      text-value="warranty_end_date"
                      prepend-inner-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="warranty_end_date"
                    :min="warranty_start_date + 1"
                    @input="support_end_date = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="12"
                xs="12"
                class="mt-n3"
                v-if="new_support != undefined"
              >
                <v-checkbox
                  class="FontSize"
                  label="Is Schedule Service ?"
                  v-model="is_schedule_service"
                ></v-checkbox>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="12"
                xs="12"
                v-if="is_schedule_service"
              >
                <v-autocomplete
                  dense
                  outlined
                  class="FontSize"
                  label="Frequency *"
                  v-model="frequency"
                  :items="ticket_frequency_Items"
                  :rules="is_schedule_service ? [(v) => !!v || 'Required'] : []"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
          <div
            v-if="scheduledMaintainanceDates.length != 0"
            class="font-weight-bold my-2"
          >
            Scheduled Maintainance Dates
          </div>
          <v-data-table
            dense
            class="elevation-0"
            :headers="mantainanceDatesHeader"
            :items="scheduledMaintainanceDates"
            v-if="scheduledMaintainanceDates.length != 0"
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize">
                {{ scheduledMaintainanceDates.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.date`]="{ item }">
              <div class="FontSize">
                {{ new Date(item.date).toDateString() }}
              </div>
            </template>
            <template v-slot:[`item.Action`]="{ item }">
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="scheduledMaintainanceDates.indexOf(item) == 0"
                    small
                    icon
                    v-on="on"
                    v-bind="attrs"
                    @click="
                      scheduledMaintainanceDates.splice(
                        scheduledMaintainanceDates.indexOf(item),
                        1
                      )
                    "
                    color="red"
                    ><v-icon small>mdi-delete</v-icon></v-btn
                  >
                </template>
                <span class="white--text">Exclude Start Date</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="approveMethod()"
            >Approve</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ApprovalForEditProductDetails } from "@/graphql/mutations.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogApproveToEditProductDetails: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GetAllOrganizationSetting],
  data: () => ({
    Toggle: 0,
    frequency: null,
    loading: false,
    renderComp: true,
    support_end_date: false,
    support_start_date: false,
    is_schedule_service: false,
    support_type: "",
    new_serial_number: "",
    new_support_type: "",
    new_support: "",
    old_support: "",
    old_support_type: "",
    old_serial_number: "",
    warranty_end_date: "",
    warranty_start_date: "",
    ticket_warranty_type: "",
    SnackBarComponent: {},
    GetAllAMCTypeList: [],
    scheduledMaintainanceDates: [],
    supportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    mantainanceDatesHeader: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Dates", value: "date" },
      { text: "Action", value: "Action" },
    ],
    ticket_frequency_Items: [
      { text: "0 days", value: 0 },
      { text: "15 days", value: 15 },
      { text: "30 days", value: 30 },
      { text: "45 days", value: 45 },
      { text: "60 days", value: 60 },
      { text: "90 days", value: 90 },
      { text: "120 days", value: 120 },
      { text: "180 days", value: 180 },
      { text: "1 Year", value: 365 },
      { text: "1 Year 3 Months", value: 485 },
      { text: "1 Year 6 Months", value: 545 },
      { text: "2 Years", value: 730 },
      { text: "2 Years 6 Months", value: 910 },
      { text: "3 Years", value: 1095 },
      { text: "3 Years 6 Months", value: 1275 },
      { text: "4 Years", value: 1460 },
      { text: "4 Years 6 Months", value: 1640 },
      { text: "5 Years", value: 1825 },
    ],
  }),
  watch: {
    dialogApproveToEditProductDetails(val) {
      if (val == true) {
        console.log("SEE", this.StoreObj);
        this.old_serial_number =
          this.StoreObj.old_product_details.serial_number != undefined
            ? this.StoreObj.old_product_details.serial_number
            : undefined;
        this.old_support =
          this.StoreObj.old_product_details.support != undefined
            ? this.StoreObj.old_product_details.support
            : undefined;
        this.old_support_type =
          this.StoreObj.old_product_details.support_type != undefined
            ? this.StoreObj.old_product_details.support_type
            : undefined;
        // this.new_serial_number =
        //   this.StoreObj.new_product_details.serial_number != undefined
        //     ? this.StoreObj.new_product_details.serial_number
        //     : undefined;
        this.new_serial_number =
          "serial_number" in this.StoreObj.new_product_details === true
            ? this.StoreObj.new_product_details.serial_number
            : false;
        this.new_support = this.StoreObj.new_product_details.support || "";
        console.log("OTW", this.StoreObj.new_product_details.support);
        console.log("OTW1", this.new_support);
        this.new_support_type =
          this.StoreObj.new_product_details.support_type != undefined
            ? this.StoreObj.new_product_details.support_type
            : undefined;
        this.warranty_start_date =
          this.StoreObj.new_product_details.support_start_date != undefined
            ? this.StoreObj.new_product_details.support_start_date
            : undefined;
        this.warranty_end_date =
          this.StoreObj.new_product_details.support_end_date != undefined
            ? this.StoreObj.new_product_details.support_end_date
            : undefined;
        this.GetAllAMCTypeMethod("ACTIVE", this.new_support);
      }
    },
    new_support(val) {
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    frequency(val) {
      this.scheduledMaintainanceDates = [];
      if (val != undefined && val != null && val != "" && val != "0 Days") {
        let start_date = new Date(
          parseInt(this.warranty_start_date.split("-")[0]),
          parseInt(this.warranty_start_date.split("-")[1]) - 1,
          parseInt(this.warranty_start_date.split("-")[2])
        ).getTime();
        let end_date = new Date(
          parseInt(this.warranty_end_date.split("-")[0]),
          parseInt(this.warranty_end_date.split("-")[1]) - 1,
          parseInt(this.warranty_end_date.split("-")[2])
        ).getTime();
        this.scheduledMaintainanceDates = [];
        while (start_date < end_date) {
          this.scheduledMaintainanceDates.push({ date: start_date });
          start_date += this.frequency * 24 * 60 * 60 * 1000;
        }
      }
    },
  },
  methods: {
    async approveMethod() {
      try {
        var inputParams = {
          user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          ticket_id: this.StoreObj.ticket_id,
          workflow_id: this.StoreObj.workflow_id,
          action: "APPROVE",
          old_serial_number:
            this.old_serial_number != undefined &&
            this.old_serial_number != null &&
            this.old_serial_number != ""
              ? this.old_serial_number
              : undefined,
          warranty_start_date:
            this.warranty_start_date != undefined &&
            this.warranty_start_date != null &&
            this.warranty_start_date != ""
              ? this.warranty_start_date
              : undefined,
          warranty_end_date:
            this.warranty_end_date != undefined &&
            this.warranty_end_date != null &&
            this.warranty_end_date != ""
              ? this.warranty_end_date
              : undefined,
          support_type:
            this.new_support_type != undefined &&
            this.new_support_type != null &&
            this.new_support_type != ""
              ? this.new_support_type
              : undefined,
          ticket_warranty_type:
            this.new_support != undefined &&
            this.new_support != null &&
            this.new_support != ""
              ? this.new_support
              : undefined,
          // serial_number:
          //   this.new_serial_number != undefined &&
          //   this.new_serial_number != null &&
          //   this.new_serial_number != ""
          //     ? this.new_serial_number
          //     : undefined,
          serial_number:
            "serial_number" in this.StoreObj.new_product_details === true
              ? this.new_serial_number
              : undefined,
          rft_date_list:
            this.scheduledMaintainanceDates.length != 0
              ? this.scheduledMaintainanceDates.map((item) => item.date / 1000)
              : undefined,
          frequency:
            this.frequency != undefined &&
            this.frequency != null &&
            this.frequency != ""
              ? this.frequency
              : undefined,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ApprovalForEditProductDetails, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.ApprovalForEditProductDetails
        );
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
          this.dialogApproveToEditProductDetailsEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
      }
    },
    dialogApproveToEditProductDetailsEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
