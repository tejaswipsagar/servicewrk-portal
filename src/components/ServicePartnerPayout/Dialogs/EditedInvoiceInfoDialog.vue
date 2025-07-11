<template>
  <div>
    <v-dialog v-model="EditedInvoiceInfoDialog" persistent max-width="900px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Edited Invoice Info</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditedInvoiceInfoDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div style="display: flex; flex-direction: column" class="pt-3">
            <v-card
              color="#f3e5f5"
              v-for="(item, index) in InvoiceObj.requested_for_changes"
              :key="index"
              class="pa-5 mb-4"
            >
              <div>
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Requested For Changes: </strong
                    >{{ item.requested_for_changes || "-" }}</span
                  >
                </p>
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Requested On: </strong>
                    {{
                      item.requested_on
                        ? new Date(item.requested_on * 1000).toLocaleString(
                            "en-GB"
                          )
                        : "-"
                    }}
                  </span>
                </p>
              </div>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    EditedInvoiceInfoDialog: Boolean,
    InvoiceObj: Object,
  },

  data: () => ({
    Tabmodel: 0,
  }),

  methods: {
    EditedInvoiceInfoDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
