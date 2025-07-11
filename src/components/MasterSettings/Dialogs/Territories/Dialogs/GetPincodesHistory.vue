<template>
  <div>
    <v-dialog persistent v-model="ListPincodesHistoryDialog" width="850px">
      <v-card color="white">
        <v-toolbar dense color="primary" class="elevation-0 white--text">
          <span>Edit History</span>
          <v-spacer />
          <v-btn small icon @click.stop="ListPincodesHistoryDialogEmit(1)"
            ><v-icon color="white">mdi-close</v-icon></v-btn
          ></v-toolbar
        >
        <v-row no-gutters>
          <v-col cols="12" md="6" xs="6" sm="6">
            <div class="ml-16 mt-2 font-weight-bold">Edited</div>
          </v-col>
          <v-col cols="12" md="6" xs="6" sm="6">
            <div class="ml-4 mt-2 font-weight-bold">Before Edit</div>
          </v-col>
        </v-row>
        <v-row no-gutters class="mx-2">
          <v-col cols="12" md="12" xs="12" sm="12">
            <v-card
              v-for="(item, i) in ListHistoryArray"
              :key="i"
              class="my-4 elevation-0"
              color="#f3e5f5"
            >
              <v-row
                ><v-col cols="12" md="6" xs="6" sm="6">
                  <div class="ml-2 FontSize">
                    Pincode Type :
                    <span class="font-weight-bold">{{
                      item.pincode_territory_type
                    }}</span>
                  </div>
                  <div class="ml-2 FontSize">
                    Estimated Time
                    <span class="font-weight-bold">{{
                      item.estimated_time
                    }}</span>
                  </div>
                  <div class="ml-2 FontSize">
                    Modified On :
                    <span class="font-weight-bold">{{
                      new Date(item.modified_on * 1000).toLocaleString()
                    }}</span>
                  </div>
                  <div class="ml-2 FontSize">
                    Modified By :
                    <span class="font-weight-bold">{{ item.user_name }}</span>
                  </div>
                </v-col>

                <v-col cols="12" md="6" xs="6" sm="6">
                  <div class="FontSize">
                    Pincode Type :
                    <span
                      v-if="item.previous_pincode_territory_type"
                      class="font-weight-bold"
                      >{{ item.previous_pincode_territory_type }}</span
                    >
                    <span v-else>-</span>
                  </div>
                  <div class="FontSize">
                    Estimated Time :
                    <span
                      v-if="item.previous_estimated_time"
                      class="font-weight-bold"
                      >{{ item.previous_estimated_time }}</span
                    >
                    <span v-else>-</span>
                  </div>
                  <!-- <div>
                Modified On :
                <span>{{ new Date(item.modified_on).toLocaleString() }}</span>
              </div>
              <div>
                Modified By : <span>{{ item.user_name }}</span>
              </div> -->
                </v-col></v-row
              >
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ListPincodeHistory } from "@/mixins/MastersSetting/ListHistoryofPincodes.js";
export default {
  props: {
    ListPincodesHistoryDialog: Boolean,
    ActionObj: Object,
  },
  mixins: [ListPincodeHistory],
  data: () => ({
    ListHistoryArray: [],
  }),
  watch: {
    async ListPincodesHistoryDialog(val) {
      if (val == true) {
        console.log("ressss", this.ActionObj);
        this.ListHistoryArray = await this.ListPincodeHistoryMethod(
          this.ActionObj.pincode_id
        );
      }
    },
  },
  methods: {
    ListPincodesHistoryDialogEmit(Toggle) {
      this.ListHistoryArray = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
