import { List_Organizations_Settings } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllOrganizationSettings = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllWIPList: [],
      GetAllAMCList: [],
      GetAllCloseRemarks: [],
      GetAllCategoryList: [],
      GetAllLocationList: [],
    };
  },
  methods: {
    async GetAllOrganizationSettingsMethod(status, setting_type) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Organizations_Settings, {
            input: {
              organization_id: this.$store.getters.get_current_user_details.organization_id,
              setting_status: status,
              setting_type: setting_type,
            },
          })
        );
        let commonArray = JSON.parse(result.data.List_Organizations_Settings).data.items;
        for (let i = 0; i < commonArray.length; i++) {
          commonArray[i].status = commonArray[i].setting_status
        }
        switch (setting_type) {
          case "WIP_SUB_STAGE":
            this.GetAllWIPList = commonArray
            break;
          case "AMC":
            this.GetAllAMCList = commonArray;
            break;
          case "PROBLEM_DESCRIPTION":
            this.GetAllProblemDescription = commonArray
            this.GetProblem = this.GetAllProblemDescription.map((name) => name.setting_name)
            break;
          case "CLOSE_REMARKS":
            this.GetAllCloseRemarks = commonArray
            break;
          case "CUSTOMER_CATEGORY":
            this.GetAllCategoryList = commonArray
            break;
          case "LOCATION_MASTER":
            this.GetAllLocationList = commonArray
            break;
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllWIPList = [];
        this.GetAllAMCList = [];
        this.GetAllCloseRemarks = [];
        this.GetAllCategoryList = [];
        this.GetAllLocationList = [];
        this.GetAllProblemDescription = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};