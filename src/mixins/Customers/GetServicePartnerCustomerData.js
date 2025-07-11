import { GetPartnerCustomers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const getServicePartnerCustomerData = {
  methods: {
    async getServicePartnerCustomerDataMethod(customerStatus, customerType) {
      try {
        const result = await API.graphql(
          graphqlOperation(GetPartnerCustomers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              customer_status: customerStatus,
              customer_type: customerType,
            },
          })
        );
        const response = JSON.parse(result.data.GetPartnerCustomers).data;
        return response;
      } catch (error) {
        //
        //
      }
    },
  },
};
