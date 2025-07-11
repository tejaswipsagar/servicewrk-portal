<template>
  <div>
    <Overlay :overlay="overlay" />
    <DealerUserDialog
      :CreateDealerUserDialog="CreateDealerUserDialog"
      :StoreObj="StoreObj"
      @clicked="CreateDealerUserDialogEmit"
    />
    <ActivateDeactiveDealers
      :StoreObj="StoreObj"
      :dialogActivateInactivateDealers="dialogActivateInactivateDealers"
      @clicked="dialogActivateInactivateUserEmit"
    />
    <DeleteRepsDialog
      :dialogDeleteReps="dialogDeleteReps"
      :StoreObj="StoreObj"
      @clicked="dialogDeleteRepsEmit"
    />
    <v-card elevation="0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">Dealer Representatives</div>
        <v-spacer />
        <v-select
          dense
          outlined
          class="mt-7 FontSize maxWidthXSmall mr-2"
          label="User Status"
          v-model="user_status"
          :items="user_statusItems"
        ></v-select>
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-7 FontSize maxWidthSmall"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              @click="
                (CreateDealerUserDialog = true),
                  (StoreObj.action = 'CREATE_DEALER_REP_FROM_DEALER_PORTAL')
              "
              v-on="on"
              v-bind="attrs"
              v-show="showCreateButton"
              class="gradient-bg white--text ml-2"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </template>
          <span class="white--text">Add User</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text>
        <v-data-table
          dense
          :search="search"
          :headers="headers"
          fixed-header
          :height="TableHeight"
          :items="GetDealersList"
          :no-data-text="noDataText"
          :footer-props="{
            'items-per-page-options': [100, 200, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.user_name`]="{ item }">
            <div class="FontSize">{{ item.user_name }}</div>
          </template>
          <template v-slot:[`item.user_full_number`]="{ item }">
            <div class="FontSize">{{ item.user_full_number }}</div>
          </template>
          <template v-slot:[`item.app_version`]="{ item }">
            <v-icon v-if="item.mobile_type == 'IOS'" size="25px"
              >mdi-apple</v-icon
            >
            <v-icon
              v-else-if="item.mobile_type == 'ANDROID'"
              size="25px"
              color="green"
              >mdi-android</v-icon
            >
            <span v-else color="black" class="ml-2 mr-2"> - </span>
            <span class="ml-3 caption">{{ item.app_version }}</span>
          </template>
          <template v-slot:[`item.user_created_on`]="{ item }">
            <div class="FontSize">
              {{
                new Date(item.user_created_on * 1000).toLocaleString("en-GB")
              }}
            </div>
          </template>
          <template v-slot:[`item.reporter_email_id`]="{ item }">
            <div class="FontSize" v-if="item.reporter_email_id != undefined">
              {{ item.reporter_email_id }}
            </div>
            <div v-else>-</div>
          </template>
          <template
            v-slot:[`item.Actions`]="{ item }"
            v-if="
              this.$store.getters.get_user_type != 'OWNER' &&
              this.$store.getters.get_user_type != 'ADMIN' &&
              this.$store.getters.get_current_user_details.organization_details
                .is_access_control_enable == true
            "
          >
            <v-tooltip
              bottom
              color="primary"
              v-if="item.user_status == 'ACTIVE'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  @click.stop="
                    checkItem(item, 'EDIT_DEALER_REP_FROM_DEALER_PORTAL')
                  "
                  color="primary"
                  small
                  v-show="showEditButton"
                  v-on="on"
                  class="mr-2"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span class="white--text">Edit Technician</span>
            </v-tooltip>
            <v-tooltip
              bottom
              v-if="
                item.user_id !=
                  $store.getters.get_current_user_details.user_id &&
                item.user_status != 'INVITED' &&
                $store.getters.get_user_type != 'AGENT' &&
                $store.getters.get_user_type != 'MANAGER'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  v-show="showActivateDeactivateButton"
                  :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon>
                    {{
                      item.user_status == "ACTIVE"
                        ? "mdi-account-cancel"
                        : "mdi-account-plus"
                    }}</v-icon
                  ></v-btn
                >
              </template>
              <span
                v-text="
                  item.user_status == 'ACTIVE'
                    ? `Deactivate ${item.user_name}`
                    : `Activate ${item.user_name}`
                "
              ></span>
            </v-tooltip>
            <v-btn
              v-if="item.user_status == 'INVITED'"
              icon
              color="red"
              @click="checkItem(item, 'DELETE')"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </template>
          <template v-slot:[`item.Actions`]="{ item }" v-else>
            <v-tooltip
              bottom
              color="primary"
              v-if="item.user_status == 'ACTIVE'"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  @click.stop="
                    checkItem(item, 'EDIT_DEALER_REP_FROM_DEALER_PORTAL')
                  "
                  color="primary"
                  small
                  v-on="on"
                  class="mr-2"
                >
                  mdi-pencil-plus
                </v-icon>
              </template>
              <span class="white--text">Edit Technician</span>
            </v-tooltip>
            <v-tooltip
              bottom
              v-if="
                item.user_id !=
                  $store.getters.get_current_user_details.user_id &&
                item.user_status != 'INVITED' &&
                $store.getters.get_user_type != 'AGENT' &&
                $store.getters.get_user_type != 'MANAGER'
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon>
                    {{
                      item.user_status == "ACTIVE"
                        ? "mdi-account-cancel"
                        : "mdi-account-plus"
                    }}</v-icon
                  ></v-btn
                >
              </template>
              <span
                v-text="
                  item.user_status == 'ACTIVE'
                    ? `Deactivate ${item.user_name}`
                    : `Activate ${item.user_name}`
                "
              ></span>
            </v-tooltip>
            <v-btn
              v-if="item.user_status == 'INVITED'"
              icon
              color="red"
              @click="checkItem(item, 'DELETE')"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import DealerUserDialog from "@/components/Users/Dialogs/Dealer/DealerUserDialog.vue";
import DeleteRepsDialog from "@/components/Users/Dialogs/EnterpriseTechnicians/DeleteRepsDialog.vue";
import ActivateDeactiveDealers from "@/components/Users/Dialogs/Dealer/ActivateDeactiveDealers.vue";
export default {
  mixins: [GetAllDealers],
  components: {
    Overlay,
    DealerUserDialog,
    DeleteRepsDialog,
    ActivateDeactiveDealers,
  },
  data: () => ({
    search: "",
    noDataText: "",
    current_view: "LIST",
    user_status: "ACTIVE",
    TableHeight: 0,
    overlay: false,
    showEditButton: false,
    showCreateButton: false,
    dialogDeleteReps: false,
    CreateDealerUserDialog: false,
    showActivateDeactivateButton: false,
    dialogActivateInactivateDealers: false,
    StoreObj: {},
    tableData: [],
    tableHeader: [],
    GetDealersList: [],
    GetAllUsersList: [],
    user_statusItems: ["ACTIVE", "INACTIVE", "INVITED"],
    headers: [
      {
        text: "Name",
        fixed: true,
        value: "user_name",
      },
      { text: "Contact Number", value: "user_full_number" },
      { text: "Device/App Version", value: "app_version" },
      { text: "Created On", value: "user_created_on" },
      { text: "Reporting To", value: "reporter_email_id" },
      { text: "Actions", value: "Actions" },
    ],
  }),
  watch: {
    user_status(val) {
      this.GetDealersMethod(
        "DEALER_TECHNICIAN",
        val,
        this.$store.getters.get_current_user_details.partner_id,
        undefined
      );
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAccessModuleMethod();
    this.GetDealersMethod(
      "DEALER_TECHNICIAN",
      this.user_status,
      this.$store.getters.get_current_user_details.partner_id,
      undefined
    );
    this.user_status = "ACTIVE";
  },
  methods: {
    GetAccessModuleMethod() {
      console.log(
        "Module Details",
        this.$store.getters.get_access_module_details
      );
      let ModuleDetails = this.$store.getters.get_access_module_details;
      if (
        this.$store.getters.get_user_type != "ADMIN" &&
        this.$store.getters.get_user_type != "OWNER" &&
        this.$store.getters.get_user_type != "DEALER_OWNER" &&
        this.$store.getters.get_current_user_details.organization_details
          .is_access_control_enable == true
      ) {
        ModuleDetails.map((item) => {
          if (item.module_name == "Enterprise Technicians") {
            item.module_rights.map((moduleRights) => {
              if (moduleRights.CREATE == true) {
                this.showCreateButton = true;
              }
              if (moduleRights.EDIT == true) {
                this.showEditButton = true;
              }
              if (moduleRights.DELETE == true) {
                this.showActivateDeactivateButton = true;
              }
            });
          }
        });
      } else {
        this.showCreateButton = true;
        this.showEditButton = true;
        this.showActivateDeactivateButton = true;
      }
    },
    dialogDeleteRepsEmit(Toggle) {
      this.dialogDeleteReps = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          "DEALER_TECHNICIAN",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id,
          undefined
        );
      }
    },
    CreateDealerUserDialogEmit(Toggle) {
      this.CreateDealerUserDialog = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          "DEALER_TECHNICIAN",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id,
          undefined
        );
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "EDIT_DEALER_REP_FROM_DEALER_PORTAL") {
        this.CreateDealerUserDialog = true;
      } else if (action == "ACTION") {
        this.dialogActivateInactivateDealers = true;
      } else if (action == "DELETE") {
        this.dialogDeleteReps = true;
      }
    },
    dialogAddUserEmit(Toggle) {
      this.dialogAddUser = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          "DEALER_TECHNICIAN",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id,
          undefined
        );
      }
    },
    dialogActivateInactivateUserEmit(Toggle) {
      this.dialogActivateInactivateDealers = false;
      if (Toggle == 2) {
        this.GetDealersMethod(
          "DEALER_TECHNICIAN",
          this.user_status,
          this.$store.getters.get_current_user_details.partner_id,
          undefined
        );
      }
    },
  },
};
</script>