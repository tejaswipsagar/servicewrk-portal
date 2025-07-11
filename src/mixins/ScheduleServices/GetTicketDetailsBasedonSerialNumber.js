import { ListSerialNoBasedTickets } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTicketDetails = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading: false,
      GetAllTicketDetailsList: [],
    };
  },
  methods: {
    async GetAllTicketDetailsMethod(service_serial_number) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListSerialNoBasedTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              service_serial_number: service_serial_number,
            },
          })
        );
        this.GetAllTicketDetailsList = JSON.parse(
          result.data.ListSerialNoBasedTickets
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllTicketDetailsList = [];
        this.noDataText = "No Tickets Available";
      }
    },
  },
};
