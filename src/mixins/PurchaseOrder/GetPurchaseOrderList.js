import { ListPurchaseOrder } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const ListAllPurchaseOrderData = {
  data: () => ({
    nextToken: "",
  }),
  methods: {
    async ListAllPurchaseOrderDataMethod(
      STATUS,
      FROM_DATE,
      TO_DATE,
      next_token
    ) {
      try {
        const result = await API.graphql(
          graphqlOperation(ListPurchaseOrder, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              purchase_order_status: STATUS,
              from_date: FROM_DATE,
              to_date: TO_DATE,
              limit: 100,
              next_token: next_token || undefined,
            },
          })
        );

        const response = JSON.parse(result.data.ListPurchaseOrder).data;
        console.log("CHECK_FOR_NEXT_TOKEN", response.next_token);
        if (response.next_token) {
          this.nextToken = response.next_token;
        } else {
          this.nextToken = undefined;
        }
        this.overlay = false;
        return response.items;
      } catch (error) {
        this.overlay = false;
        console.log("Error", error);
      }
    },
  },
};
