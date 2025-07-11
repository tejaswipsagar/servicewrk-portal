import { GetDealersOrPartnerCustomers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const ListDealerCustomerData = {
  methods: {
    async ListDealerCustomerDataMethod(CUSTOMER_TYPE, CUSTOMER_STATUS) {
      try {
        this.overlay = true;
        const customerResult = await API.graphql(
          graphqlOperation(GetDealersOrPartnerCustomers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id:
                this.$store.getters.get_user_type === "DEALER_AGENT"
                  ? this.$store.getters.get_current_user_details.partner_id
                  : this.$store.getters.get_current_user_details.user_id,
              customer_type: CUSTOMER_TYPE,
              customer_status: CUSTOMER_STATUS,
            },
          })
        );
        console.log("CUSTOMER_RESULT", customerResult);
        const response = JSON.parse(
          customerResult.data.GetDealersOrPartnerCustomers
        ).data.items;
        this.overlay = false;
        return response;
      } catch (error) {
        this.overlay = false;
      }
    },
  },
};
