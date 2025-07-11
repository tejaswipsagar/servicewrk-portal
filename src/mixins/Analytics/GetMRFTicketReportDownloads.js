import { ListExcelGeneratesOfMRF } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllMRFTickets = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataText: "",
      GetAllMonthlyMRFList: [],
      GetAllCustomMRFReport: [],
      GetAllCurrentDayReport: [],
      GetAllMonthlyMRFReport: [],
    };
  },
  methods: {
    async GetAllMRFDetailsMethod(list_type) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListExcelGeneratesOfMRF, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              list_type: list_type,
            },
          })
        );
        this.GetAllMonthlyMRFList = JSON.parse(
          result.data.ListExcelGeneratesOfMRF
        ).items;
        this.overlay = false;
        this.loading = false;
        this.GetAllCustomMRFReport = this.GetAllMonthlyMRFList[0].CUSTOM;
        this.GetAllMonthlyMRFReport = this.GetAllMonthlyMRFList[0].MONTHLY;
        this.GetAllCurrentDayReport = this.GetAllMonthlyMRFList[0].CURRENT_DAY;
        console.log("CURRENT_DAY", this.GetAllCurrentDayReport);
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllMonthlyMRFList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
