import { GetCustomerDetails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllCustomerDetails = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetCustomerDetails: [],
    };
  },
  methods: {
    async GetAllCustomerDetailsMethod(customer_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(GetCustomerDetails, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: customer_id,
            },
          })
        );
        this.GetCustomerDetails = JSON.parse(
          result.data.GetCustomerDetails
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetCustomerDetails = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
