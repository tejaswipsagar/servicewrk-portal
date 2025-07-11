<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent :value="AddExtendedWarrantyDialog" width="400">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <div v-if="this.StoreObjExtendedWarranty">
            <span v-if="this.StoreObjExtendedWarranty.action == 'ADD'">
              Add Extended Warranty
            </span>
            <span v-else>Update Extended Warranty</span>
          </div>
          <div v-else>Add Extended Warranty</div>
          <v-spacer />
          <v-btn icon @click="AddExtendedWarrantyDialogEmit(undefined)">
            <v-icon large dark small> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-autocomplete
              dense
              outlined
              class="mt-4 FontSize"
              label="Extended Support"
              v-model="Extended_Support"
              :items="Exteneded_Support_Items"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-autocomplete>
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              item-text="setting_name"
              item-value="setting_name"
              :items="GetAllAMCTypeList"
              label="Extended Support Type"
              v-model="Extended_Support_Type"
              :rules="[(v) => !!v || 'Required']"
            >
            </v-autocomplete>
            <v-menu
              offset-y
              min-width="auto"
              :nudge-right="40"
              transition="scale-transition"
              :close-on-content-click="false"
              v-model="extended_warranty_start_date_dialog"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  outlined
                  v-on="on"
                  v-bind="attrs"
                  class="FontSize"
                  prepend-inner-icon="mdi-calendar"
                  :rules="[(v) => !!v || 'Required']"
                  label="Extended Support Start Date"
                  v-model="extended_warranty_start_date"
                ></v-text-field>
              </template>
              <v-date-picker
                :min="extended_warranty_start_date"
                :max="extended_warranty_end_date"
                v-model="extended_warranty_start_date"
                @input="extended_warranty_start_date_dialog = false"
              ></v-date-picker>
            </v-menu>
            <v-menu
              offset-y
              min-width="auto"
              :nudge-right="40"
              transition="scale-transition"
              :close-on-content-click="false"
              v-model="extended_warranty_end_date_dialog"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  outlined
                  v-on="on"
                  v-bind="attrs"
                  class="FontSize"
                  label="Extended Support End Date"
                  prepend-inner-icon="mdi-calendar"
                  :rules="[(v) => !!v || 'Required']"
                  v-model="extended_warranty_end_date"
                ></v-text-field>
              </template>
              <v-date-picker
                :min="extended_warranty_start_date"
                v-model="extended_warranty_end_date"
              >
                <v-spacer />
                <v-btn
                  small
                  color="primary"
                  dark
                  @click.stop="saveExtendedDates()"
                  >Save</v-btn
                ></v-date-picker
              >
            </v-menu>
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              label="Frequency"
              v-model="extended_frequency"
              :items="extended_frequency_items"
              :rules="[(v) => !!v || 'Required']"
            ></v-autocomplete>
            <div
              class="font-weight-bold"
              v-if="extendedSupportScheduledMaintainceDates.length != 0"
            >
              Extended Warranty Scheduled Maintainance Dates
            </div>
            <v-data-table
              dense
              class="elevation-0"
              hide-default-footer
              :headers="mantainanceDatesHeader"
              :items="extendedSupportScheduledMaintainceDates"
              v-if="extendedSupportScheduledMaintainceDates.length != 0"
              :items-per-page="100"
            >
              <template v-slot:[`item.sl_no`]="{ item }">
                <div class="FontSize">
                  {{
                    extendedSupportScheduledMaintainceDates.indexOf(item) + 1
                  }}
                </div>
              </template>
              <template v-slot:[`item.date`]="{ item }">
                <div class="FontSize">
                  {{ new Date(item.date).toLocaleDateString("en-GB") }}
                </div>
              </template>
              <template v-slot:[`item.Action`]="{ item }">
                <v-btn icon small @click="deleteScheduledDate(item)" color="red"
                  ><v-icon small>mdi-delete</v-icon></v-btn
                >
              </template>
            </v-data-table>
          </v-form>
        </v-card-text>
        <v-card-actions class="mt-n8 mr-2 pb-6">
          <v-spacer />
          <v-btn @click="saveExtendedWarranty()" small class="primary"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";
export default {
  props: {
    StoreObjExtendedWarranty: Object,
    AddExtendedWarrantyDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GetAllOrganizationSetting],
  data: () => ({
    Extended_Support: "",
    Extended_Support_Type: "",
    extended_warranty_end_date: "",
    extended_warranty_start_date: "",
    renderComp: true,
    extended_frequency: null,
    extended_warranty_end_date_dialog: false,
    extended_warranty_start_date_dialog: false,
    GetAllAMCTypeList: [],
    extendedSupportScheduledMaintainceDates: [],
    mantainanceDatesHeader: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Dates", value: "date" },
      { text: "Action", value: "Action" },
    ],
    extended_frequency_items: [
      { text: "No visits Required", value: "0 Days" },
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
    Exteneded_Support_Items: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    SnackBarComponent: {},
  }),
  watch: {
    AddExtendedWarrantyDialog(val) {
      if (val == true) {
        console.log("thTEJUU", this.StoreObjExtendedWarranty);
        if (this.StoreObjExtendedWarranty) {
          if (this.StoreObjExtendedWarranty.action == "UPDATE") {
            this.Extended_Support =
              this.StoreObjExtendedWarranty.extended_ticket_warranty_type;
            this.Extended_Support_Type =
              this.StoreObjExtendedWarranty.extended_warranty_type;
            this.extended_warranty_start_date =
              this.StoreObjExtendedWarranty.extendedWarrantyStartDate;
            this.extended_warranty_end_date =
              this.StoreObjExtendedWarranty.extendedWarrantyEndEate;
            this.extended_frequency =
              this.StoreObjExtendedWarranty.extendedWarrantyFrequency;
          } else if (this.StoreObjExtendedWarranty.action == "EDITED") {
            this.Extended_Support =
              this.StoreObjExtendedWarranty.extended_ticket_warranty_type;
            this.Extended_Support_Type =
              this.StoreObjExtendedWarranty.extended_warranty_type;
            this.extended_warranty_start_date =
              this.StoreObjExtendedWarranty.extendedWarrantyStartDate;
            this.extended_warranty_end_date =
              this.StoreObjExtendedWarranty.extendedWarrantyEndEate;
            this.extended_frequency =
              this.StoreObjExtendedWarranty.extendedWarrantyFrequency;
            this.extendedSupportScheduledMaintainceDates =
              this.savedDateValues();
          }
        }
      }
    },
    Extended_Support(val) {
      console.log("valkue", val);
      this.GetAllAMCTypeMethod("ACTIVE", val);
    },
    extended_frequency(val) {
      if (this.StoreObjExtendedWarranty.action != "EDITED") {
        this.extendedSupportScheduledMaintainceDates = [];
        if (val != undefined && val != "" && val != "0 Days") {
          let extended_start_date = new Date(
            parseInt(this.extended_warranty_start_date.split("-")[0]),
            parseInt(this.extended_warranty_start_date.split("-")[1]) - 1,
            parseInt(this.extended_warranty_start_date.split("-")[2])
          ).getTime();
          let extended_end_date = new Date(
            parseInt(this.extended_warranty_end_date.split("-")[0]),
            parseInt(this.extended_warranty_end_date.split("-")[1]) - 1,
            parseInt(this.extended_warranty_end_date.split("-")[2])
          ).getTime();
          this.extendedSupportScheduledMaintainceDates = [];
          while (extended_start_date < extended_end_date) {
            this.extendedSupportScheduledMaintainceDates.push({
              date: extended_start_date,
            });
            extended_start_date +=
              this.extended_frequency * 24 * 60 * 60 * 1000;
          }
        }
      }
    },
  },
  methods: {
    deleteScheduledDate(item) {
      const index = this.extendedSupportScheduledMaintainceDates.indexOf(item);
      if (index !== -1) {
        this.extendedSupportScheduledMaintainceDates.splice(index, 1);
        this.extendedSupportScheduledMaintainceDates = [
          ...this.extendedSupportScheduledMaintainceDates,
        ];
      }
    },
    AddExtendedWarrantyDialogEmit(item) {
      this.$refs.form.reset();
      this.$emit("clicked", item);
    },
    saveExtendedWarranty() {
      if (this.$refs.form.validate()) {
        let extendedSupportItem = {
          extendedWarrantyDatesList:
            this.extendedSupportScheduledMaintainceDates.map(
              (item) => item.date / 1000
            ),
          extendedWarrantyEndEate: this.extended_warranty_end_date,
          extendedWarrantyFrequency:
            this.extended_frequency === "0 Days" ? 0 : this.extended_frequency,
          extendedWarrantyStartDate: this.extended_warranty_start_date,
          extended_ticket_warranty_type: this.Extended_Support,
          extended_warranty_type: this.Extended_Support_Type,
          index:
            this.StoreObjExtendedWarranty.action == "UPDATE" ||
            this.StoreObjExtendedWarranty.action == "EDITED"
              ? this.StoreObjExtendedWarranty.index
              : undefined,
          action:
            this.StoreObjExtendedWarranty.action == "UPDATE"
              ? "UPDATE"
              : this.StoreObjExtendedWarranty.action == "EDITED"
              ? "EDITED"
              : undefined,
        };
        console.log("niranjan", extendedSupportItem);
        this.AddExtendedWarrantyDialogEmit(extendedSupportItem);
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.renderComp = true;
        });
      }
    },
    saveExtendedDates() {
      let extended_start_date = new Date(
        parseInt(this.extended_warranty_start_date.split("-")[0]),
        parseInt(this.extended_warranty_start_date.split("-")[1]) - 1,
        parseInt(this.extended_warranty_start_date.split("-")[2])
      ).getTime();
      let extended_end_date = new Date(
        parseInt(this.extended_warranty_end_date.split("-")[0]),
        parseInt(this.extended_warranty_end_date.split("-")[1]) - 1,
        parseInt(this.extended_warranty_end_date.split("-")[2])
      ).getTime();
      this.extendedSupportScheduledMaintainceDates = [];
      while (
        this.extended_frequency != null &&
        extended_start_date < extended_end_date
      ) {
        this.extendedSupportScheduledMaintainceDates.push({
          date: extended_start_date,
        });
        extended_start_date += this.extended_frequency * 24 * 60 * 60 * 1000;
      }
      this.extended_warranty_end_date_dialog = false;
      console.log(
        "this.StoreObjExtendedWarranty",
        this.StoreObjExtendedWarranty
      );
      console.log(
        "this.extendedSupportScheduledMaintainceDates",
        this.extendedSupportScheduledMaintainceDates
      );
    },
    savedDateValues() {
      let DatesListingArray =
        this.StoreObjExtendedWarranty.extendedWarrantyDatesList;

      if (Array.isArray(DatesListingArray)) {
        return DatesListingArray.map((timestamp) => {
          let date = new Date(timestamp * 1000);
          let day = String(date.getDate()).padStart(2, "0");
          let month = String(date.getMonth() + 1).padStart(2, "0");
          let year = date.getFullYear();
          return { date: `${month}/${day}/${year}` };
        });
      }

      return [];
    },
  },
};
</script>
