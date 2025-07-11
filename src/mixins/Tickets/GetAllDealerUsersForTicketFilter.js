import { ListEnterpriseDealers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllDealersForTicketFilter = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetDealersListForTicketFilter: [],
    };
  },
  methods: {
    async GetDealersMethodForTicketFilter(
      user_type,
      user_status,
      partner_id,
      territory_id
    ) {
      try {
        this.overlay = true;
        this.loading = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          partner_id: partner_id ? partner_id : undefined,
          user_id: this.$store.getters.get_current_user_details.user_id,
          user_status: user_status,
          user_type,
          territory_id: territory_id == "ALL" ? undefined : territory_id,
        };
        let result = await API.graphql(
          graphqlOperation(ListEnterpriseDealers, {
            input: inputParams,
          })
        );
        this.GetDealersListForTicketFilter = JSON.parse(
          result.data.ListEnterpriseDealers
        ).data.items;
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" ||
          this.$route.name == "AttendenceReport"
        ) {
          this.GetDealersListForTicketFilter.unshift({
            user_name: "ALL",
            user_id: "ALL",
          });
        }
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetDealersListForTicketFilter = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
