<template>
  <div>
    <v-dialog :value="DialogUpdateDateOnRFTDateList" persistent max-width="400">
      <v-card>
        <v-toolbar dense dark class="elevation-0" color="primary">
          <div>Scheduled Visit Dates</div>
          <v-spacer />
          <v-btn icon @click="DialogUpdateDateOnRFTDateListEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            dense
            hide-default-footer
            :items="rft_date_list"
            :headers="rft_date_list_headers"
          >
            <template v-slot:[`item.sl_no`]="{ item }">
              <div class="FontSize">
                {{ rft_date_list.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.rft_date`]="{ item }">
              <div class="FontSize">
                {{ new Date(item.rft_date * 1000).toLocaleDateString("en-GB") }}
              </div>
            </template>
            <!-- <template v-slot:[`item.delete`]="{ item }">
              <v-icon
                @click="rft_date_list.splice(rft_date_list.indexOf(item), 1)"
                color="red"
                small
                v-if="rft_date_list.indexOf(item) == 0"
                >mdi-delete</v-icon
              >
            </template> -->
          </v-data-table>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer />
          <v-btn
            @click="save_rft_date()"
            small
            class="primary white--text mr-4 mb-4 mt-n4"
            >Save</v-btn
          >
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    // rft_date_list: Array,
    DialogUpdateDateOnRFTDateList: Boolean,
    StoreObjNew: Object,
  },
  data: () => ({
    Toggle: 0,
    rft_date_list: [],
    rft_date_list_headers: [
      { text: "#", value: "sl_no" },
      { text: "Date", value: "rft_date" },
      // { text: "Delete", value: "delete" },
    ],
  }),
  watch: {
    DialogUpdateDateOnRFTDateList(val) {
      if (val == true) {
        console.log("Niran", this.StoreObjNew);
        this.rft_date_list = this.StoreObjNew.rft_date_list.map((item) => ({
          rft_date: item,
        }));
      }
      setTimeout(() => {
        console.log("this.rft_date_list", this.rft_date_list);
      }, 3000);
    },
  },
  methods: {
    DialogUpdateDateOnRFTDateListEmit(Toggle, rft_date_list) {
      this.$emit("clicked", Toggle, rft_date_list);
    },
    save_rft_date() {
      this.DialogUpdateDateOnRFTDateListEmit(2, this.rft_date_list);
    },
  },
};
</script>

<style></style>
