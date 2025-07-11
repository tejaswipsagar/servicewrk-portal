import { SearchCustomer } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllCustomerBySearch = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      loading : false,
      GetAllSearchCustomerList: [],
    };
  },
  methods: {
    async GetAllCustomerBySearchMethod(
      customer_status,
      field_value,
      field_name,
      customer_type
    ) {
      try {
        this.GetAllSearchCustomerList = [];
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(SearchCustomer, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              location_type: "PRIMARY",
              camparison_operator: "CONTAINS",
              customer_status,
              field_value,
              field_name,
              customer_type,
            },
          })
        );
        this.GetAllSearchCustomerList = JSON.parse(
          result.data.SearchCustomer
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllSearchCustomerList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
