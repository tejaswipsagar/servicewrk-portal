<template>
  <div>
    <ViewScheduleVisitDate
      :StoreObjNew="StoreObjNew"
      :DialogViewScheduleVisitDates="DialogViewScheduleVisitDates"
      @clicked="DialogViewScheduleVisitDatesEmit"
    />
    <v-dialog :value="DialogExtendedWarrantyDetails" width="800">
      <v-card>
        <v-toolbar dark color="primary" dense>
          <div>Extended Warranty Details</div>
          <v-spacer />
          <v-icon @click="DialogExtendedWarrantyDetailsEmit()"
            >mdi-close</v-icon
          >
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            :items="StoreObjNew1.extended_warranty_details"
            :headers="extendedSupportHeaders"
            hide-default-footer
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize">
                {{ StoreObjNew1.extended_warranty_details.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.extended_ticket_warranty_type`]="{ item }">
              <div class="FontSize">
                {{ item.extended_ticket_warranty_type }}
              </div>
            </template>
            <template v-slot:[`item.extended_warranty_type`]="{ item }">
              <div class="FontSize">
                {{ item.extended_warranty_type }}
              </div>
            </template>
            <template v-slot:[`item.extendedWarrantyStartDate`]="{ item }">
              <div class="FontSize">
                {{ item.extendedWarrantyStartDate }}
              </div>
            </template>
            <template v-slot:[`item.extendedWarrantyEndEate`]="{ item }">
              <div class="FontSize">
                {{ item.extendedWarrantyEndEate }}
              </div>
            </template>
            <template v-slot:[`item.extendedWarrantyDatesList`]="{ item }">
              <div v-if="item.extendedWarrantyDatesList != undefined">
                <div
                  class="FontSize"
                  v-if="item.extendedWarrantyDatesList.length != 0"
                >
                  {{ item.extendedWarrantyDatesList.length }}
                  <v-icon
                    color="primary"
                    small
                    @click="viewScheduleVisitDates(item)"
                    >mdi-calendar-question-outline</v-icon
                  >
                </div>
                <div v-else>-</div>
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ViewScheduleVisitDate from "@/components/Product/Dialogs/ProductsFleet/ViewScheduleVisitDate.vue";
export default {
  props: {
    StoreObjNew1: Object,
    DialogExtendedWarrantyDetails: Boolean,
  },
  components: {
    ViewScheduleVisitDate,
  },
  data: () => ({
    StoreObjNew: {},
    DialogViewScheduleVisitDates: false,
    extendedSupportHeaders: [
      { text: "#", value: "sl_no" },
      { text: "Support", value: "extended_ticket_warranty_type" },
      { text: "Warranty", value: "extended_warranty_type" },
      { text: "Starts", value: "extendedWarrantyStartDate" },
      { text: "Ends", value: "extendedWarrantyEndEate" },
      { text: "Frequency", value: "extendedWarrantyFrequency" },
      { text: "No. of Visits", value: "extendedWarrantyDatesList" },
    ],
  }),
  methods: {
    viewScheduleVisitDates(item) {
      this.StoreObjNew = item;
      this.DialogViewScheduleVisitDates = true;
    },
    DialogViewScheduleVisitDatesEmit() {
      this.DialogViewScheduleVisitDates = false;
    },
    DialogExtendedWarrantyDetailsEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
