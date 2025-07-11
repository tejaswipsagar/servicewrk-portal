import { ListTicketWorkLogs } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllWorkHistory = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      WorkHistoryList: [],
    };
  },
  methods: {
    async GetAllWorkHistoryMethod(ticket_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListTicketWorkLogs, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              ticket_id: ticket_id,
            },
          })
        );
        this.WorkHistoryList = JSON.parse(
          result.data.ListTicketWorkLogs
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.WorkHistoryList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
