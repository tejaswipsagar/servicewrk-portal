import { GetCountOfCustomerTickets } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTicketsBasedOnCustomer = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      isLoading: false,
      GetAllTicketsBasedOnCustomerList: [],
    };
  },
  methods: {
    async GetAllTicketsBasedOnCustomerMethod(customer_id) {
      try {
        this.overlay = true;
        this.isLoading = true;
        let result = await API.graphql(
          graphqlOperation(GetCountOfCustomerTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: customer_id,
            },
          })
        );
        this.GetAllTicketsBasedOnCustomerList = JSON.parse(
          result.data.GetCountOfCustomerTickets
        ).data.items;
        this.ActiveTicketsCount =
          this.GetAllTicketsBasedOnCustomerList[0].customer_open_tickets_length;
        this.ClosedTicketsCount =
          this.GetAllTicketsBasedOnCustomerList[0].customer_close_tickets_length;
        this.overlay = false;
        this.isLoading = false;
      } catch (error) {
        this.overlay = false;
        this.isLoading = false;
        this.ActiveTicketsCount = 0;
        this.ClosedTicketsCount = 0;
        this.GetAllTicketsBasedOnCustomerList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
