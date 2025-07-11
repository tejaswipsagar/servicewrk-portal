import { SearchMRF } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllSearchedMRF = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      loading: false,
      WorkFlowList: [],
    };
  },
  methods: {
    async searchMRFMethod(workflow_status, field_value, APPROVAL_TYPE) {
      try {
        this.WorkFlowList = [];
        this.noDataText = "Please Wait Loading your Data..!";
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(SearchMRF, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              field_value: field_value,
              field_name: APPROVAL_TYPE,
              workflow_status: workflow_status,
            },
          })
        );
        this.WorkFlowList = JSON.parse(result.data.SearchMRF).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.WorkFlowList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
