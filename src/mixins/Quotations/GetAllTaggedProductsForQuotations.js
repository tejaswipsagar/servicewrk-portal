import { ListTaggedProducts } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetTaggedProduct = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetTaggedProductList: [],
    };
  },
  methods: {
    async GetTaggedProductMethod(customer_id, products) {
      try {
        this.noDataText = "";
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListTaggedProducts, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: customer_id,
              product_id: products,
            },
          })
        );
        this.GetTaggedProductList = JSON.parse(
          result.data.ListTaggedProducts
        ).data.items;
        this.loading = false;
        this.overlay = false;
        console.log("CHECK_FOR_SERVICE_TYPE_ID", this.GetTaggedProductList);
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetTaggedProductList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
