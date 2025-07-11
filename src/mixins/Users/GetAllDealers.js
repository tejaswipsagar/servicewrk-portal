import { ListEnterpriseDealers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllDealers = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetDealersList: [],
    };
  },
  methods: {
    async GetDealersMethod(user_type, user_status, partner_id, territory_id) {
      try {
        this.overlay = true;
        this.loading = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          partner_id,
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
        this.GetDealersList = JSON.parse(
          result.data.ListEnterpriseDealers
        ).data.items;
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" ||
          this.$route.name == "AttendenceReport"
        ) {
          this.GetDealersList.unshift({
            user_name: "ALL",
            user_id: "ALL",
          });
        }
        // if (
        //   this.$store.getters.get_user_type === "DEALER_OWNER" ||
        //   this.$store.getters.get_user_type === "DEALER_AGENT"
        // ) {
        //   this.GetDealersList = this.GetDealersList.map((item) => {
        //     if (item.user_id !== "ALL") {
        //       return item;
        //     }
        //   });
        // }
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetDealersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
