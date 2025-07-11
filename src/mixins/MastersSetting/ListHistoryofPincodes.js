import { ListParticularHistory } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const ListPincodeHistory = {
  data: () => ({}),
  methods: {
    async ListPincodeHistoryMethod(Pincode_Id) {
      try {
        let inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          history_id: Pincode_Id,
          limit: 100,
        };

        let result = await API.graphql(
          graphqlOperation(ListParticularHistory, {
            input: inputParams,
          })
        );
        let ResultObj = JSON.parse(result.data.ListParticularHistory).data
          .items;
        console.log("leeet", ResultObj);
        return ResultObj;
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
