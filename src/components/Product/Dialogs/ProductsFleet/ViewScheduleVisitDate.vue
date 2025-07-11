<template>
  <div>
    <v-dialog :value="DialogViewScheduleVisitDates" max-width="400">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div>Scheduled Visit Dates</div>
          <v-spacer />
          <v-btn icon @click="DialogViewScheduleVisitDatesEmit()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            class="elevation-0"
            :headers="visitDateHeaders"
            :items="datesArray"
            :items-per-page="100"
            hide-default-footer
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize">
                {{ datesArray.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.date`]="{ item }">
              <div item.date class="FontSize">
                {{ new Date(item.date * 1000).toLocaleDateString("en-GB") }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObjNew: Object,
    DialogViewScheduleVisitDates: Boolean,
  },
  data: () => ({
    datesArray: [],
    visitDateHeaders: [
      { text: "#", value: "sl_no" },
      { text: "Date", value: "date" },
    ],
  }),
  watch: {
    DialogViewScheduleVisitDates(val) {
      if (val == true) {
        console.log("this.StoreObjNew", this.StoreObjNew);
        if (this.StoreObjNew.extendedWarrantyDatesList) {
          for (
            let i = 0;
            i < this.StoreObjNew.extendedWarrantyDatesList.length;
            i++
          ) {
            this.datesArray.push({
              date: this.StoreObjNew.extendedWarrantyDatesList[i],
            });
          }
        } else if (this.StoreObjNew.normal_warranty_date_list) {
          for (
            let i = 0;
            i < this.StoreObjNew.normal_warranty_date_list.length;
            i++
          ) {
            this.datesArray.push({
              date: this.StoreObjNew.normal_warranty_date_list[i],
            });
          }
        }
      }
    },
  },
  methods: {
    DialogViewScheduleVisitDatesEmit() {
      this.datesArray = [];
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
