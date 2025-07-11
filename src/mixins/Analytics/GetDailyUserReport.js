import { ListUserDailyReport } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetUserDailyReport = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetUserDailyReportList: '',
    };
  },
  methods: {
    async GetUserDailyReportMethod(user_id,report_date) {
      try {
        this.overlay = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id,
          report_date,
        };
        let result = await API.graphql(
          graphqlOperation(ListUserDailyReport, {
            input: inputParams,
          })
        );
        this.GetUserDailyReportList = JSON.parse(
          result.data.ListUserDailyReport
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetUserDailyReportList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
