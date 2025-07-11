<template>
  <div>
    <!-- <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" /> -->
    <v-dialog v-model="EditInvoiceItemDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Initiate Invoice</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditInvoiceItemDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="hsnCode"
            label="HSN Code"
            dense
            class="FontSize mt-3"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small class="mr-2" color="primary" @click="saveMethod()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    EditInvoiceItemDialog: Boolean,
    HsnCode: String,
  },

  data: () => ({
    btnLoading: false,
    hsnCode: "",
  }),

  watch: {
    EditInvoiceItemDialog(val) {
      if (val) {
        this.hsnCode = this.HsnCode;
      }
    },
  },

  methods: {
    saveMethod() {
      this.EditInvoiceItemDialogEmit(2, this.hsnCode);
    },
    EditInvoiceItemDialogEmit(Toggle, hsn_code) {
      this.$emit("clicked", Toggle, hsn_code);
    },
  },
};
</script>
