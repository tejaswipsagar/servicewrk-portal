import { GetTotalDistanceForTicket } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetDistanceForIndividualTicket = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataText: "",
      GetDistanceForIndividualTicketList: [],
    };
  },
  methods: {
    async GetDistanceForIndividualTicketMethod(ticket_id, visitDate) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(GetTotalDistanceForTicket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              ticket_id: ticket_id,
              visitDate : visitDate,
            },
          })
        );
        this.GetDistanceForIndividualTicketList = JSON.parse(
          result.data.GetTotalDistanceForTicket
        ).total_distance_travelled;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetDistanceForIndividualTicketList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
