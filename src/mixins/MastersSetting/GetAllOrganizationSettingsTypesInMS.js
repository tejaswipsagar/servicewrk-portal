import { Get_Enterprise_Details } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllOrganizationSettingsTypesInMS = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      time_setting: {},
      GetAllOrganizationSettingsTypesObject: {},
    };
  },
  methods: {
    async GetAllOrganizationSettingsTypesMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(Get_Enterprise_Details, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
            },
          })
        );
        this.GetAllOrganizationSettingsTypesObject = JSON.parse(
          result.data.Get_Enterprise_Details
        ).data.items;
        this.masterCategoryItems =
          this.GetAllOrganizationSettingsTypesObject.master_categories_list;
        this.categoryItems =
          this.GetAllOrganizationSettingsTypesObject.categories_list;
        this.Ticket_Visibility =
          this.GetAllOrganizationSettingsTypesObject.enable_manual_territory_tagging;
        this.sortedCategoryItems = this.categoryItems.sort((a, b) =>
          a.category_name > b.category_name ? 1 : -1
        );
        this.ticket_settings = {
          active_ticket_count:
            this.GetAllOrganizationSettingsTypesObject.active_ticket_count,
          reopen_ticket:
            this.GetAllOrganizationSettingsTypesObject.reopen_ticket,
          enable_ticket_creation:
            this.GetAllOrganizationSettingsTypesObject.enable_ticket_creation,
          enable_ticket_close:
            this.GetAllOrganizationSettingsTypesObject.enable_ticket_close,
          reopen_ticket_duration:
            this.GetAllOrganizationSettingsTypesObject.reopen_ticket_duration,
          sort_ticket_by:
            this.GetAllOrganizationSettingsTypesObject.sort_ticket_by,
          enable_to_rise_ticket:
            this.GetAllOrganizationSettingsTypesObject
              .enable_dealer_ticket_creation,
          enable_manual_territory_tagging:
            this.GetAllOrganizationSettingsTypesObject
              .enable_manual_territory_tagging,
          enable_ticket_components_request:
            this.GetAllOrganizationSettingsTypesObject
              .enable_ticket_components_request,
          default_customer_type:
            this.GetAllOrganizationSettingsTypesObject.default_customer_type,
          product_repair_or_replacement:
            this.GetAllOrganizationSettingsTypesObject
              .product_repair_or_replacement,
          allow_otp_proxy:
            this.GetAllOrganizationSettingsTypesObject.allow_otp_proxy,
          is_access_control_enable:
            this.$store.getters.get_current_user_details.organization_details
              .is_access_control_enable,
          is_attachment_mandatory:
            this.$store.getters.get_current_user_details.organization_details
              .is_attachment_mandatory,
          number_of_attachments_required:
            this.$store.getters.get_current_user_details.organization_details
              .number_of_attachments_required,
        };
        this.manager =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.manager;
        this.agent =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.agent;
        this.representative =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.representative;
        this.service_partner =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.service_partner;
        this.partner_agent =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.partner_agent;
        this.partner_representative =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.partner_representative;
        this.nsm =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility
            .nsm != undefined
            ? this.GetAllOrganizationSettingsTypesObject
                .ticket_history_visibility.nsm
            : false;
        this.rsm =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility
            .rsm != undefined
            ? this.GetAllOrganizationSettingsTypesObject
                .ticket_history_visibility.rsm
            : false;
        this.dealer_agent =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.dealer_agent;
        this.dealer_owner =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.dealer_owner;
        this.dealer_representative =
          this.GetAllOrganizationSettingsTypesObject.ticket_history_visibility.dealer_representative;
        this.time_setting.auto_logout_time =
          this.GetAllOrganizationSettingsTypesObject.automatic_log_out_time;
        this.time_setting.itemsssss =
          this.GetAllOrganizationSettingsTypesObject.weekly_offs;
        this.time_setting.holidaydate =
          this.GetAllOrganizationSettingsTypesObject.holiday_dates;
        this.url =
          this.GetAllOrganizationSettingsTypesObject.organization_logo_url;
        this.enablecomponent =
          this.GetAllOrganizationSettingsTypesObject.enable_component_inventory;
        this.org_address =
          this.GetAllOrganizationSettingsTypesObject.organization_address;
        this.orgContNumber =
          this.GetAllOrganizationSettingsTypesObject.organization_contact_numbers;
        this.orgEmailId =
          this.GetAllOrganizationSettingsTypesObject.organization_email_id;
        this.workflow_settings_items =
          this.GetAllOrganizationSettingsTypesObject.work_flow_modules;
        this.overlay = false;
        return "SUCCESS";
      } catch (error) {
        console.log(error);
        this.overlay = false;
        this.GetAllOrganizationSettingsTypesList = [];
        return "SUCCESS";
      }
    },
  },
};
