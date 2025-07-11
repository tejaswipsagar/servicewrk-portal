import { ListCustomerVisits } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTechVisitsOnCustomer = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading: false,
      GetAllTechVisitsOnCustomerList: [],
    };
  },
  methods: {
    async GetAllTechVisitsOnCustomerMethod(customer_id) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListCustomerVisits, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: customer_id,
            },
          })
        );
        this.GetAllTechVisitsOnCustomerList = JSON.parse(
          result.data.ListCustomerVisits
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllTechVisitsOnCustomerList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
