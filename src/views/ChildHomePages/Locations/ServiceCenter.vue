<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <CreateServiceCenter
      :StoreObj="StoreObj"
      :dialogCreateServiceCenter="dialogCreateServiceCenter"
      @clicked="dialogCreateServiceCenterEmit"
    />
    <ViewCompAvailableDialog
      :StoreObj="StoreObj"
      :dialogCompAvailable="dialogCompAvailable"
      @clicked="dialogemit"
    />
    <ViewProductFleetDialog
      :StoreObj="StoreObj"
      :dialogFleetAvailable="dialogFleetAvailable"
      @clicked="dialogFleetemit"
    />
    <ActivateInactivateServiceCenterDialog
      :StoreObj="StoreObj"
      :dialogActivateInactivateServiceCenter="
        dialogActivateInactivateServiceCenter
      "
      @clicked="dialogActivateInactivateServiceCenterEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Store/Service Center</div>
        <v-spacer></v-spacer>
        <v-select
          dense
          outlined
          label="Status"
          class="FontSize field_label_size field_height maxWidthXSmall mt-6"
          v-model="service_center_status"
          :items="service_center_statusItems"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          class="ml-2 FontSize field_label_size field_height maxWidth mt-6"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-tooltip
          color="primary"
          left
          v-if="
            $store.getters.get_user_type != 'AGENT' &&
            $store.getters.get_user_type != 'MANAGER'
          "
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              @click="
                (dialogCreateServiceCenter = true), (StoreObj.action = 'CREATE')
              "
              v-on="on"
              v-bind="attrs"
              class="gradient-bg white--text ml-2"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add Service Center</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          fixed-header
          :height="TableHeight"
          :headers="headers"
          :items="GetAllServiceCentersList"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
          :no-data-text="noDataText"
        >
          <template v-slot:[`item.service_center_name`]="{ item }">
            <div class="FontSize">{{ item.service_center_name }}</div>
          </template>
          <template v-slot:[`item.service_center_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.service_center_created_on * 1000).toLocaleString(
                  "en-GB"
                )
              }}
            </div>
          </template>
          <template v-slot:[`item.service_center_recognized`]="{ item }">
            <v-icon
              small
              :color="item.service_center_recognized == true ? 'green' : 'red'"
              >{{
                item.service_center_recognized == true
                  ? "mdi-check"
                  : "mdi-close"
              }}</v-icon
            >
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-menu right bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense nav>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-if="item.service_center_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'FLEET')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="teal">mdi-pandora</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>View Product Fleet</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.service_center_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'COMP')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="teal">mdi-lumx</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title
                        >View Components Available</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="item.service_center_status == 'ACTIVE'"
                    @click.stop="checkItem(item, 'EDIT')"
                  >
                    <v-list-item-icon>
                      <v-icon small color="primary">mdi-pencil-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title
                        >Service Center Details</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      $store.getters.get_user_type != 'AGENT' &&
                      $store.getters.get_user_type != 'MANAGER'
                    "
                    @click.stop="checkItem(item, 'ACTION')"
                  >
                    <v-list-item-icon>
                      <v-icon
                        :color="
                          item.service_center_status == 'ACTIVE'
                            ? 'red'
                            : 'green'
                        "
                        small
                        >{{
                          item.service_center_status == "ACTIVE"
                            ? "mdi-close-thick"
                            : "mdi-check"
                        }}</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content class="ml-n5">
                      <v-list-item-title>{{
                        item.service_center_status == "ACTIVE"
                          ? "Deactivate"
                          : "Activate"
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
import CreateServiceCenter from "@/components/ServiceCenter/Dialogs/CreateServiceCenter.vue";
import ViewProductFleetDialog from "@/components/ServiceCenter/Dialogs/ViewProductFleetDialog.vue";
import ViewCompAvailableDialog from "@/components/ServiceCenter/Dialogs/ViewCompAvailableDialog.vue";
import ActivateInactivateServiceCenterDialog from "@/components/ServiceCenter/Dialogs/ActivateInactivateServiceCenterDialog.vue";
export default {
  mixins: [GetAllServiceCenter],
  components: {
    Overlay,
    Snackbar,
    CreateServiceCenter,
    ViewProductFleetDialog,
    ViewCompAvailableDialog,
    ActivateInactivateServiceCenterDialog,
  },
  data: () => ({
    TableHeight: 0,
    search: "",
    current_view: "LIST",
    service_center_status: "ACTIVE",
    StoreObj: {},
    SnackBarComponent: {},
    overlay: false,
    renderComp: true,
    dialogCompAvailable: false,
    dialogFleetAvailable: false,
    dialogCreateServiceCenter: false,
    dialogActivateInactivateServiceCenter: false,
    territory_ids: [],
    service_center_statusItems: ["ACTIVE", "INACTIVE"],
    headers: [
      { text: "Name", value: "service_center_name" },
      { text: "Created On", value: "service_center_created_on" },
      { text: "Recognised", value: "service_center_recognized" },
      { text: "Actions", value: "Actions" },
    ],
  }),
  watch: {
    service_center_status() {
      this.search = '';
      this.GetAllServiceCentersMethod(
        this.service_center_status,
        this.territory_ids
      );
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllServiceCentersMethod(
      this.service_center_status,
      this.territory_ids
    );
  },
  methods: {
    dialogActivateInactivateServiceCenterEmit(Toggle) {
      this.dialogActivateInactivateServiceCenter = false;
      if (Toggle == 2) {
        this.GetAllServiceCentersMethod(
          this.service_center_status,
          this.territory_ids
        );
      }
    },
    dialogCreateServiceCenterEmit(Toggle) {
      this.dialogCreateServiceCenter = false;
      if (Toggle == 2) {
        this.GetAllServiceCentersMethod(
          this.service_center_status,
          this.territory_ids
        );
      }
    },
    dialogemit(Toggle) {
      if (Toggle == 1 && Toggle == 2) {
        this.dialogCompAvailable = false;
      }
      this.dialogCompAvailable = false;
    },
    dialogFleetemit(Toggle) {
      if (Toggle == 1 && Toggle == 2) {
        this.dialogFleetAvailable = false;
      }
      this.dialogFleetAvailable = false;
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT") {
        this.dialogCreateServiceCenter = true;
      } else if (action == "COMP") {
        this.dialogCompAvailable = true;
      } else if (action == "FLEET") {
        this.dialogFleetAvailable = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateServiceCenter = true;
      }
    },
  },
};
</script>
