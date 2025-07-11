import { ListPincodeTypes } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const ListPincodeTypesMixins = {
  data: () => ({
    GetAllTerritoriesListArray: [],
  }),
  methods: {
    async ListPincodeTypes() {
      try {
        let inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
        };
        let result = await API.graphql(
          graphqlOperation(ListPincodeTypes, {
            input: inputParams,
          })
        );
        this.Pincodes_Items = JSON.parse(
          result.data.ListPincodeTypes
        ).data.items;
        this.GetAllTerritoriesListArray = this.Pincodes_Items;
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
