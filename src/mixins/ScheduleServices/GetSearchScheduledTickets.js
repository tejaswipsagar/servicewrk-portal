import { SearchScheduledTicket } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllScheduledServicesBySearch = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllSearchedScheduledServices: [],
    };
  },
  methods: {
    async GetAllSceduledTicketsBySearchMethod(
      field_value,
      field_name,
    ) {
      try {
        this.GetAllSearchedScheduledServices = [];
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(SearchScheduledTicket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              camparison_operator: "CONTAINS",
              field_value,
              field_name,
              ticket_status : "SCHEDULED"
            },
          })
        );
        this.GetAllSearchedScheduledServices = JSON.parse(
          result.data.SearchScheduledTicket
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllSearchedScheduledServices = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
