<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <ViewTicketDetailsForOldProductFleet
      :StoreObjNew="StoreObjNew"
      :openTicketDetailsDialog="openTicketDetailsDialog"
      @clicked="openTicketDetailsDialogEmit"
    />
    <v-dialog persistent width="80%" :value="dialogProductFleets">
      <v-toolbar color="primary" dense dark>
        <div class="ml-2 white--text">
          Product Fleets Available at
          <span v-if="StoreObj != undefined">{{ StoreObj.user_name }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          outlined
          class="FontSize WidthVariation1 mt-6"
          label="Search"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogProductFleetsEmit((Toggle = 1))"
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
            :items="ListAllAvailableProductFleetsFromTechnician"
            :loading="loading"
            :search="search"
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
            :items-per-page="100"
            :height="tableHeight"
            fixed-header
          >
            <template v-slot:[`item.category_name`]="{ item }">
              <div class="FontSize" v-if="item.category_name != undefined">
                {{ item.category_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.product_name`]="{ item }">
              <div class="FontSize" v-if="item.product_name != undefined">
                {{ item.product_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.setting_name`]="{ item }">
              <div class="FontSize" v-if="item.setting_name != undefined">
                {{ item.setting_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.setting_description`]="{ item }">
              <div
                class="FontSize"
                v-if="item.setting_description != undefined"
              >
                {{ item.setting_description }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.is_replaced_product_fleet`]="{ item }">
              <div v-if="item.is_replaced_product_fleet != undefined">
                <span
                  class="FontSize green--text"
                  v-if="item.is_replaced_product_fleet == true"
                >
                  REPLACED
                  <v-icon
                    color="primary"
                    class="mb-1 ml-1"
                    @click="checkItem(item, 'OPEN_TICKET_DETAILS')"
                    small
                    v-if="item.replaced_by_service_details != undefined"
                  >
                    mdi-ticket
                  </v-icon>
                </span>
              </div>
              <div v-else class="FontSize primary--text">ACTIVE</div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import ViewTicketDetailsForOldProductFleet from "@/components/Users/Dialogs/EnterpriseTechnicians/ViewTicketDetailsForOldProductFleet.vue";
import { GetAllAvailableProductFleetsFromTech } from "@/mixins/Users/GetTransferredProductFleetsToRep.js";
export default {
  props: {
    StoreObj: Object,
    dialogProductFleets: Boolean,
  },
  mixins: [GetAllAvailableProductFleetsFromTech],
  components: {
    Snackbar,
    ViewTicketDetailsForOldProductFleet,
  },
  data: () => ({
    search: "",
    loading: false,
    openTicketDetailsDialog: false,
    tableHeight: 0,
    StoreObjNew: {},
    SnackBarComponent: {},
    ListAllAvailableProductFleetsFromTechnician: [],
    headers: [
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Serial Number", value: "setting_name" },
      { text: "Description", value: "setting_description" },
      { text: "Status", value: "is_replaced_product_fleet" },
    ],
  }),
  watch: {
    dialogProductFleets(val) {
      if (val == true) {
        this.ListAllAvailableProductFleetsFromTechnicianMethod(
          this.StoreObj.user_id
        );
        this.tableHeight = window.innerHeight - 200;
      }
    },
  },
  mounted() {},
  methods: {
    dialogProductFleetsEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    openTicketDetailsDialogEmit() {
      this.openTicketDetailsDialog = false;
    },
    checkItem(item, action) {
      this.StoreObjNew = item;
      this.StoreObjNew.action = action;
      if (action == "OPEN_TICKET_DETAILS") {
        this.openTicketDetailsDialog = true;
      }
    },
  },
};
</script>
