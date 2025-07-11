import { ListOrganizationsReport } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetOrganizationReport = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading: false,
      GetOrganizationReportList: [],
    };
  },
  methods: {
    async GetOrganizationReportMethod(
      report_type,
      representative_id,
      service_name,
      ticket_creation_type,
      list_aging_action_type,
      user_id
    ) {
      try {
        this.overlay = true;
        this.loading = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          report_type,
          representative_id,
          service_name,
          ticket_creation_type,
          list_aging_action_type,
          user_id
        };
        let result = await API.graphql(
          graphqlOperation(ListOrganizationsReport, {
            input: inputParams,
          })
        );
        if (this.list_aging_action_type == "SERVICE_TYPE") {
          this.GetOrganizationReport = JSON.parse(
            result.data.ListOrganizationsReport
          ).data.items;
        } else if (this.list_aging_action_type == "USER") {
          this.GetOrganizationReportUser = JSON.parse(
            result.data.ListOrganizationsReport
          ).data.items;
        } else {
          this.GetOrganizationReportTicketType = JSON.parse(
            result.data.ListOrganizationsReport
          ).data.items;
        }
        for (let i = 0; i < this.GetOrganizationReport.length; i++) {
          if (
            this.GetOrganizationReport[i].between_0_to_1_ticket_details !=
              undefined &&
            this.GetOrganizationReport[i].between_0_to_1_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReport[
              i
            ].between_0_to_1_ticket_details_ticket_ids =
              this.GetOrganizationReport[i].between_0_to_1_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReport[i].between_1_to_2_ticket_details !=
              undefined &&
            this.GetOrganizationReport[i].between_1_to_2_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReport[
              i
            ].between_1_to_2_ticket_details_ticket_ids =
              this.GetOrganizationReport[i].between_1_to_2_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReport[i].between_3_to_5_ticket_details !=
              undefined &&
            this.GetOrganizationReport[i].between_3_to_5_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReport[
              i
            ].between_3_to_5_ticket_details_ticket_ids =
              this.GetOrganizationReport[i].between_3_to_5_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReport[i].between_5_to_7_ticket_details !=
              undefined &&
            this.GetOrganizationReport[i].between_5_to_7_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReport[
              i
            ].between_5_to_7_ticket_details_ticket_ids =
              this.GetOrganizationReport[i].between_5_to_7_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReport[i].between_7_to_15_ticket_details !=
              undefined &&
            this.GetOrganizationReport[i].between_7_to_15_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReport[
              i
            ].between_7_to_15_ticket_details_ticket_ids =
              this.GetOrganizationReport[i].between_7_to_15_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReport[i].greater_than_15_ticket_details !=
              undefined &&
            this.GetOrganizationReport[i].greater_than_15_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReport[
              i
            ].greater_than_15_ticket_details_ticket_ids =
              this.GetOrganizationReport[i].greater_than_15_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
        }
        for (let i = 0; i < this.GetOrganizationReportUser.length; i++) {
          if (
            this.GetOrganizationReportUser[i].between_0_to_1_ticket_details !=
              undefined &&
            this.GetOrganizationReportUser[i].between_0_to_1_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReportUser[
              i
            ].between_0_to_1_ticket_details_ticket_ids =
              this.GetOrganizationReportUser[i].between_0_to_1_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportUser[i].between_1_to_2_ticket_details !=
              undefined &&
            this.GetOrganizationReportUser[i].between_1_to_2_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReportUser[
              i
            ].between_1_to_2_ticket_details_ticket_ids =
              this.GetOrganizationReportUser[i].between_1_to_2_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportUser[i].between_3_to_5_ticket_details !=
              undefined &&
            this.GetOrganizationReportUser[i].between_3_to_5_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReportUser[
              i
            ].between_3_to_5_ticket_details_ticket_ids =
              this.GetOrganizationReportUser[i].between_3_to_5_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportUser[i].between_5_to_7_ticket_details !=
              undefined &&
            this.GetOrganizationReportUser[i].between_5_to_7_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReportUser[
              i
            ].between_5_to_7_ticket_details_ticket_ids =
              this.GetOrganizationReportUser[i].between_5_to_7_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportUser[i].between_7_to_15_ticket_details !=
              undefined &&
            this.GetOrganizationReportUser[i].between_7_to_15_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReportUser[
              i
            ].between_7_to_15_ticket_details_ticket_ids =
              this.GetOrganizationReportUser[i].between_7_to_15_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportUser[i].greater_than_15_ticket_details !=
              undefined &&
            this.GetOrganizationReportUser[i].greater_than_15_ticket_details
              .length != 0
          ) {
            this.GetOrganizationReportUser[
              i
            ].greater_than_15_ticket_details_ticket_ids =
              this.GetOrganizationReportUser[i].greater_than_15_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
        }
        for (let i = 0; i < this.GetOrganizationReportTicketType.length; i++) {
          if (
            this.GetOrganizationReportTicketType[i]
              .between_0_to_1_ticket_details != undefined &&
            this.GetOrganizationReportTicketType[i]
              .between_0_to_1_ticket_details.length != 0
          ) {
            this.GetOrganizationReportTicketType[
              i
            ].between_0_to_1_ticket_details_ticket_ids =
              this.GetOrganizationReportTicketType[
                i
              ].between_0_to_1_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportTicketType[i]
              .between_1_to_2_ticket_details != undefined &&
            this.GetOrganizationReportTicketType[i]
              .between_1_to_2_ticket_details.length != 0
          ) {
            this.GetOrganizationReportTicketType[
              i
            ].between_1_to_2_ticket_details_ticket_ids =
              this.GetOrganizationReportTicketType[
                i
              ].between_1_to_2_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportTicketType[i]
              .between_3_to_5_ticket_details != undefined &&
            this.GetOrganizationReportTicketType[i]
              .between_3_to_5_ticket_details.length != 0
          ) {
            this.GetOrganizationReportTicketType[
              i
            ].between_3_to_5_ticket_details_ticket_ids =
              this.GetOrganizationReportTicketType[
                i
              ].between_3_to_5_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportTicketType[i]
              .between_5_to_7_ticket_details != undefined &&
            this.GetOrganizationReportTicketType[i]
              .between_5_to_7_ticket_details.length != 0
          ) {
            this.GetOrganizationReportTicketType[
              i
            ].between_5_to_7_ticket_details_ticket_ids =
              this.GetOrganizationReportTicketType[
                i
              ].between_5_to_7_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportTicketType[i]
              .between_7_to_15_ticket_details != undefined &&
            this.GetOrganizationReportTicketType[i]
              .between_7_to_15_ticket_details.length != 0
          ) {
            this.GetOrganizationReportTicketType[
              i
            ].between_7_to_15_ticket_details_ticket_ids =
              this.GetOrganizationReportTicketType[
                i
              ].between_7_to_15_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
          if (
            this.GetOrganizationReportTicketType[i]
              .greater_than_15_ticket_details != undefined &&
            this.GetOrganizationReportTicketType[i]
              .greater_than_15_ticket_details.length != 0
          ) {
            this.GetOrganizationReportTicketType[
              i
            ].greater_than_15_ticket_details_ticket_ids =
              this.GetOrganizationReportTicketType[
                i
              ].greater_than_15_ticket_details
                .map((item) => item.ticket_id)
                .join();
          }
        }
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetOrganizationReport = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
