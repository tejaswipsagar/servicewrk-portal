import { ListTagProductOrComponentsToVendor } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const GetVendorTaggedList = {
  methods: {
    async GetVendorTaggedListMethod(VENDOR_ID, Tagged_Type, Status) {
      try {
        this.Tableloading = true;
        const result = await API.graphql(
          graphqlOperation(ListTagProductOrComponentsToVendor, {
            input: {
              user_id: this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              vendor_id: VENDOR_ID,
              tagged_type: Tagged_Type,
              tagged_product_status: Status,
            },
          })
        );

        const response = JSON.parse(
          result.data.ListTagProductOrComponentsToVendor
        ).data.items;
        console.log("LIST_VENDOR_Result", response);
        this.Tableloading = false;
        return response;
      } catch (error) {
        this.Tableloading = false;
        console.log("Error", error);
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
