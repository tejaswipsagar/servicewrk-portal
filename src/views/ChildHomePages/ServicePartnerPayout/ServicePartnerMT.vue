<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <InitiateInvoiceDirectly
      :InitiateInvoiceDirectlyDialog="initiateInvoiceDirectlyDialog"
      :SelectedPartners="selected"
      @clicked="InitiateInvoiceDirectlyDialogEmit"
    />
    <v-card elevation="0" v-if="currentView === 'MAIN_VIEW'">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4" xs="12" class="ml-n4">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Service Partner List</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="8" xs="12" class="d-flex justify-end">
          <div>
            <v-toolbar dense class="elevation-0">
              <v-text-field
                class="mt-9 ml-1 maxWidthSmall"
                dense
                outlined
                label="Search"
                v-model="search"
              >
              </v-text-field>
              <v-select
                dense
                outlined
                label="Status"
                v-model="status"
                :items="statusItem"
                class="mt-9 FontSize maxWidthXSmall ml-2 mr-2"
              ></v-select>
              <!-- <v-btn
                small
                class="ml-2 mt-2"
                color="primary"
                @click="
                  initiateBtn === false
                    ? (initiateBtn = true)
                    : ((initiateBtn = false), (selected = []))
                "
                >{{ initiateBtn ? "Clear" : "Initiate"
                }}<v-icon small>{{
                  initiateBtn ? "mdi-close" : "mdi-plus"
                }}</v-icon></v-btn
              > -->
            </v-toolbar>
          </div>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          :show-select="initiateBtn"
          item-key="user_name"
          v-model="selected"
          style="cursor: pointer"
          class="TableValFontsize"
          :headers="servicePartnerHeaders"
          :items="servicePartnerData"
          dense
          fixed-header
          :search="search"
          :items-per-page="50"
          :height="TableHeight"
          :no-data-text="
            servicePartnerData && servicePartnerData.length === 0
              ? 'No data found'
              : undefined
          "
          @click:row="handleRowClick"
        >
          <!-- <template v-slot:[`item.sl_no`]="{ item, index }">
            <div>
              {{ index + 1 }}
            </div>
          </template> -->
        </v-data-table>
        <div class="d-flex justify-end" v-if="selected && selected.length > 0">
          <v-btn
            small
            class="mr-2 mt-2"
            color="primary"
            @click="initiatedInvoiceMethod()"
            >Next
            <span class="ml-1">{{
              selected && selected.length > 0 ? `(${selected.length})` : null
            }}</span
            ><v-icon small class="pl-1">mdi-arrow-right</v-icon></v-btn
          >
        </div>
      </v-card-text>
    </v-card>
    <ServicePartnerMTInfo :StoreObj="storeObj" @clicked="CardEmit" v-else />
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { ListPartnerUsers } from "@/graphql/queries.js";
import ServicePartnerMTInfo from "@/components/ServicePartnerPayout/Cards/ServicePartnerMTInfoCard.vue";
import InitiateInvoiceDirectly from "@/components/ServicePartnerPayout/Dialogs/InitiateInvoiceDirectlyDialog.vue";

export default {
  components: {
    Snackbar,
    Overlay,
    ServicePartnerMTInfo,
    InitiateInvoiceDirectly,
  },
  data: () => ({
    overlay: true,
    renderComp: true,
    search: "",
    status: "ACTIVE",
    currentView: "MAIN_VIEW",
    servicePartnerData: [],
    statusItem: ["ACTIVE", "INACTIVE"],
    storeObj: {},
    TableHeight: 0,
    SnackBarComponent: {},
    servicePartnerHeaders: [
      // {
      //   text: "Sl.No",
      //   fixed: true,
      //   value: "sl_no",
      // },
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Email-Id", value: "user_email_id" },
      //   {
      //     text: "App Version",
      //     value: "app_version",
      //     align: "center",
      //     width: "14%",
      //   },
      { text: "Designation", value: "designation_name" },
      {
        text: "Reporting To",
        value: "reporting_to_manager_name",
      },
      //   { text: "Created On", value: "user_created_on", width: "12%" },
      //   { text: "Actions", value: "Actions", width: "80%" },
    ],
    selected: [],
    initiateInvoiceDirectlyDialog: false,
    initiateBtn: false,
  }),

  watch: {
    status(val) {
      if (val) {
        this.servicePartnerData = [];
        this.callApiMethod();
      }
    },

    selected(val) {
      if (val) {
        console.log("SELECTED", val);
      }
    },
  },

  async mounted() {
    this.TableHeight = window.innerHeight - 180;
    await this.callApiMethod();
    if (
      this.$store.getters.get_current_user_details.user_type ===
      "SERVICE_PARTNER"
    ) {
      this.storeObj = this.servicePartnerData[0];
      this.currentView = "CARD_VIEW";
      console.log("CHECK_OBJ", this.storeObj);
    }
  },

  methods: {
    async callApiMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(ListPartnerUsers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              user_status: this.status,
              user_type: "SERVICE_PARTNER",
            },
          })
        );
        const response = JSON.parse(result.data.ListPartnerUsers).data.items;
        this.servicePartnerData = response;
        this.overlay = false;
        console.log("PAR_RES", result);
      } catch (error) {
        this.overlay = false;
        //
      }
    },

    initiatedInvoiceMethod() {
      this.initiateInvoiceDirectlyDialog = true;
    },

    handleRowClick(item) {
      this.storeObj = item;
      this.currentView = "CARD_VIEW";
      console.log("ITEm", item);
    },

    CardEmit() {
      this.currentView = "MAIN_VIEW";
    },

    InitiateInvoiceDirectlyDialogEmit(Toggle) {
      this.initiateInvoiceDirectlyDialog = false;
    },
  },
};
</script>
