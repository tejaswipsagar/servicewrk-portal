import { ListProductFleetReplacedHistory } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetProductFleetTransHistory = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataText: "",
      ListGetProductFleetTransHistory: [],
    };
  },
  methods: {
    async GetProductFleetTransHistoryMethod(user_id) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListProductFleetReplacedHistory, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: user_id,
            },
          })
        );
        this.ListGetProductFleetTransHistory = JSON.parse(
          result.data.ListProductFleetReplacedHistory
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.ListGetProductFleetTransHistory = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
