<template>
  <div>
    <v-dialog persistent width="800px" :value="dialogTaggedList">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">
          Tagged Components to
          <span>{{ StoreObj.service_name }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            dark
            text
            class="mr-n4"
            @click="dialogemit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-data-table
            dense
            :headers="headers"
            :loading="loading"
            :items="GetAllTagCompList"
          >
            <template v-slot:[`item.component_name`]="{ item }">
              <div class="FontSize">{{ item.component_name }}</div>
            </template>
            <template v-slot:[`item.service_name`]="{ item }">
              <div class="FontSize" v-if="item.service_name != undefined">
                {{ item.service_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.component_product_code`]="{ item }">
              <div
                class="FontSize"
                v-if="item.component_product_code != undefined"
              >
                {{ item.component_product_code }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.component_description`]="{ item }">
              <div
                class="FontSize"
                v-if="item.component_description != undefined"
              >
                {{ item.component_description }}
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { GetAllTaggedComp } from "@/mixins/Product/GetAllTaggedComp.js";
export default {
  props: {
    StoreObj: Object,
    dialogTaggedList: Boolean,
  },
  mixins: [GetAllTaggedComp],
  data: () => ({
    loading: false,
    GetAllTagCompList: [],
    headers: [
      { text: "Component", value: "component_name" },
      { text: "Description", value: "component_description" },
      { text: "Code", value: "component_product_code" },
      { text: "Service Name", value: "service_name" },
    ],
  }),
  watch: {
    dialogTaggedList(val) {
      if (val == true) {
        this.GetAllTagCompList = [];
        this.GetAllTagCompMethod(this.StoreObj.service_id);
      }
    },
  },
  methods: {
    dialogemit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
