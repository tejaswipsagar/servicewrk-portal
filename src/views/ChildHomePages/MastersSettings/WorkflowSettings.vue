<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-card class="elevation-0">
      <v-toolbar dense class="elevation-0">
        <div class="largeFontSizeNew">
          Settings
          <span class="PrimaryFontColorSmall">/Workflow Settings</span>
        </div>
      </v-toolbar>
      <v-col cols="12" md="3" class="mx-4">
        <v-checkbox
          v-model="enable_workflow_based_actions"
          color="primary"
          hide-details
          class="mt-n4"
        >
          <template v-slot:label>
            <strong class="primary--text"> Enable Workflow Setting </strong>
          </template>
        </v-checkbox>
      </v-col>
      <v-row no-gutters class="mx-4">
        <v-col cols="12" md="3">
          <v-select
            dense
            outlined
            label="Select Workflow Setting"
            v-model="select"
            :items="select_items"
            class="ml-3 mr-2 FontSize"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            dense
            outlined
            label="Workflow Users"
            v-model="workflow_users"
            :items="workflow_user_list"
            class="mr-2 FontSize"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="2" v-if="workflow_users == 'SPECIFIC_USERS'">
          <v-select
            dense
            outlined
            label="Users "
            v-model="users"
            :items="GetAllUsersList"
            item-text="user_name"
            item-value="user_id"
            class="mr-2 FontSize"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            label="Select Actions"
            v-model="workflow_actions"
            :items="workflow_actions_Items"
            dense
            multiple
            class="mr-2 FontSize"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="12" md="1">
          <v-btn
            @click="generate_workflow_data()"
            small
            class="mt-1 primary white--text"
          >
            <v-icon small>mdi-plus</v-icon>add
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="12" class="mx-4">
          <v-data-table
            :headers="workflow_settings_headers"
            :items="workflow_settings_items"
            :height="TableHeight"
            fixed-header
            dense
            :footer-props="{
              'items-per-page-options': [100, 200, 500],
            }"
            :items-per-page="100"
          >
            <template v-slot:[`item.create_action`]="{ item }">
              <div v-if="item.create_action == true" class="FontSize">
                <v-icon small color="green">mdi-check</v-icon>
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.update_action`]="{ item }">
              <div v-if="item.update_action == true" class="FontSize">
                <v-icon small color="green">mdi-check</v-icon>
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.activate_action`]="{ item }">
              <div v-if="item.activate_action == true" class="FontSize">
                <v-icon small color="green">mdi-check</v-icon>
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.deactivate_action`]="{ item }">
              <div v-if="item.deactivate_action == true" class="FontSize">
                <v-icon small color="green">mdi-check</v-icon>
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                @click="
                  workflow_settings_items.splice(
                    workflow_settings_items.indexOf(item),
                    1
                  )
                "
                v-if="item"
                small
                icon
              >
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="updateworkflow" :loading="isLoading" class="mr-6" color="primary" small>Save</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { Update_Enterprise_Details } from "@/graphql/mutations.js";
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
export default {
  mixins: [GetAllOrganizationSettingsTypesInMS],
  components: {
    Overlay,
    Snackbar,
  },
  data() {
    return {
      TableHeight:0,
      users: "",
      workflow_users: "",
      create: false,
      update: false,
      activate: false,
      checkbox: false,
      isLoading: false,
      renderComp : true,
      deactivate: false,
      enable_workflow_based_actions: false,
      select: [],
      GetAllUsersList: [],
      workflow_actions: [],
      workflow_settings_items: [],
      workflow_actions_Items: ["CREATE", "UPDATE", "ACTIVATE", "DEACTIVATE"],
      workflow_settings_headers: [
        { text: "Enabled Workflow", value: "module" },
        { text: "Create", value: "create_action" },
        { text: "Update", value: "update_action" },
        { text: "Deactivate", value: "deactivate_action" },
        { text: "Activate", value: "activate_action" },
        { text: "Actions", value: "actions" },
      ],
      workflow_user_list: [
        { text: "REPORTING MANAGER", value: "REPORTING_MANAGER" },
        {
          text: "REPORTING MANAGER AND ADMINS",
          value: "REPORTING_MANAGER_AND_ADMINS",
        },
        { text: "SPECIFIC USERS", value: "SPECIFIC_USERS" },
      ],
      select_items: [
        "CUSTOMER",
        "USER",
        "CATALOGUE",
        "TERRITORY",
        "COMPONENTS",
        "QUOTATION",
      ],
      StoreObj: {},
      SnackBarComponent: {},
    };
  },
  watch: {
    status(val) {
      this.GetAllOrganizationSettingsTypesMethod(val);
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 310;
    this.GetAllOrganizationSettingsTypesMethod(this.status);
  },
  methods: {
    generate_workflow_data() {
      var settings_obj = {};
      settings_obj = {
        create_action: this.workflow_actions.includes("CREATE") ? true : false,
        update_action: this.workflow_actions.includes("UPDATE") ? true : false,
        deactivate_action: this.workflow_actions.includes("DEACTIVATE")
          ? true
          : false,
        activate_action: this.workflow_actions.includes("ACTIVATE")
          ? true
          : false,
        module: this.select,
        approval_by: this.workflow_users,
        approval_by_user_ids: this.users,
      };
      this.workflow_settings_items.push(settings_obj);
    },
    async updateworkflow() {
      this.isLoading = true;
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          setting_action: "WORK_FLOW_SETTINGS",
          enable_workflow_based_actions: this.enable_workflow_based_actions,
          work_flow_modules: this.workflow_settings_items,
        };
        let result = await API.graphql(
          graphqlOperation(Update_Enterprise_Details, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.Update_Enterprise_Details);
        if (ResultObject.status == "SUCCESS") {
          this.GetAllOrganizationSettingsTypesMethod();
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.Status_Message,
          };
          this.renderComp = true;
          })
          this.AddServiceCatalogueEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
        this.renderComp = true;
        })
      }
    },
  },
};
</script>