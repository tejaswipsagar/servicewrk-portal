import { ListComponentTransactionHistory } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllComponentHistory = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetComponentHistoryList: [],
    };
  },
  methods: {
    async GetComponentHistoryMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListComponentTransactionHistory, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
            },
          })
        );
        this.GetComponentHistoryList = JSON.parse(
          result.data.ListComponentTransactionHistory
        ).data.Items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetComponentHistoryList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
