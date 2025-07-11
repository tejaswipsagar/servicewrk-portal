import { ListWorkflowsOfQuotations } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllQuotationApprovals = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllQuotationApprovalsList: [],
    };
  },
  methods: {
    async GetAllQuotationApprovalsMethod(
      from_date,
      to_date,
      workflow_status,
      workflow_type,
      module_type
    ) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListWorkflowsOfQuotations, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              from_date: from_date,
              to_date: to_date,
              workflow_status: workflow_status,
              workflow_type: workflow_type,
              module_type: module_type,
            },
          })
        );
        this.GetAllQuotationApprovalsList = JSON.parse(
          result.data.ListWorkflowsOfQuotations
        ).data.items;
        console.log(this.GetAllQuotationApprovalsList, 'GetAllQuotationApprovalsList');
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllQuotationApprovalsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
