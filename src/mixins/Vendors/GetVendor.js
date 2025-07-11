import { ListVendors } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const GetVendorList = {
  methods: {
    async GetVendorListMethod(VENDOR_STATUS) {
      try {
        const result = await API.graphql(
          graphqlOperation(ListVendors, {
            input: {
              user_id: this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              vendor_status: VENDOR_STATUS,
              limit: 50,
            },
          })
        );
        console.log(
          "LIST_VENDOR_DATA",
          JSON.parse(result.data.ListVendors).Data.items
        );
        const response = JSON.parse(result.data.ListVendors).Data.items;
        return response;
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
