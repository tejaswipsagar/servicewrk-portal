<template>
  <div>
    <v-dialog :value="dialogMRFApprovedDetails" persistent max-width="50%">
      <v-card>
        <v-toolbar dense class="white--text elevation-0" color="primary">
          Consumed Component Details
          <v-spacer></v-spacer>
          <v-btn
            small
            icon
            color="white"
            @click.stop="dialogMRFApprovedDetailsEmit()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-card
            v-for="(item, index) in ActionArray"
            :key="index"
            color="#f3e5f5"
            class="elevation-0 pa-2 mt-2"
          >
            <div class="fontsize13px font-weight-bold">
              Component Name :
              <span class="font-weight-regular">{{ item.component_name }}</span>
            </div>
            <div class="fontsize13px font-weight-bold">
              Component Code :
              <span class="font-weight-regular">{{ item.component_code }}</span>
            </div>
            <div class="fontsize13px font-weight-bold">
              Requested Components Qty :
              <span class="font-weight-regular">{{
                item.requested_component_quantity
              }}</span>
            </div>
            <!-- <div class="fontsize13px font-weight-bold">
              Approved Components Qty :
              <span class="font-weight-regular">{{
                item.approved_component_quantity
              }}</span>
            </div> -->
            <div class="fontsize13px font-weight-bold">
              Org Approved Components Qty :
              <span class="font-weight-regular">{{
                item.store_approve_count
              }}</span>
            </div>
            <div class="fontsize13px font-weight-bold">
              Own Stock Approved Components Qty :
              <span class="font-weight-regular">{{
                item.own_stock_approve_count
              }}</span>
            </div>
            <div class="fontsize13px font-weight-bold">
              Org Consumed Components Qty :
              <span class="font-weight-regular">{{
                item.store_consumed_count
              }}</span>
            </div>
            <div class="fontsize13px font-weight-bold">
              Own Stock Consumed Components Qty :
              <span class="font-weight-regular">{{
                item.own_stock_consumed_count
              }}</span>
            </div>
            <div class="fontsize13px font-weight-bold">
              Used Components Qty :
              <span class="font-weight-regular">{{
                item.used_component_quantity
              }}</span>
            </div>
            <div class="fontsize13px font-weight-bold">
              Pending Components Qty :
              <span class="font-weight-regular">{{
                item.pending_component_quantity
              }}</span>
            </div>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogMRFApprovedDetails: Boolean,
    ActionArray: Array,
  },
  watch: {
    dialogMRFApprovedDetails(val) {
      if (val == true) {
        console.log("this.Actionaara", this.ActionArray);
      }
    },
  },
  data: () => ({}),
  methods: {
    dialogMRFApprovedDetailsEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>
