import { List_Organizations_Settings } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllOrganizationSetting = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllAMCTypeList: [],
    };
  },
  methods: {
    async GetAllAMCTypeMethod(status, support_type) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Organizations_Settings, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_type: "AMC",
              setting_status: status,
              support_type: support_type == "CONTRACT" ? "AMC" : support_type,
            },
          })
        );
        this.GetAllAMCTypeList = JSON.parse(
          result.data.List_Organizations_Settings
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllAMCTypeList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
