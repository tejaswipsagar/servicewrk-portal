<template>
  <div>
    <v-dialog
      v-model="SelectMonthToGenerateDialog"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Select Month</div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="
              SelectMonthToGenerateDialogEmit(1, reportmonth, reportmonth1)
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="d-flex justify-center">
            <v-menu
              ref="menum"
              v-model="menum"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-9 mr-2 FontSize field_label_size field_height pl-2 smallwidth"
                  outlined
                  dense
                  v-model="reportmonth"
                  label="Select Month"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="reportmonth"
                type="month"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menum = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="menum = false">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </div>
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
    SelectMonthToGenerateDialog: Boolean,
  },
  data() {
    return {
      reportmonth: new Date().toISOString().substr(0, 7),
      menum: false,
    };
  },
  methods: {
    saveMethod() {
      this.SelectMonthToGenerateDialogEmit(2, this.reportmonth);
    },
    SelectMonthToGenerateDialogEmit(Toggle, from) {
      this.$emit("clicked", Toggle, from);
    },
  },
};
</script>
