import { API, graphqlOperation } from "aws-amplify";
import { ListCustomerRFSTickets } from "@/graphql/queries.js";

export const ListCustomerRFS = {
  data: () => ({}),
  methods: {
    async ListCustomerRFSMethod(TicketStatus) {
      try {
        this.overlay = true;
        let inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          ticket_status: TicketStatus,
          limit: 200,
        };

        let result = await API.graphql(
          graphqlOperation(ListCustomerRFSTickets, {
            input: inputParams,
          })
        );
        let ResultObj = JSON.parse(result.data.ListCustomerRFSTickets).data
          .items;
        console.log("result", ResultObj);
        this.overlay = false;
        return ResultObj;
      } catch (error) {
        this.overlay = false;
        console.log("error", error);
      }
    },
  },
};
