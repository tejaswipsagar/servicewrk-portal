<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <Overlay :overlay="overlay" />
    <createQuotationTemplate
      :StoreObj="StoreObj"
      v-if="current_view == 'CREATE' || current_view == 'EDIT'"
      :current_view="current_view"
      @clicked="CreateTicketCardEmit"
    />

    <v-card v-if="current_view == 'LIST'" class="elevation-0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="largeFontSizeNew">Templates</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" md="6">
          <v-toolbar dense class="elevation-0">
            <v-spacer />
            <v-select
              dense
              outlined
              label="Template Status"
              v-model="template_status"
              :items="template_status_items"
              item-text="text"
              item-value="value"
              class="mt-8 mr-4"
              style="max-width: 300px"
            >
            </v-select>
            <v-tooltip bottom v-if="current_view == 'LIST'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-2 mt-1"
                  large
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="
                    (current_view = 'CREATE'), (StoreObj.action = 'CREATE')
                  "
                >
                  <v-btn fab small color="primary">
                    <v-icon small icon>mdi-plus</v-icon></v-btn
                  >
                </v-btn>
              </template>
              <span>Create Template</span>
            </v-tooltip>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          class="elevation-0"
          :headers="quotationBuilderHeader"
          :items="quotationBuilderItems"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.Action`]="{ item }">
            <v-tooltip v-if="template_status == 'ACTIVE'" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click.stop="checkItem(item, 'EDIT')"
                  ><v-icon small>{{ "mdi-pencil-plus" }}</v-icon></v-btn
                >
              </template>
              <span align="center">Edit Template</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  :color="template_status == 'ACTIVE' ? 'red' : 'green'"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click="checkItem(item, 'DELETE')"
                  ><v-icon small>{{
                    template_status == "ACTIVE" ? "mdi-close" : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span align="center">{{
                template_status == "ACTIVE"
                  ? "Delete Template"
                  : "Activate Template"
              }}</span>
            </v-tooltip>
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click.stop="checkItem(item, 'SEND')"
                  ><v-icon small v-text="'mdi-arrow-right-bold'"></v-icon
                ></v-btn>
              </template>
              <span align="center">Send Template</span>
            </v-tooltip> -->
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            <span class="FontSize">{{
              new Date(item.created_on * 1000).toLocaleString().split(",")[0]
            }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import Overlay from "@/components/Extras/OverlayView.vue";
import createQuotationTemplate from "@/components/Quotation/createQuotationTemplate.vue";

import { API } from "aws-amplify";

export default {
  components: {
    Snackbar,
    Overlay,
    createQuotationTemplate,
  },
  data: () => ({
    // temp_type: ["QUOTATION", "CONTRACT"],
    // template_type: "QUOTATION",
    template_status: "ACTIVE",
    template_status_items: [
      { text: "Active", value: "ACTIVE" },
      { text: "InActive", value: "INACTIVE" },
    ],
    StoreObj: {},
    SnackBarComponent: {},
    overlay: false,
    current_view: "LIST",
    quotationBuilderItems: [],
    quotationBuilderHeader: [
      {
        text: "Name",
        value: "template_name",
      },
      {
        text: "Created",
        value: "created_on",
      },
      {
        text: "Status",
        value: "template_status",
      },
      {
        text: "Action",
        value: "Action",
      },
    ],
  }),
  watch: {
    template_type(val) {
      this.listTemplate(val);
    },
    template_status(val) {
      this.listTemplate(val);
    },
  },
  mounted() {
    this.listTemplate(this.template_status);
  },
  methods: {
    async listTemplate(template_status) {
      try {
        var self = this;
        self.overlay = true;

        const path = "listtemplates";
        const myInit = {
          body: {
            command: "listTemplates",
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            template_status: template_status,
            template_type: "QUOTATION",
          },
        };
        API.post("SERVICEWRK", path, myInit).then((response) => {
          if (response.errorType != "Error") {
            self.quotationBuilderItems = response.data.items;
            self.overlay = false;
          } else {
            self.quotationBuilderItems = [];
            self.overlay = false;
          }
        });
      } catch (err) {
        console.log(err);
        self.overlay = true;
        self.quotationBuilderItems = [];
      }
    },

    deleteMethod(item) {
      var self = this;
      const path = "deletetemplate";
      const myInit = {
        body: {
          command: "deleteTemplate",
          template_id: item.template_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          action: this.template_status == "ACTIVE" ? "DEACTIVATE" : "ACTIVATE",
        },
      };
      API.post("SERVICEWRK", path, myInit)
        .then(() => {
          self.listTemplate(this.template_status);
        })
        .catch(() => {
          self.quotationBuilderItems = [];
        });
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.current_view = "EDIT";
      } else if (action == "SEND") {
        this.current_view = "SEND";
      } else if (action == "DELETE") {
        this.deleteMethod(item);
      }
      this.$forceUpdate();
    },
    CreateTicketCardEmit(Toggle) {
      if (Toggle == 1 || Toggle == 2) {
        this.current_view = "LIST";
        this.$forceUpdate();
        this.listTemplate();
      }
    },
    // SendCardEmit(Toggle) {
    //   if (Toggle == 1 || Toggle == 2) {
    //     this.current_view = "LIST";
    //     this.listTemplate();
    //   }
    // },
  },
};
</script>
