import { ListSpecificTicketID } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetTicketDetails = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      TicketDetailsList: [],
    };
  },
  methods: {
    async TicketDetailsListMethod(ticket_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListSpecificTicketID, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              ticket_id: ticket_id,
            },
          })
        );
        this.TicketDetailsList = JSON.parse(
          result.data.ListSpecificTicketID
        ).data.items;
        console.log(" this.TicketDetailsList", this.TicketDetailsList);
        this.overlay = false;
        return this.TicketDetailsList;
      } catch (error) {
        this.overlay = false;
        this.TicketDetailsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
