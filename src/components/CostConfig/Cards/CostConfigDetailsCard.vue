<template>
  <div>
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Cost Configuration History</div>
        <v-spacer />

        <v-btn small color="primary" @click="CostConfigDetailsCardEmit()"
          >Back<v-icon small class="pl-1">mdi-arrow-left</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <div style="display: flex; flex-direction: column" class="pt-3">
          <v-card
            color="#f3e5f5"
            v-for="(item, index) in StoreObj.configuration_history"
            :key="index"
            class="pa-5 mb-4"
          >
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="pt-0 pb-0">
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Action Taken: </strong
                    >{{ item.action_taken }}</span
                  >
                </p>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="pt-0 pb-0">
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Action Taken By: </strong
                    >{{ item.action_taken_by }}</span
                  >
                </p>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="pt-0 pb-0">
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Action Time: </strong>{{ item.action_time }}</span
                  >
                </p>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12" class="pt-0 pb-0">
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Action Type: </strong>{{ item.action_type }}</span
                  >
                </p>
              </v-col>
            </v-row>
            <v-row
              v-if="item.update_data"
              v-for="(item2, index2) in item.update_data"
              :key="index2"
            >
              <v-col
                cols="12"
                lg="6"
                md="6"
                sm="12"
                xs="12"
                class="pt-0 pb-0"
                v-if="item2.previous_cost"
              >
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Previous Cost: </strong
                    >{{ item2?.previous_cost }}</span
                  >
                </p>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                md="6"
                sm="12"
                xs="12"
                class="pt-0 pb-0"
                v-if="item2.updated_cost"
              >
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Updated Cost: </strong
                    >{{ item2?.updated_cost || "-" }}</span
                  >
                </p>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                md="6"
                sm="12"
                xs="12"
                class="pt-0 pb-0"
                v-if="item2.previous_gst"
              >
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Previous GST: </strong
                    >{{ item2?.previous_gst }}</span
                  >
                </p>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                md="6"
                sm="12"
                xs="12"
                class="pt-0 pb-0"
                v-if="item2.updated_gst"
              >
                <p class="pa-0">
                  <span class="FontSize"
                    ><strong>Updated GST: </strong
                    >{{ item2?.updated_gst || "-" }}</span
                  >
                </p>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: { StoreObj: Object },
  methods: {
    CostConfigDetailsCardEmit() {
      this.$emit("clicked");
    },
  },
};
</script>
