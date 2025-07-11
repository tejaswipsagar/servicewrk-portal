import { SearchTickets } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTicketsBySearch = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllSearchedTickets: [],
    };
  },
  methods: {
    async GetAllTicketsBySearchMethod(
      field_value,
      field_name,
      ticket_status,
      search_type
    ) {
      console.log("INSIDE_METHOD");
      try {
        this.GetAllSearchedTickets = [];
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(SearchTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              camparison_operator: "CONTAINS",
              field_value,
              field_name,
              ticket_type: "ASSIGNED_TICKET",
              ticket_status,
              search_type,
            },
          })
        );
        this.GetAllSearchedTickets = JSON.parse(
          result.data.SearchTickets
        ).data.items;
        this.overlay = false;
        this.ticketFetched = true;
        console.log("MAIN", this.ticketFetched);
        return true;
      } catch (error) {
        console.log("BABY");
        this.overlay = false;
        this.GetAllSearchedTickets = [];
        return false;
      }
    },
  },
};
