<template>
  <div>
    <v-dialog
      :value="dialogViewEditedTicketDetails"
      persistent
      max-width="780px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <span v-if="StoreObjNew.action == 'EDITED_TICKET_DETAILS'">
            Edited Parameters
          </span>
          <span
            v-else-if="
              StoreObjNew.action == 'REQUESTED_TO_EDIT_PRODUCT_DETAILS'
            "
          >
            Requested to edit Product Details
          </span>
          <span
            v-else-if="
              StoreObjNew.action ==
              'EDITED_PRODUCT_DETAILS_IN_EXISTING_WORKFLOW'
            "
          >
            Edited Product Details in Existing Workflow
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogViewEditedTicketDetailsEmit()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-row v-if="StoreObjNew.action == 'EDITED_TICKET_DETAILS'">
            <v-col cols="12" md="6" sm="12" xs="12">
              <div class="black--text">
                <div class="font-weight-bold mt-4">Updated Parameters</div>
                <div>
                  <div
                    v-for="(key, value, i) in StoreObjNew.updated_parameters"
                    :key="i"
                  >
                    <div
                      v-if="
                        value != 'modified_on' &&
                        value != 'updater_user_id' &&
                        value != 'updater_user_name' &&
                        value != 'updater_user_type' &&
                        value != 'category_id' &&
                        value != 'service_id'
                      "
                    >
                      <span class="mt-6">{{ value }} : {{ key }} </span>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
              <div class="black--text">
                <div class="font-weight-bold mt-4">Previous Data</div>
                <div>
                  <div
                    v-for="(
                      key, value, i
                    ) in StoreObjNew.updated_previous_parameters"
                    :key="i"
                  >
                    <div
                      v-if="
                        value != 'modified_on' &&
                        value != 'updater_user_id' &&
                        value != 'updater_user_name' &&
                        value != 'updater_user_type' &&
                        value != 'category_id' &&
                        value != 'service_id'
                      "
                    >
                      <span class="mt-4"> {{ value }} : {{ key }} </span>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-else-if="
              StoreObjNew.action == 'REQUESTED_TO_EDIT_PRODUCT_DETAILS'
            "
          >
            <v-col cols="12" md="6" sm="12" xs="12">
              <div class="black--text mt-4 mb-4 font-weight-bold">
                Old Product Deatils
                <div
                  v-for="(key, value, i) in StoreObjNew.old_product_details"
                  :key="i"
                  class="font-weight-regular"
                >
                  <span v-if="key != ''">{{ value }} : {{ key }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
              <div class="black--text mt-4 mb-4 font-weight-bold">
                New Product Details
                <div
                  v-for="(key, value, i) in copiedObj.new_product_details"
                  :key="i"
                  class="font-weight-regular"
                >
                  <span v-if="key != ''">{{ value }} : {{ key }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-else-if="
              StoreObjNew.action ==
              'EDITED_PRODUCT_DETAILS_IN_EXISTING_WORKFLOW'
            "
          >
            <v-col cols="12" md="6" sm="12" xs="12">
              <div class="black--text mt-4 mb-4 font-weight-bold">
                Old Product Deatils
                <div
                  v-for="(key, value, i) in StoreObjNew.old_product_details"
                  :key="i"
                  class="font-weight-regular"
                >
                  <span v-if="key != ''">{{ value }} : {{ key }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
              <div class="black--text mt-4 mb-4 font-weight-bold">
                New Product Details
                <div
                  v-for="(key, value, i) in copiedObj.new_product_details"
                  :key="i"
                  class="font-weight-regular"
                >
                  <span v-if="key != ''">{{ value }} : {{ key }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    StoreObjNew: Object,
    dialogViewEditedTicketDetails: Boolean,
  },
  data: () => ({
    copiedObj: {},
  }),
  watch: {
    dialogViewEditedTicketDetails(val) {
      if (val) {
        this.copiedObj = JSON.parse(JSON.stringify(this.StoreObjNew));
        if ("rft_date_list" in this.copiedObj.new_product_details) {
          let epochConversion =
            this.copiedObj.new_product_details.rft_date_list.map((item) => {
              const date = new Date(item * 1000);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            });
          this.copiedObj.new_product_details.rft_date_list = epochConversion;
          this.copiedObj.new_product_details.schedule_service_date =
            this.copiedObj.new_product_details.rft_date_list;
          delete this.copiedObj.new_product_details.rft_date_list;
        }
      }
    },
  },

  methods: {
    dialogViewEditedTicketDetailsEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
