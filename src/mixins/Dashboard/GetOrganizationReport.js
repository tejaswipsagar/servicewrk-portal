import {
  ListOrganizationsReport,
  ListDealersReport,
} from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetOrganizationReport = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      GetOrganizationReportList: [],
    };
  },
  methods: {
    async GetOrganizationReportMethod(from_date, to_date, report_type) {
      const queryName =
        this.$store.getters.get_user_type === "DEALER_OWNER" ||
        this.$store.getters.get_user_type === "DEALER_AGENT"
          ? ListDealersReport
          : ListOrganizationsReport;
      const queryNameString =
        this.$store.getters.get_user_type === "DEALER_OWNER" ||
        this.$store.getters.get_user_type === "DEALER_AGENT"
          ? "ListDealersReport"
          : "ListOrganizationsReport";
      try {
        this.overlay = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          from_date:
            new Date().toISOString().substr(0, 10) == this.date
              ? Date.now()
              : from_date,
          to_date:
            new Date().toISOString().substr(0, 10) == this.enddate
              ? Date.now()
              : to_date,
          report_type,
          user_id:
            this.$store.getters.get_current_user_details.user_type ==
              "DEALER_OWNER" ||
            this.$store.getters.get_current_user_details.user_type ==
              "DEALER_AGENT" ||
            this.$store.getters.get_current_user_details.user_type ==
              "SERVICE_PARTNER"
              ? this.$store.getters.get_current_user_details.user_id
              : undefined,
        };
        let result = await API.graphql(
          graphqlOperation(queryName, {
            input: inputParams,
          })
        );
        this.GetOrganizationReport = JSON.parse(
          result.data[queryNameString]
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetOrganizationReport = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
