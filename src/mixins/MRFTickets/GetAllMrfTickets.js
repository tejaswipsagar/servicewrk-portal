import { ListMRFTickets } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllMrfTickets = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      next_token: "",
      ResultObj: [],
      GetAllMrfTicketsList: [],
    };
  },
  methods: {
    async GetAllMrfTicketsMethod(
      from_date,
      to_date,
      service_id,
      service_type_id,
      ticket_creation_type,
      next_token
    ) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListMRFTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              from_date: from_date,
              to_date: to_date,
              service_id: service_id,
              service_type_id: service_type_id,
              ticket_creation_type: ticket_creation_type,
              next_token: next_token,
              limit: 51
            },
          })
        );
        var ResultObj = JSON.parse(result.data.ListMRFTickets);
        if (ResultObj.status == "SUCCESS") {
          if (!this.next_token) {
            this.GetAllMrfTicketsList = [];
            this.GetAllMrfTicketsList = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllMrfTicketsList.push({
                ...ResultObj.data.items[i],
              });
            }
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          }
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllMrfTicketsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
