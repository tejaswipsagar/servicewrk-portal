import { List_Organizations_Settings } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllProblemDescription = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetProblem: [],
      GetAllProblemDescriptionList: [],
    };
  },
  methods: {
    async GetAllProblemDescriptionMethod(setting_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Organizations_Settings, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_type: "PROBLEM_DESCRIPTION",
              setting_status: setting_status,
            },
          })
        );
        this.GetAllProblemDescriptionList = JSON.parse(
          result.data.List_Organizations_Settings
        ).data.items;
        this.GetProblem = this.GetAllProblemDescriptionList.map((name) => name.setting_name)
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllProblemDescriptionList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
