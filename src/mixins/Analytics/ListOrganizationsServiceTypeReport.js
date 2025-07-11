import { ListOrganizationsReport } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetOrganizationReport = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetOrganizationReportList: [],
    };
  },
  methods: {
    async GetOrganizationReportMethod(from_date, to_date, user_id) {
      try {
        this.overlay = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          from_date: from_date == undefined ? undefined : from_date,
          to_date: to_date == undefined ? undefined : to_date,
          report_type: "TICKET_SERVICE_TYPE",
          user_id : user_id
        };
        let result = await API.graphql(
          graphqlOperation(ListOrganizationsReport, {
            input: inputParams,
          })
        );
        this.GetOrganizationReport = JSON.parse(
          result.data.ListOrganizationsReport
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
