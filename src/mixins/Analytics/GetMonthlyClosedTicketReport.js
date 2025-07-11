import { GetMonthlyClosedTicketReport } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllMonthlyClosedTickets = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataText: "",
      GetAllMonthlyClosedTicketsList: [],
    };
  },
  methods: {
    async GetAllMonthlyClosedTicketsMethod() {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(GetMonthlyClosedTicketReport, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
            },
          })
        );
        this.GetAllMonthlyClosedTicketsList = JSON.parse(
          result.data.GetMonthlyClosedTicketReport
        ).items
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllMonthlyClosedTicketsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
