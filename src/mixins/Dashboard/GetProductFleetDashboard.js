import { ListRepresentivesProductFleet } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetProductFleetDashboard = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading: false,
      GetProductFleetDashboardList: [],
    };
  },
  methods: {
    async GetProductFleetDashboardMethod() {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListRepresentivesProductFleet, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
            },
          })
        );
        this.GetProductFleetDashboardList = JSON.parse(
          result.data.ListRepresentivesProductFleet
        ).data;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetProductFleetDashboardList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
