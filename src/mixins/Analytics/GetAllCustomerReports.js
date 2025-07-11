import { ListCustomerExcelOfOrganization } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const getAllCustomerReportData = {
  methods: {
    async getAllCustomerReportDataMethod() {
      try {
        const result = await API.graphql(
          graphqlOperation(ListCustomerExcelOfOrganization, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
            },
          })
        );

        const response = JSON.parse(
          result.data.ListCustomerExcelOfOrganization
        ).items;
        return response;
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
