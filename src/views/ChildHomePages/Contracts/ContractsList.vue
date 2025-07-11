<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <Overlay :overlay="overlay" />
    <sendTemplate
      :StoreObj="StoreObj"
      v-if="current_view == 'SEND'"
      @clicked="SendCardEmit"
      :current_view="current_view"
    />
    <v-card v-if="current_view == 'LIST'" class="elevation-0">
      <v-row>
        <v-col cols="12" md="11">
          <v-toolbar dense class="elevation-0">
            <v-row no-gutters>
              <h4>Contract List</h4>
              <v-spacer />
              <v-spacer />
              <v-spacer />
              <v-tooltip bottom v-if="current_view == 'LIST'">
                <v-spacer />
                <v-spacer />

                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    large
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="(current_view = 'SEND'), (StoreObj.action = 'SEND')"
                  >
                    <v-btn fab small color="primary">
                      <v-icon small icon>mdi-note-plus-outline</v-icon></v-btn
                    >
                  </v-btn>
                </template>
                <span>Create Contract To Send </span>
              </v-tooltip>
            </v-row>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          class="elevation-0"
          :headers="ContractBuilderHeader"
          :items="ListContract"
        >
          <template v-slot:[`item.quotation_display_id`]="{ item }">
            <div class="FontSize">{{ item.quotation_display_id }}</div>
          </template>
          <template v-slot:[`item.quotation_version`]="{ item }">
            <div class="FontSize">{{ item.quotation_version }}</div>
          </template>
          <!-- <template v-slot:[`item.customer_name`]="{ item }">
            <div class="FontSize">
              {{ item.customer_name.length != 0 ? item.customer_name : "-" }}
            </div>
          </template> -->
          <template v-slot:[`item.quotation_created_on`]="{ item }">
            <span class="FontSize">{{
              new Date(item.quotation_created_on * 1000)
                .toLocaleString()
                .split(",")[0]
            }}</span>
          </template>
          <template v-slot:[`item.quotation_s3_key`]="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <a
                  v-if="
                    item.quotation_s3_url != null ||
                    item.quotation_s3_url != undefined
                  "
                  @click="
                    download_invoice(
                      `https://servicewrkcabinet.s3.ap-south-1.amazonaws.com/${item.quotation_s3_key}`
                    )
                  "
                >
                  <v-icon v-on="on" small color="primary">mdi-download </v-icon>
                </a>
                <v-icon v-else small v-on="on" color="grey"
                  >mdi-download</v-icon
                >
              </template>
              <span
                v-if="
                  item.quotation_s3_url != null ||
                  item.quotation_s3_url != undefined
                "
                class="white--text"
                >Download Contract</span
              >
              <span v-else class="white--text">Not Available</span>
            </v-tooltip>
            <!-- <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <a>
                  <v-icon class="ml-2" v-on="on" small color="primary"
                    >mdi-file-outline
                  </v-icon>
                </a>
              </template>
              <span class="white--text">Draft</span>
            </v-tooltip> -->
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
// import ContractBuilder from "@/Views/ChildHomePages/ContractBuilder.vue";
import sendTemplate from "@/components/Contract/sendTemplate.vue";
import { ListQuotations } from "@/graphql/queries.js";

import { API, graphqlOperation } from "aws-amplify";

export default {
  components: {
    Snackbar,
    Overlay,
    sendTemplate,
  },
  data: () => ({
    StoreObj: {},
    SnackBarComponent: {},
    overlay: false,
    current_view: "LIST",
    ListContract: [],
    ContractBuilderHeader: [
      {
        text: "Version",
        value: "quotation_version",
      },
      {
        text: "Display Id",
        value: "quotation_display_id",
      },
      {
        text: "Customer Name",
        value: "customer_name",
      },
      {
        text: "Created On",
        value: "quotation_created_on",
      },
      {
        text: "Action",
        value: "quotation_s3_key",
      },
    ],
  }),
  mounted() {
    // this.listTemplate();
    this.getListContract();
  },
  methods: {
    download_invoice(item) {
      window.open(item);
    },
    async getListContract() {
      try {
        this.overlay = true;
        this.ListContract = [];
        let result = await API.graphql(
          graphqlOperation(ListQuotations, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              pdf_type: "CONTRACT",
            },
          })
        );
        var StoreArray = JSON.parse(result.data.ListQuotations);
        this.ListContract = StoreArray.data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.NoData = error.errors[0].message;
      }
    },

    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.current_view = "CREATE";
      } else if (action == "Contract") {
        this.current_view = "Contract";
      }
    },
    ContractCardEmit(Toggle) {
      if (Toggle == 1 || Toggle == 2) {
        this.current_view = "LIST";
        this.getListContract();
      }
    },
    SendCardEmit(Toggle) {
      if (Toggle == 1 || Toggle == 2) {
        this.current_view = "LIST";
        this.getListContract();

        // this.listTemplate();
      }
    },
  },
};
</script>

