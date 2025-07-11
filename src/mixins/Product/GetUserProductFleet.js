import { GetOverallCustomersMap } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const GetUserProductFleetDetails = {
  methods: {
    async getUserProductFleet() {
      try {
        let inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
        };
        let result = await API.graphql(
          graphqlOperation(GetOverallCustomersMap, {
            input: inputParams,
          })
        );
        let ResultObj = JSON.parse(result.data.GetOverallCustomersMap).data;
        console.log("ResultObj", ResultObj);
        return ResultObj;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
