<template>
  <div>
    <v-dialog v-model="QuotationDetailsDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Quotation Payment Details (<strong>{{
              QuotationObj.quotation_payment_details?.quotation_display_id
            }}</strong
            >)
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="QuotationDetailsDialogEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-3">
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong> Quotation Confirmed By: </strong>
              {{
                QuotationObj.quotation_payment_details
                  ?.payment_confirmed_by_name
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong> Payment Done On: </strong>
              {{
                QuotationObj.quotation_payment_details?.quotation_payment
                  ?.date_of_payment
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Mode of Payment: </strong>
              {{
                QuotationObj.quotation_payment_details?.quotation_payment
                  ?.mode_of_payment
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Payment Reference Number: </strong>
              {{
                QuotationObj.quotation_payment_details?.quotation_payment
                  ?.payment_reference_number
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Payment Type: </strong>
              {{
                QuotationObj.quotation_payment_details?.quotation_payment
                  ?.payment_type
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong>Payment Value: </strong>
              {{
                QuotationObj.quotation_payment_details?.quotation_payment
                  ?.payment_value
              }}
            </span>
          </div>
          <div class="FontSize" v-if="tabModel === 0">
            <span>
              <strong> Payment Done Comment: </strong>
              {{
                QuotationObj.quotation_payment_details?.payment_done_comments
              }}
            </span>
          </div>
          <!-- <v-tabs v-model="tabModel" slider-color="primary">
            <v-tab class="text-capitalize">PO Details</v-tab>
            <v-tab class="text-capitalize">Payment Details</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabModel">
            <v-tab-item>
              <div class="FontSize pa-6" v-if="tabModel === 0">
                <span>
                  <strong> Purchase Order ID: </strong>
                  {{ PurchaseOrderObj.purchase_order_display_id }}
                </span>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div v-if="tabModel === 1" class="pa-6">NO</div>
            </v-tab-item>
          </v-tabs-items> -->

          <!-- <v-row>
    <v-col cols="12">


    </v-col>
</v-row> -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    QuotationDetailsDialog: Boolean,
    QuotationObj: Object,
  },

  data: () => ({
    tabModel: 0,
  }),

  methods: {
    QuotationDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
