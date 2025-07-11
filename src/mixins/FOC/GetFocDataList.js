import { ListFOC } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllFocDataList = {
  methods: {
    async GetAllFocDataListMethod(foc_status, to_date, from_date) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListFOC, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              form_type: "PRODUCT_SALES",
              foc_status: foc_status,
              to_date: to_date,
              from_date: from_date,
              next_token: "",
              limit: 500,
            },
          })
        );
        this.overlay = false;
        return JSON.parse(result.data.ListFOC).data.items;
      } catch (error) {
        this.overlay = false;
      }
    },
  },
};
