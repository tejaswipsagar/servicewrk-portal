import { GetNearestCustomers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllNearestCustomers = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllNearestCustomersList: [],
    };
  },
  methods: {
    async GetAllNearestCustomersMethod(customer_latitude, customer_longitude) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(GetNearestCustomers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_latitude: customer_latitude,
              customer_longitude: customer_longitude,
            },
          })
        );
        this.GetAllNearestCustomersList = JSON.parse(
          result.data.GetNearestCustomers
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllNearestCustomersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
