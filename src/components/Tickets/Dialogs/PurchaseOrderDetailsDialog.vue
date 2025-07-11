<template>
  <div>
    <v-dialog v-model="PurchaseOrderDetailsDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Purchase Order Details (<strong>
              {{ PurchaseOrderObj.purchase_order_display_id }} </strong
            >)
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="purchaseOrderDetailsDialogEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-3">
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong> Purchase Order Confirmed By: </strong>
              {{
                PurchaseOrderObj.purchanse_order_payment_details
                  ?.purchase_order_confirmed_by_name
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong> Payment Done On: </strong>
              {{
                PurchaseOrderObj.purchanse_order_payment_details
                  ?.purchanse_order_payment?.date_of_payment
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Mode of Payment: </strong>
              {{
                PurchaseOrderObj.purchanse_order_payment_details
                  ?.purchanse_order_payment?.mode_of_payment
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Payment Reference Number: </strong>
              {{
                PurchaseOrderObj.purchanse_order_payment_details
                  ?.purchanse_order_payment?.payment_reference_number
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Payment Type: </strong>
              {{
                PurchaseOrderObj.purchanse_order_payment_details
                  ?.purchanse_order_payment?.payment_type
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Payment Value: </strong>
              {{
                PurchaseOrderObj.purchanse_order_payment_details
                  ?.purchanse_order_payment?.payment_value
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong> Payment Done Comment: </strong>
              {{
                PurchaseOrderObj.purchanse_order_payment_details
                  ?.payment_done_comments
              }}
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    PurchaseOrderDetailsDialog: Boolean,
    PurchaseOrderObj: Object,
  },

  data: () => ({
    tabModel: 0,
  }),

  methods: {
    purchaseOrderDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
