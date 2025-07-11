import { ListDealerOrPartnerRFS } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetDealerInitiatedTicketList = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllRFTsList: [],
    };
  },
  methods: {
    async GetDealerInitiatedTicketListMethod(TICKET_STATUS) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListDealerOrPartnerRFS, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              ticket_status: TICKET_STATUS,
              limit: 100,
              next_token: undefined,
            },
          })
        );
        const response = JSON.parse(result.data.ListDealerOrPartnerRFS).data
          .items;
        this.overlay = false;
        return response;
      } catch (error) {
        this.overlay = false;
      }
    },
  },
};
