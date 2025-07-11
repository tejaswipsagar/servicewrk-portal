import { API, graphqlOperation } from "aws-amplify";
import { ListIndividualOrBusinessCustomers } from "@/graphql/queries.js";
export const GetAllCustomersList = {
  data: () => ({
    overlay: false,
    loading: false,
    noDataText: "",
    active_customers: "",
    business_customers: "",
    individual_customers: "",
    ResultObj: [],
    GetAllCustomersData: [],
  }),
  methods: {
    async GetAllCustomersListMethod(
      customer_status,
      customer_type,
      next_token
    ) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListIndividualOrBusinessCustomers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              customer_status: customer_status,
              customer_type: customer_type,
              location_type: "PRIMARY",
              next_token: next_token,
              limit: 51,
            },
          })
        );
        var ResultObj = JSON.parse(
          result.data.ListIndividualOrBusinessCustomers
        );
        if (ResultObj.status === "SUCCESS") {
          if (!this.next_token) {
            this.GetAllCustomersData = [];
            this.GetAllCustomersData = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
            this.individual_customers = ResultObj.data.individual_customers;
            this.business_customers = ResultObj.data.business_customers;
            this.active_customers = ResultObj.data.active_customers;
            this.inactive_customers = ResultObj.data.inactive_customers;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllCustomersData.push({ ...ResultObj.data.items[i] });
            }
            this.next_token = ResultObj.data.next_token;
          }
          this.overlay = false;
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.overlay = false;
        this.loading = false;
        this.GetAllCustomersData = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
