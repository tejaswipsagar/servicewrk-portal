import { GetTaggedProductsOrComponentsIdsOfVendor } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const GetTaggedProductsIdsOfVendor = {
  methods: {
    async GetTaggedProductsIdsOfVendorMethod(
      VENDOR_ID,
      Tagged_Type,
      Product_Id,
      Category_Id
    ) {
      try {
        let inputParams = {
          user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          vendor_id: VENDOR_ID,
          tag_type: Tagged_Type,
          product_id: Product_Id,
          category_id: Category_Id,
        };
        console.log("bhshjbshj", inputParams);
        let result = await API.graphql(
          graphqlOperation(GetTaggedProductsOrComponentsIdsOfVendor, {
            input: inputParams,
          })
        );
        let response = JSON.parse(
          result.data.GetTaggedProductsOrComponentsIdsOfVendor
        ).data.items;
        console.log("LIST_VENDOR_Result", response);
        return response;
      } catch (error) {
        this.TableLoading = false;
        console.log("Error", error);
        // this.noDataText = error.errors[0].message;
      }
    },
  },
};
